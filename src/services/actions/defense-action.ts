import { Team } from '../../models/team';
import { Unit } from '../../models/unit';
import { Action } from './_action';

export class DefenseAction extends Action {
  unit: Unit;

  constructor(team: Team) {
    super(team, 2);
    this.unit = team.currentUnit;
  }

  action() {
    this.unit.defense();
  }
}
