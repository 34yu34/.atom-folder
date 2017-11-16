Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/** @babel */

var _atom = require('atom');

var MarkerManager = (function (_Disposable) {
  _inherits(MarkerManager, _Disposable);

  function MarkerManager(editor) {
    var _this2 = this;

    _classCallCheck(this, MarkerManager);

    _get(Object.getPrototypeOf(MarkerManager.prototype), 'constructor', this).call(this, function () {
      return _this.disposables.dispose();
    });

    this.disposables = new _atom.CompositeDisposable();

    var _this = this;

    this.editor = editor;
    this.markers = [];

    this.disposables.add(latex.log.onMessages(function (_ref) {
      var messages = _ref.messages;
      var reset = _ref.reset;
      return _this2.addMarkers(messages, reset);
    }));
    this.disposables.add(new _atom.Disposable(function () {
      return _this2.clear();
    }));
    this.disposables.add(this.editor.onDidDestroy(function () {
      return _this2.dispose();
    }));
    this.disposables.add(atom.config.onDidChange('latex.loggingLevel', function () {
      return _this2.update();
    }));

    this.addMarkers(latex.log.getMessages());
  }

  _createClass(MarkerManager, [{
    key: 'update',
    value: function update() {
      this.addMarkers(latex.log.getMessages(), true);
    }
  }, {
    key: 'addMarkers',
    value: function addMarkers(messages, reset) {
      if (reset) this.clear();

      var editorPath = this.editor.getPath();
      var isVisible = function isVisible(filePath, range) {
        return filePath && range && editorPath.includes(filePath);
      };

      if (editorPath) {
        for (var message of messages) {
          if (isVisible(message.filePath, message.range)) {
            this.addMarker(message.type, message.filePath, message.range);
          }
          if (isVisible(message.logPath, message.logRange)) {
            this.addMarker(message.type, message.logPath, message.logRange);
          }
        }
      }
    }
  }, {
    key: 'addMarker',
    value: function addMarker(type, filePath, range) {
      var marker = this.editor.markBufferRange(range, { invalidate: 'touch' });
      this.editor.decorateMarker(marker, { type: 'line-number', 'class': 'latex-' + type });
      this.markers.push(marker);
    }
  }, {
    key: 'clear',
    value: function clear() {
      for (var marker of this.markers) {
        marker.destroy();
      }
      this.markers = [];
    }
  }]);

  return MarkerManager;
})(_atom.Disposable);

exports['default'] = MarkerManager;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2JpbGx5Ly5hdG9tL3BhY2thZ2VzL2xhdGV4L2xpYi9tYXJrZXItbWFuYWdlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztvQkFFZ0QsTUFBTTs7SUFFakMsYUFBYTtZQUFiLGFBQWE7O0FBR3BCLFdBSE8sYUFBYSxDQUduQixNQUFNLEVBQUU7OzswQkFIRixhQUFhOztBQUk5QiwrQkFKaUIsYUFBYSw2Q0FJeEI7YUFBTSxNQUFLLFdBQVcsQ0FBQyxPQUFPLEVBQUU7S0FBQSxFQUFDOztTQUh6QyxXQUFXLEdBQUcsK0JBQXlCOzs7O0FBS3JDLFFBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFBO0FBQ3BCLFFBQUksQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFBOztBQUVqQixRQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxVQUFDLElBQW1CO1VBQWpCLFFBQVEsR0FBVixJQUFtQixDQUFqQixRQUFRO1VBQUUsS0FBSyxHQUFqQixJQUFtQixDQUFQLEtBQUs7YUFBTyxPQUFLLFVBQVUsQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDO0tBQUEsQ0FBQyxDQUFDLENBQUE7QUFDckcsUUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMscUJBQWU7YUFBTSxPQUFLLEtBQUssRUFBRTtLQUFBLENBQUMsQ0FBQyxDQUFBO0FBQ3hELFFBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDO2FBQU0sT0FBSyxPQUFPLEVBQUU7S0FBQSxDQUFDLENBQUMsQ0FBQTtBQUNwRSxRQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxvQkFBb0IsRUFBRTthQUFNLE9BQUssTUFBTSxFQUFFO0tBQUEsQ0FBQyxDQUFDLENBQUE7O0FBRXhGLFFBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFBO0dBQ3pDOztlQWZrQixhQUFhOztXQWlCekIsa0JBQUc7QUFDUixVQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUE7S0FDL0M7OztXQUVVLG9CQUFDLFFBQVEsRUFBRSxLQUFLLEVBQUU7QUFDM0IsVUFBSSxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFBOztBQUV2QixVQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFBO0FBQ3hDLFVBQU0sU0FBUyxHQUFHLFNBQVosU0FBUyxDQUFJLFFBQVEsRUFBRSxLQUFLO2VBQUssUUFBUSxJQUFJLEtBQUssSUFBSSxVQUFVLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQztPQUFBLENBQUE7O0FBRXpGLFVBQUksVUFBVSxFQUFFO0FBQ2QsYUFBSyxJQUFNLE9BQU8sSUFBSSxRQUFRLEVBQUU7QUFDOUIsY0FBSSxTQUFTLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUU7QUFDOUMsZ0JBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQTtXQUM5RDtBQUNELGNBQUksU0FBUyxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLFFBQVEsQ0FBQyxFQUFFO0FBQ2hELGdCQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUE7V0FDaEU7U0FDRjtPQUNGO0tBQ0Y7OztXQUVTLG1CQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO0FBQ2hDLFVBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLEtBQUssRUFBRSxFQUFFLFVBQVUsRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFBO0FBQzFFLFVBQUksQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLE1BQU0sRUFBRSxFQUFFLElBQUksRUFBRSxhQUFhLEVBQUUsb0JBQWdCLElBQUksQUFBRSxFQUFFLENBQUMsQ0FBQTtBQUNuRixVQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQTtLQUMxQjs7O1dBRUssaUJBQUc7QUFDUCxXQUFLLElBQU0sTUFBTSxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7QUFDakMsY0FBTSxDQUFDLE9BQU8sRUFBRSxDQUFBO09BQ2pCO0FBQ0QsVUFBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUE7S0FDbEI7OztTQWxEa0IsYUFBYTs7O3FCQUFiLGFBQWEiLCJmaWxlIjoiL2hvbWUvYmlsbHkvLmF0b20vcGFja2FnZXMvbGF0ZXgvbGliL21hcmtlci1tYW5hZ2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBiYWJlbCAqL1xuXG5pbXBvcnQgeyBDb21wb3NpdGVEaXNwb3NhYmxlLCBEaXNwb3NhYmxlIH0gZnJvbSAnYXRvbSdcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWFya2VyTWFuYWdlciBleHRlbmRzIERpc3Bvc2FibGUge1xuICBkaXNwb3NhYmxlcyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcblxuICBjb25zdHJ1Y3RvciAoZWRpdG9yKSB7XG4gICAgc3VwZXIoKCkgPT4gdGhpcy5kaXNwb3NhYmxlcy5kaXNwb3NlKCkpXG5cbiAgICB0aGlzLmVkaXRvciA9IGVkaXRvclxuICAgIHRoaXMubWFya2VycyA9IFtdXG5cbiAgICB0aGlzLmRpc3Bvc2FibGVzLmFkZChsYXRleC5sb2cub25NZXNzYWdlcygoeyBtZXNzYWdlcywgcmVzZXQgfSkgPT4gdGhpcy5hZGRNYXJrZXJzKG1lc3NhZ2VzLCByZXNldCkpKVxuICAgIHRoaXMuZGlzcG9zYWJsZXMuYWRkKG5ldyBEaXNwb3NhYmxlKCgpID0+IHRoaXMuY2xlYXIoKSkpXG4gICAgdGhpcy5kaXNwb3NhYmxlcy5hZGQodGhpcy5lZGl0b3Iub25EaWREZXN0cm95KCgpID0+IHRoaXMuZGlzcG9zZSgpKSlcbiAgICB0aGlzLmRpc3Bvc2FibGVzLmFkZChhdG9tLmNvbmZpZy5vbkRpZENoYW5nZSgnbGF0ZXgubG9nZ2luZ0xldmVsJywgKCkgPT4gdGhpcy51cGRhdGUoKSkpXG5cbiAgICB0aGlzLmFkZE1hcmtlcnMobGF0ZXgubG9nLmdldE1lc3NhZ2VzKCkpXG4gIH1cblxuICB1cGRhdGUgKCkge1xuICAgIHRoaXMuYWRkTWFya2VycyhsYXRleC5sb2cuZ2V0TWVzc2FnZXMoKSwgdHJ1ZSlcbiAgfVxuXG4gIGFkZE1hcmtlcnMgKG1lc3NhZ2VzLCByZXNldCkge1xuICAgIGlmIChyZXNldCkgdGhpcy5jbGVhcigpXG5cbiAgICBjb25zdCBlZGl0b3JQYXRoID0gdGhpcy5lZGl0b3IuZ2V0UGF0aCgpXG4gICAgY29uc3QgaXNWaXNpYmxlID0gKGZpbGVQYXRoLCByYW5nZSkgPT4gZmlsZVBhdGggJiYgcmFuZ2UgJiYgZWRpdG9yUGF0aC5pbmNsdWRlcyhmaWxlUGF0aClcblxuICAgIGlmIChlZGl0b3JQYXRoKSB7XG4gICAgICBmb3IgKGNvbnN0IG1lc3NhZ2Ugb2YgbWVzc2FnZXMpIHtcbiAgICAgICAgaWYgKGlzVmlzaWJsZShtZXNzYWdlLmZpbGVQYXRoLCBtZXNzYWdlLnJhbmdlKSkge1xuICAgICAgICAgIHRoaXMuYWRkTWFya2VyKG1lc3NhZ2UudHlwZSwgbWVzc2FnZS5maWxlUGF0aCwgbWVzc2FnZS5yYW5nZSlcbiAgICAgICAgfVxuICAgICAgICBpZiAoaXNWaXNpYmxlKG1lc3NhZ2UubG9nUGF0aCwgbWVzc2FnZS5sb2dSYW5nZSkpIHtcbiAgICAgICAgICB0aGlzLmFkZE1hcmtlcihtZXNzYWdlLnR5cGUsIG1lc3NhZ2UubG9nUGF0aCwgbWVzc2FnZS5sb2dSYW5nZSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGFkZE1hcmtlciAodHlwZSwgZmlsZVBhdGgsIHJhbmdlKSB7XG4gICAgY29uc3QgbWFya2VyID0gdGhpcy5lZGl0b3IubWFya0J1ZmZlclJhbmdlKHJhbmdlLCB7IGludmFsaWRhdGU6ICd0b3VjaCcgfSlcbiAgICB0aGlzLmVkaXRvci5kZWNvcmF0ZU1hcmtlcihtYXJrZXIsIHsgdHlwZTogJ2xpbmUtbnVtYmVyJywgY2xhc3M6IGBsYXRleC0ke3R5cGV9YCB9KVxuICAgIHRoaXMubWFya2Vycy5wdXNoKG1hcmtlcilcbiAgfVxuXG4gIGNsZWFyICgpIHtcbiAgICBmb3IgKGNvbnN0IG1hcmtlciBvZiB0aGlzLm1hcmtlcnMpIHtcbiAgICAgIG1hcmtlci5kZXN0cm95KClcbiAgICB9XG4gICAgdGhpcy5tYXJrZXJzID0gW11cbiAgfVxufVxuIl19