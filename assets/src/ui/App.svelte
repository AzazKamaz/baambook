<script lang="ts">
  import logo from '../assets/logo.svg';
  import { route } from '../logic/route';
  import { data } from '../logic/socket';

  import ScanPage from './pages/Scan.svelte';
  import ShowPage from './pages/Show.svelte';

  let page: string;
  $: page = $route.page;
</script>

<main>
  <div class="logo" style="background-image: url({logo});"></div>
  <div class="page">
    {#if page == 'index'}
      <h1>Index page</h1>
    {/if}
    {#if page == 'scan'}
      <ScanPage/>
    {/if}
    {#if page == 'show'}
      <ShowPage/>
    {/if}
  </div>
</main>

<style>
  :global(html, body) {
    position: relative;
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    overflow-x: hidden;
  }

  main {
    width: calc(100% - 2*min(1rem, 5vw));
    min-height: calc(100% - 2*min(1rem, 5vw));
    padding: min(1rem, 5vw);
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .logo {
    background-position: center;
    background-size: contain;
    background-repeat: no-repeat;
    width: 90%;
    height: min(3rem, 10vw);
  }

  .page {
    width: 100%;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
</style>