import pqrsJs from 'pqrs-js';
const pqrs = pqrsJs({ locateFile: (path, _) => `/vendor/pqrs-js/${path}` });

self.onmessage = async ({data: {id, params}}) => {
  try {
    const {scan_qr} = await pqrs;
    const result = await scan_qr.apply(null, params);
    self.postMessage({id, result});
  } catch (error) {
    self.postMessage({id, error})
  }
}