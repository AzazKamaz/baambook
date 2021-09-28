import SvgQr from 'svgqr.js';
import { generateSvg } from 'svgqr.js/lib/svg.js';
import type { Route } from './types';

function qrMock() {
  const size = 25;
  const mat = Array(size).fill(false).map(a => Array(size).fill(false));
  for (let x = 0; x < 7; x++) {
    for (let y = 0; y < 7; y++) {
      const cell = x % 6 == 0 || y % 6 == 0 || !(x % 4 == 1 || y % 4 == 1);
      mat[x][y] = cell;
      mat[size - 1 - x][y] = cell;
      mat[x][size - 1 - y] = cell;
    }
  }
  return {mat, size};
}

export function qr64(data?: string) {
  const opts = {
    corners: 'Rounded',
    radius: 0.875,
  };
  const svg = data ? SvgQr(data, opts) : generateSvg(qrMock(), opts);

  const svgDoc = new DOMParser().parseFromString(svg, "image/svg+xml");
  const svgEl = svgDoc.querySelector("svg") as SVGElement;
  const svgViewBox = svgEl.attributes.getNamedItem("viewBox").value;
  const svgPathEl = svgDoc.querySelector("svg > path") as SVGPathElement;
  const svgPath = svgPathEl.attributes.getNamedItem("d").value;

  return {
    viewBox: svgViewBox,
    path: svgPath,
  };
}

export function isInPoly(point: number[], polygon: number[][]): boolean {
  try {
    const [xc, yc] = point;
    let acc = 0;
    for (let i = 0; i < polygon.length; i++) {
      const [x1, y1] = polygon[i];
      const [x2, y2] = polygon[(i + 1) % polygon.length];
      acc += Math.sign((x2 - x1) * (yc - y1) - (xc - x1) * (y2 - y1));
    }
    return acc == polygon.length;
  } catch (e) {
    return false;
  }
}

export function getViewLink(route: Route): string {
  let url = new URL(document.URL);
  url.hash = `id=${encodeURIComponent(route.id)}&key=${encodeURIComponent(route.key)}`;
  return url.href;
}

export class PqrsWorker {
  worker: Worker;
  nextId: number;
  promises: Map<number, {resolve: (any) => void, reject: (any) => void}>;

  constructor() {
    this.worker = new Worker('/worker.js');
    this.nextId = 0;
    this.promises = new Map();
    this.worker.onmessage = ({data: {id, result, error}}) => {
      const promise = this.promises.get(id);
      if (promise) {
        this.promises.delete(id);
        if (!error) {
          promise.resolve(result);
        } else {
          promise.reject(error);
        }
      }
    };
  }

  call(...params: [any]): Promise<any> {
    return new Promise((resolve, reject) => {
      const id = this.nextId++;
      this.promises.set(id, {resolve, reject});
      this.worker.postMessage({id, params});
    })
  }

  terminate() {
    this.worker.terminate();
    delete this.worker;
    delete this.nextId;
    delete this.promises;
  }
}