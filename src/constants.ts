import type { NodeData } from './model';

export const NODE_W        = 220; // includes 10px padding on each side
export const SNAP          = 40;
export const BAND_PADDING  = 60;

export function snapV(v: number) { return Math.round(v / SNAP) * SNAP; }
export function nodeH(n: NodeData) { return n.note ? 136 : 104; }
