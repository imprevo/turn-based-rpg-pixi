import * as PIXI from 'pixi.js';

export class Stats {
  hp: number;
  hpMax: number;

  constructor(hp: number) {
    this.hp = hp;
    this.hpMax = hp;
  }
}

export class Damage {
  constructor(public physicalDamage: number) {}
}

export class Unit extends PIXI.utils.EventEmitter<
  'damage' | 'heal' | 'attack' | 'defense' | 'active' | 'miss'
> {
  name: string;
  stats: Stats;
  damage: Damage;
  isDefense = false;
  isActive = false;

  constructor(name: string, hp: number, damage: number) {
    super();
    this.name = name;
    this.stats = new Stats(hp);
    this.damage = new Damage(damage);
  }

  get isDead() {
    return this.stats.hp <= 0;
  }

  setActive(active: boolean) {
    this.isActive = active;
    this.emit('active');
  }

  attack() {
    this.shouldBeAlive();
    this.isDefense = false;
    this.emit('attack');
  }

  miss() {
    this.shouldBeAlive();
    this.isDefense = false;
    this.emit('miss');
  }

  takeDamage(damage: number, isCrit: boolean) {
    this.shouldBeAlive();
    this.stats.hp = Math.max(0, this.stats.hp - damage);
    this.isDefense = false;
    this.emit('damage', damage, isCrit);
  }

  heal(heal: number) {
    this.isDefense = false;
    this.stats.hp = Math.min(this.stats.hpMax, this.stats.hp + heal);
    this.emit('heal', heal);
  }

  defense() {
    this.shouldBeAlive();
    this.isDefense = true;
    this.emit('defense');
  }

  shouldBeAlive() {
    if (this.isDead) {
      throw new Error('Unit is dead!');
    }
  }
}
