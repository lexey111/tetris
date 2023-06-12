import * as THREE from "three";

export type TGameState = 'PRE-START' | 'RUNNING' | 'PAUSED' | 'FINISHED';

export type TThreeFrame = {
	renderer: THREE.WebGLRenderer
	scene: THREE.Scene
	camera: THREE.OrthographicCamera | THREE.PerspectiveCamera
}

export enum TCellState {
	Empty = 0,
	Solid = 1,
	MarkedDelete = 2,
	MarkedFalling = 3
}
