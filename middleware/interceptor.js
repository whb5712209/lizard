const fs = require('fs')
const path = require('path')

const before = function (req, res, next) {
    const totalParams = {}
    Object.keys(req.query).forEach((item) => {
        totalParams[item] = req.query[item]
    })
    Object.keys(req.body).forEach((item) => {
        totalParams[item] = req.body[item]
    })
    req.totalParams = totalParams;
    next();
};

const after = function (req, res, next) {
    if (res.requestFile) {
        try {
            if (res.requestFileType === 'json') {
                const data = fs.readFileSync(res.requestFile, {
                    encoding: 'utf8'
                })
                next(JSON.parse(data))
            } else {
                const model = require(path.join(__dirname, '../', res.requestFile))
                if (typeof model === 'object' || Array.isArray(model)) {
                    next(model)
                } else if (typeof model === 'function') {
                    next(model(req))
                } else {
                    next(model)
                }
            }

        } catch (e) {
            next(new Error('找不到任何配置啊'))
        }
    } else {
        next(new Error('找不到任何配置啊'))
    }
};


module.exports = {
    before,
    after
}