Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createDecoratedClass = (function () { function defineProperties(target, descriptors, initializers) { for (var i = 0; i < descriptors.length; i++) { var descriptor = descriptors[i]; var decorators = descriptor.decorators; var key = descriptor.key; delete descriptor.key; delete descriptor.decorators; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor || descriptor.initializer) descriptor.writable = true; if (decorators) { for (var f = 0; f < decorators.length; f++) { var decorator = decorators[f]; if (typeof decorator === 'function') { descriptor = decorator(target, key, descriptor) || descriptor; } else { throw new TypeError('The decorator for method ' + descriptor.key + ' is of the invalid type ' + typeof decorator); } } if (descriptor.initializer !== undefined) { initializers[key] = descriptor; continue; } } Object.defineProperty(target, key, descriptor); } } return function (Constructor, protoProps, staticProps, protoInitializers, staticInitializers) { if (protoProps) defineProperties(Constructor.prototype, protoProps, protoInitializers); if (staticProps) defineProperties(Constructor, staticProps, staticInitializers); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _defineDecoratedPropertyDescriptor(target, key, descriptors) { var _descriptor = descriptors[key]; if (!_descriptor) return; var descriptor = {}; for (var _key in _descriptor) descriptor[_key] = _descriptor[_key]; descriptor.value = descriptor.initializer ? descriptor.initializer.call(target) : undefined; Object.defineProperty(target, key, descriptor); }

var _mobx = require('mobx');

var _season = require('season');

var _season2 = _interopRequireDefault(_season);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

var _underscorePlus = require('underscore-plus');

'use babel';

var FileStore = (function () {
  var _instanceInitializers = {};
  var _instanceInitializers = {};

  _createDecoratedClass(FileStore, [{
    key: 'data',
    decorators: [_mobx.observable],
    initializer: function initializer() {
      return (0, _mobx.asFlat)([]);
    },
    enumerable: true
  }, {
    key: 'fetching',
    decorators: [_mobx.observable],
    initializer: function initializer() {
      return false;
    },
    enumerable: true
  }], null, _instanceInitializers);

  function FileStore() {
    var _this = this;

    _classCallCheck(this, FileStore);

    _defineDecoratedPropertyDescriptor(this, 'data', _instanceInitializers);

    _defineDecoratedPropertyDescriptor(this, 'fetching', _instanceInitializers);

    this.templates = [];

    _fs2['default'].exists(FileStore.getPath(), function (exists) {
      if (exists) {
        _this.observeFile();
      } else {
        _this.store([]);
        _this.observeFile();
      }
    });
  }

  _createDecoratedClass(FileStore, [{
    key: 'fetch',
    decorators: [_mobx.action],
    value: function fetch() {
      var _this2 = this;

      this.fetching = true;
      _season2['default'].readFile(FileStore.getPath(), function (err, data) {
        (0, _mobx.transaction)(function () {
          var results = [];
          if (err) {
            FileStore.handleError(err);
          }
          if (!err && data !== null) {
            results = data;
          }

          _this2.data.clear();
          _this2.templates = [];

          // Support for old structure.
          if (Array.isArray(results) === false) {
            results = Object.keys(results).map(function (k) {
              return results[k];
            });
          }

          // Make sure we have an array.
          if (Array.isArray(results) === false) {
            results = [];
          }

          (0, _underscorePlus.each)(results, function (res) {
            var result = res;
            var templateName = result.template || null;

            if (templateName) {
              var template = results.filter(function (props) {
                return props.title === templateName;
              });

              if (template.length) {
                result = (0, _underscorePlus.deepExtend)({}, template[0], result);
              }
            }

            if (FileStore.isProject(result)) {
              result.source = 'file';

              _this2.data.push(result);
            } else {
              _this2.templates.push(result);
            }
          }, _this2);

          _this2.fetching = false;
        });
      });
    }
  }, {
    key: 'store',
    value: function store(projects) {
      var store = projects.concat(this.templates);
      try {
        _season2['default'].writeFileSync(FileStore.getPath(), store);
      } catch (e) {
        // console.log(e);
      }
    }
  }, {
    key: 'observeFile',
    value: function observeFile() {
      var _this3 = this;

      if (this.fileWatcher) {
        this.fileWatcher.close();
      }

      try {
        this.fileWatcher = _fs2['default'].watch(FileStore.getPath(), function () {
          _this3.fetch();
        });
      } catch (error) {
        // console.log(error);
      }
    }
  }], [{
    key: 'getPath',
    value: function getPath() {
      var filedir = atom.getConfigDirPath();
      var envSettings = atom.config.get('project-manager.environmentSpecificProjects');
      var filename = 'projects.cson';

      if (envSettings) {
        var hostname = _os2['default'].hostname().split('.').shift().toLowerCase();
        filename = 'projects.' + hostname + '.cson';
      }

      return filedir + '/' + filename;
    }
  }, {
    key: 'handleError',
    value: function handleError(err) {
      switch (err.name) {
        case 'SyntaxError':
          {
            atom.notifications.addError('There is a syntax error in your projects file. Run **Project Manager: Edit Projects** to open and fix the issue.', {
              detail: err.message,
              description: 'Line: ' + err.location.first_line + ' Row: ' + err.location.first_column,
              dismissable: true
            });
            break;
          }

        default:
          {
            // No default.
          }
      }
    }
  }, {
    key: 'isProject',
    value: function isProject(settings) {
      if (typeof settings.paths === 'undefined') {
        return false;
      }

      if (settings.paths.length === 0) {
        return false;
      }

      return true;
    }
  }], _instanceInitializers);

  return FileStore;
})();

exports['default'] = FileStore;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2JpbGx5Ly5hdG9tL3BhY2thZ2VzL3Byb2plY3QtbWFuYWdlci9saWIvc3RvcmVzL0ZpbGVTdG9yZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7b0JBRXdELE1BQU07O3NCQUM3QyxRQUFROzs7O2tCQUNWLElBQUk7Ozs7a0JBQ0osSUFBSTs7Ozs4QkFDYyxpQkFBaUI7O0FBTmxELFdBQVcsQ0FBQzs7SUFRUyxTQUFTOzs7O3dCQUFULFNBQVM7Ozs7YUFDVCxrQkFBTyxFQUFFLENBQUM7Ozs7Ozs7YUFDTixLQUFLOzs7OztBQUdqQixXQUxRLFNBQVMsR0FLZDs7OzBCQUxLLFNBQVM7Ozs7OztTQUc1QixTQUFTLEdBQUcsRUFBRTs7QUFHWixvQkFBRyxNQUFNLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxFQUFFLFVBQUMsTUFBTSxFQUFLO0FBQ3pDLFVBQUksTUFBTSxFQUFFO0FBQ1YsY0FBSyxXQUFXLEVBQUUsQ0FBQztPQUNwQixNQUFNO0FBQ0wsY0FBSyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDZixjQUFLLFdBQVcsRUFBRSxDQUFDO09BQ3BCO0tBQ0YsQ0FBQyxDQUFDO0dBQ0o7O3dCQWRrQixTQUFTOzs7V0E2QmYsaUJBQUc7OztBQUNkLFVBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO0FBQ3JCLDBCQUFLLFFBQVEsQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLEVBQUUsVUFBQyxHQUFHLEVBQUUsSUFBSSxFQUFLO0FBQ2hELCtCQUFZLFlBQU07QUFDaEIsY0FBSSxPQUFPLEdBQUcsRUFBRSxDQUFDO0FBQ2pCLGNBQUksR0FBRyxFQUFFO0FBQ1AscUJBQVMsQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUM7V0FDNUI7QUFDRCxjQUFJLENBQUMsR0FBRyxJQUFJLElBQUksS0FBSyxJQUFJLEVBQUU7QUFDekIsbUJBQU8sR0FBRyxJQUFJLENBQUM7V0FDaEI7O0FBRUQsaUJBQUssSUFBSSxDQUFD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SUFBSTtBQUNkLGFBQUssYUFBYTtBQUFFO0FBQ2xCLGdCQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxrSEFBa0gsRUFBRTtBQUM5SSxvQkFBTSxFQUFFLEdBQUcsQ0FBQyxPQUFPO0FBQ25CLHlCQUFXLGFBQVcsR0FBRyxDQUFDLFFBQVEsQ0FBQyxVQUFVLGNBQVMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxZQUFZLEFBQUU7QUFDakYseUJBQVcsRUFBRSxJQUFJO2FBQ2xCLENBQUMsQ0FBQztBQUNILGtCQUFNO1dBQ1A7O0FBQUEsQUFFRDtBQUFTOztXQUVSO0FBQUEsT0FDRjtLQUNGOzs7V0FFZSxtQkFBQyxRQUFRLEVBQUU7QUFDekIsVUFBSSxPQUFPLFFBQVEsQ0FBQyxLQUFLLEtBQUssV0FBVyxFQUFFO0FBQ3pDLGVBQU8sS0FBSyxDQUFDO09BQ2Q7O0FBRUQsVUFBSSxRQUFRLENBQUMsS0FBSyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7QUFDL0IsZUFBTyxLQUFLLENBQUM7T0FDZDs7QUFFRCxhQUFPLElBQUksQ0FBQztLQUNiOzs7U0EzR2tCLFNBQVM7OztxQkFBVCxTQUFTIiwiZmlsZSI6Ii9ob21lL2JpbGx5Ly5hdG9tL3BhY2thZ2VzL3Byb2plY3QtbWFuYWdlci9saWIvc3RvcmVzL0ZpbGVTdG9yZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5pbXBvcnQgeyBvYnNlcnZhYmxlLCBhY3Rpb24sIGFzRmxhdCwgdHJhbnNhY3Rpb24gfSBmcm9tICdtb2J4JztcbmltcG9ydCBDU09OIGZyb20gJ3NlYXNvbic7XG5pbXBvcnQgZnMgZnJvbSAnZnMnO1xuaW1wb3J0IG9zIGZyb20gJ29zJztcbmltcG9ydCB7IGRlZXBFeHRlbmQsIGVhY2ggfSBmcm9tICd1bmRlcnNjb3JlLXBsdXMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBGaWxlU3RvcmUge1xuICBAb2JzZXJ2YWJsZSBkYXRhID0gYXNGbGF0KFtdKTtcbiAgQG9ic2VydmFibGUgZmV0Y2hpbmcgPSBmYWxzZTtcbiAgdGVtcGxhdGVzID0gW107XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgZnMuZXhpc3RzKEZpbGVTdG9yZS5nZXRQYXRoKCksIChleGlzdHMpID0+IHtcbiAgICAgIGlmIChleGlzdHMpIHtcbiAgICAgICAgdGhpcy5vYnNlcnZlRmlsZSgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5zdG9yZShbXSk7XG4gICAgICAgIHRoaXMub2JzZXJ2ZUZpbGUoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHN0YXRpYyBnZXRQYXRoKCkge1xuICAgIGNvbnN0IGZpbGVkaXIgPSBhdG9tLmdldENvbmZpZ0RpclBhdGgoKTtcbiAgICBjb25zdCBlbnZTZXR0aW5ncyA9IGF0b20uY29uZmlnLmdldCgncHJvamVjdC1tYW5hZ2VyLmVudmlyb25tZW50U3BlY2lmaWNQcm9qZWN0cycpO1xuICAgIGxldCBmaWxlbmFtZSA9ICdwcm9qZWN0cy5jc29uJztcblxuICAgIGlmIChlbnZTZXR0aW5ncykge1xuICAgICAgY29uc3QgaG9zdG5hbWUgPSBvcy5ob3N0bmFtZSgpLnNwbGl0KCcuJykuc2hpZnQoKS50b0xvd2VyQ2FzZSgpO1xuICAgICAgZmlsZW5hbWUgPSBgcHJvamVjdHMuJHtob3N0bmFtZX0uY3NvbmA7XG4gICAgfVxuXG4gICAgcmV0dXJuIGAke2ZpbGVkaXJ9LyR7ZmlsZW5hbWV9YDtcbiAgfVxuXG4gIEBhY3Rpb24gZmV0Y2goKSB7XG4gICAgdGhpcy5mZXRjaGluZyA9IHRydWU7XG4gICAgQ1NPTi5yZWFkRmlsZShGaWxlU3RvcmUuZ2V0UGF0aCgpLCAoZXJyLCBkYXRhKSA9PiB7XG4gICAgICB0cmFuc2FjdGlvbigoKSA9PiB7XG4gICAgICAgIGxldCByZXN1bHRzID0gW107XG4gICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICBGaWxlU3RvcmUuaGFuZGxlRXJyb3IoZXJyKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWVyciAmJiBkYXRhICE9PSBudWxsKSB7XG4gICAgICAgICAgcmVzdWx0cyA9IGRhdGE7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmRhdGEuY2xlYXIoKTtcbiAgICAgICAgdGhpcy50ZW1wbGF0ZXMgPSBbXTtcblxuICAgICAgICAvLyBTdXBwb3J0IGZvciBvbGQgc3RydWN0dXJlLlxuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShyZXN1bHRzKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICByZXN1bHRzID0gT2JqZWN0LmtleXMocmVzdWx0cykubWFwKGsgPT4gcmVzdWx0c1trXSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBNYWtlIHN1cmUgd2UgaGF2ZSBhbiBhcnJheS5cbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkocmVzdWx0cykgPT09IGZhbHNlKSB7XG4gICAgICAgICAgcmVzdWx0cyA9IFtdO1xuICAgICAgICB9XG5cbiAgICAgICAgZWFjaChyZXN1bHRzLCAocmVzKSA9PiB7XG4gICAgICAgICAgbGV0IHJlc3VsdCA9IHJlcztcbiAgICAgICAgICBjb25zdCB0ZW1wbGF0ZU5hbWUgPSByZXN1bHQudGVtcGxhdGUgfHwgbnVsbDtcblxuICAgICAgICAgIGlmICh0ZW1wbGF0ZU5hbWUpIHtcbiAgICAgICAgICAgIGNvbnN0IHRlbXBsYXRlID0gcmVzdWx0cy5maWx0ZXIocHJvcHMgPT4gcHJvcHMudGl0bGUgPT09IHRlbXBsYXRlTmFtZSk7XG5cbiAgICAgICAgICAgIGlmICh0ZW1wbGF0ZS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgcmVzdWx0ID0gZGVlcEV4dGVuZCh7fSwgdGVtcGxhdGVbMF0sIHJlc3VsdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKEZpbGVTdG9yZS5pc1Byb2plY3QocmVzdWx0KSkge1xuICAgICAgICAgICAgcmVzdWx0LnNvdXJjZSA9ICdmaWxlJztcblxuICAgICAgICAgICAgdGhpcy5kYXRhLnB1c2gocmVzdWx0KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy50ZW1wbGF0ZXMucHVzaChyZXN1bHQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSwgdGhpcyk7XG5cbiAgICAgICAgdGhpcy5mZXRjaGluZyA9IGZhbHNlO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBzdGF0aWMgaGFuZGxlRXJyb3IoZXJyKSB7XG4gICAgc3dpdGNoIChlcnIubmFtZSkge1xuICAgICAgY2FzZSAnU3ludGF4RXJyb3InOiB7XG4gICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcignVGhlcmUgaXMgYSBzeW50YXggZXJyb3IgaW4geW91ciBwcm9qZWN0cyBmaWxlLiBSdW4gKipQcm9qZWN0IE1hbmFnZXI6IEVkaXQgUHJvamVjdHMqKiB0byBvcGVuIGFuZCBmaXggdGhlIGlzc3VlLicsIHtcbiAgICAgICAgICBkZXRhaWw6IGVyci5tZXNzYWdlLFxuICAgICAgICAgIGRlc2NyaXB0aW9uOiBgTGluZTogJHtlcnIubG9jYXRpb24uZmlyc3RfbGluZX0gUm93OiAke2Vyci5sb2NhdGlvbi5maXJzdF9jb2x1bW59YCxcbiAgICAgICAgICBkaXNtaXNzYWJsZTogdHJ1ZSxcbiAgICAgICAgfSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuXG4gICAgICBkZWZhdWx0OiB7XG4gICAgICAgIC8vIE5vIGRlZmF1bHQuXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgc3RhdGljIGlzUHJvamVjdChzZXR0aW5ncykge1xuICAgIGlmICh0eXBlb2Ygc2V0dGluZ3MucGF0aHMgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKHNldHRpbmdzLnBhdGhzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgc3RvcmUocHJvamVjdHMpIHtcbiAgICBjb25zdCBzdG9yZSA9IHByb2plY3RzLmNvbmNhdCh0aGlzLnRlbXBsYXRlcyk7XG4gICAgdHJ5IHtcbiAgICAgIENTT04ud3JpdGVGaWxlU3luYyhGaWxlU3RvcmUuZ2V0UGF0aCgpLCBzdG9yZSk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgLy8gY29uc29sZS5sb2coZSk7XG4gICAgfVxuICB9XG5cbiAgb2JzZXJ2ZUZpbGUoKSB7XG4gICAgaWYgKHRoaXMuZmlsZVdhdGNoZXIpIHtcbiAgICAgIHRoaXMuZmlsZVdhdGNoZXIuY2xvc2UoKTtcbiAgICB9XG5cbiAgICB0cnkge1xuICAgICAgdGhpcy5maWxlV2F0Y2hlciA9IGZzLndhdGNoKEZpbGVTdG9yZS5nZXRQYXRoKCksICgpID0+IHtcbiAgICAgICAgdGhpcy5mZXRjaCgpO1xuICAgICAgfSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIC8vIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==