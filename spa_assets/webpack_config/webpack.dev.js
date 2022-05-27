import merge from "webpack-merge";
import common from "./webpack.common.js";

export default merge(common, {
  watch: true,
  devtool: false,
  mode: "development"
});