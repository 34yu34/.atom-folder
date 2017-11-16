Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/** @babel */

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _fsPlus = require('fs-plus');

var _fsPlus2 = _interopRequireDefault(_fsPlus);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _werkzeug = require('./werkzeug');

var _minimatch = require('minimatch');

var _minimatch2 = _interopRequireDefault(_minimatch);

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

var _jsYaml = require('js-yaml');

var _jsYaml2 = _interopRequireDefault(_jsYaml);

var _atom = require('atom');

var _buildState = require('./build-state');

var _buildState2 = _interopRequireDefault(_buildState);

var _parsersMagicParser = require('./parsers/magic-parser');

var _parsersMagicParser2 = _interopRequireDefault(_parsersMagicParser);

var Composer = (function (_Disposable) {
  _inherits(Composer, _Disposable);

  function Composer() {
    var _this2 = this;

    _classCallCheck(this, Composer);

    _get(Object.getPrototypeOf(Composer.prototype), 'constructor', this).call(this, function () {
      return _this.disposables.dispose();
    });
    this.disposables = new _atom.CompositeDisposable();
    this.cachedBuildStates = new Map();

    var _this = this;

    this.disposables.add(atom.config.onDidChange('latex', function () {
      _this2.rebuildCompleted = new Set();
    }));
  }

  _createClass(Composer, [{
    key: 'initializeBuild',
    value: function initializeBuild(filePath) {
      var allowCached = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

      var state = undefined;

      if (allowCached && this.cachedBuildStates.has(filePath)) {
        state = this.cachedBuildStates.get(filePath);
      } else {
        state = new _buildState2['default'](filePath);
        this.initializeBuildStateFromConfig(state);
        this.initializeBuildStateFromMagic(state);
        this.initializeBuildStateFromSettingsFile(state);
        // Check again in case there was a root comment
        var masterFilePath = state.getFilePath();
        if (filePath !== masterFilePath) {
          if (allowCached && this.cachedBuildStates.has(masterFilePath)) {
            state = this.cachedBuildStates.get(masterFilePath);
          }
          state.addSubfile(filePath);
        }
        this.cacheBuildState(state);
      }

      var builder = latex.builderRegistry.getBuilder(state);
      if (!builder) {
        latex.log.warning('No registered LaTeX builder can process ' + state.getFilePath() + '.');
        return state;
      }

      return { state: state, builder: builder };
    }
  }, {
    key: 'cacheBuildState',
    value: function cacheBuildState(state) {
      var filePath = state.getFilePath();
      if (this.cachedBuildStates.has(filePath)) {
        var oldState = this.cachedBuildStates.get(filePath);
        for (var subfile of oldState.getSubfiles()) {
          this.cachedBuildStates['delete'](subfile);
        }
        this.cachedBuildStates['delete'](filePath);
      }

      this.cachedBuildStates.set(filePath, state);
      for (var subfile of state.getSubfiles()) {
        this.cachedBuildStates.set(subfile, state);
      }
    }
  }, {
    key: 'initializeBuildStateFromConfig',
    value: function initializeBuildStateFromConfig(state) {
      this.initializeBuildStateFromProperties(state, atom.config.get('latex'));
    }
  }, {
    key: 'initializeBuildStateFromProperties',
    value: function initializeBuildStateFromProperties(state, properties) {
      if (!properties) return;

      if (properties.cleanPatterns) {
        state.setCleanPatterns(properties.cleanPatterns);
      }

      if ('enableSynctex' in properties) {
        state.setEnableSynctex(properties.enableSynctex);
      }

      if ('enableShellEscape' in properties) {
        state.setEnableShellEscape(properties.enableShellEscape);
      }

      if ('enableExtendedBuildMode' in properties) {
        state.setEnableExtendedBuildMode(properties.enableExtendedBuildMode);
      }

      if (properties.jobNames) {
        state.setJobNames(properties.jobNames);
      } else if (properties.jobnames) {
        // jobnames is for compatibility with magic comments
        state.setJobNames(properties.jobnames);
      } else if (properties.jobname) {
        // jobname is for compatibility with Sublime
        state.setJobNames([properties.jobname]);
      }

      if (properties.customEngine) {
        state.setEngine(properties.customEngine);
      } else if (properties.engine) {
        state.setEngine(properties.engine);
      } else if (properties.program) {
        // program is for compatibility with magic comments
        state.setEngine(properties.program);
      }

      if ('moveResultToSourceDirectory' in properties) {
        state.setMoveResultToSourceDirectory(properties.moveResultToSourceDirectory);
      }

      if (properties.outputFormat) {
        state.setOutputFormat(properties.outputFormat);
      } else if (properties.format) {
        // format is for compatibility with magic comments
        state.setOutputFormat(properties.format);
      }

      if ('outputDirectory' in properties) {
        state.setOutputDirectory(properties.outputDirectory);
      } else if ('output_directory' in properties) {
        // output_directory is for compatibility with Sublime
        state.setOutputDirectory(properties.output_directory);
      }

      if (properties.producer) {
        state.setProducer(properties.producer);
      }
    }
  }, {
    key: 'initializeBuildStateFromMagic',
    value: function initializeBuildStateFromMagic(state) {
      var magic = this.getMagic(state);

      if (magic.root) {
        state.setFilePath(_path2['default'].resolve(state.getProjectPath(), magic.root));
        magic = this.getMagic(state);
      }

      this.initializeBuildStateFromProperties(state, magic);
    }
  }, {
    key: 'getMagic',
    value: function getMagic(state) {
      return new _parsersMagicParser2['default'](state.getFilePath()).parse();
    }
  }, {
    key: 'initializeBuildStateFromSettingsFile',
    value: function initializeBuildStateFromSettingsFile(state) {
      try {
        var _path$parse = _path2['default'].parse(state.getFilePath());

        var dir = _path$parse.dir;
        var _name = _path$parse.name;

        var filePath = _path2['default'].format({ dir: dir, name: _name, ext: '.yaml' });

        if (_fsPlus2['default'].existsSync(filePath)) {
          var config = _jsYaml2['default'].safeLoad(_fsPlus2['default'].readFileSync(filePath));
          this.initializeBuildStateFromProperties(state, config);
        }
      } catch (error) {
        latex.log.error('Parsing of project file failed: ' + error.message);
      }
    }
  }, {
    key: 'build',
    value: _asyncToGenerator(function* (shouldRebuild) {
      var _this3 = this;

      latex.process.killChildProcesses();

      var _getEditorDetails = (0, _werkzeug.getEditorDetails)();

      var editor = _getEditorDetails.editor;
      var filePath = _getEditorDetails.filePath;

      if (!filePath) {
        latex.log.warning('File needs to be saved to disk before it can be TeXified.');
        return false;
      }

      if (editor.isModified()) {
        editor.save(); // TODO: Make this configurable?
      }

      var _initializeBuild = this.initializeBuild(filePath);

      var builder = _initializeBuild.builder;
      var state = _initializeBuild.state;

      if (!builder) return false;
      state.setShouldRebuild(shouldRebuild);

      if (this.rebuildCompleted && !this.rebuildCompleted.has(state.getFilePath())) {
        state.setShouldRebuild(true);
        this.rebuildCompleted.add(state.getFilePath());
      }

      var label = state.getShouldRebuild() ? 'LaTeX Rebuild' : 'LaTeX Build';

      latex.status.show(label, 'highlight', 'sync', true, 'Click to kill LaTeX build.', function () {
        return latex.process.killChildProcesses();
      });
      latex.log.group(label);

      var jobs = state.getJobStates().map(function (jobState) {
        return _this3.buildJob(builder, jobState);
      });

      yield Promise.all(jobs);

      latex.log.groupEnd();
    })
  }, {
    key: 'buildJob',
    value: _asyncToGenerator(function* (builder, jobState) {
      try {
        var statusCode = yield builder.run(jobState);
        builder.parseLogAndFdbFiles(jobState);

        var messages = jobState.getLogMessages() || [];
        for (var message of messages) {
          latex.log.showMessage(message);
        }

        if (statusCode > 0 || !jobState.getLogMessages() || !jobState.getOutputFilePath()) {
          this.showError(jobState);
        } else {
          if (this.shouldMoveResult(jobState)) {
            this.moveResult(jobState);
          }
          this.showResult(jobState);
        }
      } catch (error) {
        latex.log.error(error.message);
      }
    })
  }, {
    key: 'sync',
    value: _asyncToGenerator(function* () {
      var _this4 = this;

      var _getEditorDetails2 = (0, _werkzeug.getEditorDetails)();

      var filePath = _getEditorDetails2.filePath;
      var lineNumber = _getEditorDetails2.lineNumber;

      if (!filePath || !this.isTexFile(filePath)) {
        return;
      }

      var _initializeBuild2 = this.initializeBuild(filePath, true);

      var builder = _initializeBuild2.builder;
      var state = _initializeBuild2.state;

      if (!builder) return false;

      var jobs = state.getJobStates().map(function (jobState) {
        return _this4.syncJob(filePath, lineNumber, builder, jobState);
      });

      yield Promise.all(jobs);
    })
  }, {
    key: 'syncJob',
    value: _asyncToGenerator(function* (filePath, lineNumber, builder, jobState) {
      var outputFilePath = this.resolveOutputFilePath(builder, jobState);
      if (!outputFilePath) {
        latex.log.warning('Could not resolve path to output file associated with the current file.');
        return;
      }

      yield latex.opener.open(outputFilePath, filePath, lineNumber);
    })
  }, {
    key: 'clean',
    value: _asyncToGenerator(function* () {
      var _this5 = this;

      var _getEditorDetails3 = (0, _werkzeug.getEditorDetails)();

      var filePath = _getEditorDetails3.filePath;

      if (!filePath || !this.isTexFile(filePath)) {
        return false;
      }

      var _initializeBuild3 = this.initializeBuild(filePath, true);

      var builder = _initializeBuild3.builder;
      var state = _initializeBuild3.state;

      if (!builder) return false;

      latex.log.group('LaTeX Clean');

      var jobs = state.getJobStates().map(function (jobState) {
        return _this5.cleanJob(builder, jobState);
      });

      yield Promise.all(jobs);

      latex.log.groupEnd();
    })
  }, {
    key: 'cleanJob',
    value: _asyncToGenerator(function* (builder, jobState) {
      var generatedFiles = this.getGeneratedFileList(builder, jobState);
      var files = new Set();

      var patterns = this.getCleanPatterns(builder, jobState);

      for (var pattern of patterns) {
        // If the original pattern is absolute then we use it as a globbing pattern
        // after we join it to the root, otherwise we use it against the list of
        // generated files.
        if (pattern[0] === _path2['default'].sep) {
          var absolutePattern = _path2['default'].join(jobState.getProjectPath(), pattern);
          for (var file of _glob2['default'].sync(absolutePattern)) {
            files.add(_path2['default'].normalize(file));
          }
        } else {
          for (var file of generatedFiles.values()) {
            if ((0, _minimatch2['default'])(file, pattern)) {
              files.add(file);
            }
          }
        }
      }

      var fileNames = Array.from(files.values()).map(function (file) {
        return _path2['default'].basename(file);
      }).join(', ');
      latex.log.info('Cleaned: ' + fileNames);

      for (var file of files.values()) {
        _fsPlus2['default'].removeSync(file);
      }
    })
  }, {
    key: 'getCleanPatterns',
    value: function getCleanPatterns(builder, jobState) {
      var _path$parse2 = _path2['default'].parse(jobState.getFilePath());

      var name = _path$parse2.name;
      var ext = _path$parse2.ext;

      var outputDirectory = jobState.getOutputDirectory();
      var properties = {
        output_dir: outputDirectory ? outputDirectory + _path2['default'].sep : '',
        jobname: jobState.getJobName() || name,
        name: name,
        ext: ext
      };
      var patterns = jobState.getCleanPatterns();

      return patterns.map(function (pattern) {
        return _path2['default'].normalize((0, _werkzeug.replacePropertiesInString)(pattern, properties));
      });
    }
  }, {
    key: 'getGeneratedFileList',
    value: function getGeneratedFileList(builder, jobState) {
      var _path$parse3 = _path2['default'].parse(jobState.getFilePath());

      var dir = _path$parse3.dir;
      var name = _path$parse3.name;

      if (!jobState.getFileDatabase()) {
        builder.parseLogAndFdbFiles(jobState);
      }

      var pattern = _path2['default'].resolve(dir, jobState.getOutputDirectory(), (jobState.getJobName() || name) + '*');
      var files = new Set(_glob2['default'].sync(pattern));
      var fdb = jobState.getFileDatabase();

      if (fdb) {
        var generatedFiles = _lodash2['default'].flatten(_lodash2['default'].map(fdb, function (section) {
          return section.generated || [];
        }));

        for (var file of generatedFiles) {
          files.add(_path2['default'].resolve(dir, file));
        }
      }

      return files;
    }
  }, {
    key: 'moveResult',
    value: function moveResult(jobState) {
      var originalOutputFilePath = jobState.getOutputFilePath();
      var newOutputFilePath = this.alterParentPath(jobState.getFilePath(), originalOutputFilePath);
      jobState.setOutputFilePath(newOutputFilePath);
      if (_fsPlus2['default'].existsSync(originalOutputFilePath)) {
        _fsPlus2['default'].removeSync(newOutputFilePath);
        _fsPlus2['default'].moveSync(originalOutputFilePath, newOutputFilePath);
      }

      var originalSyncFilePath = originalOutputFilePath.replace(/\.pdf$/, '.synctex.gz');
      if (_fsPlus2['default'].existsSync(originalSyncFilePath)) {
        var syncFilePath = this.alterParentPath(jobState.getFilePath(), originalSyncFilePath);
        _fsPlus2['default'].removeSync(syncFilePath);
        _fsPlus2['default'].moveSync(originalSyncFilePath, syncFilePath);
      }
    }
  }, {
    key: 'resolveOutputFilePath',
    value: function resolveOutputFilePath(builder, jobState) {
      var outputFilePath = jobState.getOutputFilePath();
      if (outputFilePath) {
        return outputFilePath;
      }

      builder.parseLogAndFdbFiles(jobState);
      outputFilePath = jobState.getOutputFilePath();
      if (!outputFilePath) {
        latex.log.warning('Log file parsing failed!');
        return null;
      }

      if (this.shouldMoveResult(jobState)) {
        outputFilePath = this.alterParentPath(jobState.getFilePath(), outputFilePath);
        jobState.setOutputFilePath(outputFilePath);
      }

      return outputFilePath;
    }
  }, {
    key: 'showResult',
    value: _asyncToGenerator(function* (jobState) {
      if (!this.shouldOpenResult()) {
        return;
      }

      var _getEditorDetails4 = (0, _werkzeug.getEditorDetails)();

      var filePath = _getEditorDetails4.filePath;
      var lineNumber = _getEditorDetails4.lineNumber;

      yield latex.opener.open(jobState.getOutputFilePath(), filePath, lineNumber);
    })
  }, {
    key: 'showError',
    value: function showError(jobState) {
      if (!jobState.getLogMessages()) {
        latex.log.error('Parsing of log files failed.');
      } else if (!jobState.getOutputFilePath()) {
        latex.log.error('No output file detected.');
      }
    }
  }, {
    key: 'isTexFile',
    value: function isTexFile(filePath) {
      // TODO: Improve will suffice for the time being.
      return !filePath || filePath.search(/\.(tex|lhs|[rs]nw)$/i) > 0;
    }
  }, {
    key: 'alterParentPath',
    value: function alterParentPath(targetPath, originalPath) {
      var targetDir = _path2['default'].dirname(targetPath);
      return _path2['default'].join(targetDir, _path2['default'].basename(originalPath));
    }
  }, {
    key: 'shouldMoveResult',
    value: function shouldMoveResult(jobState) {
      return jobState.getMoveResultToSourceDirectory() && jobState.getOutputDirectory().length > 0;
    }
  }, {
    key: 'shouldOpenResult',
    value: function shouldOpenResult() {
      return atom.config.get('latex.openResultAfterBuild');
    }
  }]);

  return Composer;
})(_atom.Disposable);

exports['default'] = Composer;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2JpbGx5Ly5hdG9tL3BhY2thZ2VzL2xhdGV4L2xpYi9jb21wb3Nlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7c0JBRWMsUUFBUTs7OztzQkFDUCxTQUFTOzs7O29CQUNQLE1BQU07Ozs7d0JBQ3FDLFlBQVk7O3lCQUNsRCxXQUFXOzs7O29CQUNoQixNQUFNOzs7O3NCQUNOLFNBQVM7Ozs7b0JBQ3NCLE1BQU07OzBCQUMvQixlQUFlOzs7O2tDQUNkLHdCQUF3Qjs7OztJQUUzQixRQUFRO1lBQVIsUUFBUTs7QUFJZixXQUpPLFFBQVEsR0FJWjs7OzBCQUpJLFFBQVE7O0FBS3pCLCtCQUxpQixRQUFRLDZDQUtuQjthQUFNLE1BQUssV0FBVyxDQUFDLE9BQU8sRUFBRTtLQUFBLEVBQUM7U0FKekMsV0FBVyxHQUFHLCtCQUF5QjtTQUN2QyxpQkFBaUIsR0FBRyxJQUFJLEdBQUcsRUFBRTs7OztBQUkzQixRQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxPQUFPLEVBQUUsWUFBTTtBQUMxRCxhQUFLLGdCQUFnQixHQUFHLElBQUksR0FBRyxFQUFFLENBQUE7S0FDbEMsQ0FBQyxDQUFDLENBQUE7R0FDSjs7ZUFUa0IsUUFBUTs7V0FXWCx5QkFBQyxRQUFRLEVBQXVCO1VBQXJCLFdBQVcseURBQUcsS0FBSzs7QUFDNUMsVUFBSSxLQUFLLFlBQUEsQ0FBQTs7QUFFVCxVQUFJLFdBQVcsSUFBSSxJQUFJLENBQUMsaUJBQWlCLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxFQUFFO0FBQ3ZELGFBQUssR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFBO09BQzdDLE1BQU07QUFDTCxhQUFLLEdBQUcsNEJBQWUsUUFBUSxDQUFDLENBQUE7QUFDaEMsWUFBSSxDQUFDLDhCQUE4QixDQUFDLEtBQUssQ0FBQyxDQUFBO0FBQzFD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Q0Y7OztXQUVTLG1CQUFDLFFBQVEsRUFBRTs7QUFFbkIsYUFBTyxDQUFDLFFBQVEsSUFBSSxRQUFRLENBQUMsTUFBTSxDQUFDLHNCQUFzQixDQUFDLEdBQUcsQ0FBQyxDQUFBO0tBQ2hFOzs7V0FFZSx5QkFBQyxVQUFVLEVBQUUsWUFBWSxFQUFFO0FBQ3pDLFVBQU0sU0FBUyxHQUFHLGtCQUFLLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQTtBQUMxQyxhQUFPLGtCQUFLLElBQUksQ0FBQyxTQUFTLEVBQUUsa0JBQUssUUFBUSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUE7S0FDekQ7OztXQUVnQiwwQkFBQyxRQUFRLEVBQUU7QUFDMUIsYUFBTyxRQUFRLENBQUMsOEJBQThCLEVBQUUsSUFBSSxRQUFRLENBQUMsa0JBQWtCLEVBQUUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFBO0tBQzdGOzs7V0FFZ0IsNEJBQUc7QUFBRSxhQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLDRCQUE0QixDQUFDLENBQUE7S0FBRTs7O1NBall6RCxRQUFROzs7cUJBQVIsUUFBUSIsImZpbGUiOiIvaG9tZS9iaWxseS8uYXRvbS9wYWNrYWdlcy9sYXRleC9saWIvY29tcG9zZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiogQGJhYmVsICovXG5cbmltcG9ydCBfIGZyb20gJ2xvZGFzaCdcbmltcG9ydCBmcyBmcm9tICdmcy1wbHVzJ1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcbmltcG9ydCB7IGdldEVkaXRvckRldGFpbHMsIHJlcGxhY2VQcm9wZXJ0aWVzSW5TdHJpbmcgfSBmcm9tICcuL3dlcmt6ZXVnJ1xuaW1wb3J0IG1pbmltYXRjaCBmcm9tICdtaW5pbWF0Y2gnXG5pbXBvcnQgZ2xvYiBmcm9tICdnbG9iJ1xuaW1wb3J0IHlhbWwgZnJvbSAnanMteWFtbCdcbmltcG9ydCB7IENvbXBvc2l0ZURpc3Bvc2FibGUsIERpc3Bvc2FibGUgfSBmcm9tICdhdG9tJ1xuaW1wb3J0IEJ1aWxkU3RhdGUgZnJvbSAnLi9idWlsZC1zdGF0ZSdcbmltcG9ydCBNYWdpY1BhcnNlciBmcm9tICcuL3BhcnNlcnMvbWFnaWMtcGFyc2VyJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb21wb3NlciBleHRlbmRzIERpc3Bvc2FibGUge1xuICBkaXNwb3NhYmxlcyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcbiAgY2FjaGVkQnVpbGRTdGF0ZXMgPSBuZXcgTWFwKClcblxuICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgc3VwZXIoKCkgPT4gdGhpcy5kaXNwb3NhYmxlcy5kaXNwb3NlKCkpXG4gICAgdGhpcy5kaXNwb3NhYmxlcy5hZGQoYXRvbS5jb25maWcub25EaWRDaGFuZ2UoJ2xhdGV4JywgKCkgPT4ge1xuICAgICAgdGhpcy5yZWJ1aWxkQ29tcGxldGVkID0gbmV3IFNldCgpXG4gICAgfSkpXG4gIH1cblxuICBpbml0aWFsaXplQnVpbGQgKGZpbGVQYXRoLCBhbGxvd0NhY2hlZCA9IGZhbHNlKSB7XG4gICAgbGV0IHN0YXRlXG5cbiAgICBpZiAoYWxsb3dDYWNoZWQgJiYgdGhpcy5jYWNoZWRCdWlsZFN0YXRlcy5oYXMoZmlsZVBhdGgpKSB7XG4gICAgICBzdGF0ZSA9IHRoaXMuY2FjaGVkQnVpbGRTdGF0ZXMuZ2V0KGZpbGVQYXRoKVxuICAgIH0gZWxzZSB7XG4gICAgICBzdGF0ZSA9IG5ldyBCdWlsZFN0YXRlKGZpbGVQYXRoKVxuICAgICAgdGhpcy5pbml0aWFsaXplQnVpbGRTdGF0ZUZyb21Db25maWcoc3RhdGUpXG4gICAgICB0aGlzLmluaXRpYWxpemVCdWlsZFN0YXRlRnJvbU1hZ2ljKHN0YXRlKVxuICAgICAgdGhpcy5pbml0aWFsaXplQnVpbGRTdGF0ZUZyb21TZXR0aW5nc0ZpbGUoc3RhdGUpXG4gICAgICAvLyBDaGVjayBhZ2FpbiBpbiBjYXNlIHRoZXJlIHdhcyBhIHJvb3QgY29tbWVudFxuICAgICAgY29uc3QgbWFzdGVyRmlsZVBhdGggPSBzdGF0ZS5nZXRGaWxlUGF0aCgpXG4gICAgICBpZiAoZmlsZVBhdGggIT09IG1hc3RlckZpbGVQYXRoKSB7XG4gICAgICAgIGlmIChhbGxvd0NhY2hlZCAmJiB0aGlzLmNhY2hlZEJ1aWxkU3RhdGVzLmhhcyhtYXN0ZXJGaWxlUGF0aCkpIHtcbiAgICAgICAgICBzdGF0ZSA9IHRoaXMuY2FjaGVkQnVpbGRTdGF0ZXMuZ2V0KG1hc3RlckZpbGVQYXRoKVxuICAgICAgICB9XG4gICAgICAgIHN0YXRlLmFkZFN1YmZpbGUoZmlsZVBhdGgpXG4gICAgICB9XG4gICAgICB0aGlzLmNhY2hlQnVpbGRTdGF0ZShzdGF0ZSlcbiAgICB9XG5cbiAgICBjb25zdCBidWlsZGVyID0gbGF0ZXguYnVpbGRlclJlZ2lzdHJ5LmdldEJ1aWxkZXIoc3RhdGUpXG4gICAgaWYgKCFidWlsZGVyKSB7XG4gICAgICBsYXRleC5sb2cud2FybmluZyhgTm8gcmVnaXN0ZXJlZCBMYVRlWCBidWlsZGVyIGNhbiBwcm9jZXNzICR7c3RhdGUuZ2V0RmlsZVBhdGgoKX0uYClcbiAgICAgIHJldHVybiBzdGF0ZVxuICAgIH1cblxuICAgIHJldHVybiB7IHN0YXRlLCBidWlsZGVyIH1cbiAgfVxuXG4gIGNhY2hlQnVpbGRTdGF0ZSAoc3RhdGUpIHtcbiAgICBjb25zdCBmaWxlUGF0aCA9IHN0YXRlLmdldEZpbGVQYXRoKClcbiAgICBpZiAodGhpcy5jYWNoZWRCdWlsZFN0YXRlcy5oYXMoZmlsZVBhdGgpKSB7XG4gICAgICBjb25zdCBvbGRTdGF0ZSA9IHRoaXMuY2FjaGVkQnVpbGRTdGF0ZXMuZ2V0KGZpbGVQYXRoKVxuICAgICAgZm9yIChjb25zdCBzdWJmaWxlIG9mIG9sZFN0YXRlLmdldFN1YmZpbGVzKCkpIHtcbiAgICAgICAgdGhpcy5jYWNoZWRCdWlsZFN0YXRlcy5kZWxldGUoc3ViZmlsZSlcbiAgICAgIH1cbiAgICAgIHRoaXMuY2FjaGVkQnVpbGRTdGF0ZXMuZGVsZXRlKGZpbGVQYXRoKVxuICAgIH1cblxuICAgIHRoaXMuY2FjaGVkQnVpbGRTdGF0ZXMuc2V0KGZpbGVQYXRoLCBzdGF0ZSlcbiAgICBmb3IgKGNvbnN0IHN1YmZpbGUgb2Ygc3RhdGUuZ2V0U3ViZmlsZXMoKSkge1xuICAgICAgdGhpcy5jYWNoZWRCdWlsZFN0YXRlcy5zZXQoc3ViZmlsZSwgc3RhdGUpXG4gICAgfVxuICB9XG5cbiAgaW5pdGlhbGl6ZUJ1aWxkU3RhdGVGcm9tQ29uZmlnIChzdGF0ZSkge1xuICAgIHRoaXMuaW5pdGlhbGl6ZUJ1aWxkU3RhdGVGcm9tUHJvcGVydGllcyhzdGF0ZSwgYXRvbS5jb25maWcuZ2V0KCdsYXRleCcpKVxuICB9XG5cbiAgaW5pdGlhbGl6ZUJ1aWxkU3RhdGVGcm9tUHJvcGVydGllcyAoc3RhdGUsIHByb3BlcnRpZXMpIHtcbiAgICBpZiAoIXByb3BlcnRpZXMpIHJldHVyblxuXG4gICAgaWYgKHByb3BlcnRpZXMuY2xlYW5QYXR0ZXJucykge1xuICAgICAgc3RhdGUuc2V0Q2xlYW5QYXR0ZXJucyhwcm9wZXJ0aWVzLmNsZWFuUGF0dGVybnMpXG4gICAgfVxuXG4gICAgaWYgKCdlbmFibGVTeW5jdGV4JyBpbiBwcm9wZXJ0aWVzKSB7XG4gICAgICBzdGF0ZS5zZXRFbmFibGVTeW5jdGV4KHByb3BlcnRpZXMuZW5hYmxlU3luY3RleClcbiAgICB9XG5cbiAgICBpZiAoJ2VuYWJsZVNoZWxsRXNjYXBlJyBpbiBwcm9wZXJ0aWVzKSB7XG4gICAgICBzdGF0ZS5zZXRFbmFibGVTaGVsbEVzY2FwZShwcm9wZXJ0aWVzLmVuYWJsZVNoZWxsRXNjYXBlKVxuICAgIH1cblxuICAgIGlmICgnZW5hYmxlRXh0ZW5kZWRCdWlsZE1vZGUnIGluIHByb3BlcnRpZXMpIHtcbiAgICAgIHN0YXRlLnNldEVuYWJsZUV4dGVuZGVkQnVpbGRNb2RlKHByb3BlcnRpZXMuZW5hYmxlRXh0ZW5kZWRCdWlsZE1vZGUpXG4gICAgfVxuXG4gICAgaWYgKHByb3BlcnRpZXMuam9iTmFtZXMpIHtcbiAgICAgIHN0YXRlLnNldEpvYk5hbWVzKHByb3BlcnRpZXMuam9iTmFtZXMpXG4gICAgfSBlbHNlIGlmIChwcm9wZXJ0aWVzLmpvYm5hbWVzKSB7XG4gICAgICAvLyBqb2JuYW1lcyBpcyBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG1hZ2ljIGNvbW1lbnRzXG4gICAgICBzdGF0ZS5zZXRKb2JOYW1lcyhwcm9wZXJ0aWVzLmpvYm5hbWVzKVxuICAgIH0gZWxzZSBpZiAocHJvcGVydGllcy5qb2JuYW1lKSB7XG4gICAgICAvLyBqb2JuYW1lIGlzIGZvciBjb21wYXRpYmlsaXR5IHdpdGggU3VibGltZVxuICAgICAgc3RhdGUuc2V0Sm9iTmFtZXMoW3Byb3BlcnRpZXMuam9ibmFtZV0pXG4gICAgfVxuXG4gICAgaWYgKHByb3BlcnRpZXMuY3VzdG9tRW5naW5lKSB7XG4gICAgICBzdGF0ZS5zZXRFbmdpbmUocHJvcGVydGllcy5jdXN0b21FbmdpbmUpXG4gICAgfSBlbHNlIGlmIChwcm9wZXJ0aWVzLmVuZ2luZSkge1xuICAgICAgc3RhdGUuc2V0RW5naW5lKHByb3BlcnRpZXMuZW5naW5lKVxuICAgIH0gZWxzZSBpZiAocHJvcGVydGllcy5wcm9ncmFtKSB7XG4gICAgICAvLyBwcm9ncmFtIGlzIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbWFnaWMgY29tbWVudHNcbiAgICAgIHN0YXRlLnNldEVuZ2luZShwcm9wZXJ0aWVzLnByb2dyYW0pXG4gICAgfVxuXG4gICAgaWYgKCdtb3ZlUmVzdWx0VG9Tb3VyY2VEaXJlY3RvcnknIGluIHByb3BlcnRpZXMpIHtcbiAgICAgIHN0YXRlLnNldE1vdmVSZXN1bHRUb1NvdXJjZURpcmVjdG9yeShwcm9wZXJ0aWVzLm1vdmVSZXN1bHRUb1NvdXJjZURpcmVjdG9yeSlcbiAgICB9XG5cbiAgICBpZiAocHJvcGVydGllcy5vdXRwdXRGb3JtYXQpIHtcbiAgICAgIHN0YXRlLnNldE91dHB1dEZvcm1hdChwcm9wZXJ0aWVzLm91dHB1dEZvcm1hdClcbiAgICB9IGVsc2UgaWYgKHByb3BlcnRpZXMuZm9ybWF0KSB7XG4gICAgICAvLyBmb3JtYXQgaXMgZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBtYWdpYyBjb21tZW50c1xuICAgICAgc3RhdGUuc2V0T3V0cHV0Rm9ybWF0KHByb3BlcnRpZXMuZm9ybWF0KVxuICAgIH1cblxuICAgIGlmICgnb3V0cHV0RGlyZWN0b3J5JyBpbiBwcm9wZXJ0aWVzKSB7XG4gICAgICBzdGF0ZS5zZXRPdXRwdXREaXJlY3RvcnkocHJvcGVydGllcy5vdXRwdXREaXJlY3RvcnkpXG4gICAgfSBlbHNlIGlmICgnb3V0cHV0X2RpcmVjdG9yeScgaW4gcHJvcGVydGllcykge1xuICAgICAgLy8gb3V0cHV0X2RpcmVjdG9yeSBpcyBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIFN1YmxpbWVcbiAgICAgIHN0YXRlLnNldE91dHB1dERpcmVjdG9yeShwcm9wZXJ0aWVzLm91dHB1dF9kaXJlY3RvcnkpXG4gICAgfVxuXG4gICAgaWYgKHByb3BlcnRpZXMucHJvZHVjZXIpIHtcbiAgICAgIHN0YXRlLnNldFByb2R1Y2VyKHByb3BlcnRpZXMucHJvZHVjZXIpXG4gICAgfVxuICB9XG5cbiAgaW5pdGlhbGl6ZUJ1aWxkU3RhdGVGcm9tTWFnaWMgKHN0YXRlKSB7XG4gICAgbGV0IG1hZ2ljID0gdGhpcy5nZXRNYWdpYyhzdGF0ZSlcblxuICAgIGlmIChtYWdpYy5yb290KSB7XG4gICAgICBzdGF0ZS5zZXRGaWxlUGF0aChwYXRoLnJlc29sdmUoc3RhdGUuZ2V0UHJvamVjdFBhdGgoKSwgbWFnaWMucm9vdCkpXG4gICAgICBtYWdpYyA9IHRoaXMuZ2V0TWFnaWMoc3RhdGUpXG4gICAgfVxuXG4gICAgdGhpcy5pbml0aWFsaXplQnVpbGRTdGF0ZUZyb21Qcm9wZXJ0aWVzKHN0YXRlLCBtYWdpYylcbiAgfVxuXG4gIGdldE1hZ2ljIChzdGF0ZSkge1xuICAgIHJldHVybiBuZXcgTWFnaWNQYXJzZXIoc3RhdGUuZ2V0RmlsZVBhdGgoKSkucGFyc2UoKVxuICB9XG5cbiAgaW5pdGlhbGl6ZUJ1aWxkU3RhdGVGcm9tU2V0dGluZ3NGaWxlIChzdGF0ZSkge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCB7IGRpciwgbmFtZSB9ID0gcGF0aC5wYXJzZShzdGF0ZS5nZXRGaWxlUGF0aCgpKVxuICAgICAgY29uc3QgZmlsZVBhdGggPSBwYXRoLmZvcm1hdCh7IGRpciwgbmFtZSwgZXh0OiAnLnlhbWwnIH0pXG5cbiAgICAgIGlmIChmcy5leGlzdHNTeW5jKGZpbGVQYXRoKSkge1xuICAgICAgICBjb25zdCBjb25maWcgPSB5YW1sLnNhZmVMb2FkKGZzLnJlYWRGaWxlU3luYyhmaWxlUGF0aCkpXG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZUJ1aWxkU3RhdGVGcm9tUHJvcGVydGllcyhzdGF0ZSwgY29uZmlnKVxuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBsYXRleC5sb2cuZXJyb3IoYFBhcnNpbmcgb2YgcHJvamVjdCBmaWxlIGZhaWxlZDogJHtlcnJvci5tZXNzYWdlfWApXG4gICAgfVxuICB9XG5cbiAgYXN5bmMgYnVpbGQgKHNob3VsZFJlYnVpbGQpIHtcbiAgICBsYXRleC5wcm9jZXNzLmtpbGxDaGlsZFByb2Nlc3NlcygpXG5cbiAgICBjb25zdCB7IGVkaXRvciwgZmlsZVBhdGggfSA9IGdldEVkaXRvckRldGFpbHMoKVxuXG4gICAgaWYgKCFmaWxlUGF0aCkge1xuICAgICAgbGF0ZXgubG9nLndhcm5pbmcoJ0ZpbGUgbmVlZHMgdG8gYmUgc2F2ZWQgdG8gZGlzayBiZWZvcmUgaXQgY2FuIGJlIFRlWGlmaWVkLicpXG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG5cbiAgICBpZiAoZWRpdG9yLmlzTW9kaWZpZWQoKSkge1xuICAgICAgZWRpdG9yLnNhdmUoKSAvLyBUT0RPOiBNYWtlIHRoaXMgY29uZmlndXJhYmxlP1xuICAgIH1cblxuICAgIGNvbnN0IHsgYnVpbGRlciwgc3RhdGUgfSA9IHRoaXMuaW5pdGlhbGl6ZUJ1aWxkKGZpbGVQYXRoKVxuICAgIGlmICghYnVpbGRlcikgcmV0dXJuIGZhbHNlXG4gICAgc3RhdGUuc2V0U2hvdWxkUmVidWlsZChzaG91bGRSZWJ1aWxkKVxuXG4gICAgaWYgKHRoaXMucmVidWlsZENvbXBsZXRlZCAmJiAhdGhpcy5yZWJ1aWxkQ29tcGxldGVkLmhhcyhzdGF0ZS5nZXRGaWxlUGF0aCgpKSkge1xuICAgICAgc3RhdGUuc2V0U2hvdWxkUmVidWlsZCh0cnVlKVxuICAgICAgdGhpcy5yZWJ1aWxkQ29tcGxldGVkLmFkZChzdGF0ZS5nZXRGaWxlUGF0aCgpKVxuICAgIH1cblxuICAgIGNvbnN0IGxhYmVsID0gc3RhdGUuZ2V0U2hvdWxkUmVidWlsZCgpID8gJ0xhVGVYIFJlYnVpbGQnIDogJ0xhVGVYIEJ1aWxkJ1xuXG4gICAgbGF0ZXguc3RhdHVzLnNob3cobGFiZWwsICdoaWdobGlnaHQnLCAnc3luYycsIHRydWUsICdDbGljayB0byBraWxsIExhVGVYIGJ1aWxkLicsICgpID0+IGxhdGV4LnByb2Nlc3Mua2lsbENoaWxkUHJvY2Vzc2VzKCkpXG4gICAgbGF0ZXgubG9nLmdyb3VwKGxhYmVsKVxuXG4gICAgY29uc3Qgam9icyA9IHN0YXRlLmdldEpvYlN0YXRlcygpLm1hcChqb2JTdGF0ZSA9PiB0aGlzLmJ1aWxkSm9iKGJ1aWxkZXIsIGpvYlN0YXRlKSlcblxuICAgIGF3YWl0IFByb21pc2UuYWxsKGpvYnMpXG5cbiAgICBsYXRleC5sb2cuZ3JvdXBFbmQoKVxuICB9XG5cbiAgYXN5bmMgYnVpbGRKb2IgKGJ1aWxkZXIsIGpvYlN0YXRlKSB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHN0YXR1c0NvZGUgPSBhd2FpdCBidWlsZGVyLnJ1bihqb2JTdGF0ZSlcbiAgICAgIGJ1aWxkZXIucGFyc2VMb2dBbmRGZGJGaWxlcyhqb2JTdGF0ZSlcblxuICAgICAgY29uc3QgbWVzc2FnZXMgPSBqb2JTdGF0ZS5nZXRMb2dNZXNzYWdlcygpIHx8IFtdXG4gICAgICBmb3IgKGNvbnN0IG1lc3NhZ2Ugb2YgbWVzc2FnZXMpIHtcbiAgICAgICAgbGF0ZXgubG9nLnNob3dNZXNzYWdlKG1lc3NhZ2UpXG4gICAgICB9XG5cbiAgICAgIGlmIChzdGF0dXNDb2RlID4gMCB8fCAham9iU3RhdGUuZ2V0TG9nTWVzc2FnZXMoKSB8fCAham9iU3RhdGUuZ2V0T3V0cHV0RmlsZVBhdGgoKSkge1xuICAgICAgICB0aGlzLnNob3dFcnJvcihqb2JTdGF0ZSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICh0aGlzLnNob3VsZE1vdmVSZXN1bHQoam9iU3RhdGUpKSB7XG4gICAgICAgICAgdGhpcy5tb3ZlUmVzdWx0KGpvYlN0YXRlKVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2hvd1Jlc3VsdChqb2JTdGF0ZSlcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgbGF0ZXgubG9nLmVycm9yKGVycm9yLm1lc3NhZ2UpXG4gICAgfVxuICB9XG5cbiAgYXN5bmMgc3luYyAoKSB7XG4gICAgY29uc3QgeyBmaWxlUGF0aCwgbGluZU51bWJlciB9ID0gZ2V0RWRpdG9yRGV0YWlscygpXG4gICAgaWYgKCFmaWxlUGF0aCB8fCAhdGhpcy5pc1RleEZpbGUoZmlsZVBhdGgpKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBjb25zdCB7IGJ1aWxkZXIsIHN0YXRlIH0gPSB0aGlzLmluaXRpYWxpemVCdWlsZChmaWxlUGF0aCwgdHJ1ZSlcbiAgICBpZiAoIWJ1aWxkZXIpIHJldHVybiBmYWxzZVxuXG4gICAgY29uc3Qgam9icyA9IHN0YXRlLmdldEpvYlN0YXRlcygpLm1hcChqb2JTdGF0ZSA9PiB0aGlzLnN5bmNKb2IoZmlsZVBhdGgsIGxpbmVOdW1iZXIsIGJ1aWxkZXIsIGpvYlN0YXRlKSlcblxuICAgIGF3YWl0IFByb21pc2UuYWxsKGpvYnMpXG4gIH1cblxuICBhc3luYyBzeW5jSm9iIChmaWxlUGF0aCwgbGluZU51bWJlciwgYnVpbGRlciwgam9iU3RhdGUpIHtcbiAgICBjb25zdCBvdXRwdXRGaWxlUGF0aCA9IHRoaXMucmVzb2x2ZU91dHB1dEZpbGVQYXRoKGJ1aWxkZXIsIGpvYlN0YXRlKVxuICAgIGlmICghb3V0cHV0RmlsZVBhdGgpIHtcbiAgICAgIGxhdGV4LmxvZy53YXJuaW5nKCdDb3VsZCBub3QgcmVzb2x2ZSBwYXRoIHRvIG91dHB1dCBmaWxlIGFzc29jaWF0ZWQgd2l0aCB0aGUgY3VycmVudCBmaWxlLicpXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBhd2FpdCBsYXRleC5vcGVuZXIub3BlbihvdXRwdXRGaWxlUGF0aCwgZmlsZVBhdGgsIGxpbmVOdW1iZXIpXG4gIH1cblxuICBhc3luYyBjbGVhbiAoKSB7XG4gICAgY29uc3QgeyBmaWxlUGF0aCB9ID0gZ2V0RWRpdG9yRGV0YWlscygpXG4gICAgaWYgKCFmaWxlUGF0aCB8fCAhdGhpcy5pc1RleEZpbGUoZmlsZVBhdGgpKSB7XG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG5cbiAgICBjb25zdCB7IGJ1aWxkZXIsIHN0YXRlIH0gPSB0aGlzLmluaXRpYWxpemVCdWlsZChmaWxlUGF0aCwgdHJ1ZSlcbiAgICBpZiAoIWJ1aWxkZXIpIHJldHVybiBmYWxzZVxuXG4gICAgbGF0ZXgubG9nLmdyb3VwKCdMYVRlWCBDbGVhbicpXG5cbiAgICBjb25zdCBqb2JzID0gc3RhdGUuZ2V0Sm9iU3RhdGVzKCkubWFwKGpvYlN0YXRlID0+IHRoaXMuY2xlYW5Kb2IoYnVpbGRlciwgam9iU3RhdGUpKVxuXG4gICAgYXdhaXQgUHJvbWlzZS5hbGwoam9icylcblxuICAgIGxhdGV4LmxvZy5ncm91cEVuZCgpXG4gIH1cblxuICBhc3luYyBjbGVhbkpvYiAoYnVpbGRlciwgam9iU3RhdGUpIHtcbiAgICBjb25zdCBnZW5lcmF0ZWRGaWxlcyA9IHRoaXMuZ2V0R2VuZXJhdGVkRmlsZUxpc3QoYnVpbGRlciwgam9iU3RhdGUpXG4gICAgbGV0IGZpbGVzID0gbmV3IFNldCgpXG5cbiAgICBjb25zdCBwYXR0ZXJucyA9IHRoaXMuZ2V0Q2xlYW5QYXR0ZXJucyhidWlsZGVyLCBqb2JTdGF0ZSlcblxuICAgIGZvciAoY29uc3QgcGF0dGVybiBvZiBwYXR0ZXJucykge1xuICAgICAgLy8gSWYgdGhlIG9yaWdpbmFsIHBhdHRlcm4gaXMgYWJzb2x1dGUgdGhlbiB3ZSB1c2UgaXQgYXMgYSBnbG9iYmluZyBwYXR0ZXJuXG4gICAgICAvLyBhZnRlciB3ZSBqb2luIGl0IHRvIHRoZSByb290LCBvdGhlcndpc2Ugd2UgdXNlIGl0IGFnYWluc3QgdGhlIGxpc3Qgb2ZcbiAgICAgIC8vIGdlbmVyYXRlZCBmaWxlcy5cbiAgICAgIGlmIChwYXR0ZXJuWzBdID09PSBwYXRoLnNlcCkge1xuICAgICAgICBjb25zdCBhYnNvbHV0ZVBhdHRlcm4gPSBwYXRoLmpvaW4oam9iU3RhdGUuZ2V0UHJvamVjdFBhdGgoKSwgcGF0dGVybilcbiAgICAgICAgZm9yIChjb25zdCBmaWxlIG9mIGdsb2Iuc3luYyhhYnNvbHV0ZVBhdHRlcm4pKSB7XG4gICAgICAgICAgZmlsZXMuYWRkKHBhdGgubm9ybWFsaXplKGZpbGUpKVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmb3IgKGNvbnN0IGZpbGUgb2YgZ2VuZXJhdGVkRmlsZXMudmFsdWVzKCkpIHtcbiAgICAgICAgICBpZiAobWluaW1hdGNoKGZpbGUsIHBhdHRlcm4pKSB7XG4gICAgICAgICAgICBmaWxlcy5hZGQoZmlsZSlcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBmaWxlTmFtZXMgPSBBcnJheS5mcm9tKGZpbGVzLnZhbHVlcygpKS5tYXAoZmlsZSA9PiBwYXRoLmJhc2VuYW1lKGZpbGUpKS5qb2luKCcsICcpXG4gICAgbGF0ZXgubG9nLmluZm8oJ0NsZWFuZWQ6ICcgKyBmaWxlTmFtZXMpXG5cbiAgICBmb3IgKGNvbnN0IGZpbGUgb2YgZmlsZXMudmFsdWVzKCkpIHtcbiAgICAgIGZzLnJlbW92ZVN5bmMoZmlsZSlcbiAgICB9XG4gIH1cblxuICBnZXRDbGVhblBhdHRlcm5zIChidWlsZGVyLCBqb2JTdGF0ZSkge1xuICAgIGNvbnN0IHsgbmFtZSwgZXh0IH0gPSBwYXRoLnBhcnNlKGpvYlN0YXRlLmdldEZpbGVQYXRoKCkpXG4gICAgY29uc3Qgb3V0cHV0RGlyZWN0b3J5ID0gam9iU3RhdGUuZ2V0T3V0cHV0RGlyZWN0b3J5KClcbiAgICBjb25zdCBwcm9wZXJ0aWVzID0ge1xuICAgICAgb3V0cHV0X2Rpcjogb3V0cHV0RGlyZWN0b3J5ID8gb3V0cHV0RGlyZWN0b3J5ICsgcGF0aC5zZXAgOiAnJyxcbiAgICAgIGpvYm5hbWU6IGpvYlN0YXRlLmdldEpvYk5hbWUoKSB8fCBuYW1lLFxuICAgICAgbmFtZSxcbiAgICAgIGV4dFxuICAgIH1cbiAgICBjb25zdCBwYXR0ZXJucyA9IGpvYlN0YXRlLmdldENsZWFuUGF0dGVybnMoKVxuXG4gICAgcmV0dXJuIHBhdHRlcm5zLm1hcChwYXR0ZXJuID0+IHBhdGgubm9ybWFsaXplKHJlcGxhY2VQcm9wZXJ0aWVzSW5TdHJpbmcocGF0dGVybiwgcHJvcGVydGllcykpKVxuICB9XG5cbiAgZ2V0R2VuZXJhdGVkRmlsZUxpc3QgKGJ1aWxkZXIsIGpvYlN0YXRlKSB7XG4gICAgY29uc3QgeyBkaXIsIG5hbWUgfSA9IHBhdGgucGFyc2Uoam9iU3RhdGUuZ2V0RmlsZVBhdGgoKSlcbiAgICBpZiAoIWpvYlN0YXRlLmdldEZpbGVEYXRhYmFzZSgpKSB7XG4gICAgICBidWlsZGVyLnBhcnNlTG9nQW5kRmRiRmlsZXMoam9iU3RhdGUpXG4gICAgfVxuXG4gICAgY29uc3QgcGF0dGVybiA9IHBhdGgucmVzb2x2ZShkaXIsIGpvYlN0YXRlLmdldE91dHB1dERpcmVjdG9yeSgpLCBgJHtqb2JTdGF0ZS5nZXRKb2JOYW1lKCkgfHwgbmFtZX0qYClcbiAgICBjb25zdCBmaWxlcyA9IG5ldyBTZXQoZ2xvYi5zeW5jKHBhdHRlcm4pKVxuICAgIGNvbnN0IGZkYiA9IGpvYlN0YXRlLmdldEZpbGVEYXRhYmFzZSgpXG5cbiAgICBpZiAoZmRiKSB7XG4gICAgICBjb25zdCBnZW5lcmF0ZWRGaWxlcyA9IF8uZmxhdHRlbihfLm1hcChmZGIsIHNlY3Rpb24gPT4gc2VjdGlvbi5nZW5lcmF0ZWQgfHwgW10pKVxuXG4gICAgICBmb3IgKGNvbnN0IGZpbGUgb2YgZ2VuZXJhdGVkRmlsZXMpIHtcbiAgICAgICAgZmlsZXMuYWRkKHBhdGgucmVzb2x2ZShkaXIsIGZpbGUpKVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBmaWxlc1xuICB9XG5cbiAgbW92ZVJlc3VsdCAoam9iU3RhdGUpIHtcbiAgICBjb25zdCBvcmlnaW5hbE91dHB1dEZpbGVQYXRoID0gam9iU3RhdGUuZ2V0T3V0cHV0RmlsZVBhdGgoKVxuICAgIGNvbnN0IG5ld091dHB1dEZpbGVQYXRoID0gdGhpcy5hbHRlclBhcmVudFBhdGgoam9iU3RhdGUuZ2V0RmlsZVBhdGgoKSwgb3JpZ2luYWxPdXRwdXRGaWxlUGF0aClcbiAgICBqb2JTdGF0ZS5zZXRPdXRwdXRGaWxlUGF0aChuZXdPdXRwdXRGaWxlUGF0aClcbiAgICBpZiAoZnMuZXhpc3RzU3luYyhvcmlnaW5hbE91dHB1dEZpbGVQYXRoKSkge1xuICAgICAgZnMucmVtb3ZlU3luYyhuZXdPdXRwdXRGaWxlUGF0aClcbiAgICAgIGZzLm1vdmVTeW5jKG9yaWdpbmFsT3V0cHV0RmlsZVBhdGgsIG5ld091dHB1dEZpbGVQYXRoKVxuICAgIH1cblxuICAgIGNvbnN0IG9yaWdpbmFsU3luY0ZpbGVQYXRoID0gb3JpZ2luYWxPdXRwdXRGaWxlUGF0aC5yZXBsYWNlKC9cXC5wZGYkLywgJy5zeW5jdGV4Lmd6JylcbiAgICBpZiAoZnMuZXhpc3RzU3luYyhvcmlnaW5hbFN5bmNGaWxlUGF0aCkpIHtcbiAgICAgIGNvbnN0IHN5bmNGaWxlUGF0aCA9IHRoaXMuYWx0ZXJQYXJlbnRQYXRoKGpvYlN0YXRlLmdldEZpbGVQYXRoKCksIG9yaWdpbmFsU3luY0ZpbGVQYXRoKVxuICAgICAgZnMucmVtb3ZlU3luYyhzeW5jRmlsZVBhdGgpXG4gICAgICBmcy5tb3ZlU3luYyhvcmlnaW5hbFN5bmNGaWxlUGF0aCwgc3luY0ZpbGVQYXRoKVxuICAgIH1cbiAgfVxuXG4gIHJlc29sdmVPdXRwdXRGaWxlUGF0aCAoYnVpbGRlciwgam9iU3RhdGUpIHtcbiAgICBsZXQgb3V0cHV0RmlsZVBhdGggPSBqb2JTdGF0ZS5nZXRPdXRwdXRGaWxlUGF0aCgpXG4gICAgaWYgKG91dHB1dEZpbGVQYXRoKSB7XG4gICAgICByZXR1cm4gb3V0cHV0RmlsZVBhdGhcbiAgICB9XG5cbiAgICBidWlsZGVyLnBhcnNlTG9nQW5kRmRiRmlsZXMoam9iU3RhdGUpXG4gICAgb3V0cHV0RmlsZVBhdGggPSBqb2JTdGF0ZS5nZXRPdXRwdXRGaWxlUGF0aCgpXG4gICAgaWYgKCFvdXRwdXRGaWxlUGF0aCkge1xuICAgICAgbGF0ZXgubG9nLndhcm5pbmcoJ0xvZyBmaWxlIHBhcnNpbmcgZmFpbGVkIScpXG4gICAgICByZXR1cm4gbnVsbFxuICAgIH1cblxuICAgIGlmICh0aGlzLnNob3VsZE1vdmVSZXN1bHQoam9iU3RhdGUpKSB7XG4gICAgICBvdXRwdXRGaWxlUGF0aCA9IHRoaXMuYWx0ZXJQYXJlbnRQYXRoKGpvYlN0YXRlLmdldEZpbGVQYXRoKCksIG91dHB1dEZpbGVQYXRoKVxuICAgICAgam9iU3RhdGUuc2V0T3V0cHV0RmlsZVBhdGgob3V0cHV0RmlsZVBhdGgpXG4gICAgfVxuXG4gICAgcmV0dXJuIG91dHB1dEZpbGVQYXRoXG4gIH1cblxuICBhc3luYyBzaG93UmVzdWx0IChqb2JTdGF0ZSkge1xuICAgIGlmICghdGhpcy5zaG91bGRPcGVuUmVzdWx0KCkpIHsgcmV0dXJuIH1cblxuICAgIGNvbnN0IHsgZmlsZVBhdGgsIGxpbmVOdW1iZXIgfSA9IGdldEVkaXRvckRldGFpbHMoKVxuICAgIGF3YWl0IGxhdGV4Lm9wZW5lci5vcGVuKGpvYlN0YXRlLmdldE91dHB1dEZpbGVQYXRoKCksIGZpbGVQYXRoLCBsaW5lTnVtYmVyKVxuICB9XG5cbiAgc2hvd0Vycm9yIChqb2JTdGF0ZSkge1xuICAgIGlmICgham9iU3RhdGUuZ2V0TG9nTWVzc2FnZXMoKSkge1xuICAgICAgbGF0ZXgubG9nLmVycm9yKCdQYXJzaW5nIG9mIGxvZyBmaWxlcyBmYWlsZWQuJylcbiAgICB9IGVsc2UgaWYgKCFqb2JTdGF0ZS5nZXRPdXRwdXRGaWxlUGF0aCgpKSB7XG4gICAgICBsYXRleC5sb2cuZXJyb3IoJ05vIG91dHB1dCBmaWxlIGRldGVjdGVkLicpXG4gICAgfVxuICB9XG5cbiAgaXNUZXhGaWxlIChmaWxlUGF0aCkge1xuICAgIC8vIFRPRE86IEltcHJvdmUgd2lsbCBzdWZmaWNlIGZvciB0aGUgdGltZSBiZWluZy5cbiAgICByZXR1cm4gIWZpbGVQYXRoIHx8IGZpbGVQYXRoLnNlYXJjaCgvXFwuKHRleHxsaHN8W3JzXW53KSQvaSkgPiAwXG4gIH1cblxuICBhbHRlclBhcmVudFBhdGggKHRhcmdldFBhdGgsIG9yaWdpbmFsUGF0aCkge1xuICAgIGNvbnN0IHRhcmdldERpciA9IHBhdGguZGlybmFtZSh0YXJnZXRQYXRoKVxuICAgIHJldHVybiBwYXRoLmpvaW4odGFyZ2V0RGlyLCBwYXRoLmJhc2VuYW1lKG9yaWdpbmFsUGF0aCkpXG4gIH1cblxuICBzaG91bGRNb3ZlUmVzdWx0IChqb2JTdGF0ZSkge1xuICAgIHJldHVybiBqb2JTdGF0ZS5nZXRNb3ZlUmVzdWx0VG9Tb3VyY2VEaXJlY3RvcnkoKSAmJiBqb2JTdGF0ZS5nZXRPdXRwdXREaXJlY3RvcnkoKS5sZW5ndGggPiAwXG4gIH1cblxuICBzaG91bGRPcGVuUmVzdWx0ICgpIHsgcmV0dXJuIGF0b20uY29uZmlnLmdldCgnbGF0ZXgub3BlblJlc3VsdEFmdGVyQnVpbGQnKSB9XG59XG4iXX0=