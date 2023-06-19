module.exports = {
  // other options here...
  module: {
    rules: [
      // other rules here...
      {
        test: /\.scss$/,
        use: [
          // other loaders here...
          {
            loader: 'sass-loader',
            options: {
              // options for sass-loader here...
            }
          }
        ]
      }
    ]
  }
}
