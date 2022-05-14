import * as PIXI from 'pixi.js';

// TODO: add disable state
export class Button extends PIXI.Sprite {
  isDown = false;
  isOver = false;

  constructor(texture: PIXI.Texture, disable = false) {
    super(texture);

    this.anchor.set(0.5);

    this.setDisable(disable);
    this.addListeners();
  }

  // TODO: will they be removed after destroying automatically?
  addListeners() {
    this.on('pointerdown', this.onButtonDown)
      .on('pointerup', this.onButtonUp)
      .on('pointerupoutside', this.onButtonUp)
      .on('pointerover', this.onButtonOver)
      .on('pointerout', this.onButtonOut);
  }

  onButtonDown() {
    this.isDown = true;
    this.setActiveColor();
  }

  onButtonUp() {
    this.isDown = false;
    if (this.isOver) {
      this.setHoverColor();
    } else {
      this.setDefaultColor();
    }
  }

  onButtonOver() {
    this.isOver = true;
    if (this.isDown) {
      return;
    }

    this.setHoverColor();
  }

  onButtonOut() {
    this.isOver = false;
    if (this.isDown) {
      return;
    }

    this.setDefaultColor();
  }

  setDisable(disable: boolean) {
    if (disable) {
      this.interactive = false;
      this.buttonMode = false;
      this.setDisableColor();
    } else {
      this.interactive = true;
      this.buttonMode = true;
      this.setDefaultColor();
    }
  }

  setDefaultColor() {
    this.tint = 0xffffff;
  }

  setHoverColor() {
    this.tint = 0xcccccc;
  }

  setActiveColor() {
    this.tint = 0xaaaaaa;
  }

  setDisableColor() {
    this.tint = 0x888888;
  }
}
