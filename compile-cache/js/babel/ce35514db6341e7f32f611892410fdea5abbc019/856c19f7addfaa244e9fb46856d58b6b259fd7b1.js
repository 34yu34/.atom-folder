Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _underscorePlus = require('underscore-plus');

'use babel';

var Settings = (function () {
  function Settings() {
    _classCallCheck(this, Settings);
  }

  _createClass(Settings, [{
    key: 'update',
    value: function update() {
      var settings = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      this.load(settings);
    }
  }, {
    key: 'load',
    value: function load() {
      var values = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      var settings = values;
      if ('global' in settings) {
        settings['*'] = settings.global;
        delete settings.global;
      }

      if ('*' in settings) {
        var scopedSettings = settings;
        settings = settings['*'];
        delete scopedSettings['*'];

        (0, _underscorePlus.each)(scopedSettings, this.set, this);
      }

      this.set(settings);
    }
  }, {
    key: 'set',
    value: function set(settings, scope) {
      var flatSettings = {};
      var options = scope ? { scopeSelector: scope } : {};
      options.save = false;
      this.flatten(flatSettings, settings);

      (0, _underscorePlus.each)(flatSettings, function (value, key) {
        atom.config.set(key, value, options);
      });
    }
  }, {
    key: 'flatten',
    value: function flatten(root, dict, path) {
      var _this = this;

      var dotPath = undefined;
      var valueIsObject = undefined;

      (0, _underscorePlus.each)(dict, function (value, key) {
        dotPath = path ? path + '.' + key : key;
        valueIsObject = !(0, _underscorePlus.isArray)(value) && (0, _underscorePlus.isObject)(value);

        if (valueIsObject) {
          _this.flatten(root, dict[key], dotPath);
        } else {
          root[dotPath] = value; // eslint-disable-line no-param-reassign
        }
      }, this);
    }
  }]);

  return Settings;
})();

exports['default'] = Settings;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2JpbGx5Ly5hdG9tL3BhY2thZ2VzL3Byb2plY3QtbWFuYWdlci9saWIvU2V0dGluZ3MuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OEJBRXdDLGlCQUFpQjs7QUFGekQsV0FBVyxDQUFDOztJQUlTLFFBQVE7V0FBUixRQUFROzBCQUFSLFFBQVE7OztlQUFSLFFBQVE7O1dBQ3JCLGtCQUFnQjtVQUFmLFFBQVEseURBQUcsRUFBRTs7QUFDbEIsVUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztLQUNyQjs7O1dBRUcsZ0JBQWM7VUFBYixNQUFNLHlEQUFHLEVBQUU7O0FBQ2QsVUFBSSxRQUFRLEdBQUcsTUFBTSxDQUFDO0FBQ3RCLFVBQUksUUFBUSxJQUFJLFFBQVEsRUFBRTtBQUN4QixnQkFBUSxDQUFDLEdBQUcsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUM7QUFDaEMsZUFBTyxRQUFRLENBQUMsTUFBTSxDQUFDO09BQ3hCOztBQUVELFVBQUksR0FBRyxJQUFJLFFBQVEsRUFBRTtBQUNuQixZQUFNLGNBQWMsR0FBRyxRQUFRLENBQUM7QUFDaEMsZ0JBQVEsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDekIsZUFBTyxjQUFjLENBQUMsR0FBRyxDQUFDLENBQUM7O0FBRTNCLGtDQUFLLGNBQWMsRUFBRSxJQUFJLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO09BQ3RDOztBQUVELFVBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7S0FDcEI7OztXQUVFLGFBQUMsUUFBUSxFQUFFLEtBQUssRUFBRTtBQUNuQixVQUFNLFlBQVksR0FBRyxFQUFFLENBQUM7QUFDeEIsVUFBTSxPQUFPLEdBQUcsS0FBSyxHQUFHLEVBQUUsYUFBYSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsQ0FBQztBQUN0RCxhQUFPLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQztBQUNyQixVQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksRUFBRSxRQUFRLENBQUMsQ0FBQzs7QUFFckMsZ0NBQUssWUFBWSxFQUFFLFVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBSztBQUNqQyxZQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO09BQ3RDLENBQUMsQ0FBQztLQUNKOzs7V0FFTSxpQkFBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRTs7O0FBQ3hCLFVBQUksT0FBTyxZQUFBLENBQUM7QUFDWixVQUFJLGFBQWEsWUFBQSxDQUFDOztBQUVsQixnQ0FBSyxJQUFJLEVBQUUsVUFBQyxLQUFLLEVBQUUsR0FBRyxFQUFLO0FBQ3pCLGVBQU8sR0FBRyxJQUFJLEdBQU0sSUFBSSxTQUFJLEdBQUcsR0FBSyxHQUFHLENBQUM7QUFDeEMscUJBQWEsR0FBRyxDQUFDLDZCQUFRLEtBQUssQ0FBQyxJQUFJLDhCQUFTLEtBQUssQ0FBQyxDQUFDOztBQUVuRCxZQUFJLGFBQWEsRUFBRTtBQUNqQixnQkFBSyxPQUFPLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztTQUN4QyxNQUFNO0FBQ0wsY0FBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEtBQUssQ0FBQztTQUN2QjtPQUNGLEVBQUUsSUFBSSxDQUFDLENBQUM7S0FDVjs7O1NBaERrQixRQUFROzs7cUJBQVIsUUFBUSIsImZpbGUiOiIvaG9tZS9iaWxseS8uYXRvbS9wYWNrYWdlcy9wcm9qZWN0LW1hbmFnZXIvbGliL1NldHRpbmdzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmltcG9ydCB7IGVhY2gsIGlzQXJyYXksIGlzT2JqZWN0IH0gZnJvbSAndW5kZXJzY29yZS1wbHVzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2V0dGluZ3Mge1xuICB1cGRhdGUoc2V0dGluZ3MgPSB7fSkge1xuICAgIHRoaXMubG9hZChzZXR0aW5ncyk7XG4gIH1cblxuICBsb2FkKHZhbHVlcyA9IHt9KSB7XG4gICAgbGV0IHNldHRpbmdzID0gdmFsdWVzO1xuICAgIGlmICgnZ2xvYmFsJyBpbiBzZXR0aW5ncykge1xuICAgICAgc2V0dGluZ3NbJyonXSA9IHNldHRpbmdzLmdsb2JhbDtcbiAgICAgIGRlbGV0ZSBzZXR0aW5ncy5nbG9iYWw7XG4gICAgfVxuXG4gICAgaWYgKCcqJyBpbiBzZXR0aW5ncykge1xuICAgICAgY29uc3Qgc2NvcGVkU2V0dGluZ3MgPSBzZXR0aW5ncztcbiAgICAgIHNldHRpbmdzID0gc2V0dGluZ3NbJyonXTtcbiAgICAgIGRlbGV0ZSBzY29wZWRTZXR0aW5nc1snKiddO1xuXG4gICAgICBlYWNoKHNjb3BlZFNldHRpbmdzLCB0aGlzLnNldCwgdGhpcyk7XG4gICAgfVxuXG4gICAgdGhpcy5zZXQoc2V0dGluZ3MpO1xuICB9XG5cbiAgc2V0KHNldHRpbmdzLCBzY29wZSkge1xuICAgIGNvbnN0IGZsYXRTZXR0aW5ncyA9IHt9O1xuICAgIGNvbnN0IG9wdGlvbnMgPSBzY29wZSA/IHsgc2NvcGVTZWxlY3Rvcjogc2NvcGUgfSA6IHt9O1xuICAgIG9wdGlvbnMuc2F2ZSA9IGZhbHNlO1xuICAgIHRoaXMuZmxhdHRlbihmbGF0U2V0dGluZ3MsIHNldHRpbmdzKTtcblxuICAgIGVhY2goZmxhdFNldHRpbmdzLCAodmFsdWUsIGtleSkgPT4ge1xuICAgICAgYXRvbS5jb25maWcuc2V0KGtleSwgdmFsdWUsIG9wdGlvbnMpO1xuICAgIH0pO1xuICB9XG5cbiAgZmxhdHRlbihyb290LCBkaWN0LCBwYXRoKSB7XG4gICAgbGV0IGRvdFBhdGg7XG4gICAgbGV0IHZhbHVlSXNPYmplY3Q7XG5cbiAgICBlYWNoKGRpY3QsICh2YWx1ZSwga2V5KSA9PiB7XG4gICAgICBkb3RQYXRoID0gcGF0aCA/IGAke3BhdGh9LiR7a2V5fWAgOiBrZXk7XG4gICAgICB2YWx1ZUlzT2JqZWN0ID0gIWlzQXJyYXkodmFsdWUpICYmIGlzT2JqZWN0KHZhbHVlKTtcblxuICAgICAgaWYgKHZhbHVlSXNPYmplY3QpIHtcbiAgICAgICAgdGhpcy5mbGF0dGVuKHJvb3QsIGRpY3Rba2V5XSwgZG90UGF0aCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByb290W2RvdFBhdGhdID0gdmFsdWU7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tcGFyYW0tcmVhc3NpZ25cbiAgICAgIH1cbiAgICB9LCB0aGlzKTtcbiAgfVxufVxuIl19