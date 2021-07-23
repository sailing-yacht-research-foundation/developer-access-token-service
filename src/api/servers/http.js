const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const apiVersionRouter = require('../routes/apiVersionRouter');
const uiRouter = require('../routes/UIRouter');
const errorHandler = require('../middlewares/errorHandler');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use(apiVersionRouter);
app.use(uiRouter);

app.use(errorHandler);

module.exports = app;
