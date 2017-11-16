Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x8, _x9, _x10) { var _again = true; _function: while (_again) { var object = _x8, property = _x9, receiver = _x10; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x8 = parent; _x9 = property; _x10 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

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

var _dicyCore = require('@dicy/core');

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
    this.cachedDiCy = new Map();

    var _this = this;

    this.disposables.add(atom.config.onDidChange('latex', function () {
      return _this2.updateConfiguration();
    }));
  }

  _createClass(Composer, [{
    key: 'updateConfiguration',
    value: function updateConfiguration() {
      // Setting rebuildCompleted to empty set will force rebuild to happen at the
      // next build.
      this.rebuildCompleted = new Set();

      // Get the first cached DiCy builder
      var dicy = this.cachedDiCy.values().next().value;
      if (dicy) {
        // Update the options on the first builder. This will set the options in
        // the user's config file. All other builders will then reread the config
        // file on their next build.
        dicy.updateOptions(this.getDiCyOptions(), true);
      }
    }
  }, {
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
    key: 'getDiCy',
    value: _asyncToGenerator(function* (filePath) {
      var shouldRebuild = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
      var fastLoad = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

      var magic = new _parsersMagicParser2['default'](filePath).parse();
      if (magic.root) {
        filePath = _path2['default'].resolve(_path2['default'].dirname(filePath), magic.root);
      }

      var dicy = undefined;

      // Logging severity level is set to info so we receive all messages and
      // do our own filtering.
      var options = { severity: 'info' };

      // If fastLoad is set then we avoid cache validation. This makes the sync
      // command more responsive since the sync command only cares about output
      // targets not build inputs.
      if (fastLoad) {
        options.validateCache = false;
      }

      if (shouldRebuild) {
        // Respect user settings by only setting loadCache if explicitly
        // instructed to by rebuild command.
        options.loadCache = false;
      } else {
        dicy = this.cachedDiCy.get(filePath);
        if (dicy) {
          dicy.setInstanceOptions(options);
          return dicy;
        }
      }

      dicy = yield _dicyCore.DiCy.create(filePath, options);
      if (this.cachedDiCy.size === 0) {
        // This is the first DiCy builder so make sure the user options
        // are synchronized.
        dicy.updateOptions(this.getDiCyOptions(), true);
      }
      this.cachedDiCy.set(filePath, dicy);

      dicy.on('log', function (event) {
        var nameText = event.name ? '[' + event.name + '] ' : '';
        var typeText = event.category ? event.category + ': ' : '';
        var message = {
          type: event.severity,
          text: '' + nameText + typeText + event.text
        };

        if (event.source) {
          message.filePath = _path2['default'].resolve(dicy.rootPath, event.source.file);
          if (event.source.range) {
            message.range = [[event.source.range.start - 1, 0], [event.source.range.end - 1, Number.MAX_SAFE_INTEGER]];
          }
        }

        if (event.log) {
          message.logPath = _path2['default'].resolve(dicy.rootPath, event.log.file);
          if (event.log.range) {
            message.logRange = [[event.log.range.start - 1, 0], [event.log.range.end - 1, Number.MAX_SAFE_INTEGER]];
          }
        }

        latex.log.showMessage(message);
      }).on('command', function (event) {
        latex.log.info('[' + event.rule + '] Executing `' + event.command + '`');
      }).on('fileDeleted', function (event) {
        if (!event.virtual) {
          latex.log.info('Deleting `' + event.file + '`');
        }
      });

      return dicy;
    })
  }, {
    key: 'getDiCyOptions',
    value: function getDiCyOptions() {
      // loggingLevel is sent even though it is set to info in getDiCy so that
      // any command line versions of DiCy have the same error reporting level.
      var options = _lodash2['default'].pick(atom.config.get('latex'), ['customEngine', 'enableSynctex', 'engine', 'loggingLevel', 'moveResultToSourceDirectory', 'outputDirectory', 'outputFormat']);
      var properties = {
        output_dir: '${OUTDIR}',
        jobname: '${JOB}',
        name: '${NAME}',
        ext: '${OUTEXT}'
      };
      var cleanPatterns = atom.config.get('latex.cleanPatterns');

      // Convert property expansion to DiCy's conventions
      options.cleanPatterns = cleanPatterns.map(function (pattern) {
        return (0, _werkzeug.replacePropertiesInString)(pattern, properties);
      });

      // Only enable shell escape if explicitly requested. This allows the
      // configuration in texmf-dist to take precedence.
      var enableShellEscape = atom.config.get('latex.enableShellEscape');
      if (enableShellEscape) options.shellEscape = 'enabled';

      // DiCy manages intermediate PostScript production itself, without the
      // wrapper dvipdf since it is not available on Windows.
      var producer = atom.config.get('latex.producer');
      options.intermediatePostScript = producer === 'dvipdf' || producer === 'ps2pdf';

      var PATH = atom.config.get('latex.texPath').trim() || this.defaultTexPath(process.platform);
      if (PATH) options['$PATH'] = PATH;

      return options;
    }
  }, {
    key: 'defaultTexPath',
    value: function defaultTexPath(platform) {
      switch (platform) {
        case 'win32':
          return ['%SystemDrive%\\texlive\\2017\\bin\\win32', '%SystemDrive%\\texlive\\2016\\bin\\win32', '%SystemDrive%\\texlive\\2015\\bin\\win32', '%ProgramFiles%\\MiKTeX 2.9\\miktex\\bin\\x64', '%ProgramFiles(x86)%\\MiKTeX 2.9\\miktex\\bin', '$PATH'].join(_path2['default'].delimiter);
        case 'darwin':
          return ['/usr/texbin', '/Library/TeX/texbin', '$PATH'].join(_path2['default'].delimiter);
      }
    }
  }, {
    key: 'runDiCy',
    value: _asyncToGenerator(function* (commands) {
      var _ref = arguments.length <= 1 || arguments[1] === undefined ? { shouldRebuild: false, fastLoad: false, openResults: true, clearLog: false } : arguments[1];

      var shouldRebuild = _ref.shouldRebuild;
      var fastLoad = _ref.fastLoad;
      var openResults = _ref.openResults;
      var clearLog = _ref.clearLog;

      var _getEditorDetails = (0, _werkzeug.getEditorDetails)();

      var filePath = _getEditorDetails.filePath;
      var lineNumber = _getEditorDetails.lineNumber;

      var dicy = yield this.getDiCy(filePath, shouldRebuild, fastLoad);

      if (clearLog) latex.log.clear();
      if (!fastLoad) latex.status.setBusy();

      var success = yield dicy.run.apply(dicy, _toConsumableArray(commands));

      if (openResults && success) {
        var targets = yield dicy.getTargetPaths(true);
        for (var outputFilePath of targets) {
          // SyncTeX files are considered targets also, so do a positive file type check.
          if ((0, _werkzeug.isDviFile)(outputFilePath) || (0, _werkzeug.isPdfFile)(outputFilePath) || (0, _werkzeug.isPsFile)(outputFilePath)) {
            yield latex.opener.open(_path2['default'].resolve(dicy.rootPath, outputFilePath), filePath, lineNumber);
          }
        }
      }

      if (!fastLoad) latex.status.setIdle();
    })
  }, {
    key: 'build',
    value: _asyncToGenerator(function* () {
      var _this3 = this;

      var shouldRebuild = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];
      var enableLogging = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

      yield this.kill();

      var _getEditorDetails2 = (0, _werkzeug.getEditorDetails)();

      var editor = _getEditorDetails2.editor;
      var filePath = _getEditorDetails2.filePath;
      var lineNumber = _getEditorDetails2.lineNumber;

      if (!this.isValidSourceFile(filePath, enableLogging)) {
        return false;
      }

      if (editor.isModified()) {
        yield editor.save(); // TODO: Make this configurable?
      }

      if (this.shouldUseDiCy()) {
        return this.runDiCy(['load', 'build', 'log', 'save'], {
          shouldRebuild: shouldRebuild,
          openResults: this.shouldOpenResult(),
          clearLog: true
        });
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

      latex.log.clear();
      latex.status.setBusy();

      var jobs = state.getJobStates().map(function (jobState) {
        return _this3.buildJob(filePath, lineNumber, builder, jobState);
      });

      yield Promise.all(jobs);

      latex.status.setIdle();
    })
  }, {
    key: 'buildJob',
    value: _asyncToGenerator(function* (filePath, lineNumber, builder, jobState) {
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
          this.showResult(filePath, lineNumber, jobState);
        }
      } catch (error) {
        latex.log.error(error.message);
      }
    })
  }, {
    key: 'kill',
    value: function kill() {
      latex.process.killChildProcesses();

      var killJobs = Array.from(this.cachedDiCy.values()).map(function (dicy) {
        return dicy.kill();
      });

      return Promise.all(killJobs);
    }
  }, {
    key: 'sync',
    value: _asyncToGenerator(function* () {
      var _this4 = this;

      var _getEditorDetails3 = (0, _werkzeug.getEditorDetails)();

      var filePath = _getEditorDetails3.filePath;
      var lineNumber = _getEditorDetails3.lineNumber;

      if (!this.isValidSourceFile(filePath)) {
        return false;
      }

      if (this.shouldUseDiCy()) {
        return this.runDiCy(['load'], { fastLoad: true });
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

      var _getEditorDetails4 = (0, _werkzeug.getEditorDetails)();

      var filePath = _getEditorDetails4.filePath;

      if (!this.isValidSourceFile(filePath)) {
        return false;
      }

      if (this.shouldUseDiCy()) {
        return this.runDiCy(['load', 'clean', 'save'], { openResults: false, clearLog: true });
      }

      var _initializeBuild3 = this.initializeBuild(filePath, true);

      var builder = _initializeBuild3.builder;
      var state = _initializeBuild3.state;

      if (!builder) return false;

      latex.status.setBusy();
      latex.log.clear();

      var jobs = state.getJobStates().map(function (jobState) {
        return _this5.cleanJob(builder, jobState);
      });

      yield Promise.all(jobs);

      latex.status.setIdle();
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
          for (var file of _glob2['default'].sync(absolutePattern, { dot: true })) {
            files.add(_path2['default'].normalize(file));
          }
        } else {
          for (var file of generatedFiles.values()) {
            if ((0, _minimatch2['default'])(file, pattern, { dot: true })) {
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
    value: _asyncToGenerator(function* (filePath, lineNumber, jobState) {
      if (!this.shouldOpenResult()) {
        return;
      }

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
    key: 'isValidSourceFile',
    value: function isValidSourceFile(filePath) {
      var enableLogging = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

      if (!filePath) {
        if (enableLogging) {
          latex.log.warning('File needs to be saved to disk before it can be processed.');
        }
        return false;
      }

      if (!(0, _werkzeug.isSourceFile)(filePath)) {
        if (enableLogging) {
          latex.log.warning('File does not appear to be a valid source file.');
        }
        return false;
      }

      return true;
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
    key: 'shouldUseDiCy',
    value: function shouldUseDiCy() {
      return atom.config.get('latex.useDicy');
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2JpbGx5Ly5hdG9tL3BhY2thZ2VzL2xhdGV4L2xpYi9jb21wb3Nlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztzQkFFYyxRQUFROzs7O3NCQUNQLFNBQVM7Ozs7b0JBQ1AsTUFBTTs7Ozt3QkFDRixZQUFZOzt3QkFDeUUsWUFBWTs7eUJBQ2hHLFdBQVc7Ozs7b0JBQ2hCLE1BQU07Ozs7c0JBQ04sU0FBUzs7OztvQkFDc0IsTUFBTTs7MEJBQy9CLGVBQWU7Ozs7a0NBQ2Qsd0JBQXdCOzs7O0lBRTNCLFFBQVE7WUFBUixRQUFROztBQUtmLFdBTE8sUUFBUSxHQUtaOzs7MEJBTEksUUFBUTs7QUFNekIsK0JBTmlCLFFBQVEsNkNBTW5CO2FBQU0sTUFBSyxXQUFXLENBQUMsT0FBTyxFQUFFO0tBQUEsRUFBQztTQUx6QyxXQUFXLEdBQUcsK0JBQXlCO1NBQ3ZDLGlCQUFpQixHQUFHLElBQUksR0FBRyxFQUFFO1NBQzdCLFVBQVUsR0FBRyxJQUFJLEdBQUcsRUFBRTs7OztBQUlwQixRQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxPQUFPLEVBQUU7YUFBTSxPQUFLLG1CQUFtQixFQUFFO0tBQUEsQ0FBQyxDQUFDLENBQUE7R0FDekY7O2VBUmtCLFFBQVE7O1dBVVAsK0JBQUc7OztBQUdyQixVQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQTs7O0FBR2pDLFVBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUMsS0FBSyxDQUFBO0FBQ2xELFVBQUksSUFBSSxFQUFFOzs7O0FBSVIsWUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUE7T0FDaEQ7S0FDRjs7O1dBRWUseUJBQUMsUUFBUSxFQUF1QjtVQUFyQixXQUFX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YWdlcy9sYXRleC9saWIvY29tcG9zZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiogQGJhYmVsICovXG5cbmltcG9ydCBfIGZyb20gJ2xvZGFzaCdcbmltcG9ydCBmcyBmcm9tICdmcy1wbHVzJ1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcbmltcG9ydCB7IERpQ3kgfSBmcm9tICdAZGljeS9jb3JlJ1xuaW1wb3J0IHsgZ2V0RWRpdG9yRGV0YWlscywgaXNTb3VyY2VGaWxlLCBpc0R2aUZpbGUsIGlzUGRmRmlsZSwgaXNQc0ZpbGUsIHJlcGxhY2VQcm9wZXJ0aWVzSW5TdHJpbmcgfSBmcm9tICcuL3dlcmt6ZXVnJ1xuaW1wb3J0IG1pbmltYXRjaCBmcm9tICdtaW5pbWF0Y2gnXG5pbXBvcnQgZ2xvYiBmcm9tICdnbG9iJ1xuaW1wb3J0IHlhbWwgZnJvbSAnanMteWFtbCdcbmltcG9ydCB7IENvbXBvc2l0ZURpc3Bvc2FibGUsIERpc3Bvc2FibGUgfSBmcm9tICdhdG9tJ1xuaW1wb3J0IEJ1aWxkU3RhdGUgZnJvbSAnLi9idWlsZC1zdGF0ZSdcbmltcG9ydCBNYWdpY1BhcnNlciBmcm9tICcuL3BhcnNlcnMvbWFnaWMtcGFyc2VyJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb21wb3NlciBleHRlbmRzIERpc3Bvc2FibGUge1xuICBkaXNwb3NhYmxlcyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcbiAgY2FjaGVkQnVpbGRTdGF0ZXMgPSBuZXcgTWFwKClcbiAgY2FjaGVkRGlDeSA9IG5ldyBNYXAoKVxuXG4gIGNvbnN0cnVjdG9yICgpIHtcbiAgICBzdXBlcigoKSA9PiB0aGlzLmRpc3Bvc2FibGVzLmRpc3Bvc2UoKSlcbiAgICB0aGlzLmRpc3Bvc2FibGVzLmFkZChhdG9tLmNvbmZpZy5vbkRpZENoYW5nZSgnbGF0ZXgnLCAoKSA9PiB0aGlzLnVwZGF0ZUNvbmZpZ3VyYXRpb24oKSkpXG4gIH1cblxuICB1cGRhdGVDb25maWd1cmF0aW9uICgpIHtcbiAgICAvLyBTZXR0aW5nIHJlYnVpbGRDb21wbGV0ZWQgdG8gZW1wdHkgc2V0IHdpbGwgZm9yY2UgcmVidWlsZCB0byBoYXBwZW4gYXQgdGhlXG4gICAgLy8gbmV4dCBidWlsZC5cbiAgICB0aGlzLnJlYnVpbGRDb21wbGV0ZWQgPSBuZXcgU2V0KClcblxuICAgIC8vIEdldCB0aGUgZmlyc3QgY2FjaGVkIERpQ3kgYnVpbGRlclxuICAgIGNvbnN0IGRpY3kgPSB0aGlzLmNhY2hlZERpQ3kudmFsdWVzKCkubmV4dCgpLnZhbHVlXG4gICAgaWYgKGRpY3kpIHtcbiAgICAgIC8vIFVwZGF0ZSB0aGUgb3B0aW9ucyBvbiB0aGUgZmlyc3QgYnVpbGRlci4gVGhpcyB3aWxsIHNldCB0aGUgb3B0aW9ucyBpblxuICAgICAgLy8gdGhlIHVzZXIncyBjb25maWcgZmlsZS4gQWxsIG90aGVyIGJ1aWxkZXJzIHdpbGwgdGhlbiByZXJlYWQgdGhlIGNvbmZpZ1xuICAgICAgLy8gZmlsZSBvbiB0aGVpciBuZXh0IGJ1aWxkLlxuICAgICAgZGljeS51cGRhdGVPcHRpb25zKHRoaXMuZ2V0RGlDeU9wdGlvbnMoKSwgdHJ1ZSlcbiAgICB9XG4gIH1cblxuICBpbml0aWFsaXplQnVpbGQgKGZpbGVQYXRoLCBhbGxvd0NhY2hlZCA9IGZhbHNlKSB7XG4gICAgbGV0IHN0YXRlXG5cbiAgICBpZiAoYWxsb3dDYWNoZWQgJiYgdGhpcy5jYWNoZWRCdWlsZFN0YXRlcy5oYXMoZmlsZVBhdGgpKSB7XG4gICAgICBzdGF0ZSA9IHRoaXMuY2FjaGVkQnVpbGRTdGF0ZXMuZ2V0KGZpbGVQYXRoKVxuICAgIH0gZWxzZSB7XG4gICAgICBzdGF0ZSA9IG5ldyBCdWlsZFN0YXRlKGZpbGVQYXRoKVxuICAgICAgdGhpcy5pbml0aWFsaXplQnVpbGRTdGF0ZUZyb21Db25maWcoc3RhdGUpXG4gICAgICB0aGlzLmluaXRpYWxpemVCdWlsZFN0YXRlRnJvbU1hZ2ljKHN0YXRlKVxuICAgICAgdGhpcy5pbml0aWFsaXplQnVpbGRTdGF0ZUZyb21TZXR0aW5nc0ZpbGUoc3RhdGUpXG4gICAgICAvLyBDaGVjayBhZ2FpbiBpbiBjYXNlIHRoZXJlIHdhcyBhIHJvb3QgY29tbWVudFxuICAgICAgY29uc3QgbWFzdGVyRmlsZVBhdGggPSBzdGF0ZS5nZXRGaWxlUGF0aCgpXG4gICAgICBpZiAoZmlsZVBhdGggIT09IG1hc3RlckZpbGVQYXRoKSB7XG4gICAgICAgIGlmIChhbGxvd0NhY2hlZCAmJiB0aGlzLmNhY2hlZEJ1aWxkU3RhdGVzLmhhcyhtYXN0ZXJGaWxlUGF0aCkpIHtcbiAgICAgICAgICBzdGF0ZSA9IHRoaXMuY2FjaGVkQnVpbGRTdGF0ZXMuZ2V0KG1hc3RlckZpbGVQYXRoKVxuICAgICAgICB9XG4gICAgICAgIHN0YXRlLmFkZFN1YmZpbGUoZmlsZVBhdGgpXG4gICAgICB9XG4gICAgICB0aGlzLmNhY2hlQnVpbGRTdGF0ZShzdGF0ZSlcbiAgICB9XG5cbiAgICBjb25zdCBidWlsZGVyID0gbGF0ZXguYnVpbGRlclJlZ2lzdHJ5LmdldEJ1aWxkZXIoc3RhdGUpXG4gICAgaWYgKCFidWlsZGVyKSB7XG4gICAgICBsYXRleC5sb2cud2FybmluZyhgTm8gcmVnaXN0ZXJlZCBMYVRlWCBidWlsZGVyIGNhbiBwcm9jZXNzICR7c3RhdGUuZ2V0RmlsZVBhdGgoKX0uYClcbiAgICAgIHJldHVybiBzdGF0ZVxuICAgIH1cblxuICAgIHJldHVybiB7IHN0YXRlLCBidWlsZGVyIH1cbiAgfVxuXG4gIGNhY2hlQnVpbGRTdGF0ZSAoc3RhdGUpIHtcbiAgICBjb25zdCBmaWxlUGF0aCA9IHN0YXRlLmdldEZpbGVQYXRoKClcbiAgICBpZiAodGhpcy5jYWNoZWRCdWlsZFN0YXRlcy5oYXMoZmlsZVBhdGgpKSB7XG4gICAgICBjb25zdCBvbGRTdGF0ZSA9IHRoaXMuY2FjaGVkQnVpbGRTdGF0ZXMuZ2V0KGZpbGVQYXRoKVxuICAgICAgZm9yIChjb25zdCBzdWJmaWxlIG9mIG9sZFN0YXRlLmdldFN1YmZpbGVzKCkpIHtcbiAgICAgICAgdGhpcy5jYWNoZWRCdWlsZFN0YXRlcy5kZWxldGUoc3ViZmlsZSlcbiAgICAgIH1cbiAgICAgIHRoaXMuY2FjaGVkQnVpbGRTdGF0ZXMuZGVsZXRlKGZpbGVQYXRoKVxuICAgIH1cblxuICAgIHRoaXMuY2FjaGVkQnVpbGRTdGF0ZXMuc2V0KGZpbGVQYXRoLCBzdGF0ZSlcbiAgICBmb3IgKGNvbnN0IHN1YmZpbGUgb2Ygc3RhdGUuZ2V0U3ViZmlsZXMoKSkge1xuICAgICAgdGhpcy5jYWNoZWRCdWlsZFN0YXRlcy5zZXQoc3ViZmlsZSwgc3RhdGUpXG4gICAgfVxuICB9XG5cbiAgaW5pdGlhbGl6ZUJ1aWxkU3RhdGVGcm9tQ29uZmlnIChzdGF0ZSkge1xuICAgIHRoaXMuaW5pdGlhbGl6ZUJ1aWxkU3RhdGVGcm9tUHJvcGVydGllcyhzdGF0ZSwgYXRvbS5jb25maWcuZ2V0KCdsYXRleCcpKVxuICB9XG5cbiAgaW5pdGlhbGl6ZUJ1aWxkU3RhdGVGcm9tUHJvcGVydGllcyAoc3RhdGUsIHByb3BlcnRpZXMpIHtcbiAgICBpZiAoIXByb3BlcnRpZXMpIHJldHVyblxuXG4gICAgaWYgKHByb3BlcnRpZXMuY2xlYW5QYXR0ZXJucykge1xuICAgICAgc3RhdGUuc2V0Q2xlYW5QYXR0ZXJucyhwcm9wZXJ0aWVzLmNsZWFuUGF0dGVybnMpXG4gICAgfVxuXG4gICAgaWYgKCdlbmFibGVTeW5jdGV4JyBpbiBwcm9wZXJ0aWVzKSB7XG4gICAgICBzdGF0ZS5zZXRFbmFibGVTeW5jdGV4KHByb3BlcnRpZXMuZW5hYmxlU3luY3RleClcbiAgICB9XG5cbiAgICBpZiAoJ2VuYWJsZVNoZWxsRXNjYXBlJyBpbiBwcm9wZXJ0aWVzKSB7XG4gICAgICBzdGF0ZS5zZXRFbmFibGVTaGVsbEVzY2FwZShwcm9wZXJ0aWVzLmVuYWJsZVNoZWxsRXNjYXBlKVxuICAgIH1cblxuICAgIGlmICgnZW5hYmxlRXh0ZW5kZWRCdWlsZE1vZGUnIGluIHByb3BlcnRpZXMpIHtcbiAgICAgIHN0YXRlLnNldEVuYWJsZUV4dGVuZGVkQnVpbGRNb2RlKHByb3BlcnRpZXMuZW5hYmxlRXh0ZW5kZWRCdWlsZE1vZGUpXG4gICAgfVxuXG4gICAgaWYgKHByb3BlcnRpZXMuam9iTmFtZXMpIHtcbiAgICAgIHN0YXRlLnNldEpvYk5hbWVzKHByb3BlcnRpZXMuam9iTmFtZXMpXG4gICAgfSBlbHNlIGlmIChwcm9wZXJ0aWVzLmpvYm5hbWVzKSB7XG4gICAgICAvLyBqb2JuYW1lcyBpcyBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG1hZ2ljIGNvbW1lbnRzXG4gICAgICBzdGF0ZS5zZXRKb2JOYW1lcyhwcm9wZXJ0aWVzLmpvYm5hbWVzKVxuICAgIH0gZWxzZSBpZiAocHJvcGVydGllcy5qb2JuYW1lKSB7XG4gICAgICAvLyBqb2JuYW1lIGlzIGZvciBjb21wYXRpYmlsaXR5IHdpdGggU3VibGltZVxuICAgICAgc3RhdGUuc2V0Sm9iTmFtZXMoW3Byb3BlcnRpZXMuam9ibmFtZV0pXG4gICAgfVxuXG4gICAgaWYgKHByb3BlcnRpZXMuY3VzdG9tRW5naW5lKSB7XG4gICAgICBzdGF0ZS5zZXRFbmdpbmUocHJvcGVydGllcy5jdXN0b21FbmdpbmUpXG4gICAgfSBlbHNlIGlmIChwcm9wZXJ0aWVzLmVuZ2luZSkge1xuICAgICAgc3RhdGUuc2V0RW5naW5lKHByb3BlcnRpZXMuZW5naW5lKVxuICAgIH0gZWxzZSBpZiAocHJvcGVydGllcy5wcm9ncmFtKSB7XG4gICAgICAvLyBwcm9ncmFtIGlzIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbWFnaWMgY29tbWVudHNcbiAgICAgIHN0YXRlLnNldEVuZ2luZShwcm9wZXJ0aWVzLnByb2dyYW0pXG4gICAgfVxuXG4gICAgaWYgKCdtb3ZlUmVzdWx0VG9Tb3VyY2VEaXJlY3RvcnknIGluIHByb3BlcnRpZXMpIHtcbiAgICAgIHN0YXRlLnNldE1vdmVSZXN1bHRUb1NvdXJjZURpcmVjdG9yeShwcm9wZXJ0aWVzLm1vdmVSZXN1bHRUb1NvdXJjZURpcmVjdG9yeSlcbiAgICB9XG5cbiAgICBpZiAocHJvcGVydGllcy5vdXRwdXRGb3JtYXQpIHtcbiAgICAgIHN0YXRlLnNldE91dHB1dEZvcm1hdChwcm9wZXJ0aWVzLm91dHB1dEZvcm1hdClcbiAgICB9IGVsc2UgaWYgKHByb3BlcnRpZXMuZm9ybWF0KSB7XG4gICAgICAvLyBmb3JtYXQgaXMgZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBtYWdpYyBjb21tZW50c1xuICAgICAgc3RhdGUuc2V0T3V0cHV0Rm9ybWF0KHByb3BlcnRpZXMuZm9ybWF0KVxuICAgIH1cblxuICAgIGlmICgnb3V0cHV0RGlyZWN0b3J5JyBpbiBwcm9wZXJ0aWVzKSB7XG4gICAgICBzdGF0ZS5zZXRPdXRwdXREaXJlY3RvcnkocHJvcGVydGllcy5vdXRwdXREaXJlY3RvcnkpXG4gICAgfSBlbHNlIGlmICgnb3V0cHV0X2RpcmVjdG9yeScgaW4gcHJvcGVydGllcykge1xuICAgICAgLy8gb3V0cHV0X2RpcmVjdG9yeSBpcyBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIFN1YmxpbWVcbiAgICAgIHN0YXRlLnNldE91dHB1dERpcmVjdG9yeShwcm9wZXJ0aWVzLm91dHB1dF9kaXJlY3RvcnkpXG4gICAgfVxuXG4gICAgaWYgKHByb3BlcnRpZXMucHJvZHVjZXIpIHtcbiAgICAgIHN0YXRlLnNldFByb2R1Y2VyKHByb3BlcnRpZXMucHJvZHVjZXIpXG4gICAgfVxuICB9XG5cbiAgaW5pdGlhbGl6ZUJ1aWxkU3RhdGVGcm9tTWFnaWMgKHN0YXRlKSB7XG4gICAgbGV0IG1hZ2ljID0gdGhpcy5nZXRNYWdpYyhzdGF0ZSlcblxuICAgIGlmIChtYWdpYy5yb290KSB7XG4gICAgICBzdGF0ZS5zZXRGaWxlUGF0aChwYXRoLnJlc29sdmUoc3RhdGUuZ2V0UHJvamVjdFBhdGgoKSwgbWFnaWMucm9vdCkpXG4gICAgICBtYWdpYyA9IHRoaXMuZ2V0TWFnaWMoc3RhdGUpXG4gICAgfVxuXG4gICAgdGhpcy5pbml0aWFsaXplQnVpbGRTdGF0ZUZyb21Qcm9wZXJ0aWVzKHN0YXRlLCBtYWdpYylcbiAgfVxuXG4gIGdldE1hZ2ljIChzdGF0ZSkge1xuICAgIHJldHVybiBuZXcgTWFnaWNQYXJzZXIoc3RhdGUuZ2V0RmlsZVBhdGgoKSkucGFyc2UoKVxuICB9XG5cbiAgaW5pdGlhbGl6ZUJ1aWxkU3RhdGVGcm9tU2V0dGluZ3NGaWxlIChzdGF0ZSkge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCB7IGRpciwgbmFtZSB9ID0gcGF0aC5wYXJzZShzdGF0ZS5nZXRGaWxlUGF0aCgpKVxuICAgICAgY29uc3QgZmlsZVBhdGggPSBwYXRoLmZvcm1hdCh7IGRpciwgbmFtZSwgZXh0OiAnLnlhbWwnIH0pXG5cbiAgICAgIGlmIChmcy5leGlzdHNTeW5jKGZpbGVQYXRoKSkge1xuICAgICAgICBjb25zdCBjb25maWcgPSB5YW1sLnNhZmVMb2FkKGZzLnJlYWRGaWxlU3luYyhmaWxlUGF0aCkpXG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZUJ1aWxkU3RhdGVGcm9tUHJvcGVydGllcyhzdGF0ZSwgY29uZmlnKVxuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBsYXRleC5sb2cuZXJyb3IoYFBhcnNpbmcgb2YgcHJvamVjdCBmaWxlIGZhaWxlZDogJHtlcnJvci5tZXNzYWdlfWApXG4gICAgfVxuICB9XG5cbiAgYXN5bmMgZ2V0RGlDeSAoZmlsZVBhdGgsIHNob3VsZFJlYnVpbGQgPSBmYWxzZSwgZmFzdExvYWQgPSBmYWxzZSkge1xuICAgIGNvbnN0IG1hZ2ljID0gbmV3IE1hZ2ljUGFyc2VyKGZpbGVQYXRoKS5wYXJzZSgpXG4gICAgaWYgKG1hZ2ljLnJvb3QpIHtcbiAgICAgIGZpbGVQYXRoID0gcGF0aC5yZXNvbHZlKHBhdGguZGlybmFtZShmaWxlUGF0aCksIG1hZ2ljLnJvb3QpXG4gICAgfVxuXG4gICAgbGV0IGRpY3lcblxuICAgIC8vIExvZ2dpbmcgc2V2ZXJpdHkgbGV2ZWwgaXMgc2V0IHRvIGluZm8gc28gd2UgcmVjZWl2ZSBhbGwgbWVzc2FnZXMgYW5kXG4gICAgLy8gZG8gb3VyIG93biBmaWx0ZXJpbmcuXG4gICAgY29uc3Qgb3B0aW9ucyA9IHsgc2V2ZXJpdHk6ICdpbmZvJyB9XG5cbiAgICAvLyBJZiBmYXN0TG9hZCBpcyBzZXQgdGhlbiB3ZSBhdm9pZCBjYWNoZSB2YWxpZGF0aW9uLiBUaGlzIG1ha2VzIHRoZSBzeW5jXG4gICAgLy8gY29tbWFuZCBtb3JlIHJlc3BvbnNpdmUgc2luY2UgdGhlIHN5bmMgY29tbWFuZCBvbmx5IGNhcmVzIGFib3V0IG91dHB1dFxuICAgIC8vIHRhcmdldHMgbm90IGJ1aWxkIGlucHV0cy5cbiAgICBpZiAoZmFzdExvYWQpIHtcbiAgICAgIG9wdGlvbnMudmFsaWRhdGVDYWNoZSA9IGZhbHNlXG4gICAgfVxuXG4gICAgaWYgKHNob3VsZFJlYnVpbGQpIHtcbiAgICAgIC8vIFJlc3BlY3QgdXNlciBzZXR0aW5ncyBieSBvbmx5IHNldHRpbmcgbG9hZENhY2hlIGlmIGV4cGxpY2l0bHlcbiAgICAgIC8vIGluc3RydWN0ZWQgdG8gYnkgcmVidWlsZCBjb21tYW5kLlxuICAgICAgb3B0aW9ucy5sb2FkQ2FjaGUgPSBmYWxzZVxuICAgIH0gZWxzZSB7XG4gICAgICBkaWN5ID0gdGhpcy5jYWNoZWREaUN5LmdldChmaWxlUGF0aClcbiAgICAgIGlmIChkaWN5KSB7XG4gICAgICAgIGRpY3kuc2V0SW5zdGFuY2VPcHRpb25zKG9wdGlvbnMpXG4gICAgICAgIHJldHVybiBkaWN5XG4gICAgICB9XG4gICAgfVxuXG4gICAgZGljeSA9IGF3YWl0IERpQ3kuY3JlYXRlKGZpbGVQYXRoLCBvcHRpb25zKVxuICAgIGlmICh0aGlzLmNhY2hlZERpQ3kuc2l6ZSA9PT0gMCkge1xuICAgICAgLy8gVGhpcyBpcyB0aGUgZmlyc3QgRGlDeSBidWlsZGVyIHNvIG1ha2Ugc3VyZSB0aGUgdXNlciBvcHRpb25zXG4gICAgICAvLyBhcmUgc3luY2hyb25pemVkLlxuICAgICAgZGljeS51cGRhdGVPcHRpb25zKHRoaXMuZ2V0RGlDeU9wdGlvbnMoKSwgdHJ1ZSlcbiAgICB9XG4gICAgdGhpcy5jYWNoZWREaUN5LnNldChmaWxlUGF0aCwgZGljeSlcblxuICAgIGRpY3kub24oJ2xvZycsIGV2ZW50ID0+IHtcbiAgICAgIGNvbnN0IG5hbWVUZXh0ID0gZXZlbnQubmFtZSA/IGBbJHtldmVudC5uYW1lfV0gYCA6ICcnXG4gICAgICBjb25zdCB0eXBlVGV4dCA9IGV2ZW50LmNhdGVnb3J5ID8gYCR7ZXZlbnQuY2F0ZWdvcnl9OiBgIDogJydcbiAgICAgIGNvbnN0IG1lc3NhZ2UgPSB7XG4gICAgICAgIHR5cGU6IGV2ZW50LnNldmVyaXR5LFxuICAgICAgICB0ZXh0OiBgJHtuYW1lVGV4dH0ke3R5cGVUZXh0fSR7ZXZlbnQudGV4dH1gXG4gICAgICB9XG5cbiAgICAgIGlmIChldmVudC5zb3VyY2UpIHtcbiAgICAgICAgbWVzc2FnZS5maWxlUGF0aCA9IHBhdGgucmVzb2x2ZShkaWN5LnJvb3RQYXRoLCBldmVudC5zb3VyY2UuZmlsZSlcbiAgICAgICAgaWYgKGV2ZW50LnNvdXJjZS5yYW5nZSkge1xuICAgICAgICAgIG1lc3NhZ2UucmFuZ2UgPSBbW2V2ZW50LnNvdXJjZS5yYW5nZS5zdGFydCAtIDEsIDBdLCBbZXZlbnQuc291cmNlLnJhbmdlLmVuZCAtIDEsIE51bWJlci5NQVhfU0FGRV9JTlRFR0VSXV1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoZXZlbnQubG9nKSB7XG4gICAgICAgIG1lc3NhZ2UubG9nUGF0aCA9IHBhdGgucmVzb2x2ZShkaWN5LnJvb3RQYXRoLCBldmVudC5sb2cuZmlsZSlcbiAgICAgICAgaWYgKGV2ZW50LmxvZy5yYW5nZSkge1xuICAgICAgICAgIG1lc3NhZ2UubG9nUmFuZ2UgPSBbW2V2ZW50LmxvZy5yYW5nZS5zdGFydCAtIDEsIDBdLCBbZXZlbnQubG9nLnJhbmdlLmVuZCAtIDEsIE51bWJlci5NQVhfU0FGRV9JTlRFR0VSXV1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBsYXRleC5sb2cuc2hvd01lc3NhZ2UobWVzc2FnZSlcbiAgICB9KVxuICAgIC5vbignY29tbWFuZCcsIGV2ZW50ID0+IHtcbiAgICAgIGxhdGV4LmxvZy5pbmZvKGBbJHtldmVudC5ydWxlfV0gRXhlY3V0aW5nIFxcYCR7ZXZlbnQuY29tbWFuZH1cXGBgKVxuICAgIH0pXG4gICAgLm9uKCdmaWxlRGVsZXRlZCcsIGV2ZW50ID0+IHtcbiAgICAgIGlmICghZXZlbnQudmlydHVhbCkge1xuICAgICAgICBsYXRleC5sb2cuaW5mbyhgRGVsZXRpbmcgXFxgJHtldmVudC5maWxlfVxcYGApXG4gICAgICB9XG4gICAgfSlcblxuICAgIHJldHVybiBkaWN5XG4gIH1cblxuICBnZXREaUN5T3B0aW9ucyAoKSB7XG4gICAgLy8gbG9nZ2luZ0xldmVsIGlzIHNlbnQgZXZlbiB0aG91Z2ggaXQgaXMgc2V0IHRvIGluZm8gaW4gZ2V0RGlDeSBzbyB0aGF0XG4gICAgLy8gYW55IGNvbW1hbmQgbGluZSB2ZXJzaW9ucyBvZiBEaUN5IGhhdmUgdGhlIHNhbWUgZXJyb3IgcmVwb3J0aW5nIGxldmVsLlxuICAgIGNvbnN0IG9wdGlvbnMgPSBfLnBpY2soYXRvbS5jb25maWcuZ2V0KCdsYXRleCcpLCBbXG4gICAgICAnY3VzdG9tRW5naW5lJyxcbiAgICAgICdlbmFibGVTeW5jdGV4JyxcbiAgICAgICdlbmdpbmUnLFxuICAgICAgJ2xvZ2dpbmdMZXZlbCcsXG4gICAgICAnbW92ZVJlc3VsdFRvU291cmNlRGlyZWN0b3J5JyxcbiAgICAgICdvdXRwdXREaXJlY3RvcnknLFxuICAgICAgJ291dHB1dEZvcm1hdCdcbiAgICBdKVxuICAgIGNvbnN0IHByb3BlcnRpZXMgPSB7XG4gICAgICBvdXRwdXRfZGlyOiBgXFwke09VVERJUn1gLFxuICAgICAgam9ibmFtZTogYFxcJHtKT0J9YCxcbiAgICAgIG5hbWU6IGBcXCR7TkFNRX1gLFxuICAgICAgZXh0OiBgXFwke09VVEVYVH1gXG4gICAgfVxuICAgIGNvbnN0IGNsZWFuUGF0dGVybnMgPSBhdG9tLmNvbmZpZy5nZXQoJ2xhdGV4LmNsZWFuUGF0dGVybnMnKVxuXG4gICAgLy8gQ29udmVydCBwcm9wZXJ0eSBleHBhbnNpb24gdG8gRGlDeSdzIGNvbnZlbnRpb25zXG4gICAgb3B0aW9ucy5jbGVhblBhdHRlcm5zID0gY2xlYW5QYXR0ZXJucy5tYXAocGF0dGVybiA9PiByZXBsYWNlUHJvcGVydGllc0luU3RyaW5nKHBhdHRlcm4sIHByb3BlcnRpZXMpKVxuXG4gICAgLy8gT25seSBlbmFibGUgc2hlbGwgZXNjYXBlIGlmIGV4cGxpY2l0bHkgcmVxdWVzdGVkLiBUaGlzIGFsbG93cyB0aGVcbiAgICAvLyBjb25maWd1cmF0aW9uIGluIHRleG1mLWRpc3QgdG8gdGFrZSBwcmVjZWRlbmNlLlxuICAgIGNvbnN0IGVuYWJsZVNoZWxsRXNjYXBlID0gYXRvbS5jb25maWcuZ2V0KCdsYXRleC5lbmFibGVTaGVsbEVzY2FwZScpXG4gICAgaWYgKGVuYWJsZVNoZWxsRXNjYXBlKSBvcHRpb25zLnNoZWxsRXNjYXBlID0gJ2VuYWJsZWQnXG5cbiAgICAvLyBEaUN5IG1hbmFnZXMgaW50ZXJtZWRpYXRlIFBvc3RTY3JpcHQgcHJvZHVjdGlvbiBpdHNlbGYsIHdpdGhvdXQgdGhlXG4gICAgLy8gd3JhcHBlciBkdmlwZGYgc2luY2UgaXQgaXMgbm90IGF2YWlsYWJsZSBvbiBXaW5kb3dzLlxuICAgIGNvbnN0IHByb2R1Y2VyID0gYXRvbS5jb25maWcuZ2V0KCdsYXRleC5wcm9kdWNlcicpXG4gICAgb3B0aW9ucy5pbnRlcm1lZGlhdGVQb3N0U2NyaXB0ID0gcHJvZHVjZXIgPT09ICdkdmlwZGYnIHx8IHByb2R1Y2VyID09PSAncHMycGRmJ1xuXG4gICAgY29uc3QgUEFUSCA9IGF0b20uY29uZmlnLmdldCgnbGF0ZXgudGV4UGF0aCcpLnRyaW0oKSB8fCB0aGlzLmRlZmF1bHRUZXhQYXRoKHByb2Nlc3MucGxhdGZvcm0pXG4gICAgaWYgKFBBVEgpIG9wdGlvbnNbJyRQQVRIJ10gPSBQQVRIXG5cbiAgICByZXR1cm4gb3B0aW9uc1xuICB9XG5cbiAgZGVmYXVsdFRleFBhdGggKHBsYXRmb3JtKSB7XG4gICAgc3dpdGNoIChwbGF0Zm9ybSkge1xuICAgICAgY2FzZSAnd2luMzInOlxuICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICclU3lzdGVtRHJpdmUlXFxcXHRleGxpdmVcXFxcMjAxN1xcXFxiaW5cXFxcd2luMzInLFxuICAgICAgICAgICclU3lzdGVtRHJpdmUlXFxcXHRleGxpdmVcXFxcMjAxNlxcXFxiaW5cXFxcd2luMzInLFxuICAgICAgICAgICclU3lzdGVtRHJpdmUlXFxcXHRleGxpdmVcXFxcMjAxNVxcXFxiaW5cXFxcd2luMzInLFxuICAgICAgICAgICclUHJvZ3JhbUZpbGVzJVxcXFxNaUtUZVggMi45XFxcXG1pa3RleFxcXFxiaW5cXFxceDY0JyxcbiAgICAgICAgICAnJVByb2dyYW1GaWxlcyh4ODYpJVxcXFxNaUtUZVggMi45XFxcXG1pa3RleFxcXFxiaW4nLFxuICAgICAgICAgICckUEFUSCdcbiAgICAgICAgXS5qb2luKHBhdGguZGVsaW1pdGVyKVxuICAgICAgY2FzZSAnZGFyd2luJzpcbiAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAnL3Vzci90ZXhiaW4nLFxuICAgICAgICAgICcvTGlicmFyeS9UZVgvdGV4YmluJyxcbiAgICAgICAgICAnJFBBVEgnXG4gICAgICAgIF0uam9pbihwYXRoLmRlbGltaXRlcilcbiAgICB9XG4gIH1cblxuICBhc3luYyBydW5EaUN5IChjb21tYW5kcywgeyBzaG91bGRSZWJ1aWxkLCBmYXN0TG9hZCwgb3BlblJlc3VsdHMsIGNsZWFyTG9nIH0gPSB7IHNob3VsZFJlYnVpbGQ6IGZhbHNlLCBmYXN0TG9hZDogZmFsc2UsIG9wZW5SZXN1bHRzOiB0cnVlLCBjbGVhckxvZzogZmFsc2UgfSkge1xuICAgIGNvbnN0IHsgZmlsZVBhdGgsIGxpbmVOdW1iZXIgfSA9IGdldEVkaXRvckRldGFpbHMoKVxuICAgIGNvbnN0IGRpY3kgPSBhd2FpdCB0aGlzLmdldERpQ3koZmlsZVBhdGgsIHNob3VsZFJlYnVpbGQsIGZhc3RMb2FkKVxuXG4gICAgaWYgKGNsZWFyTG9nKSBsYXRleC5sb2cuY2xlYXIoKVxuICAgIGlmICghZmFzdExvYWQpIGxhdGV4LnN0YXR1cy5zZXRCdXN5KClcblxuICAgIGNvbnN0IHN1Y2Nlc3MgPSBhd2FpdCBkaWN5LnJ1biguLi5jb21tYW5kcylcblxuICAgIGlmIChvcGVuUmVzdWx0cyAmJiBzdWNjZXNzKSB7XG4gICAgICBjb25zdCB0YXJnZXRzID0gYXdhaXQgZGljeS5nZXRUYXJnZXRQYXRocyh0cnVlKVxuICAgICAgZm9yIChjb25zdCBvdXRwdXRGaWxlUGF0aCBvZiB0YXJnZXRzKSB7XG4gICAgICAgIC8vIFN5bmNUZVggZmlsZXMgYXJlIGNvbnNpZGVyZWQgdGFyZ2V0cyBhbHNvLCBzbyBkbyBhIHBvc2l0aXZlIGZpbGUgdHlwZSBjaGVjay5cbiAgICAgICAgaWYgKGlzRHZpRmlsZShvdXRwdXRGaWxlUGF0aCkgfHwgaXNQZGZGaWxlKG91dHB1dEZpbGVQYXRoKSB8fCBpc1BzRmlsZShvdXRwdXRGaWxlUGF0aCkpIHtcbiAgICAgICAgICBhd2FpdCBsYXRleC5vcGVuZXIub3BlbihwYXRoLnJlc29sdmUoZGljeS5yb290UGF0aCwgb3V0cHV0RmlsZVBhdGgpLCBmaWxlUGF0aCwgbGluZU51bWJlcilcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmICghZmFzdExvYWQpIGxhdGV4LnN0YXR1cy5zZXRJZGxlKClcbiAgfVxuXG4gIGFzeW5jIGJ1aWxkIChzaG91bGRSZWJ1aWxkID0gZmFsc2UsIGVuYWJsZUxvZ2dpbmcgPSB0cnVlKSB7XG4gICAgYXdhaXQgdGhpcy5raWxsKClcblxuICAgIGNvbnN0IHsgZWRpdG9yLCBmaWxlUGF0aCwgbGluZU51bWJlciB9ID0gZ2V0RWRpdG9yRGV0YWlscygpXG5cbiAgICBpZiAoIXRoaXMuaXNWYWxpZFNvdXJjZUZpbGUoZmlsZVBhdGgsIGVuYWJsZUxvZ2dpbmcpKSB7XG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG5cbiAgICBpZiAoZWRpdG9yLmlzTW9kaWZpZWQoKSkge1xuICAgICAgYXdhaXQgZWRpdG9yLnNhdmUoKSAvLyBUT0RPOiBNYWtlIHRoaXMgY29uZmlndXJhYmxlP1xuICAgIH1cblxuICAgIGlmICh0aGlzLnNob3VsZFVzZURpQ3koKSkge1xuICAgICAgcmV0dXJuIHRoaXMucnVuRGlDeShbJ2xvYWQnLCAnYnVpbGQnLCAnbG9nJywgJ3NhdmUnXSwge1xuICAgICAgICBzaG91bGRSZWJ1aWxkLFxuICAgICAgICBvcGVuUmVzdWx0czogdGhpcy5zaG91bGRPcGVuUmVzdWx0KCksXG4gICAgICAgIGNsZWFyTG9nOiB0cnVlXG4gICAgICB9KVxuICAgIH1cblxuICAgIGNvbnN0IHsgYnVpbGRlciwgc3RhdGUgfSA9IHRoaXMuaW5pdGlhbGl6ZUJ1aWxkKGZpbGVQYXRoKVxuICAgIGlmICghYnVpbGRlcikgcmV0dXJuIGZhbHNlXG4gICAgc3RhdGUuc2V0U2hvdWxkUmVidWlsZChzaG91bGRSZWJ1aWxkKVxuXG4gICAgaWYgKHRoaXMucmVidWlsZENvbXBsZXRlZCAmJiAhdGhpcy5yZWJ1aWxkQ29tcGxldGVkLmhhcyhzdGF0ZS5nZXRGaWxlUGF0aCgpKSkge1xuICAgICAgc3RhdGUuc2V0U2hvdWxkUmVidWlsZCh0cnVlKVxuICAgICAgdGhpcy5yZWJ1aWxkQ29tcGxldGVkLmFkZChzdGF0ZS5nZXRGaWxlUGF0aCgpKVxuICAgIH1cblxuICAgIGxhdGV4LmxvZy5jbGVhcigpXG4gICAgbGF0ZXguc3RhdHVzLnNldEJ1c3koKVxuXG4gICAgY29uc3Qgam9icyA9IHN0YXRlLmdldEpvYlN0YXRlcygpLm1hcChqb2JTdGF0ZSA9PiB0aGlzLmJ1aWxkSm9iKGZpbGVQYXRoLCBsaW5lTnVtYmVyLCBidWlsZGVyLCBqb2JTdGF0ZSkpXG5cbiAgICBhd2FpdCBQcm9taXNlLmFsbChqb2JzKVxuXG4gICAgbGF0ZXguc3RhdHVzLnNldElkbGUoKVxuICB9XG5cbiAgYXN5bmMgYnVpbGRKb2IgKGZpbGVQYXRoLCBsaW5lTnVtYmVyLCBidWlsZGVyLCBqb2JTdGF0ZSkge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBzdGF0dXNDb2RlID0gYXdhaXQgYnVpbGRlci5ydW4oam9iU3RhdGUpXG4gICAgICBidWlsZGVyLnBhcnNlTG9nQW5kRmRiRmlsZXMoam9iU3RhdGUpXG5cbiAgICAgIGNvbnN0IG1lc3NhZ2VzID0gam9iU3RhdGUuZ2V0TG9nTWVzc2FnZXMoKSB8fCBbXVxuICAgICAgZm9yIChjb25zdCBtZXNzYWdlIG9mIG1lc3NhZ2VzKSB7XG4gICAgICAgIGxhdGV4LmxvZy5zaG93TWVzc2FnZShtZXNzYWdlKVxuICAgICAgfVxuXG4gICAgICBpZiAoc3RhdHVzQ29kZSA+IDAgfHwgIWpvYlN0YXRlLmdldExvZ01lc3NhZ2VzKCkgfHwgIWpvYlN0YXRlLmdldE91dHB1dEZpbGVQYXRoKCkpIHtcbiAgICAgICAgdGhpcy5zaG93RXJyb3Ioam9iU3RhdGUpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAodGhpcy5zaG91bGRNb3ZlUmVzdWx0KGpvYlN0YXRlKSkge1xuICAgICAgICAgIHRoaXMubW92ZVJlc3VsdChqb2JTdGF0ZSlcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNob3dSZXN1bHQoZmlsZVBhdGgsIGxpbmVOdW1iZXIsIGpvYlN0YXRlKVxuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBsYXRleC5sb2cuZXJyb3IoZXJyb3IubWVzc2FnZSlcbiAgICB9XG4gIH1cblxuICBraWxsICgpIHtcbiAgICBsYXRleC5wcm9jZXNzLmtpbGxDaGlsZFByb2Nlc3NlcygpXG5cbiAgICBjb25zdCBraWxsSm9icyA9IEFycmF5LmZyb20odGhpcy5jYWNoZWREaUN5LnZhbHVlcygpKS5tYXAoZGljeSA9PiBkaWN5LmtpbGwoKSlcblxuICAgIHJldHVybiBQcm9taXNlLmFsbChraWxsSm9icylcbiAgfVxuXG4gIGFzeW5jIHN5bmMgKCkge1xuICAgIGNvbnN0IHsgZmlsZVBhdGgsIGxpbmVOdW1iZXIgfSA9IGdldEVkaXRvckRldGFpbHMoKVxuICAgIGlmICghdGhpcy5pc1ZhbGlkU291cmNlRmlsZShmaWxlUGF0aCkpIHtcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cblxuICAgIGlmICh0aGlzLnNob3VsZFVzZURpQ3koKSkge1xuICAgICAgcmV0dXJuIHRoaXMucnVuRGlDeShbJ2xvYWQnXSwgeyBmYXN0TG9hZDogdHJ1ZSB9KVxuICAgIH1cblxuICAgIGNvbnN0IHsgYnVpbGRlciwgc3RhdGUgfSA9IHRoaXMuaW5pdGlhbGl6ZUJ1aWxkKGZpbGVQYXRoLCB0cnVlKVxuICAgIGlmICghYnVpbGRlcikgcmV0dXJuIGZhbHNlXG5cbiAgICBjb25zdCBqb2JzID0gc3RhdGUuZ2V0Sm9iU3RhdGVzKCkubWFwKGpvYlN0YXRlID0+IHRoaXMuc3luY0pvYihmaWxlUGF0aCwgbGluZU51bWJlciwgYnVpbGRlciwgam9iU3RhdGUpKVxuXG4gICAgYXdhaXQgUHJvbWlzZS5hbGwoam9icylcbiAgfVxuXG4gIGFzeW5jIHN5bmNKb2IgKGZpbGVQYXRoLCBsaW5lTnVtYmVyLCBidWlsZGVyLCBqb2JTdGF0ZSkge1xuICAgIGNvbnN0IG91dHB1dEZpbGVQYXRoID0gdGhpcy5yZXNvbHZlT3V0cHV0RmlsZVBhdGgoYnVpbGRlciwgam9iU3RhdGUpXG4gICAgaWYgKCFvdXRwdXRGaWxlUGF0aCkge1xuICAgICAgbGF0ZXgubG9nLndhcm5pbmcoJ0NvdWxkIG5vdCByZXNvbHZlIHBhdGggdG8gb3V0cHV0IGZpbGUgYXNzb2NpYXRlZCB3aXRoIHRoZSBjdXJyZW50IGZpbGUuJylcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGF3YWl0IGxhdGV4Lm9wZW5lci5vcGVuKG91dHB1dEZpbGVQYXRoLCBmaWxlUGF0aCwgbGluZU51bWJlcilcbiAgfVxuXG4gIGFzeW5jIGNsZWFuICgpIHtcbiAgICBjb25zdCB7IGZpbGVQYXRoIH0gPSBnZXRFZGl0b3JEZXRhaWxzKClcbiAgICBpZiAoIXRoaXMuaXNWYWxpZFNvdXJjZUZpbGUoZmlsZVBhdGgpKSB7XG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG5cbiAgICBpZiAodGhpcy5zaG91bGRVc2VEaUN5KCkpIHtcbiAgICAgIHJldHVybiB0aGlzLnJ1bkRpQ3koWydsb2FkJywgJ2NsZWFuJywgJ3NhdmUnXSwgeyBvcGVuUmVzdWx0czogZmFsc2UsIGNsZWFyTG9nOiB0cnVlIH0pXG4gICAgfVxuXG4gICAgY29uc3QgeyBidWlsZGVyLCBzdGF0ZSB9ID0gdGhpcy5pbml0aWFsaXplQnVpbGQoZmlsZVBhdGgsIHRydWUpXG4gICAgaWYgKCFidWlsZGVyKSByZXR1cm4gZmFsc2VcblxuICAgIGxhdGV4LnN0YXR1cy5zZXRCdXN5KClcbiAgICBsYXRleC5sb2cuY2xlYXIoKVxuXG4gICAgY29uc3Qgam9icyA9IHN0YXRlLmdldEpvYlN0YXRlcygpLm1hcChqb2JTdGF0ZSA9PiB0aGlzLmNsZWFuSm9iKGJ1aWxkZXIsIGpvYlN0YXRlKSlcblxuICAgIGF3YWl0IFByb21pc2UuYWxsKGpvYnMpXG5cbiAgICBsYXRleC5zdGF0dXMuc2V0SWRsZSgpXG4gIH1cblxuICBhc3luYyBjbGVhbkpvYiAoYnVpbGRlciwgam9iU3RhdGUpIHtcbiAgICBjb25zdCBnZW5lcmF0ZWRGaWxlcyA9IHRoaXMuZ2V0R2VuZXJhdGVkRmlsZUxpc3QoYnVpbGRlciwgam9iU3RhdGUpXG4gICAgbGV0IGZpbGVzID0gbmV3IFNldCgpXG5cbiAgICBjb25zdCBwYXR0ZXJucyA9IHRoaXMuZ2V0Q2xlYW5QYXR0ZXJucyhidWlsZGVyLCBqb2JTdGF0ZSlcblxuICAgIGZvciAoY29uc3QgcGF0dGVybiBvZiBwYXR0ZXJucykge1xuICAgICAgLy8gSWYgdGhlIG9yaWdpbmFsIHBhdHRlcm4gaXMgYWJzb2x1dGUgdGhlbiB3ZSB1c2UgaXQgYXMgYSBnbG9iYmluZyBwYXR0ZXJuXG4gICAgICAvLyBhZnRlciB3ZSBqb2luIGl0IHRvIHRoZSByb290LCBvdGhlcndpc2Ugd2UgdXNlIGl0IGFnYWluc3QgdGhlIGxpc3Qgb2ZcbiAgICAgIC8vIGdlbmVyYXRlZCBmaWxlcy5cbiAgICAgIGlmIChwYXR0ZXJuWzBdID09PSBwYXRoLnNlcCkge1xuICAgICAgICBjb25zdCBhYnNvbHV0ZVBhdHRlcm4gPSBwYXRoLmpvaW4oam9iU3RhdGUuZ2V0UHJvamVjdFBhdGgoKSwgcGF0dGVybilcbiAgICAgICAgZm9yIChjb25zdCBmaWxlIG9mIGdsb2Iuc3luYyhhYnNvbHV0ZVBhdHRlcm4sIHsgZG90OiB0cnVlIH0pKSB7XG4gICAgICAgICAgZmlsZXMuYWRkKHBhdGgubm9ybWFsaXplKGZpbGUpKVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmb3IgKGNvbnN0IGZpbGUgb2YgZ2VuZXJhdGVkRmlsZXMudmFsdWVzKCkpIHtcbiAgICAgICAgICBpZiAobWluaW1hdGNoKGZpbGUsIHBhdHRlcm4sIHsgZG90OiB0cnVlIH0pKSB7XG4gICAgICAgICAgICBmaWxlcy5hZGQoZmlsZSlcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBmaWxlTmFtZXMgPSBBcnJheS5mcm9tKGZpbGVzLnZhbHVlcygpKS5tYXAoZmlsZSA9PiBwYXRoLmJhc2VuYW1lKGZpbGUpKS5qb2luKCcsICcpXG4gICAgbGF0ZXgubG9nLmluZm8oJ0NsZWFuZWQ6ICcgKyBmaWxlTmFtZXMpXG5cbiAgICBmb3IgKGNvbnN0IGZpbGUgb2YgZmlsZXMudmFsdWVzKCkpIHtcbiAgICAgIGZzLnJlbW92ZVN5bmMoZmlsZSlcbiAgICB9XG4gIH1cblxuICBnZXRDbGVhblBhdHRlcm5zIChidWlsZGVyLCBqb2JTdGF0ZSkge1xuICAgIGNvbnN0IHsgbmFtZSwgZXh0IH0gPSBwYXRoLnBhcnNlKGpvYlN0YXRlLmdldEZpbGVQYXRoKCkpXG4gICAgY29uc3Qgb3V0cHV0RGlyZWN0b3J5ID0gam9iU3RhdGUuZ2V0T3V0cHV0RGlyZWN0b3J5KClcbiAgICBjb25zdCBwcm9wZXJ0aWVzID0ge1xuICAgICAgb3V0cHV0X2Rpcjogb3V0cHV0RGlyZWN0b3J5ID8gb3V0cHV0RGlyZWN0b3J5ICsgcGF0aC5zZXAgOiAnJyxcbiAgICAgIGpvYm5hbWU6IGpvYlN0YXRlLmdldEpvYk5hbWUoKSB8fCBuYW1lLFxuICAgICAgbmFtZSxcbiAgICAgIGV4dFxuICAgIH1cbiAgICBjb25zdCBwYXR0ZXJucyA9IGpvYlN0YXRlLmdldENsZWFuUGF0dGVybnMoKVxuXG4gICAgcmV0dXJuIHBhdHRlcm5zLm1hcChwYXR0ZXJuID0+IHBhdGgubm9ybWFsaXplKHJlcGxhY2VQcm9wZXJ0aWVzSW5TdHJpbmcocGF0dGVybiwgcHJvcGVydGllcykpKVxuICB9XG5cbiAgZ2V0R2VuZXJhdGVkRmlsZUxpc3QgKGJ1aWxkZXIsIGpvYlN0YXRlKSB7XG4gICAgY29uc3QgeyBkaXIsIG5hbWUgfSA9IHBhdGgucGFyc2Uoam9iU3RhdGUuZ2V0RmlsZVBhdGgoKSlcbiAgICBpZiAoIWpvYlN0YXRlLmdldEZpbGVEYXRhYmFzZSgpKSB7XG4gICAgICBidWlsZGVyLnBhcnNlTG9nQW5kRmRiRmlsZXMoam9iU3RhdGUpXG4gICAgfVxuXG4gICAgY29uc3QgcGF0dGVybiA9IHBhdGgucmVzb2x2ZShkaXIsIGpvYlN0YXRlLmdldE91dHB1dERpcmVjdG9yeSgpLCBgJHtqb2JTdGF0ZS5nZXRKb2JOYW1lKCkgfHwgbmFtZX0qYClcbiAgICBjb25zdCBmaWxlcyA9IG5ldyBTZXQoZ2xvYi5zeW5jKHBhdHRlcm4pKVxuICAgIGNvbnN0IGZkYiA9IGpvYlN0YXRlLmdldEZpbGVEYXRhYmFzZSgpXG5cbiAgICBpZiAoZmRiKSB7XG4gICAgICBjb25zdCBnZW5lcmF0ZWRGaWxlcyA9IF8uZmxhdHRlbihfLm1hcChmZGIsIHNlY3Rpb24gPT4gc2VjdGlvbi5nZW5lcmF0ZWQgfHwgW10pKVxuXG4gICAgICBmb3IgKGNvbnN0IGZpbGUgb2YgZ2VuZXJhdGVkRmlsZXMpIHtcbiAgICAgICAgZmlsZXMuYWRkKHBhdGgucmVzb2x2ZShkaXIsIGZpbGUpKVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBmaWxlc1xuICB9XG5cbiAgbW92ZVJlc3VsdCAoam9iU3RhdGUpIHtcbiAgICBjb25zdCBvcmlnaW5hbE91dHB1dEZpbGVQYXRoID0gam9iU3RhdGUuZ2V0T3V0cHV0RmlsZVBhdGgoKVxuICAgIGNvbnN0IG5ld091dHB1dEZpbGVQYXRoID0gdGhpcy5hbHRlclBhcmVudFBhdGgoam9iU3RhdGUuZ2V0RmlsZVBhdGgoKSwgb3JpZ2luYWxPdXRwdXRGaWxlUGF0aClcbiAgICBqb2JTdGF0ZS5zZXRPdXRwdXRGaWxlUGF0aChuZXdPdXRwdXRGaWxlUGF0aClcbiAgICBpZiAoZnMuZXhpc3RzU3luYyhvcmlnaW5hbE91dHB1dEZpbGVQYXRoKSkge1xuICAgICAgZnMucmVtb3ZlU3luYyhuZXdPdXRwdXRGaWxlUGF0aClcbiAgICAgIGZzLm1vdmVTeW5jKG9yaWdpbmFsT3V0cHV0RmlsZVBhdGgsIG5ld091dHB1dEZpbGVQYXRoKVxuICAgIH1cblxuICAgIGNvbnN0IG9yaWdpbmFsU3luY0ZpbGVQYXRoID0gb3JpZ2luYWxPdXRwdXRGaWxlUGF0aC5yZXBsYWNlKC9cXC5wZGYkLywgJy5zeW5jdGV4Lmd6JylcbiAgICBpZiAoZnMuZXhpc3RzU3luYyhvcmlnaW5hbFN5bmNGaWxlUGF0aCkpIHtcbiAgICAgIGNvbnN0IHN5bmNGaWxlUGF0aCA9IHRoaXMuYWx0ZXJQYXJlbnRQYXRoKGpvYlN0YXRlLmdldEZpbGVQYXRoKCksIG9yaWdpbmFsU3luY0ZpbGVQYXRoKVxuICAgICAgZnMucmVtb3ZlU3luYyhzeW5jRmlsZVBhdGgpXG4gICAgICBmcy5tb3ZlU3luYyhvcmlnaW5hbFN5bmNGaWxlUGF0aCwgc3luY0ZpbGVQYXRoKVxuICAgIH1cbiAgfVxuXG4gIHJlc29sdmVPdXRwdXRGaWxlUGF0aCAoYnVpbGRlciwgam9iU3RhdGUpIHtcbiAgICBsZXQgb3V0cHV0RmlsZVBhdGggPSBqb2JTdGF0ZS5nZXRPdXRwdXRGaWxlUGF0aCgpXG4gICAgaWYgKG91dHB1dEZpbGVQYXRoKSB7XG4gICAgICByZXR1cm4gb3V0cHV0RmlsZVBhdGhcbiAgICB9XG5cbiAgICBidWlsZGVyLnBhcnNlTG9nQW5kRmRiRmlsZXMoam9iU3RhdGUpXG4gICAgb3V0cHV0RmlsZVBhdGggPSBqb2JTdGF0ZS5nZXRPdXRwdXRGaWxlUGF0aCgpXG4gICAgaWYgKCFvdXRwdXRGaWxlUGF0aCkge1xuICAgICAgbGF0ZXgubG9nLndhcm5pbmcoJ0xvZyBmaWxlIHBhcnNpbmcgZmFpbGVkIScpXG4gICAgICByZXR1cm4gbnVsbFxuICAgIH1cblxuICAgIGlmICh0aGlzLnNob3VsZE1vdmVSZXN1bHQoam9iU3RhdGUpKSB7XG4gICAgICBvdXRwdXRGaWxlUGF0aCA9IHRoaXMuYWx0ZXJQYXJlbnRQYXRoKGpvYlN0YXRlLmdldEZpbGVQYXRoKCksIG91dHB1dEZpbGVQYXRoKVxuICAgICAgam9iU3RhdGUuc2V0T3V0cHV0RmlsZVBhdGgob3V0cHV0RmlsZVBhdGgpXG4gICAgfVxuXG4gICAgcmV0dXJuIG91dHB1dEZpbGVQYXRoXG4gIH1cblxuICBhc3luYyBzaG93UmVzdWx0IChmaWxlUGF0aCwgbGluZU51bWJlciwgam9iU3RhdGUpIHtcbiAgICBpZiAoIXRoaXMuc2hvdWxkT3BlblJlc3VsdCgpKSB7IHJldHVybiB9XG5cbiAgICBhd2FpdCBsYXRleC5vcGVuZXIub3Blbihqb2JTdGF0ZS5nZXRPdXRwdXRGaWxlUGF0aCgpLCBmaWxlUGF0aCwgbGluZU51bWJlcilcbiAgfVxuXG4gIHNob3dFcnJvciAoam9iU3RhdGUpIHtcbiAgICBpZiAoIWpvYlN0YXRlLmdldExvZ01lc3NhZ2VzKCkpIHtcbiAgICAgIGxhdGV4LmxvZy5lcnJvcignUGFyc2luZyBvZiBsb2cgZmlsZXMgZmFpbGVkLicpXG4gICAgfSBlbHNlIGlmICgham9iU3RhdGUuZ2V0T3V0cHV0RmlsZVBhdGgoKSkge1xuICAgICAgbGF0ZXgubG9nLmVycm9yKCdObyBvdXRwdXQgZmlsZSBkZXRlY3RlZC4nKVxuICAgIH1cbiAgfVxuXG4gIGlzVmFsaWRTb3VyY2VGaWxlIChmaWxlUGF0aCwgZW5hYmxlTG9nZ2luZyA9IHRydWUpIHtcbiAgICBpZiAoIWZpbGVQYXRoKSB7XG4gICAgICBpZiAoZW5hYmxlTG9nZ2luZykge1xuICAgICAgICBsYXRleC5sb2cud2FybmluZygnRmlsZSBuZWVkcyB0byBiZSBzYXZlZCB0byBkaXNrIGJlZm9yZSBpdCBjYW4gYmUgcHJvY2Vzc2VkLicpXG4gICAgICB9XG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG5cbiAgICBpZiAoIWlzU291cmNlRmlsZShmaWxlUGF0aCkpIHtcbiAgICAgIGlmIChlbmFibGVMb2dnaW5nKSB7XG4gICAgICAgIGxhdGV4LmxvZy53YXJuaW5nKCdGaWxlIGRvZXMgbm90IGFwcGVhciB0byBiZSBhIHZhbGlkIHNvdXJjZSBmaWxlLicpXG4gICAgICB9XG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZVxuICB9XG5cbiAgYWx0ZXJQYXJlbnRQYXRoICh0YXJnZXRQYXRoLCBvcmlnaW5hbFBhdGgpIHtcbiAgICBjb25zdCB0YXJnZXREaXIgPSBwYXRoLmRpcm5hbWUodGFyZ2V0UGF0aClcbiAgICByZXR1cm4gcGF0aC5qb2luKHRhcmdldERpciwgcGF0aC5iYXNlbmFtZShvcmlnaW5hbFBhdGgpKVxuICB9XG5cbiAgc2hvdWxkTW92ZVJlc3VsdCAoam9iU3RhdGUpIHtcbiAgICByZXR1cm4gam9iU3RhdGUuZ2V0TW92ZVJlc3VsdFRvU291cmNlRGlyZWN0b3J5KCkgJiYgam9iU3RhdGUuZ2V0T3V0cHV0RGlyZWN0b3J5KCkubGVuZ3RoID4gMFxuICB9XG5cbiAgc2hvdWxkVXNlRGlDeSAoKSB7IHJldHVybiBhdG9tLmNvbmZpZy5nZXQoJ2xhdGV4LnVzZURpY3knKSB9XG5cbiAgc2hvdWxkT3BlblJlc3VsdCAoKSB7IHJldHVybiBhdG9tLmNvbmZpZy5nZXQoJ2xhdGV4Lm9wZW5SZXN1bHRBZnRlckJ1aWxkJykgfVxufVxuIl19