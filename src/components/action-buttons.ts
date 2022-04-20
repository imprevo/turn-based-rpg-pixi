import * as PIXI from 'pixi.js';

class BaseButton extends PIXI.Sprite {
  isDown = false;
  isOver = false;

  constructor(texture: PIXI.Texture) {
    super(texture);

    this.anchor.set(0.5);

    this.setDefault();
    this.addListeners();
  }

  // TODO: will they be removed after destroying automatically?
  addListeners() {
    this.interactive = true;
    this.buttonMode = true;

    this.on('pointerdown', this.onButtonDown)
      .on('pointerup', this.onButtonUp)
      .on('pointerupoutside', this.onButtonUp)
      .on('pointerover', this.onButtonOver)
      .on('pointerout', this.onButtonOut);
  }

  onButtonDown() {
    this.isDown = true;
    this.setActive();
  }

  onButtonUp() {
    this.isDown = false;
    if (this.isOver) {
      this.setHover();
    } else {
      this.setDefault();
    }
  }

  onButtonOver() {
    this.isOver = true;
    if (this.isDown) {
      return;
    }

    this.setHover();
  }

  onButtonOut() {
    this.isOver = false;
    if (this.isDown) {
      return;
    }

    this.setDefault();
  }

  setDefault() {
    this.tint = 0xffffff;
  }

  setHover() {
    this.tint = 0xcccccc;
  }

  setActive() {
    this.tint = 0xaaaaaa;
  }
}

class AttackButton extends BaseButton {
  constructor() {
    super(PIXI.Texture.from('iconAttack'));
  }
}

class ShieldButton extends BaseButton {
  constructor() {
    super(PIXI.Texture.from('iconShield'));
  }
}

class PlusButton extends BaseButton {
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
    this.y = 550;

    this.attackButton.x = -64;
    this.healButton.x = 64;

    this.addChild(this.attackButton, this.defenceButton, this.healButton);

    this.addListeners();
  }

  addListeners() {
    this.attackButton.on('click', this.doAttack);
    this.defenceButton.on('click', this.doDefence);
    this.healButton.on('click', this.doHeal);
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
}