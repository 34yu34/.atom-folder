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

var MessageIcon = (function () {
  _createClass(MessageIcon, null, [{
    key: 'icons',
    value: {
      error: 'stop',
      warning: 'alert',
      info: 'info'
    },
    enumerable: true
  }]);

  function MessageIcon() {
    var properties = arguments.length <= 0 || arguments[0] === undefined ? { type: 'error' } : arguments[0];

    _classCallCheck(this, MessageIcon);

    this.properties = properties;
    _etch2['default'].initialize(this);
  }

  _createClass(MessageIcon, [{
    key: 'destroy',
    value: _asyncToGenerator(function* () {
      yield _etch2['default'].destroy(this);
    })
  }, {
    key: 'render',
    value: function render() {
      return _etch2['default'].dom('span', { className: 'icon icon-' + MessageIcon.icons[this.properties.type] });
    }
  }, {
    key: 'update',
    value: function update(properties) {
      this.properties = properties;
      return _etch2['default'].update(this);
    }
  }]);

  return MessageIcon;
})();

exports['default'] = MessageIcon;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2JpbGx5Ly5hdG9tL3BhY2thZ2VzL2xhdGV4L2xpYi92aWV3cy9tZXNzYWdlLWljb24uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O29CQUdpQixNQUFNOzs7O0lBRUYsV0FBVztlQUFYLFdBQVc7O1dBQ2Y7QUFDYixXQUFLLEVBQUUsTUFBTTtBQUNiLGFBQU8sRUFBRSxPQUFPO0FBQ2hCLFVBQUksRUFBRSxNQUFNO0tBQ2I7Ozs7QUFFVyxXQVBPLFdBQVcsR0FPZTtRQUFoQyxVQUFVLHlEQUFHLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRTs7MEJBUHhCLFdBQVc7O0FBUTVCLFFBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFBO0FBQzVCLHNCQUFLLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQTtHQUN0Qjs7ZUFWa0IsV0FBVzs7NkJBWWhCLGFBQUc7QUFDZixZQUFNLGtCQUFLLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQTtLQUN6Qjs7O1dBRU0sa0JBQUc7QUFDUixhQUNFLGdDQUFNLFNBQVMsaUJBQWUsV0FBVyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxBQUFHLEdBQUcsQ0FDNUU7S0FDRjs7O1dBRU0sZ0JBQUMsVUFBVSxFQUFFO0FBQ2xCLFVBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFBO0FBQzVCLGFBQU8sa0JBQUssTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFBO0tBQ3pCOzs7U0F6QmtCLFdBQVc7OztxQkFBWCxXQUFXIiwiZmlsZSI6Ii9ob21lL2JpbGx5Ly5hdG9tL3BhY2thZ2VzL2xhdGV4L2xpYi92aWV3cy9tZXNzYWdlLWljb24uanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiogQGJhYmVsICovXG4vKiogQGpzeCBldGNoLmRvbSAqL1xuXG5pbXBvcnQgZXRjaCBmcm9tICdldGNoJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNZXNzYWdlSWNvbiB7XG4gIHN0YXRpYyBpY29ucyA9IHtcbiAgICBlcnJvcjogJ3N0b3AnLFxuICAgIHdhcm5pbmc6ICdhbGVydCcsXG4gICAgaW5mbzogJ2luZm8nXG4gIH1cblxuICBjb25zdHJ1Y3RvciAocHJvcGVydGllcyA9IHsgdHlwZTogJ2Vycm9yJyB9KSB7XG4gICAgdGhpcy5wcm9wZXJ0aWVzID0gcHJvcGVydGllc1xuICAgIGV0Y2guaW5pdGlhbGl6ZSh0aGlzKVxuICB9XG5cbiAgYXN5bmMgZGVzdHJveSAoKSB7XG4gICAgYXdhaXQgZXRjaC5kZXN0cm95KHRoaXMpXG4gIH1cblxuICByZW5kZXIgKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8c3BhbiBjbGFzc05hbWU9e2BpY29uIGljb24tJHtNZXNzYWdlSWNvbi5pY29uc1t0aGlzLnByb3BlcnRpZXMudHlwZV19YH0gLz5cbiAgICApXG4gIH1cblxuICB1cGRhdGUgKHByb3BlcnRpZXMpIHtcbiAgICB0aGlzLnByb3BlcnRpZXMgPSBwcm9wZXJ0aWVzXG4gICAgcmV0dXJuIGV0Y2gudXBkYXRlKHRoaXMpXG4gIH1cbn1cbiJdfQ==