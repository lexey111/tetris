import * as THREE from "three";

const defaultMaterial = new THREE.MeshStandardMaterial({
	color: 0xdddddd,
	transparent: false,
	// opacity: 0.9,
	// side: THREE.DoubleSide
});

const boxMaterial = new THREE.MeshStandardMaterial({
	color: 0x034c80,
	// transparent: true,
	// opacity: 0.9,
	// side: THREE.DoubleSide
});
//const boxGeometry = new THREE.BoxGeometry(.6, .6, .6);
const boxGeometry = new THREE.SphereGeometry(.5, 12, 12);

const horizontal1PillarGeometry = new THREE.BoxGeometry(0.2, 0.2, 1);
const horizontal2PillarGeometry = new THREE.BoxGeometry(1, 0.2, 0.2);
const verticalPillarGeometry = new THREE.BoxGeometry(0.2, 1, 0.2);

export function createCube(material?) {
	const group = new THREE.Group();
	const hCube1 = new THREE.Mesh(horizontal1PillarGeometry, defaultMaterial);
	hCube1.castShadow = true;
	hCube1.receiveShadow = true;

	const hCube2 = new THREE.Mesh(horizontal2PillarGeometry, defaultMaterial);
	hCube2.castShadow = true;
	hCube2.receiveShadow = true;

	const vCube = new THREE.Mesh(verticalPillarGeometry, defaultMaterial);
	vCube.castShadow = true;
	vCube.receiveShadow = true;

	const p1 = hCube1.clone();
	p1.position.set(0 - .4, 0 - .4, 0);
	const p2 = hCube1.clone();
	p2.position.set(1 - .6, 0 - .4, 0);
	const p3 = hCube1.clone();
	p3.position.set(0 - .4, 1 - .6, 0);
	const p4 = hCube1.clone();
	p4.position.set(1 - .6, 1 - .6, 0);

	group.add(p1);
	group.add(p2);
	group.add(p3);
	group.add(p4);

	const v1 = hCube2.clone();
	v1.position.set(1 - 1, 0 - .4, 0 - .4);
	const v2 = hCube2.clone();
	v2.position.set(1 - 1, 1 - .6, 0 - .4);
	const v3 = hCube2.clone();
	v3.position.set(1 - 1, 1 - .6, 0.4);
	const v4 = hCube2.clone();
	v4.position.set(1 - 1, -0.4, 0.4);

	group.add(v1);
	group.add(v2);
	group.add(v3);
	group.add(v4);

	const x1 = vCube.clone();
	x1.position.set(-0.4, 0, 0.4);
	const x2 = vCube.clone();
	x2.position.set(0.4, 0, -0.4);
	const x3 = vCube.clone();
	x3.position.set(0.4, 0, 0.4);
	const x4 = vCube.clone();
	x4.position.set(-0.4, 0, -0.4);

	group.add(x1);
	group.add(x2);
	group.add(x3);
	group.add(x4);

	const box = new THREE.Mesh(boxGeometry, material || boxMaterial);
	box.castShadow = true;
	box.receiveShadow = true;
	group.add(box);

	return group.clone();
}
