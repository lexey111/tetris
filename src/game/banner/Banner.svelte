<script lang="ts">
	import {onDestroy, onMount} from "svelte";
	import {AnimationManager} from "../../shared/animation-manager";
	import {BannerAnimations} from "./animations/banner-animations";
	import {setResizeCallback} from "../scene/helpers/scene-helpers";
	import * as THREE from "three";
	import {Group} from "three";
	import {addLights} from "../scene/helpers/scene-lights";
	import type {TThreeFrame} from "../game-globals";
	import {SymbolHeight, SymbolWidth} from "../../symbols/font-globals";
	import {renderLetter} from "../../symbols/font-utils";
	import {clear3d} from "../game-globals";

	export let text = '';
	export let colors = [0x00a6FF, 0xFFa600];

	let Frame: TThreeFrame;
	let canvas;
	let animationReq;

	let sizeTimeout;

	let banner;

	const animationManager = new AnimationManager();
	let bannerAnimations;

	$: if (text) {
		// text changed
		drawText();
	}

	onMount(() => {
		initScene();
		drawText();

		bannerAnimations = new BannerAnimations(banner);

		setResizeCallback(canvas, (width, height) => {
			clearTimeout(sizeTimeout);

			sizeTimeout = setTimeout(() => {
				if (!Frame.renderer) {
					return;
                }
				Frame.renderer?.setSize(width, height);
				(Frame.camera as THREE.PerspectiveCamera).aspect = width / height;

				Frame.camera.zoom = 1;
				Frame.camera.updateProjectionMatrix();
				Frame.renderer?.render(Frame.scene, Frame.camera);
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
		clear3d(Frame);
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
		camera.updateProjectionMatrix();
	}

	function animate() {
		// if (text) {
		animationManager.play();
		Frame.renderer?.render(Frame.scene, Frame.camera);
		// }
		animationReq = requestAnimationFrame(animate);
	}

	function initScene() {
		Frame = {
			scene: new THREE.Scene(),
			renderer: new THREE.WebGLRenderer({alpha: true, antialias: false, powerPreference: 'high-performance'}),
			camera: new THREE.PerspectiveCamera(75, canvas.offsetWidth / canvas.offsetHeight, 0.1, 500),
		};

		Frame.renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
		Frame.camera.zoom = 1;

		addLights(Frame.scene);

		// banner = addBanner();
		// Frame.scene.add(banner);

		// const cube = createCube()
		// cube.scale.set(5, 5, 5);
		// Frame.scene.add(cube);

		Frame.renderer.shadowMap.enabled = true;
		Frame.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

		canvas.appendChild(Frame.renderer.domElement);
		adjustPerspectiveCamera(Frame.camera as THREE.PerspectiveCamera, 0.8);

		Frame.renderer?.render(Frame.scene, Frame.camera);
	}

	function drawText() {
		if (!Frame) {
			return;
		}
		clearText();
		if (!banner) {
			banner = new Group();
		}
		if (!text) {
			return;
		}

		const xOffset = text.length * SymbolWidth / 2;


		text.split('').forEach((sym, idx) => {
			const symbol = renderLetter(sym, colors);
			if (symbol) {
				symbol.position.x = idx * SymbolWidth - xOffset;

				symbol.position.y = -SymbolHeight / 2;
				banner.add(symbol);
			}
		});
		banner.scale.set(.25, .25, .15);
		Frame.scene.add(banner);
	}

	function clearText() {
		if (!Frame) {
			return;
		}
		const objectsToRemove = [];
		Frame.scene.traverse(function (node) {
			if (node instanceof THREE.Mesh) {
				objectsToRemove.push(node);
			}
		});

		objectsToRemove.forEach(node => {
			let parent = node.parent;
			parent.remove(node);
		});
	}
</script>

<style>
	#banner {
		width: 100%;
		height: 100%;
	}
</style>

<div id="banner" bind:this={canvas}></div>
