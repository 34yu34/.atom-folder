Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/** @babel */

var _viewsStatusLabel = require('./views/status-label');

var _viewsStatusLabel2 = _interopRequireDefault(_viewsStatusLabel);

var _atom = require('atom');

var StatusIndicator = (function (_Disposable) {
  _inherits(StatusIndicator, _Disposable);

  function StatusIndicator() {
    _classCallCheck(this, StatusIndicator);

    _get(Object.getPrototypeOf(StatusIndicator.prototype), 'constructor', this).call(this, function () {
      return _this.detachStatusBar();
    });

    var _this = this;
  }

  _createClass(StatusIndicator, [{
    key: 'attachStatusBar',
    value: function attachStatusBar(statusBar) {
      this.statusLabel = new _viewsStatusLabel2['default']();
      this.statusTile = statusBar.addLeftTile({
        item: this.statusLabel,
        priority: 9001
      });
    }
  }, {
    key: 'detachStatusBar',
    value: function detachStatusBar() {
      if (this.statusTile) {
        this.statusTile.destroy();
        this.statusTile = null;
      }
      if (this.statusLabel) {
        this.statusLabel.destroy();
        this.statusLabel = null;
      }
    }
  }, {
    key: 'setBusy',
    value: function setBusy() {
      if (this.statusLabel) {
        this.statusLabel.update({ busy: true });
      }
    }
  }, {
    key: 'setIdle',
    value: function setIdle() {
      if (this.statusLabel) {
        this.statusLabel.update({ busy: false });
      }
    }
  }, {
    key: 'show',
    value: function show(text, type, icon, spin, title, onClick) {
      if (this.statusLabel) {
        this.statusLabel.update({ text: text, type: type, icon: icon, spin: spin, title: title, onClick: onClick });
      }
    }
  }]);

  return StatusIndicator;
})(_atom.Disposable);

exports['default'] = StatusIndicator;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2JpbGx5Ly5hdG9tL3BhY2thZ2VzL2xhdGV4L2xpYi9zdGF0dXMtaW5kaWNhdG9yLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Z0NBRXdCLHNCQUFzQjs7OztvQkFDbkIsTUFBTTs7SUFFWixlQUFlO1lBQWYsZUFBZTs7QUFDdEIsV0FETyxlQUFlLEdBQ25COzBCQURJLGVBQWU7O0FBRWhDLCtCQUZpQixlQUFlLDZDQUUxQjthQUFNLE1BQUssZUFBZSxFQUFFO0tBQUEsRUFBQzs7O0dBQ3BDOztlQUhrQixlQUFlOztXQUtsQix5QkFBQyxTQUFTLEVBQUU7QUFDMUIsVUFBSSxDQUFDLFdBQVcsR0FBRyxtQ0FBaUIsQ0FBQTtBQUNwQyxVQUFJLENBQUMsVUFBVSxHQUFHLFNBQVMsQ0FBQyxXQUFXLENBQUM7QUFDdEMsWUFBSSxFQUFFLElBQUksQ0FBQyxXQUFXO0FBQ3RCLGdCQUFRLEVBQUUsSUFBSTtPQUNmLENBQUMsQ0FBQTtLQUNIOzs7V0FFZSwyQkFBRztBQUNqQixVQUFJLElBQUksQ0FBQyxVQUFVLEVBQUU7QUFDbkIsWUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtBQUN6QixZQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQTtPQUN2QjtBQUNELFVBQUksSUFBSSxDQUFDLFdBQVcsRUFBRTtBQUNwQixZQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sRUFBRSxDQUFBO0FBQzFCLFlBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFBO09BQ3hCO0tBQ0Y7OztXQUVPLG1CQUFHO0FBQ1QsVUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFO0FBQ3BCLFlBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUE7T0FDeEM7S0FDRjs7O1dBRU8sbUJBQUc7QUFDVCxVQUFJLElBQUksQ0FBQyxXQUFXLEVBQUU7QUFDcEIsWUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQTtPQUN6QztLQUNGOzs7V0FFSSxjQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFO0FBQzVDLFVBQUksSUFBSSxDQUFDLFdBQVcsRUFBRTtBQUNwQixZQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxFQUFFLElBQUksRUFBSixJQUFJLEVBQUUsSUFBSSxFQUFKLElBQUksRUFBRSxJQUFJLEVBQUosSUFBSSxFQUFFLElBQUksRUFBSixJQUFJLEVBQUUsS0FBSyxFQUFMLEtBQUssRUFBRSxPQUFPLEVBQVAsT0FBTyxFQUFFLENBQUMsQ0FBQTtPQUNwRTtLQUNGOzs7U0F4Q2tCLGVBQWU7OztxQkFBZixlQUFlIiwiZmlsZSI6Ii9ob21lL2JpbGx5Ly5hdG9tL3BhY2thZ2VzL2xhdGV4L2xpYi9zdGF0dXMtaW5kaWNhdG9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBiYWJlbCAqL1xuXG5pbXBvcnQgU3RhdHVzTGFiZWwgZnJvbSAnLi92aWV3cy9zdGF0dXMtbGFiZWwnXG5pbXBvcnQgeyBEaXNwb3NhYmxlIH0gZnJvbSAnYXRvbSdcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3RhdHVzSW5kaWNhdG9yIGV4dGVuZHMgRGlzcG9zYWJsZSB7XG4gIGNvbnN0cnVjdG9yICgpIHtcbiAgICBzdXBlcigoKSA9PiB0aGlzLmRldGFjaFN0YXR1c0JhcigpKVxuICB9XG5cbiAgYXR0YWNoU3RhdHVzQmFyIChzdGF0dXNCYXIpIHtcbiAgICB0aGlzLnN0YXR1c0xhYmVsID0gbmV3IFN0YXR1c0xhYmVsKClcbiAgICB0aGlzLnN0YXR1c1RpbGUgPSBzdGF0dXNCYXIuYWRkTGVmdFRpbGUoe1xuICAgICAgaXRlbTogdGhpcy5zdGF0dXNMYWJlbCxcbiAgICAgIHByaW9yaXR5OiA5MDAxXG4gICAgfSlcbiAgfVxuXG4gIGRldGFjaFN0YXR1c0JhciAoKSB7XG4gICAgaWYgKHRoaXMuc3RhdHVzVGlsZSkge1xuICAgICAgdGhpcy5zdGF0dXNUaWxlLmRlc3Ryb3koKVxuICAgICAgdGhpcy5zdGF0dXNUaWxlID0gbnVsbFxuICAgIH1cbiAgICBpZiAodGhpcy5zdGF0dXNMYWJlbCkge1xuICAgICAgdGhpcy5zdGF0dXNMYWJlbC5kZXN0cm95KClcbiAgICAgIHRoaXMuc3RhdHVzTGFiZWwgPSBudWxsXG4gICAgfVxuICB9XG5cbiAgc2V0QnVzeSAoKSB7XG4gICAgaWYgKHRoaXMuc3RhdHVzTGFiZWwpIHtcbiAgICAgIHRoaXMuc3RhdHVzTGFiZWwudXBkYXRlKHsgYnVzeTogdHJ1ZSB9KVxuICAgIH1cbiAgfVxuXG4gIHNldElkbGUgKCkge1xuICAgIGlmICh0aGlzLnN0YXR1c0xhYmVsKSB7XG4gICAgICB0aGlzLnN0YXR1c0xhYmVsLnVwZGF0ZSh7IGJ1c3k6IGZhbHNlIH0pXG4gICAgfVxuICB9XG5cbiAgc2hvdyAodGV4dCwgdHlwZSwgaWNvbiwgc3BpbiwgdGl0bGUsIG9uQ2xpY2spIHtcbiAgICBpZiAodGhpcy5zdGF0dXNMYWJlbCkge1xuICAgICAgdGhpcy5zdGF0dXNMYWJlbC51cGRhdGUoeyB0ZXh0LCB0eXBlLCBpY29uLCBzcGluLCB0aXRsZSwgb25DbGljayB9KVxuICAgIH1cbiAgfVxufVxuIl19