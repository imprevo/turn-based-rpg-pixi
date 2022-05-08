import * as PIXI from 'pixi.js';
import TextInput, { InputConfig } from 'pixi-text-input';
import { BattleConfig, TeamConfig } from '../models/battle-config';
import { Button } from '../components/button';
import { Counter } from '../components/counter';

const buttonStyle = new PIXI.TextStyle({
  fontSize: 26,
  fill: 0xffffff,
  dropShadow: true,
  dropShadowColor: '#000000',
  dropShadowBlur: 1,
});

class PlayButton extends Button {
  text = new PIXI.Text('', buttonStyle);

  constructor(text: string) {
    super(PIXI.Texture.from('button12'));

    this.text.text = text;
    this.text.anchor.set(0.5);

    this.addChild(this.text);
  }
}

class PanelBackground extends PIXI.Sprite {
  constructor() {
    super(PIXI.Texture.from('panel8'));
  }
}

const inputConfig: InputConfig = {
  input: {
    fontSize: '20px',
    padding: '4px',
    width: '200px',
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

class TeamSettings extends PIXI.Container {
  title = new PIXI.Text('Team');
  teamName = new TextInput(inputConfig);
  counter = new Counter(2, 1, 6);
  controlled: boolean; // TODO: remove

  constructor(title: string, teamName: string, controlled: boolean) {
    super();

    this.controlled = controlled;

    this.pivot.set(116, 130);

    this.title.text = title;
    this.title.x = 134;
    this.title.anchor.set(0.5, 0);

    this.teamName.text = teamName;
    this.teamName.x = 30;
    this.teamName.y = 40;

    this.counter.x = 134;
    this.counter.y = 110;

    this.addChild(this.title, this.teamName, this.counter);
  }

  getData() {
    return new TeamConfig(
      this.teamName.text,
      this.counter.count,
      this.controlled
    );
  }
}

export class BattleSettings extends PIXI.Container {
  bg = new PanelBackground();
  playBtn = new PlayButton('PLAY!');
  team1 = new TeamSettings('Team 1', 'Left', true);
  team2 = new TeamSettings('Team 2', 'Right', false);
  closeBtn = new Button(PIXI.Texture.from('btnClose2'));

  constructor() {
    super();

    this.visible = false;

    this.bg.scale.x = -1;
    this.bg.anchor.set(1, 0);

    this.team1.x = 150;
    this.team1.y = 160;

    this.team2.x = 150;
    this.team2.y = 340;

    this.playBtn.x = 170;
    this.playBtn.y = 400;

    this.closeBtn.x = 10;
    this.closeBtn.y = 10;

    this.addChild(this.bg, this.team1, this.team2, this.playBtn, this.closeBtn);
    this.addListeners();
  }

  addListeners() {
    this.playBtn.on('click', this.handlePlay);
    this.closeBtn.on('click', this.handleClose);
  }

  handlePlay = () => {
    const data = new BattleConfig(this.team1.getData(), this.team2.getData());
    this.emit('play', data);
  };

  handleClose = () => {
    this.show(false);
  };

  show(show: boolean) {
    this.visible = show;
  }
}
