/* eslint-disable no-console */
const axios = require('axios');
require('./index');

const requestErrorHandler = (error) => {
    if (error.config) {
        console.log('\n\nAxios error: \n', error.config.url, error.config.data);
    }

    if (error.response) {
        console.log(error.response);
    }

    Promise.reject(error);
};

// Add a request interceptor
axios.interceptors.request.use((config) => config, requestErrorHandler);

// Add a response interceptor
axios.interceptors.response.use((response) => response, requestErrorHandler);
