import config from "../../config/application";

export function getConfig(key) {
  if (config.hasOwnProperty(key)) {
    return config[key];
  } else {
    throw new Error(`Key ${key} was not found in config. Make sure it's present in config/application.js file`);
  }
}