const express = require('express')
const upload = express() //  
const path = require('path')
const fs = require('fs')
const multer = require('multer')
const { resourcePath } = require('../config/index')

const publicPath = path.join(__dirname, '../', resourcePath)

const uploadFile = multer({
  dest: `${publicPath}/`
})

upload.post('/', uploadFile.single('avatar'), (req, res) => {
  // 没有附带文件
  if (!req.file) {
    res.status(200).json({ ok: false })
    return
  }
  if ((req.file.size / 1024).toFixed(2) > 1024 * 100) {

    res.status(500).json({
      message: '上传失败,文件大于100M',
      code: 500,
      data: ''
    })
  } else {
    // 重命名文件
    let oldPath = req.file.path
    let newPath = path.join(publicPath, '/' + req.file.originalname)
    fs.rename(oldPath, newPath, (err) => {
      if (err) {
        res.status(500).json({
          ok: false
        })
        console.log(err)
      } else {
        let url = 'http://' + req.headers.host + '/' + req.file.originalname
        res.setHeader('content-type', 'text/html')
        res.json({
          message: '上传成功',
          code: 200,
          data: {
            url: url,
            name: req.file.originalname
          }
        })
      }
    })
  }
})

module.exports = upload
