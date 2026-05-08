import type { NodeData } from './model';

export const NODE_W = 210;
export const SNAP   = 20;

export function snapV(v: number) { return Math.round(v / SNAP) * SNAP; }
export function nodeH(n: NodeData) { return n.note ? 136 : 104; }
