// 辅助路径
const path = require('path');
const ROOT = path.resolve(__dirname, '..');

//src目录
const root = (args) => {
    return path.join(ROOT, 'src', args);
}

//相对路径根目录
const rootNode = (args) => {
    return path.join(ROOT, args);
}

//绝对路径根目录
const resolve = (dir) => {
    return path.join(__dirname, '..', dir)
}

module.exports = {
    root,
    rootNode,
    resolve
}