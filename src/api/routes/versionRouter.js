const router = require('express').Router();
const restRouter = require('./v1/restRouter');

router.use('/v1', restRouter);

module.exports = router;
