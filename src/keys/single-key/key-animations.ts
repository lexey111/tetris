import type {TAnimations} from "../../shared/Animations";

export class KeyAnimations implements TAnimations {
	constructor(private key) {
		//
	}

	public setKey = (key) => {
		this.key = key;
	}

	public getAnimation = () => {
		return {
			duration: 2000,
			repeatCount: 400,
			delayBetween: 200,
			animationFn: this.keyAnimation,
			finishFn: this.endKeyAnimation
		};

	}

	private keyAnimation = (percentage) => {
		const distance = Math.PI * 2;
		const currentRotation = (distance * percentage) / 100;

		this.key.rotation.x = currentRotation;
	}
	private endKeyAnimation = () => {
		this.key.rotation.x = 0;
	}
}
