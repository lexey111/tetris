<script lang="ts">
	import {onDestroy, onMount} from "svelte";
	import {setResizeCallback} from "../scene/scene-helpers";
	import Text from "../text/Text.svelte";
	import Next from "../next/Next.svelte";
	import Disclaimer from "./Disclaimer.svelte";
	import Bouncer from "./Bouncer.svelte";
	import BigLetter from "./BigLetter.svelte";

	export let onStart;

	let angle;

	let textingHandler = null;
	let fallingHandler = null;
	let text = '';
	const FullText = 'TETRIS'

	// const figs = 'SZILTOJ'.split('');
	const figs = 'tetris'.split('');
	let fig = '';
	let figPosition = 0;
	let v = 0;

	let disclaimer = false;

	const year = new Date().getFullYear();

	onMount(() => {
		setResizeCallback(document.getElementById('layer-2'), (width, height) => {
			angle = (180 / Math.PI) * Math.asin(20 / width); // default size of the bend
		});

		textingHandler = setInterval(() => {
			if (text.length < FullText.length) {
				text = FullText.substring(0, text.length + 1);
			} else {
				clearInterval(textingHandler);
			}
		}, 1500);

		fallingHandler = setInterval(() => {
			fig = figs[figPosition++];
			if (figPosition === figs.length) {
				figPosition = 0;
			}
			v++;
		}, 3000);

	});

	onDestroy(() => {
		clearInterval(textingHandler);
		clearInterval(fallingHandler);
	});

	function showDisclaimer() {
		disclaimer = !disclaimer;
	}

</script>

<style>
	@keyframes appear {
		0% {
			transform: scaleX(0) scaleY(0) translateY(-4000px);
			opacity: 0;
		}
		50% {
			transform: scaleX(.5) scaleY(0.01) translateY(-200px);
			opacity: .2;
		}
		100% {
			transform: scaleX(1) scaleY(1) translateY(0);
			opacity: 1;
		}
	}

	#intro {
		position: absolute;
		top: 100px;
		left: 20px;
		right: 20px;
		bottom: 100px;
		max-width: 1400px;
		margin: auto;
		max-height: 900px;

		display: flex;
		flex-flow: row nowrap;
		background-color: transparent;

		transform: scaleX(0) scaleY(0);
		opacity: 0;

		transform-origin: top center;

		animation-name: appear;
		animation-delay: .5s;
		animation-iteration-count: 1;
		animation-duration: 1s;
		animation-timing-function: ease;
		animation-fill-mode: forwards;
	}

	.page {
		border-radius: 6px;
		width: 25%;
		display: flex;
		flex-flow: column nowrap;
		align-content: center;
		justify-content: flex-start;
		position: relative;
		border-right: 1px dashed rgba(255, 255, 255, .2);
		height: 100%;
	}

	#layer-1 {
		clip-path: polygon(0% 0%, calc(100% - 20px) 20px, 100% 0%, 100% calc(100% - 20px), 0 calc(100% - 40px), 0% 20px);
	}

	#layer-2 {
		clip-path: polygon(0% 0%, calc(100% - 20px) 20px, 100% 0%, 100% calc(100% - 40px), calc(100% - 20px) calc(100% - 20px), 0% calc(100% - 20px), 0% 0%);
	}

	#layer-2:after {
		clip-path: none;
		border-left: 1px dotted rgba(255, 255, 255, .2);
		box-sizing: border-box;
	}

	#layer-3 {
		clip-path: polygon(0% 0%, calc(100% - 20px) 20px, 100% 0%, 100% calc(100% - 20px), 0 calc(100% - 40px), 0% 0%);
	}

	#layer-4 {
		clip-path: polygon(0% 0%, calc(100% - 20px) 20px, 100% 0%, 100% calc(100% - 20px), 0 calc(100% - 40px), 0% 20px);
	}

	#layer-4:after {
		clip-path: none;
	}

	.page:after {
		content: '';
		display: block;
		position: absolute;
		top: 0;
		bottom: 0;
		right: 0;
		width: 22px;
		background: linear-gradient(to bottom right, rgba(0, 0, 0, .1), rgba(0, 0, 0, 0.4));
		clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 0%);
		border-top-right-radius: 6px;
	}

	#layer-1 {
		background: linear-gradient(to bottom right, #ffa600, #653d02);
		border-top-left-radius: 26px;
		color: #e7cea0;
	}

	#layer-2 {
		background: linear-gradient(to bottom right, #034c80, #012d4b);
		cursor: pointer;
	}

	#layer-3 {
		background: linear-gradient(to bottom right, #aec42b, #687704);
		border-top-right-radius: 26px;
	}

	#layer-4 {
		background: linear-gradient(to bottom right, #ff0088, #6e023c);
		border-top-right-radius: 26px;
		border-top-left-radius: 10px 20px;
	}

	.layer-content {
		padding: 40px;
		font-size: 14px;
		font-variant: all-petite-caps;
		transition: font .2s ease;
		line-height: 1.6;
		display: flex;
		flex-flow: column nowrap;
		height: 100%;
	}

	.page a {
		color: #f8daa6;
		font-weight: bold;
		text-shadow: -1px 1px 0 rgba(0, 0, 0, 0.2);
		display: inline-block;
		border-bottom: 1px dashed rgba(255, 255, 255, 0.7);
	}

	.page a:hover, .page a:active, .page a:focus {
		color: #fff !important;
		transform: translate(1px, -1px);
		text-shadow: -2px 2px 1px rgba(0, 0, 0, 0.4);
		border-bottom: 1px dashed transparent;
	}

	.page i {
		font-style: normal;
		display: inline;
		padding: 1px 4px;
		background: rgba(255, 255, 255, .2);
		/*border: 1px dashed rgba(255, 255, 255, 0.3);*/
		border-radius: 3px;
	}

	#layer-3 a {
		color: #cdfcaf;
	}

	#layer-4 a {
		color: #fcafea;
	}

	#layer-4 {
		justify-content: center;
		align-self: center;
	}

	#layer-4 .layer-content {
		height: auto;
		justify-self: center;
		align-self: center;
		display: flex;
		flex-flow: column wrap;
	}

	.text-3d {
		font-size: 350px;
		position: absolute;
		bottom: -20px;
		left: -60px;
		right: -20px;
		overflow: hidden;
		opacity: .1;
		display: flex;
		line-height: 1;
		align-content: center;
		justify-content: center;
		font-weight: bold;
		letter-spacing: -2vw;
		z-index: -1;
	}

	#tetris-text {
		width: 100%;
		display: flex;
		align-content: center;
		justify-content: center;
		margin-bottom: 40px;
        transform: scale(.8);
	}

	.go-link {
		margin-top: 2em;
		border: 2px solid rgba(255, 255, 255, .4);
		border-radius: 40px;
		padding: 6px 0 6px 12px;
	}

	.go-link a {
		border: none !important;
	}
	.big-letter {
		float: left;
		background: linear-gradient(to bottom right, rgba(255, 255, 255, .5), rgba(255, 255, 255, .2));
		box-shadow: -1px 1px 0 rgba(0, 0, 0, 0.2);
		border-radius: 18px;
		padding: 4px;
		margin-right: 10px;
		margin-left: -10px;
		margin-top: -5px;
	}

	#bouncer-container {
		height: 100%;
	}

	#next-container {
		position: relative;
		margin-top: 2em;
		cursor: pointer;
	}

	#layer-2 .text-3d {
		justify-content: flex-end;
		bottom: -40px;
		transform: none !important;
	}

	#layer-3 .text-3d {
		justify-content: flex-start;
	}

	@media screen and (max-width: 1280px) {
		#layer-1 {
			display: none;
		}

		.page {
			width: 33%;
		}
	}

	@media screen and (max-width: 960px) {
		#layer-4 {
			display: none;
		}

		.page {
			width: 50%;
		}

		.layer-content {
			/*font-size: 1.5vw;*/
		}
	}

	@media screen and (max-width: 600px) {
		#intro {
			top: 0;
			left: 0;
			bottom: 0;
			right: 0;
			max-height: unset;
		}

		#layer-3 {
			display: none;
		}

		.layer-content {
			transform: none !important;
		}

		#layer-2 {
			clip-path: none;
			width: 100%;
			border: none;
			border-radius: 0;
			min-height: unset;
			height: 100%;
			overflow: hidden;
		}

		.page:after {
			display: none;
		}

	}
</style>

<div id="intro">
    <div id="layer-1" class="page">
        <div class="layer-content" style:transform="skew(0, {angle}deg)">
            <p>
                <span class="big-letter">
                    <BigLetter letter="T"/>
                </span>
                <b>Tetris</b> is a puzzle video game created by the Soviet software engineer Alexey
                Pajitnov in <b>1985</b>. It has been published by several companies for multiple platforms, most
                prominently during a dispute over the appropriation of the rights in the late <b>1980</b>s.
            </p>
            <p>
                After a significant period of publication by Nintendo, the rights reverted to Pajitnov in <b>1996</b>,
                who co-founded the Tetris Company with Henk Rogers to manage licensing.
            </p>
            <p class="go-link">
                <a href="https://en.wikipedia.org/wiki/Tetris" target="_blank">Wikipedia &rarr;</a>
            </p>
        </div>
        <div class="text-3d" style:transform="skew(0, {angle}deg)">3D</div>
    </div>
    <div id="layer-2" class="page" on:click={onStart}>
        <div class="layer-content" style:transform="skew(0, {angle}deg)">
            <div id="tetris-text">
                <Text text={text} colors={[0xEEEEEE, 0x88AAEE, 0xFFA600]} scale={10}/>
            </div>
            <div id="bouncer-container">
                <Bouncer/>
            </div>
        </div>
        <div class="text-3d" style:transform="skew(0, {angle}deg)">Tet</div>
    </div>
    <div id="layer-3" class="page">
        <div class="layer-content" style:transform="skew(0, {angle}deg)">
            <p>
                <span class="big-letter">
                    <BigLetter letter="O"/>
                </span>
                Once I decided to learn something completely new, as far as possible from my usual "enterprisish"
                life with <i>clouds</i>, <i>microfrontends</i>, <i>React</i>, <i>Angular</i>, <i>Agile</i> and,
                especially, <i>Scrum</i>.
            </p>
            <p>
                This page was created just for fun and relaxation from enterprise software development,
                but you can consider this as my CV :)
            </p>
            <p class="go-link">
                <a href="https://en.wikipedia.org/wiki/Tetris" target="_blank">Read details &rarr;</a>
            </p>
            <p>
                &larr; Or better yet, just go and play. Press the button on the blue page and see how long you last.
            </p>
            <p>
                &copy; {year}, Oleksii Koshkin
            </p>
        </div>
        <div class="text-3d" style:transform="skew(0, {angle}deg)">&nbsp;ris</div>
    </div>
    <div id="layer-4" class="page">
        <div class="layer-content" style:transform="skew(0, {angle}deg)">
            <p>
                <span class="big-letter">
                    <BigLetter letter="W"/>
                </span>
                WebGL with <a href="https://threejs.org/" target="_blank">ThreeJS</a> is used here as an engine. HTML,
                CSS,
                <a href="https://svelte.dev/" target="_blank">Svelte</a> as a logic driver, <a
                    href="https://vitejs.dev/" target="_blank">Vite</a> as a bundler... nothing too complex, very usual
                set for small web-apps.
            </p>

            <div id="next-container" on:click={onStart}>
                <Next accent={'#FF0088'} type={fig} rnd={v}/>
            </div>

            <p class="go-link">
                <a href="#" on:click={showDisclaimer}>&uparrow; Disclaimer</a>
            </p>
        </div>
        <div class="text-3d" style:transform="skew(0, {angle}deg)">GL</div>
    </div>
</div>

{#if disclaimer}
    <Disclaimer onHide={showDisclaimer}/>
{/if}
