const router = require('express').Router();
const { body, param } = require('express-validator');
const pagination = require('../../../middlewares/pagination');
const validation = require('../../../middlewares/validation');

const services = require('../../../services/v1/developer');
const { asyncHandler } = require('../../../utils/utils');

router.get(
  '/',
  pagination,
  asyncHandler(async (req, res) => {
    let result = await services.getAll(req.paging);
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

router.post(
  '/',
  validation([body('email').notEmpty().isEmail(), body('name').notEmpty()]),
  asyncHandler(async (req, res) => {
    let result = await services.upsert(null, req.body, req.user);
    res.send(result);
  }),
);

router.put(
  '/:id',
  validation([
    body('email').notEmpty().isEmail(),
    body('name').notEmpty(),
    param('id').notEmpty(),
  ]),
  asyncHandler(async (req, res) => {
    let result = await services.upsert(req.params.id, req.body, req.user);
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
