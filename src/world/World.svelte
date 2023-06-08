<script>
	import Help from "../help/Help.svelte";
	import Text from "../text/Text.svelte";
	import Next from "../next/Next.svelte";
	import Scene from "../scene/Scene.svelte";

	const figs = 'SSS ZZZ II LLL TTT OO JJJ'.split('').filter(s => s !== ' '); // ['S', 'Z', 'I', 'L', 'T', 'O', 'J'];
	let fig = '';
	let v = 0;

	let num = 7;
	let text = 'START';

	setInterval(() => {
		text = '-' + num + '-';
		num += Math.floor(Math.random() * 10);
	}, 5000);

	setInterval(() => {
		fig = figs[Math.floor(Math.random() * figs.length)];
		v++; // for the same figures
	}, 2000);
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

	#side-container {
		position: absolute;
		right: 0;
		top: 30px;
		transform: translateX(100%);
		width: 200px;
		display: flex;
		flex-flow: column nowrap;
		align-items: center;
		padding-top: 40px;
	}

	#help-content {
		margin-top: auto;
		width: 100%;
		display: flex;
		flex-flow: row nowrap;
		height: 100px;
		background: #011218;
		justify-content: center;
		position: relative;
		flex-grow: 0;
		flex-shrink: 0;
		overflow: hidden;
	}

	#help-content:after {
		display: block;
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 36px;
		background: linear-gradient(to bottom, #020b0c, transparent 90%);
	}

	@media screen and (max-width: 768px) {
		#screen-content {
			padding-bottom: 200px;
		}

		#side-container {
			left: 50%;
			right: unset;
			top: 100%;
			transform: translateX(-50%) translateY(-40px);
		}
	}

	@media screen and (max-width: 400px) {
		#help-content {
			display: none;
		}
	}
</style>

<div id="screen-wrapper">
    <div id="screen-content">
        <div id="scene-container">
            <div id="side-container">
                <Next type={fig} rnd={v}/>
                <Text text={text}/>
            </div>
            <Scene/>
        </div>
    </div>
    <div id="help-content">
        <Help/>
    </div>
</div>
