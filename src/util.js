/**
 * Created by mkeereman on 8/20/15.
 */
var util = {};

/**
 * Checks if a given variable is an array.
 */
util.isArray = ('isArray' in Array) ?
  Array.isArray :
  function (value) {
    return Object.prototype.toString.call(value) === '[object Array]';
  };

/**
 * Flattens an object and creates unique property names:
 *
 * @param {object} obj
 *  The object that contains all the data.
 * @param {string} prefix
 *  Optional prefix to prepend to the column name.
 * @return {object} result
 */
util.flattenData = function (obj, prefix) {
  var result = {},
    traverse = function(obj, ancestor) {
      var item, key, parent;

      for (key in obj) {
        if (!obj.hasOwnProperty(key)) continue;

        item = obj[key];

        if (typeof item === 'object') {
          parent = ancestor + key + '.';
          traverse(item, parent);

          continue;
        }

        if (util.isArray(item)) {
          for (var i=0; i < item.length; i++) {
            parent = ancestor + key + '-';
            traverse(item[i], parent);
          }

          continue;
        }

        key = prefix + ancestor + key;
        result[key] = item;
      }
    };

  // Ensure we have a valid prefix.
  if (prefix == null || typeof(prefix) !== 'string') {
    prefix = '';
  }

  // Traverse over our (nested) object.
  traverse(obj, '');

  return result;
};

/**
 * Flattens our metadata to an associative array [{'name': 'Column_1', 'type': 'String'}]
 *
 * @param {object} obj
 *  The object that contains all the metadata (name and type).
 * @param {string} prefix
 *  Optional prefix to prepend to the column name.
 * @return {Array} result
 */
util.flattenHeaders = function (obj, prefix) {
  var result = [],
    traverse = function(obj, ancestor) {
      var item, key, parent;

      // Do not bother parsing empty objects.
      if (obj === null) return;

      for (key in obj) {
        if (!obj.hasOwnProperty(key)) continue;

        item = obj[key];

        if (typeof item === 'object') {
          parent = ancestor + key + '.';
          traverse(item, parent);

          continue;
        }

        if (item.constructor === 'array') {
          for (var i=0; i < item.length; i++) {
            parent = ancestor + key + '-';
            traverse(item[i], parent);
          }

          continue;
        }

        key = prefix + ancestor + key;
        result.push({
          'name': key,
          'type': item
        });
      }
    };

  // Ensure we have a valid prefix.
  if (prefix == null || typeof(prefix) !== 'string') {
    prefix = '';
  }

  // Traverse over our (nested) object.
  traverse(obj, '');

  return result;
};