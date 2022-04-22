import * as PIXI from 'pixi.js';
import { ActionButtonsComponent } from './action-buttons';
import { GameOverComponent } from './game-over';
import { EnvironmentComponent } from './environment';
import { UnitComponent } from './unit';
import { BattleService } from '../services/battle';
import { Unit } from '../models/unit';

export class BattleComponent extends PIXI.Container {
  battle: BattleService;
  controlledTeam?: Unit;

  environment = new EnvironmentComponent();
  gameOverMessage = new GameOverComponent();
  actions = new ActionButtonsComponent();

  constructor(battle: BattleService, controlledTeam?: Unit) {
    super();

    this.battle = battle;
    this.controlledTeam = controlledTeam;

    const unit1 = new UnitComponent(100, 400, false, battle.team1);
    const unit2 = new UnitComponent(700, 400, true, battle.team2);

    this.addChild(
      this.environment,
      unit1,
      unit2,
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
    this.battle.on('gameopver', (winner: Unit) => {
      this.showActions(false);
      this.gameOverMessage.showMessage(winner.name);
    });

    if (this.controlledTeam) {
      this.addActionLesteners(this.controlledTeam);
    }
  }

  addActionLesteners(controlledTeam: Unit) {
    this.actions.on('attack', () => {
      this.battle.doTurn(controlledTeam, () => {
        const target = this.battle.getOpponentTeam(controlledTeam);
        controlledTeam.attack(target);
      });
    });
    this.actions.on('defence', () => {
      this.battle.doTurn(controlledTeam, () => controlledTeam.defense());
    });
    this.actions.on('heal', () => {
      this.battle.doTurn(controlledTeam, () => controlledTeam.heal(1));
    });
  }

  checkTurn() {
    this.showActions(this.battle.currentTeam === this.controlledTeam);
  }

  showActions(visible: boolean) {
    this.actions.visible = visible;
  }
}
