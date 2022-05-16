import { getRandomInt } from '../../utils/math';
import { AbilityType } from '../../models/abilities';
import { Team } from '../../models/team';
import { AiActionType } from './action-type';

export class DecisionMaker {
  constructor(public team: Team, public enemyTeam: Team) {}

  chooseNextAction(): AiActionType {
    const actions = this.getAvailableActions();

    if (!actions.length) {
      return AiActionType.SKIP_TURN;
    }

    return actions[getRandomInt(0, actions.length - 1)];
  }

  getAvailableActions() {
    const actions = [];

    if (this.canUseAbility(AbilityType.ATTACK)) {
      actions.push(AiActionType.ATTACK);
    }

    if (this.canUseAbility(AbilityType.DEFENSE) && this.isUnitHasEnoughHP()) {
      actions.push(AiActionType.DEFENSE);
    }

    if (
      this.canUseAbility(AbilityType.AOE_ATTACK) &&
      this.hasTargetsToAoeAttack()
    ) {
      actions.push(AiActionType.AOE_ATTACK);
    }

    if (this.canUseAbility(AbilityType.HEAL) && this.hasTargetsToHeal()) {
      actions.push(AiActionType.HEAL);
    }

    if (this.canUseAbility(AbilityType.REVIVE) && this.hasTargetsToRevive()) {
      actions.push(AiActionType.REVIVE);
    }

    return actions;
  }

  isUnitHasEnoughHP() {
    return this.team.currentUnit.stats.hp > 1;
  }

  hasTargetsToAoeAttack() {
    return this.enemyTeam.getAliveUnits().length > 1;
  }

  hasTargetsToHeal() {
    const damagedUnits = this.team
      .getAliveUnits()
      .filter((unit) => (unit.stats.hpMax - unit.stats.hp) / 2 > 1);
    return damagedUnits.length > 0;
  }

  hasTargetsToRevive() {
    const damagedUnits = this.team.getDeadUnits();
    return damagedUnits.length > 0;
  }

  canUseAbility(type: AbilityType) {
    const healAbility = this.team.currentUnit.abilities.getAbility(type);
    return healAbility?.canUse() || false;
  }
}
