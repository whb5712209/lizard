var express = require('express');
var router = express.Router();
const api = require('../src/api')
const upload = require('../src/upload')

router.use(['/api', '/api1', '/api2', '/api3'], api)
router.use(['/upload'], upload)

module.exports = router
