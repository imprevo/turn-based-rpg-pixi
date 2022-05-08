import * as PIXI from 'pixi.js';
import TextInput, { InputConfig } from 'pixi-text-input';
import { BattleConfig, TeamConfig } from '../models/battle-config';
import { Button } from '../components/button';
import { Counter } from '../components/counter';
import { Scene } from './_scene';

const titleStyle = new PIXI.TextStyle({
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

const inputConfig: InputConfig = {
  input: {
    fontSize: '20px',
    padding: '4px',
    width: '160px',
    color: '#000',
    textAlign: 'center',
  },
  box: {
    default: {
      rounded: 12,
      stroke: { color: 0xcbcee0, width: 3 },
    },
    focused: {
      rounded: 12,
      stroke: { color: 0xabafc6, width: 3 },
    },
  },
};

class Panel extends PIXI.Container {
  bg = new PanelBackground();
  title = new TextInput(inputConfig);
  counter = new Counter(2, 1, 6);
  controlled: boolean; // TODO: add checkbox

  constructor(teamName: string, controlled: boolean) {
    super();

    this.controlled = controlled;

    this.pivot.set(116, 130);

    this.title.text = teamName;
    this.title.x = 30;
    this.title.y = 50;

    this.counter.x = 116;
    this.counter.y = 140;

    this.addChild(this.bg, this.title, this.counter);
  }

  getData() {
    return new TeamConfig(this.title.text, this.counter.count, this.controlled);
  }
}

export class MenuScene extends Scene {
  title = new Title();
  playBtn = new PlayButton();
  panelLeft = new Panel('Left', true);
  panelRight = new Panel('Right', false);

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
    const data = new BattleConfig(
      this.panelLeft.getData(),
      this.panelRight.getData()
    );
    this.emit('play', data);
  };
}
