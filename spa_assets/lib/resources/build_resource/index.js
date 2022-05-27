if (process.env.NODE_ENV === "test") {
  module.exports = require("./test_build_resource");
} else {
  module.exports = require("./build_resource");
}