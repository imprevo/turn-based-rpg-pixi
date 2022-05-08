import * as PIXI from 'pixi.js';
import { wait } from '../utils/promise';
import { Background, Dock, Ground, Puddle1 } from './environment';
import { IdleAnimationSprite, WakeAnimationSprite } from './unit-animations';

class Unit extends PIXI.Container {
  animation = new WakeAnimationSprite();

  constructor(x: number, y: number) {
    super();

    this.x = x;
    this.y = y;
    this.scale.set(2);

    this.addChild(this.animation);
  }

  async runWakeAnimation() {
    await wait(1000);
    this.animation.play();
    this.animation.onComplete = () => {
      this.removeChild(this.animation);
      this.animation = new IdleAnimationSprite();
      this.animation.play();

      this.addChild(this.animation);
    };
  }
}

// TODO: get canvas size and scale from arguments?
export class MenuWorldComponent extends PIXI.Container {
  dock = new Dock(30, 120);
  background = new Background();
  ground = new Ground();
  puddle = new Puddle1(200, 420);
  unit1 = new Unit(100, 350);
  unit2 = new Unit(200, 450);

  constructor() {
    super();

    this.dock.scale.set(6);
    this.puddle.scale.set(6);
    this.unit1.runWakeAnimation();

    this.addChild(
      this.background,
      this.ground,
      this.dock,
      this.puddle,
      this.unit1,
      this.unit2
    );
  }
}
