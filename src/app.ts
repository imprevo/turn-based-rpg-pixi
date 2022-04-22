import * as PIXI from 'pixi.js';
import iconPlusImg from './assets/pro-ui-light-minimalism/01_IconPlus.png';
import iconAttackImg from './assets/pro-ui-light-minimalism/16_Attack_V2.png';
import iconShieldImg from './assets/pro-ui-light-minimalism/17_Shield.png';
import { BattleService } from './services/battle';
import { LifeBarBuilder } from './services/spritesheet/life-bars-builder';
import { PlanetSpritesheetBuilder } from './services/spritesheet/planet-builder';
import {
  UnitDamagedSpritesheetBuilder,
  UnitDeathSpritesheetBuilder,
  UnitIdleSpritesheetBuilder,
  UnitShootSpritesheetBuilder,
  UnitWakeSpritesheetBuilder,
} from './services/spritesheet/unit-builder';
import { BattleComponent } from './components/battle';
import { AIController } from './services/ai-controller';
import { Unit } from './models/unit';

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

  return new Promise((resolve) => app.loader.load(() => resolve()));
}

function loadSpritesheets() {
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
  const team1 = new Unit('Left', 5, 2);
  const team2 = new Unit('Right', 5, 2);
  const battle = new BattleService([team1, team2]);
  // const ai1 = new AIController(battle, team1);
  const ai2 = new AIController(battle, team2);

  const battleComponent = new BattleComponent(battle, team1);

  app.stage.addChild(battleComponent);

  app.ticker.add(() => {
    battleComponent.update();
  });
}

Promise.all([loadTextures(), loadSpritesheets()]).then(createComponents);
