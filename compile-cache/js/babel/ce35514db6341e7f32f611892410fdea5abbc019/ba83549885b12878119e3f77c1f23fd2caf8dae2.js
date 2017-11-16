Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

/** @babel */

var _fsPlus = require('fs-plus');

var _fsPlus2 = _interopRequireDefault(_fsPlus);

var Parser = (function () {
  function Parser(filePath) {
    _classCallCheck(this, Parser);

    this.filePath = filePath;
  }

  _createClass(Parser, [{
    key: 'parse',
    value: function parse() {}
  }, {
    key: 'getLines',
    value: function getLines(defaultLines) {
      if (!_fsPlus2['default'].existsSync(this.filePath)) {
        if (defaultLines) return defaultLines;
        throw new Error('No such file: ' + this.filePath);
      }

      var rawFile = _fsPlus2['default'].readFileSync(this.filePath, { encoding: 'utf-8' });
      var lines = rawFile.replace(/(\r\n)|\r/g, '\n').split('\n');
      return lines;
    }
  }]);

  return Parser;
})();

exports['default'] = Parser;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2JpbGx5Ly5hdG9tL3BhY2thZ2VzL2xhdGV4L2xpYi9wYXJzZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O3NCQUVlLFNBQVM7Ozs7SUFFSCxNQUFNO0FBQ2IsV0FETyxNQUFNLENBQ1osUUFBUSxFQUFFOzBCQURKLE1BQU07O0FBRXZCLFFBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFBO0dBQ3pCOztlQUhrQixNQUFNOztXQUtuQixpQkFBRyxFQUFFOzs7V0FFRixrQkFBQyxZQUFZLEVBQUU7QUFDdEIsVUFBSSxDQUFDLG9CQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUU7QUFDakMsWUFBSSxZQUFZLEVBQUUsT0FBTyxZQUFZLENBQUE7QUFDckMsY0FBTSxJQUFJLEtBQUssb0JBQWtCLElBQUksQ0FBQyxRQUFRLENBQUcsQ0FBQTtPQUNsRDs7QUFFRCxVQUFNLE9BQU8sR0FBRyxvQkFBRyxZQUFZLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxFQUFDLFFBQVEsRUFBRSxPQUFPLEVBQUMsQ0FBQyxDQUFBO0FBQ25FLFVBQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQTtBQUM3RCxhQUFPLEtBQUssQ0FBQTtLQUNiOzs7U0FoQmtCLE1BQU07OztxQkFBTixNQUFNIiwiZmlsZSI6Ii9ob21lL2JpbGx5Ly5hdG9tL3BhY2thZ2VzL2xhdGV4L2xpYi9wYXJzZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiogQGJhYmVsICovXG5cbmltcG9ydCBmcyBmcm9tICdmcy1wbHVzJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQYXJzZXIge1xuICBjb25zdHJ1Y3RvciAoZmlsZVBhdGgpIHtcbiAgICB0aGlzLmZpbGVQYXRoID0gZmlsZVBhdGhcbiAgfVxuXG4gIHBhcnNlICgpIHt9XG5cbiAgZ2V0TGluZXMgKGRlZmF1bHRMaW5lcykge1xuICAgIGlmICghZnMuZXhpc3RzU3luYyh0aGlzLmZpbGVQYXRoKSkge1xuICAgICAgaWYgKGRlZmF1bHRMaW5lcykgcmV0dXJuIGRlZmF1bHRMaW5lc1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBObyBzdWNoIGZpbGU6ICR7dGhpcy5maWxlUGF0aH1gKVxuICAgIH1cblxuICAgIGNvbnN0IHJhd0ZpbGUgPSBmcy5yZWFkRmlsZVN5bmModGhpcy5maWxlUGF0aCwge2VuY29kaW5nOiAndXRmLTgnfSlcbiAgICBjb25zdCBsaW5lcyA9IHJhd0ZpbGUucmVwbGFjZSgvKFxcclxcbil8XFxyL2csICdcXG4nKS5zcGxpdCgnXFxuJylcbiAgICByZXR1cm4gbGluZXNcbiAgfVxufVxuIl19