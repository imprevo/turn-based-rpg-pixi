import * as PIXI from 'pixi.js';
import * as TWEEN from '@tweenjs/tween.js';

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
    this.title.y = -100;
    this.title.anchor.set(0.5);

    this.message.x = 400;
    this.message.y = 700;
    this.message.anchor.set(0.5);

    this.addChild(this.shadow, this.title, this.message);
  }

  show(message: string) {
    this.title.y = -100;
    new TWEEN.Tween(this.title).to({ y: 200 }, 1000).start();

    this.message.y = 700;
    this.message.text = message;
    new TWEEN.Tween(this.message).to({ y: 300 }, 1000).start();

    this.visible = true;
  }

  showWinMessage(teamName: string) {
    this.show(`${teamName} team wins!`);
  }
}
