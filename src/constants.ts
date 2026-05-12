import type { NodeData } from './btabok-adlc-model';

export const NODE_W        = 220; // includes 10px padding on each side. Should be smaller than SNAP to allow for proper snapping and avoid excessive collisions.
export const SNAP          = 40;  // Grid size for snapping nodes and routing edges. Should be a divisor of the typical distances between nodes to avoid excessive snapping.
export const BAND_PADDING  = 60;  // When swimlanes are enabled, this is the vertical padding between the bottom of a node and the top of the swimlane below it. Should be large enough to fit the note icon and tooltip for nodes with notes (see nodeH).
export const DEFAULT_SCALE   = 0.72; // Initial zoom level. Chosen so that the initial layout fits well on a 1080p screen, but users can zoom in for more detail or zoom out to see the overall structure.
export const SCROLL_SURFACE  = 20000; // px — fixed-size scroll surface for native browser panning  // Chosen so that the initial layout fits well on a 1080p screen, but users can zoom in for more detail or zoom out to see the overall structure.

// For simplicity, we use fixed positions for all nodes. In a real app, these would be computed by a layout algorithm or loaded from storage.
export function snapV(v: number) { return Math.round(v / SNAP) * SNAP; }

// For nodes with notes, we need extra height to fit the note icon and tooltip.
export function nodeH(n: NodeData) { return n.note ? 136 : 104; }
