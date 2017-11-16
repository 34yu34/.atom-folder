(function() {
  var exec, open_terminal, path, platform;

  exec = require('child_process').exec;

  path = require('path');

  platform = require('os').platform;


  /*
     Opens a terminal in the given directory, as specefied by the config
   */

  open_terminal = function(dirpath) {
    var app, args, cmdline, runDirectly, setWorkingDirectory, surpressDirArg;
    app = atom.config.get('atom-terminal.app');
    args = atom.config.get('atom-terminal.args');
    setWorkingDirectory = atom.config.get('atom-terminal.setWorkingDirectory');
    surpressDirArg = atom.config.get('atom-terminal.surpressDirectoryArgument');
    runDirectly = atom.config.get('atom-terminal.MacWinRunDirectly');
    cmdline = "\"" + app + "\" " + args;
    if (!surpressDirArg) {
      cmdline += " \"" + dirpath + "\"";
    }
    if (platform() === "darwin" && !runDirectly) {
      cmdline = "open -a " + cmdline;
    }
    if (platform() === "win32" && !runDirectly) {
      cmdline = "start \"\" " + cmdline;
    }
    console.log("atom-terminal executing: ", cmdline);
    if (setWorkingDirectory) {
      if (dirpath != null) {
        return exec(cmdline, {
          cwd: dirpath
        });
      }
    } else {
      if (dirpath != null) {
        return exec(cmdline);
      }
    }
  };

  module.exports = {
    activate: function() {
      atom.commands.add("atom-workspace", "atom-terminal:open", (function(_this) {
        return function() {
          return _this.open();
        };
      })(this));
      return atom.commands.add("atom-workspace", "atom-terminal:open-project-root", (function(_this) {
        return function() {
          return _this.openroot();
        };
      })(this));
    },
    open: function() {
      var editor, file, filepath, ref;
      editor = atom.workspace.getActivePaneItem();
      file = editor != null ? (ref = editor.buffer) != null ? ref.file : void 0 : void 0;
      filepath = file != null ? file.path : void 0;
      if (filepath) {
        return open_terminal(path.dirname(filepath));
      }
    },
    openroot: function() {
      var i, len, pathname, ref, results;
      ref = atom.project.getPaths();
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        pathname = ref[i];
        results.push(open_terminal(pathname));
      }
      return results;
    }
  };

  if (platform() === 'darwin') {
    module.exports.config = {
      app: {
        type: 'string',
        "default": 'Terminal.app'
      },
      args: {
        type: 'string',
        "default": ''
      },
      surpressDirectoryArgument: {
        type: 'boolean',
        "default": true
      },
      setWorkingDirectory: {
        type: 'boolean',
        "default": true
      },
      MacWinRunDirectly: {
        type: 'boolean',
        "default": false
      }
    };
  } else if (platform() === 'win32') {
    module.exports.config = {
      app: {
        type: 'string',
        "default": 'C:\\Windows\\System32\\cmd.exe'
      },
      args: {
        type: 'string',
        "default": ''
      },
      surpressDirectoryArgument: {
        type: 'boolean',
        "default": true
      },
      setWorkingDirectory: {
        type: 'boolean',
        "default": true
      },
      MacWinRunDirectly: {
        type: 'boolean',
        "default": false
      }
    };
  } else {
    module.exports.config = {
      app: {
        type: 'string',
        "default": '/usr/bin/x-terminal-emulator'
      },
      args: {
        type: 'string',
        "default": ''
      },
      surpressDirectoryArgument: {
        type: 'boolean',
        "default": true
      },
      setWorkingDirectory: {
        type: 'boolean',
        "default": true
      },
      MacWinRunDirectly: {
        type: 'boolean',
        "default": false
      }
    };
  }

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYmlsbHkvLmF0b20vcGFja2FnZXMvYXRvbS10ZXJtaW5hbC9saWIvYXRvbS10ZXJtaW5hbC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLElBQUEsR0FBTyxPQUFBLENBQVEsZUFBUixDQUF3QixDQUFDOztFQUNoQyxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7O0VBQ1AsUUFBQSxHQUFXLE9BQUEsQ0FBUSxJQUFSLENBQWEsQ0FBQzs7O0FBRXpCOzs7O0VBR0EsYUFBQSxHQUFnQixTQUFDLE9BQUQ7QUFFZCxRQUFBO0lBQUEsR0FBQSxHQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixtQkFBaEI7SUFDTixJQUFBLEdBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLG9CQUFoQjtJQUdQLG1CQUFBLEdBQXNCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixtQ0FBaEI7SUFDdEIsY0FBQSxHQUFpQixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IseUNBQWhCO0lBQ2pCLFdBQUEsR0FBYyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsaUNBQWhCO0lBR2QsT0FBQSxHQUFVLElBQUEsR0FBSyxHQUFMLEdBQVMsS0FBVCxHQUFjO0lBR3hCLElBQUcsQ0FBQyxjQUFKO01BQ0ksT0FBQSxJQUFZLEtBQUEsR0FBTSxPQUFOLEdBQWMsS0FEOUI7O0lBSUEsSUFBRyxRQUFBLENBQUEsQ0FBQSxLQUFjLFFBQWQsSUFBMEIsQ0FBQyxXQUE5QjtNQUNFLE9BQUEsR0FBVSxVQUFBLEdBQWEsUUFEekI7O0lBSUEsSUFBRyxRQUFBLENBQUEsQ0FBQSxLQUFjLE9BQWQsSUFBeUIsQ0FBQyxXQUE3QjtNQUNFLE9BQUEsR0FBVSxhQUFBLEdBQWdCLFFBRDVCOztJQUlBLE9BQU8sQ0FBQyxHQUFSLENBQVksMkJBQVosRUFB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QSxJQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sUUFBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsRUFEVDtPQUpGO01BTUEseUJBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxTQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxJQURUO09BUEY7TUFTQSxtQkFBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLFNBQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLElBRFQ7T0FWRjtNQVlBLGlCQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sU0FBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsS0FEVDtPQWJGO01BckJEOztBQTFFTCIsInNvdXJjZXNDb250ZW50IjpbImV4ZWMgPSByZXF1aXJlKCdjaGlsZF9wcm9jZXNzJykuZXhlY1xucGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxucGxhdGZvcm0gPSByZXF1aXJlKCdvcycpLnBsYXRmb3JtXG5cbiMjI1xuICAgT3BlbnMgYSB0ZXJtaW5hbCBpbiB0aGUgZ2l2ZW4gZGlyZWN0b3J5LCBhcyBzcGVjZWZpZWQgYnkgdGhlIGNvbmZpZ1xuIyMjXG5vcGVuX3Rlcm1pbmFsID0gKGRpcnBhdGgpIC0+XG4gICMgRmlndXJlIG91dCB0aGUgYXBwIGFuZCB0aGUgYXJndW1lbnRzXG4gIGFwcCA9IGF0b20uY29uZmlnLmdldCgnYXRvbS10ZXJtaW5hbC5hcHAnKVxuICBhcmdzID0gYXRvbS5jb25maWcuZ2V0KCdhdG9tLXRlcm1pbmFsLmFyZ3MnKVxuXG4gICMgZ2V0IG9wdGlvbnNcbiAgc2V0V29ya2luZ0RpcmVjdG9yeSA9IGF0b20uY29uZmlnLmdldCgnYXRvbS10ZXJtaW5hbC5zZXRXb3JraW5nRGlyZWN0b3J5JylcbiAgc3VycHJlc3NEaXJBcmcgPSBhdG9tLmNvbmZpZy5nZXQoJ2F0b20tdGVybWluYWwuc3VycHJlc3NEaXJlY3RvcnlBcmd1bWVudCcpXG4gIHJ1bkRpcmVjdGx5ID0gYXRvbS5jb25maWcuZ2V0KCdhdG9tLXRlcm1pbmFsLk1hY1dpblJ1bkRpcmVjdGx5JylcblxuICAjIFN0YXJ0IGFzc2VtYmxpbmcgdGhlIGNvbW1hbmQgbGluZVxuICBjbWRsaW5lID0gXCJcXFwiI3thcHB9XFxcIiAje2FyZ3N9XCJcblxuICAjIElmIHdlIGRvIG5vdCBzdXByZXNzIHRoZSBkaXJlY3RvcnkgYXJndW1lbnQsIGFkZCB0aGUgZGlyZWN0b3J5IGFzIGFuIGFyZ3VtZW50XG4gIGlmICFzdXJwcmVzc0RpckFyZ1xuICAgICAgY21kbGluZSAgKz0gXCIgXFxcIiN7ZGlycGF0aH1cXFwiXCJcblxuICAjIEZvciBtYWMsIHdlIHByZXBlbmQgb3BlbiAtYSB1bmxlc3Mgd2UgcnVuIGl0IGRpcmVjdGx5XG4gIGlmIHBsYXRmb3JtKCkgPT0gXCJkYXJ3aW5cIiAmJiAhcnVuRGlyZWN0bHlcbiAgICBjbWRsaW5lID0gXCJvcGVuIC1hIFwiICsgY21kbGluZVxuXG4gICMgZm9yIHdpbmRvd3MsIHdlIHByZXBlbmQgc3RhcnQgdW5sZXNzIHdlIHJ1biBpdCBkaXJlY3RseS5cbiAgaWYgcGxhdGZvcm0oKSA9PSBcIndpbjMyXCIgJiYgIXJ1bkRpcmVjdGx5XG4gICAgY21kbGluZSA9IFwic3RhcnQgXFxcIlxcXCIgXCIgKyBjbWRsaW5lXG5cbiAgIyBsb2cgdGhlIGNvbW1hbmQgc28gd2UgaGF2ZSBjb250ZXh0IGlmIGl0IGZhaWxzXG4gIGNvbnNvbGUubG9nKFwiYXRvbS10ZXJtaW5hbCBleGVjdXRpbmc6IFwiLCBjbWRsaW5lKVxuXG4gICMgU2V0IHRoZSB3b3JraW5nIGRpcmVjdG9yeSBpZiBjb25maWd1cmVkXG4gIGlmIHNldFdvcmtpbmdEaXJlY3RvcnlcbiAgICBleGVjIGNtZGxpbmUsIGN3ZDogZGlycGF0aCBpZiBkaXJwYXRoP1xuICBlbHNlXG4gICAgZXhlYyBjbWRsaW5lIGlmIGRpcnBhdGg/XG5cblxubW9kdWxlLmV4cG9ydHMgPVxuICAgIGFjdGl2YXRlOiAtPlxuICAgICAgICBhdG9tLmNvbW1hbmRzLmFkZCBcImF0b20td29ya3NwYWNlXCIsIFwiYXRvbS10ZXJtaW5hbDpvcGVuXCIsID0+IEBvcGVuKClcbiAgICAgICAgYXRvbS5jb21tYW5kcy5hZGQgXCJhdG9tLXdvcmtzcGFjZVwiLCBcImF0b20tdGVybWluYWw6b3Blbi1wcm9qZWN0LXJvb3RcIiwgPT4gQG9wZW5yb290KClcbiAgICBvcGVuOiAtPlxuICAgICAgICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lSXRlbSgpXG4gICAgICAgIGZpbGUgPSBlZGl0b3I/LmJ1ZmZlcj8uZmlsZVxuICAgICAgICBmaWxlcGF0aCA9IGZpbGU/LnBhdGhcbiAgICAgICAgaWYgZmlsZXBhdGhcbiAgICAgICAgICAgIG9wZW5fdGVybWluYWwgcGF0aC5kaXJuYW1lKGZpbGVwYXRoKVxuICAgIG9wZW5yb290OiAtPlxuICAgICAgICBvcGVuX3Rlcm1pbmFsIHBhdGhuYW1lIGZvciBwYXRobmFtZSBpbiBhdG9tLnByb2plY3QuZ2V0UGF0aHMoKVxuXG4jIFNldCBwZXItcGxhdGZvcm0gZGVmYXVsdHNcbmlmIHBsYXRmb3JtKCkgPT0gJ2RhcndpbidcbiAgIyBEZWZhdWx0cyBmb3IgTWFjLCB1c2UgVGVybWluYWwuYXBwXG4gIG1vZHVsZS5leHBvcnRzLmNvbmZpZyA9XG4gICAgYXBwOlxuICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgIGRlZmF1bHQ6ICdUZXJtaW5hbC5hcHAnXG4gICAgYXJnczpcbiAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICBkZWZhdWx0OiAnJ1xuICAgIHN1cnByZXNzRGlyZWN0b3J5QXJndW1lbnQ6XG4gICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgIGRlZmF1bHQ6IHRydWVcbiAgICBzZXRXb3JraW5nRGlyZWN0b3J5OlxuICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICBkZWZhdWx0OiB0cnVlXG4gICAgTWFjV2luUnVuRGlyZWN0bHk6XG4gICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgIGRlZmF1bHQ6IGZhbHNlXG5lbHNlIGlmIHBsYXRmb3JtKCkgPT0gJ3dpbjMyJ1xuICAjIERlZmF1bHRzIGZvciB3aW5kb3dzLCB1c2UgY21kLmV4ZSBhcyBkZWZhdWx0XG4gIG1vZHVsZS5leHBvcnRzLmNvbmZpZyA9XG4gICAgICBhcHA6XG4gICAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICAgIGRlZmF1bHQ6ICdDOlxcXFxXaW5kb3dzXFxcXFN5c3RlbTMyXFxcXGNtZC5leGUnXG4gICAgICBhcmdzOlxuICAgICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgICBkZWZhdWx0OiAnJ1xuICAgICAgc3VycHJlc3NEaXJlY3RvcnlBcmd1bWVudDpcbiAgICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICAgIGRlZmF1bHQ6IHRydWVcbiAgICAgIHNldFdvcmtpbmdEaXJlY3Rvcnk6XG4gICAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgICBkZWZhdWx0OiB0cnVlXG4gICAgICBNYWNXaW5SdW5EaXJlY3RseTpcbiAgICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICAgIGRlZmF1bHQ6IGZhbHNlXG5lbHNlXG4gICMgRGVmYXVsdHMgZm9yIGFsbCBvdGhlciBzeXN0ZW1zIChsaW51eCBJIGFzc3VtZSksIHVzZSB4dGVybVxuICBtb2R1bGUuZXhwb3J0cy5jb25maWcgPVxuICAgICAgYXBwOlxuICAgICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgICBkZWZhdWx0OiAnL3Vzci9iaW4veC10ZXJtaW5hbC1lbXVsYXRvcidcbiAgICAgIGFyZ3M6XG4gICAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICAgIGRlZmF1bHQ6ICcnXG4gICAgICBzdXJwcmVzc0RpcmVjdG9yeUFyZ3VtZW50OlxuICAgICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgICAgZGVmYXVsdDogdHJ1ZVxuICAgICAgc2V0V29ya2luZ0RpcmVjdG9yeTpcbiAgICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICAgIGRlZmF1bHQ6IHRydWVcbiAgICAgIE1hY1dpblJ1bkRpcmVjdGx5OlxuICAgICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgICAgZGVmYXVsdDogZmFsc2VcbiJdfQ==
