import * as PIXI from 'pixi.js';
import { BattleConfig } from '../models/battle-config';
import { Button } from '../components/button';
import { BattleSettings } from '../components/battle-settings';
import { MenuWorldComponent } from '../components/menu-world';
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

const createdByStyle = new PIXI.TextStyle({
  fontSize: 24,
  fill: 0xffffff,
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

class CreatedBy extends PIXI.Text {
  constructor() {
    super('Created by @imprevo', createdByStyle);

    this.anchor.set(1);
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

enum GameMode {
  PLAYER_VS_CPU,
  CPU_VS_CPU,
}

export class MenuScene extends Scene {
  environment = new MenuWorldComponent();
  title = new Title();
  createdBy = new CreatedBy();
  playerVsCpuBtn = new ActionButton('Player vs CPU');
  cpuVsCpuBtn = new ActionButton('CPU vs CPU');
  settings = new BattleSettings();

  gameMode?: GameMode;

  constructor() {
    super();

    this.title.x = 50;
    this.title.y = 30;

    this.createdBy.x = 750;
    this.createdBy.y = 570;

    this.playerVsCpuBtn.x = 630;
    this.playerVsCpuBtn.y = 300;
    this.cpuVsCpuBtn.x = 630;
    this.cpuVsCpuBtn.y = 400;

    this.settings.x = 500;
    this.settings.y = 100;

    this.addChild(
      this.environment,
      this.title,
      this.createdBy,
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
    this.gameMode = GameMode.PLAYER_VS_CPU;
    this.settings.show(true);
  };

  handleCpuMode = () => {
    this.gameMode = GameMode.CPU_VS_CPU;
    this.settings.show(true);
  };

  handlePlay = (data: BattleConfig) => {
    switch (this.gameMode) {
      case GameMode.PLAYER_VS_CPU:
        this.setPlayerVsCpuConfig(data);
        break;
      case GameMode.CPU_VS_CPU:
        this.setCpuVsCpuConfig(data);
        break;
      default:
        throw new Error(`Unknown mode: "${this.gameMode}"`);
    }

    this.emit('play', data);
  };

  setPlayerVsCpuConfig(data: BattleConfig) {
    data.team1.controlled = true;
    data.team2.controlled = false;
  }

  setCpuVsCpuConfig(data: BattleConfig) {
    data.team1.controlled = false;
    data.team2.controlled = false;
  }
}
