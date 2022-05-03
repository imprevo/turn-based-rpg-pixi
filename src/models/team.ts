import { Unit } from './unit';

export class Team {
  name: string;
  units: Unit[];
  currentUnit: Unit;

  constructor(name: string, units: Unit[]) {
    this.name = name;
    this.units = units;
    this.currentUnit = units[0];
  }

  isEveryoneDead() {
    return this.units.every((unit) => unit.isDead);
  }
}
