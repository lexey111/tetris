import type {TAnimations} from "../../shared/Animations";

export class SpaceAnimations implements TAnimations {
	constructor(private space, private onFinishedFn) {
		//
	}

	public getAnimation = () => {
		return {
			duration: 1000,
			delay: 500,
			animationFn: this.spaceAnimation,
			finishFn: this.endSpaceAnimation
		};

	}

	private spaceAnimation = (percentage) => {
		this.space.children[0].material.opacity = percentage / 100;
	}

	private endSpaceAnimation = () => {
		this.space.children[0].material.opacity = 1;
		this.onFinishedFn();
	}
}
