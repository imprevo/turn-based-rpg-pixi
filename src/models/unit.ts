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
  'damage' | 'heal' | 'attack' | 'active'
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
    if (this.isDead) {
      throw new Error('Unit is dead!');
    }
    this.isDefense = false;
    this.emit('attack');
  }

  takeDamage(damage: number) {
    if (this.isDead) {
      throw new Error('Unit is dead!');
    }
    this.stats.hp = Math.max(0, this.stats.hp - damage);
    this.isDefense = false;
    this.emit('damage');
  }

  heal(heal: number) {
    this.isDefense = false;
    this.stats.hp = Math.min(this.stats.hpMax, this.stats.hp + heal);
    this.emit('heal');
  }

  defense() {
    if (this.isDead) {
      throw new Error('Unit is dead!');
    }
    this.isDefense = true;
  }
}
