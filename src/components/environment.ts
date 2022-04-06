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
  constructor() {
    super();

    const background = new PIXI.Sprite(sprite.textures.background);
    background.x = 0;
    background.y = 0;
    background.width = 800;
    background.height = 300;
    this.addChild(background);

    const ground = new PIXI.Sprite(sprite.textures.ground);
    ground.x = 0;
    ground.y = 300;
    ground.width = 800;
    ground.height = 300;
    this.addChild(ground);
  }
}
