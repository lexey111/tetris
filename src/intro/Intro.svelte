<script lang="ts">
	import {onDestroy, onMount} from "svelte";
	import {setResizeCallback} from "../scene/scene-helpers";
	import Text from "../text/Text.svelte";

	let angle;

	let textingHandler = null;
	let text = '';
	const FullText = 'TETRIS'

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
		}, 200);
	});

	onDestroy(() => {
		clearInterval(textingHandler);
	});

</script>

<style>
	#intro {
		--top-line-color: #08313f;
		--right-line-color: maroon;
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
	}

	#layer-3 {
		background: linear-gradient(to bottom right, #ddff00, #687704);
		border-top-right-radius: 26px;
		color: #343d1a;
	}

	#layer-4 {
		background: linear-gradient(to bottom right, #ff0088, #6e023c);
		border-top-right-radius: 26px;
		border-top-left-radius: 10px 20px;
	}

	.layer-content {
		padding: 40px;
		font-size: 0.9vw;
		/*font-variant: all-petite-caps;*/
		transition: font .2s ease;
		line-height: 2;
		display: flex;
		flex-flow: column nowrap;
        height: 100%;
	}

	.layer-content h1 {
		font-weight: normal;
		font-size: 4em;
	}

	.page a {
		color: #f8daa6;
		font-weight: bold;
		text-shadow: -1px 1px 0 rgba(0, 0, 0, 0.2);
		display: inline-block;
		border-bottom: 1px dashed rgba(255, 255, 255, 0.2);
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
		padding: 2px 6px;
		border: 1px dashed rgba(255, 255, 255, 0.3);
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
		font-size: 22vw;
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
	}

	.paragraph::first-letter {
		background: linear-gradient(to bottom right, rgba(255, 255, 255, .5), rgba(255, 255, 255, .2));
		border-radius: 18px;
		padding: 6px;
		min-width: 2em;
		font-size: 5.5vw;
		font-weight: bold;
		float: left;
		line-height: 1;
		margin-right: 10px;
		margin-left: -10px;
		margin-top: -10px;
		text-shadow: -1px 1px 0 rgba(0, 0, 0, 0.1);
		box-shadow: -1px 1px 0 rgba(0, 0, 0, 0.1);
		color: rgba(255, 255, 255, .7);
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
			font-size: 1.2vw;
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
		}

		.page:after {
			display: none;
		}

	}
</style>

<div id="intro">
    <div id="layer-1" class="page">
        <div class="layer-content" style:transform="skew(0, {angle}deg)">
            <p class="paragraph">
                <b>TTetris</b> is a puzzle video game created by the Soviet software engineer Alexey
                Pajitnov in <b>1985</b>. It has been published by several companies for multiple platforms, most
                prominently during a dispute over the appropriation of the rights in the late <b>1980</b>s.
            </p>
            <p>
                After a significant period of publication by Nintendo, the rights reverted to Pajitnov in <b>1996</b>,
                who co-founded the Tetris Company with Henk Rogers to manage licensing.
            </p>
            <p style="text-align: right; margin-top: 2em">
                <a href="https://en.wikipedia.org/wiki/Tetris" target="_blank">Wikipedia &rarr;</a>
            </p>
        </div>
        <div class="text-3d" style:transform="skew(0, {angle}deg)">3D</div>
    </div>
    <div id="layer-2" class="page">
        <div class="layer-content" style:transform="skew(0, {angle}deg)">
            <div id="tetris-text">
                <Text text={text} colors={[0xEEEEEE, 0x88AAEE, 0xFFA600]} scale={11}/>
            </div>
            <!--        <Scene/>-->
        </div>
    </div>
    <div id="layer-3" class="page">
        <div class="layer-content" style:transform="skew(0, {angle}deg)">
            <p class="paragraph">
                OOnce I decided to learn something completely new, as far as possible from my usual "enterprisish"
                life with <i>clouds</i>, <i>microfrontends</i>, <i>React</i>, <i>Angular</i>, <i>Agile</i> and,
                especially, <i>Scrum</i>.
            </p>
            <p>
                This page was created just for fun and relaxation from enterprise software development.
            </p>
            <p style="text-align: right; margin: 4em 0">
                <a href="https://en.wikipedia.org/wiki/Tetris" target="_blank">Read details &rarr;</a>
            </p>
            <p class="paragraph">
                &larr; Or better yet, just go play. Click the button on the blue page!
            </p>
        </div>
        <div class="text-3d" style:transform="skew(0, {angle}deg)">Tetris</div>
    </div>
    <div id="layer-4" class="page">
        <div class="layer-content" style:transform="skew(0, {angle}deg)">
            <p class="paragraph">
                WWebGL with <a href="https://threejs.org/" target="_blank">ThreeJS</a> is used here as an engine. HTML,
                CSS,
                <a href="https://svelte.dev/" target="_blank">Svelte</a> as a logic driver, <a
                    href="https://vitejs.dev/" target="_blank">Vite</a> as a bundler... nothing too complex, very usual
                set for small web-apps.
            </p>
        </div>
        <div class="text-3d" style:transform="skew(0, {angle}deg)">GL</div>
    </div>
</div>
