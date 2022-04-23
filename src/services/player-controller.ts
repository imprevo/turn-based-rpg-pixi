import { Team } from '../models/team';
import { Unit } from '../models/unit';
import { BattleService } from './battle';

export class PlayerController {
  battle: BattleService;
  team: Team;

  constructor(battle: BattleService, team: Team) {
    this.team = team;
    this.battle = battle;
  }

  get currentUnit() {
    return this.team.currentUnit;
  }

  attack(target: Unit) {
    this.battle.doTurn(this.team, () => {
      this.currentUnit.attack(target);
    });
  }

  defense() {
    this.battle.doTurn(this.team, () => {
      this.currentUnit.defense();
    });
  }

  heal(target: Unit) {
    this.battle.doTurn(this.team, () => {
      target.heal();
    });
  }

  checkIsTurnAvailable() {
    return this.battle.checkIsTurnAvailable(this.team);
  }

  getOpponentTeam() {
    return this.battle.getOpponentTeam(this.team);
  }
}
