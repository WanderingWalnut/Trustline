// An attempted rewrite in ESM threw an error: "ReferenceError: require is not defined"
// when processing `import` in the `.js` files.
//
// import puppeteer from 'puppeteer';
// import webpack from 'webpack'; // eslint-disable-line import/no-extraneous-dependencies
//
// process.env.CHROME_BIN = puppeteer.executablePath();

const webpack = require('webpack'); // eslint-disable-line import/no-extraneous-dependencies

process.env.CHROME_BIN = require('puppeteer').executablePath();

module.exports = (config) => {
  const { env } = process;

  config.set({
    frameworks: ['mocha', 'webpack', 'sinon-chai'],

    files: ['test/index.js', { pattern: 'test/**/*.test.js', watched: false }],

    preprocessors: {
      'test/**/*.js': ['webpack', 'sourcemap'],
    },

    webpack: {
      mode: 'development',
      module: {
        rules: [
          { test: /\.js$/, exclude: /node_modules/, use: 'babel-loader' },
        ],
      },
      plugins: [
        new webpack.DefinePlugin({
          __DEV__: true,
        }),
      ],
    },

    webpackMiddleware: {
      noInfo: true,
    },

    reporters: ['mocha', 'coverage'],

    mochaReporter: {
      output: 'autowatch',
    },

    coverageReporter: {
      type: 'lcov',
      dir: 'coverage',
    },

    customLaunchers: {
      ChromeCi: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox'],
      },
    },

    browsers: env.BROWSER ? env.BROWSER.split(',') : ['Chrome'],
  });
};
