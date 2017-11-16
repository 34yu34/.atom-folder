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

var PdfViewOpener = (function (_Opener) {
  _inherits(PdfViewOpener, _Opener);

  function PdfViewOpener() {
    _classCallCheck(this, PdfViewOpener);

    _get(Object.getPrototypeOf(PdfViewOpener.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(PdfViewOpener, [{
    key: 'open',
    value: _asyncToGenerator(function* (filePath, texPath, lineNumber) {
      var texPane = atom.workspace.paneForURI(texPath);
      var previousActivePane = atom.workspace.getActivePane();

      // This prevents splitting the right pane multiple times
      if (texPane) {
        texPane.activate();
      }

      var options = {
        searchAllPanes: true,
        split: atom.config.get('latex.pdfViewSplitDirection')
      };

      var item = yield atom.workspace.open(filePath, options);
      if (item && item.forwardSync) {
        item.forwardSync(texPath, lineNumber);
      }

      if (previousActivePane && this.shouldOpenInBackground()) {
        previousActivePane.activate();
      }

      return true;
    })
  }, {
    key: 'canOpen',
    value: function canOpen(filePath) {
      return (0, _werkzeug.isPdfFile)(filePath) && atom.packages.isPackageActive('pdf-view');
    }
  }]);

  return PdfViewOpener;
})(_opener2['default']);

exports['default'] = PdfViewOpener;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2JpbGx5Ly5hdG9tL3BhY2thZ2VzL2xhdGV4L2xpYi9vcGVuZXJzL3BkZi12aWV3LW9wZW5lci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7c0JBRW1CLFdBQVc7Ozs7d0JBQ0osYUFBYTs7SUFFbEIsYUFBYTtZQUFiLGFBQWE7O1dBQWIsYUFBYTswQkFBYixhQUFhOzsrQkFBYixhQUFhOzs7ZUFBYixhQUFhOzs2QkFDckIsV0FBQyxRQUFRLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRTtBQUN6QyxVQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQTtBQUNsRCxVQUFNLGtCQUFrQixHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBYSxFQUFFLENBQUE7OztBQUd6RCxVQUFJLE9BQU8sRUFBRTtBQUNYLGVBQU8sQ0FBQyxRQUFRLEVBQUUsQ0FBQTtPQUNuQjs7QUFFRCxVQUFNLE9BQU8sR0FBRztBQUNkLHNCQUFjLEVBQUUsSUFBSTtBQUNwQixhQUFLLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsNkJBQTZCLENBQUM7T0FDdEQsQ0FBQTs7QUFFRCxVQUFNLElBQUksR0FBRyxNQUFNLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQTtBQUN6RCxVQUFJLElBQUksSUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFO0FBQzVCLFlBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxFQUFFLFVBQVUsQ0FBQyxDQUFBO09BQ3RDOztBQUVELFVBQUksa0JBQWtCLElBQUksSUFBSSxDQUFDLHNCQUFzQixFQUFFLEVBQUU7QUFDdkQsMEJBQWtCLENBQUMsUUFBUSxFQUFFLENBQUE7T0FDOUI7O0FBRUQsYUFBTyxJQUFJLENBQUE7S0FDWjs7O1dBRU8saUJBQUMsUUFBUSxFQUFFO0FBQ2pCLGFBQU8seUJBQVUsUUFBUSxDQUFDLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUFDLENBQUE7S0FDeEU7OztTQTdCa0IsYUFBYTs7O3FCQUFiLGFBQWEiLCJmaWxlIjoiL2hvbWUvYmlsbHkvLmF0b20vcGFja2FnZXMvbGF0ZXgvbGliL29wZW5lcnMvcGRmLXZpZXctb3BlbmVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBiYWJlbCAqL1xuXG5pbXBvcnQgT3BlbmVyIGZyb20gJy4uL29wZW5lcidcbmltcG9ydCB7IGlzUGRmRmlsZSB9IGZyb20gJy4uL3dlcmt6ZXVnJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQZGZWaWV3T3BlbmVyIGV4dGVuZHMgT3BlbmVyIHtcbiAgYXN5bmMgb3BlbiAoZmlsZVBhdGgsIHRleFBhdGgsIGxpbmVOdW1iZXIpIHtcbiAgICBjb25zdCB0ZXhQYW5lID0gYXRvbS53b3Jrc3BhY2UucGFuZUZvclVSSSh0ZXhQYXRoKVxuICAgIGNvbnN0IHByZXZpb3VzQWN0aXZlUGFuZSA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVBhbmUoKVxuXG4gICAgLy8gVGhpcyBwcmV2ZW50cyBzcGxpdHRpbmcgdGhlIHJpZ2h0IHBhbmUgbXVsdGlwbGUgdGltZXNcbiAgICBpZiAodGV4UGFuZSkge1xuICAgICAgdGV4UGFuZS5hY3RpdmF0ZSgpXG4gICAgfVxuXG4gICAgY29uc3Qgb3B0aW9ucyA9IHtcbiAgICAgIHNlYXJjaEFsbFBhbmVzOiB0cnVlLFxuICAgICAgc3BsaXQ6IGF0b20uY29uZmlnLmdldCgnbGF0ZXgucGRmVmlld1NwbGl0RGlyZWN0aW9uJylcbiAgICB9XG5cbiAgICBjb25zdCBpdGVtID0gYXdhaXQgYXRvbS53b3Jrc3BhY2Uub3BlbihmaWxlUGF0aCwgb3B0aW9ucylcbiAgICBpZiAoaXRlbSAmJiBpdGVtLmZvcndhcmRTeW5jKSB7XG4gICAgICBpdGVtLmZvcndhcmRTeW5jKHRleFBhdGgsIGxpbmVOdW1iZXIpXG4gICAgfVxuXG4gICAgaWYgKHByZXZpb3VzQWN0aXZlUGFuZSAmJiB0aGlzLnNob3VsZE9wZW5JbkJhY2tncm91bmQoKSkge1xuICAgICAgcHJldmlvdXNBY3RpdmVQYW5lLmFjdGl2YXRlKClcbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZVxuICB9XG5cbiAgY2FuT3BlbiAoZmlsZVBhdGgpIHtcbiAgICByZXR1cm4gaXNQZGZGaWxlKGZpbGVQYXRoKSAmJiBhdG9tLnBhY2thZ2VzLmlzUGFja2FnZUFjdGl2ZSgncGRmLXZpZXcnKVxuICB9XG59XG4iXX0=