var express = require('express');
var router = express.Router();
const api = require('../src/api')
const upload = require('../src/upload')

router.use(['/upload'], upload)
router.use(['/*'], api)


module.exports = router
