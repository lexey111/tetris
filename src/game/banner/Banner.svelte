<script lang="ts">
	import Text from "../../text/Text.svelte";
	import {onDestroy, onMount} from "svelte";
	import {setResizeCallback} from "../scene/scene-helpers";

	export let textLine1 = ''
	export let textLine2 = ''

	let canvas;
	let sizeTimeout;
	let letterScale = 16;

	onMount(() => {
		setResizeCallback(canvas, (width, height) => {
			clearTimeout(sizeTimeout);

			sizeTimeout = setTimeout(() => {
				console.log(width)
				if (width < 200) {
					console.log('set 8')
					letterScale = 8;
				} else {
					console.log('set 16')
					letterScale = 16;
				}
			}, 100);
		});
	});
	onDestroy(() => {
		clearTimeout(sizeTimeout);
	});

</script>

<style>
	#banner {
		display: flex;
		flex-flow: column wrap;
		align-items: center;
		align-content: center;
		justify-content: center;
		padding: 40px 80px;
        margin: 0 20px;
		background: linear-gradient(to bottom, rgba(51, 66, 81, .7), rgba(44, 57, 71, .9));
        border-radius: 4px;
        backdrop-filter: blur(10px);
	}

	:global(.bottom-margin) {
		margin-bottom: 20px;
	}
</style>

<div id="banner" bind:this={canvas}>
    {#if textLine1}
        <Text scale={letterScale} text={textLine1.toUpperCase()} colors={[0xCCCCCC,, 0x888888]} className="bottom-margin"/>
    {/if}
    {#if textLine2}
        <Text scale={letterScale - 2} text={textLine2.toUpperCase()}/>
    {/if}
</div>
