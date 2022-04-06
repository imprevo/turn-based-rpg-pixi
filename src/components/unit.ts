import * as PIXI from 'pixi.js';
import idleImg from '../assets/sci-fi/bot-wheel/charge.png';

const idleTexture = PIXI.Texture.from(idleImg);

const idleSprite = new PIXI.Spritesheet(idleTexture, {
  frames: {
    frame0: {
      frame: {
        x: 12,
        y: 0,
        w: 24,
        h: 26,
      },
    },
    frame1: {
      frame: {
        x: 12,
        y: 26,
        w: 24,
        h: 26,
      },
    },
    frame2: {
      frame: {
        x: 12,
        y: 52,
        w: 24,
        h: 26,
      },
    },
    frame3: {
      frame: {
        x: 12,
        y: 78,
        w: 24,
        h: 26,
      },
    },
  },
  meta: {
    scale: '1',
  },
});

// TODO: could it be removed?
// eslint-disable-next-line @typescript-eslint/no-empty-function
idleSprite.parse(() => {});

const idleTextures = [
  idleSprite.textures.frame0,
  idleSprite.textures.frame1,
  idleSprite.textures.frame2,
  idleSprite.textures.frame3,
];

class IdleAnimationSprite extends PIXI.AnimatedSprite {
  constructor() {
    super(idleTextures);
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
