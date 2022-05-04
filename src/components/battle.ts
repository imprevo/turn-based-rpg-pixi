import * as PIXI from 'pixi.js';
import { ActionButtonsComponent } from './action-buttons';
import { GameOverComponent } from './game-over';
import { EnvironmentComponent } from './environment';
import { UnitComponent } from './unit';
import { BattleService } from '../services/battle';
import { Unit } from '../models/unit';
import { wait } from '../utils/promise';
import { PlayerController } from '../services/player-controller';
import { Team } from '../models/team';

export class BattleComponent extends PIXI.Container {
  battle: BattleService;
  playerController?: PlayerController;

  environment = new EnvironmentComponent();
  gameOverMessage = new GameOverComponent();
  actions = new ActionButtonsComponent();
  units: UnitComponent[];
  unitPickSubscriptions: (() => void)[] = [];

  constructor(battle: BattleService, playerController?: PlayerController) {
    super();

    this.battle = battle;
    this.playerController = playerController;
    this.units = this.createUnitComponents();

    this.addChild(
      this.environment,
      ...this.units,
      this.gameOverMessage,
      this.actions
    );

    this.checkTurn();
    this.addListeners();
  }

  init() {
    wait(1000).then(() => this.battle.init());
  }

  restart() {
    // TODO: reset data instead
    window.location.reload();
  }

  update() {
    this.environment.update();
  }

  addListeners() {
    this.battle.on('readyForAction', () => {
      this.checkTurn();
    });
    this.battle.on('gameover', async (winner: Unit) => {
      this.showActions(false);
      await wait(500);
      this.gameOverMessage.showWinMessage(winner.name);
    });

    this.gameOverMessage.on('restart', () => {
      this.restart();
    });

    if (this.playerController) {
      this.addActionListeners(this.playerController);
    }
  }

  addActionListeners(playerController: PlayerController) {
    const playerUnits = this.getUnitsByTeam(playerController.team);
    const enemyUnits = this.getUnitsByTeam(playerController.getOpponentTeam());

    this.actions.on('attack', () => {
      const aliveUnits = enemyUnits.filter(
        (component) => !component.unit.isDead
      );
      this.onceUnitPick(aliveUnits, (target) => {
        playerController.attack(target);
        this.showActions(false);
      });
    });
    this.actions.on('defence', () => {
      this.offUnitPick();
      playerController.defense();
      this.showActions(false);
    });
    this.actions.on('heal', () => {
      this.onceUnitPick(playerUnits, (target) => {
        playerController.heal(target);
        this.showActions(false);
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

  offUnitPick() {
    this.unitPickSubscriptions.forEach((unsubscribe) => unsubscribe());
  }

  onceUnitPick(enemyUnits: UnitComponent[], action: (target: Unit) => void) {
    this.offUnitPick();

    this.unitPickSubscriptions = enemyUnits.map((unit) => {
      const handlePick = (target: Unit) => {
        this.offUnitPick();
        action(target);
      };

      unit.setPickable(true);
      unit.on('pick', handlePick);

      return () => {
        unit.setPickable(false);
        unit.off('pick', handlePick);
      };
    });
  }

  checkTurn() {
    if (this.playerController?.checkIsTurnAvailable()) {
      this.showActions(true);
    } else {
      this.showActions(false);
    }
  }

  getUnitsByTeam(team: Team) {
    return this.units.filter((component) => {
      return team.units.includes(component.unit);
    });
  }

  showActions(visible: boolean) {
    this.actions.show(visible);
  }
}
