import * as PIXI from 'pixi.js';
import { Environment } from './components/environment';

export const app = new PIXI.Application({
  backgroundColor: 0x1099bb,
  width: 800,
  height: 600,
});

const container = new Environment();
app.stage.addChild(container);

const basicText = new PIXI.Text('Turn-based RPG');
basicText.x = 50;
basicText.y = 50;
app.stage.addChild(basicText);
