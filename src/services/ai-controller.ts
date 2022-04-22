import { BattleService } from './battle';
import { wait } from '../utils/promise';
import { Unit } from '../models/unit';

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
    await wait(500);
    this.battle.doTurn(this.aiTeam, () => {
      const target = this.battle.getOpponentTeam(this.aiTeam);
      this.aiTeam.attack(target);
    });
    await wait(500);
  }

  checkTurn() {
    if (this.battle.currentTeam === this.aiTeam) {
      this.doTurn();
    }
  }
}
