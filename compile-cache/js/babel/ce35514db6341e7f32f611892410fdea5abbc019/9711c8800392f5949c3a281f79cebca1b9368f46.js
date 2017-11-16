Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

// eslint-disable-next-line import/extensions, import/no-extraneous-dependencies

var _atom = require('atom');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _pluralize = require('pluralize');

var _pluralize2 = _interopRequireDefault(_pluralize);

var _atomLinter = require('atom-linter');

var helpers = _interopRequireWildcard(_atomLinter);

var _requestPromise = require('request-promise');

'use babel';

var DEFAULT_ARGS = ['--cache', 'false', '--force-exclusion', '--format', 'json', '--display-style-guide'];
var DOCUMENTATION_LIFETIME = 86400 * 1000; // 1 day TODO: Configurable?

var docsRuleCache = new Map();
var docsLastRetrieved = undefined;

var takeWhile = function takeWhile(source, predicate) {
  var result = [];
  var length = source.length;

  var i = 0;

  while (i < length && predicate(source[i], i)) {
    result.push(source[i]);
    i += 1;
  }

  return result;
};

var parseFromStd = function parseFromStd(stdout, stderr) {
  var parsed = undefined;
  try {
    parsed = JSON.parse(stdout);
  } catch (error) {
    // continue regardless of error
  }
  if (typeof parsed !== 'object') {
    throw new Error(stderr || stdout);
  }
  return parsed;
};

var getProjectDirectory = function getProjectDirectory(filePath) {
  return atom.project.relativizePath(filePath)[0] || _path2['default'].dirname(filePath);
};

// Retrieves style guide documentation with cached responses
var getMarkDown = _asyncToGenerator(function* (url) {
  var anchor = url.split('#')[1];

  if (new Date().getTime() - docsLastRetrieved < DOCUMENTATION_LIFETIME) {
    // If documentation is stale, clear cache
    docsRuleCache.clear();
  }

  if (docsRuleCache.has(anchor)) {
    return docsRuleCache.get(anchor);
  }

  var rawRulesMarkdown = undefined;
  try {
    rawRulesMarkdown = yield (0, _requestPromise.get)('https://raw.githubusercontent.com/bbatsov/ruby-style-guide/master/README.md');
  } catch (x) {
    return '***\nError retrieving documentation';
  }

  var byLine = rawRulesMarkdown.split('\n');
  // eslint-disable-next-line no-confusing-arrow
  var ruleAnchors = byLine.reduce(function (acc, line, idx) {
    return line.match(/\* <a name=/g) ? acc.concat([[idx, line]]) : acc;
  }, []);

  ruleAnchors.forEach(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2);

    var startingIndex = _ref2[0];
    var startingLine = _ref2[1];

    var ruleName = startingLine.split('"')[1];
    var beginSearch = byLine.slice(startingIndex + 1);

    // gobble all the documentation until you reach the next rule
    var documentationForRule = takeWhile(beginSearch, function (x) {
      return !x.match(/\* <a name=|##/);
    });
    var markdownOutput = '***\n'.concat(documentationForRule.join('\n'));

    docsRuleCache.set(ruleName, markdownOutput);
  });

  docsLastRetrieved = new Date().getTime();
  return docsRuleCache.get(anchor);
});

var forwardRubocopToLinter = function forwardRubocopToLinter(_ref3, file, editor) {
  var rawMessage = _ref3.message;
  var location = _ref3.location;
  var severity = _ref3.severity;
  var copName = _ref3.cop_name;

  var _rawMessage$split = rawMessage.split(/ \((.*)\)/, 2);

  var _rawMessage$split2 = _slicedToArray(_rawMessage$split, 2);

  var excerpt = _rawMessage$split2[0];
  var url = _rawMessage$split2[1];

  var position = undefined;
  if (location) {
    var line = location.line;
    var column = location.column;
    var _length = location.length;

    position = [[line - 1, column - 1], [line - 1, column + _length - 1]];
  } else {
    position = helpers.generateRange(editor, 0);
  }

  var severityMapping = {
    refactor: 'info',
    convention: 'info',
    warning: 'warning',
    error: 'error',
    fatal: 'error'
  };

  var linterMessage = {
    url: url,
    excerpt: excerpt + ' (' + copName + ')',
    severity: severityMapping[severity],
    description: url ? function () {
      return getMarkDown(url);
    } : null,
    location: {
      file: file,
      position: position
    }
  };
  return linterMessage;
};

exports['default'] = {
  activate: function activate() {
    var _this = this;

    require('atom-package-deps').install('linter-rubocop', true);

    this.subscriptions = new _atom.CompositeDisposable();

    // Register fix command
    this.subscriptions.add(atom.commands.add('atom-text-editor', {
      'linter-rubocop:fix-file': _asyncToGenerator(function* () {
        var textEditor = atom.workspace.getActiveTextEditor();

        if (!atom.workspace.isTextEditor(textEditor) || textEditor.isModified()) {
          // Abort for invalid or unsaved text editors
          return atom.notifications.addError('Linter-Rubocop: Please save before fixing');
        }

        var filePath = textEditor.getPath();
        var command = _this.command.split(/\s+/).filter(function (i) {
          return i;
        }).concat(DEFAULT_ARGS, '--auto-correct', filePath);
        var cwd = getProjectDirectory(filePath);

        var _ref4 = yield helpers.exec(command[0], command.slice(1), { cwd: cwd, stream: 'both' });

        var stdout = _ref4.stdout;
        var stderr = _ref4.stderr;

        var _parseFromStd = parseFromStd(stdout, stderr);

        var offenseCount = _parseFromStd.summary.offense_count;

        return offenseCount === 0 ? atom.notifications.addInfo('Linter-Rubocop: No fixes were made') : atom.notifications.addSuccess('Linter-Rubocop: Fixed ' + (0, _pluralize2['default'])('offenses', offenseCount, true));
      })
    }), atom.config.observe('linter-rubocop.command', function (value) {
      _this.command = value;
    }), atom.config.observe('linter-rubocop.disableWhenNoConfigFile', function (value) {
      _this.disableWhenNoConfigFile = value;
    }));
  },

  deactivate: function deactivate() {
    this.subscriptions.dispose();
  },

  provideLinter: function provideLinter() {
    var _this2 = this;

    return {
      name: 'RuboCop',
      grammarScopes: ['source.ruby', 'source.ruby.gemfile', 'source.ruby.rails', 'source.ruby.rspec', 'source.ruby.chef'],
      scope: 'file',
      lintsOnChange: true,
      lint: _asyncToGenerator(function* (editor) {
        var filePath = editor.getPath();

        if (_this2.disableWhenNoConfigFile === true) {
          var config = yield helpers.findAsync(filePath, '.rubocop.yml');
          if (config === null) {
            return [];
          }
        }

        var command = _this2.command.split(/\s+/).filter(function (i) {
          return i;
        }).concat(DEFAULT_ARGS, '--stdin', filePath);
        var stdin = editor.getText();
        var cwd = getProjectDirectory(filePath);
        var exexOptions = {
          cwd: cwd,
          stdin: stdin,
          stream: 'both',
          timeout: 10000,
          uniqueKey: 'linter-rubocop::' + filePath
        };

        var output = undefined;
        try {
          output = yield helpers.exec(command[0], command.slice(1), exexOptions);
        } catch (e) {
          if (e.message !== 'Process execution timed out') throw e;
          atom.notifications.addInfo('Linter-Rubocop: Linter timed out', {
            description: 'Make sure you are not running Rubocop with a slow-starting interpreter like JRuby. ' + 'If you are still seeing timeouts, consider running your linter `on save` and not `on change`, ' + 'or reference https://github.com/AtomLinter/linter-rubocop/issues/202 .'
          });
          return null;
        }
        // Process was canceled by newer process
        if (output === null) {
          return null;
        }

        var _parseFromStd2 = parseFromStd(output.stdout, output.stderr);

        var files = _parseFromStd2.files;

        var offenses = files && files[0] && files[0].offenses;
        return (offenses || []).map(function (offense) {
          return forwardRubocopToLinter(offense, filePath, editor);
        });
      })
    };
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2JpbGx5Ly5hdG9tL3BhY2thZ2VzL2xpbnRlci1ydWJvY29wL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztvQkFHb0MsTUFBTTs7b0JBQ3pCLE1BQU07Ozs7eUJBQ0QsV0FBVzs7OzswQkFDUixhQUFhOztJQUExQixPQUFPOzs4QkFDQyxpQkFBaUI7O0FBUHJDLFdBQVcsQ0FBQTs7QUFTWCxJQUFNLFlBQVksR0FBRyxDQUNuQixTQUFTLEVBQUUsT0FBTyxFQUNsQixtQkFBbUIsRUFDbkIsVUFBVSxFQUFFLE1BQU0sRUFDbEIsdUJBQXVCLENBQ3hCLENBQUE7QUFDRCxJQUFNLHNCQUFzQixHQUFHLEtBQUssR0FBRyxJQUFJLENBQUE7O0FBRTNDLElBQU0sYUFBYSxHQUFHLElBQUksR0FBRyxFQUFFLENBQUE7QUFDL0IsSUFBSSxpQkFBaUIsWUFBQSxDQUFBOztBQUVyQixJQUFNLFNBQVMsR0FBRyxTQUFaLFNBQVMsQ0FBSSxNQUFNLEVBQUUsU0FBUyxFQUFLO0FBQ3ZDLE1BQU0sTUFBTSxHQUFHLEVBQUUsQ0FBQTtNQUNULE1BQU0sR0FBSyxNQUFNLENBQWpCLE1BQU07O0FBQ2QsTUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFBOztBQUVULFNBQU8sQ0FBQyxHQUFHLE1BQU0sSUFBSSxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFO0FBQzVDLFVBQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDdEIsS0FBQyxJQUFJLENBQUMsQ0FBQTtHQUNQOztBQUVELFNBQU8sTUFBTSxDQUFBO0NBQ2QsQ0FBQTs7QUFFRCxJQUFNLFlBQVksR0FBRyxTQUFmLFlBQVksQ0FBSSxNQUFNLEVBQUUsTUFBTSxFQUFLO0FBQ3ZDLE1BQUksTUFBTSxZQUFBLENBQUE7QUFDVixNQUFJO0FBQ0YsVUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLENB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QUFFLE1BQU0sQ0FBQyxNQUFNLENBQUM7O1lBQXBELEtBQUssa0JBQUwsS0FBSzs7QUFDYixZQUFNLFFBQVEsR0FBRyxLQUFLLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUE7QUFDdkQsZUFBTyxDQUFDLFFBQVEsSUFBSSxFQUFFLENBQUEsQ0FBRSxHQUFHLENBQUMsVUFBQSxPQUFPO2lCQUFJLHNCQUFzQixDQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxDQUFDO1NBQUEsQ0FBQyxDQUFBO09BQzFGLENBQUE7S0FDRixDQUFBO0dBQ0Y7Q0FDRiIsImZpbGUiOiIvaG9tZS9iaWxseS8uYXRvbS9wYWNrYWdlcy9saW50ZXItcnVib2NvcC9zcmMvaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L2V4dGVuc2lvbnMsIGltcG9ydC9uby1leHRyYW5lb3VzLWRlcGVuZGVuY2llc1xuaW1wb3J0IHsgQ29tcG9zaXRlRGlzcG9zYWJsZSB9IGZyb20gJ2F0b20nXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xuaW1wb3J0IHBsdXJhbGl6ZSBmcm9tICdwbHVyYWxpemUnXG5pbXBvcnQgKiBhcyBoZWxwZXJzIGZyb20gJ2F0b20tbGludGVyJ1xuaW1wb3J0IHsgZ2V0IH0gZnJvbSAncmVxdWVzdC1wcm9taXNlJ1xuXG5jb25zdCBERUZBVUxUX0FSR1MgPSBbXG4gICctLWNhY2hlJywgJ2ZhbHNlJyxcbiAgJy0tZm9yY2UtZXhjbHVzaW9uJyxcbiAgJy0tZm9ybWF0JywgJ2pzb24nLFxuICAnLS1kaXNwbGF5LXN0eWxlLWd1aWRlJyxcbl1cbmNvbnN0IERPQ1VNRU5UQVRJT05fTElGRVRJTUUgPSA4NjQwMCAqIDEwMDAgLy8gMSBkYXkgVE9ETzogQ29uZmlndXJhYmxlP1xuXG5jb25zdCBkb2NzUnVsZUNhY2hlID0gbmV3IE1hcCgpXG5sZXQgZG9jc0xhc3RSZXRyaWV2ZWRcblxuY29uc3QgdGFrZVdoaWxlID0gKHNvdXJjZSwgcHJlZGljYXRlKSA9PiB7XG4gIGNvbnN0IHJlc3VsdCA9IFtdXG4gIGNvbnN0IHsgbGVuZ3RoIH0gPSBzb3VyY2VcbiAgbGV0IGkgPSAwXG5cbiAgd2hpbGUgKGkgPCBsZW5ndGggJiYgcHJlZGljYXRlKHNvdXJjZVtpXSwgaSkpIHtcbiAgICByZXN1bHQucHVzaChzb3VyY2VbaV0pXG4gICAgaSArPSAxXG4gIH1cblxuICByZXR1cm4gcmVzdWx0XG59XG5cbmNvbnN0IHBhcnNlRnJvbVN0ZCA9IChzdGRvdXQsIHN0ZGVycikgPT4ge1xuICBsZXQgcGFyc2VkXG4gIHRyeSB7XG4gICAgcGFyc2VkID0gSlNPTi5wYXJzZShzdGRvdXQpXG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgLy8gY29udGludWUgcmVnYXJkbGVzcyBvZiBlcnJvclxuICB9XG4gIGlmICh0eXBlb2YgcGFyc2VkICE9PSAnb2JqZWN0JykgeyB0aHJvdyBuZXcgRXJyb3Ioc3RkZXJyIHx8IHN0ZG91dCkgfVxuICByZXR1cm4gcGFyc2VkXG59XG5cbmNvbnN0IGdldFByb2plY3REaXJlY3RvcnkgPSBmaWxlUGF0aCA9PlxuICBhdG9tLnByb2plY3QucmVsYXRpdml6ZVBhdGgoZmlsZVBhdGgpWzBdIHx8IHBhdGguZGlybmFtZShmaWxlUGF0aClcblxuXG4vLyBSZXRyaWV2ZXMgc3R5bGUgZ3VpZGUgZG9jdW1lbnRhdGlvbiB3aXRoIGNhY2hlZCByZXNwb25zZXNcbmNvbnN0IGdldE1hcmtEb3duID0gYXN5bmMgKHVybCkgPT4ge1xuICBjb25zdCBhbmNob3IgPSB1cmwuc3BsaXQoJyMnKVsxXVxuXG4gIGlmIChuZXcgRGF0ZSgpLmdldFRpbWUoKSAtIGRvY3NMYXN0UmV0cmlldmVkIDwgRE9DVU1FTlRBVElPTl9MSUZFVElNRSkge1xuICAgIC8vIElmIGRvY3VtZW50YXRpb24gaXMgc3RhbGUsIGNsZWFyIGNhY2hlXG4gICAgZG9jc1J1bGVDYWNoZS5jbGVhcigpXG4gIH1cblxuICBpZiAoZG9jc1J1bGVDYWNoZS5oYXMoYW5jaG9yKSkgeyByZXR1cm4gZG9jc1J1bGVDYWNoZS5nZXQoYW5jaG9yKSB9XG5cbiAgbGV0IHJhd1J1bGVzTWFya2Rvd25cbiAgdHJ5IHtcbiAgICByYXdSdWxlc01hcmtkb3duID0gYXdhaXQgZ2V0KCdodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vYmJhdHNvdi9ydWJ5LXN0eWxlLWd1aWRlL21hc3Rlci9SRUFETUUubWQnKVxuICB9IGNhdGNoICh4KSB7XG4gICAgcmV0dXJuICcqKipcXG5FcnJvciByZXRyaWV2aW5nIGRvY3VtZW50YXRpb24nXG4gIH1cblxuICBjb25zdCBieUxpbmUgPSByYXdSdWxlc01hcmtkb3duLnNwbGl0KCdcXG4nKVxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uZnVzaW5nLWFycm93XG4gIGNvbnN0IHJ1bGVBbmNob3JzID0gYnlMaW5lLnJlZHVjZShcbiAgICAoYWNjLCBsaW5lLCBpZHgpID0+XG4gICAgICAobGluZS5tYXRjaCgvXFwqIDxhIG5hbWU9L2cpID8gYWNjLmNvbmNhdChbW2lkeCwgbGluZV1dKSA6IGFjYyksXG4gICAgW10sXG4gIClcblxuICBydWxlQW5jaG9ycy5mb3JFYWNoKChbc3RhcnRpbmdJbmRleCwgc3RhcnRpbmdMaW5lXSkgPT4ge1xuICAgIGNvbnN0IHJ1bGVOYW1lID0gc3RhcnRpbmdMaW5lLnNwbGl0KCdcIicpWzFdXG4gICAgY29uc3QgYmVnaW5TZWFyY2ggPSBieUxpbmUuc2xpY2Uoc3RhcnRpbmdJbmRleCArIDEpXG5cbiAgICAvLyBnb2JibGUgYWxsIHRoZSBkb2N1bWVudGF0aW9uIHVudGlsIHlvdSByZWFjaCB0aGUgbmV4dCBydWxlXG4gICAgY29uc3QgZG9jdW1lbnRhdGlvbkZvclJ1bGUgPSB0YWtlV2hpbGUoYmVnaW5TZWFyY2gsIHggPT4gIXgubWF0Y2goL1xcKiA8YSBuYW1lPXwjIy8pKVxuICAgIGNvbnN0IG1hcmtkb3duT3V0cHV0ID0gJyoqKlxcbicuY29uY2F0KGRvY3VtZW50YXRpb25Gb3JSdWxlLmpvaW4oJ1xcbicpKVxuXG4gICAgZG9jc1J1bGVDYWNoZS5zZXQocnVsZU5hbWUsIG1hcmtkb3duT3V0cHV0KVxuICB9KVxuXG4gIGRvY3NMYXN0UmV0cmlldmVkID0gbmV3IERhdGUoKS5nZXRUaW1lKClcbiAgcmV0dXJuIGRvY3NSdWxlQ2FjaGUuZ2V0KGFuY2hvcilcbn1cblxuY29uc3QgZm9yd2FyZFJ1Ym9jb3BUb0xpbnRlciA9XG4gICh7XG4gICAgbWVzc2FnZTogcmF3TWVzc2FnZSwgbG9jYXRpb24sIHNldmVyaXR5LCBjb3BfbmFtZTogY29wTmFtZSxcbiAgfSwgZmlsZSwgZWRpdG9yKSA9PiB7XG4gICAgY29uc3QgW2V4Y2VycHQsIHVybF0gPSByYXdNZXNzYWdlLnNwbGl0KC8gXFwoKC4qKVxcKS8sIDIpXG4gICAgbGV0IHBvc2l0aW9uXG4gICAgaWYgKGxvY2F0aW9uKSB7XG4gICAgICBjb25zdCB7IGxpbmUsIGNvbHVtbiwgbGVuZ3RoIH0gPSBsb2NhdGlvblxuICAgICAgcG9zaXRpb24gPSBbW2xpbmUgLSAxLCBjb2x1bW4gLSAxXSwgW2xpbmUgLSAxLCAoY29sdW1uICsgbGVuZ3RoKSAtIDFdXVxuICAgIH0gZWxzZSB7XG4gICAgICBwb3NpdGlvbiA9IGhlbHBlcnMuZ2VuZXJhdGVSYW5nZShlZGl0b3IsIDApXG4gICAgfVxuXG4gICAgY29uc3Qgc2V2ZXJpdHlNYXBwaW5nID0ge1xuICAgICAgcmVmYWN0b3I6ICdpbmZvJyxcbiAgICAgIGNvbnZlbnRpb246ICdpbmZvJyxcbiAgICAgIHdhcm5pbmc6ICd3YXJuaW5nJyxcbiAgICAgIGVycm9yOiAnZXJyb3InLFxuICAgICAgZmF0YWw6ICdlcnJvcicsXG4gICAgfVxuXG4gICAgY29uc3QgbGludGVyTWVzc2FnZSA9IHtcbiAgICAgIHVybCxcbiAgICAgIGV4Y2VycHQ6IGAke2V4Y2VycHR9ICgke2NvcE5hbWV9KWAsXG4gICAgICBzZXZlcml0eTogc2V2ZXJpdHlNYXBwaW5nW3NldmVyaXR5XSxcbiAgICAgIGRlc2NyaXB0aW9uOiB1cmwgPyAoKSA9PiBnZXRNYXJrRG93bih1cmwpIDogbnVsbCxcbiAgICAgIGxvY2F0aW9uOiB7XG4gICAgICAgIGZpbGUsXG4gICAgICAgIHBvc2l0aW9uLFxuICAgICAgfSxcbiAgICB9XG4gICAgcmV0dXJuIGxpbnRlck1lc3NhZ2VcbiAgfVxuXG5leHBvcnQgZGVmYXVsdCB7XG4gIGFjdGl2YXRlKCkge1xuICAgIHJlcXVpcmUoJ2F0b20tcGFja2FnZS1kZXBzJykuaW5zdGFsbCgnbGludGVyLXJ1Ym9jb3AnLCB0cnVlKVxuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuXG4gICAgLy8gUmVnaXN0ZXIgZml4IGNvbW1hbmRcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20tdGV4dC1lZGl0b3InLCB7XG4gICAgICAgICdsaW50ZXItcnVib2NvcDpmaXgtZmlsZSc6IGFzeW5jICgpID0+IHtcbiAgICAgICAgICBjb25zdCB0ZXh0RWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG5cbiAgICAgICAgICBpZiAoIWF0b20ud29ya3NwYWNlLmlzVGV4dEVkaXRvcih0ZXh0RWRpdG9yKSB8fCB0ZXh0RWRpdG9yLmlzTW9kaWZpZWQoKSkge1xuICAgICAgICAgICAgLy8gQWJvcnQgZm9yIGludmFsaWQgb3IgdW5zYXZlZCB0ZXh0IGVkaXRvcnNcbiAgICAgICAgICAgIHJldHVybiBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IoJ0xpbnRlci1SdWJvY29wOiBQbGVhc2Ugc2F2ZSBiZWZvcmUgZml4aW5nJylcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjb25zdCBmaWxlUGF0aCA9IHRleHRFZGl0b3IuZ2V0UGF0aCgpXG4gICAgICAgICAgY29uc3QgY29tbWFuZCA9IHRoaXMuY29tbWFuZFxuICAgICAgICAgICAgLnNwbGl0KC9cXHMrLylcbiAgICAgICAgICAgIC5maWx0ZXIoaSA9PiBpKVxuICAgICAgICAgICAgLmNvbmNhdChERUZBVUxUX0FSR1MsICctLWF1dG8tY29ycmVjdCcsIGZpbGVQYXRoKVxuICAgICAgICAgIGNvbnN0IGN3ZCA9IGdldFByb2plY3REaXJlY3RvcnkoZmlsZVBhdGgpXG4gICAgICAgICAgY29uc3QgeyBzdGRvdXQsIHN0ZGVyciB9ID0gYXdhaXQgaGVscGVycy5leGVjKGNvbW1hbmRbMF0sIGNvbW1hbmQuc2xpY2UoMSksIHsgY3dkLCBzdHJlYW06ICdib3RoJyB9KVxuICAgICAgICAgIGNvbnN0IHsgc3VtbWFyeTogeyBvZmZlbnNlX2NvdW50OiBvZmZlbnNlQ291bnQgfSB9ID0gcGFyc2VGcm9tU3RkKHN0ZG91dCwgc3RkZXJyKVxuICAgICAgICAgIHJldHVybiBvZmZlbnNlQ291bnQgPT09IDAgP1xuICAgICAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEluZm8oJ0xpbnRlci1SdWJvY29wOiBObyBmaXhlcyB3ZXJlIG1hZGUnKSA6XG4gICAgICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkU3VjY2VzcyhgTGludGVyLVJ1Ym9jb3A6IEZpeGVkICR7cGx1cmFsaXplKCdvZmZlbnNlcycsIG9mZmVuc2VDb3VudCwgdHJ1ZSl9YClcbiAgICAgICAgfSxcbiAgICAgIH0pLFxuICAgICAgYXRvbS5jb25maWcub2JzZXJ2ZSgnbGludGVyLXJ1Ym9jb3AuY29tbWFuZCcsICh2YWx1ZSkgPT4ge1xuICAgICAgICB0aGlzLmNvbW1hbmQgPSB2YWx1ZVxuICAgICAgfSksXG4gICAgICBhdG9tLmNvbmZpZy5vYnNlcnZlKCdsaW50ZXItcnVib2NvcC5kaXNhYmxlV2hlbk5vQ29uZmlnRmlsZScsICh2YWx1ZSkgPT4ge1xuICAgICAgICB0aGlzLmRpc2FibGVXaGVuTm9Db25maWdGaWxlID0gdmFsdWVcbiAgICAgIH0pLFxuICAgIClcbiAgfSxcblxuICBkZWFjdGl2YXRlKCkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgfSxcblxuICBwcm92aWRlTGludGVyKCkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lOiAnUnVib0NvcCcsXG4gICAgICBncmFtbWFyU2NvcGVzOiBbXG4gICAgICAgICdzb3VyY2UucnVieScsXG4gICAgICAgICdzb3VyY2UucnVieS5nZW1maWxlJyxcbiAgICAgICAgJ3NvdXJjZS5ydWJ5LnJhaWxzJyxcbiAgICAgICAgJ3NvdXJjZS5ydWJ5LnJzcGVjJyxcbiAgICAgICAgJ3NvdXJjZS5ydWJ5LmNoZWYnLFxuICAgICAgXSxcbiAgICAgIHNjb3BlOiAnZmlsZScsXG4gICAgICBsaW50c09uQ2hhbmdlOiB0cnVlLFxuICAgICAgbGludDogYXN5bmMgKGVkaXRvcikgPT4ge1xuICAgICAgICBjb25zdCBmaWxlUGF0aCA9IGVkaXRvci5nZXRQYXRoKClcblxuICAgICAgICBpZiAodGhpcy5kaXNhYmxlV2hlbk5vQ29uZmlnRmlsZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgIGNvbnN0IGNvbmZpZyA9IGF3YWl0IGhlbHBlcnMuZmluZEFzeW5jKGZpbGVQYXRoLCAnLnJ1Ym9jb3AueW1sJylcbiAgICAgICAgICBpZiAoY29uZmlnID09PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gW11cbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBjb21tYW5kID0gdGhpcy5jb21tYW5kXG4gICAgICAgICAgLnNwbGl0KC9cXHMrLylcbiAgICAgICAgICAuZmlsdGVyKGkgPT4gaSlcbiAgICAgICAgICAuY29uY2F0KERFRkFVTFRfQVJHUywgJy0tc3RkaW4nLCBmaWxlUGF0aClcbiAgICAgICAgY29uc3Qgc3RkaW4gPSBlZGl0b3IuZ2V0VGV4dCgpXG4gICAgICAgIGNvbnN0IGN3ZCA9IGdldFByb2plY3REaXJlY3RvcnkoZmlsZVBhdGgpXG4gICAgICAgIGNvbnN0IGV4ZXhPcHRpb25zID0ge1xuICAgICAgICAgIGN3ZCxcbiAgICAgICAgICBzdGRpbixcbiAgICAgICAgICBzdHJlYW06ICdib3RoJyxcbiAgICAgICAgICB0aW1lb3V0OiAxMDAwMCxcbiAgICAgICAgICB1bmlxdWVLZXk6IGBsaW50ZXItcnVib2NvcDo6JHtmaWxlUGF0aH1gLFxuICAgICAgICB9XG5cbiAgICAgICAgbGV0IG91dHB1dFxuICAgICAgICB0cnkge1xuICAgICAgICAgIG91dHB1dCA9IGF3YWl0IGhlbHBlcnMuZXhlYyhjb21tYW5kWzBdLCBjb21tYW5kLnNsaWNlKDEpLCBleGV4T3B0aW9ucylcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIGlmIChlLm1lc3NhZ2UgIT09ICdQcm9jZXNzIGV4ZWN1dGlvbiB0aW1lZCBvdXQnKSB0aHJvdyBlXG4gICAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEluZm8oXG4gICAgICAgICAgICAnTGludGVyLVJ1Ym9jb3A6IExpbnRlciB0aW1lZCBvdXQnLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogJ01ha2Ugc3VyZSB5b3UgYXJlIG5vdCBydW5uaW5nIFJ1Ym9jb3Agd2l0aCBhIHNsb3ctc3RhcnRpbmcgaW50ZXJwcmV0ZXIgbGlrZSBKUnVieS4gJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAnSWYgeW91IGFyZSBzdGlsbCBzZWVpbmcgdGltZW91dHMsIGNvbnNpZGVyIHJ1bm5pbmcgeW91ciBsaW50ZXIgYG9uIHNhdmVgIGFuZCBub3QgYG9uIGNoYW5nZWAsICcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgJ29yIHJlZmVyZW5jZSBodHRwczovL2dpdGh1Yi5jb20vQXRvbUxpbnRlci9saW50ZXItcnVib2NvcC9pc3N1ZXMvMjAyIC4nLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICApXG4gICAgICAgICAgcmV0dXJuIG51bGxcbiAgICAgICAgfVxuICAgICAgICAvLyBQcm9jZXNzIHdhcyBjYW5jZWxlZCBieSBuZXdlciBwcm9jZXNzXG4gICAgICAgIGlmIChvdXRwdXQgPT09IG51bGwpIHsgcmV0dXJuIG51bGwgfVxuXG4gICAgICAgIGNvbnN0IHsgZmlsZXMgfSA9IHBhcnNlRnJvbVN0ZChvdXRwdXQuc3Rkb3V0LCBvdXRwdXQuc3RkZXJyKVxuICAgICAgICBjb25zdCBvZmZlbnNlcyA9IGZpbGVzICYmIGZpbGVzWzBdICYmIGZpbGVzWzBdLm9mZmVuc2VzXG4gICAgICAgIHJldHVybiAob2ZmZW5zZXMgfHwgW10pLm1hcChvZmZlbnNlID0+IGZvcndhcmRSdWJvY29wVG9MaW50ZXIob2ZmZW5zZSwgZmlsZVBhdGgsIGVkaXRvcikpXG4gICAgICB9LFxuICAgIH1cbiAgfSxcbn1cbiJdfQ==