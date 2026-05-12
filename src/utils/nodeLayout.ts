import type { NodeData } from '../btabok-adlc-model';
import { NODE_W } from '../constants';

export const CONTENT_X    = 9;
export const CONTENT_W    = NODE_W - CONTENT_X * 2;
export const HEADER_H     = 28;
export const LINE_TITLE   = 21;
export const LINE_SUB     = 19;
export const LINE_NOTE    = 17;

const TITLE_CHARS    = Math.floor(CONTENT_W / 9);
const SUBTITLE_CHARS = Math.floor(CONTENT_W / 7.4);
const NOTE_CHARS     = Math.floor(CONTENT_W / 6.8);

export function wrapWords(text: string, maxChars: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let current = '';
  for (const word of words) {
    const candidate = current ? current + ' ' + word : word;
    if (candidate.length > maxChars && current) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }
  if (current) lines.push(current);
  return lines;
}

export interface NodeLines {
  titleLines: string[];
  subtitleLines: string[];
  noteLines: string[];
}

const _linesCache = new Map<string, NodeLines>();

export function nodeLines(node: NodeData): NodeLines {
  const cached = _linesCache.get(node.id);
  if (cached !== undefined) return cached;

  const result: NodeLines = {
    titleLines:    wrapWords(node.title,    TITLE_CHARS),
    subtitleLines: wrapWords(node.subtitle, SUBTITLE_CHARS),
    noteLines:     node.note ? wrapWords(node.note, NOTE_CHARS) : [],
  };
  
  _linesCache.set(node.id, result);
  return result;
}

const _heightCache = new Map<string, number>();

export function computeNodeSvgHeight(node: NodeData): number {
  const cached = _heightCache.get(node.id);
  if (cached !== undefined) return cached;

  const { titleLines, subtitleLines, noteLines } = nodeLines(node);
  let h = HEADER_H + 6;
  h += titleLines.length * LINE_TITLE;
  h += 4; // gap before subtitle
  h += subtitleLines.length * LINE_SUB;
  if (noteLines.length > 0) {
    h += 9; // divider gap + note top padding
    h += noteLines.length * LINE_NOTE;
  }
  h += 8; // bottom padding

  _heightCache.set(node.id, h);
  return h;
}
