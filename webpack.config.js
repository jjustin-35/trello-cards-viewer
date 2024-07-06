const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const { DefinePlugin } = require("webpack");
const dotenv = require("dotenv");

dotenv.config();

module.exports = {
  entry: {
    main: "./src/index.tsx",
    worker: "./src/server-worker.ts",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: (pathData) =>
      pathData.chunk.name === "worker" ? "server-worker.js" : "bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
    new CopyPlugin({
      patterns: [{ from: "src/manifest.json", to: "manifest.json" }],
    }),
    new DefinePlugin({
      "process.env.TRELLO_API_KEY": JSON.stringify(process.env.TRELLO_API_KEY),
      "process.env.TRELLO_API_TOKEN": JSON.stringify(
        process.env.TRELLO_API_TOKEN
      ),
    }),
  ],
  devServer: {
    port: "3000",
    static: ["./dist"],
    open: true,
    hot: true,
    liveReload: true,
  },
};
