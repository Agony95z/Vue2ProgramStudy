const path = require('path')
const selfResolve = (dir) => path.resolve(__dirname, dir)
module.exports = {
  // publicPath: '/test',
  devServer: {
    port: 8888
  },
  // webpack基础配置
  /* configureWebpack: {
    resolve: {
      alias: {
        comps: path.join(__dirname, 'src/components'), // 配置别名
      }
    }
  }, */
  configureWebpack(config) {
    // 根据执行环境做不同的配置
    if (process.env.NODE_ENV === 'development') { // npm run serve -->development
      config.name = 'Vue最佳实践'
    } else { // run build 生成压缩文件
      config.name = 'Vue best Practive'
    }
  },
  chainWebpack(config) {
    config.resolve.alias
    .set('comps', selfResolve('src/components')) // 配置别名)
    .set('@', selfResolve('src'))
    // npm i svg-sprite-loader -D 将import进来的图标打包到库里 将来直接引用图标的id
    // vue inspect 帮助快速审查webpack配置
    // vue inspect --rules 查看规则
    // vue inspect --rule svg 查看svg配置
    // 1. 阻止svg规则加载icons/svg中的图标
    config.module.rule('svg')
      .exclude.add(selfResolve('src/icons'))
    
    // 2. 配置svg-sprite-loader仅加载icons/svg中的图标
    config.module.rule('icons') // 规则存在就查询，不存在就创建
      .test(/\.svg$/) // 仿照vue inspect --rule svg 审查语法来写 所有以svg结尾的import使用这个规则
      .include.add(selfResolve('src/icons'))
      .end() // 找回this上下文 -- 当前的icons规则
      .use('svg-sprite-loader') // 先use再loader
        .loader('svg-sprite-loader')
          .options({symbolId: 'icon-[name]'}) // 使用图标的方式 icon-文件名
  }
}