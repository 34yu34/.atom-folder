Object.defineProperty(exports, '__esModule', {
  value: true
});

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/** @babel */

var _composer = require('./composer');

var _composer2 = _interopRequireDefault(_composer);

var _openerRegistry = require('./opener-registry');

var _openerRegistry2 = _interopRequireDefault(_openerRegistry);

var _processManager = require('./process-manager');

var _processManager2 = _interopRequireDefault(_processManager);

var _statusIndicator = require('./status-indicator');

var _statusIndicator2 = _interopRequireDefault(_statusIndicator);

var _builderRegistry = require('./builder-registry');

var _builderRegistry2 = _interopRequireDefault(_builderRegistry);

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

var _atom = require('atom');

function defineImmutableProperty(obj, name, value) {
  if (_atom.Disposable.isDisposable(value)) {
    obj.disposables.add(value);
  }
  Object.defineProperty(obj, name, { value: value });
}

var Latex = (function (_Disposable) {
  _inherits(Latex, _Disposable);

  function Latex() {
    _classCallCheck(this, Latex);

    _get(Object.getPrototypeOf(Latex.prototype), 'constructor', this).call(this, function () {
      return _this.disposables.dispose();
    });

    this.disposables = new _atom.CompositeDisposable();

    var _this = this;

    defineImmutableProperty(this, 'builderRegistry', new _builderRegistry2['default']());
    defineImmutableProperty(this, 'composer', new _composer2['default']());
    defineImmutableProperty(this, 'log', new _logger2['default']());
    defineImmutableProperty(this, 'opener', new _openerRegistry2['default']());
    defineImmutableProperty(this, 'process', new _processManager2['default']());
    defineImmutableProperty(this, 'status', new _statusIndicator2['default']());
  }

  return Latex;
})(_atom.Disposable);

exports['default'] = Latex;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2JpbGx5Ly5hdG9tL3BhY2thZ2VzL2xhdGV4L2xpYi9sYXRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozt3QkFFcUIsWUFBWTs7Ozs4QkFDTixtQkFBbUI7Ozs7OEJBQ25CLG1CQUFtQjs7OzsrQkFDbEIsb0JBQW9COzs7OytCQUNwQixvQkFBb0I7Ozs7c0JBQzdCLFVBQVU7Ozs7b0JBQ21CLE1BQU07O0FBRXRELFNBQVMsdUJBQXVCLENBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUU7QUFDbEQsTUFBSSxpQkFBVyxZQUFZLENBQUMsS0FBSyxDQUFDLEVBQUU7QUFDbEMsT0FBRyxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUE7R0FDM0I7QUFDRCxRQUFNLENBQUMsY0FBYyxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsRUFBRSxLQUFLLEVBQUwsS0FBSyxFQUFFLENBQUMsQ0FBQTtDQUM1Qzs7SUFFb0IsS0FBSztZQUFMLEtBQUs7O0FBR1osV0FITyxLQUFLLEdBR1Q7MEJBSEksS0FBSzs7QUFJdEIsK0JBSmlCLEtBQUssNkNBSWhCO2FBQU0sTUFBSyxXQUFXLENBQUMsT0FBTyxFQUFFO0tBQUEsRUFBQzs7U0FIekMsV0FBVyxHQUFHLCtCQUF5Qjs7OztBQUtyQywyQkFBdUIsQ0FBQyxJQUFJLEVBQUUsaUJBQWlCLEVBQUUsa0NBQXFCLENBQUMsQ0FBQTtBQUN2RSwyQkFBdUIsQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFLDJCQUFjLENBQUMsQ0FBQTtBQUN6RCwyQkFBdUIsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLHlCQUFZLENBQUMsQ0FBQTtBQUNsRCwyQkFBdUIsQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLGlDQUFvQixDQUFDLENBQUE7QUFDN0QsMkJBQXVCLENBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRSxpQ0FBb0IsQ0FBQyxDQUFBO0FBQzlELDJCQUF1QixDQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsa0NBQXFCLENBQUMsQ0FBQTtHQUMvRDs7U0Faa0IsS0FBSzs7O3FCQUFMLEtBQUsiLCJmaWxlIjoiL2hvbWUvYmlsbHkvLmF0b20vcGFja2FnZXMvbGF0ZXgvbGliL2xhdGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBiYWJlbCAqL1xuXG5pbXBvcnQgQ29tcG9zZXIgZnJvbSAnLi9jb21wb3NlcidcbmltcG9ydCBPcGVuZXJSZWdpc3RyeSBmcm9tICcuL29wZW5lci1yZWdpc3RyeSdcbmltcG9ydCBQcm9jZXNzTWFuYWdlciBmcm9tICcuL3Byb2Nlc3MtbWFuYWdlcidcbmltcG9ydCBTdGF0dXNJbmRpY2F0b3IgZnJvbSAnLi9zdGF0dXMtaW5kaWNhdG9yJ1xuaW1wb3J0IEJ1aWxkZXJSZWdpc3RyeSBmcm9tICcuL2J1aWxkZXItcmVnaXN0cnknXG5pbXBvcnQgTG9nZ2VyIGZyb20gJy4vbG9nZ2VyJ1xuaW1wb3J0IHsgQ29tcG9zaXRlRGlzcG9zYWJsZSwgRGlzcG9zYWJsZSB9IGZyb20gJ2F0b20nXG5cbmZ1bmN0aW9uIGRlZmluZUltbXV0YWJsZVByb3BlcnR5IChvYmosIG5hbWUsIHZhbHVlKSB7XG4gIGlmIChEaXNwb3NhYmxlLmlzRGlzcG9zYWJsZSh2YWx1ZSkpIHtcbiAgICBvYmouZGlzcG9zYWJsZXMuYWRkKHZhbHVlKVxuICB9XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIG5hbWUsIHsgdmFsdWUgfSlcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTGF0ZXggZXh0ZW5kcyBEaXNwb3NhYmxlIHtcbiAgZGlzcG9zYWJsZXMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG5cbiAgY29uc3RydWN0b3IgKCkge1xuICAgIHN1cGVyKCgpID0+IHRoaXMuZGlzcG9zYWJsZXMuZGlzcG9zZSgpKVxuXG4gICAgZGVmaW5lSW1tdXRhYmxlUHJvcGVydHkodGhpcywgJ2J1aWxkZXJSZWdpc3RyeScsIG5ldyBCdWlsZGVyUmVnaXN0cnkoKSlcbiAgICBkZWZpbmVJbW11dGFibGVQcm9wZXJ0eSh0aGlzLCAnY29tcG9zZXInLCBuZXcgQ29tcG9zZXIoKSlcbiAgICBkZWZpbmVJbW11dGFibGVQcm9wZXJ0eSh0aGlzLCAnbG9nJywgbmV3IExvZ2dlcigpKVxuICAgIGRlZmluZUltbXV0YWJsZVByb3BlcnR5KHRoaXMsICdvcGVuZXInLCBuZXcgT3BlbmVyUmVnaXN0cnkoKSlcbiAgICBkZWZpbmVJbW11dGFibGVQcm9wZXJ0eSh0aGlzLCAncHJvY2VzcycsIG5ldyBQcm9jZXNzTWFuYWdlcigpKVxuICAgIGRlZmluZUltbXV0YWJsZVByb3BlcnR5KHRoaXMsICdzdGF0dXMnLCBuZXcgU3RhdHVzSW5kaWNhdG9yKCkpXG4gIH1cbn1cbiJdfQ==