<script lang="ts">
	//

	import {onDestroy, onMount} from "svelte";
	import {setResizeCallback} from "../scene/scene-helpers";
	import Score from "../score/Score.svelte";

	let angle;

	let textingHandler = null;
	let text = '';
	const FullText = 'TETRIS'

	onMount(() => {
		setResizeCallback(document.getElementById('layer-2'), (width, height) => {
			angle = (180 / Math.PI) * Math.asin(22 / (width - 22)); // default size of the bend
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
		width: 33.3%;
		display: flex;
		flex-flow: column nowrap;
		align-content: center;
		justify-content: flex-start;
		position: relative;
		border-right: 1px dashed rgba(255, 255, 255, .2);
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
		/*background-color: rgba(0, 0, 0, .3);*/
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
		color: #243401;
	}

	#layer-4 {
		background: linear-gradient(to bottom right, #ff0088, #6e023c);
		border-top-right-radius: 26px;
	}

	.layer-content {
		padding: 40px;
		font-size: 0.9vw;
		font-variant: all-petite-caps;
	}

    #tetris-text {
        width: 100%;
        display: flex;
        align-content: center;
        justify-content: center;
        margin-bottom: 40px;
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
	}
</style>

<div id="intro">
    <div id="layer-1" class="page">
        <div class="layer-content" style:transform="skew(0, {angle}deg)">
            <p>
                <b>Tetris</b> is a puzzle video game created by the Soviet software engineer Alexey
                Pajitnov in 1985.
            </p>
            <p>
                It has been published by several companies for multiple platforms, most prominently
                during a dispute over the appropriation of the rights in the late 1980s.
            </p>
            <p>
                After a significant period of
                publication by Nintendo, the rights reverted to Pajitnov in 1996, who co-founded the Tetris Company with
                Henk Rogers to manage licensing.
            </p>
        </div>
    </div>
    <div id="layer-2" class="page">
        <div class="layer-content" style:transform="skew(0, {angle}deg)">
            <div id="tetris-text">
                <Score text={text}/>
            </div>
        <!--        <Scene/>-->
        </div>
    </div>
    <div id="layer-3" class="page">
        <div class="layer-content" style:transform="skew(0, {angle}deg)">
            <h1>Last</h1>
            {angle}
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias aliquid consectetur dolorem doloribus,
                ex excepturi illum iste labore laboriosam laborum minima molestiae pariatur, placeat ratione repudiandae
                vero voluptate! Fugiat, fugit.
            </p>
            <p>Autem blanditiis ducimus eos necessitatibus! Asperiores at commodi corporis doloribus id mollitia
                nulla, suscipit tenetur velit vitae. Accusantium architecto cumque doloremque ex laudantium,
                necessitatibus, quas quibusdam quo sunt tempora voluptatibus.
            </p>
            <p>Adipisci amet architecto, autem consequatur consequuntur debitis dolore dolorum ea explicabo illo iusto
                laborum magnam nesciunt nulla perferendis placeat quam qui quis quod repellendus reprehenderit sed sint
                tenetur ut vero.
            </p>
            <p>Amet animi, et exercitationem fugiat fugit iusto, laborum minus molestiae nam nisi sit, totam
                voluptatem. Cupiditate, eum, possimus. Ab adipisci alias blanditiis dicta impedit inventore ipsam magnam
                molestias mollitia voluptatum.
            </p>
        </div>
    </div>
    <div id="layer-4" class="page">
        <div class="layer-content" style:transform="skew(0, {angle}deg)">
            <h1>Last</h1>
            {angle}
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias aliquid consectetur dolorem doloribus,
                ex excepturi illum iste labore laboriosam laborum minima molestiae pariatur, placeat ratione repudiandae
                vero voluptate! Fugiat, fugit.
            </p>
            <p>Autem blanditiis ducimus eos necessitatibus! Asperiores at commodi corporis doloribus id mollitia
                nulla, suscipit tenetur velit vitae. Accusantium architecto cumque doloremque ex laudantium,
                necessitatibus, quas quibusdam quo sunt tempora voluptatibus.
            </p>
            <p>Adipisci amet architecto, autem consequatur consequuntur debitis dolore dolorum ea explicabo illo iusto
                laborum magnam nesciunt nulla perferendis placeat quam qui quis quod repellendus reprehenderit sed sint
                tenetur ut vero.
            </p>
            <p>Amet animi, et exercitationem fugiat fugit iusto, laborum minus molestiae nam nisi sit, totam
                voluptatem. Cupiditate, eum, possimus. Ab adipisci alias blanditiis dicta impedit inventore ipsam magnam
                molestias mollitia voluptatum.
            </p>
        </div>
    </div>
</div>
