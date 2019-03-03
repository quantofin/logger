/* eslint-disable no-console */
/* eslint-disable global-require */
const ENV = process.env.NODE_ENV || 'production';

const { exec } = require('child_process');
const path = require('path');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const NodemonPlugin = require('nodemon-webpack-plugin');
const PrettierPlugin = require('prettier-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const NodeExternals = require('webpack-node-externals');

const pkg = require('./package.json');

const isDev = ENV === 'development';

class CustomScriptRunnerPlugin {
  /**
   * Constructs a new CustomScriptRunnerPlugin
   * @public
   * @param name The unique name of the runner
   * @param command The script or command to execute
   * @param stage At what stage of the pipeline should the script be executed (default: afterEmit)
   */
  constructor(name, command, stage = 'afterEmit') {
    this.name = name;
    this.command = command;
    this.stage = stage;
  }

  static execHandler(err, stdout, stderr) {
    if (err) console.error(err);
    if (stdout) process.stdout.write(stdout);
    if (stderr) process.stderr.write(stderr);
  }

  apply(compiler) {
    compiler.hooks[this.stage].tap(this.name, () => {
      console.log(`>> Executing CustomScriptRunnerPlugin: (${this.stage}) - ${this.name} : ${this.command}`);
      exec(this.command, CustomScriptRunnerPlugin.execHandler);
    });
  }
}

const plugins = [new PrettierPlugin({ configFile: `${process.cwd()}/.prettierrc.js` })];

if (!isDev) {
  [
    new CustomScriptRunnerPlugin('GenerateFiles', 'node ./build/generate.js'),
    new CustomScriptRunnerPlugin('Documentation:html', 'documentation build -f html -o dist/docs src/main.mjs'),
    new BundleAnalyzerPlugin({ openAnalyzer: false, analyzerMode: 'static' }),
    new CustomScriptRunnerPlugin('RunTest', 'jest', 'beforeRun'),
    new CopyWebpackPlugin([
      'package.json',
      'package-lock.json',
      'README.md',
      'LICENSE',
      'CHANGELOG.md',
      'examples/**',
      'docs/**',
    ]),
  ].forEach((p) => plugins.push(p));
} else {
  [
    new NodemonPlugin({
      ignore: ['node_modules/*', 'dist/*', 'coverage/*', 'docs/*'],
      watch: path.resolve('./'),
      ext: 'js,mjs,json,node',
    }),
  ].forEach((p) => plugins.push(p));
}

module.exports = {
  entry: path.join(__dirname, 'src', 'main'),
  output: {
    path: path.join(__dirname, 'dist'),
    libraryExport: 'default',
    libraryTarget: 'umd',
  },
  externals: [NodeExternals()],
  target: 'node',
  devtool: isDev ? 'source-map' : false,
  mode: isDev ? 'development' : 'production',
  watch: isDev,
  watchOptions: {
    aggregateTimeout: 1000,
    // poll: 1000,
    ignored: ['node_modules', 'coverage', 'docs', 'dist', 'src/**/__tests__/**'],
  },
  resolve: {
    extensions: ['.js', '.mjs', '.json'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@config': path.resolve(__dirname, 'src/config'),
      '@modules': path.resolve(__dirname, 'src/modules'),
      '@tools': path.resolve(__dirname, 'src/tools'),
    },
  },
  optimization: {
    usedExports: true,
    minimize: !isDev,
    minimizer: [
      new TerserPlugin({
        test: /\.m?js(\?.*)?$/i,
        terserOptions: {
          ecma: 6,
          html5_comments: false,
          warnings: false,
          mangle: true,
          module: false,
          toplevel: false,
          nameCache: null,
          ie8: false,
          keep_classnames: undefined,
          keep_fnames: false,
          safari10: false,
          parse: {},
          compress: {},
          output: {
            comments: false,
            beautify: false,
          },
        },
      }),
    ],
  },
  performance: { hints: false },
  plugins,
  module: {
    rules: [
      {
        test: /\.m?js$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        exclude: [/node_modules/, /examples/, /docs/, /dist/, /coverage/],
        include: __dirname,
        options: {
          fix: true,
          configFile: '.eslintrc.js',
          formatter: require('eslint-friendly-formatter'),
        },
      },
      {
        test: /\.m?js$/,
        loader: 'babel-loader',
        include: __dirname,
        exclude: [/node_modules/, /examples/, /docs/, /dist/, /coverage/],
        // TODO: Indicate what parts of the module contain side effects, to help with tree-shaking
        // Refer: https://webpack.js.org/guides/tree-shaking/#mark-the-file-as-side-effect-free
        // sideEffects: false,
      },
    ],
  },
};
