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
    this.currentUnit = this.getNextUnit();
    this.team.currentUnit = this.currentUnit;
    this.isFirstTurn = false;
    this.currentUnit.startTurn();
  }

  endTurn() {
    this.currentUnit.endTurn();
  }

  getOrderedAliveUnits() {
    const { units } = this.team;

    const currentUnitIndex = units.findIndex(
      (unit) => unit === this.currentUnit
    );

    return units
      .slice(currentUnitIndex, units.length)
      .concat(units.slice(0, currentUnitIndex))
      .filter((unit) => !unit.isDead);
  }

  getNextUnit() {
    const aliveUnits = this.getOrderedAliveUnits();

    if (this.isFirstTurn || aliveUnits.length <= 1) {
      return aliveUnits[0];
    }

    return aliveUnits[1];
  }
}
