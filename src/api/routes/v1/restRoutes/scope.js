const router = require('express').Router();
const pagination = require('../../../middlewares/pagination');

const services = require('../../../services/v1/scope');
const { asyncHandler } = require('../../../utils/utils');

router.get(
  '/',
  pagination,
  asyncHandler(async (req, res) => {
    let result = await services.getAll(req.paging);
    res.send(result);
  }),
);

router.put(
  '/:id/actions',
  asyncHandler(async (req, res) => {
    let result = await services.updateActions(
      { id: req.params.id, actionIds: req.body },
      req.user,
    );
    res.send(result);
  }),
);

router.get(
  '/:id/actions',
  pagination,
  asyncHandler(async (req, res) => {
    let result = await services.getActions(req.params.id, req.paging);
    res.send(result);
  }),
);

router.get(
  '/:id/unassigned-actions',
  pagination,
  asyncHandler(async (req, res) => {
    let result = await services.getUnassignedActions(req.params.id, req.paging);
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
  asyncHandler(async (req, res) => {
    let result = await services.upsert(null, req.body, req.user);
    res.send(result);
  }),
);

router.put(
  '/:id',
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
