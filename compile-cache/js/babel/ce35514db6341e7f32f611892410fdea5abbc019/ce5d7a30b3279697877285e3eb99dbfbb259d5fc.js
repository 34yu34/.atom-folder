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
  applicationObject: '/org/x/reader/Xreader',
  applicationInterface: 'org.x.reader.Application',

  daemonService: 'org.x.reader.Daemon',
  daemonObject: '/org/x/reader/Daemon',
  daemonInterface: 'org.x.reader.Daemon',

  windowInterface: 'org.x.reader.Window'
};

var XReaderOpener = (function (_EvinceOpener) {
  _inherits(XReaderOpener, _EvinceOpener);

  function XReaderOpener() {
    _classCallCheck(this, XReaderOpener);

    _get(Object.getPrototypeOf(XReaderOpener.prototype), 'constructor', this).call(this, 'Xreader', DBUS_NAMES);
  }

  _createClass(XReaderOpener, [{
    key: 'canOpenInBackground',
    value: function canOpenInBackground() {
      return false;
    }
  }]);

  return XReaderOpener;
})(_evinceOpener2['default']);

exports['default'] = XReaderOpener;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2JpbGx5Ly5hdG9tL3BhY2thZ2VzL2xhdGV4L2xpYi9vcGVuZXJzL3gtcmVhZGVyLW9wZW5lci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OzRCQUV5QixpQkFBaUI7Ozs7QUFFMUMsSUFBTSxVQUFVLEdBQUc7QUFDakIsbUJBQWlCLEVBQUUsdUJBQXVCO0FBQzFDLHNCQUFvQixFQUFFLDBCQUEwQjs7QUFFaEQsZUFBYSxFQUFFLHFCQUFxQjtBQUNwQyxjQUFZLEVBQUUsc0JBQXNCO0FBQ3BDLGlCQUFlLEVBQUUscUJBQXFCOztBQUV0QyxpQkFBZSxFQUFFLHFCQUFxQjtDQUN2QyxDQUFBOztJQUVvQixhQUFhO1lBQWIsYUFBYTs7QUFDcEIsV0FETyxhQUFhLEdBQ2pCOzBCQURJLGFBQWE7O0FBRTlCLCtCQUZpQixhQUFhLDZDQUV4QixTQUFTLEVBQUUsVUFBVSxFQUFDO0dBQzdCOztlQUhrQixhQUFhOztXQUtaLCtCQUFHO0FBQ3JCLGFBQU8sS0FBSyxDQUFBO0tBQ2I7OztTQVBrQixhQUFhOzs7cUJBQWIsYUFBYSIsImZpbGUiOiIvaG9tZS9iaWxseS8uYXRvbS9wYWNrYWdlcy9sYXRleC9saWIvb3BlbmVycy94LXJlYWRlci1vcGVuZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiogQGJhYmVsICovXG5cbmltcG9ydCBFdmluY2VPcGVuZXIgZnJvbSAnLi9ldmluY2Utb3BlbmVyJ1xuXG5jb25zdCBEQlVTX05BTUVTID0ge1xuICBhcHBsaWNhdGlvbk9iamVjdDogJy9vcmcveC9yZWFkZXIvWHJlYWRlcicsXG4gIGFwcGxpY2F0aW9uSW50ZXJmYWNlOiAnb3JnLngucmVhZGVyLkFwcGxpY2F0aW9uJyxcblxuICBkYWVtb25TZXJ2aWNlOiAnb3JnLngucmVhZGVyLkRhZW1vbicsXG4gIGRhZW1vbk9iamVjdDogJy9vcmcveC9yZWFkZXIvRGFlbW9uJyxcbiAgZGFlbW9uSW50ZXJmYWNlOiAnb3JnLngucmVhZGVyLkRhZW1vbicsXG5cbiAgd2luZG93SW50ZXJmYWNlOiAnb3JnLngucmVhZGVyLldpbmRvdydcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgWFJlYWRlck9wZW5lciBleHRlbmRzIEV2aW5jZU9wZW5lciB7XG4gIGNvbnN0cnVjdG9yICgpIHtcbiAgICBzdXBlcignWHJlYWRlcicsIERCVVNfTkFNRVMpXG4gIH1cblxuICBjYW5PcGVuSW5CYWNrZ3JvdW5kICgpIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxufVxuIl19