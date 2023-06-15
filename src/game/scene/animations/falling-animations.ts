import type {TAnimations} from "../../../shared/Animations";

export class FallingAnimations implements TAnimations {
	constructor(private field, private duration) {
		//
	}

	public getAnimation = () => {
		return {
			duration: this.duration,
			animationFn: this.cellAnimation,
		};

	}

	public setDuration = (duration) => {
		this.duration = duration;
	}
	public setField = (field) => {
		this.field = field;
	}

	private cellAnimation = (percentage) => {
		const distance = (100 - percentage) / 100; // 1 down to 0

		this.field.children
			.filter(cube => cube['falling'] === true)
			.forEach(cube => {
				if (cube['initialY'] === undefined) {
					cube['initialY'] = cube.position.y;
				}
				cube.position.y = cube['initialY'] + distance;
			});

		this.field.children
			.filter(cube => cube['falling-remove'] === true)
			.forEach(cube => {
				if (cube['initialY-fr'] === undefined) {
					cube['initialY-fr'] = cube.position.y;
				}
				cube.position.y = cube['initialY-fr'] + distance - 1;
			});
	}
}
