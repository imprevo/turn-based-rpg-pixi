import * as PIXI from 'pixi.js';
import { ActionButtonsComponent } from './action-buttons';
import { GameOverComponent } from './game-over';
import { EnvironmentComponent } from './environment';
import { UnitComponent } from './unit';
import { BattleService } from '../services/battle';

export class BattleComponent extends PIXI.Container {
  battle: BattleService;
  playerTeam: number;

  environment = new EnvironmentComponent();
  gameOverMessage = new GameOverComponent();
  actions = new ActionButtonsComponent();

  constructor(battle: BattleService, team: number) {
    super();

    this.battle = battle;
    this.playerTeam = team;

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

  get player() {
    return this.playerTeam === 0 ? this.battle.team1 : this.battle.team2;
  }

  get enemy() {
    return this.playerTeam === 0 ? this.battle.team2 : this.battle.team1;
  }

  update() {
    this.environment.update();
  }

  addListeners() {
    this.battle.on('turnEnd', () => {
      this.checkTurn();
    });
    this.battle.on('gameopver', (winner) => {
      this.showActions(false);
      if (winner === this.playerTeam) {
        this.gameOverMessage.showWinMessage();
      } else {
        this.gameOverMessage.showLoseMessage();
      }
    });

    this.actions.on('attack', () => {
      this.battle.doTurn(this.playerTeam, () => this.player.attack(this.enemy));
    });
    this.actions.on('defence', () => {
      this.battle.doTurn(this.playerTeam, () => this.player.defense());
    });
    this.actions.on('heal', () => {
      this.battle.doTurn(this.playerTeam, () => this.player.heal(1));
    });
  }

  checkTurn() {
    this.showActions(this.battle.currentTeam === this.playerTeam);
  }

  showActions(visible: boolean) {
    this.actions.visible = visible;
  }
}
