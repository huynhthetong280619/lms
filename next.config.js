const withSass = require('@zeit/next-sass');
const withCss = require('@zeit/next-css');
const withFonts = require('next-fonts');
const withAssetsImport = require('next-assets-import');
const withTM = require('next-transpile-modules')(['antd']);

module.exports = withTM(
  withFonts(
    withAssetsImport(
      withSass({
        ...withCss({
          publicRuntimeConfig: {
            DEBUG: process.env.DEBUG || 'app:pages:*',
            DEBUG_ENABLED: process.env.DEBUG_ENABLED,
            APPS_DOMAIN: process.env.APPS_DOMAIN,
            APPS_DATA_HOST: process.env.APPS_DATA_HOST,
          },
          webpack: (config, { isServer }) => {
            console.log('process', process.env.APPS_DOMAIN);

            if (isServer) {
              const antStyles = /antd\/.*?\/style\/css.*?/;
              const origExternals = [...config.externals];
              config.externals = [
                (context, request, callback) => {
                  if (request.match(antStyles)) return callback();
                  if (typeof origExternals[0] === 'function') {
                    origExternals[0](context, request, callback);
                  } else {
                    callback();
                  }
                },
                ...(typeof origExternals[0] === 'function' ? [] : origExternals),
              ];

              config.module.rules.unshift({
                test: antStyles,
                use: 'null-loader',
              });
            }
            return config;
          },
        }),
        cssModules: true,
      }),
    ),
  ),
);
