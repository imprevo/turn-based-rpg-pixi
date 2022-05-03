import { Team } from '../models/team';
import { Unit } from '../models/unit';

export class UnitQueue {
  team: Team;
  currentUnit: Unit;

  isFirstTurn = true;

  constructor(team: Team) {
    this.team = team;
    this.currentUnit = team.currentUnit;
  }

  startTurn() {
    // need to skip because in the first turn unit has already been setted
    if (!this.isFirstTurn) {
      this.currentUnit = this.getNextUnit();
      this.team.currentUnit = this.currentUnit;
    }
    this.isFirstTurn = false;
    this.currentUnit.setActive(true);
  }

  endTurn() {
    this.currentUnit.setActive(false);
  }

  getNextUnit() {
    const currentUnitIndex = this.team.units.findIndex(
      (unit) => unit === this.currentUnit
    );

    const nextAliveUnits = this.team.units
      .slice(currentUnitIndex + 1, this.team.units.length)
      .concat(this.team.units.slice(0, currentUnitIndex + 1))
      .filter((unit) => !unit.isDead);

    return nextAliveUnits[0];
  }
}
