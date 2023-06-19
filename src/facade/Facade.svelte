<script lang="ts">
	import Next from "../next/Next.svelte";
	import {onDestroy, onMount} from "svelte";

	export let onStop;

	const figs = 'tetris'.split('');
	let fig = 's';
	let figPosition = 0;
	let v = 0;

	let fallingHandler;

	onMount(() => {

		fallingHandler = setInterval(() => {
			fig = figs[figPosition++];
			if (figPosition === figs.length) {
				figPosition = 0;
			}
			v++;
		}, 3000);

	});

	onDestroy(() => {
		clearInterval(fallingHandler);
	});

</script>

<style>
	#facade {
		display: flex;
		flex-flow: column wrap;
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		align-content: center;
		align-items: center;
		justify-content: center;
		justify-items: center;
		color: #911959;
	}

    #next {
	    position: relative;
    }

</style>

<div id="facade" on:click={onStop}>
    <div id="next">
        <Next accent={'#FF0088'} type={fig} rnd={v} scale={100}/>
    </div>
    <div>click to return</div>
</div>
