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

  get isDead() {
    return this.stats.hp <= 0;
  }

  attack(target: Unit) {
    if (this.isDead) {
      throw new Error('Unit is dead!');
    }
    this.isDefense = false;
    target.takeDamage(this.damage);
    this.emit('attack');
  }

  takeDamage(damage: Damage) {
    if (this.isDead) {
      throw new Error('Unit is dead!');
    }
    this.stats.hp -= this.calculateDamage(damage);
    this.stats.hp = Math.max(0, this.stats.hp);
    this.isDefense = false;
    this.emit('changeStats');
  }

  heal() {
    const heal = 2;
    this.isDefense = false;
    this.stats.hp += heal;
    this.stats.hp = Math.min(this.stats.hpMax, this.stats.hp);
    this.emit('changeStats');
  }

  defense() {
    if (this.isDead) {
      throw new Error('Unit is dead!');
    }
    this.isDefense = true;
  }

  calculateDamage(damage: Damage) {
    let actualDamage = damage.physicalDamage;

    if (this.isDefense) {
      actualDamage -= this.defenseValue;
    }

    return Math.max(0, actualDamage);
  }
}
