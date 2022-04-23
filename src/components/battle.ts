import * as PIXI from 'pixi.js';
import { ActionButtonsComponent } from './action-buttons';
import { GameOverComponent } from './game-over';
import { EnvironmentComponent } from './environment';
import { UnitComponent } from './unit';
import { BattleService } from '../services/battle';
import { Unit } from '../models/unit';
import { wait } from '../utils/promise';
import { Team } from '../models/team';

const TURN_DELAY = 1000;

export class BattleComponent extends PIXI.Container {
  battle: BattleService;
  controlledTeam?: Team;

  environment = new EnvironmentComponent();
  gameOverMessage = new GameOverComponent();
  actions = new ActionButtonsComponent();

  constructor(battle: BattleService, controlledTeam?: Team) {
    super();

    this.battle = battle;
    this.controlledTeam = controlledTeam;

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

    if (this.controlledTeam) {
      this.addActionListeners(this.controlledTeam);
    }
  }

  addActionListeners(controlledTeam: Team) {
    this.actions.on('attack', () => {
      this.battle.doTurn(controlledTeam, () => {
        const targetTeam = this.battle.getOpponentTeam(controlledTeam);
        const target = targetTeam.units.find((unit) => !unit.isDie);
        const unit = controlledTeam.currentUnit;
        unit.attack(target!);
      });
    });
    this.actions.on('defence', () => {
      this.battle.doTurn(controlledTeam, () => {
        const unit = controlledTeam.currentUnit;
        unit.defense();
      });
    });
    this.actions.on('heal', () => {
      this.battle.doTurn(controlledTeam, () => {
        const unit = controlledTeam.currentUnit;
        unit.heal(1);
      });
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
    if (
      this.controlledTeam &&
      this.battle.checkIsTurnAvailable(this.controlledTeam)
    ) {
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
