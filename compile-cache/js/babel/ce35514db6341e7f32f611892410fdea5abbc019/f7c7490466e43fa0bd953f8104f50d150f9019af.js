Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/** @babel */

var _opener = require('../opener');

var _opener2 = _interopRequireDefault(_opener);

var ShellOpenOpener = (function (_Opener) {
  _inherits(ShellOpenOpener, _Opener);

  function ShellOpenOpener() {
    _classCallCheck(this, ShellOpenOpener);

    _get(Object.getPrototypeOf(ShellOpenOpener.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(ShellOpenOpener, [{
    key: 'open',

    // shell open does not support texPath and lineNumber.
    value: _asyncToGenerator(function* (filePath, texPath, lineNumber) {
      var command = '"' + filePath + '"';

      yield latex.process.executeChildProcess(command, { showError: true });
    })
  }, {
    key: 'canOpen',
    value: function canOpen(filePath) {
      return process.platform === 'win32';
    }
  }]);

  return ShellOpenOpener;
})(_opener2['default']);

exports['default'] = ShellOpenOpener;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2JpbGx5Ly5hdG9tL3BhY2thZ2VzL2xhdGV4L2xpYi9vcGVuZXJzL3NoZWxsLW9wZW4tb3BlbmVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztzQkFFbUIsV0FBVzs7OztJQUVULGVBQWU7WUFBZixlQUFlOztXQUFmLGVBQWU7MEJBQWYsZUFBZTs7K0JBQWYsZUFBZTs7O2VBQWYsZUFBZTs7Ozs2QkFFdkIsV0FBQyxRQUFRLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRTtBQUN6QyxVQUFNLE9BQU8sU0FBTyxRQUFRLE1BQUcsQ0FBQTs7QUFFL0IsWUFBTSxLQUFLLENBQUMsT0FBTyxDQUFDLG1CQUFtQixDQUFDLE9BQU8sRUFBRSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFBO0tBQ3RFOzs7V0FFTyxpQkFBQyxRQUFRLEVBQUU7QUFDakIsYUFBTyxPQUFPLENBQUMsUUFBUSxLQUFLLE9BQU8sQ0FBQTtLQUNwQzs7O1NBVmtCLGVBQWU7OztxQkFBZixlQUFlIiwiZmlsZSI6Ii9ob21lL2JpbGx5Ly5hdG9tL3BhY2thZ2VzL2xhdGV4L2xpYi9vcGVuZXJzL3NoZWxsLW9wZW4tb3BlbmVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBiYWJlbCAqL1xuXG5pbXBvcnQgT3BlbmVyIGZyb20gJy4uL29wZW5lcidcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2hlbGxPcGVuT3BlbmVyIGV4dGVuZHMgT3BlbmVyIHtcbiAgLy8gc2hlbGwgb3BlbiBkb2VzIG5vdCBzdXBwb3J0IHRleFBhdGggYW5kIGxpbmVOdW1iZXIuXG4gIGFzeW5jIG9wZW4gKGZpbGVQYXRoLCB0ZXhQYXRoLCBsaW5lTnVtYmVyKSB7XG4gICAgY29uc3QgY29tbWFuZCA9IGBcIiR7ZmlsZVBhdGh9XCJgXG5cbiAgICBhd2FpdCBsYXRleC5wcm9jZXNzLmV4ZWN1dGVDaGlsZFByb2Nlc3MoY29tbWFuZCwgeyBzaG93RXJyb3I6IHRydWUgfSlcbiAgfVxuXG4gIGNhbk9wZW4gKGZpbGVQYXRoKSB7XG4gICAgcmV0dXJuIHByb2Nlc3MucGxhdGZvcm0gPT09ICd3aW4zMidcbiAgfVxufVxuIl19