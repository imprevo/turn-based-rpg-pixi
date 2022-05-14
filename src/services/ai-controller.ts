import { BattleService } from './battle';
import { wait } from '../utils/promise';
import { TeamController } from './team-controller';
import { Unit } from '../models/unit';

const TURN_DELAY = 500;

enum ActionType {
  ATTACK,
  AOE_ATTACK,
  DEFENSE,
  HEAL,
  REVIVE,
}

export class AIController {
  battle: BattleService;
  teamCtrl: TeamController;

  constructor(battle: BattleService, teamCtrl: TeamController) {
    this.teamCtrl = teamCtrl;
    this.battle = battle;

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
    const actionType = this.chooseNextAction();

    switch (actionType) {
      case ActionType.ATTACK:
        this.attack();
        break;
      case ActionType.AOE_ATTACK:
        this.aoeAttack();
        break;
      case ActionType.DEFENSE:
        this.defense();
        break;
      case ActionType.HEAL:
        this.heal();
        break;
      case ActionType.REVIVE:
        this.revive();
        break;

      default:
        throw new Error(`Unknown action "${ActionType[actionType]}"`);
    }
  }

  checkTurn() {
    if (this.teamCtrl.checkIsTurnAvailable()) {
      this.doTurn();
    }
  }

  chooseNextAction(): ActionType {
    // TODO: get ability to check .canUse()
    const random = Math.random();
    if (random < 0.2) {
      return ActionType.DEFENSE;
    }
    return ActionType.ATTACK;
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
    const target = this.findSomeUnit(units);
    this.teamCtrl.heal(target);
  }

  revive() {
    const units = this.team.getDeadUnits();
    const target = this.findSomeUnit(units);
    this.teamCtrl.revive(target);
  }

  findSomeUnit(units: Unit[]) {
    return units[this.getRandomInt(0, units.length - 1)];
  }

  getRandomInt(min: number, max: number) {
    return Math.floor(min + Math.random() * (max + 1 - min));
  }
}
