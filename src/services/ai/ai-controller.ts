import { BattleService } from '../battle';
import { wait } from '../../utils/promise';
import { getRandomInt } from '../../utils/math';
import { TeamController } from '../team-controller';
import { Unit } from '../../models/unit';
import { AiActionType } from './action-type';
import { DecisionMaker } from './desision-maker';

const TURN_DELAY = 500;

export class AIController {
  battle: BattleService;
  teamCtrl: TeamController;
  decisionMaker: DecisionMaker;

  constructor(battle: BattleService, teamCtrl: TeamController) {
    this.teamCtrl = teamCtrl;
    this.battle = battle;
    this.decisionMaker = new DecisionMaker(this.team, this.enemyTeam);

    this.checkTurn();
    this.addListeners();
  }

  get team() {
    return this.teamCtrl.team;
  }

  get enemyTeam() {
    return this.teamCtrl.getOpponentTeam();
  }

  addListeners() {
    this.battle.on('readyForAction', () => {
      this.checkTurn();
    });
  }

  async doTurn() {
    await wait(TURN_DELAY);
    const actionType = this.decisionMaker.chooseNextAction();

    switch (actionType) {
      case AiActionType.ATTACK:
        this.attack();
        break;
      case AiActionType.AOE_ATTACK:
        this.aoeAttack();
        break;
      case AiActionType.DEFENSE:
        this.defense();
        break;
      case AiActionType.HEAL:
        this.heal();
        break;
      case AiActionType.REVIVE:
        this.revive();
        break;
      case AiActionType.SKIP_TURN:
        this.skipTurn();
        break;

      default:
        throw new Error(`Unknown action "${AiActionType[actionType]}"`);
    }
  }

  checkTurn() {
    if (this.teamCtrl.checkIsTurnAvailable()) {
      this.doTurn();
    }
  }

  attack() {
    const units = this.enemyTeam.getAliveUnits();
    const target = this.findSomeUnit(units);
    this.teamCtrl.attack(target);
  }

  aoeAttack() {
    const targets = this.enemyTeam.getAliveUnits();
    this.teamCtrl.aoeAttack(targets);
  }

  defense() {
    this.teamCtrl.defense();
  }

  heal() {
    const units = this.team.getAliveUnits();
    const target = this.findUnitToHeal(units);
    this.teamCtrl.heal(target);
  }

  revive() {
    const units = this.team.getDeadUnits();
    const target = this.findSomeUnit(units);
    this.teamCtrl.revive(target);
  }

  skipTurn() {
    this.teamCtrl.skipTurn();
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
