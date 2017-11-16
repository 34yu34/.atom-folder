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

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

var _opener = require('../opener');

var _opener2 = _interopRequireDefault(_opener);

var OkularOpener = (function (_Opener) {
  _inherits(OkularOpener, _Opener);

  function OkularOpener() {
    _classCallCheck(this, OkularOpener);

    _get(Object.getPrototypeOf(OkularOpener.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(OkularOpener, [{
    key: 'open',
    value: _asyncToGenerator(function* (filePath, texPath, lineNumber) {
      var okularPath = atom.config.get('latex.okularPath');
      var uri = _url2['default'].format({
        protocol: 'file:',
        slashes: true,
        pathname: encodeURI(filePath),
        hash: encodeURI('src:' + lineNumber + ' ' + texPath)
      });
      var args = ['--unique', '"' + uri + '"'];
      if (this.shouldOpenInBackground()) args.unshift('--noraise');

      var command = '"' + okularPath + '" ' + args.join(' ');

      yield latex.process.executeChildProcess(command, { showError: true });
    })
  }, {
    key: 'canOpen',
    value: function canOpen(filePath) {
      return process.platform === 'linux' && _fsPlus2['default'].existsSync(atom.config.get('latex.okularPath'));
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

  return OkularOpener;
})(_opener2['default']);

exports['default'] = OkularOpener;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2JpbGx5Ly5hdG9tL3BhY2thZ2VzL2xhdGV4L2xpYi9vcGVuZXJzL29rdWxhci1vcGVuZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7O3NCQUVlLFNBQVM7Ozs7bUJBQ1IsS0FBSzs7OztzQkFDRixXQUFXOzs7O0lBRVQsWUFBWTtZQUFaLFlBQVk7O1dBQVosWUFBWTswQkFBWixZQUFZOzsrQkFBWixZQUFZOzs7ZUFBWixZQUFZOzs2QkFDcEIsV0FBQyxRQUFRLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRTtBQUN6QyxVQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFBO0FBQ3RELFVBQU0sR0FBRyxHQUFHLGlCQUFJLE1BQU0sQ0FBQztBQUNyQixnQkFBUSxFQUFFLE9BQU87QUFDakIsZUFBTyxFQUFFLElBQUk7QUFDYixnQkFBUSxFQUFFLFNBQVMsQ0FBQyxRQUFRLENBQUM7QUFDN0IsWUFBSSxFQUFFLFNBQVMsVUFBUSxVQUFVLFNBQUksT0FBTyxDQUFHO09BQ2hELENBQUMsQ0FBQTtBQUNGLFVBQU0sSUFBSSxHQUFHLENBQ1gsVUFBVSxRQUNOLEdBQUcsT0FDUixDQUFBO0FBQ0QsVUFBSSxJQUFJLENBQUMsc0JBQXNCLEVBQUUsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFBOztBQUU1RCxVQUFNLE9BQU8sU0FBTyxVQUFVLFVBQUssSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQUFBRSxDQUFBOztBQUVuRCxZQUFNLEtBQUssQ0FBQyxPQUFPLENBQUMsbUJBQW1CLENBQUMsT0FBTyxFQUFFLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUE7S0FDdEU7OztXQUVPLGlCQUFDLFFBQVEsRUFBRTtBQUNqQixhQUFPLE9BQU8sQ0FBQyxRQUFRLEtBQUssT0FBTyxJQUFJLG9CQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUE7S0FDMUY7OztXQUVVLHNCQUFHO0FBQ1osYUFBTyxJQUFJLENBQUE7S0FDWjs7O1dBRW1CLCtCQUFHO0FBQ3JCLGFBQU8sSUFBSSxDQUFBO0tBQ1o7OztTQTlCa0IsWUFBWTs7O3FCQUFaLFlBQVkiLCJmaWxlIjoiL2hvbWUvYmlsbHkvLmF0b20vcGFja2FnZXMvbGF0ZXgvbGliL29wZW5lcnMvb2t1bGFyLW9wZW5lci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBAYmFiZWwgKi9cblxuaW1wb3J0IGZzIGZyb20gJ2ZzLXBsdXMnXG5pbXBvcnQgdXJsIGZyb20gJ3VybCdcbmltcG9ydCBPcGVuZXIgZnJvbSAnLi4vb3BlbmVyJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBPa3VsYXJPcGVuZXIgZXh0ZW5kcyBPcGVuZXIge1xuICBhc3luYyBvcGVuIChmaWxlUGF0aCwgdGV4UGF0aCwgbGluZU51bWJlcikge1xuICAgIGNvbnN0IG9rdWxhclBhdGggPSBhdG9tLmNvbmZpZy5nZXQoJ2xhdGV4Lm9rdWxhclBhdGgnKVxuICAgIGNvbnN0IHVyaSA9IHVybC5mb3JtYXQoe1xuICAgICAgcHJvdG9jb2w6ICdmaWxlOicsXG4gICAgICBzbGFzaGVzOiB0cnVlLFxuICAgICAgcGF0aG5hbWU6IGVuY29kZVVSSShmaWxlUGF0aCksXG4gICAgICBoYXNoOiBlbmNvZGVVUkkoYHNyYzoke2xpbmVOdW1iZXJ9ICR7dGV4UGF0aH1gKVxuICAgIH0pXG4gICAgY29uc3QgYXJncyA9IFtcbiAgICAgICctLXVuaXF1ZScsXG4gICAgICBgXCIke3VyaX1cImBcbiAgICBdXG4gICAgaWYgKHRoaXMuc2hvdWxkT3BlbkluQmFja2dyb3VuZCgpKSBhcmdzLnVuc2hpZnQoJy0tbm9yYWlzZScpXG5cbiAgICBjb25zdCBjb21tYW5kID0gYFwiJHtva3VsYXJQYXRofVwiICR7YXJncy5qb2luKCcgJyl9YFxuXG4gICAgYXdhaXQgbGF0ZXgucHJvY2Vzcy5leGVjdXRlQ2hpbGRQcm9jZXNzKGNvbW1hbmQsIHsgc2hvd0Vycm9yOiB0cnVlIH0pXG4gIH1cblxuICBjYW5PcGVuIChmaWxlUGF0aCkge1xuICAgIHJldHVybiBwcm9jZXNzLnBsYXRmb3JtID09PSAnbGludXgnICYmIGZzLmV4aXN0c1N5bmMoYXRvbS5jb25maWcuZ2V0KCdsYXRleC5va3VsYXJQYXRoJykpXG4gIH1cblxuICBoYXNTeW5jdGV4ICgpIHtcbiAgICByZXR1cm4gdHJ1ZVxuICB9XG5cbiAgY2FuT3BlbkluQmFja2dyb3VuZCAoKSB7XG4gICAgcmV0dXJuIHRydWVcbiAgfVxufVxuIl19