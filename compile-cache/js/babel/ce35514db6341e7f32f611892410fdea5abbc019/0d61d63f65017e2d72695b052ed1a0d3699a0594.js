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

      return yield latex.process.executeChildProcess(command, options);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2JpbGx5Ly5hdG9tL3BhY2thZ2VzL2xhdGV4L2xpYi9idWlsZGVycy9sYXRleG1rLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztvQkFFaUIsTUFBTTs7Ozt1QkFDSCxZQUFZOzs7O0FBRWhDLElBQU0sYUFBYSxHQUFHLGtCQUFrQixDQUFBO0FBQ3hDLElBQU0sdUJBQXVCLEdBQUcsa0JBQWtCLENBQUE7QUFDbEQsSUFBTSx1QkFBdUIsR0FBRyxNQUFNLENBQUE7QUFDdEMsSUFBTSxrQkFBa0IsR0FBRyxzQkFBc0IsQ0FBQTs7SUFFNUIsY0FBYztZQUFkLGNBQWM7O1dBQWQsY0FBYzswQkFBZCxjQUFjOzsrQkFBZCxjQUFjOztTQUNqQyxVQUFVLEdBQUcsU0FBUzs7O2VBREgsY0FBYzs7NkJBT3ZCLFdBQUMsUUFBUSxFQUFFO0FBQ25CLFVBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUE7O2lCQUVWLE1BQU0sSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsY0FBYyxFQUFFLEVBQUUsSUFBSSxFQUFFLE9BQU8sQ0FBQzs7VUFBdkYsVUFBVSxRQUFWLFVBQVU7VUFBRSxNQUFNLFFBQU4sTUFBTTs7QUFDMUIsVUFBSSxVQUFVLEtBQUssQ0FBQyxFQUFFO0FBQ3BCLFlBQUksQ0FBQyxhQUFhLENBQUMsVUFBVSxFQUFFLE1BQU0sQ0FBQyxDQUFBO09BQ3ZDOztBQUVELGFBQU8sVUFBVSxDQUFBO0tBQ2xCOzs7NkJBRWlCLFdBQUMsYUFBYSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUU7QUFDNUMsVUFBTSxPQUFPLEdBQU0sSUFBSSxDQUFDLFVBQVUsU0FBSSxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxBQUFFLENBQUE7QUFDdEQsVUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLDRCQUE0QixDQUFDLGFBQWEsRUFBRSxFQUFFLGNBQWMsRUFBRSxJQUFJLEVBQUUsQ0FB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bEMsVUFBTSxRQUFRLEdBQUcsUUFBUSxDQUFDLFdBQVcsRUFBRSxDQUFBOztBQUV2QyxjQUFRLFFBQVE7QUFDZCxhQUFLLFFBQVE7QUFDWCxpQkFBTyxRQUFRLENBQUE7QUFBQSxBQUNqQixhQUFLLFFBQVE7QUFDWCxpQkFBTyw2Q0FBNkMsQ0FBQTtBQUFBLEFBQ3REO0FBQ0UsOENBQWlDLFFBQVEsc0JBQWlCO0FBQUEsT0FDN0Q7S0FDRjs7O1dBcElpQixvQkFBQyxLQUFLLEVBQUU7QUFDeEIsYUFBTyxDQUFDLENBQUMsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFBO0tBQ2hDOzs7U0FMa0IsY0FBYzs7O3FCQUFkLGNBQWMiLCJmaWxlIjoiL2hvbWUvYmlsbHkvLmF0b20vcGFja2FnZXMvbGF0ZXgvbGliL2J1aWxkZXJzL2xhdGV4bWsuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiogQGJhYmVsICovXG5cbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXG5pbXBvcnQgQnVpbGRlciBmcm9tICcuLi9idWlsZGVyJ1xuXG5jb25zdCBMQVRFWF9QQVRURVJOID0gL15sYXRleHx1P3BsYXRleCQvXG5jb25zdCBMQVRFWE1LX1ZFUlNJT05fUEFUVEVSTiA9IC9WZXJzaW9uXFxzKyhcXFMrKS9pXG5jb25zdCBMQVRFWE1LX01JTklNVU1fVkVSU0lPTiA9ICc0LjM3J1xuY29uc3QgUERGX0VOR0lORV9QQVRURVJOID0gL14oeGVsYXRleHxsdWFsYXRleCkkL1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMYXRleG1rQnVpbGRlciBleHRlbmRzIEJ1aWxkZXIge1xuICBleGVjdXRhYmxlID0gJ2xhdGV4bWsnXG5cbiAgc3RhdGljIGNhblByb2Nlc3MgKHN0YXRlKSB7XG4gICAgcmV0dXJuICEhc3RhdGUuZ2V0VGV4RmlsZVBhdGgoKVxuICB9XG5cbiAgYXN5bmMgcnVuIChqb2JTdGF0ZSkge1xuICAgIGNvbnN0IGFyZ3MgPSB0aGlzLmNvbnN0cnVjdEFyZ3Moam9iU3RhdGUpXG5cbiAgICBjb25zdCB7IHN0YXR1c0NvZGUsIHN0ZGVyciB9ID0gYXdhaXQgdGhpcy5leGVjTGF0ZXhtayhqb2JTdGF0ZS5nZXRQcm9qZWN0UGF0aCgpLCBhcmdzLCAnZXJyb3InKVxuICAgIGlmIChzdGF0dXNDb2RlICE9PSAwKSB7XG4gICAgICB0aGlzLmxvZ1N0YXR1c0NvZGUoc3RhdHVzQ29kZSwgc3RkZXJyKVxuICAgIH1cblxuICAgIHJldHVybiBzdGF0dXNDb2RlXG4gIH1cblxuICBhc3luYyBleGVjTGF0ZXhtayAoZGlyZWN0b3J5UGF0aCwgYXJncywgdHlwZSkge1xuICAgIGNvbnN0IGNvbW1hbmQgPSBgJHt0aGlzLmV4ZWN1dGFibGV9ICR7YXJncy5qb2luKCcgJyl9YFxuICAgIGNvbnN0IG9wdGlvbnMgPSB0aGlzLmNvbnN0cnVjdENoaWxkUHJvY2Vzc09wdGlvbnMoZGlyZWN0b3J5UGF0aCwgeyBtYXhfcHJpbnRfbGluZTogMTAwMCB9KVxuXG4gICAgcmV0dXJuIGF3YWl0IGxhdGV4LnByb2Nlc3MuZXhlY3V0ZUNoaWxkUHJvY2Vzcyhjb21tYW5kLCBvcHRpb25zKVxuICB9XG5cbiAgYXN5bmMgY2hlY2tSdW50aW1lRGVwZW5kZW5jaWVzICgpIHtcbiAgICBjb25zdCB7IHN0YXR1c0NvZGUsIHN0ZG91dCwgc3RkZXJyIH0gPSBhd2FpdCB0aGlzLmV4ZWNMYXRleG1rKCcuJywgWyctdiddLCAnZXJyb3InKVxuXG4gICAgaWYgKHN0YXR1c0NvZGUgIT09IDApIHtcbiAgICAgIGxhdGV4LmxvZy5lcnJvcihgbGF0ZXhtayBjaGVjayBmYWlsZWQgd2l0aCBjb2RlICR7c3RhdHVzQ29kZX0gYW5kIHJlc3BvbnNlIG9mIFwiJHtzdGRlcnJ9XCIuYClcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGNvbnN0IG1hdGNoID0gc3Rkb3V0Lm1hdGNoKExBVEVYTUtfVkVSU0lPTl9QQVRURVJOKVxuXG4gICAgaWYgKCFtYXRjaCkge1xuICAgICAgbGF0ZXgubG9nLndhcm5pbmcoYGxhdGV4bWsgY2hlY2sgc3VjY2VlZGVkIGJ1dCB3aXRoIGFuIHVua25vd24gdmVyc2lvbiByZXNwb25zZSBvZiBcIiR7c3Rkb3V0fVwiLmApXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBjb25zdCB2ZXJzaW9uID0gbWF0Y2hbMV1cblxuICAgIGlmICh2ZXJzaW9uIDwgTEFURVhNS19NSU5JTVVNX1ZFUlNJT04pIHtcbiAgICAgIGxhdGV4LmxvZy53YXJuaW5nKGBsYXRleG1rIGNoZWNrIHN1Y2NlZWRlZCBidXQgd2l0aCBhIHZlcnNpb24gb2YgJHt2ZXJzaW9ufVwiLiBNaW5pbXVtIHZlcnNpb24gcmVxdWlyZWQgaXMgJHtMQVRFWE1LX01JTklNVU1fVkVSU0lPTn0uYClcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGxhdGV4LmxvZy5pbmZvKGBsYXRleG1rIGNoZWNrIHN1Y2NlZWRlZC4gRm91bmQgdmVyc2lvbiAke3ZlcnNpb259LmApXG4gIH1cblxuICBsb2dTdGF0dXNDb2RlIChzdGF0dXNDb2RlLCBzdGRlcnIpIHtcbiAgICBzd2l0Y2ggKHN0YXR1c0NvZGUpIHtcbiAgICAgIGNhc2UgMTA6XG4gICAgICAgIGxhdGV4LmxvZy5lcnJvcignbGF0ZXhtazogQmFkIGNvbW1hbmQgbGluZSBhcmd1bWVudHMuJylcbiAgICAgICAgYnJlYWtcbiAgICAgIGNhc2UgMTE6XG4gICAgICAgIGxhdGV4LmxvZy5lcnJvcignbGF0ZXhtazogRmlsZSBzcGVjaWZpZWQgb24gY29tbWFuZCBsaW5lIG5vdCBmb3VuZCBvciBvdGhlciBmaWxlIG5vdCBmb3VuZC4nKVxuICAgICAgICBicmVha1xuICAgICAgY2FzZSAxMjpcbiAgICAgICAgbGF0ZXgubG9nLmVycm9yKCdsYXRleG1rOiBGYWlsdXJlIGluIHNvbWUgcGFydCBvZiBtYWtpbmcgZmlsZXMuJylcbiAgICAgICAgYnJlYWtcbiAgICAgIGNhc2UgMTM6XG4gICAgICAgIGxhdGV4LmxvZy5lcnJvcignbGF0ZXhtazogZXJyb3IgaW4gaW5pdGlhbGl6YXRpb24gZmlsZS4nKVxuICAgICAgICBicmVha1xuICAgICAgY2FzZSAyMDpcbiAgICAgICAgbGF0ZXgubG9nLmVycm9yKCdsYXRleG1rOiBwcm9iYWJsZSBidWcgb3IgcmV0Y29kZSBmcm9tIGNhbGxlZCBwcm9ncmFtLicpXG4gICAgICAgIGJyZWFrXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBzdXBlci5sb2dTdGF0dXNDb2RlKHN0YXR1c0NvZGUsIHN0ZGVycilcbiAgICB9XG4gIH1cblxuICBjb25zdHJ1Y3RBcmdzIChqb2JTdGF0ZSkge1xuICAgIGNvbnN0IGFyZ3MgPSBbXG4gICAgICAnLWludGVyYWN0aW9uPW5vbnN0b3Btb2RlJyxcbiAgICAgICctZicsXG4gICAgICAnLWNkJyxcbiAgICAgICctZmlsZS1saW5lLWVycm9yJ1xuICAgIF1cblxuICAgIGlmIChqb2JTdGF0ZS5nZXRTaG91bGRSZWJ1aWxkKCkpIHtcbiAgICAgIGFyZ3MucHVzaCgnLWcnKVxuICAgIH1cbiAgICBpZiAoam9iU3RhdGUuZ2V0Sm9iTmFtZSgpKSB7XG4gICAgICBhcmdzLnB1c2goYC1qb2JuYW1lPVwiJHtqb2JTdGF0ZS5nZXRKb2JOYW1lKCl9XCJgKVxuICAgIH1cbiAgICBpZiAoam9iU3RhdGUuZ2V0RW5hYmxlU2hlbGxFc2NhcGUoKSkge1xuICAgICAgYXJncy5wdXNoKCctc2hlbGwtZXNjYXBlJylcbiAgICB9XG4gICAgaWYgKGpvYlN0YXRlLmdldEVuYWJsZVN5bmN0ZXgoKSkge1xuICAgICAgYXJncy5wdXNoKCctc3luY3RleD0xJylcbiAgICB9XG4gICAgaWYgKGpvYlN0YXRlLmdldEVuYWJsZUV4dGVuZGVkQnVpbGRNb2RlKCkpIHtcbiAgICAgIGNvbnN0IGxhdGV4bWtyY1BhdGggPSBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi4nLCAnLi4nLCAncmVzb3VyY2VzJywgJ2xhdGV4bWtyYycpXG4gICAgICBhcmdzLnB1c2goYC1yIFwiJHtsYXRleG1rcmNQYXRofVwiYClcbiAgICB9XG5cbiAgICBpZiAoam9iU3RhdGUuZ2V0RW5naW5lKCkubWF0Y2goTEFURVhfUEFUVEVSTikpIHtcbiAgICAgIGFyZ3MucHVzaChgLWxhdGV4PVwiJHtqb2JTdGF0ZS5nZXRFbmdpbmUoKX1cImApXG4gICAgICBhcmdzLnB1c2goam9iU3RhdGUuZ2V0T3V0cHV0Rm9ybWF0KCkgPT09ICdwZGYnXG4gICAgICAgID8gdGhpcy5jb25zdHJ1Y3RQZGZQcm9kdWNlckFyZ3Moam9iU3RhdGUpXG4gICAgICAgIDogYC0ke2pvYlN0YXRlLmdldE91dHB1dEZvcm1hdCgpfWApXG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIExvb2sgZm9yIG90aGVyIFBERiBlbmdpbmVzIHRoYXQgY2FuIGJlIHNwZWNpZmllZCB1c2luZyBzaG9ydCBjb21tYW5kXG4gICAgICAvLyBvcHRpb25zLCBpLmUuIC1sdWFsYXRleCBhbmQgLXhlbGF0ZXhcbiAgICAgIGlmIChqb2JTdGF0ZS5nZXRPdXRwdXRGb3JtYXQoKSA9PT0gJ3BkZicgJiYgam9iU3RhdGUuZ2V0RW5naW5lKCkubWF0Y2goUERGX0VOR0lORV9QQVRURVJOKSkge1xuICAgICAgICBhcmdzLnB1c2goYC0ke2pvYlN0YXRlLmdldEVuZ2luZSgpfWApXG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBLZWVwIHRoZSBvcHRpb24gbm9pc2UgdG8gYSBtaW5pbXVtIGJ5IG5vdCBwYXNzaW5nIGRlZmF1bHQgZW5naW5lXG4gICAgICAgIGlmIChqb2JTdGF0ZS5nZXRFbmdpbmUoKSAhPT0gJ3BkZmxhdGV4Jykge1xuICAgICAgICAgIGFyZ3MucHVzaChgLXBkZmxhdGV4PVwiJHtqb2JTdGF0ZS5nZXRFbmdpbmUoKX1cImApXG4gICAgICAgIH1cbiAgICAgICAgYXJncy5wdXNoKGAtJHtqb2JTdGF0ZS5nZXRPdXRwdXRGb3JtYXQoKX1gKVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChqb2JTdGF0ZS5nZXRPdXRwdXREaXJlY3RvcnkoKSkge1xuICAgICAgYXJncy5wdXNoKGAtb3V0ZGlyPVwiJHtqb2JTdGF0ZS5nZXRPdXRwdXREaXJlY3RvcnkoKX1cImApXG4gICAgfVxuXG4gICAgYXJncy5wdXNoKGBcIiR7am9iU3RhdGUuZ2V0VGV4RmlsZVBhdGgoKX1cImApXG4gICAgcmV0dXJuIGFyZ3NcbiAgfVxuXG4gIGNvbnN0cnVjdFBkZlByb2R1Y2VyQXJncyAoam9iU3RhdGUpIHtcbiAgICBjb25zdCBwcm9kdWNlciA9IGpvYlN0YXRlLmdldFByb2R1Y2VyKClcblxuICAgIHN3aXRjaCAocHJvZHVjZXIpIHtcbiAgICAgIGNhc2UgJ3BzMnBkZic6XG4gICAgICAgIHJldHVybiAnLXBkZnBzJ1xuICAgICAgY2FzZSAnZHZpcGRmJzpcbiAgICAgICAgcmV0dXJuICctcGRmZHZpIC1lIFwiJGR2aXBkZiA9IFxcJ2R2aXBkZiAlTyAlUyAlRFxcJztcIidcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBgLXBkZmR2aSAtZSBcIiRkdmlwZGYgPSAnJHtwcm9kdWNlcn0gJU8gLW8gJUQgJVMnO1wiYFxuICAgIH1cbiAgfVxufVxuIl19