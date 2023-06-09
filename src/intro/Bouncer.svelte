<script lang="ts">
	import {onDestroy, onMount} from "svelte";
	import * as THREE from "three";
	import type {TThreeFrame} from "../world/world-globals";
	import {createCube} from "../figures/figures-utils";
	import {addLights} from "../scene/scene-lights";
	import {setResizeCallback} from "../scene/scene-helpers";

	let Frame: TThreeFrame;
	let canvas;
	let animationReq;
	let cube;

	onMount(() => {
		initScene();

		setResizeCallback(canvas, (width, height) => {
			Frame.renderer.setSize(width, height);
			(Frame.camera as THREE.PerspectiveCamera).aspect = width / height;
			Frame.camera.updateProjectionMatrix()
			Frame.renderer.render(Frame.scene, Frame.camera);
		});

		setTimeout(() => {
			animate();
		}, 1500);
	});

	onDestroy(() => {
		if (!Frame) {
			return;
		}
		cancelAnimationFrame(animationReq);
		Frame.renderer.dispose();
	});

	let verticalIncrement = 0.2;
	let horizontalIncrement = 0.1;
	let rotationY = 0.02;
	let rotationX = 0.02;
	const zoom = 0.01;

	function animate() {
		if (Frame.camera.zoom < 1) {
			Frame.camera.zoom += zoom;
			Frame.camera.updateProjectionMatrix();
		}

		cube.rotation.x += rotationX;
		cube.rotation.y += rotationY;
		cube.rotation.z -= 0.05;

		cube.position.y += verticalIncrement;
		if (cube.position.y > 10 || cube.position.y < -10) {
			verticalIncrement = -verticalIncrement;
			rotationY = -rotationY;
		}

		cube.position.x += horizontalIncrement;
		if (cube.position.x > 2.5 || cube.position.x < -2.5) {
			horizontalIncrement = -horizontalIncrement;
			rotationX = -rotationX;
		}

		Frame.renderer.render(Frame.scene, Frame.camera);

		animationReq = requestAnimationFrame(animate);
	}

	function initScene() {
		console.log('size', canvas.offsetWidth, canvas.offsetHeight)

		Frame = {
			scene: new THREE.Scene(),
			renderer: new THREE.WebGLRenderer({alpha: true, antialias: true, powerPreference: 'high-performance'}),
			camera: new THREE.PerspectiveCamera(75, canvas.offsetWidth / canvas.offsetHeight, 0.1, 500),
		};

		Frame.renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);

		cube = createCube();
		cube.position.x = 0;
		cube.position.y = 0;
		cube.scale.set(5, 5, 5)

		Frame.scene.add(cube);

		addLights(Frame.scene);

		Frame.camera.position.set(0, 0, 20);
		Frame.camera.lookAt(new THREE.Vector3(0, 0, 0));
		Frame.camera.zoom = 0.01;

		Frame.renderer.shadowMap.enabled = true;
		Frame.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

		Frame.camera.updateProjectionMatrix();
		Frame.renderer.render(Frame.scene, Frame.camera);
		canvas.appendChild(Frame.renderer.domElement);
	}

</script>

<div id="bouncer-component" bind:this={canvas} style="width: 100%; height: 100%;"></div>
