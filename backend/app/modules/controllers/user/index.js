const { UserService } = require('../../services');
const ResponseHelper = require('../../../helpers/response');
const Logging = require('../../../helpers/logging');

module.exports = {
    createUser: async (req, res) => {
        try {
            const data = await UserService.createUser(req.body);

            ResponseHelper.success(res, data);
        } catch (err) {
            Logging.error(`[CREATE][USER] >>>>> ${JSON.stringify(err.message)}`);
            ResponseHelper.error(res, err);
        }
    },

    updateInfoUser: async (req, res) => {
        try {
            const data = await UserService.updateUser(req.params.userName, req.body);
            ResponseHelper.success(res, data);
        } catch (err) {
            Logging.error(`[UPDATE][USER] >>>>> ${JSON.stringify(err.stack)}`);
            ResponseHelper.error(res, err);
        }
    },
    getUser: async (req, res) => {
        try {
            const data = await UserService.getUserByUsername(req.params.userName);
            ResponseHelper.success(res, data);
        } catch (err) {
            Logging.error(`[GET][ONE][USER] >>>>> ${JSON.stringify(err.message)}`);
            ResponseHelper.error(res, err);
        }
    },
    getAllUsers: async (req, res) => {
        try {
            const data = await UserService.getAllUsers(req.query);
            ResponseHelper.success(res, data);
        } catch (err) {
            Logging.error(`[GET][ALL][USERS] >>>>> ${JSON.stringify(err.message)}`);
            ResponseHelper.error(res, err);
        }
    },

    getTableUsers: async (req, res) => {
        try {
            const data = await UserService.getTableUsers(req.query);
            ResponseHelper.success(res, data);
        } catch (err) {
            Logging.error(`[GET][TABLE][USERS] >>>>> ${JSON.stringify(err.stack)}`);
            ResponseHelper.error(res, err);
        }
    },

    updateCredentialUser: async (req, res) => {
        try {
            await UserService.updateCredentialUser(req.params.userName, req.body);
            ResponseHelper.noContent(res);
        } catch (err) {
            Logging.error(`[UPDATE][USER] >>>>> ${JSON.stringify(err.stack)}`);
            ResponseHelper.error(res, err);
        }
    },

    deleteUser: async (req, res) => {
        try {
            await UserService.deleteUser(req.params.userName);
            ResponseHelper.noContent(res);
        } catch (err) {
            Logging.error(`[DELETE][USER] >>>>> ${JSON.stringify(err.stack)}`);
            ResponseHelper.error(res, err);
        }
    }
};
