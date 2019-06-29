const { override, fixBabelImports, addLessLoader, addWebpackPlugin } = require('customize-cra');
const CompressionPlugin = require('compression-webpack-plugin')

module.exports = override(
    fixBabelImports('import', {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true,
    }),
    addLessLoader({
        javascriptEnabled: true
    }),
    addWebpackPlugin(new CompressionPlugin({
        deleteOriginalAssets: true,
    })),
);