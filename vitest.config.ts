/// <reference types="vitest" />
import { defineConfig } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
    define: {
        __DEV__: true,
    },
    plugins: [
        nodePolyfills(),
    ],
    test: {
        include: ['test/**/*.ts', 'test/*.ts'],
        environment: 'jsdom',
    }
});
