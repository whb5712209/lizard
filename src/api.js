const express = require('express')
const utils = require('../utils/index')
const { resourcePath } = require('../config/index')
const fs = require('fs')
const glob = require("glob")
const parseString = require('xml2js').parseString;
const { before, after } = require('../middleware/interceptor')
const router = express.Router();

router.all('*', function (req, res, next) {
    // throw new Error("我就是异常！！！");
    const url = resourcePath + req.originalUrl.split('?')[0]
    glob(`${url}.*`, {}, (err, files) => {
        if (err || files.length === 0) {
            next(err)
            return;
        }
        const type = utils.onSuffix(files[0])
        if (type === 'xml') {
            const data = fs.readFileSync(`${url}.xml`, {
                encoding: 'utf8'
            })
            parseString(data, (err, result) => {
                if (err) {
                    next(err)
                    return;
                }
                const { value } = utils.onFormat(result, req.totalParams, req.method)
                if (value) {
                    res.requestFile = value
                    res.requestFileType = utils.onSuffix(value)
                }
                next()
            });
        } else if (type === 'json' || type === 'js') {
            res.requestFile = files[0]
            res.requestFileType = type
            next()
        } else {
            next()
        }
    })
})
module.exports = router