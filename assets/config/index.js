const getConfig = require('next/config').default;
const { publicRuntimeConfig } = getConfig();
const { APPS_DOMAIN } = publicRuntimeConfig;

exports.GLOBAL_CONFIG = {
    APPS_DOMAIN: APPS_DOMAIN || 'https://spkt-server.herokuapp.com'
};