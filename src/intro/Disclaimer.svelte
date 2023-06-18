<script>
	import {onDestroy, onMount} from "svelte";
	import Key from "../keys/single-key/Key.svelte";

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
		font-size: 1.6vh;
		width: fit-content;
	}

	h1 {
		font-weight: normal;
		text-transform: uppercase;
		font-size: 4em;
		color: #FF0088;
	}

	p {
		margin-top: 4em;
		color: #FF0088;
	}

	ul {
		margin: 1em;
		padding: 1em;
	}

	li::marker {
		content: '—  ';
		font-size: 1.2em;
		color: #FF0088;
	}

	ul li {
		margin-bottom: 1em;
	}

	#keyset {
		display: flex;
		flex-flow: column nowrap;
		font-style: italic;
		align-items: center;
		justify-items: center;
		align-content: center;
		justify-content: center;
		margin-top: 2em;
		padding-top: 2em;
		border-top: 2px dotted #FF0088;
		/*opacity: 0;*/
        overflow: hidden;
        /*transition: all 1s ease;*/
	}

    :global(#keyset canvas) {
        height: 80px;
	    animation: show 2s forwards running ease-in;
    }

	@keyframes show {
		0% {
			opacity: 1;
			max-height: 0;
		}
		100% {
			opacity: 1;
			height: 80px;
			max-height: 200px;
		}
	}

	p.aftertext {
		margin: 1em 0 0 0;
		color: #FF0088;
        text-align: center;
	}

</style>

<div id="disclaimer-container" on:click={onHide}>
    <div id="disclaimer">
        <div id="disclaimer-content">
            <h1>Disclaimer</h1>
            <ul>
                <li>
                    This is just a demo.
                </li>
                <li>
                    This is my first game.
                </li>
                <li>
                    This is my first 3D WebGL experience.
                </li>
                <li>
                    If you're having performance issues, especially in Safari, <br/>plug in a power adapter or/and use
                    Chrome.
                </li>
                <li>
                    Don't worry; be happy.
                </li>
            </ul>
            <div id="keyset">
                <Key size={80} keyColor={0xeeeeee} textColor={0x888888} rotate={true} delay={500}/>
            </div>
            <p class="aftertext">or click anywhere to continue</p>
        </div>
    </div>
</div>
