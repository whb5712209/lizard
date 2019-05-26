const express = require('express')
const utils = require('../utils/index')
const {resourcePath} = require('../config/index')
const fs = require('fs')
const glob = require("glob")
const parseString = require('xml2js').parseString;
const { before, after } = require('../middleware/interceptor')
const router = express.Router();

router.all('*', before, function (req, res, next) {
    const url = `${resourcePath}${req.path}`
    glob(`${url}.*`, {}, (err, files) => {
        if (err || files.length === 0) {
            next()
            return;
        }
        const type = utils.onSuffix(files[0])
        if (type === 'xml') {
            const data = fs.readFileSync(`${url}.xml`, {
                encoding: 'utf8'
            })
            parseString(data, (err, result) => {
                if (err) {
                    next()
                    return;
                }
                const { value } = utils.onFormat(result, req.totalParams, req.method)
                res.requestFile = value
                res.requestFileType = utils.onSuffix(value)
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
}, after)
module.exports = router