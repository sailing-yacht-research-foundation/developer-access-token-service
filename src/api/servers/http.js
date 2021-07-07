const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const versionRouter = require('../routes/versionRouter');
const errorHandler = require('../middlewares/errorHandler');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use(versionRouter);

app.use(errorHandler);

module.exports = app;
