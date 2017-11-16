Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/** @babel */

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _atom = require('atom');

var _werkzeug = require('./werkzeug');

var _viewsLogDock = require('./views/log-dock');

var _viewsLogDock2 = _interopRequireDefault(_viewsLogDock);

var Logger = (function (_Disposable) {
  _inherits(Logger, _Disposable);

  function Logger() {
    var _this2 = this;

    _classCallCheck(this, Logger);

    _get(Object.getPrototypeOf(Logger.prototype), 'constructor', this).call(this, function () {
      return _this.disposables.dispose();
    });
    this.disposables = new _atom.CompositeDisposable();
    this.emitter = new _atom.Emitter();

    var _this = this;

    this.loggingLevel = atom.config.get('latex.loggingLevel');
    this.disposables.add(atom.config.onDidChange('latex.loggingLevel', function () {
      _this2.loggingLevel = atom.config.get('latex.loggingLevel');
      _this2.refresh();
    }));
    this.disposables.add(this.emitter);
    this.disposables.add(atom.workspace.addOpener(function (uri) {
      if (uri === _viewsLogDock2['default'].LOG_DOCK_URI) {
        return new _viewsLogDock2['default']();
      }
    }));

    this.messages = [];
  }

  _createClass(Logger, [{
    key: 'onMessages',
    value: function onMessages(callback) {
      return this.emitter.on('messages', callback);
    }
  }, {
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
      message = _lodash2['default'].pickBy(message);
      this.messages.push(message);
      if (this.messageTypeIsVisible(message.type)) {
        this.emitter.emit('messages', { messages: [message], reset: false });
      }
    }
  }, {
    key: 'clear',
    value: function clear() {
      this.messages = [];
      this.refresh();
    }
  }, {
    key: 'refresh',
    value: function refresh() {
      this.emitter.emit('messages', { messages: this.getMessages(), reset: true });
    }
  }, {
    key: 'getMessages',
    value: function getMessages() {
      var _this3 = this;

      var useFilters = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];

      return useFilters ? this.messages.filter(function (message) {
        return _this3.messageTypeIsVisible(message.type);
      }) : this.messages;
    }
  }, {
    key: 'setMessages',
    value: function setMessages(messages) {
      this.messages = messages;
      this.emitter.emit('messages', { messages: messages, reset: true });
    }
  }, {
    key: 'messageTypeIsVisible',
    value: function messageTypeIsVisible(type) {
      return type === 'error' || this.loggingLevel !== 'error' && type === 'warning' || this.loggingLevel === 'info' && type === 'info';
    }
  }, {
    key: 'sync',
    value: _asyncToGenerator(function* () {
      // FIXME: There should be no direct interaction with editors. The required
      //        values should be arguments.

      var _getEditorDetails = (0, _werkzeug.getEditorDetails)();

      var filePath = _getEditorDetails.filePath;
      var position = _getEditorDetails.position;

      if (filePath) {
        var logDock = yield this.show();
        if (logDock) {
          logDock.update({ filePath: filePath, position: position });
        }
      }
    })
  }, {
    key: 'toggle',
    value: _asyncToGenerator(function* () {
      return atom.workspace.toggle(_viewsLogDock2['default'].LOG_DOCK_URI);
    })
  }, {
    key: 'show',
    value: _asyncToGenerator(function* () {
      return atom.workspace.open(_viewsLogDock2['default'].LOG_DOCK_URI);
    })
  }, {
    key: 'hide',
    value: _asyncToGenerator(function* () {
      return atom.workspace.hide(_viewsLogDock2['default'].LOG_DOCK_URI);
    })
  }]);

  return Logger;
})(_atom.Disposable);

exports['default'] = Logger;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2JpbGx5Ly5hdG9tL3BhY2thZ2VzL2xhdGV4L2xpYi9sb2dnZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7O3NCQUVjLFFBQVE7Ozs7b0JBQ21DLE1BQU07O3dCQUM5QixZQUFZOzs0QkFDekIsa0JBQWtCOzs7O0lBRWpCLE1BQU07WUFBTixNQUFNOztBQUliLFdBSk8sTUFBTSxHQUlWOzs7MEJBSkksTUFBTTs7QUFLdkIsK0JBTGlCLE1BQU0sNkNBS2pCO2FBQU0sTUFBSyxXQUFXLENBQUMsT0FBTyxFQUFFO0tBQUEsRUFBQztTQUp6QyxXQUFXLEdBQUcsK0JBQXlCO1NBQ3ZDLE9BQU8sR0FBRyxtQkFBYTs7OztBQUlyQixRQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLG9CQUFvQixDQUFDLENBQUE7QUFDekQsUUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsb0JBQW9CLEVBQUUsWUFBTTtBQUN2RSxhQUFLLFlBQVksR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFBO0FBQ3pELGFBQUssT0FBTyxFQUFFLENBQUE7S0FDZixDQUFDLENBQUMsQ0FBQTtBQUNILFFBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQTtBQUNsQyxRQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxVQUFBLEdBQUcsRUFBSTtBQUNuRCxVQUFJLEdBQUcsS0FBSywwQkFBUSxZQUFZLEVBQUU7QUFDaEMsZUFBTywrQkFBYSxDQUFBO09BQ3JCO0tBQ0YsQ0FBQyxDQUFDLENBQUE7O0FBRUgsUUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUE7R0FDbkI7O2VBbkJrQixNQUFNOztXQXFCZCxv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LEFBQUMsQ0FBQTtLQUNwRDs7OzZCQUVVLGFBQUc7Ozs7OEJBR21CLGlDQUFrQjs7VUFBekMsUUFBUSxxQkFBUixRQUFRO1VBQUUsUUFBUSxxQkFBUixRQUFROztBQUMxQixVQUFJLFFBQVEsRUFBRTtBQUNaLFlBQU0sT0FBTyxHQUFHLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFBO0FBQ2pDLFlBQUksT0FBTyxFQUFFO0FBQ1gsaUJBQU8sQ0FBQyxNQUFNLENBQUMsRUFBRSxRQUFRLEVBQVIsUUFBUSxFQUFFLFFBQVEsRUFBUixRQUFRLEVBQUUsQ0FBQyxDQUFBO1NBQ3ZDO09BQ0Y7S0FDRjs7OzZCQUVZLGFBQUc7QUFDZCxhQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLDBCQUFRLFlBQVksQ0FBQyxDQUFBO0tBQ25EOzs7NkJBRVUsYUFBRztBQUNaLGFBQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsMEJBQVEsWUFBWSxDQUFDLENBQUE7S0FDakQ7Ozs2QkFFVSxhQUFHO0FBQ1osYUFBTyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQywwQkFBUSxZQUFZLENBQUMsQ0FBQTtLQUNqRDs7O1NBN0ZrQixNQUFNOzs7cUJBQU4sTUFBTSIsImZpbGUiOiIvaG9tZS9iaWxseS8uYXRvbS9wYWNrYWdlcy9sYXRleC9saWIvbG9nZ2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBiYWJlbCAqL1xuXG5pbXBvcnQgXyBmcm9tICdsb2Rhc2gnXG5pbXBvcnQgeyBDb21wb3NpdGVEaXNwb3NhYmxlLCBEaXNwb3NhYmxlLCBFbWl0dGVyIH0gZnJvbSAnYXRvbSdcbmltcG9ydCB7IGdldEVkaXRvckRldGFpbHMgfSBmcm9tICcuL3dlcmt6ZXVnJ1xuaW1wb3J0IExvZ0RvY2sgZnJvbSAnLi92aWV3cy9sb2ctZG9jaydcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTG9nZ2VyIGV4dGVuZHMgRGlzcG9zYWJsZSB7XG4gIGRpc3Bvc2FibGVzID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuICBlbWl0dGVyID0gbmV3IEVtaXR0ZXIoKVxuXG4gIGNvbnN0cnVjdG9yICgpIHtcbiAgICBzdXBlcigoKSA9PiB0aGlzLmRpc3Bvc2FibGVzLmRpc3Bvc2UoKSlcbiAgICB0aGlzLmxvZ2dpbmdMZXZlbCA9IGF0b20uY29uZmlnLmdldCgnbGF0ZXgubG9nZ2luZ0xldmVsJylcbiAgICB0aGlzLmRpc3Bvc2FibGVzLmFkZChhdG9tLmNvbmZpZy5vbkRpZENoYW5nZSgnbGF0ZXgubG9nZ2luZ0xldmVsJywgKCkgPT4ge1xuICAgICAgdGhpcy5sb2dnaW5nTGV2ZWwgPSBhdG9tLmNvbmZpZy5nZXQoJ2xhdGV4LmxvZ2dpbmdMZXZlbCcpXG4gICAgICB0aGlzLnJlZnJlc2goKVxuICAgIH0pKVxuICAgIHRoaXMuZGlzcG9zYWJsZXMuYWRkKHRoaXMuZW1pdHRlcilcbiAgICB0aGlzLmRpc3Bvc2FibGVzLmFkZChhdG9tLndvcmtzcGFjZS5hZGRPcGVuZXIodXJpID0+IHtcbiAgICAgIGlmICh1cmkgPT09IExvZ0RvY2suTE9HX0RPQ0tfVVJJKSB7XG4gICAgICAgIHJldHVybiBuZXcgTG9nRG9jaygpXG4gICAgICB9XG4gICAgfSkpXG5cbiAgICB0aGlzLm1lc3NhZ2VzID0gW11cbiAgfVxuXG4gIG9uTWVzc2FnZXMgKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignbWVzc2FnZXMnLCBjYWxsYmFjaylcbiAgfVxuXG4gIGVycm9yICh0ZXh0LCBmaWxlUGF0aCwgcmFuZ2UsIGxvZ1BhdGgsIGxvZ1JhbmdlKSB7XG4gICAgdGhpcy5zaG93TWVzc2FnZSh7IHR5cGU6ICdlcnJvcicsIHRleHQsIGZpbGVQYXRoLCByYW5nZSwgbG9nUGF0aCwgbG9nUmFuZ2UgfSlcbiAgfVxuXG4gIHdhcm5pbmcgKHRleHQsIGZpbGVQYXRoLCByYW5nZSwgbG9nUGF0aCwgbG9nUmFuZ2UpIHtcbiAgICB0aGlzLnNob3dNZXNzYWdlKHsgdHlwZTogJ3dhcm5pbmcnLCB0ZXh0LCBmaWxlUGF0aCwgcmFuZ2UsIGxvZ1BhdGgsIGxvZ1JhbmdlIH0pXG4gIH1cblxuICBpbmZvICh0ZXh0LCBmaWxlUGF0aCwgcmFuZ2UsIGxvZ1BhdGgsIGxvZ1JhbmdlKSB7XG4gICAgdGhpcy5zaG93TWVzc2FnZSh7IHR5cGU6ICdpbmZvJywgdGV4dCwgZmlsZVBhdGgsIHJhbmdlLCBsb2dQYXRoLCBsb2dSYW5nZSB9KVxuICB9XG5cbiAgc2hvd01lc3NhZ2UgKG1lc3NhZ2UpIHtcbiAgICBtZXNzYWdlID0gXy5waWNrQnkobWVzc2FnZSlcbiAgICB0aGlzLm1lc3NhZ2VzLnB1c2gobWVzc2FnZSlcbiAgICBpZiAodGhpcy5tZXNzYWdlVHlwZUlzVmlzaWJsZShtZXNzYWdlLnR5cGUpKSB7XG4gICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnbWVzc2FnZXMnLCB7IG1lc3NhZ2VzOiBbbWVzc2FnZV0sIHJlc2V0OiBmYWxzZSB9KVxuICAgIH1cbiAgfVxuXG4gIGNsZWFyICgpIHtcbiAgICB0aGlzLm1lc3NhZ2VzID0gW11cbiAgICB0aGlzLnJlZnJlc2goKVxuICB9XG5cbiAgcmVmcmVzaCAoKSB7XG4gICAgdGhpcy5lbWl0dGVyLmVtaXQoJ21lc3NhZ2VzJywgeyBtZXNzYWdlczogdGhpcy5nZXRNZXNzYWdlcygpLCByZXNldDogdHJ1ZSB9KVxuICB9XG5cbiAgZ2V0TWVzc2FnZXMgKHVzZUZpbHRlcnMgPSB0cnVlKSB7XG4gICAgcmV0dXJuIHVzZUZpbHRlcnNcbiAgICAgID8gdGhpcy5tZXNzYWdlcy5maWx0ZXIobWVzc2FnZSA9PiB0aGlzLm1lc3NhZ2VUeXBlSXNWaXNpYmxlKG1lc3NhZ2UudHlwZSkpXG4gICAgICA6IHRoaXMubWVzc2FnZXNcbiAgfVxuXG4gIHNldE1lc3NhZ2VzIChtZXNzYWdlcykge1xuICAgIHRoaXMubWVzc2FnZXMgPSBtZXNzYWdlc1xuICAgIHRoaXMuZW1pdHRlci5lbWl0KCdtZXNzYWdlcycsIHsgbWVzc2FnZXMsIHJlc2V0OiB0cnVlIH0pXG4gIH1cblxuICBtZXNzYWdlVHlwZUlzVmlzaWJsZSAodHlwZSkge1xuICAgIHJldHVybiB0eXBlID09PSAnZXJyb3InIHx8XG4gICAgICAodGhpcy5sb2dnaW5nTGV2ZWwgIT09ICdlcnJvcicgJiYgdHlwZSA9PT0gJ3dhcm5pbmcnKSB8fFxuICAgICAgKHRoaXMubG9nZ2luZ0xldmVsID09PSAnaW5mbycgJiYgdHlwZSA9PT0gJ2luZm8nKVxuICB9XG5cbiAgYXN5bmMgc3luYyAoKSB7XG4gICAgLy8gRklYTUU6IFRoZXJlIHNob3VsZCBiZSBubyBkaXJlY3QgaW50ZXJhY3Rpb24gd2l0aCBlZGl0b3JzLiBUaGUgcmVxdWlyZWRcbiAgICAvLyAgICAgICAgdmFsdWVzIHNob3VsZCBiZSBhcmd1bWVudHMuXG4gICAgY29uc3QgeyBmaWxlUGF0aCwgcG9zaXRpb24gfSA9IGdldEVkaXRvckRldGFpbHMoKVxuICAgIGlmIChmaWxlUGF0aCkge1xuICAgICAgY29uc3QgbG9nRG9jayA9IGF3YWl0IHRoaXMuc2hvdygpXG4gICAgICBpZiAobG9nRG9jaykge1xuICAgICAgICBsb2dEb2NrLnVwZGF0ZSh7IGZpbGVQYXRoLCBwb3NpdGlvbiB9KVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGFzeW5jIHRvZ2dsZSAoKSB7XG4gICAgcmV0dXJuIGF0b20ud29ya3NwYWNlLnRvZ2dsZShMb2dEb2NrLkxPR19ET0NLX1VSSSlcbiAgfVxuXG4gIGFzeW5jIHNob3cgKCkge1xuICAgIHJldHVybiBhdG9tLndvcmtzcGFjZS5vcGVuKExvZ0RvY2suTE9HX0RPQ0tfVVJJKVxuICB9XG5cbiAgYXN5bmMgaGlkZSAoKSB7XG4gICAgcmV0dXJuIGF0b20ud29ya3NwYWNlLmhpZGUoTG9nRG9jay5MT0dfRE9DS19VUkkpXG4gIH1cbn1cbiJdfQ==