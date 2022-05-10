import { Tween } from '@tweenjs/tween.js';
import * as PIXI from 'pixi.js';
import { Unit } from '../models/unit';
import { HintComponent } from './hint';
import { HealthBarComponent } from './healh-bar';
import {
  ChargeAnimatedSprite,
  DamagedAnimationSprite,
  DeathAnimationSprite,
  IdleAnimationSprite,
  ShootAnimationSprite,
  WakeAnimationSprite,
} from './unit-animations';

const colors = {
  DAMAGE: 0xf44336,
  CRIT: 0xffc107,
  MISS: 0xff5722,
  HEAL: 0x4caf50,
};

enum UnitAnimationState {
  IDLE,
  CHARGE,
  DEATH,
  DAMAGED,
  SHOOT,
  WAKE,
}

class UnitAnimation extends PIXI.Container {
  animationState?: UnitAnimationState;
  currentAnimation?: PIXI.AnimatedSprite;

  setFlip(flip: boolean) {
    this.scale.x *= flip ? -1 : 1;
  }

  runAnimation(animationState: UnitAnimationState) {
    if (this.animationState === animationState) return;

    this.removeAnimation();
    this.initAnimation(animationState);
  }

  removeAnimation() {
    if (this.currentAnimation) {
      this.currentAnimation.stop();
      this.removeChild(this.currentAnimation);
    }
  }

  initAnimation(animationState: UnitAnimationState) {
    const nextAnimation = this.createAnimation(animationState);
    const nextAnimationState = this.getTransitionAnimationState(animationState);

    if (nextAnimationState !== null) {
      nextAnimation.onComplete = () => {
        this.runAnimation(nextAnimationState);
      };
    }

    nextAnimation.play();
    this.addChild(nextAnimation);

    this.animationState = animationState;
    this.currentAnimation = nextAnimation;
  }

  createAnimation(animationState: UnitAnimationState) {
    switch (animationState) {
      case UnitAnimationState.WAKE:
        return new WakeAnimationSprite();
      case UnitAnimationState.IDLE:
        return new IdleAnimationSprite();
      case UnitAnimationState.CHARGE:
        return new ChargeAnimatedSprite();
      case UnitAnimationState.SHOOT:
        return new ShootAnimationSprite();
      case UnitAnimationState.DAMAGED:
        return new DamagedAnimationSprite();
      case UnitAnimationState.DEATH:
        return new DeathAnimationSprite();
      default:
        throw new Error(`Unknown animation state: ${animationState}`);
    }
  }

  getTransitionAnimationState(animationState: UnitAnimationState) {
    switch (animationState) {
      case UnitAnimationState.WAKE:
        return UnitAnimationState.IDLE;
      case UnitAnimationState.IDLE:
        return null;
      case UnitAnimationState.CHARGE:
        return UnitAnimationState.IDLE;
      case UnitAnimationState.SHOOT:
        return UnitAnimationState.IDLE;
      // TODO: should switch to prev state when attacking or healing self
      case UnitAnimationState.DAMAGED:
        return UnitAnimationState.IDLE;
      case UnitAnimationState.DEATH:
        return null;
      default:
        throw new Error(`Unknown animation state: ${animationState}`);
    }
  }

  setBlink(color: number) {
    if (this.currentAnimation) {
      new Tween(this.currentAnimation)
        .to({ tint: color }, 150)
        .repeat(3)
        .yoyo(true)
        .easing((k) => Math.floor(k))
        .start();
    }
  }
}

class PickArea extends PIXI.Graphics {
  constructor() {
    super();

    this.x = -25;
    this.y = -35;
    this.visible = false;
    this.interactive = true;
    this.buttonMode = true;

    this.beginFill(0xf44336, 0.5);
    this.drawRect(0, 0, 50, 80);
    this.endFill();
  }
}

export class UnitComponent extends PIXI.Container {
  unitAnimation = new UnitAnimation();
  healthBar: HealthBarComponent;
  pickArea = new PickArea();
  unitName: PIXI.Text;
  unit: Unit;

  unitWasDead: boolean;

  constructor(x: number, y: number, flip = false, unit: Unit) {
    super();

    this.unit = unit;
    this.x = x;
    this.y = y;
    this.unitWasDead = unit.isDead;

    this.healthBar = this.initHealthbar(unit);
    this.unitName = this.initName(unit);
    this.updateHealthbar();
    this.initAnimation(flip);
    this.addListeners();
    this.addChild(
      this.unitAnimation,
      this.healthBar,
      this.unitName,
      this.pickArea
    );
  }

  initHealthbar(unit: Unit) {
    const healthBar = new HealthBarComponent(unit.stats.hpMax);
    healthBar.y = -40;
    return healthBar;
  }

  initName(unit: Unit) {
    const text = new PIXI.Text(unit.name, { fontSize: 14 });
    text.y = -56;
    text.anchor.set(0.5);
    return text;
  }

  initAnimation(flip: boolean) {
    this.unitAnimation.setFlip(flip);
    this.unitAnimation.runAnimation(UnitAnimationState.WAKE);
  }

  addListeners() {
    this.unit.on('damage', this.handleUnitDamage);
    this.unit.on('miss', this.handleUnitMiss);
    this.unit.on('heal', this.handleUnitHeal);
    this.unit.on('attack', this.handleUnitAttack);
    this.unit.on('active', this.handleActiveUnit);
    this.pickArea.on('click', this.handlePickUnit);
  }

  handleUnitDamage = (damage: number, isCrit: boolean) => {
    const hintColor = isCrit ? colors.CRIT : colors.DAMAGE;
    this.showHint(`-${damage}`, hintColor);
    this.updateHealthbar();
    if (this.unit.isDead) {
      this.unitAnimation.runAnimation(UnitAnimationState.DEATH);
    } else {
      this.unitAnimation.setBlink(colors.DAMAGE);
    }
    this.unitWasDead = this.unit.isDead;
  };

  handleUnitMiss = () => {
    this.showHint('MISS', colors.MISS);
  };

  handleUnitHeal = (heal: number) => {
    this.showHint(`+${heal}`, colors.HEAL);
    this.updateHealthbar();
    if (this.unitWasDead) {
      this.unitAnimation.runAnimation(UnitAnimationState.WAKE);
    }
    this.unitAnimation.setBlink(colors.HEAL);
    this.unitWasDead = this.unit.isDead;
  };

  handleUnitAttack = () => {
    this.unitAnimation.runAnimation(UnitAnimationState.SHOOT);
  };

  handlePickUnit = () => {
    this.emit('pick', this.unit);
  };

  handleActiveUnit = () => {
    if (this.unit.isActive) {
      this.unitAnimation.runAnimation(UnitAnimationState.CHARGE);
    } else {
      this.unitAnimation.runAnimation(UnitAnimationState.IDLE);
    }
  };

  updateHealthbar() {
    this.healthBar.setCount(this.unit.stats.hp);
  }

  setPickable(pickable: boolean) {
    this.pickArea.visible = pickable;
  }

  showHint(text: string, color: number) {
    const hint = new HintComponent(text, color);
    hint.show(this);
  }
}
