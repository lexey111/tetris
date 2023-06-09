<script>
	import Symbol from "../text/Symbol.svelte";

	export let letter = '';
	const bigLetterSize = 30;
	let animation = false;
	let increment;

	function startAnimation() {
		animation = true;
		increment = Math.random() > 0.5 ? 0.02 : -0.03;
	}

	function stopAnimation() {
		animation = false;
	}
</script>

<div on:mouseenter={startAnimation} on:mouseleave={stopAnimation}>
    <Symbol {letter}
            {animation}
            {increment}
            colors={[0xEEEEEE, 0x88AAEE, 0xFFA600]}
            scale={bigLetterSize}/>
</div>
