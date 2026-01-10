const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add support for react-native-maps on web
config.resolver.alias = {
  'react-native-maps': 'react-native-web-maps',
};

// Add web extensions
config.resolver.platforms = ['web', 'ios', 'android', 'native'];

module.exports = config;