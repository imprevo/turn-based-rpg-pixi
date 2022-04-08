import * as PIXI from 'pixi.js';
import idleImg from '../assets/sci-fi/bot-wheel/charge.png';
import { SpriteGrid } from '../utils/sprite';

const idleTexture = PIXI.Texture.from(idleImg);
idleTexture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;

const grid = new SpriteGrid(117, 26);

const idleSprite = new PIXI.Spritesheet(idleTexture, {
  frames: {
    frame0: grid.getFrame(0, 0, 1, 1),
    frame1: grid.getFrame(0, 1, 1, 1),
    frame2: grid.getFrame(0, 2, 1, 1),
    frame3: grid.getFrame(0, 3, 1, 1),
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
