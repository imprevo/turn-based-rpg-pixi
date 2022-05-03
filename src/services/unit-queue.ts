import { Unit } from '../models/unit';

export class UnitQueue {
  units: Unit[];
  currentUnit: Unit;

  isFirstTurn = true;

  constructor(units: Unit[]) {
    this.units = units;
    this.currentUnit = units[0];
  }

  startTurn() {
    // need to skip because in the first turn unit has already been setted
    if (!this.isFirstTurn) {
      this.currentUnit = this.getNextUnit();
    }
    this.isFirstTurn = false;
    this.currentUnit.setActive(true);
  }

  endTurn() {
    this.currentUnit.setActive(false);
  }

  getNextUnit() {
    const currentUnitIndex = this.units.findIndex(
      (unit) => unit === this.currentUnit
    );

    const nextAliveUnits = this.units
      .slice(currentUnitIndex + 1, this.units.length)
      .concat(this.units.slice(0, currentUnitIndex + 1))
      .filter((unit) => !unit.isDead);

    return nextAliveUnits[0];
  }
}
