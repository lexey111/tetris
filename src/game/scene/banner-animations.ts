import {BannerMaterials} from "./scene-helpers";
import type {TAnimations} from "../../shared/Animations";

export class BannerAnimations implements TAnimations {

	constructor(private banner, private finalizeFn) {
		//
	}

	public getAnimation = () => {
		return {
			delay: 500, duration: 800, repeatCount: 3,
			prepareFn: this.prepareReadyBanner,
			animationFn: this.dribbleBanner,
			onCycleFn: this.onReadyCycle,
			finishFn: this.endReadyBanner
		};
	}
	public hideBanner = () => {
		this.banner.visible = false;
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

		this.banner.children[0].material = BannerMaterials[idx - 1];
		this.banner.children.forEach((text, i) => text.visible = idx === i || i === 0);
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
		})
		// banner.rotation.x = Math.sin(currentRotation) * 0.04;
	}

	private endReadyBanner = () => {
		// hardcoded access to numbers
		this.banner.children[1].children[6].visible = false; // ready? 1
		this.banner.children[1].children[7].visible = false; // ready? 2
		this.banner.children[1].children[8].visible = false; // ready? 3
		this.banner.rotation.x = 0;
		this.banner.children[1].children.forEach(child => {
			child.position.z = 0;
		});

		this.finalizeFn();
	}
}
