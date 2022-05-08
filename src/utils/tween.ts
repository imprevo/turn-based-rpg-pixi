import { Tween } from '@tweenjs/tween.js';

export function waitTween(tween: Tween<any>) {
  return new Promise<void>((resolve) =>
    tween.onComplete(() => resolve()).start()
  );
}
