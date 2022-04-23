import { Unit } from './unit';

export class Team {
  name: string;
  units: Unit[];

  currentUnitIndex = 0;

  constructor(name: string, units: Unit[]) {
    this.name = name;
    this.units = units;
  }

  get currentUnit() {
    return this.units[this.currentUnitIndex];
  }

  isEveryoneDead() {
    return this.units.every((unit) => unit.isDie);
  }

  setNextUnit() {
    this.currentUnitIndex++;
    if (this.currentUnitIndex >= this.units.length) {
      this.currentUnitIndex = 0;
    }
  }
}
