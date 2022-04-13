import * as PIXI from 'pixi.js';

class IdleAnimationSprite extends PIXI.AnimatedSprite {
  constructor() {
    super([
      PIXI.Texture.from('frame0'),
      PIXI.Texture.from('frame1'),
      PIXI.Texture.from('frame2'),
      PIXI.Texture.from('frame3'),
    ]);
    this.scale.x = 3;
    this.scale.y = 3;
    this.animationSpeed = 0.1;
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
