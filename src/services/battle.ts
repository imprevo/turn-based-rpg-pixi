import * as PIXI from 'pixi.js';
import { Unit } from '../models/unit';
import { wait } from '../utils/promise';

export class BattleService extends PIXI.utils.EventEmitter<
  'turnEnd' | 'gameopver'
> {
  player: Unit;
  enemy: Unit;

  current: 'player' | 'enemy' = 'player';

  constructor() {
    super();
    this.player = new Unit('Player', 5, 2);
    this.enemy = new Unit('Enemy', 5, 2);
  }

  playerTurn() {
    if (this.enemy.isDie) {
      this.emit('gameopver');
    } else {
      this.endTurn();
      this.enemyTurn();
    }
  }

  async enemyTurn() {
    await wait(500);
    this.enemy.attack(this.player);
    if (this.player.isDie) {
      this.emit('gameopver');
    } else {
      await wait(500);
      this.endTurn();
    }
  }

  endTurn() {
    this.current = this.current === 'player' ? 'enemy' : 'player';
    this.emit('turnEnd');
  }
}
