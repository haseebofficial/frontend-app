import { getConfig } from "config";

if (getConfig("useRailsAssetPipeline")) {
  module.exports = require("./rails_assets");
} else {
  module.exports = require("./dist_assets");
}