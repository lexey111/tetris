<script lang="ts">
	import {onDestroy, onMount} from "svelte";
	import * as THREE from "three";
	import type {TThreeFrame} from "../game/game-globals";
	import {createCube} from "../figures/figures-utils";
	import {addLights} from "../game/scene/helpers/scene-lights";
	import {setResizeCallback} from "../game/scene/helpers/scene-helpers";
	import {clear3d} from "../game/game-globals";

	let Frame: TThreeFrame;
	let canvas;
	let animationReq;
	let cube;

	let sizeTimeout;

	onMount(() => {
		initScene();

		setResizeCallback(canvas, (width, height) => {
			clearTimeout(sizeTimeout);

			sizeTimeout = setTimeout(() => {
				if (!Frame.renderer) {
					return;
                }
				Frame.renderer.setSize(width, height);
				(Frame.camera as THREE.PerspectiveCamera).aspect = width / height;

				adjustPerspectiveCamera(Frame.camera as THREE.PerspectiveCamera, 0.8);
				Frame.renderer?.render(Frame.scene, Frame.camera);
			}, 100);
		});

		setTimeout(() => {
			animate();
		}, 1500);
	});

	onDestroy(() => {
		clearTimeout(sizeTimeout);
		if (!Frame) {
			return;
		}
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
		camera.updateProjectionMatrix()
	}

	let verticalIncrement = 0.2;
	let horizontalIncrement = 0.1;
	let rotationY = 0.02;
	let rotationX = 0.02;
	const zoom = 0.01;

	function animate() {
		if (Frame.camera.zoom < 1) {
			Frame.camera.zoom += zoom;
			Frame.camera.updateProjectionMatrix();
		}

		cube.rotation.x += rotationX;
		cube.rotation.y += rotationY;
		cube.rotation.z -= 0.05;

		cube.position.y += verticalIncrement;
		if (Math.abs(cube.position.y) > 8) {
			verticalIncrement *= -1;
			rotationY *= -1;
		}

		cube.position.x += horizontalIncrement;
		if (Math.abs(cube.position.x) > 2.5) {
			horizontalIncrement *= -1;
			rotationX *= -1;
		}

		Frame.renderer?.render(Frame.scene, Frame.camera);

		animationReq = requestAnimationFrame(animate);
	}

	function initScene() {
		Frame = {
			scene: new THREE.Scene(),
			renderer: new THREE.WebGLRenderer({alpha: true, antialias: true, powerPreference: 'high-performance'}),
			camera: new THREE.PerspectiveCamera(75, canvas.offsetWidth / canvas.offsetHeight, 0.1, 500),
		};

		Frame.renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);

		cube = createCube();
		cube.position.x = 0;
		cube.position.y = 0;
		cube.scale.set(5, 5, 5)

		Frame.scene.add(cube);

		// const material = new THREE.MeshStandardMaterial({
		// 	color: 0xdddddd,
		// 	transparent: true,
		// 	opacity: 0.3,
		// 	side: THREE.DoubleSide
		// });
		// const boxGeometry = new THREE.BoxGeometry(10, 20, 8);
		// const hCube2 = new THREE.Mesh(boxGeometry, material);
		// Frame.scene.add(hCube2);

        Frame.camera.zoom = -0.01;

		addLights(Frame.scene);

		Frame.renderer.shadowMap.enabled = true;
		Frame.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

		canvas.appendChild(Frame.renderer.domElement);
	}

</script>

<style>
	#bouncer-component {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		top: 0;
	}
</style>

<div id="bouncer-component" bind:this={canvas}></div>
