
/*
 * a remake of kriscross07/atom-gpp-compiler with extended features
 * https://github.com/kriscross07/atom-gpp-compiler
 * https://atom.io/packages/gpp-compiler
 */

(function() {
  var CompositeDisposable, GccMakeRun, GccMakeRunView, _extend, exec, execSync, join, parse, ref, ref1, statSync;

  GccMakeRunView = require('./gcc-make-run-view');

  CompositeDisposable = require('atom').CompositeDisposable;

  ref = require('path'), parse = ref.parse, join = ref.join;

  ref1 = require('child_process'), exec = ref1.exec, execSync = ref1.execSync;

  statSync = require('fs').statSync;

  _extend = require('util')._extend;

  module.exports = GccMakeRun = {
    config: {
      'C': {
        title: 'gcc Compiler',
        type: 'string',
        "default": 'gcc',
        order: 1,
        description: 'Compiler for `C`, in full path or command name (make sure it is in your `$PATH`)'
      },
      'C++': {
        title: 'g++ Compiler',
        type: 'string',
        "default": 'g++',
        order: 2,
        description: 'Compiler for `C++`, in full path or command name (make sure it is in your `$PATH`)'
      },
      'make': {
        title: 'make Utility',
        type: 'string',
        "default": 'make',
        order: 3,
        description: 'The `make` utility used for compilation, in full path or command name (make sure it is in your `$PATH`)'
      },
      'uncondBuild': {
        title: 'Unconditional Build',
        type: 'boolean',
        "default": false,
        order: 4,
        description: 'Will not check if executable is up to date'
      },
      'cflags': {
        title: 'Compiler Flags',
        type: 'string',
        "default": '',
        order: 5,
        description: 'Flags for compiler, eg: `-Wall`'
      },
      'ldlibs': {
        title: 'Link Libraries',
        type: 'string',
        "default": '',
        order: 6,
        description: 'Libraries for linking, eg: `-lm`'
      },
      'args': {
        title: 'Run Arguments',
        type: 'string',
        "default": '',
        order: 7,
        description: 'Arguments for executing, eg: `1 "2 3" "\\\"4 5 6\\\""`'
      },
      'ext': {
        title: 'Output Extension',
        type: 'string',
        "default": '',
        order: 8,
        description: 'The output extension, eg: `out`, in Windows compilers will use `exe` by default'
      },
      'terminal': {
        title: 'Terminal Start Command (only Linux platform)',
        type: 'string',
        "default": 'xterm -T $title -e',
        order: 9,
        description: 'Customize the terminal start command, eg: `gnome-terminal -t $title -x bash -c`'
      },
      'debug': {
        title: 'Debug Mode',
        type: 'boolean',
        "default": false,
        order: 10,
        description: 'Turn on this flag to log the executed command and output in console'
      }
    },
    gccMakeRunView: null,
    oneTimeBuild: false,

    /*
     * package setup
     */
    activate: function(state) {
      this.gccMakeRunView = new GccMakeRunView(this);
      this.subscriptions = new CompositeDisposable();
      return this.subscriptions.add(atom.commands.add('atom-workspace', {
        'gcc-make-run:compile-run': (function(_this) {
          return function() {
            return _this.compile();
          };
        })(this)
      }, atom.commands.add('.tree-view .file > .name', {
        'gcc-make-run:make-run': (function(_this) {
          return function(e) {
            return _this.make(e.target.getAttribute('data-path'));
          };
        })(this)
      })));
    },
    deactivate: function() {
      this.subscriptions.dispose();
      return this.gccMakeRunView.cancel();
    },
    serialize: function() {
      return {
        gccMakeRunViewState: this.gccMakeRunView.serialize()
      };
    },

    /*
     * compile and make run
     */
    compile: function() {
      var editor, srcPath;
      editor = atom.workspace.getActiveTextEditor();
      if (editor == null) {
        return;
      }
      srcPath = editor.getPath();
      if (!srcPath) {
        atom.notifications.addError('gcc-make-run: File Not Saved', {
          detail: 'Temporary files must be saved first'
        });
        return;
      }
      return Promise.resolve(editor.isModified() ? editor.save() : void 0).then((function(_this) {
        return function() {
          var cflags, cmd, compiler, ext, grammar, info, ldlibs;
          grammar = editor.getGrammar().name;
          switch (grammar) {
            case 'C':
            case 'C++':
            case 'C++14':
              if (grammar === 'C++14') {
                grammar = 'C++';
              }
              break;
            case 'Makefile':
              _this.make(srcPath);
              return;
            default:
              atom.notifications.addError('gcc-make-run: Grammar Not Supported', {
                detail: 'Only C, C++ and Makefile are supported'
              });
              return;
          }
          info = parse(editor.getPath());
          info.useMake = false;
          info.exe = info.name;
          ext = atom.config.get('gcc-make-run.ext');
          if (ext) {
            info.exe += "." + ext;
          } else if (process.platform === 'win32') {
            info.exe += '.exe';
          }
          compiler = atom.config.get("gcc-make-run." + grammar);
          cflags = atom.config.get('gcc-make-run.cflags');
          ldlibs = atom.config.get('gcc-make-run.ldlibs');
          if (!_this.shouldUncondBuild() && _this.isExeUpToDate(info)) {
            return _this.run(info);
          } else {
            cmd = "\"" + compiler + "\" " + cflags + " \"" + info.base + "\" -o \"" + info.exe + "\" " + ldlibs;
            atom.notifications.addInfo('gcc-make-run: Running Command...', {
              detail: cmd
            });
            return exec(cmd, {
              cwd: info.dir
            }, _this.onBuildFinished.bind(_this, info));
          }
        };
      })(this));
    },
    make: function(srcPath) {
      var cmd, info, mk, mkFlags;
      info = parse(srcPath);
      info.useMake = true;
      mk = atom.config.get('gcc-make-run.make');
      mkFlags = this.shouldUncondBuild() ? '-B' : '';
      cmd = "\"" + mk + "\" " + mkFlags + " -f \"" + info.base + "\"";
      atom.notifications.addInfo('gcc-make-run: Running Command...', {
        detail: cmd
      });
      return exec(cmd, {
        cwd: info.dir
      }, this.onBuildFinished.bind(this, info));
    },
    onBuildFinished: function(info, error, stdout, stderr) {
      var hasCompiled;
      hasCompiled = ((stdout != null ? stdout.indexOf('up to date') : void 0) < 0 && (stdout != null ? stdout.indexOf('to be done') : void 0) < 0) || (stdout == null);
      if (stderr) {
        atom.notifications[error ? 'addError' : 'addWarning']("gcc-make-run: Compile " + (error ? 'Error' : 'Warning'), {
          detail: stderr,
          dismissable: true
        });
      }
      if (stdout) {
        atom.notifications[hasCompiled ? 'addInfo' : 'addSuccess']('gcc-make-run: Compiler Output', {
          detail: stdout
        });
      }
      if (error) {
        return;
      }
      if (hasCompiled) {
        atom.notifications.addSuccess('gcc-make-run: Build Success');
      }
      return this.run(info);
    },
    run: function(info) {
      if (!this.checkMakeRunTarget(info)) {
        return;
      }
      if (!this.buildRunCmd(info)) {
        return;
      }
      if (atom.config.get('gcc-make-run.debug')) {
        console.log(info.cmd);
      }
      return exec(info.cmd, {
        cwd: info.dir,
        env: info.env
      }, this.onRunFinished.bind(this));
    },
    onRunFinished: function(error, stdout, stderr) {
      if (error) {
        atom.notifications.addError('gcc-make-run: Run Command Failed', {
          detail: stderr,
          dismissable: true
        });
      }
      if (stdout && atom.config.get('gcc-make-run.debug')) {
        return console.log(stdout);
      }
    },

    /*
     * helper functions
     */
    isExeUpToDate: function(info) {
      var error, exeTime, srcTime;
      srcTime = statSync(join(info.dir, info.base)).mtime.getTime();
      try {
        exeTime = statSync(join(info.dir, info.exe)).mtime.getTime();
      } catch (error1) {
        error = error1;
        exeTime = 0;
      }
      if (srcTime < exeTime) {
        atom.notifications.addSuccess("gcc-make-run: Output Up To Date", {
          detail: "'" + info.exe + "' is up to date"
        });
        return true;
      }
      return false;
    },
    checkMakeRunTarget: function(info) {
      var error, mk;
      if (!info.useMake) {
        return true;
      }
      mk = atom.config.get("gcc-make-run.make");
      info.exe = void 0;
      try {
        info.exe = execSync("\"" + mk + "\" -nf \"" + info.base + "\" run", {
          cwd: info.dir,
          stdio: [],
          encoding: 'utf8'
        }).split('#')[0].match(/[^\r\n]+/g)[0];
        if (!info.exe || info.exe.indexOf('to be done') >= 0) {
          throw Error();
        }
        if (process.platform === 'win32' && info.exe.indexOf('.exe') !== -1) {
          info.exe += '.exe';
        }
        return true;
      } catch (error1) {
        error = error1;
        atom.notifications.addError("gcc-make-run: Cannot find 'run' target", {
          detail: "Target 'run' is not specified in " + info.base + "\nExample 'run' target:\nrun:\n  excutable $(ARGS)",
          dismissable: true
        });
        return false;
      }
    },
    shouldUncondBuild: function() {
      var ret;
      ret = this.oneTimeBuild || atom.config.get('gcc-make-run.uncondBuild');
      this.oneTimeBuild = false;
      return ret;
    },
    buildRunCmd: function(info) {
      var mk, terminal;
      mk = atom.config.get('gcc-make-run.make');
      info.env = _extend({
        ARGS: atom.config.get('gcc-make-run.args')
      }, process.env);
      if (process.platform === 'linux') {
        terminal = atom.config.get('gcc-make-run.terminal').replace('$title', "\"" + info.exe + "\"");
      }
      if (info.useMake) {
        switch (process.platform) {
          case 'win32':
            info.cmd = "start \"" + info.exe + "\" cmd /c \"\"" + mk + "\" -sf \"" + info.base + "\" run & pause\"";
            break;
          case 'linux':
            info.cmd = (terminal + " \"") + this.escdq("\"" + mk + "\" -sf \"" + info.base + "\" run") + "; read -n1 -p 'Press any key to continue...'\"";
            break;
          case 'darwin':
            info.cmd = 'osascript -e \'tell application "Terminal" to activate do script "' + this.escdq(("clear && cd \"" + info.dir + "\"; \"" + mk + "\" ARGS=\"" + (this.escdq(info.env.ARGS)) + "\" -sf \"" + info.base + "\" run; ") + 'read -n1 -p "Press any key to continue..." && osascript -e "tell application \\"Atom\\" to activate" && osascript -e "do shell script ' + this.escdq("\"osascript -e " + (this.escdq('"tell application \\"Terminal\\" to close windows 0"')) + " + &> /dev/null &\"") + '"; exit') + '"\'';
        }
      } else {
        switch (process.platform) {
          case 'win32':
            info.cmd = "start \"" + info.exe + "\" cmd /c \"\"" + info.exe + "\" " + info.env.ARGS + " & pause\"";
            break;
          case 'linux':
            info.cmd = (terminal + " \"") + this.escdq("\"./" + info.exe + "\" " + info.env.ARGS) + "; read -n1 -p 'Press any key to continue...'\"";
            break;
          case 'darwin':
            info.cmd = 'osascript -e \'tell application "Terminal" to activate do script "' + this.escdq(("clear && cd \"" + info.dir + "\"; \"./" + info.exe + "\" " + info.env.ARGS + "; ") + 'read -n1 -p "Press any key to continue..." && osascript -e "tell application \\"Atom\\" to activate" && osascript -e "do shell script ' + this.escdq("\"osascript -e " + (this.escdq('"tell application \\"Terminal\\" to close windows 0"')) + " + &> /dev/null &\"") + '"; exit') + '"\'';
        }
      }
      if (info.cmd != null) {
        return true;
      }
      atom.notifications.addError('gcc-make-run: Cannot Execute Output', {
        detail: 'Execution after compiling is not supported on your OS'
      });
      return false;
    },
    escdq: function(s) {
      return s.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYmlsbHkvLmF0b20vcGFja2FnZXMvZ2NjLW1ha2UtcnVuL2xpYi9nY2MtbWFrZS1ydW4uY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0FBQUE7QUFBQSxNQUFBOztFQU1BLGNBQUEsR0FBaUIsT0FBQSxDQUFRLHFCQUFSOztFQUNoQixzQkFBdUIsT0FBQSxDQUFRLE1BQVI7O0VBQ3hCLE1BQWdCLE9BQUEsQ0FBUSxNQUFSLENBQWhCLEVBQUMsaUJBQUQsRUFBUTs7RUFDUixPQUFtQixPQUFBLENBQVEsZUFBUixDQUFuQixFQUFDLGdCQUFELEVBQU87O0VBQ04sV0FBWSxPQUFBLENBQVEsSUFBUjs7RUFDWixVQUFXLE9BQUEsQ0FBUSxNQUFSOztFQUVaLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFVBQUEsR0FDZjtJQUFBLE1BQUEsRUFDRTtNQUFBLEdBQUEsRUFDRTtRQUFBLEtBQUEsRUFBTyxjQUFQO1FBQ0EsSUFBQSxFQUFNLFFBRE47UUFFQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLEtBRlQ7UUFHQSxLQUFBLEVBQU8sQ0FIUDtRQUlBLFdBQUEsRUFBYSxrRkFKYjtPQURGO01BTUEsS0FBQSxFQUNFO1FBQUEsS0FBQSxFQUFPLGNBQVA7UUFDQSxJQUFBLEVBQU0sUUFETjtRQUVBLENBQUEsT0FBQSxDQUFBLEVBQVMsS0FGVDtRQUdBLEtBQUEsRUFBTyxDQUhQO1FBSUEsV0FBQSxFQUFhLG9GQUpiO09BUEY7TUFZQSxNQUFBLEVBQ0U7UUFBQSxLQUFBLEVBQU8sY0FBUDtRQUNBLElBQUEsRUFBTSxRQUROO1FBRUEsQ0FBQSxPQUFBLENBQUEsRUFBUyxNQUZUO1FBR0EsS0FBQSxFQUFPLENBSFA7UUFJQSxXQUFBLEVBQWEseUdBSmI7T0FiRjtNQWtCQSxhQUFBLEVBQ0U7UUFBQSxLQUFBLEVBQU8scUJBQVA7UUFDQSxJQUFBLEVBQU0sU0FETjtRQUVBLENBQUEsT0FBQSxDQUFB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QUFaLENBQUEsR0FBbUIsSUFBQyxDQUFBLEtBQUQsQ0FBTyxNQUFBLEdBQU8sSUFBSSxDQUFDLEdBQVosR0FBZ0IsS0FBaEIsR0FBcUIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFyQyxDQUFuQixHQUFrRTtBQUExRjtBQUZQLGVBR08sUUFIUDtZQUdxQixJQUFJLENBQUMsR0FBTCxHQUFXLG9FQUFBLEdBQXVFLElBQUMsQ0FBQSxLQUFELENBQU8sQ0FBQSxnQkFBQSxHQUFpQixJQUFJLENBQUMsR0FBdEIsR0FBMEIsVUFBMUIsR0FBb0MsSUFBSSxDQUFDLEdBQXpDLEdBQTZDLEtBQTdDLEdBQWtELElBQUksQ0FBQyxHQUFHLENBQUMsSUFBM0QsR0FBZ0UsSUFBaEUsQ0FBQSxHQUFzRSx3SUFBdEUsR0FBaU4sSUFBQyxDQUFBLEtBQUQsQ0FBTyxpQkFBQSxHQUFpQixDQUFDLElBQUMsQ0FBQSxLQUFELENBQU8sc0RBQVAsQ0FBRCxDQUFqQixHQUFpRixxQkFBeEYsQ0FBak4sR0FBaVUsU0FBeFUsQ0FBdkUsR0FBNFo7QUFINWIsU0FQRjs7TUFhQSxJQUFlLGdCQUFmO0FBQUEsZUFBTyxLQUFQOztNQUNBLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBbkIsQ0FBNEIscUNBQTVCLEVBQW1FO1FBQUUsTUFBQSxFQUFRLHVEQUFWO09BQW5FO0FBQ0EsYUFBTztJQXZCSSxDQXROYjtJQStPQSxLQUFBLEVBQU8sU0FBQyxDQUFEO2FBRUwsQ0FBQyxDQUFDLE9BQUYsQ0FBVSxLQUFWLEVBQWlCLE1BQWpCLENBQXdCLENBQUMsT0FBekIsQ0FBaUMsSUFBakMsRUFBdUMsS0FBdkM7SUFGSyxDQS9PUDs7QUFkRiIsInNvdXJjZXNDb250ZW50IjpbIiMjI1xuIyBhIHJlbWFrZSBvZiBrcmlzY3Jvc3MwNy9hdG9tLWdwcC1jb21waWxlciB3aXRoIGV4dGVuZGVkIGZlYXR1cmVzXG4jIGh0dHBzOi8vZ2l0aHViLmNvbS9rcmlzY3Jvc3MwNy9hdG9tLWdwcC1jb21waWxlclxuIyBodHRwczovL2F0b20uaW8vcGFja2FnZXMvZ3BwLWNvbXBpbGVyXG4jIyNcblxuR2NjTWFrZVJ1blZpZXcgPSByZXF1aXJlICcuL2djYy1tYWtlLXJ1bi12aWV3J1xue0NvbXBvc2l0ZURpc3Bvc2FibGV9ID0gcmVxdWlyZSAnYXRvbSdcbntwYXJzZSwgam9pbn0gPSByZXF1aXJlICdwYXRoJ1xue2V4ZWMsIGV4ZWNTeW5jfSA9IHJlcXVpcmUgJ2NoaWxkX3Byb2Nlc3MnXG57c3RhdFN5bmN9ID0gcmVxdWlyZSAnZnMnXG57X2V4dGVuZH0gPSByZXF1aXJlICd1dGlsJ1xuXG5tb2R1bGUuZXhwb3J0cyA9IEdjY01ha2VSdW4gPVxuICBjb25maWc6XG4gICAgJ0MnOlxuICAgICAgdGl0bGU6ICdnY2MgQ29tcGlsZXInXG4gICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgZGVmYXVsdDogJ2djYydcbiAgICAgIG9yZGVyOiAxXG4gICAgICBkZXNjcmlwdGlvbjogJ0NvbXBpbGVyIGZvciBgQ2AsIGluIGZ1bGwgcGF0aCBvciBjb21tYW5kIG5hbWUgKG1ha2Ugc3VyZSBpdCBpcyBpbiB5b3VyIGAkUEFUSGApJ1xuICAgICdDKysnOlxuICAgICAgdGl0bGU6ICdnKysgQ29tcGlsZXInXG4gICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgZGVmYXVsdDogJ2crKydcbiAgICAgIG9yZGVyOiAyXG4gICAgICBkZXNjcmlwdGlvbjogJ0NvbXBpbGVyIGZvciBgQysrYCwgaW4gZnVsbCBwYXRoIG9yIGNvbW1hbmQgbmFtZSAobWFrZSBzdXJlIGl0IGlzIGluIHlvdXIgYCRQQVRIYCknXG4gICAgJ21ha2UnOlxuICAgICAgdGl0bGU6ICdtYWtlIFV0aWxpdHknXG4gICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgZGVmYXVsdDogJ21ha2UnXG4gICAgICBvcmRlcjogM1xuICAgICAgZGVzY3JpcHRpb246ICdUaGUgYG1ha2VgIHV0aWxpdHkgdXNlZCBmb3IgY29tcGlsYXRpb24sIGluIGZ1bGwgcGF0aCBvciBjb21tYW5kIG5hbWUgKG1ha2Ugc3VyZSBpdCBpcyBpbiB5b3VyIGAkUEFUSGApJ1xuICAgICd1bmNvbmRCdWlsZCc6XG4gICAgICB0aXRsZTogJ1VuY29uZGl0aW9uYWwgQnVpbGQnXG4gICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgICBvcmRlcjogNFxuICAgICAgZGVzY3JpcHRpb246ICdXaWxsIG5vdCBjaGVjayBpZiBleGVjdXRhYmxlIGlzIHVwIHRvIGRhdGUnXG4gICAgJ2NmbGFncyc6XG4gICAgICB0aXRsZTogJ0NvbXBpbGVyIEZsYWdzJ1xuICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgIGRlZmF1bHQ6ICcnXG4gICAgICBvcmRlcjogNVxuICAgICAgZGVzY3JpcHRpb246ICdGbGFncyBmb3IgY29tcGlsZXIsIGVnOiBgLVdhbGxgJ1xuICAgICdsZGxpYnMnOlxuICAgICAgdGl0bGU6ICdMaW5rIExpYnJhcmllcydcbiAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICBkZWZhdWx0OiAnJ1xuICAgICAgb3JkZXI6IDZcbiAgICAgIGRlc2NyaXB0aW9uOiAnTGlicmFyaWVzIGZvciBsaW5raW5nLCBlZzogYC1sbWAnXG4gICAgJ2FyZ3MnOlxuICAgICAgdGl0bGU6ICdSdW4gQXJndW1lbnRzJ1xuICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgIGRlZmF1bHQ6ICcnXG4gICAgICBvcmRlcjogN1xuICAgICAgZGVzY3JpcHRpb246ICdBcmd1bWVudHMgZm9yIGV4ZWN1dGluZywgZWc6IGAxIFwiMiAzXCIgXCJcXFxcXFxcIjQgNSA2XFxcXFxcXCJcImAnXG4gICAgJ2V4dCc6XG4gICAgICB0aXRsZTogJ091dHB1dCBFeHRlbnNpb24nXG4gICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgZGVmYXVsdDogJydcbiAgICAgIG9yZGVyOiA4XG4gICAgICBkZXNjcmlwdGlvbjogJ1RoZSBvdXRwdXQgZXh0ZW5zaW9uLCBlZzogYG91dGAsIGluIFdpbmRvd3MgY29tcGlsZXJzIHdpbGwgdXNlIGBleGVgIGJ5IGRlZmF1bHQnXG4gICAgJ3Rlcm1pbmFsJzpcbiAgICAgIHRpdGxlOiAnVGVybWluYWwgU3RhcnQgQ29tbWFuZCAob25seSBMaW51eCBwbGF0Zm9ybSknXG4gICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgZGVmYXVsdDogJ3h0ZXJtIC1UICR0aXRsZSAtZSdcbiAgICAgIG9yZGVyOiA5XG4gICAgICBkZXNjcmlwdGlvbjogJ0N1c3RvbWl6ZSB0aGUgdGVybWluYWwgc3RhcnQgY29tbWFuZCwgZWc6IGBnbm9tZS10ZXJtaW5hbCAtdCAkdGl0bGUgLXggYmFzaCAtY2AnXG4gICAgJ2RlYnVnJzpcbiAgICAgIHRpdGxlOiAnRGVidWcgTW9kZSdcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICAgIG9yZGVyOiAxMFxuICAgICAgZGVzY3JpcHRpb246ICdUdXJuIG9uIHRoaXMgZmxhZyB0byBsb2cgdGhlIGV4ZWN1dGVkIGNvbW1hbmQgYW5kIG91dHB1dCBpbiBjb25zb2xlJ1xuXG4gIGdjY01ha2VSdW5WaWV3OiBudWxsXG4gIG9uZVRpbWVCdWlsZDogZmFsc2VcblxuICAjIyNcbiAgIyBwYWNrYWdlIHNldHVwXG4gICMjI1xuICBhY3RpdmF0ZTogKHN0YXRlKSAtPlxuICAgIEBnY2NNYWtlUnVuVmlldyA9IG5ldyBHY2NNYWtlUnVuVmlldyhAKVxuICAgIEBzdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuICAgIEBzdWJzY3JpcHRpb25zLmFkZChcbiAgICAgIGF0b20uY29tbWFuZHMuYWRkICdhdG9tLXdvcmtzcGFjZScsICdnY2MtbWFrZS1ydW46Y29tcGlsZS1ydW4nOiA9PiBAY29tcGlsZSgpLFxuICAgICAgYXRvbS5jb21tYW5kcy5hZGQgJy50cmVlLXZpZXcgLmZpbGUgPiAubmFtZScsICdnY2MtbWFrZS1ydW46bWFrZS1ydW4nOiAoZSkgPT4gQG1ha2UoZS50YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLXBhdGgnKSlcbiAgICApXG5cbiAgZGVhY3RpdmF0ZTogLT5cbiAgICBAc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgICBAZ2NjTWFrZVJ1blZpZXcuY2FuY2VsKClcblxuICBzZXJpYWxpemU6IC0+XG4gICAgZ2NjTWFrZVJ1blZpZXdTdGF0ZTogQGdjY01ha2VSdW5WaWV3LnNlcmlhbGl6ZSgpXG5cbiAgIyMjXG4gICMgY29tcGlsZSBhbmQgbWFrZSBydW5cbiAgIyMjXG4gIGNvbXBpbGU6ICgpIC0+XG4gICAgIyBnZXQgZWRpdG9yXG4gICAgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgcmV0dXJuIHVubGVzcyBlZGl0b3I/XG5cbiAgICAjIHNhdmUgZmlsZVxuICAgIHNyY1BhdGggPSBlZGl0b3IuZ2V0UGF0aCgpXG4gICAgaWYgIXNyY1BhdGhcbiAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcignZ2NjLW1ha2UtcnVuOiBGaWxlIE5vdCBTYXZlZCcsIHsgZGV0YWlsOiAnVGVtcG9yYXJ5IGZpbGVzIG11c3QgYmUgc2F2ZWQgZmlyc3QnIH0pXG4gICAgICByZXR1cm5cbiAgICBQcm9taXNlLnJlc29sdmUoZWRpdG9yLnNhdmUoKSBpZiBlZGl0b3IuaXNNb2RpZmllZCgpKS50aGVuID0+XG5cbiAgICAgICMgZ2V0IGdyYW1tYXJcbiAgICAgIGdyYW1tYXIgPSBlZGl0b3IuZ2V0R3JhbW1hcigpLm5hbWVcbiAgICAgIHN3aXRjaCBncmFtbWFyXG4gICAgICAgIHdoZW4gJ0MnLCAnQysrJywgJ0MrKzE0JyB0aGVuIGdyYW1tYXIgPSAnQysrJyBpZiBncmFtbWFyID09ICdDKysxNCdcbiAgICAgICAgd2hlbiAnTWFrZWZpbGUnXG4gICAgICAgICAgQG1ha2Uoc3JjUGF0aClcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgZWxzZVxuICAgICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcignZ2NjLW1ha2UtcnVuOiBHcmFtbWFyIE5vdCBTdXBwb3J0ZWQnLCB7IGRldGFpbDogJ09ubHkgQywgQysrIGFuZCBNYWtlZmlsZSBhcmUgc3VwcG9ydGVkJyB9KVxuICAgICAgICAgIHJldHVyblxuXG4gICAgICAjIGdldCBjb25maWdcbiAgICAgIGluZm8gPSBwYXJzZShlZGl0b3IuZ2V0UGF0aCgpKVxuICAgICAgaW5mby51c2VNYWtlID0gZmFsc2VcbiAgICAgIGluZm8uZXhlID0gaW5mby5uYW1lXG4gICAgICBleHQgPSBhdG9tLmNvbmZpZy5nZXQoJ2djYy1tYWtlLXJ1bi5leHQnKVxuICAgICAgaWYgZXh0IHRoZW4gaW5mby5leGUgKz0gXCIuI3tleHR9XCIgZWxzZSBpZiBwcm9jZXNzLnBsYXRmb3JtID09ICd3aW4zMicgdGhlbiBpbmZvLmV4ZSArPSAnLmV4ZSdcbiAgICAgIGNvbXBpbGVyID0gYXRvbS5jb25maWcuZ2V0KFwiZ2NjLW1ha2UtcnVuLiN7Z3JhbW1hcn1cIilcbiAgICAgIGNmbGFncyA9IGF0b20uY29uZmlnLmdldCgnZ2NjLW1ha2UtcnVuLmNmbGFncycpXG4gICAgICBsZGxpYnMgPSBhdG9tLmNvbmZpZy5nZXQoJ2djYy1tYWtlLXJ1bi5sZGxpYnMnKVxuXG4gICAgICAjIGNoZWNrIGlmIHVwZGF0ZSBuZWVkZWQgYmVmb3JlIGNvbXBpbGVcbiAgICAgIGlmICFAc2hvdWxkVW5jb25kQnVpbGQoKSAmJiBAaXNFeGVVcFRvRGF0ZShpbmZvKVxuICAgICAgICBAcnVuKGluZm8pXG4gICAgICBlbHNlXG4gICAgICAgIGNtZCA9IFwiXFxcIiN7Y29tcGlsZXJ9XFxcIiAje2NmbGFnc30gXFxcIiN7aW5mby5iYXNlfVxcXCIgLW8gXFxcIiN7aW5mby5leGV9XFxcIiAje2xkbGlic31cIlxuICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkSW5mbygnZ2NjLW1ha2UtcnVuOiBSdW5uaW5nIENvbW1hbmQuLi4nLCB7IGRldGFpbDogY21kIH0pXG4gICAgICAgIGV4ZWMoY21kICwgeyBjd2Q6IGluZm8uZGlyIH0sIEBvbkJ1aWxkRmluaXNoZWQuYmluZChALCBpbmZvKSlcblxuICBtYWtlOiAoc3JjUGF0aCkgLT5cbiAgICAjIGdldCBjb25maWdcbiAgICBpbmZvID0gcGFyc2Uoc3JjUGF0aClcbiAgICBpbmZvLnVzZU1ha2UgPSB0cnVlXG4gICAgbWsgPSBhdG9tLmNvbmZpZy5nZXQoJ2djYy1tYWtlLXJ1bi5tYWtlJylcbiAgICBta0ZsYWdzID0gaWYgQHNob3VsZFVuY29uZEJ1aWxkKCkgdGhlbiAnLUInIGVsc2UgJydcblxuICAgICMgbWFrZVxuICAgIGNtZCA9IFwiXFxcIiN7bWt9XFxcIiAje21rRmxhZ3N9IC1mIFxcXCIje2luZm8uYmFzZX1cXFwiXCJcbiAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkSW5mbygnZ2NjLW1ha2UtcnVuOiBSdW5uaW5nIENvbW1hbmQuLi4nLCB7IGRldGFpbDogY21kIH0pXG4gICAgZXhlYyhjbWQsIHsgY3dkOiBpbmZvLmRpciB9LCBAb25CdWlsZEZpbmlzaGVkLmJpbmQoQCwgaW5mbykpXG5cbiAgb25CdWlsZEZpbmlzaGVkOiAoaW5mbywgZXJyb3IsIHN0ZG91dCwgc3RkZXJyKSAtPlxuICAgICMgbm90aWZpY2F0aW9ucyBhYm91dCBjb21waWxhdGlvbiBzdGF0dXNcbiAgICBoYXNDb21waWxlZCA9IChzdGRvdXQ/LmluZGV4T2YoJ3VwIHRvIGRhdGUnKSA8IDAgJiYgc3Rkb3V0Py5pbmRleE9mKCd0byBiZSBkb25lJykgPCAwKSB8fCAhc3Rkb3V0P1xuICAgIGF0b20ubm90aWZpY2F0aW9uc1tpZiBlcnJvciB0aGVuICdhZGRFcnJvcicgZWxzZSAnYWRkV2FybmluZyddKFwiZ2NjLW1ha2UtcnVuOiBDb21waWxlICN7aWYgZXJyb3IgdGhlbiAnRXJyb3InIGVsc2UgJ1dhcm5pbmcnfVwiLCB7IGRldGFpbDogc3RkZXJyLCBkaXNtaXNzYWJsZTogdHJ1ZSB9KSBpZiBzdGRlcnJcbiAgICBhdG9tLm5vdGlmaWNhdGlvbnNbaWYgaGFzQ29tcGlsZWQgdGhlbiAnYWRkSW5mbycgZWxzZSAnYWRkU3VjY2VzcyddKCdnY2MtbWFrZS1ydW46IENvbXBpbGVyIE91dHB1dCcsIHsgZGV0YWlsOiBzdGRvdXQgfSkgaWYgc3Rkb3V0XG5cbiAgICAjIGNvbnRpbnVlIG9ubHkgaWYgbm8gZXJyb3JcbiAgICByZXR1cm4gaWYgZXJyb3JcbiAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkU3VjY2VzcygnZ2NjLW1ha2UtcnVuOiBCdWlsZCBTdWNjZXNzJykgaWYgaGFzQ29tcGlsZWRcbiAgICBAcnVuKGluZm8pXG5cbiAgcnVuOiAoaW5mbykgLT5cbiAgICAjIGJ1aWxkIHRoZSBydW4gY21kXG4gICAgcmV0dXJuIHVubGVzcyBAY2hlY2tNYWtlUnVuVGFyZ2V0KGluZm8pXG4gICAgcmV0dXJuIHVubGVzcyBAYnVpbGRSdW5DbWQoaW5mbylcblxuICAgICMgcnVuIHRoZSBjbWRcbiAgICBjb25zb2xlLmxvZyBpbmZvLmNtZCBpZiBhdG9tLmNvbmZpZy5nZXQoJ2djYy1tYWtlLXJ1bi5kZWJ1ZycpXG4gICAgZXhlYyhpbmZvLmNtZCwgeyBjd2Q6IGluZm8uZGlyLCBlbnY6IGluZm8uZW52IH0sIEBvblJ1bkZpbmlzaGVkLmJpbmQoQCkpXG5cbiAgb25SdW5GaW5pc2hlZDogKGVycm9yLCBzdGRvdXQsIHN0ZGVycikgLT5cbiAgICAjIGNvbW1hbmQgZXJyb3JcbiAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IoJ2djYy1tYWtlLXJ1bjogUnVuIENvbW1hbmQgRmFpbGVkJywgeyBkZXRhaWw6IHN0ZGVyciwgZGlzbWlzc2FibGU6IHRydWUgfSkgaWYgZXJyb3JcbiAgICBjb25zb2xlLmxvZyBzdGRvdXQgaWYgc3Rkb3V0ICYmIGF0b20uY29uZmlnLmdldCgnZ2NjLW1ha2UtcnVuLmRlYnVnJylcblxuICAjIyNcbiAgIyBoZWxwZXIgZnVuY3Rpb25zXG4gICMjI1xuICBpc0V4ZVVwVG9EYXRlOiAoaW5mbykgLT5cbiAgICAjIGNoZWNrIHNyYyBhbmQgZXhlIG1vZGlmaWVkIHRpbWVcbiAgICBzcmNUaW1lID0gc3RhdFN5bmMoam9pbihpbmZvLmRpciwgaW5mby5iYXNlKSkubXRpbWUuZ2V0VGltZSgpXG4gICAgdHJ5XG4gICAgICBleGVUaW1lID0gc3RhdFN5bmMoam9pbihpbmZvLmRpciwgaW5mby5leGUpKS5tdGltZS5nZXRUaW1lKClcbiAgICBjYXRjaCBlcnJvclxuICAgICAgZXhlVGltZSA9IDBcblxuICAgIGlmIHNyY1RpbWUgPCBleGVUaW1lXG4gICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkU3VjY2VzcyhcImdjYy1tYWtlLXJ1bjogT3V0cHV0IFVwIFRvIERhdGVcIiwgeyBkZXRhaWw6IFwiJyN7aW5mby5leGV9JyBpcyB1cCB0byBkYXRlXCIgfSlcbiAgICAgIHJldHVybiB0cnVlXG4gICAgcmV0dXJuIGZhbHNlXG5cbiAgY2hlY2tNYWtlUnVuVGFyZ2V0OiAoaW5mbykgLT5cbiAgICAjIHJldHVybiBpZiBub3QgdXNpbmcgTWFrZWZpbGVcbiAgICByZXR1cm4gdHJ1ZSBpZiAhaW5mby51c2VNYWtlXG5cbiAgICBtayA9IGF0b20uY29uZmlnLmdldChcImdjYy1tYWtlLXJ1bi5tYWtlXCIpXG4gICAgaW5mby5leGUgPSB1bmRlZmluZWRcblxuICAgICMgdHJ5IG1ha2UgcnVuIHRvIGdldCB0aGUgdGFyZ2V0XG4gICAgdHJ5XG4gICAgICBpbmZvLmV4ZSA9IGV4ZWNTeW5jKFwiXFxcIiN7bWt9XFxcIiAtbmYgXFxcIiN7aW5mby5iYXNlfVxcXCIgcnVuXCIsIHsgY3dkOiBpbmZvLmRpciwgc3RkaW86IFtdLCBlbmNvZGluZzogJ3V0ZjgnIH0pLnNwbGl0KCcjJylbMF0ubWF0Y2goL1teXFxyXFxuXSsvZylbMF1cbiAgICAgIGlmICFpbmZvLmV4ZSB8fCBpbmZvLmV4ZS5pbmRleE9mKCd0byBiZSBkb25lJykgPj0gMCB0aGVuIHRocm93IEVycm9yKClcbiAgICAgIGlmIHByb2Nlc3MucGxhdGZvcm0gPT0gJ3dpbjMyJyAmJiBpbmZvLmV4ZS5pbmRleE9mKCcuZXhlJykgIT0gLTEgdGhlbiBpbmZvLmV4ZSArPSAnLmV4ZSdcbiAgICAgIHJldHVybiB0cnVlXG4gICAgY2F0Y2ggZXJyb3JcbiAgICAgICMgY2Fubm90IGdldCBydW4gdGFyZ2V0XG4gICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IoXG4gICAgICAgIFwiZ2NjLW1ha2UtcnVuOiBDYW5ub3QgZmluZCAncnVuJyB0YXJnZXRcIixcbiAgICAgICAge1xuICAgICAgICAgIGRldGFpbDogXCJcIlwiXG4gICAgICAgICAgICBUYXJnZXQgJ3J1bicgaXMgbm90IHNwZWNpZmllZCBpbiAje2luZm8uYmFzZX1cbiAgICAgICAgICAgIEV4YW1wbGUgJ3J1bicgdGFyZ2V0OlxuICAgICAgICAgICAgcnVuOlxuICAgICAgICAgICAgICBleGN1dGFibGUgJChBUkdTKVxuICAgICAgICAgIFwiXCJcIixcbiAgICAgICAgICBkaXNtaXNzYWJsZTogdHJ1ZVxuICAgICAgICB9XG4gICAgICApXG4gICAgICByZXR1cm4gZmFsc2VcblxuICBzaG91bGRVbmNvbmRCdWlsZDogLT5cbiAgICByZXQgPSBAb25lVGltZUJ1aWxkIHx8IGF0b20uY29uZmlnLmdldCgnZ2NjLW1ha2UtcnVuLnVuY29uZEJ1aWxkJylcbiAgICBAb25lVGltZUJ1aWxkID0gZmFsc2VcbiAgICByZXR1cm4gcmV0XG5cbiAgYnVpbGRSdW5DbWQ6IChpbmZvKSAtPlxuICAgICMgZ2V0IGNvbmZpZ1xuICAgIG1rID0gYXRvbS5jb25maWcuZ2V0KCdnY2MtbWFrZS1ydW4ubWFrZScpXG4gICAgaW5mby5lbnYgPSBfZXh0ZW5kKHsgQVJHUzogYXRvbS5jb25maWcuZ2V0KCdnY2MtbWFrZS1ydW4uYXJncycpIH0sIHByb2Nlc3MuZW52KVxuXG4gICAgIyBmb3IgbGludXggcGxhdGZvcm0sIGdldCB0ZXJtaW5hbCBhbmQgcmVwbGFjZSB0aGUgdGl0bGVcbiAgICB0ZXJtaW5hbCA9IGF0b20uY29uZmlnLmdldCgnZ2NjLW1ha2UtcnVuLnRlcm1pbmFsJykucmVwbGFjZSgnJHRpdGxlJywgXCJcXFwiI3tpbmZvLmV4ZX1cXFwiXCIpIGlmIHByb2Nlc3MucGxhdGZvcm0gPT0gJ2xpbnV4J1xuXG4gICAgaWYgaW5mby51c2VNYWtlXG4gICAgICBzd2l0Y2ggcHJvY2Vzcy5wbGF0Zm9ybVxuICAgICAgICB3aGVuICd3aW4zMicgdGhlbiBpbmZvLmNtZCA9IFwic3RhcnQgXFxcIiN7aW5mby5leGV9XFxcIiBjbWQgL2MgXFxcIlxcXCIje21rfVxcXCIgLXNmIFxcXCIje2luZm8uYmFzZX1cXFwiIHJ1biAmIHBhdXNlXFxcIlwiXG4gICAgICAgIHdoZW4gJ2xpbnV4JyB0aGVuIGluZm8uY21kID0gXCIje3Rlcm1pbmFsfSBcXFwiXCIgKyBAZXNjZHEoXCJcXFwiI3tta31cXFwiIC1zZiBcXFwiI3tpbmZvLmJhc2V9XFxcIiBydW5cIikgKyBcIjsgcmVhZCAtbjEgLXAgJ1ByZXNzIGFueSBrZXkgdG8gY29udGludWUuLi4nXFxcIlwiXG4gICAgICAgIHdoZW4gJ2RhcndpbicgdGhlbiBpbmZvLmNtZCA9ICdvc2FzY3JpcHQgLWUgXFwndGVsbCBhcHBsaWNhdGlvbiBcIlRlcm1pbmFsXCIgdG8gYWN0aXZhdGUgZG8gc2NyaXB0IFwiJyArIEBlc2NkcShcImNsZWFyICYmIGNkIFxcXCIje2luZm8uZGlyfVxcXCI7IFxcXCIje21rfVxcXCIgQVJHUz1cXFwiI3tAZXNjZHEoaW5mby5lbnYuQVJHUyl9XFxcIiAtc2YgXFxcIiN7aW5mby5iYXNlfVxcXCIgcnVuOyBcIiArICdyZWFkIC1uMSAtcCBcIlByZXNzIGFueSBrZXkgdG8gY29udGludWUuLi5cIiAmJiBvc2FzY3JpcHQgLWUgXCJ0ZWxsIGFwcGxpY2F0aW9uIFxcXFxcIkF0b21cXFxcXCIgdG8gYWN0aXZhdGVcIiAmJiBvc2FzY3JpcHQgLWUgXCJkbyBzaGVsbCBzY3JpcHQgJyArIEBlc2NkcShcIlxcXCJvc2FzY3JpcHQgLWUgI3tAZXNjZHEoJ1widGVsbCBhcHBsaWNhdGlvbiBcXFxcXCJUZXJtaW5hbFxcXFxcIiB0byBjbG9zZSB3aW5kb3dzIDBcIicpfSArICY+IC9kZXYvbnVsbCAmXFxcIlwiKSArICdcIjsgZXhpdCcpICsgJ1wiXFwnJ1xuICAgIGVsc2VcbiAgICAgICMgbm9ybWFsIHJ1blxuICAgICAgc3dpdGNoIHByb2Nlc3MucGxhdGZvcm1cbiAgICAgICAgd2hlbiAnd2luMzInIHRoZW4gaW5mby5jbWQgPSBcInN0YXJ0IFxcXCIje2luZm8uZXhlfVxcXCIgY21kIC9jIFxcXCJcXFwiI3tpbmZvLmV4ZX1cXFwiICN7aW5mby5lbnYuQVJHU30gJiBwYXVzZVxcXCJcIlxuICAgICAgICB3aGVuICdsaW51eCcgdGhlbiBpbmZvLmNtZCA9IFwiI3t0ZXJtaW5hbH0gXFxcIlwiICsgQGVzY2RxKFwiXFxcIi4vI3tpbmZvLmV4ZX1cXFwiICN7aW5mby5lbnYuQVJHU31cIikgKyBcIjsgcmVhZCAtbjEgLXAgJ1ByZXNzIGFueSBrZXkgdG8gY29udGludWUuLi4nXFxcIlwiXG4gICAgICAgIHdoZW4gJ2RhcndpbicgdGhlbiBpbmZvLmNtZCA9ICdvc2FzY3JpcHQgLWUgXFwndGVsbCBhcHBsaWNhdGlvbiBcIlRlcm1pbmFsXCIgdG8gYWN0aXZhdGUgZG8gc2NyaXB0IFwiJyArIEBlc2NkcShcImNsZWFyICYmIGNkIFxcXCIje2luZm8uZGlyfVxcXCI7IFxcXCIuLyN7aW5mby5leGV9XFxcIiAje2luZm8uZW52LkFSR1N9OyBcIiArICdyZWFkIC1uMSAtcCBcIlByZXNzIGFueSBrZXkgdG8gY29udGludWUuLi5cIiAmJiBvc2FzY3JpcHQgLWUgXCJ0ZWxsIGFwcGxpY2F0aW9uIFxcXFxcIkF0b21cXFxcXCIgdG8gYWN0aXZhdGVcIiAmJiBvc2FzY3JpcHQgLWUgXCJkbyBzaGVsbCBzY3JpcHQgJyArIEBlc2NkcShcIlxcXCJvc2FzY3JpcHQgLWUgI3tAZXNjZHEoJ1widGVsbCBhcHBsaWNhdGlvbiBcXFxcXCJUZXJtaW5hbFxcXFxcIiB0byBjbG9zZSB3aW5kb3dzIDBcIicpfSArICY+IC9kZXYvbnVsbCAmXFxcIlwiKSArICdcIjsgZXhpdCcpICsgJ1wiXFwnJ1xuXG4gICAgIyBjaGVjayBpZiBjbWQgaXMgYnVpbHRcbiAgICByZXR1cm4gdHJ1ZSBpZiBpbmZvLmNtZD9cbiAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IoJ2djYy1tYWtlLXJ1bjogQ2Fubm90IEV4ZWN1dGUgT3V0cHV0JywgeyBkZXRhaWw6ICdFeGVjdXRpb24gYWZ0ZXIgY29tcGlsaW5nIGlzIG5vdCBzdXBwb3J0ZWQgb24geW91ciBPUycgfSlcbiAgICByZXR1cm4gZmFsc2VcblxuICBlc2NkcTogKHMpIC0+XG4gICAgIyBlc2NhcGUgZG91YmxlIHF1b3RlXG4gICAgcy5yZXBsYWNlKC9cXFxcL2csICdcXFxcXFxcXCcpLnJlcGxhY2UoL1wiL2csICdcXFxcXCInKVxuIl19
