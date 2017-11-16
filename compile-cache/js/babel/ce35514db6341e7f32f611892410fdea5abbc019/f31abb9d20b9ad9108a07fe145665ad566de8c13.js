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

var _logMessage = require('./log-message');

var _logMessage2 = _interopRequireDefault(_logMessage);

var LogDock = (function () {
  _createClass(LogDock, null, [{
    key: 'LOG_DOCK_URI',
    value: 'atom://latex/log',
    enumerable: true
  }]);

  function LogDock() {
    var _this = this;

    var properties = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, LogDock);

    this.disposables = new _atom.CompositeDisposable();

    this.properties = properties;
    _etch2['default'].initialize(this);
    this.disposables.add(latex.log.onMessages(function () {
      return _this.update();
    }));
  }

  _createClass(LogDock, [{
    key: 'destroy',
    value: _asyncToGenerator(function* () {
      this.disposables.dispose();
      yield _etch2['default'].destroy(this);
    })
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var content = latex.log.getMessages().map(function (message) {
        return _etch2['default'].dom(_logMessage2['default'], { message: message, filePath: _this2.properties.filePath, position: _this2.properties.position });
      });

      return _etch2['default'].dom(
        'div',
        { className: 'latex-log', ref: 'body' },
        _etch2['default'].dom(
          'div',
          { className: 'log-block expand' },
          _etch2['default'].dom(
            'table',
            null,
            _etch2['default'].dom(
              'thead',
              null,
              _etch2['default'].dom(
                'tr',
                null,
                _etch2['default'].dom('th', null),
                _etch2['default'].dom(
                  'th',
                  null,
                  'Message'
                ),
                _etch2['default'].dom(
                  'th',
                  null,
                  'Source File'
                ),
                _etch2['default'].dom(
                  'th',
                  null,
                  'Log File'
                )
              )
            ),
            _etch2['default'].dom(
              'tbody',
              null,
              content
            )
          )
        )
      );
    }
  }, {
    key: 'update',
    value: function update() {
      var properties = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      this.properties = properties;
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
    key: 'getTitle',
    value: function getTitle() {
      return 'LaTeX Log';
    }
  }, {
    key: 'getURI',
    value: function getURI() {
      return LogDock.LOG_DOCK_URI;
    }
  }, {
    key: 'getDefaultLocation',
    value: function getDefaultLocation() {
      return 'bottom';
    }
  }, {
    key: 'serialize',
    value: function serialize() {
      return {
        deserializer: 'latex/log'
      };
    }
  }]);

  return LogDock;
})();

exports['default'] = LogDock;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2JpbGx5Ly5hdG9tL3BhY2thZ2VzL2xhdGV4L2xpYi92aWV3cy9sb2ctZG9jay5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7b0JBR2lCLE1BQU07Ozs7b0JBQ2EsTUFBTTs7MEJBQ25CLGVBQWU7Ozs7SUFFakIsT0FBTztlQUFQLE9BQU87O1dBQ0osa0JBQWtCOzs7O0FBSTVCLFdBTE8sT0FBTyxHQUtJOzs7UUFBakIsVUFBVSx5REFBRyxFQUFFOzswQkFMVCxPQUFPOztTQUcxQixXQUFXLEdBQUcsK0JBQXlCOztBQUdyQyxRQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQTtBQUM1QixzQkFBSyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUE7QUFDckIsUUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUM7YUFBTSxNQUFLLE1BQU0sRUFBRTtLQUFBLENBQUMsQ0FBQyxDQUFBO0dBQ2hFOztlQVRrQixPQUFPOzs2QkFXWixhQUFHO0FBQ2YsVUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtBQUMxQixZQUFNLGtCQUFLLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQTtLQUN6Qjs7O1dBRU0sa0JBQUc7OztBQUNSLFVBQUksT0FBTyxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLENBQUMsR0FBRyxDQUFDLFVBQUEsT0FBTztlQUFJLGlEQUFZLE9BQU8sRUFBRSxPQUFPLEFBQUMsRUFBQyxRQUFRLEVBQUUsT0FBSyxVQUFVLENBQUMsUUFBUSxBQUFDLEVBQUMsUUFBUSxFQUFFLE9BQUssVUFBVSxDQUFDLFFBQVEsQUFBQyxHQUFHO09BQUEsQ0FBQyxDQUFBOztBQUU5SixhQUNFOztVQUFLLFNBQVMsRUFBQyxXQUFXLEVBQUMsR0FBRyxFQUFDLE1BQU07UUFDbkM7O1lBQUssU0FBUyxFQUFDLGtCQUFrQjtVQUMvQjs7O1lBQ0U7OztjQUNFOzs7Z0JBQ0UsaUNBQU07Z0JBQ047Ozs7aUJBQWdCO2dCQUNoQjs7OztpQkFBeUI7Z0JBQ3pCOzs7O2lCQUFzQjtlQUNuQjthQUNDO1lBQ1I7OztjQUFRLE9BQU87YUFBUztXQUNsQjtTQUNKO09BQ0YsQ0FDUDtLQUNGOzs7V0FFTSxrQkFBa0I7VUFBakIsVUFBVSx5REFBRyxFQUFFOztBQUNyQixVQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQTtBQUM1QixhQUFPLGtCQUFLLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQTtLQUN6Qjs7O1dBRWUsMkJBQUc7O0FBRWpCLFVBQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLHNCQUFzQixDQUFDLGlCQUFpQixDQUFDLENBQUE7QUFDNUUsVUFBSSxXQUFXLENBQUMsTUFBTSxFQUFFO0FBQ3RCLG1CQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsY0FBYyxFQUFFLENBQUE7T0FDaEM7S0FDRjs7O1dBRVEsb0JBQUc7QUFDVixhQUFPLFdBQVcsQ0FBQTtLQUNuQjs7O1dBRU0sa0JBQUc7QUFDUixhQUFPLE9BQU8sQ0FBQyxZQUFZLENBQUE7S0FDNUI7OztXQUVrQiw4QkFBRztBQUNwQixhQUFPLFFBQVEsQ0FBQTtLQUNoQjs7O1dBRVMscUJBQUc7QUFDWCxhQUFPO0FBQ0wsb0JBQVksRUFBRSxXQUFXO09BQzFCLENBQUE7S0FDRjs7O1NBbkVrQixPQUFPOzs7cUJBQVAsT0FBTyIsImZpbGUiOiIvaG9tZS9iaWxseS8uYXRvbS9wYWNrYWdlcy9sYXRleC9saWIvdmlld3MvbG9nLWRvY2suanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiogQGJhYmVsICovXG4vKiogQGpzeCBldGNoLmRvbSAqL1xuXG5pbXBvcnQgZXRjaCBmcm9tICdldGNoJ1xuaW1wb3J0IHsgQ29tcG9zaXRlRGlzcG9zYWJsZSB9IGZyb20gJ2F0b20nXG5pbXBvcnQgTG9nTWVzc2FnZSBmcm9tICcuL2xvZy1tZXNzYWdlJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMb2dEb2NrIHtcbiAgc3RhdGljIExPR19ET0NLX1VSSSA9ICdhdG9tOi8vbGF0ZXgvbG9nJ1xuXG4gIGRpc3Bvc2FibGVzID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuXG4gIGNvbnN0cnVjdG9yIChwcm9wZXJ0aWVzID0ge30pIHtcbiAgICB0aGlzLnByb3BlcnRpZXMgPSBwcm9wZXJ0aWVzXG4gICAgZXRjaC5pbml0aWFsaXplKHRoaXMpXG4gICAgdGhpcy5kaXNwb3NhYmxlcy5hZGQobGF0ZXgubG9nLm9uTWVzc2FnZXMoKCkgPT4gdGhpcy51cGRhdGUoKSkpXG4gIH1cblxuICBhc3luYyBkZXN0cm95ICgpIHtcbiAgICB0aGlzLmRpc3Bvc2FibGVzLmRpc3Bvc2UoKVxuICAgIGF3YWl0IGV0Y2guZGVzdHJveSh0aGlzKVxuICB9XG5cbiAgcmVuZGVyICgpIHtcbiAgICBsZXQgY29udGVudCA9IGxhdGV4LmxvZy5nZXRNZXNzYWdlcygpLm1hcChtZXNzYWdlID0+IDxMb2dNZXNzYWdlIG1lc3NhZ2U9e21lc3NhZ2V9IGZpbGVQYXRoPXt0aGlzLnByb3BlcnRpZXMuZmlsZVBhdGh9IHBvc2l0aW9uPXt0aGlzLnByb3BlcnRpZXMucG9zaXRpb259IC8+KVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPSdsYXRleC1sb2cnIHJlZj0nYm9keSc+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPSdsb2ctYmxvY2sgZXhwYW5kJz5cbiAgICAgICAgICA8dGFibGU+XG4gICAgICAgICAgICA8dGhlYWQ+XG4gICAgICAgICAgICAgIDx0cj5cbiAgICAgICAgICAgICAgICA8dGggLz5cbiAgICAgICAgICAgICAgICA8dGg+TWVzc2FnZTwvdGg+XG4gICAgICAgICAgICAgICAgPHRoPlNvdXJjZSZuYnNwO0ZpbGU8L3RoPlxuICAgICAgICAgICAgICAgIDx0aD5Mb2cmbmJzcDtGaWxlPC90aD5cbiAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgIDwvdGhlYWQ+XG4gICAgICAgICAgICA8dGJvZHk+e2NvbnRlbnR9PC90Ym9keT5cbiAgICAgICAgICA8L3RhYmxlPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIHVwZGF0ZSAocHJvcGVydGllcyA9IHt9KSB7XG4gICAgdGhpcy5wcm9wZXJ0aWVzID0gcHJvcGVydGllc1xuICAgIHJldHVybiBldGNoLnVwZGF0ZSh0aGlzKVxuICB9XG5cbiAgcmVhZEFmdGVyVXBkYXRlICgpIHtcbiAgICAvLyBMb29rIGZvciBoaWdobGlnaHRlZCBtZXNzYWdlcyBhbmQgc2Nyb2xsIHRvIHRoZW1cbiAgICBjb25zdCBoaWdobGlnaHRlZCA9IHRoaXMucmVmcy5ib2R5LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2xhdGV4LWhpZ2hsaWdodCcpXG4gICAgaWYgKGhpZ2hsaWdodGVkLmxlbmd0aCkge1xuICAgICAgaGlnaGxpZ2h0ZWRbMF0uc2Nyb2xsSW50b1ZpZXcoKVxuICAgIH1cbiAgfVxuXG4gIGdldFRpdGxlICgpIHtcbiAgICByZXR1cm4gJ0xhVGVYIExvZydcbiAgfVxuXG4gIGdldFVSSSAoKSB7XG4gICAgcmV0dXJuIExvZ0RvY2suTE9HX0RPQ0tfVVJJXG4gIH1cblxuICBnZXREZWZhdWx0TG9jYXRpb24gKCkge1xuICAgIHJldHVybiAnYm90dG9tJ1xuICB9XG5cbiAgc2VyaWFsaXplICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgZGVzZXJpYWxpemVyOiAnbGF0ZXgvbG9nJ1xuICAgIH1cbiAgfVxufVxuIl19