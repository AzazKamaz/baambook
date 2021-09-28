<script lang="ts">
  import { data as datastore } from '../../logic/socket';
  import { qr64 } from '../../logic/utils';

  let status: string;
  let data: string | null;
  let qr = qr64();
  $: {
    status = $datastore.status;
    data = $datastore.data;
    qr = qr64(data);
  }
</script>

<main>
  <div class="qr">
    <svg viewBox={qr.viewBox} opacity={data ? 1 : 0.3}>
      <title>{data}</title>
      <path d={qr.path} fill-rule="evenodd"></path>
    </svg>
    {#if data === null || data === undefined}
      <span>No data yet</span>
    {/if}
  </div>

  <h3>Status: {status}</h3>
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

  .qr > svg {
    width: min(100%, 30rem);
    height: auto;
  }

  .qr > span {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-transform: uppercase;
    font-size: 1.5rem;
  }
</style>