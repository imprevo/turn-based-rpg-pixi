import { Team } from '../models/team';
import { AoeAttackActionCreator } from './actions/aoe-attack-action';
import { AttackActionCreator } from './actions/attack-action';
import { DefenseActionCreator } from './actions/defense-action';
import { HealActionCreator } from './actions/heal-action';
import { ReviveActionCreator } from './actions/revive-action';
import { ActionCreator } from './actions/_action';
import { BattleService } from './battle';

export class TeamController {
  battle: BattleService;
  team: Team;
  controlled: boolean;

  constructor(battle: BattleService, team: Team, controlled: boolean) {
    this.team = team;
    this.battle = battle;
    this.controlled = controlled;
  }

  createAttackAC() {
    const targets = this.getOpponentTeam().getAliveUnits();
    return new AttackActionCreator(this.team, targets);
  }

  createAoeAttackAC() {
    const targets = this.getOpponentTeam().getAliveUnits();
    return new AoeAttackActionCreator(this.team, targets);
  }

  createDefenseAC() {
    return new DefenseActionCreator(this.team);
  }

  createHealAC() {
    const targets = this.team.getAliveUnits();
    return new HealActionCreator(this.team, targets);
  }

  createReviveAC() {
    const targets = this.team.getDeadUnits();
    return new ReviveActionCreator(this.team, targets);
  }

  applyAction(actionCreator: ActionCreator) {
    const action = actionCreator.create();
    this.battle.doAction(action);
  }

  skipTurn() {
    // TODO: implement skip
    throw new Error('Skip turn not implemented yet.');
  }

  checkIsTurnAvailable() {
    return this.battle.checkIsTurnAvailable(this.team);
  }

  getOpponentTeam() {
    return this.battle.getOpponentTeam(this.team);
  }
}
