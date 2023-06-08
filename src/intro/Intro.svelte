<script lang="ts">
	//
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
		margin: 0 auto;

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
		justify-content: center;
		position: relative;
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
		clip-path: polygon(0% 0%, calc(100% - 20px) 20px, 100% 0%, 100% calc(100% - 40px), 0 calc(100% - 20px), 0% 0%);
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
		background-color: rgba(0, 0, 0, .3);
		clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 0%);
		border-top-right-radius: 6px;
	}

	#layer-1 {
		background: linear-gradient(to bottom right, #ffa600, #653d02);
		border-top-left-radius: 26px;
	}

	#layer-2 {
		background: linear-gradient(to bottom right, #034c80, #012d4b);
	}

	#layer-3 {
		background: linear-gradient(to bottom right, #ddff00, #687704);
		border-top-right-radius: 26px;
	}

	#layer-4 {
		background: linear-gradient(to bottom right, #ff0088, #6e023c);
		border-top-right-radius: 26px;
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
        <h1>First</h1>
    </div>
    <div id="layer-2" class="page">
        <!--        <Scene/>-->
    </div>
    <div id="layer-3" class="page">
        <!--        <Scene/>-->
    </div>
    <div id="layer-4" class="page">
        <h1>Third</h1>
        <p>
            &copy; 2023 Oleksii Koshkin
        </p>
    </div>
</div>
