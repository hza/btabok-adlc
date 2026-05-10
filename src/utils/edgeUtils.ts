import type { EdgeData, NodeData } from '../model';
import { NODE_W, nodeH } from '../constants';

type Side = 'left' | 'right' | 'top' | 'bottom';

export interface EdgePath extends EdgeData {
  path: string;
  mx: number;
  my: number;
}

function nodeCenterY(
  nodeId: string,
  positions: Record<string, { x: number; y: number }>,
  heights: Record<string, number>,
  nodeMap: Map<string, NodeData>,
) {
  const node = nodeMap.get(nodeId)!;
  return positions[nodeId].y + (heights[nodeId] ?? nodeH(node)) / 2;
}

function nodeCenterX(nodeId: string, positions: Record<string, { x: number; y: number }>) {
  return positions[nodeId].x + NODE_W / 2;
}

function buildSideGroups(
  edgeSideInfo: ReturnType<typeof computeEdgeSideInfo>,
  positions: Record<string, { x: number; y: number }>,
  heights: Record<string, number>,
  nodeMap: Map<string, NodeData>,
) {
  const sideGroups = new Map<string, string[]>();
  for (const { edgeId, fromId, fromSide, toId, toSide } of edgeSideInfo) {
    const fk = `${fromId}:${fromSide}`;
    if (!sideGroups.has(fk)) sideGroups.set(fk, []);
    sideGroups.get(fk)!.push(edgeId);
    const tk = `${toId}:${toSide}`;
    if (!sideGroups.has(tk)) sideGroups.set(tk, []);
    sideGroups.get(tk)!.push(edgeId);
  }

  // Sort each group so port order matches the spatial order of the other endpoint → no crossings.
  // For a "to" group (incoming): sort by source Y (or X for top/bottom sides).
  // For a "from" group (outgoing): sort by destination Y (or X for top/bottom sides).
  for (const [key, group] of sideGroups) {
    const colonIdx = key.lastIndexOf(':');
    const nodeId = key.slice(0, colonIdx);
    const side   = key.slice(colonIdx + 1) as Side;
    const horizontal = side === 'left' || side === 'right';

    group.sort((a, b) => {
      const infoA = edgeSideInfo.find(e => e.edgeId === a)!;
      const infoB = edgeSideInfo.find(e => e.edgeId === b)!;
      const otherA = infoA.toId === nodeId ? infoA.fromId : infoA.toId;
      const otherB = infoB.toId === nodeId ? infoB.fromId : infoB.toId;
      return horizontal
        ? nodeCenterY(otherA, positions, heights, nodeMap) - nodeCenterY(otherB, positions, heights, nodeMap)
        : nodeCenterX(otherA, positions) - nodeCenterX(otherB, positions);
    });
  }

  return sideGroups;
}

function computeEdgeSideInfo(
  edges: EdgeData[],
  positions: Record<string, { x: number; y: number }>,
  heights: Record<string, number>,
  nodeMap: Map<string, NodeData>,
) {
  return edges.map(edge => {
    const fn = nodeMap.get(edge.from)!;
    const tn = nodeMap.get(edge.to)!;
    const fp = positions[edge.from], tp = positions[edge.to];
    const fh = heights[edge.from] ?? nodeH(fn), th = heights[edge.to] ?? nodeH(tn);
    const fcx = fp.x + NODE_W / 2, fcy = fp.y + fh / 2;
    const tcx = tp.x + NODE_W / 2, tcy = tp.y + th / 2;
    const dx = tcx - fcx, dy = tcy - fcy;
    let fromSide: Side, toSide: Side;
    if (Math.abs(dx) >= Math.abs(dy)) {
      fromSide = dx >= 0 ? 'right' : 'left';
      toSide   = dx >= 0 ? 'left'  : 'right';
    } else {
      fromSide = dy >= 0 ? 'bottom' : 'top';
      toSide   = dy >= 0 ? 'top'    : 'bottom';
    }
    return { edgeId: edge.id, fromId: edge.from, toId: edge.to, fromSide, toSide };
  });
}

function getPort(
  nodeId: string,
  side: Side,
  edgeId: string,
  positions: Record<string, { x: number; y: number }>,
  sideGroups: Map<string, string[]>,
  heights: Record<string, number>,
  nodeMap: Map<string, NodeData>,
): { x: number; y: number } {
  const node = nodeMap.get(nodeId)!;
  const pos  = positions[nodeId];
  const h    = heights[nodeId] ?? nodeH(node);
  const key  = `${nodeId}:${side}`;
  const group = sideGroups.get(key) ?? [edgeId];
  const idx   = group.indexOf(edgeId);
  const count = group.length;
  if (side === 'left' || side === 'right') {
    const x      = side === 'right' ? pos.x + NODE_W : pos.x;
    const margin = h * 0.18;
    const y      = pos.y + margin + ((h - 2 * margin) / (count + 1)) * (idx + 1);
    return { x, y };
  } else {
    const y      = side === 'bottom' ? pos.y + h : pos.y;
    const margin = NODE_W * 0.12;
    const x      = pos.x + margin + ((NODE_W - 2 * margin) / (count + 1)) * (idx + 1);
    return { x, y };
  }
}

const G = 5;   // gap between node edge and where the edge path starts/ends, to avoid visual overlap with node border
const C = 120; // control point distance for edge paths, or how "curvy" the edges are

export function computeEdgePaths(
  edges: EdgeData[],
  positions: Record<string, { x: number; y: number }>,
  heights: Record<string, number> = {},
  nodeMap: Map<string, NodeData>,
): EdgePath[] {
  const edgeSideInfo = computeEdgeSideInfo(edges, positions, heights, nodeMap);
  const sideGroups   = buildSideGroups(edgeSideInfo, positions, heights, nodeMap);

  return edges.map((edge, i) => {
    const { fromSide, toSide } = edgeSideInfo[i];
    const src = getPort(edge.from, fromSide, edge.id, positions, sideGroups, heights, nodeMap);
    const dst = getPort(edge.to,   toSide,   edge.id, positions, sideGroups, heights, nodeMap);

    const x1 = src.x, y1 = src.y;
    let x2 = dst.x, y2 = dst.y;

    if (toSide === 'left')   x2 -= G;
    if (toSide === 'right')  x2 += G;
    if (toSide === 'top')    y2 -= G;
    if (toSide === 'bottom') y2 += G;

    const dx = Math.abs(x2 - x1), dy = Math.abs(y2 - y1);
    const dist = (fromSide === 'left' || fromSide === 'right') ? dx : dy;
    const cp = Math.max(C, dist * 0.55);
    const cx1 = fromSide === 'left'   ? x1 - cp : fromSide === 'right' ? x1 + cp : x1;
    const cy1 = fromSide === 'top'    ? y1 - cp : fromSide === 'bottom' ? y1 + cp : y1;
    const cx2 = toSide   === 'left'   ? x2 - cp : toSide   === 'right'  ? x2 + cp : x2;
    const cy2 = toSide   === 'top'    ? y2 - cp : toSide   === 'bottom' ? y2 + cp : y2;

    return {
      ...edge,
      path: `M${x1},${y1} C${cx1},${cy1} ${cx2},${cy2} ${x2},${y2}`,
      mx: (x1 + x2) / 2,
      my: (y1 + y2) / 2,
    };
  });
}
