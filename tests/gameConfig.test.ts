import { describe, expect, it } from 'vitest';
import { GAME } from '../src/game/constants';
import { DEFAULT_SCENE_NAME, STUDIO_IDS } from '../src/studio/layout';

describe('playground game contract', () => {
  it('targets the studio game view with a Playground scene', () => {
    expect(GAME.parentId).toBe(STUDIO_IDS.gameContainer);
    expect(GAME.sceneKey).toBe(DEFAULT_SCENE_NAME);
    expect(GAME.width).toBe(800);
    expect(GAME.height).toBe(480);
    expect(GAME.backgroundColor).toBe('#0b1020');
    expect(GAME.title).toBe('Game Forge');
  });
});
