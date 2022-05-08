import * as PIXI from 'pixi.js';

export class IdleAnimationSprite extends PIXI.AnimatedSprite {
  constructor() {
    super([PIXI.Texture.from('unitMove0'), PIXI.Texture.from('unitWake4')]);
    this.scale.set(3);
    this.anchor.set(0.2, 0.5);
    this.animationSpeed = 0.05;
    this.loop = true;
  }
}

export class ChargeAnimatedSprite extends PIXI.AnimatedSprite {
  constructor() {
    super([
      PIXI.Texture.from('unitCharge0'),
      PIXI.Texture.from('unitCharge1'),
      PIXI.Texture.from('unitCharge2'),
      PIXI.Texture.from('unitCharge3'),
    ]);
    this.scale.set(3);
    this.anchor.set(0.2, 0.5);
    this.animationSpeed = 0.1;
    this.loop = true;
  }
}

export class DeathAnimationSprite extends PIXI.AnimatedSprite {
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
    this.anchor.set(0.2, 0.5);
    this.animationSpeed = 0.1;
    this.loop = false;
  }
}

export class DamagedAnimationSprite extends PIXI.AnimatedSprite {
  constructor() {
    super([
      PIXI.Texture.from('unitDamaged0'),
      PIXI.Texture.from('unitDamaged1'),
      PIXI.Texture.from('unitDamaged0'),
      PIXI.Texture.from('unitDamaged1'),
      PIXI.Texture.from('unitDamaged0'),
    ]);
    this.scale.set(3);
    this.anchor.set(0.2, 0.5);
    this.animationSpeed = 0.1;
    this.loop = false;
  }
}

export class ShootAnimationSprite extends PIXI.AnimatedSprite {
  constructor() {
    super([
      PIXI.Texture.from('unitShoot0'),
      PIXI.Texture.from('unitShoot1'),
      PIXI.Texture.from('unitShoot2'),
      PIXI.Texture.from('unitShoot3'),
    ]);
    this.scale.set(3);
    this.anchor.set(0.2, 0.5);
    this.animationSpeed = 0.1;
    this.loop = false;
  }
}

export class WakeAnimationSprite extends PIXI.AnimatedSprite {
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
    this.anchor.set(0.2, 0.5);
    this.animationSpeed = 0.1;
    this.loop = false;
  }
}
