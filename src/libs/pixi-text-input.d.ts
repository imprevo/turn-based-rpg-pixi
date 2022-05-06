declare module 'pixi-text-input' {
  import * as PIXI from 'pixi.js';

  type Config = Record<string, any>;

  export interface InputConfig {
    input?: Config;
    box?: {
      default?: Config;
      focused?: Config;
      disabled?: Config;
    };
  }

  class TextInput extends PIXI.Text {
    constructor(config?: InputConfig);
  }

  export default TextInput;
}
