const router = require('express').Router();
const auth = require('../../middlewares/auth');
const healthRouter = require('./restRoutes/health');
const authRouter = require('./restRoutes/auth');
const scopeRouter = require('./restRoutes/scope');

router.use('/auth', authRouter);
router.use('/health', healthRouter);
router.use('/scopes', auth(), scopeRouter);

module.exports = router;
