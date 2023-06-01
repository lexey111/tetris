<script>
	import Score from "../score/Score.svelte";
	import Help from "../help/Help.svelte";
	import Next from "../next/Next.svelte";
	import Scene from "../scene/Scene.svelte";

	let num = 7;
	let text = '-' + num + '-';

	setInterval(() => {
		text = '-' + num + '-';
		num += 10;
	}, 1000);
</script>

<style>
	#screen-wrapper {
		width: 100vw;
		height: 100vh;
		overflow: hidden;
		display: flex;
		flex-flow: column nowrap;
	}

	#screen-content {
		display: flex;
		flex-flow: row nowrap;
		max-width: 80%;
		min-width: 960px;
		height: 100%;
		margin: 0 auto;
	}

	#left-container {
		flex-shrink: 0;
		flex-grow: 0;
		width: 200px;
		display: flex;
		flex-flow: column nowrap;
		align-items: center;
		padding-top: 40px;
	}

	#scene-container {
		flex-shrink: 1;
		flex-grow: 2;
		display: flex;
		position: relative;
        border: 2px solid yellow;
	}
</style>

<div id="screen-wrapper">
    <div id="screen-content">
        <div id="left-container">
            <Score text={text}/>
            <Next text="123"/>
        </div>
        <div id="scene-container">
            <Scene/>
        </div>
    </div>
    <Help/>
</div>
