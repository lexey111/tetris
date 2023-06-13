import * as THREE from "three";

export type TGameState = 'PRE-START' | 'RUNNING' | 'PAUSED' | 'FINISHED';

export type TThreeFrame = {
	renderer: THREE.WebGLRenderer
	scene: THREE.Scene
	camera: THREE.OrthographicCamera | THREE.PerspectiveCamera
}

export enum TCellState {
	Falling = 1,
	Solid = 2,
	MarkedDelete = 3,
}

export type TCell = {
	state: TCellState
	goingToStill?: boolean
	animationPercentage?: number
	object3d?: any
}
