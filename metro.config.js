// const { getDefaultConfig } = require('expo/metro-config');

// const config = getDefaultConfig(__dirname);

// config.resolver.assetExts.push(
//     'bin'
// );

// module.exports = config;

const { getDefaultConfig } = require("expo/metro-config");

module.exports = (() => {
    const config = getDefaultConfig(__dirname);

    const { transformer, resolver } = config;

    config.transformer = {
        ...transformer,
        babelTransformerPath: require.resolve("react-native-svg-transformer")
    };
    config.resolver = {
        ...resolver,
        assetExts: ['bin', ...resolver.assetExts.filter((ext) => ext !== "svg")],
        sourceExts: [...resolver.sourceExts, "svg"]
    };

    return config;
})();