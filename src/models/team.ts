import { Unit } from './unit';

export class Team {
  name: string;
  units: Unit[];
  currentUnit: Unit;

  shouldChangeUnit = false;

  constructor(name: string, units: Unit[]) {
    this.name = name;
    this.units = units;
    this.currentUnit = units[0];
  }

  prepareForTurn() {
    // need to skip because in the first turn unit has already been setted
    if (this.shouldChangeUnit) {
      this.currentUnit = this.getNextUnit();
    }
    this.shouldChangeUnit = true;
  }

  isEveryoneDead() {
    return this.units.every((unit) => unit.isDie);
  }

  getNextUnit() {
    const currentUnitIndex = this.units.findIndex(
      (unit) => unit === this.currentUnit
    );

    const nextAliveUnits = this.units
      .slice(currentUnitIndex + 1, this.units.length)
      .concat(this.units.slice(0, currentUnitIndex + 1))
      .filter((unit) => !unit.isDie);

    return nextAliveUnits[0];
  }
}
