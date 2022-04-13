import * as PIXI from 'pixi.js';

class IdleAnimationSprite extends PIXI.AnimatedSprite {
  constructor() {
    super([
      PIXI.Texture.from('unitIdle0'),
      PIXI.Texture.from('unitIdle1'),
      PIXI.Texture.from('unitIdle2'),
      PIXI.Texture.from('unitIdle3'),
    ]);
    this.scale.x = 3;
    this.scale.y = 3;
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
    this.scale.x = 3;
    this.scale.y = 3;
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
    this.scale.x = 3;
    this.scale.y = 3;
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
    this.scale.x = 3;
    this.scale.y = 3;
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
    this.scale.x = 3;
    this.scale.y = 3;
    this.animationSpeed = 0.1;
    this.loop = false;
  }
}

export class Unit extends PIXI.Container {
  constructor(x: number, y: number, flip?: boolean) {
    super();

    this.x = x;
    this.y = y;

    const sprite = new IdleAnimationSprite();
    sprite.scale.x *= flip ? -1 : 1;
    sprite.gotoAndPlay(0);
    this.addChild(sprite);
  }
}
