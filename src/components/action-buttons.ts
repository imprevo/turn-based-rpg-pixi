import * as PIXI from 'pixi.js';
import { Easing, Tween } from '@tweenjs/tween.js';
import { Button } from './button';
import { Ability, AbilityList, AbilityType } from '../models/abilities';

const BTN_CELL_SIZE = 64;

class AbilityButton extends Button {
  ability: Ability;
  eventType: string;

  constructor(texture: PIXI.Texture, ability: Ability, eventType: string) {
    super(texture, !ability.canUse());
    this.ability = ability;
    this.eventType = eventType;
  }
}

class AttackButton extends AbilityButton {
  constructor(ability: Ability) {
    super(PIXI.Texture.from('iconAttack'), ability, 'attack');
  }
}

class AoeAttackButton extends AbilityButton {
  constructor(ability: Ability) {
    super(PIXI.Texture.from('iconEnergy'), ability, 'aoeAttack');
  }
}

class DefenseButton extends AbilityButton {
  constructor(ability: Ability) {
    super(PIXI.Texture.from('iconShield'), ability, 'defence');
  }
}

class HealButton extends AbilityButton {
  constructor(ability: Ability) {
    super(PIXI.Texture.from('iconPlus'), ability, 'heal');
  }
}

class ReviveButton extends AbilityButton {
  constructor(ability: Ability) {
    super(PIXI.Texture.from('iconHeart'), ability, 'revive');
  }
}

class Hint extends PIXI.Text {
  tween?: Tween<Hint>;

  constructor() {
    super('', { fill: 0xffffff, fontSize: 26 });
    this.anchor.set(0.5);
    this.alpha = 0;
  }

  show(message: string) {
    this.text = message;
    this.alpha = 0;

    this.tween?.stop();
    this.tween = new Tween(this)
      .to({ alpha: 1 }, 500)
      .yoyo(true)
      .repeat(5)
      .easing(Easing.Back.Out)
      .start();
  }
}

export class ActionButtonsComponent extends PIXI.Container {
  hint = new Hint();

  constructor() {
    super();

    this.x = 400;
    this.y = 650;

    this.hint.y = -50;
  }

  setAbilities(abilities: AbilityList) {
    this.removeChildren();

    // TODO: disable buttons if necessary
    const buttons = this.getButtonsConfig(abilities);

    buttons.forEach((button) => {
      button.on('click', () => this.emit(button.eventType));
    });

    this.alignButtons(buttons);
    this.addChild(this.hint, ...buttons);
  }

  show(show: boolean) {
    const y = show ? 550 : 650;
    new Tween(this).to({ y }, 300).start();
  }

  showHint(message: string) {
    this.hint.show(message);
  }

  alignButtons(buttons: Button[]) {
    const offset = ((buttons.length - 1) * BTN_CELL_SIZE) / 2;

    buttons.forEach((btn, index) => {
      btn.x = BTN_CELL_SIZE * index - offset;
    });
  }

  getButtonsConfig(abilities: AbilityList) {
    return abilities.list
      .map((ability) => this.createButtonByAbility(ability))
      .filter((btn): btn is AbilityButton => btn !== null);
  }

  createButtonByAbility(ability: Ability) {
    switch (ability.type) {
      case AbilityType.ATTACK:
        return new AttackButton(ability);
      case AbilityType.AOE_ATTACK:
        return new AoeAttackButton(ability);
      case AbilityType.DEFENSE:
        return new DefenseButton(ability);
      case AbilityType.HEAL:
        return new HealButton(ability);
      case AbilityType.REVIVE:
        return new ReviveButton(ability);
      default:
        return null;
    }
  }
}
