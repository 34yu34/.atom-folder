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

var LATEX_PATTERN = /^latex|u?platex$/;
var LATEXMK_VERSION_PATTERN = /Version\s+(\S+)/i;
var LATEXMK_MINIMUM_VERSION = '4.37';
var PDF_ENGINE_PATTERN = /^(xelatex|lualatex)$/;

var LatexmkBuilder = (function (_Builder) {
  _inherits(LatexmkBuilder, _Builder);

  function LatexmkBuilder() {
    _classCallCheck(this, LatexmkBuilder);

    _get(Object.getPrototypeOf(LatexmkBuilder.prototype), 'constructor', this).apply(this, arguments);

    this.executable = 'latexmk';
  }

  _createClass(LatexmkBuilder, [{
    key: 'run',
    value: _asyncToGenerator(function* (jobState) {
      var args = this.constructArgs(jobState);

      var _ref = yield this.execLatexmk(jobState.getProjectPath(), args, 'error');

      var statusCode = _ref.statusCode;
      var stderr = _ref.stderr;

      if (statusCode !== 0) {
        this.logStatusCode(statusCode, stderr);
      }

      return statusCode;
    })
  }, {
    key: 'execLatexmk',
    value: _asyncToGenerator(function* (directoryPath, args, type) {
      var command = this.executable + ' ' + args.join(' ');
      var options = this.constructChildProcessOptions(directoryPath, { max_print_line: 1000 });

      return latex.process.executeChildProcess(command, options);
    })
  }, {
    key: 'checkRuntimeDependencies',
    value: _asyncToGenerator(function* () {
      var _ref2 = yield this.execLatexmk('.', ['-v'], 'error');

      var statusCode = _ref2.statusCode;
      var stdout = _ref2.stdout;
      var stderr = _ref2.stderr;

      if (statusCode !== 0) {
        latex.log.error('latexmk check failed with code ' + statusCode + ' and response of "' + stderr + '".');
        return;
      }

      var match = stdout.match(LATEXMK_VERSION_PATTERN);

      if (!match) {
        latex.log.warning('latexmk check succeeded but with an unknown version response of "' + stdout + '".');
        return;
      }

      var version = match[1];

      if (version < LATEXMK_MINIMUM_VERSION) {
        latex.log.warning('latexmk check succeeded but with a version of ' + version + '". Minimum version required is ' + LATEXMK_MINIMUM_VERSION + '.');
        return;
      }

      latex.log.info('latexmk check succeeded. Found version ' + version + '.');
    })
  }, {
    key: 'logStatusCode',
    value: function logStatusCode(statusCode, stderr) {
      switch (statusCode) {
        case 10:
          latex.log.error('latexmk: Bad command line arguments.');
          break;
        case 11:
          latex.log.error('latexmk: File specified on command line not found or other file not found.');
          break;
        case 12:
          latex.log.error('latexmk: Failure in some part of making files.');
          break;
        case 13:
          latex.log.error('latexmk: error in initialization file.');
          break;
        case 20:
          latex.log.error('latexmk: probable bug or retcode from called program.');
          break;
        default:
          _get(Object.getPrototypeOf(LatexmkBuilder.prototype), 'logStatusCode', this).call(this, statusCode, stderr);
      }
    }
  }, {
    key: 'constructArgs',
    value: function constructArgs(jobState) {
      var args = ['-interaction=nonstopmode', '-f', '-cd', '-file-line-error'];

      if (jobState.getShouldRebuild()) {
        args.push('-g');
      }
      if (jobState.getJobName()) {
        args.push('-jobname="' + jobState.getJobName() + '"');
      }
      if (jobState.getEnableShellEscape()) {
        args.push('-shell-escape');
      }
      if (jobState.getEnableSynctex()) {
        args.push('-synctex=1');
      }
      if (jobState.getEnableExtendedBuildMode()) {
        var latexmkrcPath = _path2['default'].resolve(__dirname, '..', '..', 'resources', 'latexmkrc');
        args.push('-r "' + latexmkrcPath + '"');
      }

      if (jobState.getEngine().match(LATEX_PATTERN)) {
        args.push('-latex="' + jobState.getEngine() + '"');
        args.push(jobState.getOutputFormat() === 'pdf' ? this.constructPdfProducerArgs(jobState) : '-' + jobState.getOutputFormat());
      } else {
        // Look for other PDF engines that can be specified using short command
        // options, i.e. -lualatex and -xelatex
        if (jobState.getOutputFormat() === 'pdf' && jobState.getEngine().match(PDF_ENGINE_PATTERN)) {
          args.push('-' + jobState.getEngine());
        } else {
          // Keep the option noise to a minimum by not passing default engine
          if (jobState.getEngine() !== 'pdflatex') {
            args.push('-pdflatex="' + jobState.getEngine() + '"');
          }
          args.push('-' + jobState.getOutputFormat());
        }
      }

      if (jobState.getOutputDirectory()) {
        args.push('-outdir="' + jobState.getOutputDirectory() + '"');
      }

      args.push('"' + jobState.getTexFilePath() + '"');
      return args;
    }
  }, {
    key: 'constructPdfProducerArgs',
    value: function constructPdfProducerArgs(jobState) {
      var producer = jobState.getProducer();

      switch (producer) {
        case 'ps2pdf':
          return '-pdfps';
        case 'dvipdf':
          return '-pdfdvi -e "$dvipdf = \'dvipdf %O %S %D\';"';
        default:
          return '-pdfdvi -e "$dvipdf = \'' + producer + ' %O -o %D %S\';"';
      }
    }
  }], [{
    key: 'canProcess',
    value: function canProcess(state) {
      return !!state.getTexFilePath();
    }
  }]);

  return LatexmkBuilder;
})(_builder2['default']);

exports['default'] = LatexmkBuilder;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2JpbGx5Ly5hdG9tL3BhY2thZ2VzL2xhdGV4L2xpYi9idWlsZGVycy9sYXRleG1rLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztvQkFFaUIsTUFBTTs7Ozt1QkFDSCxZQUFZOzs7O0FBRWhDLElBQU0sYUFBYSxHQUFHLGtCQUFrQixDQUFBO0FBQ3hDLElBQU0sdUJBQXVCLEdBQUcsa0JBQWtCLENBQUE7QUFDbEQsSUFBTSx1QkFBdUIsR0FBRyxNQUFNLENBQUE7QUFDdEMsSUFBTSxrQkFBa0IsR0FBRyxzQkFBc0IsQ0FBQTs7SUFFNUIsY0FBYztZQUFkLGNBQWM7O1dBQWQsY0FBYzswQkFBZCxjQUFjOzsrQkFBZCxjQUFjOztTQUNqQyxVQUFVLEdBQUcsU0FBUzs7O2VBREgsY0FBYzs7NkJBT3ZCLFdBQUMsUUFBUSxFQUFFO0FBQ25CLFVBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUE7O2lCQUVWLE1BQU0sSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsY0FBYyxFQUFFLEVBQUUsSUFBSSxFQUFFLE9BQU8sQ0FBQzs7VUFBdkYsVUFBVSxRQUFWLFVBQVU7VUFBRSxNQUFNLFFBQU4sTUFBTTs7QUFDMUIsVUFBSSxVQUFVLEtBQUssQ0FBQyxFQUFFO0FBQ3BCLFlBQUksQ0FBQyxhQUFhLENBQUMsVUFBVSxFQUFFLE1BQU0sQ0FBQyxDQUFBO09BQ3ZDOztBQUVELGFBQU8sVUFBVSxDQUFBO0tBQ2xCOzs7NkJBRWlCLFdBQUMsYUFBYSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUU7QUFDNUMsVUFBTSxPQUFPLEdBQU0sSUFBSSxDQUFDLFVBQVUsU0FBSSxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxBQUFFLENBQUE7QUFDdEQsVUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLDRCQUE0QixDQUFDLGFBQWEsRUFBRSxFQUFFLGNBQWMsRUFBRSxJQUFJLEVBQUUsQ0FB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QU0sUUFBUSxHQUFHLFFBQVEsQ0FBQyxXQUFXLEVBQUUsQ0FBQTs7QUFFdkMsY0FBUSxRQUFRO0FBQ2QsYUFBSyxRQUFRO0FBQ1gsaUJBQU8sUUFBUSxDQUFBO0FBQUEsQUFDakIsYUFBSyxRQUFRO0FBQ1gsaUJBQU8sNkNBQTZDLENBQUE7QUFBQSxBQUN0RDtBQUNFLDhDQUFpQyxRQUFRLHNCQUFpQjtBQUFBLE9BQzdEO0tBQ0Y7OztXQXBJaUIsb0JBQUMsS0FBSyxFQUFFO0FBQ3hCLGFBQU8sQ0FBQyxDQUFDLEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQTtLQUNoQzs7O1NBTGtCLGNBQWM7OztxQkFBZCxjQUFjIiwiZmlsZSI6Ii9ob21lL2JpbGx5Ly5hdG9tL3BhY2thZ2VzL2xhdGV4L2xpYi9idWlsZGVycy9sYXRleG1rLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBiYWJlbCAqL1xuXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xuaW1wb3J0IEJ1aWxkZXIgZnJvbSAnLi4vYnVpbGRlcidcblxuY29uc3QgTEFURVhfUEFUVEVSTiA9IC9ebGF0ZXh8dT9wbGF0ZXgkL1xuY29uc3QgTEFURVhNS19WRVJTSU9OX1BBVFRFUk4gPSAvVmVyc2lvblxccysoXFxTKykvaVxuY29uc3QgTEFURVhNS19NSU5JTVVNX1ZFUlNJT04gPSAnNC4zNydcbmNvbnN0IFBERl9FTkdJTkVfUEFUVEVSTiA9IC9eKHhlbGF0ZXh8bHVhbGF0ZXgpJC9cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTGF0ZXhta0J1aWxkZXIgZXh0ZW5kcyBCdWlsZGVyIHtcbiAgZXhlY3V0YWJsZSA9ICdsYXRleG1rJ1xuXG4gIHN0YXRpYyBjYW5Qcm9jZXNzIChzdGF0ZSkge1xuICAgIHJldHVybiAhIXN0YXRlLmdldFRleEZpbGVQYXRoKClcbiAgfVxuXG4gIGFzeW5jIHJ1biAoam9iU3RhdGUpIHtcbiAgICBjb25zdCBhcmdzID0gdGhpcy5jb25zdHJ1Y3RBcmdzKGpvYlN0YXRlKVxuXG4gICAgY29uc3QgeyBzdGF0dXNDb2RlLCBzdGRlcnIgfSA9IGF3YWl0IHRoaXMuZXhlY0xhdGV4bWsoam9iU3RhdGUuZ2V0UHJvamVjdFBhdGgoKSwgYXJncywgJ2Vycm9yJylcbiAgICBpZiAoc3RhdHVzQ29kZSAhPT0gMCkge1xuICAgICAgdGhpcy5sb2dTdGF0dXNDb2RlKHN0YXR1c0NvZGUsIHN0ZGVycilcbiAgICB9XG5cbiAgICByZXR1cm4gc3RhdHVzQ29kZVxuICB9XG5cbiAgYXN5bmMgZXhlY0xhdGV4bWsgKGRpcmVjdG9yeVBhdGgsIGFyZ3MsIHR5cGUpIHtcbiAgICBjb25zdCBjb21tYW5kID0gYCR7dGhpcy5leGVjdXRhYmxlfSAke2FyZ3Muam9pbignICcpfWBcbiAgICBjb25zdCBvcHRpb25zID0gdGhpcy5jb25zdHJ1Y3RDaGlsZFByb2Nlc3NPcHRpb25zKGRpcmVjdG9yeVBhdGgsIHsgbWF4X3ByaW50X2xpbmU6IDEwMDAgfSlcblxuICAgIHJldHVybiBsYXRleC5wcm9jZXNzLmV4ZWN1dGVDaGlsZFByb2Nlc3MoY29tbWFuZCwgb3B0aW9ucylcbiAgfVxuXG4gIGFzeW5jIGNoZWNrUnVudGltZURlcGVuZGVuY2llcyAoKSB7XG4gICAgY29uc3QgeyBzdGF0dXNDb2RlLCBzdGRvdXQsIHN0ZGVyciB9ID0gYXdhaXQgdGhpcy5leGVjTGF0ZXhtaygnLicsIFsnLXYnXSwgJ2Vycm9yJylcblxuICAgIGlmIChzdGF0dXNDb2RlICE9PSAwKSB7XG4gICAgICBsYXRleC5sb2cuZXJyb3IoYGxhdGV4bWsgY2hlY2sgZmFpbGVkIHdpdGggY29kZSAke3N0YXR1c0NvZGV9IGFuZCByZXNwb25zZSBvZiBcIiR7c3RkZXJyfVwiLmApXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBjb25zdCBtYXRjaCA9IHN0ZG91dC5tYXRjaChMQVRFWE1LX1ZFUlNJT05fUEFUVEVSTilcblxuICAgIGlmICghbWF0Y2gpIHtcbiAgICAgIGxhdGV4LmxvZy53YXJuaW5nKGBsYXRleG1rIGNoZWNrIHN1Y2NlZWRlZCBidXQgd2l0aCBhbiB1bmtub3duIHZlcnNpb24gcmVzcG9uc2Ugb2YgXCIke3N0ZG91dH1cIi5gKVxuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgY29uc3QgdmVyc2lvbiA9IG1hdGNoWzFdXG5cbiAgICBpZiAodmVyc2lvbiA8IExBVEVYTUtfTUlOSU1VTV9WRVJTSU9OKSB7XG4gICAgICBsYXRleC5sb2cud2FybmluZyhgbGF0ZXhtayBjaGVjayBzdWNjZWVkZWQgYnV0IHdpdGggYSB2ZXJzaW9uIG9mICR7dmVyc2lvbn1cIi4gTWluaW11bSB2ZXJzaW9uIHJlcXVpcmVkIGlzICR7TEFURVhNS19NSU5JTVVNX1ZFUlNJT059LmApXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBsYXRleC5sb2cuaW5mbyhgbGF0ZXhtayBjaGVjayBzdWNjZWVkZWQuIEZvdW5kIHZlcnNpb24gJHt2ZXJzaW9ufS5gKVxuICB9XG5cbiAgbG9nU3RhdHVzQ29kZSAoc3RhdHVzQ29kZSwgc3RkZXJyKSB7XG4gICAgc3dpdGNoIChzdGF0dXNDb2RlKSB7XG4gICAgICBjYXNlIDEwOlxuICAgICAgICBsYXRleC5sb2cuZXJyb3IoJ2xhdGV4bWs6IEJhZCBjb21tYW5kIGxpbmUgYXJndW1lbnRzLicpXG4gICAgICAgIGJyZWFrXG4gICAgICBjYXNlIDExOlxuICAgICAgICBsYXRleC5sb2cuZXJyb3IoJ2xhdGV4bWs6IEZpbGUgc3BlY2lmaWVkIG9uIGNvbW1hbmQgbGluZSBub3QgZm91bmQgb3Igb3RoZXIgZmlsZSBub3QgZm91bmQuJylcbiAgICAgICAgYnJlYWtcbiAgICAgIGNhc2UgMTI6XG4gICAgICAgIGxhdGV4LmxvZy5lcnJvcignbGF0ZXhtazogRmFpbHVyZSBpbiBzb21lIHBhcnQgb2YgbWFraW5nIGZpbGVzLicpXG4gICAgICAgIGJyZWFrXG4gICAgICBjYXNlIDEzOlxuICAgICAgICBsYXRleC5sb2cuZXJyb3IoJ2xhdGV4bWs6IGVycm9yIGluIGluaXRpYWxpemF0aW9uIGZpbGUuJylcbiAgICAgICAgYnJlYWtcbiAgICAgIGNhc2UgMjA6XG4gICAgICAgIGxhdGV4LmxvZy5lcnJvcignbGF0ZXhtazogcHJvYmFibGUgYnVnIG9yIHJldGNvZGUgZnJvbSBjYWxsZWQgcHJvZ3JhbS4nKVxuICAgICAgICBicmVha1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgc3VwZXIubG9nU3RhdHVzQ29kZShzdGF0dXNDb2RlLCBzdGRlcnIpXG4gICAgfVxuICB9XG5cbiAgY29uc3RydWN0QXJncyAoam9iU3RhdGUpIHtcbiAgICBjb25zdCBhcmdzID0gW1xuICAgICAgJy1pbnRlcmFjdGlvbj1ub25zdG9wbW9kZScsXG4gICAgICAnLWYnLFxuICAgICAgJy1jZCcsXG4gICAgICAnLWZpbGUtbGluZS1lcnJvcidcbiAgICBdXG5cbiAgICBpZiAoam9iU3RhdGUuZ2V0U2hvdWxkUmVidWlsZCgpKSB7XG4gICAgICBhcmdzLnB1c2goJy1nJylcbiAgICB9XG4gICAgaWYgKGpvYlN0YXRlLmdldEpvYk5hbWUoKSkge1xuICAgICAgYXJncy5wdXNoKGAtam9ibmFtZT1cIiR7am9iU3RhdGUuZ2V0Sm9iTmFtZSgpfVwiYClcbiAgICB9XG4gICAgaWYgKGpvYlN0YXRlLmdldEVuYWJsZVNoZWxsRXNjYXBlKCkpIHtcbiAgICAgIGFyZ3MucHVzaCgnLXNoZWxsLWVzY2FwZScpXG4gICAgfVxuICAgIGlmIChqb2JTdGF0ZS5nZXRFbmFibGVTeW5jdGV4KCkpIHtcbiAgICAgIGFyZ3MucHVzaCgnLXN5bmN0ZXg9MScpXG4gICAgfVxuICAgIGlmIChqb2JTdGF0ZS5nZXRFbmFibGVFeHRlbmRlZEJ1aWxkTW9kZSgpKSB7XG4gICAgICBjb25zdCBsYXRleG1rcmNQYXRoID0gcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4uJywgJy4uJywgJ3Jlc291cmNlcycsICdsYXRleG1rcmMnKVxuICAgICAgYXJncy5wdXNoKGAtciBcIiR7bGF0ZXhta3JjUGF0aH1cImApXG4gICAgfVxuXG4gICAgaWYgKGpvYlN0YXRlLmdldEVuZ2luZSgpLm1hdGNoKExBVEVYX1BBVFRFUk4pKSB7XG4gICAgICBhcmdzLnB1c2goYC1sYXRleD1cIiR7am9iU3RhdGUuZ2V0RW5naW5lKCl9XCJgKVxuICAgICAgYXJncy5wdXNoKGpvYlN0YXRlLmdldE91dHB1dEZvcm1hdCgpID09PSAncGRmJ1xuICAgICAgICA/IHRoaXMuY29uc3RydWN0UGRmUHJvZHVjZXJBcmdzKGpvYlN0YXRlKVxuICAgICAgICA6IGAtJHtqb2JTdGF0ZS5nZXRPdXRwdXRGb3JtYXQoKX1gKVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBMb29rIGZvciBvdGhlciBQREYgZW5naW5lcyB0aGF0IGNhbiBiZSBzcGVjaWZpZWQgdXNpbmcgc2hvcnQgY29tbWFuZFxuICAgICAgLy8gb3B0aW9ucywgaS5lLiAtbHVhbGF0ZXggYW5kIC14ZWxhdGV4XG4gICAgICBpZiAoam9iU3RhdGUuZ2V0T3V0cHV0Rm9ybWF0KCkgPT09ICdwZGYnICYmIGpvYlN0YXRlLmdldEVuZ2luZSgpLm1hdGNoKFBERl9FTkdJTkVfUEFUVEVSTikpIHtcbiAgICAgICAgYXJncy5wdXNoKGAtJHtqb2JTdGF0ZS5nZXRFbmdpbmUoKX1gKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gS2VlcCB0aGUgb3B0aW9uIG5vaXNlIHRvIGEgbWluaW11bSBieSBub3QgcGFzc2luZyBkZWZhdWx0IGVuZ2luZVxuICAgICAgICBpZiAoam9iU3RhdGUuZ2V0RW5naW5lKCkgIT09ICdwZGZsYXRleCcpIHtcbiAgICAgICAgICBhcmdzLnB1c2goYC1wZGZsYXRleD1cIiR7am9iU3RhdGUuZ2V0RW5naW5lKCl9XCJgKVxuICAgICAgICB9XG4gICAgICAgIGFyZ3MucHVzaChgLSR7am9iU3RhdGUuZ2V0T3V0cHV0Rm9ybWF0KCl9YClcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoam9iU3RhdGUuZ2V0T3V0cHV0RGlyZWN0b3J5KCkpIHtcbiAgICAgIGFyZ3MucHVzaChgLW91dGRpcj1cIiR7am9iU3RhdGUuZ2V0T3V0cHV0RGlyZWN0b3J5KCl9XCJgKVxuICAgIH1cblxuICAgIGFyZ3MucHVzaChgXCIke2pvYlN0YXRlLmdldFRleEZpbGVQYXRoKCl9XCJgKVxuICAgIHJldHVybiBhcmdzXG4gIH1cblxuICBjb25zdHJ1Y3RQZGZQcm9kdWNlckFyZ3MgKGpvYlN0YXRlKSB7XG4gICAgY29uc3QgcHJvZHVjZXIgPSBqb2JTdGF0ZS5nZXRQcm9kdWNlcigpXG5cbiAgICBzd2l0Y2ggKHByb2R1Y2VyKSB7XG4gICAgICBjYXNlICdwczJwZGYnOlxuICAgICAgICByZXR1cm4gJy1wZGZwcydcbiAgICAgIGNhc2UgJ2R2aXBkZic6XG4gICAgICAgIHJldHVybiAnLXBkZmR2aSAtZSBcIiRkdmlwZGYgPSBcXCdkdmlwZGYgJU8gJVMgJURcXCc7XCInXG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gYC1wZGZkdmkgLWUgXCIkZHZpcGRmID0gJyR7cHJvZHVjZXJ9ICVPIC1vICVEICVTJztcImBcbiAgICB9XG4gIH1cbn1cbiJdfQ==