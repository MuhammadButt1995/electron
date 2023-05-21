const path = require('path');

/**
 * Path to the out directory created by next export
 */
const NEXT_EXPORT_OUT_DIR = path.join(__dirname, '../web/out');

if (process.env.VITE_APP_VERSION === undefined) {
  const now = new Date();
  process.env.VITE_APP_VERSION = `${now.getUTCFullYear() - 2000}.${
    now.getUTCMonth() + 1
  }.${now.getUTCDate()}-${now.getUTCHours() * 60 + now.getUTCMinutes()}`;
}

/**
 * @type {import('electron-builder').Configuration}
 * @see https://www.electron.build/configuration/configuration
 * files array is all electron dependencies
 * extraResources object is all next dependencies
 */
const config = {
  directories: {
    output: 'dist',
    buildResources: 'buildResources',
  },
  files: [
    'layers/**/dist/**',
    'layers/**/assets/**',
    'buildResources',
    'layers/main/src/lib/websocket/worker.ts',
  ],
  extraResources: {
    from: NEXT_EXPORT_OUT_DIR,
    to: 'web/out',
  },
  extraMetadata: {
    version: process.env.VITE_APP_VERSION,
  },
};

module.exports = config;
