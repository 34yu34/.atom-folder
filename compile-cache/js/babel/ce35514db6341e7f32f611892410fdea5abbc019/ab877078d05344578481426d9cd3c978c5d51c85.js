Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/** @babel */

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

exports['default'] = {
  heredoc: function heredoc(input) {
    if (input === null) {
      return null;
    }

    var lines = _lodash2['default'].dropWhile(input.split(/\r\n|\n|\r/), function (line) {
      return line.length === 0;
    });
    var indentLength = _lodash2['default'].takeWhile(lines[0], function (char) {
      return char === ' ';
    }).length;
    var truncatedLines = lines.map(function (line) {
      return line.slice(indentLength);
    });

    return truncatedLines.join('\n');
  },

  promisify: function promisify(target) {
    return function () {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return new Promise(function (resolve, reject) {
        target.apply(undefined, args.concat([function (error, data) {
          error ? reject(error) : resolve(data);
        }]));
      });
    };
  },

  getEditorDetails: function getEditorDetails() {
    var editor = atom.workspace.getActiveTextEditor();
    if (!editor) return {};

    var filePath = editor.getPath();
    var position = editor.getCursorBufferPosition();
    var lineNumber = position.row + 1;

    return { editor: editor, filePath: filePath, position: position, lineNumber: lineNumber };
  },

  replacePropertiesInString: function replacePropertiesInString(text, properties) {
    return _lodash2['default'].reduce(properties, function (current, value, name) {
      return current.replace('{' + name + '}', value);
    }, text);
  },

  isTexFile: function isTexFile(filePath) {
    return filePath && !!filePath.match(/\.(?:tex|lhs)$/i);
  },

  isKnitrFile: function isKnitrFile(filePath) {
    return filePath && !!filePath.match(/\.[rs]nw$/i);
  },

  isPdfFile: function isPdfFile(filePath) {
    return filePath && !!filePath.match(/\.pdf$/i);
  },

  isPsFile: function isPsFile(filePath) {
    return filePath && !!filePath.match(/\.ps$/i);
  },

  isDviFile: function isDviFile(filePath) {
    return filePath && !!filePath.match(/\.(?:dvi|xdv)$/i);
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2JpbGx5Ly5hdG9tL3BhY2thZ2VzL2xhdGV4L2xpYi93ZXJremV1Zy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztzQkFFYyxRQUFROzs7O3FCQUVQO0FBQ2IsU0FBTyxFQUFDLGlCQUFDLEtBQUssRUFBRTtBQUNkLFFBQUksS0FBSyxLQUFLLElBQUksRUFBRTtBQUFFLGFBQU8sSUFBSSxDQUFBO0tBQUU7O0FBRW5DLFFBQU0sS0FBSyxHQUFHLG9CQUFFLFNBQVMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxFQUFFLFVBQUEsSUFBSTthQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssQ0FBQztLQUFBLENBQUMsQ0FBQTtBQUMvRSxRQUFNLFlBQVksR0FBRyxvQkFBRSxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLFVBQUEsSUFBSTthQUFJLElBQUksS0FBSyxHQUFHO0tBQUEsQ0FBQyxDQUFDLE1BQU0sQ0FBQTtBQUN2RSxRQUFNLGNBQWMsR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLFVBQUEsSUFBSTthQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDO0tBQUEsQ0FBQyxDQUFBOztBQUVsRSxXQUFPLGNBQWMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7R0FDakM7O0FBRUQsV0FBUyxFQUFDLG1CQUFDLE1BQU0sRUFBRTtBQUNqQixXQUFPLFlBQWE7d0NBQVQsSUFBSTtBQUFKLFlBQUk7OztBQUNiLGFBQU8sSUFBSSxPQUFPLENBQUMsVUFBQyxPQUFPLEVBQUUsTUFBTSxFQUFLO0FBQ3RDLGNBQU0sa0JBQUksSUFBSSxTQUFFLFVBQUMsS0FBSyxFQUFFLElBQUksRUFBSztBQUFFLGVBQUssR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFBO1NBQUUsR0FBQyxDQUFBO09BQzVFLENBQUMsQ0FBQTtLQUNILENBQUE7R0FDRjs7QUFFRCxrQkFBZ0IsRUFBQyw0QkFBRztBQUNsQixRQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFtQixFQUFFLENBQUE7QUFDbkQsUUFBSSxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsQ0FBQTs7QUFFdEIsUUFBTSxRQUFRLEdBQUcsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFBO0FBQ2pDLFFBQU0sUUFBUSxHQUFHLE1BQU0sQ0FBQyx1QkFBdUIsRUFBRSxDQUFBO0FBQ2pELFFBQU0sVUFBVSxHQUFHLFFBQVEsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFBOztBQUVuQyxXQUFPLEVBQUUsTUFBTSxFQUFOLE1BQU0sRUFBRSxRQUFRLEVBQVIsUUFBUSxFQUFFLFFBQVEsRUFBUixRQUFRLEVBQUUsVUFBVSxFQUFWLFVBQVUsRUFBRSxDQUFBO0dBQ2xEOztBQUVELDJCQUF5QixFQUFDLG1DQUFDLElBQUksRUFBRSxVQUFVLEVBQUU7QUFDM0MsV0FBTyxvQkFBRSxNQUFNLENBQUMsVUFBVSxFQUFFLFVBQUMsT0FBTyxFQUFFLEtBQUssRUFBRSxJQUFJO2FBQUssT0FBTyxDQUFDLE9BQU8sT0FBSyxJQUFJLFFBQUssS0FBSyxDQUFDO0tBQUEsRUFBRSxJQUFJLENBQUMsQ0FBQTtHQUNqRzs7QUFFRCxXQUFTLEVBQUMsbUJBQUMsUUFBUSxFQUFFO0FBQ25CLFdBQU8sUUFBUSxJQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLGlCQUFpQixDQUFDLENBQUE7R0FDdkQ7O0FBRUQsYUFBVyxFQUFDLHFCQUFDLFFBQVEsRUFBRTtBQUNyQixXQUFPLFFBQVEsSUFBSSxDQUFDLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQTtHQUNsRDs7QUFFRCxXQUFTLEVBQUMsbUJBQUMsUUFBUSxFQUFFO0FBQ25CLFdBQU8sUUFBUSxJQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFBO0dBQy9DOztBQUVELFVBQVEsRUFBQyxrQkFBQyxRQUFRLEVBQUU7QUFDbEIsV0FBTyxRQUFRLElBQUksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUE7R0FDOUM7O0FBRUQsV0FBUyxFQUFDLG1CQUFDLFFBQVEsRUFBRTtBQUNuQixXQUFPLFFBQVEsSUFBSSxDQUFDLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxDQUFBO0dBQ3ZEO0NBQ0YiLCJmaWxlIjoiL2hvbWUvYmlsbHkvLmF0b20vcGFja2FnZXMvbGF0ZXgvbGliL3dlcmt6ZXVnLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBiYWJlbCAqL1xuXG5pbXBvcnQgXyBmcm9tICdsb2Rhc2gnXG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgaGVyZWRvYyAoaW5wdXQpIHtcbiAgICBpZiAoaW5wdXQgPT09IG51bGwpIHsgcmV0dXJuIG51bGwgfVxuXG4gICAgY29uc3QgbGluZXMgPSBfLmRyb3BXaGlsZShpbnB1dC5zcGxpdCgvXFxyXFxufFxcbnxcXHIvKSwgbGluZSA9PiBsaW5lLmxlbmd0aCA9PT0gMClcbiAgICBjb25zdCBpbmRlbnRMZW5ndGggPSBfLnRha2VXaGlsZShsaW5lc1swXSwgY2hhciA9PiBjaGFyID09PSAnICcpLmxlbmd0aFxuICAgIGNvbnN0IHRydW5jYXRlZExpbmVzID0gbGluZXMubWFwKGxpbmUgPT4gbGluZS5zbGljZShpbmRlbnRMZW5ndGgpKVxuXG4gICAgcmV0dXJuIHRydW5jYXRlZExpbmVzLmpvaW4oJ1xcbicpXG4gIH0sXG5cbiAgcHJvbWlzaWZ5ICh0YXJnZXQpIHtcbiAgICByZXR1cm4gKC4uLmFyZ3MpID0+IHtcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIHRhcmdldCguLi5hcmdzLCAoZXJyb3IsIGRhdGEpID0+IHsgZXJyb3IgPyByZWplY3QoZXJyb3IpIDogcmVzb2x2ZShkYXRhKSB9KVxuICAgICAgfSlcbiAgICB9XG4gIH0sXG5cbiAgZ2V0RWRpdG9yRGV0YWlscyAoKSB7XG4gICAgY29uc3QgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgaWYgKCFlZGl0b3IpIHJldHVybiB7fVxuXG4gICAgY29uc3QgZmlsZVBhdGggPSBlZGl0b3IuZ2V0UGF0aCgpXG4gICAgY29uc3QgcG9zaXRpb24gPSBlZGl0b3IuZ2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oKVxuICAgIGNvbnN0IGxpbmVOdW1iZXIgPSBwb3NpdGlvbi5yb3cgKyAxXG5cbiAgICByZXR1cm4geyBlZGl0b3IsIGZpbGVQYXRoLCBwb3NpdGlvbiwgbGluZU51bWJlciB9XG4gIH0sXG5cbiAgcmVwbGFjZVByb3BlcnRpZXNJblN0cmluZyAodGV4dCwgcHJvcGVydGllcykge1xuICAgIHJldHVybiBfLnJlZHVjZShwcm9wZXJ0aWVzLCAoY3VycmVudCwgdmFsdWUsIG5hbWUpID0+IGN1cnJlbnQucmVwbGFjZShgeyR7bmFtZX19YCwgdmFsdWUpLCB0ZXh0KVxuICB9LFxuXG4gIGlzVGV4RmlsZSAoZmlsZVBhdGgpIHtcbiAgICByZXR1cm4gZmlsZVBhdGggJiYgISFmaWxlUGF0aC5tYXRjaCgvXFwuKD86dGV4fGxocykkL2kpXG4gIH0sXG5cbiAgaXNLbml0ckZpbGUgKGZpbGVQYXRoKSB7XG4gICAgcmV0dXJuIGZpbGVQYXRoICYmICEhZmlsZVBhdGgubWF0Y2goL1xcLltyc11udyQvaSlcbiAgfSxcblxuICBpc1BkZkZpbGUgKGZpbGVQYXRoKSB7XG4gICAgcmV0dXJuIGZpbGVQYXRoICYmICEhZmlsZVBhdGgubWF0Y2goL1xcLnBkZiQvaSlcbiAgfSxcblxuICBpc1BzRmlsZSAoZmlsZVBhdGgpIHtcbiAgICByZXR1cm4gZmlsZVBhdGggJiYgISFmaWxlUGF0aC5tYXRjaCgvXFwucHMkL2kpXG4gIH0sXG5cbiAgaXNEdmlGaWxlIChmaWxlUGF0aCkge1xuICAgIHJldHVybiBmaWxlUGF0aCAmJiAhIWZpbGVQYXRoLm1hdGNoKC9cXC4oPzpkdml8eGR2KSQvaSlcbiAgfVxufVxuIl19