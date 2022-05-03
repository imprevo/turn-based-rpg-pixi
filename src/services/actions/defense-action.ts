import { Team } from '../../models/team';
import { Unit } from '../../models/unit';
import { Action } from './_action';

export class DefenseAction extends Action {
  unit: Unit;

  constructor(team: Team) {
    super(team);
    this.unit = team.currentUnit;
  }

  execute() {
    this.unit.defense();
  }
}
