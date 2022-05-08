import * as PIXI from 'pixi.js';
import { Button } from './button';

export class Counter extends PIXI.Container {
  countText = new PIXI.Text('Count');
  decreaseBtn = new Button(PIXI.Texture.from('iconArrowLeft'));
  increaseBtn = new Button(PIXI.Texture.from('iconArrowRight'));

  count = 0;
  min: number;
  max: number;

  constructor(count: number, min: number, max: number) {
    super();

    this.min = min;
    this.max = max;

    this.countText.anchor.set(0.5);
    this.decreaseBtn.x = -60;
    this.decreaseBtn.scale.set(0.7);
    this.increaseBtn.x = 60;
    this.increaseBtn.scale.set(0.7);

    this.updateCount(count);

    this.addChild(this.countText, this.increaseBtn, this.decreaseBtn);
    this.addListeners();
  }

  addListeners() {
    this.decreaseBtn.on('click', this.handleDecrease);
    this.increaseBtn.on('click', this.handleIncrease);
  }

  handleDecrease = () => {
    const value = Math.max(this.min, this.count - 1);
    this.updateCount(value);
  };

  handleIncrease = () => {
    const value = Math.min(this.max, this.count + 1);
    this.updateCount(value);
  };

  updateCount(count: number) {
    this.count = count;
    this.countText.text = count.toString();
  }
}
