//获取ip
getIp = () => {
    const os = require('os');
    let interface = os.networkInterfaces();
    for (let devName in interface) {
        // 判断不是回路ip
        if (devName.indexOf('Loopback Pseudo-Interface') == -1) {
            for (let i = 0; i < interface[devName].length; i++) {
                let alias = interface[devName][i]
                if (alias.family === "IPv4") {
                    return alias.address;
                }
            }
        }
    }
    return '127.0.0.1'
}

module.exports = getIp()