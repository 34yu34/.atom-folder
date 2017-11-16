Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/** @babel */

var _atom = require('atom');

var Opener = (function (_Disposable) {
  _inherits(Opener, _Disposable);

  function Opener() {
    _classCallCheck(this, Opener);

    _get(Object.getPrototypeOf(Opener.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(Opener, [{
    key: 'open',
    value: _asyncToGenerator(function* (filePath, texPath, lineNumber) {})
  }, {
    key: 'shouldOpenInBackground',
    value: function shouldOpenInBackground() {
      return atom.config.get('latex.openResultInBackground');
    }
  }, {
    key: 'canOpen',
    value: function canOpen(filePath) {
      return false;
    }
  }, {
    key: 'hasSynctex',
    value: function hasSynctex() {
      return false;
    }
  }, {
    key: 'canOpenInBackground',
    value: function canOpenInBackground() {
      return false;
    }
  }]);

  return Opener;
})(_atom.Disposable);

exports['default'] = Opener;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2JpbGx5Ly5hdG9tL3BhY2thZ2VzL2xhdGV4L2xpYi9vcGVuZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztvQkFFMkIsTUFBTTs7SUFFWixNQUFNO1lBQU4sTUFBTTs7V0FBTixNQUFNOzBCQUFOLE1BQU07OytCQUFOLE1BQU07OztlQUFOLE1BQU07OzZCQUNkLFdBQUMsUUFBUSxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsRUFBRTs7O1dBRXRCLGtDQUFHO0FBQ3hCLGFBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsOEJBQThCLENBQUMsQ0FBQTtLQUN2RDs7O1dBRU8saUJBQUMsUUFBUSxFQUFFO0FBQ2pCLGFBQU8sS0FBSyxDQUFBO0tBQ2I7OztXQUVVLHNCQUFHO0FBQ1osYUFBTyxLQUFLLENBQUE7S0FDYjs7O1dBRW1CLCtCQUFHO0FBQ3JCLGFBQU8sS0FBSyxDQUFBO0tBQ2I7OztTQWpCa0IsTUFBTTs7O3FCQUFOLE1BQU0iLCJmaWxlIjoiL2hvbWUvYmlsbHkvLmF0b20vcGFja2FnZXMvbGF0ZXgvbGliL29wZW5lci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBAYmFiZWwgKi9cblxuaW1wb3J0IHsgRGlzcG9zYWJsZSB9IGZyb20gJ2F0b20nXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE9wZW5lciBleHRlbmRzIERpc3Bvc2FibGUge1xuICBhc3luYyBvcGVuIChmaWxlUGF0aCwgdGV4UGF0aCwgbGluZU51bWJlcikge31cblxuICBzaG91bGRPcGVuSW5CYWNrZ3JvdW5kICgpIHtcbiAgICByZXR1cm4gYXRvbS5jb25maWcuZ2V0KCdsYXRleC5vcGVuUmVzdWx0SW5CYWNrZ3JvdW5kJylcbiAgfVxuXG4gIGNhbk9wZW4gKGZpbGVQYXRoKSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cblxuICBoYXNTeW5jdGV4ICgpIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuXG4gIGNhbk9wZW5JbkJhY2tncm91bmQgKCkge1xuICAgIHJldHVybiBmYWxzZVxuICB9XG59XG4iXX0=