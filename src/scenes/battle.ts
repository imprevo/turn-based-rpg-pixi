import { ActionButtonsComponent } from '../components/action-buttons';
import { GameOverComponent } from '../components/game-over';
import { BattleWorldComponent } from '../components/battle-world';
import { UnitComponent } from '../components/unit';
import { BattleService } from '../services/battle';
import { Unit } from '../models/unit';
import { wait } from '../utils/promise';
import { TeamController } from '../services/team-controller';
import { Scene } from './_scene';

export class BattleScene extends Scene {
  battle: BattleService;

  environment = new BattleWorldComponent();
  gameOverMessage = new GameOverComponent();
  actions = new ActionButtonsComponent();
  units: UnitComponent[];
  unitPickSubscriptions: (() => void)[] = [];

  constructor(battle: BattleService) {
    super();

    this.battle = battle;
    this.units = this.createUnitComponents();

    this.addChild(
      this.environment,
      ...this.units,
      this.gameOverMessage,
      this.actions
    );

    this.addListeners();
  }

  init() {
    wait(1000).then(() => this.battle.init());
  }

  update() {
    this.environment.update();
  }

  addListeners() {
    this.battle.on('gameover', async (winner: Unit) => {
      this.showActions(false);
      await wait(500);
      this.gameOverMessage.showWinMessage(winner.name);
    });

    this.gameOverMessage.on('restart', () => {
      this.emit('restart');
    });

    this.gameOverMessage.on('exit', () => {
      this.emit('exit');
    });
  }

  addActionListeners(playerController: TeamController) {
    this.battle.on('readyForAction', () => {
      this.checkTurn(playerController);
    });
    this.actions.on('attack', () => {
      this.offUnitPick();
      const actionCreator = playerController.createAttackAC();
      const units = this.getUnitsComponentsByUnits(actionCreator.targets);
      this.addPickUnitListener(units, (target) => {
        actionCreator.setTarget(target);
        playerController.applyAction(actionCreator);
        this.showActions(false);
      });
    });
    this.actions.on('aoeAttack', () => {
      this.offUnitPick();
      const actionCreator = playerController.createAoeAttackAC();
      playerController.applyAction(actionCreator);
      this.showActions(false);
    });
    this.actions.on('defence', () => {
      this.offUnitPick();
      const actionCreator = playerController.createDefenseAC();
      playerController.applyAction(actionCreator);
      this.showActions(false);
    });
    this.actions.on('heal', () => {
      this.offUnitPick();
      const actionCreator = playerController.createHealAC();
      const units = this.getUnitsComponentsByUnits(actionCreator.targets);
      this.addPickUnitListener(units, (target) => {
        actionCreator.setTarget(target);
        playerController.applyAction(actionCreator);
        this.showActions(false);
      });
    });
    this.actions.on('revive', () => {
      this.offUnitPick();
      const actionCreator = playerController.createReviveAC();
      const units = this.getUnitsComponentsByUnits(actionCreator.targets);
      this.addPickUnitListener(units, (target) => {
        actionCreator.setTarget(target);
        playerController.applyAction(actionCreator);
        this.showActions(false);
      });
    });
  }

  addPickUnitListener(units: UnitComponent[], action: (target: Unit) => void) {
    if (units.length > 0) {
      this.onceUnitPick(units, action);
    } else {
      this.actions.showHint('No targets available');
    }
  }

  setController(playerController: TeamController) {
    // TODO: create additional component
    this.addActionListeners(playerController);
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

  onceUnitPick(units: UnitComponent[], action: (target: Unit) => void) {
    this.unitPickSubscriptions = units.map((unit) => {
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

  checkTurn(playerController: TeamController) {
    if (playerController.checkIsTurnAvailable()) {
      // TODO: fix encapsulation
      this.actions.setAbilities(playerController.team.currentUnit.abilities);
      this.showActions(true);
    } else {
      this.showActions(false);
    }
  }

  getUnitsComponentsByUnits(units: Unit[]) {
    return this.units.filter((component) => {
      return units.includes(component.unit);
    });
  }

  showActions(visible: boolean) {
    this.actions.show(visible);
  }
}
