import { beforeEach, describe, expect, it } from 'vitest';
import { STUDIO_IDS, STUDIO_PANELS, DEFAULT_SCENE_NAME } from '../src/studio/layout';
import { mountStudio } from '../src/studio/mountStudio';

describe('studio shell', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="app"></div>';
  });

  it('renders toolbar, panels, and a Phaser parent canvas host', () => {
    const app = document.querySelector('#app');
    expect(app).toBeTruthy();

    const studio = mountStudio(app!);

    expect(document.getElementById(STUDIO_IDS.toolbar)).toBeTruthy();
    expect(document.getElementById(STUDIO_IDS.play)?.textContent).toBe('Play');
    expect(document.getElementById(STUDIO_IDS.pause)?.textContent).toBe('Pause');
    expect(document.querySelector('[data-testid="scene-list"]')?.textContent).toContain(
      DEFAULT_SCENE_NAME,
    );
    expect(document.querySelector('[data-testid="object-list"]')).toBeTruthy();
    expect(document.querySelector('[data-testid="inspector"]')).toBeTruthy();
    expect(studio.gameContainer.id).toBe(STUDIO_IDS.gameContainer);
    expect(document.getElementById(STUDIO_IDS.pauseOverlay)?.textContent).toBe('Paused');
    expect(document.getElementById(STUDIO_IDS.pauseOverlay)?.hasAttribute('hidden')).toBe(true);
    expect(STUDIO_PANELS.map((panel) => panel.id)).toEqual(['scenes', 'objects', 'inspector']);
  });
});
