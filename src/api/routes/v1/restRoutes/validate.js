const router = require('express').Router();
const { body } = require('express-validator');
const validation = require('../../../middlewares/validation');
const services = require('../../../services/v1/validation');
const { asyncHandler } = require('../../../utils/utils');

router.post(
  '/',
  validation([body('token').notEmpty()]),
  asyncHandler(async (req, res) => {
    let result = await services.validateToken(req.body.token);
    res.send(result);
  }),
);

router.post(
  '/token-id',
  validation([body('tokenId').notEmpty()]),
  asyncHandler(async (req, res) => {
    let result = await services.validateTokenId(req.body.tokenId);
    res.send(result);
  }),
);

module.exports = router;
