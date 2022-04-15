import lifeBarTexture from '../../assets/basic-life-bars-a-icons.png';
import { SpriteGrid } from '../../utils/sprite';
import { SpritesheetBuilder } from './spritesheet-builder';

export class LifeBarBuilder extends SpritesheetBuilder {
  grid = new SpriteGrid(8, 8);
  grid2 = new SpriteGrid(4, 4);

  constructor() {
    super(lifeBarTexture);
  }

  getConfig() {
    return {
      frames: {
        barWrapperSide: { frame: { x: 65, y: 21, w: 1, h: 8 } },
        barWrapperCenter: { frame: { x: 66, y: 21, w: 1, h: 8 } },
        barCell: this.grid2.getFrame(37, 1, 1, 2),
      },
      meta: {
        scale: '1',
      },
    };
  }
}
