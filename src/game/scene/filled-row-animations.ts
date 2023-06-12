import type {TAnimations} from "../../shared/Animations";

export class FilledRowAnimations implements TAnimations {
	constructor(private field, private duration) {
		//
	}

	public getAnimation = () => {
		return {
			duration: this.duration,
			animationFn: this.linesAnimation,
		};

	}

	public setDuration = (duration) => {
		this.duration = duration;
	}

	private linesAnimation = (percentage) => {
		const scale = (100 - percentage) / 100; // down to 0
		this.field.children.forEach(cube => {
			if (cube['deleting'] === true) {
				cube.scale.y = scale;
				cube.scale.x = scale;
				cube.scale.z = scale;
			}
		});
	}
}
