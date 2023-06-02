import type {TThreeFrame} from "../world/world-globals";
import {World} from "../world/world-globals";
import * as THREE from "three";
import {createCube} from "../figures/figures-utils";
import {addSpaceItems, addWalls} from "./scene-helpers";
import {addLights} from "./scene-lights";

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
	Frame.renderer.domElement.style.position = 'absolute';

	World.cube = createCube();
	World.cube.position.x = 4.5;
	World.cube.position.y = 15;
	World.cube.scale.set(5, 5, 5)

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

	World.frames.push(Frame);
}
