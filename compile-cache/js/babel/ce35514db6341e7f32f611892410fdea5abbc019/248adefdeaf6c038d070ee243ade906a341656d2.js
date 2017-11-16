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

var _opener = require('../opener');

var _opener2 = _interopRequireDefault(_opener);

var _werkzeug = require('../werkzeug');

var SumatraOpener = (function (_Opener) {
  _inherits(SumatraOpener, _Opener);

  function SumatraOpener() {
    _classCallCheck(this, SumatraOpener);

    _get(Object.getPrototypeOf(SumatraOpener.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(SumatraOpener, [{
    key: 'open',
    value: _asyncToGenerator(function* (filePath, texPath, lineNumber) {
      var sumatraPath = '"' + atom.config.get('latex.sumatraPath') + '"';
      var atomPath = process.argv[0];
      var args = ['-reuse-instance', '-forward-search', '"' + texPath + '"', lineNumber, '-inverse-search', '"\\"' + atomPath + '\\" \\"%f:%l\\""', '"' + filePath + '"'];

      var command = sumatraPath + ' ' + args.join(' ');

      yield latex.process.executeChildProcess(command);
    })
  }, {
    key: 'canOpen',
    value: function canOpen(filePath) {
      return process.platform === 'win32' && (0, _werkzeug.isPdfFile)(filePath) && _fsPlus2['default'].existsSync(atom.config.get('latex.sumatraPath'));
    }
  }, {
    key: 'hasSynctex',
    value: function hasSynctex() {
      return true;
    }
  }]);

  return SumatraOpener;
})(_opener2['default']);

exports['default'] = SumatraOpener;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2JpbGx5Ly5hdG9tL3BhY2thZ2VzL2xhdGV4L2xpYi9vcGVuZXJzL3N1bWF0cmEtb3BlbmVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztzQkFFZSxTQUFTOzs7O3NCQUNMLFdBQVc7Ozs7d0JBQ0osYUFBYTs7SUFFbEIsYUFBYTtZQUFiLGFBQWE7O1dBQWIsYUFBYTswQkFBYixhQUFhOzsrQkFBYixhQUFhOzs7ZUFBYixhQUFhOzs2QkFDckIsV0FBQyxRQUFRLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRTtBQUN6QyxVQUFNLFdBQVcsU0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxNQUFHLENBQUE7QUFDL0QsVUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUNoQyxVQUFNLElBQUksR0FBRyxDQUNYLGlCQUFpQixFQUNqQixpQkFBaUIsUUFDYixPQUFPLFFBQ1gsVUFBVSxFQUNWLGlCQUFpQixXQUNWLFFBQVEsNkJBQ1gsUUFBUSxPQUNiLENBQUE7O0FBRUQsVUFBTSxPQUFPLEdBQU0sV0FBVyxTQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEFBQUUsQ0FBQTs7QUFFbEQsWUFBTSxLQUFLLENBQUMsT0FBTyxDQUFDLG1CQUFtQixDQUFDLE9BQU8sQ0FBQyxDQUFBO0tBQ2pEOzs7V0FFTyxpQkFBQyxRQUFRLEVBQUU7QUFDakIsYUFBTyxPQUFPLENBQUMsUUFBUSxLQUFLLE9BQU8sSUFBSSx5QkFBVSxRQUFRLENBQUMsSUFDeEQsb0JBQUcsVUFBVSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQTtLQUN0RDs7O1dBRVUsc0JBQUc7QUFDWixhQUFPLElBQUksQ0FBQTtLQUNaOzs7U0ExQmtCLGFBQWE7OztxQkFBYixhQUFhIiwiZmlsZSI6Ii9ob21lL2JpbGx5Ly5hdG9tL3BhY2thZ2VzL2xhdGV4L2xpYi9vcGVuZXJzL3N1bWF0cmEtb3BlbmVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBiYWJlbCAqL1xuXG5pbXBvcnQgZnMgZnJvbSAnZnMtcGx1cydcbmltcG9ydCBPcGVuZXIgZnJvbSAnLi4vb3BlbmVyJ1xuaW1wb3J0IHsgaXNQZGZGaWxlIH0gZnJvbSAnLi4vd2Vya3pldWcnXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFN1bWF0cmFPcGVuZXIgZXh0ZW5kcyBPcGVuZXIge1xuICBhc3luYyBvcGVuIChmaWxlUGF0aCwgdGV4UGF0aCwgbGluZU51bWJlcikge1xuICAgIGNvbnN0IHN1bWF0cmFQYXRoID0gYFwiJHthdG9tLmNvbmZpZy5nZXQoJ2xhdGV4LnN1bWF0cmFQYXRoJyl9XCJgXG4gICAgY29uc3QgYXRvbVBhdGggPSBwcm9jZXNzLmFyZ3ZbMF1cbiAgICBjb25zdCBhcmdzID0gW1xuICAgICAgJy1yZXVzZS1pbnN0YW5jZScsXG4gICAgICAnLWZvcndhcmQtc2VhcmNoJyxcbiAgICAgIGBcIiR7dGV4UGF0aH1cImAsXG4gICAgICBsaW5lTnVtYmVyLFxuICAgICAgJy1pbnZlcnNlLXNlYXJjaCcsXG4gICAgICBgXCJcXFxcXCIke2F0b21QYXRofVxcXFxcIiBcXFxcXCIlZjolbFxcXFxcIlwiYCxcbiAgICAgIGBcIiR7ZmlsZVBhdGh9XCJgXG4gICAgXVxuXG4gICAgY29uc3QgY29tbWFuZCA9IGAke3N1bWF0cmFQYXRofSAke2FyZ3Muam9pbignICcpfWBcblxuICAgIGF3YWl0IGxhdGV4LnByb2Nlc3MuZXhlY3V0ZUNoaWxkUHJvY2Vzcyhjb21tYW5kKVxuICB9XG5cbiAgY2FuT3BlbiAoZmlsZVBhdGgpIHtcbiAgICByZXR1cm4gcHJvY2Vzcy5wbGF0Zm9ybSA9PT0gJ3dpbjMyJyAmJiBpc1BkZkZpbGUoZmlsZVBhdGgpICYmXG4gICAgICBmcy5leGlzdHNTeW5jKGF0b20uY29uZmlnLmdldCgnbGF0ZXguc3VtYXRyYVBhdGgnKSlcbiAgfVxuXG4gIGhhc1N5bmN0ZXggKCkge1xuICAgIHJldHVybiB0cnVlXG4gIH1cbn1cbiJdfQ==