import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import path, { resolve } from 'path';
import customDynamicImport from './src/utils/custom-dynamic-import';

const root = resolve(__dirname, 'src');
const pagesDir = resolve(root, 'pages');
const stylesDir = resolve(root, 'styles');
const outDir = resolve(__dirname, 'dist');
const publicDir = resolve(__dirname, 'public');

export default defineConfig({
  resolve: {
    alias: {
      '@src': root,
      '@styles': stylesDir,
      '@pages': pagesDir,
    },
  },
  plugins: [react(), tsconfigPaths(), customDynamicImport()],
  publicDir,
  build: {
    outDir,
    sourcemap: false,
    rollupOptions: {
      input: {
        content: resolve(pagesDir, 'content', 'index.ts'),
        contentStyle: resolve(pagesDir, 'content', 'index.module.scss'),
        popup: resolve(pagesDir, 'popup', 'index.html'),
        options: resolve(pagesDir, 'options', 'index.html'),
      },
      output: {
        entryFileNames: 'src/pages/[name]/index.js',
        chunkFileNames: 'assets/js/[name].[hash].js',
        assetFileNames: assetInfo => {
          const { dir, name: _name } = path.parse(assetInfo.name as string);
          const assetFolder = getLastElement(dir.split('/'));
          const name = assetFolder + firstUpperCase(_name);
          return `assets/[ext]/${name}.chunk.[ext]`;
        },
      },
    },
  },
});

function getLastElement<T>(array: ArrayLike<T>): T {
  const length = array.length;
  const lastIndex = length - 1;
  return array[lastIndex];
}

function firstUpperCase(str: string) {
  const firstAlphabet = new RegExp(/( |^)[a-z]/, 'g');
  return str.toLowerCase().replace(firstAlphabet, L => L.toUpperCase());
}
