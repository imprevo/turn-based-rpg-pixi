import * as PIXI from 'pixi.js';
import iconPlusImg from './assets/pro-ui-light-minimalism/01_IconPlus.png';
import iconAttackImg from './assets/pro-ui-light-minimalism/16_Attack_V2.png';
import iconShieldImg from './assets/pro-ui-light-minimalism/17_Shield.png';
import { ActionButtonsComponent } from './components/action-buttons';
import { EnvironmentComponent } from './components/environment';
import { UnitComponent } from './components/unit';
import { Battle } from './models/battle';
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
  const battle = new Battle();

  const player = battle.player;
  const enemy = battle.enemy;

  // battle.init();

  const environment = new EnvironmentComponent();
  app.stage.addChild(environment);

  const unit1 = new UnitComponent(100, 400, false, player);
  app.stage.addChild(unit1);

  const unit2 = new UnitComponent(700, 400, true, enemy);
  app.stage.addChild(unit2);

  const basicText = new PIXI.Text('Turn-based RPG');
  basicText.x = 50;
  basicText.y = 50;
  app.stage.addChild(basicText);

  const actions = new ActionButtonsComponent();
  app.stage.addChild(actions);

  actions.on('attack', () => {
    // player.attack(enemy);
    enemy.attack(player);
  });
  actions.on('defence', () => {
    player.defense();
  });
  actions.on('heal', () => {
    player.heal(1);
  });

  app.ticker.add(() => {
    environment.update();
  });
}

Promise.all([loadTextures(), loadSpritesheets()]).then(createComponents);
