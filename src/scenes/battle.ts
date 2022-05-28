import { ActionButtonsComponent } from '../components/action-buttons';
import { GameOverComponent } from '../components/game-over';
import { BattleWorldComponent } from '../components/battle-world';
import { UnitComponent } from '../components/unit';
import { BattleService } from '../services/battle';
import { Unit } from '../models/unit';
import { wait } from '../utils/promise';
import { TeamController } from '../services/team-controller';
import { Scene } from './_scene';
import {
  ActionCreator,
  TargetActionCreator,
} from '../services/actions/_action';

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

  addActionListeners(teamCtrl: TeamController) {
    this.battle.on('readyForAction', () => {
      this.checkTurn(teamCtrl);
    });
    this.actions.on('attack', () => {
      const action = teamCtrl.createAttackAC();
      this.useAction(teamCtrl, action);
    });
    this.actions.on('aoeAttack', () => {
      const action = teamCtrl.createAoeAttackAC();
      this.useAction(teamCtrl, action);
    });
    this.actions.on('defence', () => {
      const action = teamCtrl.createDefenseAC();
      this.useAction(teamCtrl, action);
    });
    this.actions.on('heal', () => {
      const action = teamCtrl.createHealAC();
      this.useAction(teamCtrl, action);
    });
    this.actions.on('revive', () => {
      const action = teamCtrl.createReviveAC();
      this.useAction(teamCtrl, action);
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

  useAction(teamCtrl: TeamController, actionCreator: ActionCreator) {
    this.offUnitPick();

    if (actionCreator instanceof TargetActionCreator) {
      const units = this.getUnitsComponentsByUnits(actionCreator.targets);
      this.addPickUnitListener(units, (target) => {
        actionCreator.setTarget(target);
        teamCtrl.applyAction(actionCreator);
        this.showActions(false);
      });
    } else {
      teamCtrl.applyAction(actionCreator);
      this.showActions(false);
    }
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
    return this.units.filter((component) => units.includes(component.unit));
  }

  showActions(visible: boolean) {
    this.actions.show(visible);
  }
}
