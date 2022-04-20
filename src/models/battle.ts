import { Unit } from './unit';

export class Battle {
  player: Unit;
  enemy: Unit;

  constructor() {
    this.player = new Unit('Player', 10, 2);
    this.enemy = new Unit('Enemy', 5, 2);
  }

  init() {
    this.player.attack(this.enemy);
    this.enemy.attack(this.player);

    this.player.attack(this.enemy);
    this.enemy.attack(this.player);

    this.player.attack(this.enemy);
  }
}
