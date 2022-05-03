import * as PIXI from 'pixi.js';
import { Team } from '../models/team';
import { Action } from './actions/_action';
import { TurnSystem } from './turn-system';

export class BattleService extends PIXI.utils.EventEmitter<
  'turnStart' | 'gameover'
> {
  teams: [Team, Team];
  team1: Team;
  team2: Team;
  turnSystem: TurnSystem;

  constructor(teams: [Team, Team]) {
    super();
    this.teams = teams;
    this.turnSystem = new TurnSystem(teams);
    this.team1 = teams[0];
    this.team2 = teams[1];
  }

  init() {
    this.startTurn();
  }

  startTurn() {
    this.turnSystem.startTurn();
    this.emit('turnStart');
  }

  endTurn() {
    this.turnSystem.endTurn();
  }

  async doTurn(action: Action) {
    await this.turnSystem.doTurn(action);

    const winner = this.checkWinner();
    if (winner !== null) {
      this.emit('gameover', winner);
    } else {
      this.endTurn();
      this.startTurn();
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

  getOpponentTeam(team: Team) {
    return this.turnSystem.getOpponentTeam(team);
  }

  checkIsTurnAvailable(team: Team) {
    return this.turnSystem.checkIsTurnAvailable(team);
  }
}
