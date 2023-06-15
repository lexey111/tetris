import * as THREE from "three";

export type TGameState = 'PRE-START' | 'RUNNING' | 'PAUSED' | 'FINISHED';

export type TThreeFrame = {
	renderer: THREE.WebGLRenderer
	scene: THREE.Scene
	camera: THREE.OrthographicCamera | THREE.PerspectiveCamera
}

export type TCell = {
	falling?: boolean // still in free fall
	solid?: boolean // solid block, no move
	markToRemove?: boolean
}


export function clear3d(Frame: TThreeFrame) {
	if (!Frame || !Frame.renderer) {
		return;
	}
	Frame.renderer.dispose();
	Frame.renderer.forceContextLoss();
	Frame.renderer.domElement = null;
	Frame.renderer = null;
}
