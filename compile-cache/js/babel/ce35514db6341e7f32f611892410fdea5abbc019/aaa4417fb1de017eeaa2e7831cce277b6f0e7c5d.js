Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _codeContext = require('./code-context');

var _codeContext2 = _interopRequireDefault(_codeContext);

var _grammars = require('./grammars');

var _grammars2 = _interopRequireDefault(_grammars);

'use babel';

var CodeContextBuilder = (function () {
  function CodeContextBuilder() {
    var emitter = arguments.length <= 0 || arguments[0] === undefined ? new _atom.Emitter() : arguments[0];

    _classCallCheck(this, CodeContextBuilder);

    this.emitter = emitter;
  }

  _createClass(CodeContextBuilder, [{
    key: 'destroy',
    value: function destroy() {
      this.emitter.dispose();
    }

    // Public: Builds code context for specified argType
    //
    // editor - Atom's {TextEditor} instance
    // argType - {String} with one of the following values:
    //
    // * "Selection Based" (default)
    // * "Line Number Based",
    // * "File Based"
    //
    // returns a {CodeContext} object
  }, {
    key: 'buildCodeContext',
    value: function buildCodeContext(editor) {
      var argType = arguments.length <= 1 || arguments[1] === undefined ? 'Selection Based' : arguments[1];

      if (!editor) return null;

      var codeContext = this.initCodeContext(editor);

      codeContext.argType = argType;

      if (argType === 'Line Number Based') {
        editor.save();
      } else if (codeContext.selection.isEmpty() && codeContext.filepath) {
        codeContext.argType = 'File Based';
        if (editor && editor.isModified()) editor.save();
      }

      // Selection and Line Number Based runs both benefit from knowing the current line
      // number
      if (argType !== 'File Based') {
        var cursor = editor.getLastCursor();
        codeContext.lineNumber = cursor.getScreenRow() + 1;
      }

      return codeContext;
    }
  }, {
    key: 'initCodeContext',
    value: function initCodeContext(editor) {
      var filename = editor.getTitle();
      var filepath = editor.getPath();
      var selection = editor.getLastSelection();
      var ignoreSelection = atom.config.get('script.ignoreSelection');

      // If the selection was empty or if ignore selection is on, then "select" ALL
      // of the text
      // This allows us to run on new files
      var textSource = undefined;
      if (selection.isEmpty() || ignoreSelection) {
        textSource = editor;
      } else {
        textSource = selection;
      }

      var codeContext = new _codeContext2['default'](filename, filepath, textSource);
      codeContext.selection = selection;
      codeContext.shebang = this.getShebang(editor);

      var lang = this.getLang(editor);

      if (this.validateLang(lang)) {
        codeContext.lang = lang;
      }

      return codeContext;
    }
  }, {
    key: 'getShebang',
    value: function getShebang(editor) {
      if (process.platform === 'win32') return null;
      var text = editor.getText();
      var lines = text.split('\n');
      var firstLine = lines[0];
      if (!firstLine.match(/^#!/)) return null;

      return firstLine.replace(/^#!\s*/, '');
    }
  }, {
    key: 'getLang',
    value: function getLang(editor) {
      return editor.getGrammar().name;
    }
  }, {
    key: 'validateLang',
    value: function validateLang(lang) {
      var valid = true;

      // Determine if no language is selected.
      if (lang === 'Null Grammar' || lang === 'Plain Text') {
        this.emitter.emit('did-not-specify-language');
        valid = false;

        // Provide them a dialog to submit an issue on GH, prepopulated with their
        // language of choice.
      } else if (!(lang in _grammars2['default'])) {
          this.emitter.emit('did-not-support-language', { lang: lang });
          valid = false;
        }

      return valid;
    }
  }, {
    key: 'onDidNotSpecifyLanguage',
    value: function onDidNotSpecifyLanguage(callback) {
      return this.emitter.on('did-not-specify-language', callback);
    }
  }, {
    key: 'onDidNotSupportLanguage',
    value: function onDidNotSupportLanguage(callback) {
      return this.emitter.on('did-not-support-language', callback);
    }
  }]);

  return CodeContextBuilder;
})();

exports['default'] = CodeContextBuilder;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2JpbGx5Ly5hdG9tL3BhY2thZ2VzL3NjcmlwdC9saWIvY29kZS1jb250ZXh0LWJ1aWxkZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztvQkFFd0IsTUFBTTs7MkJBRU4sZ0JBQWdCOzs7O3dCQUNqQixZQUFZOzs7O0FBTG5DLFdBQVcsQ0FBQzs7SUFPUyxrQkFBa0I7QUFDMUIsV0FEUSxrQkFBa0IsR0FDQTtRQUF6QixPQUFPLHlEQUFHLG1CQUFhOzswQkFEaEIsa0JBQWtCOztBQUVuQyxRQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztHQUN4Qjs7ZUFIa0Isa0JBQWtCOztXQUs5QixtQkFBRztBQUNSLFVBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUM7S0FDeEI7Ozs7Ozs7Ozs7Ozs7O1dBWWUsMEJBQUMsTUFBTSxFQUErQjtVQUE3QixPQUFPLHlEQUFHLGlCQUFpQjs7QUFDbEQsVUFBSSxDQUFDLE1BQU0sRUFBRSxPQUFPLElBQUksQ0FBQzs7QUFFekIsVUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsQ0FBQzs7QUFFakQsaUJBQVcsQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDOztBQUU5QixVQUFJLE9BQU8sS0FBSyxtQkFBbUIsRUFBRTtBQUNuQyxjQUFNLENBQUMsSUFBSSxFQUFFLENBQUM7T0FDZixNQUFNLElBQUksV0FBVyxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsSUFBSSxXQUFXLENBQUMsUUFBUSxFQUFFO0FBQ2xFLG1CQUFXLENBQUMsT0FBTyxHQUFHLFlBQVksQ0FBQztBQUNuQyxZQUFJLE1BQU0sSUFBSSxNQUFNLENBQUMsVUFBVSxFQUFFLEVBQUUsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDO09BQ2xEOzs7O0FBSUQsVUFBSSxPQUFPLEtBQUssWUFBWSxFQUFFO0FBQzVCLFlBQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxhQUFhLEVBQUUsQ0FBQztBQUN0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O1NBOUdrQixrQkFBa0I7OztxQkFBbEIsa0JBQWtCIiwiZmlsZSI6Ii9ob21lL2JpbGx5Ly5hdG9tL3BhY2thZ2VzL3NjcmlwdC9saWIvY29kZS1jb250ZXh0LWJ1aWxkZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuaW1wb3J0IHsgRW1pdHRlciB9IGZyb20gJ2F0b20nO1xuXG5pbXBvcnQgQ29kZUNvbnRleHQgZnJvbSAnLi9jb2RlLWNvbnRleHQnO1xuaW1wb3J0IGdyYW1tYXJNYXAgZnJvbSAnLi9ncmFtbWFycyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvZGVDb250ZXh0QnVpbGRlciB7XG4gIGNvbnN0cnVjdG9yKGVtaXR0ZXIgPSBuZXcgRW1pdHRlcigpKSB7XG4gICAgdGhpcy5lbWl0dGVyID0gZW1pdHRlcjtcbiAgfVxuXG4gIGRlc3Ryb3koKSB7XG4gICAgdGhpcy5lbWl0dGVyLmRpc3Bvc2UoKTtcbiAgfVxuXG4gIC8vIFB1YmxpYzogQnVpbGRzIGNvZGUgY29udGV4dCBmb3Igc3BlY2lmaWVkIGFyZ1R5cGVcbiAgLy9cbiAgLy8gZWRpdG9yIC0gQXRvbSdzIHtUZXh0RWRpdG9yfSBpbnN0YW5jZVxuICAvLyBhcmdUeXBlIC0ge1N0cmluZ30gd2l0aCBvbmUgb2YgdGhlIGZvbGxvd2luZyB2YWx1ZXM6XG4gIC8vXG4gIC8vICogXCJTZWxlY3Rpb24gQmFzZWRcIiAoZGVmYXVsdClcbiAgLy8gKiBcIkxpbmUgTnVtYmVyIEJhc2VkXCIsXG4gIC8vICogXCJGaWxlIEJhc2VkXCJcbiAgLy9cbiAgLy8gcmV0dXJucyBhIHtDb2RlQ29udGV4dH0gb2JqZWN0XG4gIGJ1aWxkQ29kZUNvbnRleHQoZWRpdG9yLCBhcmdUeXBlID0gJ1NlbGVjdGlvbiBCYXNlZCcpIHtcbiAgICBpZiAoIWVkaXRvcikgcmV0dXJuIG51bGw7XG5cbiAgICBjb25zdCBjb2RlQ29udGV4dCA9IHRoaXMuaW5pdENvZGVDb250ZXh0KGVkaXRvcik7XG5cbiAgICBjb2RlQ29udGV4dC5hcmdUeXBlID0gYXJnVHlwZTtcblxuICAgIGlmIChhcmdUeXBlID09PSAnTGluZSBOdW1iZXIgQmFzZWQnKSB7XG4gICAgICBlZGl0b3Iuc2F2ZSgpO1xuICAgIH0gZWxzZSBpZiAoY29kZUNvbnRleHQuc2VsZWN0aW9uLmlzRW1wdHkoKSAmJiBjb2RlQ29udGV4dC5maWxlcGF0aCkge1xuICAgICAgY29kZUNvbnRleHQuYXJnVHlwZSA9ICdGaWxlIEJhc2VkJztcbiAgICAgIGlmIChlZGl0b3IgJiYgZWRpdG9yLmlzTW9kaWZpZWQoKSkgZWRpdG9yLnNhdmUoKTtcbiAgICB9XG5cbiAgICAvLyBTZWxlY3Rpb24gYW5kIExpbmUgTnVtYmVyIEJhc2VkIHJ1bnMgYm90aCBiZW5lZml0IGZyb20ga25vd2luZyB0aGUgY3VycmVudCBsaW5lXG4gICAgLy8gbnVtYmVyXG4gICAgaWYgKGFyZ1R5cGUgIT09ICdGaWxlIEJhc2VkJykge1xuICAgICAgY29uc3QgY3Vyc29yID0gZWRpdG9yLmdldExhc3RDdXJzb3IoKTtcbiAgICAgIGNvZGVDb250ZXh0LmxpbmVOdW1iZXIgPSBjdXJzb3IuZ2V0U2NyZWVuUm93KCkgKyAxO1xuICAgIH1cblxuICAgIHJldHVybiBjb2RlQ29udGV4dDtcbiAgfVxuXG4gIGluaXRDb2RlQ29udGV4dChlZGl0b3IpIHtcbiAgICBjb25zdCBmaWxlbmFtZSA9IGVkaXRvci5nZXRUaXRsZSgpO1xuICAgIGNvbnN0IGZpbGVwYXRoID0gZWRpdG9yLmdldFBhdGgoKTtcbiAgICBjb25zdCBzZWxlY3Rpb24gPSBlZGl0b3IuZ2V0TGFzdFNlbGVjdGlvbigpO1xuICAgIGNvbnN0IGlnbm9yZVNlbGVjdGlvbiA9IGF0b20uY29uZmlnLmdldCgnc2NyaXB0Lmlnbm9yZVNlbGVjdGlvbicpO1xuXG4gICAgLy8gSWYgdGhlIHNlbGVjdGlvbiB3YXMgZW1wdHkgb3IgaWYgaWdub3JlIHNlbGVjdGlvbiBpcyBvbiwgdGhlbiBcInNlbGVjdFwiIEFMTFxuICAgIC8vIG9mIHRoZSB0ZXh0XG4gICAgLy8gVGhpcyBhbGxvd3MgdXMgdG8gcnVuIG9uIG5ldyBmaWxlc1xuICAgIGxldCB0ZXh0U291cmNlO1xuICAgIGlmIChzZWxlY3Rpb24uaXNFbXB0eSgpIHx8IGlnbm9yZVNlbGVjdGlvbikge1xuICAgICAgdGV4dFNvdXJjZSA9IGVkaXRvcjtcbiAgICB9IGVsc2Uge1xuICAgICAgdGV4dFNvdXJjZSA9IHNlbGVjdGlvbjtcbiAgICB9XG5cbiAgICBjb25zdCBjb2RlQ29udGV4dCA9IG5ldyBDb2RlQ29udGV4dChmaWxlbmFtZSwgZmlsZXBhdGgsIHRleHRTb3VyY2UpO1xuICAgIGNvZGVDb250ZXh0LnNlbGVjdGlvbiA9IHNlbGVjdGlvbjtcbiAgICBjb2RlQ29udGV4dC5zaGViYW5nID0gdGhpcy5nZXRTaGViYW5nKGVkaXRvcik7XG5cbiAgICBjb25zdCBsYW5nID0gdGhpcy5nZXRMYW5nKGVkaXRvcik7XG5cbiAgICBpZiAodGhpcy52YWxpZGF0ZUxhbmcobGFuZykpIHtcbiAgICAgIGNvZGVDb250ZXh0LmxhbmcgPSBsYW5nO1xuICAgIH1cblxuICAgIHJldHVybiBjb2RlQ29udGV4dDtcbiAgfVxuXG4gIGdldFNoZWJhbmcoZWRpdG9yKSB7XG4gICAgaWYgKHByb2Nlc3MucGxhdGZvcm0gPT09ICd3aW4zMicpIHJldHVybiBudWxsO1xuICAgIGNvbnN0IHRleHQgPSBlZGl0b3IuZ2V0VGV4dCgpO1xuICAgIGNvbnN0IGxpbmVzID0gdGV4dC5zcGxpdCgnXFxuJyk7XG4gICAgY29uc3QgZmlyc3RMaW5lID0gbGluZXNbMF07XG4gICAgaWYgKCFmaXJzdExpbmUubWF0Y2goL14jIS8pKSByZXR1cm4gbnVsbDtcblxuICAgIHJldHVybiBmaXJzdExpbmUucmVwbGFjZSgvXiMhXFxzKi8sICcnKTtcbiAgfVxuXG4gIGdldExhbmcoZWRpdG9yKSB7XG4gICAgcmV0dXJuIGVkaXRvci5nZXRHcmFtbWFyKCkubmFtZTtcbiAgfVxuXG4gIHZhbGlkYXRlTGFuZyhsYW5nKSB7XG4gICAgbGV0IHZhbGlkID0gdHJ1ZTtcblxuICAgIC8vIERldGVybWluZSBpZiBubyBsYW5ndWFnZSBpcyBzZWxlY3RlZC5cbiAgICBpZiAobGFuZyA9PT0gJ051bGwgR3JhbW1hcicgfHwgbGFuZyA9PT0gJ1BsYWluIFRleHQnKSB7XG4gICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLW5vdC1zcGVjaWZ5LWxhbmd1YWdlJyk7XG4gICAgICB2YWxpZCA9IGZhbHNlO1xuXG4gICAgLy8gUHJvdmlkZSB0aGVtIGEgZGlhbG9nIHRvIHN1Ym1pdCBhbiBpc3N1ZSBvbiBHSCwgcHJlcG9wdWxhdGVkIHdpdGggdGhlaXJcbiAgICAvLyBsYW5ndWFnZSBvZiBjaG9pY2UuXG4gICAgfSBlbHNlIGlmICghKGxhbmcgaW4gZ3JhbW1hck1hcCkpIHtcbiAgICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtbm90LXN1cHBvcnQtbGFuZ3VhZ2UnLCB7IGxhbmcgfSk7XG4gICAgICB2YWxpZCA9IGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiB2YWxpZDtcbiAgfVxuXG4gIG9uRGlkTm90U3BlY2lmeUxhbmd1YWdlKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignZGlkLW5vdC1zcGVjaWZ5LWxhbmd1YWdlJywgY2FsbGJhY2spO1xuICB9XG5cbiAgb25EaWROb3RTdXBwb3J0TGFuZ3VhZ2UoY2FsbGJhY2spIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdkaWQtbm90LXN1cHBvcnQtbGFuZ3VhZ2UnLCBjYWxsYmFjayk7XG4gIH1cbn1cbiJdfQ==