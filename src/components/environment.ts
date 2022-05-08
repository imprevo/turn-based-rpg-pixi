import * as PIXI from 'pixi.js';

export class Background extends PIXI.Sprite {
  constructor() {
    super(PIXI.Texture.from('background'));

    this.x = 0;
    this.y = 0;
    this.scale.x = 5;
    this.scale.y = 5;
  }
}

export class Ground extends PIXI.Sprite {
  constructor() {
    super(PIXI.Texture.from('ground'));

    this.x = 0;
    this.y = 220;
    this.scale.set(4, 25);
  }
}

export class Sun extends PIXI.Sprite {
  rotationSpeed = 0.002;

  constructor(x: number, y: number) {
    super(PIXI.Texture.from('sun'));

    this.x = x;
    this.y = y;
    this.scale.set(2);
    this.anchor.set(0.5);
  }

  update() {
    this.rotation += this.rotationSpeed;
  }
}

export class Dock extends PIXI.Sprite {
  constructor(x: number, y: number) {
    super(PIXI.Texture.from('dock'));

    this.x = x;
    this.y = y;
    this.scale.x = 3;
    this.scale.y = 3;
  }
}

export class Lantern extends PIXI.Sprite {
  constructor(x: number, y: number) {
    super(PIXI.Texture.from('lantern'));

    this.x = x;
    this.y = y;
    this.scale.x = 3;
    this.scale.y = 3;
  }
}

export class Puddle1 extends PIXI.Sprite {
  constructor(x: number, y: number) {
    super(PIXI.Texture.from('puddle1'));

    this.x = x;
    this.y = y;
    this.scale.x = 3;
    this.scale.y = 3;
  }
}

export class Puddle2 extends PIXI.Sprite {
  constructor(x: number, y: number) {
    super(PIXI.Texture.from('puddle2'));

    this.x = x;
    this.y = y;
    this.scale.x = 3;
    this.scale.y = 3;
  }
}

export class Garbage extends PIXI.Sprite {
  constructor(x: number, y: number) {
    super(PIXI.Texture.from('garbage'));

    this.x = x;
    this.y = y;
    this.scale.x = 3;
    this.scale.y = 3;
  }
}
