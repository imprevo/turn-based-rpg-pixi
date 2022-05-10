import { Team } from '../models/team';
import { wait } from '../utils/promise';
import { Action } from './actions/_action';
import { UnitQueue } from './unit-queue';

const TURN_POINTS = 2;

export class TurnSystem {
  teams: [Team, Team];
  team1: Team;
  team2: Team;
  currentTeam: Team;

  teamsQueue: [UnitQueue, UnitQueue];
  currentTeamQueue: UnitQueue;

  turnPoints: number;

  isFirstTurn = true;
  isBlocked = true;

  constructor(teams: [Team, Team]) {
    this.teams = teams;
    this.team1 = teams[0];
    this.team2 = teams[1];
    this.currentTeam = this.team1;

    this.teamsQueue = [new UnitQueue(this.team1), new UnitQueue(this.team2)];
    this.currentTeamQueue = this.teamsQueue[0];

    this.turnPoints = 0;
  }

  startTurn() {
    if (!this.isFirstTurn) {
      this.currentTeam = this.getOpponentTeam(this.currentTeam);
      this.currentTeamQueue = this.getUnitsQueueByTeam(this.currentTeam);
    }
    this.isFirstTurn = false;
    this.currentTeamQueue.startTurn();
    this.turnPoints = TURN_POINTS;
    this.isBlocked = false;
  }

  endTurn() {
    this.currentTeamQueue.endTurn();
  }

  async doAction(action: Action) {
    if (!this.checkIsTurnAvailable(action.team)) {
      throw new Error(`"${action.team.name}", this is not your turn!`);
    }

    this.isBlocked = true;
    this.turnPoints = Math.max(0, this.turnPoints - action.points);

    await action.execute();

    this.isBlocked = false;
  }

  hasTurnPoints() {
    return this.turnPoints > 0;
  }

  getUnitsQueueByTeam(team: Team) {
    return this.teamsQueue.find((queue) => queue.team === team) as UnitQueue;
  }

  getOpponentTeam(team: Team) {
    return this.teams.find((t) => t !== team) as Team;
  }

  checkIsTurnAvailable(team: Team) {
    return !this.isBlocked && this.currentTeam === team;
  }
}
