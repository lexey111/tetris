<script lang="ts">
	import {fallDown, getRandomFigure, removeFilledLines} from "./game-utils.ts";
	import type {TCell} from "./game-globals.ts";
	import {TickManager} from "./tick-manager";
	import {onDestroy, onMount} from "svelte";
	import Keys from "../keys/Keys.svelte";
	import Next from "../next/Next.svelte";
	import Text from "../text/Text.svelte";
	import Banner from "./banner/Banner.svelte";
	import Scene from "./scene/Scene.svelte";

	export let onStop;

	let tick = 0; // each turn (after recalc field)
	let tack = 0; // just force redraw

	let fig = '';
	let v = 0;

	let score = 0;
	let scoreText = '0';
	let level = 1;
	let removedOnLevel = 0;

	let tickDuration = 400;

	let started = false;
	let paused = false;
	let bannerText = '';

	// Game field has dimensions 10x(20+4)
	// where 20 is vertical space (field) and 4 is a space for new figure
	const GameField = new Array<Array<TCell>>(27);
	for (let i = 0; i < GameField.length; i++) {
		GameField[i] = new Array(10).fill(undefined);
	}

	const tickManager = new TickManager(tickDuration);
	onMount(() => {
		document.addEventListener("keydown", processKeys);
		startSession();
	});

	onDestroy(() => {
		tickManager.dispose();
		document.removeEventListener("keydown", processKeys);
	});

	let countDown = 3;
	let coundownHandler;
	let showScene = false;

	function startSession() {
		coundownHandler = setInterval(() => {
			bannerText = '..[' + countDown + ']..';
			countDown--;

			if (countDown < 0) {
				clearInterval(coundownHandler);
				bannerText = '';
				showScene = true;
			}
		}, 1000);
	}


	function runGame() {
		started = true;
		paused = false;

		tickManager.addTask(processTick, 1); // first - process + redraw

		tickManager.addTask(() => {
				const removed = removeFilledLines(GameField);

				if (removed > 0) {
					score += removed * level;
					removedOnLevel += removed;

					scoreText = score.toString();
				}

				if (removedOnLevel >= 10) {
					levelUp();
				}
			}, 2
		); // second - remove lines and add score

		tickManager.run();
	}

	function levelUp() {
		level++;
		removedOnLevel = 0;
		tickDuration -= level < 3
			? 100
            : level < 7
                ? 50
                : 20;

		if (tickDuration < 50) {
			tickDuration = 50;
		}

		tickManager.updateTickDuration(tickDuration);
	}

	function processTick() {
		fallDown(GameField);

		// add random cubes
		GameField[21][Math.floor(Math.random() * 10)] = {
			falling: true
		};
		tick++;
	}

	function processKeys(ev) {
		let e = ev.key;
		if (e === ' ') {
			e = 'Space';
		}
		if (ev.keyCode === 80) {
			e = 'Pause'; // P
		}

		if (e === 'Escape') {
			onStop && onStop();
		}

		if (e === 'Pause') {
			if (!started) {
				return;
			}
			togglePause();
		}
	}

	function togglePause() {
		if (tickManager.isPause()) {
			bannerText = '';
			tickManager.setPause(false);

			paused = false;
		} else {
			bannerText = 'PAUSE';
			tickManager.setPause(true);

			paused = true;
			fallDown(GameField);
			tick++;
		}
	}

	function handleSceneEvents(event) {
		console.log('event', event);
		if (event === 'STARTED') {
			runGame();
		}
		// tick += 1;
	}

	setInterval(() => {
		fig = getRandomFigure(true);
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

	#banner-container {
		position: absolute;
		top: 0;
		left: 0;
		height: calc(100vh - 100px);
		width: 100vw;
		background: rgba(0, 0, 0, 0.5);
		z-index: 10;
		opacity: 1;
		transition: all .5s ease;
	}

	#banner-container.inactive {
		opacity: 0;
	}

	#banner-container.paused {
		background: rgba(3, 24, 30, 0.9);
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
		right: -20px;
		top: 30px;
		transform: translateX(100%);
		width: 240px;
		display: flex;
		flex-flow: column nowrap;
		align-items: center;
		padding-top: 40px;
	}

	#side-container .stub {
		height: 30px;
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

	#help {
		display: flex;
		flex-flow: row nowrap;
		align-items: center;
		justify-content: center;
		max-width: 80%;
		min-width: 960px;
		overflow: hidden;
		height: 100%;
	}

	@media screen and (max-width: 768px) {
		#screen-content {
			padding-bottom: 200px;
		}

		#side-container {
			left: 50%;
			right: unset;
			top: 100%;
			padding-left: 0;
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
        {#if showScene}
            <div id="scene-container">
                <div id="side-container">
                    <Next type={fig} rnd={v} hideLines={true}/>
                    <Text text="SPEED [{level}]" scale={6} colors={[0xFAA600,0x855d22]}/>
                    <div class="stub"></div>
                    <Text text={scoreText} scale={12}/>
                </div>
                <Scene onEvent={handleSceneEvents}
                       field={GameField}
                       {tick}
                       {tack}
                       {tickDuration}
                       {started}
                       {paused}/>
            </div>
        {/if}
    </div>
    <div id="help-content">
        <div id="help">
            <Keys paused={paused}/>
        </div>
    </div>
</div>

<div id="banner-container" class="{bannerText? '': 'inactive'}{paused ? ' paused' : ''}">
    <Banner text={bannerText}/>
</div>
