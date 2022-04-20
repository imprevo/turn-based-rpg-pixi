import { Unit } from '../models/unit';

export class Battle {
  player: Unit;
  enemy: Unit;

  constructor() {
    this.player = new Unit('Player', 5, 2);
    this.enemy = new Unit('Enemy', 5, 2);
  }
}
