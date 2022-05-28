import { Ability, AbilityType } from '../../models/abilities';
import { Team } from '../../models/team';
import { Unit } from '../../models/unit';
import { Action, TargetActionCreator } from './_action';

class HealAction extends Action {
  unit: Unit;
  ability?: Ability;
  target: Unit;
  heal = 2;

  constructor(team: Team, target: Unit) {
    super(team, 1);
    this.unit = team.currentUnit;
    this.ability = this.unit.abilities.getAbility(AbilityType.HEAL);
    this.target = target;
  }

  canExecute() {
    return (this.ability?.canUse() || false) && !this.target.isDead;
  }

  action() {
    this.ability?.use();
    this.target.heal(this.heal);
  }
}

export class HealActionCreator extends TargetActionCreator {
  constructor(team: Team, targets: Unit[]) {
    super(team, AbilityType.HEAL, targets);
  }

  create() {
    if (!this.target) throw new Error('Has no target!');
    return new HealAction(this.team, this.target);
  }
}
