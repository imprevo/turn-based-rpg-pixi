import { Team } from '../../models/team';
import { Unit } from '../../models/unit';
import { Action } from './_action';

enum AttackType {
  DAMAGE,
  CRITICAL_DAMAGE,
  MISS,
}

export class AttackAction extends Action {
  unit: Unit;
  target: Unit;

  constructor(team: Team, target: Unit) {
    super(team, 2);
    this.unit = team.currentUnit;
    this.target = target;
  }

  canExecute() {
    return !this.target.isDead;
  }

  action() {
    const attackType = this.generateAttackType();

    switch (attackType) {
      case AttackType.DAMAGE:
        this.target.takeDamage(this.calculateDamage());
        this.unit.attack();
        break;
      case AttackType.CRITICAL_DAMAGE:
        this.target.takeDamage(this.calculateCriticalDamage());
        this.unit.attack();
        break;
      case AttackType.MISS:
        this.unit.miss();
        break;
      default:
        throw new Error(`Unknown attack type: "${attackType}"`);
    }
  }

  generateAttackType() {
    const chance = Math.random();

    if (chance < 0.05) {
      return AttackType.MISS;
    }
    if (chance > 0.95) {
      return AttackType.CRITICAL_DAMAGE;
    }
    return AttackType.DAMAGE;
  }

  calculateDamage() {
    let actualDamage = this.unit.damage.physicalDamage;

    if (this.target.isDefense) {
      actualDamage = Math.floor(actualDamage / 2);
    }

    return Math.max(0, actualDamage);
  }

  calculateCriticalDamage() {
    const damage = this.calculateDamage();
    return damage * 2;
  }
}
