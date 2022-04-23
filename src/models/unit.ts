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

export class Unit extends PIXI.utils.EventEmitter<'changeStats' | 'attack'> {
  name: string;
  stats: Stats;
  damage: Damage;
  defenseValue = 1;
  isDefense = false;

  constructor(name: string, hp: number, damage: number) {
    super();
    this.name = name;
    this.stats = new Stats(hp);
    this.damage = new Damage(damage);
  }

  attack(target: Unit) {
    if (this.isDie) {
      throw new Error('Unit is dead!');
    }
    this.isDefense = false;
    target.takeDamage(this.damage);
    this.emit('attack');
  }

  takeDamage(damage: Damage) {
    this.stats.hp -= this.calculateDamage(damage);
    this.isDefense = false;
    this.emit('changeStats');
  }

  heal(hp: number) {
    if (this.isDie) {
      throw new Error('Unit is dead!');
    }
    this.isDefense = false;
    this.stats.hp += hp;
    this.emit('changeStats');
  }

  defense() {
    if (this.isDie) {
      throw new Error('Unit is dead!');
    }
    this.isDefense = true;
  }

  get isDie() {
    return this.stats.hp <= 0;
  }

  calculateDamage(damage: Damage) {
    let actualDamage = damage.physicalDamage;

    if (this.isDefense) {
      actualDamage -= this.defenseValue;
    }

    return Math.max(0, actualDamage);
  }
}
