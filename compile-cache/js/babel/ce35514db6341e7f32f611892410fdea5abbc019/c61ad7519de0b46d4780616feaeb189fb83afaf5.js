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

var _messageCount = require('./message-count');

var _messageCount2 = _interopRequireDefault(_messageCount);

var StatusLabel = (function () {
  function StatusLabel() {
    var properties = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, StatusLabel);

    this.properties = properties;
    _etch2['default'].initialize(this);
  }

  _createClass(StatusLabel, [{
    key: 'destroy',
    value: _asyncToGenerator(function* () {
      if (this.tooltip) {
        this.tooltip.dispose();
      }
      yield _etch2['default'].destroy(this);
    })
  }, {
    key: 'render',
    value: function render() {
      return _etch2['default'].dom(
        'div',
        { className: this.getClassNames(), onclick: function () {
            return latex.log.show();
          } },
        _etch2['default'].dom('span', { className: 'icon icon-sync busy' }),
        _etch2['default'].dom(
          'a',
          { href: '#' },
          'LaTeX'
        ),
        _etch2['default'].dom(_messageCount2['default'], { type: 'error' }),
        _etch2['default'].dom(_messageCount2['default'], { type: 'warning' }),
        _etch2['default'].dom(_messageCount2['default'], { type: 'info' })
      );
    }
  }, {
    key: 'getClassNames',
    value: function getClassNames() {
      var className = 'latex-status inline-block';

      if (this.properties.busy) {
        return className + ' is-busy';
      }

      return className;
    }
  }, {
    key: 'update',
    value: function update() {
      var properties = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      Object.assign(this.properties, properties);
      return _etch2['default'].update(this);
    }
  }, {
    key: 'readAfterUpdate',
    value: function readAfterUpdate() {
      if (this.tooltip) {
        this.tooltip.dispose();
        this.tooltop = null;
      }
      this.tooltip = atom.tooltips.add(this.element, { title: 'Click to show LaTeX log' });
    }
  }]);

  return StatusLabel;
})();

exports['default'] = StatusLabel;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2JpbGx5Ly5hdG9tL3BhY2thZ2VzL2xhdGV4L2xpYi92aWV3cy9zdGF0dXMtbGFiZWwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O29CQUdpQixNQUFNOzs7OzRCQUNFLGlCQUFpQjs7OztJQUVyQixXQUFXO0FBQ2xCLFdBRE8sV0FBVyxHQUNBO1FBQWpCLFVBQVUseURBQUcsRUFBRTs7MEJBRFQsV0FBVzs7QUFFNUIsUUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUE7QUFDNUIsc0JBQUssVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFBO0dBQ3RCOztlQUprQixXQUFXOzs2QkFNaEIsYUFBRztBQUNmLFVBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtBQUNoQixZQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFBO09BQ3ZCO0FBQ0QsWUFBTSxrQkFBSyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUE7S0FDekI7OztXQUVNLGtCQUFHO0FBQ1IsYUFDRTs7VUFBSyxTQUFTLEVBQUUsSUFBSSxDQUFDLGFBQWEsRUFBRSxBQUFDLEVBQUMsT0FBTyxFQUFFO21CQUFNLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFO1dBQUEsQUFBQztRQUNwRSxnQ0FBTSxTQUFTLEVBQUMscUJBQXFCLEdBQUc7UUFDeEM7O1lBQUcsSUFBSSxFQUFDLEdBQUc7O1NBQVU7UUFDckIsbURBQWMsSUFBSSxFQUFDLE9BQU8sR0FBRztRQUM3QixtREFBYyxJQUFJLEVBQUMsU0FBUyxHQUFHO1FBQy9CLG1EQUFjLElBQUksRUFBQyxNQUFNLEdBQUc7T0FDeEIsQ0FDUDtLQUNGOzs7V0FFYSx5QkFBRztBQUNmLFVBQU0sU0FBUyw4QkFBOEIsQ0FBQTs7QUFFN0MsVUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRTtBQUN4QixlQUFVLFNBQVMsY0FBVTtPQUM5Qjs7QUFFRCxhQUFPLFNBQVMsQ0FBQTtLQUNqQjs7O1dBRU0sa0JBQWtCO1VBQWpCLFVBQVUseURBQUcsRUFBRTs7QUFDckIsWUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLFVBQVUsQ0FBQyxDQUFBO0FBQzFDLGFBQU8sa0JBQUssTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFBO0tBQ3pCOzs7V0FFZSwyQkFBRztBQUNqQixVQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7QUFDaEIsWUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQTtBQUN0QixZQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQTtPQUNwQjtBQUNELFVBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxFQUFFLEtBQUssRUFBRSx5QkFBeUIsRUFBRSxDQUFDLENBQUE7S0FDckY7OztTQTlDa0IsV0FBVzs7O3FCQUFYLFdBQVciLCJmaWxlIjoiL2hvbWUvYmlsbHkvLmF0b20vcGFja2FnZXMvbGF0ZXgvbGliL3ZpZXdzL3N0YXR1cy1sYWJlbC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBAYmFiZWwgKi9cbi8qKiBAanN4IGV0Y2guZG9tICovXG5cbmltcG9ydCBldGNoIGZyb20gJ2V0Y2gnXG5pbXBvcnQgTWVzc2FnZUNvdW50IGZyb20gJy4vbWVzc2FnZS1jb3VudCdcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3RhdHVzTGFiZWwge1xuICBjb25zdHJ1Y3RvciAocHJvcGVydGllcyA9IHt9KSB7XG4gICAgdGhpcy5wcm9wZXJ0aWVzID0gcHJvcGVydGllc1xuICAgIGV0Y2guaW5pdGlhbGl6ZSh0aGlzKVxuICB9XG5cbiAgYXN5bmMgZGVzdHJveSAoKSB7XG4gICAgaWYgKHRoaXMudG9vbHRpcCkge1xuICAgICAgdGhpcy50b29sdGlwLmRpc3Bvc2UoKVxuICAgIH1cbiAgICBhd2FpdCBldGNoLmRlc3Ryb3kodGhpcylcbiAgfVxuXG4gIHJlbmRlciAoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPXt0aGlzLmdldENsYXNzTmFtZXMoKX0gb25jbGljaz17KCkgPT4gbGF0ZXgubG9nLnNob3coKX0+XG4gICAgICAgIDxzcGFuIGNsYXNzTmFtZT0naWNvbiBpY29uLXN5bmMgYnVzeScgLz5cbiAgICAgICAgPGEgaHJlZj0nIyc+TGFUZVg8L2E+XG4gICAgICAgIDxNZXNzYWdlQ291bnQgdHlwZT0nZXJyb3InIC8+XG4gICAgICAgIDxNZXNzYWdlQ291bnQgdHlwZT0nd2FybmluZycgLz5cbiAgICAgICAgPE1lc3NhZ2VDb3VudCB0eXBlPSdpbmZvJyAvPlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgZ2V0Q2xhc3NOYW1lcyAoKSB7XG4gICAgY29uc3QgY2xhc3NOYW1lID0gYGxhdGV4LXN0YXR1cyBpbmxpbmUtYmxvY2tgXG5cbiAgICBpZiAodGhpcy5wcm9wZXJ0aWVzLmJ1c3kpIHtcbiAgICAgIHJldHVybiBgJHtjbGFzc05hbWV9IGlzLWJ1c3lgXG4gICAgfVxuXG4gICAgcmV0dXJuIGNsYXNzTmFtZVxuICB9XG5cbiAgdXBkYXRlIChwcm9wZXJ0aWVzID0ge30pIHtcbiAgICBPYmplY3QuYXNzaWduKHRoaXMucHJvcGVydGllcywgcHJvcGVydGllcylcbiAgICByZXR1cm4gZXRjaC51cGRhdGUodGhpcylcbiAgfVxuXG4gIHJlYWRBZnRlclVwZGF0ZSAoKSB7XG4gICAgaWYgKHRoaXMudG9vbHRpcCkge1xuICAgICAgdGhpcy50b29sdGlwLmRpc3Bvc2UoKVxuICAgICAgdGhpcy50b29sdG9wID0gbnVsbFxuICAgIH1cbiAgICB0aGlzLnRvb2x0aXAgPSBhdG9tLnRvb2x0aXBzLmFkZCh0aGlzLmVsZW1lbnQsIHsgdGl0bGU6ICdDbGljayB0byBzaG93IExhVGVYIGxvZycgfSlcbiAgfVxufVxuIl19