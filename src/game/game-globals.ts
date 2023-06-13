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
	falling?: boolean // still in free fall
	solid?: boolean // solid block, no move
	markToRemove?: boolean
}
