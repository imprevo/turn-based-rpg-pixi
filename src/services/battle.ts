import * as PIXI from 'pixi.js';
import { Team } from '../models/team';
import { wait } from '../utils/promise';

const TURN_DELAY = 1000;

export class BattleService extends PIXI.utils.EventEmitter<
  'turnEnd' | 'gameover'
> {
  teams: [Team, Team];
  team1: Team;
  team2: Team;

  currentTeam: Team | null;

  constructor(teams: [Team, Team]) {
    super();
    this.teams = teams;
    this.team1 = teams[0];
    this.team2 = teams[1];
    this.currentTeam = null;
  }

  init() {
    this.currentTeam = this.team1;
    this.currentTeam.beforeTurn();
    this.emit('turnEnd');
  }

  async doTurn(team: Team, action: () => void) {
    if (this.currentTeam !== team) {
      throw new Error('Not your turn!');
    }
    this.currentTeam = null;
    // TODO: wait for animation
    action();
    await wait(TURN_DELAY);
    team.afterTurn();
    const winner = this.checkWinner();
    if (winner !== null) {
      this.emit('gameover', winner);
    } else {
      this.endTurn(team);
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

  endTurn(team: Team) {
    this.currentTeam = this.getOpponentTeam(team);
    this.currentTeam.beforeTurn();
    this.emit('turnEnd');
  }

  getOpponentTeam(team: Team) {
    return this.teams.find((t) => t !== team) as Team;
  }

  checkIsTurnAvailable(team: Team) {
    return this.currentTeam === team;
  }
}
