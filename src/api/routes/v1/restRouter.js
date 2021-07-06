const router = require('express').Router();
const healthRouter = require('./restRoutes/health');

router.use('/health', healthRouter);

module.exports = router;
