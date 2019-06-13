const express = require('express')
const utils = require('../utils/index')
const package = require("../package.json");

const fs = require('fs')
const glob = require("glob")
const parseString = require('xml2js').parseString;
const { before, after } = require('../middleware/interceptor')
const router = express.Router();

router.all('*', function (req, res, next) {
    // throw new Error("我就是异常！！！");
    const url = package.resource + req.originalUrl.split('?')[0]
    glob(`${url}.*`, {}, (err, files) => {
        if (err || files.length === 0) {
            next(err)
            return;
        }
        console.log("files:",files);
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
            if(/.config.json$/.test(files[0])){//JSON配置入参
              const configFile = fs.readFileSync(`${files[0]}`, {
                encoding: 'utf8'
              })
              const { file } = utils.jsonCheckFile(JSON.parse(configFile), req.totalParams, req.method)
                if (file) {
                    res.requestFile = file
                    res.requestFileType = utils.onSuffix(file)
                }
                console.log(value)
                return next()
            }
            res.requestFile = files[0]
            res.requestFileType = type
            next()
        } else {
            next()
        }
    })
})
module.exports = router