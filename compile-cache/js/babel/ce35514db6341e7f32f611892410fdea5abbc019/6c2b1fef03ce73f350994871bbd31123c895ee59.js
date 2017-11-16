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

var ZathuraOpener = (function (_Opener) {
  _inherits(ZathuraOpener, _Opener);

  function ZathuraOpener() {
    _classCallCheck(this, ZathuraOpener);

    _get(Object.getPrototypeOf(ZathuraOpener.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(ZathuraOpener, [{
    key: 'open',
    value: _asyncToGenerator(function* (filePath, texPath, lineNumber) {
      var zathuraPath = atom.config.get('latex.zathuraPath');
      var atomPath = process.argv[0];
      var args = ['--synctex-editor-command="\\"' + atomPath + '\\" \\"%{input}:%{line}\\""', '--synctex-forward="' + lineNumber + ':1:' + texPath + '"', '"' + filePath + '"'];
      var command = '"' + zathuraPath + '" ' + args.join(' ');
      yield latex.process.executeChildProcess(command, { showError: true });
    })
  }, {
    key: 'canOpen',
    value: function canOpen(filePath) {
      return process.platform === 'linux' && ((0, _werkzeug.isPdfFile)(filePath) || (0, _werkzeug.isPsFile)(filePath)) && _fsPlus2['default'].existsSync(atom.config.get('latex.zathuraPath'));
    }
  }, {
    key: 'hasSynctex',
    value: function hasSynctex() {
      return true;
    }
  }]);

  return ZathuraOpener;
})(_opener2['default']);

exports['default'] = ZathuraOpener;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2JpbGx5Ly5hdG9tL3BhY2thZ2VzL2xhdGV4L2xpYi9vcGVuZXJzL3phdGh1cmEtb3BlbmVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztzQkFFZSxTQUFTOzs7O3NCQUNMLFdBQVc7Ozs7d0JBQ00sYUFBYTs7SUFFNUIsYUFBYTtZQUFiLGFBQWE7O1dBQWIsYUFBYTswQkFBYixhQUFhOzsrQkFBYixhQUFhOzs7ZUFBYixhQUFhOzs2QkFDckIsV0FBQyxRQUFRLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRTtBQUN6QyxVQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFBO0FBQ3hELFVBQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDaEMsVUFBTSxJQUFJLEdBQUcsbUNBQ3FCLFFBQVEsMERBQ2xCLFVBQVUsV0FBTSxPQUFPLGNBQ3pDLFFBQVEsT0FDYixDQUFBO0FBQ0QsVUFBTSxPQUFPLFNBQU8sV0FBVyxVQUFLLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEFBQUUsQ0FBQTtBQUNwRCxZQUFNLEtBQUssQ0FBQyxPQUFPLENBQUMsbUJBQW1CLENBQUMsT0FBTyxFQUFFLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUE7S0FDdEU7OztXQUVPLGlCQUFDLFFBQVEsRUFBRTtBQUNqQixhQUFPLE9BQU8sQ0FBQyxRQUFRLEtBQUssT0FBTyxLQUNoQyx5QkFBVSxRQUFRLENBQUMsSUFBSSx3QkFBUyxRQUFRLENBQUMsQ0FBQSxBQUFDLElBQzNDLG9CQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUE7S0FDdEQ7OztXQUVVLHNCQUFHO0FBQ1osYUFBTyxJQUFJLENBQUE7S0FDWjs7O1NBckJrQixhQUFhOzs7cUJBQWIsYUFBYSIsImZpbGUiOiIvaG9tZS9iaWxseS8uYXRvbS9wYWNrYWdlcy9sYXRleC9saWIvb3BlbmVycy96YXRodXJhLW9wZW5lci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBAYmFiZWwgKi9cblxuaW1wb3J0IGZzIGZyb20gJ2ZzLXBsdXMnXG5pbXBvcnQgT3BlbmVyIGZyb20gJy4uL29wZW5lcidcbmltcG9ydCB7IGlzUGRmRmlsZSwgaXNQc0ZpbGUgfSBmcm9tICcuLi93ZXJremV1ZydcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgWmF0aHVyYU9wZW5lciBleHRlbmRzIE9wZW5lciB7XG4gIGFzeW5jIG9wZW4gKGZpbGVQYXRoLCB0ZXhQYXRoLCBsaW5lTnVtYmVyKSB7XG4gICAgY29uc3QgemF0aHVyYVBhdGggPSBhdG9tLmNvbmZpZy5nZXQoJ2xhdGV4LnphdGh1cmFQYXRoJylcbiAgICBjb25zdCBhdG9tUGF0aCA9IHByb2Nlc3MuYXJndlswXVxuICAgIGNvbnN0IGFyZ3MgPSBbXG4gICAgICBgLS1zeW5jdGV4LWVkaXRvci1jb21tYW5kPVwiXFxcXFwiJHthdG9tUGF0aH1cXFxcXCIgXFxcXFwiJXtpbnB1dH06JXtsaW5lfVxcXFxcIlwiYCxcbiAgICAgIGAtLXN5bmN0ZXgtZm9yd2FyZD1cIiR7bGluZU51bWJlcn06MToke3RleFBhdGh9XCJgLFxuICAgICAgYFwiJHtmaWxlUGF0aH1cImBcbiAgICBdXG4gICAgY29uc3QgY29tbWFuZCA9IGBcIiR7emF0aHVyYVBhdGh9XCIgJHthcmdzLmpvaW4oJyAnKX1gXG4gICAgYXdhaXQgbGF0ZXgucHJvY2Vzcy5leGVjdXRlQ2hpbGRQcm9jZXNzKGNvbW1hbmQsIHsgc2hvd0Vycm9yOiB0cnVlIH0pXG4gIH1cblxuICBjYW5PcGVuIChmaWxlUGF0aCkge1xuICAgIHJldHVybiBwcm9jZXNzLnBsYXRmb3JtID09PSAnbGludXgnICYmXG4gICAgICAoaXNQZGZGaWxlKGZpbGVQYXRoKSB8fCBpc1BzRmlsZShmaWxlUGF0aCkpICYmXG4gICAgICBmcy5leGlzdHNTeW5jKGF0b20uY29uZmlnLmdldCgnbGF0ZXguemF0aHVyYVBhdGgnKSlcbiAgfVxuXG4gIGhhc1N5bmN0ZXggKCkge1xuICAgIHJldHVybiB0cnVlXG4gIH1cbn1cbiJdfQ==