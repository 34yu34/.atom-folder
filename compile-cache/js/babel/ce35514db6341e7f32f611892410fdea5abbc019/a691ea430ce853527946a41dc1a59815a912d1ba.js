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

var _atom = require('atom');

var _messageIcon = require('./message-icon');

var _messageIcon2 = _interopRequireDefault(_messageIcon);

var _fileReference = require('./file-reference');

var _fileReference2 = _interopRequireDefault(_fileReference);

var LogMessage = (function () {
  function LogMessage() {
    var properties = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, LogMessage);

    this.properties = properties;
    _etch2['default'].initialize(this);
  }

  _createClass(LogMessage, [{
    key: 'destroy',
    value: _asyncToGenerator(function* () {
      yield _etch2['default'].destroy(this);
    })
  }, {
    key: 'render',
    value: function render() {
      var message = this.properties.message;
      var lines = message.text.split('\n').map(function (line) {
        return _etch2['default'].dom(
          'div',
          null,
          line
        );
      });

      return _etch2['default'].dom(
        'tr',
        { className: this.getClassNames(message) },
        _etch2['default'].dom(
          'td',
          null,
          _etch2['default'].dom(_messageIcon2['default'], { type: message.type })
        ),
        _etch2['default'].dom(
          'td',
          null,
          lines
        ),
        _etch2['default'].dom(
          'td',
          null,
          _etch2['default'].dom(_fileReference2['default'], { file: message.filePath, range: message.range })
        ),
        _etch2['default'].dom(
          'td',
          null,
          _etch2['default'].dom(_fileReference2['default'], { file: message.logPath, range: message.logRange })
        )
      );
    }
  }, {
    key: 'getClassNames',
    value: function getClassNames(message) {
      var className = 'latex-' + message.type;

      var matchesFilePath = message.filePath && this.properties.filePath === message.filePath;
      var containsPosition = message.range && this.properties.position && _atom.Range.fromObject(message.range).containsPoint(this.properties.position);
      if (matchesFilePath && containsPosition) {
        return className + ' latex-highlight';
      }

      return className;
    }
  }, {
    key: 'update',
    value: function update(properties) {
      this.properties = properties;
      return _etch2['default'].update(this);
    }
  }]);

  return LogMessage;
})();

exports['default'] = LogMessage;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2JpbGx5Ly5hdG9tL3BhY2thZ2VzL2xhdGV4L2xpYi92aWV3cy9sb2ctbWVzc2FnZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7b0JBR2lCLE1BQU07Ozs7b0JBQ0QsTUFBTTs7MkJBQ0osZ0JBQWdCOzs7OzZCQUNkLGtCQUFrQjs7OztJQUV2QixVQUFVO0FBQ2pCLFdBRE8sVUFBVSxHQUNDO1FBQWpCLFVBQVUseURBQUcsRUFBRTs7MEJBRFQsVUFBVTs7QUFFM0IsUUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUE7QUFDNUIsc0JBQUssVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFBO0dBQ3RCOztlQUprQixVQUFVOzs2QkFNZixhQUFHO0FBQ2YsWUFBTSxrQkFBSyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUE7S0FDekI7OztXQUVNLGtCQUFHO0FBQ1IsVUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUE7QUFDdkMsVUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQUEsSUFBSTtlQUFLOzs7VUFBTSxJQUFJO1NBQU87T0FBQyxDQUFDLENBQUE7O0FBRXZFLGFBQ0U7O1VBQUksU0FBUyxFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLEFBQUM7UUFDekM7OztVQUFJLGtEQUFhLElBQUksRUFBRSxPQUFPLENBQUMsSUFBSSxBQUFDLEdBQUc7U0FBSztRQUM1Qzs7O1VBQUssS0FBSztTQUFNO1FBQ2hCOzs7VUFBSSxvREFBZSxJQUFJLEVBQUUsT0FBTyxDQUFDLFFBQVEsQUFBQyxFQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsS0FBSyxBQUFDLEdBQUc7U0FBSztRQUN4RTs7O1VBQUksb0RBQWUsSUFBSSxFQUFFLE9BQU8sQ0FBQyxPQUFPLEFBQUMsRUFBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLFFBQVEsQUFBQyxHQUFHO1NBQUs7T0FDdkUsQ0FDTjtLQUNGOzs7V0FFYSx1QkFBQyxPQUFPLEVBQUU7QUFDdEIsVUFBTSxTQUFTLGNBQVksT0FBTyxDQUFDLElBQUksQUFBRSxDQUFBOztBQUV6QyxVQUFNLGVBQWUsR0FBRyxPQUFPLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxLQUFLLE9BQU8sQ0FBQyxRQUFRLENBQUE7QUFDekYsVUFBTSxnQkFBZ0IsR0FBRyxPQUFPLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxJQUFJLFlBQU0sVUFBVSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQTtBQUM3SSxVQUFJLGVBQWUsSUFBSSxnQkFBZ0IsRUFBRTtBQUN2QyxlQUFVLFNBQVMsc0JBQWtCO09BQ3RDOztBQUVELGFBQU8sU0FBUyxDQUFBO0tBQ2pCOzs7V0FFTSxnQkFBQyxVQUFVLEVBQUU7QUFDbEIsVUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUE7QUFDNUIsYUFBTyxrQkFBSyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUE7S0FDekI7OztTQXZDa0IsVUFBVTs7O3FCQUFWLFVBQVUiLCJmaWxlIjoiL2hvbWUvYmlsbHkvLmF0b20vcGFja2FnZXMvbGF0ZXgvbGliL3ZpZXdzL2xvZy1tZXNzYWdlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBiYWJlbCAqL1xuLyoqIEBqc3ggZXRjaC5kb20gKi9cblxuaW1wb3J0IGV0Y2ggZnJvbSAnZXRjaCdcbmltcG9ydCB7IFJhbmdlIH0gZnJvbSAnYXRvbSdcbmltcG9ydCBNZXNzYWdlSWNvbiBmcm9tICcuL21lc3NhZ2UtaWNvbidcbmltcG9ydCBGaWxlUmVmZXJlbmNlIGZyb20gJy4vZmlsZS1yZWZlcmVuY2UnXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExvZ01lc3NhZ2Uge1xuICBjb25zdHJ1Y3RvciAocHJvcGVydGllcyA9IHt9KSB7XG4gICAgdGhpcy5wcm9wZXJ0aWVzID0gcHJvcGVydGllc1xuICAgIGV0Y2guaW5pdGlhbGl6ZSh0aGlzKVxuICB9XG5cbiAgYXN5bmMgZGVzdHJveSAoKSB7XG4gICAgYXdhaXQgZXRjaC5kZXN0cm95KHRoaXMpXG4gIH1cblxuICByZW5kZXIgKCkge1xuICAgIGNvbnN0IG1lc3NhZ2UgPSB0aGlzLnByb3BlcnRpZXMubWVzc2FnZVxuICAgIGNvbnN0IGxpbmVzID0gbWVzc2FnZS50ZXh0LnNwbGl0KCdcXG4nKS5tYXAobGluZSA9PiAoPGRpdj57bGluZX08L2Rpdj4pKVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDx0ciBjbGFzc05hbWU9e3RoaXMuZ2V0Q2xhc3NOYW1lcyhtZXNzYWdlKX0+XG4gICAgICAgIDx0ZD48TWVzc2FnZUljb24gdHlwZT17bWVzc2FnZS50eXBlfSAvPjwvdGQ+XG4gICAgICAgIDx0ZD57bGluZXN9PC90ZD5cbiAgICAgICAgPHRkPjxGaWxlUmVmZXJlbmNlIGZpbGU9e21lc3NhZ2UuZmlsZVBhdGh9IHJhbmdlPXttZXNzYWdlLnJhbmdlfSAvPjwvdGQ+XG4gICAgICAgIDx0ZD48RmlsZVJlZmVyZW5jZSBmaWxlPXttZXNzYWdlLmxvZ1BhdGh9IHJhbmdlPXttZXNzYWdlLmxvZ1JhbmdlfSAvPjwvdGQ+XG4gICAgICA8L3RyPlxuICAgIClcbiAgfVxuXG4gIGdldENsYXNzTmFtZXMgKG1lc3NhZ2UpIHtcbiAgICBjb25zdCBjbGFzc05hbWUgPSBgbGF0ZXgtJHttZXNzYWdlLnR5cGV9YFxuXG4gICAgY29uc3QgbWF0Y2hlc0ZpbGVQYXRoID0gbWVzc2FnZS5maWxlUGF0aCAmJiB0aGlzLnByb3BlcnRpZXMuZmlsZVBhdGggPT09IG1lc3NhZ2UuZmlsZVBhdGhcbiAgICBjb25zdCBjb250YWluc1Bvc2l0aW9uID0gbWVzc2FnZS5yYW5nZSAmJiB0aGlzLnByb3BlcnRpZXMucG9zaXRpb24gJiYgUmFuZ2UuZnJvbU9iamVjdChtZXNzYWdlLnJhbmdlKS5jb250YWluc1BvaW50KHRoaXMucHJvcGVydGllcy5wb3NpdGlvbilcbiAgICBpZiAobWF0Y2hlc0ZpbGVQYXRoICYmIGNvbnRhaW5zUG9zaXRpb24pIHtcbiAgICAgIHJldHVybiBgJHtjbGFzc05hbWV9IGxhdGV4LWhpZ2hsaWdodGBcbiAgICB9XG5cbiAgICByZXR1cm4gY2xhc3NOYW1lXG4gIH1cblxuICB1cGRhdGUgKHByb3BlcnRpZXMpIHtcbiAgICB0aGlzLnByb3BlcnRpZXMgPSBwcm9wZXJ0aWVzXG4gICAgcmV0dXJuIGV0Y2gudXBkYXRlKHRoaXMpXG4gIH1cbn1cbiJdfQ==