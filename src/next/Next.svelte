<script lang="ts">
	import {onMount} from "svelte";
	import * as THREE from "three";
	import type {TThreeFrame} from "../world/world-globals";
	import type {TFigureType} from "../figures/figures";
	import {createFigure} from "../figures/figures-builder";

	export let type: TFigureType = 'I';

	let Frame: TThreeFrame;
	const scale = 30;

	let sizeX;
	let sizeY;
	let figure;
	let _obj;
	let pivot;

	$: {
		figure = createFigure(type);
		console.log('figure', figure);
		if (figure) {
			sizeX = 6 * scale; // square
			sizeY = 6 * scale;
			updateScene();
		}
	}

	onMount(() => {
		initScene();
		updateScene();
		animate();
	});

	function updateScene() {
		if (!Frame) {
			return;
		}
		drawFigure();
		Frame.renderer.setSize(sizeX, sizeY);

		Frame.camera.position.set(0, 5, 30);
		// Frame.camera.rotation.y = -.2;
		Frame.camera.lookAt(new THREE.Vector3(0, 0, 0));
		Frame.camera.zoom = 10;

		Frame.camera.updateProjectionMatrix();
		Frame.renderer.render(Frame.scene, Frame.camera);
	}

	function initScene() {
		Frame = {
			container: document.getElementById('next'),
			scene: new THREE.Scene(),
			renderer: new THREE.WebGLRenderer({alpha: true, antialias: true}),
			camera: new THREE.PerspectiveCamera(75, sizeX / sizeY, 0.1, 500),
			sizeX: sizeX,
			sizeY: sizeY
		};

		Frame.container.appendChild(Frame.renderer.domElement);

		const light = new THREE.DirectionalLight(0xffffff, .7);
		light.position.set(0, 4, 30);
		light.castShadow = true;
		Frame.scene.add(light);

		const semiLight = new THREE.HemisphereLight(0x8080A0, 0x222222, 0.64);
		Frame.scene.add(semiLight);

		// const cube = createCube();
		// cube.scale.set(0.5, 0.5, 0.5);
		// // cube.position.set(-2, 0, 0)
		// Frame.scene.add(cube);

		const plight1 = new THREE.PointLight(0xffff88, .8, 20);
		plight1.position.set(-2, 0, 2);
		plight1.castShadow = true;
		const plight2 = new THREE.PointLight(0x8888ff, .8, 20);
		plight2.position.set(2, 0, 2);
		plight2.castShadow = true;

		Frame.scene.add(plight1);
		Frame.scene.add(plight2);

		Frame.renderer.shadowMap.enabled = true;
		Frame.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	}

	let rZ = 0.01;

	function animate() {
		requestAnimationFrame(animate);
		if (!Frame || !_obj) {
			return;
		}
		pivot.rotation.y += rZ;
		if (pivot.rotation.y > .5 || pivot.rotation.y < -.5) {
			rZ = -rZ;
		}
		// pivot.rotation.y += 0.02;
		Frame.renderer.render(Frame.scene, Frame.camera);
	}

	function drawFigure() {
		if (!Frame) {
			return;
		}
		clearFigure();
		if (!pivot) {
			pivot = new THREE.Group();
			Frame.scene.add(pivot);
		}

		_obj = figure.object.clone();
		pivot.add(_obj);

		_obj.position.set(-figure.width / 2 + 0.5, -figure.height / 2 - 0.5);
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
		margin: 60px 0;
	}
</style>

<div id="next"></div>
