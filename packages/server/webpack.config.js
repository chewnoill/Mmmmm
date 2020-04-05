const path = require("path");

module.exports = {
  target: "node",
  entry: {
    server: "./src/server.ts"
  },
  optimization: {
    minimize: false
  },
  devtool: "cheap-source-map",
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              transpileOnly: true,
              experimentalWatchApi: true,
              happyPackMode: true,
              configFile: path.resolve(__dirname, "./tsconfig.json")
            }
          }
        ]
      }
    ]
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "build")
  },
  resolve: {
    extensions: [".mjs", ".ts", ".tsx", ".js", ".jsx"],
    plugins: []
  }
};
