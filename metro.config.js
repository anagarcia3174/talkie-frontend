// Sentry's wrapper around Expo's default Metro config: adds debug IDs to
// bundles so uploaded source maps match crash stack traces.
const { getSentryExpoConfig } = require("@sentry/react-native/metro");

const config = getSentryExpoConfig(__dirname);

module.exports = config;
