import * as PIXI from 'pixi.js';
import { BattleConfig } from '../models/battle-config';
import { AIController } from '../services/ai-controller';
import { BattleService } from '../services/battle';
import { PlayerController } from '../services/player-controller';
import { BattleComponent } from './battle';
import { BattleCreator } from '../services/battle-creator';
import { Menu } from './menu';

interface Scene extends PIXI.Container {
  update?: () => void;
}

export class Root extends PIXI.Container {
  scene: Scene;
  battleCreator = new BattleCreator();

  constructor() {
    super();
    this.scene = this.createMenuScene();
    this.addChild(this.scene);
  }

  createMenuScene() {
    const menu = new Menu();

    menu.on('play', this.handlePlay);

    return menu;
  }

  createBattleScene(
    battle: BattleService,
    ctrls: (PlayerController | AIController)[]
  ) {
    const battleScene = new BattleComponent(battle);
    battleScene.init();
    battleScene.on('exit', this.handleExit);

    ctrls.forEach((ctrl) => {
      if (ctrl instanceof PlayerController) {
        battleScene.setController(ctrl);
      }
    });

    return battleScene;
  }

  handlePlay = (data: BattleConfig) => {
    const battle = this.battleCreator.createBattle(data);
    const ctrls = this.battleCreator.createControllers(battle, data);
    const battleScene = this.createBattleScene(battle, ctrls);

    this.setScene(battleScene);
  };

  handleExit = () => {
    const menu = this.createMenuScene();

    this.setScene(menu);
  };

  setScene(scene: PIXI.Container) {
    this.removeChild(this.scene);
    this.scene = scene;
    this.addChild(scene);
  }

  update() {
    this.scene.update?.();
  }
}
