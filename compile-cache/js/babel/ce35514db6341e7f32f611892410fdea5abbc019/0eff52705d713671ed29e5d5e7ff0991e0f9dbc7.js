Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/** @babel */

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

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

var _atom = require('atom');

function defineDefaultProperty(target, property) {
  var shadowProperty = '__' + property;
  var defaultGetter = 'getDefault' + _lodash2['default'].capitalize(property);

  Object.defineProperty(target, property, {
    get: function get() {
      if (!target[shadowProperty]) {
        target[shadowProperty] = target[defaultGetter].apply(target);
      }
      return target[shadowProperty];
    },

    set: function set(value) {
      target[shadowProperty] = value;
    }
  });
}

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

    this.createLogProxy();
    defineDefaultProperty(this, 'logger');

    defineImmutableProperty(this, 'builderRegistry', new _builderRegistry2['default']());
    defineImmutableProperty(this, 'composer', new _composer2['default']());
    defineImmutableProperty(this, 'opener', new _openerRegistry2['default']());
    defineImmutableProperty(this, 'process', new _processManager2['default']());
    defineImmutableProperty(this, 'status', new _statusIndicator2['default']());
  }

  _createClass(Latex, [{
    key: 'getLogger',
    value: function getLogger() {
      return this.logger;
    }
  }, {
    key: 'setLogger',
    value: function setLogger(logger) {
      this.logger = logger;
    }
  }, {
    key: 'getDefaultLogger',
    value: function getDefaultLogger() {
      var DefaultLogger = require('./loggers/default-logger');
      return new DefaultLogger();
    }
  }, {
    key: 'createLogProxy',
    value: function createLogProxy() {
      var _this2 = this;

      this.log = {
        error: function error() {
          var _logger;

          (_logger = _this2.logger).error.apply(_logger, arguments);
        },
        warning: function warning() {
          var _logger2;

          (_logger2 = _this2.logger).warning.apply(_logger2, arguments);
        },
        info: function info() {
          var _logger3;

          (_logger3 = _this2.logger).info.apply(_logger3, arguments);
        },
        showMessage: function showMessage(message) {
          _this2.logger.showMessage(message);
        },
        group: function group(label) {
          _this2.logger.group(label);
        },
        groupEnd: function groupEnd() {
          _this2.logger.groupEnd();
        },
        sync: function sync() {
          _this2.logger.sync();
        },
        toggle: function toggle() {
          _this2.logger.toggle();
        },
        show: function show() {
          _this2.logger.show();
        },
        hide: function hide() {
          _this2.logger.hide();
        }
      };
    }
  }]);

  return Latex;
})(_atom.Disposable);

exports['default'] = Latex;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2JpbGx5Ly5hdG9tL3BhY2thZ2VzL2xhdGV4L2xpYi9sYXRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O3NCQUVjLFFBQVE7Ozs7d0JBQ0QsWUFBWTs7Ozs4QkFDTixtQkFBbUI7Ozs7OEJBQ25CLG1CQUFtQjs7OzsrQkFDbEIsb0JBQW9COzs7OytCQUNwQixvQkFBb0I7Ozs7b0JBQ0EsTUFBTTs7QUFFdEQsU0FBUyxxQkFBcUIsQ0FBRSxNQUFNLEVBQUUsUUFBUSxFQUFFO0FBQ2hELE1BQU0sY0FBYyxVQUFRLFFBQVEsQUFBRSxDQUFBO0FBQ3RDLE1BQU0sYUFBYSxrQkFBZ0Isb0JBQUUsVUFBVSxDQUFDLFFBQVEsQ0FBQyxBQUFFLENBQUE7O0FBRTNELFFBQU0sQ0FBQyxjQUFjLENBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRTtBQUN0QyxPQUFHLEVBQUUsZUFBWTtBQUNmLFVBQUksQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLEVBQUU7QUFDM0IsY0FBTSxDQUFDLGNBQWMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUE7T0FDN0Q7QUFDRCxhQUFPLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQTtLQUM5Qjs7QUFFRCxPQUFHLEVBQUUsYUFBVSxLQUFLLEVBQUU7QUFBRSxZQUFNLENBQUMsY0FBYyxDQUFDLEdBQUcsS0FBSyxDQUFBO0tBQUU7R0FDekQsQ0FBQyxDQUFBO0NBQ0g7O0FBRUQsU0FBUyx1QkFBdUIsQ0FBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRTtBQUNsRCxNQUFJLGlCQUFXLFlBQVksQ0FBQyxLQUFLLENBQUMsRUFBRTtBQUNsQyxPQUFHLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQTtHQUMzQjtBQUNELFFBQU0sQ0FBQyxjQUFjLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxFQUFFLEtBQUssRUFBTCxLQUFLLEVBQUUsQ0FBQyxDQUFBO0NBQzVDOztJQUVvQixLQUFLO1lBQUwsS0FBSzs7QUFHWixXQUhPLEtBQUssR0FHVDswQkFISSxLQUFLOztBQUl0QiwrQkFKaUIsS0FBSyw2Q0FJaEI7YUFBTSxNQUFLLFdBQVcsQ0FBQyxPQUFPLEVBQUU7S0FBQSxFQUFDO1NBSHpDLFdBQVcsR0FBRywrQkFBeUI7Ozs7QUFJckMsUUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFBO0FBQ3JCLHlCQUFxQixDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQTs7QUFFckMsMkJBQXVCLENBQUMsSUFBSSxFQUFFLGlCQUFpQixFQUFFLGtDQUFxQixDQUFDLENBQUE7QUFDdkUsMkJBQXVCLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRSwyQkFBYyxDQUFDLENBQUE7QUFDekQsMkJBQXVCLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxpQ0FBb0IsQ0FBQyxDQUFBO0FBQzdELDJCQUF1QixDQUFDLElBQUksRUFBRSxTQUFTLEVBQUUsaUNBQW9CLENBQUMsQ0FBQTtBQUM5RCwyQkFBdUIsQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLGtDQUFxQixDQUFDLENBQUE7R0FDL0Q7O2VBYmtCLEtBQUs7O1dBZWQscUJBQUc7QUFBRSxhQUFPLElBQUksQ0FBQyxNQUFNLENBQUE7S0FBRTs7O1dBRXpCLG1CQUFDLE1BQU0sRUFBRTtBQUNqQixVQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQTtLQUNyQjs7O1dBRWdCLDRCQUFHO0FBQ2xCLFVBQU0sYUFBYSxHQUFHLE9BQU8sQ0FBQywwQkFBMEIsQ0FBQyxDQUFBO0FBQ3pELGFBQU8sSUFBSSxhQUFhLEVBQUUsQ0FBQTtLQUMzQjs7O1dBRWMsMEJBQUc7OztBQUNoQixVQUFJLENBQUMsR0FBRyxHQUFHO0FBQ1QsYUFBSyxFQUFFLGlCQUFhOzs7QUFDbEIscUJBQUEsT0FBSyxNQUFNLEVBQUMsS0FBSyxNQUFBLG9CQUFTLENBQUE7U0FDM0I7QUFDRCxlQUFPLEVBQUUsbUJBQWE7OztBQUNwQixzQkFBQSxPQUFLLE1BQU0sRUFBQyxPQUFPLE1BQUEscUJBQVMsQ0FBQTtTQUM3QjtBQUNELFlBQUksRUFBRSxnQkFBYTs7O0FBQ2pCLHNCQUFBLE9BQUssTUFBTSxFQUFDLElBQUksTUFBQSxxQkFBUyxDQUFBO1NBQzFCO0FBQ0QsbUJBQVcsRUFBRSxxQkFBQyxPQUFPLEVBQUs7QUFDeEIsaUJBQUssTUFBTSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQTtTQUNqQztBQUNELGFBQUssRUFBRSxlQUFDLEtBQUssRUFBSztBQUNoQixpQkFBSyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFBO1NBQ3pCO0FBQ0QsZ0JBQVEsRUFBRSxvQkFBTTtBQUNkLGlCQUFLLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQTtTQUN2QjtBQUNELFlBQUksRUFBRSxnQkFBTTtBQUNWLGlCQUFLLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQTtTQUNuQjtBQUNELGNBQU0sRUFBRSxrQkFBTTtBQUNaLGlCQUFLLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQTtTQUNyQjtBQUNELFlBQUksRUFBRSxnQkFBTTtBQUNWLGlCQUFLLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQTtTQUNuQjtBQUNELFlBQUksRUFBRSxnQkFBTTtBQUNWLGlCQUFLLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQTtTQUNuQjtPQUNGLENBQUE7S0FDRjs7O1NBM0RrQixLQUFLOzs7cUJBQUwsS0FBSyIsImZpbGUiOiIvaG9tZS9iaWxseS8uYXRvbS9wYWNrYWdlcy9sYXRleC9saWIvbGF0ZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiogQGJhYmVsICovXG5cbmltcG9ydCBfIGZyb20gJ2xvZGFzaCdcbmltcG9ydCBDb21wb3NlciBmcm9tICcuL2NvbXBvc2VyJ1xuaW1wb3J0IE9wZW5lclJlZ2lzdHJ5IGZyb20gJy4vb3BlbmVyLXJlZ2lzdHJ5J1xuaW1wb3J0IFByb2Nlc3NNYW5hZ2VyIGZyb20gJy4vcHJvY2Vzcy1tYW5hZ2VyJ1xuaW1wb3J0IFN0YXR1c0luZGljYXRvciBmcm9tICcuL3N0YXR1cy1pbmRpY2F0b3InXG5pbXBvcnQgQnVpbGRlclJlZ2lzdHJ5IGZyb20gJy4vYnVpbGRlci1yZWdpc3RyeSdcbmltcG9ydCB7IENvbXBvc2l0ZURpc3Bvc2FibGUsIERpc3Bvc2FibGUgfSBmcm9tICdhdG9tJ1xuXG5mdW5jdGlvbiBkZWZpbmVEZWZhdWx0UHJvcGVydHkgKHRhcmdldCwgcHJvcGVydHkpIHtcbiAgY29uc3Qgc2hhZG93UHJvcGVydHkgPSBgX18ke3Byb3BlcnR5fWBcbiAgY29uc3QgZGVmYXVsdEdldHRlciA9IGBnZXREZWZhdWx0JHtfLmNhcGl0YWxpemUocHJvcGVydHkpfWBcblxuICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBwcm9wZXJ0eSwge1xuICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKCF0YXJnZXRbc2hhZG93UHJvcGVydHldKSB7XG4gICAgICAgIHRhcmdldFtzaGFkb3dQcm9wZXJ0eV0gPSB0YXJnZXRbZGVmYXVsdEdldHRlcl0uYXBwbHkodGFyZ2V0KVxuICAgICAgfVxuICAgICAgcmV0dXJuIHRhcmdldFtzaGFkb3dQcm9wZXJ0eV1cbiAgICB9LFxuXG4gICAgc2V0OiBmdW5jdGlvbiAodmFsdWUpIHsgdGFyZ2V0W3NoYWRvd1Byb3BlcnR5XSA9IHZhbHVlIH1cbiAgfSlcbn1cblxuZnVuY3Rpb24gZGVmaW5lSW1tdXRhYmxlUHJvcGVydHkgKG9iaiwgbmFtZSwgdmFsdWUpIHtcbiAgaWYgKERpc3Bvc2FibGUuaXNEaXNwb3NhYmxlKHZhbHVlKSkge1xuICAgIG9iai5kaXNwb3NhYmxlcy5hZGQodmFsdWUpXG4gIH1cbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwgbmFtZSwgeyB2YWx1ZSB9KVxufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMYXRleCBleHRlbmRzIERpc3Bvc2FibGUge1xuICBkaXNwb3NhYmxlcyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcblxuICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgc3VwZXIoKCkgPT4gdGhpcy5kaXNwb3NhYmxlcy5kaXNwb3NlKCkpXG4gICAgdGhpcy5jcmVhdGVMb2dQcm94eSgpXG4gICAgZGVmaW5lRGVmYXVsdFByb3BlcnR5KHRoaXMsICdsb2dnZXInKVxuXG4gICAgZGVmaW5lSW1tdXRhYmxlUHJvcGVydHkodGhpcywgJ2J1aWxkZXJSZWdpc3RyeScsIG5ldyBCdWlsZGVyUmVnaXN0cnkoKSlcbiAgICBkZWZpbmVJbW11dGFibGVQcm9wZXJ0eSh0aGlzLCAnY29tcG9zZXInLCBuZXcgQ29tcG9zZXIoKSlcbiAgICBkZWZpbmVJbW11dGFibGVQcm9wZXJ0eSh0aGlzLCAnb3BlbmVyJywgbmV3IE9wZW5lclJlZ2lzdHJ5KCkpXG4gICAgZGVmaW5lSW1tdXRhYmxlUHJvcGVydHkodGhpcywgJ3Byb2Nlc3MnLCBuZXcgUHJvY2Vzc01hbmFnZXIoKSlcbiAgICBkZWZpbmVJbW11dGFibGVQcm9wZXJ0eSh0aGlzLCAnc3RhdHVzJywgbmV3IFN0YXR1c0luZGljYXRvcigpKVxuICB9XG5cbiAgZ2V0TG9nZ2VyICgpIHsgcmV0dXJuIHRoaXMubG9nZ2VyIH1cblxuICBzZXRMb2dnZXIgKGxvZ2dlcikge1xuICAgIHRoaXMubG9nZ2VyID0gbG9nZ2VyXG4gIH1cblxuICBnZXREZWZhdWx0TG9nZ2VyICgpIHtcbiAgICBjb25zdCBEZWZhdWx0TG9nZ2VyID0gcmVxdWlyZSgnLi9sb2dnZXJzL2RlZmF1bHQtbG9nZ2VyJylcbiAgICByZXR1cm4gbmV3IERlZmF1bHRMb2dnZXIoKVxuICB9XG5cbiAgY3JlYXRlTG9nUHJveHkgKCkge1xuICAgIHRoaXMubG9nID0ge1xuICAgICAgZXJyb3I6ICguLi5hcmdzKSA9PiB7XG4gICAgICAgIHRoaXMubG9nZ2VyLmVycm9yKC4uLmFyZ3MpXG4gICAgICB9LFxuICAgICAgd2FybmluZzogKC4uLmFyZ3MpID0+IHtcbiAgICAgICAgdGhpcy5sb2dnZXIud2FybmluZyguLi5hcmdzKVxuICAgICAgfSxcbiAgICAgIGluZm86ICguLi5hcmdzKSA9PiB7XG4gICAgICAgIHRoaXMubG9nZ2VyLmluZm8oLi4uYXJncylcbiAgICAgIH0sXG4gICAgICBzaG93TWVzc2FnZTogKG1lc3NhZ2UpID0+IHtcbiAgICAgICAgdGhpcy5sb2dnZXIuc2hvd01lc3NhZ2UobWVzc2FnZSlcbiAgICAgIH0sXG4gICAgICBncm91cDogKGxhYmVsKSA9PiB7XG4gICAgICAgIHRoaXMubG9nZ2VyLmdyb3VwKGxhYmVsKVxuICAgICAgfSxcbiAgICAgIGdyb3VwRW5kOiAoKSA9PiB7XG4gICAgICAgIHRoaXMubG9nZ2VyLmdyb3VwRW5kKClcbiAgICAgIH0sXG4gICAgICBzeW5jOiAoKSA9PiB7XG4gICAgICAgIHRoaXMubG9nZ2VyLnN5bmMoKVxuICAgICAgfSxcbiAgICAgIHRvZ2dsZTogKCkgPT4ge1xuICAgICAgICB0aGlzLmxvZ2dlci50b2dnbGUoKVxuICAgICAgfSxcbiAgICAgIHNob3c6ICgpID0+IHtcbiAgICAgICAgdGhpcy5sb2dnZXIuc2hvdygpXG4gICAgICB9LFxuICAgICAgaGlkZTogKCkgPT4ge1xuICAgICAgICB0aGlzLmxvZ2dlci5oaWRlKClcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiJdfQ==