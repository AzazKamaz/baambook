/// <reference types="svelte" />

declare module 'nanoid/index.prod' {
  const nanoid: () => string;
}

type SvgQrOpts = { corners: string, radius: number };

declare module 'svgqr.js/lib/svg.js' {
  const generateSvg: (data: { mat: boolean[][], size: number }, opts: SvgQrOpts) => string;
}

declare module 'svgqr.js' {
  const renderSvg: (data: string, opts: SvgQrOpts) => string;
  export default renderSvg;
}