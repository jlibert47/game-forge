import Phaser from 'phaser';
import { GAME } from '../constants';
import { publishStudioStats, type StudioObjectInfo } from '../../studio/events';

const PLAYER_SPEED = 240;
const TOKEN_COLORS = [0x6ee7ff, 0xffb86b, 0xc4b5fd, 0x86efac, 0xff7aa2];

export class PlaygroundScene extends Phaser.Scene {
  private player!: Phaser.GameObjects.Arc;
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd?: Record<'W' | 'A' | 'S' | 'D', Phaser.Input.Keyboard.Key>;
  private tokens: Phaser.GameObjects.Arc[] = [];
  private selectedId: string | null = null;
  private tokenSerial = 0;
  private lastPublish = 0;

  constructor() {
    super(GAME.sceneKey);
  }

  create(): void {
    this.drawGrid();

    this.player = this.add.circle(GAME.width / 2, GAME.height / 2, 16, 0x7c5cff);
    this.player.setStrokeStyle(2, 0xffffff, 0.7);
    this.player.setData('id', 'player');
    this.player.setData('name', 'Player');
    this.player.setData('kind', 'player');
    this.player.setInteractive({ useHandCursor: true });

    this.add
      .text(16, 14, 'WASD / arrows to move  ·  click empty space to spawn  ·  click a shape to inspect', {
        fontFamily: 'ui-sans-serif, system-ui, sans-serif',
        fontSize: '13px',
        color: '#8b95a7',
      })
      .setDepth(10);

    this.cursors = this.input.keyboard?.createCursorKeys();
    this.wasd = this.input.keyboard?.addKeys('W,A,S,D') as typeof this.wasd;

    this.input.on(
      'gameobjectdown',
      (_pointer: Phaser.Input.Pointer, target: Phaser.GameObjects.GameObject) => {
        const id = target.getData('id') as string | undefined;
        if (id) {
          this.selectedId = id;
          this.publish();
        }
      },
    );

    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (this.input.hitTestPointer(pointer).length === 0) {
        this.spawnToken(pointer.worldX, pointer.worldY);
      }
    });

    this.selectedId = 'player';
    this.publish();
  }

  update(_time: number, delta: number): void {
    const step = (PLAYER_SPEED * delta) / 1000;
    const left = Boolean(this.cursors?.left.isDown || this.wasd?.A.isDown);
    const right = Boolean(this.cursors?.right.isDown || this.wasd?.D.isDown);
    const up = Boolean(this.cursors?.up.isDown || this.wasd?.W.isDown);
    const down = Boolean(this.cursors?.down.isDown || this.wasd?.S.isDown);

    if (left) this.player.x -= step;
    if (right) this.player.x += step;
    if (up) this.player.y -= step;
    if (down) this.player.y += step;

    const radius = this.player.radius;
    this.player.x = Phaser.Math.Clamp(this.player.x, radius, GAME.width - radius);
    this.player.y = Phaser.Math.Clamp(this.player.y, radius, GAME.height - radius);

    this.lastPublish += delta;
    if (this.lastPublish > 250) {
      this.lastPublish = 0;
      this.publish();
    }
  }

  private spawnToken(x: number, y: number): void {
    this.tokenSerial += 1;
    const color = TOKEN_COLORS[this.tokenSerial % TOKEN_COLORS.length];
    const token = this.add.circle(x, y, 10, color);
    const id = `token-${this.tokenSerial}`;
    token.setStrokeStyle(2, 0xffffff, 0.35);
    token.setData('id', id);
    token.setData('name', `Token ${this.tokenSerial}`);
    token.setData('kind', 'token');
    token.setInteractive({ useHandCursor: true });
    this.tweens.add({
      targets: token,
      y: y - 8,
      duration: 900,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut',
    });
    this.tokens.push(token);
    this.selectedId = id;
    this.publish();
  }

  private listObjects(): StudioObjectInfo[] {
    const player: StudioObjectInfo = { id: 'player', name: 'Player', kind: 'player' };
    const tokens = this.tokens.map((token) => ({
      id: String(token.getData('id')),
      name: String(token.getData('name')),
      kind: 'token' as const,
    }));
    return [player, ...tokens];
  }

  private publish(): void {
    publishStudioStats({
      running: !this.game.isPaused,
      fps: Math.round(this.game.loop.actualFps || 0),
      objectCount: 1 + this.tokens.length,
      selectedId: this.selectedId,
      objects: this.listObjects(),
    });
  }

  private drawGrid(): void {
    const graphics = this.add.graphics();
    graphics.lineStyle(1, 0x1b2740, 1);
    const step = 40;
    for (let x = 0; x <= GAME.width; x += step) {
      graphics.lineBetween(x, 0, x, GAME.height);
    }
    for (let y = 0; y <= GAME.height; y += step) {
      graphics.lineBetween(0, y, GAME.width, y);
    }
    this.add
      .rectangle(GAME.width / 2, GAME.height / 2, GAME.width, GAME.height)
      .setStrokeStyle(1, 0x31405f, 0.9);
  }
}
