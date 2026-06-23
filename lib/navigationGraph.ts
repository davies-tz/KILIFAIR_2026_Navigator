import type { LatLngTuple } from "@/types";
import { DEMO_ENTRANCE_LOCATION } from "@/lib/expoLayout";

export type Checkpoint = {
  id: string;
  name: string;
  position: LatLngTuple;
  hint: string;
};

export type RouteResult = {
  points: LatLngTuple[];
  distance: number;
  estimatedMinutes: number;
  instructions: string[];
};

export const QR_CHECKPOINTS: Checkpoint[] = [
  { id: "gate-a", name: "Gate A", position: DEMO_ENTRANCE_LOCATION, hint: "Main visitor entrance" },
  { id: "food-court", name: "Food Court", position: [112, 1120], hint: "Food stalls and drinks" },
  { id: "stage", name: "Stage Area", position: [292, 1080], hint: "Music, performances and audience area" },
  { id: "media", name: "Media Desk", position: [430, 930], hint: "Press and content area" },
  { id: "seminar", name: "Seminar Area", position: [570, 1080], hint: "Workshops and panel discussions" },
  { id: "b2b", name: "B2B Lounge", position: [700, 695], hint: "Buyer and exhibitor networking" },
  { id: "vip", name: "VIP Lounge", position: [700, 1035], hint: "VIP and international buyers" }
];

const CORRIDOR_Y = [88, 182, 288, 392, 498, 604, 708, 812, 900];
const CORRIDOR_X = [88, 170, 315, 500, 645, 830, 975, 1140, 1280];

type NodeMap = Record<string, LatLngTuple>;
type EdgeMap = Record<string, Array<{ to: string; weight: number }>>;

function nodeId(y: number, x: number) {
  return `n-${y}-${x}`;
}

function distance(a: LatLngTuple, b: LatLngTuple) {
  return Math.hypot(a[0] - b[0], a[1] - b[1]);
}

function addEdge(edges: EdgeMap, from: string, to: string, weight: number) {
  edges[from] ??= [];
  edges[to] ??= [];
  edges[from].push({ to, weight });
  edges[to].push({ to: from, weight });
}

function buildBaseGraph() {
  const nodes: NodeMap = {};
  const edges: EdgeMap = {};

  for (const y of CORRIDOR_Y) {
    for (const x of CORRIDOR_X) {
      nodes[nodeId(y, x)] = [y, x];
    }
  }

  for (const y of CORRIDOR_Y) {
    for (let index = 0; index < CORRIDOR_X.length - 1; index += 1) {
      const current = nodeId(y, CORRIDOR_X[index]);
      const next = nodeId(y, CORRIDOR_X[index + 1]);
      addEdge(edges, current, next, distance(nodes[current], nodes[next]));
    }
  }

  for (const x of CORRIDOR_X) {
    for (let index = 0; index < CORRIDOR_Y.length - 1; index += 1) {
      const current = nodeId(CORRIDOR_Y[index], x);
      const next = nodeId(CORRIDOR_Y[index + 1], x);
      addEdge(edges, current, next, distance(nodes[current], nodes[next]));
    }
  }

  for (const checkpoint of QR_CHECKPOINTS) {
    nodes[checkpoint.id] = checkpoint.position;
    const nearest = findNearestNode(checkpoint.position, nodes, (id) => id.startsWith("n-"));
    addEdge(edges, checkpoint.id, nearest, distance(checkpoint.position, nodes[nearest]));
  }

  return { nodes, edges };
}

function findNearestNode(position: LatLngTuple, nodes: NodeMap, filter = (_id: string) => true) {
  let bestId = Object.keys(nodes).find(filter) ?? Object.keys(nodes)[0];
  let bestDistance = Number.POSITIVE_INFINITY;

  for (const [id, nodePosition] of Object.entries(nodes)) {
    if (!filter(id)) continue;
    const currentDistance = distance(position, nodePosition);
    if (currentDistance < bestDistance) {
      bestId = id;
      bestDistance = currentDistance;
    }
  }

  return bestId;
}

function dijkstra(nodes: NodeMap, edges: EdgeMap, start: string, end: string) {
  const distances: Record<string, number> = {};
  const previous: Record<string, string | null> = {};
  const unvisited = new Set(Object.keys(nodes));

  for (const id of unvisited) {
    distances[id] = Number.POSITIVE_INFINITY;
    previous[id] = null;
  }
  distances[start] = 0;

  while (unvisited.size) {
    let current: string | null = null;
    for (const id of unvisited) {
      if (current === null || distances[id] < distances[current]) current = id;
    }

    if (current === null || distances[current] === Number.POSITIVE_INFINITY) break;
    if (current === end) break;

    unvisited.delete(current);

    for (const edge of edges[current] ?? []) {
      if (!unvisited.has(edge.to)) continue;
      const alt = distances[current] + edge.weight;
      if (alt < distances[edge.to]) {
        distances[edge.to] = alt;
        previous[edge.to] = current;
      }
    }
  }

  const path: string[] = [];
  let current: string | null = end;
  while (current) {
    path.unshift(current);
    current = previous[current];
  }

  return { path, distance: distances[end] };
}

function makeInstructions(startName: string, boothNumber: string, points: LatLngTuple[]) {
  const instructions = [`Start at ${startName}.`];
  if (points.length > 3) instructions.push("Follow the highlighted corridor route instead of crossing booth blocks.");
  instructions.push(`Continue to booth ${boothNumber} and look for the highlighted stand.`);
  return instructions;
}

export function buildRouteToBooth(startCheckpointId: string, boothPosition: LatLngTuple, boothNumber: string): RouteResult {
  const { nodes, edges } = buildBaseGraph();
  const start = QR_CHECKPOINTS.find((checkpoint) => checkpoint.id === startCheckpointId) ?? QR_CHECKPOINTS[0];
  const targetId = `booth-${boothNumber}`;
  nodes[targetId] = boothPosition;

  const nearestTargetCorridor = findNearestNode(boothPosition, nodes, (id) => id.startsWith("n-"));
  addEdge(edges, targetId, nearestTargetCorridor, distance(boothPosition, nodes[nearestTargetCorridor]));

  const result = dijkstra(nodes, edges, start.id, targetId);
  const points = result.path.map((id) => nodes[id]).filter(Boolean);
  const routeDistance = Math.round(result.distance);

  return {
    points,
    distance: routeDistance,
    estimatedMinutes: Math.max(1, Math.ceil(routeDistance / 75)),
    instructions: makeInstructions(start.name, boothNumber, points)
  };
}
