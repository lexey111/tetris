<script lang="ts">
	import Scene from "./scene/Scene.svelte";
	import WebGL from "three/examples/jsm/capabilities/WebGL";

	const isWebGL = WebGL.isWebGLAvailable();
</script>

<main>
    {#if isWebGL}
        <Scene/>
    {:else }
        <h1>No WebGL available</h1>
        <p>{WebGL.getWebGLErrorMessage().innerText}</p>
    {/if}
    <div id="todo">
        <ul>
            <li>
                relative frames position
            </li>
            <li>
                animation effects
            </li>
            <li>
                fun bg
            </li>
            <li>
                engine
            </li>
            <li>
                sound effects
            </li>
            <li>
                shooting stars
            </li>
        </ul>
    </div>
</main>


<style>
    #todo {
	    position: absolute;
	    bottom: 100px;
	    left: 120px;
    }
</style>
