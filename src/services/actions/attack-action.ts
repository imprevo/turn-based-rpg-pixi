import { Team } from '../../models/team';
import { Unit } from '../../models/unit';
import { Action } from './_action';

export class AttackAction extends Action {
  unit: Unit;
  target: Unit;

  constructor(team: Team, target: Unit) {
    super(team);
    this.unit = team.currentUnit;
    this.target = target;
  }

  execute() {
    this.unit.attack(this.target);
  }
}
