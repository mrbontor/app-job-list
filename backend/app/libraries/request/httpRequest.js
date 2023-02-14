const Axios = require('axios');

module.exports = {
    httpRequest: (method, url, data = {}, options = {}) => {
        const configs = {
            method: method,
            url: url,
            headers: options,
            maxRedirects: 5
        };
        if ('get' === method) configs.params = data;
        else configs.data = data;

        return Axios(configs);
    }
};
