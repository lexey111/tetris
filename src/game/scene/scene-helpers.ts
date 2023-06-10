import * as THREE from "three";
import {Group} from "three";
import {XToScene, YToScene} from "./scene-utils";
import {renderLetter} from "../../symbols/font-utils";
import {SymbolHeight, SymbolWidth} from "../../symbols/font-globals";

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
	cube.position.set(x, y, z);
	cube.castShadow = true;
	cube.receiveShadow = true;

	return cube;
}

export function addWalls(scene) {
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

	scene.add(verticalWall);
	scene.add(verticalWall2);

	// bottom
	const bottomWall = new THREE.Group();
	for (let i = 0; i < 12; i++) {
		bottomWall.add(createWallBrick(i, 0, 0));
	}
	bottomWall.position.setX(-6 + .5);
	bottomWall.position.setY(-10 - .5);
	scene.add(bottomWall);

	const topWall = bottomWall.clone();
	topWall.position.setY(10 + .5);
	topWall.position.setX(-6 + .5);
	scene.add(topWall);
}

const spaceGeometry = new THREE.SphereGeometry(0.05, 4, 4);
const spaceMaterial = new THREE.MeshStandardMaterial({color: 0x00889E, transparent: true, opacity: 0.8});

export function addSpaceItems(scene) {
	const spaceGroup = new THREE.Group();

	for (let i = 0; i <= 9; i++) {
		for (let j = 0; j <= 19; j++) {
			const item = new THREE.Mesh(spaceGeometry, spaceMaterial);
			item.position.set(i, j, 0);
			item.castShadow = true;
			item.receiveShadow = true;
			spaceGroup.add(item);
		}
	}
	spaceGroup.position.setX(-5 + .5);
	spaceGroup.position.setY(-10 + .5);

	scene.add(spaceGroup);
}

function drawText(text: string) {
	const textGroup = new Group();

	const xOffset = text.length * SymbolWidth / 2;
	text.split('').forEach((sym, idx) => {
		const symbol = renderLetter(sym, [0xeeeeff]);
		if (symbol) {
			symbol.position.x = idx * SymbolWidth - xOffset;
			symbol.position.y = -SymbolHeight / 2;

			textGroup.add(symbol);
		}
	});

	return textGroup;
}

export const BannerMaterials = [
	new THREE.MeshStandardMaterial({
		color: 0x0065AA,
		transparent: true,
		opacity: 0.8,
		// side: THREE.DoubleSide
	}),
	new THREE.MeshStandardMaterial({
		color: 0x021B20,
		transparent: true,
		opacity: 0.9,
		// side: THREE.DoubleSide
	}),
	new THREE.MeshStandardMaterial({
		color: 0xff0088,
		transparent: true,
		opacity: .7,
		side: THREE.DoubleSide
	})
];

export function addBanner() {
	const bannerGroup = new Group();
	const boxGeometry = new THREE.BoxGeometry(9, 18, .01);

	const bannerReadyBg = new THREE.Mesh(boxGeometry, BannerMaterials[0]);
	bannerReadyBg.position.setZ(2.5);
	bannerGroup.add(bannerReadyBg);

	// -----------------------------------------------------------------------------------------------------------------
	const bannerTextReady = drawText('READY?');

	bannerTextReady.scale.set(.15, .15, .5);
	bannerTextReady.position.z = 2.5;

	bannerGroup.add(bannerTextReady);
	bannerTextReady.visible = false;

	// -----------------------------------------------------------------------------------------------------------------
	const bannerTextPause = drawText('PAUSE');

	bannerTextPause.scale.set(.15, .15, .5);
	bannerTextPause.position.z = 2.5;

	bannerGroup.add(bannerTextPause);
	bannerTextPause.visible = false;

	// -----------------------------------------------------------------------------------------------------------------
	const bannerGameOver = drawText('GAME');
	const bannerOver = drawText('OVER');

	bannerOver.position.y = -10;

	bannerGameOver.scale.set(.15, .15, .5);
	bannerGameOver.position.z = 2.5;
	bannerGameOver.position.y = 1;

	bannerGameOver.add(bannerOver);
	bannerGroup.add(bannerGameOver);

	bannerGameOver.visible = false;

	bannerGroup.visible = false;
	return bannerGroup;
}

export function addHelper(scene: THREE.Scene) {
	const material = new THREE.MeshStandardMaterial({
		color: 0xdddddd,
		transparent: true,
		opacity: 0.3,
		side: THREE.DoubleSide
	});
	const material2 = new THREE.MeshStandardMaterial({
		color: 0xFFFFdd,
		transparent: true,
		opacity: 0.3,
		side: THREE.DoubleSide
	});
	const boxGeometry = new THREE.BoxGeometry(10, 20, 1);
	const hCube2 = new THREE.Mesh(boxGeometry, material);
	scene.add(hCube2);

	const boxGeometryC = new THREE.BoxGeometry(1, 1, 2);
	const hCubeC = new THREE.Mesh(boxGeometryC, material2);
	scene.add(hCubeC); // center

	const hCube00 = new THREE.Mesh(boxGeometryC, material2);
	hCube00.position.set(XToScene(0), YToScene(0), 0); // logical bottom left
	scene.add(hCube00);

	const hCube01 = new THREE.Mesh(boxGeometryC, material2);
	hCube01.position.set(XToScene(9), YToScene(0), 0); // logical bottom right
	scene.add(hCube01);

	const hCube02 = new THREE.Mesh(boxGeometryC, material2);
	hCube02.position.set(XToScene(0), YToScene(19), 0); // logical top left
	scene.add(hCube02);

	const hCube03 = new THREE.Mesh(boxGeometryC, material2);
	hCube03.position.set(XToScene(9), YToScene(19), 0); // logical top right
	scene.add(hCube03);
}
