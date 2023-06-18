import type {TAnimations} from "../../../shared/Animations";

export class BannerAnimations implements TAnimations {
	constructor(private banner) {
		//
	}

	public getAnimation = () => {
		return {
			duration: 10000, repeatCount: 3000,
			animationFn: this.dribblePauseBanner,
		};
	}


	private dribblePauseBanner = (percentage) => {
		const distance = 2 * Math.PI;
		const currentRotation = (distance * percentage) / 100;

		this.banner.children.forEach((chld, idx) => {
			chld.position.z = -Math.sin(percentage + idx) * 2;
			if (!chld.position['y-initial']) {
				chld.position['y-initial'] = chld.position.y;
			}
			chld.position.y = chld.position['y-initial'] - Math.sin(percentage + idx);
		});
		// this.banner.children.forEach((chld, idx) => {
		// 	chld.rotation.y = -currentRotation;
		// 	chld.rotation.x = currentRotation;
		// 	chld.rotation.z = -currentRotation;
		// });
	}
}
