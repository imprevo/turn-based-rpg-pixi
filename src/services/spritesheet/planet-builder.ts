import planetOneTexture from '../../assets/sci-fi/planet-one.png';
import { SpriteGrid } from '../../utils/sprite';
import { SpritesheetBuilder } from './spritesheet-builder';

export class PlanetSpritesheetBuilder extends SpritesheetBuilder {
  grid = new SpriteGrid(16, 16);

  constructor() {
    super(planetOneTexture);
  }

  getConfig() {
    return {
      frames: {
        background: this.grid.getFrame(0, 0, 16, 3),
        ground: this.grid.getFrame(0, 3, 16, 1),
        sun: this.grid.getFrame(13, 6, 3, 3),
        dock: this.grid.getFrame(11, 11, 5, 3),
        lantern: this.grid.getFrame(6, 8, 2, 3),
        puddle1: this.grid.getFrame(0, 14, 3, 2),
        puddle2: this.grid.getFrame(3, 14, 3, 2),
        garbage: this.grid.getFrame(6, 15, 4, 1),
      },
      meta: {
        scale: '1',
      },
    };
  }
}
