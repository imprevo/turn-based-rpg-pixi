import * as PIXI from 'pixi.js';
import avaImg from './assets/ava.jpg';

export const app = new PIXI.Application({
  backgroundColor: 0x1099bb,
});

const basicText = new PIXI.Text('Basic text in pixi');
basicText.x = 50;
basicText.y = 100;
app.stage.addChild(basicText);

const texture = PIXI.Texture.from(avaImg);
const ava = new PIXI.Sprite(texture);
ava.x = 200;
ava.y = 200;
app.stage.addChild(ava);
