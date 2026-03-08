/** @type {import('expo/metro-config').MetroConfig} */
const { getDefaultConfig } = require('expo/metro-config');


// Run Metro purely within the mobile app directory.
// No monorepo root watching — this avoids picking up the root-level
// @babel/core and gensync which conflict with Expo's bundler.
const config = getDefaultConfig(__dirname);

module.exports = config;
