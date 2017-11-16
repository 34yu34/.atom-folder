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
      if (!this.properties.text) return _etch2['default'].dom('div', null);

      var classNames = ['latex-status', 'inline-block'];

      if (this.properties.type) classNames.push('latex-' + this.properties.type);
      if (this.properties.onClick) classNames.push('latex-status-link');

      var iconClassNames = ['icon', 'icon-' + this.properties.icon];

      if (this.properties.spin) iconClassNames.push('latex-spin');

      return _etch2['default'].dom(
        'div',
        { className: classNames.join(' '), onclick: this.properties.onClick },
        this.properties.icon ? _etch2['default'].dom('div', { className: iconClassNames.join(' ') }) : '',
        _etch2['default'].dom(
          'span',
          null,
          this.properties.text
        )
      );
    }
  }, {
    key: 'update',
    value: function update(properties) {
      this.properties = properties;
      return _etch2['default'].update(this);
    }
  }, {
    key: 'readAfterUpdate',
    value: function readAfterUpdate() {
      if (this.tooltip) {
        this.tooltip.dispose();
        this.tooltop = null;
      }
      if (this.properties.title) {
        this.tooltip = atom.tooltips.add(this.element, { title: this.properties.title });
      }
    }
  }]);

  return StatusLabel;
})();

exports['default'] = StatusLabel;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2JpbGx5Ly5hdG9tL3BhY2thZ2VzL2xhdGV4L2xpYi92aWV3cy9zdGF0dXMtbGFiZWwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O29CQUdpQixNQUFNOzs7O0lBRUYsV0FBVztBQUNsQixXQURPLFdBQVcsR0FDQTtRQUFqQixVQUFVLHlEQUFHLEVBQUU7OzBCQURULFdBQVc7O0FBRTVCLFFBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFBO0FBQzVCLHNCQUFLLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQTtHQUN0Qjs7ZUFKa0IsV0FBVzs7NkJBTWhCLGFBQUc7QUFDZixVQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7QUFDaEIsWUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQTtPQUN2QjtBQUNELFlBQU0sa0JBQUssT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFBO0tBQ3pCOzs7V0FFTSxrQkFBRztBQUNSLFVBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxPQUFPLGtDQUFPLENBQUE7O0FBRXpDLFVBQUksVUFBVSxHQUFHLENBQ2YsY0FBYyxFQUNkLGNBQWMsQ0FDZixDQUFBOztBQUVELFVBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFDLElBQUksWUFBVSxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBRyxDQUFBO0FBQzFFLFVBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLEVBQUUsVUFBVSxDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFBOztBQUVqRSxVQUFJLGNBQWMsR0FBRyxDQUNuQixNQUFNLFlBQ0UsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQzdCLENBQUE7O0FBRUQsVUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxjQUFjLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFBOztBQUUzRCxhQUNFOztVQUFLLFNBQVMsRUFBRSxVQUFVLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxBQUFDLEVBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxBQUFDO1FBQ3BFLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxHQUFHLCtCQUFLLFNBQVMsRUFBRSxjQUFjLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxBQUFDLEdBQUcsR0FBRyxFQUFFO1FBQ3pFOzs7VUFBTyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUk7U0FBUTtPQUMvQixDQUNQO0tBQ0Y7OztXQUVNLGdCQUFDLFVBQVUsRUFBRTtBQUNsQixVQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQTtBQUM1QixhQUFPLGtCQUFLLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQTtLQUN6Qjs7O1dBRWUsMkJBQUc7QUFDakIsVUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO0FBQ2hCLFlBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUE7QUFDdEIsWUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUE7T0FDcEI7QUFDRCxVQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFO0FBQ3pCLFlBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxFQUFFLEtBQUssRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUE7T0FDakY7S0FDRjs7O1NBcERrQixXQUFXOzs7cUJBQVgsV0FBVyIsImZpbGUiOiIvaG9tZS9iaWxseS8uYXRvbS9wYWNrYWdlcy9sYXRleC9saWIvdmlld3Mvc3RhdHVzLWxhYmVsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBiYWJlbCAqL1xuLyoqIEBqc3ggZXRjaC5kb20gKi9cblxuaW1wb3J0IGV0Y2ggZnJvbSAnZXRjaCdcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3RhdHVzTGFiZWwge1xuICBjb25zdHJ1Y3RvciAocHJvcGVydGllcyA9IHt9KSB7XG4gICAgdGhpcy5wcm9wZXJ0aWVzID0gcHJvcGVydGllc1xuICAgIGV0Y2guaW5pdGlhbGl6ZSh0aGlzKVxuICB9XG5cbiAgYXN5bmMgZGVzdHJveSAoKSB7XG4gICAgaWYgKHRoaXMudG9vbHRpcCkge1xuICAgICAgdGhpcy50b29sdGlwLmRpc3Bvc2UoKVxuICAgIH1cbiAgICBhd2FpdCBldGNoLmRlc3Ryb3kodGhpcylcbiAgfVxuXG4gIHJlbmRlciAoKSB7XG4gICAgaWYgKCF0aGlzLnByb3BlcnRpZXMudGV4dCkgcmV0dXJuIDxkaXYgLz5cblxuICAgIGxldCBjbGFzc05hbWVzID0gW1xuICAgICAgJ2xhdGV4LXN0YXR1cycsXG4gICAgICAnaW5saW5lLWJsb2NrJ1xuICAgIF1cblxuICAgIGlmICh0aGlzLnByb3BlcnRpZXMudHlwZSkgY2xhc3NOYW1lcy5wdXNoKGBsYXRleC0ke3RoaXMucHJvcGVydGllcy50eXBlfWApXG4gICAgaWYgKHRoaXMucHJvcGVydGllcy5vbkNsaWNrKSBjbGFzc05hbWVzLnB1c2goJ2xhdGV4LXN0YXR1cy1saW5rJylcblxuICAgIGxldCBpY29uQ2xhc3NOYW1lcyA9IFtcbiAgICAgICdpY29uJyxcbiAgICAgIGBpY29uLSR7dGhpcy5wcm9wZXJ0aWVzLmljb259YFxuICAgIF1cblxuICAgIGlmICh0aGlzLnByb3BlcnRpZXMuc3BpbikgaWNvbkNsYXNzTmFtZXMucHVzaCgnbGF0ZXgtc3BpbicpXG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9e2NsYXNzTmFtZXMuam9pbignICcpfSBvbmNsaWNrPXt0aGlzLnByb3BlcnRpZXMub25DbGlja30+XG4gICAgICAgIHt0aGlzLnByb3BlcnRpZXMuaWNvbiA/IDxkaXYgY2xhc3NOYW1lPXtpY29uQ2xhc3NOYW1lcy5qb2luKCcgJyl9IC8+IDogJyd9XG4gICAgICAgIDxzcGFuPnt0aGlzLnByb3BlcnRpZXMudGV4dH08L3NwYW4+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICB1cGRhdGUgKHByb3BlcnRpZXMpIHtcbiAgICB0aGlzLnByb3BlcnRpZXMgPSBwcm9wZXJ0aWVzXG4gICAgcmV0dXJuIGV0Y2gudXBkYXRlKHRoaXMpXG4gIH1cblxuICByZWFkQWZ0ZXJVcGRhdGUgKCkge1xuICAgIGlmICh0aGlzLnRvb2x0aXApIHtcbiAgICAgIHRoaXMudG9vbHRpcC5kaXNwb3NlKClcbiAgICAgIHRoaXMudG9vbHRvcCA9IG51bGxcbiAgICB9XG4gICAgaWYgKHRoaXMucHJvcGVydGllcy50aXRsZSkge1xuICAgICAgdGhpcy50b29sdGlwID0gYXRvbS50b29sdGlwcy5hZGQodGhpcy5lbGVtZW50LCB7IHRpdGxlOiB0aGlzLnByb3BlcnRpZXMudGl0bGUgfSlcbiAgICB9XG4gIH1cbn1cbiJdfQ==