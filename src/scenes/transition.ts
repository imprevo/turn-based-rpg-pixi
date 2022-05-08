import { Easing, Tween } from '@tweenjs/tween.js';
import * as PIXI from 'pixi.js';
import { PRIMARY_BG_COLOR } from '../constants/config';
import { waitTween } from '../utils/tween';
import { Scene } from './_scene';

class Background extends PIXI.Graphics {
  constructor() {
    super();

    this.beginFill(PRIMARY_BG_COLOR);
    this.drawRect(0, 0, 800, 600);
  }
}

export class TransitionScene extends Scene {
  background = new Background();
  delay = 500;

  constructor() {
    super();

    this.alpha = 0;

    this.addChild(this.background);
  }

  show() {
    return waitTween(
      new Tween(this).to({ alpha: 1 }, this.delay).easing(Easing.Back.In)
    );
  }

  hide() {
    return waitTween(
      new Tween(this).to({ alpha: 0 }, this.delay).easing(Easing.Back.In)
    );
  }
}
