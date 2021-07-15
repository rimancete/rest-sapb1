import { Cron, CronExpression } from "@nestjs/schedule";

export class Runner {
	public maxRunners = 1;
	private runnersCount = 0;

	@Cron(CronExpression.EVERY_MINUTE)
	async run() {
		if (this.runnersCount < this.maxRunners) {
			this.runnersCount++;
			try {
				await this.proccess();
			}
			finally {
				this.runnersCount--;
			}
		}
	}

	// eslint-disable-next-line @typescript-eslint/no-empty-function
	async proccess() {
	}

}