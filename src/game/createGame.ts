import { AUTO, Game, Scale } from 'phaser';
import { GAME } from './constants';
import { PlaygroundScene } from './scenes/PlaygroundScene';

export function createGameConfig(parent: string | HTMLElement): Phaser.Types.Core.GameConfig {
  return {
    type: AUTO,
    parent,
    backgroundColor: GAME.backgroundColor,
    banner: false,
    scale: {
      mode: Scale.FIT,
      autoCenter: Scale.CENTER_BOTH,
      width: GAME.width,
      height: GAME.height,
    },
    scene: [PlaygroundScene],
  };
}

export function startGame(parent: string | HTMLElement): Game {
  return new Game(createGameConfig(parent));
}
