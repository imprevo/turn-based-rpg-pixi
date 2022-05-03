import * as PIXI from 'pixi.js';
import { Unit } from '../models/unit';
import { HealthBarComponent } from './healh-bar';

class IdleAnimationSprite extends PIXI.AnimatedSprite {
  constructor() {
    super([PIXI.Texture.from('unitMove0'), PIXI.Texture.from('unitWake4')]);
    this.scale.set(3);
    this.animationSpeed = 0.05;
    this.loop = true;
  }
}

class ChargeAnimatedSprite extends PIXI.AnimatedSprite {
  constructor() {
    super([
      PIXI.Texture.from('unitCharge0'),
      PIXI.Texture.from('unitCharge1'),
      PIXI.Texture.from('unitCharge2'),
      PIXI.Texture.from('unitCharge3'),
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

    nextAnimation.anchor.set(0.2, 0.5);
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
    this.unit.on('changeStats', this.handleUnitChange);
    this.unit.on('attack', this.handleUnitAttack);
    this.unit.on('active', this.handleActiveUnit);
    this.pickArea.on('click', this.handlePickUnit);
  }

  handleUnitChange = () => {
    this.updateHealthbar();
    if (this.unit.isDead) {
      this.unitAnimation.runAnimation(UnitAnimationState.DEATH);
    } else {
      // TODO: runs on any stats changes. Not only health!
      this.unitAnimation.runAnimation(UnitAnimationState.DAMAGED);
    }
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
}
