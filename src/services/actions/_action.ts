import { AbilityType } from '../../models/abilities';
import { Team } from '../../models/team';
import { Unit } from '../../models/unit';
import { wait } from '../../utils/promise';

const DEFAULT_DELAY = 1000;

export abstract class Action {
  team: Team;
  delay: number;
  points: number;

  constructor(team: Team, points: number, delay = DEFAULT_DELAY) {
    this.team = team;
    this.points = points;
    this.delay = delay;
  }

  async execute() {
    if (!this.canExecute()) {
      throw new Error(`Can't execute action ${this.constructor.name}!`);
    }

    await this.action();

    if (this.delay) {
      await wait(this.delay);
    }
  }

  canExecute() {
    return true;
  }

  protected abstract action(): Promise<void> | void;
}

export abstract class ActionCreator {
  constructor(public team: Team, public abilityType: AbilityType) {}

  canCreate() {
    return this.canUseAbility();
  }

  abstract create(): Action;

  canUseAbility() {
    const healAbility = this.team.currentUnit.abilities.getAbility(
      this.abilityType
    );
    return healAbility?.canUse() || false;
  }
}

export abstract class TargetActionCreator extends ActionCreator {
  targets: Unit[];
  target?: Unit;

  constructor(team: Team, abilityType: AbilityType, targets: Unit[]) {
    super(team, abilityType);

    this.targets = targets;
  }

  canCreate() {
    return this.targets.length > 0 && super.canCreate();
  }

  setTarget(target: Unit) {
    this.target = target;
  }
}
