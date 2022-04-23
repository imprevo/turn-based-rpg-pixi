import * as PIXI from 'pixi.js';
import { ActionButtonsComponent } from './action-buttons';
import { GameOverComponent } from './game-over';
import { EnvironmentComponent } from './environment';
import { UnitComponent } from './unit';
import { BattleService } from '../services/battle';
import { Unit } from '../models/unit';
import { wait } from '../utils/promise';
import { PlayerController } from '../services/player-controller';

const TURN_DELAY = 1000;

export class BattleComponent extends PIXI.Container {
  battle: BattleService;
  playerController?: PlayerController;

  environment = new EnvironmentComponent();
  gameOverMessage = new GameOverComponent();
  actions = new ActionButtonsComponent();

  constructor(battle: BattleService, playerController?: PlayerController) {
    super();

    this.battle = battle;
    this.playerController = playerController;

    this.addChild(
      this.environment,
      ...this.createUnitComponents(),
      this.gameOverMessage,
      this.actions
    );

    this.checkTurn();
    this.addListeners();
  }

  update() {
    this.environment.update();
  }

  addListeners() {
    this.battle.on('turnEnd', () => {
      this.checkTurn();
    });
    this.battle.on('gameover', async (winner: Unit) => {
      this.showActions(false);
      await wait(500);
      this.gameOverMessage.showMessage(winner.name);
    });

    if (this.playerController) {
      this.addActionListeners(this.playerController);
    }
  }

  addActionListeners(playerController: PlayerController) {
    this.actions.on('attack', () => {
      const targetTeam = playerController.getOpponentTeam();
      const target = targetTeam.units.find((unit) => !unit.isDie);
      playerController.attack(target!);
    });
    this.actions.on('defence', () => {
      playerController.defense();
    });
    this.actions.on('heal', () => {
      playerController.heal();
    });
  }

  createUnitComponents() {
    const components: UnitComponent[] = [];

    this.battle.team1.units.forEach((unit, index) => {
      const x = 100 + (index / 2) * 80;
      const y = 400 + (index % 2) * 120;
      components.push(new UnitComponent(x, y, false, unit));
    });

    this.battle.team2.units.forEach((unit, index) => {
      const x = 700 - (index / 2) * 80;
      const y = 400 + (index % 2) * 120;
      components.push(new UnitComponent(x, y, true, unit));
    });

    return components;
  }

  async checkTurn() {
    if (this.playerController?.checkIsTurnAvailable()) {
      await wait(TURN_DELAY);
      this.showActions(true);
    } else {
      this.showActions(false);
    }
  }

  showActions(visible: boolean) {
    this.actions.visible = visible;
  }
}
