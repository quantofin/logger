#!/usr/bin/env node
/* eslint-disable no-console */
const path = require('path');
const documentation = require('documentation');

const { generateDocs } = require('./helpers');
const config = require('./_config');

const moduleConfig = {
  ...config,
  MODULE_PATH: path.join(__dirname, '..'),
};

const promises = [generateDocs(moduleConfig, documentation)];

Promise.all(promises)
  .then(() => console.log('All generators ran successfully'))
  .catch((err) => console.error(err));
