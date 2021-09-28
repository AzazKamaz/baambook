<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  import { data as datastore, update as commitdata } from '../../logic/socket';
  import { route } from '../../logic/route';
  import { getViewLink, isInPoly, PqrsWorker } from '../../logic/utils';
  import EmptyQr from '../components/EmptyQr.svelte';

  let status: string;
  $: {
    status = $datastore.status;
  }

  let anim: number;
  let streamPromise: Promise<MediaStream>;
  let video: HTMLVideoElement;
  let canvas = document.createElement('canvas');
  let ctx = canvas.getContext('2d');
  let worker = new PqrsWorker();
  let data: string | null = null;

  async function drawFrame() {
    // Safari fix: if using 'autoplay' it starts showing video only after tag switching
    if (video && video.paused && video.readyState >= 2) {
      video.play();
    }

    if (video && !video.paused) {
      const w = video.videoWidth, h = video.videoHeight;
      canvas.width = w;
      canvas.height = h;
      ctx.drawImage(video, 0, 0, w, h);

      const scan = await worker.call(ctx.getImageData(0, 0, w, h));

      let dataNew = null;
      for (let i of scan.qrs) {
        if (isInPoly(
          [w * 0.5, h * 0.5],
          [i.bottom_left, i.top_left, i.top_right, i.bottom_right],
        )) {
          dataNew = i.content;
        }
      }

      if (dataNew !== null && data !== dataNew) {
        data = dataNew;
        commitdata(dataNew);
      }
    }

    anim = requestAnimationFrame(drawFrame);
  }

  onMount(() => {
    if (navigator?.mediaDevices?.getUserMedia) {
      streamPromise = navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      });
    } else {
      streamPromise = new Promise((_, reject) => reject());
    }
    drawFrame();
  });

  onDestroy(() => {
    cancelAnimationFrame(anim);
  });

  function src(node, s) {
    const update = (s) => node.srcObject !== s && (node.srcObject = s);
    update(s);
    return { update };
  }
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
    {:then stream}
      <h3>Aim the center at the QR Code:</h3>
      <video bind:this={video} width="640" height="640" use:src={stream} muted playsinline></video>
    {:catch}
      <EmptyQr text="Camera error"></EmptyQr>
    {/await}
  </div>

  <h3>Status: {status}{#if data}, {#if $datastore.data === data}synced{:else}syncing{/if}{/if}</h3>
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

  .qr > video {
    width: min(100%, 50rem);
    height: auto;
    object-fit: cover;
  }
</style>