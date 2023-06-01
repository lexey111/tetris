import * as THREE from "three";

export type TThreeFrame = {
	isMain?: boolean
	container: HTMLElement
	renderer: THREE.WebGLRenderer
	scene: THREE.Scene
	camera?: THREE.OrthographicCamera | THREE.PerspectiveCamera
	sizeX: number
	sizeY: number
	animation?: boolean
}

export type TWorld = {
	frames: TThreeFrame[]
	inc: number
	light?: THREE.DirectionalLight
	cube?: any,
	text?: any,
}
export const World: TWorld = {
	frames: [],
	inc: 0.05,
	light: void 0
}
