import * as PIXI from 'pixi.js';
import { Environment } from './components/environment';
import { Unit } from './components/unit';

export const app = new PIXI.Application({
  backgroundColor: 0x1099bb,
  width: 800,
  height: 600,
});

const environment = new Environment();
app.stage.addChild(environment);

const unit1 = new Unit(100, 400);
app.stage.addChild(unit1);

const unit2 = new Unit(700, 400, true);
app.stage.addChild(unit2);

const basicText = new PIXI.Text('Turn-based RPG');
basicText.x = 50;
basicText.y = 50;
app.stage.addChild(basicText);

app.ticker.add(() => {
  environment.update();
});
