import * as PIXI from 'pixi.js';
import { ActionButtonsComponent } from './action-buttons';
import { GameOverComponent } from './game-over';
import { EnvironmentComponent } from './environment';
import { UnitComponent } from './unit';
import { BattleService } from '../services/battle';

export class BattleComponent extends PIXI.Container {
  battle: BattleService;

  environment = new EnvironmentComponent();
  gameOverMessage = new GameOverComponent();
  actions = new ActionButtonsComponent();

  constructor(battle: BattleService) {
    super();

    this.battle = battle;

    const player = battle.player;
    const enemy = battle.enemy;
    const unit1 = new UnitComponent(100, 400, false, player);
    const unit2 = new UnitComponent(700, 400, true, enemy);

    this.addChild(
      this.environment,
      unit1,
      unit2,
      this.gameOverMessage,
      this.actions
    );

    this.addListeners();
  }

  get player() {
    return this.battle.player;
  }

  get enemy() {
    return this.battle.enemy;
  }

  update() {
    this.environment.update();
  }

  addListeners() {
    this.battle.on('turnEnd', () => {
      this.showActions(this.battle.current === 'player');
    });
    this.battle.on('gameopver', () => {
      if (this.battle.current === 'player') {
        this.gameOverMessage.showWinMessage();
      } else {
        this.gameOverMessage.showLoseMessage();
      }
    });

    this.actions.on('attack', () => {
      this.player.attack(this.enemy);
      this.battle.playerTurn();
    });
    this.actions.on('defence', () => {
      this.player.defense();
      this.battle.playerTurn();
    });
    this.actions.on('heal', () => {
      this.player.heal(1);
      this.battle.playerTurn();
    });
  }

  showActions(visible: boolean) {
    this.actions.visible = visible;
  }
}
