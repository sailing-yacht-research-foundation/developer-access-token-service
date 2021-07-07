const router = require('express').Router();

const authSvc = require('../../../services/v1/auth');
const { asyncHandler } = require('../../../utils/utils');

const filterProfile = (result) => ({
  ...result,
});

router.post(
  '/login',
  asyncHandler(async (req, res, next) => {
    const result = await authSvc.validateAccessToken(req.body.access_token);
    res.json(filterProfile(result));
  }),
);

router.post(
  '/validate-token',
  asyncHandler(async (req, res, next) => {
    const result = await authSvc.validateSessionToken(
      req.body.token,
      req.body.renew,
    );
    res.json(filterProfile(result));
  }),
);

module.exports = router;
