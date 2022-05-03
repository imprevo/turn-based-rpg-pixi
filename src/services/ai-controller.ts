import { BattleService } from './battle';
import { wait } from '../utils/promise';
import { Team } from '../models/team';
import { AttackAction } from './actions/attack-action';

const TURN_DELAY = 500;

export class AIController {
  battle: BattleService;
  aiTeam: Team;

  constructor(battle: BattleService, team: Team) {
    this.aiTeam = team;
    this.battle = battle;

    this.checkTurn();
    this.addListeners();
  }

  addListeners() {
    this.battle.on('turnStart', () => {
      this.checkTurn();
    });
  }

  async doTurn() {
    await wait(TURN_DELAY);
    const action = new AttackAction(this.aiTeam, this.findSomeTarget());
    this.battle.doTurn(action);
  }

  checkTurn() {
    if (this.battle.checkIsTurnAvailable(this.aiTeam)) {
      this.doTurn();
    }
  }

  findSomeTarget() {
    const targetTeam = this.battle.getOpponentTeam(this.aiTeam);
    const unitsAlive = targetTeam.units.filter((unit) => !unit.isDead);
    return unitsAlive[this.getRandomInt(0, unitsAlive.length - 1)];
  }

  getRandomInt(min: number, max: number) {
    return Math.floor(min + Math.random() * (max + 1 - min));
  }
}
