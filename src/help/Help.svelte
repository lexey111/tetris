<script lang="ts">

</script>

<style>
	#help-content {
		margin-top: auto;
		width: 100%;
		display: flex;
		flex-flow: row nowrap;
		height: 100px;
		background: #06191f;
		justify-content: center;
		position: relative;
		flex-grow: 0;
		flex-shrink: 0;
		overflow: hidden;
	}

	#help-content:before {
		display: block;
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 16px;
		background: linear-gradient(to bottom, #020b0c, #06191f);
	}

	#help {
		display: flex;
		flex-flow: row nowrap;
		align-items: center;
		justify-content: center;
		max-width: 80%;
		min-width: 960px;
		overflow: hidden;
		font-size: 12px;
		height: 100%;
		color: #777;
	}

	#help div {
		margin-right: 20px;
	}

	#help div:last-child {
		margin-right: 0;
	}
</style>

<div id="help-content">
    <div id="help">
        <div>
            Left Right
        </div>
        <div>
            Drop
        </div>
        <div>
            Pause
        </div>
    </div>
</div>
