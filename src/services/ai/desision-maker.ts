import { Unit } from '../../models/unit';
import { getRandomInt } from '../../utils/math';
import { ActionCreator } from '../actions/_action';
import { TeamController } from '../team-controller';

type ActionWithWeight = {
  action: ActionCreator;
  weight: number;
};

type RangeActionItem = {
  action: ActionCreator;
  value: number;
};

export class DecisionMaker {
  constructor(public teamCtrl: TeamController) {}

  get team() {
    return this.teamCtrl.team;
  }

  get enemyTeam() {
    return this.teamCtrl.getOpponentTeam();
  }

  chooseNextAction() {
    const actionWeights = this.getAvailableActionsWithWeight();
    const range = this.calcActionsWithRange(actionWeights);
    const rnd = Math.random();
    const actionWithWeight = range.find(({ value }) => value > rnd);
    return actionWithWeight ? actionWithWeight.action : null;
  }

  getAvailableActionsWithWeight(): ActionWithWeight[] {
    return [
      this.getAoeAttackAction(),
      this.getAoeAttackAction(),
      this.getDefenseAction(),
      this.getHealAction(),
      this.getReviveAction(),
    ].filter((action): action is ActionWithWeight => action !== null);
  }

  getAttackAction(): ActionWithWeight | null {
    const action = this.teamCtrl.createAttackAC();
    if (action.canCreate()) {
      action.setTarget(this.findSomeUnit(action.targets));
      return { action, weight: 1 };
    }
    return null;
  }

  getAoeAttackAction(): ActionWithWeight | null {
    const action = this.teamCtrl.createAoeAttackAC();
    if (action.canCreate() && this.hasTargets(action.targets, 2)) {
      return { action, weight: 1 };
    }
    return null;
  }

  getDefenseAction(): ActionWithWeight | null {
    const action = this.teamCtrl.createDefenseAC();
    if (action.canCreate() && this.isUnitHasEnoughHP()) {
      return { action, weight: 0.5 };
    }
    return null;
  }

  getHealAction(): ActionWithWeight | null {
    const action = this.teamCtrl.createHealAC();
    const targets = this.getTargetsToHeal(action.targets);
    if (action.canCreate() && this.hasTargets(targets, 1)) {
      action.setTarget(this.findUnitToHeal(targets));
      return { action, weight: 1.5 };
    }

    return null;
  }

  getReviveAction(): ActionWithWeight | null {
    const action = this.teamCtrl.createReviveAC();
    if (action.canCreate() && this.hasTargets(action.targets, 1)) {
      action.setTarget(this.findSomeUnit(action.targets));
      return { action, weight: 2 };
    }

    return null;
  }

  calcActionsWithRange(actionWeights: ActionWithWeight[]) {
    const sum = actionWeights.reduce((sum, item) => sum + item.weight, 0);
    let prevValue = 0;

    return actionWeights.map<RangeActionItem>(({ action, weight }) => {
      const value = prevValue + weight;
      prevValue = value;
      return { action, value: value / sum };
    });
  }

  isUnitHasEnoughHP() {
    return this.team.currentUnit.stats.hp > 1;
  }

  hasTargetsToAoeAttack() {
    return this.enemyTeam.getAliveUnits().length > 1;
  }

  getTargetsToHeal(units: Unit[]) {
    return units.filter((unit) => (unit.stats.hpMax - unit.stats.hp) / 2 > 1);
  }

  hasTargets(targets: Unit[], min: number) {
    return targets.length >= min;
  }

  findSomeUnit(units: Unit[]) {
    return units[getRandomInt(0, units.length - 1)];
  }

  findUnitToHeal(units: Unit[]) {
    const unitsSortedByHP = units.sort((a, b) => {
      const hpA = a.stats.hp;
      const hpB = b.stats.hp;
      if (hpA === hpB) return 0;
      return hpA > hpB ? 1 : -1;
    });
    return unitsSortedByHP[0];
  }
}
