Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _grammars = require('./grammars');

var _grammars2 = _interopRequireDefault(_grammars);

'use babel';

var CommandContext = (function () {
  function CommandContext() {
    _classCallCheck(this, CommandContext);

    this.command = null;
    this.workingDirectory = null;
    this.args = [];
    this.options = {};
  }

  _createClass(CommandContext, [{
    key: 'quoteArguments',
    value: function quoteArguments(args) {
      return args.map(function (arg) {
        return arg.trim().indexOf(' ') === -1 ? arg.trim() : '\'' + arg + '\'';
      });
    }
  }, {
    key: 'getRepresentation',
    value: function getRepresentation() {
      if (!this.command || !this.args.length) return '';

      // command arguments
      var commandArgs = this.options.cmdArgs ? this.quoteArguments(this.options.cmdArgs).join(' ') : '';

      // script arguments
      var args = this.args.length ? this.quoteArguments(this.args).join(' ') : '';
      var scriptArgs = this.options.scriptArgs ? this.quoteArguments(this.options.scriptArgs).join(' ') : '';

      return this.command.trim() + (commandArgs ? ' ' + commandArgs : '') + (args ? ' ' + args : '') + (scriptArgs ? ' ' + scriptArgs : '');
    }
  }], [{
    key: 'build',
    value: function build(runtime, runOptions, codeContext) {
      var commandContext = new CommandContext();
      commandContext.options = runOptions;
      var buildArgsArray = undefined;

      try {
        if (!runOptions.cmd) {
          // Precondition: lang? and lang of grammarMap
          commandContext.command = codeContext.shebangCommand() || _grammars2['default'][codeContext.lang][codeContext.argType].command;
        } else {
          commandContext.command = runOptions.cmd;
        }

        buildArgsArray = _grammars2['default'][codeContext.lang][codeContext.argType].args;
      } catch (error) {
        runtime.modeNotSupported(codeContext.argType, codeContext.lang);
        return false;
      }

      try {
        commandContext.args = buildArgsArray(codeContext);
      } catch (errorSendByArgs) {
        runtime.didNotBuildArgs(errorSendByArgs);
        return false;
      }

      if (!runOptions.workingDirectory) {
        // Precondition: lang? and lang of grammarMap
        commandContext.workingDirectory = _grammars2['default'][codeContext.lang][codeContext.argType].workingDirectory || '';
      } else {
        commandContext.workingDirectory = runOptions.workingDirectory;
      }

      // Return setup information
      return commandContext;
    }
  }]);

  return CommandContext;
})();

exports['default'] = CommandContext;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2JpbGx5Ly5hdG9tL3BhY2thZ2VzL3NjcmlwdC9saWIvY29tbWFuZC1jb250ZXh0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7d0JBRXVCLFlBQVk7Ozs7QUFGbkMsV0FBVyxDQUFDOztJQUlTLGNBQWM7QUFDdEIsV0FEUSxjQUFjLEdBQ25COzBCQURLLGNBQWM7O0FBRS9CLFFBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO0FBQ3BCLFFBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUM7QUFDN0IsUUFBSSxDQUFDLElBQUksR0FBRyxFQUFFLENBQUM7QUFDZixRQUFJLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztHQUNuQjs7ZUFOa0IsY0FBYzs7V0E4Q25CLHdCQUFDLElBQUksRUFBRTtBQUNuQixhQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBQSxHQUFHO2VBQUssR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsSUFBSSxFQUFFLFVBQU8sR0FBRyxPQUFHO09BQUMsQ0FBQyxDQUFDO0tBQ3BGOzs7V0FFZ0IsNkJBQUc7QUFDbEIsVUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsQ0FBQzs7O0FBR2xELFVBQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDOzs7QUFHcEcsVUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUM5RSxVQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQzs7QUFFekcsYUFBTyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxJQUN2QixXQUFXLFNBQU8sV0FBVyxHQUFLLEVBQUUsQ0FBQSxBQUFDLElBQ3JDLElBQUksU0FBTyxJQUFJLEdBQUssRUFBRSxDQUFBLEFBQUMsSUFDdkIsVUFBVSxTQUFPLFVBQVUsR0FBSyxFQUFFLENBQUEsQUFBQyxDQUFDO0tBQ3hDOzs7V0F4RFcsZUFBQyxPQUFPLEVBQUUsVUFBVSxFQUFFLFdBQVcsRUFBRTtBQUM3QyxVQUFNLGNBQWMsR0FBRyxJQUFJLGNBQWMsRUFBRSxDQUFDO0FBQzVDLG9CQUFjLENBQUMsT0FBTyxHQUFHLFVBQVUsQ0FBQztBQUNwQyxVQUFJLGNBQWMsWUFBQSxDQUFDOztBQUVuQixVQUFJO0FBQ0YsWUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLEVBQUU7O0FBRW5CLHdCQUFjLENBQUMsT0FBTyxHQUFHLFdBQVcsQ0FBQyxjQUFjLEVBQUUsSUFDbkQsc0JBQVcsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUM7U0FDN0QsTUFBTTtBQUNMLHdCQUFjLENBQUMsT0FBTyxHQUFHLFVBQVUsQ0FBQyxHQUFHLENBQUM7U0FDekM7O0FBRUQsc0JBQWMsR0FBRyxzQkFBVyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQztPQUN6RSxDQUFDLE9BQU8sS0FBSyxFQUFFO0FBQ2QsZUFBTyxDQUFDLGdCQUFnQixDQUFDLFdBQVcsQ0FBQyxPQUFPLEVBQUUsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2hFLGVBQU8sS0FBSyxDQUFDO09BQ2Q7O0FBRUQsVUFBSTtBQUNGLHNCQUFjLENBQUMsSUFBSSxHQUFHLGNBQWMsQ0FBQyxXQUFXLENBQUMsQ0FBQztPQUNuRCxDQUFDLE9BQU8sZUFBZSxFQUFFO0FBQ3hCLGVBQU8sQ0FBQyxlQUFlLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDekMsZUFBTyxLQUFLLENBQUM7T0FDZDs7QUFFRCxVQUFJLENBQUMsVUFBVSxDQUFDLGdCQUFnQixFQUFFOztBQUVoQyxzQkFBYyxDQUFDLGdCQUFnQixHQUFHLHNCQUFXLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUMsZ0JBQWdCLElBQUksRUFBRSxDQUFDO09BQzVHLE1BQU07QUFDTCxzQkFBYyxDQUFDLGdCQUFnQixHQUFHLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQztPQUMvRDs7O0FBR0QsYUFBTyxjQUFjLENBQUM7S0FDdkI7OztTQTVDa0IsY0FBYzs7O3FCQUFkLGNBQWMiLCJmaWxlIjoiL2hvbWUvYmlsbHkvLmF0b20vcGFja2FnZXMvc2NyaXB0L2xpYi9jb21tYW5kLWNvbnRleHQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuaW1wb3J0IGdyYW1tYXJNYXAgZnJvbSAnLi9ncmFtbWFycyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbW1hbmRDb250ZXh0IHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5jb21tYW5kID0gbnVsbDtcbiAgICB0aGlzLndvcmtpbmdEaXJlY3RvcnkgPSBudWxsO1xuICAgIHRoaXMuYXJncyA9IFtdO1xuICAgIHRoaXMub3B0aW9ucyA9IHt9O1xuICB9XG5cbiAgc3RhdGljIGJ1aWxkKHJ1bnRpbWUsIHJ1bk9wdGlvbnMsIGNvZGVDb250ZXh0KSB7XG4gICAgY29uc3QgY29tbWFuZENvbnRleHQgPSBuZXcgQ29tbWFuZENvbnRleHQoKTtcbiAgICBjb21tYW5kQ29udGV4dC5vcHRpb25zID0gcnVuT3B0aW9ucztcbiAgICBsZXQgYnVpbGRBcmdzQXJyYXk7XG5cbiAgICB0cnkge1xuICAgICAgaWYgKCFydW5PcHRpb25zLmNtZCkge1xuICAgICAgICAvLyBQcmVjb25kaXRpb246IGxhbmc/IGFuZCBsYW5nIG9mIGdyYW1tYXJNYXBcbiAgICAgICAgY29tbWFuZENvbnRleHQuY29tbWFuZCA9IGNvZGVDb250ZXh0LnNoZWJhbmdDb21tYW5kKCkgfHxcbiAgICAgICAgICBncmFtbWFyTWFwW2NvZGVDb250ZXh0LmxhbmddW2NvZGVDb250ZXh0LmFyZ1R5cGVdLmNvbW1hbmQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb21tYW5kQ29udGV4dC5jb21tYW5kID0gcnVuT3B0aW9ucy5jbWQ7XG4gICAgICB9XG5cbiAgICAgIGJ1aWxkQXJnc0FycmF5ID0gZ3JhbW1hck1hcFtjb2RlQ29udGV4dC5sYW5nXVtjb2RlQ29udGV4dC5hcmdUeXBlXS5hcmdzO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBydW50aW1lLm1vZGVOb3RTdXBwb3J0ZWQoY29kZUNvbnRleHQuYXJnVHlwZSwgY29kZUNvbnRleHQubGFuZyk7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgIGNvbW1hbmRDb250ZXh0LmFyZ3MgPSBidWlsZEFyZ3NBcnJheShjb2RlQ29udGV4dCk7XG4gICAgfSBjYXRjaCAoZXJyb3JTZW5kQnlBcmdzKSB7XG4gICAgICBydW50aW1lLmRpZE5vdEJ1aWxkQXJncyhlcnJvclNlbmRCeUFyZ3MpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGlmICghcnVuT3B0aW9ucy53b3JraW5nRGlyZWN0b3J5KSB7XG4gICAgICAvLyBQcmVjb25kaXRpb246IGxhbmc/IGFuZCBsYW5nIG9mIGdyYW1tYXJNYXBcbiAgICAgIGNvbW1hbmRDb250ZXh0LndvcmtpbmdEaXJlY3RvcnkgPSBncmFtbWFyTWFwW2NvZGVDb250ZXh0LmxhbmddW2NvZGVDb250ZXh0LmFyZ1R5cGVdLndvcmtpbmdEaXJlY3RvcnkgfHwgJyc7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbW1hbmRDb250ZXh0LndvcmtpbmdEaXJlY3RvcnkgPSBydW5PcHRpb25zLndvcmtpbmdEaXJlY3Rvcnk7XG4gICAgfVxuXG4gICAgLy8gUmV0dXJuIHNldHVwIGluZm9ybWF0aW9uXG4gICAgcmV0dXJuIGNvbW1hbmRDb250ZXh0O1xuICB9XG5cbiAgcXVvdGVBcmd1bWVudHMoYXJncykge1xuICAgIHJldHVybiBhcmdzLm1hcChhcmcgPT4gKGFyZy50cmltKCkuaW5kZXhPZignICcpID09PSAtMSA/IGFyZy50cmltKCkgOiBgJyR7YXJnfSdgKSk7XG4gIH1cblxuICBnZXRSZXByZXNlbnRhdGlvbigpIHtcbiAgICBpZiAoIXRoaXMuY29tbWFuZCB8fCAhdGhpcy5hcmdzLmxlbmd0aCkgcmV0dXJuICcnO1xuXG4gICAgLy8gY29tbWFuZCBhcmd1bWVudHNcbiAgICBjb25zdCBjb21tYW5kQXJncyA9IHRoaXMub3B0aW9ucy5jbWRBcmdzID8gdGhpcy5xdW90ZUFyZ3VtZW50cyh0aGlzLm9wdGlvbnMuY21kQXJncykuam9pbignICcpIDogJyc7XG5cbiAgICAvLyBzY3JpcHQgYXJndW1lbnRzXG4gICAgY29uc3QgYXJncyA9IHRoaXMuYXJncy5sZW5ndGggPyB0aGlzLnF1b3RlQXJndW1lbnRzKHRoaXMuYXJncykuam9pbignICcpIDogJyc7XG4gICAgY29uc3Qgc2NyaXB0QXJncyA9IHRoaXMub3B0aW9ucy5zY3JpcHRBcmdzID8gdGhpcy5xdW90ZUFyZ3VtZW50cyh0aGlzLm9wdGlvbnMuc2NyaXB0QXJncykuam9pbignICcpIDogJyc7XG5cbiAgICByZXR1cm4gdGhpcy5jb21tYW5kLnRyaW0oKSArXG4gICAgICAoY29tbWFuZEFyZ3MgPyBgICR7Y29tbWFuZEFyZ3N9YCA6ICcnKSArXG4gICAgICAoYXJncyA/IGAgJHthcmdzfWAgOiAnJykgK1xuICAgICAgKHNjcmlwdEFyZ3MgPyBgICR7c2NyaXB0QXJnc31gIDogJycpO1xuICB9XG59XG4iXX0=