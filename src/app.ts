import * as PIXI from 'pixi.js';
import { Environment } from './components/environment';
import { Unit } from './components/unit';
import { LifeBarBuilder } from './services/spritesheet/life-bars-builder';
import { PlanetSpritesheetBuilder } from './services/spritesheet/planet-builder';
import {
  UnitDamagedSpritesheetBuilder,
  UnitDeathSpritesheetBuilder,
  UnitIdleSpritesheetBuilder,
  UnitShootSpritesheetBuilder,
  UnitWakeSpritesheetBuilder,
} from './services/spritesheet/unit-builder';

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

export const app = new PIXI.Application({
  backgroundColor: 0x1099bb,
  width: 800,
  height: 600,
});

function loadTextures() {
  const parsers = [
    new PlanetSpritesheetBuilder(),
    new UnitIdleSpritesheetBuilder(),
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

loadTextures().then(createComponents);
