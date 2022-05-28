import { Ability, AbilityType } from '../../models/abilities';
import { Team } from '../../models/team';
import { Unit } from '../../models/unit';
import { Action, TargetActionCreator } from './_action';

enum AttackType {
  DAMAGE,
  CRITICAL_DAMAGE,
  MISS,
}

class AttackAction extends Action {
  unit: Unit;
  ability?: Ability;
  target: Unit;

  constructor(team: Team, target: Unit) {
    super(team, 2);
    this.unit = team.currentUnit;
    this.ability = this.unit.abilities.getAbility(AbilityType.ATTACK);
    this.target = target;
  }

  canExecute() {
    return (this.ability?.canUse() || false) && !this.target.isDead;
  }

  action() {
    this.tryAttackTarget();
    this.unit.attack();
    this.ability?.use();
  }

  tryAttackTarget() {
    const attackType = this.generateAttackType();

    switch (attackType) {
      case AttackType.DAMAGE:
        this.target.takeDamage(this.calculateDamage(), false);
        break;
      case AttackType.CRITICAL_DAMAGE:
        this.target.takeDamage(this.calculateCriticalDamage(), true);
        break;
      case AttackType.MISS:
        this.target.miss();
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

export class AttackActionCreator extends TargetActionCreator {
  constructor(team: Team, public targets: Unit[]) {
    super(team, AbilityType.ATTACK, targets);
  }

  create() {
    if (!this.target) throw new Error('Has no target!');
    return new AttackAction(this.team, this.target);
  }
}
