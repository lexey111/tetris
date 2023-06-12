export type TAnimationFn = (percentage: number, cycle?: number) => void;

export type TAnimationParams = {
	delay?: number
	delayBetween?: number
	duration: number
	repeatCount?: number

	animationFn: TAnimationFn // main animation cycle

	prepareFn?: () => void // before animation starts
	onCycleFn?: (cycle: number) => void // on every cycle finish/new start
	finishFn?: () => void // before remove
}

export type TAnimation = {
	startTime: number
	endTime: number
	duration: number
	delayBetween?: number
	currentPercentage: number
	markToDelete: boolean
	repeatCount?: number
	cycle: number
	started: boolean

	animationFn: TAnimationFn // main animation cycle

	prepareFn?: () => void // before animation starts
	onCycleFn?: (cycle: number) => void // on every cycle finish/new start
	finishFn?: () => void // before remove
}

export interface TAnimations {
	getAnimation: (animationName?: string) => TAnimationParams;
}
