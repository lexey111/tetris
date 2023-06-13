export class TickManager {
	private tasks = [];
	private intervalHandler;

	constructor(private tickDuration) {

	}

	public addTask = (task: () => void) => {
		this.tasks.push(task);
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
		this.tasks.forEach(task => {
				task();
		});
	}
}
