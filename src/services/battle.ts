import * as PIXI from 'pixi.js';
import { Unit } from '../models/unit';

export class BattleService extends PIXI.utils.EventEmitter<
  'turnEnd' | 'gameopver'
> {
  team1: Unit;
  team2: Unit;

  currentTeam = 0;

  constructor(teams: [Unit, Unit]) {
    super();
    this.team1 = teams[0];
    this.team2 = teams[1];
  }

  doTurn(team: number, action: () => void) {
    if (this.currentTeam !== team) {
      throw new Error('Not your turn!');
    }
    action();
    const winner = this.checkWinner();
    if (winner !== null) {
      this.emit('gameopver', winner);
    } else {
      this.endTurn();
    }
  }

  checkWinner() {
    if (this.team1.isDie) {
      return 1;
    }
    if (this.team2.isDie) {
      return 0;
    }
    return null;
  }

  endTurn() {
    this.currentTeam = this.currentTeam === 0 ? 1 : 0;
    this.emit('turnEnd');
  }
}
