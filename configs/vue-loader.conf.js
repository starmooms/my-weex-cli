const utils = require('./utils')
const config = require('./config')
const isProduction = process.env.NODE_ENV === 'production'
const sourceMapEnabled = isProduction
    ? config.prod.productionSourceMap
    : config.dev.cssSourceMap

module.exports = (options) => {
    return {
        loaders: utils.cssLoaders({
            sourceMap: options && sourceMapEnabled,
            useVue: options && options.useVue,
            usePostCSS: options && options.usePostCSS
        }),
        cssSourceMap: sourceMapEnabled,
        cacheBusting: config.dev.cacheBusting
    }
}