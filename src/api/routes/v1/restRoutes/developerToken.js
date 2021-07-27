const router = require('express').Router({ mergeParams: true });
const { body, param, oneOf } = require('express-validator');
const pagination = require('../../../middlewares/pagination');
const validation = require('../../../middlewares/validation');

const services = require('../../../services/v1/developerToken');
const { asyncHandler } = require('../../../utils/utils');

router.get(
  '/:id/scopes',
  asyncHandler(async (req, res) => {
    let result = await services.getScopes(req.params.id);
    res.send(result);
  }),
);

router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    let result = await services.getById(req.params.id);
    res.send(result);
  }),
);

router.get(
  '/',
  pagination,
  asyncHandler(async (req, res) => {
    const developerId = req.params.developerId || req.query.developerId;
    let result = null;
    if (developerId) {
      result = await services.getAllByDeveloper(developerId, req.paging);
    } else {
      result = await services.getAll(req.paging);
    }
    res.send(result);
  }),
);

router.post(
  '/',
  validation([
    body('name').notEmpty(),
    oneOf([body('developerId').exists(), param('developerId').exists()]),
  ]),
  asyncHandler(async (req, res) => {
    let developerId = req.params.developerId || req.body.developerId;
    let result = await services.create({ ...req.body, developerId }, req.user);
    res.send(result);
  }),
);

router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    let result = await services.delete(req.params.id);
    res.send(result);
  }),
);

module.exports = router;
