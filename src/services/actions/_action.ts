import { Team } from '../../models/team';

const DEFAULT_DELAY = 1000;

export abstract class Action {
  team: Team;
  delay: number;

  constructor(team: Team, delay = DEFAULT_DELAY) {
    this.team = team;
    this.delay = delay;
  }

  abstract execute(): void;
}
