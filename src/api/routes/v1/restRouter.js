const router = require('express').Router();
const healthRouter = require('./restRoutes/health');
const authRouter = require('./restRoutes/auth');

router.use('/auth', authRouter);
router.use('/health', healthRouter);

module.exports = router;
