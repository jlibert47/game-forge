import './styles/studio.css';
import { mountStudio } from './studio/mountStudio';
import { startGame } from './game/createGame';

const root = document.querySelector('#app');

if (!root) {
  throw new Error('Game Forge requires a #app element in index.html.');
}

const studio = mountStudio(root);
const game = startGame(studio.gameContainer);
studio.bindGame(game);
