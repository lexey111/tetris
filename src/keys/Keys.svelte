<script lang="ts">
	import {onDestroy, onMount} from "svelte";
	import * as THREE from "three";
	import type {TThreeFrame} from "../game/game-globals";
	import {
		BrightKeyMaterial,
		BrightTextMaterial,
		createKey,
		StandardKeyMaterial,
		StandardTextMaterial
	} from "./keys-utils";
	import {AnimationManager} from "../shared/animation-manager";
	import {KeysAnimations} from "./keys-animations";
	import {clear3d} from "../game/game-globals";

	let Frame: TThreeFrame;
	export let paused = false;

	const sizeX = 390; // 14 cells
	const sizeY = 80; // 2 cells, 100px - paddings

	const sizeL = 3; // 3 cells per key
	const sizePixel = 512; // base size of svg
	const SVGScale = sizeL / sizePixel;

	let keysGrp;

	let animationManager = new AnimationManager();
	let keysAnimation;

	const keyboardKeys: Record<string, any> = {
		keyArrowLeft: undefined,
		keyArrowDown: undefined,
		keyArrowRight: undefined,
		keyArrowUp: undefined,

		keyEscape: undefined,
		keyPause: undefined,
		keySpace: undefined,
	};

	const keyboardKeysPressed = {
		keyArrowLeft: false,
		keyArrowDown: false,
		keyArrowRight: false,
		keyArrowUp: false,

		keyEscape: false,
		keyPause: false,
		keySpace: false,
	};
	let canvas;
	let animationReq;

	onMount(() => {
		initScene();
		attachKeys();

		keysAnimation = new KeysAnimations(
			Frame.camera, keysGrp,
			() => {
				// on finishing zoom - start rotating
				animationManager.add(keysAnimation.getAnimation('rotate'));
			},
			() => {
				setTimeout(() => {
					animationManager.dispose();
					cancelAnimationFrame(animationReq);
				}, 100);

			}
		);

		animationManager.add(keysAnimation.getAnimation('zoom'));
		animate();
	});

	$: {
		if (keyboardKeys.keyPause) {
			if (paused) {
				keyboardKeys.keyPause.children[0].children.forEach(item => item.material = BrightTextMaterial);
				keyboardKeys.keyPause.children[1].children.forEach(item => item.material = BrightKeyMaterial);
				keyboardKeysPressed.keyPause = true;
			} else {
				keyboardKeys.keyPause.children[0].children.forEach(item => item.material = StandardTextMaterial);
				keyboardKeys.keyPause.children[1].children.forEach(item => item.material = StandardKeyMaterial);
				keyboardKeysPressed.keyPause = false;
			}
			updateState();
		}
	}

	onDestroy(() => {
		cancelAnimationFrame(animationReq);
		animationManager.dispose();
		clear3d(Frame);
	});

	function attachKeys() {
		document.addEventListener("keydown", (ev) => {
			let e = ev.key;
			if (e === ' ') {
				e = 'Space';
			}
			if (keyboardKeys['key' + e]) {
				keyboardKeysPressed['key' + e] = true;
				updateState();
			}
		});
		document.addEventListener("keyup", (ev) => {
			let e = ev.key;
			if (e === ' ') {
				e = 'Space';
			}
			if (keyboardKeys['key' + e]) {
				keyboardKeysPressed['key' + e] = false;
				updateState();
			}
		});
	}

	function updateState() {
		Object.keys(keyboardKeysPressed).forEach(key => {
			if (!keyboardKeys[key]) {
				return;
			}
			keyboardKeys[key].position.z = keyboardKeysPressed[key] ? -0.3 : 0;
		});
		Frame && Frame.renderer?.render(Frame.scene, Frame.camera);
	}

	function animate() {
		if (Frame && keysGrp) {
			animationManager.play();
		}
		Frame && Frame.renderer?.render(Frame.scene, Frame.camera);
		animationReq = requestAnimationFrame(animate);
	}

	function createKeys() {
		keyboardKeys.keyArrowLeft = createKey({SVGScale, sizeL});
		keyboardKeys.keyArrowDown = keyboardKeys.keyArrowLeft.clone();
		keyboardKeys.keyArrowRight = keyboardKeys.keyArrowLeft.clone();

		keyboardKeys.keyArrowUp = createKey({symbol: 'rotate', SVGScale, sizeL});
		keyboardKeys.keyEscape = createKey({
			symbol: 'escape',
			keyColor: 0x223344,
			textColor: 0xdd5555,
			SVGScale,
			sizeL
		});
		keyboardKeys.keyPause = createKey({symbol: 'pause', SVGScale, sizeL});
		keyboardKeys.keySpace = createKey({symbol: 'drop', SVGScale, sizeL});

		const keys = new THREE.Group();

		keys.add(keyboardKeys.keyArrowDown); // center
		keyboardKeys.keyArrowDown.rotation.z = Math.PI / 2;

		keys.add(keyboardKeys.keyArrowLeft);
		keyboardKeys.keyArrowLeft.position.x = -3.02;

		keys.add(keyboardKeys.keyArrowRight);
		keyboardKeys.keyArrowRight.position.x = 3.02;
		keyboardKeys.keyArrowRight.rotation.z = -Math.PI;

		keys.add(keyboardKeys.keyArrowUp);
		keyboardKeys.keyArrowUp.position.y = 3.05;
		keyboardKeys.keyArrowUp.rotation.z = -Math.PI / 2;

		keys.add(keyboardKeys.keyEscape);
		keyboardKeys.keyEscape.position.x = -8;

		keys.add(keyboardKeys.keyPause);
		keyboardKeys.keyPause.position.x = 8;

		keys.add(keyboardKeys.keySpace);
		keyboardKeys.keySpace.children[1].scale.x = 2;
		keyboardKeys.keySpace.position.x = 13;

		keys.position.y = -.5;
		keys.position.x = -3.2;

		return keys;
	}

	function initScene() {
		Frame = {
			scene: new THREE.Scene(),
			renderer: new THREE.WebGLRenderer({alpha: true, antialias: true}),
			camera: new THREE.PerspectiveCamera(90, sizeX / sizeY, 0.1, 500),
		};

		// add lights
		const light = new THREE.DirectionalLight(0xffffff, 0.8);
		light.position.set(0, 1, 10);
		light.castShadow = true;
		Frame.scene.add(light);

		const plight1 = new THREE.PointLight(0xffffff, .8, 20);
		plight1.position.set(-5, 1, 2);
		plight1.castShadow = true;
		const plight2 = new THREE.PointLight(0x888888, 1, 20);
		plight2.position.set(7, 2, 2);
		plight2.castShadow = true;

		Frame.scene.add(plight1);
		Frame.scene.add(plight2);

		Frame.renderer.shadowMap.enabled = true;
		Frame.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

		// set scene params
		Frame.renderer.setSize(sizeX, sizeY);

		Frame.camera.position.set(0, -1, 30);
		Frame.camera.lookAt(new THREE.Vector3(0, .5, 0));
		Frame.camera.zoom = 1;

		// add geometry
		keysGrp = createKeys();
		Frame.scene.add(keysGrp);
		keysGrp.rotation.x = -Math.PI / 2;

		Frame.camera.updateProjectionMatrix();

		canvas.appendChild(Frame.renderer.domElement);
	}

</script>

<style>
</style>

<div bind:this={canvas}></div>
