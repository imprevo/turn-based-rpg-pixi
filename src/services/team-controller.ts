import { Team } from '../models/team';
import { Unit } from '../models/unit';
import { AoeAttackAction } from './actions/aoe-attack-action';
import { AttackAction } from './actions/attack-action';
import { DefenseAction } from './actions/defense-action';
import { HealAction } from './actions/heal-action';
import { ReviveAction } from './actions/revive-action';
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

  attack(target: Unit) {
    const action = new AttackAction(this.team, target);
    this.battle.doAction(action);
  }

  aoeAttack(targets: Unit[]) {
    const action = new AoeAttackAction(this.team, targets);
    this.battle.doAction(action);
  }

  defense() {
    const action = new DefenseAction(this.team);
    this.battle.doAction(action);
  }

  heal(target: Unit) {
    const action = new HealAction(this.team, target);
    this.battle.doAction(action);
  }

  revive(target: Unit) {
    const action = new ReviveAction(this.team, target);
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
