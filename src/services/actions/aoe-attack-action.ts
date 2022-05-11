import { Ability, AbilityType } from '../../models/abilities';
import { Team } from '../../models/team';
import { Unit } from '../../models/unit';
import { wait } from '../../utils/promise';
import { Action } from './_action';

export class AoeAttackAction extends Action {
  unit: Unit;
  ability?: Ability;
  targets: Unit[];

  constructor(team: Team, targets: Unit[]) {
    super(team, 2, 0);
    this.unit = team.currentUnit;
    this.ability = this.unit.abilities.getAbility(AbilityType.AOE_ATTACK);
    this.targets = targets;
  }

  canExecute() {
    return (
      (this.ability?.canUse() || false) &&
      this.targets.length > 0 &&
      this.targets.every((target) => !target.isDead)
    );
  }

  async action() {
    this.ability?.use();

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
