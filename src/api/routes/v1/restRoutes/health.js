const router = require('express').Router();
const ControllerError = require('../../../utils/ControllerError');

router.get('/', (req, res) => {
  res.status(200).send({
    message: 'ok',
  });
});

router.get('/error', () => {
  throw new ControllerError(
    'this error message should not appear in production',
  );
});

router.get('/error-test', (req) => {
  throw new ControllerError(req.query.message, parseInt(req.query.code || 500));
});

module.exports = router;
