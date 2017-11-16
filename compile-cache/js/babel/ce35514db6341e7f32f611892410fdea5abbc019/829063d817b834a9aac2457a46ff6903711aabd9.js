Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

/** @babel */
/** @jsx etch.dom */

var _etch = require('etch');

var _etch2 = _interopRequireDefault(_etch);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _atom = require('atom');

function fileReferenceElement(filePath, range, referenceType) {
  if (!filePath) return '';

  var lineReference = range ? _etch2['default'].dom(
    'span',
    { className: 'latex-line-number' },
    range[0][0] + 1
  ) : '';
  var endLineReference = range && range[0][0] !== range[1][0] ? _etch2['default'].dom(
    'span',
    { className: 'latex-end-line-number' },
    range[1][0] + 1
  ) : '';
  var text = _path2['default'].basename(filePath);
  var clickHandler = function clickHandler() {
    atom.workspace.open(filePath, { initialLine: range ? range[0][0] : 0 });
  };
  var className = 'latex-' + referenceType + '-reference';

  return _etch2['default'].dom(
    'span',
    { className: className },
    _etch2['default'].dom(
      'span',
      { className: 'latex-file-link', onclick: clickHandler },
      text,
      lineReference,
      endLineReference
    )
  );
}

var LogMessage = (function () {
  function LogMessage() {
    var properties = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, LogMessage);

    this.properties = properties;
    _etch2['default'].initialize(this);
  }

  _createClass(LogMessage, [{
    key: 'destroy',
    value: _asyncToGenerator(function* () {
      yield _etch2['default'].destroy(this);
    })
  }, {
    key: 'render',
    value: function render() {
      var message = this.properties.message;

      return _etch2['default'].dom(
        'div',
        { className: this.getClassNames(message) },
        _etch2['default'].dom(
          'span',
          null,
          message.text
        ),
        fileReferenceElement(message.filePath, message.range, 'source'),
        fileReferenceElement(message.logPath, message.logRange, 'log')
      );
    }
  }, {
    key: 'getClassNames',
    value: function getClassNames(message) {
      var className = 'latex-' + message.type;

      var matchesFilePath = message.filePath && this.properties.filePath === message.filePath;
      var containsPosition = message.range && this.properties.position && _atom.Range.fromObject(message.range).containsPoint(this.properties.position);
      if (matchesFilePath && containsPosition) {
        return className + ' latex-highlight';
      }

      return className;
    }
  }, {
    key: 'update',
    value: function update(properties) {
      this.properties = properties;
      return _etch2['default'].update(this);
    }
  }]);

  return LogMessage;
})();

exports['default'] = LogMessage;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2JpbGx5Ly5hdG9tL3BhY2thZ2VzL2xhdGV4L2xpYi92aWV3cy9sb2ctbWVzc2FnZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7b0JBR2lCLE1BQU07Ozs7b0JBQ04sTUFBTTs7OztvQkFDRCxNQUFNOztBQUU1QixTQUFTLG9CQUFvQixDQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsYUFBYSxFQUFFO0FBQzdELE1BQUksQ0FBQyxRQUFRLEVBQUUsT0FBTyxFQUFFLENBQUE7O0FBRXhCLE1BQU0sYUFBYSxHQUFHLEtBQUssR0FBRzs7TUFBTSxTQUFTLEVBQUMsbUJBQW1CO0lBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7R0FBUSxHQUFHLEVBQUUsQ0FBQTtBQUMvRixNQUFNLGdCQUFnQixHQUFHLEFBQUMsS0FBSyxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUk7O01BQU0sU0FBUyxFQUFDLHVCQUF1QjtJQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDO0dBQVEsR0FBRyxFQUFFLENBQUE7QUFDdkksTUFBTSxJQUFJLEdBQUcsa0JBQUssUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFBO0FBQ3BDLE1BQU0sWUFBWSxHQUFHLFNBQWYsWUFBWSxHQUFTO0FBQ3pCLFFBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxFQUFFLFdBQVcsRUFBRSxLQUFLLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUE7R0FDeEUsQ0FBQTtBQUNELE1BQU0sU0FBUyxjQUFZLGFBQWEsZUFBWSxDQUFBOztBQUVwRCxTQUNFOztNQUFNLFNBQVMsRUFBRSxTQUFTLEFBQUM7SUFDekI7O1FBQU0sU0FBUyxFQUFDLGlCQUFpQixFQUFDLE9BQU8sRUFBRSxZQUFZLEFBQUM7TUFDckQsSUFBSTtNQUNKLGFBQWE7TUFDYixnQkFBZ0I7S0FDWjtHQUNGLENBQ1I7Q0FDRjs7SUFFb0IsVUFBVTtBQUNqQixXQURPLFVBQVUsR0FDQztRQUFqQixVQUFVLHlEQUFHLEVBQUU7OzBCQURULFVBQVU7O0FBRTNCLFFBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFBO0FBQzVCLHNCQUFLLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQTtHQUN0Qjs7ZUFKa0IsVUFBVTs7NkJBTWYsYUFBRztBQUNmLFlBQU0sa0JBQUssT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFBO0tBQ3pCOzs7V0FFTSxrQkFBRztBQUNSLFVBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFBOztBQUV2QyxhQUNFOztVQUFLLFNBQVMsRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxBQUFDO1FBQzFDOzs7VUFBTyxPQUFPLENBQUMsSUFBSTtTQUFRO1FBQzFCLG9CQUFvQixDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUM7UUFDL0Qsb0JBQW9CLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQztPQUMzRCxDQUNQO0tBQ0Y7OztXQUVhLHVCQUFDLE9BQU8sRUFBRTtBQUN0QixVQUFNLFNBQVMsY0FBWSxPQUFPLENBQUMsSUFBSSxBQUFFLENBQUE7O0FBRXpDLFVBQU0sZUFBZSxHQUFHLE9BQU8sQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLEtBQUssT0FBTyxDQUFDLFFBQVEsQ0FBQTtBQUN6RixVQUFNLGdCQUFnQixHQUFHLE9BQU8sQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLElBQUksWUFBTSxVQUFVLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFBO0FBQzdJLFVBQUksZUFBZSxJQUFJLGdCQUFnQixFQUFFO0FBQ3ZDLGVBQVUsU0FBUyxzQkFBa0I7T0FDdEM7O0FBRUQsYUFBTyxTQUFTLENBQUE7S0FDakI7OztXQUVNLGdCQUFDLFVBQVUsRUFBRTtBQUNsQixVQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQTtBQUM1QixhQUFPLGtCQUFLLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQTtLQUN6Qjs7O1NBckNrQixVQUFVOzs7cUJBQVYsVUFBVSIsImZpbGUiOiIvaG9tZS9iaWxseS8uYXRvbS9wYWNrYWdlcy9sYXRleC9saWIvdmlld3MvbG9nLW1lc3NhZ2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiogQGJhYmVsICovXG4vKiogQGpzeCBldGNoLmRvbSAqL1xuXG5pbXBvcnQgZXRjaCBmcm9tICdldGNoJ1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcbmltcG9ydCB7IFJhbmdlIH0gZnJvbSAnYXRvbSdcblxuZnVuY3Rpb24gZmlsZVJlZmVyZW5jZUVsZW1lbnQgKGZpbGVQYXRoLCByYW5nZSwgcmVmZXJlbmNlVHlwZSkge1xuICBpZiAoIWZpbGVQYXRoKSByZXR1cm4gJydcblxuICBjb25zdCBsaW5lUmVmZXJlbmNlID0gcmFuZ2UgPyA8c3BhbiBjbGFzc05hbWU9J2xhdGV4LWxpbmUtbnVtYmVyJz57cmFuZ2VbMF1bMF0gKyAxfTwvc3Bhbj4gOiAnJ1xuICBjb25zdCBlbmRMaW5lUmVmZXJlbmNlID0gKHJhbmdlICYmIHJhbmdlWzBdWzBdICE9PSByYW5nZVsxXVswXSkgPyA8c3BhbiBjbGFzc05hbWU9J2xhdGV4LWVuZC1saW5lLW51bWJlcic+e3JhbmdlWzFdWzBdICsgMX08L3NwYW4+IDogJydcbiAgY29uc3QgdGV4dCA9IHBhdGguYmFzZW5hbWUoZmlsZVBhdGgpXG4gIGNvbnN0IGNsaWNrSGFuZGxlciA9ICgpID0+IHtcbiAgICBhdG9tLndvcmtzcGFjZS5vcGVuKGZpbGVQYXRoLCB7IGluaXRpYWxMaW5lOiByYW5nZSA/IHJhbmdlWzBdWzBdIDogMCB9KVxuICB9XG4gIGNvbnN0IGNsYXNzTmFtZSA9IGBsYXRleC0ke3JlZmVyZW5jZVR5cGV9LXJlZmVyZW5jZWBcblxuICByZXR1cm4gKFxuICAgIDxzcGFuIGNsYXNzTmFtZT17Y2xhc3NOYW1lfT5cbiAgICAgIDxzcGFuIGNsYXNzTmFtZT0nbGF0ZXgtZmlsZS1saW5rJyBvbmNsaWNrPXtjbGlja0hhbmRsZXJ9PlxuICAgICAgICB7dGV4dH1cbiAgICAgICAge2xpbmVSZWZlcmVuY2V9XG4gICAgICAgIHtlbmRMaW5lUmVmZXJlbmNlfVxuICAgICAgPC9zcGFuPlxuICAgIDwvc3Bhbj5cbiAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMb2dNZXNzYWdlIHtcbiAgY29uc3RydWN0b3IgKHByb3BlcnRpZXMgPSB7fSkge1xuICAgIHRoaXMucHJvcGVydGllcyA9IHByb3BlcnRpZXNcbiAgICBldGNoLmluaXRpYWxpemUodGhpcylcbiAgfVxuXG4gIGFzeW5jIGRlc3Ryb3kgKCkge1xuICAgIGF3YWl0IGV0Y2guZGVzdHJveSh0aGlzKVxuICB9XG5cbiAgcmVuZGVyICgpIHtcbiAgICBjb25zdCBtZXNzYWdlID0gdGhpcy5wcm9wZXJ0aWVzLm1lc3NhZ2VcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT17dGhpcy5nZXRDbGFzc05hbWVzKG1lc3NhZ2UpfT5cbiAgICAgICAgPHNwYW4+e21lc3NhZ2UudGV4dH08L3NwYW4+XG4gICAgICAgIHtmaWxlUmVmZXJlbmNlRWxlbWVudChtZXNzYWdlLmZpbGVQYXRoLCBtZXNzYWdlLnJhbmdlLCAnc291cmNlJyl9XG4gICAgICAgIHtmaWxlUmVmZXJlbmNlRWxlbWVudChtZXNzYWdlLmxvZ1BhdGgsIG1lc3NhZ2UubG9nUmFuZ2UsICdsb2cnKX1cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIGdldENsYXNzTmFtZXMgKG1lc3NhZ2UpIHtcbiAgICBjb25zdCBjbGFzc05hbWUgPSBgbGF0ZXgtJHttZXNzYWdlLnR5cGV9YFxuXG4gICAgY29uc3QgbWF0Y2hlc0ZpbGVQYXRoID0gbWVzc2FnZS5maWxlUGF0aCAmJiB0aGlzLnByb3BlcnRpZXMuZmlsZVBhdGggPT09IG1lc3NhZ2UuZmlsZVBhdGhcbiAgICBjb25zdCBjb250YWluc1Bvc2l0aW9uID0gbWVzc2FnZS5yYW5nZSAmJiB0aGlzLnByb3BlcnRpZXMucG9zaXRpb24gJiYgUmFuZ2UuZnJvbU9iamVjdChtZXNzYWdlLnJhbmdlKS5jb250YWluc1BvaW50KHRoaXMucHJvcGVydGllcy5wb3NpdGlvbilcbiAgICBpZiAobWF0Y2hlc0ZpbGVQYXRoICYmIGNvbnRhaW5zUG9zaXRpb24pIHtcbiAgICAgIHJldHVybiBgJHtjbGFzc05hbWV9IGxhdGV4LWhpZ2hsaWdodGBcbiAgICB9XG5cbiAgICByZXR1cm4gY2xhc3NOYW1lXG4gIH1cblxuICB1cGRhdGUgKHByb3BlcnRpZXMpIHtcbiAgICB0aGlzLnByb3BlcnRpZXMgPSBwcm9wZXJ0aWVzXG4gICAgcmV0dXJuIGV0Y2gudXBkYXRlKHRoaXMpXG4gIH1cbn1cbiJdfQ==