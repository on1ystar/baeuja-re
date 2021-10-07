/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.(e2e-test|test).(ts|tsx)'],
  globalTeardown: './test-teardown-globals.js'
};
