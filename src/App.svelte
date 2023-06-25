<script lang="ts">
	import WebGL from "three/examples/jsm/capabilities/WebGL";
	import Intro from "./intro/Intro.svelte";
	import Game from "./game/Game.svelte";
	import Facade from "./facade/Facade.svelte";

	const isWebGL = WebGL.isWebGLAvailable();

	let mode: 'intro' | 'game' | 'facade' = 'intro';
	let fadeOut = false;

	function showGame() {
		fadeOut = true;
		setTimeout(() => {
			mode = 'game';
			fadeOut = false;
		}, 1000);
	}

	function showIntro() {
		mode = 'intro';
	}

	function showFacade() {
		fadeOut = true;
		setTimeout(() => {
			mode = 'facade';
			fadeOut = false;
		}, 1000);
	}
</script>

<main>
    {#if isWebGL}
        {#if (mode === 'intro')}
            <Intro onStart={showGame}
                   {fadeOut}
                   onImageFacade={showFacade}/>
        {/if}

        {#if (mode === 'game')}
            <Game onStop={showIntro}/>
        {/if}

        {#if (mode === 'facade')}
            <Facade onStop={showIntro}/>
        {/if}
    {:else }
        <h1>No WebGL available</h1>
        <p>{WebGL.getWebGLErrorMessage().innerText}</p>
    {/if}
</main>
