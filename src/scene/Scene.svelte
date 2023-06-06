<script>
	import {onMount} from "svelte";
	import {World} from "../world/world-globals.ts";
	import {initScene} from "./scene-init.ts";
	import {setResizeCallback} from "./scene-helpers.ts";

	let container;

	function updateWorldParameters() {
		const mainFrame = World.frames.find(f => f.isMain);
		if (!mainFrame) {
			return;
		}
		mainFrame.sizeX = container.offsetWidth;
		mainFrame.sizeY = container.offsetHeight;

		mainFrame.renderer.setSize(mainFrame.sizeX, mainFrame.sizeY);
		mainFrame.camera.aspect = mainFrame.sizeX / mainFrame.sizeY;
		mainFrame.camera.updateProjectionMatrix()

		console.log(`The main scene resized to ${mainFrame.sizeX}x${mainFrame.sizeY}`);
	}

	onMount(() => {
		container = document.getElementById('scene-container');
		initScene(container, container.offsetWidth, container.offsetHeight);
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

	let rInc = 0.05;
	let xInc = 0.01;
	function animate() {
		requestAnimationFrame(animate);
		if (!World.light) {
			return;
		}

		World.cube.rotation.x += 0.01;
		World.cube.rotation.y += 0.02;
		World.cube.rotation.z -= 0.05;

		World.cube.position.y += rInc;
		if (World.cube.position.y > 15 || World.cube.position.y < 4) {
			rInc = -rInc;
		}

		World.cube.position.x += xInc;
		if (World.cube.position.x > 5.5 || World.cube.position.x < 3.5) {
			xInc = -xInc;
		}
		// World.light.position.z += World.inc;
		// if (World.light.position.z > 15) {
		// 	World.inc = -World.inc;
		// }
		// if (World.light.position.z < -15) {
		// 	World.inc = -World.inc;
		// }
		// const mainFrame = World.frames.find(f => f.isMain);
		// mainFrame.camera.position.z += World.inc;
		// if (mainFrame.camera.position.z > 5) {
		// 	mainFrame.inc = -World.inc;
		// }
		// if (mainFrame.camera.position.z < 5) {
		// 	mainFrame.inc = -World.inc;
		// }

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
