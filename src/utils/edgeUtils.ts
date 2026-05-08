import { NODES } from '../model';
import type { EdgeData } from '../model';
import { NODE_W, nodeH } from '../constants';

type Side = 'left' | 'right' | 'top' | 'bottom';

export interface EdgePath extends EdgeData {
  path: string;
  mx: number;
  my: number;
}

function buildSideGroups(edgeSideInfo: ReturnType<typeof computeEdgeSideInfo>) {
  const sideGroups = new Map<string, string[]>();
  for (const { edgeId, fromId, fromSide, toId, toSide } of edgeSideInfo) {
    const fk = `${fromId}:${fromSide}`;
    if (!sideGroups.has(fk)) sideGroups.set(fk, []);
    sideGroups.get(fk)!.push(edgeId);
    const tk = `${toId}:${toSide}`;
    if (!sideGroups.has(tk)) sideGroups.set(tk, []);
    sideGroups.get(tk)!.push(edgeId);
  }
  return sideGroups;
}

function computeEdgeSideInfo(
  edges: EdgeData[],
  positions: Record<string, { x: number; y: number }>,
) {
  return edges.map(edge => {
    const fn = NODES.find(n => n.id === edge.from)!;
    const tn = NODES.find(n => n.id === edge.to)!;
    const fp = positions[edge.from], tp = positions[edge.to];
    const fh = nodeH(fn), th = nodeH(tn);
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
): { x: number; y: number } {
  const node = NODES.find(n => n.id === nodeId)!;
  const pos  = positions[nodeId];
  const h    = nodeH(node);
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

const G = 8;

export function computeEdgePaths(
  edges: EdgeData[],
  positions: Record<string, { x: number; y: number }>,
): EdgePath[] {
  const edgeSideInfo = computeEdgeSideInfo(edges, positions);
  const sideGroups   = buildSideGroups(edgeSideInfo);

  return edges.map((edge, i) => {
    const { fromSide, toSide } = edgeSideInfo[i];
    const src = getPort(edge.from, fromSide, edge.id, positions, sideGroups);
    const dst = getPort(edge.to,   toSide,   edge.id, positions, sideGroups);

    let x1 = src.x, y1 = src.y;
    let x2 = dst.x, y2 = dst.y;

    if (toSide === 'left')   x2 -= G;
    if (toSide === 'right')  x2 += G;
    if (toSide === 'top')    y2 -= G;
    if (toSide === 'bottom') y2 += G;

    const dx = Math.abs(x2 - x1), dy = Math.abs(y2 - y1);
    const cp = Math.max(40, (fromSide === 'left' || fromSide === 'right' ? dx : dy) * 0.42);
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
