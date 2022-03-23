export class Unit {
  name: string;
  hp: number;
  damage: number;

  constructor(name: string, hp: number, damage: number) {
    this.name = name;
    this.hp = hp;
    this.damage = damage;
  }

  attack(target: Unit) {
    target.takeDamage(this.damage);

    console.log(`${this.name} attacks ${target.name}: ${target.hp}hp`);
  }

  takeDamage(damage: number) {
    this.hp -= damage;
    if (this.hp <= 0) {
      this.die();
    }
  }

  die() {
    console.log(`Unit ${this.name} died!`);
  }
}
