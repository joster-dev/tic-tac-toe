export const openings = ['center', 'adjacent', 'corner'] as const;

export type Opening = (typeof openings)[number];

const CENTER = 4;
const CORNERS = [0, 2, 6, 8];
const EDGES = [1, 3, 5, 7];

const pick = (indices: number[]): number => indices[Math.floor(Math.random() * indices.length)];

/** First move on an empty board; all openings are theoretically equal so this is just flavour. */
export function openingMove(opening: Opening): number {
  switch (opening) {
    case 'center': return CENTER;
    case 'corner': return pick(CORNERS);
    case 'adjacent': return pick(EDGES);
  }
}
