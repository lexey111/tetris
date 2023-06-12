export class TickManager {
	private tasks = [];
	private intervalHandler;
	private phase = 1;

	constructor(private tickDuration) {

	}

	public addTask = (task: () => void, phase: number) => {
		this.tasks.push({
			task,
			phase
		});
	}

	public run = () => {
		if (!this.intervalHandler) {
			this.intervalHandler = setInterval(this.process, this.tickDuration);
		}
	}

	public stop = () => {
		clearInterval(this.intervalHandler);
		this.intervalHandler = null;
	}

	public dispose = () => {
		this.stop();
		this.tasks.length = 0;
	}

	public clearTasks = () => {
		this.tasks.length = 0;
	}

	public check = () => {
		if (this.tasks.length === 0) {
			this.stop();
		}
		this.run();
	}

	private process = () => {
		this.tasks.forEach(item => {
			if (item.phase === this.phase) {
				item.task();
			}
		});

		if (this.phase === 1) {
			this.phase = 2;
		} else {
			this.phase = 1;
		}
	}
}
