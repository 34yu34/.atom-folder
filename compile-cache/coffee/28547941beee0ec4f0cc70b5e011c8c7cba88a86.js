
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
      'debug': {
        title: 'Debug Mode',
        type: 'boolean',
        "default": false,
        order: 9,
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
      atom.commands.add('atom-workspace', {
        'gcc-make-run:compile-run': (function(_this) {
          return function() {
            return _this.compile();
          };
        })(this)
      });
      return atom.commands.add('.tree-view .file > .name', {
        'gcc-make-run:make-run': (function(_this) {
          return function(e) {
            return _this.make(e.target.getAttribute('data-path'));
          };
        })(this)
      });
    },
    deactivate: function() {
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
      var cflags, cmd, compiler, editor, ext, grammar, info, ldlibs, srcPath;
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
      if (editor.isModified()) {
        editor.save();
      }
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
          this.make(srcPath);
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
      if (!this.shouldUncondBuild() && this.isExeUpToDate(info)) {
        return this.run(info);
      } else {
        cmd = "\"" + compiler + "\" " + cflags + " \"" + info.base + "\" -o \"" + info.exe + "\" " + ldlibs;
        atom.notifications.addInfo('gcc-make-run: Running Command...', {
          detail: cmd
        });
        return exec(cmd, {
          cwd: info.dir
        }, this.onBuildFinished.bind(this, info));
      }
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
      var mk;
      mk = atom.config.get('gcc-make-run.make');
      info.env = _extend({
        ARGS: atom.config.get('gcc-make-run.args')
      }, process.env);
      if (info.useMake) {
        switch (process.platform) {
          case 'win32':
            info.cmd = "start \"" + info.exe + "\" cmd /c \"\"" + mk + "\" -sf \"" + info.base + "\" run & pause\"";
            break;
          case 'linux':
            info.cmd = ("xterm -T \"" + info.exe + "\" -e \"") + this.escdq("\"" + mk + "\" -sf \"" + info.base + "\" run") + "; read -n1 -p 'Press any key to continue...'\"";
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
            info.cmd = ("xterm -T \"" + info.exe + "\" -e \"") + this.escdq("\"./" + info.exe + "\" " + info.env.ARGS) + "; read -n1 -p 'Press any key to continue...'\"";
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYmlsbHkvLmF0b20vcGFja2FnZXMvZ2NjLW1ha2UtcnVuL2xpYi9nY2MtbWFrZS1ydW4uY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0FBQUE7QUFBQSxNQUFBOztFQU1BLGNBQUEsR0FBaUIsT0FBQSxDQUFRLHFCQUFSOztFQUNoQixzQkFBdUIsT0FBQSxDQUFRLE1BQVI7O0VBQ3hCLE1BQWdCLE9BQUEsQ0FBUSxNQUFSLENBQWhCLEVBQUMsaUJBQUQsRUFBUTs7RUFDUixPQUFtQixPQUFBLENBQVEsZUFBUixDQUFuQixFQUFDLGdCQUFELEVBQU87O0VBQ04sV0FBWSxPQUFBLENBQVEsSUFBUjs7RUFDWixVQUFXLE9BQUEsQ0FBUSxNQUFSOztFQUVaLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFVBQUEsR0FDZjtJQUFBLE1BQUEsRUFDRTtNQUFBLEdBQUEsRUFDRTtRQUFBLEtBQUEsRUFBTyxjQUFQO1FBQ0EsSUFBQSxFQUFNLFFBRE47UUFFQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLEtBRlQ7UUFHQSxLQUFBLEVBQU8sQ0FIUDtRQUlBLFdBQUEsRUFBYSxrRkFKYjtPQURGO01BTUEsS0FBQSxFQUNFO1FBQUEsS0FBQSxFQUFPLGNBQVA7UUFDQSxJQUFBLEVBQU0sUUFETjtRQUVBLENBQUEsT0FBQSxDQUFBLEVBQVMsS0FGVDtRQUdBLEtBQUEsRUFBTyxDQUhQO1FBSUEsV0FBQSxFQUFhLG9GQUpiO09BUEY7TUFZQSxNQUFBLEVBQ0U7UUFBQSxLQUFBLEVBQU8sY0FBUDtRQUNBLElBQUEsRUFBTSxRQUROO1FBRUEsQ0FBQSxPQUFBLENBQUEsRUFBUyxNQUZUO1FBR0EsS0FBQSxFQUFPLENBSFA7UUFJQSxXQUFBLEVBQWEseUdBSmI7T0FiRjtNQWtCQSxhQUFBLEVBQ0U7UUFBQSxLQUFBLEVBQU8scUJBQVA7UUFDQSxJQUFBLEVBQU0sU0FETjtRQUVBLENBQUEsT0FBQSxDQUFB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Q0EsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFuQixDQUE0QixxQ0FBNUIsRUFBbUU7UUFBRSxNQUFBLEVBQVEsdURBQVY7T0FBbkU7QUFDQSxhQUFPO0lBcEJJLENBM01iO0lBaU9BLEtBQUEsRUFBTyxTQUFDLENBQUQ7YUFFTCxDQUFDLENBQUMsT0FBRixDQUFVLEtBQVYsRUFBaUIsTUFBakIsQ0FBd0IsQ0FBQyxPQUF6QixDQUFpQyxJQUFqQyxFQUF1QyxLQUF2QztJQUZLLENBak9QOztBQWRGIiwic291cmNlc0NvbnRlbnQiOlsiIyMjXG4jIGEgcmVtYWtlIG9mIGtyaXNjcm9zczA3L2F0b20tZ3BwLWNvbXBpbGVyIHdpdGggZXh0ZW5kZWQgZmVhdHVyZXNcbiMgaHR0cHM6Ly9naXRodWIuY29tL2tyaXNjcm9zczA3L2F0b20tZ3BwLWNvbXBpbGVyXG4jIGh0dHBzOi8vYXRvbS5pby9wYWNrYWdlcy9ncHAtY29tcGlsZXJcbiMjI1xuXG5HY2NNYWtlUnVuVmlldyA9IHJlcXVpcmUgJy4vZ2NjLW1ha2UtcnVuLXZpZXcnXG57Q29tcG9zaXRlRGlzcG9zYWJsZX0gPSByZXF1aXJlICdhdG9tJ1xue3BhcnNlLCBqb2lufSA9IHJlcXVpcmUgJ3BhdGgnXG57ZXhlYywgZXhlY1N5bmN9ID0gcmVxdWlyZSAnY2hpbGRfcHJvY2VzcydcbntzdGF0U3luY30gPSByZXF1aXJlICdmcydcbntfZXh0ZW5kfSA9IHJlcXVpcmUgJ3V0aWwnXG5cbm1vZHVsZS5leHBvcnRzID0gR2NjTWFrZVJ1biA9XG4gIGNvbmZpZzpcbiAgICAnQyc6XG4gICAgICB0aXRsZTogJ2djYyBDb21waWxlcidcbiAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICBkZWZhdWx0OiAnZ2NjJ1xuICAgICAgb3JkZXI6IDFcbiAgICAgIGRlc2NyaXB0aW9uOiAnQ29tcGlsZXIgZm9yIGBDYCwgaW4gZnVsbCBwYXRoIG9yIGNvbW1hbmQgbmFtZSAobWFrZSBzdXJlIGl0IGlzIGluIHlvdXIgYCRQQVRIYCknXG4gICAgJ0MrKyc6XG4gICAgICB0aXRsZTogJ2crKyBDb21waWxlcidcbiAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICBkZWZhdWx0OiAnZysrJ1xuICAgICAgb3JkZXI6IDJcbiAgICAgIGRlc2NyaXB0aW9uOiAnQ29tcGlsZXIgZm9yIGBDKytgLCBpbiBmdWxsIHBhdGggb3IgY29tbWFuZCBuYW1lIChtYWtlIHN1cmUgaXQgaXMgaW4geW91ciBgJFBBVEhgKSdcbiAgICAnbWFrZSc6XG4gICAgICB0aXRsZTogJ21ha2UgVXRpbGl0eSdcbiAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICBkZWZhdWx0OiAnbWFrZSdcbiAgICAgIG9yZGVyOiAzXG4gICAgICBkZXNjcmlwdGlvbjogJ1RoZSBgbWFrZWAgdXRpbGl0eSB1c2VkIGZvciBjb21waWxhdGlvbiwgaW4gZnVsbCBwYXRoIG9yIGNvbW1hbmQgbmFtZSAobWFrZSBzdXJlIGl0IGlzIGluIHlvdXIgYCRQQVRIYCknXG4gICAgJ3VuY29uZEJ1aWxkJzpcbiAgICAgIHRpdGxlOiAnVW5jb25kaXRpb25hbCBCdWlsZCdcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICAgIG9yZGVyOiA0XG4gICAgICBkZXNjcmlwdGlvbjogJ1dpbGwgbm90IGNoZWNrIGlmIGV4ZWN1dGFibGUgaXMgdXAgdG8gZGF0ZSdcbiAgICAnY2ZsYWdzJzpcbiAgICAgIHRpdGxlOiAnQ29tcGlsZXIgRmxhZ3MnXG4gICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgZGVmYXVsdDogJydcbiAgICAgIG9yZGVyOiA1XG4gICAgICBkZXNjcmlwdGlvbjogJ0ZsYWdzIGZvciBjb21waWxlciwgZWc6IGAtV2FsbGAnXG4gICAgJ2xkbGlicyc6XG4gICAgICB0aXRsZTogJ0xpbmsgTGlicmFyaWVzJ1xuICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgIGRlZmF1bHQ6ICcnXG4gICAgICBvcmRlcjogNlxuICAgICAgZGVzY3JpcHRpb246ICdMaWJyYXJpZXMgZm9yIGxpbmtpbmcsIGVnOiBgLWxtYCdcbiAgICAnYXJncyc6XG4gICAgICB0aXRsZTogJ1J1biBBcmd1bWVudHMnXG4gICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgZGVmYXVsdDogJydcbiAgICAgIG9yZGVyOiA3XG4gICAgICBkZXNjcmlwdGlvbjogJ0FyZ3VtZW50cyBmb3IgZXhlY3V0aW5nLCBlZzogYDEgXCIyIDNcIiBcIlxcXFxcXFwiNCA1IDZcXFxcXFxcIlwiYCdcbiAgICAnZXh0JzpcbiAgICAgIHRpdGxlOiAnT3V0cHV0IEV4dGVuc2lvbidcbiAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICBkZWZhdWx0OiAnJ1xuICAgICAgb3JkZXI6IDhcbiAgICAgIGRlc2NyaXB0aW9uOiAnVGhlIG91dHB1dCBleHRlbnNpb24sIGVnOiBgb3V0YCwgaW4gV2luZG93cyBjb21waWxlcnMgd2lsbCB1c2UgYGV4ZWAgYnkgZGVmYXVsdCdcbiAgICAnZGVidWcnOlxuICAgICAgdGl0bGU6ICdEZWJ1ZyBNb2RlJ1xuICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICBkZWZhdWx0OiBmYWxzZVxuICAgICAgb3JkZXI6IDlcbiAgICAgIGRlc2NyaXB0aW9uOiAnVHVybiBvbiB0aGlzIGZsYWcgdG8gbG9nIHRoZSBleGVjdXRlZCBjb21tYW5kIGFuZCBvdXRwdXQgaW4gY29uc29sZSdcbiAgZ2NjTWFrZVJ1blZpZXc6IG51bGxcbiAgb25lVGltZUJ1aWxkOiBmYWxzZVxuXG4gICMjI1xuICAjIHBhY2thZ2Ugc2V0dXBcbiAgIyMjXG4gIGFjdGl2YXRlOiAoc3RhdGUpIC0+XG4gICAgQGdjY01ha2VSdW5WaWV3ID0gbmV3IEdjY01ha2VSdW5WaWV3KEApXG4gICAgYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20td29ya3NwYWNlJywgJ2djYy1tYWtlLXJ1bjpjb21waWxlLXJ1bic6ID0+IEBjb21waWxlKClcbiAgICBhdG9tLmNvbW1hbmRzLmFkZCAnLnRyZWUtdmlldyAuZmlsZSA+IC5uYW1lJywgJ2djYy1tYWtlLXJ1bjptYWtlLXJ1bic6IChlKSA9PiBAbWFrZShlLnRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtcGF0aCcpKVxuXG4gIGRlYWN0aXZhdGU6IC0+XG4gICAgQGdjY01ha2VSdW5WaWV3LmNhbmNlbCgpXG5cbiAgc2VyaWFsaXplOiAtPlxuICAgIGdjY01ha2VSdW5WaWV3U3RhdGU6IEBnY2NNYWtlUnVuVmlldy5zZXJpYWxpemUoKVxuXG4gICMjI1xuICAjIGNvbXBpbGUgYW5kIG1ha2UgcnVuXG4gICMjI1xuICBjb21waWxlOiAoKSAtPlxuICAgICMgZ2V0IGVkaXRvclxuICAgIGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgIHJldHVybiB1bmxlc3MgZWRpdG9yP1xuXG4gICAgIyBzYXZlIGZpbGVcbiAgICBzcmNQYXRoID0gZWRpdG9yLmdldFBhdGgoKVxuICAgIGlmICFzcmNQYXRoXG4gICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IoJ2djYy1tYWtlLXJ1bjogRmlsZSBOb3QgU2F2ZWQnLCB7IGRldGFpbDogJ1RlbXBvcmFyeSBmaWxlcyBtdXN0IGJlIHNhdmVkIGZpcnN0JyB9KVxuICAgICAgcmV0dXJuXG4gICAgZWRpdG9yLnNhdmUoKSBpZiBlZGl0b3IuaXNNb2RpZmllZCgpXG5cbiAgICAjIGdldCBncmFtbWFyXG4gICAgZ3JhbW1hciA9IGVkaXRvci5nZXRHcmFtbWFyKCkubmFtZVxuICAgIHN3aXRjaCBncmFtbWFyXG4gICAgICB3aGVuICdDJywgJ0MrKycsICdDKysxNCcgdGhlbiBncmFtbWFyID0gJ0MrKycgaWYgZ3JhbW1hciA9PSAnQysrMTQnXG4gICAgICB3aGVuICdNYWtlZmlsZSdcbiAgICAgICAgQG1ha2Uoc3JjUGF0aClcbiAgICAgICAgcmV0dXJuXG4gICAgICBlbHNlXG4gICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcignZ2NjLW1ha2UtcnVuOiBHcmFtbWFyIE5vdCBTdXBwb3J0ZWQnLCB7IGRldGFpbDogJ09ubHkgQywgQysrIGFuZCBNYWtlZmlsZSBhcmUgc3VwcG9ydGVkJyB9KVxuICAgICAgICByZXR1cm5cblxuICAgICMgZ2V0IGNvbmZpZ1xuICAgIGluZm8gPSBwYXJzZShlZGl0b3IuZ2V0UGF0aCgpKVxuICAgIGluZm8udXNlTWFrZSA9IGZhbHNlXG4gICAgaW5mby5leGUgPSBpbmZvLm5hbWVcbiAgICBleHQgPSBhdG9tLmNvbmZpZy5nZXQoJ2djYy1tYWtlLXJ1bi5leHQnKVxuICAgIGlmIGV4dCB0aGVuIGluZm8uZXhlICs9IFwiLiN7ZXh0fVwiIGVsc2UgaWYgcHJvY2Vzcy5wbGF0Zm9ybSA9PSAnd2luMzInIHRoZW4gaW5mby5leGUgKz0gJy5leGUnXG4gICAgY29tcGlsZXIgPSBhdG9tLmNvbmZpZy5nZXQoXCJnY2MtbWFrZS1ydW4uI3tncmFtbWFyfVwiKVxuICAgIGNmbGFncyA9IGF0b20uY29uZmlnLmdldCgnZ2NjLW1ha2UtcnVuLmNmbGFncycpXG4gICAgbGRsaWJzID0gYXRvbS5jb25maWcuZ2V0KCdnY2MtbWFrZS1ydW4ubGRsaWJzJylcblxuICAgICMgY2hlY2sgaWYgdXBkYXRlIG5lZWRlZCBiZWZvcmUgY29tcGlsZVxuICAgIGlmICFAc2hvdWxkVW5jb25kQnVpbGQoKSAmJiBAaXNFeGVVcFRvRGF0ZShpbmZvKVxuICAgICAgQHJ1bihpbmZvKVxuICAgIGVsc2VcbiAgICAgIGNtZCA9IFwiXFxcIiN7Y29tcGlsZXJ9XFxcIiAje2NmbGFnc30gXFxcIiN7aW5mby5iYXNlfVxcXCIgLW8gXFxcIiN7aW5mby5leGV9XFxcIiAje2xkbGlic31cIlxuICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEluZm8oJ2djYy1tYWtlLXJ1bjogUnVubmluZyBDb21tYW5kLi4uJywgeyBkZXRhaWw6IGNtZCB9KVxuICAgICAgZXhlYyhjbWQgLCB7IGN3ZDogaW5mby5kaXIgfSwgQG9uQnVpbGRGaW5pc2hlZC5iaW5kKEAsIGluZm8pKVxuXG4gIG1ha2U6IChzcmNQYXRoKSAtPlxuICAgICMgZ2V0IGNvbmZpZ1xuICAgIGluZm8gPSBwYXJzZShzcmNQYXRoKVxuICAgIGluZm8udXNlTWFrZSA9IHRydWVcbiAgICBtayA9IGF0b20uY29uZmlnLmdldCgnZ2NjLW1ha2UtcnVuLm1ha2UnKVxuICAgIG1rRmxhZ3MgPSBpZiBAc2hvdWxkVW5jb25kQnVpbGQoKSB0aGVuICctQicgZWxzZSAnJ1xuXG4gICAgIyBtYWtlXG4gICAgY21kID0gXCJcXFwiI3tta31cXFwiICN7bWtGbGFnc30gLWYgXFxcIiN7aW5mby5iYXNlfVxcXCJcIlxuICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRJbmZvKCdnY2MtbWFrZS1ydW46IFJ1bm5pbmcgQ29tbWFuZC4uLicsIHsgZGV0YWlsOiBjbWQgfSlcbiAgICBleGVjKGNtZCwgeyBjd2Q6IGluZm8uZGlyIH0sIEBvbkJ1aWxkRmluaXNoZWQuYmluZChALCBpbmZvKSlcblxuICBvbkJ1aWxkRmluaXNoZWQ6IChpbmZvLCBlcnJvciwgc3Rkb3V0LCBzdGRlcnIpIC0+XG4gICAgIyBub3RpZmljYXRpb25zIGFib3V0IGNvbXBpbGF0aW9uIHN0YXR1c1xuICAgIGhhc0NvbXBpbGVkID0gKHN0ZG91dD8uaW5kZXhPZigndXAgdG8gZGF0ZScpIDwgMCAmJiBzdGRvdXQ/LmluZGV4T2YoJ3RvIGJlIGRvbmUnKSA8IDApIHx8ICFzdGRvdXQ/XG4gICAgYXRvbS5ub3RpZmljYXRpb25zW2lmIGVycm9yIHRoZW4gJ2FkZEVycm9yJyBlbHNlICdhZGRXYXJuaW5nJ10oXCJnY2MtbWFrZS1ydW46IENvbXBpbGUgI3tpZiBlcnJvciB0aGVuICdFcnJvcicgZWxzZSAnV2FybmluZyd9XCIsIHsgZGV0YWlsOiBzdGRlcnIsIGRpc21pc3NhYmxlOiB0cnVlIH0pIGlmIHN0ZGVyclxuICAgIGF0b20ubm90aWZpY2F0aW9uc1tpZiBoYXNDb21waWxlZCB0aGVuICdhZGRJbmZvJyBlbHNlICdhZGRTdWNjZXNzJ10oJ2djYy1tYWtlLXJ1bjogQ29tcGlsZXIgT3V0cHV0JywgeyBkZXRhaWw6IHN0ZG91dCB9KSBpZiBzdGRvdXRcblxuICAgICMgY29udGludWUgb25seSBpZiBubyBlcnJvclxuICAgIHJldHVybiBpZiBlcnJvclxuICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRTdWNjZXNzKCdnY2MtbWFrZS1ydW46IEJ1aWxkIFN1Y2Nlc3MnKSBpZiBoYXNDb21waWxlZFxuICAgIEBydW4oaW5mbylcblxuICBydW46IChpbmZvKSAtPlxuICAgICMgYnVpbGQgdGhlIHJ1biBjbWRcbiAgICByZXR1cm4gdW5sZXNzIEBjaGVja01ha2VSdW5UYXJnZXQoaW5mbylcbiAgICByZXR1cm4gdW5sZXNzIEBidWlsZFJ1bkNtZChpbmZvKVxuXG4gICAgIyBydW4gdGhlIGNtZFxuICAgIGNvbnNvbGUubG9nIGluZm8uY21kIGlmIGF0b20uY29uZmlnLmdldCgnZ2NjLW1ha2UtcnVuLmRlYnVnJylcbiAgICBleGVjKGluZm8uY21kLCB7IGN3ZDogaW5mby5kaXIsIGVudjogaW5mby5lbnYgfSwgQG9uUnVuRmluaXNoZWQuYmluZChAKSlcblxuICBvblJ1bkZpbmlzaGVkOiAoZXJyb3IsIHN0ZG91dCwgc3RkZXJyKSAtPlxuICAgICMgY29tbWFuZCBlcnJvclxuICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcignZ2NjLW1ha2UtcnVuOiBSdW4gQ29tbWFuZCBGYWlsZWQnLCB7IGRldGFpbDogc3RkZXJyLCBkaXNtaXNzYWJsZTogdHJ1ZSB9KSBpZiBlcnJvclxuICAgIGNvbnNvbGUubG9nIHN0ZG91dCBpZiBzdGRvdXQgJiYgYXRvbS5jb25maWcuZ2V0KCdnY2MtbWFrZS1ydW4uZGVidWcnKVxuXG4gICMjI1xuICAjIGhlbHBlciBmdW5jdGlvbnNcbiAgIyMjXG4gIGlzRXhlVXBUb0RhdGU6IChpbmZvKSAtPlxuICAgICMgY2hlY2sgc3JjIGFuZCBleGUgbW9kaWZpZWQgdGltZVxuICAgIHNyY1RpbWUgPSBzdGF0U3luYyhqb2luKGluZm8uZGlyLCBpbmZvLmJhc2UpKS5tdGltZS5nZXRUaW1lKClcbiAgICB0cnlcbiAgICAgIGV4ZVRpbWUgPSBzdGF0U3luYyhqb2luKGluZm8uZGlyLCBpbmZvLmV4ZSkpLm10aW1lLmdldFRpbWUoKVxuICAgIGNhdGNoIGVycm9yXG4gICAgICBleGVUaW1lID0gMFxuXG4gICAgaWYgc3JjVGltZSA8IGV4ZVRpbWVcbiAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRTdWNjZXNzKFwiZ2NjLW1ha2UtcnVuOiBPdXRwdXQgVXAgVG8gRGF0ZVwiLCB7IGRldGFpbDogXCInI3tpbmZvLmV4ZX0nIGlzIHVwIHRvIGRhdGVcIiB9KVxuICAgICAgcmV0dXJuIHRydWVcbiAgICByZXR1cm4gZmFsc2VcblxuICBjaGVja01ha2VSdW5UYXJnZXQ6IChpbmZvKSAtPlxuICAgICMgcmV0dXJuIGlmIG5vdCB1c2luZyBNYWtlZmlsZVxuICAgIHJldHVybiB0cnVlIGlmICFpbmZvLnVzZU1ha2VcblxuICAgIG1rID0gYXRvbS5jb25maWcuZ2V0KFwiZ2NjLW1ha2UtcnVuLm1ha2VcIilcbiAgICBpbmZvLmV4ZSA9IHVuZGVmaW5lZFxuXG4gICAgIyB0cnkgbWFrZSBydW4gdG8gZ2V0IHRoZSB0YXJnZXRcbiAgICB0cnlcbiAgICAgIGluZm8uZXhlID0gZXhlY1N5bmMoXCJcXFwiI3tta31cXFwiIC1uZiBcXFwiI3tpbmZvLmJhc2V9XFxcIiBydW5cIiwgeyBjd2Q6IGluZm8uZGlyLCBzdGRpbzogW10sIGVuY29kaW5nOiAndXRmOCcgfSkuc3BsaXQoJyMnKVswXS5tYXRjaCgvW15cXHJcXG5dKy9nKVswXVxuICAgICAgaWYgIWluZm8uZXhlIHx8IGluZm8uZXhlLmluZGV4T2YoJ3RvIGJlIGRvbmUnKSA+PSAwIHRoZW4gdGhyb3cgRXJyb3IoKVxuICAgICAgaWYgcHJvY2Vzcy5wbGF0Zm9ybSA9PSAnd2luMzInICYmIGluZm8uZXhlLmluZGV4T2YoJy5leGUnKSAhPSAtMSB0aGVuIGluZm8uZXhlICs9ICcuZXhlJ1xuICAgICAgcmV0dXJuIHRydWVcbiAgICBjYXRjaCBlcnJvclxuICAgICAgIyBjYW5ub3QgZ2V0IHJ1biB0YXJnZXRcbiAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcihcbiAgICAgICAgXCJnY2MtbWFrZS1ydW46IENhbm5vdCBmaW5kICdydW4nIHRhcmdldFwiLFxuICAgICAgICB7XG4gICAgICAgICAgZGV0YWlsOiBcIlwiXCJcbiAgICAgICAgICAgIFRhcmdldCAncnVuJyBpcyBub3Qgc3BlY2lmaWVkIGluICN7aW5mby5iYXNlfVxuICAgICAgICAgICAgRXhhbXBsZSAncnVuJyB0YXJnZXQ6XG4gICAgICAgICAgICBydW46XG4gICAgICAgICAgICAgIGV4Y3V0YWJsZSAkKEFSR1MpXG4gICAgICAgICAgXCJcIlwiLFxuICAgICAgICAgIGRpc21pc3NhYmxlOiB0cnVlXG4gICAgICAgIH1cbiAgICAgIClcbiAgICAgIHJldHVybiBmYWxzZVxuXG4gIHNob3VsZFVuY29uZEJ1aWxkOiAtPlxuICAgIHJldCA9IEBvbmVUaW1lQnVpbGQgfHwgYXRvbS5jb25maWcuZ2V0KCdnY2MtbWFrZS1ydW4udW5jb25kQnVpbGQnKVxuICAgIEBvbmVUaW1lQnVpbGQgPSBmYWxzZVxuICAgIHJldHVybiByZXRcblxuICBidWlsZFJ1bkNtZDogKGluZm8pIC0+XG4gICAgIyBnZXQgY29uZmlnXG4gICAgbWsgPSBhdG9tLmNvbmZpZy5nZXQoJ2djYy1tYWtlLXJ1bi5tYWtlJylcbiAgICBpbmZvLmVudiA9IF9leHRlbmQoeyBBUkdTOiBhdG9tLmNvbmZpZy5nZXQoJ2djYy1tYWtlLXJ1bi5hcmdzJykgfSwgcHJvY2Vzcy5lbnYpXG5cbiAgICBpZiBpbmZvLnVzZU1ha2VcbiAgICAgIHN3aXRjaCBwcm9jZXNzLnBsYXRmb3JtXG4gICAgICAgIHdoZW4gJ3dpbjMyJyB0aGVuIGluZm8uY21kID0gXCJzdGFydCBcXFwiI3tpbmZvLmV4ZX1cXFwiIGNtZCAvYyBcXFwiXFxcIiN7bWt9XFxcIiAtc2YgXFxcIiN7aW5mby5iYXNlfVxcXCIgcnVuICYgcGF1c2VcXFwiXCJcbiAgICAgICAgd2hlbiAnbGludXgnIHRoZW4gaW5mby5jbWQgPSBcInh0ZXJtIC1UIFxcXCIje2luZm8uZXhlfVxcXCIgLWUgXFxcIlwiICsgQGVzY2RxKFwiXFxcIiN7bWt9XFxcIiAtc2YgXFxcIiN7aW5mby5iYXNlfVxcXCIgcnVuXCIpICsgXCI7IHJlYWQgLW4xIC1wICdQcmVzcyBhbnkga2V5IHRvIGNvbnRpbnVlLi4uJ1xcXCJcIlxuICAgICAgICB3aGVuICdkYXJ3aW4nIHRoZW4gaW5mby5jbWQgPSAnb3Nhc2NyaXB0IC1lIFxcJ3RlbGwgYXBwbGljYXRpb24gXCJUZXJtaW5hbFwiIHRvIGFjdGl2YXRlIGRvIHNjcmlwdCBcIicgKyBAZXNjZHEoXCJjbGVhciAmJiBjZCBcXFwiI3tpbmZvLmRpcn1cXFwiOyBcXFwiI3tta31cXFwiIEFSR1M9XFxcIiN7QGVzY2RxKGluZm8uZW52LkFSR1MpfVxcXCIgLXNmIFxcXCIje2luZm8uYmFzZX1cXFwiIHJ1bjsgXCIgKyAncmVhZCAtbjEgLXAgXCJQcmVzcyBhbnkga2V5IHRvIGNvbnRpbnVlLi4uXCIgJiYgb3Nhc2NyaXB0IC1lIFwidGVsbCBhcHBsaWNhdGlvbiBcXFxcXCJBdG9tXFxcXFwiIHRvIGFjdGl2YXRlXCIgJiYgb3Nhc2NyaXB0IC1lIFwiZG8gc2hlbGwgc2NyaXB0ICcgKyBAZXNjZHEoXCJcXFwib3Nhc2NyaXB0IC1lICN7QGVzY2RxKCdcInRlbGwgYXBwbGljYXRpb24gXFxcXFwiVGVybWluYWxcXFxcXCIgdG8gY2xvc2Ugd2luZG93cyAwXCInKX0gKyAmPiAvZGV2L251bGwgJlxcXCJcIikgKyAnXCI7IGV4aXQnKSArICdcIlxcJydcbiAgICBlbHNlXG4gICAgICAjIG5vcm1hbCBydW5cbiAgICAgIHN3aXRjaCBwcm9jZXNzLnBsYXRmb3JtXG4gICAgICAgIHdoZW4gJ3dpbjMyJyB0aGVuIGluZm8uY21kID0gXCJzdGFydCBcXFwiI3tpbmZvLmV4ZX1cXFwiIGNtZCAvYyBcXFwiXFxcIiN7aW5mby5leGV9XFxcIiAje2luZm8uZW52LkFSR1N9ICYgcGF1c2VcXFwiXCJcbiAgICAgICAgd2hlbiAnbGludXgnIHRoZW4gaW5mby5jbWQgPSBcInh0ZXJtIC1UIFxcXCIje2luZm8uZXhlfVxcXCIgLWUgXFxcIlwiICsgQGVzY2RxKFwiXFxcIi4vI3tpbmZvLmV4ZX1cXFwiICN7aW5mby5lbnYuQVJHU31cIikgKyBcIjsgcmVhZCAtbjEgLXAgJ1ByZXNzIGFueSBrZXkgdG8gY29udGludWUuLi4nXFxcIlwiXG4gICAgICAgIHdoZW4gJ2RhcndpbicgdGhlbiBpbmZvLmNtZCA9ICdvc2FzY3JpcHQgLWUgXFwndGVsbCBhcHBsaWNhdGlvbiBcIlRlcm1pbmFsXCIgdG8gYWN0aXZhdGUgZG8gc2NyaXB0IFwiJyArIEBlc2NkcShcImNsZWFyICYmIGNkIFxcXCIje2luZm8uZGlyfVxcXCI7IFxcXCIuLyN7aW5mby5leGV9XFxcIiAje2luZm8uZW52LkFSR1N9OyBcIiArICdyZWFkIC1uMSAtcCBcIlByZXNzIGFueSBrZXkgdG8gY29udGludWUuLi5cIiAmJiBvc2FzY3JpcHQgLWUgXCJ0ZWxsIGFwcGxpY2F0aW9uIFxcXFxcIkF0b21cXFxcXCIgdG8gYWN0aXZhdGVcIiAmJiBvc2FzY3JpcHQgLWUgXCJkbyBzaGVsbCBzY3JpcHQgJyArIEBlc2NkcShcIlxcXCJvc2FzY3JpcHQgLWUgI3tAZXNjZHEoJ1widGVsbCBhcHBsaWNhdGlvbiBcXFxcXCJUZXJtaW5hbFxcXFxcIiB0byBjbG9zZSB3aW5kb3dzIDBcIicpfSArICY+IC9kZXYvbnVsbCAmXFxcIlwiKSArICdcIjsgZXhpdCcpICsgJ1wiXFwnJ1xuXG4gICAgIyBjaGVjayBpZiBjbWQgaXMgYnVpbHRcbiAgICByZXR1cm4gdHJ1ZSBpZiBpbmZvLmNtZD9cbiAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IoJ2djYy1tYWtlLXJ1bjogQ2Fubm90IEV4ZWN1dGUgT3V0cHV0JywgeyBkZXRhaWw6ICdFeGVjdXRpb24gYWZ0ZXIgY29tcGlsaW5nIGlzIG5vdCBzdXBwb3J0ZWQgb24geW91ciBPUycgfSlcbiAgICByZXR1cm4gZmFsc2VcblxuICBlc2NkcTogKHMpIC0+XG4gICAgIyBlc2NhcGUgZG91YmxlIHF1b3RlXG4gICAgcy5yZXBsYWNlKC9cXFxcL2csICdcXFxcXFxcXCcpLnJlcGxhY2UoL1wiL2csICdcXFxcXCInKVxuIl19
