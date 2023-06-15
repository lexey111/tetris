import * as THREE from "three";
import {XToScene, YToScene} from "../../scene/helpers/scene-utils";
import {renderLetter} from "../../../symbols/font-utils";
import {SymbolHeight, SymbolWidth} from "../../../symbols/font-globals";

function drawText(text: string, colors?) {
	const textGroup = new THREE.Group();

	const xOffset = text.length * SymbolWidth / 2;
	text.split('').forEach((sym, idx) => {
		const symbol = renderLetter(sym, colors || [0xeeeeff]);
		if (symbol) {
			symbol.position.x = idx * SymbolWidth - xOffset;
			symbol.position.y = -SymbolHeight / 2;

			textGroup.add(symbol);
		}
	});

	return textGroup;
}

export const BannerMaterials = [
	// ready
	new THREE.MeshStandardMaterial({
		color: 0x0065AA,
		transparent: true,
		opacity: 0.9,
		// side: THREE.DoubleSide
	}),
	// pause
	new THREE.MeshStandardMaterial({
		color: 0x0065AA,
		transparent: true,
		opacity: 0.9,
	}),
	// over
	new THREE.MeshStandardMaterial({
		color: 0xff0088,
		transparent: true,
		opacity: .7,
		side: THREE.DoubleSide
	})
];

export function addBanner() {
	const bannerGroup = new THREE.Group();
	const boxGeometry = new THREE.BoxGeometry(9, 18, .01);

	const bannerReadyBg = new THREE.Mesh(boxGeometry, BannerMaterials[0]);
	bannerReadyBg.position.setZ(2.5);
	bannerGroup.add(bannerReadyBg);

	// -----------------------------------------------------------------------------------------------------------------
	const bannerTextReady = drawText('READY?');
	bannerTextReady.position.y = 1;

	const bannerTextReady1 = drawText('3');
	bannerTextReady1.position.y = -15;
	bannerTextReady.add(bannerTextReady1);

	const bannerTextReady2 = drawText('2');
	bannerTextReady2.position.y = -15;
	bannerTextReady.add(bannerTextReady2);

	const bannerTextReady3 = drawText('1');
	bannerTextReady3.position.y = -15;
	bannerTextReady.add(bannerTextReady3);

	bannerTextReady.scale.set(.15, .15, .5);

	bannerTextReady.position.z = 2.5;

	bannerTextReady1.visible = false;
	bannerTextReady2.visible = false;
	bannerTextReady3.visible = false;

	bannerGroup.add(bannerTextReady);
	bannerTextReady.visible = false;

	// -----------------------------------------------------------------------------------------------------------------
	const bannerTextPause = drawText('PAUSE', [0xCCCCFA, 0xFFA600]);

	bannerTextPause.scale.set(.15, .15, 1);
	// bannerTextPause.position.z = 2.5;

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

	// bannerGroup.visible = false;
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
