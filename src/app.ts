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
  const playerTeam = new Unit('Player', 5, 2);
  const enemyTeam = new Unit('Enemy', 5, 2);
  const teams: [Unit, Unit] = [enemyTeam, playerTeam];
  const battle = new BattleService(teams);
  const ai = new AIController(
    battle,
    teams.findIndex((v) => v === enemyTeam)
  );

  const battleComponent = new BattleComponent(
    battle,
    teams.findIndex((v) => v === playerTeam)
  );

  app.stage.addChild(battleComponent);

  app.ticker.add(() => {
    battleComponent.update();
  });
}

Promise.all([loadTextures(), loadSpritesheets()]).then(createComponents);
