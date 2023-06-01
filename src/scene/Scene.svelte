<script>
	import {onMount} from "svelte";
	import {setResizeCallback} from "./scene-helpers.ts";
	import {World} from "../world/world-globals.ts";
	import {debounce} from "ts-debounce";
	import {initScene} from "./scene-init.ts";
	import Score from "../score/Score.svelte";
	import Help from "../help/Help.svelte";
	import Next from "../next/Next.svelte";

	const updateWorldParameters = debounce(_updateWorldParameters, 200);
	let container;

	function _updateWorldParameters() {
		const mainFrame = World.frames.find(f => f.isMain);
		if (!mainFrame) {
			return;
		}
		mainFrame.renderer.setSize(mainFrame.sizeX, mainFrame.sizeY);
		mainFrame.camera.aspect = mainFrame.sizeX / mainFrame.sizeY;
		mainFrame.camera.updateProjectionMatrix()

		console.log(`The main scene resized to ${mainFrame.sizeX}x${mainFrame.sizeY}`);
	}

	onMount(() => {
		container = document.getElementById('scene');

		setResizeCallback(container, (width, height) => {
			const Frame = World.frames.find(f => f.isMain);
			if (!Frame) {
				initScene(container, width, height);
				return;
			}
			Frame.sizeX = width;
			Frame.sizeY = height;

			updateWorldParameters();
		});

		animate();
	});

	function animate() {
		requestAnimationFrame(animate);
		if (!World.light) {
			return;
		}

		World.cube.rotation.x += 0.01;
		World.cube.rotation.y += 0.01;

		World.light.position.z += World.inc;
		if (World.light.position.z > 5) {
			World.inc = -World.inc;
		}
		if (World.light.position.z < -5) {
			World.inc = -World.inc;
		}

		// World.camera.position.z += World.inc;
		// if (World.camera.position.z > 35) {
		// 	World.inc = -World.inc;
		// }
		// if (World.camera.position.z < 15) {
		// 	World.inc = -World.inc;
		// }
		// const mainFrame = World.frames.find(f => f.isMain);

		World.frames.forEach(frame => {
			if (frame.renderer && frame.camera && frame.scene) {
				frame.renderer.render(frame.scene, frame.camera);
			}
		})
		// World.renderers.render(World.scene, World.camera);
	}

	let num = 5;
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

	#scene {
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
	}
</style>

<div id="screen-wrapper">
    <div id="screen-content">
        <div id="left-container">
            <Score text={text}/>
            <Next text="123"/>
        </div>
        <div id="scene-container">
            <div id="scene"></div>
        </div>
    </div>
    <Help/>
</div>
