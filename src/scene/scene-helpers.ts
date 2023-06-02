import * as THREE from "three";

export function setResizeCallback(container: HTMLElement, callbackFn: (width: number, height: number) => void) {
	const resizeObserver = new ResizeObserver(entries => {
		const entry = entries.at(0);
		const {width, height} = entry.contentRect;
		callbackFn(width, height);
	});

	resizeObserver.observe(container);

	return () => resizeObserver.unobserve(container);
}

const wallGeometry = new THREE.BoxGeometry(0.9, 0.9, 0.9);
const wallCubeMaterial = new THREE.MeshStandardMaterial({color: 0x0095DD});
const wallCube = new THREE.Mesh(wallGeometry, wallCubeMaterial);

function createWallBrick(x, y, z) {
	const cube = wallCube.clone();
	// const cube = createCube();
	cube.position.set(x, y, z);
	cube.castShadow = true;
	cube.receiveShadow = true;

	return cube;
}

export function addWalls(scene) {
	// left
	const verticalWall = new THREE.Group();
	for (let i = 0; i < 20; i++) {
		verticalWall.add(createWallBrick(-1, i, 0));
	}
	// right
	const verticalWall2 = verticalWall.clone();
	verticalWall2.position.setX(11);

	// bottom
	const bottomWall = new THREE.Group();
	for (let i = -1; i <= 10; i++) {
		bottomWall.add(createWallBrick(i, -1, 0));
	}
	scene.add(verticalWall);
	scene.add(verticalWall2);
	scene.add(bottomWall);
}

const spaceGeometry = new THREE.SphereGeometry(0.05, 2, 2);
const spaceMaterial = new THREE.MeshStandardMaterial({color: 0x00556D, transparent: true, opacity: 0.8});

export function addSpaceItems(scene) {
	const spaceGroup = new THREE.Group();
	for (let i = 0; i <= 9; i++) {
		for (let j = 0; j < 20; j++) {
			const item = new THREE.Mesh(spaceGeometry, spaceMaterial);
			item.position.set(i, j, -0.5);
			item.castShadow = true;
			item.receiveShadow = true;
			spaceGroup.add(item);
		}
	}

	scene.add(spaceGroup);
}
