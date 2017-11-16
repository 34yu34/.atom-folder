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

var _werkzeug = require('../werkzeug');

var PreviewOpener = (function (_Opener) {
  _inherits(PreviewOpener, _Opener);

  function PreviewOpener() {
    _classCallCheck(this, PreviewOpener);

    _get(Object.getPrototypeOf(PreviewOpener.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(PreviewOpener, [{
    key: 'open',
    value: _asyncToGenerator(function* (filePath, texPath, lineNumber) {
      var command = 'open -g -a Preview.app "' + filePath + '"';
      if (!this.shouldOpenInBackground()) {
        command = command.replace(/-g\s/, '');
      }

      yield latex.process.executeChildProcess(command, { showError: true });
    })
  }, {
    key: 'canOpen',
    value: function canOpen(filePath) {
      return process.platform === 'darwin' && ((0, _werkzeug.isPdfFile)(filePath) || (0, _werkzeug.isPsFile)(filePath));
    }
  }, {
    key: 'canOpenInBackground',
    value: function canOpenInBackground() {
      return true;
    }
  }]);

  return PreviewOpener;
})(_opener2['default']);

exports['default'] = PreviewOpener;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2JpbGx5Ly5hdG9tL3BhY2thZ2VzL2xhdGV4L2xpYi9vcGVuZXJzL3ByZXZpZXctb3BlbmVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztzQkFFbUIsV0FBVzs7Ozt3QkFDTSxhQUFhOztJQUU1QixhQUFhO1lBQWIsYUFBYTs7V0FBYixhQUFhOzBCQUFiLGFBQWE7OytCQUFiLGFBQWE7OztlQUFiLGFBQWE7OzZCQUNyQixXQUFDLFFBQVEsRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFO0FBQ3pDLFVBQUksT0FBTyxnQ0FBOEIsUUFBUSxNQUFHLENBQUE7QUFDcEQsVUFBSSxDQUFDLElBQUksQ0FBQyxzQkFBc0IsRUFBRSxFQUFFO0FBQ2xDLGVBQU8sR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsQ0FBQTtPQUN0Qzs7QUFFRCxZQUFNLEtBQUssQ0FBQyxPQUFPLENBQUMsbUJBQW1CLENBQUMsT0FBTyxFQUFFLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUE7S0FDdEU7OztXQUVPLGlCQUFDLFFBQVEsRUFBRTtBQUNqQixhQUFPLE9BQU8sQ0FBQyxRQUFRLEtBQUssUUFBUSxLQUFLLHlCQUFVLFFBQVEsQ0FBQyxJQUFJLHdCQUFTLFFBQVEsQ0FBQyxDQUFBLEFBQUMsQ0FBQTtLQUNwRjs7O1dBRW1CLCtCQUFHO0FBQ3JCLGFBQU8sSUFBSSxDQUFBO0tBQ1o7OztTQWhCa0IsYUFBYTs7O3FCQUFiLGFBQWEiLCJmaWxlIjoiL2hvbWUvYmlsbHkvLmF0b20vcGFja2FnZXMvbGF0ZXgvbGliL29wZW5lcnMvcHJldmlldy1vcGVuZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiogQGJhYmVsICovXG5cbmltcG9ydCBPcGVuZXIgZnJvbSAnLi4vb3BlbmVyJ1xuaW1wb3J0IHsgaXNQZGZGaWxlLCBpc1BzRmlsZSB9IGZyb20gJy4uL3dlcmt6ZXVnJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQcmV2aWV3T3BlbmVyIGV4dGVuZHMgT3BlbmVyIHtcbiAgYXN5bmMgb3BlbiAoZmlsZVBhdGgsIHRleFBhdGgsIGxpbmVOdW1iZXIpIHtcbiAgICBsZXQgY29tbWFuZCA9IGBvcGVuIC1nIC1hIFByZXZpZXcuYXBwIFwiJHtmaWxlUGF0aH1cImBcbiAgICBpZiAoIXRoaXMuc2hvdWxkT3BlbkluQmFja2dyb3VuZCgpKSB7XG4gICAgICBjb21tYW5kID0gY29tbWFuZC5yZXBsYWNlKC8tZ1xccy8sICcnKVxuICAgIH1cblxuICAgIGF3YWl0IGxhdGV4LnByb2Nlc3MuZXhlY3V0ZUNoaWxkUHJvY2Vzcyhjb21tYW5kLCB7IHNob3dFcnJvcjogdHJ1ZSB9KVxuICB9XG5cbiAgY2FuT3BlbiAoZmlsZVBhdGgpIHtcbiAgICByZXR1cm4gcHJvY2Vzcy5wbGF0Zm9ybSA9PT0gJ2RhcndpbicgJiYgKGlzUGRmRmlsZShmaWxlUGF0aCkgfHwgaXNQc0ZpbGUoZmlsZVBhdGgpKVxuICB9XG5cbiAgY2FuT3BlbkluQmFja2dyb3VuZCAoKSB7XG4gICAgcmV0dXJuIHRydWVcbiAgfVxufVxuIl19