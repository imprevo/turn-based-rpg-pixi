import * as PIXI from 'pixi.js';
import {
  Background,
  Ground,
  Sun,
  Dock,
  Lantern,
  Puddle1,
  Puddle2,
  Garbage,
} from './environment';

// TODO: get canvas size and scale from arguments?
export class BattleWorldComponent extends PIXI.Container {
  background = new Background();
  ground = new Ground();
  sun = new Sun(680, 50);
  dock = new Dock(500, 200);
  lantern = new Lantern(350, 150);
  puddle1 = new Puddle1(350, 500);
  puddle2 = new Puddle2(100, 174);
  garbage = new Garbage(270, 350);

  constructor() {
    super();

    this.addChild(
      this.background,
      this.ground,
      this.sun,
      this.dock,
      this.lantern,
      this.puddle1,
      this.puddle2,
      this.garbage
    );
  }

  update() {
    this.sun.update();
  }
}
