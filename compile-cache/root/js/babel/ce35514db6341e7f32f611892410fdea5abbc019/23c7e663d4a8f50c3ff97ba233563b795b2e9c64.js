Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createDecoratedClass = (function () { function defineProperties(target, descriptors, initializers) { for (var i = 0; i < descriptors.length; i++) { var descriptor = descriptors[i]; var decorators = descriptor.decorators; var key = descriptor.key; delete descriptor.key; delete descriptor.decorators; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor || descriptor.initializer) descriptor.writable = true; if (decorators) { for (var f = 0; f < decorators.length; f++) { var decorator = decorators[f]; if (typeof decorator === 'function') { descriptor = decorator(target, key, descriptor) || descriptor; } else { throw new TypeError('The decorator for method ' + descriptor.key + ' is of the invalid type ' + typeof decorator); } } if (descriptor.initializer !== undefined) { initializers[key] = descriptor; continue; } } Object.defineProperty(target, key, descriptor); } } return function (Constructor, protoProps, staticProps, protoInitializers, staticInitializers) { if (protoProps) defineProperties(Constructor.prototype, protoProps, protoInitializers); if (staticProps) defineProperties(Constructor, staticProps, staticInitializers); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _defineDecoratedPropertyDescriptor(target, key, descriptors) { var _descriptor = descriptors[key]; if (!_descriptor) return; var descriptor = {}; for (var _key in _descriptor) descriptor[_key] = _descriptor[_key]; descriptor.value = descriptor.initializer ? descriptor.initializer.call(target) : undefined; Object.defineProperty(target, key, descriptor); }

var _mobx = require('mobx');

var _findit = require('findit');

var _findit2 = _interopRequireDefault(_findit);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _untildify = require('untildify');

var _untildify2 = _interopRequireDefault(_untildify);

'use babel';

var GitStore = (function () {
  var _instanceInitializers = {};
  var _instanceInitializers = {};

  _createDecoratedClass(GitStore, [{
    key: 'data',
    decorators: [_mobx.observable],
    initializer: function initializer() {
      return (0, _mobx.asFlat)([]);
    },
    enumerable: true
  }], null, _instanceInitializers);

  function GitStore() {
    _classCallCheck(this, GitStore);

    _defineDecoratedPropertyDescriptor(this, 'data', _instanceInitializers);

    var ignoreDirectories = atom.config.get('project-manager.ignoreDirectories');
    this.ignore = ignoreDirectories.replace(/ /g, '').split(',');
  }

  _createDecoratedClass(GitStore, [{
    key: 'fetch',
    decorators: [_mobx.action],
    value: function fetch() {
      var _this = this;

      var projectHome = atom.config.get('core.projectHome');
      var finder = (0, _findit2['default'])((0, _untildify2['default'])(projectHome));
      this.data.clear();

      finder.on('directory', function (dir, stat, stop) {
        var base = _path2['default'].basename(dir);
        var projectPath = _path2['default'].dirname(dir);
        var projectName = _path2['default'].basename(projectPath);

        if (base === '.git') {
          _this.data.push({
            title: projectName,
            paths: [projectPath],
            source: 'git',
            icon: 'icon-repo'
          });
        }

        if (_this.ignore.includes(base)) {
          stop();
        }
      });
    }
  }, {
    key: 'empty',
    decorators: [_mobx.action],
    value: function empty() {
      this.data.clear();
    }
  }], null, _instanceInitializers);

  return GitStore;
})();

exports['default'] = GitStore;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2JpbGx5Ly5hdG9tL3BhY2thZ2VzL3Byb2plY3QtbWFuYWdlci9saWIvc3RvcmVzL0dpdFN0b3JlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztvQkFFMkMsTUFBTTs7c0JBQzlCLFFBQVE7Ozs7b0JBQ1YsTUFBTTs7Ozt5QkFDRCxXQUFXOzs7O0FBTGpDLFdBQVcsQ0FBQzs7SUFPUyxRQUFROzs7O3dCQUFSLFFBQVE7Ozs7YUFDUixrQkFBTyxFQUFFLENBQUM7Ozs7O0FBRWxCLFdBSFEsUUFBUSxHQUdiOzBCQUhLLFFBQVE7Ozs7QUFJekIsUUFBTSxpQkFBaUIsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFDO0FBQy9FLFFBQUksQ0FBQyxNQUFNLEdBQUcsaUJBQWlCLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7R0FDOUQ7O3dCQU5rQixRQUFROzs7V0FRZCxpQkFBRzs7O0FBQ2QsVUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLENBQUMsQ0FBQztBQUN4RCxVQUFNLE1BQU0sR0FBRyx5QkFBTyw0QkFBVSxXQUFXLENBQUMsQ0FBQyxDQUFDO0FBQzlDLFVBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7O0FBRWxCLFlBQU0sQ0FBQyxFQUFFLENBQUMsV0FBVyxFQUFFLFVBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUs7QUFDMUMsWUFBTSxJQUFJLEdBQUcsa0JBQUssUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ2hDLFlBQU0sV0FBVyxHQUFHLGtCQUFLLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUN0QyxZQUFNLFdBQVcsR0FBRyxrQkFBSyxRQUFRLENBQUMsV0FBVyxDQUFDLENBQUM7O0FBRS9DLFlBQUksSUFBSSxLQUFLLE1BQU0sRUFBRTtBQUNuQixnQkFBSyxJQUFJLENBQUMsSUFBSSxDQUFDO0FBQ2IsaUJBQUssRUFBRSxXQUFXO0FBQ2xCLGlCQUFLLEVBQUUsQ0FBQyxXQUFXLENBQUM7QUFDcEIsa0JBQU0sRUFBRSxLQUFLO0FBQ2IsZ0JBQUksRUFBRSxXQUFXO1dBQ2xCLENBQUMsQ0FBQztTQUNKOztBQUVELFlBQUksTUFBSyxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFO0FBQzlCLGNBQUksRUFBRSxDQUFDO1NBQ1I7T0FDRixDQUFDLENBQUM7S0FDSjs7OztXQUVZLGlCQUFHO0FBQ2QsVUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztLQUNuQjs7O1NBbkNrQixRQUFROzs7cUJBQVIsUUFBUSIsImZpbGUiOiIvaG9tZS9iaWxseS8uYXRvbS9wYWNrYWdlcy9wcm9qZWN0LW1hbmFnZXIvbGliL3N0b3Jlcy9HaXRTdG9yZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5pbXBvcnQgeyBvYnNlcnZhYmxlLCBhY3Rpb24sIGFzRmxhdCB9IGZyb20gJ21vYngnO1xuaW1wb3J0IGZpbmRpdCBmcm9tICdmaW5kaXQnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgdW50aWxkaWZ5IGZyb20gJ3VudGlsZGlmeSc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdpdFN0b3JlIHtcbiAgQG9ic2VydmFibGUgZGF0YSA9IGFzRmxhdChbXSk7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgY29uc3QgaWdub3JlRGlyZWN0b3JpZXMgPSBhdG9tLmNvbmZpZy5nZXQoJ3Byb2plY3QtbWFuYWdlci5pZ25vcmVEaXJlY3RvcmllcycpO1xuICAgIHRoaXMuaWdub3JlID0gaWdub3JlRGlyZWN0b3JpZXMucmVwbGFjZSgvIC9nLCAnJykuc3BsaXQoJywnKTtcbiAgfVxuXG4gIEBhY3Rpb24gZmV0Y2goKSB7XG4gICAgY29uc3QgcHJvamVjdEhvbWUgPSBhdG9tLmNvbmZpZy5nZXQoJ2NvcmUucHJvamVjdEhvbWUnKTtcbiAgICBjb25zdCBmaW5kZXIgPSBmaW5kaXQodW50aWxkaWZ5KHByb2plY3RIb21lKSk7XG4gICAgdGhpcy5kYXRhLmNsZWFyKCk7XG5cbiAgICBmaW5kZXIub24oJ2RpcmVjdG9yeScsIChkaXIsIHN0YXQsIHN0b3ApID0+IHtcbiAgICAgIGNvbnN0IGJhc2UgPSBwYXRoLmJhc2VuYW1lKGRpcik7XG4gICAgICBjb25zdCBwcm9qZWN0UGF0aCA9IHBhdGguZGlybmFtZShkaXIpO1xuICAgICAgY29uc3QgcHJvamVjdE5hbWUgPSBwYXRoLmJhc2VuYW1lKHByb2plY3RQYXRoKTtcblxuICAgICAgaWYgKGJhc2UgPT09ICcuZ2l0Jykge1xuICAgICAgICB0aGlzLmRhdGEucHVzaCh7XG4gICAgICAgICAgdGl0bGU6IHByb2plY3ROYW1lLFxuICAgICAgICAgIHBhdGhzOiBbcHJvamVjdFBhdGhdLFxuICAgICAgICAgIHNvdXJjZTogJ2dpdCcsXG4gICAgICAgICAgaWNvbjogJ2ljb24tcmVwbycsXG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5pZ25vcmUuaW5jbHVkZXMoYmFzZSkpIHtcbiAgICAgICAgc3RvcCgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgQGFjdGlvbiBlbXB0eSgpIHtcbiAgICB0aGlzLmRhdGEuY2xlYXIoKTtcbiAgfVxufVxuIl19