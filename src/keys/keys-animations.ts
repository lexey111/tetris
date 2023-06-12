import type {TAnimations} from "../shared/Animations";

const maxZoom = 10;
const maxAngle = -Math.PI / 6;
const initialAngle = -Math.PI / 2;
const delta = Math.abs(maxAngle - initialAngle);

export class KeysAnimations implements TAnimations {
	constructor(private camera, private keysGrp, private onZoomFinishFn, private onRotateFinishFn) {
		//
	}

	public getAnimation = (name: 'zoom' | 'rotate') => {
		if (name === 'zoom') {
			return {
				duration: 500,
				delay: 1000,
				prepareFn: this.zoomPrepare,
				animationFn: this.zoomAnimation,
				finishFn: this.endZoomAnimation
			};
		}
		return {
			duration: 500,
			animationFn: this.rotateAnimation,
			finishFn: this.endRotateAnimation
		};
	}

	private zoomPrepare = () => {
		this.keysGrp.visible = false;
	}
	private zoomAnimation = (percentage) => {
		this.camera.zoom = (maxZoom * percentage) / 100;
		this.camera.updateProjectionMatrix();
		this.keysGrp.visible = percentage > 1;
	}

	private endZoomAnimation = () => {
		this.camera.zoom = maxZoom;
		this.camera.updateProjectionMatrix();
		this.onZoomFinishFn();
	}

	private rotateAnimation = (percentage) => {
		// PI/2 -> PI/6
		this.keysGrp.rotation.x = initialAngle + (delta * percentage) / 100;
	}

	private endRotateAnimation = () => {
		this.keysGrp.rotation.x = maxAngle;
		this.onRotateFinishFn();
	}
}
