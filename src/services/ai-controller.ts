import { BattleService } from './battle';
import { wait } from '../utils/promise';
import { Team } from '../models/team';

const TURN_DELAY = 1000;

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
    this.battle.on('turnEnd', () => {
      this.checkTurn();
    });
  }

  async doTurn() {
    await wait(TURN_DELAY);
    this.battle.doTurn(this.aiTeam, () => {
      const target = this.findSomeTarget();
      this.aiTeam.currentUnit.attack(target);
    });
  }

  checkTurn() {
    if (this.battle.checkIsTurnAvailable(this.aiTeam)) {
      this.doTurn();
    }
  }

  findSomeTarget() {
    const targetTeam = this.battle.getOpponentTeam(this.aiTeam);
    const unitsAlive = targetTeam.units.filter((unit) => !unit.isDie);
    return unitsAlive[this.getRandomInt(0, unitsAlive.length - 1)];
  }

  getRandomInt(min: number, max: number) {
    return Math.floor(min + Math.random() * (max + 1 - min));
  }
}
