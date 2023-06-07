<script lang="ts">
	import {onMount} from "svelte";
	import * as THREE from "three";
	import type {TThreeFrame} from "../world/world-globals";
	import type {TFigureType} from "../figures/figures";
	import {createFigure} from "../figures/figures-builder";

	export let type: TFigureType = 'S';
	export let rnd = -1;
	let oldType = '';
	let oldRnd = -2;

	let Frame: TThreeFrame;
	const scale = 20;

	const size = 6 * scale; // fixed scene size XxX

	let figures = [];

	$: {
		if (Frame && (oldType !== type || oldRnd !== rnd)) {
			console.log('= figure changes...', oldType, '->', type);
			const figure = putFigureToPivot(type);

			// mark all current content to remove
			markAllToRemove();
			// add new figure to top
			figures.unshift(figure);

			Frame.scene.add(figure);

			oldRnd = rnd;
			oldType = type;
			updateScene();
		}
	}

	onMount(() => {
		initScene();
		updateScene();
		animate();
	});

	function updateScene() {
		if (!Frame) {
			return;
		}
		Frame.renderer.render(Frame.scene, Frame.camera);
	}

	function initScene() {
		Frame = {
			container: document.getElementById('next'),
			scene: new THREE.Scene(),
			renderer: new THREE.WebGLRenderer({alpha: true, antialias: true}),
			camera: new THREE.PerspectiveCamera(75, size / size, 0.1, 500),
		};

		// add lights
		const light = new THREE.DirectionalLight(0xffffff, .2);
		light.position.set(0, 4, 30);
		light.castShadow = true;
		Frame.scene.add(light);

		const semiLight = new THREE.HemisphereLight(0x8080A0, 0x222222, 0.2);
		Frame.scene.add(semiLight);

		const plight1 = new THREE.PointLight(0xffff88, .8, 20);
		plight1.position.set(-2, 0, 2);
		plight1.castShadow = true;
		const plight2 = new THREE.PointLight(0x8888ff, .8, 20);
		plight2.position.set(2, 0, 2);
		plight2.castShadow = true;

		Frame.scene.add(plight1);
		Frame.scene.add(plight2);

		Frame.renderer.shadowMap.enabled = true;
		Frame.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

		Frame.renderer.setSize(size, size);

		Frame.camera.position.set(0, 5, 30);
		Frame.camera.lookAt(new THREE.Vector3(0, 0, 0));
		Frame.camera.zoom = 8;

		Frame.camera.updateProjectionMatrix();

		Frame.container.appendChild(Frame.renderer.domElement);
		setTimeout(() => {
			Frame.container.style.opacity = 1;
		}, .2);
	}

	let rZ = 0.01; // rotation increment
	const dY = 0.1; // vertical move increment

	function animate() {
		requestAnimationFrame(animate);
		if (!Frame || figures.length === 0) {
			return;
		}
		// slide down
		if (figures[0].position.y > 0) {
			figures[0].position.y -= dY * Math.sin(figures[0].position.y);
		}
		// rotate left-right
		figures[0].rotation.y += rZ;
		if (figures[0].rotation.y > .5 || figures[0].rotation.y < -.5) {
			rZ = -rZ;
		}

		// hideout
		let needCleanup = false;

		for (let i = 1; i < figures.length; i++) {
			figures[i].step += 1;
			if (figures[i].step > 100) {
				needCleanup = true;
			}

			if (figures[i].position.y > -1) {
				// first go down...
				figures[i].position.y -= dY;
			} else {
				// ...then decompose
				animateParts(i);
			}
		}
		needCleanup && cleanup();
		updateScene();
	}

	function randomSign() {
		return Math.random() > 0.5 ? -1 : 1;
    }

	function animateParts(i) {
		if (i <= 0 || i >= figures.length) {
			return;
		}

		figures[i].children[0].children.forEach(child => {
			child.children.forEach(child => {
				if (!child.randomIncZ) {
					child.randomIncZ = Math.random() > 0.5 ? -.5 : .1;
					child.randomIncX = randomSign() * .1;
					child.randomIncY = randomSign() * .1;
				}
				child.position.x += child.randomIncX;
				child.position.y += -child.position.x * child.position.x / 15;
				child.position.z += child.randomIncZ;

				child.rotation.x += child.randomIncX / 2;
				child.rotation.y -= child.randomIncY;
			})
		})
	}

	function markAllToRemove() {
		Frame.scene.traverse(function (node) {
			if (node instanceof THREE.Mesh) {
				node['markToRemove'] = true;
			}
		});
	}

	function cleanup() {
		const objectsToRemove = [];
		Frame.scene.traverse(function (node) {
			if (node instanceof THREE.Mesh && node['markToRemove'] === true) {
				objectsToRemove.push(node);
			}
		});

		objectsToRemove.forEach(node => {
			node.parent.remove(node);
		});
		figures.length = 1; // only first left
	}

	function putFigureToPivot(type) {
		if (!Frame) {
			return;
		}
		const figure = createFigure(type);
		const _obj = figure.object.clone();

		const pivot = new THREE.Group();
		pivot['step'] = 0; // for future animation
		pivot.add(_obj);
		pivot.position.y = 3.1; // to slide down, set initial position

		_obj.position.set(-figure.width / 2 + 0.5, -figure.height / 2 - 0.5, 0);
		return pivot;
	}

</script>

<style>
	#next {
		border-radius: 100%;
		opacity: 0;
		overflow: hidden;
		padding: 6px;
		transition: opacity .5s ease;
		position: relative;
	}

	#next:before {
		content: '';
		display: block;
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		border: 8px solid rgba(1, 18, 27, .9);
		border-radius: 100%;
	}

	#next:after {
		content: '';
		display: block;
		position: absolute;
		top: 8px;
		left: 8px;
		right: 8px;
		bottom: 8px;
		border: 4px solid rgba(9, 81, 126, .8);
		border-radius: 100%;
	}
</style>

<div id="next"></div>
