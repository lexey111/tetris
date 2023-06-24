import * as THREE from "three";

const wallGeometry = new THREE.BoxGeometry(0.99, 0.99, 1.8);
export const wallCubeMaterial = new THREE.MeshStandardMaterial({
	color: 0x0095DD,
	transparent: true,
	opacity: .8,
});
const wallCube = new THREE.Mesh(wallGeometry, wallCubeMaterial);

export const wallCubeProgressMaterial = new THREE.MeshStandardMaterial({
	color: 0xFFA600,
	transparent: true,
	opacity: .8,
});


function createWallBrick(x, y, z) {
	const cube = wallCube.clone();
	cube.position.set(x, y, z);
	cube.castShadow = true;
	cube.receiveShadow = true;

	return cube;
}

export function addWalls() {
	const wallGroup = new THREE.Group();
	// left
	const verticalWall = new THREE.Group();
	for (let i = 0; i < 20; i++) {
		verticalWall.add(createWallBrick(0, i, 0));
	}
	// right
	const verticalWall2 = verticalWall.clone();
	verticalWall.position.setX(-5 - .5);
	verticalWall.position.setY(-9 - .5);

	verticalWall2.position.setX(5 + .5);
	verticalWall2.position.setY(-9 - .5);

	wallGroup.add(verticalWall);
	wallGroup.add(verticalWall2);

	// bottom
	const bottomWall = new THREE.Group();
	for (let i = 0; i < 12; i++) {
		bottomWall.add(createWallBrick(i, 0, 0));
	}
	bottomWall.position.setX(-6 + .5);
	bottomWall.position.setY(-10 - .5);
	wallGroup.add(bottomWall);

	wallGroup.position.z = -1;
	wallGroup.rotation.y = Math.PI / 2;
	wallGroup.scale.set(.5, .5, .5);

	return wallGroup;
}
