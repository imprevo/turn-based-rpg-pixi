import { Team } from '../../models/team';

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

  abstract execute(): void;
}
