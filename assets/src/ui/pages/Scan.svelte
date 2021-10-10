<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  import { data as datastore, update as commitdata } from '../../logic/socket';
  import { route } from '../../logic/route';
  import { getViewLink, isInPoly, PqrsWorker } from '../../logic/utils';
  import EmptyQr from '../components/EmptyQr.svelte';
  import type { Status } from '../../logic/types';
  import type { ScannedQr } from 'pqrs-js';

  let streamPromise: Promise<MediaStream>;
  let scan_anim: number;
  let scan_canv = document.createElement('canvas');
  let scan_ctx = scan_canv.getContext('2d');
  let show_anim: number;
  let show_canv: HTMLCanvasElement;
  let show_ctx: CanvasRenderingContext2D;
  let worker: PqrsWorker;
  let scanned: ScannedQr | null = null;

  let video: HTMLVideoElement = document.createElement("video");
  video.setAttribute("muted", "true");
  video.setAttribute("playsinline", "true");

  let status: string;
  let synced: boolean;
  $: {
    status = ($datastore as Status).status;
    synced = ($datastore as Status).data === scanned?.content;
  }
  $: show_ctx = show_canv?.getContext('2d');

  async function scanFrame() {
    // Safari fix: if using 'autoplay' it starts showing video only after tag switching
    if (video.paused && video.readyState >= 2) {
      video.play();
    }

    if (scan_ctx && !video.paused) {
      const w = video.videoWidth, h = video.videoHeight;
      scan_canv.width = w;
      scan_canv.height = h;
      scan_ctx.drawImage(video, 0, 0, w, h);

      const scan = await worker.call(scan_ctx.getImageData(0, 0, w, h));

      let newScanned: ScannedQr = null;
      for (let i of scan.qrs) {
        if (isInPoly(
          [w * 0.5, h * 0.5],
          [i.bottom_left, i.top_left, i.top_right, i.bottom_right],
        )) {
          newScanned = i;
        }
      }

      if (newScanned !== null) {
        if (scanned?.content !== newScanned.content) {
          commitdata(newScanned.content);
        }
        scanned = newScanned;
      }
    }

    scan_anim = requestAnimationFrame(scanFrame as () => void);
  }

  function showFrame() {
    if (show_ctx && !video.paused) {
      const w = video.videoWidth, h = video.videoHeight;
      if (w / h > 4 / 3) {
        show_canv.width = Math.round(h * 4 / 3);
        show_canv.height = h;
        show_ctx.setTransform(1, 0, 0, 1, -(w - h * 4 / 3) / 2, 0);
      } else if (h / w > 4 / 3) {
        show_canv.width = w;
        show_canv.height = Math.round(w * 4 / 3);
        show_ctx.setTransform(1, 0, 0, 1, 0, -(h - w * 4 / 3) / 2);
      } else {
        show_canv.width = w;
        show_canv.height = h;
        show_ctx.resetTransform();
      }
      show_ctx.drawImage(video, 0, 0, w, h);

      const s = Math.min(w, h) * 0.75;

      show_ctx.beginPath();
      show_ctx.rect(0.5 * (w - s), 0.5 * (h - s), s, s);
      show_ctx.rect(0, 0, w, h);

      show_ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
      show_ctx.fill("evenodd");

      show_ctx.strokeStyle = "white";
      show_ctx.lineWidth = 4;
      show_ctx.stroke();

      if (scanned) {
        show_ctx.beginPath();
        show_ctx.moveTo(...scanned.bottom_left);
        show_ctx.lineTo(...scanned.top_left);
        show_ctx.lineTo(...scanned.top_right);
        show_ctx.lineTo(...scanned.bottom_right);
        show_ctx.closePath();

        show_ctx.fillStyle = "rgba(0, 255, 0, 0.1)";
        show_ctx.fill();

        show_ctx.strokeStyle = "green";
        show_ctx.lineWidth = 4;
        show_ctx.stroke();
      }
    }

    show_anim = requestAnimationFrame(showFrame as () => void);
  }

  onMount(() => {
    worker = new PqrsWorker();

    if (navigator?.mediaDevices?.getUserMedia) {
      streamPromise = navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1920 },
          height: { ideal: 1440 },
        },
      });
    } else {
      streamPromise = new Promise((_, reject) => reject('No mediaDevices.getUserMedia'));
    }

    streamPromise.then((stream) => video.srcObject = stream, console.error);

    scanFrame();
    showFrame();
  });

  onDestroy(() => {
    cancelAnimationFrame(scan_anim);
    cancelAnimationFrame(show_anim);

    worker.terminate();
  });
</script>

<main>
  <h3>
    Share <a href={getViewLink($route)}>this link</a> with viewers
    <br>
    Save this page link to restart session
  </h3>

  <div class="qr">
    {#await streamPromise}
      <EmptyQr text="Loading camera"></EmptyQr>
    {:then _stream}
      <h3>Aim the center at the QR Code:</h3>
      <canvas bind:this={show_canv}></canvas>
    {:catch}
      <EmptyQr text="Camera error"></EmptyQr>
    {/await}
  </div>

  <h3>Status: {status}{#if scanned}, {#if synced}synced{:else}syncing{/if}{/if}</h3>
</main>

<style>
  main {
    display: contents;
  }

  .qr {
    display: flex;
    flex-direction: column;
    align-items: center;

    width: 100%;
    position: relative;
    margin: 2rem 0;
  }

  .qr > canvas {
    width: min(100%, 50rem);
    height: auto;
    max-height: 70vh;
    object-fit: contain;
  }
</style>