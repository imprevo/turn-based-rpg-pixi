import { BattleConfig, TeamConfig } from '../models/battle-config';
import { Team } from '../models/team';
import { Unit } from '../models/unit';
import { BattleService } from './battle';

export class BattleCreator {
  createBattle(data: BattleConfig) {
    const team1 = this.createTeam(data.team1);
    const team2 = this.createTeam(data.team2);

    const battle = new BattleService([team1, team2]);

    return battle;
  }

  createTeam(data: TeamConfig) {
    return new Team(data.name, this.createUnits(data.name, data.unitCount));
  }

  createUnits(prefix: string, count: number) {
    const units: Unit[] = [];

    for (let index = 0; index < count; index++) {
      units.push(new Unit(`${prefix} ${index + 1}`, 5, 2));
    }

    return units;
  }
}
