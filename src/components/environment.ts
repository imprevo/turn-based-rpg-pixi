import * as PIXI from 'pixi.js';
import planetOneTexture from '../assets/sci-fi/planet-one.png';

const texture = PIXI.Texture.from(planetOneTexture);
const sprite = new PIXI.Spritesheet(texture, {
  frames: {
    background: {
      frame: {
        x: 0,
        y: 0,
        w: 256,
        h: 48,
      },
    },
    ground: {
      frame: {
        x: 0,
        y: 48,
        w: 256,
        h: 16,
      },
    },
    sun: {
      frame: {
        x: 210,
        y: 100,
        w: 40,
        h: 40,
      },
    },
  },
  meta: {
    scale: '1',
  },
});

// TODO: could it be removed?
// eslint-disable-next-line @typescript-eslint/no-empty-function
sprite.parse(() => {});

// TODO: get canvas size and scale from arguments?
export class Environment extends PIXI.Container {
  sun: PIXI.Sprite;

  constructor() {
    super();

    const background = new PIXI.Sprite(sprite.textures.background);
    background.x = 0;
    background.y = 0;
    background.scale.x = 5;
    background.scale.y = 5;
    this.addChild(background);

    const ground = new PIXI.Sprite(sprite.textures.ground);
    ground.x = 0;
    ground.y = 220;
    ground.scale.x = 4;
    ground.scale.y = 25;
    this.addChild(ground);

    const sun = new PIXI.Sprite(sprite.textures.sun);
    this.sun = sun;
    sun.x = 680;
    sun.y = 50;
    sun.scale.x = 2;
    sun.scale.y = 2;
    sun.anchor.set(0.5);
    this.addChild(sun);
  }

  update() {
    this.sun.rotation += 0.01;
  }
}
