<script lang="ts">
	import Help from "../help/Help.svelte";
	import Scene from "./scene/Scene.svelte";
	import {fallDown, getRandomFigure, removeFilledLines} from "./game-utils.ts";
	import type {TCell, TGameState} from "./game-globals.ts";
	import {TickManager} from "./tick-manager";
	import {onDestroy, onMount} from "svelte";

	let GameState: TGameState = 'PRE-START';
	let tick = 0; // force redraw

	let fig = '';
	let v = 0;

	let num = 7;
	let text = 'START';

	let started = false;

	// Game field has dimensions 10x(20+4)
	// where 20 is vertical space (field) and 4 is a space for new figure
	const GameField = new Array<Array<TCell>>(27);
	for (let i = 0; i < GameField.length; i++) {
		GameField[i] = new Array(10).fill(undefined);
	}
	GameField[20] = new Array(10).fill({falling: true});

	// GameField[20] = new Array(10).fill({falling: true});
	// GameField[21] = new Array(10).fill({falling: true});
	// GameField[22] = new Array(10).fill({falling: true});
    //
	// GameField[20][1] = undefined;
	// //GameField[20][0] = undefined;
    //
	// GameField[21][1] = undefined;
	// // GameField[21][0] = undefined;
    //
	// GameField[22][1] = undefined;
	// //
	// GameField[24][1] = {falling: true};
	// GameField[25][1] = {falling: true};
	// GameField[26][1] = {falling: true};
    //
	GameField[25][4] = {falling: true};

	const tickManager = new TickManager(250);
	onMount(() => {
		//
	});

	onDestroy(() => {
		tickManager.dispose();
	});


	function runGame() {
		started = true;
		GameState = 'RUNNING';

		tickManager.addTask(processTick1, 1); // first - process
		tickManager.addTask(processTick2, 2); // second - remove lines

		tickManager.run();
	}

	function processTick1() {

		fallDown(GameField);
		// removeFilledLines(GameField);

		// add random cubes
		GameField[21][Math.floor(Math.random() * 10)] = {
			falling: true
		};

		// printGame(GameField);
		tick++;
	}

	function processTick2() {
		// fallDown(GameField);
		removeFilledLines(GameField);
		//tick++;
	}


	function handleSceneEvents(event) {
		console.log('event', event);
		if (event === 'STARTED') {
			runGame();
		}
		// tick += 1;
	}

	setInterval(() => {
		text = '-' + num + '-';
		num += Math.floor(Math.random() * 10);
	}, 5000);

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
            {#if started}
                <!--                <div id="side-container">-->
                <!--                    <Next type={fig} rnd={v}/>-->
                <!--                    <Text text={text}/>-->
                <!--                </div>-->
            {/if}
            <Scene onEvent={handleSceneEvents} field={GameField} tick={tick}/>
        </div>
    </div>
    <div id="help-content">
        {#if started}
            <Help/>
        {/if}
    </div>
</div>
