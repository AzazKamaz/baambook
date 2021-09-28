<script lang="ts">
  function gotoIndex() {
    document.location.href = '#';
  }
</script>

<main>
  <button on:click={gotoIndex}><sup>(ue)</sup>baam<span>book</span></button>
</main>

<style>
  @font-face {
    font-family: 'Noto Sans Display';
    font-style: normal;
    font-weight: 200;
    font-stretch: normal;
    font-display: swap;
    src: url(logo200.woff) format('woff');
  }

  @font-face {
    font-family: 'Noto Sans Display';
    font-style: normal;
    font-weight: 500;
    font-stretch: normal;
    font-display: swap;
    src: url(logo500.woff) format('woff');
  }

  main {
    text-align: center;
    font-family: 'Noto Sans Display', sans-serif;
    font-weight: 500;
    font-size: min(4rem, 10vw);
    width: 90%;
    height: 1em;
    line-height: 1em;
  }

  span {
    font-weight: 200;
  }

  sup {
    font-weight: 200;
    vertical-align: super;
    font-size: calc(min(3rem, 10vw) * 0.5);
  }
</style>