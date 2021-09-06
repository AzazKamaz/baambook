<script lang="ts">
  import { data as datastore } from '../../logic/socket';
  import { qr64 } from '../../logic/utils';

  let status: string;
  let data: string | null;
  let qr: string = qr64();
  $: {
    status = $datastore.status;
    data = $datastore.data;
    qr = qr64(data);
  }
</script>

<main>
  <div class="grow"></div>

  <!-- <h2>Show page</h1> -->

  <div class="qr">
    <img src={qr} style="opacity: {data ? 1 : 0.3}" alt={data}/>
    {#if data === null}
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
    text-align: center;
    width: 100%;
    /* display: contents; */
    /* width: min(100%, 30rem); */
    /* height: 100%; */
    /* background-position: center; */
    /* background-size: contain; */
    /* background-repeat: no-repeat; */
  }

  .qr > img {
    width: min(100%, 30rem);
    height: auto;
  }

  .qr > span {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-transform: uppercase;
    font-size: 2em;
  }
</style>