const express = require('express');
const App = express();

const { UserController } = require('../../../modules/controllers');

const { VerifyToken } = require('../../../modules/middleware');

App.use(VerifyToken.verifyToken);

App.get('/', UserController.getAllUsers);
App.get('/table', UserController.getTableUsers);
App.get('/:userName', UserController.getUser);
App.post('/', UserController.createUser);
App.put('/:userName', UserController.updateInfoUser);
App.patch('/password/:userName', UserController.updateCredentialUser);
App.delete('/:userName', UserController.deleteUser);

module.exports = App;
