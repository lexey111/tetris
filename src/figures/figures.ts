import * as THREE from "three";

export const Figures: Record<string, Array<string>> = {
	'S' : [
		' ##',
		'## '
	],
	'Z' : [
		'##',
		' ##'
	],
	'L' : [
		'#',
		'#',
		'##'
	],
	'J' : [
		' #',
		' #',
		'##'
	],
	'O' : [
		'##',
		'##'
	],
	'T' : [
		' #',
		'###'
	],
	'I' : [
		'#',
		'#',
		'#',
		'#',
	],
	't' : [
		'###',
		' # ',
		' # ',
		' # ',
	],
	'e' : [
		'###',
		'#  ',
		'## ',
		'#  ',
		'###',
	],
	'r' : [
		'## ',
		'# #',
		'## ',
		'# #',
		'# #',
	],
	'i' : [
		'#',
		' ',
		'#',
		'#',
		'#',
	],
	's' : [
		' ##',
		'#  ',
		' #',
		'  #',
		'## ',
	],
};

export type TFigureType = keyof typeof Figures;

export type TFigure = {
	type: TFigureType
	width: number
	height: number
	object: THREE.Object3D
}
