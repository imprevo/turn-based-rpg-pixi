import { Unit } from './unit';
import { UnitQueue } from '../services/unit-queue';

export class Team {
  name: string;
  units: Unit[];

  queue: UnitQueue;

  constructor(name: string, units: Unit[]) {
    this.name = name;
    this.units = units;
    this.queue = new UnitQueue(units);
  }

  get currentUnit() {
    return this.queue.currentUnit;
  }

  startTurn() {
    this.queue.startTurn();
  }

  endTurn() {
    this.queue.endTurn();
  }

  isEveryoneDead() {
    return this.units.every((unit) => unit.isDead);
  }
}
