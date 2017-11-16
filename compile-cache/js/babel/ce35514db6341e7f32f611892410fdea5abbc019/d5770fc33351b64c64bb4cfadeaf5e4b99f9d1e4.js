Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/** @babel */

var _logger = require('../logger');

var _logger2 = _interopRequireDefault(_logger);

var _viewsLogPanel = require('../views/log-panel');

var _viewsLogPanel2 = _interopRequireDefault(_viewsLogPanel);

var _errorMarker = require('../error-marker');

var _errorMarker2 = _interopRequireDefault(_errorMarker);

var _werkzeug = require('../werkzeug');

var DefaultLogger = (function (_Logger) {
  _inherits(DefaultLogger, _Logger);

  function DefaultLogger() {
    _classCallCheck(this, DefaultLogger);

    _get(Object.getPrototypeOf(DefaultLogger.prototype), 'constructor', this).call(this);
    this.logPanel = new _viewsLogPanel2['default']();
    this.viewProvider = atom.views.addViewProvider(DefaultLogger, function (model) {
      return model.logPanel.element;
    });
    this.view = atom.workspace.addBottomPanel({
      item: this,
      visible: false
    });
  }

  _createClass(DefaultLogger, [{
    key: 'destroy',
    value: function destroy() {
      this.destroyErrorMarkers();
      this.viewProvider.dispose();
      this.view.destroy();
    }
  }, {
    key: 'showMessages',
    value: function showMessages(label, messages) {
      this.logPanel.update({ messages: messages });
      this.showErrorMarkers(messages);
      this.initializeStatus(messages);
    }
  }, {
    key: 'initializeStatus',
    value: function initializeStatus(messages) {
      this.type = _logger2['default'].getMostSevereType(messages);
      this.updateStatus();
    }
  }, {
    key: 'updateStatus',
    value: function updateStatus() {
      var _this = this;

      var icon = this.view.isVisible() ? 'chevron-down' : 'chevron-up';
      latex.status.show('LaTeX Log', this.type, icon, false, 'Click to toggle LaTeX log.', function () {
        return _this.toggle();
      });
    }
  }, {
    key: 'showErrorMarkers',
    value: function showErrorMarkers(messages) {
      var editors = atom.workspace.getTextEditors();

      this.destroyErrorMarkers();

      for (var editor of editors) {
        this.showErrorMarkersInEditor(editor, messages);
      }
    }
  }, {
    key: 'showErrorMarkersInEditor',
    value: function showErrorMarkersInEditor(editor, messages) {
      var filePath = editor.getPath();
      if (filePath) {
        var marker = messages.filter(function (message) {
          return message.filePath && message.range && filePath.includes(message.filePath);
        });
        if (marker.length) this.addErrorMarker(editor, marker);
      }
    }
  }, {
    key: 'addErrorMarker',
    value: function addErrorMarker(editor, messages) {
      this.errorMarkers.push(new _errorMarker2['default'](editor, messages));
    }
  }, {
    key: 'show',
    value: function show() {
      if (!this.view.isVisible()) {
        this.view.show();
        this.updateStatus();
      }
    }
  }, {
    key: 'hide',
    value: function hide() {
      if (this.view.isVisible()) {
        this.view.hide();
        this.updateStatus();
      }
    }
  }, {
    key: 'toggle',
    value: function toggle() {
      if (this.view.isVisible()) {
        this.view.hide();
      } else {
        this.view.show();
      }
      this.updateStatus();
    }
  }, {
    key: 'sync',
    value: function sync() {
      var _getEditorDetails = (0, _werkzeug.getEditorDetails)();

      var filePath = _getEditorDetails.filePath;
      var position = _getEditorDetails.position;

      if (filePath) {
        this.show();
        this.logPanel.update({ filePath: filePath, position: position });
      }
    }
  }, {
    key: 'destroyErrorMarkers',
    value: function destroyErrorMarkers() {
      if (this.errorMarkers) {
        for (var errorMarker of this.errorMarkers) {
          errorMarker.clear();
        }
      }
      this.errorMarkers = [];
    }
  }]);

  return DefaultLogger;
})(_logger2['default']);

exports['default'] = DefaultLogger;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2JpbGx5Ly5hdG9tL3BhY2thZ2VzL2xhdGV4L2xpYi9sb2dnZXJzL2RlZmF1bHQtbG9nZ2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7c0JBRW1CLFdBQVc7Ozs7NkJBQ1Qsb0JBQW9COzs7OzJCQUNqQixpQkFBaUI7Ozs7d0JBQ1IsYUFBYTs7SUFFekIsYUFBYTtZQUFiLGFBQWE7O0FBQ3BCLFdBRE8sYUFBYSxHQUNqQjswQkFESSxhQUFhOztBQUU5QiwrQkFGaUIsYUFBYSw2Q0FFdkI7QUFDUCxRQUFJLENBQUMsUUFBUSxHQUFHLGdDQUFjLENBQUE7QUFDOUIsUUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxhQUFhLEVBQzFELFVBQUEsS0FBSzthQUFJLEtBQUssQ0FBQyxRQUFRLENBQUMsT0FBTztLQUFBLENBQUMsQ0FBQTtBQUNsQyxRQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDO0FBQ3hDLFVBQUksRUFBRSxJQUFJO0FBQ1YsYUFBTyxFQUFFLEtBQUs7S0FDZixDQUFDLENBQUE7R0FDSDs7ZUFWa0IsYUFBYTs7V0FZeEIsbUJBQUc7QUFDVCxVQUFJLENBQUMsbUJBQW1CLEVBQUUsQ0FBQTtBQUMxQixVQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxDQUFBO0FBQzNCLFVBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUE7S0FDcEI7OztXQUVZLHNCQUFDLEtBQUssRUFBRSxRQUFRLEVBQUU7QUFDN0IsVUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQTtBQUM1QyxVQUFJLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxDQUFDLENBQUE7QUFDL0IsVUFBSSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxDQUFBO0tBQ2hDOzs7V0FFZ0IsMEJBQUMs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QyxxQkFBVyxDQUFDLEtBQUssRUFBRSxDQUFBO1NBQ3BCO09BQ0Y7QUFDRCxVQUFJLENBQUMsWUFBWSxHQUFHLEVBQUUsQ0FBQTtLQUN2Qjs7O1NBL0ZrQixhQUFhOzs7cUJBQWIsYUFBYSIsImZpbGUiOiIvaG9tZS9iaWxseS8uYXRvbS9wYWNrYWdlcy9sYXRleC9saWIvbG9nZ2Vycy9kZWZhdWx0LWxvZ2dlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBAYmFiZWwgKi9cblxuaW1wb3J0IExvZ2dlciBmcm9tICcuLi9sb2dnZXInXG5pbXBvcnQgTG9nUGFuZWwgZnJvbSAnLi4vdmlld3MvbG9nLXBhbmVsJ1xuaW1wb3J0IEVycm9yTWFya2VyIGZyb20gJy4uL2Vycm9yLW1hcmtlcidcbmltcG9ydCB7IGdldEVkaXRvckRldGFpbHMgfSBmcm9tICcuLi93ZXJremV1ZydcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRGVmYXVsdExvZ2dlciBleHRlbmRzIExvZ2dlciB7XG4gIGNvbnN0cnVjdG9yICgpIHtcbiAgICBzdXBlcigpXG4gICAgdGhpcy5sb2dQYW5lbCA9IG5ldyBMb2dQYW5lbCgpXG4gICAgdGhpcy52aWV3UHJvdmlkZXIgPSBhdG9tLnZpZXdzLmFkZFZpZXdQcm92aWRlcihEZWZhdWx0TG9nZ2VyLFxuICAgICAgbW9kZWwgPT4gbW9kZWwubG9nUGFuZWwuZWxlbWVudClcbiAgICB0aGlzLnZpZXcgPSBhdG9tLndvcmtzcGFjZS5hZGRCb3R0b21QYW5lbCh7XG4gICAgICBpdGVtOiB0aGlzLFxuICAgICAgdmlzaWJsZTogZmFsc2VcbiAgICB9KVxuICB9XG5cbiAgZGVzdHJveSAoKSB7XG4gICAgdGhpcy5kZXN0cm95RXJyb3JNYXJrZXJzKClcbiAgICB0aGlzLnZpZXdQcm92aWRlci5kaXNwb3NlKClcbiAgICB0aGlzLnZpZXcuZGVzdHJveSgpXG4gIH1cblxuICBzaG93TWVzc2FnZXMgKGxhYmVsLCBtZXNzYWdlcykge1xuICAgIHRoaXMubG9nUGFuZWwudXBkYXRlKHsgbWVzc2FnZXM6IG1lc3NhZ2VzIH0pXG4gICAgdGhpcy5zaG93RXJyb3JNYXJrZXJzKG1lc3NhZ2VzKVxuICAgIHRoaXMuaW5pdGlhbGl6ZVN0YXR1cyhtZXNzYWdlcylcbiAgfVxuXG4gIGluaXRpYWxpemVTdGF0dXMgKG1lc3NhZ2VzKSB7XG4gICAgdGhpcy50eXBlID0gTG9nZ2VyLmdldE1vc3RTZXZlcmVUeXBlKG1lc3NhZ2VzKVxuICAgIHRoaXMudXBkYXRlU3RhdHVzKClcbiAgfVxuXG4gIHVwZGF0ZVN0YXR1cyAoKSB7XG4gICAgY29uc3QgaWNvbiA9IHRoaXMudmlldy5pc1Zpc2libGUoKSA/ICdjaGV2cm9uLWRvd24nIDogJ2NoZXZyb24tdXAnXG4gICAgbGF0ZXguc3RhdHVzLnNob3coJ0xhVGVYIExvZycsIHRoaXMudHlwZSwgaWNvbiwgZmFsc2UsICdDbGljayB0byB0b2dnbGUgTGFUZVggbG9nLicsICgpID0+IHRoaXMudG9nZ2xlKCkpXG4gIH1cblxuICBzaG93RXJyb3JNYXJrZXJzIChtZXNzYWdlcykge1xuICAgIGNvbnN0IGVkaXRvcnMgPSBhdG9tLndvcmtzcGFjZS5nZXRUZXh0RWRpdG9ycygpXG5cbiAgICB0aGlzLmRlc3Ryb3lFcnJvck1hcmtlcnMoKVxuXG4gICAgZm9yIChjb25zdCBlZGl0b3Igb2YgZWRpdG9ycykge1xuICAgICAgdGhpcy5zaG93RXJyb3JNYXJrZXJzSW5FZGl0b3IoZWRpdG9yLCBtZXNzYWdlcylcbiAgICB9XG4gIH1cblxuICBzaG93RXJyb3JNYXJrZXJzSW5FZGl0b3IgKGVkaXRvciwgbWVzc2FnZXMpIHtcbiAgICBjb25zdCBmaWxlUGF0aCA9IGVkaXRvci5nZXRQYXRoKClcbiAgICBpZiAoZmlsZVBhdGgpIHtcbiAgICAgIGNvbnN0IG1hcmtlciA9IG1lc3NhZ2VzLmZpbHRlcihtZXNzYWdlID0+XG4gICAgICAgIG1lc3NhZ2UuZmlsZVBhdGggJiYgbWVzc2FnZS5yYW5nZSAmJiBmaWxlUGF0aC5pbmNsdWRlcyhtZXNzYWdlLmZpbGVQYXRoKSlcbiAgICAgIGlmIChtYXJrZXIubGVuZ3RoKSB0aGlzLmFkZEVycm9yTWFya2VyKGVkaXRvciwgbWFya2VyKVxuICAgIH1cbiAgfVxuXG4gIGFkZEVycm9yTWFya2VyIChlZGl0b3IsIG1lc3NhZ2VzKSB7XG4gICAgdGhpcy5lcnJvck1hcmtlcnMucHVzaChuZXcgRXJyb3JNYXJrZXIoZWRpdG9yLCBtZXNzYWdlcykpXG4gIH1cblxuICBzaG93ICgpIHtcbiAgICBpZiAoIXRoaXMudmlldy5pc1Zpc2libGUoKSkge1xuICAgICAgdGhpcy52aWV3LnNob3coKVxuICAgICAgdGhpcy51cGRhdGVTdGF0dXMoKVxuICAgIH1cbiAgfVxuXG4gIGhpZGUgKCkge1xuICAgIGlmICh0aGlzLnZpZXcuaXNWaXNpYmxlKCkpIHtcbiAgICAgIHRoaXMudmlldy5oaWRlKClcbiAgICAgIHRoaXMudXBkYXRlU3RhdHVzKClcbiAgICB9XG4gIH1cblxuICB0b2dnbGUgKCkge1xuICAgIGlmICh0aGlzLnZpZXcuaXNWaXNpYmxlKCkpIHtcbiAgICAgIHRoaXMudmlldy5oaWRlKClcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy52aWV3LnNob3coKVxuICAgIH1cbiAgICB0aGlzLnVwZGF0ZVN0YXR1cygpXG4gIH1cblxuICBzeW5jICgpIHtcbiAgICBjb25zdCB7IGZpbGVQYXRoLCBwb3NpdGlvbiB9ID0gZ2V0RWRpdG9yRGV0YWlscygpXG4gICAgaWYgKGZpbGVQYXRoKSB7XG4gICAgICB0aGlzLnNob3coKVxuICAgICAgdGhpcy5sb2dQYW5lbC51cGRhdGUoeyBmaWxlUGF0aCwgcG9zaXRpb24gfSlcbiAgICB9XG4gIH1cblxuICBkZXN0cm95RXJyb3JNYXJrZXJzICgpIHtcbiAgICBpZiAodGhpcy5lcnJvck1hcmtlcnMpIHtcbiAgICAgIGZvciAoY29uc3QgZXJyb3JNYXJrZXIgb2YgdGhpcy5lcnJvck1hcmtlcnMpIHtcbiAgICAgICAgZXJyb3JNYXJrZXIuY2xlYXIoKVxuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLmVycm9yTWFya2VycyA9IFtdXG4gIH1cbn1cbiJdfQ==