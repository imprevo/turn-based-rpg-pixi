import { BattleConfig } from '../models/battle-config';
import { PlayerController } from '../services/player-controller';
import { BattleScene } from './battle';
import { BattleCreator } from '../services/battle-creator';
import { MenuScene } from './menu';
import { Scene } from './_scene';
import { TransitionScene } from './transition';

export class RootScene extends Scene {
  scene?: Scene;
  loading = new TransitionScene();
  battleCreator = new BattleCreator();

  constructor() {
    super();

    this.addChild(this.loading);
    this.showMenuScene();
  }

  showBattleScene = (data: BattleConfig) => {
    const battle = this.battleCreator.createBattle(data);
    const ctrls = this.battleCreator.createControllers(battle, data);
    const battleScene = new BattleScene(battle);

    ctrls.forEach((ctrl) => {
      if (ctrl instanceof PlayerController) {
        battleScene.setController(ctrl);
      }
    });

    battleScene.on('restart', () => this.showBattleScene(data));
    battleScene.on('exit', this.showMenuScene);

    this.setScene(battleScene);
  };

  showMenuScene = () => {
    const menu = new MenuScene();

    menu.on('play', this.showBattleScene);

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
