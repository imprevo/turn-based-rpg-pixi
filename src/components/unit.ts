import * as PIXI from 'pixi.js';
import { HealthBar } from './healh-bar';

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

export class Unit extends PIXI.Container {
  unitAnimation = new UnitAnimation();
  healthBar = new HealthBar(10);

  constructor(x: number, y: number, flip = false) {
    super();

    this.x = x;
    this.y = y;

    this.unitAnimation.setFlip(flip);
    this.unitAnimation.runAnimation(UnitAnimationState.WAKE);

    this.healthBar.y = -50;
    this.healthBar.setCount(5);

    this.addChild(this.unitAnimation, this.healthBar);
  }
}
