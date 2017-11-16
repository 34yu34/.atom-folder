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

var _fsPlus = require('fs-plus');

var _fsPlus2 = _interopRequireDefault(_fsPlus);

var _werkzeug = require('../werkzeug');

var _opener = require('../opener');

var _opener2 = _interopRequireDefault(_opener);

var SkimOpener = (function (_Opener) {
  _inherits(SkimOpener, _Opener);

  function SkimOpener() {
    _classCallCheck(this, SkimOpener);

    _get(Object.getPrototypeOf(SkimOpener.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(SkimOpener, [{
    key: 'open',
    value: _asyncToGenerator(function* (filePath, texPath, lineNumber) {
      var skimPath = atom.config.get('latex.skimPath');
      var shouldActivate = !this.shouldOpenInBackground();
      var command = (0, _werkzeug.heredoc)('\n      osascript -e       "\n      set theLine to \\"' + lineNumber + '\\" as integer\n      set theFile to POSIX file \\"' + filePath + '\\"\n      set theSource to POSIX file \\"' + texPath + '\\"\n      set thePath to POSIX path of (theFile as alias)\n      tell application \\"' + skimPath + '\\"\n        if ' + shouldActivate + ' then activate\n        try\n          set theDocs to get documents whose path is thePath\n          if (count of theDocs) > 0 then revert theDocs\n        end try\n        open theFile\n        tell front document to go to TeX line theLine from theSource\n      end tell\n      "\n      ');

      yield latex.process.executeChildProcess(command, { showError: true });
    })
  }, {
    key: 'canOpen',
    value: function canOpen(filePath) {
      return process.platform === 'darwin' && _fsPlus2['default'].existsSync(atom.config.get('latex.skimPath'));
    }
  }, {
    key: 'hasSynctex',
    value: function hasSynctex() {
      return true;
    }
  }, {
    key: 'canOpenInBackground',
    value: function canOpenInBackground() {
      return true;
    }
  }]);

  return SkimOpener;
})(_opener2['default']);

exports['default'] = SkimOpener;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2JpbGx5Ly5hdG9tL3BhY2thZ2VzL2xhdGV4L2xpYi9vcGVuZXJzL3NraW0tb3BlbmVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztzQkFFZSxTQUFTOzs7O3dCQUNBLGFBQWE7O3NCQUNsQixXQUFXOzs7O0lBRVQsVUFBVTtZQUFWLFVBQVU7O1dBQVYsVUFBVTswQkFBVixVQUFVOzsrQkFBVixVQUFVOzs7ZUFBVixVQUFVOzs2QkFDbEIsV0FBQyxRQUFRLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRTtBQUN6QyxVQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFBO0FBQ2xELFVBQU0sY0FBYyxHQUFHLENBQUMsSUFBSSxDQUFDLHNCQUFzQixFQUFFLENBQUE7QUFDckQsVUFBTSxPQUFPLEdBQUcsa0ZBR00sVUFBVSwyREFDQyxRQUFRLGtEQUNOLE9BQU8sOEZBRWxCLFFBQVEsd0JBQ3ZCLGNBQWMsc1NBU25CLENBQUE7O0FBRUosWUFBTSxLQUFLLENBQUMsT0FBTyxDQUFDLG1CQUFtQixDQUFDLE9BQU8sRUFBRSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFBO0tBQ3RFOzs7V0FFTyxpQkFBQyxRQUFRLEVBQUU7QUFDakIsYUFBTyxPQUFPLENBQUMsUUFBUSxLQUFLLFFBQVEsSUFBSSxvQkFBRyxVQUFVLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFBO0tBQ3pGOzs7V0FFVSxzQkFBRztBQUNaLGFBQU8sSUFBSSxDQUFBO0tBQ1o7OztXQUVtQiwrQkFBRztBQUNyQixhQUFPLElBQUksQ0FBQTtLQUNaOzs7U0FwQ2tCLFVBQVU7OztxQkFBVixVQUFVIiwiZmlsZSI6Ii9ob21lL2JpbGx5Ly5hdG9tL3BhY2thZ2VzL2xhdGV4L2xpYi9vcGVuZXJzL3NraW0tb3BlbmVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBiYWJlbCAqL1xuXG5pbXBvcnQgZnMgZnJvbSAnZnMtcGx1cydcbmltcG9ydCB7IGhlcmVkb2MgfSBmcm9tICcuLi93ZXJremV1ZydcbmltcG9ydCBPcGVuZXIgZnJvbSAnLi4vb3BlbmVyJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTa2ltT3BlbmVyIGV4dGVuZHMgT3BlbmVyIHtcbiAgYXN5bmMgb3BlbiAoZmlsZVBhdGgsIHRleFBhdGgsIGxpbmVOdW1iZXIpIHtcbiAgICBjb25zdCBza2ltUGF0aCA9IGF0b20uY29uZmlnLmdldCgnbGF0ZXguc2tpbVBhdGgnKVxuICAgIGNvbnN0IHNob3VsZEFjdGl2YXRlID0gIXRoaXMuc2hvdWxkT3BlbkluQmFja2dyb3VuZCgpXG4gICAgY29uc3QgY29tbWFuZCA9IGhlcmVkb2MoYFxuICAgICAgb3Nhc2NyaXB0IC1lIFxcXG4gICAgICBcIlxuICAgICAgc2V0IHRoZUxpbmUgdG8gXFxcXFwiJHtsaW5lTnVtYmVyfVxcXFxcIiBhcyBpbnRlZ2VyXG4gICAgICBzZXQgdGhlRmlsZSB0byBQT1NJWCBmaWxlIFxcXFxcIiR7ZmlsZVBhdGh9XFxcXFwiXG4gICAgICBzZXQgdGhlU291cmNlIHRvIFBPU0lYIGZpbGUgXFxcXFwiJHt0ZXhQYXRofVxcXFxcIlxuICAgICAgc2V0IHRoZVBhdGggdG8gUE9TSVggcGF0aCBvZiAodGhlRmlsZSBhcyBhbGlhcylcbiAgICAgIHRlbGwgYXBwbGljYXRpb24gXFxcXFwiJHtza2ltUGF0aH1cXFxcXCJcbiAgICAgICAgaWYgJHtzaG91bGRBY3RpdmF0ZX0gdGhlbiBhY3RpdmF0ZVxuICAgICAgICB0cnlcbiAgICAgICAgICBzZXQgdGhlRG9jcyB0byBnZXQgZG9jdW1lbnRzIHdob3NlIHBhdGggaXMgdGhlUGF0aFxuICAgICAgICAgIGlmIChjb3VudCBvZiB0aGVEb2NzKSA+IDAgdGhlbiByZXZlcnQgdGhlRG9jc1xuICAgICAgICBlbmQgdHJ5XG4gICAgICAgIG9wZW4gdGhlRmlsZVxuICAgICAgICB0ZWxsIGZyb250IGRvY3VtZW50IHRvIGdvIHRvIFRlWCBsaW5lIHRoZUxpbmUgZnJvbSB0aGVTb3VyY2VcbiAgICAgIGVuZCB0ZWxsXG4gICAgICBcIlxuICAgICAgYClcblxuICAgIGF3YWl0IGxhdGV4LnByb2Nlc3MuZXhlY3V0ZUNoaWxkUHJvY2Vzcyhjb21tYW5kLCB7IHNob3dFcnJvcjogdHJ1ZSB9KVxuICB9XG5cbiAgY2FuT3BlbiAoZmlsZVBhdGgpIHtcbiAgICByZXR1cm4gcHJvY2Vzcy5wbGF0Zm9ybSA9PT0gJ2RhcndpbicgJiYgZnMuZXhpc3RzU3luYyhhdG9tLmNvbmZpZy5nZXQoJ2xhdGV4LnNraW1QYXRoJykpXG4gIH1cblxuICBoYXNTeW5jdGV4ICgpIHtcbiAgICByZXR1cm4gdHJ1ZVxuICB9XG5cbiAgY2FuT3BlbkluQmFja2dyb3VuZCAoKSB7XG4gICAgcmV0dXJuIHRydWVcbiAgfVxufVxuIl19