import * as PIXI from 'pixi.js';

class Background extends PIXI.Sprite {
  constructor() {
    super(PIXI.Texture.from('background'));

    this.x = 0;
    this.y = 0;
    this.scale.x = 5;
    this.scale.y = 5;
  }
}

class Ground extends PIXI.Sprite {
  constructor() {
    super(PIXI.Texture.from('ground'));

    this.x = 0;
    this.y = 220;
    this.scale.set(4, 25);
  }
}

class Sun extends PIXI.Sprite {
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

class Dock extends PIXI.Sprite {
  constructor(x: number, y: number) {
    super(PIXI.Texture.from('dock'));

    this.x = x;
    this.y = y;
    this.scale.x = 3;
    this.scale.y = 3;
  }
}

class Lantern extends PIXI.Sprite {
  constructor(x: number, y: number) {
    super(PIXI.Texture.from('lantern'));

    this.x = x;
    this.y = y;
    this.scale.x = 3;
    this.scale.y = 3;
  }
}

class Puddle1 extends PIXI.Sprite {
  constructor(x: number, y: number) {
    super(PIXI.Texture.from('puddle1'));

    this.x = x;
    this.y = y;
    this.scale.x = 3;
    this.scale.y = 3;
  }
}

class Puddle2 extends PIXI.Sprite {
  constructor(x: number, y: number) {
    super(PIXI.Texture.from('puddle2'));

    this.x = x;
    this.y = y;
    this.scale.x = 3;
    this.scale.y = 3;
  }
}

class Garbage extends PIXI.Sprite {
  constructor(x: number, y: number) {
    super(PIXI.Texture.from('garbage'));

    this.x = x;
    this.y = y;
    this.scale.x = 3;
    this.scale.y = 3;
  }
}

// TODO: get canvas size and scale from arguments?
export class EnvironmentComponent extends PIXI.Container {
  background = new Background();
  ground = new Ground();
  sun = new Sun(680, 50);
  dock = new Dock(500, 200);
  lantern = new Lantern(350, 150);
  puddle1 = new Puddle1(350, 500);
  puddle2 = new Puddle2(100, 174);
  garbage = new Garbage(270, 350);

  constructor() {
    super();

    this.addChild(
      this.background,
      this.ground,
      this.sun,
      this.dock,
      this.lantern,
      this.puddle1,
      this.puddle2,
      this.garbage
    );
  }

  update() {
    this.sun.update();
  }
}
