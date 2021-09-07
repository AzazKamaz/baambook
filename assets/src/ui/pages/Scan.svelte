<script lang="ts">
  import { data as datastore, update as commitdata } from '../../logic/socket';
  import { qr64 } from '../../logic/utils';

  let status: string;
  let data: string | null;
  let qr: string;
  $: {
    status = $datastore.status;
    data = $datastore.data;// || 'kokosovoe moloko';
    qr = qr64(data);
  }

  function update() {
    commitdata((Math.random() + 1).toString(36));
  }

  const wind = window as any;
</script>

<main>
  <div class="grow"></div>

  <!-- <h2>Show page</h1> -->

  <button on:click={update} bind:this={wind.btn}>Update</button>
  
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
</style>