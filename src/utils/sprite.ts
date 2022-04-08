import { ISpritesheetFrameData } from 'pixi.js';

export class SpriteGrid {
  cellSizeX: number;
  cellSizeY: number;

  constructor(cellSizeX: number, cellSizeY: number) {
    this.cellSizeX = cellSizeX;
    this.cellSizeY = cellSizeY;
  }

  getFrame(x: number, y: number, w: number, h: number): ISpritesheetFrameData {
    return {
      frame: {
        x: x * this.cellSizeX,
        y: y * this.cellSizeY,
        w: w * this.cellSizeX,
        h: h * this.cellSizeY,
      },
    };
  }
}
