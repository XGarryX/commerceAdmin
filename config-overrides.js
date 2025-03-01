const { override, fixBabelImports, addLessLoader } = require('customize-cra')
process.env.GENERATE_SOURCEMAP = "false"

module.exports = override(
    fixBabelImports('import', {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true,
    }),
    addLessLoader({
        javascriptEnabled: true
    }),
);