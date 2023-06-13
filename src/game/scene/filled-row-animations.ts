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
				cube.scale.y = scale / 2;
				cube.scale.x = scale / 2;
				cube.scale.z = scale / 2;

				const distance = Math.PI;
				const currentRotation = (distance * percentage) / 100;
				cube.rotation.y = -currentRotation;
				cube.rotation.x = currentRotation;
				cube.rotation.z = -currentRotation;
				cube.position.z = scale - 1;
			}
		});
	}
}
