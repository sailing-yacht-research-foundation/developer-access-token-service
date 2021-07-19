const router = require('express').Router();
const auth = require('../../middlewares/auth');
const healthRouter = require('./restRoutes/health');
const authRouter = require('./restRoutes/auth');
const scopeRouter = require('./restRoutes/scope');
const actionRouter = require('./restRoutes/action');
const developerRouter = require('./restRoutes/developer');

router.use('/auth', authRouter);
router.use('/health', healthRouter);
router.use('/scopes', auth(), scopeRouter);
router.use('/actions', auth(), actionRouter);
router.use('/developers', auth(), developerRouter);

module.exports = router;
