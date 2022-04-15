import * as PIXI from 'pixi.js';

const CELL_OFFSET_X = 7;

class HealthBarWrapper extends PIXI.Container {
  barLeft = PIXI.Sprite.from('barWrapperSide');
  barCenter = PIXI.Sprite.from('barWrapperCenter');
  barRight = PIXI.Sprite.from('barWrapperSide');

  constructor(size: number) {
    super();

    this.barLeft.scale.set(2);
    this.barCenter.scale.set(2);
    this.barRight.scale.set(2);

    this.barCenter.x = 2;
    this.barCenter.width = CELL_OFFSET_X * size;
    this.barRight.x = this.barCenter.x + this.barCenter.width;

    this.addChild(this.barLeft, this.barCenter, this.barRight);
  }
}

class HealthBarCell extends PIXI.Sprite {
  constructor() {
    super(PIXI.Texture.from('barCell'));

    this.scale.set(2);
  }
}

class HealthBarCells extends PIXI.Container {
  cells: HealthBarCell[] = [];

  constructor(size: number) {
    super();

    this.cells = this.createCells(size);
    this.addChild(...this.cells);
  }

  createCells(count: number) {
    const cells: HealthBarCell[] = [];

    for (let index = 0; index < count; index++) {
      const cell = new HealthBarCell();
      cell.x = CELL_OFFSET_X * index;
      cell.visible = false;
      cells.push(cell);
    }

    return cells;
  }

  setCount(size: number) {
    this.cells.forEach((cell, index) => {
      cell.visible = index < size;
    });
  }
}

export class HealthBar extends PIXI.Container {
  wrapper: HealthBarWrapper;
  cells: HealthBarCells;

  constructor(size: number) {
    super();

    this.wrapper = new HealthBarWrapper(size);
    this.cells = new HealthBarCells(size);

    this.cells.x = 2;
    this.cells.y = 2;

    this.addChild(this.cells, this.wrapper);
  }

  setCount(size: number) {
    this.cells.setCount(size);
  }
}
