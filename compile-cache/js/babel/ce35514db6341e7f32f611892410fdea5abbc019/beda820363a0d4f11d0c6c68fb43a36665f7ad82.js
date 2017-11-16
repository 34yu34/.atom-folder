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

var MessageCount = (function () {
  function MessageCount() {
    var _this = this;

    var properties = arguments.length <= 0 || arguments[0] === undefined ? { type: 'error' } : arguments[0];

    _classCallCheck(this, MessageCount);

    this.disposables = new _atom.CompositeDisposable();

    this.properties = properties;
    _etch2['default'].initialize(this);
    this.disposables.add(latex.log.onMessages(function () {
      return _this.update();
    }));
  }

  _createClass(MessageCount, [{
    key: 'destroy',
    value: _asyncToGenerator(function* () {
      yield _etch2['default'].destroy(this);
      this.disposables.dispose();
    })
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      if (latex.log.messageTypeIsVisible(this.properties.type)) {
        var counts = latex.log.getMessages().reduce(function (total, message) {
          return message.type === _this2.properties.type ? total + 1 : total;
        }, 0);

        return _etch2['default'].dom(
          'span',
          { className: 'latex-' + this.properties.type + ' latex-message-count' },
          _etch2['default'].dom(_messageIcon2['default'], { type: this.properties.type }),
          counts
        );
      }

      return _etch2['default'].dom('span', null);
    }
  }, {
    key: 'update',
    value: function update() {
      var properties = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      Object.assign(this.properties, properties);
      return _etch2['default'].update(this);
    }
  }]);

  return MessageCount;
})();

exports['default'] = MessageCount;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2JpbGx5Ly5hdG9tL3BhY2thZ2VzL2xhdGV4L2xpYi92aWV3cy9tZXNzYWdlLWNvdW50LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztvQkFHaUIsTUFBTTs7OztvQkFDYSxNQUFNOzsyQkFDbEIsZ0JBQWdCOzs7O0lBRW5CLFlBQVk7QUFHbkIsV0FITyxZQUFZLEdBR2M7OztRQUFoQyxVQUFVLHlEQUFHLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRTs7MEJBSHhCLFlBQVk7O1NBQy9CLFdBQVcsR0FBRywrQkFBeUI7O0FBR3JDLFFBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFBO0FBQzVCLHNCQUFLLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQTtBQUNyQixRQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQzthQUFNLE1BQUssTUFBTSxFQUFFO0tBQUEsQ0FBQyxDQUFDLENBQUE7R0FDaEU7O2VBUGtCLFlBQVk7OzZCQVNqQixhQUFHO0FBQ2YsWUFBTSxrQkFBSyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUE7QUFDeEIsVUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtLQUMzQjs7O1dBRU0sa0JBQUc7OztBQUNSLFVBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxFQUFFO0FBQ3hELFlBQU0sTUFBTSxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLENBQUMsTUFBTSxDQUFDLFVBQUMsS0FBSyxFQUFFLE9BQU87aUJBQUssT0FBTyxDQUFDLElBQUksS0FBSyxPQUFLLFVBQVUsQ0FBQyxJQUFJLEdBQUcsS0FBSyxHQUFHLENBQUMsR0FBRyxLQUFLO1NBQUEsRUFBRSxDQUFDLENBQUMsQ0FBQTs7QUFFL0gsZUFDRTs7WUFBTSxTQUFTLGFBQVcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLHlCQUF1QjtVQUNuRSxrREFBYSxJQUFJLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEFBQUMsR0FBRztVQUMxQyxNQUFNO1NBQ0YsQ0FDUjtPQUNGOztBQUVELGFBQU8sbUNBQVEsQ0FBQTtLQUNoQjs7O1dBRU0sa0JBQWtCO1VBQWpCLFVBQVUseURBQUcsRUFBRTs7QUFDckIsWUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLFVBQVUsQ0FBQyxDQUFBO0FBQzFDLGFBQU8sa0JBQUssTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFBO0tBQ3pCOzs7U0FoQ2tCLFlBQVk7OztxQkFBWixZQUFZIiwiZmlsZSI6Ii9ob21lL2JpbGx5Ly5hdG9tL3BhY2thZ2VzL2xhdGV4L2xpYi92aWV3cy9tZXNzYWdlLWNvdW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBiYWJlbCAqL1xuLyoqIEBqc3ggZXRjaC5kb20gKi9cblxuaW1wb3J0IGV0Y2ggZnJvbSAnZXRjaCdcbmltcG9ydCB7IENvbXBvc2l0ZURpc3Bvc2FibGUgfSBmcm9tICdhdG9tJ1xuaW1wb3J0IE1lc3NhZ2VJY29uIGZyb20gJy4vbWVzc2FnZS1pY29uJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNZXNzYWdlQ291bnQge1xuICBkaXNwb3NhYmxlcyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcblxuICBjb25zdHJ1Y3RvciAocHJvcGVydGllcyA9IHsgdHlwZTogJ2Vycm9yJyB9KSB7XG4gICAgdGhpcy5wcm9wZXJ0aWVzID0gcHJvcGVydGllc1xuICAgIGV0Y2guaW5pdGlhbGl6ZSh0aGlzKVxuICAgIHRoaXMuZGlzcG9zYWJsZXMuYWRkKGxhdGV4LmxvZy5vbk1lc3NhZ2VzKCgpID0+IHRoaXMudXBkYXRlKCkpKVxuICB9XG5cbiAgYXN5bmMgZGVzdHJveSAoKSB7XG4gICAgYXdhaXQgZXRjaC5kZXN0cm95KHRoaXMpXG4gICAgdGhpcy5kaXNwb3NhYmxlcy5kaXNwb3NlKClcbiAgfVxuXG4gIHJlbmRlciAoKSB7XG4gICAgaWYgKGxhdGV4LmxvZy5tZXNzYWdlVHlwZUlzVmlzaWJsZSh0aGlzLnByb3BlcnRpZXMudHlwZSkpIHtcbiAgICAgIGNvbnN0IGNvdW50cyA9IGxhdGV4LmxvZy5nZXRNZXNzYWdlcygpLnJlZHVjZSgodG90YWwsIG1lc3NhZ2UpID0+IG1lc3NhZ2UudHlwZSA9PT0gdGhpcy5wcm9wZXJ0aWVzLnR5cGUgPyB0b3RhbCArIDEgOiB0b3RhbCwgMClcblxuICAgICAgcmV0dXJuIChcbiAgICAgICAgPHNwYW4gY2xhc3NOYW1lPXtgbGF0ZXgtJHt0aGlzLnByb3BlcnRpZXMudHlwZX0gbGF0ZXgtbWVzc2FnZS1jb3VudGB9PlxuICAgICAgICAgIDxNZXNzYWdlSWNvbiB0eXBlPXt0aGlzLnByb3BlcnRpZXMudHlwZX0gLz5cbiAgICAgICAgICB7Y291bnRzfVxuICAgICAgICA8L3NwYW4+XG4gICAgICApXG4gICAgfVxuXG4gICAgcmV0dXJuIDxzcGFuIC8+XG4gIH1cblxuICB1cGRhdGUgKHByb3BlcnRpZXMgPSB7fSkge1xuICAgIE9iamVjdC5hc3NpZ24odGhpcy5wcm9wZXJ0aWVzLCBwcm9wZXJ0aWVzKVxuICAgIHJldHVybiBldGNoLnVwZGF0ZSh0aGlzKVxuICB9XG59XG4iXX0=