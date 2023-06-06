import * as THREE from "three";

export type TThreeFrame = {
	isMain?: boolean
	container: HTMLElement
	renderer: THREE.WebGLRenderer
	scene: THREE.Scene
	camera?: THREE.OrthographicCamera | THREE.PerspectiveCamera
	sizeX?: number
	sizeY?: number
}

export type TWorld = {
	frames: TThreeFrame[]
	light?: THREE.DirectionalLight
	cube?: any
	text?: any
}
export const World: TWorld = {
	frames: [],
	light: void 0
}
