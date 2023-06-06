<script lang="ts">
	import {onMount} from "svelte";
	import * as THREE from "three";
	import type {TThreeFrame} from "../world/world-globals";
	import type {TFigureType} from "../figures/figures";
	import {createFigure} from "../figures/figures-builder";

	export let type: TFigureType = 'S';
	let oldType = '';

	let Frame: TThreeFrame;
	const scale = 30;

	const size = 6 * scale; // fixed scene size XxX

	let figures = [];

	$: {
		if (Frame && oldType !== type) {
			console.log('= figure changes...', oldType, '->', type);
			// TODO: the same figures consequentially?

			// wrap with a pivot container to rotate
			const figure = putFigureToPivot(type);
			figures.unshift(figure);

			Frame.scene.add(figure);

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
		Frame.renderer.setSize(size, size);

		Frame.camera.position.set(0, 5, 30);
		// Frame.camera.rotation.y = -.2;
		Frame.camera.lookAt(new THREE.Vector3(0, 0, 0));
		Frame.camera.zoom = 8;

		Frame.camera.updateProjectionMatrix();
		Frame.renderer.render(Frame.scene, Frame.camera);
		Frame.container.style.opacity = '1';
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

		Frame.container.appendChild(Frame.renderer.domElement);
	}

	let rZ = 0.01; // rotation increment
	const dY = 0.2; // vertical move increment
	const dZ = 1; // hideout increment

	function animate() {
		requestAnimationFrame(animate);
		if (!Frame || figures.length === 0) {
			return;
		}
		// rotate left-right
		figures[0].rotation.y += rZ;
		if (figures[0].rotation.y > .5 || figures[0].rotation.y < -.5) {
			rZ = -rZ;
		}
		// slide down
		if (figures[0].position.y > 0) {
			figures[0].position.y -= dY;
		}

		// hideout
		if (figures.length > 1) {
			if (figures[1].step < 200) {
				figures[1].step += dZ;
				figures[1].children[0].children.forEach(child => {
					if (!child.randomIncZ) {
						child.randomIncZ = Math.random() > 0.5 ? -.2 : .2;
						child.randomIncX = Math.random() > 0.5 ? -.1 : .1;
						child.randomIncY = Math.random() / -7 // always down
					}
					child.position.x += child.randomIncX;
					child.position.y += child.randomIncY;
					child.position.z += child.randomIncZ;

					child.rotation.x += child.randomIncX;
					child.rotation.y -= child.randomIncY;
				})
			} else {
				// gone!
				for (let i = figures.length - 1; i > 0; i--) {
					if (figures[i].parent) {
						figures[i].parent.remove(figures[1]);
					}
				}
				figures.length = 1; // only first left
			}
		}

		Frame.renderer.render(Frame.scene, Frame.camera);
	}

	function putFigureToPivot(type) {
		if (!Frame) {
			return;
		}
		const figure = createFigure(type);
		const _obj = figure.object.clone();

		const pivot = new THREE.Group();
		pivot['step'] = 0; // for animation
		pivot.add(_obj);
		pivot.position.y = 3; // to slide down, set initial position

		_obj.position.set(-figure.width / 2 + 0.5, -figure.height / 2 - 0.5, 0);
		return pivot;
	}

</script>

<style>
	#next {
		margin: 60px 0;
		border: 4px solid #0a517e;
		border-radius: 100%;
		opacity: 0;
		overflow: hidden;
		transition: opacity .5s ease;
		position: relative;
	}
</style>

<div id="next"></div>
