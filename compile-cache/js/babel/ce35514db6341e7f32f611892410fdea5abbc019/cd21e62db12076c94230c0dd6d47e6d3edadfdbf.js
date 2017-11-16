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
      this.statusTile = statusBar.addRightTile({
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2JpbGx5Ly5hdG9tL3BhY2thZ2VzL2xhdGV4L2xpYi9zdGF0dXMtaW5kaWNhdG9yLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Z0NBRXdCLHNCQUFzQjs7OztvQkFDbkIsTUFBTTs7SUFFWixlQUFlO1lBQWYsZUFBZTs7QUFDdEIsV0FETyxlQUFlLEdBQ25COzBCQURJLGVBQWU7O0FBRWhDLCtCQUZpQixlQUFlLDZDQUUxQjthQUFNLE1BQUssZUFBZSxFQUFFO0tBQUEsRUFBQzs7O0dBQ3BDOztlQUhrQixlQUFlOztXQUtsQix5QkFBQyxTQUFTLEVBQUU7QUFDMUIsVUFBSSxDQUFDLFdBQVcsR0FBRyxtQ0FBaUIsQ0FBQTtBQUNwQyxVQUFJLENBQUMsVUFBVSxHQUFHLFNBQVMsQ0FBQyxZQUFZLENBQUM7QUFDdkMsWUFBSSxFQUFFLElBQUksQ0FBQyxXQUFXO0FBQ3RCLGdCQUFRLEVBQUUsSUFBSTtPQUNmLENBQUMsQ0FBQTtLQUNIOzs7V0FFZSwyQkFBRztBQUNqQixVQUFJLElBQUksQ0FBQyxVQUFVLEVBQUU7QUFDbkIsWUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtBQUN6QixZQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQTtPQUN2QjtBQUNELFVBQUksSUFBSSxDQUFDLFdBQVcsRUFBRTtBQUNwQixZQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sRUFBRSxDQUFBO0FBQzFCLFlBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFBO09BQ3hCO0tBQ0Y7OztXQUVJLGNBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUU7QUFDNUMsVUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFO0FBQ3BCLFlBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLEVBQUUsSUFBSSxFQUFKLElBQUksRUFBRSxJQUFJLEVBQUosSUFBSSxFQUFFLElBQUksRUFBSixJQUFJLEVBQUUsSUFBSSxFQUFKLElBQUksRUFBRSxLQUFLLEVBQUwsS0FBSyxFQUFFLE9BQU8sRUFBUCxPQUFPLEVBQUUsQ0FBQyxDQUFBO09BQ3BFO0tBQ0Y7OztTQTVCa0IsZUFBZTs7O3FCQUFmLGVBQWUiLCJmaWxlIjoiL2hvbWUvYmlsbHkvLmF0b20vcGFja2FnZXMvbGF0ZXgvbGliL3N0YXR1cy1pbmRpY2F0b3IuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiogQGJhYmVsICovXG5cbmltcG9ydCBTdGF0dXNMYWJlbCBmcm9tICcuL3ZpZXdzL3N0YXR1cy1sYWJlbCdcbmltcG9ydCB7IERpc3Bvc2FibGUgfSBmcm9tICdhdG9tJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTdGF0dXNJbmRpY2F0b3IgZXh0ZW5kcyBEaXNwb3NhYmxlIHtcbiAgY29uc3RydWN0b3IgKCkge1xuICAgIHN1cGVyKCgpID0+IHRoaXMuZGV0YWNoU3RhdHVzQmFyKCkpXG4gIH1cblxuICBhdHRhY2hTdGF0dXNCYXIgKHN0YXR1c0Jhcikge1xuICAgIHRoaXMuc3RhdHVzTGFiZWwgPSBuZXcgU3RhdHVzTGFiZWwoKVxuICAgIHRoaXMuc3RhdHVzVGlsZSA9IHN0YXR1c0Jhci5hZGRSaWdodFRpbGUoe1xuICAgICAgaXRlbTogdGhpcy5zdGF0dXNMYWJlbCxcbiAgICAgIHByaW9yaXR5OiA5MDAxXG4gICAgfSlcbiAgfVxuXG4gIGRldGFjaFN0YXR1c0JhciAoKSB7XG4gICAgaWYgKHRoaXMuc3RhdHVzVGlsZSkge1xuICAgICAgdGhpcy5zdGF0dXNUaWxlLmRlc3Ryb3koKVxuICAgICAgdGhpcy5zdGF0dXNUaWxlID0gbnVsbFxuICAgIH1cbiAgICBpZiAodGhpcy5zdGF0dXNMYWJlbCkge1xuICAgICAgdGhpcy5zdGF0dXNMYWJlbC5kZXN0cm95KClcbiAgICAgIHRoaXMuc3RhdHVzTGFiZWwgPSBudWxsXG4gICAgfVxuICB9XG5cbiAgc2hvdyAodGV4dCwgdHlwZSwgaWNvbiwgc3BpbiwgdGl0bGUsIG9uQ2xpY2spIHtcbiAgICBpZiAodGhpcy5zdGF0dXNMYWJlbCkge1xuICAgICAgdGhpcy5zdGF0dXNMYWJlbC51cGRhdGUoeyB0ZXh0LCB0eXBlLCBpY29uLCBzcGluLCB0aXRsZSwgb25DbGljayB9KVxuICAgIH1cbiAgfVxufVxuIl19