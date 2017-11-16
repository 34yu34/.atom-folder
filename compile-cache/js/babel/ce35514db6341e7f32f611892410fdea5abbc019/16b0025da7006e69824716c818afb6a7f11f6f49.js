Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/** @babel */

var _parserJs = require('../parser.js');

var _parserJs2 = _interopRequireDefault(_parserJs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var OUTPUT_PATTERN = new RegExp('' + '^Output\\swritten\\son\\s' + // Leading text.
'(.*)' + // Output path.
'\\s\\(.*\\)\\.$' // Trailing text.
);

// Error pattern
var ERROR_PATTERN = new RegExp('' + '^(?:(.*):(\\d+):|!)' + // File path and line number
'(?: (.+) Error:)? ' + // Error type
'(.+?)\\.?$' // Message text, the ending period is optional for MiKTeX
);

// Pattern for overfull/underfull boxes
var BOX_PATTERN = new RegExp('' + '^((?:Over|Under)full \\\\[vh]box \\([^)]*\\))' + // Message text
' in paragraph at lines (\\d+)--(\\d+)$' // Line range
);

// Warning and Info pattern
var WARNING_INFO_PATTERN = new RegExp('' + '^((?:(?:Class|Package) \\S+)|LaTeX|LaTeX Font) ' + // Message origin
'(Warning|Info):\\s+' + // Message type
'(.*?)' + // Message text
'(?: on input line (\\d+))?\\.$' // Line number
);

// Pattern for font messages that overflow onto the next line. We do not capture
// anything from the match, but we need to know where the error message is
// located in the log file.
var INCOMPLETE_FONT_PATTERN = /^LaTeX Font .*[^.]$/;

// Pattern for \input markers which are surrounded by parentheses.
var INPUT_FILE_PATTERN = /(\([^()[]+|\))/g;

// Pattern to remove leading and trailing spaces, quotes and left parenthesis.
var INPUT_FILE_TRIM_PATTERN = /(^\([\s"]*|[\s"]+$)/g;

var LogParser = (function (_Parser) {
  _inherits(LogParser, _Parser);

  function LogParser(filePath, texFilePath) {
    _classCallCheck(this, LogParser);

    _get(Object.getPrototypeOf(LogParser.prototype), 'constructor', this).call(this, filePath);
    this.texFilePath = texFilePath;
    this.projectPath = _path2['default'].dirname(texFilePath);
  }

  _createClass(LogParser, [{
    key: 'parse',
    value: function parse() {
      var _this = this;

      var result = {
        logFilePath: this.filePath,
        outputFilePath: null,
        messages: []
      };
      var sourcePaths = [this.texFilePath];

      var lines = this.getLines();
      lines.forEach(function (line, index) {
        // Ignore the first line because it has some confusing patterns
        if (index === 0) return;

        // Simplest Thing That Works™ and KISS®
        var logRange = [[index, 0], [index, line.length]];
        var match = line.match(OUTPUT_PATTERN);
        if (match) {
          var filePath = match[1].replace(/"/g, ''); // TODO: Fix with improved regex.
          result.outputFilePath = _path2['default'].resolve(_this.projectPath, filePath);
          return;
        }

        match = line.match(ERROR_PATTERN);
        if (match) {
          var lineNumber = match[2] ? parseInt(match[2], 10) : undefined;
          result.messages.push({
            type: 'error',
            text: match[3] && match[3] !== 'LaTeX' ? match[3] + ': ' + match[4] : match[4],
            filePath: match[1] ? _path2['default'].resolve(_this.projectPath, match[1]) : sourcePaths[0],
            range: lineNumber ? [[lineNumber - 1, 0], [lineNumber - 1, Number.MAX_SAFE_INTEGER]] : undefined,
            logPath: _this.filePath,
            logRange: logRange
          });
          return;
        }

        match = line.match(BOX_PATTERN);
        if (match) {
          result.messages.push({
            type: 'warning',
            text: match[1],
            filePath: sourcePaths[0],
            range: [[parseInt(match[2], 10) - 1, 0], [parseInt(match[3], 10) - 1, Number.MAX_SAFE_INTEGER]],
            logPath: _this.filePath,
            logRange: logRange
          });
          return;
        }

        match = (INCOMPLETE_FONT_PATTERN.test(line) ? line + lines[index + 1].substring(15) : line).match(WARNING_INFO_PATTERN);
        if (match) {
          var lineNumber = match[4] ? parseInt(match[4], 10) : undefined;
          result.messages.push({
            type: match[2].toLowerCase(),
            text: (match[1] !== 'LaTeX' ? match[1] + ': ' + match[3] : match[3]).replace(/\s+/g, ' '),
            filePath: sourcePaths[0],
            range: lineNumber ? [[lineNumber - 1, 0], [lineNumber - 1, Number.MAX_SAFE_INTEGER]] : undefined,
            logPath: _this.filePath,
            logRange: logRange
          });
        }

        // Keep a stack of source paths indicated by input parentheses. We may
        // capture phrases that are enclosed in parathesis that are not paths, but
        // this should ignored safely since the closing paratheses will pop the
        // path right back off of the source path stack.
        match = line.match(INPUT_FILE_PATTERN);
        if (match) {
          for (var token of match) {
            if (token === ')') {
              // Avoid popping texFilePath off of the stack.
              if (sourcePaths.length > 1) sourcePaths.shift();
            } else {
              sourcePaths.unshift(_path2['default'].resolve(_this.projectPath, token.replace(INPUT_FILE_TRIM_PATTERN, '')));
            }
          }
        }
      });

      return result;
    }
  }]);

  return LogParser;
})(_parserJs2['default']);

exports['default'] = LogParser;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2JpbGx5Ly5hdG9tL3BhY2thZ2VzL2xhdGV4L2xpYi9wYXJzZXJzL2xvZy1wYXJzZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozt3QkFFbUIsY0FBYzs7OztvQkFDaEIsTUFBTTs7OztBQUV2QixJQUFNLGNBQWMsR0FBRyxJQUFJLE1BQU0sQ0FBQyxFQUFFLEdBQ2xDLDJCQUEyQjtBQUMzQixNQUFNO0FBQ04saUJBQWlCO0NBQ2xCLENBQUE7OztBQUdELElBQU0sYUFBYSxHQUFHLElBQUksTUFBTSxDQUFDLEVBQUUsR0FDakMscUJBQXFCO0FBQ3JCLG9CQUFvQjtBQUNwQixZQUFZO0NBQ2IsQ0FBQTs7O0FBR0QsSUFBTSxXQUFXLEdBQUcsSUFBSSxNQUFNLENBQUMsRUFBRSxHQUMvQiwrQ0FBK0M7QUFDL0Msd0NBQXdDO0NBQ3pDLENBQUE7OztBQUdELElBQU0sb0JBQW9CLEdBQUcsSUFBSSxNQUFNLENBQUMsRUFBRSxHQUN4QyxpREFBaUQ7QUFDakQscUJBQXFCO0FBQ3JCLE9BQU87QUFDUCxnQ0FBZ0M7Q0FDakMsQ0FBQTs7Ozs7QUFLRCxJQUFNLHVCQUF1QixHQUFHLHFCQUFxQixDQUFBOzs7QUFHckQsSUFBTSxrQkFBa0IsR0FBRyxpQkFBaUIsQ0FBQTs7O0FBRzVDLElBQU0sdUJBQXVCLEdBQUcsc0JBQXNCLENBQUE7O0lBRWpDLFNBQVM7WUFBVCxTQUFTOztBQUNoQixXQURPLFNBQVMsQ0FDZixRQUFRLEVBQUUsV0FBVyxFQUFFOzBCQURqQixTQUFTOztBQUUxQiwrQkFGaUIsU0FBUyw2Q0FFcEIsUUFBUSxFQUFDO0FBQ2YsUUFBSSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUE7QUFDOUIsUUFBSSxDQUFDLFdBQVcsR0FBRyxrQkFBSyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUE7R0FDN0M7O2VBTGtCLFNBQVM7O1dBT3RCLGlCQUFHOzs7QUFDUCxVQUFNLE1BQU0sR0FBRztBQUNiLG1CQUFXLEVBQUUsSUFBSSxDQUFDLFFBQVE7QUFDMUIsc0JBQWMsRUFBRSxJQUFJO0FBQ3BCLGdCQUFRLEVBQUUsRUFBRTtPQUNiLENBQUE7QUFDRCxVQUFNLFdBQVcsR0FBRyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQTs7QUFFdEMsVUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFBO0FBQzdCLFdBQUssQ0FBQyxPQUFPLENBQUMsVUFBQyxJQUFJLEVBQUUsS0FBSyxFQUFLOztBQUU3QixZQUFJLEtBQUssS0FBSyxDQUFDLEVBQUUsT0FBTTs7O0FBR3ZCLFlBQU0sUUFBUSxHQUFHLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUE7QUFDbkQsWUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsQ0FBQTtBQUN0QyxZQUFJLEtBQUssRUFBRTtBQUNULGNBQU0sUUFBUSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFBO0FBQzNDLGdCQUFNLENBQUMsY0FBYyxHQUFHLGtCQUFLLE9BQU8sQ0FBQyxNQUFLLFdBQVcsRUFBRSxRQUFRLENBQUMsQ0FBQTtBQUNoRSxpQkFBTTtTQUNQOztBQUVELGFBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFBO0FBQ2pDLFlBQUksS0FBSyxFQUFFO0FBQ1QsY0FBTSxVQUFVLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEdBQUcsU0FBUyxDQUFBO0FBQ2hFLGdCQUFNLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQztBQUNuQixnQkFBSSxFQUFFLE9BQU87QUFDYixnQkFBSSxFQUFFLEFBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxPQUFPLEdBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQztBQUNoRixvQkFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxrQkFBSyxPQUFPLENBQUMsTUFBSyxXQUFXLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsV0FBVyxDQUFDLENBQUMsQ0FBQztBQUM5RSxpQkFBSyxFQUFFLFVBQVUsR0FBRyxDQUFDLENBQUMsVUFBVSxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLFVBQVUsR0FBRyxDQUFDLEVBQUUsTUFBTSxDQUFDLGdCQUFnQixDQUFDLENBQUMsR0FBRyxTQUFTO0FBQ2hHLG1CQUFPLEVBQUUsTUFBSyxRQUFRO0FBQ3RCLG9CQUFRLEVBQUUsUUFBUTtXQUNuQixDQUFDLENBQUE7QUFDRixpQkFBTTtTQUNQOztBQUVELGFBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFBO0FBQy9CLFlBQUksS0FBSyxFQUFFO0FBQ1QsZ0JBQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDO0FBQ25CLGdCQUFJLEVBQUUsU0FBUztBQUNmLGdCQUFJLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztBQUNkLG9CQUFRLEVBQUUsV0FBVyxDQUFDLENBQUMsQ0FBQztBQUN4QixpQkFBSyxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0FBQy9GLG1CQUFPLEVBQUUsTUFBSyxRQUFRO0FBQ3RCLG9CQUFRLEVBQUUsUUFBUTtXQUNuQixDQUFDLENBQUE7QUFDRixpQkFBTTtTQUNQOztBQUVELGFBQUssR0FBRyxDQUFDLHVCQUF1QixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLEdBQUcsS0FBSyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFBLENBQUUsS0FBSyxDQUFDLG9CQUFvQixDQUFDLENBQUE7QUFDdkgsWUFBSSxLQUFLLEVBQUU7QUFDVCxjQUFNLFVBQVUsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsR0FBRyxTQUFTLENBQUE7QUFDaEUsZ0JBQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDO0FBQ25CLGdCQUFJLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRTtBQUM1QixnQkFBSSxFQUFFLENBQUMsQUFBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssT0FBTyxHQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQSxDQUFFLE9BQU8sQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDO0FBQzNGLG9CQUFRLEVBQUUsV0FBVyxDQUFDLENBQUMsQ0FBQztBQUN4QixpQkFBSyxFQUFFLFVBQVUsR0FBRyxDQUFDLENBQUMsVUFBVSxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLFVBQVUsR0FBRyxDQUFDLEVBQUUsTUFBTSxDQUFDLGdCQUFnQixDQUFDLENBQUMsR0FBRyxTQUFTO0FBQ2hHLG1CQUFPLEVBQUUsTUFBSyxRQUFRO0FBQ3RCLG9CQUFRLEVBQUUsUUFBUTtXQUNuQixDQUFDLENBQUE7U0FDSDs7Ozs7O0FBTUQsYUFBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsa0JBQWtCLENBQUMsQ0FBQTtBQUN0QyxZQUFJLEtBQUssRUFBRTtBQUNULGVBQUssSUFBTSxLQUFLLElBQUksS0FBSyxFQUFFO0FBQ3pCLGdCQUFJLEtBQUssS0FBSyxHQUFHLEVBQUU7O0FBRWpCLGtCQUFJLFdBQVcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLFdBQVcsQ0FBQyxLQUFLLEVBQUUsQ0FBQTthQUNoRCxNQUFNO0FBQ0wseUJBQVcsQ0FBQyxPQUFPLENBQUMsa0JBQUssT0FBTyxDQUFDLE1BQUssV0FBVyxFQUFFLEtBQUssQ0FBQyxPQUFPLENBQUMsdUJBQXVCLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFBO2FBQ2hHO1dBQ0Y7U0FDRjtPQUNGLENBQUMsQ0FBQTs7QUFFRixhQUFPLE1BQU0sQ0FBQTtLQUNkOzs7U0F2RmtCLFNBQVM7OztxQkFBVCxTQUFTIiwiZmlsZSI6Ii9ob21lL2JpbGx5Ly5hdG9tL3BhY2thZ2VzL2xhdGV4L2xpYi9wYXJzZXJzL2xvZy1wYXJzZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiogQGJhYmVsICovXG5cbmltcG9ydCBQYXJzZXIgZnJvbSAnLi4vcGFyc2VyLmpzJ1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcblxuY29uc3QgT1VUUFVUX1BBVFRFUk4gPSBuZXcgUmVnRXhwKCcnICtcbiAgJ15PdXRwdXRcXFxcc3dyaXR0ZW5cXFxcc29uXFxcXHMnICsgLy8gTGVhZGluZyB0ZXh0LlxuICAnKC4qKScgKyAgICAgICAgICAgICAgICAgICAgICAvLyBPdXRwdXQgcGF0aC5cbiAgJ1xcXFxzXFxcXCguKlxcXFwpXFxcXC4kJyAgICAgICAgICAgICAvLyBUcmFpbGluZyB0ZXh0LlxuKVxuXG4vLyBFcnJvciBwYXR0ZXJuXG5jb25zdCBFUlJPUl9QQVRURVJOID0gbmV3IFJlZ0V4cCgnJyArXG4gICdeKD86KC4qKTooXFxcXGQrKTp8ISknICsgLy8gRmlsZSBwYXRoIGFuZCBsaW5lIG51bWJlclxuICAnKD86ICguKykgRXJyb3I6KT8gJyArICAvLyBFcnJvciB0eXBlXG4gICcoLis/KVxcXFwuPyQnICAgICAgICAgICAvLyBNZXNzYWdlIHRleHQsIHRoZSBlbmRpbmcgcGVyaW9kIGlzIG9wdGlvbmFsIGZvciBNaUtUZVhcbilcblxuLy8gUGF0dGVybiBmb3Igb3ZlcmZ1bGwvdW5kZXJmdWxsIGJveGVzXG5jb25zdCBCT1hfUEFUVEVSTiA9IG5ldyBSZWdFeHAoJycgK1xuICAnXigoPzpPdmVyfFVuZGVyKWZ1bGwgXFxcXFxcXFxbdmhdYm94IFxcXFwoW14pXSpcXFxcKSknICsgLy8gTWVzc2FnZSB0ZXh0XG4gICcgaW4gcGFyYWdyYXBoIGF0IGxpbmVzIChcXFxcZCspLS0oXFxcXGQrKSQnICAgICAgICAgIC8vIExpbmUgcmFuZ2VcbilcblxuLy8gV2FybmluZyBhbmQgSW5mbyBwYXR0ZXJuXG5jb25zdCBXQVJOSU5HX0lORk9fUEFUVEVSTiA9IG5ldyBSZWdFeHAoJycgK1xuICAnXigoPzooPzpDbGFzc3xQYWNrYWdlKSBcXFxcUyspfExhVGVYfExhVGVYIEZvbnQpICcgKyAvLyBNZXNzYWdlIG9yaWdpblxuICAnKFdhcm5pbmd8SW5mbyk6XFxcXHMrJyArICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBNZXNzYWdlIHR5cGVcbiAgJyguKj8pJyArICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIE1lc3NhZ2UgdGV4dFxuICAnKD86IG9uIGlucHV0IGxpbmUgKFxcXFxkKykpP1xcXFwuJCcgICAgICAgICAgICAgICAgICAgIC8vIExpbmUgbnVtYmVyXG4pXG5cbi8vIFBhdHRlcm4gZm9yIGZvbnQgbWVzc2FnZXMgdGhhdCBvdmVyZmxvdyBvbnRvIHRoZSBuZXh0IGxpbmUuIFdlIGRvIG5vdCBjYXB0dXJlXG4vLyBhbnl0aGluZyBmcm9tIHRoZSBtYXRjaCwgYnV0IHdlIG5lZWQgdG8ga25vdyB3aGVyZSB0aGUgZXJyb3IgbWVzc2FnZSBpc1xuLy8gbG9jYXRlZCBpbiB0aGUgbG9nIGZpbGUuXG5jb25zdCBJTkNPTVBMRVRFX0ZPTlRfUEFUVEVSTiA9IC9eTGFUZVggRm9udCAuKlteLl0kL1xuXG4vLyBQYXR0ZXJuIGZvciBcXGlucHV0IG1hcmtlcnMgd2hpY2ggYXJlIHN1cnJvdW5kZWQgYnkgcGFyZW50aGVzZXMuXG5jb25zdCBJTlBVVF9GSUxFX1BBVFRFUk4gPSAvKFxcKFteKClbXSt8XFwpKS9nXG5cbi8vIFBhdHRlcm4gdG8gcmVtb3ZlIGxlYWRpbmcgYW5kIHRyYWlsaW5nIHNwYWNlcywgcXVvdGVzIGFuZCBsZWZ0IHBhcmVudGhlc2lzLlxuY29uc3QgSU5QVVRfRklMRV9UUklNX1BBVFRFUk4gPSAvKF5cXChbXFxzXCJdKnxbXFxzXCJdKyQpL2dcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTG9nUGFyc2VyIGV4dGVuZHMgUGFyc2VyIHtcbiAgY29uc3RydWN0b3IgKGZpbGVQYXRoLCB0ZXhGaWxlUGF0aCkge1xuICAgIHN1cGVyKGZpbGVQYXRoKVxuICAgIHRoaXMudGV4RmlsZVBhdGggPSB0ZXhGaWxlUGF0aFxuICAgIHRoaXMucHJvamVjdFBhdGggPSBwYXRoLmRpcm5hbWUodGV4RmlsZVBhdGgpXG4gIH1cblxuICBwYXJzZSAoKSB7XG4gICAgY29uc3QgcmVzdWx0ID0ge1xuICAgICAgbG9nRmlsZVBhdGg6IHRoaXMuZmlsZVBhdGgsXG4gICAgICBvdXRwdXRGaWxlUGF0aDogbnVsbCxcbiAgICAgIG1lc3NhZ2VzOiBbXVxuICAgIH1cbiAgICBjb25zdCBzb3VyY2VQYXRocyA9IFt0aGlzLnRleEZpbGVQYXRoXVxuXG4gICAgY29uc3QgbGluZXMgPSB0aGlzLmdldExpbmVzKClcbiAgICBsaW5lcy5mb3JFYWNoKChsaW5lLCBpbmRleCkgPT4ge1xuICAgICAgLy8gSWdub3JlIHRoZSBmaXJzdCBsaW5lIGJlY2F1c2UgaXQgaGFzIHNvbWUgY29uZnVzaW5nIHBhdHRlcm5zXG4gICAgICBpZiAoaW5kZXggPT09IDApIHJldHVyblxuXG4gICAgICAvLyBTaW1wbGVzdCBUaGluZyBUaGF0IFdvcmtz4oSiIGFuZCBLSVNTwq5cbiAgICAgIGNvbnN0IGxvZ1JhbmdlID0gW1tpbmRleCwgMF0sIFtpbmRleCwgbGluZS5sZW5ndGhdXVxuICAgICAgbGV0IG1hdGNoID0gbGluZS5tYXRjaChPVVRQVVRfUEFUVEVSTilcbiAgICAgIGlmIChtYXRjaCkge1xuICAgICAgICBjb25zdCBmaWxlUGF0aCA9IG1hdGNoWzFdLnJlcGxhY2UoL1wiL2csICcnKSAvLyBUT0RPOiBGaXggd2l0aCBpbXByb3ZlZCByZWdleC5cbiAgICAgICAgcmVzdWx0Lm91dHB1dEZpbGVQYXRoID0gcGF0aC5yZXNvbHZlKHRoaXMucHJvamVjdFBhdGgsIGZpbGVQYXRoKVxuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgbWF0Y2ggPSBsaW5lLm1hdGNoKEVSUk9SX1BBVFRFUk4pXG4gICAgICBpZiAobWF0Y2gpIHtcbiAgICAgICAgY29uc3QgbGluZU51bWJlciA9IG1hdGNoWzJdID8gcGFyc2VJbnQobWF0Y2hbMl0sIDEwKSA6IHVuZGVmaW5lZFxuICAgICAgICByZXN1bHQubWVzc2FnZXMucHVzaCh7XG4gICAgICAgICAgdHlwZTogJ2Vycm9yJyxcbiAgICAgICAgICB0ZXh0OiAobWF0Y2hbM10gJiYgbWF0Y2hbM10gIT09ICdMYVRlWCcpID8gbWF0Y2hbM10gKyAnOiAnICsgbWF0Y2hbNF0gOiBtYXRjaFs0XSxcbiAgICAgICAgICBmaWxlUGF0aDogbWF0Y2hbMV0gPyBwYXRoLnJlc29sdmUodGhpcy5wcm9qZWN0UGF0aCwgbWF0Y2hbMV0pIDogc291cmNlUGF0aHNbMF0sXG4gICAgICAgICAgcmFuZ2U6IGxpbmVOdW1iZXIgPyBbW2xpbmVOdW1iZXIgLSAxLCAwXSwgW2xpbmVOdW1iZXIgLSAxLCBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUl1dIDogdW5kZWZpbmVkLFxuICAgICAgICAgIGxvZ1BhdGg6IHRoaXMuZmlsZVBhdGgsXG4gICAgICAgICAgbG9nUmFuZ2U6IGxvZ1JhbmdlXG4gICAgICAgIH0pXG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICBtYXRjaCA9IGxpbmUubWF0Y2goQk9YX1BBVFRFUk4pXG4gICAgICBpZiAobWF0Y2gpIHtcbiAgICAgICAgcmVzdWx0Lm1lc3NhZ2VzLnB1c2goe1xuICAgICAgICAgIHR5cGU6ICd3YXJuaW5nJyxcbiAgICAgICAgICB0ZXh0OiBtYXRjaFsxXSxcbiAgICAgICAgICBmaWxlUGF0aDogc291cmNlUGF0aHNbMF0sXG4gICAgICAgICAgcmFuZ2U6IFtbcGFyc2VJbnQobWF0Y2hbMl0sIDEwKSAtIDEsIDBdLCBbcGFyc2VJbnQobWF0Y2hbM10sIDEwKSAtIDEsIE51bWJlci5NQVhfU0FGRV9JTlRFR0VSXV0sXG4gICAgICAgICAgbG9nUGF0aDogdGhpcy5maWxlUGF0aCxcbiAgICAgICAgICBsb2dSYW5nZTogbG9nUmFuZ2VcbiAgICAgICAgfSlcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIG1hdGNoID0gKElOQ09NUExFVEVfRk9OVF9QQVRURVJOLnRlc3QobGluZSkgPyBsaW5lICsgbGluZXNbaW5kZXggKyAxXS5zdWJzdHJpbmcoMTUpIDogbGluZSkubWF0Y2goV0FSTklOR19JTkZPX1BBVFRFUk4pXG4gICAgICBpZiAobWF0Y2gpIHtcbiAgICAgICAgY29uc3QgbGluZU51bWJlciA9IG1hdGNoWzRdID8gcGFyc2VJbnQobWF0Y2hbNF0sIDEwKSA6IHVuZGVmaW5lZFxuICAgICAgICByZXN1bHQubWVzc2FnZXMucHVzaCh7XG4gICAgICAgICAgdHlwZTogbWF0Y2hbMl0udG9Mb3dlckNhc2UoKSxcbiAgICAgICAgICB0ZXh0OiAoKG1hdGNoWzFdICE9PSAnTGFUZVgnKSA/IG1hdGNoWzFdICsgJzogJyArIG1hdGNoWzNdIDogbWF0Y2hbM10pLnJlcGxhY2UoL1xccysvZywgJyAnKSxcbiAgICAgICAgICBmaWxlUGF0aDogc291cmNlUGF0aHNbMF0sXG4gICAgICAgICAgcmFuZ2U6IGxpbmVOdW1iZXIgPyBbW2xpbmVOdW1iZXIgLSAxLCAwXSwgW2xpbmVOdW1iZXIgLSAxLCBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUl1dIDogdW5kZWZpbmVkLFxuICAgICAgICAgIGxvZ1BhdGg6IHRoaXMuZmlsZVBhdGgsXG4gICAgICAgICAgbG9nUmFuZ2U6IGxvZ1JhbmdlXG4gICAgICAgIH0pXG4gICAgICB9XG5cbiAgICAgIC8vIEtlZXAgYSBzdGFjayBvZiBzb3VyY2UgcGF0aHMgaW5kaWNhdGVkIGJ5IGlucHV0IHBhcmVudGhlc2VzLiBXZSBtYXlcbiAgICAgIC8vIGNhcHR1cmUgcGhyYXNlcyB0aGF0IGFyZSBlbmNsb3NlZCBpbiBwYXJhdGhlc2lzIHRoYXQgYXJlIG5vdCBwYXRocywgYnV0XG4gICAgICAvLyB0aGlzIHNob3VsZCBpZ25vcmVkIHNhZmVseSBzaW5jZSB0aGUgY2xvc2luZyBwYXJhdGhlc2VzIHdpbGwgcG9wIHRoZVxuICAgICAgLy8gcGF0aCByaWdodCBiYWNrIG9mZiBvZiB0aGUgc291cmNlIHBhdGggc3RhY2suXG4gICAgICBtYXRjaCA9IGxpbmUubWF0Y2goSU5QVVRfRklMRV9QQVRURVJOKVxuICAgICAgaWYgKG1hdGNoKSB7XG4gICAgICAgIGZvciAoY29uc3QgdG9rZW4gb2YgbWF0Y2gpIHtcbiAgICAgICAgICBpZiAodG9rZW4gPT09ICcpJykge1xuICAgICAgICAgICAgLy8gQXZvaWQgcG9wcGluZyB0ZXhGaWxlUGF0aCBvZmYgb2YgdGhlIHN0YWNrLlxuICAgICAgICAgICAgaWYgKHNvdXJjZVBhdGhzLmxlbmd0aCA+IDEpIHNvdXJjZVBhdGhzLnNoaWZ0KClcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc291cmNlUGF0aHMudW5zaGlmdChwYXRoLnJlc29sdmUodGhpcy5wcm9qZWN0UGF0aCwgdG9rZW4ucmVwbGFjZShJTlBVVF9GSUxFX1RSSU1fUEFUVEVSTiwgJycpKSlcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KVxuXG4gICAgcmV0dXJuIHJlc3VsdFxuICB9XG59XG4iXX0=