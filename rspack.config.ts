import { defineConfig } from '@rspack/cli';
import { rspack } from '@rspack/core';
import ReactRefreshPlugin from '@rspack/plugin-react-refresh';
import * as path from 'path';
import globalConfig from './config';
import HtmlTagsPlugin from './HtmlTagsPlugin';

const isDev = process.env.NODE_ENV === 'development';

const cdn = {
  // 开发环境
  dev: {
    css: [],
    js: [],
  },
  // 生产环境
  prod: {
    css: [],
    js: [
      '//cdn-scp.banu.cn/npm/react/18.3.1/react.production.min.js',
      '//cdn-scp.banu.cn/npm/react/18.3.1/react-dom.production.min.js',
      '//cdn-scp.banu.cn/npm/dayjs/1.11.12/dayjs.min.js',
      '//cdn-scp.banu.cn/npm/antd/5.20.1/antd.min.js',
    ],
  },
};

export default defineConfig({
  mode: isDev ? 'development' : 'production',
  devtool: isDev ? 'eval-cheap-module-source-map' : false,
  target: ['web', 'es5'],
  context: __dirname,
  entry: {
    main: './src/main.tsx',
  },
  output: {
    clean: true,
    filename: 'js/[name].[chunkhash:8].js',
    // 不要在开发模式下使用 contenthash
    cssFilename: isDev ? 'css/[name].css' : 'css/[name].[contenthash:8].css',
  },
  watchOptions: {
    ignored: /node_modules/,
  },
  resolve: {
    // alias: {
    //   '@': path.resolve(__dirname, './src'),
    // },
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    tsConfig: path.resolve(__dirname, './tsconfig.json'),
  },
  experiments: {
    css: true,
  },
  module: {
    parser: {
      'css/auto': {
        namedExports: false,
      },
    },
    generator: {
      'css/auto': {
        exportsConvention: 'camel-case',
      },
    },
    rules: [
      {
        test: /\.tsx$/,
        use: [
          {
            loader: 'builtin:swc-loader',
            options: {
              jsc: {
                parser: {
                  syntax: 'typescript',
                  tsx: true,
                },
                transform: {
                  react: {
                    development: isDev,
                    refresh: isDev,
                  },
                },
              },
            },
          },
        ],
        type: 'javascript/auto',
      },
      {
        test: /\.css$/i,
        use: [rspack.CssExtractRspackPlugin.loader, 'css-loader'],
        type: 'javascript/auto',
      },
      {
        test: /\.less$/,
        type: 'css/auto',
        use: ['less-loader'],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/,
        type: 'asset/resource',
        generator: {
          filename: 'img/[name].[hash:8][ext]',
        },
      },
      {
        test: /\.(eot|otf|ttf|woff|woff2)$/,
        type: 'asset/resource',
        generator: {
          filename: 'font/[name].[hash:8][ext]',
        },
      },
    ],
  },
  plugins: [
    isDev && new ReactRefreshPlugin(),
    new rspack.HtmlRspackPlugin({
      template: './public/index.html',
      favicon: './public/favicon.png',
      minify: true,
    }),
    new HtmlTagsPlugin(isDev ? cdn.dev : cdn.prod),
    new rspack.CssExtractRspackPlugin({
      filename: 'css/[name].[contenthash:8].css',
    }),
    new rspack.DefinePlugin({
      'process.env': JSON.stringify(process.env),
      globalConfig: JSON.stringify(globalConfig),
    }),
  ].filter(Boolean),
  externals: isDev
    ? {}
    : {
        react: 'React',
        'react-dom': 'ReactDOM',
        dayjs: 'dayjs',
        antd: 'antd',
      },
  optimization: {
    minimizer: [
      new rspack.SwcJsMinimizerRspackPlugin(),
      // Target browsers, see: https://github.com/browserslist/browserslist
      new rspack.LightningCssMinimizerRspackPlugin({
        minimizerOptions: {
          targets: ['chrome >= 87', 'edge >= 88', '> 0.5%'],
        },
      }),
    ],
  },
  devServer: {
    host: 'local-ipv4',
    port: 'auto',
    hot: true,
    open: true,
    proxy: [
      {
        context: ['/api'],
        target: globalConfig.baseURL,
      },
    ],
    historyApiFallback: true,
  },
});
