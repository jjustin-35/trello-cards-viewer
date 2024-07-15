const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: {
    main: "./src/index.tsx",
    "service-worker": "./src/service-worker.ts",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    clean: true,
    filename: (pathData) =>
      pathData.chunk.name === "service-worker" ? "[name].js" : "bundle.js",
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
  ],
  devServer: {
    port: "3000",
    static: ["./dist"],
    open: true,
    hot: true,
    liveReload: true,
  },
};
