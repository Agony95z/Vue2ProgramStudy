# vue-source-study

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

### 实现一个插件
- 实现VueRouter类
  - 处理路由选项
  - 监控url变化，hashchange
  - 响应这个变化
- 实现install方法
  - $router注册
  - 两个全局组件
