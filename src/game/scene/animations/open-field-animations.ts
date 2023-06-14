import type {TAnimations} from "../../../shared/Animations";

export class OpenFieldAnimations implements TAnimations {
	constructor(private banner, private walls, private finalizeFn) {
		//
	}

	public getAnimation = () => {
		return {
			duration: 400,
			delay: 200,
			animationFn: this.runAnimation,
			finishFn: this.endRunAnimation
		};
	}

	private runAnimation = (percentage) => {
		this.banner.position.y = -percentage / 4;
		this.walls.children[3].position.y = 10.5 + percentage / 10;
	}

	private endRunAnimation = () =>{
		this.banner.position.y = 0;
		this.finalizeFn();
	}
}
