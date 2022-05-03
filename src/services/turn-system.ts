import { Team } from '../models/team';
import { wait } from '../utils/promise';
import { UnitQueue } from './unit-queue';

const TURN_DELAY = 1000;

export class TurnSystem {
  teams: [Team, Team];
  team1: Team;
  team2: Team;
  currentTeam: Team;

  teamsQueue: [UnitQueue, UnitQueue];
  currentTeamQueue: UnitQueue;

  isFirstTurn = true;
  isBlocked = false;

  constructor(teams: [Team, Team]) {
    this.teams = teams;
    this.team1 = teams[0];
    this.team2 = teams[1];
    this.currentTeam = this.team1;

    this.teamsQueue = [new UnitQueue(this.team1), new UnitQueue(this.team2)];
    this.currentTeamQueue = this.teamsQueue[0];
  }

  startTurn() {
    if (!this.isFirstTurn) {
      this.currentTeam = this.getOpponentTeam(this.currentTeam);
      this.currentTeamQueue = this.getUnitsQueueByTeam(this.currentTeam);
    }
    this.isFirstTurn = false;
    this.currentTeamQueue.startTurn();
  }

  endTurn() {
    this.currentTeamQueue.endTurn();
  }

  async doTurn(team: Team, action: () => void) {
    if (!this.checkIsTurnAvailable(team)) {
      throw new Error(`"${team.name}", this is not your turn!`);
    }

    this.isBlocked = true;

    action();
    // TODO: wait for animation
    await wait(TURN_DELAY);

    this.isBlocked = false;
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
