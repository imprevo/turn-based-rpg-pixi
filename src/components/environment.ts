import * as PIXI from 'pixi.js';
import planetOneTexture from '../assets/sci-fi/planet-one.png';
import { SpriteGrid } from '../utils/sprite';

const texture = PIXI.Texture.from(planetOneTexture);
texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;

const grid = new SpriteGrid(16, 16);

const sprite = new PIXI.Spritesheet(texture, {
  frames: {
    background: grid.getFrame(0, 0, 16, 3),
    ground: grid.getFrame(0, 3, 16, 1),
    sun: grid.getFrame(13, 6, 3, 3),
    dock: grid.getFrame(11, 11, 5, 3),
    lantern: grid.getFrame(6, 8, 2, 3),
    puddle1: grid.getFrame(0, 14, 3, 2),
    puddle2: grid.getFrame(3, 14, 3, 2),
    garbage: grid.getFrame(6, 15, 4, 1),
  },
  meta: {
    scale: '1',
  },
});

// TODO: could it be removed?
// eslint-disable-next-line @typescript-eslint/no-empty-function
sprite.parse(() => {});

class Background extends PIXI.Sprite {
  constructor() {
    super(sprite.textures.background);

    this.x = 0;
    this.y = 0;
    this.scale.x = 5;
    this.scale.y = 5;
  }
}

class Ground extends PIXI.Sprite {
  constructor() {
    super(sprite.textures.ground);

    this.x = 0;
    this.y = 220;
    this.scale.x = 4;
    this.scale.y = 25;
  }
}

class Sun extends PIXI.Sprite {
  rotationSpeed = 0.002;

  constructor(x: number, y: number) {
    super(sprite.textures.sun);

    this.x = x;
    this.y = y;
    this.scale.x = 2;
    this.scale.y = 2;
    this.anchor.set(0.5);
  }

  update() {
    this.rotation += this.rotationSpeed;
  }
}

class Dock extends PIXI.Sprite {
  constructor(x: number, y: number) {
    super(sprite.textures.dock);

    this.x = x;
    this.y = y;
    this.scale.x = 3;
    this.scale.y = 3;
  }
}

class Lantern extends PIXI.Sprite {
  constructor(x: number, y: number) {
    super(sprite.textures.lantern);

    this.x = x;
    this.y = y;
    this.scale.x = 3;
    this.scale.y = 3;
  }
}

class Puddle1 extends PIXI.Sprite {
  constructor(x: number, y: number) {
    super(sprite.textures.puddle1);

    this.x = x;
    this.y = y;
    this.scale.x = 3;
    this.scale.y = 3;
  }
}

class Puddle2 extends PIXI.Sprite {
  constructor(x: number, y: number) {
    super(sprite.textures.puddle2);

    this.x = x;
    this.y = y;
    this.scale.x = 3;
    this.scale.y = 3;
  }
}

class Garbage extends PIXI.Sprite {
  constructor(x: number, y: number) {
    super(sprite.textures.garbage);

    this.x = x;
    this.y = y;
    this.scale.x = 3;
    this.scale.y = 3;
  }
}

// TODO: get canvas size and scale from arguments?
export class Environment extends PIXI.Container {
  background = new Background();
  ground = new Ground();
  sun = new Sun(680, 50);
  dock = new Dock(500, 200);
  lantern = new Lantern(350, 150);
  puddle1 = new Puddle1(350, 500);
  puddle2 = new Puddle2(100, 174);
  garbage = new Garbage(270, 350);

  constructor() {
    super();

    this.addChild(this.background);
    this.addChild(this.ground);
    this.addChild(this.sun);
    this.addChild(this.dock);
    this.addChild(this.lantern);
    this.addChild(this.puddle1);
    this.addChild(this.puddle2);
    this.addChild(this.garbage);
  }

  update() {
    this.sun.update();
  }
}
