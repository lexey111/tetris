<script lang="ts">
	import WebGL from "three/examples/jsm/capabilities/WebGL";
	import Intro from "./intro/Intro.svelte";
	import World from "./world/World.svelte";

	const isWebGL = WebGL.isWebGLAvailable();

	let intro = true;

	function showGame() {
		console.log('show');
		intro = false;
	}
</script>

<main>
    {#if isWebGL}
        {#if intro}
            <Intro onStart={showGame}/>
        {:else}
            <World/>
        {/if}
    {:else }
        <h1>No WebGL available</h1>
        <p>{WebGL.getWebGLErrorMessage().innerText}</p>
    {/if}
</main>


<style>
	body {
		display: flex;
		flex-flow: column nowrap;
		width: 100%;
		height: 100%;
		overflow: hidden;
	}
</style>
