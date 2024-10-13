"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = useValues;
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _conductUtil = require("rc-tree/lib/utils/conductUtil");
var React = _interopRequireWildcard(require("react"));
var _commonUtil = require("../utils/commonUtil");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function useValues(multiple, rawValues, getPathKeyEntities, getValueByKeyPath, getMissingValues) {
  // Fill `rawValues` with checked conduction values
  return React.useMemo(function () {
    var _getMissingValues = getMissingValues(rawValues),
      _getMissingValues2 = (0, _slicedToArray2.default)(_getMissingValues, 2),
      existValues = _getMissingValues2[0],
      missingValues = _getMissingValues2[1];
    if (!multiple || !rawValues.length) {
      return [existValues, [], missingValues];
    }
    var keyPathValues = (0, _commonUtil.toPathKeys)(existValues);
    var keyPathEntities = getPathKeyEntities();
    var _conductCheck = (0, _conductUtil.conductCheck)(keyPathValues, true, keyPathEntities),
      checkedKeys = _conductCheck.checkedKeys,
      halfCheckedKeys = _conductCheck.halfCheckedKeys;

    // Convert key back to value cells
    return [getValueByKeyPath(checkedKeys), getValueByKeyPath(halfCheckedKeys), missingValues];
  }, [multiple, rawValues, getPathKeyEntities, getValueByKeyPath, getMissingValues]);
}