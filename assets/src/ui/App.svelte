<script lang="ts">
  import { route } from '../logic/route';

  import Logo from './components/Logo.svelte';
  import ScanPage from './pages/Scan.svelte';
  import ShowPage from './pages/Show.svelte';

  let page: string;
  $: page = $route.page;
</script>

<main>
  <Logo></Logo>
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
    overflow-y: scroll;
  }

  :global(body) {
    display: flex;
    flex-direction: column;
    align-items: stretch;
  }

  main {
    flex-grow: 1;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .page {
    width: 100%;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    align-items: stretch;
  }
</style>