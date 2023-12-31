<script lang="ts">
	import {
		addFigureToField,
		cleanupGameField,
		createGameField,
		fallDown,
		getRandomFigure,
		moveFigureLeft,
		moveFigureRight,
		removeFilledLines,
		rotateFigure
	} from "./game-utils.ts";
	import {durations} from "./game-globals.ts";
	import {TickManager} from "./tick-manager";
	import {onDestroy, onMount} from "svelte";
	import Keys from "../keys/Keys.svelte";
	import Next from "../next/Next.svelte";
	import Text from "../text/Text.svelte";
	import Banner from "./banner/Banner.svelte";
	import Scene from "./scene/Scene.svelte";
	import {Howl} from 'howler';
	import Key from "../keys/single-key/Key.svelte";

	export let onStop;

	let tick = 0;

	let score = 0;
	let level = 1;
	let linesRemovedOnLevel = 0;
	let levelPercent = 0;

	let nextFigure = '';
	let v = 0;

	let tickDuration = getTickDuration(level);
	let isDropDown = false;

	let started = false;
	let paused = false;
	let gameIsOver = false;

	let bannerText = ['TETRIS', 'WEBGL'];

	const GameField = createGameField();

	const tickManager = new TickManager(tickDuration);

	let countDown = 3;
	let countdownHandler;
	let showScene = false;

	let soundEnabled = false;

	const tickSound = new Howl({
		src: ['./sounds/tick.mp3']
	});

	const clickSound = new Howl({
		src: ['./sounds/click.mp3']
	});

	const tadaSound = new Howl({
		src: ['./sounds/tada.mp3']
	});

	const thudSound = new Howl({
		src: ['./sounds/thud.mp3']
	});

	function initGame() {
		cleanupGameField(GameField);

		tick = 0;

		score = 0;
		level = 1;
		linesRemovedOnLevel = 0;
		levelPercent = 0;

		nextFigure = '';
		v = 0;

		started = false;
		paused = false;
		gameIsOver = false;

		bannerText = ['TETRIS', 'WEB GL', '3D'];
		countDown = 3;
		showScene = false;
	}

	onMount(() => {
		document.addEventListener("keydown", processKeysDown);
		document.addEventListener("keyup", processKeysUp);
		startSession();
	});

	onDestroy(() => {
		tickManager.dispose();
		document.removeEventListener("keydown", processKeysDown);
		document.removeEventListener("keyup", processKeysUp);
	});

	function startSession() {
		initGame();

		countdownHandler = setInterval(() => {
			bannerText = ['..[' + countDown + ']..'];
			countDown--;

			if (countDown < 0) {
				clearInterval(countdownHandler);
				bannerText = [];
				showScene = true;
			}
		}, 1000);
	}

	function startNewTurn() {
		if (!nextFigure) {
			// generate first figure
			nextFigure = getRandomFigure(level > 6);
		}

		addFigureToField(GameField, nextFigure);
		nextFigure = getRandomFigure(level > 6);
		v++;

		if (isDropDown) {
			// end drop down
			isDropDown = false;
			setTickDuration();
		}
	}

	function runGame() {
		started = true;
		paused = false;

		startNewTurn();

		setTickDuration();

		tickManager.addTask(processTick, 1); // first - process + redraw
		tickManager.addTask(() => {
				const removed = removeFilledLines(GameField);

				if (removed > 0) {
					score += (removed * removed) * level;
					linesRemovedOnLevel += removed;
                }

				if (linesRemovedOnLevel >= 10) {
					levelPercent = 100;

					if (soundEnabled) {
						tadaSound.play();
					}

					levelUp();
				}

			}, 2
		); // second - remove lines and add score

		tickManager.run();
	}

	function levelUp() {
		level++;
		linesRemovedOnLevel = 0;
		setTickDuration();
	}


	function getTickDuration(gameLevel) {
		return durations[gameLevel - 1] || 50;
	}

	function processTick() {
		const result = fallDown(GameField);

		if (result.hasToRemove && soundEnabled) {
			thudSound.play();
		}

		levelPercent = linesRemovedOnLevel * 10;

		if (result.finished) {
			if (result.stopRow <= 19) {
				startNewTurn();

				if (!result.hasToRemove && soundEnabled) {
					tickSound.play();
				}
			} else {
				gameOver();
			}
		}
		tick++;
	}

	function gameOver() {
		bannerText = [
			'-GAME OVER-',
			score.toString(),
			'SPD.' + level.toString(),
			'-PRESS SPACE-'
		];
		gameIsOver = true;
		started = false;
		tickManager.dispose();
	}

	function processKeysDown(ev) {
		let e = ev.key;
		if (e === ' ') {
			e = 'Space';
		}

		// processing
		if (e === 'Escape') {
			onStop && onStop();
			return;
		}

		if (gameIsOver) {
			if (e === 'Space') {
				startSession();
			}
		}

		if (ev.keyCode === 80) {
			e = 'Pause'; // P
		}

		if (ev.keyCode === 83) {
			e = 'Sound'; // S
		}

		if (e === 'Space') {
			if (!started || paused) {
				return;
			}
			if (soundEnabled) {
				clickSound.play();
			}
			isDropDown = true;
			setTickDuration(5);
			score += 1;
			return;
		}

		if (e === 'ArrowDown') {
			setTickDuration(20);
			processTick();
			tickManager.immediateRestart();
		}

		if (e === 'ArrowLeft') {
			moveLeft();
		}

		if (e === 'ArrowRight') {
			moveRight();
		}

		if (e === 'ArrowUp') {
			rotate();
		}

		if (e === 'Pause') {
			if (!started) {
				return;
			}
			togglePause();
		}
		if (e === 'Sound') {
			toggleSound();
		}
	}

	function toggleSound() {
		soundEnabled = !soundEnabled;
	}

	function moveLeft() {
		if (paused || !started || gameIsOver) {
			return;
		}
		if (soundEnabled) {
			clickSound.play();
		}
		moveFigureLeft(GameField);
		tickManager.immediateRestart();
	}

	function moveRight() {
		if (paused || !started || gameIsOver) {
			return;
		}
		if (soundEnabled) {
			clickSound.play();
		}
		moveFigureRight(GameField);
		tickManager.immediateRestart();
	}

	function rotate() {
		if (paused || !started || gameIsOver) {
			return;
		}

		if (rotateFigure(GameField)) {
			if (soundEnabled) {
				clickSound.play();
			}
			tickManager.immediateRestart()
		}
	}

	function setTickDuration(duration?) {
		tickDuration = duration && duration > 0 ? duration : getTickDuration(level);
		tickManager.updateTickDuration(tickDuration);
	}

	function processKeysUp(ev) {
		if (ev.key === 'ArrowDown') {
			setTickDuration();
			processTick();
		}
	}

	function togglePause() {
		if (tickManager.isPause()) {
			bannerText = [];
			tickManager.setPause(false);
			paused = false;
			tickManager.immediateRestart();
		} else {
			bannerText = ['PAUSE'];
			tickManager.setPause(true);
			tick++;
			paused = true;
		}
	}

	function handleSceneEvents(event) {
		if (event === 'STARTED') {
			runGame();
		}
	}
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
		pointer-events: none;
	}

	#banner-container.inactive {
		opacity: 0;
	}

	#banner-container.paused {
		background: rgba(3, 24, 30, 0.9);
	}

	#banner-container.over {
		background: rgba(30, 18, 3, 0.9);
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

	#sound-switch {
		position: absolute;
		left: -20px;
		top: 40px;
		transform: translateX(-100%);
		width: 20px;
		min-height: 20px;
		display: flex;
		flex-flow: column nowrap;
		align-items: center;
		padding-top: 40px;
		cursor: pointer;
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

	@media screen and (max-width: 980px) {
		#scene-container {
			margin-left: -200px;
		}
	}

	@media screen and (max-width: 768px) {
		#screen-content {
			padding-bottom: 300px;
		}

		#scene-container {
			margin-left: 0;
		}

		#side-container {
			left: 50%;
			right: unset;
			top: 100%;
			padding-left: 0;
			transform: translateX(-50%) translateY(-40px);
		}

		#sound-switch {
			left: 50%;
			top: 100%;
			padding-left: 0;
			transform: translateX(-10px) translateY(-76px) scale(.5);
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
                {#if started}
                    <div id="sound-switch" on:click={toggleSound}>
                        <Key size={80}
                             keyColor={soundEnabled? 0xFFa600 : 0x022326}
                             textColor={soundEnabled? 0x022326 : 0x404040}
                             rotate={false}
                             angle={0}
                             lights={false}
                             symbol="{soundEnabled? 'sound-icon' : 'no-sound-icon'}"/>

                    </div>
                {/if}
                <div id="side-container">
                    <Next type={nextFigure} rnd={v} hideLines={true}/>
                    <Text text="SPEED [{level}]" scale={6} colors={[0x158AD0, 0x057AC0]}/>
                    <div class="stub"></div>
                    <Text text={score.toString()} scale={12} colors={[0x00a6FF, 0xFFa600]}/>
                </div>
                <Scene onEvent={handleSceneEvents}
                       {GameField}
                       {tick}
                       {tickDuration}
                       {levelPercent}
                       {paused}/>
            </div>
        {/if}
    </div>
    <div id="help-content">
        <div id="help">
            <Keys {paused} sound={soundEnabled}/>
        </div>
    </div>
</div>

<div id="banner-container"
     class="{bannerText.length > 0? '': 'inactive'}{paused ? ' paused' : ''}{gameIsOver ? ' over' : ''}">
    <Banner text={bannerText}/>
</div>
