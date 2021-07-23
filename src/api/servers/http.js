const express = require('express');
const helmet = require('helmet');
const { expressCspHeader, INLINE, NONE, SELF } = require('express-csp-header');
const cors = require('cors');

const apiVersionRouter = require('../routes/apiVersionRouter');
const uiRouter = require('../routes/UIRouter');
const errorHandler = require('../middlewares/errorHandler');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use(apiVersionRouter);
app.use(
  expressCspHeader({
    directives: {
      'default-src': [SELF],
      'script-src': [SELF],
      'style-src': [SELF, INLINE, 'cdnjs.cloudflare.com'],
      'font-src': [SELF, 'cdnjs.cloudflare.com'],
      'img-src': ['data:', '*'],
      'worker-src': [NONE],
      'block-all-mixed-content': true,
    },
  }),
);
app.use(uiRouter.staticFile);
app.use(uiRouter.router);

app.use(errorHandler);

module.exports = app;
