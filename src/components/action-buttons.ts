import * as PIXI from 'pixi.js';
import * as TWEEN from '@tweenjs/tween.js';
import { Button } from './button';
import { AbilityList, AbilityType } from '../models/abilities';

const BTN_CELL_SIZE = 64;

class AbilityButton extends Button {
  eventType: string;

  constructor(texture: PIXI.Texture, eventType: string) {
    super(texture);
    this.eventType = eventType;
  }
}

class AttackButton extends AbilityButton {
  constructor() {
    super(PIXI.Texture.from('iconAttack'), 'attack');
  }
}

class AoeAttackButton extends AbilityButton {
  constructor() {
    super(PIXI.Texture.from('iconEnergy'), 'aoeAttack');
  }
}

class DefenseButton extends AbilityButton {
  constructor() {
    super(PIXI.Texture.from('iconShield'), 'defence');
  }
}

class HealButton extends AbilityButton {
  constructor() {
    super(PIXI.Texture.from('iconPlus'), 'heal');
  }
}

class ReviveButton extends AbilityButton {
  constructor() {
    super(PIXI.Texture.from('iconHeart'), 'revive');
  }
}

export class ActionButtonsComponent extends PIXI.Container {
  constructor() {
    super();

    this.x = 400;
    this.y = 650;
  }

  setAbilities(abilities: AbilityList) {
    this.removeChildren();

    // TODO: disable buttons if necessary
    const buttons = this.getButtonsConfig(abilities);

    buttons.forEach((button) => {
      button.on('click', () => this.emit(button.eventType));
    });

    this.alignButtons(buttons);
    this.addChild(...buttons);
  }

  show(show: boolean) {
    const y = show ? 550 : 650;
    new TWEEN.Tween(this).to({ y }, 300).start();
  }

  alignButtons(buttons: Button[]) {
    const offset = ((buttons.length - 1) * BTN_CELL_SIZE) / 2;

    buttons.forEach((btn, index) => {
      btn.x = BTN_CELL_SIZE * index - offset;
    });
  }

  getButtonsConfig(abilities: AbilityList) {
    return abilities.list
      .map((ability) => this.getAbilityButtonByType(ability.type))
      .filter((btn): btn is AbilityButton => btn !== null);
  }

  getAbilityButtonByType(abilityType: AbilityType) {
    switch (abilityType) {
      case AbilityType.ATTACK:
        return new AttackButton();
      case AbilityType.AOE_ATTACK:
        return new AoeAttackButton();
      case AbilityType.DEFENSE:
        return new DefenseButton();
      case AbilityType.HEAL:
        return new HealButton();
      case AbilityType.REVIVE:
        return new ReviveButton();
      default:
        return null;
    }
  }
}
