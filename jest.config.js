const fs = require('fs');
const path = require('path');

const ENV = process.env.NODE_ENV || 'test';
const isTest = ENV === 'test';

// --- Ignore paths... update this as needed
const ignorePatterns = ['/node_modules/', '/dist/', '/build/', '/coverage/', '/docs/', '/examples/'];

let mod = fs
  .readdirSync(path.join(__dirname, 'src'))
  .filter((p) => {
    const stats = fs.statSync(path.join(__dirname, 'src', p));
    return stats.isDirectory() && !['__tests__'].includes(p);
  })
  .reduce((acc, val) => `${acc}${val}|`, '');

if (mod.endsWith('|')) mod = mod.substring(0, mod.length - 1);

mod = `^@(${mod})(.*)$`;

module.exports = {
  verbose: isTest,
  moduleFileExtensions: ['js', 'mjs', 'json', 'node'],
  modulePathIgnorePatterns: ignorePatterns,
  moduleNameMapper: { [mod]: '<rootDir>/src/$1$2' },
  transform: { '^.+\\.m?jsx?$': 'babel-jest' },
  testMatch: ['**/__tests__/*.spec.(js|mjs|ts)'],
  collectCoverage: isTest,
  collectCoverageFrom: ['<rootDir>/src/**/*.{js,mjs}', ...ignorePatterns.map((p) => `!**${p}**`)],
  coveragePathIgnorePatterns: ignorePatterns,
};
