import * as PIXI from 'pixi.js';

const titleStyle = new PIXI.TextStyle({
  fontSize: 90,
  fill: 0xffffff,
  dropShadow: true,
  dropShadowColor: '#000000',
  dropShadowBlur: 4,
  dropShadowAngle: Math.PI / 6,
  dropShadowDistance: 6,
});

const messageStyle = new PIXI.TextStyle({
  fontSize: 50,
  fill: 0xffffff,
  dropShadow: true,
  dropShadowColor: '#000000',
  dropShadowBlur: 4,
  dropShadowAngle: Math.PI / 6,
  dropShadowDistance: 6,
});

export class GameOverComponent extends PIXI.Container {
  title = new PIXI.Text('GAME OVER', titleStyle);
  message = new PIXI.Text('', messageStyle);
  shadow = new PIXI.Graphics();

  constructor() {
    super();

    this.visible = false;
    this.shadow.beginFill(0x000000, 0.5);
    this.shadow.drawRect(0, 0, 800, 600);
    this.shadow.endFill();

    this.title.x = 400;
    this.title.y = 200;
    this.title.anchor.set(0.5);

    this.message.x = 400;
    this.message.y = 300;
    this.message.anchor.set(0.5);

    this.addChild(this.shadow, this.title, this.message);
  }

  show(message: string) {
    this.message.text = message;
    this.visible = true;
  }

  showWinMessage() {
    this.show('You WIN!');
  }

  showLoseMessage() {
    this.show('You LOSE!');
  }
}
