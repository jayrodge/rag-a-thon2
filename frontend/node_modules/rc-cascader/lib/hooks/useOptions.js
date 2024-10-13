"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = useOptions;
var React = _interopRequireWildcard(require("react"));
var _useEntities = _interopRequireDefault(require("./useEntities"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function useOptions(mergedFieldNames, options) {
  var mergedOptions = React.useMemo(function () {
    return options || [];
  }, [options]);

  // Only used in multiple mode, this fn will not call in single mode
  var getPathKeyEntities = (0, _useEntities.default)(mergedOptions, mergedFieldNames);

  /** Convert path key back to value format */
  var getValueByKeyPath = React.useCallback(function (pathKeys) {
    var keyPathEntities = getPathKeyEntities();
    return pathKeys.map(function (pathKey) {
      var nodes = keyPathEntities[pathKey].nodes;
      return nodes.map(function (node) {
        return node[mergedFieldNames.value];
      });
    });
  }, [getPathKeyEntities, mergedFieldNames]);
  return [mergedOptions, getPathKeyEntities, getValueByKeyPath];
}