import SvgQr from 'svgqr.js';
import { generateSvg } from 'svgqr.js/lib/svg.js';
import { encode } from 'js-base64';

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
    radius: 0.8,
  };
  const svg = data ? SvgQr(data, opts) : generateSvg(qrMock(), opts);
  return `data:image/svg+xml;base64,${encode(svg)}`;
}