import merge from 'webpack-merge';
import TerserPlugin from "terser-webpack-plugin";
import OptimizeCSSAssetsPlugin from "optimize-css-assets-webpack-plugin";
import common from './webpack.common.js';

export default merge(common, {
  mode: 'production',
  performance: {
    maxEntrypointSize: 1024000,
    maxAssetSize: 1024000
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        test: /\.m?js(\.erb)?(\?.*)?$/i,
        terserOptions: {
          output: {
            comments: false,
          },
        },
        extractComments: false,
      }), 
      new OptimizeCSSAssetsPlugin({
        assetNameRegExp: /\.s?css$/g
      })
    ],
  },
});