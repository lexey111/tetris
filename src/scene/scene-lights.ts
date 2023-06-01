import * as THREE from "three";
import {World} from "../world/world-globals";

export function addLights(scene) {
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
