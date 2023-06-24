import * as THREE from "three";

const spaceGeometry = new THREE.SphereGeometry(0.03, 4, 4);
const spaceMaterial = new THREE.MeshStandardMaterial({color: 0x9999FF, transparent: true, opacity: .1});

export function addSpaceItems() {
	const spaceGroup = new THREE.Group();

	for (let i = 0; i <= 9; i++) {
		for (let j = 0; j <= 19; j++) {
			const item = new THREE.Mesh(spaceGeometry, spaceMaterial);
			item.position.set(i, j, 0);
			// item.castShadow = true;
			// item.receiveShadow = true;
			spaceGroup.add(item);
		}
	}
	spaceGroup.position.setX(-5 + .5);
	spaceGroup.position.setY(-10 + .5);
	spaceGroup.position.setZ(8);
	spaceGroup.rotation.y = -Math.PI / 2;

	return spaceGroup;
}
