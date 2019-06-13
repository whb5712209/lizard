const express = require('express')
const { onSuffix, onFilterByMethod, onCalculateSortByParams,jsonCheckFile } = require('../utils/index')
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
        const fileTypelist = files.map(item => onSuffix(item));
        if (fileTypelist.find((item) => (item === 'config.json'))) {
          const configFile = fs.readFileSync(`${url}.config.json`, {
            encoding: 'utf8'
          })
          const { path } = jsonCheckFile(JSON.parse(configFile), req.totalParams, req.method)
            if (path) {
                res.requestFile = path
                res.requestFileType = onSuffix(path)
            }
            return next()
        }
        if (fileTypelist.find((item) => (item === 'xml'))) {
            const data = fs.readFileSync(`${url}.xml`, {
                encoding: 'utf8'
            })
            parseString(data, (err, result) => {
                if (err) {
                    next(err)
                    return;
                }
                const query = onFilterByMethod(result.param.query, req.method)
                const { value } = onCalculateSortByParams(query, req.totalParams)
                if (value) {
                    res.requestFile = value
                    res.requestFileType = onSuffix(value)
                }
                next()
            });
            return;
        }
        if (fileTypelist.find((item) => (item === 'js'))) {
            res.requestFile = `${url}.js`
            res.requestFileType = 'js'
            next()
            return;
        }
        if (fileTypelist.find((item) => (item === 'json'))) {
            res.requestFile = `${url}.json`
            res.requestFileType = 'json'
            next()
            return;
        }
        next()
    })
})
module.exports = router