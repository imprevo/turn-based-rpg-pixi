import * as PIXI from 'pixi.js';
import * as TWEEN from '@tweenjs/tween.js';
import { Button } from './button';

const BTN_CELL_SIZE = 64;

class AttackButton extends Button {
  constructor() {
    super(PIXI.Texture.from('iconAttack'));
  }
}

class ShieldButton extends Button {
  constructor() {
    super(PIXI.Texture.from('iconShield'));
  }
}

class PlusButton extends Button {
  constructor() {
    super(PIXI.Texture.from('iconPlus'));
  }
}

class HeartButton extends Button {
  constructor() {
    super(PIXI.Texture.from('iconHeart'));
  }
}

export class ActionButtonsComponent extends PIXI.Container {
  attackButton = new AttackButton();
  defenceButton = new ShieldButton();
  healButton = new PlusButton();
  reviveButton = new HeartButton();

  constructor() {
    super();

    this.x = 400;
    this.y = 650;

    this.alignButtons([
      this.attackButton,
      this.defenceButton,
      this.healButton,
      this.reviveButton,
    ]);

    this.addChild(
      this.attackButton,
      this.defenceButton,
      this.healButton,
      this.reviveButton
    );
  }

  addListeners() {
    this.removeListeners();

    this.attackButton.on('click', this.doAttack);
    this.defenceButton.on('click', this.doDefence);
    this.healButton.on('click', this.doHeal);
    this.reviveButton.on('click', this.doRevive);
  }

  removeListeners() {
    this.attackButton.off('click', this.doAttack);
    this.defenceButton.off('click', this.doDefence);
    this.healButton.off('click', this.doHeal);
    this.reviveButton.off('click', this.doRevive);
  }

  doAttack = () => {
    this.emit('attack');
  };

  doDefence = () => {
    this.emit('defence');
  };

  doHeal = () => {
    this.emit('heal');
  };

  doRevive = () => {
    this.emit('revive');
  };

  alignButtons(buttons: Button[]) {
    const offset = ((buttons.length - 1) * BTN_CELL_SIZE) / 2;

    buttons.forEach((btn, index) => {
      btn.x = BTN_CELL_SIZE * index - offset;
    });
  }

  show(show: boolean) {
    const y = show ? 550 : 650;
    new TWEEN.Tween(this).to({ y }, 300).start();

    if (show) {
      this.addListeners();
    } else {
      this.removeListeners();
    }
  }
}
