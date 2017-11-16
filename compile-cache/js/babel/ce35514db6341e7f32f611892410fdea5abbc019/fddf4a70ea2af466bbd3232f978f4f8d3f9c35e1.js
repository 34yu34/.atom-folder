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

  isSourceFile: function isSourceFile(filePath) {
    return filePath && !!filePath.match(/\.(?:tex|lhs|lagda|[prs]nw)$/i);
  },

  isTexFile: function isTexFile(filePath) {
    return filePath && !!filePath.match(/\.(?:tex|lhs|lagda)$/i);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2JpbGx5Ly5hdG9tL3BhY2thZ2VzL2xhdGV4L2xpYi93ZXJremV1Zy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztzQkFFYyxRQUFROzs7O3FCQUVQO0FBQ2IsU0FBTyxFQUFDLGlCQUFDLEtBQUssRUFBRTtBQUNkLFFBQUksS0FBSyxLQUFLLElBQUksRUFBRTtBQUFFLGFBQU8sSUFBSSxDQUFBO0tBQUU7O0FBRW5DLFFBQU0sS0FBSyxHQUFHLG9CQUFFLFNBQVMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxFQUFFLFVBQUEsSUFBSTthQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssQ0FBQztLQUFBLENBQUMsQ0FBQTtBQUMvRSxRQUFNLFlBQVksR0FBRyxvQkFBRSxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLFVBQUEsSUFBSTthQUFJLElBQUksS0FBSyxHQUFHO0tBQUEsQ0FBQyxDQUFDLE1BQU0sQ0FBQTtBQUN2RSxRQUFNLGNBQWMsR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLFVBQUEsSUFBSTthQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDO0tBQUEsQ0FBQyxDQUFBOztBQUVsRSxXQUFPLGNBQWMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7R0FDakM7O0FBRUQsV0FBUyxFQUFDLG1CQUFDLE1BQU0sRUFBRTtBQUNqQixXQUFPLFlBQWE7d0NBQVQsSUFBSTtBQUFKLFlBQUk7OztBQUNiLGFBQU8sSUFBSSxPQUFPLENBQUMsVUFBQyxPQUFPLEVBQUUsTUFBTSxFQUFLO0FBQ3RDLGNBQU0sa0JBQUksSUFBSSxTQUFFLFVBQUMsS0FBSyxFQUFFLElBQUksRUFBSztBQUFFLGVBQUssR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFBO1NBQUUsR0FBQyxDQUFBO09BQzVFLENBQUMsQ0FBQTtLQUNILENBQUE7R0FDRjs7QUFFRCxrQkFBZ0IsRUFBQyw0QkFBRztBQUNsQixRQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFtQixFQUFFLENBQUE7QUFDbkQsUUFBSSxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsQ0FBQTs7QUFFdEIsUUFBTSxRQUFRLEdBQUcsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFBO0FBQ2pDLFFBQU0sUUFBUSxHQUFHLE1BQU0sQ0FBQyx1QkFBdUIsRUFBRSxDQUFBO0FBQ2pELFFBQU0sVUFBVSxHQUFHLFFBQVEsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFBOztBQUVuQyxXQUFPLEVBQUUsTUFBTSxFQUFOLE1BQU0sRUFBRSxRQUFRLEVBQVIsUUFBUSxFQUFFLFFBQVEsRUFBUixRQUFRLEVBQUUsVUFBVSxFQUFWLFVBQVUsRUFBRSxDQUFBO0dBQ2xEOztBQUVELDJCQUF5QixFQUFDLG1DQUFDLElBQUksRUFBRSxVQUFVLEVBQUU7QUFDM0MsV0FBTyxvQkFBRSxNQUFNLENBQUMsVUFBVSxFQUFFLFVBQUMsT0FBTyxFQUFFLEtBQUssRUFBRSxJQUFJO2FBQUssT0FBTyxDQUFDLE9BQU8sT0FBSyxJQUFJLFFBQUssS0FBSyxDQUFDO0tBQUEsRUFBRSxJQUFJLENBQUMsQ0FBQTtHQUNqRzs7QUFFRCxjQUFZLEVBQUMsc0JBQUMsUUFBUSxFQUFFO0FBQ3RCLFdBQU8sUUFBUSxJQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLCtCQUErQixDQUFDLENBQUE7R0FDckU7O0FBRUQsV0FBUyxFQUFDLG1CQUFDLFFBQVEsRUFBRTtBQUNuQixXQUFPLFFBQVEsSUFBSSxDQUFDLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyx1QkFBdUIsQ0FBQyxDQUFBO0dBQzdEOztBQUVELGFBQVcsRUFBQyxxQkFBQyxRQUFRLEVBQUU7QUFDckIsV0FBTyxRQUFRLElBQUksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUE7R0FDbEQ7O0FBRUQsV0FBUyxFQUFDLG1CQUFDLFFBQVEsRUFBRTtBQUNuQixXQUFPLFFBQVEsSUFBSSxDQUFDLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQTtHQUMvQzs7QUFFRCxVQUFRLEVBQUMsa0JBQUMsUUFBUSxFQUFFO0FBQ2xCLFdBQU8sUUFBUSxJQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFBO0dBQzlDOztBQUVELFdBQVMsRUFBQyxtQkFBQyxRQUFRLEVBQUU7QUFDbkIsV0FBTyxRQUFRLElBQUksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsaUJBQWlCLENBQUMsQ0FBQTtHQUN2RDtDQUNGIiwiZmlsZSI6Ii9ob21lL2JpbGx5Ly5hdG9tL3BhY2thZ2VzL2xhdGV4L2xpYi93ZXJremV1Zy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBAYmFiZWwgKi9cblxuaW1wb3J0IF8gZnJvbSAnbG9kYXNoJ1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIGhlcmVkb2MgKGlucHV0KSB7XG4gICAgaWYgKGlucHV0ID09PSBudWxsKSB7IHJldHVybiBudWxsIH1cblxuICAgIGNvbnN0IGxpbmVzID0gXy5kcm9wV2hpbGUoaW5wdXQuc3BsaXQoL1xcclxcbnxcXG58XFxyLyksIGxpbmUgPT4gbGluZS5sZW5ndGggPT09IDApXG4gICAgY29uc3QgaW5kZW50TGVuZ3RoID0gXy50YWtlV2hpbGUobGluZXNbMF0sIGNoYXIgPT4gY2hhciA9PT0gJyAnKS5sZW5ndGhcbiAgICBjb25zdCB0cnVuY2F0ZWRMaW5lcyA9IGxpbmVzLm1hcChsaW5lID0+IGxpbmUuc2xpY2UoaW5kZW50TGVuZ3RoKSlcblxuICAgIHJldHVybiB0cnVuY2F0ZWRMaW5lcy5qb2luKCdcXG4nKVxuICB9LFxuXG4gIHByb21pc2lmeSAodGFyZ2V0KSB7XG4gICAgcmV0dXJuICguLi5hcmdzKSA9PiB7XG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICB0YXJnZXQoLi4uYXJncywgKGVycm9yLCBkYXRhKSA9PiB7IGVycm9yID8gcmVqZWN0KGVycm9yKSA6IHJlc29sdmUoZGF0YSkgfSlcbiAgICAgIH0pXG4gICAgfVxuICB9LFxuXG4gIGdldEVkaXRvckRldGFpbHMgKCkge1xuICAgIGNvbnN0IGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgIGlmICghZWRpdG9yKSByZXR1cm4ge31cblxuICAgIGNvbnN0IGZpbGVQYXRoID0gZWRpdG9yLmdldFBhdGgoKVxuICAgIGNvbnN0IHBvc2l0aW9uID0gZWRpdG9yLmdldEN1cnNvckJ1ZmZlclBvc2l0aW9uKClcbiAgICBjb25zdCBsaW5lTnVtYmVyID0gcG9zaXRpb24ucm93ICsgMVxuXG4gICAgcmV0dXJuIHsgZWRpdG9yLCBmaWxlUGF0aCwgcG9zaXRpb24sIGxpbmVOdW1iZXIgfVxuICB9LFxuXG4gIHJlcGxhY2VQcm9wZXJ0aWVzSW5TdHJpbmcgKHRleHQsIHByb3BlcnRpZXMpIHtcbiAgICByZXR1cm4gXy5yZWR1Y2UocHJvcGVydGllcywgKGN1cnJlbnQsIHZhbHVlLCBuYW1lKSA9PiBjdXJyZW50LnJlcGxhY2UoYHske25hbWV9fWAsIHZhbHVlKSwgdGV4dClcbiAgfSxcblxuICBpc1NvdXJjZUZpbGUgKGZpbGVQYXRoKSB7XG4gICAgcmV0dXJuIGZpbGVQYXRoICYmICEhZmlsZVBhdGgubWF0Y2goL1xcLig/OnRleHxsaHN8bGFnZGF8W3Byc11udykkL2kpXG4gIH0sXG5cbiAgaXNUZXhGaWxlIChmaWxlUGF0aCkge1xuICAgIHJldHVybiBmaWxlUGF0aCAmJiAhIWZpbGVQYXRoLm1hdGNoKC9cXC4oPzp0ZXh8bGhzfGxhZ2RhKSQvaSlcbiAgfSxcblxuICBpc0tuaXRyRmlsZSAoZmlsZVBhdGgpIHtcbiAgICByZXR1cm4gZmlsZVBhdGggJiYgISFmaWxlUGF0aC5tYXRjaCgvXFwuW3JzXW53JC9pKVxuICB9LFxuXG4gIGlzUGRmRmlsZSAoZmlsZVBhdGgpIHtcbiAgICByZXR1cm4gZmlsZVBhdGggJiYgISFmaWxlUGF0aC5tYXRjaCgvXFwucGRmJC9pKVxuICB9LFxuXG4gIGlzUHNGaWxlIChmaWxlUGF0aCkge1xuICAgIHJldHVybiBmaWxlUGF0aCAmJiAhIWZpbGVQYXRoLm1hdGNoKC9cXC5wcyQvaSlcbiAgfSxcblxuICBpc0R2aUZpbGUgKGZpbGVQYXRoKSB7XG4gICAgcmV0dXJuIGZpbGVQYXRoICYmICEhZmlsZVBhdGgubWF0Y2goL1xcLig/OmR2aXx4ZHYpJC9pKVxuICB9XG59XG4iXX0=