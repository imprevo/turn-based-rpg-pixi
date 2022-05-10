import { Team } from '../../models/team';
import { Unit } from '../../models/unit';
import { Action } from './_action';

export class AttackAction extends Action {
  unit: Unit;
  target: Unit;

  constructor(team: Team, target: Unit) {
    super(team, 2);
    this.unit = team.currentUnit;
    this.target = target;
  }

  canExecute() {
    return !this.target.isDead;
  }

  action() {
    this.target.takeDamage(this.calculateDamage());
    this.unit.attack();
  }

  calculateDamage() {
    let actualDamage = this.unit.damage.physicalDamage;

    if (this.target.isDefense) {
      actualDamage = Math.floor(actualDamage / 2);
    }

    return Math.max(0, actualDamage);
  }
}
