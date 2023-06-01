import * as THREE from "three";
export function fitCameraToObject(camera, object, offset?) {

	offset = offset || 1.5;

	const boundingBox = new THREE.Box3();

	boundingBox.setFromObject(object);

	const center = boundingBox.getCenter(new THREE.Vector3());
	const size = boundingBox.getSize(new THREE.Vector3());

	const startDistance = center.distanceTo(camera.position);
// here we must check if the screen is horizontal or vertical, because camera.fov is
// based on the vertical direction.
	const endDistance = camera.aspect > 1 ?
		((size.y / 2) + offset) / Math.abs(Math.tan(camera.fov / 2)) :
		((size.y / 2) + offset) / Math.abs(Math.tan(camera.fov / 2)) / camera.aspect;


	camera.position.set(
		camera.position.x * endDistance / startDistance,
		camera.position.y * endDistance / startDistance,
		camera.position.z * endDistance / startDistance,
	);
	camera.lookAt(center);
}
