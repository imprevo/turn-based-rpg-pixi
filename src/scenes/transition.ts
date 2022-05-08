import { Tween } from '@tweenjs/tween.js';
import * as PIXI from 'pixi.js';
import { waitTween } from '../utils/tween';
import { Scene } from './_scene';

class Background extends PIXI.Graphics {
  constructor() {
    super();

    this.beginFill(0x000000);
    this.drawRect(0, 0, 800, 600);
  }
}

export class TransitionScene extends Scene {
  background = new Background();

  constructor() {
    super();

    this.alpha = 0;

    this.addChild(this.background);
  }

  show() {
    return waitTween(new Tween(this).to({ alpha: 1 }, 300));
  }

  hide() {
    return waitTween(new Tween(this).to({ alpha: 0 }, 300));
  }
}
