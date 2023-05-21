import { node } from '../../.electron-vendors.cache.json';
import { join } from 'path';
import { builtinModules } from 'module';
import { fileURLToPath } from 'node:url';

const PACKAGE_ROOT = __dirname;

/**
 * @type {import('vite').UserConfig}
 * @see https://vitejs.dev/config/
 */
const config = {
  mode: process.env.MODE,
  root: PACKAGE_ROOT,
  envDir: process.cwd(),
  resolve: {
    alias: {
      '@main/': join(PACKAGE_ROOT, 'src') + '/',
      '@lib/': join(PACKAGE_ROOT, 'src', 'lib') + '/',
      '@websocket/': join(PACKAGE_ROOT, 'src', 'lib', 'websocket') + '/',
      '@utils/': join(PACKAGE_ROOT, 'src', 'lib', 'utils') + '/',
      '@notifications/':
        join(PACKAGE_ROOT, 'src', 'lib', 'notifications') + '/',
      '@store/': join(PACKAGE_ROOT, 'src', 'lib', 'store') + '/',
      '@storeHelpers/':
        join(PACKAGE_ROOT, 'src', 'lib', 'store', 'helpers') + '/',
    },
  },
  build: {
    sourcemap: 'inline',
    target: `node${node}`,
    outDir: 'dist',
    assetsDir: '.',
    minify: process.env.MODE !== 'development',
    lib: {
      entry: 'src/index.ts',
      formats: ['cjs'],
    },
    rollupOptions: {
      external: [
        'electron',
        'electron-next',
        ...builtinModules.flatMap((p) => [p, `node:${p}`]),
      ],
      output: {
        entryFileNames: '[name].cjs',
      },
    },
    emptyOutDir: true,
    brotliSize: false,
  },
};

export default config;
