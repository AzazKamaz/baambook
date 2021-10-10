/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import pqrsJs from 'pqrs-js';
const pqrs = pqrsJs({ locateFile: (path, _) => `/vendor/pqrs-js/${path}` });

self.onmessage = async ({data: {id, params}}: {data: {id: number, params: [ImageData]}}) => {
  try {
    const result = await (await pqrs).scan_qr(...params);
    self.postMessage({id, result});
  } catch (error) {
    self.postMessage({id, error});
  }
}