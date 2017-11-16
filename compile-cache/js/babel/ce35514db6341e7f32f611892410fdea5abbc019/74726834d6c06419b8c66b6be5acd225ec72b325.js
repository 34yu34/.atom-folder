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

var SECTION_PATTERN = /^\["([^"]+)"]/;
var GROUP_PATTERN = /^\s+\(([^)]+)\)/;
var FILE_PATTERN = /^\s+"([^"]*)"/;

var FdbParser = (function (_Parser) {
  _inherits(FdbParser, _Parser);

  function FdbParser() {
    _classCallCheck(this, FdbParser);

    _get(Object.getPrototypeOf(FdbParser.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(FdbParser, [{
    key: 'parse',
    value: function parse() {
      var results = {};
      var section = undefined;
      var group = undefined;

      for (var line of this.getLines()) {
        var sectionMatch = line.match(SECTION_PATTERN);
        if (sectionMatch) {
          section = sectionMatch[1];
          results[section] = {};
          group = 'source';
          results[section][group] = [];
          continue;
        }

        if (!section) continue;

        var groupMatch = line.match(GROUP_PATTERN);
        if (groupMatch) {
          group = groupMatch[1];
          if (!results[section][group]) {
            results[section][group] = [];
          }
          continue;
        }

        if (!group) continue;

        var fileMatch = line.match(FILE_PATTERN);
        if (fileMatch) {
          results[section][group].push(fileMatch[1]);
        }
      }

      return results;
    }
  }]);

  return FdbParser;
})(_parserJs2['default']);

exports['default'] = FdbParser;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2JpbGx5Ly5hdG9tL3BhY2thZ2VzL2xhdGV4L2xpYi9wYXJzZXJzL2ZkYi1wYXJzZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozt3QkFFbUIsY0FBYzs7OztBQUVqQyxJQUFNLGVBQWUsR0FBRyxlQUFlLENBQUE7QUFDdkMsSUFBTSxhQUFhLEdBQUcsaUJBQWlCLENBQUE7QUFDdkMsSUFBTSxZQUFZLEdBQUcsZUFBZSxDQUFBOztJQUVmLFNBQVM7WUFBVCxTQUFTOztXQUFULFNBQVM7MEJBQVQsU0FBUzs7K0JBQVQsU0FBUzs7O2VBQVQsU0FBUzs7V0FDdEIsaUJBQUc7QUFDUCxVQUFJLE9BQU8sR0FBRyxFQUFFLENBQUE7QUFDaEIsVUFBSSxPQUFPLFlBQUEsQ0FBQTtBQUNYLFVBQUksS0FBSyxZQUFBLENBQUE7O0FBRVQsV0FBSyxJQUFNLElBQUksSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFLEVBQUU7QUFDbEMsWUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUMsQ0FBQTtBQUNoRCxZQUFJLFlBQVksRUFBRTtBQUNoQixpQkFBTyxHQUFHLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUN6QixpQkFBTyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQTtBQUNyQixlQUFLLEdBQUcsUUFBUSxDQUFBO0FBQ2hCLGlCQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFBO0FBQzVCLG1CQUFRO1NBQ1Q7O0FBRUQsWUFBSSxDQUFDLE9BQU8sRUFBRSxTQUFROztBQUV0QixZQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFBO0FBQzVDLFlBQUksVUFBVSxFQUFFO0FBQ2QsZUFBSyxHQUFHLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUNyQixjQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFO0FBQzVCLG1CQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFBO1dBQzdCO0FBQ0QsbUJBQVE7U0FDVDs7QUFFRCxZQUFJLENBQUMsS0FBSyxFQUFFLFNBQVE7O0FBRXBCLFlBQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUE7QUFDMUMsWUFBSSxTQUFTLEVBQUU7QUFDYixpQkFBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtTQUMzQztPQUNGOztBQUVELGFBQU8sT0FBTyxDQUFBO0tBQ2Y7OztTQXBDa0IsU0FBUzs7O3FCQUFULFNBQVMiLCJmaWxlIjoiL2hvbWUvYmlsbHkvLmF0b20vcGFja2FnZXMvbGF0ZXgvbGliL3BhcnNlcnMvZmRiLXBhcnNlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBAYmFiZWwgKi9cblxuaW1wb3J0IFBhcnNlciBmcm9tICcuLi9wYXJzZXIuanMnXG5cbmNvbnN0IFNFQ1RJT05fUEFUVEVSTiA9IC9eXFxbXCIoW15cIl0rKVwiXS9cbmNvbnN0IEdST1VQX1BBVFRFUk4gPSAvXlxccytcXCgoW14pXSspXFwpL1xuY29uc3QgRklMRV9QQVRURVJOID0gL15cXHMrXCIoW15cIl0qKVwiL1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBGZGJQYXJzZXIgZXh0ZW5kcyBQYXJzZXIge1xuICBwYXJzZSAoKSB7XG4gICAgbGV0IHJlc3VsdHMgPSB7fVxuICAgIGxldCBzZWN0aW9uXG4gICAgbGV0IGdyb3VwXG5cbiAgICBmb3IgKGNvbnN0IGxpbmUgb2YgdGhpcy5nZXRMaW5lcygpKSB7XG4gICAgICBjb25zdCBzZWN0aW9uTWF0Y2ggPSBsaW5lLm1hdGNoKFNFQ1RJT05fUEFUVEVSTilcbiAgICAgIGlmIChzZWN0aW9uTWF0Y2gpIHtcbiAgICAgICAgc2VjdGlvbiA9IHNlY3Rpb25NYXRjaFsxXVxuICAgICAgICByZXN1bHRzW3NlY3Rpb25dID0ge31cbiAgICAgICAgZ3JvdXAgPSAnc291cmNlJ1xuICAgICAgICByZXN1bHRzW3NlY3Rpb25dW2dyb3VwXSA9IFtdXG4gICAgICAgIGNvbnRpbnVlXG4gICAgICB9XG5cbiAgICAgIGlmICghc2VjdGlvbikgY29udGludWVcblxuICAgICAgY29uc3QgZ3JvdXBNYXRjaCA9IGxpbmUubWF0Y2goR1JPVVBfUEFUVEVSTilcbiAgICAgIGlmIChncm91cE1hdGNoKSB7XG4gICAgICAgIGdyb3VwID0gZ3JvdXBNYXRjaFsxXVxuICAgICAgICBpZiAoIXJlc3VsdHNbc2VjdGlvbl1bZ3JvdXBdKSB7XG4gICAgICAgICAgcmVzdWx0c1tzZWN0aW9uXVtncm91cF0gPSBbXVxuICAgICAgICB9XG4gICAgICAgIGNvbnRpbnVlXG4gICAgICB9XG5cbiAgICAgIGlmICghZ3JvdXApIGNvbnRpbnVlXG5cbiAgICAgIGNvbnN0IGZpbGVNYXRjaCA9IGxpbmUubWF0Y2goRklMRV9QQVRURVJOKVxuICAgICAgaWYgKGZpbGVNYXRjaCkge1xuICAgICAgICByZXN1bHRzW3NlY3Rpb25dW2dyb3VwXS5wdXNoKGZpbGVNYXRjaFsxXSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0c1xuICB9XG59XG4iXX0=