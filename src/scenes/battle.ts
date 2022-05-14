import { ActionButtonsComponent } from '../components/action-buttons';
import { GameOverComponent } from '../components/game-over';
import { BattleWorldComponent } from '../components/battle-world';
import { UnitComponent } from '../components/unit';
import { BattleService } from '../services/battle';
import { Unit } from '../models/unit';
import { wait } from '../utils/promise';
import { TeamController } from '../services/team-controller';
import { Team } from '../models/team';
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
    const playerUnits = this.getUnitsByTeam(playerController.team);
    const enemyUnits = this.getUnitsByTeam(playerController.getOpponentTeam());

    this.battle.on('readyForAction', () => {
      this.checkTurn(playerController);
    });
    // TODO: use getAliveUnits and getDeadUnits from team
    this.actions.on('attack', () => {
      this.offUnitPick();
      const aliveUnits = enemyUnits.filter(
        (component) => !component.unit.isDead
      );
      this.addPickUnitLitener(aliveUnits, (target) => {
        playerController.attack(target);
        this.showActions(false);
      });
    });
    this.actions.on('aoeAttack', () => {
      this.offUnitPick();
      const aliveUnits = enemyUnits
        .filter((component) => !component.unit.isDead)
        .map((component) => component.unit);
      playerController.aoeAttack(aliveUnits);
      this.showActions(false);
    });
    this.actions.on('defence', () => {
      this.offUnitPick();
      playerController.defense();
      this.showActions(false);
    });
    this.actions.on('heal', () => {
      this.offUnitPick();
      const aliveUnits = playerUnits.filter(
        (component) => !component.unit.isDead
      );
      this.addPickUnitLitener(aliveUnits, (target) => {
        playerController.heal(target);
        this.showActions(false);
      });
    });
    this.actions.on('revive', () => {
      this.offUnitPick();
      const deadUnits = playerUnits.filter(
        (component) => component.unit.isDead
      );
      this.addPickUnitLitener(deadUnits, (target) => {
        playerController.revive(target);
        this.showActions(false);
      });
    });
  }

  addPickUnitLitener(units: UnitComponent[], action: (target: Unit) => void) {
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

  getUnitsByTeam(team: Team) {
    return this.units.filter((component) => {
      return team.units.includes(component.unit);
    });
  }

  showActions(visible: boolean) {
    this.actions.show(visible);
  }
}
