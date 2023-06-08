<script lang="ts">
	import {onDestroy, onMount} from "svelte";
	import * as THREE from "three";
	import {createKey} from "../keys-utils";
	import type {TThreeFrame} from "../../world/world-globals";
	import {Group} from "three";

	let Frame: TThreeFrame;

	export let size = 80;
	export let keyColor = 0x223344;
	export let textColor = 0xdd5555;

	const sizeX = size;
	const sizeY = size;

	const sizeL = 3; // 3x3 cells per key
	const sizePixel = 512; // base size of svg
	const SVGScale = sizeL / sizePixel;

	onMount(() => {
		initScene();
	});

	onDestroy(() => {
		Frame.renderer.dispose();
	});

	function initScene() {
		Frame = {
			container: document.getElementById('key-component'),
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

		const plight1 = new THREE.PointLight(0xffffff, .8, 20);
		plight1.position.set(-5, 1, 5);
		plight1.castShadow = true;
		const plight2 = new THREE.PointLight(0xffffff, 1, 20);
		plight2.position.set(2, -1, 1);
		plight2.castShadow = true;

		Frame.scene.add(plight1);
		Frame.scene.add(plight2);

		Frame.renderer.shadowMap.enabled = true;
		Frame.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

		const key = createKey({
			symbol: 'escape',
			keyColor,
			textColor,
			SVGScale,
			sizeL
		});

		const keyGrp = new Group();
		keyGrp.add(key);
        Frame.scene.add(keyGrp);
		keyGrp.rotation.x = -.6;

		// set scene params
		Frame.renderer.setSize(sizeX, sizeY);

		Frame.camera.position.set(0, 0, 10);
		Frame.camera.lookAt(new THREE.Vector3(0, 0, 1));
		Frame.camera.zoom = 4;
		Frame.camera.updateProjectionMatrix();

		Frame.renderer.render(Frame.scene, Frame.camera);
		Frame.container.appendChild(Frame.renderer.domElement);
	}

</script>

<div id="key-component"></div>
