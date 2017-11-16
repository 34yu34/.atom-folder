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
    }));

    // Config observers
    this.subscriptions.add(atom.config.observe('linter-rubocop.command', function (value) {
      _this.command = value;
    }));
    this.subscriptions.add(atom.config.observe('linter-rubocop.disableWhenNoConfigFile', function (value) {
      _this.disableWhenNoConfigFile = value;
    }));
    this.subscriptions.add(atom.config.observe('linter-rubocop.linterTimeout', function (value) {
      _this.linterTimeout = value;
    }));
  },

  deactivate: function deactivate() {
    this.subscriptions.dispose();
  },

  provideLinter: function provideLinter() {
    var _this2 = this;

    return {
      name: 'RuboCop',
      grammarScopes: ['source.ruby', 'source.ruby.rails', 'source.ruby.rspec', 'source.ruby.chef'],
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
          timeout: _this2.linterTimeout,
          uniqueKey: 'linter-rubocop::' + filePath
        };
        var output = yield helpers.exec(command[0], command.slice(1), exexOptions);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2JpbGx5Ly5hdG9tL3BhY2thZ2VzL2xpbnRlci1ydWJvY29wL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztvQkFHb0MsTUFBTTs7b0JBQ3pCLE1BQU07Ozs7eUJBQ0QsV0FBVzs7OzswQkFDUixhQUFhOztJQUExQixPQUFPOzs4QkFDQyxpQkFBaUI7O0FBUHJDLFdBQVcsQ0FBQTs7QUFTWCxJQUFNLFlBQVksR0FBRyxDQUNuQixTQUFTLEVBQUUsT0FBTyxFQUNsQixtQkFBbUIsRUFDbkIsVUFBVSxFQUFFLE1BQU0sRUFDbEIsdUJBQXVCLENBQ3hCLENBQUE7QUFDRCxJQUFNLHNCQUFzQixHQUFHLEtBQUssR0FBRyxJQUFJLENBQUE7O0FBRTNDLElBQU0sYUFBYSxHQUFHLElBQUksR0FBRyxFQUFFLENBQUE7QUFDL0IsSUFBSSxpQkFBaUIsWUFBQSxDQUFBOztBQUVyQixJQUFNLFNBQVMsR0FBRyxTQUFaLFNBQVMsQ0FBSSxNQUFNLEVBQUUsU0FBUyxFQUFLO0FBQ3ZDLE1BQU0sTUFBTSxHQUFHLEVBQUUsQ0FBQTtBQUNqQixNQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFBO0FBQzVCLE1BQUksQ0FBQyxHQUFHLENBQUMsQ0FBQTs7QUFFVCxTQUFPLENBQUMsR0FBRyxNQUFNLElBQUksU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRTtBQUM1QyxVQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQ3RCLEtBQUMsSUFBSSxDQUFDLENBQUE7R0FDUDs7QUFFRCxTQUFPLE1BQU0sQ0FBQTtDQUNkLENBQUE7O0FBRUQsSUFBTSxZQUFZLEdBQUcsU0FBZixZQUFZLENBQUksTUFBTSxFQUFFLE1BQU0sRUFBSztBQUN2QyxNQUFJLE1BQU0sWUFBQSxDQUFBO0FBQ1YsTUFBSTtBQUNGLFVBQU0sR0FBRyxJQUFJLENB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Q0FBQzs7WUFBcEQsS0FBSyxrQkFBTCxLQUFLOztBQUNiLFlBQU0sUUFBUSxHQUFHLEtBQUssSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQTtBQUN2RCxlQUFPLENBQUMsUUFBUSxJQUFJLEVBQUUsQ0FBQSxDQUFFLEdBQUcsQ0FBQyxVQUFBLE9BQU87aUJBQUksc0JBQXNCLENBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLENBQUM7U0FBQSxDQUFDLENBQUE7T0FDMUYsQ0FBQTtLQUNGLENBQUE7R0FDRjtDQUNGIiwiZmlsZSI6Ii9ob21lL2JpbGx5Ly5hdG9tL3BhY2thZ2VzL2xpbnRlci1ydWJvY29wL3NyYy9pbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBpbXBvcnQvZXh0ZW5zaW9ucywgaW1wb3J0L25vLWV4dHJhbmVvdXMtZGVwZW5kZW5jaWVzXG5pbXBvcnQgeyBDb21wb3NpdGVEaXNwb3NhYmxlIH0gZnJvbSAnYXRvbSdcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXG5pbXBvcnQgcGx1cmFsaXplIGZyb20gJ3BsdXJhbGl6ZSdcbmltcG9ydCAqIGFzIGhlbHBlcnMgZnJvbSAnYXRvbS1saW50ZXInXG5pbXBvcnQgeyBnZXQgfSBmcm9tICdyZXF1ZXN0LXByb21pc2UnXG5cbmNvbnN0IERFRkFVTFRfQVJHUyA9IFtcbiAgJy0tY2FjaGUnLCAnZmFsc2UnLFxuICAnLS1mb3JjZS1leGNsdXNpb24nLFxuICAnLS1mb3JtYXQnLCAnanNvbicsXG4gICctLWRpc3BsYXktc3R5bGUtZ3VpZGUnLFxuXVxuY29uc3QgRE9DVU1FTlRBVElPTl9MSUZFVElNRSA9IDg2NDAwICogMTAwMCAvLyAxIGRheSBUT0RPOiBDb25maWd1cmFibGU/XG5cbmNvbnN0IGRvY3NSdWxlQ2FjaGUgPSBuZXcgTWFwKClcbmxldCBkb2NzTGFzdFJldHJpZXZlZFxuXG5jb25zdCB0YWtlV2hpbGUgPSAoc291cmNlLCBwcmVkaWNhdGUpID0+IHtcbiAgY29uc3QgcmVzdWx0ID0gW11cbiAgY29uc3QgbGVuZ3RoID0gc291cmNlLmxlbmd0aFxuICBsZXQgaSA9IDBcblxuICB3aGlsZSAoaSA8IGxlbmd0aCAmJiBwcmVkaWNhdGUoc291cmNlW2ldLCBpKSkge1xuICAgIHJlc3VsdC5wdXNoKHNvdXJjZVtpXSlcbiAgICBpICs9IDFcbiAgfVxuXG4gIHJldHVybiByZXN1bHRcbn1cblxuY29uc3QgcGFyc2VGcm9tU3RkID0gKHN0ZG91dCwgc3RkZXJyKSA9PiB7XG4gIGxldCBwYXJzZWRcbiAgdHJ5IHtcbiAgICBwYXJzZWQgPSBKU09OLnBhcnNlKHN0ZG91dClcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAvLyBjb250aW51ZSByZWdhcmRsZXNzIG9mIGVycm9yXG4gIH1cbiAgaWYgKHR5cGVvZiBwYXJzZWQgIT09ICdvYmplY3QnKSB7IHRocm93IG5ldyBFcnJvcihzdGRlcnIgfHwgc3Rkb3V0KSB9XG4gIHJldHVybiBwYXJzZWRcbn1cblxuY29uc3QgZ2V0UHJvamVjdERpcmVjdG9yeSA9IGZpbGVQYXRoID0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdG9tLnByb2plY3QucmVsYXRpdml6ZVBhdGgoZmlsZVBhdGgpWzBdIHx8IHBhdGguZGlybmFtZShmaWxlUGF0aClcblxuXG4vLyBSZXRyaWV2ZXMgc3R5bGUgZ3VpZGUgZG9jdW1lbnRhdGlvbiB3aXRoIGNhY2hlZCByZXNwb25zZXNcbmNvbnN0IGdldE1hcmtEb3duID0gYXN5bmMgKHVybCkgPT4ge1xuICBjb25zdCBhbmNob3IgPSB1cmwuc3BsaXQoJyMnKVsxXVxuXG4gIGlmIChuZXcgRGF0ZSgpLmdldFRpbWUoKSAtIGRvY3NMYXN0UmV0cmlldmVkIDwgRE9DVU1FTlRBVElPTl9MSUZFVElNRSkge1xuICAgIC8vIElmIGRvY3VtZW50YXRpb24gaXMgc3RhbGUsIGNsZWFyIGNhY2hlXG4gICAgZG9jc1J1bGVDYWNoZS5jbGVhcigpXG4gIH1cblxuICBpZiAoZG9jc1J1bGVDYWNoZS5oYXMoYW5jaG9yKSkgeyByZXR1cm4gZG9jc1J1bGVDYWNoZS5nZXQoYW5jaG9yKSB9XG5cbiAgbGV0IHJhd1J1bGVzTWFya2Rvd25cbiAgdHJ5IHtcbiAgICByYXdSdWxlc01hcmtkb3duID0gYXdhaXQgZ2V0KCdodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vYmJhdHNvdi9ydWJ5LXN0eWxlLWd1aWRlL21hc3Rlci9SRUFETUUubWQnKVxuICB9IGNhdGNoICh4KSB7XG4gICAgcmV0dXJuICcqKipcXG5FcnJvciByZXRyaWV2aW5nIGRvY3VtZW50YXRpb24nXG4gIH1cblxuICBjb25zdCBieUxpbmUgPSByYXdSdWxlc01hcmtkb3duLnNwbGl0KCdcXG4nKVxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uZnVzaW5nLWFycm93XG4gIGNvbnN0IHJ1bGVBbmNob3JzID0gYnlMaW5lLnJlZHVjZSgoYWNjLCBsaW5lLCBpZHgpID0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpbmUubWF0Y2goL1xcKiA8YSBuYW1lPS9nKSA/IGFjYy5jb25jYXQoW1tpZHgsIGxpbmVdXSkgOiBhY2MsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtdKVxuXG4gIHJ1bGVBbmNob3JzLmZvckVhY2goKFtzdGFydGluZ0luZGV4LCBzdGFydGluZ0xpbmVdKSA9PiB7XG4gICAgY29uc3QgcnVsZU5hbWUgPSBzdGFydGluZ0xpbmUuc3BsaXQoJ1wiJylbMV1cbiAgICBjb25zdCBiZWdpblNlYXJjaCA9IGJ5TGluZS5zbGljZShzdGFydGluZ0luZGV4ICsgMSlcblxuICAgIC8vIGdvYmJsZSBhbGwgdGhlIGRvY3VtZW50YXRpb24gdW50aWwgeW91IHJlYWNoIHRoZSBuZXh0IHJ1bGVcbiAgICBjb25zdCBkb2N1bWVudGF0aW9uRm9yUnVsZSA9IHRha2VXaGlsZShiZWdpblNlYXJjaCwgeCA9PiAheC5tYXRjaCgvXFwqIDxhIG5hbWU9fCMjLykpXG4gICAgY29uc3QgbWFya2Rvd25PdXRwdXQgPSAnKioqXFxuJy5jb25jYXQoZG9jdW1lbnRhdGlvbkZvclJ1bGUuam9pbignXFxuJykpXG5cbiAgICBkb2NzUnVsZUNhY2hlLnNldChydWxlTmFtZSwgbWFya2Rvd25PdXRwdXQpXG4gIH0pXG5cbiAgZG9jc0xhc3RSZXRyaWV2ZWQgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKVxuICByZXR1cm4gZG9jc1J1bGVDYWNoZS5nZXQoYW5jaG9yKVxufVxuXG5jb25zdCBmb3J3YXJkUnVib2NvcFRvTGludGVyID1cbiAgKHsgbWVzc2FnZTogcmF3TWVzc2FnZSwgbG9jYXRpb24sIHNldmVyaXR5LCBjb3BfbmFtZTogY29wTmFtZSB9LCBmaWxlLCBlZGl0b3IpID0+IHtcbiAgICBjb25zdCBbZXhjZXJwdCwgdXJsXSA9IHJhd01lc3NhZ2Uuc3BsaXQoLyBcXCgoLiopXFwpLywgMilcbiAgICBsZXQgcG9zaXRpb25cbiAgICBpZiAobG9jYXRpb24pIHtcbiAgICAgIGNvbnN0IHsgbGluZSwgY29sdW1uLCBsZW5ndGggfSA9IGxvY2F0aW9uXG4gICAgICBwb3NpdGlvbiA9IFtbbGluZSAtIDEsIGNvbHVtbiAtIDFdLCBbbGluZSAtIDEsIChjb2x1bW4gKyBsZW5ndGgpIC0gMV1dXG4gICAgfSBlbHNlIHtcbiAgICAgIHBvc2l0aW9uID0gaGVscGVycy5nZW5lcmF0ZVJhbmdlKGVkaXRvciwgMClcbiAgICB9XG5cbiAgICBjb25zdCBzZXZlcml0eU1hcHBpbmcgPSB7XG4gICAgICByZWZhY3RvcjogJ2luZm8nLFxuICAgICAgY29udmVudGlvbjogJ2luZm8nLFxuICAgICAgd2FybmluZzogJ3dhcm5pbmcnLFxuICAgICAgZXJyb3I6ICdlcnJvcicsXG4gICAgICBmYXRhbDogJ2Vycm9yJyxcbiAgICB9XG5cbiAgICBjb25zdCBsaW50ZXJNZXNzYWdlID0ge1xuICAgICAgdXJsLFxuICAgICAgZXhjZXJwdDogYCR7ZXhjZXJwdH0gKCR7Y29wTmFtZX0pYCxcbiAgICAgIHNldmVyaXR5OiBzZXZlcml0eU1hcHBpbmdbc2V2ZXJpdHldLFxuICAgICAgZGVzY3JpcHRpb246IHVybCA/ICgpID0+IGdldE1hcmtEb3duKHVybCkgOiBudWxsLFxuICAgICAgbG9jYXRpb246IHtcbiAgICAgICAgZmlsZSxcbiAgICAgICAgcG9zaXRpb24sXG4gICAgICB9LFxuICAgIH1cbiAgICByZXR1cm4gbGludGVyTWVzc2FnZVxuICB9XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgYWN0aXZhdGUoKSB7XG4gICAgcmVxdWlyZSgnYXRvbS1wYWNrYWdlLWRlcHMnKS5pbnN0YWxsKCdsaW50ZXItcnVib2NvcCcsIHRydWUpXG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG5cbiAgICAvLyBSZWdpc3RlciBmaXggY29tbWFuZFxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICBhdG9tLmNvbW1hbmRzLmFkZCgnYXRvbS10ZXh0LWVkaXRvcicsIHtcbiAgICAgICAgJ2xpbnRlci1ydWJvY29wOmZpeC1maWxlJzogYXN5bmMgKCkgPT4ge1xuICAgICAgICAgIGNvbnN0IHRleHRFZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcblxuICAgICAgICAgIGlmICghYXRvbS53b3Jrc3BhY2UuaXNUZXh0RWRpdG9yKHRleHRFZGl0b3IpIHx8IHRleHRFZGl0b3IuaXNNb2RpZmllZCgpKSB7XG4gICAgICAgICAgICAvLyBBYm9ydCBmb3IgaW52YWxpZCBvciB1bnNhdmVkIHRleHQgZWRpdG9yc1xuICAgICAgICAgICAgcmV0dXJuIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcignTGludGVyLVJ1Ym9jb3A6IFBsZWFzZSBzYXZlIGJlZm9yZSBmaXhpbmcnKVxuICAgICAgICAgIH1cblxuICAgICAgICAgIGNvbnN0IGZpbGVQYXRoID0gdGV4dEVkaXRvci5nZXRQYXRoKClcbiAgICAgICAgICBjb25zdCBjb21tYW5kID0gdGhpcy5jb21tYW5kXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuc3BsaXQoL1xccysvKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmZpbHRlcihpID0+IGkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuY29uY2F0KERFRkFVTFRfQVJHUywgJy0tYXV0by1jb3JyZWN0JywgZmlsZVBhdGgpXG4gICAgICAgICAgY29uc3QgY3dkID0gZ2V0UHJvamVjdERpcmVjdG9yeShmaWxlUGF0aClcbiAgICAgICAgICBjb25zdCB7IHN0ZG91dCwgc3RkZXJyIH0gPSBhd2FpdCBoZWxwZXJzLmV4ZWMoY29tbWFuZFswXSwgY29tbWFuZC5zbGljZSgxKSwgeyBjd2QsIHN0cmVhbTogJ2JvdGgnIH0pXG4gICAgICAgICAgY29uc3QgeyBzdW1tYXJ5OiB7IG9mZmVuc2VfY291bnQ6IG9mZmVuc2VDb3VudCB9IH0gPSBwYXJzZUZyb21TdGQoc3Rkb3V0LCBzdGRlcnIpXG4gICAgICAgICAgcmV0dXJuIG9mZmVuc2VDb3VudCA9PT0gMCA/XG4gICAgICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkSW5mbygnTGludGVyLVJ1Ym9jb3A6IE5vIGZpeGVzIHdlcmUgbWFkZScpIDpcbiAgICAgICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRTdWNjZXNzKGBMaW50ZXItUnVib2NvcDogRml4ZWQgJHtwbHVyYWxpemUoJ29mZmVuc2VzJywgb2ZmZW5zZUNvdW50LCB0cnVlKX1gKVxuICAgICAgICB9LFxuICAgICAgfSksXG4gICAgKVxuXG4gICAgLy8gQ29uZmlnIG9ic2VydmVyc1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICBhdG9tLmNvbmZpZy5vYnNlcnZlKCdsaW50ZXItcnVib2NvcC5jb21tYW5kJywgKHZhbHVlKSA9PiB7XG4gICAgICAgIHRoaXMuY29tbWFuZCA9IHZhbHVlXG4gICAgICB9KSxcbiAgICApXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChcbiAgICAgIGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci1ydWJvY29wLmRpc2FibGVXaGVuTm9Db25maWdGaWxlJywgKHZhbHVlKSA9PiB7XG4gICAgICAgIHRoaXMuZGlzYWJsZVdoZW5Ob0NvbmZpZ0ZpbGUgPSB2YWx1ZVxuICAgICAgfSksXG4gICAgKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICBhdG9tLmNvbmZpZy5vYnNlcnZlKCdsaW50ZXItcnVib2NvcC5saW50ZXJUaW1lb3V0JywgKHZhbHVlKSA9PiB7XG4gICAgICAgIHRoaXMubGludGVyVGltZW91dCA9IHZhbHVlXG4gICAgICB9KSxcbiAgICApXG4gIH0sXG5cbiAgZGVhY3RpdmF0ZSgpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gIH0sXG5cbiAgcHJvdmlkZUxpbnRlcigpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZTogJ1J1Ym9Db3AnLFxuICAgICAgZ3JhbW1hclNjb3BlczogW1xuICAgICAgICAnc291cmNlLnJ1YnknLFxuICAgICAgICAnc291cmNlLnJ1YnkucmFpbHMnLFxuICAgICAgICAnc291cmNlLnJ1YnkucnNwZWMnLFxuICAgICAgICAnc291cmNlLnJ1YnkuY2hlZicsXG4gICAgICBdLFxuICAgICAgc2NvcGU6ICdmaWxlJyxcbiAgICAgIGxpbnRzT25DaGFuZ2U6IHRydWUsXG4gICAgICBsaW50OiBhc3luYyAoZWRpdG9yKSA9PiB7XG4gICAgICAgIGNvbnN0IGZpbGVQYXRoID0gZWRpdG9yLmdldFBhdGgoKVxuXG4gICAgICAgIGlmICh0aGlzLmRpc2FibGVXaGVuTm9Db25maWdGaWxlID09PSB0cnVlKSB7XG4gICAgICAgICAgY29uc3QgY29uZmlnID0gYXdhaXQgaGVscGVycy5maW5kQXN5bmMoZmlsZVBhdGgsICcucnVib2NvcC55bWwnKVxuICAgICAgICAgIGlmIChjb25maWcgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiBbXVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGNvbW1hbmQgPSB0aGlzLmNvbW1hbmRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuc3BsaXQoL1xccysvKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5maWx0ZXIoaSA9PiBpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5jb25jYXQoREVGQVVMVF9BUkdTLCAnLS1zdGRpbicsIGZpbGVQYXRoKVxuICAgICAgICBjb25zdCBzdGRpbiA9IGVkaXRvci5nZXRUZXh0KClcbiAgICAgICAgY29uc3QgY3dkID0gZ2V0UHJvamVjdERpcmVjdG9yeShmaWxlUGF0aClcbiAgICAgICAgY29uc3QgZXhleE9wdGlvbnMgPSB7XG4gICAgICAgICAgY3dkLFxuICAgICAgICAgIHN0ZGluLFxuICAgICAgICAgIHN0cmVhbTogJ2JvdGgnLFxuICAgICAgICAgIHRpbWVvdXQ6IHRoaXMubGludGVyVGltZW91dCxcbiAgICAgICAgICB1bmlxdWVLZXk6IGBsaW50ZXItcnVib2NvcDo6JHtmaWxlUGF0aH1gLFxuICAgICAgICB9XG4gICAgICAgIGNvbnN0IG91dHB1dCA9IGF3YWl0IGhlbHBlcnMuZXhlYyhjb21tYW5kWzBdLCBjb21tYW5kLnNsaWNlKDEpLCBleGV4T3B0aW9ucylcbiAgICAgICAgLy8gUHJvY2VzcyB3YXMgY2FuY2VsZWQgYnkgbmV3ZXIgcHJvY2Vzc1xuICAgICAgICBpZiAob3V0cHV0ID09PSBudWxsKSB7IHJldHVybiBudWxsIH1cblxuICAgICAgICBjb25zdCB7IGZpbGVzIH0gPSBwYXJzZUZyb21TdGQob3V0cHV0LnN0ZG91dCwgb3V0cHV0LnN0ZGVycilcbiAgICAgICAgY29uc3Qgb2ZmZW5zZXMgPSBmaWxlcyAmJiBmaWxlc1swXSAmJiBmaWxlc1swXS5vZmZlbnNlc1xuICAgICAgICByZXR1cm4gKG9mZmVuc2VzIHx8IFtdKS5tYXAob2ZmZW5zZSA9PiBmb3J3YXJkUnVib2NvcFRvTGludGVyKG9mZmVuc2UsIGZpbGVQYXRoLCBlZGl0b3IpKVxuICAgICAgfSxcbiAgICB9XG4gIH0sXG59XG4iXX0=