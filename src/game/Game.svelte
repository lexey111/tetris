<script lang="ts">
	import Help from "../help/Help.svelte";
	import Scene from "./scene/Scene.svelte";
	import {getRandomFigure} from "./game-utils.ts";
	import type {TCell, TGameState} from "./game-globals.ts";
	import {TCellState} from "./game-globals.ts";
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
	const GameField = new Array<Array<TCell>>(26);
	for (let i = 0; i < GameField.length; i++) {
		GameField[i] = new Array(10).fill(undefined);
	}
	// GameField[20] = new Array(10).fill({state: TCellState.Falling});
	GameField[20] = new Array(10).fill({state: TCellState.Falling});
	GameField[20][1] = undefined;
	GameField[21] = new Array(10).fill({state: TCellState.Falling});
	GameField[21][1] = undefined;
	GameField[22] = new Array(10).fill({state: TCellState.Falling});
	GameField[22][1] = undefined;
	GameField[23][1] = {state: TCellState.Falling};
	GameField[24][1] = {state: TCellState.Falling};
	GameField[25][1] = {state: TCellState.Falling};
	GameField[25][4] = {state: TCellState.Falling};

	const tickManager = new TickManager(500);
	onMount(() => {
		//
	});

	onDestroy(() => {
		tickManager.dispose();
	});

	function printGame() {
		for (let i = GameField.length - 1; i >= 0; i--) {
			let s = (i).toString().padStart(2, ' ') + ' ';

			for (let j = 0; j < GameField[i].length; j++) {
				if (!GameField[i][j]) {
					s += '.';
				}
				if (GameField[i][j]?.state === TCellState.Falling) {
					s += '!';
				}
				if (GameField[i][j]?.state === TCellState.Solid) {
					s += '#';
				}
				if (GameField[i][j]?.state === TCellState.MarkedDelete) {
					s += 'x';
				}
			}
			console.log(s);
		}
	}

	function runGame() {
		started = true;
		GameState = 'RUNNING';

		tickManager.addTask(processTick); // first - process

		tickManager.run();
	}

	function processTick() {
		// 1. Remove filled lines
		for (let line = 19; line >= 0; line--) {
			const filled = GameField[line].filter(cell => cell?.state === TCellState.MarkedDelete).length === 10;
			if (!filled) {
				continue;
			}
			console.log('DELETE', line)
			GameField[line] = new Array(10).fill(undefined);

			// move all the rows above down 1 cell
			for (let i = line + 1; i < 20; i++) {
				for (let j = 0; j < 10; j++) {
					if (GameField[i][j]?.state === TCellState.Solid || GameField[i][j]?.state === TCellState.MarkedDelete) {
						GameField[i - 1][j] = GameField[i][j];
						GameField[i][j] = undefined;
					}
				}
			}
		}

		// 2. Move down the falling blocks
		GameField.forEach((line, rowIdx) => {
			line.forEach((cell, colIdx) => {
				// finish unfinished falls from previous stage
				if (GameField[rowIdx][colIdx]) {
					GameField[rowIdx][colIdx].goingToStill = false;
				}
				if (GameField[rowIdx][colIdx]?.state === TCellState.Falling) {
					GameField[rowIdx - 1][colIdx] = GameField[rowIdx][colIdx];
					GameField[rowIdx][colIdx] = undefined;
				}
			});
		});

		// 3. Mark the block solid on the last line
		for (let j = 0; j < 10; j++) {
			if (GameField[0][j]) {
				if (GameField[0][j].state !== TCellState.Solid) {
					GameField[0][j].goingToStill = true;
                }
				GameField[0][j].state = TCellState.Solid;
			}
		}
		// 4. Mark the block solid if the block below is solid
		// TODO: detect for figures!
		for (let i = 20; i >= 0; i--) {
			for (let j = 0; j < 10; j++) {
				if (GameField[i][j]?.state === TCellState.Falling && GameField[i - 1][j]?.state === TCellState.Solid) {

					if (GameField[i][j].state !== TCellState.Solid) {
						GameField[i][j].goingToStill = true;
					}
					GameField[i][j].state = TCellState.Solid;
				}
			}
		}

		GameField.forEach((line, rowIdx) => {
			const filled = line.filter(cell => cell?.state === TCellState.Solid).length === 10;
			if (filled) {
				console.log('Mark: has delete', rowIdx);
				line.forEach((cell, colIdx) => {
					GameField[rowIdx][colIdx].state = TCellState.MarkedDelete;
				});
			}
		});

		// add random cubes
		// GameField[21][Math.floor(Math.random() * 10)] = {
		// 	state: TCellState.Falling
		// };
		//printGame();
        tick++;
	}

	printGame();

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
