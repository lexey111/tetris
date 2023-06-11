<script lang="ts">
	import {onDestroy, onMount} from "svelte";
	import {addBanner, addSpaceItems, addWalls, BannerMaterials, setResizeCallback} from "./scene-helpers.ts";
	import * as THREE from "three";
	import {addLights} from "./scene-lights.ts";
	import type {TThreeFrame} from "../game-globals";
	import {AnimationManager} from "./scene-animator";

	let Frame: TThreeFrame;
	let canvas;
	let animationReq;

	let sizeTimeout;

	let banner;
	let space;
	let walls;
	const animationManager = new AnimationManager();

	const ReadyAnimation = {
		delay: 500, duration: 800, repeatCount: 3,
		prepareFn: prepareReadyBanner,
		animationFn: dribbleBanner,
		onCycleFn: onReadyCycle,
		finishFn: endReadyBanner
	};

	const RunAnimation = {
		duration: 400,
		delay: 200,
		animationFn: runAnimation,
		finishFn: endRunAnimation
	};

	const SpaceAnimation = {
		duration: 1000,
		delay: 500,
		animationFn: spaceAnimation,
		finishFn: endSpaceAnimation
	};

	onMount(() => {
		initScene();

		setResizeCallback(canvas, (width, height) => {
			clearTimeout(sizeTimeout);

			sizeTimeout = setTimeout(() => {
				Frame.renderer.setSize(width, height);
				(Frame.camera as THREE.PerspectiveCamera).aspect = width / height;

				adjustPerspectiveCamera(Frame.camera as THREE.PerspectiveCamera, 0.8);
				Frame.renderer.render(Frame.scene, Frame.camera);
			}, 100);
		});

		setTimeout(animate, 0);

		animationManager.add(ReadyAnimation);
	});

	function showBanner(text: 'READY' | 'PAUSE' | 'OVER') {
		banner.visible = true;
		let idx = 1;
		switch (text) {
			case "READY": {
				idx = 1;
				break
			}
			case "PAUSE": {
				idx = 2;
				break;
			}
			case "OVER":
				idx = 3;
		}

		banner.children[0].material = BannerMaterials[idx - 1];
		banner.children.forEach((text, i) => text.visible = idx === i || i === 0);
	}

	function spaceAnimation(percentage) {
		space.children[0].material.opacity = percentage / 100;
	}

	function endSpaceAnimation() {
		space.children[0].material.opacity = 1;
		// run!
	}

	function runAnimation(percentage) {
		banner.position.y = -percentage / 4;
		walls.children[3].position.y = 10.5 + percentage / 10;
	}

	function endRunAnimation() {
		hideBanner();
		banner.position.y = 0;
	}

	function prepareReadyBanner() {
		showBanner('READY');
		banner.children[1].children[6].visible = true; // ready? 1
	}

	function dribbleBanner(percentage) {
		const distance = 3 * 2 * Math.PI;
		const currentRotation = (distance * percentage) / 100;

		banner.children[1].children.forEach(chld => {
			chld.position.z = Math.sin(currentRotation) * .25;
        })
		// banner.rotation.x = Math.sin(currentRotation) * 0.04;
	}

	function onReadyCycle(cycle) {
		// hardcoded access to numbers
		banner.children[1].children[6].visible = cycle === 0; // ready? 2
		banner.children[1].children[7].visible = cycle === 1; // ready? 2
		banner.children[1].children[8].visible = cycle === 2; // ready? 3
	}

	function endReadyBanner() {
		// hardcoded access to numbers
		banner.children[1].children[6].visible = false; // ready? 1
		banner.children[1].children[7].visible = false; // ready? 2
		banner.children[1].children[8].visible = false; // ready? 3
		banner.rotation.x = 0;
		banner.children[1].children.forEach(chld => {
			chld.position.z = 0;
		})

		animationManager.add(RunAnimation);
		animationManager.add(SpaceAnimation);
	}

	function hideBanner() {
		banner.visible = false;
	}

	onDestroy(() => {
		clearTimeout(sizeTimeout);
		if (!Frame) {
			return;
		}
		cancelAnimationFrame(animationReq);
		Frame.renderer.dispose();
	});

	function adjustPerspectiveCamera(camera: THREE.PerspectiveCamera, offset) {
		// https://wejn.org/2020/12/cracking-the-threejs-object-fitting-nut/
		offset = offset || 1.5;

		const boundingBox = new THREE.Box3(new THREE.Vector3(-6, -12, -6), new THREE.Vector3(6, 12, 6));
		const size = new THREE.Vector3();
		boundingBox.getSize(size);
		const center = new THREE.Vector3();
		boundingBox.getCenter(center);

		camera.position.set(0, 0, 100);
		// camera.zoom = 1;

		const fov = camera.fov * (Math.PI / 180);
		const fovh = 2 * Math.atan(Math.tan(fov / 2) * camera.aspect);
		let dx = size.z / 2 + Math.abs(size.x / 2 / Math.tan(fovh / 2));
		let dy = size.z / 2 + Math.abs(size.y / 2 / Math.tan(fov / 2));
		let cameraZ = Math.max(dx, dy);

		if (offset !== undefined && offset !== 0) cameraZ *= offset;

		camera.position.set(0, 0, cameraZ);

		const minZ = boundingBox.min.z;
		const cameraToFarEdge = (minZ < 0) ? -minZ + cameraZ : cameraZ - minZ;

		camera.far = cameraToFarEdge * 3;

		camera.lookAt(center);
		camera.updateProjectionMatrix()
	}

	const zoom = 0.05;

	function animate() {
		if (Frame.camera.zoom < 1) {
			Frame.camera.zoom += zoom;
			Frame.camera.updateProjectionMatrix();
		}

		animationManager.play();

		Frame.renderer.render(Frame.scene, Frame.camera);
		animationReq = requestAnimationFrame(animate);
	}

	function initScene() {
		Frame = {
			scene: new THREE.Scene(),
			renderer: new THREE.WebGLRenderer({alpha: true, antialias: true, powerPreference: 'high-performance'}),
			camera: new THREE.PerspectiveCamera(75, canvas.offsetWidth / canvas.offsetHeight, 0.1, 500),
		};

		Frame.renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);

		Frame.camera.zoom = -0.01;

		walls = addWalls(Frame.scene);
		Frame.scene.add(walls);

		space = addSpaceItems(Frame.scene);
		space.children[0].material.opacity = 0;
		Frame.scene.add(space);

		addLights(Frame.scene);

		banner = addBanner();
		Frame.scene.add(banner);

		// addHelper(Frame.scene);

		Frame.renderer.shadowMap.enabled = true;
		Frame.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

		canvas.appendChild(Frame.renderer.domElement);
		adjustPerspectiveCamera(Frame.camera as THREE.PerspectiveCamera, 0.8);
		Frame.renderer.render(Frame.scene, Frame.camera);
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

<div id="scene" bind:this={canvas}></div>
