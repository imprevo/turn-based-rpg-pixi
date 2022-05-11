import { Team } from '../../models/team';
import { Unit } from '../../models/unit';
import { Action } from './_action';

export class ReviveAction extends Action {
  unit: Unit;
  target: Unit;
  heal = 2;

  constructor(team: Team, target: Unit) {
    super(team, 1);
    this.unit = team.currentUnit;
    this.target = target;
  }

  canExecute() {
    return this.target.isDead;
  }

  action() {
    this.target.heal(this.heal);
  }
}
