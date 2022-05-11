import { Team } from '../../models/team';
import { Unit } from '../../models/unit';
import { wait } from '../../utils/promise';
import { Action } from './_action';

export class AoeAttackAction extends Action {
  unit: Unit;
  targets: Unit[];

  constructor(team: Team, targets: Unit[]) {
    super(team, 2, 0);
    this.unit = team.currentUnit;
    this.targets = targets;
  }

  canExecute() {
    return (
      this.targets.length > 0 && this.targets.every((target) => !target.isDead)
    );
  }

  async action() {
    for (const target of this.targets) {
      target.takeDamage(this.calculateDamage(target), false);
      this.unit.attack();
      await wait(1000);
    }
  }

  calculateDamage(target: Unit) {
    let actualDamage = Math.floor(this.unit.damage.physicalDamage / 2);

    if (target.isDefense) {
      actualDamage = Math.floor(actualDamage / 2);
    }

    return Math.max(0, actualDamage);
  }
}
