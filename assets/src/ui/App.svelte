<script lang="ts">
  import { nanoid } from 'nanoid/index.prod';

  import { route } from '../logic/route';
  import type { Route } from '../logic/types';

  import Logo from './components/Logo.svelte';
  import ScanPage from './pages/Scan.svelte';
  import ShowPage from './pages/Show.svelte';

  let page: string;
  $: page = ($route as Route).page;

  function startSession() {
    const id = encodeURIComponent(nanoid());
    const key = encodeURIComponent(nanoid());
    const token = encodeURIComponent(nanoid());
    document.location.hash = `id=${id}&key=${key}&token=${token}`;
  }
</script>

<main>
  <Logo></Logo>
  <div class="grow"></div>

  <div class="page">
    {#if page == 'index'}
      <h3>
        Start a session to share live QR Code:<br>
        <button on:click={startSession}>Start session</button>
      </h3>
      <h3>
        Or open some shared link to join as a viewer
      </h3>
    {/if}
    {#if page == 'scan'}
      <ScanPage/>
    {/if}
    {#if page == 'show'}
      <ShowPage/>
    {/if}
  </div>

  <div class="grow"></div>
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
    text-align: center;
  }

  .grow {
    flex-grow: 1;
  }

  .page {
    width: 100%;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    align-items: stretch;
  }

  button {
    display: inline-block;
    padding: 0.2em 1.45em;
    margin: 0.1em;
    border: 0.15em solid #CCCCCC;
    box-sizing: border-box;
    text-decoration: none;
    font-family: 'Segoe UI','Roboto',sans-serif;
    font-weight: 400;
    color: #000000;
    background-color: #CCCCCC;
    text-align: center;
    position: relative;
  }

  button:hover {
    border-color: #7a7a7a;
  }

  button:active {
    background-color: #999999;
  }

  @media all and (max-width:30em){
    button {
      display: block;
      margin: 0.2em auto;
    }
  }
</style>