export enum AbilityType {
  ATTACK,
  AOE_ATTACK,
  DEFENSE,
  HEAL,
  REVIVE,
}

class Cooldown {
  turnsWait = 0;

  constructor(public cooldown: number) {}

  canUse() {
    return this.turnsWait === 0;
  }

  use() {
    // TODO: why +1?
    this.turnsWait = this.cooldown + 1;
  }

  turnStart() {
    this.turnsWait = Math.max(0, this.turnsWait - 1);
  }
}

class Amount {
  value = 0;

  canUse() {
    return this.value > 0;
  }

  use() {
    this.value -= Math.max(0, this.value - 1);
  }
}

export class Ability {
  constructor(public type: AbilityType) {}

  canUse() {
    return true;
  }

  use() {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
  }

  startTurn() {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
  }

  endTurn() {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
  }
}

export class AttackAbility extends Ability {
  constructor() {
    super(AbilityType.ATTACK);
  }
}

export class AoeAttackAbility extends Ability {
  cooldown = new Cooldown(2);

  constructor() {
    super(AbilityType.AOE_ATTACK);
  }

  canUse() {
    return this.cooldown.canUse();
  }

  use() {
    this.cooldown.use();
  }

  startTurn() {
    this.cooldown.turnStart();
  }
}

export class DefenseAbility extends Ability {
  constructor() {
    super(AbilityType.DEFENSE);
  }
}

export class HealAbility extends Ability {
  cooldown = new Cooldown(1);
  amount = new Amount();

  constructor(count: number) {
    super(AbilityType.HEAL);
    this.amount.value = count;
  }

  canUse() {
    return this.cooldown.canUse() && this.amount.canUse();
  }

  use() {
    this.amount.use();
    this.cooldown.use();
  }

  startTurn() {
    this.cooldown.turnStart();
  }
}

export class ReviveAbility extends Ability {
  cooldown = new Cooldown(1);
  amount = new Amount();

  constructor(count: number) {
    super(AbilityType.REVIVE);
    this.amount.value = count;
  }

  canUse() {
    return this.cooldown.canUse() && this.amount.canUse();
  }

  use() {
    this.amount.use();
    this.cooldown.use();
  }

  startTurn() {
    this.cooldown.turnStart();
  }
}

export class AbilityList {
  list: Ability[] = [
    new AttackAbility(),
    new AoeAttackAbility(),
    new DefenseAbility(),
    new HealAbility(3),
    new ReviveAbility(1),
  ];

  startTurn() {
    this.list.forEach((ability) => ability.startTurn());
  }

  endTurn() {
    this.list.forEach((ability) => ability.endTurn());
  }

  getAbility(abilityType: AbilityType) {
    return this.list.find((ability) => ability.type === abilityType);
  }
}
