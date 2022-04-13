import * as PIXI from 'pixi.js';
import { Environment } from './components/environment';
import { Unit } from './components/unit';
import planetOneTexture from './assets/sci-fi/planet-one.png';
import idleImg from './assets/sci-fi/bot-wheel/charge.png';
import { SpriteGrid } from './utils/sprite';

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

export const app = new PIXI.Application({
  backgroundColor: 0x1099bb,
  width: 800,
  height: 600,
});

function makePlanetShpriteSheet() {
  const texture = PIXI.Texture.from(planetOneTexture);

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
}

function makeUnitSpritesheet() {
  const idleTexture = PIXI.Texture.from(idleImg);

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
}

function createComponents() {
  const environment = new Environment();
  app.stage.addChild(environment);

  const unit1 = new Unit(100, 400);
  app.stage.addChild(unit1);

  const unit2 = new Unit(700, 400, true);
  app.stage.addChild(unit2);

  const basicText = new PIXI.Text('Turn-based RPG');
  basicText.x = 50;
  basicText.y = 50;
  app.stage.addChild(basicText);

  app.ticker.add(() => {
    environment.update();
  });
}

app.loader.add('planetOneTexture', planetOneTexture).load(() => {
  makePlanetShpriteSheet();
  makeUnitSpritesheet();
  createComponents();
});
