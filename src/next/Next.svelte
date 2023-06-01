<script lang="ts">
	import {onMount} from "svelte";
	import * as THREE from "three";
	import {World} from "../world/world-globals.ts";
	import type {TThreeFrame} from "../world/world-globals";
	import type {TFigureType} from "../figures/figures";
	import {createFigure} from "../figures/figures-builder";
	import {createCube} from "../figures/figures-utils";

	export let type: TFigureType = 'S';

	let Frame: TThreeFrame;
	const scale = 50;

	let sizeX;
	let sizeY;
	let figure;
	$: {
		figure = createFigure(type);
		console.log('figure', figure);
		if (figure) {
			sizeX = figure.width * scale;
			sizeY = figure.height * scale;
			console.log('size', sizeX, sizeY)
			// sizeX = 4 * scale;
			// sizeY = 4 * scale;
			updateScene();
		}
	}

	onMount(() => {
		initScene();
		updateScene();
	});

	function updateScene() {
		if (!Frame) {
			return;
		}
		console.log('draw', sizeX, sizeY)
		drawFigure();
		Frame.renderer.setSize(sizeX, sizeY);
		(Frame.camera as THREE.OrthographicCamera).left = sizeX / -2;
		(Frame.camera as THREE.OrthographicCamera).right = sizeX / 2;
		(Frame.camera as THREE.OrthographicCamera).top = sizeY / -2;
		(Frame.camera as THREE.OrthographicCamera).bottom = sizeY / 2;

		(Frame.camera as THREE.OrthographicCamera).position.y = 0;
		figure.height;

		Frame.camera.zoom = scale;
		Frame.camera.updateProjectionMatrix();
	}

	function initScene() {
		Frame = {
			container: document.getElementById('next'),
			scene: new THREE.Scene(),
			renderer: new THREE.WebGLRenderer({alpha: false, antialias: false}),
			camera: new THREE.OrthographicCamera(sizeX / -2, sizeX / 2, sizeY / 2, sizeY / -2, -10, 2000),
			// camera: new THREE.PerspectiveCamera(75, sizeX / sizeY, 0.1, 500),
			sizeX: sizeX,
			sizeY: sizeY
		};

		Frame.container.appendChild(Frame.renderer.domElement);

		const light = new THREE.DirectionalLight(0xffffff, 1);
		light.position.set(0, 14, 30);
		light.castShadow = true;
		Frame.scene.add(light);

		const semiLight = new THREE.HemisphereLight(0x8080A0, 0x222222, 0.84);

		Frame.scene.add(semiLight);
		const cube = createCube();
		cube.scale.set(0.2, 0.2, 0.5);
		Frame.scene.add(cube);

		Frame.renderer.shadowMap.enabled = true;
		Frame.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
		World.frames.push(Frame);
	}

	function drawFigure() {
		if (!Frame) {
			return;
		}
		clearFigure();

		const fig = figure.object.clone();

		fig.position.setX(-(figure.width - 1) / 2);
		fig.position.setY(-(figure.height + 1) / 2);
		// fig.scale.set(0.5, 0.5, 0.5)

		Frame.scene.add(fig);
	}

	function clearFigure() {
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
	#next {
        margin-top: 20px;
	}
</style>

<div id="next"></div>
