const router = require('express').Router();
const {
  asyncHandler,
  ControllerError,
  statusCodes,
} = require('../../../utils/utils');
const { sync } = require('../../../models');
const { seed } = require('../../../scripts/seeder');

router.post(
  '/',
  asyncHandler(async (req, res) => {
    console.log(process.env.MIGRATION_KEY);
    if (req.query.key !== process.env.MIGRATION_KEY) {
      throw new ControllerError('Forbidden', statusCodes.FORBIDDEN);
    }
    await sync(req.query.force === 'true');
    res.status(200).send({
      message: 'ok',
    });
  }),
);

router.post(
  '/seed',
  asyncHandler(async (req, res) => {
    if (req.query.key !== process.env.MIGRATION_KEY) {
      throw new ControllerError('Forbidden', statusCodes.FORBIDDEN);
    }
    await seed();
    res.status(200).send({
      message: 'ok',
    });
  }),
);
module.exports = router;
