<script>
	import {onMount} from "svelte";
	import {setResizeCallback} from "./scene-helpers.ts";
	import {World} from "../world/world-globals.ts";
	import {debounce} from "ts-debounce";
	import {initScene} from "./scene-init.ts";

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

</script>

<style>
	#scene {
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
	}
</style>

<div id="scene"></div>
