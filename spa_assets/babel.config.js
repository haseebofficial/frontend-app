module.exports = function(api) {
  api.cache.using(isBrowser);

  let presets = ["@babel/preset-react"];
  let plugins = [moduleResolverPlugin()];

  if (isBrowser()) {
    presets.push(envPresetForBrowser());
    plugins.push(["react-remove-properties", {"properties": ["testid"]}]);
  } else {
    presets.push("@babel/preset-env");
    plugins.push([
      "babel-plugin-transform-require-ignore", 
      {"extensions": [".less", ".sass", "scss"]}
    ]);

    plugins.push([
      "transform-assets", 
      {"extensions": ["svg", "png", "jpg", "jpeg", "gif"], "name": "[name].[ext]"}
    ]);
  }

  return { presets, plugins };
};

function moduleResolverPlugin() {
  return [
    "module-resolver",
    {
      "root": [
        "./lib"
      ],
      "alias": {
        "test": "./test",
        "locales": "./locales",
        "translations": "./translations",
        "vendor": "./vendor",
        "webpack_config": "./webpack_config"
      }
    }
  ];
}

function envPresetForBrowser() {
  return [
    "@babel/preset-env", 
    {
      "useBuiltIns": "entry", 
      "debug": false,
      "corejs": 3
    }
  ];
}

function isBrowser() {
  return process.env.BABEL_ENV === 'browser';
}