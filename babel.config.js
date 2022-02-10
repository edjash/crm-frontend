module.exports = {
    presets: [
        ['@babel/preset-react', { "runtime": "automatic" }],
        ['@babel/preset-env', { targets: { node: 'current' } }],
        '@babel/preset-typescript',
        'babel-preset-vite',
    ],
    env: {
        test: {
            plugins: ["@babel/plugin-transform-runtime"]
        }
    }
};
