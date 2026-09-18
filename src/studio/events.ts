export type StudioObjectInfo = {
  id: string;
  name: string;
  kind: 'player' | 'token';
};

export type StudioStats = {
  running: boolean;
  fps: number;
  objectCount: number;
  selectedId: string | null;
  objects: StudioObjectInfo[];
};

export const STUDIO_STATS_EVENT = 'studio:stats';

export const studioEvents = new EventTarget();

export function publishStudioStats(stats: StudioStats): void {
  studioEvents.dispatchEvent(new CustomEvent<StudioStats>(STUDIO_STATS_EVENT, { detail: stats }));
}
