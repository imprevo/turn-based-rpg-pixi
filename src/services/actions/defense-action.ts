import { Ability, AbilityType } from '../../models/abilities';
import { Team } from '../../models/team';
import { Unit } from '../../models/unit';
import { Action } from './_action';

export class DefenseAction extends Action {
  unit: Unit;
  ability?: Ability;

  constructor(team: Team) {
    super(team, 2);
    this.unit = team.currentUnit;
    this.ability = this.unit.abilities.getAbility(AbilityType.DEFENSE);
  }

  canExecute() {
    return this.ability?.canUse() || false;
  }

  action() {
    this.ability?.use();
    this.unit.defense();
  }
}
