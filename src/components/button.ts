import * as PIXI from 'pixi.js';

export class Button extends PIXI.Sprite {
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
