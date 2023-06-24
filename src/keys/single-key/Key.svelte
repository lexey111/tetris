<script lang="ts">
	import {onDestroy, onMount} from "svelte";
	import * as THREE from "three";
	import {createKey} from "../keys-utils";
	import type {TThreeFrame} from "../../game/game-globals";
	import {clear3d} from "../../game/game-globals";
	import {AnimationManager} from "../../shared/animation-manager";
	import {KeyAnimations} from "./key-animations";

	let Frame: TThreeFrame;

	export let symbol = 'escape';
	export let size = 80;
	export let keyColor = 0x223344;
	export let textColor = 0xdd5555;
	export let rotate = false; // show rotation animation
	export let delay = 0;

	export let angle = -0.6;
	export let lights = true;

	const sizeX = size;
	const sizeY = size;

	const sizeL = 3; // 3x3 cells per key
	const sizePixel = 512; // base size of svg
	const SVGScale = sizeL / sizePixel;
	let key;

	let canvas;
	let animationReq;
	let initialHandler;

	let animationManager = new AnimationManager();
	let keyAnimations;

	onMount(() => {
		if (!delay) {
			initScene();
		} else {
			initialHandler = setTimeout(initScene, delay);
		}
	});

	onDestroy(() => {
		clearTimeout(initialHandler);
		clearAnimation();
		clear3d(Frame);
	});

	$: {
		if (Frame) {
			if (rotate) {
				animationManager.add(keyAnimations.getAnimation());
				animate();
			} else {
				clearAnimation();
			}
		}
	}
	$: if (symbol && Frame) {
		clearScene();
		key = createKey({
			symbol,
			keyColor,
			textColor,
			SVGScale,
			sizeL
		});
		key.rotation.x = angle;

		Frame.scene.add(key);
		Frame.renderer?.render(Frame.scene, Frame.camera);
		keyAnimations.setKey(key);
	}

	function clearScene() {
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

	function animate() {
		if (!Frame) {
			return;
		}

		animationManager.play();

		Frame.renderer?.render(Frame.scene, Frame.camera);
		animationReq = requestAnimationFrame(animate);
	}

	function clearAnimation() {
		cancelAnimationFrame(animationReq);
		animationManager.dispose();
	}

	function initScene() {
		Frame = {
			scene: new THREE.Scene(),
			renderer: new THREE.WebGLRenderer({alpha: true, antialias: true}),
			camera: new THREE.PerspectiveCamera(75, sizeX / sizeY, 0.1, 500),
		};

		// add lights
		const light = new THREE.DirectionalLight(0xffffff, 1);
		light.position.set(-2, 2, 10);
		light.lookAt(new THREE.Vector3(0, 0, 1))
		light.castShadow = true;
		Frame.scene.add(light);

		if (lights) {
			const plight1 = new THREE.PointLight(0x8800ff, .2, 20);
			plight1.position.set(-5, 1, 5);
			plight1.castShadow = true;
			const plight2 = new THREE.PointLight(0xff0088, .8, 20);
			plight2.position.set(0, -1, 1);
			plight2.castShadow = true;

			Frame.scene.add(plight1);
			Frame.scene.add(plight2);
		}

		Frame.renderer.shadowMap.enabled = true;
		Frame.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

		key = createKey({
			symbol,
			keyColor,
			textColor,
			SVGScale,
			sizeL
		});

		Frame.scene.add(key);
		key.rotation.x = angle;

		Frame.renderer.setSize(sizeX, sizeY);

		Frame.camera.position.set(0, 0, 10);
		Frame.camera.lookAt(new THREE.Vector3(0, 0, 1));
		Frame.camera.zoom = 3;
		Frame.camera.updateProjectionMatrix();

		Frame.renderer?.render(Frame.scene, Frame.camera);
		canvas.appendChild(Frame.renderer.domElement);

		keyAnimations = new KeyAnimations(key);
	}

</script>

<div bind:this={canvas}></div>
