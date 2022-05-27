export default function joinPath() {
  return [...arguments].join("/").replace(/\/+/g, "/").replace(/:\//g, "://");
}