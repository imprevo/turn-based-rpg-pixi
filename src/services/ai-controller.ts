import { BattleService } from './battle';
import { wait } from '../utils/promise';
import { Unit } from '../models/unit';

const TURN_DELAY = 1000;

export class AIController {
  battle: BattleService;
  aiTeam: Unit;

  constructor(battle: BattleService, team: Unit) {
    this.aiTeam = team;
    this.battle = battle;

    this.checkTurn();
    this.addListeners();
  }

  addListeners() {
    this.battle.on('turnEnd', () => {
      this.checkTurn();
    });
  }

  async doTurn() {
    await wait(TURN_DELAY);
    this.battle.doTurn(this.aiTeam, () => {
      const target = this.battle.getOpponentTeam(this.aiTeam);
      this.aiTeam.attack(target);
    });
  }

  checkTurn() {
    if (this.battle.checkIsTurnAvailable(this.aiTeam)) {
      this.doTurn();
    }
  }
}
