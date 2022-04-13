import idleImg from '../../assets/sci-fi/bot-wheel/charge.png';
import deathImg from '../../assets/sci-fi/bot-wheel/death.png';
import damagedImg from '../../assets/sci-fi/bot-wheel/damaged.png';
import shootImg from '../../assets/sci-fi/bot-wheel/shoot.png';
import wakeImg from '../../assets/sci-fi/bot-wheel/wake.png';
import { SpriteGrid } from '../../utils/sprite';
import { SpritesheetBuilder } from './spritesheet-builder';

export class UnitIdleSpritesheetBuilder extends SpritesheetBuilder {
  grid = new SpriteGrid(117, 26);

  constructor() {
    super(idleImg);
  }

  getConfig() {
    return {
      frames: {
        unitIdle0: this.grid.getFrame(0, 0, 1, 1),
        unitIdle1: this.grid.getFrame(0, 1, 1, 1),
        unitIdle2: this.grid.getFrame(0, 2, 1, 1),
        unitIdle3: this.grid.getFrame(0, 3, 1, 1),
      },
      // TODO: how to use it in components?
      animations: {
        idle: ['unitIdle0', 'unitIdle1', 'unitIdle2', 'unitIdle3'],
      },
      meta: {
        scale: '1',
      },
    };
  }
}

export class UnitDeathSpritesheetBuilder extends SpritesheetBuilder {
  grid = new SpriteGrid(117, 26);

  constructor() {
    super(deathImg);
  }

  getConfig() {
    return {
      frames: {
        unitDeath0: this.grid.getFrame(0, 0, 1, 1),
        unitDeath1: this.grid.getFrame(0, 1, 1, 1),
        unitDeath2: this.grid.getFrame(0, 2, 1, 1),
        unitDeath3: this.grid.getFrame(0, 3, 1, 1),
        unitDeath4: this.grid.getFrame(0, 4, 1, 1),
        unitDeath5: this.grid.getFrame(0, 5, 1, 1),
      },
      meta: {
        scale: '1',
      },
    };
  }
}

export class UnitDamagedSpritesheetBuilder extends SpritesheetBuilder {
  grid = new SpriteGrid(117, 26);

  constructor() {
    super(damagedImg);
  }

  getConfig() {
    return {
      frames: {
        unitDamaged0: this.grid.getFrame(0, 0, 1, 1),
        unitDamaged1: this.grid.getFrame(0, 1, 1, 1),
      },
      meta: {
        scale: '1',
      },
    };
  }
}

export class UnitShootSpritesheetBuilder extends SpritesheetBuilder {
  grid = new SpriteGrid(117, 26);

  constructor() {
    super(shootImg);
  }

  getConfig() {
    return {
      frames: {
        unitShoot0: this.grid.getFrame(0, 0, 1, 1),
        unitShoot1: this.grid.getFrame(0, 1, 1, 1),
        unitShoot2: this.grid.getFrame(0, 2, 1, 1),
        unitShoot3: this.grid.getFrame(0, 3, 1, 1),
      },
      meta: {
        scale: '1',
      },
    };
  }
}

export class UnitWakeSpritesheetBuilder extends SpritesheetBuilder {
  grid = new SpriteGrid(117, 26);

  constructor() {
    super(wakeImg);
  }

  getConfig() {
    return {
      frames: {
        unitWake0: this.grid.getFrame(0, 0, 1, 1),
        unitWake1: this.grid.getFrame(0, 1, 1, 1),
        unitWake2: this.grid.getFrame(0, 2, 1, 1),
        unitWake3: this.grid.getFrame(0, 3, 1, 1),
        unitWake4: this.grid.getFrame(0, 4, 1, 1),
      },
      meta: {
        scale: '1',
      },
    };
  }
}
