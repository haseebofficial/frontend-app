export default class MappedArray {
  constructor({ ids, hash, itemToId }) {
    this._itemToId = itemToId;
    this._hash = hash;
    this._ids = ids;
    this.length = ids.length;
  }

  find(itemId) {
    return this._hash[itemId];
  }

  findItem(item) {
    return this._hash[this._itemToId(item)];
  }

  all() {
    return this._ids.map((id) => this._hash[id]);
  }

  forEach(func) {
    this._ids.forEach((id) => func(this._hash[id]));
  }

  map(func) {
    return this._ids.map((id) => func(this._hash[id]));
  }
}