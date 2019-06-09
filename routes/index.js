var express = require('express');
var router = express.Router();
const api = require('../src/api')
const upload = require('../src/upload')
const { before, after } = require('../middleware/interceptor')




router.use(['/upload'], upload)
router.use(before);
router.use(['/*'], api)
router.use(after);


router.use((err, req, res, next) => {
    if (err.stack) {
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};
        res.status(err.status || 500).send({ message: err.message });
    } else {
        res.status(200).send(err)
    }
});
module.exports = router
