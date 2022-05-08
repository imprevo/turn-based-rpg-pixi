import * as PIXI from 'pixi.js';
import { BattleConfig } from '../models/battle-config';
import { Button } from '../components/button';
import { Scene } from './_scene';
import { BattleSettings } from '../components/battle-settings';

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
  fontSize: 30,
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

class ActionButton extends Button {
  text = new PIXI.Text('', buttonStyle);

  constructor(text: string) {
    super(PIXI.Texture.from('button'));

    this.text.text = text;
    this.text.anchor.set(0.5);

    this.addChild(this.text);
  }
}

export class MenuScene extends Scene {
  title = new Title();
  playerVsCpuBtn = new ActionButton('Player vs CPU');
  cpuVsCpuBtn = new ActionButton('CPU vs CPU');
  settings = new BattleSettings();

  constructor() {
    super();

    this.title.x = 50;
    this.title.y = 50;

    this.playerVsCpuBtn.x = 630;
    this.playerVsCpuBtn.y = 300;
    this.cpuVsCpuBtn.x = 630;
    this.cpuVsCpuBtn.y = 400;

    this.settings.x = 480;
    this.settings.y = 100;

    this.addChild(
      this.title,
      this.playerVsCpuBtn,
      this.cpuVsCpuBtn,
      this.settings
    );
    this.addListeners();
  }

  addListeners() {
    this.playerVsCpuBtn.on('click', this.handlePlayerMode);
    this.cpuVsCpuBtn.on('click', this.handleCpuMode);
    this.settings.on('play', this.handlePlay);
  }

  handlePlayerMode = () => {
    this.settings.show(true);
  };

  handleCpuMode = () => {
    this.settings.show(true);
  };

  handlePlay = (data: BattleConfig) => {
    // TODO: handle play mode: player | cpu
    this.emit('play', data);
  };
}
