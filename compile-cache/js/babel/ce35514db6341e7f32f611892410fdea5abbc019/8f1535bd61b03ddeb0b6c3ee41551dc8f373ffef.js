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

      var lines = this.getLines();
      lines.forEach(function (line, index) {
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
            filePath: match[1] ? _path2['default'].resolve(_this.projectPath, match[1]) : _this.texFilePath,
            range: lineNumber ? [[lineNumber - 1, 0], [lineNumber - 1, 65536]] : undefined,
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
            filePath: _this.texFilePath,
            range: [[parseInt(match[2], 10) - 1, 0], [parseInt(match[3], 10) - 1, 65536]],
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
            filePath: _this.texFilePath,
            range: lineNumber ? [[lineNumber - 1, 0], [lineNumber - 1, 65536]] : undefined,
            logPath: _this.filePath,
            logRange: logRange
          });
        }
      });

      return result;
    }
  }]);

  return LogParser;
})(_parserJs2['default']);

exports['default'] = LogParser;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2JpbGx5Ly5hdG9tL3BhY2thZ2VzL2xhdGV4L2xpYi9wYXJzZXJzL2xvZy1wYXJzZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozt3QkFFbUIsY0FBYzs7OztvQkFDaEIsTUFBTTs7OztBQUV2QixJQUFNLGNBQWMsR0FBRyxJQUFJLE1BQU0sQ0FBQyxFQUFFLEdBQ2xDLDJCQUEyQjtBQUMzQixNQUFNO0FBQ04saUJBQWlCO0NBQ2xCLENBQUE7OztBQUdELElBQU0sYUFBYSxHQUFHLElBQUksTUFBTSxDQUFDLEVBQUUsR0FDakMscUJBQXFCO0FBQ3JCLG9CQUFvQjtBQUNwQixZQUFZO0NBQ2IsQ0FBQTs7O0FBR0QsSUFBTSxXQUFXLEdBQUcsSUFBSSxNQUFNLENBQUMsRUFBRSxHQUMvQiwrQ0FBK0M7QUFDL0Msd0NBQXdDO0NBQ3pDLENBQUE7OztBQUdELElBQU0sb0JBQW9CLEdBQUcsSUFBSSxNQUFNLENBQUMsRUFBRSxHQUN4QyxpREFBaUQ7QUFDakQscUJBQXFCO0FBQ3JCLE9BQU87QUFDUCxnQ0FBZ0M7Q0FDakMsQ0FBQTs7Ozs7QUFLRCxJQUFNLHVCQUF1QixHQUFHLHFCQUFxQixDQUFBOztJQUVoQyxTQUFTO1lBQVQsU0FBUzs7QUFDaEIsV0FETyxTQUFTLENBQ2YsUUFBUSxFQUFFLFdBQVcsRUFBRTswQkFEakIsU0FBUzs7QUFFMUIsK0JBRmlCLFNBQVMsNkNBRXBCLFFBQVEsRUFBQztBQUNmLFFBQUksQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFBO0FBQzlCLFFBQUksQ0FBQyxXQUFXLEdBQUcsa0JBQUssT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFBO0dBQzdDOztlQUxrQixTQUFTOztXQU90QixpQkFBRzs7O0FBQ1AsVUFBTSxNQUFNLEdBQUc7QUFDYixtQkFBVyxFQUFFLElBQUksQ0FBQyxRQUFRO0FBQzFCLHNCQUFjLEVBQUUsSUFBSTtBQUNwQixnQkFBUSxFQUFFLEVBQUU7T0FDYixDQUFBOztBQUVE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QUFDVCxjQUFNLFVBQVUsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsR0FBRyxTQUFTLENBQUE7QUFDaEUsZ0JBQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDO0FBQ25CLGdCQUFJLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRTtBQUM1QixnQkFBSSxFQUFFLENBQUMsQUFBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssT0FBTyxHQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQSxDQUFFLE9BQU8sQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDO0FBQzNGLG9CQUFRLEVBQUUsTUFBSyxXQUFXO0FBQzFCLGlCQUFLLEVBQUUsVUFBVSxHQUFHLENBQUMsQ0FBQyxVQUFVLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsVUFBVSxHQUFHLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxHQUFHLFNBQVM7QUFDOUUsbUJBQU8sRUFBRSxNQUFLLFFBQVE7QUFDdEIsb0JBQVEsRUFBRSxRQUFRO1dBQ25CLENBQUMsQ0FBQTtTQUNIO09BQ0YsQ0FBQyxDQUFBOztBQUVGLGFBQU8sTUFBTSxDQUFBO0tBQ2Q7OztTQW5Fa0IsU0FBUzs7O3FCQUFULFNBQVMiLCJmaWxlIjoiL2hvbWUvYmlsbHkvLmF0b20vcGFja2FnZXMvbGF0ZXgvbGliL3BhcnNlcnMvbG9nLXBhcnNlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBAYmFiZWwgKi9cblxuaW1wb3J0IFBhcnNlciBmcm9tICcuLi9wYXJzZXIuanMnXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xuXG5jb25zdCBPVVRQVVRfUEFUVEVSTiA9IG5ldyBSZWdFeHAoJycgK1xuICAnXk91dHB1dFxcXFxzd3JpdHRlblxcXFxzb25cXFxccycgKyAvLyBMZWFkaW5nIHRleHQuXG4gICcoLiopJyArICAgICAgICAgICAgICAgICAgICAgIC8vIE91dHB1dCBwYXRoLlxuICAnXFxcXHNcXFxcKC4qXFxcXClcXFxcLiQnICAgICAgICAgICAgIC8vIFRyYWlsaW5nIHRleHQuXG4pXG5cbi8vIEVycm9yIHBhdHRlcm5cbmNvbnN0IEVSUk9SX1BBVFRFUk4gPSBuZXcgUmVnRXhwKCcnICtcbiAgJ14oPzooLiopOihcXFxcZCspOnwhKScgKyAvLyBGaWxlIHBhdGggYW5kIGxpbmUgbnVtYmVyXG4gICcoPzogKC4rKSBFcnJvcjopPyAnICsgIC8vIEVycm9yIHR5cGVcbiAgJyguKz8pXFxcXC4/JCcgICAgICAgICAgIC8vIE1lc3NhZ2UgdGV4dCwgdGhlIGVuZGluZyBwZXJpb2QgaXMgb3B0aW9uYWwgZm9yIE1pS1RlWFxuKVxuXG4vLyBQYXR0ZXJuIGZvciBvdmVyZnVsbC91bmRlcmZ1bGwgYm94ZXNcbmNvbnN0IEJPWF9QQVRURVJOID0gbmV3IFJlZ0V4cCgnJyArXG4gICdeKCg/Ok92ZXJ8VW5kZXIpZnVsbCBcXFxcXFxcXFt2aF1ib3ggXFxcXChbXildKlxcXFwpKScgKyAvLyBNZXNzYWdlIHRleHRcbiAgJyBpbiBwYXJhZ3JhcGggYXQgbGluZXMgKFxcXFxkKyktLShcXFxcZCspJCcgICAgICAgICAgLy8gTGluZSByYW5nZVxuKVxuXG4vLyBXYXJuaW5nIGFuZCBJbmZvIHBhdHRlcm5cbmNvbnN0IFdBUk5JTkdfSU5GT19QQVRURVJOID0gbmV3IFJlZ0V4cCgnJyArXG4gICdeKCg/Oig/OkNsYXNzfFBhY2thZ2UpIFxcXFxTKyl8TGFUZVh8TGFUZVggRm9udCkgJyArIC8vIE1lc3NhZ2Ugb3JpZ2luXG4gICcoV2FybmluZ3xJbmZvKTpcXFxccysnICsgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIE1lc3NhZ2UgdHlwZVxuICAnKC4qPyknICsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTWVzc2FnZSB0ZXh0XG4gICcoPzogb24gaW5wdXQgbGluZSAoXFxcXGQrKSk/XFxcXC4kJyAgICAgICAgICAgICAgICAgICAgLy8gTGluZSBudW1iZXJcbilcblxuLy8gUGF0dGVybiBmb3IgZm9udCBtZXNzYWdlcyB0aGF0IG92ZXJmbG93IG9udG8gdGhlIG5leHQgbGluZS4gV2UgZG8gbm90IGNhcHR1cmVcbi8vIGFueXRoaW5nIGZyb20gdGhlIG1hdGNoLCBidXQgd2UgbmVlZCB0byBrbm93IHdoZXJlIHRoZSBlcnJvciBtZXNzYWdlIGlzXG4vLyBsb2NhdGVkIGluIHRoZSBsb2cgZmlsZS5cbmNvbnN0IElOQ09NUExFVEVfRk9OVF9QQVRURVJOID0gL15MYVRlWCBGb250IC4qW14uXSQvXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExvZ1BhcnNlciBleHRlbmRzIFBhcnNlciB7XG4gIGNvbnN0cnVjdG9yIChmaWxlUGF0aCwgdGV4RmlsZVBhdGgpIHtcbiAgICBzdXBlcihmaWxlUGF0aClcbiAgICB0aGlzLnRleEZpbGVQYXRoID0gdGV4RmlsZVBhdGhcbiAgICB0aGlzLnByb2plY3RQYXRoID0gcGF0aC5kaXJuYW1lKHRleEZpbGVQYXRoKVxuICB9XG5cbiAgcGFyc2UgKCkge1xuICAgIGNvbnN0IHJlc3VsdCA9IHtcbiAgICAgIGxvZ0ZpbGVQYXRoOiB0aGlzLmZpbGVQYXRoLFxuICAgICAgb3V0cHV0RmlsZVBhdGg6IG51bGwsXG4gICAgICBtZXNzYWdlczogW11cbiAgICB9XG5cbiAgICBjb25zdCBsaW5lcyA9IHRoaXMuZ2V0TGluZXMoKVxuICAgIGxpbmVzLmZvckVhY2goKGxpbmUsIGluZGV4KSA9PiB7XG4gICAgICAvLyBTaW1wbGVzdCBUaGluZyBUaGF0IFdvcmtz4oSiIGFuZCBLSVNTwq5cbiAgICAgIGNvbnN0IGxvZ1JhbmdlID0gW1tpbmRleCwgMF0sIFtpbmRleCwgbGluZS5sZW5ndGhdXVxuICAgICAgbGV0IG1hdGNoID0gbGluZS5tYXRjaChPVVRQVVRfUEFUVEVSTilcbiAgICAgIGlmIChtYXRjaCkge1xuICAgICAgICBjb25zdCBmaWxlUGF0aCA9IG1hdGNoWzFdLnJlcGxhY2UoL1wiL2csICcnKSAvLyBUT0RPOiBGaXggd2l0aCBpbXByb3ZlZCByZWdleC5cbiAgICAgICAgcmVzdWx0Lm91dHB1dEZpbGVQYXRoID0gcGF0aC5yZXNvbHZlKHRoaXMucHJvamVjdFBhdGgsIGZpbGVQYXRoKVxuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgbWF0Y2ggPSBsaW5lLm1hdGNoKEVSUk9SX1BBVFRFUk4pXG4gICAgICBpZiAobWF0Y2gpIHtcbiAgICAgICAgY29uc3QgbGluZU51bWJlciA9IG1hdGNoWzJdID8gcGFyc2VJbnQobWF0Y2hbMl0sIDEwKSA6IHVuZGVmaW5lZFxuICAgICAgICByZXN1bHQubWVzc2FnZXMucHVzaCh7XG4gICAgICAgICAgdHlwZTogJ2Vycm9yJyxcbiAgICAgICAgICB0ZXh0OiAobWF0Y2hbM10gJiYgbWF0Y2hbM10gIT09ICdMYVRlWCcpID8gbWF0Y2hbM10gKyAnOiAnICsgbWF0Y2hbNF0gOiBtYXRjaFs0XSxcbiAgICAgICAgICBmaWxlUGF0aDogbWF0Y2hbMV0gPyBwYXRoLnJlc29sdmUodGhpcy5wcm9qZWN0UGF0aCwgbWF0Y2hbMV0pIDogdGhpcy50ZXhGaWxlUGF0aCxcbiAgICAgICAgICByYW5nZTogbGluZU51bWJlciA/IFtbbGluZU51bWJlciAtIDEsIDBdLCBbbGluZU51bWJlciAtIDEsIDY1NTM2XV0gOiB1bmRlZmluZWQsXG4gICAgICAgICAgbG9nUGF0aDogdGhpcy5maWxlUGF0aCxcbiAgICAgICAgICBsb2dSYW5nZTogbG9nUmFuZ2VcbiAgICAgICAgfSlcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIG1hdGNoID0gbGluZS5tYXRjaChCT1hfUEFUVEVSTilcbiAgICAgIGlmIChtYXRjaCkge1xuICAgICAgICByZXN1bHQubWVzc2FnZXMucHVzaCh7XG4gICAgICAgICAgdHlwZTogJ3dhcm5pbmcnLFxuICAgICAgICAgIHRleHQ6IG1hdGNoWzFdLFxuICAgICAgICAgIGZpbGVQYXRoOiB0aGlzLnRleEZpbGVQYXRoLFxuICAgICAgICAgIHJhbmdlOiBbW3BhcnNlSW50KG1hdGNoWzJdLCAxMCkgLSAxLCAwXSwgW3BhcnNlSW50KG1hdGNoWzNdLCAxMCkgLSAxLCA2NTUzNl1dLFxuICAgICAgICAgIGxvZ1BhdGg6IHRoaXMuZmlsZVBhdGgsXG4gICAgICAgICAgbG9nUmFuZ2U6IGxvZ1JhbmdlXG4gICAgICAgIH0pXG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICBtYXRjaCA9IChJTkNPTVBMRVRFX0ZPTlRfUEFUVEVSTi50ZXN0KGxpbmUpID8gbGluZSArIGxpbmVzW2luZGV4ICsgMV0uc3Vic3RyaW5nKDE1KSA6IGxpbmUpLm1hdGNoKFdBUk5JTkdfSU5GT19QQVRURVJOKVxuICAgICAgaWYgKG1hdGNoKSB7XG4gICAgICAgIGNvbnN0IGxpbmVOdW1iZXIgPSBtYXRjaFs0XSA/IHBhcnNlSW50KG1hdGNoWzRdLCAxMCkgOiB1bmRlZmluZWRcbiAgICAgICAgcmVzdWx0Lm1lc3NhZ2VzLnB1c2goe1xuICAgICAgICAgIHR5cGU6IG1hdGNoWzJdLnRvTG93ZXJDYXNlKCksXG4gICAgICAgICAgdGV4dDogKChtYXRjaFsxXSAhPT0gJ0xhVGVYJykgPyBtYXRjaFsxXSArICc6ICcgKyBtYXRjaFszXSA6IG1hdGNoWzNdKS5yZXBsYWNlKC9cXHMrL2csICcgJyksXG4gICAgICAgICAgZmlsZVBhdGg6IHRoaXMudGV4RmlsZVBhdGgsXG4gICAgICAgICAgcmFuZ2U6IGxpbmVOdW1iZXIgPyBbW2xpbmVOdW1iZXIgLSAxLCAwXSwgW2xpbmVOdW1iZXIgLSAxLCA2NTUzNl1dIDogdW5kZWZpbmVkLFxuICAgICAgICAgIGxvZ1BhdGg6IHRoaXMuZmlsZVBhdGgsXG4gICAgICAgICAgbG9nUmFuZ2U6IGxvZ1JhbmdlXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfSlcblxuICAgIHJldHVybiByZXN1bHRcbiAgfVxufVxuIl19