Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/** @babel */

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _builder = require('../builder');

var _builder2 = _interopRequireDefault(_builder);

var MISSING_PACKAGE_PATTERN = /there is no package called [‘']([^’']+)[’']/g;
var OUTPUT_PATH_PATTERN = /\[\d+]\s+"(.*)"/;
var RSCRIPT_VERSION_PATTERN = /version\s+(\S+)/i;
var PACKAGE_VERSION_PATTERN = /^\[1] "([^"]*)"/;

function escapePath(filePath) {
  return filePath.replace(/\\/g, '\\\\');
}

var KnitrBuilder = (function (_Builder) {
  _inherits(KnitrBuilder, _Builder);

  function KnitrBuilder() {
    _classCallCheck(this, KnitrBuilder);

    _get(Object.getPrototypeOf(KnitrBuilder.prototype), 'constructor', this).apply(this, arguments);

    this.executable = 'Rscript';
  }

  _createClass(KnitrBuilder, [{
    key: 'run',
    value: _asyncToGenerator(function* (jobState) {
      var args = this.constructArgs(jobState);

      var _ref = yield this.execRscript(jobState.getProjectPath(), args, 'error');

      var statusCode = _ref.statusCode;
      var stdout = _ref.stdout;
      var stderr = _ref.stderr;

      if (statusCode !== 0) {
        this.logStatusCode(statusCode, stderr);
        return statusCode;
      }

      jobState.setTexFilePath(this.resolveOutputPath(jobState.getKnitrFilePath(), stdout));

      var builder = latex.builderRegistry.getBuilder(jobState);
      var code = yield builder.run(jobState);

      if (code === 0 && jobState.getEnableSynctex()) {
        var _args = this.constructPatchSynctexArgs(jobState);
        yield this.execRscript(jobState.getProjectPath(), _args, 'warning');
      }

      return code;
    })
  }, {
    key: 'checkRuntimeDependencies',
    value: _asyncToGenerator(function* () {
      var _ref2 = yield this.execRscript('.', ['--version'], 'warning');

      var statusCode = _ref2.statusCode;
      var stderr = _ref2.stderr;

      if (statusCode !== 0) {
        latex.log.warning('Rscript check failed with code ' + statusCode + ' and response of "' + stderr + '".');
        return;
      }

      var match = stderr.match(RSCRIPT_VERSION_PATTERN);

      if (!match) {
        latex.log.warning('Rscript check succeeded but with an unknown version response of "' + stderr + '".');
        return;
      }

      var version = match[1];

      latex.log.info('Rscript check succeeded. Found version ' + version + '.');

      yield this.checkRscriptPackageVersion('knitr');
      yield this.checkRscriptPackageVersion('patchSynctex', '0.1-4');
    })
  }, {
    key: 'checkRscriptPackageVersion',
    value: _asyncToGenerator(function* (packageName, minimumVersion) {
      var result = yield this.execRscript('.', ['-e "installed.packages()[\'' + packageName + '\',\'Version\']"'], 'warning');

      if (result.statusCode === 0) {
        var match = result.stdout.match(PACKAGE_VERSION_PATTERN);
        if (match) {
          var version = match[1];
          var message = 'Rscript ' + packageName + ' package check succeeded. Found version ' + version + '.';
          if (minimumVersion && minimumVersion > version) {
            latex.log.warning(message + ' Minimum version ' + minimumVersion + ' needed.');
          } else {
            latex.log.info(message);
          }
          return;
        }
      }

      latex.log.warning('Rscript package ' + packageName + ' was not found.');
    })
  }, {
    key: 'execRscript',
    value: _asyncToGenerator(function* (directoryPath, args, type) {
      var command = this.executable + ' ' + args.join(' ');
      var options = this.constructChildProcessOptions(directoryPath);

      var _ref3 = yield latex.process.executeChildProcess(command, options);

      var statusCode = _ref3.statusCode;
      var stdout = _ref3.stdout;
      var stderr = _ref3.stderr;

      if (statusCode !== 0) {
        // Parse error message to detect missing libraries.
        var match = undefined;
        while ((match = MISSING_PACKAGE_PATTERN.exec(stderr)) !== null) {
          var text = 'The R package "' + match[1] + '" could not be loaded.';
          latex.log.showMessage({ type: type, text: text });
          statusCode = -1;
        }
      }

      return { statusCode: statusCode, stdout: stdout, stderr: stderr };
    })
  }, {
    key: 'constructArgs',
    value: function constructArgs(jobState) {
      var args = ['-e "library(knitr)"', '-e "opts_knit$set(concordance = TRUE)"', '-e "knit(\'' + escapePath(jobState.getKnitrFilePath()) + '\')"'];

      return args;
    }
  }, {
    key: 'constructPatchSynctexArgs',
    value: function constructPatchSynctexArgs(jobState) {
      var synctexPath = this.resolveOutputFilePath(jobState, '');

      var args = ['-e "library(patchSynctex)"', '-e "patchSynctex(\'' + escapePath(jobState.getKnitrFilePath()) + '\',syncfile=\'' + escapePath(synctexPath) + '\')"'];

      return args;
    }
  }, {
    key: 'resolveOutputPath',
    value: function resolveOutputPath(sourcePath, stdout) {
      var candidatePath = OUTPUT_PATH_PATTERN.exec(stdout)[1];
      if (_path2['default'].isAbsolute(candidatePath)) {
        return candidatePath;
      }

      var sourceDir = _path2['default'].dirname(sourcePath);
      return _path2['default'].join(sourceDir, candidatePath);
    }
  }], [{
    key: 'canProcess',
    value: function canProcess(state) {
      return !state.getTexFilePath() && !!state.getKnitrFilePath();
    }
  }]);

  return KnitrBuilder;
})(_builder2['default']);

exports['default'] = KnitrBuilder;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2JpbGx5Ly5hdG9tL3BhY2thZ2VzL2xhdGV4L2xpYi9idWlsZGVycy9rbml0ci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7b0JBRWlCLE1BQU07Ozs7dUJBQ0gsWUFBWTs7OztBQUVoQyxJQUFNLHVCQUF1QixHQUFHLDhDQUE4QyxDQUFBO0FBQzlFLElBQU0sbUJBQW1CLEdBQUcsaUJBQWlCLENBQUE7QUFDN0MsSUFBTSx1QkFBdUIsR0FBRyxrQkFBa0IsQ0FBQTtBQUNsRCxJQUFNLHVCQUF1QixHQUFHLGlCQUFpQixDQUFBOztBQUVqRCxTQUFTLFVBQVUsQ0FBRSxRQUFRLEVBQUU7QUFDN0IsU0FBTyxRQUFRLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQTtDQUN2Qzs7SUFFb0IsWUFBWTtZQUFaLFlBQVk7O1dBQVosWUFBWTswQkFBWixZQUFZOzsrQkFBWixZQUFZOztTQUMvQixVQUFVLEdBQUcsU0FBUzs7O2VBREgsWUFBWTs7NkJBT3JCLFdBQUMsUUFBUSxFQUFFO0FBQ25CLFVBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUE7O2lCQUNGLE1BQU0sSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsY0FBYyxFQUFFLEVBQUUsSUFBSSxFQUFFLE9BQU8sQ0FBQzs7VUFBL0YsVUFBVSxRQUFWLFVBQVU7VUFBRSxNQUFNLFFBQU4sTUFBTTtVQUFFLE1BQU0sUUFBTixNQUFNOztBQUNsQyxVQUFJLFVBQVUsS0FBSyxDQUFDLEVBQUU7QUFDcEIsWUFBSSxDQUFDLGFBQWEsQ0FBQyxVQUFVLEVBQUUsTUFBTSxDQUFDLENBQUE7QUFDdEMsZUFBTyxVQUFVLENBQUE7T0FDbEI7O0FBRUQsY0FBUSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsUUFBUSxDQUFDLGdCQUFnQixFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQTs7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TUFBTSxFQUFFO0FBQ3JDLFVBQU0sYUFBYSxHQUFHLG1CQUFtQixDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUN6RCxVQUFJLGtCQUFLLFVBQVUsQ0FBQyxhQUFhLENBQUMsRUFBRTtBQUNsQyxlQUFPLGFBQWEsQ0FBQTtPQUNyQjs7QUFFRCxVQUFNLFNBQVMsR0FBRyxrQkFBSyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUE7QUFDMUMsYUFBTyxrQkFBSyxJQUFJLENBQUMsU0FBUyxFQUFFLGFBQWEsQ0FBQyxDQUFBO0tBQzNDOzs7V0FwSGlCLG9CQUFDLEtBQUssRUFBRTtBQUN4QixhQUFPLENBQUMsS0FBSyxDQUFDLGNBQWMsRUFBRSxJQUFJLENBQUMsQ0FBQyxLQUFLLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQTtLQUM3RDs7O1NBTGtCLFlBQVk7OztxQkFBWixZQUFZIiwiZmlsZSI6Ii9ob21lL2JpbGx5Ly5hdG9tL3BhY2thZ2VzL2xhdGV4L2xpYi9idWlsZGVycy9rbml0ci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBAYmFiZWwgKi9cblxuaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcbmltcG9ydCBCdWlsZGVyIGZyb20gJy4uL2J1aWxkZXInXG5cbmNvbnN0IE1JU1NJTkdfUEFDS0FHRV9QQVRURVJOID0gL3RoZXJlIGlzIG5vIHBhY2thZ2UgY2FsbGVkIFvigJgnXShbXuKAmSddKylb4oCZJ10vZ1xuY29uc3QgT1VUUFVUX1BBVEhfUEFUVEVSTiA9IC9cXFtcXGQrXVxccytcIiguKilcIi9cbmNvbnN0IFJTQ1JJUFRfVkVSU0lPTl9QQVRURVJOID0gL3ZlcnNpb25cXHMrKFxcUyspL2lcbmNvbnN0IFBBQ0tBR0VfVkVSU0lPTl9QQVRURVJOID0gL15cXFsxXSBcIihbXlwiXSopXCIvXG5cbmZ1bmN0aW9uIGVzY2FwZVBhdGggKGZpbGVQYXRoKSB7XG4gIHJldHVybiBmaWxlUGF0aC5yZXBsYWNlKC9cXFxcL2csICdcXFxcXFxcXCcpXG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEtuaXRyQnVpbGRlciBleHRlbmRzIEJ1aWxkZXIge1xuICBleGVjdXRhYmxlID0gJ1JzY3JpcHQnXG5cbiAgc3RhdGljIGNhblByb2Nlc3MgKHN0YXRlKSB7XG4gICAgcmV0dXJuICFzdGF0ZS5nZXRUZXhGaWxlUGF0aCgpICYmICEhc3RhdGUuZ2V0S25pdHJGaWxlUGF0aCgpXG4gIH1cblxuICBhc3luYyBydW4gKGpvYlN0YXRlKSB7XG4gICAgY29uc3QgYXJncyA9IHRoaXMuY29uc3RydWN0QXJncyhqb2JTdGF0ZSlcbiAgICBjb25zdCB7IHN0YXR1c0NvZGUsIHN0ZG91dCwgc3RkZXJyIH0gPSBhd2FpdCB0aGlzLmV4ZWNSc2NyaXB0KGpvYlN0YXRlLmdldFByb2plY3RQYXRoKCksIGFyZ3MsICdlcnJvcicpXG4gICAgaWYgKHN0YXR1c0NvZGUgIT09IDApIHtcbiAgICAgIHRoaXMubG9nU3RhdHVzQ29kZShzdGF0dXNDb2RlLCBzdGRlcnIpXG4gICAgICByZXR1cm4gc3RhdHVzQ29kZVxuICAgIH1cblxuICAgIGpvYlN0YXRlLnNldFRleEZpbGVQYXRoKHRoaXMucmVzb2x2ZU91dHB1dFBhdGgoam9iU3RhdGUuZ2V0S25pdHJGaWxlUGF0aCgpLCBzdGRvdXQpKVxuXG4gICAgY29uc3QgYnVpbGRlciA9IGxhdGV4LmJ1aWxkZXJSZWdpc3RyeS5nZXRCdWlsZGVyKGpvYlN0YXRlKVxuICAgIGNvbnN0IGNvZGUgPSBhd2FpdCBidWlsZGVyLnJ1bihqb2JTdGF0ZSlcblxuICAgIGlmIChjb2RlID09PSAwICYmIGpvYlN0YXRlLmdldEVuYWJsZVN5bmN0ZXgoKSkge1xuICAgICAgY29uc3QgYXJncyA9IHRoaXMuY29uc3RydWN0UGF0Y2hTeW5jdGV4QXJncyhqb2JTdGF0ZSlcbiAgICAgIGF3YWl0IHRoaXMuZXhlY1JzY3JpcHQoam9iU3RhdGUuZ2V0UHJvamVjdFBhdGgoKSwgYXJncywgJ3dhcm5pbmcnKVxuICAgIH1cblxuICAgIHJldHVybiBjb2RlXG4gIH1cblxuICBhc3luYyBjaGVja1J1bnRpbWVEZXBlbmRlbmNpZXMgKCkge1xuICAgIGNvbnN0IHsgc3RhdHVzQ29kZSwgc3RkZXJyIH0gPSBhd2FpdCB0aGlzLmV4ZWNSc2NyaXB0KCcuJywgWyctLXZlcnNpb24nXSwgJ3dhcm5pbmcnKVxuXG4gICAgaWYgKHN0YXR1c0NvZGUgIT09IDApIHtcbiAgICAgIGxhdGV4LmxvZy53YXJuaW5nKGBSc2NyaXB0IGNoZWNrIGZhaWxlZCB3aXRoIGNvZGUgJHtzdGF0dXNDb2RlfSBhbmQgcmVzcG9uc2Ugb2YgXCIke3N0ZGVycn1cIi5gKVxuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgY29uc3QgbWF0Y2ggPSBzdGRlcnIubWF0Y2goUlNDUklQVF9WRVJTSU9OX1BBVFRFUk4pXG5cbiAgICBpZiAoIW1hdGNoKSB7XG4gICAgICBsYXRleC5sb2cud2FybmluZyhgUnNjcmlwdCBjaGVjayBzdWNjZWVkZWQgYnV0IHdpdGggYW4gdW5rbm93biB2ZXJzaW9uIHJlc3BvbnNlIG9mIFwiJHtzdGRlcnJ9XCIuYClcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGNvbnN0IHZlcnNpb24gPSBtYXRjaFsxXVxuXG4gICAgbGF0ZXgubG9nLmluZm8oYFJzY3JpcHQgY2hlY2sgc3VjY2VlZGVkLiBGb3VuZCB2ZXJzaW9uICR7dmVyc2lvbn0uYClcblxuICAgIGF3YWl0IHRoaXMuY2hlY2tSc2NyaXB0UGFja2FnZVZlcnNpb24oJ2tuaXRyJylcbiAgICBhd2FpdCB0aGlzLmNoZWNrUnNjcmlwdFBhY2thZ2VWZXJzaW9uKCdwYXRjaFN5bmN0ZXgnLCAnMC4xLTQnKVxuICB9XG5cbiAgYXN5bmMgY2hlY2tSc2NyaXB0UGFja2FnZVZlcnNpb24gKHBhY2thZ2VOYW1lLCBtaW5pbXVtVmVyc2lvbikge1xuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHRoaXMuZXhlY1JzY3JpcHQoJy4nLCBbYC1lIFwiaW5zdGFsbGVkLnBhY2thZ2VzKClbJyR7cGFja2FnZU5hbWV9JywnVmVyc2lvbiddXCJgXSwgJ3dhcm5pbmcnKVxuXG4gICAgaWYgKHJlc3VsdC5zdGF0dXNDb2RlID09PSAwKSB7XG4gICAgICBjb25zdCBtYXRjaCA9IHJlc3VsdC5zdGRvdXQubWF0Y2goUEFDS0FHRV9WRVJTSU9OX1BBVFRFUk4pXG4gICAgICBpZiAobWF0Y2gpIHtcbiAgICAgICAgY29uc3QgdmVyc2lvbiA9IG1hdGNoWzFdXG4gICAgICAgIGNvbnN0IG1lc3NhZ2UgPSBgUnNjcmlwdCAke3BhY2thZ2VOYW1lfSBwYWNrYWdlIGNoZWNrIHN1Y2NlZWRlZC4gRm91bmQgdmVyc2lvbiAke3ZlcnNpb259LmBcbiAgICAgICAgaWYgKG1pbmltdW1WZXJzaW9uICYmIG1pbmltdW1WZXJzaW9uID4gdmVyc2lvbikge1xuICAgICAgICAgIGxhdGV4LmxvZy53YXJuaW5nKGAke21lc3NhZ2V9IE1pbmltdW0gdmVyc2lvbiAke21pbmltdW1WZXJzaW9ufSBuZWVkZWQuYClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBsYXRleC5sb2cuaW5mbyhtZXNzYWdlKVxuICAgICAgICB9XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuICAgIH1cblxuICAgIGxhdGV4LmxvZy53YXJuaW5nKGBSc2NyaXB0IHBhY2thZ2UgJHtwYWNrYWdlTmFtZX0gd2FzIG5vdCBmb3VuZC5gKVxuICB9XG5cbiAgYXN5bmMgZXhlY1JzY3JpcHQgKGRpcmVjdG9yeVBhdGgsIGFyZ3MsIHR5cGUpIHtcbiAgICBjb25zdCBjb21tYW5kID0gYCR7dGhpcy5leGVjdXRhYmxlfSAke2FyZ3Muam9pbignICcpfWBcbiAgICBjb25zdCBvcHRpb25zID0gdGhpcy5jb25zdHJ1Y3RDaGlsZFByb2Nlc3NPcHRpb25zKGRpcmVjdG9yeVBhdGgpXG5cbiAgICBsZXQgeyBzdGF0dXNDb2RlLCBzdGRvdXQsIHN0ZGVyciB9ID0gYXdhaXQgbGF0ZXgucHJvY2Vzcy5leGVjdXRlQ2hpbGRQcm9jZXNzKGNvbW1hbmQsIG9wdGlvbnMpXG5cbiAgICBpZiAoc3RhdHVzQ29kZSAhPT0gMCkge1xuICAgICAgLy8gUGFyc2UgZXJyb3IgbWVzc2FnZSB0byBkZXRlY3QgbWlzc2luZyBsaWJyYXJpZXMuXG4gICAgICBsZXQgbWF0Y2hcbiAgICAgIHdoaWxlICgobWF0Y2ggPSBNSVNTSU5HX1BBQ0tBR0VfUEFUVEVSTi5leGVjKHN0ZGVycikpICE9PSBudWxsKSB7XG4gICAgICAgIGNvbnN0IHRleHQgPSBgVGhlIFIgcGFja2FnZSBcIiR7bWF0Y2hbMV19XCIgY291bGQgbm90IGJlIGxvYWRlZC5gXG4gICAgICAgIGxhdGV4LmxvZy5zaG93TWVzc2FnZSh7IHR5cGUsIHRleHQgfSlcbiAgICAgICAgc3RhdHVzQ29kZSA9IC0xXG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHsgc3RhdHVzQ29kZSwgc3Rkb3V0LCBzdGRlcnIgfVxuICB9XG5cbiAgY29uc3RydWN0QXJncyAoam9iU3RhdGUpIHtcbiAgICBjb25zdCBhcmdzID0gW1xuICAgICAgJy1lIFwibGlicmFyeShrbml0cilcIicsXG4gICAgICAnLWUgXCJvcHRzX2tuaXQkc2V0KGNvbmNvcmRhbmNlID0gVFJVRSlcIicsXG4gICAgICBgLWUgXCJrbml0KCcke2VzY2FwZVBhdGgoam9iU3RhdGUuZ2V0S25pdHJGaWxlUGF0aCgpKX0nKVwiYFxuICAgIF1cblxuICAgIHJldHVybiBhcmdzXG4gIH1cblxuICBjb25zdHJ1Y3RQYXRjaFN5bmN0ZXhBcmdzIChqb2JTdGF0ZSkge1xuICAgIGxldCBzeW5jdGV4UGF0aCA9IHRoaXMucmVzb2x2ZU91dHB1dEZpbGVQYXRoKGpvYlN0YXRlLCAnJylcblxuICAgIGNvbnN0IGFyZ3MgPSBbXG4gICAgICAnLWUgXCJsaWJyYXJ5KHBhdGNoU3luY3RleClcIicsXG4gICAgICBgLWUgXCJwYXRjaFN5bmN0ZXgoJyR7ZXNjYXBlUGF0aChqb2JTdGF0ZS5nZXRLbml0ckZpbGVQYXRoKCkpfScsc3luY2ZpbGU9JyR7ZXNjYXBlUGF0aChzeW5jdGV4UGF0aCl9JylcImBcbiAgICBdXG5cbiAgICByZXR1cm4gYXJnc1xuICB9XG5cbiAgcmVzb2x2ZU91dHB1dFBhdGggKHNvdXJjZVBhdGgsIHN0ZG91dCkge1xuICAgIGNvbnN0IGNhbmRpZGF0ZVBhdGggPSBPVVRQVVRfUEFUSF9QQVRURVJOLmV4ZWMoc3Rkb3V0KVsxXVxuICAgIGlmIChwYXRoLmlzQWJzb2x1dGUoY2FuZGlkYXRlUGF0aCkpIHtcbiAgICAgIHJldHVybiBjYW5kaWRhdGVQYXRoXG4gICAgfVxuXG4gICAgY29uc3Qgc291cmNlRGlyID0gcGF0aC5kaXJuYW1lKHNvdXJjZVBhdGgpXG4gICAgcmV0dXJuIHBhdGguam9pbihzb3VyY2VEaXIsIGNhbmRpZGF0ZVBhdGgpXG4gIH1cbn1cbiJdfQ==