module.exports = {
    resolve: {
      fallback: {
        assert: require.resolve("assert"),
        stream: require.resolve("stream-browserify"),
        http: require.resolve('stream-http'),
        https: require.resolve('https-browserify'),
        zlib: require.resolve('browserify-zlib'),
        util: require.resolve('util'),
        url: require.resolve('url'),
        // Add other polyfills as necessary
      }
    }
  };