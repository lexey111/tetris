let increment = 0.02;

export class SymbolAnimations {
	private direction = 1;

	constructor(private letter, private initialRotation) {
		//
	}

	public getAnimation = () => {
		return {
			duration: 2000,
			repeatCount: 200,
			animationFn: this.symbolAnimation,
			finishFn: this.endSymbolAnimation
		};
	}

	public setLetter = (lt) => {
		this.letter = lt;
	}
	public setDirection = (dir) => {
		if (dir === 'CW') {
			this.direction = 1;
		} else {
			this.direction = -1;
		}
	}

	private symbolAnimation = (percentage) => {
		const distance = Math.PI * 2 * this.direction;
		const currentRotation = (distance * percentage) / 100;

		this.letter.rotation.y = currentRotation + this.initialRotation;
		// wobby effect
		this.letter.children[0].children.forEach(cube => {
			if (!cube['dir']) {
				cube['dir'] = Math.random() > 0.5 ? 2 : -2;
			}
			cube.rotation.z += increment * cube['dir'];
			cube.position.z += increment * cube['dir'];
			cube.position.y += increment * cube['dir'] / 4;
			if (Math.abs(cube.rotation.z) > .21) {
				cube['dir'] *= -1;
			}
		});
	}

	private endSymbolAnimation = () => {
		this.letter.rotation.y = this.initialRotation;
	}
}
