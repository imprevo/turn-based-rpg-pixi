import { AbilityType } from '../../models/abilities';
import { Team } from '../../models/team';
import { AiActionType } from './action-type';

type ActionWithWeight = {
  type: AiActionType;
  weight: number;
};

type RangeActionItem = {
  type: AiActionType;
  value: number;
};

export class DecisionMaker {
  constructor(public team: Team, public enemyTeam: Team) {}

  chooseNextAction() {
    const actionWeights = this.getAvailableActionsWithWeight();
    const range = this.calcActionsWithRange(actionWeights);
    const rnd = Math.random();
    const action = range.find(({ value }) => value > rnd);
    return action ? action.type : AiActionType.SKIP_TURN;
  }

  getAvailableActionsWithWeight() {
    const actions: ActionWithWeight[] = [];

    if (this.canUseAbility(AbilityType.ATTACK)) {
      actions.push({ type: AiActionType.ATTACK, weight: 1 });
    }

    if (this.canUseAbility(AbilityType.DEFENSE) && this.isUnitHasEnoughHP()) {
      actions.push({ type: AiActionType.DEFENSE, weight: 0.5 });
    }

    if (
      this.canUseAbility(AbilityType.AOE_ATTACK) &&
      this.hasTargetsToAoeAttack()
    ) {
      actions.push({ type: AiActionType.AOE_ATTACK, weight: 1 });
    }

    if (this.canUseAbility(AbilityType.HEAL) && this.hasTargetsToHeal()) {
      actions.push({ type: AiActionType.HEAL, weight: 1.5 });
    }

    if (this.canUseAbility(AbilityType.REVIVE) && this.hasTargetsToRevive()) {
      actions.push({ type: AiActionType.REVIVE, weight: 2 });
    }

    return actions;
  }

  calcActionsWithRange(actionWeights: ActionWithWeight[]) {
    const sum = actionWeights.reduce((sum, item) => sum + item.weight, 0);
    let prevValue = 0;

    return actionWeights.map<RangeActionItem>(({ type, weight }) => {
      const value = prevValue + weight;
      prevValue = value;
      return { type, value: value / sum };
    });
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
