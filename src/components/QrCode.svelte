<script lang="ts">
    import { onMount } from 'svelte';
    import QRCode from 'qrcode';
  
    export let text;
    let canvas;
  
    onMount(async () => {
      await QRCode.toCanvas(canvas, text, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      });
    });
  </script>
  
  <canvas bind:this={canvas}></canvas>