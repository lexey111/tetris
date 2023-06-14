export function setResizeCallback(container: HTMLElement, callbackFn: (width: number, height: number) => void) {
	const resizeObserver = new ResizeObserver(entries => {
		const entry = entries.at(0);
		const {width, height} = entry.contentRect;
		callbackFn(width, height);
	});

	resizeObserver.observe(container);

	return () => resizeObserver.unobserve(container);
}
