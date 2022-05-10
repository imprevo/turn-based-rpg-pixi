import { Tween } from '@tweenjs/tween.js';
import * as PIXI from 'pixi.js';

export class HintComponent extends PIXI.Text {
  constructor(text: string, color: number) {
    super(text, {
      fontSize: 16,
      fill: color,
    });
    this.y = -70;
    this.anchor.set(0.5);
  }

  show(container: PIXI.Container) {
    const tweenMove = new Tween(this).to({ y: -85 }, 800);
    const tweenHide = new Tween(this).to({ alpha: 0 }, 200);

    container.addChild(this);

    tweenMove
      .chain(tweenHide.onComplete(() => container.removeChild(this)))
      .start();
  }
}
