const path = require('path');

const config = {
  entry: {
    gg_index: './src/entries/index.js',
    gg_vendor: [
      'react',
      'react-dom',
      'dva',
      'react-router',
      'antd',
      'moment',
      'echarts',
    ],
    gg_utils: [
      './src/utils/utils.js',
      './src/utils/const.js',
    ],
  },
  extraBabelPlugins: [['import', { libraryName: 'antd', libraryDirectory: 'es', style: 'css' }]],

  define: {
    "process.env": {
      APP_AES_KEY: 'f390268d3dc304f5',//秘钥 16*n
      APP_AES_IV: '2b894f52b46104ab', //偏移量
    }
  },

  env: {
    development: {
      extraBabelPlugins: ['dva-hmr'],
    },
    production: {
      define: {
        __CDN__: process.env.CDN ? '/' : '/'
      }
    }
  },
  externals: {
    '@antv/data-set': 'DataSet',
    rollbar: 'rollbar',
    // 地图
    // AMap: 'AMap',
    // AMapUI: 'AMapUI',
    // ECharts: 'echarts',
  },
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  proxy: {
    "/auth": {
      //  "target": "https://api.gg66.cn",// 正式服 旧:http://api.mobile.gg66.cn
      // "target": "http://api.mobile.test.gg66.cn",// 预发布测试服
      "target": "http://api.mobile.daily.gg66.cn",// 日常开发测试服
        //  "target": "http://10.1.32.12:8001",
      // "target": "http://192.168.1.130:8001",
      //  "target": "http://localhost:8001",// 日常开发测试服
      "changeOrigin": true,
    },
    "/renderserver": {
      //  "target": "https://api.gg66.cn",// 正式服 旧:http://api.mobile.gg66.cn
      // "target": "http://api.mobile.test.gg66.cn",// 预发布测试服
      "target": "http://api.mobile.daily.gg66.cn",// 日常开发测试服
      // "target": "http://192.168.1.130:8001",
      "changeOrigin": true,
    },
    "/captcha": {
      //  "target": "https://api.gg66.cn",// 正式服 旧:http://api.mobile.gg66.cn
      // "target": "http://api.mobile.test.gg66.cn",// 预发布测试服
      "target": "http://api.mobile.daily.gg66.cn",// 日常开发测试服
      // "target": "http://192.168.1.130:8001",
      "changeOrigin": true,
    },
    "/v1": {
      //  "target": "https://api.gg66.cn",// 正式服 旧:http://api.mobile.gg66.cn
      // "target": "http://api.mobile.test.gg66.cn",// 预发布测试服
      // "target": "http://api.mobile.daily.gg66.cn",// 日常开发测试服
      "target": "http://192.168.1.19:18201",
      "changeOrigin": true,
    },
  },
  es5ImcompatibleVersions: true,
  disableDynamicImport: true,
  publicPath: '/',
  html: {
    template: "./src/pages/document.ejs",
  },
  alias: {
    '@': path.resolve(__dirname, 'src'),
  },
  hash: true,
  commons: [
    {
      names: [
        'gg_index',
        'gg_vendor',
        'gg_utils',
      ],
      minChunks: Infinity
    }
  ],
  extraBabelIncludes: [
    "node_modules/_remark-math",
    "node_modules/_crypto-js",
  ]
};
if (module.exports.env !== 'development') {
  config["outputPath"] = path.join(process.cwd(), '../dist/front_new/')
}
export default config
