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

var _parsersLogParser = require('./parsers/log-parser');

var _parsersLogParser2 = _interopRequireDefault(_parsersLogParser);

var _parsersFdbParser = require('./parsers/fdb-parser');

var _parsersFdbParser2 = _interopRequireDefault(_parsersFdbParser);

var _werkzeugJs = require('./werkzeug.js');

var Builder = (function () {
  function Builder() {
    _classCallCheck(this, Builder);

    this.envPathKey = this.getEnvironmentPathKey(process.platform);
  }

  _createClass(Builder, [{
    key: 'run',
    value: _asyncToGenerator(function* (jobState) {})
  }, {
    key: 'constructArgs',
    value: function constructArgs(jobState) {}
  }, {
    key: 'checkRuntimeDependencies',
    value: _asyncToGenerator(function* () {})
  }, {
    key: 'logStatusCode',
    value: function logStatusCode(statusCode, stderr) {
      switch (statusCode) {
        case 127:
          latex.log.error((0, _werkzeugJs.heredoc)('\n          TeXification failed! Builder executable \'' + this.executable + '\' not found.\n            latex.texPath\n              as configured: ' + atom.config.get('latex.texPath') + '\n              when resolved: ' + this.constructPath() + '\n          Make sure latex.texPath is configured correctly either adjust it           via the settings view, or directly in your config.cson file.\n          '));
          break;
        case 0:
          break;
        default:
          var errorOutput = stderr ? ' and output of "' + stderr + '"' : '';
          latex.log.error('TeXification failed with status code ' + statusCode + errorOutput);
      }
    }
  }, {
    key: 'parseLogFile',
    value: function parseLogFile(jobState) {
      var logFilePath = this.resolveLogFilePath(jobState);
      if (_fsPlus2['default'].existsSync(logFilePath)) {
        var parser = this.getLogParser(logFilePath, jobState.getFilePath());
        var result = parser.parse();
        if (result) {
          if (result.messages) {
            jobState.setLogMessages(result.messages);
          }
          if (result.outputFilePath) {
            jobState.setOutputFilePath(result.outputFilePath);
          }
        }
      }
    }
  }, {
    key: 'getLogParser',
    value: function getLogParser(logFilePath, texFilePath) {
      return new _parsersLogParser2['default'](logFilePath, texFilePath);
    }
  }, {
    key: 'constructChildProcessOptions',
    value: function constructChildProcessOptions(directoryPath, defaultEnv) {
      var env = Object.assign(defaultEnv || {}, process.env);
      var childPath = this.constructPath();
      if (childPath) {
        env[this.envPathKey] = childPath;
      }

      return {
        allowKill: true,
        encoding: 'utf8',
        maxBuffer: 52428800, // Set process' max buffer size to 50 MB.
        cwd: directoryPath, // Run process with sensible CWD.
        env: env
      };
    }
  }, {
    key: 'constructPath',
    value: function constructPath() {
      var texPath = (atom.config.get('latex.texPath') || '').trim();
      if (texPath.length === 0) {
        texPath = this.defaultTexPath(process.platform);
      }

      var processPath = process.env[this.envPathKey];
      var match = texPath.match(/^(.*)(\$PATH)(.*)$/);
      if (match) {
        return '' + match[1] + processPath + match[3];
      }

      return [texPath, processPath].filter(function (str) {
        return str && str.length > 0;
      }).join(_path2['default'].delimiter);
    }
  }, {
    key: 'defaultTexPath',
    value: function defaultTexPath(platform) {
      if (platform === 'win32') {
        return ['%SystemDrive%\\texlive\\2016\\bin\\win32', '%SystemDrive%\\texlive\\2015\\bin\\win32', '%SystemDrive%\\texlive\\2014\\bin\\win32', '%ProgramFiles%\\MiKTeX 2.9\\miktex\\bin\\x64', '%ProgramFiles(x86)%\\MiKTeX 2.9\\miktex\\bin'].join(';');
      }

      return ['/usr/texbin', '/Library/TeX/texbin'].join(':');
    }
  }, {
    key: 'resolveOutputFilePath',
    value: function resolveOutputFilePath(jobState, ext) {
      var _path$parse = _path2['default'].parse(jobState.getFilePath());

      var dir = _path$parse.dir;
      var name = _path$parse.name;

      if (jobState.getJobName()) {
        name = jobState.getJobName();
      }
      dir = _path2['default'].resolve(dir, jobState.getOutputDirectory());
      return _path2['default'].format({ dir: dir, name: name, ext: ext });
    }
  }, {
    key: 'resolveLogFilePath',
    value: function resolveLogFilePath(jobState) {
      return this.resolveOutputFilePath(jobState, '.log');
    }
  }, {
    key: 'getEnvironmentPathKey',
    value: function getEnvironmentPathKey(platform) {
      if (platform === 'win32') {
        return 'Path';
      }
      return 'PATH';
    }
  }, {
    key: 'resolveFdbFilePath',
    value: function resolveFdbFilePath(jobState) {
      return this.resolveOutputFilePath(jobState, '.fdb_latexmk');
    }
  }, {
    key: 'parseFdbFile',
    value: function parseFdbFile(jobState) {
      var fdbFilePath = this.resolveFdbFilePath(jobState);
      if (_fsPlus2['default'].existsSync(fdbFilePath)) {
        var parser = this.getFdbParser(fdbFilePath);
        var result = parser.parse();
        if (result) {
          jobState.setFileDatabase(result);
        }
      }
    }
  }, {
    key: 'getFdbParser',
    value: function getFdbParser(fdbFilePath) {
      return new _parsersFdbParser2['default'](fdbFilePath);
    }
  }, {
    key: 'parseLogAndFdbFiles',
    value: function parseLogAndFdbFiles(jobState) {
      this.parseLogFile(jobState);
      this.parseFdbFile(jobState);

      var fdb = jobState.getFileDatabase();
      if (fdb) {
        var sections = ['ps2pdf', 'xdvipdfmx', 'dvipdf', 'dvips', 'latex', 'pdflatex', 'lualatex', 'xelatex'];
        var output = undefined;

        for (var section of sections) {
          if (fdb[section] && fdb[section].generated) {
            var generated = fdb[section].generated;

            output = generated.find(function (output) {
              return (0, _werkzeugJs.isPdfFile)(output);
            });
            if (output) break;

            output = generated.find(function (output) {
              return (0, _werkzeugJs.isPsFile)(output);
            });
            if (output) break;

            output = generated.find(function (output) {
              return (0, _werkzeugJs.isDviFile)(output);
            });
            if (output) break;
          }
        }

        if (output) {
          jobState.setOutputFilePath(_path2['default'].resolve(jobState.getProjectPath(), _path2['default'].normalize(output)));
        }
      }
    }
  }], [{
    key: 'canProcess',
    value: function canProcess(state) {}
  }]);

  return Builder;
})();

exports['default'] = Builder;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2JpbGx5Ly5hdG9tL3BhY2thZ2VzL2xhdGV4L2xpYi9idWlsZGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O3NCQUVlLFNBQVM7Ozs7b0JBQ1AsTUFBTTs7OztnQ0FDRCxzQkFBc0I7Ozs7Z0NBQ3RCLHNCQUFzQjs7OzswQkFDWSxlQUFlOztJQUVsRCxPQUFPO1dBQVAsT0FBTzswQkFBUCxPQUFPOztTQUMxQixVQUFVLEdBQUcsSUFBSSxDQUFDLHFCQUFxQixDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUM7OztlQUR0QyxPQUFPOzs2QkFJaEIsV0FBQyxRQUFRLEVBQUUsRUFBRTs7O1dBQ1QsdUJBQUMsUUFBUSxFQUFFLEVBQUU7Ozs2QkFDSSxhQUFHLEVBQUU7OztXQUV0Qix1QkFBQyxVQUFVLEVBQUUsTUFBTSxFQUFFO0FBQ2pDLGNBQVEsVUFBVTtBQUNoQixhQUFLLEdBQUc7QUFDTixlQUFLLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxvRkFDNkIsSUFBSSxDQUFDLFVBQVUsK0VBRXJDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyx1Q0FDaEMsSUFBSSxDQUFDLGFBQWEsRUFBRSxxS0FHdkMsQ0FBQyxDQUFBO0FBQ0wsZ0JBQUs7QUFBQSxBQUNQLGFBQUssQ0FBQztBQUNKLGdCQUFLO0FBQUEsQUFDUDtBQUNFLGNBQU0sV0FBVyxHQUFHLE1BQU0sd0JBQXNCLE1BQU0sU0FBTSxFQUFFLENBQUE7QUFDOUQsZUFBSyxDQUFDLEdBQUcsQ0FBQyxLQUFLLDJDQUF5QyxVQUFVLEdBQUcsV0FBVyxDQUFHLENBQUE7QUFBQSxPQUN0RjtLQUNGOzs7V0FFWSxzQkFBQyxRQUFRLEVBQUU7QUFDdEIsVUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLFFBQVEsQ0FBQyxDQUFBO0FBQ3JELFVBQUksb0JBQUcsVUFBVSxDQUFDLFdBQVcsQ0FBQyxFQUFFO0FBQzlCLFlBQU0sTUFBTSxH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QUMsQ0FBQTtTQUM1RjtPQUNGO0tBQ0Y7OztXQWhLaUIsb0JBQUMsS0FBSyxFQUFFLEVBQUU7OztTQUhULE9BQU87OztxQkFBUCxPQUFPIiwiZmlsZSI6Ii9ob21lL2JpbGx5Ly5hdG9tL3BhY2thZ2VzL2xhdGV4L2xpYi9idWlsZGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBiYWJlbCAqL1xuXG5pbXBvcnQgZnMgZnJvbSAnZnMtcGx1cydcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXG5pbXBvcnQgTG9nUGFyc2VyIGZyb20gJy4vcGFyc2Vycy9sb2ctcGFyc2VyJ1xuaW1wb3J0IEZkYlBhcnNlciBmcm9tICcuL3BhcnNlcnMvZmRiLXBhcnNlcidcbmltcG9ydCB7IGhlcmVkb2MsIGlzUGRmRmlsZSwgaXNQc0ZpbGUsIGlzRHZpRmlsZSB9IGZyb20gJy4vd2Vya3pldWcuanMnXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJ1aWxkZXIge1xuICBlbnZQYXRoS2V5ID0gdGhpcy5nZXRFbnZpcm9ubWVudFBhdGhLZXkocHJvY2Vzcy5wbGF0Zm9ybSlcblxuICBzdGF0aWMgY2FuUHJvY2VzcyAoc3RhdGUpIHt9XG4gIGFzeW5jIHJ1biAoam9iU3RhdGUpIHt9XG4gIGNvbnN0cnVjdEFyZ3MgKGpvYlN0YXRlKSB7fVxuICBhc3luYyBjaGVja1J1bnRpbWVEZXBlbmRlbmNpZXMgKCkge31cblxuICBsb2dTdGF0dXNDb2RlIChzdGF0dXNDb2RlLCBzdGRlcnIpIHtcbiAgICBzd2l0Y2ggKHN0YXR1c0NvZGUpIHtcbiAgICAgIGNhc2UgMTI3OlxuICAgICAgICBsYXRleC5sb2cuZXJyb3IoaGVyZWRvYyhgXG4gICAgICAgICAgVGVYaWZpY2F0aW9uIGZhaWxlZCEgQnVpbGRlciBleGVjdXRhYmxlICcke3RoaXMuZXhlY3V0YWJsZX0nIG5vdCBmb3VuZC5cbiAgICAgICAgICAgIGxhdGV4LnRleFBhdGhcbiAgICAgICAgICAgICAgYXMgY29uZmlndXJlZDogJHthdG9tLmNvbmZpZy5nZXQoJ2xhdGV4LnRleFBhdGgnKX1cbiAgICAgICAgICAgICAgd2hlbiByZXNvbHZlZDogJHt0aGlzLmNvbnN0cnVjdFBhdGgoKX1cbiAgICAgICAgICBNYWtlIHN1cmUgbGF0ZXgudGV4UGF0aCBpcyBjb25maWd1cmVkIGNvcnJlY3RseSBlaXRoZXIgYWRqdXN0IGl0IFxcXG4gICAgICAgICAgdmlhIHRoZSBzZXR0aW5ncyB2aWV3LCBvciBkaXJlY3RseSBpbiB5b3VyIGNvbmZpZy5jc29uIGZpbGUuXG4gICAgICAgICAgYCkpXG4gICAgICAgIGJyZWFrXG4gICAgICBjYXNlIDA6XG4gICAgICAgIGJyZWFrXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBjb25zdCBlcnJvck91dHB1dCA9IHN0ZGVyciA/IGAgYW5kIG91dHB1dCBvZiBcIiR7c3RkZXJyfVwiYCA6ICcnXG4gICAgICAgIGxhdGV4LmxvZy5lcnJvcihgVGVYaWZpY2F0aW9uIGZhaWxlZCB3aXRoIHN0YXR1cyBjb2RlICR7c3RhdHVzQ29kZX0ke2Vycm9yT3V0cHV0fWApXG4gICAgfVxuICB9XG5cbiAgcGFyc2VMb2dGaWxlIChqb2JTdGF0ZSkge1xuICAgIGNvbnN0IGxvZ0ZpbGVQYXRoID0gdGhpcy5yZXNvbHZlTG9nRmlsZVBhdGgoam9iU3RhdGUpXG4gICAgaWYgKGZzLmV4aXN0c1N5bmMobG9nRmlsZVBhdGgpKSB7XG4gICAgICBjb25zdCBwYXJzZXIgPSB0aGlzLmdldExvZ1BhcnNlcihsb2dGaWxlUGF0aCwgam9iU3RhdGUuZ2V0RmlsZVBhdGgoKSlcbiAgICAgIGNvbnN0IHJlc3VsdCA9IHBhcnNlci5wYXJzZSgpXG4gICAgICBpZiAocmVzdWx0KSB7XG4gICAgICAgIGlmIChyZXN1bHQubWVzc2FnZXMpIHtcbiAgICAgICAgICBqb2JTdGF0ZS5zZXRMb2dNZXNzYWdlcyhyZXN1bHQubWVzc2FnZXMpXG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJlc3VsdC5vdXRwdXRGaWxlUGF0aCkge1xuICAgICAgICAgIGpvYlN0YXRlLnNldE91dHB1dEZpbGVQYXRoKHJlc3VsdC5vdXRwdXRGaWxlUGF0aClcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGdldExvZ1BhcnNlciAobG9nRmlsZVBhdGgsIHRleEZpbGVQYXRoKSB7XG4gICAgcmV0dXJuIG5ldyBMb2dQYXJzZXIobG9nRmlsZVBhdGgsIHRleEZpbGVQYXRoKVxuICB9XG5cbiAgY29uc3RydWN0Q2hpbGRQcm9jZXNzT3B0aW9ucyAoZGlyZWN0b3J5UGF0aCwgZGVmYXVsdEVudikge1xuICAgIGNvbnN0IGVudiA9IE9iamVjdC5hc3NpZ24oZGVmYXVsdEVudiB8fCB7fSwgcHJvY2Vzcy5lbnYpXG4gICAgY29uc3QgY2hpbGRQYXRoID0gdGhpcy5jb25zdHJ1Y3RQYXRoKClcbiAgICBpZiAoY2hpbGRQYXRoKSB7XG4gICAgICBlbnZbdGhpcy5lbnZQYXRoS2V5XSA9IGNoaWxkUGF0aFxuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBhbGxvd0tpbGw6IHRydWUsXG4gICAgICBlbmNvZGluZzogJ3V0ZjgnLFxuICAgICAgbWF4QnVmZmVyOiA1MjQyODgwMCwgLy8gU2V0IHByb2Nlc3MnIG1heCBidWZmZXIgc2l6ZSB0byA1MCBNQi5cbiAgICAgIGN3ZDogZGlyZWN0b3J5UGF0aCwgIC8vIFJ1biBwcm9jZXNzIHdpdGggc2Vuc2libGUgQ1dELlxuICAgICAgZW52XG4gICAgfVxuICB9XG5cbiAgY29uc3RydWN0UGF0aCAoKSB7XG4gICAgbGV0IHRleFBhdGggPSAoYXRvbS5jb25maWcuZ2V0KCdsYXRleC50ZXhQYXRoJykgfHwgJycpLnRyaW0oKVxuICAgIGlmICh0ZXhQYXRoLmxlbmd0aCA9PT0gMCkge1xuICAgICAgdGV4UGF0aCA9IHRoaXMuZGVmYXVsdFRleFBhdGgocHJvY2Vzcy5wbGF0Zm9ybSlcbiAgICB9XG5cbiAgICBjb25zdCBwcm9jZXNzUGF0aCA9IHByb2Nlc3MuZW52W3RoaXMuZW52UGF0aEtleV1cbiAgICBjb25zdCBtYXRjaCA9IHRleFBhdGgubWF0Y2goL14oLiopKFxcJFBBVEgpKC4qKSQvKVxuICAgIGlmIChtYXRjaCkge1xuICAgICAgcmV0dXJuIGAke21hdGNoWzFdfSR7cHJvY2Vzc1BhdGh9JHttYXRjaFszXX1gXG4gICAgfVxuXG4gICAgcmV0dXJuIFt0ZXhQYXRoLCBwcm9jZXNzUGF0aF1cbiAgICAgIC5maWx0ZXIoc3RyID0+IHN0ciAmJiBzdHIubGVuZ3RoID4gMClcbiAgICAgIC5qb2luKHBhdGguZGVsaW1pdGVyKVxuICB9XG5cbiAgZGVmYXVsdFRleFBhdGggKHBsYXRmb3JtKSB7XG4gICAgaWYgKHBsYXRmb3JtID09PSAnd2luMzInKSB7XG4gICAgICByZXR1cm4gW1xuICAgICAgICAnJVN5c3RlbURyaXZlJVxcXFx0ZXhsaXZlXFxcXDIwMTZcXFxcYmluXFxcXHdpbjMyJyxcbiAgICAgICAgJyVTeXN0ZW1Ecml2ZSVcXFxcdGV4bGl2ZVxcXFwyMDE1XFxcXGJpblxcXFx3aW4zMicsXG4gICAgICAgICclU3lzdGVtRHJpdmUlXFxcXHRleGxpdmVcXFxcMjAxNFxcXFxiaW5cXFxcd2luMzInLFxuICAgICAgICAnJVByb2dyYW1GaWxlcyVcXFxcTWlLVGVYIDIuOVxcXFxtaWt0ZXhcXFxcYmluXFxcXHg2NCcsXG4gICAgICAgICclUHJvZ3JhbUZpbGVzKHg4NiklXFxcXE1pS1RlWCAyLjlcXFxcbWlrdGV4XFxcXGJpbidcbiAgICAgIF0uam9pbignOycpXG4gICAgfVxuXG4gICAgcmV0dXJuIFtcbiAgICAgICcvdXNyL3RleGJpbicsXG4gICAgICAnL0xpYnJhcnkvVGVYL3RleGJpbidcbiAgICBdLmpvaW4oJzonKVxuICB9XG5cbiAgcmVzb2x2ZU91dHB1dEZpbGVQYXRoIChqb2JTdGF0ZSwgZXh0KSB7XG4gICAgbGV0IHsgZGlyLCBuYW1lIH0gPSBwYXRoLnBhcnNlKGpvYlN0YXRlLmdldEZpbGVQYXRoKCkpXG4gICAgaWYgKGpvYlN0YXRlLmdldEpvYk5hbWUoKSkge1xuICAgICAgbmFtZSA9IGpvYlN0YXRlLmdldEpvYk5hbWUoKVxuICAgIH1cbiAgICBkaXIgPSBwYXRoLnJlc29sdmUoZGlyLCBqb2JTdGF0ZS5nZXRPdXRwdXREaXJlY3RvcnkoKSlcbiAgICByZXR1cm4gcGF0aC5mb3JtYXQoeyBkaXIsIG5hbWUsIGV4dCB9KVxuICB9XG5cbiAgcmVzb2x2ZUxvZ0ZpbGVQYXRoIChqb2JTdGF0ZSkge1xuICAgIHJldHVybiB0aGlzLnJlc29sdmVPdXRwdXRGaWxlUGF0aChqb2JTdGF0ZSwgJy5sb2cnKVxuICB9XG5cbiAgZ2V0RW52aXJvbm1lbnRQYXRoS2V5IChwbGF0Zm9ybSkge1xuICAgIGlmIChwbGF0Zm9ybSA9PT0gJ3dpbjMyJykgeyByZXR1cm4gJ1BhdGgnIH1cbiAgICByZXR1cm4gJ1BBVEgnXG4gIH1cblxuICByZXNvbHZlRmRiRmlsZVBhdGggKGpvYlN0YXRlKSB7XG4gICAgcmV0dXJuIHRoaXMucmVzb2x2ZU91dHB1dEZpbGVQYXRoKGpvYlN0YXRlLCAnLmZkYl9sYXRleG1rJylcbiAgfVxuXG4gIHBhcnNlRmRiRmlsZSAoam9iU3RhdGUpIHtcbiAgICBjb25zdCBmZGJGaWxlUGF0aCA9IHRoaXMucmVzb2x2ZUZkYkZpbGVQYXRoKGpvYlN0YXRlKVxuICAgIGlmIChmcy5leGlzdHNTeW5jKGZkYkZpbGVQYXRoKSkge1xuICAgICAgY29uc3QgcGFyc2VyID0gdGhpcy5nZXRGZGJQYXJzZXIoZmRiRmlsZVBhdGgpXG4gICAgICBjb25zdCByZXN1bHQgPSBwYXJzZXIucGFyc2UoKVxuICAgICAgaWYgKHJlc3VsdCkge1xuICAgICAgICBqb2JTdGF0ZS5zZXRGaWxlRGF0YWJhc2UocmVzdWx0KVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGdldEZkYlBhcnNlciAoZmRiRmlsZVBhdGgpIHtcbiAgICByZXR1cm4gbmV3IEZkYlBhcnNlcihmZGJGaWxlUGF0aClcbiAgfVxuXG4gIHBhcnNlTG9nQW5kRmRiRmlsZXMgKGpvYlN0YXRlKSB7XG4gICAgdGhpcy5wYXJzZUxvZ0ZpbGUoam9iU3RhdGUpXG4gICAgdGhpcy5wYXJzZUZkYkZpbGUoam9iU3RhdGUpXG5cbiAgICBjb25zdCBmZGIgPSBqb2JTdGF0ZS5nZXRGaWxlRGF0YWJhc2UoKVxuICAgIGlmIChmZGIpIHtcbiAgICAgIGNvbnN0IHNlY3Rpb25zID0gWydwczJwZGYnLCAneGR2aXBkZm14JywgJ2R2aXBkZicsICdkdmlwcycsICdsYXRleCcsICdwZGZsYXRleCcsICdsdWFsYXRleCcsICd4ZWxhdGV4J11cbiAgICAgIGxldCBvdXRwdXRcblxuICAgICAgZm9yIChjb25zdCBzZWN0aW9uIG9mIHNlY3Rpb25zKSB7XG4gICAgICAgIGlmIChmZGJbc2VjdGlvbl0gJiYgZmRiW3NlY3Rpb25dLmdlbmVyYXRlZCkge1xuICAgICAgICAgIGNvbnN0IGdlbmVyYXRlZCA9IGZkYltzZWN0aW9uXS5nZW5lcmF0ZWRcblxuICAgICAgICAgIG91dHB1dCA9IGdlbmVyYXRlZC5maW5kKG91dHB1dCA9PiBpc1BkZkZpbGUob3V0cHV0KSlcbiAgICAgICAgICBpZiAob3V0cHV0KSBicmVha1xuXG4gICAgICAgICAgb3V0cHV0ID0gZ2VuZXJhdGVkLmZpbmQob3V0cHV0ID0+IGlzUHNGaWxlKG91dHB1dCkpXG4gICAgICAgICAgaWYgKG91dHB1dCkgYnJlYWtcblxuICAgICAgICAgIG91dHB1dCA9IGdlbmVyYXRlZC5maW5kKG91dHB1dCA9PiBpc0R2aUZpbGUob3V0cHV0KSlcbiAgICAgICAgICBpZiAob3V0cHV0KSBicmVha1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChvdXRwdXQpIHtcbiAgICAgICAgam9iU3RhdGUuc2V0T3V0cHV0RmlsZVBhdGgocGF0aC5yZXNvbHZlKGpvYlN0YXRlLmdldFByb2plY3RQYXRoKCksIHBhdGgubm9ybWFsaXplKG91dHB1dCkpKVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuIl19