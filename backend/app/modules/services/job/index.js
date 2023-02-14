const { NotFoundError } = require('../../../helpers/exceptions');
const ApiRequest = require('../../../libraries/request');

const API_MAIN = process.env.API_DANSMULTIPRO;
const POSTION_JSON_URI = 'recruitment/positions.json';
const POSTION_URI = 'recruitment/positions/';

const Services = {
    getJobs: async (payload) => {
        let results = {};
        try {
            const { description, location, full_time, page } = payload || null;

            let query = {};

            if (description !== 'undefined') query.description = description;
            if (location) query.location = location.toLowerCase();
            if (full_time !== 'undefined' && full_time === 'true') query.full_time = true || false;
            if (page !== 'undefined') query.page = page || 1;

            const getJobs = await ApiRequest.get(API_MAIN + POSTION_JSON_URI, query);
            if (getJobs.length > 0) {
                const filterJob = getJobs.filter((el) => el !== null) || [];

                return {
                    data: filterJob,
                    page: query.page,
                    size: filterJob.length
                };
            }
            throw new NotFoundError('No data available');
        } catch (err) {
            throw err;
        }
    },

    getJobById: async (ID) => {
        return await ApiRequest.get(API_MAIN + POSTION_URI + ID);
    }
};

module.exports = Services;
