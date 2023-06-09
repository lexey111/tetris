<script lang="ts">
	import {onDestroy, onMount} from "svelte";
	import * as THREE from "three";
	import {Group} from "three";
	import type {TThreeFrame} from "../world/world-globals";
	import {SymbolHeight, SymbolWidth} from "../symbols/font-globals";
	import {renderLetter} from "../symbols/font-utils";
	/*
    One line, symbols 8x8 only
     */
	export let text = '';
	export let scale = 8;
	export let colors = [];

	let Frame: TThreeFrame;
	let canvas;

	let _text;
	let animationReq;

	let sizeX;
	const sizeY = scale * SymbolHeight / 2;

	const initialRotation = 0.1;

	$: {
		sizeX = scale * text.length * SymbolWidth / 2;

		updateScene();
	}

	onMount(() => {
		initScene();
		updateScene();
	});

	onDestroy(() => {
		Frame && Frame.renderer.dispose();
	});


	function adjustOrthoCamera(camera: THREE.OrthographicCamera) {
		camera.left = sizeX / -2;
		camera.right = sizeX / 2;
		camera.zoom = scale / 2.2;
		camera.position.y = 0;
	}

	function updateScene() {
		if (!Frame) {
			return;
		}
		drawText(colors);

		Frame.renderer.setSize(sizeX, sizeY);

		adjustOrthoCamera(Frame.camera as THREE.OrthographicCamera);

		Frame.camera.updateProjectionMatrix();
		Frame.renderer.render(Frame.scene, Frame.camera);
	}

	function initScene() {
		Frame = {
			scene: new THREE.Scene(),
			renderer: new THREE.WebGLRenderer({alpha: true, antialias: true}),
			camera: new THREE.OrthographicCamera(sizeX / -2, sizeX / 2, sizeY / 2, sizeY / -2, -10, 20000)
		};

		const light = new THREE.DirectionalLight(0xffffff, 1);
		light.position.set(0, 14, 30);
		light.castShadow = true;
		Frame.scene.add(light);

		const semiLight = new THREE.HemisphereLight(0x8080A0, 0x222222, 0.84);
		semiLight.position.set(0, 4, 30);

		Frame.scene.add(semiLight);

		Frame.renderer.shadowMap.enabled = true;
		Frame.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

		canvas.appendChild(Frame.renderer.domElement);
	}

	function drawText(colors) {
		if (!Frame) {
			return;
		}
		clearText();
		const xOffset = text.length * SymbolWidth / 2;

		if (!_text) {
			_text = new Group();
		}

		text.split('').forEach((sym, idx) => {
			const symbol = renderLetter(sym, colors);
			if (symbol) {
				symbol.position.x = idx * SymbolWidth - xOffset;

				symbol.position.y = -SymbolHeight / 2;
				_text.add(symbol);
			}
		});
		Frame.scene.add(_text);
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

<div bind:this={canvas}></div>
