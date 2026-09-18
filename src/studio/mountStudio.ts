import { DEFAULT_SCENE_NAME, STUDIO_IDS } from './layout';
import { STUDIO_STATS_EVENT, studioEvents, type StudioStats } from './events';
import { GAME } from '../game/constants';
import type { Game } from 'phaser';

export type StudioHandle = {
  root: HTMLElement;
  gameContainer: HTMLElement;
  bindGame: (game: Game) => void;
};

function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  options: {
    className?: string;
    id?: string;
    text?: string;
    attrs?: Record<string, string>;
  } = {},
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (options.className) node.className = options.className;
  if (options.id) node.id = options.id;
  if (options.text) node.textContent = options.text;
  if (options.attrs) {
    for (const [key, value] of Object.entries(options.attrs)) {
      node.setAttribute(key, value);
    }
  }
  return node;
}

function formatInspector(stats: StudioStats | null, running: boolean): string {
  const selected = stats?.objects.find((object) => object.id === stats.selectedId);
  const rows = [
    ['Scene', DEFAULT_SCENE_NAME],
    ['Status', running ? 'Playing' : 'Paused'],
    ['FPS', stats ? String(stats.fps) : '—'],
    ['Objects', stats ? String(stats.objectCount) : '1'],
    ['Selected', selected?.name ?? 'Player'],
    ['Kind', selected?.kind ?? 'player'],
  ];
  return rows
    .map(
      ([label, value]) =>
        `<div class="inspector-row"><span>${label}</span><strong>${value}</strong></div>`,
    )
    .join('');
}

export function mountStudio(target: Element): StudioHandle {
  target.innerHTML = '';

  const root = el('div', { className: 'studio', id: STUDIO_IDS.root });

  const toolbar = el('header', { className: 'studio-toolbar', id: STUDIO_IDS.toolbar });
  const brand = el('div', { className: 'studio-brand' });
  brand.innerHTML = `
    <svg class="studio-mark" viewBox="0 0 32 32" aria-hidden="true">
      <rect width="32" height="32" rx="8" fill="#1b2030"/>
      <path d="M8 20h16v3.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 8 23.5V20Z" fill="#f4b942"/>
      <path d="M11 11.5c0-3 2.2-5.5 5-5.5s5 2.5 5 5.5V20h-3.2v-8.2c0-1.1-.9-2-2-2h-.6c-1.1 0-2 .9-2 2V20H11V11.5Z" fill="#7c5cff"/>
    </svg>
    <div>
      <strong>${GAME.title}</strong>
      <span>Phaser studio</span>
    </div>
  `;

  const transport = el('div', { className: 'studio-transport' });
  const play = el('button', {
    className: 'studio-button studio-button-primary',
    id: STUDIO_IDS.play,
    text: 'Play',
    attrs: { type: 'button', 'aria-label': 'Play game' },
  });
  const pause = el('button', {
    className: 'studio-button',
    id: STUDIO_IDS.pause,
    text: 'Pause',
    attrs: { type: 'button', 'aria-label': 'Pause game' },
  });
  transport.append(play, pause);

  const sceneLabel = el('div', {
    className: 'studio-scene-label',
    id: STUDIO_IDS.sceneLabel,
    text: DEFAULT_SCENE_NAME,
  });
  toolbar.append(brand, transport, sceneLabel);

  const body = el('div', { className: 'studio-body' });

  const left = el('aside', { className: 'studio-panel studio-panel-left' });
  left.innerHTML = `
    <section>
      <h2>Scenes</h2>
      <ul id="${STUDIO_IDS.sceneList}" data-testid="scene-list">
        <li class="is-active">${DEFAULT_SCENE_NAME}</li>
      </ul>
    </section>
    <section>
      <h2>Hierarchy</h2>
      <ul id="${STUDIO_IDS.objectList}" data-testid="object-list">
        <li class="is-active">Player</li>
      </ul>
    </section>
  `;

  const viewport = el('section', {
    className: 'studio-viewport',
    id: STUDIO_IDS.viewport,
    attrs: { 'aria-label': 'Game view' },
  });
  const viewportBar = el('div', { className: 'studio-viewport-bar', text: 'Game view' });
  const gameContainer = el('div', {
    className: 'studio-game',
    id: STUDIO_IDS.gameContainer,
    attrs: { 'data-testid': 'game-container' },
  });
  const overlay = el('div', {
    className: 'studio-pause-overlay',
    id: STUDIO_IDS.pauseOverlay,
    text: 'Paused',
    attrs: { hidden: 'true' },
  });
  viewport.append(viewportBar, gameContainer, overlay);

  const inspector = el('aside', { className: 'studio-panel studio-panel-right' });
  inspector.innerHTML = `
    <section>
      <h2>Inspector</h2>
      <div id="${STUDIO_IDS.inspector}" data-testid="inspector">
        ${formatInspector(null, true)}
      </div>
    </section>
  `;

  body.append(left, viewport, inspector);

  const status = el('footer', {
    className: 'studio-status',
    id: STUDIO_IDS.status,
    text: `${GAME.title} · Phaser · ${GAME.width}×${GAME.height} · ready`,
  });

  root.append(toolbar, body, status);
  target.append(root);

  const objectList = root.querySelector(`#${STUDIO_IDS.objectList}`) as HTMLUListElement;
  const inspectorNode = root.querySelector(`#${STUDIO_IDS.inspector}`) as HTMLElement;

  function setRunning(running: boolean): void {
    play.toggleAttribute('disabled', running);
    pause.toggleAttribute('disabled', !running);
    overlay.toggleAttribute('hidden', running);
    play.classList.toggle('is-active', running);
    pause.classList.toggle('is-active', !running);
  }

  setRunning(true);

  function bindGame(game: Game): void {
    play.addEventListener('click', () => {
      game.resume();
      setRunning(true);
      status.textContent = `${GAME.title} · playing`;
    });
    pause.addEventListener('click', () => {
      game.pause();
      setRunning(false);
      status.textContent = `${GAME.title} · paused`;
    });

    studioEvents.addEventListener(STUDIO_STATS_EVENT, (event) => {
      const stats = (event as CustomEvent<StudioStats>).detail;
      objectList.replaceChildren(
        ...stats.objects.map((object) => {
          const item = el('li', { text: object.name });
          if (object.id === stats.selectedId) item.classList.add('is-active');
          return item;
        }),
      );
      inspectorNode.innerHTML = formatInspector(stats, !game.isPaused);
      if (!game.isPaused) {
        status.textContent = `${GAME.title} · ${stats.fps} fps · ${stats.objectCount} objects`;
      }
    });
  }

  return { root, gameContainer, bindGame };
}
