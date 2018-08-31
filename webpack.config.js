const path = require('path');
const fs = require('fs-extra');
const webpack = require('webpack');


const helper = require('./configs/help');
const config = require('./configs/config');
const vueLoaderConfig = require('./configs/vue-loader.conf')
const hasPluginInstalled = fs.existsSync(helper.rootNode(config.pluginFilePath));
var isWin = /^win/.test(process.platform);

const vueWebTemp = helper.rootNode(config.templateDir);   //web entry文件目录
const weexEntry = {
    'index': helper.root(config.entryFilePath)
}

/**
 * @description entry引入vue 和 weex-vue-render    如果plugin.js有存在 entry文件引入plugin。。。
 * @param {entry文件} source 
 * @param {router路由路径} routerpath 
 */
const getEntryFileContent = (source, routerpath) => {
    let dependence = `import Vue from 'vue'\n`;
    dependence += `import weex from 'weex-vue-render'\n`;
    let relativePluginPath = helper.rootNode(config.pluginFilePath);
    let entryContents = fs.readFileSync(source).toString();
    let contents = '';
    entryContents = dependence + entryContents;         //entry添加引入vue 和 weex-vue-render
    entryContents = entryContents.replace(/\/\* weex initialized/, match => `weex.init(Vue)\n${match}`);  //entry添加weex.init(Vue)

    //win 路径转义
    if (isWin) {
        relativePluginPath = relativePluginPath.replace(/\\/g, '\\\\');
    }

    //如果有plugin.js
    if (hasPluginInstalled) {
        contents += `\n// 注释：如果plugins/plugin.js存在，导入和插件\n`;
        contents += `import plugins from '${relativePluginPath}';\n`;                          // contents 引入pulgin
        contents += `plugins.forEach(function (plugin) {\n\tweex.install(plugin)\n});\n\n`;   //循环引用插件
        entryContents = entryContents.replace(/\.\/router/, routerpath);                       //改变路由路径
        entryContents = entryContents.replace(/weex\.init/, match => `${contents}${match}`);   //weex.init 前写入contents
    }
    return entryContents;
}


//引入vue并获取获取路由文件
const getRouterFileContent = (source) => {
    const dependence = `import Vue from 'vue'\n`;
    let routerContents = fs.readFileSync(source).toString();
    routerContents = dependence + routerContents;
    return routerContents;
}

//生成temp中的entry和router 文件   返回生成的temp中的entry路径
const getEntryFile = () => {
    const entryFile = path.join(vueWebTemp, config.entryFilePath)   //生成文件路径
    const routerFile = path.join(vueWebTemp, config.routerFilePath)
    fs.outputFileSync(entryFile, getEntryFileContent(helper.root(config.entryFilePath), routerFile));  //生成文件
    fs.outputFileSync(routerFile, getRouterFileContent(helper.root(config.routerFilePath)));
    return {
        index: entryFile
    }
}

// web中的应用需要引入一些library，eg：vue vue-loader weex-vue-render
// 1. src/entry.js 
// import Vue from 'vue';
// import weex from 'weex-vue-render';
// weex.init(Vue);
// 2. src/router/index.js
// import Vue from 'vue'
const webEntry = getEntryFile();


//webpack plugin设置
const plugins = [
    //在生成的文件引入注释
    new webpack.BannerPlugin({
        banner: '// { "framework": "Vue"} \n',  // 其值为字符串，将作为注释存在
        raw: true,                  // 如果值为 true，将直出 (自动注释为/** */难查看。。这里手动注释)
        exclude: 'Vue'
    })
];



// Config for compile jsbundle for web.
const webConfig = {
    entry: Object.assign(webEntry, {
        'vendor': [path.resolve('node_modules/phantom-limb/index.js')]
    }),
    output: {
        path: helper.rootNode('./dist'),
        filename: '[name].web.js'
    },
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            '@': helper.resolve('src')
        }
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: [{
                    loader: 'babel-loader'
                }],
                exclude: /node_modules(?!(\/|\\).*(weex).*)/
            },
            {
                test: /\.vue(\?[^?]+)?$/,
                use: [{
                    loader: 'vue-loader',
                    options: Object.assign(vueLoaderConfig({ useVue: true, usePostCSS: false }), {
                        optimizeSSR: false,
                        postcss: [
                            // 转换weex排他性样式
                            require('postcss-plugin-weex')(),
                            require('autoprefixer')({
                                browsers: ['> 0.1%', 'ios >= 8', 'not ie < 12']
                            }),
                            require('postcss-plugin-px2rem')({
                                // 默认750px
                                rootValue: 75,
                                // to leave 1px alone
                                minPixelValue: 1.01
                            })
                        ],
                        compilerModules: [
                            {
                                postTransformNode: el => {
                                    // to convert vnode for weex components.
                                    require('weex-vue-precompiler')()(el)
                                }
                            }
                        ]

                    })
                }],
                exclude: config.excludeModuleReg
            }
        ]
    },
    plugins: plugins
};


const weexConfig = {
    entry: weexEntry,
    output: {
        path: path.join(__dirname, '../dist'),
        filename: '[name].js'
    },

    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            '@': helper.resolve('src')
        }
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                use: [{
                    loader: 'babel-loader'
                }],
                exclude: config.excludeModuleReg
            },
            {
                test: /\.vue(\?[^?]+)?$/,
                use: [{
                    loader: 'weex-loader',
                    options: vueLoaderConfig({ useVue: false })
                }],
                exclude: config.excludeModuleReg
            }
        ]
    },
    plugins: plugins,
    node: config.nodeConfiguration
};




module.exports = [webConfig, weexConfig];
//生成web的入口文件  设置一些plugin