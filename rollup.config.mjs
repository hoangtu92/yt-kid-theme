import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import del from "rollup-plugin-delete";
import copy from "rollup-plugin-copy";

const isProd = process.env.NODE_ENV === 'production';

// shared plugins (no destructive ones here)
const basePlugins = [
    resolve(),
    commonjs(),
    isProd && terser()
];

// run ONCE only
const buildSetup = [
    del({ targets: 'dist/*', runOnce: true }),
    copy({
        targets: [
            { src: 'manifest.json', dest: 'dist' },
            { src: 'assets', dest: 'dist' }
        ],
        copyOnce: true
    })
];

export default [
    // 👉 Content script
    {
        input: 'src/content/index.js',
        output: {
            file: 'dist/content.js',
            format: 'iife',
            sourcemap: !isProd
        },
        plugins: [
            ...buildSetup,
            ...basePlugins
        ]
    },

    // 👉 Service worker (MV3)
    {
        input: 'src/service-worker.js',
        output: {
            file: 'dist/service-worker.js',
            format: 'es', // 🔥 REQUIRED
            sourcemap: !isProd
        },
        plugins: basePlugins
    }
];
