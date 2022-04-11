import * as PIXI from 'pixi.js';

interface WindowHooks {
  __PIXI_INSPECTOR_GLOBAL_HOOK__?: {
    register(options: { PIXI: typeof PIXI }): void;
  };
}

/**
 * PIXI should be registered to use pixi-inspector extension
 * @see https://github.com/bfanger/pixi-inspector/issues/34#issuecomment-466675587
 */
export function registerPixiInspector() {
  (window as WindowHooks).__PIXI_INSPECTOR_GLOBAL_HOOK__?.register({ PIXI });
}
