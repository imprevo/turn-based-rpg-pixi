import * as PIXI from 'pixi.js';
import { Button } from './button';

const titleStyle = new PIXI.TextStyle({
  fontSize: 50,
  fill: 0xffffff,
  dropShadow: true,
  dropShadowColor: '#000000',
  dropShadowBlur: 4,
  dropShadowAngle: Math.PI / 6,
  dropShadowDistance: 6,
});

const panelTitleStyle = new PIXI.TextStyle({
  fontSize: 30,
  fill: 0x000000,
});

const buttonStyle = new PIXI.TextStyle({
  fontSize: 40,
  fill: 0xb6b2ff,
  dropShadow: true,
  dropShadowColor: '#000000',
  dropShadowBlur: 1,
});

class Title extends PIXI.Text {
  constructor() {
    super('Turn-based RPG', titleStyle);
  }
}

class PlayButton extends Button {
  text = new PIXI.Text('PLAY!', buttonStyle);

  constructor() {
    super(PIXI.Texture.from('button'));

    this.text.anchor.set(0.5);

    this.addChild(this.text);
  }
}

class PanelBackground extends PIXI.Sprite {
  constructor() {
    super(PIXI.Texture.from('panel2'));
  }
}

class PanelTitle extends PIXI.Text {
  constructor(text: string) {
    super(text, panelTitleStyle);
    this.anchor.set(0.5);
  }
}

class Panel extends PIXI.Container {
  bg = new PanelBackground();
  title = new PanelTitle('Team name');

  constructor(teamName: string) {
    super();

    this.pivot.set(116, 130);

    this.title.text = teamName;
    this.title.x = 116;
    this.title.y = 50;

    this.addChild(this.bg, this.title);
  }
}

export class Menu extends PIXI.Container {
  title = new Title();
  playBtn = new PlayButton();
  panelLeft = new Panel('Left');
  panelRight = new Panel('Right');

  constructor() {
    super();

    this.title.x = 400;
    this.title.y = 100;
    this.title.anchor.set(0.5);

    this.panelLeft.x = 250;
    this.panelLeft.y = 300;

    this.panelRight.x = 550;
    this.panelRight.y = 300;

    this.playBtn.x = 400;
    this.playBtn.y = 500;

    this.addChild(this.title, this.panelLeft, this.panelRight, this.playBtn);
    this.addListeners();
  }

  addListeners() {
    this.playBtn.on('click', this.handlePlay);
  }

  handlePlay = () => {
    this.emit('play');
  };
}
