import { Team } from '../../models/team';
import { wait } from '../../utils/promise';

const DEFAULT_DELAY = 1000;

export abstract class Action {
  team: Team;
  delay: number;
  points: number;

  constructor(team: Team, points: number, delay = DEFAULT_DELAY) {
    this.team = team;
    this.points = points;
    this.delay = delay;
  }

  async execute() {
    if (!this.canExecute()) {
      throw new Error(`Can't execute action ${this.constructor.name}!`);
    }

    await this.action();

    if (this.delay) {
      await wait(this.delay);
    }
  }

  canExecute() {
    return true;
  }

  protected abstract action(): Promise<void> | void;
}
