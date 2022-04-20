import * as PIXI from 'pixi.js';
import iconPlusImg from './assets/pro-ui-light-minimalism/01_IconPlus.png';
import iconAttackImg from './assets/pro-ui-light-minimalism/16_Attack_V2.png';
import iconShieldImg from './assets/pro-ui-light-minimalism/17_Shield.png';
import { ActionButtonsComponent } from './components/action-buttons';
import { GameOverComponent } from './components/game-over';
import { EnvironmentComponent } from './components/environment';
import { UnitComponent } from './components/unit';
import { Battle } from './services/battle';
import { LifeBarBuilder } from './services/spritesheet/life-bars-builder';
import { PlanetSpritesheetBuilder } from './services/spritesheet/planet-builder';
import {
  UnitDamagedSpritesheetBuilder,
  UnitDeathSpritesheetBuilder,
  UnitIdleSpritesheetBuilder,
  UnitShootSpritesheetBuilder,
  UnitWakeSpritesheetBuilder,
} from './services/spritesheet/unit-builder';
import { wait } from './utils/promise';

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

  const environment = new EnvironmentComponent();
  app.stage.addChild(environment);

  const unit1 = new UnitComponent(100, 400, false, player);
  app.stage.addChild(unit1);

  const unit2 = new UnitComponent(700, 400, true, enemy);
  app.stage.addChild(unit2);

  const gameOverMessage = new GameOverComponent();
  app.stage.addChild(gameOverMessage);

  const actions = new ActionButtonsComponent();
  app.stage.addChild(actions);

  function showActions(visible: boolean) {
    actions.visible = visible;
  }

  async function enemyTurn() {
    await wait(500);
    enemy.attack(player);
    if (player.isDie) {
      gameOverMessage.showLoseMessage();
    } else {
      await wait(500);
      showActions(true);
    }
  }

  function playerTurn() {
    showActions(false);
    if (enemy.isDie) {
      gameOverMessage.showWinMessage();
    } else {
      enemyTurn();
    }
  }

  actions.on('attack', () => {
    player.attack(enemy);
    playerTurn();
  });
  actions.on('defence', () => {
    player.defense();
    playerTurn();
  });
  actions.on('heal', () => {
    player.heal(1);
    playerTurn();
  });

  app.ticker.add(() => {
    environment.update();
  });
}

Promise.all([loadTextures(), loadSpritesheets()]).then(createComponents);
