<script>
	import Symbol from "../text/Symbol.svelte";

	export let letter = '';
	const bigLetterSize = 24;
	let animation = false;
	let direction = 'CW';

	function startAnimation() {
		animation = true;
		direction = Math.random() > 0.5 ? 'CW' : 'CCW';
	}

	function stopAnimation() {
		animation = false;
	}
</script>

<div on:mouseenter={startAnimation} on:mouseleave={stopAnimation}>
    <Symbol {letter}
            {animation}
            {direction}
            colors={[0xEEEEEE, 0x88AAEE, 0xFFA600]}
            scale={bigLetterSize}/>
</div>
