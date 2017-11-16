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

function forwardSync(pdfView, texPath, lineNumber) {
  if (pdfView != null && pdfView.forwardSync != null) {
    pdfView.forwardSync(texPath, lineNumber);
  }
}

var PdfViewOpener = (function (_Opener) {
  _inherits(PdfViewOpener, _Opener);

  function PdfViewOpener() {
    _classCallCheck(this, PdfViewOpener);

    _get(Object.getPrototypeOf(PdfViewOpener.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(PdfViewOpener, [{
    key: 'open',
    value: _asyncToGenerator(function* (filePath, texPath, lineNumber) {
      var openPaneItems = atom.workspace.getPaneItems();
      for (var openPaneItem of openPaneItems) {
        if (openPaneItem.filePath === filePath) {
          forwardSync(openPaneItem, texPath, lineNumber);
          return true;
        }
      }

      // TODO: Make this configurable?
      atom.workspace.open(filePath, { 'split': 'right' }).then(function (pane) {
        return forwardSync(pane, texPath, lineNumber);
      });

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2JpbGx5Ly5hdG9tL3BhY2thZ2VzL2xhdGV4L2xpYi9vcGVuZXJzL3BkZi12aWV3LW9wZW5lci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7c0JBRW1CLFdBQVc7Ozs7d0JBQ0osYUFBYTs7QUFFdkMsU0FBUyxXQUFXLENBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUU7QUFDbEQsTUFBSSxPQUFPLElBQUksSUFBSSxJQUFJLE9BQU8sQ0FBQyxXQUFXLElBQUksSUFBSSxFQUFFO0FBQ2xELFdBQU8sQ0FBQyxXQUFXLENBQUMsT0FBTyxFQUFFLFVBQVUsQ0FBQyxDQUFBO0dBQ3pDO0NBQ0Y7O0lBRW9CLGFBQWE7WUFBYixhQUFhOztXQUFiLGFBQWE7MEJBQWIsYUFBYTs7K0JBQWIsYUFBYTs7O2VBQWIsYUFBYTs7NkJBQ3JCLFdBQUMsUUFBUSxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUU7QUFDekMsVUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxZQUFZLEVBQUUsQ0FBQTtBQUNuRCxXQUFLLElBQU0sWUFBWSxJQUFJLGFBQWEsRUFBRTtBQUN4QyxZQUFJLFlBQVksQ0FBQyxRQUFRLEtBQUssUUFBUSxFQUFFO0FBQ3RDLHFCQUFXLENBQUMsWUFBWSxFQUFFLE9BQU8sRUFBRSxVQUFVLENBQUMsQ0FBQTtBQUM5QyxpQkFBTyxJQUFJLENBQUE7U0FDWjtPQUNGOzs7QUFHRCxVQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsRUFBQyxPQUFPLEVBQUUsT0FBTyxFQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQSxJQUFJO2VBQUksV0FBVyxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsVUFBVSxDQUFDO09BQUEsQ0FBQyxDQUFBOztBQUV0RyxhQUFPLElBQUksQ0FBQTtLQUNaOzs7V0FFTyxpQkFBQyxRQUFRLEVBQUU7QUFDakIsYUFBTyx5QkFBVSxRQUFRLENBQUMsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxVQUFVLENBQUMsQ0FBQTtLQUN4RTs7O1NBbEJrQixhQUFhOzs7cUJBQWIsYUFBYSIsImZpbGUiOiIvaG9tZS9iaWxseS8uYXRvbS9wYWNrYWdlcy9sYXRleC9saWIvb3BlbmVycy9wZGYtdmlldy1vcGVuZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiogQGJhYmVsICovXG5cbmltcG9ydCBPcGVuZXIgZnJvbSAnLi4vb3BlbmVyJ1xuaW1wb3J0IHsgaXNQZGZGaWxlIH0gZnJvbSAnLi4vd2Vya3pldWcnXG5cbmZ1bmN0aW9uIGZvcndhcmRTeW5jIChwZGZWaWV3LCB0ZXhQYXRoLCBsaW5lTnVtYmVyKSB7XG4gIGlmIChwZGZWaWV3ICE9IG51bGwgJiYgcGRmVmlldy5mb3J3YXJkU3luYyAhPSBudWxsKSB7XG4gICAgcGRmVmlldy5mb3J3YXJkU3luYyh0ZXhQYXRoLCBsaW5lTnVtYmVyKVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBkZlZpZXdPcGVuZXIgZXh0ZW5kcyBPcGVuZXIge1xuICBhc3luYyBvcGVuIChmaWxlUGF0aCwgdGV4UGF0aCwgbGluZU51bWJlcikge1xuICAgIGNvbnN0IG9wZW5QYW5lSXRlbXMgPSBhdG9tLndvcmtzcGFjZS5nZXRQYW5lSXRlbXMoKVxuICAgIGZvciAoY29uc3Qgb3BlblBhbmVJdGVtIG9mIG9wZW5QYW5lSXRlbXMpIHtcbiAgICAgIGlmIChvcGVuUGFuZUl0ZW0uZmlsZVBhdGggPT09IGZpbGVQYXRoKSB7XG4gICAgICAgIGZvcndhcmRTeW5jKG9wZW5QYW5lSXRlbSwgdGV4UGF0aCwgbGluZU51bWJlcilcbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBUT0RPOiBNYWtlIHRoaXMgY29uZmlndXJhYmxlP1xuICAgIGF0b20ud29ya3NwYWNlLm9wZW4oZmlsZVBhdGgsIHsnc3BsaXQnOiAncmlnaHQnfSkudGhlbihwYW5lID0+IGZvcndhcmRTeW5jKHBhbmUsIHRleFBhdGgsIGxpbmVOdW1iZXIpKVxuXG4gICAgcmV0dXJuIHRydWVcbiAgfVxuXG4gIGNhbk9wZW4gKGZpbGVQYXRoKSB7XG4gICAgcmV0dXJuIGlzUGRmRmlsZShmaWxlUGF0aCkgJiYgYXRvbS5wYWNrYWdlcy5pc1BhY2thZ2VBY3RpdmUoJ3BkZi12aWV3JylcbiAgfVxufVxuIl19