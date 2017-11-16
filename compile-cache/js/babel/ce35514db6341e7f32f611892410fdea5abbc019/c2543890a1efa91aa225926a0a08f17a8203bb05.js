Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createDecoratedClass = (function () { function defineProperties(target, descriptors, initializers) { for (var i = 0; i < descriptors.length; i++) { var descriptor = descriptors[i]; var decorators = descriptor.decorators; var key = descriptor.key; delete descriptor.key; delete descriptor.decorators; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor || descriptor.initializer) descriptor.writable = true; if (decorators) { for (var f = 0; f < decorators.length; f++) { var decorator = decorators[f]; if (typeof decorator === 'function') { descriptor = decorator(target, key, descriptor) || descriptor; } else { throw new TypeError('The decorator for method ' + descriptor.key + ' is of the invalid type ' + typeof decorator); } } if (descriptor.initializer !== undefined) { initializers[key] = descriptor; continue; } } Object.defineProperty(target, key, descriptor); } } return function (Constructor, protoProps, staticProps, protoInitializers, staticInitializers) { if (protoProps) defineProperties(Constructor.prototype, protoProps, protoInitializers); if (staticProps) defineProperties(Constructor, staticProps, staticInitializers); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _defineDecoratedPropertyDescriptor(target, key, descriptors) { var _descriptor = descriptors[key]; if (!_descriptor) return; var descriptor = {}; for (var _key in _descriptor) descriptor[_key] = _descriptor[_key]; descriptor.value = descriptor.initializer ? descriptor.initializer.call(target) : undefined; Object.defineProperty(target, key, descriptor); }

var _mobx = require('mobx');

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _untildify = require('untildify');

var _untildify2 = _interopRequireDefault(_untildify);

var _season = require('season');

var _season2 = _interopRequireDefault(_season);

'use babel';

var Project = (function () {
  var _instanceInitializers = {};
  var _instanceInitializers = {};

  _createDecoratedClass(Project, [{
    key: 'props',
    decorators: [_mobx.observable],
    initializer: function initializer() {
      return {};
    },
    enumerable: true
  }, {
    key: 'stats',
    decorators: [_mobx.observable],
    initializer: function initializer() {
      return null;
    },
    enumerable: true
  }, {
    key: 'title',
    decorators: [_mobx.computed],
    get: function get() {
      return this.props.title;
    }
  }, {
    key: 'paths',
    decorators: [_mobx.computed],
    get: function get() {
      return this.props.paths.map(function (path) {
        return (0, _untildify2['default'])(path);
      });
    }
  }, {
    key: 'group',
    decorators: [_mobx.computed],
    get: function get() {
      return this.props.group;
    }
  }, {
    key: 'rootPath',
    decorators: [_mobx.computed],
    get: function get() {
      return this.paths[0];
    }
  }, {
    key: 'settings',
    decorators: [_mobx.computed],
    get: function get() {
      return (0, _mobx.toJS)(this.props.settings);
    }
  }, {
    key: 'source',
    decorators: [_mobx.computed],
    get: function get() {
      return this.props.source;
    }
  }, {
    key: 'lastModified',
    decorators: [_mobx.computed],
    get: function get() {
      var mtime = new Date(0);
      if (this.stats) {
        mtime = this.stats.mtime;
      }

      return mtime;
    }
  }, {
    key: 'isCurrent',
    decorators: [_mobx.computed],
    get: function get() {
      var activePath = atom.project.getPaths()[0];

      if (activePath === this.rootPath) {
        return true;
      }

      return false;
    }
  }], [{
    key: 'defaultProps',
    get: function get() {
      return {
        title: '',
        group: '',
        paths: [],
        icon: 'icon-chevron-right',
        settings: {},
        devMode: false,
        template: null,
        source: null
      };
    }
  }], _instanceInitializers);

  function Project(props) {
    _classCallCheck(this, Project);

    _defineDecoratedPropertyDescriptor(this, 'props', _instanceInitializers);

    _defineDecoratedPropertyDescriptor(this, 'stats', _instanceInitializers);

    (0, _mobx.extendObservable)(this.props, Project.defaultProps);
    this.updateProps(props);
  }

  _createDecoratedClass(Project, [{
    key: 'updateProps',
    value: function updateProps(props) {
      (0, _mobx.extendObservable)(this.props, props);
      this.setFileStats();
    }
  }, {
    key: 'getProps',
    value: function getProps() {
      return (0, _mobx.toJS)(this.props);
    }
  }, {
    key: 'getChangedProps',
    value: function getChangedProps() {
      var _getProps = this.getProps();

      var props = _objectWithoutProperties(_getProps, []);

      var defaults = Project.defaultProps;

      Object.keys(defaults).forEach(function (key) {
        switch (key) {
          case 'settings':
            {
              if (Object.keys(props[key]).length === 0) {
                delete props[key];
              }
              break;
            }

          default:
            {
              if (props[key] === defaults[key]) {
                delete props[key];
              }
            }
        }
      });

      return props;
    }
  }, {
    key: 'setFileStats',
    decorators: [_mobx.action],
    value: function setFileStats() {
      var _this = this;

      _fs2['default'].stat(this.rootPath, function (err, stats) {
        if (!err) {
          _this.stats = stats;
        }
      });
    }

    /**
     * Fetch settings that are saved locally with the project
     * if there are any.
     */
  }, {
    key: 'fetchLocalSettings',
    decorators: [_mobx.action],
    value: function fetchLocalSettings() {
      var _this2 = this;

      var file = this.rootPath + '/project.cson';
      _season2['default'].readFile(file, function (err, settings) {
        if (err) {
          return;
        }

        (0, _mobx.extendObservable)(_this2.props.settings, settings);
      });
    }
  }], null, _instanceInitializers);

  return Project;
})();

exports['default'] = Project;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2JpbGx5Ly5hdG9tL3BhY2thZ2VzL3Byb2plY3QtbWFuYWdlci9saWIvbW9kZWxzL1Byb2plY3QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7b0JBRXFFLE1BQU07O2tCQUM1RCxJQUFJOzs7O3lCQUNHLFdBQVc7Ozs7c0JBQ2hCLFFBQVE7Ozs7QUFMekIsV0FBVyxDQUFDOztJQU9TLE9BQU87Ozs7d0JBQVAsT0FBTzs7OzthQUNOLEVBQUU7Ozs7Ozs7YUFDRixJQUFJOzs7Ozs7U0FFTCxlQUFHO0FBQ3BCLGFBQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUM7S0FDekI7Ozs7U0FFa0IsZUFBRztBQUNwQixhQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxVQUFBLElBQUk7ZUFBSSw0QkFBVSxJQUFJLENBQUM7T0FBQSxDQUFDLENBQUM7S0FDdEQ7Ozs7U0FFa0IsZUFBRztBQUNwQixhQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDO0tBQ3pCOzs7O1NBRXFCLGVBQUc7QUFDdkIsYUFBTyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQ3RCOzs7O1NBRXFCLGVBQUc7QUFDdkIsYUFBTyxnQkFBSyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0tBQ2xDOzs7O1NBRW1CLGVBQUc7QUFDckIsYUFBTyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQztLQUMxQjs7OztTQUV5QixlQUFHO0FBQzNCLFVBQUksS0FBSyxHQUFHLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3hCLFVBQUksSUFBSSxDQUFDLEtBQUssRUFBRTtBQUNkLGFBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQztPQUMxQjs7QUFFRCxhQUFPLEtBQUssQ0FBQztLQUNkOzs7O1NBRXNCLGVBQUc7QUFDeEIsVUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7QUFFOUMsVUFBSSxVQUFVLEtBQUssSUFBSSxDQUFDLFFBQVEsRUFBRTtBQUNoQyxlQUFPLElBQUksQ0FBQztPQUNiOztBQUVELGFBQU8sS0FBSyxDQUFDO0tBQ2Q7OztTQUVzQixlQUFHO0FBQ3hCLGFBQU87QUFDTCxhQUFLLEVBQUUsRUFBRTtBQUNULGFBQUssRUFBRSxFQUFFO0FBQ1QsYUFBSyxFQUFFLEVBQUU7QUFDVCxZQUFJLEVBQUUsb0JBQW9CO0FBQzFCLGdCQUFRLEVBQUUsRUFBRTtBQUNaLGVBQU8sRUFBRSxLQUFLO0FBQ2QsZ0JBQVEsRUFBRSxJQUFJO0FBQ2QsY0FBTSxFQUFFLElBQUk7T0FDYixDQUFDO0tBQ0g7OztBQUVVLFdBNURRLE9BQU8sQ0E0RGQsS0FBSyxFQUFFOzBCQTVEQSxPQUFPOzs7Ozs7QUE2RHhCLGdDQUFpQixJQUFJLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUNuRCxRQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO0dBQ3pCOzt3QkEvRGtCLE9BQU87O1dBaUVmLHFCQUFDLEtBQUssRUFBRTtBQUNqQixrQ0FBaUIsSUFBSSxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztBQUNwQyxVQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7S0FDckI7OztXQUVPLG9CQUFHO0FBQ1QsYUFBTyxnQkFBSyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDekI7OztXQUVjLDJCQUFHO3NCQUNLLElBQUksQ0FBQyxRQUFRLEVBQUU7O1VBQXpCLEtBQUs7O0FBQ2hCLFVBQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUM7O0FBRXRDLFlBQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUMsR0FBRyxFQUFLO0FBQ3JDLGdCQUFRLEdBQUc7QUFDVCxlQUFLLFVBQVU7QUFBRTtBQUNmLGtCQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtBQUN4Qyx1QkFBTyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7ZUFDbkI7QUFDRCxvQkFBTTthQUNQOztBQUFBLEFBRUQ7QUFBUztBQUNQLGtCQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsS0FBSyxRQUFRLENBQUMsR0FBRyxDQUFDLEVBQUU7QUFDaEMsdUJBQU8sS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2VBQ25CO2FBQ0Y7QUFBQSxTQUNGO09BQ0YsQ0FBQyxDQUFDOztBQUVILGFBQU8sS0FBSyxDQUFDO0tBQ2Q7Ozs7V0FFbUIsd0JBQUc7OztBQUNyQixzQkFBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxVQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUs7QUFDckMsWUFBSSxDQUFDLEdBQUcsRUFBRTtBQUNSLGdCQUFLLEtBQUssR0FBRyxLQUFLLENBQUM7U0FDcEI7T0FDRixDQUFDLENBQUM7S0FDSjs7Ozs7Ozs7O1dBTXlCLDhCQUFHOzs7QUFDM0IsVUFBTSxJQUFJLEdBQU0sSUFBSSxDQUFDLFFBQVEsa0JBQWUsQ0FBQztBQUM3QywwQkFBSyxRQUFRLENBQUMsSUFBSSxFQUFFLFVBQUMsR0FBRyxFQUFFLFFBQVEsRUFBSztBQUNyQyxZQUFJLEdBQUcsRUFBRTtBQUNQLGlCQUFPO1NBQ1I7O0FBRUQsb0NBQWlCLE9BQUssS0FBSyxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQztPQUNqRCxDQUFDLENBQUM7S0FDSjs7O1NBdkhrQixPQUFPOzs7cUJBQVAsT0FBTyIsImZpbGUiOiIvaG9tZS9iaWxseS8uYXRvbS9wYWNrYWdlcy9wcm9qZWN0LW1hbmFnZXIvbGliL21vZGVscy9Qcm9qZWN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmltcG9ydCB7IG9ic2VydmFibGUsIGNvbXB1dGVkLCBleHRlbmRPYnNlcnZhYmxlLCBhY3Rpb24sIHRvSlMgfSBmcm9tICdtb2J4JztcbmltcG9ydCBmcyBmcm9tICdmcyc7XG5pbXBvcnQgdW50aWxkaWZ5IGZyb20gJ3VudGlsZGlmeSc7XG5pbXBvcnQgQ1NPTiBmcm9tICdzZWFzb24nO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQcm9qZWN0IHtcbiAgQG9ic2VydmFibGUgcHJvcHMgPSB7fVxuICBAb2JzZXJ2YWJsZSBzdGF0cyA9IG51bGw7XG5cbiAgQGNvbXB1dGVkIGdldCB0aXRsZSgpIHtcbiAgICByZXR1cm4gdGhpcy5wcm9wcy50aXRsZTtcbiAgfVxuXG4gIEBjb21wdXRlZCBnZXQgcGF0aHMoKSB7XG4gICAgcmV0dXJuIHRoaXMucHJvcHMucGF0aHMubWFwKHBhdGggPT4gdW50aWxkaWZ5KHBhdGgpKTtcbiAgfVxuXG4gIEBjb21wdXRlZCBnZXQgZ3JvdXAoKSB7XG4gICAgcmV0dXJuIHRoaXMucHJvcHMuZ3JvdXA7XG4gIH1cblxuICBAY29tcHV0ZWQgZ2V0IHJvb3RQYXRoKCkge1xuICAgIHJldHVybiB0aGlzLnBhdGhzWzBdO1xuICB9XG5cbiAgQGNvbXB1dGVkIGdldCBzZXR0aW5ncygpIHtcbiAgICByZXR1cm4gdG9KUyh0aGlzLnByb3BzLnNldHRpbmdzKTtcbiAgfVxuXG4gIEBjb21wdXRlZCBnZXQgc291cmNlKCkge1xuICAgIHJldHVybiB0aGlzLnByb3BzLnNvdXJjZTtcbiAgfVxuXG4gIEBjb21wdXRlZCBnZXQgbGFzdE1vZGlmaWVkKCkge1xuICAgIGxldCBtdGltZSA9IG5ldyBEYXRlKDApO1xuICAgIGlmICh0aGlzLnN0YXRzKSB7XG4gICAgICBtdGltZSA9IHRoaXMuc3RhdHMubXRpbWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIG10aW1lO1xuICB9XG5cbiAgQGNvbXB1dGVkIGdldCBpc0N1cnJlbnQoKSB7XG4gICAgY29uc3QgYWN0aXZlUGF0aCA9IGF0b20ucHJvamVjdC5nZXRQYXRocygpWzBdO1xuXG4gICAgaWYgKGFjdGl2ZVBhdGggPT09IHRoaXMucm9vdFBhdGgpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHN0YXRpYyBnZXQgZGVmYXVsdFByb3BzKCkge1xuICAgIHJldHVybiB7XG4gICAgICB0aXRsZTogJycsXG4gICAgICBncm91cDogJycsXG4gICAgICBwYXRoczogW10sXG4gICAgICBpY29uOiAnaWNvbi1jaGV2cm9uLXJpZ2h0JyxcbiAgICAgIHNldHRpbmdzOiB7fSxcbiAgICAgIGRldk1vZGU6IGZhbHNlLFxuICAgICAgdGVtcGxhdGU6IG51bGwsXG4gICAgICBzb3VyY2U6IG51bGwsXG4gICAgfTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgZXh0ZW5kT2JzZXJ2YWJsZSh0aGlzLnByb3BzLCBQcm9qZWN0LmRlZmF1bHRQcm9wcyk7XG4gICAgdGhpcy51cGRhdGVQcm9wcyhwcm9wcyk7XG4gIH1cblxuICB1cGRhdGVQcm9wcyhwcm9wcykge1xuICAgIGV4dGVuZE9ic2VydmFibGUodGhpcy5wcm9wcywgcHJvcHMpO1xuICAgIHRoaXMuc2V0RmlsZVN0YXRzKCk7XG4gIH1cblxuICBnZXRQcm9wcygpIHtcbiAgICByZXR1cm4gdG9KUyh0aGlzLnByb3BzKTtcbiAgfVxuXG4gIGdldENoYW5nZWRQcm9wcygpIHtcbiAgICBjb25zdCB7IC4uLnByb3BzIH0gPSB0aGlzLmdldFByb3BzKCk7XG4gICAgY29uc3QgZGVmYXVsdHMgPSBQcm9qZWN0LmRlZmF1bHRQcm9wcztcblxuICAgIE9iamVjdC5rZXlzKGRlZmF1bHRzKS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgIHN3aXRjaCAoa2V5KSB7XG4gICAgICAgIGNhc2UgJ3NldHRpbmdzJzoge1xuICAgICAgICAgIGlmIChPYmplY3Qua2V5cyhwcm9wc1trZXldKS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIGRlbGV0ZSBwcm9wc1trZXldO1xuICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIGRlZmF1bHQ6IHtcbiAgICAgICAgICBpZiAocHJvcHNba2V5XSA9PT0gZGVmYXVsdHNba2V5XSkge1xuICAgICAgICAgICAgZGVsZXRlIHByb3BzW2tleV07XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gcHJvcHM7XG4gIH1cblxuICBAYWN0aW9uIHNldEZpbGVTdGF0cygpIHtcbiAgICBmcy5zdGF0KHRoaXMucm9vdFBhdGgsIChlcnIsIHN0YXRzKSA9PiB7XG4gICAgICBpZiAoIWVycikge1xuICAgICAgICB0aGlzLnN0YXRzID0gc3RhdHM7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogRmV0Y2ggc2V0dGluZ3MgdGhhdCBhcmUgc2F2ZWQgbG9jYWxseSB3aXRoIHRoZSBwcm9qZWN0XG4gICAqIGlmIHRoZXJlIGFyZSBhbnkuXG4gICAqL1xuICBAYWN0aW9uIGZldGNoTG9jYWxTZXR0aW5ncygpIHtcbiAgICBjb25zdCBmaWxlID0gYCR7dGhpcy5yb290UGF0aH0vcHJvamVjdC5jc29uYDtcbiAgICBDU09OLnJlYWRGaWxlKGZpbGUsIChlcnIsIHNldHRpbmdzKSA9PiB7XG4gICAgICBpZiAoZXJyKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgZXh0ZW5kT2JzZXJ2YWJsZSh0aGlzLnByb3BzLnNldHRpbmdzLCBzZXR0aW5ncyk7XG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==