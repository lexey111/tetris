<script lang="ts">
	//
	import Scene from "../scene/Scene.svelte";
</script>

<style>
	#intro {
		--top-line-color: #08313f;
		--right-line-color: maroon;
	}

	#intro {
		position: absolute;
		top: 100px;
		left: 20px;
		right: 20px;
		bottom: 100px;

		display: flex;
		flex-flow: row nowrap;
		background-color: transparent;
	}

	#intro h1 {
		font-size: 8rem;
		color: rgba(255, 255, 255, .05);
	}

	#intro #layer-2 {
		width: 50vw;
		flex-grow: 2;
	}

	#layer-2 {
		background: linear-gradient(to top left, #011218, #08313f);
	}

	#layer-2 h1 {
		font-size: 18vw;
		font-weight: bold;
		display: flex;
		align-self: center;
		margin: 0;
		padding: 0;
		line-height: 1;
		transform: skewX(-10deg);
	}

	#layer-2 h2 {
		color: rgba(255, 255, 255, .02);
		font-size: 30vw;
		display: flex;
		align-self: center;
		margin: 0;
		padding: 0;
		line-height: 1;
		transform: skewX(-10deg);
	}


	#layer-1, #layer-2, #layer-3 {
		clip-path: polygon(0% 0%, calc(100% - 40px) 40px, 100% 0%, 100% calc(100% - 40px), 0 calc(100% - 80px), 0% 0%);
		border-radius: 6px;
		box-shadow: inset 0 -2px 2px rgba(255, 255, 255, 0.5);
		width: 25vw;
		display: flex;
		flex-flow: column nowrap;
		align-content: center;
		justify-content: center;
		position: relative;
	}

	#layer-2 {
		clip-path: polygon(0% 0%, calc(100% - 40px) 40px, 100% 0%, 100% calc(100% - 80px), 0 calc(100% - 40px), 0% 0%);
	}

	#layer-1:after, #layer-2:after, #layer-3:after {
		content: '';
		display: block;
		position: absolute;
		top: 0;
		bottom: 0;
		right: 0;
		width: 44px;
		background-color: rgba(0, 0, 0, .3);
		clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 0%);
		border-top-right-radius: 6px;
	}

	#layer-1 {
		background: linear-gradient(to bottom right, #ffa600, #653d02);
		border-top-left-radius: 26px;
	}

	#layer-2 {
		background: linear-gradient(to bottom right, #0095ff, #0260a2);
	}

	#layer-3 {
		background: linear-gradient(to bottom right, #ddff00, #687704);
		border-top-right-radius: 26px;
	}

</style>

<div id="intro">
    <div id="layer-1">
        <h1>First</h1>
    </div>
    <div id="layer-2">
        <h1>TETRIS</h1>
        <h2>3D</h2>
        <Scene/>
    </div>
    <div id="layer-3">
        <h1>Third</h1>
        <p>
            &copy; 2023 Oleksii Koshkin
        </p>
    </div>
</div>
