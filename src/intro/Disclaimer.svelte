<script>
	import {onDestroy, onMount} from "svelte";

	export let onHide;

	const keyHandler = (ev) => {
		let e = ev.key;
		if (e === 'Escape') {
			onHide();
		}
	};

	onMount(() => {
		document.addEventListener("keydown", keyHandler);
	});

	onDestroy(() => {
		document.removeEventListener("keydown", keyHandler);
	});
</script>

<style>
	@keyframes appear {
		0% {
			transform: scaleY(0) translateY(-400px);
			opacity: 0;
		}
		100% {
			transform: scaleY(1) translateY(0);
			opacity: 1;
		}
	}

	#disclaimer-container {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: linear-gradient(to bottom, rgba(0, 0, 0, 1), rgba(0, 0, 0, .5));
		transform-origin: top center;
		transform: scaleY(0) translateY(-400px);
		opacity: 0;
		backdrop-filter: blur(10px);

		animation-name: appear;
		animation-iteration-count: 1;
		animation-duration: .5s;
		animation-timing-function: ease;
		animation-fill-mode: forwards;
	}

	#disclaimer {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 75vh;
		background: linear-gradient(to bottom, #2b3142, #1b1d2c);
		border-bottom: 4px solid #FF0088;
		box-shadow: 0 20px 40px rgba(0, 0, 0, .5);

		opacity: .8;
		backdrop-filter: blur(20px);

		display: flex;
		flex-flow: row nowrap;
		align-items: center;
	}

	#disclaimer-content {
		padding: 40px;
		margin: 0 auto;
		color: #ccd;
		font-size: 14px;
		width: auto;
	}

	h1 {
		font-weight: normal;
		text-transform: uppercase;
	}

	p {
		margin-top: 4em;
	}

	ul {
		margin: 0;
		padding: 1em;
	}
</style>

<div id="disclaimer-container" on:click={onHide}>
    <div id="disclaimer">
        <div id="disclaimer-content">
            <h1>Disclaimer</h1>
            <ul>
                <li>
                    This is my first game.
                </li>
                <li>
                    This is my first 3D WebGL experience.
                </li>
                <li>
                    If you're having performance issues, especially in Safari, plug in a power adapter or/and use
                    Chrome.
                </li>
            </ul>
            <p>[ESC] or click anywhere to return.</p>
        </div>
    </div>
</div>
