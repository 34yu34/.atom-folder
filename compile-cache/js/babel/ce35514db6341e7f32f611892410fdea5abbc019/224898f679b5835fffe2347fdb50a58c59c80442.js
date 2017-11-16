Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

/** @babel */
/** @jsx etch.dom */

var _etch = require('etch');

var _etch2 = _interopRequireDefault(_etch);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var FileReference = (function () {
  function FileReference() {
    var properties = arguments.length <= 0 || arguments[0] === undefined ? { type: 'error' } : arguments[0];

    _classCallCheck(this, FileReference);

    this.properties = properties;
    _etch2['default'].initialize(this);
  }

  _createClass(FileReference, [{
    key: 'destroy',
    value: _asyncToGenerator(function* () {
      yield _etch2['default'].destroy(this);
    })
  }, {
    key: 'render',
    value: function render() {
      var _properties = this.properties;
      var file = _properties.file;
      var range = _properties.range;

      if (!file) return _etch2['default'].dom('span', null);

      var endLineReference = range && range[0][0] !== range[1][0] ? '–' + (range[1][0] + 1) : '';
      var lineReference = range ? ' (' + (range[0][0] + 1) + endLineReference + ')' : '';
      var text = _path2['default'].basename(file);
      var clickHandler = function clickHandler() {
        atom.workspace.open(file, { initialLine: range ? range[0][0] : 0 });
      };

      return _etch2['default'].dom(
        'a',
        { className: 'latex-file-reference', href: '#', onclick: clickHandler },
        text,
        lineReference
      );
    }
  }, {
    key: 'update',
    value: function update(properties) {
      this.properties = properties;
      return _etch2['default'].update(this);
    }
  }]);

  return FileReference;
})();

exports['default'] = FileReference;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2JpbGx5Ly5hdG9tL3BhY2thZ2VzL2xhdGV4L2xpYi92aWV3cy9maWxlLXJlZmVyZW5jZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7b0JBR2lCLE1BQU07Ozs7b0JBQ04sTUFBTTs7OztJQUVGLGFBQWE7QUFDcEIsV0FETyxhQUFhLEdBQ2E7UUFBaEMsVUFBVSx5REFBRyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUU7OzBCQUR4QixhQUFhOztBQUU5QixRQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQTtBQUM1QixzQkFBSyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUE7R0FDdEI7O2VBSmtCLGFBQWE7OzZCQU1sQixhQUFHO0FBQ2YsWUFBTSxrQkFBSyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUE7S0FDekI7OztXQUVNLGtCQUFHO3dCQUNnQixJQUFJLENBQUMsVUFBVTtVQUEvQixJQUFJLGVBQUosSUFBSTtVQUFFLEtBQUssZUFBTCxLQUFLOztBQUVuQixVQUFJLENBQUMsSUFBSSxFQUFFLE9BQU8sbUNBQVEsQ0FBQTs7QUFFMUIsVUFBTSxnQkFBZ0IsR0FBRyxBQUFDLEtBQUssSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFhLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUEsR0FBSyxFQUFFLENBQUE7QUFDakcsVUFBTSxhQUFhLEdBQUcsS0FBSyxXQUFRLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUEsR0FBRyxnQkFBZ0IsU0FBTSxFQUFFLENBQUE7QUFDN0UsVUFBTSxJQUFJLEdBQUcsa0JBQUssUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFBO0FBQ2hDLFVBQU0sWUFBWSxHQUFHLFNBQWYsWUFBWSxHQUFTO0FBQ3pCLFlBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxFQUFFLFdBQVcsRUFBRSxLQUFLLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUE7T0FDcEUsQ0FBQTs7QUFFRCxhQUNFOztVQUFHLFNBQVMsRUFBQyxzQkFBc0IsRUFBQyxJQUFJLEVBQUMsR0FBRyxFQUFDLE9BQU8sRUFBRSxZQUFZLEFBQUM7UUFDaEUsSUFBSTtRQUNKLGFBQWE7T0FDWixDQUNMO0tBQ0Y7OztXQUVNLGdCQUFDLFVBQVUsRUFBRTtBQUNsQixVQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQTtBQUM1QixhQUFPLGtCQUFLLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQTtLQUN6Qjs7O1NBakNrQixhQUFhOzs7cUJBQWIsYUFBYSIsImZpbGUiOiIvaG9tZS9iaWxseS8uYXRvbS9wYWNrYWdlcy9sYXRleC9saWIvdmlld3MvZmlsZS1yZWZlcmVuY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiogQGJhYmVsICovXG4vKiogQGpzeCBldGNoLmRvbSAqL1xuXG5pbXBvcnQgZXRjaCBmcm9tICdldGNoJ1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRmlsZVJlZmVyZW5jZSB7XG4gIGNvbnN0cnVjdG9yIChwcm9wZXJ0aWVzID0geyB0eXBlOiAnZXJyb3InIH0pIHtcbiAgICB0aGlzLnByb3BlcnRpZXMgPSBwcm9wZXJ0aWVzXG4gICAgZXRjaC5pbml0aWFsaXplKHRoaXMpXG4gIH1cblxuICBhc3luYyBkZXN0cm95ICgpIHtcbiAgICBhd2FpdCBldGNoLmRlc3Ryb3kodGhpcylcbiAgfVxuXG4gIHJlbmRlciAoKSB7XG4gICAgY29uc3QgeyBmaWxlLCByYW5nZSB9ID0gdGhpcy5wcm9wZXJ0aWVzXG5cbiAgICBpZiAoIWZpbGUpIHJldHVybiA8c3BhbiAvPlxuXG4gICAgY29uc3QgZW5kTGluZVJlZmVyZW5jZSA9IChyYW5nZSAmJiByYW5nZVswXVswXSAhPT0gcmFuZ2VbMV1bMF0pID8gYFxcdTIwMTMke3JhbmdlWzFdWzBdICsgMX1gIDogJydcbiAgICBjb25zdCBsaW5lUmVmZXJlbmNlID0gcmFuZ2UgPyBgICgke3JhbmdlWzBdWzBdICsgMX0ke2VuZExpbmVSZWZlcmVuY2V9KWAgOiAnJ1xuICAgIGNvbnN0IHRleHQgPSBwYXRoLmJhc2VuYW1lKGZpbGUpXG4gICAgY29uc3QgY2xpY2tIYW5kbGVyID0gKCkgPT4ge1xuICAgICAgYXRvbS53b3Jrc3BhY2Uub3BlbihmaWxlLCB7IGluaXRpYWxMaW5lOiByYW5nZSA/IHJhbmdlWzBdWzBdIDogMCB9KVxuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICA8YSBjbGFzc05hbWU9J2xhdGV4LWZpbGUtcmVmZXJlbmNlJyBocmVmPScjJyBvbmNsaWNrPXtjbGlja0hhbmRsZXJ9PlxuICAgICAgICB7dGV4dH1cbiAgICAgICAge2xpbmVSZWZlcmVuY2V9XG4gICAgICA8L2E+XG4gICAgKVxuICB9XG5cbiAgdXBkYXRlIChwcm9wZXJ0aWVzKSB7XG4gICAgdGhpcy5wcm9wZXJ0aWVzID0gcHJvcGVydGllc1xuICAgIHJldHVybiBldGNoLnVwZGF0ZSh0aGlzKVxuICB9XG59XG4iXX0=