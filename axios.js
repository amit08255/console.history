/* eslint-disable no-console */
const axios = require('axios');
require('./index');

const requestErrorHandler = (error) => {
    const url = error.config ? error.config.url : '';
    const data = error.config ? error.config.data : '';
    const response = error.response ? error.response.data : '';
    const status = error.response ? error.response.status : '';
    const statusText = error.response ? error.response.statusText : '';

    if (error.config) {
        console.error('[*] Axios Error: ', url, data, response, status, statusText);
    }

    Promise.reject(error);
};

// Add a request interceptor
axios.interceptors.request.use((config) => config, requestErrorHandler);

// Add a response interceptor
axios.interceptors.response.use((response) => response, requestErrorHandler);
