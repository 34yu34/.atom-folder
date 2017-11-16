Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

/** @babel */
/** @jsx etch.dom */

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _etch = require('etch');

var _etch2 = _interopRequireDefault(_etch);

var _logMessage = require('./log-message');

var _logMessage2 = _interopRequireDefault(_logMessage);

var LogPanel = (function () {
  function LogPanel() {
    var _this = this;

    var properties = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, LogPanel);

    this.messages = [];
    this.resizeZero = 0;
    this.height = 100;
    this.mouseMoveListener = function (e) {
      return _this.resize(e);
    };
    this.mouseUpListener = function (e) {
      return _this.stopResize(e);
    };

    this.setProperties(properties);
    _etch2['default'].initialize(this);
  }

  _createClass(LogPanel, [{
    key: 'destroy',
    value: _asyncToGenerator(function* () {
      yield _etch2['default'].destroy(this);
    })
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      // max-height is used so the panel will collapse if possible.
      var style = 'max-height:' + this.height + 'px;';
      var content = this.messages.map(function (message) {
        return _etch2['default'].dom(_logMessage2['default'], { message: message, filePath: _this2.filePath, position: _this2.position });
      });
      if (!content.length) {
        content = _etch2['default'].dom(
          'div',
          null,
          'No LaTeX messages'
        );
      }

      return _etch2['default'].dom(
        'div',
        { className: 'tool-panel panel-bottom latex-log', tabindex: '-1' },
        _etch2['default'].dom('div', { className: 'panel-resize-handle', onmousedown: function (e) {
            return _this2.startResize(e);
          } }),
        _etch2['default'].dom(
          'div',
          { className: 'panel-body', ref: 'body', style: style },
          content
        )
      );
    }
  }, {
    key: 'setProperties',
    value: function setProperties(properties) {
      if (properties.messages) {
        this.messages = _lodash2['default'].sortBy(properties.messages, [function (message) {
          return message.range ? message.range[0][0] : -1;
        }, function (message) {
          return message.logRange ? message.logRange[0][0] : -1;
        }]);
      }
      this.filePath = properties.filePath;
      this.position = properties.position;
    }
  }, {
    key: 'update',
    value: function update(properties) {
      this.setProperties(properties);
      return _etch2['default'].update(this);
    }
  }, {
    key: 'readAfterUpdate',
    value: function readAfterUpdate() {
      // Look for highlighted messages and scroll to them
      var highlighted = this.refs.body.getElementsByClassName('latex-highlight');
      if (highlighted.length) {
        highlighted[0].scrollIntoView();
      }
    }
  }, {
    key: 'startResize',
    value: function startResize(e) {
      this.resizeZero = e.clientY + this.refs.body.offsetHeight;
      this.refs.body.style.height = this.height + 'px';
      this.refs.body.style.maxHeight = '';
      document.addEventListener('mousemove', this.mouseMoveListener, true);
      document.addEventListener('mouseup', this.mouseUpListener, true);
    }
  }, {
    key: 'stopResize',
    value: function stopResize() {
      this.resizing = false;
      document.removeEventListener('mousemove', this.mouseMoveListener, true);
      document.removeEventListener('mouseup', this.mouseMoveUp, true);
    }
  }, {
    key: 'resize',
    value: function resize(e) {
      this.height = Math.max(this.resizeZero - e.clientY, 25);
      this.refs.body.style.height = this.height + 'px';
    }
  }]);

  return LogPanel;
})();

exports['default'] = LogPanel;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2JpbGx5Ly5hdG9tL3BhY2thZ2VzL2xhdGV4L2xpYi92aWV3cy9sb2ctcGFuZWwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O3NCQUdjLFFBQVE7Ozs7b0JBQ0wsTUFBTTs7OzswQkFDQSxlQUFlOzs7O0lBRWpCLFFBQVE7QUFDZixXQURPLFFBQVEsR0FDRzs7O1FBQWpCLFVBQVUseURBQUcsRUFBRTs7MEJBRFQsUUFBUTs7QUFFekIsUUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUE7QUFDbEIsUUFBSSxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUE7QUFDbkIsUUFBSSxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUE7QUFDakIsUUFBSSxDQUFDLGlCQUFpQixHQUFHLFVBQUEsQ0FBQzthQUFJLE1BQUssTUFBTSxDQUFDLENBQUMsQ0FBQztLQUFBLENBQUE7QUFDNUMsUUFBSSxDQUFDLGVBQWUsR0FBRyxVQUFBLENBQUM7YUFBSSxNQUFLLFVBQVUsQ0FBQyxDQUFDLENBQUM7S0FBQSxDQUFBOztBQUU5QyxRQUFJLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxDQUFBO0FBQzlCLHNCQUFLLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQTtHQUN0Qjs7ZUFWa0IsUUFBUTs7NkJBWWIsYUFBRztBQUNmLFlBQU0sa0JBQUssT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFBO0tBQ3pCOzs7V0FFTSxrQkFBRzs7OztBQUVSLFVBQU0sS0FBSyxtQkFBaUIsSUFBSSxDQUFDLE1BQU0sUUFBSyxDQUFBO0FBQzVDLFVBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLFVBQUEsT0FBTztlQUFJLGlEQUFZLE9BQU8sRUFBRSxPQUFPLEFBQUMsRUFBQyxRQUFRLEVBQUUsT0FBSyxRQUFRLEFBQUMsRUFBQyxRQUFRLEVBQUUsT0FBSyxRQUFRLEFBQUMsR0FBRztPQUFBLENBQUMsQ0FBQTtBQUM5SCxVQUFJLENBQUMs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LENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFNLElBQUksQ0FBQyxNQUFNLE9BQUksQ0FBQTtLQUNqRDs7O1NBekVrQixRQUFROzs7cUJBQVIsUUFBUSIsImZpbGUiOiIvaG9tZS9iaWxseS8uYXRvbS9wYWNrYWdlcy9sYXRleC9saWIvdmlld3MvbG9nLXBhbmVsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBiYWJlbCAqL1xuLyoqIEBqc3ggZXRjaC5kb20gKi9cblxuaW1wb3J0IF8gZnJvbSAnbG9kYXNoJ1xuaW1wb3J0IGV0Y2ggZnJvbSAnZXRjaCdcbmltcG9ydCBMb2dNZXNzYWdlIGZyb20gJy4vbG9nLW1lc3NhZ2UnXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExvZ1BhbmVsIHtcbiAgY29uc3RydWN0b3IgKHByb3BlcnRpZXMgPSB7fSkge1xuICAgIHRoaXMubWVzc2FnZXMgPSBbXVxuICAgIHRoaXMucmVzaXplWmVybyA9IDBcbiAgICB0aGlzLmhlaWdodCA9IDEwMFxuICAgIHRoaXMubW91c2VNb3ZlTGlzdGVuZXIgPSBlID0+IHRoaXMucmVzaXplKGUpXG4gICAgdGhpcy5tb3VzZVVwTGlzdGVuZXIgPSBlID0+IHRoaXMuc3RvcFJlc2l6ZShlKVxuXG4gICAgdGhpcy5zZXRQcm9wZXJ0aWVzKHByb3BlcnRpZXMpXG4gICAgZXRjaC5pbml0aWFsaXplKHRoaXMpXG4gIH1cblxuICBhc3luYyBkZXN0cm95ICgpIHtcbiAgICBhd2FpdCBldGNoLmRlc3Ryb3kodGhpcylcbiAgfVxuXG4gIHJlbmRlciAoKSB7XG4gICAgLy8gbWF4LWhlaWdodCBpcyB1c2VkIHNvIHRoZSBwYW5lbCB3aWxsIGNvbGxhcHNlIGlmIHBvc3NpYmxlLlxuICAgIGNvbnN0IHN0eWxlID0gYG1heC1oZWlnaHQ6JHt0aGlzLmhlaWdodH1weDtgXG4gICAgbGV0IGNvbnRlbnQgPSB0aGlzLm1lc3NhZ2VzLm1hcChtZXNzYWdlID0+IDxMb2dNZXNzYWdlIG1lc3NhZ2U9e21lc3NhZ2V9IGZpbGVQYXRoPXt0aGlzLmZpbGVQYXRofSBwb3NpdGlvbj17dGhpcy5wb3NpdGlvbn0gLz4pXG4gICAgaWYgKCFjb250ZW50Lmxlbmd0aCkge1xuICAgICAgY29udGVudCA9IDxkaXY+Tm8gTGFUZVggbWVzc2FnZXM8L2Rpdj5cbiAgICB9XG5cbiAgICByZXR1cm4gPGRpdiBjbGFzc05hbWU9J3Rvb2wtcGFuZWwgcGFuZWwtYm90dG9tIGxhdGV4LWxvZycgdGFiaW5kZXg9Jy0xJz5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPSdwYW5lbC1yZXNpemUtaGFuZGxlJyBvbm1vdXNlZG93bj17ZSA9PiB0aGlzLnN0YXJ0UmVzaXplKGUpfSAvPlxuICAgICAgPGRpdiBjbGFzc05hbWU9J3BhbmVsLWJvZHknIHJlZj0nYm9keScgc3R5bGU9e3N0eWxlfT5cbiAgICAgICAge2NvbnRlbnR9XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgfVxuXG4gIHNldFByb3BlcnRpZXMgKHByb3BlcnRpZXMpIHtcbiAgICBpZiAocHJvcGVydGllcy5tZXNzYWdlcykge1xuICAgICAgdGhpcy5tZXNzYWdlcyA9IF8uc29ydEJ5KHByb3BlcnRpZXMubWVzc2FnZXMsIFtcbiAgICAgICAgbWVzc2FnZSA9PiBtZXNzYWdlLnJhbmdlID8gbWVzc2FnZS5yYW5nZVswXVswXSA6IC0xLFxuICAgICAgICBtZXNzYWdlID0+IG1lc3NhZ2UubG9nUmFuZ2UgPyBtZXNzYWdlLmxvZ1JhbmdlWzBdWzBdIDogLTFcbiAgICAgIF0pXG4gICAgfVxuICAgIHRoaXMuZmlsZVBhdGggPSBwcm9wZXJ0aWVzLmZpbGVQYXRoXG4gICAgdGhpcy5wb3NpdGlvbiA9IHByb3BlcnRpZXMucG9zaXRpb25cbiAgfVxuXG4gIHVwZGF0ZSAocHJvcGVydGllcykge1xuICAgIHRoaXMuc2V0UHJvcGVydGllcyhwcm9wZXJ0aWVzKVxuICAgIHJldHVybiBldGNoLnVwZGF0ZSh0aGlzKVxuICB9XG5cbiAgcmVhZEFmdGVyVXBkYXRlICgpIHtcbiAgICAvLyBMb29rIGZvciBoaWdobGlnaHRlZCBtZXNzYWdlcyBhbmQgc2Nyb2xsIHRvIHRoZW1cbiAgICBjb25zdCBoaWdobGlnaHRlZCA9IHRoaXMucmVmcy5ib2R5LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2xhdGV4LWhpZ2hsaWdodCcpXG4gICAgaWYgKGhpZ2hsaWdodGVkLmxlbmd0aCkge1xuICAgICAgaGlnaGxpZ2h0ZWRbMF0uc2Nyb2xsSW50b1ZpZXcoKVxuICAgIH1cbiAgfVxuXG4gIHN0YXJ0UmVzaXplIChlKSB7XG4gICAgdGhpcy5yZXNpemVaZXJvID0gZS5jbGllbnRZICsgdGhpcy5yZWZzLmJvZHkub2Zmc2V0SGVpZ2h0XG4gICAgdGhpcy5yZWZzLmJvZHkuc3R5bGUuaGVpZ2h0ID0gYCR7dGhpcy5oZWlnaHR9cHhgXG4gICAgdGhpcy5yZWZzLmJvZHkuc3R5bGUubWF4SGVpZ2h0ID0gJydcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCB0aGlzLm1vdXNlTW92ZUxpc3RlbmVyLCB0cnVlKVxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLm1vdXNlVXBMaXN0ZW5lciwgdHJ1ZSlcbiAgfVxuXG4gIHN0b3BSZXNpemUgKCkge1xuICAgIHRoaXMucmVzaXppbmcgPSBmYWxzZVxuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHRoaXMubW91c2VNb3ZlTGlzdGVuZXIsIHRydWUpXG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHRoaXMubW91c2VNb3ZlVXAsIHRydWUpXG4gIH1cblxuICByZXNpemUgKGUpIHtcbiAgICB0aGlzLmhlaWdodCA9IE1hdGgubWF4KHRoaXMucmVzaXplWmVybyAtIGUuY2xpZW50WSwgMjUpXG4gICAgdGhpcy5yZWZzLmJvZHkuc3R5bGUuaGVpZ2h0ID0gYCR7dGhpcy5oZWlnaHR9cHhgXG4gIH1cbn1cbiJdfQ==