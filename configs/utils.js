// const path = require('path')
// const config = require('./config')
// const ExtractTextPlugin = require('extract-text-webpack-plugin')
// const packageConfig = require('../package.json')

exports.cssLoaders = function (options) {
    options = options || {}

    const cssLoader = {
        loader: 'css-loader',
        options: {
            sourceMap: options.sourceMap
        }
    }

    const postcssLoader = {
        loader: 'postcss-loader',
        options: {
            sourceMap: options.sourceMap
        }
    }

    // 返回处理css的loader
    const generateLoaders = (loader, loaderOptions) => {

        // 如果是web 加入cssLoader
        let loaders = options.useVue ? [cssLoader] : []

        // 加入postcss
        if (options.usePostCSS) {
            loaders.push(postcssLoader)
        }

        //其他loader   /加入less等预处理器
        if (loader) {
            loaders.push({
                loader: loader + '-loader',
                options: Object.assign({}, loaderOptions, {
                    sourceMap: options.sourceMap
                })
            })
        }

        //web加入vue-style-loader
        if (options.useVue) {
            return ['vue-style-loader'].concat(loaders)
        }
        else {
            return loaders
        }
    }

    // https://vue-loader.vuejs.org/en/configurations/extract-css.html
    return {
        less: generateLoaders('less'),
        sass: generateLoaders('sass', { indentedSyntax: true }),
        scss: generateLoaders('sass'),
        stylus: generateLoaders('stylus'),
        styl: generateLoaders('stylus')
    }
}

// Generate loaders for standalone style files (outside of .vue)
// exports.styleLoaders = function (options) {
//     const output = []
//     const loaders = exports.cssLoaders(options)

//     for (const extension in loaders) {
//         const loader = loaders[extension]
//         output.push({
//             test: new RegExp('\\.' + extension + '$'),
//             use: loader
//         })
//     }

//     return output
// }

// exports.createNotifierCallback = () => {
//     const notifier = require('node-notifier')

//     return (severity, errors) => {
//         if (severity !== 'error') return

//         const error = errors[0]
//         const filename = error.file && error.file.split('!').pop()

//         notifier.notify({
//             title: packageConfig.name,
//             message: severity + ': ' + error.name,
//             subtitle: filename || '',
//             icon: path.join(__dirname, 'logo.png')
//         })
//     }
// }
