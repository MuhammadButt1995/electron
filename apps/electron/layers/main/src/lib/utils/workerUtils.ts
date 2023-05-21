import { Worker } from 'worker_threads';

// eslint-disable-next-line import/prefer-default-export
export const workerTs = (file: string, wkOpts: WorkerOptions & any) => {
  // eslint-disable-next-line no-param-reassign
  wkOpts.eval = true;
  if (!wkOpts.workerData) {
    // eslint-disable-next-line no-param-reassign
    wkOpts.workerData = {};
  }

  // eslint-disable-next-line no-underscore-dangle, no-param-reassign
  wkOpts.workerData.__filename = file;
  return new Worker(
    `
          const wk = require('worker_threads');
          require('tsconfig-paths/register');
          require('ts-node').register({
            "compilerOptions": {
              "target": "es2016",
              "esModuleInterop": true,
              "module": "commonjs",
              "rootDir": ".",
            }
          });
          let file = wk.workerData.__filename;
          delete wk.workerData.__filename;
          require(file);
      `,
    wkOpts
  );
};
