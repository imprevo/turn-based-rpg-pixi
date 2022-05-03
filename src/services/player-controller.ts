import { Team } from '../models/team';
import { Unit } from '../models/unit';
import { AttackAction } from './actions/attack-action';
import { DefenseAction } from './actions/defense-action';
import { HealAction } from './actions/heal-action';
import { BattleService } from './battle';

export class PlayerController {
  battle: BattleService;
  team: Team;

  constructor(battle: BattleService, team: Team) {
    this.team = team;
    this.battle = battle;
  }

  attack(target: Unit) {
    const action = new AttackAction(this.team, target);
    this.battle.doTurn(action);
  }

  defense() {
    const action = new DefenseAction(this.team);
    this.battle.doTurn(action);
  }

  heal(target: Unit) {
    const action = new HealAction(this.team, target);
    this.battle.doTurn(action);
  }

  checkIsTurnAvailable() {
    return this.battle.checkIsTurnAvailable(this.team);
  }

  getOpponentTeam() {
    return this.battle.getOpponentTeam(this.team);
  }
}
