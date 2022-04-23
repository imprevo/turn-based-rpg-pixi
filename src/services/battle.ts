import * as PIXI from 'pixi.js';
import { Team } from '../models/team';

export class BattleService extends PIXI.utils.EventEmitter<
  'turnEnd' | 'gameover'
> {
  teams: [Team, Team];
  team1: Team;
  team2: Team;

  currentTeam: Team;

  constructor(teams: [Team, Team]) {
    super();
    this.teams = teams;
    this.team1 = teams[0];
    this.team2 = teams[1];
    this.currentTeam = this.team1;
  }

  doTurn(team: Team, action: () => void) {
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

  checkWinner(): Team | null {
    if (this.team1.isEveryoneDead()) {
      return this.team2;
    }
    if (this.team2.isEveryoneDead()) {
      return this.team1;
    }
    return null;
  }

  endTurn() {
    this.currentTeam = this.getNextTeam();
    this.currentTeam.setNextUnit();
    this.emit('turnEnd');
  }

  getNextTeam() {
    return this.getOpponentTeam(this.currentTeam);
  }

  getOpponentTeam(team: Team) {
    return this.teams.find((t) => t !== team) as Team;
  }

  checkIsTurnAvailable(team: Team) {
    return this.currentTeam === team;
  }
}
