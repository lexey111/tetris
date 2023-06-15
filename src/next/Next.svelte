<script lang="ts">
	import {onDestroy, onMount} from "svelte";
	import * as THREE from "three";
	import type {TThreeFrame} from "../game/game-globals";
	import type {TFigureType} from "../figures/figures";
	import {createFigure} from "../figures/figures-builder";
	import {clear3d} from "../game/game-globals";

	export let type: TFigureType = 'S';
	export let accent = '#09517E';
	export let hideLines = false;

	let hexAccent = parseInt(accent.replace('#', '0x'), 16);
	export let rnd = -1;

	const size = 6 * 20; // fixed scene size 6x6 cells with scale factor 20

	let oldType = '';
	let oldRnd = -2;

	let Frame: TThreeFrame;
	let canvas;
	let animationReq;

	let initialTimeout;

	let figures = [];

	$: {
		if (Frame && type && (oldType !== type || oldRnd !== rnd)) {
			// mark all the current content to be removed
			markAllToRemove();

			// add new figure to top
			const figure = putFigureToPivot(type);
			figures.unshift(figure);

			Frame.scene.add(figure);

			oldRnd = rnd;
			oldType = type;
		}
	}

	onMount(() => {
		initScene();
		animate();
	});

	onDestroy(() => {
		if (!Frame) {
			return;
		}
		clearTimeout(initialTimeout);
		cancelAnimationFrame(animationReq);
		clear3d(Frame);
	});

	function initScene() {
		Frame = {
			scene: new THREE.Scene(),
			renderer: new THREE.WebGLRenderer({alpha: true, antialias: true, powerPreference: 'high-performance'}),
			camera: new THREE.PerspectiveCamera(75, size * 2 / size, 0.1, 500),
		};

		// add lights
		const light = new THREE.DirectionalLight(0xffffff, 2);
		light.position.set(0, 4, 30);
		light.castShadow = true;
		Frame.scene.add(light);

		const semiLight = new THREE.HemisphereLight(0x8080A0, 0x222222, 0.2);
		Frame.scene.add(semiLight);

		const plight1 = new THREE.PointLight(0xffff88, .8, 20);
		plight1.position.set(-2, 0, 2);
		plight1.castShadow = true;

		const plight2 = new THREE.PointLight(hexAccent, .8, 20);
		plight2.position.set(2, 0, 2);
		plight2.castShadow = true;

		Frame.scene.add(plight1);
		Frame.scene.add(plight2);

		Frame.renderer.shadowMap.enabled = true;
		Frame.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

		// set scene params
		Frame.renderer.setSize(size * 2, size);

		Frame.camera.position.set(0, 5, 30);
		Frame.camera.lookAt(new THREE.Vector3(0, 0, 0));
		Frame.camera.zoom = 8;

		Frame.camera.updateProjectionMatrix();

		canvas.appendChild(Frame.renderer.domElement);

		initialTimeout = setTimeout(() => {
			canvas.style.opacity = '1';
		}, 0);
	}

	let rZ = 0.01; // rotation increment
	const dY = 0.1; // vertical move increment

	function animate() {
		if (figures.length > 0) {
			// slide down
			if (figures[0].position.y > 0) {
				figures[0].position.y -= dY * figures[0].position.y;
				//figures[0].position.y -= dY * Math.sin(figures[0].position.y);
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

				if (figures[i].position.y > -2.5) {
					// first go down...
					figures[i].position.y -= dY * 2;
					figures[i].position.z -= dY * 3;
				} else {
					// ...then decompose
					animateParts(i);
				}
			}
			needCleanup && cleanup();
			Frame && Frame.renderer?.render(Frame.scene, Frame.camera);
		}
		animationReq = requestAnimationFrame(animate);
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
				// node.position.z -= 5;
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
		pivot.position.y = 5; //3.1; // to slide down, set initial position

		_obj.position.set(-figure.width / 2 + 0.5, -figure.height / 2 - 0.5, 0);
		return pivot;
	}
</script>

<style>
	.next-content {
		opacity: 0;
		overflow: hidden;
		transition: opacity 2s ease;
		position: relative;
		border-top: 2px solid var(--next-accent);
		border-bottom: 2px solid var(--next-accent);
		justify-content: center;
		width: 100%;
		display: flex;
		flex-flow: row nowrap;
	}

	.next-content.no-borders {
		border-top: none;
        margin-bottom: 20px;
	}
</style>

<div style="--next-accent: {accent};">
    <div bind:this={canvas} class="next-content {hideLines? 'no-borders' : ''}"></div>
</div>
