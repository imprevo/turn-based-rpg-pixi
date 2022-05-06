import * as PIXI from 'pixi.js';
import { Team } from '../models/team';
import { Unit } from '../models/unit';
import { AIController } from '../services/ai-controller';
import { BattleService } from '../services/battle';
import { PlayerController } from '../services/player-controller';
import { BattleComponent } from './battle';
import { Menu } from './menu';

interface Scene extends PIXI.Container {
  update?: () => void;
}

export class Root extends PIXI.Container {
  scene: Scene;

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

  createBattleScene() {
    const battle = this.prepareBattle();
    const playerController = new PlayerController(battle, battle.team1);
    const aiController = new AIController(battle, battle.team2);

    const battleScene = new BattleComponent(battle, playerController);
    battleScene.init();
    battleScene.on('exit', this.handleExit);

    return battleScene;
  }

  prepareBattle() {
    const team1 = new Team('Left', [
      new Unit('Left 1', 5, 2),
      new Unit('Left 2', 5, 2),
      new Unit('Left 3', 5, 2),
      new Unit('Left 4', 5, 2),
    ]);
    const team2 = new Team('Right', [
      new Unit('Right 1', 5, 2),
      new Unit('Right 2', 5, 2),
      new Unit('Right 3', 5, 2),
      new Unit('Right 4', 5, 2),
    ]);

    const battle = new BattleService([team1, team2]);

    return battle;
  }

  handlePlay = () => {
    const battle = this.createBattleScene();

    this.setScene(battle);
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
