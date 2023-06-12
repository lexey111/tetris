<script lang="ts">
	import Help from "../help/Help.svelte";
	import Text from "../text/Text.svelte";
	import Next from "../next/Next.svelte";
	import Scene from "./scene/Scene.svelte";
	import {getRandomFigure} from "./game-utils.ts";
	import type {TGameState} from "./game-globals.ts";
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
	const GameField = new Array(24);
	for (let i = 0; i < 24; i++) {
		GameField[i] = new Array(10).fill(TCellState.Empty);
	}

	const tickManager = new TickManager(250);
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
				if (GameField[i][j] === 0) {
					s += '.';
				} else {
					s += '#';
				}
			}
			console.log(s);
		}
	}

	function runGame() {
		started = true;
		GameState = 'RUNNING';

		tickManager.addTask(markItemsToAnimate, 1);
		tickManager.addTask(processTick, 2);
		tickManager.run();
	}

	function processTick() {
		let moved = false;
		// 1. Remove marked to delete
		GameField.forEach((line, rowIdx) => {
			line.forEach((cell, colIdx) => {
				if (GameField[rowIdx][colIdx] === TCellState.MarkedDelete) {
					// line which is marked to delete
					GameField[rowIdx][colIdx] = TCellState.Empty;
					moved = true;
					return;
				}
			});
		});

		// 2. Move down the rest
		GameField.forEach((line, rowIdx) => {

			line.forEach((cell, colIdx) => {
				if (rowIdx === 0 && GameField[0][colIdx] === TCellState.MarkedFalling) {
					GameField[0][colIdx] = TCellState.Solid;
				}
				if (rowIdx === 0) {
					return; // nothing to do with the lowest line
				}
				if (cell === TCellState.Empty) {
					return; // empty cell
				}
				if (GameField[rowIdx - 1][colIdx] === TCellState.Empty) {
					//space to move
					GameField[rowIdx - 1][colIdx] = cell;
					GameField[rowIdx][colIdx] = TCellState.Empty;
					moved = true;
				} else {
					GameField[rowIdx][colIdx] = TCellState.Solid;
				}
			});
		});

		const randomX = Math.floor(Math.random() * 10);
		const randomY = Math.floor(Math.random() * 5) + 15;
		if (GameField[randomY][randomX] === TCellState.Empty) {
			GameField[randomY][randomX] = TCellState.MarkedFalling;
		}

		if (moved) {
			//tick++;
		}
	}

	function markItemsToAnimate() {
		let hasFull = false;
		let hasFalling = false;

		// Find falling cells and mark them to fall
		GameField.forEach((line, rowIdx) => {
			line.forEach((cell, colIdx) => {
				if (cell === TCellState.Empty) {
					return; // empty or animated already cell
				}

				if (rowIdx === 0 && GameField[0][colIdx] === TCellState.MarkedFalling) {
					// GameField[0][colIdx] = TCellState.Solid;
					return;
				}

				if (rowIdx === 0) {
					return; // nothing to do with the lowest line
				}

				if (GameField[rowIdx - 1][colIdx] === TCellState.Empty || GameField[rowIdx - 1][colIdx] === TCellState.MarkedFalling) {
					// has space to move
					GameField[rowIdx][colIdx] = TCellState.MarkedFalling;
					hasFalling = true;
				} else {
					GameField[rowIdx][colIdx] = TCellState.Solid;
				}
			});
		});

		// Find filled lines and mark them to delete
		GameField.forEach((line, rowIdx) => {
			const filled = line.filter(cell => cell === TCellState.Solid);
			if (filled.length === line.length) {
				hasFull = true;
				console.log('1 has delete')
				line.forEach((cell, colIdx) => {
					GameField[rowIdx][colIdx] = TCellState.MarkedDelete;
				});
			}
		});

		if (hasFull || hasFalling) {
			tick++;
		}
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
                <div id="side-container">
                    <Next type={fig} rnd={v}/>
                    <Text text={text}/>
                </div>
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
