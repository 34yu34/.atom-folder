Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/** @babel */

var _evinceOpener = require('./evince-opener');

var _evinceOpener2 = _interopRequireDefault(_evinceOpener);

var DBUS_NAMES = {
  applicationObject: '/org/mate/atril/Atril',
  applicationInterface: 'org.mate.atril.Application',

  daemonService: 'org.mate.atril.Daemon',
  daemonObject: '/org/mate/atril/Daemon',
  daemonInterface: 'org.mate.atril.Daemon',

  windowInterface: 'org.mate.atril.Window'
};

var AtrilOpener = (function (_EvinceOpener) {
  _inherits(AtrilOpener, _EvinceOpener);

  function AtrilOpener() {
    _classCallCheck(this, AtrilOpener);

    _get(Object.getPrototypeOf(AtrilOpener.prototype), 'constructor', this).call(this, 'Atril', DBUS_NAMES);
  }

  _createClass(AtrilOpener, [{
    key: 'canOpenInBackground',
    value: function canOpenInBackground() {
      return false;
    }
  }]);

  return AtrilOpener;
})(_evinceOpener2['default']);

exports['default'] = AtrilOpener;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2JpbGx5Ly5hdG9tL3BhY2thZ2VzL2xhdGV4L2xpYi9vcGVuZXJzL2F0cmlsLW9wZW5lci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OzRCQUV5QixpQkFBaUI7Ozs7QUFFMUMsSUFBTSxVQUFVLEdBQUc7QUFDakIsbUJBQWlCLEVBQUUsdUJBQXVCO0FBQzFDLHNCQUFvQixFQUFFLDRCQUE0Qjs7QUFFbEQsZUFBYSxFQUFFLHVCQUF1QjtBQUN0QyxjQUFZLEVBQUUsd0JBQXdCO0FBQ3RDLGlCQUFlLEVBQUUsdUJBQXVCOztBQUV4QyxpQkFBZSxFQUFFLHVCQUF1QjtDQUN6QyxDQUFBOztJQUVvQixXQUFXO1lBQVgsV0FBVzs7QUFDbEIsV0FETyxXQUFXLEdBQ2Y7MEJBREksV0FBVzs7QUFFNUIsK0JBRmlCLFdBQVcsNkNBRXRCLE9BQU8sRUFBRSxVQUFVLEVBQUM7R0FDM0I7O2VBSGtCLFdBQVc7O1dBS1YsK0JBQUc7QUFDckIsYUFBTyxLQUFLLENBQUE7S0FDYjs7O1NBUGtCLFdBQVc7OztxQkFBWCxXQUFXIiwiZmlsZSI6Ii9ob21lL2JpbGx5Ly5hdG9tL3BhY2thZ2VzL2xhdGV4L2xpYi9vcGVuZXJzL2F0cmlsLW9wZW5lci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBAYmFiZWwgKi9cblxuaW1wb3J0IEV2aW5jZU9wZW5lciBmcm9tICcuL2V2aW5jZS1vcGVuZXInXG5cbmNvbnN0IERCVVNfTkFNRVMgPSB7XG4gIGFwcGxpY2F0aW9uT2JqZWN0OiAnL29yZy9tYXRlL2F0cmlsL0F0cmlsJyxcbiAgYXBwbGljYXRpb25JbnRlcmZhY2U6ICdvcmcubWF0ZS5hdHJpbC5BcHBsaWNhdGlvbicsXG5cbiAgZGFlbW9uU2VydmljZTogJ29yZy5tYXRlLmF0cmlsLkRhZW1vbicsXG4gIGRhZW1vbk9iamVjdDogJy9vcmcvbWF0ZS9hdHJpbC9EYWVtb24nLFxuICBkYWVtb25JbnRlcmZhY2U6ICdvcmcubWF0ZS5hdHJpbC5EYWVtb24nLFxuXG4gIHdpbmRvd0ludGVyZmFjZTogJ29yZy5tYXRlLmF0cmlsLldpbmRvdydcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQXRyaWxPcGVuZXIgZXh0ZW5kcyBFdmluY2VPcGVuZXIge1xuICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgc3VwZXIoJ0F0cmlsJywgREJVU19OQU1FUylcbiAgfVxuXG4gIGNhbk9wZW5JbkJhY2tncm91bmQgKCkge1xuICAgIHJldHVybiBmYWxzZVxuICB9XG59XG4iXX0=