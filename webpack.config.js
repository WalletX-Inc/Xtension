const webpack = require("webpack");
const path = require("path");
const HTMLPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = [
  {
    entry: {
      index: "./src/index.tsx",
      contentScript: "./src/contentScript/contentScript.ts",
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
    optimization: {
      splitChunks: {
        chunks(chunk) {
          return chunk.name !== "contentScript";
        },
      },
    },
  },
  {
    name: "background",
    entry: path.resolve(__dirname, "./src/background/background.ts"),
    module: {
      // rules: [
      //   {
      //     test: /\.(js)$/,
      //     exclude: /node_modules/,
      //     use: ['babel-loader']
      //   }
      // ]
    },

    module: {
      rules: [
        {
          test: /\.(js|jsx|ts|tsx)$/,
          use: [
            {
              loader: "ts-loader",
              options: {
                compilerOptions: { noEmit: false },
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
          exclude: /node_modules/,
        },
      ],
    },

    resolve: {
      extensions: [".js"],
    },
    output: {
      path: path.resolve(__dirname, "./dist/js"),
      filename: "background.js",
    },
    devServer: {
      static: path.resolve(__dirname, "./dist/js"),
    },
    plugins: [
      new NodePolyfillPlugin(),
      // new webpack.IgnorePlugin(/^\.\/wordlists\/(?!english)/, /bip39\/src$/),
      new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 1,
      }),
      new Dotenv(),
    ],
    optimization: {
      minimize: false,
    },
  },
  {
    name: "eth-provider",
    entry: path.resolve(__dirname, "./src/Web3Provider/eth-provider.js"),
    module: {
      // rules: [
      //   {
      //     test: /\.(js)$/,
      //     exclude: /node_modules/,
      //     use: ['babel-loader']
      //   }
      // ]
    },
    resolve: {
      extensions: [".js"],
    },
    output: {
      path: path.resolve(__dirname, "./dist/js"),
      filename: "eth-provider.js",
    },
    devServer: {
      static: path.resolve(__dirname, "./dist/js"),
    },
    plugins: [
      new NodePolyfillPlugin(),
      // new webpack.IgnorePlugin(/^\.\/wordlists\/(?!english)/, /bip39\/src$/),
      new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 1,
      }),
      new Dotenv(),
    ],
    optimization: {
      minimize: false,
    },
  },
];

function getHtmlPlugins(chunks) {
  return chunks.map(
    (chunk) =>
      new HTMLPlugin({
        title: "React extension",
        filename: `${chunk}.html`,
        chunks: [chunk],
      })
  );
}
