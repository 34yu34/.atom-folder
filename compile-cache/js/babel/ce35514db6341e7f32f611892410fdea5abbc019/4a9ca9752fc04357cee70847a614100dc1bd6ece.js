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

var CustomOpener = (function (_Opener) {
  _inherits(CustomOpener, _Opener);

  function CustomOpener() {
    _classCallCheck(this, CustomOpener);

    _get(Object.getPrototypeOf(CustomOpener.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(CustomOpener, [{
    key: 'open',

    // Custom PDF viewer does not support texPath and lineNumber.
    value: _asyncToGenerator(function* (filePath, texPath, lineNumber) {
      var command = '"' + atom.config.get('latex.viewerPath') + '" "' + filePath + '"';

      yield latex.process.executeChildProcess(command, { showError: true });
    })
  }, {
    key: 'canOpen',
    value: function canOpen(filePath) {
      return (0, _werkzeug.isPdfFile)(filePath) && _fsPlus2['default'].existsSync(atom.config.get('latex.viewerPath'));
    }
  }]);

  return CustomOpener;
})(_opener2['default']);

exports['default'] = CustomOpener;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2JpbGx5Ly5hdG9tL3BhY2thZ2VzL2xhdGV4L2xpYi9vcGVuZXJzL2N1c3RvbS1vcGVuZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7O3NCQUVlLFNBQVM7Ozs7c0JBQ0wsV0FBVzs7Ozt3QkFDSixhQUFhOztJQUVsQixZQUFZO1lBQVosWUFBWTs7V0FBWixZQUFZOzBCQUFaLFlBQVk7OytCQUFaLFlBQVk7OztlQUFaLFlBQVk7Ozs7NkJBRXBCLFdBQUMsUUFBUSxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUU7QUFDekMsVUFBTSxPQUFPLFNBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLENBQUMsV0FBTSxRQUFRLE1BQUcsQ0FBQTs7QUFFeEUsWUFBTSxLQUFLLENBQUMsT0FBTyxDQUFDLG1CQUFtQixDQUFDLE9BQU8sRUFBRSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFBO0tBQ3RFOzs7V0FFTyxpQkFBQyxRQUFRLEVBQUU7QUFDakIsYUFBTyx5QkFBVSxRQUFRLENBQUMsSUFBSSxvQkFBRyxVQUFVLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFBO0tBQ2pGOzs7U0FWa0IsWUFBWTs7O3FCQUFaLFlBQVkiLCJmaWxlIjoiL2hvbWUvYmlsbHkvLmF0b20vcGFja2FnZXMvbGF0ZXgvbGliL29wZW5lcnMvY3VzdG9tLW9wZW5lci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBAYmFiZWwgKi9cblxuaW1wb3J0IGZzIGZyb20gJ2ZzLXBsdXMnXG5pbXBvcnQgT3BlbmVyIGZyb20gJy4uL29wZW5lcidcbmltcG9ydCB7IGlzUGRmRmlsZSB9IGZyb20gJy4uL3dlcmt6ZXVnJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDdXN0b21PcGVuZXIgZXh0ZW5kcyBPcGVuZXIge1xuICAvLyBDdXN0b20gUERGIHZpZXdlciBkb2VzIG5vdCBzdXBwb3J0IHRleFBhdGggYW5kIGxpbmVOdW1iZXIuXG4gIGFzeW5jIG9wZW4gKGZpbGVQYXRoLCB0ZXhQYXRoLCBsaW5lTnVtYmVyKSB7XG4gICAgY29uc3QgY29tbWFuZCA9IGBcIiR7YXRvbS5jb25maWcuZ2V0KCdsYXRleC52aWV3ZXJQYXRoJyl9XCIgXCIke2ZpbGVQYXRofVwiYFxuXG4gICAgYXdhaXQgbGF0ZXgucHJvY2Vzcy5leGVjdXRlQ2hpbGRQcm9jZXNzKGNvbW1hbmQsIHsgc2hvd0Vycm9yOiB0cnVlIH0pXG4gIH1cblxuICBjYW5PcGVuIChmaWxlUGF0aCkge1xuICAgIHJldHVybiBpc1BkZkZpbGUoZmlsZVBhdGgpICYmIGZzLmV4aXN0c1N5bmMoYXRvbS5jb25maWcuZ2V0KCdsYXRleC52aWV3ZXJQYXRoJykpXG4gIH1cbn1cbiJdfQ==