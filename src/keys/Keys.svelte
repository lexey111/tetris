<script lang="ts">
	import {onMount} from "svelte";
	import * as THREE from "three";
	import type {TThreeFrame} from "../world/world-globals";
	import {SVGLoader} from "three/examples/jsm/loaders/SVGLoader";

	let Frame: TThreeFrame;

	const sizeX = 390; // 14 cells
	const sizeY = 80; // 2 cells, 100px - paddings

	const sizeL = 3; // 3 cells per key
	const sizePixel = 512; // base size of svg
	const SVGScale = sizeL / sizePixel;

	let keysGrp;

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

	onMount(() => {
		initScene();
		attachKeys();
		setTimeout(animate, 500);
	});

	function attachKeys() {
		document.addEventListener("keydown", (ev) => {
			let e = ev.key;
			if (e === ' ') {
				e = 'Space';
			}
			if (ev.keyCode === 80) {
				e = 'Pause'; // P
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
			if (ev.keyCode === 80) {
				e = 'Pause'; // P
			}
			if (keyboardKeys['key' + e]) {
				keyboardKeysPressed['key' + e] = false;
				updateState();
			}
		});
	}

	const dR = 0.04;
	const zoomDelta = 0.8;
	let animationDone = false;
	const maxZoom = 10;
	const maxAngle = -Math.PI / 6;

	function updateState() {
		Object.keys(keyboardKeysPressed).forEach(key => {
			if (!keyboardKeys[key]) {
				return;
			}
			keyboardKeys[key].position.z = keyboardKeysPressed[key] ? -0.3 : 0;
		});
		Frame && Frame.renderer.render(Frame.scene, Frame.camera);
	}

	function animate() {
		if (animationDone) {
			return;
		}
		if (Frame && keysGrp) {
			if (keysGrp.rotation.x < maxAngle) {
				keysGrp.rotation.x += dR;
			}

			if (Frame.camera.zoom < maxZoom) {
				Frame.camera.zoom += zoomDelta;
				Frame.camera.updateProjectionMatrix();
			}

			if (keysGrp.rotation.x >= maxAngle && Frame.camera.zoom >= maxZoom) {
				animationDone = true;
			}
		}
		Frame && Frame.renderer.render(Frame.scene, Frame.camera);
		requestAnimationFrame(animate);
	}

	function extrudeSVG(id, color) {
		// https://muffinman.io/blog/three-js-extrude-svg-path/
		const svgMarkup = document.getElementById(id).outerHTML;

		const loader = new SVGLoader();
		const svgData = loader.parse(svgMarkup);

		const svgGroup = new THREE.Group();
		const material = new THREE.MeshStandardMaterial({
			color,
			// transparent: true,
			// opacity: 0.9,
			// side: THREE.DoubleSide
		});

		svgData.paths.forEach(path => {
			const shapes = path.toShapes(true);

			shapes.forEach(shape => {
				const geometry = new THREE.ExtrudeGeometry(shape, {
					depth: 100,
					bevelEnabled: true
				});

				const mesh = new THREE.Mesh(geometry, material);
				mesh.castShadow = true;
				mesh.receiveShadow = true;

				const box = new THREE.Box3().setFromObject(mesh);
				const size = new THREE.Vector3();
				box.getSize(size);

				mesh.scale.set(SVGScale, SVGScale, SVGScale);

				mesh.position.x = -(sizeL / 2);
				mesh.position.y = -(sizeL / 2);

				svgGroup.add(mesh);
			});
		});
		return svgGroup;
	}

	function createKey(symbol = 'arrow', keyColor = 0x223344, textColor = 0x777788) {
		const grpKey = new THREE.Group();

		const key = extrudeSVG('key', keyColor);
		const arrow = extrudeSVG(symbol, textColor);

		key.position.z = -.5;
		if (symbol === 'arrow' || symbol === 'rotate') {
			arrow.scale.set(0.4, -0.4, 0.4);
		} else {
			arrow.scale.set(.8, -.8, .4);
		}

		grpKey.add(arrow);
		grpKey.add(key);

		return grpKey;
	}

	function createKeys() {
		keyboardKeys.keyArrowLeft = createKey();
		keyboardKeys.keyArrowDown = keyboardKeys.keyArrowLeft.clone();
		keyboardKeys.keyArrowRight = keyboardKeys.keyArrowLeft.clone();

		keyboardKeys.keyArrowUp = createKey('rotate');
		keyboardKeys.keyEscape = createKey('escape', 0x223344, 0xdd5555);
		keyboardKeys.keyPause = createKey('pause');
		keyboardKeys.keySpace = createKey('drop');

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
			container: document.getElementById('keys'),
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

		// const axesHelper = new THREE.AxesHelper(15);
		// Frame.scene.add(axesHelper);

		// add geometry
		keysGrp = createKeys();
		Frame.scene.add(keysGrp);
		keysGrp.rotation.x = -Math.PI / 2;

		Frame.camera.updateProjectionMatrix();

		Frame.container.appendChild(Frame.renderer.domElement);
	}

</script>

<style>
</style>

<div id="keys"></div>
