const { Router } = require('express');

const App = new Router();

const UserApi = require('./users');
const AuhtApi = require('./auth');
const JobApi = require('./jobs');

App.use('/users', UserApi);
App.use('/auth', AuhtApi);
App.use('/jobs', JobApi);

module.exports = App;
