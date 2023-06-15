<script lang="ts">
	import {onDestroy, onMount} from "svelte";
	import * as THREE from "three";
	import type {TThreeFrame} from "../game/game-globals";
	import {SymbolHeight, SymbolWidth} from "../symbols/font-globals";
	import {renderLetter} from "../symbols/font-utils";
	import {AnimationManager} from "../shared/animation-manager";
	import {SymbolAnimations} from "./symbol-animations";
	import {clear3d} from "../game/game-globals";
	/*
    One symbols 8x8 only
     */
	export let letter = '';
	export let scale = 8;
	export let colors = [];
	export let animation = false;
	export let direction: 'CW' | 'CCW' = 'CW';

	let Frame: TThreeFrame;
	let canvas;

	let _letter;
	let animationReq;

	let sizeX;
	const sizeY = scale * SymbolHeight / 2;

	const initialRotation = 0.1;

	let symbolAnimations;
	let animationManager = new AnimationManager();

	$: {
		sizeX = scale * SymbolWidth / 2;

		updateScene();
		if (animation) {
			symbolAnimations.setDirection(direction);
			animationManager.add(symbolAnimations.getAnimation());
			animate();
		} else {
			animationManager.dispose();
			clearAnimation();
		}
	}

	onMount(() => {
		initScene();
		symbolAnimations = new SymbolAnimations(_letter, initialRotation)
		updateScene();
	});

	onDestroy(() => {
		clearAnimation();
		animationManager.dispose();
		clear3d(Frame);
	});

	function animate() {
		if (!animation || !Frame) {
			return;
		}
		animationManager.play();

		Frame.renderer?.render(Frame.scene, Frame.camera);
		animationReq = requestAnimationFrame(animate);
	}

	function clearAnimation() {
		cancelAnimationFrame(animationReq);
		// if (_letter) {
		// 	_letter.rotation.y = initialRotation;
		// }
		Frame && Frame.renderer?.render(Frame.scene, Frame.camera);
	}

	function adjustPerspectiveCamera(camera: THREE.PerspectiveCamera, object, offset) {
		const boundingBox = new THREE.Box3().setFromObject(object);
		const size = new THREE.Vector3();
		boundingBox.getSize(size);
		const center = new THREE.Vector3();
		boundingBox.getCenter(center);

		camera.position.set(0, 0, 1000);
		camera.zoom = 4.5;
		offset = offset || 1.5;

		const startDistance = center.distanceTo(camera.position);
		const endDistance = camera.aspect > 1 ?
			((size.y / 2) + offset) / Math.abs(Math.tan(camera.fov / 2)) :
			((size.y / 2) + offset) / Math.abs(Math.tan(camera.fov / 2)) / camera.aspect;

		camera.position.set(
			camera.position.x * endDistance / startDistance,
			camera.position.y * endDistance / startDistance,
			camera.position.z * endDistance / startDistance,
		);

		camera.lookAt(center);
	}

	function updateScene() {
		if (!Frame) {
			return;
		}
		drawLetter(colors);

		Frame.renderer.setSize(sizeX, sizeY);

		adjustPerspectiveCamera(Frame.camera as THREE.PerspectiveCamera, _letter, 1.5);
		Frame.camera.updateProjectionMatrix();
		Frame.renderer?.render(Frame.scene, Frame.camera);
	}

	function initScene() {
		Frame = {
			scene: new THREE.Scene(),
			renderer: new THREE.WebGLRenderer({alpha: true, antialias: true}),
			camera: new THREE.PerspectiveCamera(75, sizeX / sizeY, 0.1, 500)
		};

		const light = new THREE.DirectionalLight(0xffffff, 1);
		light.position.set(0, 14, 30);
		light.castShadow = true;
		Frame.scene.add(light);

		const semiLight = new THREE.HemisphereLight(0x8080A0, 0x222222, 0.84);
		semiLight.position.set(0, 4, 30);

		Frame.scene.add(semiLight);

		const plight1 = new THREE.PointLight(0x888888ff, .8, scale);
		plight1.position.set(-4, -4, -4);
		plight1.castShadow = true;

		const plight2 = new THREE.PointLight(0xff0088, .8, 20);
		plight2.position.set(4, -3, -6);
		plight2.castShadow = true;

		Frame.scene.add(plight1);
		Frame.scene.add(plight2);

		Frame.renderer.shadowMap.enabled = true;
		Frame.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

		canvas.appendChild(Frame.renderer.domElement);
	}

	function drawLetter(colors) {
		if (!Frame) {
			return;
		}
		clearScene();

		_letter = new THREE.Group();

		const sym = renderLetter(letter, colors);
		if (sym) {
			sym.position.x = -SymbolWidth / 2;

			sym.position.y = -SymbolHeight / 2;
			sym.position.z = .4; // half of thickness

			_letter.add(sym);
			_letter.rotation.y = initialRotation;
		}
		Frame.scene.add(_letter);
		symbolAnimations.setLetter(_letter);
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
</script>

<div bind:this={canvas}></div>
