import MappedArray from "./_mapped_array";

export default { build, push, unshift, update, remove };

function build(array, mapping) {
  let itemToId = typeof mapping === "function" ? mapping : (item) => item[mapping];
  let { ids, hash } = _mapArrray(array, itemToId);
  
  return _buildMappedArray({ itemToId, ids, hash });
}

function push(mappedArr, item) {
  if (Array.isArray(item)) {
    return _addArrayToMappedArr({
      arr: item, mappedArr, 
      insertIds: ({ids, oldIds}) => [...oldIds, ...ids]
    });
  } else {
    return _addItemToMappedArr({
      mappedArr, item,
      insertId: ({id, oldIds}) => [...oldIds, id]
    });
  }
}

function unshift(mappedArr, item) {
  if (Array.isArray(item)) {
    return _addArrayToMappedArr({
      arr: item, mappedArr,
      insertIds: ({ ids, oldIds }) => [...ids, ...oldIds]
    });
  } else {
    return _addItemToMappedArr({
      mappedArr, item,
      insertId: ({ id, oldIds }) => [id, ...oldIds]
    });
  }
}

function update(mappedArr, { itemId, item, data }) {
  item = ( item && mappedArr.findItem(item) ) || mappedArr.find(itemId);
  
  if (!item) {
    return mappedArr;
  } else {
    let { itemToId, hash, ids } = mappedArr._factoryAttributes;
    let id = itemToId(item);
    let updatedItem = Object.assign({}, item, data);

    ids = [...ids];
    hash = Object.assign({}, hash, { [id]: updatedItem });
    
    let newArr = _buildMappedArray({itemToId, hash, ids});

    return newArr;
  }
}

function remove(mappedArr, {itemId, item}) {
  item = item || mappedArr.find(itemId);

  if (!item) {
    return mappedArr;
  } else {
    let { itemToId, hash, ids } = mappedArr._factoryAttributes;
    let id = itemToId(item);

    ids = ids.filter((i) => i !== id);
    
    hash = Object.assign({}, hash);
    delete hash[id];

    let newArr = _buildMappedArray({ itemToId, hash, ids });

    return newArr;
  }
}

function _addItemToMappedArr({item, mappedArr, insertId}) {
  if (mappedArr.findItem(item)) {
    throw(`Item already stored: ${JSON.stringify(item)}`);
  } else {
    let { itemToId, hash: oldHash, ids: oldIds } = mappedArr._factoryAttributes;
    let id = itemToId(item);

    let hash = Object.assign({}, oldHash, { [id]: item });
    let ids = insertId({id, oldIds});

    return _buildMappedArray({ itemToId, hash, ids });
  }
}

function _addArrayToMappedArr({arr, mappedArr, insertIds}) {
  let { itemToId, hash: oldHash, ids: oldIds } = mappedArr._factoryAttributes;
  let idItemHash = {};
  let newIds = [];

  arr.forEach(function(item) {
    if (mappedArr.findItem(item)) {
      throw (`Item already stored: ${JSON.stringify(item)}`);
    } else {
      let id = itemToId(item);
      idItemHash[id] = item;
      newIds.push(id);
    }
  });

  let hash = Object.assign({}, oldHash, idItemHash);
  let ids = insertIds({ids: newIds, oldIds});

  return _buildMappedArray({ itemToId, hash, ids });
}

function _buildMappedArray(factoryAttributes) {
  let result = new MappedArray(factoryAttributes);
  result._factoryAttributes = factoryAttributes;

  return result;
}

function _mapArrray(array, toId) {
  let ids = [];
  let hash = {};

  array.forEach(function (item) {
    let id = toId(item);
    if (id === undefined) { throw `item->id mapping for ${JSON.stringify(item)} returned undefined`; }

    ids.push(id);
    hash[id] = item;
  });

  return {ids, hash};
}