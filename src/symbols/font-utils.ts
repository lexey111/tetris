import {Font} from "./font";
import * as THREE from "three";

const FontCache = [];

const PixelOffset = 0.1; // distance of pixel's distraction

const PixelGeometry = new THREE.BoxGeometry(0.8, 0.8, 0.1);
const materials = [
	new THREE.MeshStandardMaterial({
		color: new THREE.Color("rgb(100, 128, 160)"),
		// side: THREE.DoubleSide,
		// transparent: true,
		// opacity: 0.9
	}),
	new THREE.MeshStandardMaterial({
		color: new THREE.Color("rgb(68,87,108)"),
		// side: THREE.DoubleSide,
		// transparent: true,
		// opacity: 0.9
	}),
];

function renderSymbolToCache(letter) {
	const symbol = Font[letter];
	if (!symbol) {
		return;
	}

	const group = new THREE.Group();

	const SymbolHeight = symbol.length;

	for (let line = 0; line < SymbolHeight; line++) {
		let matrix = symbol[line].split('');

		for (let cell = 0; cell < matrix.length; cell++) {
			if (matrix[cell] !== ' ') {
				const material = materials[Math.floor(Math.random() * materials.length)];

				const pixel = new THREE.Mesh(PixelGeometry, material);

				const randomOffsetX = Math.random() > 0.5 ? 0 : Math.random() > 0.5 ? PixelOffset : -PixelOffset;
				const randomOffsetY = Math.random() > 0.5 ? 0 : Math.random() > 0.5 ? PixelOffset : -PixelOffset;
				const randomOffsetZ = Math.random() > 0.5 ? 0 : Math.random() > 0.5 ? PixelOffset : -PixelOffset;

				pixel.position.set(cell + randomOffsetX, SymbolHeight - line + randomOffsetY, randomOffsetZ);
				pixel.castShadow = true;
				pixel.receiveShadow = true;

				group.add(pixel);
			}
		}
	}
	FontCache[letter] = group;
}

export function renderLetter(letter: string) {
	if (!FontCache[letter]) {
		renderSymbolToCache(letter);
	}
	if (!FontCache[letter]) {
		return null;
	}

	return FontCache[letter].clone(); // .rotateZ(Math.random() > 0.5 ? 0.04 : -0.04);
}
