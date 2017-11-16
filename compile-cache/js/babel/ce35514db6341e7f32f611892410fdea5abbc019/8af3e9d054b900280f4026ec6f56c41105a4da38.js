Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createDecoratedClass = (function () { function defineProperties(target, descriptors, initializers) { for (var i = 0; i < descriptors.length; i++) { var descriptor = descriptors[i]; var decorators = descriptor.decorators; var key = descriptor.key; delete descriptor.key; delete descriptor.decorators; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor || descriptor.initializer) descriptor.writable = true; if (decorators) { for (var f = 0; f < decorators.length; f++) { var decorator = decorators[f]; if (typeof decorator === 'function') { descriptor = decorator(target, key, descriptor) || descriptor; } else { throw new TypeError('The decorator for method ' + descriptor.key + ' is of the invalid type ' + typeof decorator); } } if (descriptor.initializer !== undefined) { initializers[key] = descriptor; continue; } } Object.defineProperty(target, key, descriptor); } } return function (Constructor, protoProps, staticProps, protoInitializers, staticInitializers) { if (protoProps) defineProperties(Constructor.prototype, protoProps, protoInitializers); if (staticProps) defineProperties(Constructor, staticProps, staticInitializers); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _defineDecoratedPropertyDescriptor(target, key, descriptors) { var _descriptor = descriptors[key]; if (!_descriptor) return; var descriptor = {}; for (var _key in _descriptor) descriptor[_key] = _descriptor[_key]; descriptor.value = descriptor.initializer ? descriptor.initializer.call(target) : undefined; Object.defineProperty(target, key, descriptor); }

var _mobx = require('mobx');

var _untildify = require('untildify');

var _untildify2 = _interopRequireDefault(_untildify);

var _tildify = require('tildify');

var _tildify2 = _interopRequireDefault(_tildify);

var _atomProjectUtil = require('atom-project-util');

var _atomProjectUtil2 = _interopRequireDefault(_atomProjectUtil);

var _underscorePlus = require('underscore-plus');

var _storesFileStore = require('./stores/FileStore');

var _storesFileStore2 = _interopRequireDefault(_storesFileStore);

var _storesGitStore = require('./stores/GitStore');

var _storesGitStore2 = _interopRequireDefault(_storesGitStore);

var _Settings = require('./Settings');

var _Settings2 = _interopRequireDefault(_Settings);

var _modelsProject = require('./models/Project');

var _modelsProject2 = _interopRequireDefault(_modelsProject);

'use babel';

var Manager = (function () {
  var _instanceInitializers = {};
  var _instanceInitializers = {};

  _createDecoratedClass(Manager, [{
    key: 'projects',
    decorators: [_mobx.observable],
    initializer: function initializer() {
      return [];
    },
    enumerable: true
  }, {
    key: 'activePaths',
    decorators: [_mobx.observable],
    initializer: function initializer() {
      return [];
    },
    enumerable: true
  }, {
    key: 'activeProject',
    decorators: [_mobx.computed],
    get: function get() {
      var _this = this;

      if (this.activePaths.length === 0) {
        return null;
      }

      return this.projects.find(function (project) {
        return project.rootPath === _this.activePaths[0];
      });
    }
  }], null, _instanceInitializers);

  function Manager() {
    var _this2 = this;

    _classCallCheck(this, Manager);

    _defineDecoratedPropertyDescriptor(this, 'projects', _instanceInitializers);

    _defineDecoratedPropertyDescriptor(this, 'activePaths', _instanceInitializers);

    this.gitStore = new _storesGitStore2['default']();
    this.fileStore = new _storesFileStore2['default']();
    this.settings = new _Settings2['default']();

    this.fetchProjects();

    atom.config.observe('project-manager.includeGitRepositories', function (include) {
      if (include) {
        _this2.gitStore.fetch();
      } else {
        _this2.gitStore.empty();
      }
    });

    (0, _mobx.autorun)(function () {
      (0, _underscorePlus.each)(_this2.fileStore.data, function (fileProp) {
        _this2.addProject(fileProp);
      }, _this2);
    });

    (0, _mobx.autorun)(function () {
      (0, _underscorePlus.each)(_this2.gitStore.data, function (gitProp) {
        _this2.addProject(gitProp);
      }, _this2);
    });

    (0, _mobx.autorun)(function () {
      if (_this2.activeProject) {
        _this2.settings.load(_this2.activeProject.settings);
      }
    });

    this.activePaths = atom.project.getPaths();
    atom.project.onDidChangePaths(function () {
      _this2.activePaths = atom.project.getPaths();
      var activePaths = atom.project.getPaths();

      if (_this2.activeProject && _this2.activeProject.rootPath === activePaths[0]) {
        if (_this2.activeProject.paths.length !== activePaths.length) {
          _this2.activeProject.updateProps({ paths: activePaths });
          _this2.saveProjects();
        }
      }
    });
  }

  /**
   * Create or Update a project.
   *
   * Props coming from file goes before any other source.
   */

  _createDecoratedClass(Manager, [{
    key: 'addProject',
    decorators: [_mobx.action],
    value: function addProject(props) {
      var foundProject = this.projects.find(function (project) {
        var projectRootPath = project.rootPath.toLowerCase();
        var propsRootPath = (0, _untildify2['default'])(props.paths[0]).toLowerCase();
        return projectRootPath === propsRootPath;
      });

      if (!foundProject) {
        var newProject = new _modelsProject2['default'](props);
        this.projects.push(newProject);
      } else {
        if (foundProject.source === 'file' && props.source === 'file') {
          foundProject.updateProps(props);
        }

        if (props.source === 'file' || typeof props.source === 'undefined') {
          foundProject.updateProps(props);
        }
      }
    }
  }, {
    key: 'fetchProjects',
    value: function fetchProjects() {
      this.fileStore.fetch();

      if (atom.config.get('project-manager.includeGitRepositories')) {
        this.gitStore.fetch();
      }
    }
  }, {
    key: 'saveProject',
    value: function saveProject(props) {
      var propsToSave = props;
      if (Manager.isProject(props)) {
        propsToSave = props.getProps();
      }
      this.addProject(_extends({}, propsToSave, { source: 'file' }));
      this.saveProjects();
    }
  }, {
    key: 'saveProjects',
    value: function saveProjects() {
      var projects = this.projects.filter(function (project) {
        return project.props.source === 'file';
      });

      var arr = (0, _underscorePlus.map)(projects, function (project) {
        var props = project.getChangedProps();
        delete props.source;

        if (atom.config.get('project-manager.savePathsRelativeToHome')) {
          props.paths = props.paths.map(function (path) {
            return (0, _tildify2['default'])(path);
          });
        }

        return props;
      });

      this.fileStore.store(arr);
    }
  }], [{
    key: 'open',
    value: function open(project) {
      var openInSameWindow = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

      if (Manager.isProject(project)) {
        var _project$getProps = project.getProps();

        var devMode = _project$getProps.devMode;

        if (openInSameWindow) {
          _atomProjectUtil2['default']['switch'](project.paths);
        } else {
          atom.open({
            devMode: devMode,
            pathsToOpen: project.paths
          });
        }
      }
    }
  }, {
    key: 'isProject',
    value: function isProject(project) {
      if (project instanceof _modelsProject2['default']) {
        return true;
      }

      return false;
    }
  }], _instanceInitializers);

  return Manager;
})();

exports.Manager = Manager;

var manager = new Manager();
exports['default'] = manager;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2JpbGx5Ly5hdG9tL3BhY2thZ2VzL3Byb2plY3QtbWFuYWdlci9saWIvTWFuYWdlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztvQkFFc0QsTUFBTTs7eUJBQ3RDLFdBQVc7Ozs7dUJBQ2IsU0FBUzs7OzsrQkFDTCxtQkFBbUI7Ozs7OEJBQ2pCLGlCQUFpQjs7K0JBQ3JCLG9CQUFvQjs7Ozs4QkFDckIsbUJBQW1COzs7O3dCQUNuQixZQUFZOzs7OzZCQUNiLGtCQUFrQjs7OztBQVZ0QyxXQUFXLENBQUM7O0lBWUMsT0FBTzs7Ozt3QkFBUCxPQUFPOzs7O2FBQ0ssRUFBRTs7Ozs7OzthQUNDLEVBQUU7Ozs7OztTQUVELGVBQUc7OztBQUM1QixVQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtBQUNqQyxlQUFPLElBQUksQ0FBQztPQUNiOztBQUVELGFBQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsVUFBQSxPQUFPO2VBQUksT0FBTyxDQUFDLFFBQVEsS0FBSyxNQUFLLFdBQVcsQ0FBQyxDQUFDLENBQUM7T0FBQSxDQUFDLENBQUM7S0FDaEY7OztBQUVVLFdBWkEsT0FBTyxHQVlKOzs7MEJBWkgsT0FBTzs7Ozs7O0FBYWhCLFFBQUksQ0FBQyxRQUFRLEdBQUcsaUNBQWMsQ0FBQztBQUMvQixRQUFJLENBQUMsU0FBUyxHQUFHLGtDQUFlLENBQUM7QUFDakMsUUFBSSxDQUFDLFFBQVEsR0FBRywyQkFBYyxDQUFDOztBQUUvQixRQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7O0FBRXJCLFFBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLHdDQUF3QyxFQUFFLFVBQUMsT0FBTyxFQUFLO0FBQ3pFLFVBQUksT0FBTyxFQUFFO0FBQ1gsZUFBSyxRQUFRLENBQUMsS0FBSyxFQUFFLENBQUM7T0FDdkIsTUFBTTtBQUNMLGVBQUssUUFBUSxDQUFDLEtBQUssRUFBRSxDQUFDO09BQ3ZC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QUFDLENBQUM7U0FDbkMsTUFBTTtBQUNMLGNBQUksQ0FBQyxJQUFJLENBQUM7QUFDUixtQkFBTyxFQUFQLE9BQU87QUFDUCx1QkFBVyxFQUFFLE9BQU8sQ0FBQyxLQUFLO1dBQzNCLENBQUMsQ0FBQztTQUNKO09BQ0Y7S0FDRjs7O1dBNEJlLG1CQUFDLE9BQU8sRUFBRTtBQUN4QixVQUFJLE9BQU8sc0NBQW1CLEVBQUU7QUFDOUIsZUFBTyxJQUFJLENBQUM7T0FDYjs7QUFFRCxhQUFPLEtBQUssQ0FBQztLQUNkOzs7U0E1SVUsT0FBTzs7Ozs7QUErSXBCLElBQU0sT0FBTyxHQUFHLElBQUksT0FBTyxFQUFFLENBQUM7cUJBQ2YsT0FBTyIsImZpbGUiOiIvaG9tZS9iaWxseS8uYXRvbS9wYWNrYWdlcy9wcm9qZWN0LW1hbmFnZXIvbGliL01hbmFnZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuaW1wb3J0IHsgb2JzZXJ2YWJsZSwgYXV0b3J1biwgY29tcHV0ZWQsIGFjdGlvbiB9IGZyb20gJ21vYngnO1xuaW1wb3J0IHVudGlsZGlmeSBmcm9tICd1bnRpbGRpZnknO1xuaW1wb3J0IHRpbGRpZnkgZnJvbSAndGlsZGlmeSc7XG5pbXBvcnQgcHJvamVjdFV0aWwgZnJvbSAnYXRvbS1wcm9qZWN0LXV0aWwnO1xuaW1wb3J0IHsgZWFjaCwgbWFwIH0gZnJvbSAndW5kZXJzY29yZS1wbHVzJztcbmltcG9ydCBGaWxlU3RvcmUgZnJvbSAnLi9zdG9yZXMvRmlsZVN0b3JlJztcbmltcG9ydCBHaXRTdG9yZSBmcm9tICcuL3N0b3Jlcy9HaXRTdG9yZSc7XG5pbXBvcnQgU2V0dGluZ3MgZnJvbSAnLi9TZXR0aW5ncyc7XG5pbXBvcnQgUHJvamVjdCBmcm9tICcuL21vZGVscy9Qcm9qZWN0JztcblxuZXhwb3J0IGNsYXNzIE1hbmFnZXIge1xuICBAb2JzZXJ2YWJsZSBwcm9qZWN0cyA9IFtdO1xuICBAb2JzZXJ2YWJsZSBhY3RpdmVQYXRocyA9IFtdO1xuXG4gIEBjb21wdXRlZCBnZXQgYWN0aXZlUHJvamVjdCgpIHtcbiAgICBpZiAodGhpcy5hY3RpdmVQYXRocy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLnByb2plY3RzLmZpbmQocHJvamVjdCA9PiBwcm9qZWN0LnJvb3RQYXRoID09PSB0aGlzLmFjdGl2ZVBhdGhzWzBdKTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuZ2l0U3RvcmUgPSBuZXcgR2l0U3RvcmUoKTtcbiAgICB0aGlzLmZpbGVTdG9yZSA9IG5ldyBGaWxlU3RvcmUoKTtcbiAgICB0aGlzLnNldHRpbmdzID0gbmV3IFNldHRpbmdzKCk7XG5cbiAgICB0aGlzLmZldGNoUHJvamVjdHMoKTtcblxuICAgIGF0b20uY29uZmlnLm9ic2VydmUoJ3Byb2plY3QtbWFuYWdlci5pbmNsdWRlR2l0UmVwb3NpdG9yaWVzJywgKGluY2x1ZGUpID0+IHtcbiAgICAgIGlmIChpbmNsdWRlKSB7XG4gICAgICAgIHRoaXMuZ2l0U3RvcmUuZmV0Y2goKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuZ2l0U3RvcmUuZW1wdHkoKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGF1dG9ydW4oKCkgPT4ge1xuICAgICAgZWFjaCh0aGlzLmZpbGVTdG9yZS5kYXRhLCAoZmlsZVByb3ApID0+IHtcbiAgICAgICAgdGhpcy5hZGRQcm9qZWN0KGZpbGVQcm9wKTtcbiAgICAgIH0sIHRoaXMpO1xuICAgIH0pO1xuXG4gICAgYXV0b3J1bigoKSA9PiB7XG4gICAgICBlYWNoKHRoaXMuZ2l0U3RvcmUuZGF0YSwgKGdpdFByb3ApID0+IHtcbiAgICAgICAgdGhpcy5hZGRQcm9qZWN0KGdpdFByb3ApO1xuICAgICAgfSwgdGhpcyk7XG4gICAgfSk7XG5cbiAgICBhdXRvcnVuKCgpID0+IHtcbiAgICAgIGlmICh0aGlzLmFjdGl2ZVByb2plY3QpIHtcbiAgICAgICAgdGhpcy5zZXR0aW5ncy5sb2FkKHRoaXMuYWN0aXZlUHJvamVjdC5zZXR0aW5ncyk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB0aGlzLmFjdGl2ZVBhdGhzID0gYXRvbS5wcm9qZWN0LmdldFBhdGhzKCk7XG4gICAgYXRvbS5wcm9qZWN0Lm9uRGlkQ2hhbmdlUGF0aHMoKCkgPT4ge1xuICAgICAgdGhpcy5hY3RpdmVQYXRocyA9IGF0b20ucHJvamVjdC5nZXRQYXRocygpO1xuICAgICAgY29uc3QgYWN0aXZlUGF0aHMgPSBhdG9tLnByb2plY3QuZ2V0UGF0aHMoKTtcblxuICAgICAgaWYgKHRoaXMuYWN0aXZlUHJvamVjdCAmJiB0aGlzLmFjdGl2ZVByb2plY3Qucm9vdFBhdGggPT09IGFjdGl2ZVBhdGhzWzBdKSB7XG4gICAgICAgIGlmICh0aGlzLmFjdGl2ZVByb2plY3QucGF0aHMubGVuZ3RoICE9PSBhY3RpdmVQYXRocy5sZW5ndGgpIHtcbiAgICAgICAgICB0aGlzLmFjdGl2ZVByb2plY3QudXBkYXRlUHJvcHMoeyBwYXRoczogYWN0aXZlUGF0aHMgfSk7XG4gICAgICAgICAgdGhpcy5zYXZlUHJvamVjdHMoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBvciBVcGRhdGUgYSBwcm9qZWN0LlxuICAgKlxuICAgKiBQcm9wcyBjb21pbmcgZnJvbSBmaWxlIGdvZXMgYmVmb3JlIGFueSBvdGhlciBzb3VyY2UuXG4gICAqL1xuICBAYWN0aW9uIGFkZFByb2plY3QocHJvcHMpIHtcbiAgICBjb25zdCBmb3VuZFByb2plY3QgPSB0aGlzLnByb2plY3RzLmZpbmQoKHByb2plY3QpID0+IHtcbiAgICAgIGNvbnN0IHByb2plY3RSb290UGF0aCA9IHByb2plY3Qucm9vdFBhdGgudG9Mb3dlckNhc2UoKTtcbiAgICAgIGNvbnN0IHByb3BzUm9vdFBhdGggPSB1bnRpbGRpZnkocHJvcHMucGF0aHNbMF0pLnRvTG93ZXJDYXNlKCk7XG4gICAgICByZXR1cm4gcHJvamVjdFJvb3RQYXRoID09PSBwcm9wc1Jvb3RQYXRoO1xuICAgIH0pO1xuXG4gICAgaWYgKCFmb3VuZFByb2plY3QpIHtcbiAgICAgIGNvbnN0IG5ld1Byb2plY3QgPSBuZXcgUHJvamVjdChwcm9wcyk7XG4gICAgICB0aGlzLnByb2plY3RzLnB1c2gobmV3UHJvamVjdCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChmb3VuZFByb2plY3Quc291cmNlID09PSAnZmlsZScgJiYgcHJvcHMuc291cmNlID09PSAnZmlsZScpIHtcbiAgICAgICAgZm91bmRQcm9qZWN0LnVwZGF0ZVByb3BzKHByb3BzKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHByb3BzLnNvdXJjZSA9PT0gJ2ZpbGUnIHx8IHR5cGVvZiBwcm9wcy5zb3VyY2UgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIGZvdW5kUHJvamVjdC51cGRhdGVQcm9wcyhwcm9wcyk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZmV0Y2hQcm9qZWN0cygpIHtcbiAgICB0aGlzLmZpbGVTdG9yZS5mZXRjaCgpO1xuXG4gICAgaWYgKGF0b20uY29uZmlnLmdldCgncHJvamVjdC1tYW5hZ2VyLmluY2x1ZGVHaXRSZXBvc2l0b3JpZXMnKSkge1xuICAgICAgdGhpcy5naXRTdG9yZS5mZXRjaCgpO1xuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyBvcGVuKHByb2plY3QsIG9wZW5JblNhbWVXaW5kb3cgPSBmYWxzZSkge1xuICAgIGlmIChNYW5hZ2VyLmlzUHJvamVjdChwcm9qZWN0KSkge1xuICAgICAgY29uc3QgeyBkZXZNb2RlIH0gPSBwcm9qZWN0LmdldFByb3BzKCk7XG5cbiAgICAgIGlmIChvcGVuSW5TYW1lV2luZG93KSB7XG4gICAgICAgIHByb2plY3RVdGlsLnN3aXRjaChwcm9qZWN0LnBhdGhzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGF0b20ub3Blbih7XG4gICAgICAgICAgZGV2TW9kZSxcbiAgICAgICAgICBwYXRoc1RvT3BlbjogcHJvamVjdC5wYXRocyxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgc2F2ZVByb2plY3QocHJvcHMpIHtcbiAgICBsZXQgcHJvcHNUb1NhdmUgPSBwcm9wcztcbiAgICBpZiAoTWFuYWdlci5pc1Byb2plY3QocHJvcHMpKSB7XG4gICAgICBwcm9wc1RvU2F2ZSA9IHByb3BzLmdldFByb3BzKCk7XG4gICAgfVxuICAgIHRoaXMuYWRkUHJvamVjdCh7IC4uLnByb3BzVG9TYXZlLCBzb3VyY2U6ICdmaWxlJyB9KTtcbiAgICB0aGlzLnNhdmVQcm9qZWN0cygpO1xuICB9XG5cbiAgc2F2ZVByb2plY3RzKCkge1xuICAgIGNvbnN0IHByb2plY3RzID0gdGhpcy5wcm9qZWN0cy5maWx0ZXIocHJvamVjdCA9PiBwcm9qZWN0LnByb3BzLnNvdXJjZSA9PT0gJ2ZpbGUnKTtcblxuICAgIGNvbnN0IGFyciA9IG1hcChwcm9qZWN0cywgKHByb2plY3QpID0+IHtcbiAgICAgIGNvbnN0IHByb3BzID0gcHJvamVjdC5nZXRDaGFuZ2VkUHJvcHMoKTtcbiAgICAgIGRlbGV0ZSBwcm9wcy5zb3VyY2U7XG5cbiAgICAgIGlmIChhdG9tLmNvbmZpZy5nZXQoJ3Byb2plY3QtbWFuYWdlci5zYXZlUGF0aHNSZWxhdGl2ZVRvSG9tZScpKSB7XG4gICAgICAgIHByb3BzLnBhdGhzID0gcHJvcHMucGF0aHMubWFwKHBhdGggPT4gdGlsZGlmeShwYXRoKSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBwcm9wcztcbiAgICB9KTtcblxuICAgIHRoaXMuZmlsZVN0b3JlLnN0b3JlKGFycik7XG4gIH1cblxuICBzdGF0aWMgaXNQcm9qZWN0KHByb2plY3QpIHtcbiAgICBpZiAocHJvamVjdCBpbnN0YW5jZW9mIFByb2plY3QpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuXG5jb25zdCBtYW5hZ2VyID0gbmV3IE1hbmFnZXIoKTtcbmV4cG9ydCBkZWZhdWx0IG1hbmFnZXI7XG4iXX0=