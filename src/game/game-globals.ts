import * as THREE from "three";

export type TGameState = 'PRE-START' | 'RUNNING' | 'PAUSED' | 'FINISHED';

export type TThreeFrame = {
	renderer: THREE.WebGLRenderer
	scene: THREE.Scene
	camera: THREE.OrthographicCamera | THREE.PerspectiveCamera
}
