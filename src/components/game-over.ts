import { Tween } from '@tweenjs/tween.js';
import * as PIXI from 'pixi.js';
import { Button } from './button';

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

const buttonStyle = new PIXI.TextStyle({
  fontSize: 40,
  fill: 0xb6b2ff,
  dropShadow: true,
  dropShadowColor: '#000000',
  dropShadowBlur: 1,
});

class RestartButton extends Button {
  restartBtnText = new PIXI.Text('RESTART?', buttonStyle);

  constructor() {
    super(PIXI.Texture.from('button'));

    this.restartBtnText.anchor.set(0.5);

    this.addChild(this.restartBtnText);
  }
}

export class GameOverComponent extends PIXI.Container {
  title = new PIXI.Text('GAME OVER', titleStyle);
  message = new PIXI.Text('', messageStyle);
  shadow = new PIXI.Graphics();
  restartBtn = new RestartButton();

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

    this.restartBtn.x = 400;
    this.restartBtn.y = 400;

    this.addChild(this.shadow, this.title, this.message, this.restartBtn);

    this.addListeners();
  }

  addListeners() {
    this.restartBtn.on('click', this.handleRestart);
  }

  handleRestart = () => {
    this.emit('restart');
  };

  show(message: string) {
    this.title.y = -100;
    new Tween(this.title).to({ y: 200 }, 1000).start();

    this.message.y = 700;
    this.message.text = message;
    new Tween(this.message).to({ y: 300 }, 1000).start();

    this.restartBtn.y = 800;
    new Tween(this.restartBtn).to({ y: 400 }, 1000).start();

    this.visible = true;
  }

  showWinMessage(teamName: string) {
    this.show(`${teamName} team wins!`);
  }
}
