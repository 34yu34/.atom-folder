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

var MAGIC_COMMENT_PATTERN = new RegExp('' + '^%\\s*' + // Optional whitespace.
'!T[Ee]X' + // Magic marker.
'\\s+' + // Semi-optional whitespace.
'(\\w+)' + // [1] Captures the magic keyword. E.g. 'root'.
'\\s*=\\s*' + // Equal sign wrapped in optional whitespace.
'(.*)' + // [2] Captures everything following the equal sign.
'$' // EOL.
);

var LATEX_COMMAND_PATTERN = new RegExp('' + '\\' + // starting command \
'\\w+' + // command name e.g. input
'(\\{|\\w|\\}|/|\\]|\\[)*' // options to the command
);

var MagicParser = (function (_Parser) {
  _inherits(MagicParser, _Parser);

  function MagicParser() {
    _classCallCheck(this, MagicParser);

    _get(Object.getPrototypeOf(MagicParser.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(MagicParser, [{
    key: 'parse',
    value: function parse() {
      var result = {};
      var lines = this.getLines([]);
      for (var line of lines) {
        var latexCommandMatch = line.match(LATEX_COMMAND_PATTERN);
        if (latexCommandMatch) {
          break;
        } // Stop parsing if a latex command was found

        var match = line.match(MAGIC_COMMENT_PATTERN);
        if (match != null) {
          result[match[1]] = match[2].trim();
        }
      }

      return result;
    }
  }]);

  return MagicParser;
})(_parserJs2['default']);

exports['default'] = MagicParser;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2JpbGx5Ly5hdG9tL3BhY2thZ2VzL2xhdGV4L2xpYi9wYXJzZXJzL21hZ2ljLXBhcnNlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O3dCQUVtQixjQUFjOzs7O0FBRWpDLElBQU0scUJBQXFCLEdBQUcsSUFBSSxNQUFNLENBQUMsRUFBRSxHQUN6QyxRQUFRO0FBQ1IsU0FBUztBQUNULE1BQU07QUFDTixRQUFRO0FBQ1IsV0FBVztBQUNYLE1BQU07QUFDTixHQUFHO0NBQ0osQ0FBQTs7QUFFRCxJQUFNLHFCQUFxQixHQUFHLElBQUksTUFBTSxDQUFDLEVBQUUsR0FDekMsSUFBSTtBQUNKLE1BQU07QUFDTiwwQkFBMEI7Q0FDM0IsQ0FBQTs7SUFFb0IsV0FBVztZQUFYLFdBQVc7O1dBQVgsV0FBVzswQkFBWCxXQUFXOzsrQkFBWCxXQUFXOzs7ZUFBWCxXQUFXOztXQUN4QixpQkFBRztBQUNQLFVBQU0sTUFBTSxHQUFHLEVBQUUsQ0FBQTtBQUNqQixVQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFBO0FBQy9CLFdBQUssSUFBTSxJQUFJLElBQUksS0FBSyxFQUFFO0FBQ3hCLFlBQU0saUJBQWlCLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxxQkFBcUIsQ0FBQyxDQUFBO0FBQzNELFlBQUksaUJBQWlCLEVBQUU7QUFBRSxnQkFBSztTQUFFOztBQUVoQyxZQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLHFCQUFxQixDQUFDLENBQUE7QUFDL0MsWUFBSSxLQUFLLElBQUksSUFBSSxFQUFFO0FBQ2pCLGdCQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFBO1NBQ25DO09BQ0Y7O0FBRUQsYUFBTyxNQUFNLENBQUE7S0FDZDs7O1NBZmtCLFdBQVc7OztxQkFBWCxXQUFXIiwiZmlsZSI6Ii9ob21lL2JpbGx5Ly5hdG9tL3BhY2thZ2VzL2xhdGV4L2xpYi9wYXJzZXJzL21hZ2ljLXBhcnNlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBAYmFiZWwgKi9cblxuaW1wb3J0IFBhcnNlciBmcm9tICcuLi9wYXJzZXIuanMnXG5cbmNvbnN0IE1BR0lDX0NPTU1FTlRfUEFUVEVSTiA9IG5ldyBSZWdFeHAoJycgK1xuICAnXiVcXFxccyonICsgICAgLy8gT3B0aW9uYWwgd2hpdGVzcGFjZS5cbiAgJyFUW0VlXVgnICsgICAvLyBNYWdpYyBtYXJrZXIuXG4gICdcXFxccysnICsgICAgICAvLyBTZW1pLW9wdGlvbmFsIHdoaXRlc3BhY2UuXG4gICcoXFxcXHcrKScgKyAgICAvLyBbMV0gQ2FwdHVyZXMgdGhlIG1hZ2ljIGtleXdvcmQuIEUuZy4gJ3Jvb3QnLlxuICAnXFxcXHMqPVxcXFxzKicgKyAvLyBFcXVhbCBzaWduIHdyYXBwZWQgaW4gb3B0aW9uYWwgd2hpdGVzcGFjZS5cbiAgJyguKiknICsgICAgICAvLyBbMl0gQ2FwdHVyZXMgZXZlcnl0aGluZyBmb2xsb3dpbmcgdGhlIGVxdWFsIHNpZ24uXG4gICckJyAgICAgICAgICAgLy8gRU9MLlxuKVxuXG5jb25zdCBMQVRFWF9DT01NQU5EX1BBVFRFUk4gPSBuZXcgUmVnRXhwKCcnICtcbiAgJ1xcXFwnICsgICAgICAgICAgICAgICAgICAgICAgLy8gc3RhcnRpbmcgY29tbWFuZCBcXFxuICAnXFxcXHcrJyArICAgICAgICAgICAgICAgICAgICAvLyBjb21tYW5kIG5hbWUgZS5nLiBpbnB1dFxuICAnKFxcXFx7fFxcXFx3fFxcXFx9fC98XFxcXF18XFxcXFspKicgIC8vIG9wdGlvbnMgdG8gdGhlIGNvbW1hbmRcbilcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWFnaWNQYXJzZXIgZXh0ZW5kcyBQYXJzZXIge1xuICBwYXJzZSAoKSB7XG4gICAgY29uc3QgcmVzdWx0ID0ge31cbiAgICBjb25zdCBsaW5lcyA9IHRoaXMuZ2V0TGluZXMoW10pXG4gICAgZm9yIChjb25zdCBsaW5lIG9mIGxpbmVzKSB7XG4gICAgICBjb25zdCBsYXRleENvbW1hbmRNYXRjaCA9IGxpbmUubWF0Y2goTEFURVhfQ09NTUFORF9QQVRURVJOKVxuICAgICAgaWYgKGxhdGV4Q29tbWFuZE1hdGNoKSB7IGJyZWFrIH0gLy8gU3RvcCBwYXJzaW5nIGlmIGEgbGF0ZXggY29tbWFuZCB3YXMgZm91bmRcblxuICAgICAgY29uc3QgbWF0Y2ggPSBsaW5lLm1hdGNoKE1BR0lDX0NPTU1FTlRfUEFUVEVSTilcbiAgICAgIGlmIChtYXRjaCAhPSBudWxsKSB7XG4gICAgICAgIHJlc3VsdFttYXRjaFsxXV0gPSBtYXRjaFsyXS50cmltKClcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0XG4gIH1cbn1cbiJdfQ==