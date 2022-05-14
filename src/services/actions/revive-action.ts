import { Ability, AbilityType } from '../../models/abilities';
import { Team } from '../../models/team';
import { Unit } from '../../models/unit';
import { Action } from './_action';

export class ReviveAction extends Action {
  unit: Unit;
  ability?: Ability;
  target: Unit;
  heal = 2;

  constructor(team: Team, target: Unit) {
    super(team, 1);
    this.unit = team.currentUnit;
    this.ability = this.unit.abilities.getAbility(AbilityType.REVIVE);
    this.target = target;
  }

  canExecute() {
    return (this.ability?.canUse() || false) && this.target.isDead;
  }

  action() {
    this.ability?.use();
    this.target.heal(this.heal);
  }
}
