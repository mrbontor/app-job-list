const { JobService } = require('../../services');
const ResponseHelper = require('../../../helpers/response');
const Logging = require('../../../helpers/logging');

module.exports = {
    getJobs: async (req, res) => {
        try {
            const data = await JobService.getJobs(req.query);
            ResponseHelper.success(res, data);
        } catch (err) {
            Logging.error(`[GET][JOBS] >>>>> ${JSON.stringify(err.message)}`);
            ResponseHelper.error(res, err);
        }
    },

    getJobById: async (req, res) => {
        try {
            const data = await JobService.getJobById(req.params.ID);
            ResponseHelper.success(res, data);
        } catch (err) {
            Logging.error(`[GET][JOBS] >>>>> ${JSON.stringify(err.message)}`);
            ResponseHelper.error(res, err);
        }
    }
};
