const path = require('path');

module.exports = {
    devtool: 'eval-source-map',
    mode: 'production',
    entry: './src/index.ts',
    target: 'node',
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                include: [path.resolve(__dirname, 'src')]
            }
        ]
    },
    resolve: {
         modules: ['node_modules'] ,
        extensions: ['.ts', '.js'],

    }
    ,
    output: {
        filename: 'app.js',
        path: path.resolve(__dirname, 'dist')
    }
}