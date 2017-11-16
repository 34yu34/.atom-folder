Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

/** @babel */

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var Logger = (function () {
  function Logger() {
    _classCallCheck(this, Logger);

    this.messages = [];
    this._group = null;
  }

  _createClass(Logger, [{
    key: 'error',
    value: function error(text, filePath, range, logPath, logRange) {
      this.showMessage({ type: 'error', text: text, filePath: filePath, range: range, logPath: logPath, logRange: logRange });
    }
  }, {
    key: 'warning',
    value: function warning(text, filePath, range, logPath, logRange) {
      this.showMessage({ type: 'warning', text: text, filePath: filePath, range: range, logPath: logPath, logRange: logRange });
    }
  }, {
    key: 'info',
    value: function info(text, filePath, range, logPath, logRange) {
      this.showMessage({ type: 'info', text: text, filePath: filePath, range: range, logPath: logPath, logRange: logRange });
    }
  }, {
    key: 'showMessage',
    value: function showMessage(message) {
      message = Object.assign({ timestamp: Date.now() }, _lodash2['default'].pickBy(message));
      if (this._group) {
        this._group.push(message);
      } else {
        this._label = 'LaTeX Message';
        this._group = [message];
        this.groupEnd();
      }
    }
  }, {
    key: 'group',
    value: function group(label) {
      this._label = label;
      this._group = [];
    }
  }, {
    key: 'groupEnd',
    value: function groupEnd() {
      this.messages = _lodash2['default'].sortBy(this._group, 'filePath', function (message) {
        return message.range || [[-1, -1], [-1, -1]];
      }, 'type', 'timestamp');
      this._group = null;
      this.showFilteredMessages();
    }
  }, {
    key: 'showFilteredMessages',
    value: function showFilteredMessages() {
      var loggingLevel = atom.config.get('latex.loggingLevel');
      var showBuildWarning = loggingLevel !== 'error';
      var showBuildInfo = loggingLevel === 'info';
      var filteredMessages = this.messages.filter(function (message) {
        return message.type === 'error' || showBuildWarning && message.type === 'warning' || showBuildInfo && message.type === 'info';
      });

      this.showMessages(this._label, filteredMessages);
    }
  }, {
    key: 'showMessages',
    value: function showMessages() /* label, messages */{}
  }, {
    key: 'sync',
    value: function sync() {}
  }, {
    key: 'toggle',
    value: function toggle() {}
  }, {
    key: 'show',
    value: function show() {}
  }, {
    key: 'hide',
    value: function hide() {}
  }], [{
    key: 'getMostSevereType',
    value: function getMostSevereType(messages) {
      return messages.reduce(function (type, message) {
        if (type === 'error' || message.type === 'error') return 'error';
        if (type === 'warning' || message.type === 'warning') return 'warning';
        return 'info';
      }, undefined);
    }
  }]);

  return Logger;
})();

exports['default'] = Logger;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2JpbGx5Ly5hdG9tL3BhY2thZ2VzL2xhdGV4L2xpYi9sb2dnZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O3NCQUVjLFFBQVE7Ozs7SUFFRCxNQUFNO0FBQ2IsV0FETyxNQUFNLEdBQ1Y7MEJBREksTUFBTTs7QUFFdkIsUUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUE7QUFDbEIsUUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUE7R0FDbkI7O2VBSmtCLE1BQU07O1dBTW5CLGVBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRTtBQUMvQyxVQUFJLENBQUMsV0FBVyxDQUFDLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUosSUFBSSxFQUFFLFFBQVEsRUFBUixRQUFRLEVBQUUsS0FBSyxFQUFMLEtBQUssRUFBRSxPQUFPLEVBQVAsT0FBTyxFQUFFLFFBQVEsRUFBUixRQUFRLEVBQUUsQ0FBQyxDQUFBO0tBQzlFOzs7V0FFTyxpQkFBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFO0FBQ2pELFVBQUksQ0FBQyxXQUFXLENBQUMsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBSixJQUFJLEVBQUUsUUFBUSxFQUFSLFFBQVEsRUFBRSxLQUFLLEVBQUwsS0FBSyxFQUFFLE9BQU8sRUFBUCxPQUFPLEVBQUUsUUFBUSxFQUFSLFFBQVEsRUFBRSxDQUFDLENBQUE7S0FDaEY7OztXQUVJLGNBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRTtBQUM5QyxVQUFJLENBQUMsV0FBVyxDQUFDLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUosSUFBSSxFQUFFLFFBQVEsRUFBUixRQUFRLEVBQUUsS0FBSyxFQUFMLEtBQUssRUFBRSxPQUFPLEVBQVAsT0FBTyxFQUFFLFFBQVEsRUFBUixRQUFRLEVBQUUsQ0FBQyxDQUFBO0tBQzdFOzs7V0FFVyxxQkFBQyxPQUFPLEVBQUU7QUFDcEIsYUFBTyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxTQUFTLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRSxFQUFFLEVBQUUsb0JBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUE7QUFDckUsVUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFO0FBQ2YsWUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUE7T0FDMUIsTUFBTTtBQUNMLFlBQUksQ0FBQyxNQUFNLEdBQUcsZUFBZSxDQUFBO0FBQzdCLFlBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQTtBQUN2QixZQUFJLENBQUMsUUFBUSxFQUFFLENBQUE7T0FDaEI7S0FDRjs7O1dBRUssZUFBQyxLQUFLLEVBQUU7QUFDWixVQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQTtBQUNuQixVQUFJLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQTtLQUNqQjs7O1dBRVEsb0JBQUc7QUFDVixVQUFJLENBQUMsUUFBUSxHQUFHLG9CQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRSxVQUFBLE9BQU8sRUFBSTtBQUFFLGVBQU8sT0FBTyxDQUFDLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtPQUFFLEVBQUUsTUFBTSxFQUFFLFdBQVcsQ0FBQyxDQUFBO0FBQ25JLFVBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFBO0FBQ2xCLFVBQUksQ0FBQyxvQkFBb0IsRUFBRSxDQUFBO0tBQzVCOzs7V0FFb0IsZ0NBQUc7QUFDdEIsVUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsb0JBQW9CLENBQUMsQ0FBQTtBQUMxRCxVQUFNLGdCQUFnQixHQUFHLFlBQVksS0FBSyxPQUFPLENBQUE7QUFDakQsVUFBTSxhQUFhLEdBQUcsWUFBWSxLQUFLLE1BQU0sQ0FBQTtBQUM3QyxVQUFNLGdCQUFnQixHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLFVBQUEsT0FBTztlQUNuRCxPQUFPLENBQUMsSUFBSSxLQUFLLE9BQU8sSUFBSyxnQkFBZ0IsSUFBSSxPQUFPLENBQUMsSUFBSSxLQUFLLFNBQVMsQUFBQyxJQUFLLGFBQWEsSUFBSSxPQUFPLENBQUMsSUFBSSxLQUFLLE1BQU0sQUFBQztPQUFBLENBQUMsQ0FBQTs7QUFFN0gsVUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLGdCQUFnQixDQUFDLENBQUE7S0FDakQ7OztXQVVZLDZDQUF3QixFQUFFOzs7V0FDbEMsZ0JBQUcsRUFBRTs7O1dBQ0gsa0JBQUcsRUFBRTs7O1dBQ1AsZ0JBQUcsRUFBRTs7O1dBQ0wsZ0JBQUcsRUFBRTs7O1dBWmUsMkJBQUMsUUFBUSxFQUFFO0FBQ2xDLGFBQU8sUUFBUSxDQUFDLE1BQU0sQ0FBQyxVQUFDLElBQUksRUFBRSxPQUFPLEVBQUs7QUFDeEMsWUFBSSxJQUFJLEtBQUssT0FBTyxJQUFJLE9BQU8sQ0FBQyxJQUFJLEtBQUssT0FBTyxFQUFFLE9BQU8sT0FBTyxDQUFBO0FBQ2hFLFlBQUksSUFBSSxLQUFLLFNBQVMsSUFBSSxPQUFPLENBQUMsSUFBSSxLQUFLLFNBQVMsRUFBRSxPQUFPLFNBQVMsQ0FBQTtBQUN0RSxlQUFPLE1BQU0sQ0FBQTtPQUNkLEVBQUUsU0FBUyxDQUFDLENBQUE7S0FDZDs7O1NBeERrQixNQUFNOzs7cUJBQU4sTUFBTSIsImZpbGUiOiIvaG9tZS9iaWxseS8uYXRvbS9wYWNrYWdlcy9sYXRleC9saWIvbG9nZ2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBiYWJlbCAqL1xuXG5pbXBvcnQgXyBmcm9tICdsb2Rhc2gnXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExvZ2dlciB7XG4gIGNvbnN0cnVjdG9yICgpIHtcbiAgICB0aGlzLm1lc3NhZ2VzID0gW11cbiAgICB0aGlzLl9ncm91cCA9IG51bGxcbiAgfVxuXG4gIGVycm9yICh0ZXh0LCBmaWxlUGF0aCwgcmFuZ2UsIGxvZ1BhdGgsIGxvZ1JhbmdlKSB7XG4gICAgdGhpcy5zaG93TWVzc2FnZSh7IHR5cGU6ICdlcnJvcicsIHRleHQsIGZpbGVQYXRoLCByYW5nZSwgbG9nUGF0aCwgbG9nUmFuZ2UgfSlcbiAgfVxuXG4gIHdhcm5pbmcgKHRleHQsIGZpbGVQYXRoLCByYW5nZSwgbG9nUGF0aCwgbG9nUmFuZ2UpIHtcbiAgICB0aGlzLnNob3dNZXNzYWdlKHsgdHlwZTogJ3dhcm5pbmcnLCB0ZXh0LCBmaWxlUGF0aCwgcmFuZ2UsIGxvZ1BhdGgsIGxvZ1JhbmdlIH0pXG4gIH1cblxuICBpbmZvICh0ZXh0LCBmaWxlUGF0aCwgcmFuZ2UsIGxvZ1BhdGgsIGxvZ1JhbmdlKSB7XG4gICAgdGhpcy5zaG93TWVzc2FnZSh7IHR5cGU6ICdpbmZvJywgdGV4dCwgZmlsZVBhdGgsIHJhbmdlLCBsb2dQYXRoLCBsb2dSYW5nZSB9KVxuICB9XG5cbiAgc2hvd01lc3NhZ2UgKG1lc3NhZ2UpIHtcbiAgICBtZXNzYWdlID0gT2JqZWN0LmFzc2lnbih7IHRpbWVzdGFtcDogRGF0ZS5ub3coKSB9LCBfLnBpY2tCeShtZXNzYWdlKSlcbiAgICBpZiAodGhpcy5fZ3JvdXApIHtcbiAgICAgIHRoaXMuX2dyb3VwLnB1c2gobWVzc2FnZSlcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fbGFiZWwgPSAnTGFUZVggTWVzc2FnZSdcbiAgICAgIHRoaXMuX2dyb3VwID0gW21lc3NhZ2VdXG4gICAgICB0aGlzLmdyb3VwRW5kKClcbiAgICB9XG4gIH1cblxuICBncm91cCAobGFiZWwpIHtcbiAgICB0aGlzLl9sYWJlbCA9IGxhYmVsXG4gICAgdGhpcy5fZ3JvdXAgPSBbXVxuICB9XG5cbiAgZ3JvdXBFbmQgKCkge1xuICAgIHRoaXMubWVzc2FnZXMgPSBfLnNvcnRCeSh0aGlzLl9ncm91cCwgJ2ZpbGVQYXRoJywgbWVzc2FnZSA9PiB7IHJldHVybiBtZXNzYWdlLnJhbmdlIHx8IFtbLTEsIC0xXSwgWy0xLCAtMV1dIH0sICd0eXBlJywgJ3RpbWVzdGFtcCcpXG4gICAgdGhpcy5fZ3JvdXAgPSBudWxsXG4gICAgdGhpcy5zaG93RmlsdGVyZWRNZXNzYWdlcygpXG4gIH1cblxuICBzaG93RmlsdGVyZWRNZXNzYWdlcyAoKSB7XG4gICAgY29uc3QgbG9nZ2luZ0xldmVsID0gYXRvbS5jb25maWcuZ2V0KCdsYXRleC5sb2dnaW5nTGV2ZWwnKVxuICAgIGNvbnN0IHNob3dCdWlsZFdhcm5pbmcgPSBsb2dnaW5nTGV2ZWwgIT09ICdlcnJvcidcbiAgICBjb25zdCBzaG93QnVpbGRJbmZvID0gbG9nZ2luZ0xldmVsID09PSAnaW5mbydcbiAgICBjb25zdCBmaWx0ZXJlZE1lc3NhZ2VzID0gdGhpcy5tZXNzYWdlcy5maWx0ZXIobWVzc2FnZSA9PlxuICAgICAgbWVzc2FnZS50eXBlID09PSAnZXJyb3InIHx8IChzaG93QnVpbGRXYXJuaW5nICYmIG1lc3NhZ2UudHlwZSA9PT0gJ3dhcm5pbmcnKSB8fCAoc2hvd0J1aWxkSW5mbyAmJiBtZXNzYWdlLnR5cGUgPT09ICdpbmZvJykpXG5cbiAgICB0aGlzLnNob3dNZXNzYWdlcyh0aGlzLl9sYWJlbCwgZmlsdGVyZWRNZXNzYWdlcylcbiAgfVxuXG4gIHN0YXRpYyBnZXRNb3N0U2V2ZXJlVHlwZSAobWVzc2FnZXMpIHtcbiAgICByZXR1cm4gbWVzc2FnZXMucmVkdWNlKCh0eXBlLCBtZXNzYWdlKSA9PiB7XG4gICAgICBpZiAodHlwZSA9PT0gJ2Vycm9yJyB8fCBtZXNzYWdlLnR5cGUgPT09ICdlcnJvcicpIHJldHVybiAnZXJyb3InXG4gICAgICBpZiAodHlwZSA9PT0gJ3dhcm5pbmcnIHx8IG1lc3NhZ2UudHlwZSA9PT0gJ3dhcm5pbmcnKSByZXR1cm4gJ3dhcm5pbmcnXG4gICAgICByZXR1cm4gJ2luZm8nXG4gICAgfSwgdW5kZWZpbmVkKVxuICB9XG5cbiAgc2hvd01lc3NhZ2VzICgvKiBsYWJlbCwgbWVzc2FnZXMgKi8pIHt9XG4gIHN5bmMgKCkge31cbiAgdG9nZ2xlICgpIHt9XG4gIHNob3cgKCkge31cbiAgaGlkZSAoKSB7fVxufVxuIl19