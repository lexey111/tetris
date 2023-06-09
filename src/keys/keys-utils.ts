import {SVGLoader} from "three/examples/jsm/loaders/SVGLoader";
import * as THREE from "three";
const loader = new SVGLoader();

const SVGCache = {};
function extrudeSVG(id, color, SVGScale, sizeL) {
	// https://muffinman.io/blog/three-js-extrude-svg-path/
	if (SVGCache[id + color]) {
		return SVGCache[id + color].clone()
	}

	if (!document.getElementById('svg-' + id)) {
		throw new Error(`SVG [${id}] not found!`);
	}

	const svgMarkup = document.getElementById('svg-' + id).outerHTML;

	const svgData = loader.parse(svgMarkup);

	const svgGroup = new THREE.Group();
	const material = new THREE.MeshStandardMaterial({
		color,
		// transparent: true,
		// opacity: 0.4,
		//side: THREE.DoubleSide
	});

	svgData.paths.forEach(path => {
		const shapes = path.toShapes(true);

		shapes.forEach(shape => {
			const geometry = new THREE.ExtrudeGeometry(shape, {
				depth: 100,
				bevelEnabled: true
			});

			const mesh = new THREE.Mesh(geometry, material);
			mesh.castShadow = true;
			mesh.receiveShadow = true;

			const box = new THREE.Box3().setFromObject(mesh);
			const size = new THREE.Vector3();
			box.getSize(size);

			mesh.scale.set(SVGScale, SVGScale, SVGScale);

			mesh.position.x = -(sizeL / 2);
			mesh.position.y = -(sizeL / 2);

			svgGroup.add(mesh);
		});
	});

	SVGCache[id + color] = svgGroup;

	return SVGCache[id + color].clone();
}


type TCreateKeyParams = {
	symbol?: string
	keyColor?: number
	textColor?: number
	SVGScale: number
	sizeL: number
}
export function createKey({
	                   symbol = 'arrow',
	                   keyColor = 0x223344,
	                   textColor = 0x777788,
	                   SVGScale = 0,
	                   sizeL = 3
                   }: TCreateKeyParams) {

	const grpKey = new THREE.Group();

	const key = extrudeSVG('key', keyColor, SVGScale, sizeL);
	const arrow = extrudeSVG(symbol, textColor, SVGScale, sizeL);

	key.position.z = -.5;
	if (symbol === 'arrow' || symbol === 'rotate') {
		arrow.scale.set(0.4, -0.4, 0.4);
	} else {
		arrow.scale.set(.8, -.8, .4);
	}
	arrow.position.z = -.1;

	grpKey.add(arrow);
	grpKey.add(key);

	return grpKey;
}
