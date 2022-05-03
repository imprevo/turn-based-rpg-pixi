import { Team } from '../../models/team';
import { Unit } from '../../models/unit';
import { Action } from './_action';

export class HealAction extends Action {
  unit: Unit;
  target: Unit;

  constructor(team: Team, target: Unit) {
    super(team, 1);
    this.unit = team.currentUnit;
    this.target = target;
  }

  execute() {
    this.target.heal();
  }
}
