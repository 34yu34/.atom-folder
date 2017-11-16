Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

/** @babel */

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

var ErrorMarker = (function () {
  function ErrorMarker(editor, messages) {
    _classCallCheck(this, ErrorMarker);

    this.editor = editor;
    this.messages = messages;
    this.markers = [];
    this.mark();
  }

  _createClass(ErrorMarker, [{
    key: 'mark',
    value: function mark() {
      var _this = this;

      this.markers = _lodash2['default'].map(_lodash2['default'].groupBy(this.messages, 'range'), function (messages) {
        var type = _logger2['default'].getMostSevereType(messages);
        var marker = _this.editor.markBufferRange(messages[0].range, { invalidate: 'touch' });
        _this.editor.decorateMarker(marker, { type: 'line-number', 'class': 'latex-' + type });
        return marker;
      });
    }
  }, {
    key: 'clear',
    value: function clear() {
      for (var marker of this.markers) {
        marker.destroy();
      }
    }
  }]);

  return ErrorMarker;
})();

exports['default'] = ErrorMarker;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2JpbGx5Ly5hdG9tL3BhY2thZ2VzL2xhdGV4L2xpYi9lcnJvci1tYXJrZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O3NCQUVjLFFBQVE7Ozs7c0JBQ0gsVUFBVTs7OztJQUVSLFdBQVc7QUFDbEIsV0FETyxXQUFXLENBQ2pCLE1BQU0sRUFBRSxRQUFRLEVBQUU7MEJBRFosV0FBVzs7QUFFNUIsUUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUE7QUFDcEIsUUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUE7QUFDeEIsUUFBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUE7QUFDakIsUUFBSSxDQUFDLElBQUksRUFBRSxDQUFBO0dBQ1o7O2VBTmtCLFdBQVc7O1dBUXpCLGdCQUFHOzs7QUFDTixVQUFJLENBQUMsT0FBTyxHQUFHLG9CQUFFLEdBQUcsQ0FBQyxvQkFBRSxPQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsRUFBRSxVQUFBLFFBQVEsRUFBSTtBQUNsRSxZQUFNLElBQUksR0FBRyxvQkFBTyxpQkFBaUIsQ0FBQyxRQUFRLENBQUMsQ0FBQTtBQUMvQyxZQUFNLE1BQU0sR0FBRyxNQUFLLE1BQU0sQ0FBQyxlQUFlLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUFDLFVBQVUsRUFBRSxPQUFPLEVBQUMsQ0FBQyxDQUFBO0FBQ3BGLGNBQUssTUFBTSxDQUFDLGNBQWMsQ0FBQyxNQUFNLEVBQUUsRUFBQyxJQUFJLEVBQUUsYUFBYSxFQUFFLG9CQUFnQixJQUFJLEFBQUUsRUFBQyxDQUFDLENBQUE7QUFDakYsZUFBTyxNQUFNLENBQUE7T0FDZCxDQUFDLENBQUE7S0FDSDs7O1dBRUssaUJBQUc7QUFDUCxXQUFLLElBQUksTUFBTSxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7QUFDL0IsY0FBTSxDQUFDLE9BQU8sRUFBRSxDQUFBO09BQ2pCO0tBQ0Y7OztTQXJCa0IsV0FBVzs7O3FCQUFYLFdBQVciLCJmaWxlIjoiL2hvbWUvYmlsbHkvLmF0b20vcGFja2FnZXMvbGF0ZXgvbGliL2Vycm9yLW1hcmtlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBAYmFiZWwgKi9cblxuaW1wb3J0IF8gZnJvbSAnbG9kYXNoJ1xuaW1wb3J0IExvZ2dlciBmcm9tICcuL2xvZ2dlcidcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRXJyb3JNYXJrZXIge1xuICBjb25zdHJ1Y3RvciAoZWRpdG9yLCBtZXNzYWdlcykge1xuICAgIHRoaXMuZWRpdG9yID0gZWRpdG9yXG4gICAgdGhpcy5tZXNzYWdlcyA9IG1lc3NhZ2VzXG4gICAgdGhpcy5tYXJrZXJzID0gW11cbiAgICB0aGlzLm1hcmsoKVxuICB9XG5cbiAgbWFyayAoKSB7XG4gICAgdGhpcy5tYXJrZXJzID0gXy5tYXAoXy5ncm91cEJ5KHRoaXMubWVzc2FnZXMsICdyYW5nZScpLCBtZXNzYWdlcyA9PiB7XG4gICAgICBjb25zdCB0eXBlID0gTG9nZ2VyLmdldE1vc3RTZXZlcmVUeXBlKG1lc3NhZ2VzKVxuICAgICAgY29uc3QgbWFya2VyID0gdGhpcy5lZGl0b3IubWFya0J1ZmZlclJhbmdlKG1lc3NhZ2VzWzBdLnJhbmdlLCB7aW52YWxpZGF0ZTogJ3RvdWNoJ30pXG4gICAgICB0aGlzLmVkaXRvci5kZWNvcmF0ZU1hcmtlcihtYXJrZXIsIHt0eXBlOiAnbGluZS1udW1iZXInLCBjbGFzczogYGxhdGV4LSR7dHlwZX1gfSlcbiAgICAgIHJldHVybiBtYXJrZXJcbiAgICB9KVxuICB9XG5cbiAgY2xlYXIgKCkge1xuICAgIGZvciAobGV0IG1hcmtlciBvZiB0aGlzLm1hcmtlcnMpIHtcbiAgICAgIG1hcmtlci5kZXN0cm95KClcbiAgICB9XG4gIH1cbn1cbiJdfQ==