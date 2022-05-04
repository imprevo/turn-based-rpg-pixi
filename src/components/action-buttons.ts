import * as PIXI from 'pixi.js';
import * as TWEEN from '@tweenjs/tween.js';
import { Button } from './button';

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

export class ActionButtonsComponent extends PIXI.Container {
  attackButton = new AttackButton();
  defenceButton = new ShieldButton();
  healButton = new PlusButton();

  constructor() {
    super();

    this.x = 400;
    this.y = 650;

    this.attackButton.x = -64;
    this.healButton.x = 64;

    this.addChild(this.attackButton, this.defenceButton, this.healButton);
  }

  addListeners() {
    this.removeListeners();

    this.attackButton.on('click', this.doAttack);
    this.defenceButton.on('click', this.doDefence);
    this.healButton.on('click', this.doHeal);
  }

  removeListeners() {
    this.attackButton.off('click', this.doAttack);
    this.defenceButton.off('click', this.doDefence);
    this.healButton.off('click', this.doHeal);
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
