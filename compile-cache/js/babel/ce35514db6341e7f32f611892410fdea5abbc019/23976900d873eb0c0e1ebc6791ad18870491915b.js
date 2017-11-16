Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

/** @babel */

var _fsPlus = require('fs-plus');

var _fsPlus2 = _interopRequireDefault(_fsPlus);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var BuilderRegistry = (function () {
  function BuilderRegistry() {
    _classCallCheck(this, BuilderRegistry);
  }

  _createClass(BuilderRegistry, [{
    key: 'getBuilderImplementation',
    value: function getBuilderImplementation(state) {
      var builders = this.getAllBuilders();
      var candidates = builders.filter(function (builder) {
        return builder.canProcess(state);
      });
      switch (candidates.length) {
        case 0:
          return null;
        case 1:
          return candidates[0];
      }

      // This should never happen...
      throw new Error('Ambiguous builder registration.');
    }
  }, {
    key: 'getBuilder',
    value: function getBuilder(state) {
      var BuilderImpl = this.getBuilderImplementation(state);
      return BuilderImpl != null ? new BuilderImpl() : null;
    }
  }, {
    key: 'checkRuntimeDependencies',
    value: _asyncToGenerator(function* () {
      var builders = this.getAllBuilders();
      for (var BuilderImpl of builders) {
        var builder = new BuilderImpl();
        yield builder.checkRuntimeDependencies();
      }
    })
  }, {
    key: 'getAllBuilders',
    value: function getAllBuilders() {
      var moduleDir = this.getModuleDirPath();
      var entries = _fsPlus2['default'].readdirSync(moduleDir);
      var builders = entries.map(function (entry) {
        return require(_path2['default'].join(moduleDir, entry));
      });

      return builders;
    }
  }, {
    key: 'getModuleDirPath',
    value: function getModuleDirPath() {
      return _path2['default'].join(__dirname, 'builders');
    }
  }]);

  return BuilderRegistry;
})();

exports['default'] = BuilderRegistry;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2JpbGx5Ly5hdG9tL3BhY2thZ2VzL2xhdGV4L2xpYi9idWlsZGVyLXJlZ2lzdHJ5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O3NCQUVlLFNBQVM7Ozs7b0JBQ1AsTUFBTTs7OztJQUVGLGVBQWU7V0FBZixlQUFlOzBCQUFmLGVBQWU7OztlQUFmLGVBQWU7O1dBQ1Qsa0NBQUMsS0FBSyxFQUFFO0FBQy9CLFVBQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQTtBQUN0QyxVQUFNLFVBQVUsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLFVBQUEsT0FBTztlQUFJLE9BQU8sQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDO09BQUEsQ0FBQyxDQUFBO0FBQ3hFLGNBQVEsVUFBVSxDQUFDLE1BQU07QUFDdkIsYUFBSyxDQUFDO0FBQUUsaUJBQU8sSUFBSSxDQUFBO0FBQUEsQUFDbkIsYUFBSyxDQUFDO0FBQUUsaUJBQU8sVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQUEsT0FDN0I7OztBQUdELFlBQU0sSUFBSSxLQUFLLENBQUMsaUNBQWlDLENBQUMsQ0FBQTtLQUNuRDs7O1dBRVUsb0JBQUMsS0FBSyxFQUFFO0FBQ2pCLFVBQU0sV0FBVyxHQUFHLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxLQUFLLENBQUMsQ0FBQTtBQUN4RCxhQUFPLEFBQUMsV0FBVyxJQUFJLElBQUksR0FBSSxJQUFJLFdBQVcsRUFBRSxHQUFHLElBQUksQ0FBQTtLQUN4RDs7OzZCQUU4QixhQUFHO0FBQ2hDLFVBQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQTtBQUN0QyxXQUFLLElBQU0sV0FBVyxJQUFJLFFBQVEsRUFBRTtBQUNsQyxZQUFNLE9BQU8sR0FBRyxJQUFJLFdBQVcsRUFBRSxDQUFBO0FBQ2pDLGNBQU0sT0FBTyxDQUFDLHdCQUF3QixFQUFFLENBQUE7T0FDekM7S0FDRjs7O1dBRWMsMEJBQUc7QUFDaEIsVUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUE7QUFDekMsVUFBTSxPQUFPLEdBQUcsb0JBQUcsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFBO0FBQ3pDLFVBQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBQSxLQUFLO2VBQUksT0FBTyxDQUFDLGtCQUFLLElBQUksQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDLENBQUM7T0FBQSxDQUFDLENBQUE7O0FBRTNFLGFBQU8sUUFBUSxDQUFBO0tBQ2hCOzs7V0FFZ0IsNEJBQUc7QUFDbEIsYUFBTyxrQkFBSyxJQUFJLENBQUMsU0FBUyxFQUFFLFVBQVUsQ0FBQyxDQUFBO0tBQ3hDOzs7U0FwQ2tCLGVBQWU7OztxQkFBZixlQUFlIiwiZmlsZSI6Ii9ob21lL2JpbGx5Ly5hdG9tL3BhY2thZ2VzL2xhdGV4L2xpYi9idWlsZGVyLXJlZ2lzdHJ5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBiYWJlbCAqL1xuXG5pbXBvcnQgZnMgZnJvbSAnZnMtcGx1cydcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJ1aWxkZXJSZWdpc3RyeSB7XG4gIGdldEJ1aWxkZXJJbXBsZW1lbnRhdGlvbiAoc3RhdGUpIHtcbiAgICBjb25zdCBidWlsZGVycyA9IHRoaXMuZ2V0QWxsQnVpbGRlcnMoKVxuICAgIGNvbnN0IGNhbmRpZGF0ZXMgPSBidWlsZGVycy5maWx0ZXIoYnVpbGRlciA9PiBidWlsZGVyLmNhblByb2Nlc3Moc3RhdGUpKVxuICAgIHN3aXRjaCAoY2FuZGlkYXRlcy5sZW5ndGgpIHtcbiAgICAgIGNhc2UgMDogcmV0dXJuIG51bGxcbiAgICAgIGNhc2UgMTogcmV0dXJuIGNhbmRpZGF0ZXNbMF1cbiAgICB9XG5cbiAgICAvLyBUaGlzIHNob3VsZCBuZXZlciBoYXBwZW4uLi5cbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0FtYmlndW91cyBidWlsZGVyIHJlZ2lzdHJhdGlvbi4nKVxuICB9XG5cbiAgZ2V0QnVpbGRlciAoc3RhdGUpIHtcbiAgICBjb25zdCBCdWlsZGVySW1wbCA9IHRoaXMuZ2V0QnVpbGRlckltcGxlbWVudGF0aW9uKHN0YXRlKVxuICAgIHJldHVybiAoQnVpbGRlckltcGwgIT0gbnVsbCkgPyBuZXcgQnVpbGRlckltcGwoKSA6IG51bGxcbiAgfVxuXG4gIGFzeW5jIGNoZWNrUnVudGltZURlcGVuZGVuY2llcyAoKSB7XG4gICAgY29uc3QgYnVpbGRlcnMgPSB0aGlzLmdldEFsbEJ1aWxkZXJzKClcbiAgICBmb3IgKGNvbnN0IEJ1aWxkZXJJbXBsIG9mIGJ1aWxkZXJzKSB7XG4gICAgICBjb25zdCBidWlsZGVyID0gbmV3IEJ1aWxkZXJJbXBsKClcbiAgICAgIGF3YWl0IGJ1aWxkZXIuY2hlY2tSdW50aW1lRGVwZW5kZW5jaWVzKClcbiAgICB9XG4gIH1cblxuICBnZXRBbGxCdWlsZGVycyAoKSB7XG4gICAgY29uc3QgbW9kdWxlRGlyID0gdGhpcy5nZXRNb2R1bGVEaXJQYXRoKClcbiAgICBjb25zdCBlbnRyaWVzID0gZnMucmVhZGRpclN5bmMobW9kdWxlRGlyKVxuICAgIGNvbnN0IGJ1aWxkZXJzID0gZW50cmllcy5tYXAoZW50cnkgPT4gcmVxdWlyZShwYXRoLmpvaW4obW9kdWxlRGlyLCBlbnRyeSkpKVxuXG4gICAgcmV0dXJuIGJ1aWxkZXJzXG4gIH1cblxuICBnZXRNb2R1bGVEaXJQYXRoICgpIHtcbiAgICByZXR1cm4gcGF0aC5qb2luKF9fZGlybmFtZSwgJ2J1aWxkZXJzJylcbiAgfVxufVxuIl19