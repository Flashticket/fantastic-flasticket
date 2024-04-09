<script lang="ts">
    import { onMount } from 'svelte';
    import QRCode from 'qrcode';
  
    export let text = '';
    export let width = 80;
    export let margin = 2;
    export let colorLight = '#ffffff';
    export let colorDark = '#000000';
    let canvas;
  
    onMount(async () => {
      await QRCode.toCanvas(canvas, text, {
        width: width,
        margin: margin,
        color: {
          dark: colorDark,
          light: colorLight
        }
      });
    });
  </script>
  
  <canvas bind:this={canvas}></canvas>