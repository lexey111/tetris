<script lang="ts">
	import WebGL from "three/examples/jsm/capabilities/WebGL";
	import World from "./world/World.svelte";

	const isWebGL = WebGL.isWebGLAvailable();
</script>

<main>
    {#if isWebGL}
        <World/>
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
