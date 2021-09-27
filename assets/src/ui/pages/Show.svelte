<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  import { data as datastore } from '../../logic/socket';
  import { qr64 } from '../../logic/utils';

  let status: string;
  let data: string | null;
  let qr = qr64();
  let anim: number;
  let canvHeight: number = 128;
  let canv: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;
  $: {
    status = $datastore.status;
    data = $datastore.data;
    qr = qr64(data);
  }

  function drawFrame() {
    anim = requestAnimationFrame(drawFrame, canv);

    const width = qr.viewBox[2], height = qr.viewBox[3];
    const dpr = devicePixelRatio || 1;
    const size = canv.getBoundingClientRect();
    canvHeight = size.width;
    canv.width = Math.ceil(size.width * dpr / width) * width;
    canv.height = Math.ceil(size.height * dpr / height) * height;

    ctx.resetTransform();
    ctx.scale(canv.width / width, canv.height / height);
    ctx.translate(-qr.viewBox[0], -qr.viewBox[1]);

    ctx.clearRect(...qr.viewBox);
    ctx.globalAlpha = data ? 1 : 0.3;
    ctx.fill(new Path2D(qr.path), "evenodd");
  }

	onMount(() => {
    ctx = canv?.getContext("2d");
    drawFrame();
	});

  onDestroy(() => {
    cancelAnimationFrame(anim);
  });
</script>

<main>
  <div class="grow"></div>

  <div class="qr">
    <canvas bind:this={canv} style="height: {canvHeight}px"></canvas>
    {#if data === null || data === undefined}
      <span>No data yet</span>
    {/if}
  </div>

  <h3>Status: {status}</h3>

  <div class="grow"></div>
</main>

<style>
  main {
    display: contents;
  }

  .grow {
    flex-grow: 1;
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
    width: min(100%, 30rem);
  }

  .qr > span {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-transform: uppercase;
    font-size: 1.5rem;
  }

  h3 {
    text-align: center;
  }
</style>