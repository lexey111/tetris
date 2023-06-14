import type {TAnimations} from "../../../shared/Animations";
import {BannerMaterials} from "../helpers/scene-banner";

export class BannerAnimations implements TAnimations {

	constructor(private banner, private finalizeFn) {
		//
	}

	public getAnimation = (name) => {
		if (!name) {
			return {
				delay: 500, duration: 800, repeatCount: 3,
				prepareFn: this.prepareReadyBanner,
				animationFn: this.dribbleBanner,
				onCycleFn: this.onReadyCycle,
				finishFn: this.endBannerAnimation
			};
		}
		if (name === 'pause') {
			return {
				duration: 5000, repeatCount: 300,
				prepareFn: this.preparePauseBanner,
				animationFn: this.dribblePauseBanner,
				finishFn: this.endBannerAnimation
			};
		}
	}
	public hideBanner = () => {
		this.banner.visible = false;
		this.banner.children[0].scale.set(1, 1, 1);
	}


	public showBanner = (text: 'READY' | 'PAUSE' | 'OVER') => {
		this.banner.visible = true;
		let idx = 1;
		switch (text) {
			case "READY": {
				idx = 1;
				break
			}
			case "PAUSE": {
				idx = 2;
				break;
			}
			case "OVER":
				idx = 3;
		}

		this.banner.children[0].visible = true;
		this.banner.children[0].material = BannerMaterials[idx - 1];
		this.banner.children.forEach((str, i) => str.visible = idx === i || i === 0);
	}

	private preparePauseBanner = () => {
		this.showBanner('PAUSE');
		this.banner.children[0].visible = false;
		this.banner.children[1].children[6].visible = true;
	}

	private prepareReadyBanner = () => {
		this.showBanner('READY');
		this.banner.children[1].children[6].visible = true; // ready? 1
	}

	private onReadyCycle = (cycle) => {
		// hardcoded access to numbers
		this.banner.children[1].children[6].visible = cycle === 0; // ready? 2
		this.banner.children[1].children[7].visible = cycle === 1; // ready? 2
		this.banner.children[1].children[8].visible = cycle === 2; // ready? 3
	}

	private dribbleBanner = (percentage) => {
		const distance = 3 * 2 * Math.PI;
		const currentRotation = (distance * percentage) / 100;

		this.banner.children[1].children.forEach(chld => {
			chld.position.z = Math.sin(currentRotation) * .25;
		});
		// this.banner.rotation.z = Math.sin(currentRotation) * 0.05;
	}

	private dribblePauseBanner = (percentage) => {
		const distance = 2 * Math.PI;
		const currentRotation = (distance * percentage) / 100;

		this.banner.children[2].rotation.z = currentRotation;

		this.banner.children[2].children.forEach((chld, idx) => {
			chld.rotation.y = -currentRotation;
			chld.rotation.x = currentRotation;
			chld.children.forEach((chld, idx) => {
				chld.position.z = -Math.cos(currentRotation) * idx / 8;
			});
		});
	}

	private endBannerAnimation = () => {
		// hardcoded access to numbers
		this.banner.children[1].children[6].visible = false; // ready? 1
		this.banner.children[1].children[7].visible = false; // ready? 2
		this.banner.children[1].children[8].visible = false; // ready? 3

		this.banner.rotation.x = 0;
		this.banner.rotation.y = 0;
		this.banner.rotation.z = 0;

		this.banner.children[1].children.forEach(child => {
			child.position.z = 0;
		});

		this.finalizeFn();
	}
}
