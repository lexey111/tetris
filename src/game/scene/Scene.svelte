<script lang="ts">
	import {onDestroy, onMount} from "svelte";
	import {setResizeCallback} from "./helpers/scene-helpers.ts";
	import * as THREE from "three";
	import {addLights} from "./helpers/scene-lights.ts";
	import type {TThreeFrame} from "../game-globals";
	import {clear3d} from "../game-globals";
	import {AnimationManager} from "../../shared/animation-manager";
	import {SpaceAnimations} from "./animations/space-animations";
	import {createCube} from "../../figures/figures-utils";
	import {FilledRowAnimations} from "./animations/filled-row-animations";
	import {FallingAnimations} from "./animations/falling-animations";
	import {addSpaceItems} from "./helpers/scene-space";
	import {addWalls, wallCubeMaterial, wallCubeProgressMaterial} from "./helpers/scene-walls";

	export let onEvent: (event: string) => void;
	export let tickDuration;
	export let GameField = [];
	export let tick = 0; // new turn
	export let paused = false;
	export let levelPercent = 0;

	let Frame: TThreeFrame;
	let canvas;
	let animationReq;

	let sizeTimeout;

	let space;
	let walls;
	let renderField = new THREE.Group();

	const animationManager = new AnimationManager();
	let spaceAnimations;

	let filledAnimations = new FilledRowAnimations(renderField, 500);
	let fallingAnimations = new FallingAnimations(renderField, 250);

	$: if (tickDuration) {
		filledAnimations.setDuration(tickDuration);
		fallingAnimations.setDuration(tickDuration * 2);
	}

	$: if (tick) {
		if (GameField && GameField.length > 0 && tick > 0 && !paused) {
			animationManager.dispose();
			drawField();
			runFieldAnimations();
		}
	}

	$: if (walls && levelPercent >= 0) {
		drawWallPercentage();
	}

	function drawWallPercentage() {
		if (!walls) {
			return;
		}
		// vertical wall has 20 items
		const counter = Math.ceil(20 * levelPercent / 100);
		const wall1 = walls.children[0].children;
		const wall2 = walls.children[1].children;
		const wall3 = walls.children[2].children;

		for (let i = wall1.length - 1; i >= 0; i--) {
			wall1[i].material = i < counter ? wallCubeProgressMaterial : wallCubeMaterial;
			wall2[i].material = i < counter ? wallCubeProgressMaterial : wallCubeMaterial;
		}
		wall3.forEach(pixel => pixel.material = levelPercent > 0 ? wallCubeProgressMaterial : wallCubeMaterial);
	}

	onMount(() => {
		initScene();
		// init animations
		spaceAnimations = new SpaceAnimations(space, walls, () => {
			onEvent('STARTED')
		});

		animationManager.add(spaceAnimations.getAnimation());

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

		setTimeout(animate, 0);
	});

	onDestroy(() => {
		clearTimeout(sizeTimeout);

		animationManager.dispose();

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

	const zoom = 0.05;

	function animate() {
		if (Frame.camera.zoom < 1) {
			Frame.camera.zoom += zoom;
			Frame.camera.updateProjectionMatrix();
		}

		animationManager.play();

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

		Frame.camera.zoom = -0.01;

		walls = addWalls();
		Frame.scene.add(walls);

		space = addSpaceItems();
		space.children[0].material.opacity = 0;
		Frame.scene.add(space);

		addLights(Frame.scene);

		renderField.position.x = -5 + .5;
		renderField.position.y = -10 + .5;
		renderField.position.z = 0;
		Frame.scene.add(renderField);

		Frame.renderer.shadowMap.enabled = true;
		Frame.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

		canvas.appendChild(Frame.renderer.domElement);
		adjustPerspectiveCamera(Frame.camera as THREE.PerspectiveCamera, 0.8);
	}

	const fallingMaterial = new THREE.MeshStandardMaterial({
		color: 0xffa600,
		// transparent: true,
		// opacity: 0.5,
		// side: THREE.DoubleSide
	});

	const deletingMaterial = new THREE.MeshStandardMaterial({
		color: 0xff0000,
		// transparent: true,
		// opacity: 0.8,
		// side: THREE.DoubleSide
	});

	function drawField() {
		if (!Frame) {
			return;
		}

		if (renderField) {
			const objectsToRemove = [];

			renderField.traverse(node => {
				if (node instanceof THREE.Mesh) {
					objectsToRemove.push(node);
				}
			});

			objectsToRemove.forEach(node => {
				node.parent.remove(node);
			});
			Frame.scene.remove(renderField);
			renderField = null;
		}

		renderField = new THREE.Group();

		for (let row = 0; row < 24; row++) { // vertical
			for (let col = 0; col < GameField[row].length; col++) { // horizontal
				if (GameField[row][col]) {
					let cube;

					if (GameField[row][col].markToRemove) {
						cube = createCube(deletingMaterial);
						cube['deleting'] = true;
					}

					if (GameField[row][col].falling) {
						if (!cube) {
							cube = createCube(fallingMaterial);
						}
						cube['falling'] = true;
					}

					if (!cube) {
						cube = createCube();
					}

					if (GameField[row][col].fallAsRemove) {
						cube['falling-remove'] = true;
					}

					cube.position.x = col;
					cube.position.y = row;

					renderField.add(cube);
				}
			}
		}

		fallingAnimations.setField(renderField);
		filledAnimations.setField(renderField);

		renderField.position.x = -5 + .5;
		renderField.position.y = -10 + .5;
		renderField.position.z = 0;

		Frame.scene.add(renderField);
	}

	function runFieldAnimations() {
		animationManager.add(filledAnimations.getAnimation());
		animationManager.add(fallingAnimations.getAnimation());
	}
</script>

<style>
	#scene {
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
	}
</style>

<div id="scene" bind:this={canvas}></div>
