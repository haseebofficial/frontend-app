if (process.env.NODE_ENV === "test") {
  module.exports = require("./test_client");
} else {
  module.exports = fetch;
}