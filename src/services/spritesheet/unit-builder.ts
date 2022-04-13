import idleImg from '../../assets/sci-fi/bot-wheel/charge.png';
import { SpriteGrid } from '../../utils/sprite';
import { SpritesheetBuilder } from './spritesheet-builder';

export class UnitSpritesheetBuilder extends SpritesheetBuilder {
  grid = new SpriteGrid(117, 26);

  constructor() {
    super(idleImg);
  }

  getConfig() {
    return {
      frames: {
        frame0: this.grid.getFrame(0, 0, 1, 1),
        frame1: this.grid.getFrame(0, 1, 1, 1),
        frame2: this.grid.getFrame(0, 2, 1, 1),
        frame3: this.grid.getFrame(0, 3, 1, 1),
      },
      // TODO: how to use it in components?
      animations: {
        idle: ['frame0', 'frame1', 'frame2', 'frame3'],
      },
      meta: {
        scale: '1',
      },
    };
  }
}
