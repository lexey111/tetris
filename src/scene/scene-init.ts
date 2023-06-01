import type {TThreeFrame} from "../world/world-globals";
import {World} from "../world/world-globals";
import * as THREE from "three";
import {createCube} from "../figures/figures-utils";

export function initScene(container, sizeX, sizeY) {
	// @ts-ignore
	const Frame: TThreeFrame = {
		isMain: true,
		container: container,
		scene: new THREE.Scene(),
		camera: new THREE.PerspectiveCamera(75, sizeX / sizeY, 0.1, 500),
		renderer: new THREE.WebGLRenderer({alpha: false, antialias: false}),
		sizeX: sizeX,
		sizeY: sizeY
	}
	Frame.renderer.setSize(Frame.sizeX, Frame.sizeY);

	Frame.container.appendChild(Frame.renderer.domElement);

	World.cube = createCube();
	World.cube.position.x = 4.5;
	World.cube.position.y = 15;
	World.cube.scale.set(5, 5, 5)

	//World.cube.scale.set(5);

	Frame.scene.add(World.cube);

	addWalls(Frame.scene);
	addSpaceItems(Frame.scene);
	addLights(Frame.scene);

	// World.scene.traverse(function (child) {
	// 	if (child.isMesh) {
	// 		child.castShadow = true;
	// 		child.receiveShadow = true;
	// 	}
	// });

	Frame.camera.position.set(4.5, 8, 20);

	Frame.renderer.shadowMap.enabled = true;
	Frame.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

	Frame.animation = true;
	World.frames.push(Frame);
}

function addLights(scene) {
	const light = new THREE.DirectionalLight(0xffffff, 2);
	World.light = light;
	light.position.set(3, 40, 2);
	light.castShadow = true;
	light.rotateX(5);

	scene.add(light);

	const plight = new THREE.PointLight(0xddffff, .7, 50);
	plight.position.set(4.5, 0, 4);
	plight.castShadow = true; // default false

	scene.add(plight);

	const semiLight = new THREE.HemisphereLight(0x8080A0, 0x222222, 0.64);

	scene.add(semiLight);

	const ambientLight = new THREE.AmbientLight(0x505050);

	scene.add(ambientLight);
}

const wallGeometry = new THREE.BoxGeometry(0.9, 0.9, 0.9);
const wallCubeMaterial = new THREE.MeshStandardMaterial({color: 0x0095DD});

function addWallCube(scene, x, y, z) {
	const cube = new THREE.Mesh(wallGeometry, wallCubeMaterial);
	// const cube = createCube();
	cube.position.set(x, y, z);
	cube.castShadow = true;
	cube.receiveShadow = true;

	scene.add(cube);
}

function addWalls(scene) {
	// left
	for (let i = 0; i < 20; i++) {
		addWallCube(scene, -1, i, 0);
	}
	// right
	for (let i = 0; i < 20; i++) {
		addWallCube(scene, 10, i, 0);
	}
	// bottom
	for (let i = -1; i <= 10; i++) {
		addWallCube(scene, i, -1, 0);
	}
}

const spaceGeometry = new THREE.SphereGeometry(0.05, 2, 2);
const spaceMaterial = new THREE.MeshStandardMaterial({color: 0x00556D, transparent: true, opacity: 0.8});

function addSpaceItems(scene) {
	for (let i = 0; i <= 9; i++) {
		for (let j = 0; j < 20; j++) {
			const item = new THREE.Mesh(spaceGeometry, spaceMaterial);
			item.position.set(i, j, -0.5);
			// item.castShadow = true;
			// item.receiveShadow = true;
			scene.add(item);
		}
	}
}
