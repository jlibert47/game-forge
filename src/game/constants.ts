export const GAME = {
  width: 800,
  height: 480,
  parentId: 'game-container',
  sceneKey: 'Playground',
  backgroundColor: '#0b1020',
  title: 'Game Forge',
} as const;

export type GameConstants = typeof GAME;
