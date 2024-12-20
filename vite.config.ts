import {createRequire} from 'module';

const require = createRequire(import.meta.url);
import {ConfigEnv, normalizePath, UserConfig} from 'vite';
import {defineConfig} from 'vite';
import * as path from 'path';
import tailwindcss from 'tailwindcss';
import react from '@vitejs/plugin-react';


import {viteStaticCopy as StaticCopy} from 'vite-plugin-static-copy';
import {createHtmlPlugin} from 'vite-plugin-html';
// https://github.com/FullHuman/purgecss/issues/1263
const purgecss = require('@fullhuman/postcss-purgecss');


export default defineConfig((configEnv: ConfigEnv): UserConfig => {
    const baseConfig: UserConfig = {
        resolve: {
            alias: {
                '@': '/src',
                'tailwind.config.cjs': path.resolve(
                    __dirname,
                    '../hoppscotch-common/tailwind.config.cjs'
                ),
                'postcss.config.cjs': path.resolve(
                    __dirname,
                    '../hoppscotch-common/postcss.config.cjs'
                ),
            },
        },
        plugins: [
            createHtmlPlugin({
                entry: 'src/app/main.tsx',
                template: 'index.html',
                inject: {
                    data: {
                        title: 'index',
                        injectScript: '<script src="./inject.js" type="module"></script>',
                    },
                    tags: [
                        {
                            injectTo: 'body-prepend',
                            tag: 'div',
                            attrs: {
                                id: 'tag',
                            },
                        },
                    ],
                },
            }),
        ]
    };

    if (configEnv.command === 'build') {
        baseConfig['css'] = {
            postcss: {
                plugins: [
                    purgecss({
                        content: ['./**/*.html'],
                        safelist: ['code', 'pre']
                    }),
                    tailwindcss(),
                ]
            },
        };
    } else {
        baseConfig['build'] = {
            cssMinify: false,
            minify: false,
            // https://stackoverflow.com/questions/74723484/how-to-get-vite-to-not-import-bundle-an-external-dependency
            rollupOptions: {
                external: ['pixi.js']
            }
        };
    }

    if (Array.isArray(baseConfig.plugins)) {
        baseConfig.plugins.push(
            StaticCopy({
                targets: [
                    {
                        src: normalizePath(path.resolve(__dirname, 'static', 'favicon.ico')),
                        dest: '',
                    },
                    {
                        src: normalizePath(path.resolve(__dirname, 'static', 'images')),
                        dest: '',
                    }
                ]
            }));
        baseConfig.plugins.push(react());
    }

    if (configEnv.command !== 'build') {
        baseConfig['optimizeDeps'] = {
            exclude: ['pixi.js'],
            include: [
                'pixi.js > eventemitter3',
                'pixi.js > earcut',
                'pixi.js > parse-svg-path',
                'pixi.js > @xmldom/xmldom',
            ],
        };
    }

    return baseConfig;
});
