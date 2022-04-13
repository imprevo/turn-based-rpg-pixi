import * as PIXI from 'pixi.js';

export class SpritesheetBuilder {
  image: string;

  constructor(image: string) {
    this.image = image;
  }

  getConfig(): PIXI.ISpritesheetData {
    throw new Error('Method getConfig should be implemented');
  }

  make(): Promise<void> {
    const texture = PIXI.Texture.from(this.image);
    const sprite = new PIXI.Spritesheet(texture, this.getConfig());

    return new Promise((resolve) => {
      sprite.parse(() => resolve());
    });
  }
}
