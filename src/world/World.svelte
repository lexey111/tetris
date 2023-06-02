<script>
	import Help from "../help/Help.svelte";
	import Score from "../score/Score.svelte";
	import Next from "../next/Next.svelte";
	import Scene from "../scene/Scene.svelte";

	const figs = ['S', 'Z', 'I', 'L', 'T', 'O', 'J'];
	let fig = 'S';

	let num = 7;
	let text = '-' + num + '-';

	setInterval(() => {
		text = '-' + num + '-';
		num += Math.floor(Math.random() * 10);
	}, 1000);

	setInterval(() => {
		fig = figs[Math.floor(Math.random() * figs.length)];
	}, 4000);
</script>

<style>
	#screen-wrapper {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		overflow: hidden;
		display: flex;
		flex-flow: column nowrap;
		align-items: center;
	}

	#screen-content {
		margin: 0 auto;
		flex-grow: 2;
		width: 100%;
		display: flex;
		flex-flow: column nowrap;
	}

	#scene-container {
		width: auto;
		aspect-ratio: 1 / 2;
		height: 100%;
		align-self: center;
		position: relative;
	}

	#left-container {
		position: absolute;
		left: 0;
		top: 0;
		transform: translateX(-100%);
		width: 200px;
		display: flex;
		flex-flow: column nowrap;
		align-items: center;
		padding-top: 40px;
	}

	@media screen and (max-width: 768px) {
		#screen-content {
			padding-bottom: 200px;
		}

		#left-container {
			left: 50%;
			top: 100%;
			padding-top: 20px;
			transform: translateX(-50%);
		}
	}
</style>

<div id="screen-wrapper">
    <div id="screen-content">
        <div id="scene-container">
            <div id="left-container">
                <Next type={fig}/>
                <Score text={text}/>
            </div>
            <Scene/>
        </div>
    </div>
    <Help/>
</div>
