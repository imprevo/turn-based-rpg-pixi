import { BattleService } from './battle';
import { wait } from '../utils/promise';

export class AIController {
  battle: BattleService;
  aiTeam: number;

  constructor(battle: BattleService, team: number) {
    this.aiTeam = team;
    this.battle = battle;

    this.checkTurn();
    this.addListeners();
  }

  get player() {
    return this.aiTeam === 0 ? this.battle.team2 : this.battle.team1;
  }

  get enemy() {
    return this.aiTeam === 0 ? this.battle.team1 : this.battle.team2;
  }

  addListeners() {
    this.battle.on('turnEnd', () => {
      this.checkTurn();
    });
  }

  async enemyTurn() {
    await wait(500);
    this.battle.doTurn(this.aiTeam, () => this.enemy.attack(this.player));
    await wait(500);
  }

  checkTurn() {
    if (this.battle.currentTeam === this.aiTeam) {
      this.enemyTurn();
    }
  }
}
