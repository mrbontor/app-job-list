const express = require('express');
const App = express();

const { JobController } = require('../../../modules/controllers');

const { VerifyToken } = require('../../../modules/middleware');

App.use(VerifyToken.verifyToken);

App.get('/', JobController.getJobs);
App.get('/:ID', JobController.getJobById);

module.exports = App;
