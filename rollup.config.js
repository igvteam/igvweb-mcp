import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';

export default {
    input: 'src/main.js',
    output: {
        file: 'dist/igvweb-mcp.js',
        format: 'esm'
    },
    plugins: [
        // Explicitly prefer Node built-ins to silence warnings from node-resolve
        resolve({ preferBuiltins: true }),
        commonjs(),
        json()
    ]
};
