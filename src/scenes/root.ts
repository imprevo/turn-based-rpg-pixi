import * as PIXI from 'pixi.js';
import { BattleConfig } from '../models/battle-config';
import { AIController } from '../services/ai-controller';
import { BattleService } from '../services/battle';
import { PlayerController } from '../services/player-controller';
import { BattleScene } from './battle';
import { BattleCreator } from '../services/battle-creator';
import { MenuScene } from './menu';
import { Scene } from './_scene';
import { TransitionScene } from './transition';

export class RootScene extends Scene {
  scene?: Scene;
  loading: TransitionScene;
  battleCreator = new BattleCreator();

  constructor() {
    super();

    this.loading = this.createLoadingScene();
    this.addChild(this.loading);
    this.showMenuScene();
  }

  createLoadingScene() {
    return new TransitionScene();
  }

  createMenuScene() {
    const menu = new MenuScene();

    menu.on('play', this.showBattleScene);

    return menu;
  }

  createBattleScene(
    battle: BattleService,
    ctrls: (PlayerController | AIController)[]
  ) {
    const battleScene = new BattleScene(battle);
    battleScene.on('exit', this.showMenuScene);

    ctrls.forEach((ctrl) => {
      if (ctrl instanceof PlayerController) {
        battleScene.setController(ctrl);
      }
    });

    return battleScene;
  }

  showBattleScene = (data: BattleConfig) => {
    const battle = this.battleCreator.createBattle(data);
    const ctrls = this.battleCreator.createControllers(battle, data);
    const battleScene = this.createBattleScene(battle, ctrls);

    this.setScene(battleScene);
  };

  showMenuScene = () => {
    const menu = this.createMenuScene();

    this.setScene(menu);
  };

  async setScene(scene: Scene) {
    await this.loading.show();

    if (this.scene) {
      this.removeChild(this.scene);
    }
    this.scene = scene;
    this.addChildAt(scene, 0);

    await this.loading.hide();

    this.scene.init();
  }

  update() {
    this.scene?.update();
  }
}
