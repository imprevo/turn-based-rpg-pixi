import * as PIXI from 'pixi.js';
import { Unit } from '../models/unit';

export class BattleService extends PIXI.utils.EventEmitter<
  'turnEnd' | 'gameover'
> {
  teams: [Unit, Unit];
  team1: Unit;
  team2: Unit;

  currentTeam: Unit;

  constructor(teams: [Unit, Unit]) {
    super();
    this.teams = teams;
    this.team1 = teams[0];
    this.team2 = teams[1];
    this.currentTeam = this.team1;
  }

  doTurn(team: Unit, action: () => void) {
    if (this.currentTeam !== team) {
      throw new Error('Not your turn!');
    }
    action();
    const winner = this.checkWinner();
    if (winner !== null) {
      this.emit('gameover', winner);
    } else {
      this.endTurn();
    }
  }

  checkWinner(): Unit | null {
    if (this.team1.isDie) {
      return this.team2;
    }
    if (this.team2.isDie) {
      return this.team1;
    }
    return null;
  }

  endTurn() {
    this.currentTeam = this.getNextTeam();
    this.emit('turnEnd');
  }

  getNextTeam() {
    return this.getOpponentTeam(this.currentTeam);
  }

  getOpponentTeam(team: Unit) {
    return this.teams.find((t) => t !== team) as Unit;
  }

  checkIsTurnAvailable(team: Unit) {
    return this.currentTeam === team;
  }
}
