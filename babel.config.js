const plugins = []
// if your use import on Demand, Use this code,but can't use the cdn together
// plugins.push(
//   [ 'import', {
//     'libraryName': 'ant-design-vue',
//     'libraryDirectory': 'es',
//     'style': true // `style: true` 会加载 less 文件
//   } ]
// )
if (['production', 'prod'].includes(process.env.NODE_ENV)) {
  plugins.push('transform-remove-console')
}

module.exports = {
  presets: [
    '@vue/app',
    [
      '@babel/preset-env',
      {
        'useBuiltIns': 'entry',
        'corejs': 3
      }
    ]
  ],
  plugins: plugins
}
