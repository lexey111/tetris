import type {TAnimations} from "../../shared/Animations";

export class SpaceAnimations implements TAnimations {
	constructor(private space, private walls, private onFinishedFn) {
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
		const currentPosition = (percentage / 100) * 8;
		this.space.position.z = 8 - currentPosition;
		this.space.children[0].material.opacity = percentage / 100;
		this.walls.position.z = -1 + currentPosition / 8;
	}

	private endSpaceAnimation = () => {
		this.space.children[0].material.opacity = 1;
		this.space.position.z = 0;
		this.walls.position.z = 0;

		this.onFinishedFn();
	}
}
