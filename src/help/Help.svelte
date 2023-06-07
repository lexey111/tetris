<script lang="ts">

	import Keys from "../keys/Keys.svelte";
</script>

<style>
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

<div id="help">
    <Keys/>
</div>
