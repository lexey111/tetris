<script lang="ts">
	import {onMount} from "svelte";
	import * as THREE from "three";
	import {World} from "../world/world-globals.ts";
	import type {TThreeFrame} from "../world/world-globals";
	import {SymbolHeight, SymbolWidth} from "../symbols/font-globals";
	import {renderLetter} from "../symbols/font-utils";

	export let text = 'AAAA';

	let Frame: TThreeFrame;
	const scale = 10;

	let sizeX;
	const sizeY = scale * SymbolHeight / 2;
	$: {
		sizeX = scale * text.length * SymbolWidth / 2;
		console.log('set size x', sizeX, text.length);
		updateScene();
	}

	onMount(() => {
		initScene();
		updateScene();
	});

	function updateScene() {
		if (!Frame) {
			return;
		}
		drawText();
		Frame.renderer.setSize(sizeX, sizeY);
		(Frame.camera as THREE.OrthographicCamera).left = sizeX / -2;
		(Frame.camera as THREE.OrthographicCamera).right = sizeX / 2;
		Frame.camera.zoom = scale / 2;
		Frame.camera.updateProjectionMatrix();
	}

	function initScene() {
		Frame = {
			container: document.getElementById('next'),
			scene: new THREE.Scene(),
			renderer: new THREE.WebGLRenderer({alpha: false, antialias: false}),
			camera: new THREE.OrthographicCamera(sizeX / -2, sizeX / 2, sizeY / 2, sizeY / -2, -10, 20000),
			sizeX: sizeX,
			sizeY: sizeY
		};
		Frame.camera.position.y = SymbolHeight / 1.8;

		Frame.container.appendChild(Frame.renderer.domElement);

		const light = new THREE.DirectionalLight(0xffffff, 1);
		light.position.set(0, 14, 30);
		light.castShadow = true;
		Frame.scene.add(light);

		const semiLight = new THREE.HemisphereLight(0x8080A0, 0x222222, 0.84);

		Frame.scene.add(semiLight);

		Frame.renderer.shadowMap.enabled = true;
		Frame.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
		World.frames.push(Frame);
	}

	function drawText() {
		if (!Frame) {
			return;
		}
		clearText();
		const xOffset = text.length * SymbolWidth / 2;

		text.split('').forEach((sym, idx) => {
			const symbol = renderLetter(sym);
			symbol.position.x = idx * SymbolWidth - xOffset;
			Frame.scene.add(symbol);
		});
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
	#score {
	}
</style>

<div id="next"></div>