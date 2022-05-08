import * as TWEEN from '@tweenjs/tween.js';
import * as PIXI from 'pixi.js';
import iconPlusImg from './assets/pro-ui-light-minimalism/01_IconPlus.png';
import iconAttackImg from './assets/pro-ui-light-minimalism/16_Attack_V2.png';
import iconShieldImg from './assets/pro-ui-light-minimalism/17_Shield.png';
import iconArrowLeftImg from './assets/pro-ui-light-minimalism/09_IconArrowLeft.png';
import iconArrowRightImg from './assets/pro-ui-light-minimalism/09_IconArrowRight.png';
import buttonImg from './assets/pro-ui-light-minimalism/Button.png';
import button12Img from './assets/pro-ui-light-minimalism/Button12.png';
import btnClose2Img from './assets/pro-ui-light-minimalism/BtnClose2.png';
// import panel2Img from './assets/pro-ui-light-minimalism/Panel2.png';
import panel8Img from './assets/pro-ui-light-minimalism/Panel8.png';
import { LifeBarBuilder } from './services/spritesheet/life-bars-builder';
import { PlanetSpritesheetBuilder } from './services/spritesheet/planet-builder';
import {
  UnitChargeSpritesheetBuilder,
  UnitDamagedSpritesheetBuilder,
  UnitDeathSpritesheetBuilder,
  UnitMoveSpritesheetBuilder,
  UnitShootSpritesheetBuilder,
  UnitWakeSpritesheetBuilder,
} from './services/spritesheet/unit-builder';
import { RootScene } from './scenes/root';

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

export const app = new PIXI.Application({
  backgroundColor: 0x1099bb,
  width: 800,
  height: 600,
});

function loadTextures(): Promise<void> {
  app.loader.add('iconPlus', iconPlusImg);
  app.loader.add('iconAttack', iconAttackImg);
  app.loader.add('iconShield', iconShieldImg);
  app.loader.add('iconArrowLeft', iconArrowLeftImg);
  app.loader.add('iconArrowRight', iconArrowRightImg);
  app.loader.add('button', buttonImg);
  app.loader.add('button12', button12Img);
  app.loader.add('btnClose2', btnClose2Img);
  // app.loader.add('panel2', panel2Img);
  app.loader.add('panel8', panel8Img);

  return new Promise((resolve) => app.loader.load(() => resolve()));
}

function loadSpritesheets() {
  const parsers = [
    new PlanetSpritesheetBuilder(),
    new UnitChargeSpritesheetBuilder(),
    new UnitMoveSpritesheetBuilder(),
    new UnitDeathSpritesheetBuilder(),
    new UnitDamagedSpritesheetBuilder(),
    new UnitShootSpritesheetBuilder(),
    new UnitWakeSpritesheetBuilder(),
    new LifeBarBuilder(),
  ];
  const loading = parsers.map((parser) => parser.make());

  return Promise.all(loading);
}

function createComponents() {
  const root = new RootScene();

  app.stage.addChild(root);

  app.ticker.add(() => {
    root.update();
    TWEEN.update();
  });
}

Promise.all([loadTextures(), loadSpritesheets()]).then(createComponents);
