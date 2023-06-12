<script lang="ts">
	import {onDestroy, onMount} from "svelte";
	import {addBanner, addSpaceItems, addWalls, BannerMaterials, setResizeCallback} from "./scene-helpers.ts";
	import * as THREE from "three";
	import {addLights} from "./scene-lights.ts";
	import type {TThreeFrame} from "../game-globals";
	import {AnimationManager} from "../../shared/animation-manager";
	import {SpaceAnimations} from "./space-animations";
	import {BannerAnimations} from "./banner-animations";
	import {OpenFieldAnimations} from "./open-field-animations";

	let Frame: TThreeFrame;
	let canvas;
	let animationReq;

	let sizeTimeout;

	let banner;
	let space;
	let walls;

	const animationManager = new AnimationManager();
	let spaceAnimations;
	let bannerAnimations;
	let openFieldAnimations;

	onMount(() => {
		initScene();
		// init animations
		spaceAnimations = new SpaceAnimations(space);
		openFieldAnimations = new OpenFieldAnimations(banner, walls, () => {
			// forward ref
			bannerAnimations.hideBanner();
        });

		bannerAnimations = new BannerAnimations(banner, () => {
			animationManager.add(openFieldAnimations.getAnimation());
			animationManager.add(spaceAnimations.getAnimation());
		});

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

		// add first animation
		animationManager.add(bannerAnimations.getAnimation());
	});

	onDestroy(() => {
		clearTimeout(sizeTimeout);

		animationManager.dispose();

		cancelAnimationFrame(animationReq);
		Frame && Frame.renderer.dispose();
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
