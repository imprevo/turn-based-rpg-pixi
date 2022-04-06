import * as PIXI from 'pixi.js';
import { Environment } from './components/environment';

export const app = new PIXI.Application({
  backgroundColor: 0x1099bb,
  width: 800,
  height: 600,
});

const environment = new Environment();
app.stage.addChild(environment);

const basicText = new PIXI.Text('Turn-based RPG');
basicText.x = 50;
basicText.y = 50;
app.stage.addChild(basicText);

app.ticker.add(() => {
  environment.update();
});
