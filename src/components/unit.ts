import * as PIXI from 'pixi.js';
import { Unit } from '../models/unit';
import { HealthBarComponent } from './healh-bar';

class IdleAnimationSprite extends PIXI.AnimatedSprite {
  constructor() {
    super([
      PIXI.Texture.from('unitIdle0'),
      PIXI.Texture.from('unitIdle1'),
      PIXI.Texture.from('unitIdle2'),
      PIXI.Texture.from('unitIdle3'),
    ]);
    this.scale.set(3);
    this.animationSpeed = 0.1;
    this.loop = true;
  }
}

class DeathAnimationSprite extends PIXI.AnimatedSprite {
  constructor() {
    super([
      PIXI.Texture.from('unitDeath0'),
      PIXI.Texture.from('unitDeath1'),
      PIXI.Texture.from('unitDeath2'),
      PIXI.Texture.from('unitDeath3'),
      PIXI.Texture.from('unitDeath4'),
      PIXI.Texture.from('unitDeath5'),
    ]);
    this.scale.set(3);
    this.animationSpeed = 0.1;
    this.loop = false;
  }
}

class DamagedAnimationSprite extends PIXI.AnimatedSprite {
  constructor() {
    super([
      PIXI.Texture.from('unitDamaged0'),
      PIXI.Texture.from('unitDamaged1'),
      PIXI.Texture.from('unitDamaged0'),
      PIXI.Texture.from('unitDamaged1'),
      PIXI.Texture.from('unitDamaged0'),
    ]);
    this.scale.set(3);
    this.animationSpeed = 0.1;
    this.loop = false;
  }
}

class ShootAnimationSprite extends PIXI.AnimatedSprite {
  constructor() {
    super([
      PIXI.Texture.from('unitShoot0'),
      PIXI.Texture.from('unitShoot1'),
      PIXI.Texture.from('unitShoot2'),
      PIXI.Texture.from('unitShoot3'),
    ]);
    this.scale.set(3);
    this.animationSpeed = 0.1;
    this.loop = false;
  }
}

class WakeAnimationSprite extends PIXI.AnimatedSprite {
  constructor() {
    super([
      PIXI.Texture.from('unitWake0'),
      PIXI.Texture.from('unitWake0'),
      PIXI.Texture.from('unitWake0'),
      PIXI.Texture.from('unitWake1'),
      PIXI.Texture.from('unitWake2'),
      PIXI.Texture.from('unitWake3'),
      PIXI.Texture.from('unitWake4'),
    ]);
    this.scale.set(3);
    this.animationSpeed = 0.1;
    this.loop = false;
  }
}

enum UnitAnimationState {
  IDLE,
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
    const currentAnimation = this.createAnimation(animationState);
    const nextAnimationState = this.getTransitionAnimationState(animationState);

    if (nextAnimationState !== null) {
      currentAnimation.onComplete = () => {
        this.runAnimation(nextAnimationState);
      };
    }

    currentAnimation.anchor.set(0.2, 0.5);
    currentAnimation.play();
    this.addChild(currentAnimation);

    this.animationState = animationState;
    this.currentAnimation = currentAnimation;
  }

  createAnimation(animationState: UnitAnimationState) {
    switch (animationState) {
      case UnitAnimationState.WAKE:
        return new WakeAnimationSprite();
      case UnitAnimationState.IDLE:
        return new IdleAnimationSprite();
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
      case UnitAnimationState.SHOOT:
        return UnitAnimationState.IDLE;
      case UnitAnimationState.DAMAGED:
        return UnitAnimationState.IDLE;
      case UnitAnimationState.DEATH:
        return null;
      default:
        throw new Error(`Unknown animation state: ${animationState}`);
    }
  }
}

export class UnitComponent extends PIXI.Container {
  unitAnimation = new UnitAnimation();
  healthBar: HealthBarComponent;
  unitName: PIXI.Text;
  unit: Unit;

  constructor(x: number, y: number, flip = false, unit: Unit) {
    super();

    this.unit = unit;
    this.x = x;
    this.y = y;

    this.healthBar = this.initHealthbar(unit);
    this.unitName = this.initName(unit);
    this.updateHealthbar();
    this.initAnimation(flip);
    this.addListeners();
    this.addChild(this.unitAnimation, this.healthBar, this.unitName);
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
    this.unit.on('changeStats', this.handleUnitChange);
    this.unit.on('attack', this.handleUnitAttack);
  }

  handleUnitChange = () => {
    this.updateHealthbar();
    if (this.unit.isDie) {
      this.unitAnimation.runAnimation(UnitAnimationState.DEATH);
    } else {
      // TODO: runs on any stats changes. Not only health!
      this.unitAnimation.runAnimation(UnitAnimationState.DAMAGED);
    }
  };

  handleUnitAttack = () => {
    this.unitAnimation.runAnimation(UnitAnimationState.SHOOT);
  };

  updateHealthbar() {
    this.healthBar.setCount(this.unit.stats.hp);
  }
}
