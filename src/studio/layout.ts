export const STUDIO_IDS = {
  root: 'studio-root',
  toolbar: 'studio-toolbar',
  play: 'studio-play',
  pause: 'studio-pause',
  sceneLabel: 'studio-scene-label',
  gameContainer: 'game-container',
  viewport: 'studio-viewport',
  pauseOverlay: 'studio-pause-overlay',
  sceneList: 'studio-scene-list',
  objectList: 'studio-object-list',
  inspector: 'studio-inspector',
  status: 'studio-status',
} as const;

export const STUDIO_PANELS = [
  { id: 'scenes', title: 'Scenes' },
  { id: 'objects', title: 'Hierarchy' },
  { id: 'inspector', title: 'Inspector' },
] as const;

export const DEFAULT_SCENE_NAME = 'Playground';

export type StudioPanelId = (typeof STUDIO_PANELS)[number]['id'];
