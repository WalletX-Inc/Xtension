/* eslint-disable @typescript-eslint/no-var-requires */
const webpack = require("webpack");
const path = require("path");
const HTMLPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

function getHtmlPlugins(chunks) {
  return chunks.map(
    (chunk) =>
      new HTMLPlugin({
        title: "React extension",
        filename: `${chunk}.html`,
        chunks: [chunk],
      }),
  );
}

module.exports = [
  {
    entry: {
      index: "./src/index.tsx",
    },
    mode: "production",

    module: {
      rules: [
        {
          test: /\.(js|jsx|ts|tsx)$/,
          use: [
            {
              loader: "ts-loader",
              options: {
                compilerOptions: { noEmit: false },
                transpileOnly: true,
              },
            },
          ],
          exclude: /node_modules/,
        },
        {
          test: /\.css$/i,
          use: ["style-loader", "css-loader", "postcss-loader"],
        },
        {
          test: /\.(png|jpg|jpeg|gif|svg)$/,
          use: [
            {
              loader: "file-loader",
              options: {
                name: "[name].[ext]",
                outputPath: "images/", // Output directory for images
              },
            },
          ],
        },

        {
          exclude: /node_modules/,
        },
      ],
    },
    plugins: [
      new webpack.ProvidePlugin({
        Buffer: ["buffer", "Buffer"],
      }),
      new webpack.ProvidePlugin({
        process: "process",
      }),
      new CopyPlugin({
        patterns: [{ from: "./public/manifest.json", to: "../manifest.json" }],
      }),

      new CopyPlugin({
        patterns: [
          {
            from: "./src/dapp-connection/content-script.js",
            to: "content-script.js",
          },
        ],
      }),

      new CopyPlugin({
        patterns: [
          {
            from: "./src/dapp-connection/inject-web3.js",
            to: "inject-web3.js",
          },
        ],
      }),

      new CopyPlugin({
        patterns: [
          {
            from: "public/icons",
            to: "../icons",
          },
        ],
      }),
      ...getHtmlPlugins(["index"]),
    ],
    resolve: {
      extensions: [".tsx", ".ts", ".js", ".jsx"],
      fallback: {
        fs: false,
        tls: false,
        net: false,
        path: false,
        zlib: false,
        http: false,
        https: false,
        stream: require.resolve("stream-browserify"),
        assert: require.resolve("assert/"),
        crypto: false,
        "crypto-browserify": require.resolve("crypto-browserify"),
      },
    },
    output: {
      path: path.join(__dirname, "dist/js"),
      filename: "[name].js",
    },
  },
  {
    name: "background",
    entry: path.resolve(__dirname, "./src/dapp-connection/background.js"),
    module: {
      rules: [
        {
          test: /\.(js)$/,
          exclude: /node_modules/,
          use: ["babel-loader"],
        },
      ],
    },
    resolve: {
      extensions: [".js"],
      modules: ["node_modules"],
    },
    output: {
      path: path.resolve(__dirname, "dist/js"),
      filename: "background.js",
    },
    devServer: {
      contentBase: path.resolve(__dirname, "dist/js"),
    },
    plugins: [
      new NodePolyfillPlugin(),
      // new webpack.IgnorePlugin(/^\.\/wordlists\/(?!english)/, /bip39\/src$/),
      new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 1,
      }),
    ],
    optimization: {
      minimize: false,
    },
  },
  {
    name: "eth-provider",
    entry: path.resolve(__dirname, "./src/dapp-connection/eth-provider.js"),
    module: {
      rules: [
        {
          test: /\.(js)$/,
          exclude: /node_modules/,
          use: ["babel-loader"],
          include: path.join(__dirname, "./src/dapp-connection/js"),
        },
      ],
    },
    resolve: {
      extensions: [".js"],
    },
    output: {
      path: path.resolve(__dirname, "dist/js"),
      filename: "eth-provider.js",
    },
    devServer: {
      contentBase: path.resolve(__dirname, "dist/js"),
    },
    plugins: [
      new NodePolyfillPlugin(),
      // new webpack.IgnorePlugin(/^\.\/wordlists\/(?!english)/, /bip39\/src$/),
      new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 1,
      }),
    ],
    optimization: {
      minimize: false,
    },
  },
];
