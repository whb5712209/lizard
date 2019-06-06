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
                res.status(200).send(data)
            } else {
                const model = require(path.join(__dirname, '../', res.requestFile))
                if (typeof model === 'object' || Array.isArray(model)) {
                    res.status(200).json(model)
                } else if (typeof model === 'function') {
                    res.status(200).json(model(req))
                } else {
                    res.status(200).json(model)
                }
            }

        } catch (e) {
            res.status(200).send({ message: '找不到任何配置啊......' })
        }
    } else {
        res.status(200).send({ message: '找不到任何配置啊......' })
    }
};
module.exports = {
    before,
    after
}