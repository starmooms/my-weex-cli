const ROOT = require('./help').rootNode;
const ip = require('./getIp');
const config = {
    root: ROOT,
    // // webpack-dev-server
    pluginConfigPath: 'plugins/plugins.json',
    pluginFilePath: 'plugins/plugins.js',

    // 路由文件地址
    routerFilePath: 'router.js',
    // common
    templateDir: '.temp',
    entryFilePath: 'entry.js',
    // 从编译过程中排除模块
    excludeModuleReg: /node_modules(?!(\/|\\).*(weex).*)/,
    dev: {
        //webpack-dev-server
        contentBase: ROOT,
        host: ip,
        port: 8081,
        historyApiFallback: true,
        open: true,
        watchContentBase: true,
        openPage: 'web/preview.html',
        watchOptions: {
            ignored: /node_modules/,
            aggregateTimeout: 300,
            poll: false
        },
        devtool: 'eval-source-map',
        env: JSON.stringify('development'),
        // If you have problems debugging vue-files in devtools,
        // set this to false - it *may* help
        // https://vue-loader.vuejs.org/en/options.html#cachebusting
        cacheBusting: true,
        // CSS Sourcemaps off by default because relative paths are "buggy"
        // with this option, according to the CSS-Loader README
        // (https://github.com/webpack/css-loader#sourcemaps)
        // In our experience, they generally work as expected,
        // just be aware of this issue when enabling this option.
        cssSourceMap: false,
        proxyTable: {},
        autoOpenBrowser: false,
        errorOverlay: true,
        notifyOnErrors: true,
        htmlOptions: {
            devScripts: `
        <script>
          window.addEventListener('load', function () {
            var is_touch_device = function () {
              return 'ontouchstart' in window // works on most browsers
                  || 'onmsgesturechange' in window; // works on ie10
            };
            if(!is_touch_device()) {
              if (window.parent === window) { // not in iframe.
                window.phantomLimb.stop()
              }
            }
          })
        </script>
        `
        }
    },
    prod: {
        env: JSON.stringify('production'),
        /**
         * Source Maps
         */
        productionSourceMap: true,
        devtool: '#source-map',
        cssSourceMap: true
    },
    nodeConfiguration: {
        // global: false,
        // Buffer: false,
        // __filename: false,
        // __dirname: false,
        // setImmediate: false,
        // clearImmediate: false,
        // // see: https://github.com/webpack/node-libs-browser
        // assert: false,
        // buffer: false,
        // child_process: false,
        // cluster: false,
        // console: false,
        // constants: false,
        // crypto: false,
        // dgram: false,
        // dns: false,
        // domain: false,
        // events: false,
        // fs: false,
        // http: false,
        // https: false,
        // module: false,
        // net: false,
        // os: false,
        // path: false,
        // process: false,
        // punycode: false,
        // querystring: false,
        // readline: false,
        // repl: false,
        // stream: false,
        // string_decoder: false,
        // sys: false,
        // timers: false,
        // tls: false,
        // tty: false,
        // url: false,
        // util: false,
        // vm: false,
        // zlib: false
    }
}
module.exports = config;
