(function() {
  var GrammarUtils, _, base, base1, path, ref, ref1, ref2, ref3, ref4, ref5, shell;

  _ = require('underscore');

  path = require('path');

  GrammarUtils = require('../lib/grammar-utils');

  shell = require('electron').shell;

  module.exports = {
    '1C (BSL)': {
      'File Based': {
        command: "oscript",
        args: function(context) {
          return ['-encoding=utf-8', context.filepath];
        }
      }
    },
    Ansible: {
      "File Based": {
        command: "ansible-playbook",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    AppleScript: {
      'Selection Based': {
        command: 'osascript',
        args: function(context) {
          return ['-e', context.getCode()];
        }
      },
      'File Based': {
        command: 'osascript',
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    AutoHotKey: {
      "File Based": {
        command: "AutoHotKey",
        args: function(context) {
          return [context.filepath];
        }
      },
      "Selection Based": {
        command: "AutoHotKey",
        args: function(context) {
          var code, tmpFile;
          code = context.getCode(true);
          tmpFile = GrammarUtils.createTempFileWithCode(code);
          return [tmpFile];
        }
      }
    },
    'Babel ES6 JavaScript': {
      "Selection Based": {
        command: "babel-node",
        args: function(context) {
          return ['-e', context.getCode()];
        }
      },
      "File Based": {
        command: "babel-node",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    'Bash Automated Test System (Bats)': {
      "File Based": {
        command: "bats",
        args: function(context) {
          return [context.filepath];
        }
      },
      "Selection Based": {
        command: 'bats',
        args: function(context) {
          var code, tmpFile;
          code = context.getCode(true);
          tmpFile = GrammarUtils.createTempFileWithCode(code);
          return [tmpFile];
        }
      }
    },
    Batch: {
      "File Based": {
        command: "cmd.exe",
        args: function(context) {
          return ['/q', '/c', context.filepath];
        }
      }
    },
    'Behat Feature': {
      "File Based": {
        command: "behat",
        args: function(context) {
          return [context.filepath];
        }
      },
      "Line Number Based": {
        command: "behat",
        args: function(context) {
          return [context.fileColonLine()];
        }
      }
    },
    BuckleScript: {
      "Selection Based": {
        command: "bsc",
        args: function(context) {
          var code, tmpFile;
          code = context.getCode();
          tmpFile = GrammarUtils.createTempFileWithCode(code);
          return ['-c', tmpFile];
        }
      },
      "File Based": {
        command: "bsc",
        args: function(context) {
          return ['-c', context.filepath];
        }
      }
    },
    C: {
      "File Based": {
        command: "bash",
        args: function(context) {
          var args;
          args = [];
          if (GrammarUtils.OperatingSystem.isDarwin()) {
            args = ['-c', "xcrun clang -fcolor-diagnostics -Wall -include stdio.h '" + context.filepath + "' -o /tmp/c.out && /tmp/c.out"];
          } else if (GrammarUtils.OperatingSystem.isLinux()) {
            args = ["-c", "cc -Wall -include stdio.h '" + context.filepath + "' -o /tmp/c.out && /tmp/c.out"];
          }
          return args;
        }
      },
      "Selection Based": {
        command: "bash",
        args: function(context) {
          var args, code, tmpFile;
          code = context.getCode(true);
          tmpFile = GrammarUtils.createTempFileWithCode(code, ".c");
          args = [];
          if (GrammarUtils.OperatingSystem.isDarwin()) {
            args = ['-c', "xcrun clang -fcolor-diagnostics -Wall -include stdio.h '" + tmpFile + "' -o /tmp/c.out && /tmp/c.out"];
          } else if (GrammarUtils.OperatingSystem.isLinux()) {
            args = ["-c", "cc -Wall -include stdio.h '" + tmpFile + "' -o /tmp/c.out && /tmp/c.out"];
          }
          return args;
        }
      }
    },
    'C#': {
      "File Based": {
        command: GrammarUtils.OperatingSystem.isWindows() ? "cmd" : "bash",
        args: function(context) {
          var args, progname;
          progname = context.filename.replace(/\.cs$/, "");
          args = [];
          if (GrammarUtils.OperatingSystem.isWindows()) {
            args = ["/c csc " + context.filepath + " && " + progname + ".exe"];
          } else {
            args = ['-c', "csc " + context.filepath + " && mono " + progname + ".exe"];
          }
          return args;
        }
      },
      "Selection Based": {
        command: GrammarUtils.OperatingSystem.isWindows() ? "cmd" : "bash",
        args: function(context) {
          var args, code, progname, tmpFile;
          code = context.getCode(true);
          tmpFile = GrammarUtils.createTempFileWithCode(code, ".cs");
          progname = tmpFile.replace(/\.cs$/, "");
          args = [];
          if (GrammarUtils.OperatingSystem.isWindows()) {
            args = ["/c csc /out:" + progname + ".exe " + tmpFile + " && " + progname + ".exe"];
          } else {
            args = ['-c', "csc /out:" + progname + ".exe " + tmpFile + " && mono " + progname + ".exe"];
          }
          return args;
        }
      }
    },
    'C# Script File': {
      "File Based": {
        command: "scriptcs",
        args: function(context) {
          return ['-script', context.filepath];
        }
      },
      "Selection Based": {
        command: "scriptcs",
        args: function(context) {
          var code, tmpFile;
          code = context.getCode(true);
          tmpFile = GrammarUtils.createTempFileWithCode(code, ".csx");
          return ['-script', tmpFile];
        }
      }
    },
    'C++': GrammarUtils.OperatingSystem.isDarwin() ? {
      "Selection Based": {
        command: "bash",
        args: function(context) {
          var code, tmpFile;
          code = context.getCode(true);
          tmpFile = GrammarUtils.createTempFileWithCode(code, ".cpp");
          return ["-c", "xcrun clang++ -fcolor-diagnostics -std=c++14 -Wall -include stdio.h -include iostream '" + tmpFile + "' -o /tmp/cpp.out && /tmp/cpp.out"];
        }
      },
      "File Based": {
        command: "bash",
        args: function(context) {
          return ['-c', "xcrun clang++ -fcolor-diagnostics -std=c++14 -Wall -include stdio.h -include iostream '" + context.filepath + "' -o /tmp/cpp.out && /tmp/cpp.out"];
        }
      }
    } : GrammarUtils.OperatingSystem.isLinux() ? {
      "Selection Based": {
        command: "bash",
        args: function(context) {
          var code, tmpFile;
          code = context.getCode(true);
          tmpFile = GrammarUtils.createTempFileWithCode(code, ".cpp");
          return ["-c", "g++ -std=c++14 -Wall -include stdio.h -include iostream '" + tmpFile + "' -o /tmp/cpp.out && /tmp/cpp.out"];
        }
      },
      "File Based": {
        command: "bash",
        args: function(context) {
          return ["-c", "g++ -std=c++14 -Wall -include stdio.h -include iostream '" + context.filepath + "' -o /tmp/cpp.out && /tmp/cpp.out"];
        }
      }
    } : GrammarUtils.OperatingSystem.isWindows() && GrammarUtils.OperatingSystem.release().split(".").slice(-1 >= '14399') ? {
      "File Based": {
        command: "bash",
        args: function(context) {
          return ["-c", "g++ -std=c++14 -Wall -include stdio.h -include iostream '/mnt/" + path.posix.join.apply(path.posix, [].concat([context.filepath.split(path.win32.sep)[0].toLowerCase()], context.filepath.split(path.win32.sep).slice(1))).replace(":", "") + "' -o /tmp/cpp.out && /tmp/cpp.out"];
        }
      }
    } : void 0,
    'C++14': GrammarUtils.OperatingSystem.isDarwin() ? {
      "Selection Based": {
        command: "bash",
        args: function(context) {
          var code, tmpFile;
          code = context.getCode(true);
          tmpFile = GrammarUtils.createTempFileWithCode(code, ".cpp");
          return ["-c", "xcrun clang++ -fcolor-diagnostics -std=c++14 -Wall -include stdio.h -include iostream '" + tmpFile + "' -o /tmp/cpp.out && /tmp/cpp.out"];
        }
      },
      "File Based": {
        command: "bash",
        args: function(context) {
          return ['-c', "xcrun clang++ -fcolor-diagnostics -std=c++14 -Wall -include stdio.h -include iostream '" + context.filepath + "' -o /tmp/cpp.out && /tmp/cpp.out"];
        }
      }
    } : GrammarUtils.OperatingSystem.isLinux() ? {
      "Selection Based": {
        command: "bash",
        args: function(context) {
          var code, tmpFile;
          code = context.getCode(true);
          tmpFile = GrammarUtils.createTempFileWithCode(code, ".cpp");
          return ["-c", "g++ -std=c++14 -Wall -include stdio.h -include iostream '" + tmpFile + "' -o /tmp/cpp.out && /tmp/cpp.out"];
        }
      },
      "File Based": {
        command: "bash",
        args: function(context) {
          return ["-c", "g++ -std=c++14 -Wall -include stdio.h -include iostream '" + context.filepath + "' -o /tmp/cpp.out && /tmp/cpp.out"];
        }
      }
    } : GrammarUtils.OperatingSystem.isWindows() && GrammarUtils.OperatingSystem.release().split(".").slice(-1 >= '14399') ? {
      "File Based": {
        command: "bash",
        args: function(context) {
          return ["-c", "g++ -std=c++14 -Wall -include stdio.h -include iostream '/mnt/" + path.posix.join.apply(path.posix, [].concat([context.filepath.split(path.win32.sep)[0].toLowerCase()], context.filepath.split(path.win32.sep).slice(1))).replace(":", "") + "' -o /tmp/cpp.out && /tmp/cpp.out"];
        }
      }
    } : void 0,
    Clojure: {
      "Selection Based": {
        command: "lein",
        args: function(context) {
          return ['exec', '-e', context.getCode()];
        }
      },
      "File Based": {
        command: "lein",
        args: function(context) {
          return ['exec', context.filepath];
        }
      }
    },
    CoffeeScript: {
      "Selection Based": {
        command: "coffee",
        args: function(context) {
          return GrammarUtils.CScompiler.args.concat([context.getCode()]);
        }
      },
      "File Based": {
        command: "coffee",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    "CoffeeScript (Literate)": {
      'Selection Based': {
        command: 'coffee',
        args: function(context) {
          return GrammarUtils.CScompiler.args.concat([context.getCode()]);
        }
      },
      'File Based': {
        command: 'coffee',
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    "Common Lisp": {
      "File Based": {
        command: "clisp",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    Crystal: {
      "Selection Based": {
        command: "crystal",
        args: function(context) {
          return ['eval', context.getCode()];
        }
      },
      "File Based": {
        command: "crystal",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    D: {
      "Selection Based": {
        command: "rdmd",
        args: function(context) {
          var code, tmpFile;
          code = context.getCode(true);
          tmpFile = GrammarUtils.D.createTempFileWithCode(code);
          return [tmpFile];
        }
      },
      "File Based": {
        command: "rdmd",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    Dart: {
      "Selection Based": {
        command: "dart",
        args: function(context) {
          var code, tmpFile;
          code = context.getCode(true);
          tmpFile = GrammarUtils.createTempFileWithCode(code, ".dart");
          return [tmpFile];
        }
      },
      "File Based": {
        command: "dart",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    "Graphviz (DOT)": {
      "Selection Based": {
        command: "dot",
        args: function(context) {
          var code, tmpFile;
          code = context.getCode(true);
          tmpFile = GrammarUtils.createTempFileWithCode(code, ".dot");
          return ['-Tpng', tmpFile, '-o', tmpFile + '.png'];
        }
      },
      "File Based": {
        command: "dot",
        args: function(context) {
          return ['-Tpng', context.filepath, '-o', context.filepath + '.png'];
        }
      }
    },
    DOT: {
      "Selection Based": {
        command: "dot",
        args: function(context) {
          var code, tmpFile;
          code = context.getCode(true);
          tmpFile = GrammarUtils.createTempFileWithCode(code, ".dot");
          return ['-Tpng', tmpFile, '-o', tmpFile + '.png'];
        }
      },
      "File Based": {
        command: "dot",
        args: function(context) {
          return ['-Tpng', context.filepath, '-o', context.filepath + '.png'];
        }
      }
    },
    Elixir: {
      "Selection Based": {
        command: "elixir",
        args: function(context) {
          return ['-e', context.getCode()];
        }
      },
      "File Based": {
        command: "elixir",
        args: function(context) {
          return ['-r', context.filepath];
        }
      }
    },
    Erlang: {
      "Selection Based": {
        command: "erl",
        args: function(context) {
          return ['-noshell', '-eval', (context.getCode()) + ", init:stop()."];
        }
      }
    },
    'F#': {
      "File Based": {
        command: GrammarUtils.OperatingSystem.isWindows() ? "fsi" : "fsharpi",
        args: function(context) {
          return ['--exec', context.filepath];
        }
      }
    },
    'F*': {
      "File Based": {
        command: "fstar",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    Fable: {
      "Selection Based": {
        command: "fable",
        args: function(context) {
          var code, tmpFile;
          code = context.getCode();
          tmpFile = GrammarUtils.createTempFileWithCode(code);
          return [tmpFile];
        }
      },
      "File Based": {
        command: "fable",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    Forth: {
      "File Based": {
        command: "gforth",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    "Fortran - Fixed Form": {
      "File Based": {
        command: "bash",
        args: function(context) {
          return ['-c', "gfortran '" + context.filepath + "' -ffixed-form -o /tmp/f.out && /tmp/f.out"];
        }
      }
    },
    "Fortran - Free Form": {
      "File Based": {
        command: "bash",
        args: function(context) {
          return ['-c', "gfortran '" + context.filepath + "' -ffree-form -o /tmp/f90.out && /tmp/f90.out"];
        }
      }
    },
    "Fortran - Modern": {
      "File Based": {
        command: "bash",
        args: function(context) {
          return ['-c', "gfortran '" + context.filepath + "' -ffree-form -o /tmp/f90.out && /tmp/f90.out"];
        }
      }
    },
    "Fortran - Punchcard": {
      "File Based": {
        command: "bash",
        args: function(context) {
          return ['-c', "gfortran '" + context.filepath + "' -ffixed-form -o /tmp/f.out && /tmp/f.out"];
        }
      }
    },
    Gherkin: {
      "File Based": {
        command: "cucumber",
        args: function(context) {
          return ['--color', context.filepath];
        }
      },
      "Line Number Based": {
        command: "cucumber",
        args: function(context) {
          return ['--color', context.fileColonLine()];
        }
      }
    },
    gnuplot: {
      "File Based": {
        command: "gnuplot",
        args: function(context) {
          return ['-p', context.filepath];
        },
        workingDirectory: (ref = atom.workspace.getActivePaneItem()) != null ? (ref1 = ref.buffer) != null ? (ref2 = ref1.file) != null ? typeof ref2.getParent === "function" ? typeof (base = ref2.getParent()).getPath === "function" ? base.getPath() : void 0 : void 0 : void 0 : void 0 : void 0
      }
    },
    Go: {
      "File Based": {
        command: "go",
        args: function(context) {
          if (context.filepath.match(/_test.go/)) {
            return ['test', ''];
          } else {
            return ['run', context.filepath];
          }
        },
        workingDirectory: (ref3 = atom.workspace.getActivePaneItem()) != null ? (ref4 = ref3.buffer) != null ? (ref5 = ref4.file) != null ? typeof ref5.getParent === "function" ? typeof (base1 = ref5.getParent()).getPath === "function" ? base1.getPath() : void 0 : void 0 : void 0 : void 0 : void 0
      }
    },
    Groovy: {
      "Selection Based": {
        command: "groovy",
        args: function(context) {
          return ['-e', context.getCode()];
        }
      },
      "File Based": {
        command: "groovy",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    Haskell: {
      "File Based": {
        command: "runhaskell",
        args: function(context) {
          return [context.filepath];
        }
      },
      "Selection Based": {
        command: "ghc",
        args: function(context) {
          return ['-e', context.getCode()];
        }
      }
    },
    Hy: {
      "File Based": {
        command: "hy",
        args: function(context) {
          return [context.filepath];
        }
      },
      "Selection Based": {
        command: "hy",
        args: function(context) {
          var code, tmpFile;
          code = context.getCode(true);
          tmpFile = GrammarUtils.createTempFileWithCode(code, ".hy");
          return [tmpFile];
        }
      }
    },
    IcedCoffeeScript: {
      "Selection Based": {
        command: "iced",
        args: function(context) {
          return ['-e', context.getCode()];
        }
      },
      "File Based": {
        command: "iced",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    Idris: {
      "File Based": {
        command: "idris",
        args: function(context) {
          return [context.filepath, '-o', path.basename(context.filepath, path.extname(context.filepath))];
        }
      }
    },
    InnoSetup: {
      "File Based": {
        command: "ISCC.exe",
        args: function(context) {
          return ['/Q', context.filepath];
        }
      }
    },
    ioLanguage: {
      "Selection Based": {
        command: "io",
        args: function(context) {
          return [context.getCode()];
        }
      },
      "File Based": {
        command: "io",
        args: function(context) {
          return ['-e', context.filepath];
        }
      }
    },
    Java: {
      "File Based": {
        command: GrammarUtils.OperatingSystem.isWindows() ? "cmd" : "bash",
        args: function(context) {
          var args, className, classPackages, sourcePath;
          className = GrammarUtils.Java.getClassName(context);
          classPackages = GrammarUtils.Java.getClassPackage(context);
          sourcePath = GrammarUtils.Java.getProjectPath(context);
          args = [];
          if (GrammarUtils.OperatingSystem.isWindows()) {
            args = ["/c javac -Xlint " + context.filename + " && java " + className];
          } else {
            args = ['-c', "javac -sourcepath " + sourcePath + " -d /tmp '" + context.filepath + "' && java -cp /tmp " + classPackages + className];
          }
          return args;
        }
      }
    },
    JavaScript: {
      "Selection Based": {
        command: "node",
        args: function(context) {
          return ['-e', context.getCode()];
        }
      },
      "File Based": {
        command: "node",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    'JavaScript with JSX': {
      "Selection Based": {
        command: "node",
        args: function(context) {
          return ['-e', context.getCode()];
        }
      },
      "File Based": {
        command: "node",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    "JavaScript for Automation (JXA)": {
      "Selection Based": {
        command: "osascript",
        args: function(context) {
          return ['-l', 'JavaScript', '-e', context.getCode()];
        }
      },
      "File Based": {
        command: "osascript",
        args: function(context) {
          return ['-l', 'JavaScript', context.filepath];
        }
      }
    },
    Jolie: {
      "File Based": {
        command: "jolie",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    Julia: {
      "Selection Based": {
        command: "julia",
        args: function(context) {
          return ['-e', context.getCode()];
        }
      },
      "File Based": {
        command: "julia",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    Kotlin: {
      "Selection Based": {
        command: "bash",
        args: function(context) {
          var args, code, jarName, tmpFile;
          code = context.getCode(true);
          tmpFile = GrammarUtils.createTempFileWithCode(code, ".kt");
          jarName = tmpFile.replace(/\.kt$/, ".jar");
          args = ['-c', "kotlinc " + tmpFile + " -include-runtime -d " + jarName + " && java -jar " + jarName];
          return args;
        }
      },
      "File Based": {
        command: "bash",
        args: function(context) {
          var args, jarName;
          jarName = context.filename.replace(/\.kt$/, ".jar");
          args = ['-c', "kotlinc " + context.filepath + " -include-runtime -d /tmp/" + jarName + " && java -jar /tmp/" + jarName];
          return args;
        }
      }
    },
    LAMMPS: GrammarUtils.OperatingSystem.isDarwin() || GrammarUtils.OperatingSystem.isLinux() ? {
      "File Based": {
        command: "lammps",
        args: function(context) {
          return ['-log', 'none', '-in', context.filepath];
        }
      }
    } : void 0,
    LaTeX: {
      "File Based": {
        command: "latexmk",
        args: function(context) {
          return ['-cd', '-quiet', '-pdf', '-pv', '-shell-escape', context.filepath];
        }
      }
    },
    'LaTeX Beamer': {
      "File Based": {
        command: "latexmk",
        args: function(context) {
          return ['-cd', '-quiet', '-pdf', '-pv', '-shell-escape', context.filepath];
        }
      }
    },
    LilyPond: {
      "File Based": {
        command: "lilypond",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    Lisp: {
      "Selection Based": {
        command: "sbcl",
        args: function(context) {
          var args, statements;
          statements = _.flatten(_.map(GrammarUtils.Lisp.splitStatements(context.getCode()), function(statement) {
            return ['--eval', statement];
          }));
          args = _.union(['--noinform', '--disable-debugger', '--non-interactive', '--quit'], statements);
          return args;
        }
      },
      "File Based": {
        command: "sbcl",
        args: function(context) {
          return ['--noinform', '--script', context.filepath];
        }
      }
    },
    'Literate Haskell': {
      "File Based": {
        command: "runhaskell",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    LiveScript: {
      "Selection Based": {
        command: "lsc",
        args: function(context) {
          return ['-e', context.getCode()];
        }
      },
      "File Based": {
        command: "lsc",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    Lua: {
      "Selection Based": {
        command: "lua",
        args: function(context) {
          var code, tmpFile;
          code = context.getCode(true);
          tmpFile = GrammarUtils.createTempFileWithCode(code);
          return [tmpFile];
        }
      },
      "File Based": {
        command: "lua",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    'Lua (WoW)': {
      "Selection Based": {
        command: "lua",
        args: function(context) {
          var code, tmpFile;
          code = context.getCode(true);
          tmpFile = GrammarUtils.createTempFileWithCode(code);
          return [tmpFile];
        }
      },
      "File Based": {
        command: "lua",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    Makefile: {
      "Selection Based": {
        command: "bash",
        args: function(context) {
          return ['-c', context.getCode()];
        }
      },
      "File Based": {
        command: "make",
        args: function(context) {
          return ['-f', context.filepath];
        }
      }
    },
    MagicPython: {
      "Selection Based": {
        command: "python",
        args: function(context) {
          return ['-u', '-c', context.getCode()];
        }
      },
      "File Based": {
        command: "python",
        args: function(context) {
          return ['-u', context.filepath];
        }
      }
    },
    MATLAB: {
      "Selection Based": {
        command: "matlab",
        args: function(context) {
          var code, tmpFile;
          code = context.getCode();
          tmpFile = GrammarUtils.MATLAB.createTempFileWithCode(code);
          return ['-nodesktop', '-nosplash', '-r', "try, run('" + tmpFile + "');while ~isempty(get(0,'Children')); pause(0.5); end; catch ME; disp(ME.message); exit(1); end; exit(0);"];
        }
      },
      "File Based": {
        command: "matlab",
        args: function(context) {
          return ['-nodesktop', '-nosplash', '-r', "try run('" + context.filepath + "');while ~isempty(get(0,'Children')); pause(0.5); end; catch ME; disp(ME.message); exit(1); end; exit(0);"];
        }
      }
    },
    'MIPS Assembler': {
      "File Based": {
        command: "spim",
        args: function(context) {
          return ['-f', context.filepath];
        }
      }
    },
    MoonScript: {
      "Selection Based": {
        command: "moon",
        args: function(context) {
          return ['-e', context.getCode()];
        }
      },
      "File Based": {
        command: "moon",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    'mongoDB (JavaScript)': {
      "Selection Based": {
        command: "mongo",
        args: function(context) {
          return ['--eval', context.getCode()];
        }
      },
      "File Based": {
        command: "mongo",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    NCL: {
      "Selection Based": {
        command: "ncl",
        args: function(context) {
          var code, tmpFile;
          code = context.getCode(true);
          code = code + "\nexit";
          tmpFile = GrammarUtils.createTempFileWithCode(code);
          return [tmpFile];
        }
      },
      "File Based": {
        command: "ncl",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    newLISP: {
      "Selection Based": {
        command: "newlisp",
        args: function(context) {
          return ['-e', context.getCode()];
        }
      },
      "File Based": {
        command: "newlisp",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    Nim: {
      "File Based": {
        command: "bash",
        args: function(context) {
          var file;
          file = GrammarUtils.Nim.findNimProjectFile(context.filepath);
          path = GrammarUtils.Nim.projectDir(context.filepath);
          return ['-c', 'cd "' + path + '" && nim c --hints:off --parallelBuild:1 -r "' + file + '" 2>&1'];
        }
      }
    },
    NSIS: {
      "Selection Based": {
        command: "makensis",
        args: function(context) {
          var code, tmpFile;
          code = context.getCode();
          tmpFile = GrammarUtils.createTempFileWithCode(code);
          return [tmpFile];
        }
      },
      "File Based": {
        command: "makensis",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    'Objective-C': GrammarUtils.OperatingSystem.isDarwin() ? {
      "File Based": {
        command: "bash",
        args: function(context) {
          return ['-c', "xcrun clang -fcolor-diagnostics -Wall -include stdio.h -framework Cocoa " + context.filepath + " -o /tmp/objc-c.out && /tmp/objc-c.out"];
        }
      }
    } : void 0,
    'Objective-C++': GrammarUtils.OperatingSystem.isDarwin() ? {
      "File Based": {
        command: "bash",
        args: function(context) {
          return ['-c', "xcrun clang++ -fcolor-diagnostics -Wc++11-extensions -Wall -include stdio.h -include iostream -framework Cocoa " + context.filepath + " -o /tmp/objc-cpp.out && /tmp/objc-cpp.out"];
        }
      }
    } : void 0,
    OCaml: {
      "File Based": {
        command: "ocaml",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    Octave: {
      "Selection Based": {
        command: "octave",
        args: function(context) {
          return ['-p', context.filepath.replace(/[^\/]*$/, ''), '--eval', context.getCode()];
        }
      },
      "File Based": {
        command: "octave",
        args: function(context) {
          return ['-p', context.filepath.replace(/[^\/]*$/, ''), context.filepath];
        }
      }
    },
    Oz: {
      "Selection Based": {
        command: "ozc",
        args: function(context) {
          var code, tmpFile;
          code = context.getCode();
          tmpFile = GrammarUtils.createTempFileWithCode(code);
          return ['-c', tmpFile];
        }
      },
      "File Based": {
        command: "ozc",
        args: function(context) {
          return ['-c', context.filepath];
        }
      }
    },
    'Pandoc Markdown': {
      "File Based": {
        command: "panzer",
        args: function(context) {
          return [context.filepath, "--output=" + context.filepath + ".pdf"];
        }
      }
    },
    Perl: {
      "Selection Based": {
        command: "perl",
        args: function(context) {
          var code, file;
          code = context.getCode();
          file = GrammarUtils.Perl.createTempFileWithCode(code);
          return [file];
        }
      },
      "File Based": {
        command: "perl",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    "Perl 6": {
      "Selection Based": {
        command: "perl6",
        args: function(context) {
          return ['-e', context.getCode()];
        }
      },
      "File Based": {
        command: "perl6",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    "Perl 6 FE": {
      "Selection Based": {
        command: "perl6",
        args: function(context) {
          return ['-e', context.getCode()];
        }
      },
      "File Based": {
        command: "perl6",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    PHP: {
      "Selection Based": {
        command: "php",
        args: function(context) {
          var code, file;
          code = context.getCode();
          file = GrammarUtils.PHP.createTempFileWithCode(code);
          return [file];
        }
      },
      "File Based": {
        command: "php",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    PowerShell: {
      "Selection Based": {
        command: "powershell",
        args: function(context) {
          return [context.getCode()];
        }
      },
      "File Based": {
        command: "powershell",
        args: function(context) {
          return [context.filepath.replace(/\ /g, "` ")];
        }
      }
    },
    Processing: {
      "File Based": {
        command: GrammarUtils.OperatingSystem.isWindows() ? "cmd" : "bash",
        args: function(context) {
          if (GrammarUtils.OperatingSystem.isWindows()) {
            return ['/c processing-java --sketch=' + context.filepath.replace("\\" + context.filename, "") + ' --run'];
          } else {
            return ['-c', 'processing-java --sketch=' + context.filepath.replace("/" + context.filename, "") + ' --run'];
          }
        }
      }
    },
    Prolog: {
      "File Based": {
        command: "bash",
        args: function(context) {
          return ['-c', 'cd \"' + context.filepath.replace(/[^\/]*$/, '') + '\"; swipl -f \"' + context.filepath + '\" -t main --quiet'];
        }
      }
    },
    PureScript: {
      "File Based": {
        command: GrammarUtils.OperatingSystem.isWindows() ? "cmd" : "bash",
        args: function(context) {
          if (GrammarUtils.OperatingSystem.isWindows()) {
            return ['/c cd "' + context.filepath.replace(/[^\/]*$/, '') + '" && pulp run'];
          } else {
            return ['-c', 'cd "' + context.filepath.replace(/[^\/]*$/, '') + '" && pulp run'];
          }
        }
      }
    },
    Python: {
      "Selection Based": {
        command: "python",
        args: function(context) {
          return ['-u', '-c', context.getCode()];
        }
      },
      "File Based": {
        command: "python",
        args: function(context) {
          return ['-u', context.filepath];
        }
      }
    },
    R: {
      "Selection Based": {
        command: "Rscript",
        args: function(context) {
          var code, file;
          code = context.getCode();
          file = GrammarUtils.R.createTempFileWithCode(code);
          return [file];
        }
      },
      "File Based": {
        command: "Rscript",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    Racket: {
      "Selection Based": {
        command: "racket",
        args: function(context) {
          return ['-e', context.getCode()];
        }
      },
      "File Based": {
        command: "racket",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    RANT: {
      "Selection Based": {
        command: "RantConsole.exe",
        args: function(context) {
          var code, tmpFile;
          code = context.getCode(true);
          tmpFile = GrammarUtils.createTempFileWithCode(code);
          return ['-file', tmpFile];
        }
      },
      "File Based": {
        command: "RantConsole.exe",
        args: function(context) {
          return ['-file', context.filepath];
        }
      }
    },
    Reason: {
      "File Based": {
        command: GrammarUtils.OperatingSystem.isWindows() ? "cmd" : "bash",
        args: function(context) {
          var args, progname;
          progname = context.filename.replace(/\.re$/, "");
          args = [];
          if (GrammarUtils.OperatingSystem.isWindows()) {
            args = ["/c rebuild " + progname + ".native && " + progname + ".native"];
          } else {
            args = ['-c', "rebuild '" + progname + ".native' && '" + progname + ".native'"];
          }
          return args;
        }
      }
    },
    "Ren'Py": {
      "File Based": {
        command: "renpy",
        args: function(context) {
          return [context.filepath.substr(0, context.filepath.lastIndexOf("/game"))];
        }
      }
    },
    'Robot Framework': {
      "File Based": {
        command: 'robot',
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    RSpec: {
      "Selection Based": {
        command: "ruby",
        args: function(context) {
          return ['-e', context.getCode()];
        }
      },
      "File Based": {
        command: "rspec",
        args: function(context) {
          return ['--tty', '--color', context.filepath];
        }
      },
      "Line Number Based": {
        command: "rspec",
        args: function(context) {
          return ['--tty', '--color', context.fileColonLine()];
        }
      }
    },
    Ruby: {
      "Selection Based": {
        command: "ruby",
        args: function(context) {
          return ['-e', context.getCode()];
        }
      },
      "File Based": {
        command: "ruby",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    'Ruby on Rails': {
      "Selection Based": {
        command: "rails",
        args: function(context) {
          return ['runner', context.getCode()];
        }
      },
      "File Based": {
        command: "rails",
        args: function(context) {
          return ['runner', context.filepath];
        }
      }
    },
    Rust: {
      "File Based": {
        command: GrammarUtils.OperatingSystem.isWindows() ? "cmd" : "bash",
        args: function(context) {
          var args, progname;
          progname = context.filename.replace(/\.rs$/, "");
          args = [];
          if (GrammarUtils.OperatingSystem.isWindows()) {
            args = ["/c rustc " + context.filepath + " && " + progname + ".exe"];
          } else {
            args = ['-c', "rustc '" + context.filepath + "' -o /tmp/rs.out && /tmp/rs.out"];
          }
          return args;
        }
      }
    },
    Sage: {
      "Selection Based": {
        command: "sage",
        args: function(context) {
          return ['-c', context.getCode()];
        }
      },
      "File Based": {
        command: "sage",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    Sass: {
      "File Based": {
        command: "sass",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    Scala: {
      "Selection Based": {
        command: "scala",
        args: function(context) {
          return ['-e', context.getCode()];
        }
      },
      "File Based": {
        command: "scala",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    Scheme: {
      "Selection Based": {
        command: "guile",
        args: function(context) {
          return ['-c', context.getCode()];
        }
      },
      "File Based": {
        command: "guile",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    SCSS: {
      "File Based": {
        command: "sass",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    "Shell Script": {
      "Selection Based": {
        command: process.env.SHELL,
        args: function(context) {
          return ['-c', context.getCode()];
        }
      },
      "File Based": {
        command: process.env.SHELL,
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    "Shell Script (Fish)": {
      "Selection Based": {
        command: "fish",
        args: function(context) {
          return ['-c', context.getCode()];
        }
      },
      "File Based": {
        command: "fish",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    "SQL": {
      "Selection Based": {
        command: "echo",
        args: function(context) {
          return ['SQL requires setting \'Script: Run Options\' directly. See https://github.com/rgbkrk/atom-script/tree/master/examples/hello.sql for further information.'];
        }
      },
      "File Based": {
        command: "echo",
        args: function(context) {
          return ['SQL requires setting \'Script: Run Options\' directly. See https://github.com/rgbkrk/atom-script/tree/master/examples/hello.sql for further information.'];
        }
      }
    },
    "SQL (PostgreSQL)": {
      "Selection Based": {
        command: "psql",
        args: function(context) {
          return ['-c', context.getCode()];
        }
      },
      "File Based": {
        command: "psql",
        args: function(context) {
          return ['-f', context.filepath];
        }
      }
    },
    "Standard ML": {
      "File Based": {
        command: "sml",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    Stata: {
      "Selection Based": {
        command: "stata",
        args: function(context) {
          return ['do', context.getCode()];
        }
      },
      "File Based": {
        command: "stata",
        args: function(context) {
          return ['do', context.filepath];
        }
      }
    },
    Swift: {
      "File Based": {
        command: "swift",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    Tcl: {
      "Selection Based": {
        command: "tclsh",
        args: function(context) {
          var code, tmpFile;
          code = context.getCode();
          tmpFile = GrammarUtils.createTempFileWithCode(code);
          return [tmpFile];
        }
      },
      "File Based": {
        command: "tclsh",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    Turing: {
      "File Based": {
        command: "turing",
        args: function(context) {
          return ['-run', context.filepath];
        }
      }
    },
    TypeScript: {
      "Selection Based": {
        command: "ts-node",
        args: function(context) {
          return ['-e', context.getCode()];
        }
      },
      "File Based": {
        command: "ts-node",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    VBScript: {
      'Selection Based': {
        command: 'cscript',
        args: function(context) {
          var code, tmpFile;
          code = context.getCode();
          tmpFile = GrammarUtils.createTempFileWithCode(code, ".vbs");
          return ['//NOLOGO', tmpFile];
        }
      },
      'File Based': {
        command: 'cscript',
        args: function(context) {
          return ['//NOLOGO', context.filepath];
        }
      }
    },
    HTML: {
      "File Based": {
        command: 'echo',
        args: function(context) {
          var uri;
          uri = 'file://' + context.filepath;
          shell.openExternal(uri);
          return ['HTML file opened at:', uri];
        }
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYmlsbHkvLmF0b20vcGFja2FnZXMvc2NyaXB0L2xpYi9ncmFtbWFycy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBR0E7QUFBQSxNQUFBOztFQUFBLENBQUEsR0FBSSxPQUFBLENBQVEsWUFBUjs7RUFDSixJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7O0VBQ1AsWUFBQSxHQUFlLE9BQUEsQ0FBUSxzQkFBUjs7RUFDZixLQUFBLEdBQVEsT0FBQSxDQUFRLFVBQVIsQ0FBbUIsQ0FBQzs7RUFFNUIsTUFBTSxDQUFDLE9BQVAsR0FDRTtJQUFBLFVBQUEsRUFDRTtNQUFBLFlBQUEsRUFDRTtRQUFBLE9BQUEsRUFBUyxTQUFUO1FBQ0EsSUFBQSxFQUFNLFNBQUMsT0FBRDtpQkFBYSxDQUFDLGlCQUFELEVBQW9CLE9BQU8sQ0FBQyxRQUE1QjtRQUFiLENBRE47T0FERjtLQURGO0lBS0EsT0FBQSxFQUNFO01BQUEsWUFBQSxFQUNFO1FBQUEsT0FBQSxFQUFTLGtCQUFUO1FBQ0EsSUFBQSxFQUFNLFNBQUMsT0FBRDtpQkFBYSxDQUFDLE9BQU8sQ0FBQyxRQUFUO1FBQWIsQ0FETjtPQURGO0tBTkY7SUFVQSxXQUFBLEVBQ0U7TUFBQSxpQkFBQSxFQUNFO1FBQUEsT0FBQSxFQUFTLFdBQVQ7UUFDQSxJQUFBLEVBQU0sU0FBQyxPQUFEO2lCQUFjLENBQUMsSUFBRCxFQUFPLE9BQU8sQ0FBQyxPQUFSLENBQUEsQ0FBUDtRQUFkLENBRE47T0FERjtNQUdBLFlBQUEsRUFDRTtRQUFBLE9BQUEsRUFBUyxXQUFUO1FBQ0EsSUFBQSxFQUFNLFNBQUMsT0FBRDtpQkFBYSxDQUFDLE9BQU8sQ0FBQyxRQUFUO1FBQWIsQ0FETjtPQUpGO0tBWEY7SUFrQkEsVUFBQSxFQUNFO01BQUEsWUFBQSxFQUNFO1FBQUEsT0FBQSxFQUFTLFlBQVQ7UUFDQSxJQUFBLEVBQU0sU0FBQyxPQUFEO2lCQUFhLENBQUMsT0FBTyxD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LE9BQUEsRUFBUyxTQUFUO1FBQ0EsSUFBQSxFQUFNLFNBQUMsT0FBRDtBQUNKLGNBQUE7VUFBQSxJQUFBLEdBQU8sT0FBTyxDQUFDLE9BQVIsQ0FBQTtVQUNQLE9BQUEsR0FBVSxZQUFZLENBQUMsc0JBQWIsQ0FBb0MsSUFBcEMsRUFBMEMsTUFBMUM7aUJBQ1YsQ0FBQyxVQUFELEVBQVksT0FBWjtRQUhJLENBRE47T0FERjtNQU1BLFlBQUEsRUFDRTtRQUFBLE9BQUEsRUFBUyxTQUFUO1FBQ0EsSUFBQSxFQUFNLFNBQUMsT0FBRDtpQkFBYSxDQUFDLFVBQUQsRUFBYSxPQUFPLENBQUMsUUFBckI7UUFBYixDQUROO09BUEY7S0EzNkJGO0lBcTdCQSxJQUFBLEVBQ0U7TUFBQSxZQUFBLEVBQ0U7UUFBQSxPQUFBLEVBQVMsTUFBVDtRQUNBLElBQUEsRUFBTSxTQUFDLE9BQUQ7QUFDSixjQUFBO1VBQUEsR0FBQSxHQUFNLFNBQUEsR0FBWSxPQUFPLENBQUM7VUFDMUIsS0FBSyxDQUFDLFlBQU4sQ0FBbUIsR0FBbkI7aUJBQ0EsQ0FBQyxzQkFBRCxFQUF5QixHQUF6QjtRQUhJLENBRE47T0FERjtLQXQ3QkY7O0FBTkYiLCJzb3VyY2VzQ29udGVudCI6WyIjIE1hcHMgQXRvbSBHcmFtbWFyIG5hbWVzIHRvIHRoZSBjb21tYW5kIHVzZWQgYnkgdGhhdCBsYW5ndWFnZVxuIyBBcyB3ZWxsIGFzIGFueSBzcGVjaWFsIHNldHVwIGZvciBhcmd1bWVudHMuXG5cbl8gPSByZXF1aXJlICd1bmRlcnNjb3JlJ1xucGF0aCA9IHJlcXVpcmUgJ3BhdGgnXG5HcmFtbWFyVXRpbHMgPSByZXF1aXJlICcuLi9saWIvZ3JhbW1hci11dGlscydcbnNoZWxsID0gcmVxdWlyZSgnZWxlY3Ryb24nKS5zaGVsbFxuXG5tb2R1bGUuZXhwb3J0cyA9XG4gICcxQyAoQlNMKSc6XG4gICAgJ0ZpbGUgQmFzZWQnOlxuICAgICAgY29tbWFuZDogXCJvc2NyaXB0XCJcbiAgICAgIGFyZ3M6IChjb250ZXh0KSAtPiBbJy1lbmNvZGluZz11dGYtOCcsIGNvbnRleHQuZmlsZXBhdGhdXG5cbiAgQW5zaWJsZTpcbiAgICBcIkZpbGUgQmFzZWRcIjpcbiAgICAgIGNvbW1hbmQ6IFwiYW5zaWJsZS1wbGF5Ym9va1wiXG4gICAgICBhcmdzOiAoY29udGV4dCkgLT4gW2NvbnRleHQuZmlsZXBhdGhdXG5cbiAgQXBwbGVTY3JpcHQ6XG4gICAgJ1NlbGVjdGlvbiBCYXNlZCc6XG4gICAgICBjb21tYW5kOiAnb3Nhc2NyaXB0J1xuICAgICAgYXJnczogKGNvbnRleHQpICAtPiBbJy1lJywgY29udGV4dC5nZXRDb2RlKCldXG4gICAgJ0ZpbGUgQmFzZWQnOlxuICAgICAgY29tbWFuZDogJ29zYXNjcmlwdCdcbiAgICAgIGFyZ3M6IChjb250ZXh0KSAtPiBbY29udGV4dC5maWxlcGF0aF1cblxuICBBdXRvSG90S2V5OlxuICAgIFwiRmlsZSBCYXNlZFwiOlxuICAgICAgY29tbWFuZDogXCJBdXRvSG90S2V5XCJcbiAgICAgIGFyZ3M6IChjb250ZXh0KSAtPiBbY29udGV4dC5maWxlcGF0aF1cbiAgICBcIlNlbGVjdGlvbiBCYXNlZFwiOlxuICAgICAgY29tbWFuZDogXCJBdXRvSG90S2V5XCJcbiAgICAgIGFyZ3M6IChjb250ZXh0KSAtPlxuICAgICAgICBjb2RlID0gY29udGV4dC5nZXRDb2RlKHRydWUpXG4gICAgICAgIHRtcEZpbGUgPSBHcmFtbWFyVXRpbHMuY3JlYXRlVGVtcEZpbGVXaXRoQ29kZShjb2RlKVxuICAgICAgICBbdG1wRmlsZV1cblxuICAnQmFiZWwgRVM2IEphdmFTY3JpcHQnOlxuICAgIFwiU2VsZWN0aW9uIEJhc2VkXCI6XG4gICAgICBjb21tYW5kOiBcImJhYmVsLW5vZGVcIlxuICAgICAgYXJnczogKGNvbnRleHQpIC0+IFsnLWUnLCBjb250ZXh0LmdldENvZGUoKV1cbiAgICBcIkZpbGUgQmFzZWRcIjpcbiAgICAgIGNvbW1hbmQ6IFwiYmFiZWwtbm9kZVwiXG4gICAgICBhcmdzOiAoY29udGV4dCkgLT4gW2NvbnRleHQuZmlsZXBhdGhdXG5cbiAgJ0Jhc2ggQXV0b21hdGVkIFRlc3QgU3lzdGVtIChCYXRzKSc6XG4gICAgXCJGaWxlIEJhc2VkXCI6XG4gICAgICBjb21tYW5kOiBcImJhdHNcIlxuICAgICAgYXJnczogKGNvbnRleHQpIC0+IFtjb250ZXh0LmZpbGVwYXRoXVxuICAgIFwiU2VsZWN0aW9uIEJhc2VkXCI6XG4gICAgICBjb21tYW5kOiAnYmF0cydcbiAgICAgIGFyZ3M6IChjb250ZXh0KSAtPlxuICAgICAgICBjb2RlID0gY29udGV4dC5nZXRDb2RlKHRydWUpXG4gICAgICAgIHRtcEZpbGUgPSBHcmFtbWFyVXRpbHMuY3JlYXRlVGVtcEZpbGVXaXRoQ29kZShjb2RlKVxuICAgICAgICBbdG1wRmlsZV1cblxuICBCYXRjaDpcbiAgICBcIkZpbGUgQmFzZWRcIjpcbiAgICAgIGNvbW1hbmQ6IFwiY21kLmV4ZVwiXG4gICAgICBhcmdzOiAoY29udGV4dCkgLT4gWycvcScsICcvYycsIGNvbnRleHQuZmlsZXBhdGhdXG5cbiAgJ0JlaGF0IEZlYXR1cmUnOlxuICAgIFwiRmlsZSBCYXNlZFwiOlxuICAgICAgY29tbWFuZDogXCJiZWhhdFwiXG4gICAgICBhcmdzOiAoY29udGV4dCkgLT4gW2NvbnRleHQuZmlsZXBhdGhdXG4gICAgXCJMaW5lIE51bWJlciBCYXNlZFwiOlxuICAgICAgY29tbWFuZDogXCJiZWhhdFwiXG4gICAgICBhcmdzOiAoY29udGV4dCkgLT4gW2NvbnRleHQuZmlsZUNvbG9uTGluZSgpXVxuXG4gIEJ1Y2tsZVNjcmlwdDpcbiAgICBcIlNlbGVjdGlvbiBCYXNlZFwiOlxuICAgICAgY29tbWFuZDogXCJic2NcIlxuICAgICAgYXJnczogKGNvbnRleHQpIC0+XG4gICAgICAgIGNvZGUgPSBjb250ZXh0LmdldENvZGUoKVxuICAgICAgICB0bXBGaWxlID0gR3JhbW1hclV0aWxzLmNyZWF0ZVRlbXBGaWxlV2l0aENvZGUoY29kZSlcbiAgICAgICAgWyctYycsIHRtcEZpbGVdXG4gICAgXCJGaWxlIEJhc2VkXCI6XG4gICAgICBjb21tYW5kOiBcImJzY1wiXG4gICAgICBhcmdzOiAoY29udGV4dCkgLT4gWyctYycsIGNvbnRleHQuZmlsZXBhdGhdXG5cbiAgQzpcbiAgICBcIkZpbGUgQmFzZWRcIjpcbiAgICAgIGNvbW1hbmQ6IFwiYmFzaFwiXG4gICAgICBhcmdzOiAoY29udGV4dCkgLT5cbiAgICAgICAgYXJncyA9IFtdXG4gICAgICAgIGlmIEdyYW1tYXJVdGlscy5PcGVyYXRpbmdTeXN0ZW0uaXNEYXJ3aW4oKVxuICAgICAgICAgIGFyZ3MgPSBbJy1jJywgXCJ4Y3J1biBjbGFuZyAtZmNvbG9yLWRpYWdub3N0aWNzIC1XYWxsIC1pbmNsdWRlIHN0ZGlvLmggJ1wiICsgY29udGV4dC5maWxlcGF0aCArIFwiJyAtbyAvdG1wL2Mub3V0ICYmIC90bXAvYy5vdXRcIl1cbiAgICAgICAgZWxzZSBpZiBHcmFtbWFyVXRpbHMuT3BlcmF0aW5nU3lzdGVtLmlzTGludXgoKVxuICAgICAgICAgIGFyZ3MgPSBbXCItY1wiLCBcImNjIC1XYWxsIC1pbmNsdWRlIHN0ZGlvLmggJ1wiICsgY29udGV4dC5maWxlcGF0aCArIFwiJyAtbyAvdG1wL2Mub3V0ICYmIC90bXAvYy5vdXRcIl1cbiAgICAgICAgcmV0dXJuIGFyZ3NcbiAgICBcIlNlbGVjdGlvbiBCYXNlZFwiOlxuICAgICAgY29tbWFuZDogXCJiYXNoXCJcbiAgICAgIGFyZ3M6IChjb250ZXh0KSAtPlxuICAgICAgICBjb2RlID0gY29udGV4dC5nZXRDb2RlKHRydWUpXG4gICAgICAgIHRtcEZpbGUgPSBHcmFtbWFyVXRpbHMuY3JlYXRlVGVtcEZpbGVXaXRoQ29kZShjb2RlLCBcIi5jXCIpXG4gICAgICAgIGFyZ3MgPSBbXVxuICAgICAgICBpZiBHcmFtbWFyVXRpbHMuT3BlcmF0aW5nU3lzdGVtLmlzRGFyd2luKClcbiAgICAgICAgICBhcmdzID0gWyctYycsIFwieGNydW4gY2xhbmcgLWZjb2xvci1kaWFnbm9zdGljcyAtV2FsbCAtaW5jbHVkZSBzdGRpby5oICdcIiArIHRtcEZpbGUgKyBcIicgLW8gL3RtcC9jLm91dCAmJiAvdG1wL2Mub3V0XCJdXG4gICAgICAgIGVsc2UgaWYgR3JhbW1hclV0aWxzLk9wZXJhdGluZ1N5c3RlbS5pc0xpbnV4KClcbiAgICAgICAgICBhcmdzID0gW1wiLWNcIiwgXCJjYyAtV2FsbCAtaW5jbHVkZSBzdGRpby5oICdcIiArIHRtcEZpbGUgKyBcIicgLW8gL3RtcC9jLm91dCAmJiAvdG1wL2Mub3V0XCJdXG4gICAgICAgIHJldHVybiBhcmdzXG5cbiAgJ0MjJzpcbiAgICBcIkZpbGUgQmFzZWRcIjpcbiAgICAgIGNvbW1hbmQ6IGlmIEdyYW1tYXJVdGlscy5PcGVyYXRpbmdTeXN0ZW0uaXNXaW5kb3dzKCkgdGhlbiBcImNtZFwiIGVsc2UgXCJiYXNoXCJcbiAgICAgIGFyZ3M6IChjb250ZXh0KSAtPlxuICAgICAgICBwcm9nbmFtZSA9IGNvbnRleHQuZmlsZW5hbWUucmVwbGFjZSAvXFwuY3MkLywgXCJcIlxuICAgICAgICBhcmdzID0gW11cbiAgICAgICAgaWYgR3JhbW1hclV0aWxzLk9wZXJhdGluZ1N5c3RlbS5pc1dpbmRvd3MoKVxuICAgICAgICAgIGFyZ3MgPSBbXCIvYyBjc2MgI3tjb250ZXh0LmZpbGVwYXRofSAmJiAje3Byb2duYW1lfS5leGVcIl1cbiAgICAgICAgZWxzZVxuICAgICAgICAgIGFyZ3MgPSBbJy1jJywgXCJjc2MgI3tjb250ZXh0LmZpbGVwYXRofSAmJiBtb25vICN7cHJvZ25hbWV9LmV4ZVwiXVxuICAgICAgICByZXR1cm4gYXJnc1xuICAgIFwiU2VsZWN0aW9uIEJhc2VkXCI6XG4gICAgICBjb21tYW5kOiBpZiBHcmFtbWFyVXRpbHMuT3BlcmF0aW5nU3lzdGVtLmlzV2luZG93cygpIHRoZW4gXCJjbWRcIiBlbHNlIFwiYmFzaFwiXG4gICAgICBhcmdzOiAoY29udGV4dCkgLT5cbiAgICAgICAgY29kZSA9IGNvbnRleHQuZ2V0Q29kZSh0cnVlKVxuICAgICAgICB0bXBGaWxlID0gR3JhbW1hclV0aWxzLmNyZWF0ZVRlbXBGaWxlV2l0aENvZGUoY29kZSwgXCIuY3NcIilcbiAgICAgICAgcHJvZ25hbWUgPSB0bXBGaWxlLnJlcGxhY2UgL1xcLmNzJC8sIFwiXCJcbiAgICAgICAgYXJncyA9IFtdXG4gICAgICAgIGlmIEdyYW1tYXJVdGlscy5PcGVyYXRpbmdTeXN0ZW0uaXNXaW5kb3dzKClcbiAgICAgICAgICBhcmdzID0gW1wiL2MgY3NjIC9vdXQ6I3twcm9nbmFtZX0uZXhlICN7dG1wRmlsZX0gJiYgI3twcm9nbmFtZX0uZXhlXCJdXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBhcmdzID0gWyctYycsIFwiY3NjIC9vdXQ6I3twcm9nbmFtZX0uZXhlICN7dG1wRmlsZX0gJiYgbW9ubyAje3Byb2duYW1lfS5leGVcIl1cbiAgICAgICAgcmV0dXJuIGFyZ3NcblxuICAnQyMgU2NyaXB0IEZpbGUnOlxuICAgIFwiRmlsZSBCYXNlZFwiOlxuICAgICAgY29tbWFuZDogXCJzY3JpcHRjc1wiXG4gICAgICBhcmdzOiAoY29udGV4dCkgLT4gWyctc2NyaXB0JywgY29udGV4dC5maWxlcGF0aF1cbiAgICBcIlNlbGVjdGlvbiBCYXNlZFwiOlxuICAgICAgY29tbWFuZDogXCJzY3JpcHRjc1wiXG4gICAgICBhcmdzOiAoY29udGV4dCkgLT5cbiAgICAgICAgY29kZSA9IGNvbnRleHQuZ2V0Q29kZSh0cnVlKVxuICAgICAgICB0bXBGaWxlID0gR3JhbW1hclV0aWxzLmNyZWF0ZVRlbXBGaWxlV2l0aENvZGUoY29kZSwgXCIuY3N4XCIpXG4gICAgICAgIFsnLXNjcmlwdCcsIHRtcEZpbGVdXG5cbiAgJ0MrKyc6XG4gICAgaWYgR3JhbW1hclV0aWxzLk9wZXJhdGluZ1N5c3RlbS5pc0RhcndpbigpXG4gICAgICBcIlNlbGVjdGlvbiBCYXNlZFwiOlxuICAgICAgICBjb21tYW5kOiBcImJhc2hcIlxuICAgICAgICBhcmdzOiAoY29udGV4dCkgLT5cbiAgICAgICAgICBjb2RlID0gY29udGV4dC5nZXRDb2RlKHRydWUpXG4gICAgICAgICAgdG1wRmlsZSA9IEdyYW1tYXJVdGlscy5jcmVhdGVUZW1wRmlsZVdpdGhDb2RlKGNvZGUsIFwiLmNwcFwiKVxuICAgICAgICAgIFtcIi1jXCIsIFwieGNydW4gY2xhbmcrKyAtZmNvbG9yLWRpYWdub3N0aWNzIC1zdGQ9YysrMTQgLVdhbGwgLWluY2x1ZGUgc3RkaW8uaCAtaW5jbHVkZSBpb3N0cmVhbSAnXCIgKyB0bXBGaWxlICsgXCInIC1vIC90bXAvY3BwLm91dCAmJiAvdG1wL2NwcC5vdXRcIl1cbiAgICAgIFwiRmlsZSBCYXNlZFwiOlxuICAgICAgICBjb21tYW5kOiBcImJhc2hcIlxuICAgICAgICBhcmdzOiAoY29udGV4dCkgLT4gWyctYycsIFwieGNydW4gY2xhbmcrKyAtZmNvbG9yLWRpYWdub3N0aWNzIC1zdGQ9YysrMTQgLVdhbGwgLWluY2x1ZGUgc3RkaW8uaCAtaW5jbHVkZSBpb3N0cmVhbSAnXCIgKyBjb250ZXh0LmZpbGVwYXRoICsgXCInIC1vIC90bXAvY3BwLm91dCAmJiAvdG1wL2NwcC5vdXRcIl1cbiAgICBlbHNlIGlmIEdyYW1tYXJVdGlscy5PcGVyYXRpbmdTeXN0ZW0uaXNMaW51eCgpXG4gICAgICBcIlNlbGVjdGlvbiBCYXNlZFwiOlxuICAgICAgICBjb21tYW5kOiBcImJhc2hcIlxuICAgICAgICBhcmdzOiAoY29udGV4dCkgLT5cbiAgICAgICAgICBjb2RlID0gY29udGV4dC5nZXRDb2RlKHRydWUpXG4gICAgICAgICAgdG1wRmlsZSA9IEdyYW1tYXJVdGlscy5jcmVhdGVUZW1wRmlsZVdpdGhDb2RlKGNvZGUsIFwiLmNwcFwiKVxuICAgICAgICAgIFtcIi1jXCIsIFwiZysrIC1zdGQ9YysrMTQgLVdhbGwgLWluY2x1ZGUgc3RkaW8uaCAtaW5jbHVkZSBpb3N0cmVhbSAnXCIgKyB0bXBGaWxlICsgXCInIC1vIC90bXAvY3BwLm91dCAmJiAvdG1wL2NwcC5vdXRcIl1cbiAgICAgIFwiRmlsZSBCYXNlZFwiOlxuICAgICAgICBjb21tYW5kOiBcImJhc2hcIlxuICAgICAgICBhcmdzOiAoY29udGV4dCkgLT4gW1wiLWNcIiwgXCJnKysgLXN0ZD1jKysxNCAtV2FsbCAtaW5jbHVkZSBzdGRpby5oIC1pbmNsdWRlIGlvc3RyZWFtICdcIiArIGNvbnRleHQuZmlsZXBhdGggKyBcIicgLW8gL3RtcC9jcHAub3V0ICYmIC90bXAvY3BwLm91dFwiXVxuICAgIGVsc2UgaWYgR3JhbW1hclV0aWxzLk9wZXJhdGluZ1N5c3RlbS5pc1dpbmRvd3MoKSBhbmQgR3JhbW1hclV0aWxzLk9wZXJhdGluZ1N5c3RlbS5yZWxlYXNlKCkuc3BsaXQoXCIuXCIpLnNsaWNlIC0xID49ICcxNDM5OSdcbiAgICAgIFwiRmlsZSBCYXNlZFwiOlxuICAgICAgICBjb21tYW5kOiBcImJhc2hcIlxuICAgICAgICBhcmdzOiAoY29udGV4dCkgLT4gW1wiLWNcIiwgXCJnKysgLXN0ZD1jKysxNCAtV2FsbCAtaW5jbHVkZSBzdGRpby5oIC1pbmNsdWRlIGlvc3RyZWFtICcvbW50L1wiICsgcGF0aC5wb3NpeC5qb2luLmFwcGx5KHBhdGgucG9zaXgsIFtdLmNvbmNhdChbY29udGV4dC5maWxlcGF0aC5zcGxpdChwYXRoLndpbjMyLnNlcClbMF0udG9Mb3dlckNhc2UoKV0sIGNvbnRleHQuZmlsZXBhdGguc3BsaXQocGF0aC53aW4zMi5zZXApLnNsaWNlKDEpKSkucmVwbGFjZShcIjpcIiwgXCJcIikgKyBcIicgLW8gL3RtcC9jcHAub3V0ICYmIC90bXAvY3BwLm91dFwiXVxuXG4gICdDKysxNCc6XG4gICAgaWYgR3JhbW1hclV0aWxzLk9wZXJhdGluZ1N5c3RlbS5pc0RhcndpbigpXG4gICAgICBcIlNlbGVjdGlvbiBCYXNlZFwiOlxuICAgICAgICBjb21tYW5kOiBcImJhc2hcIlxuICAgICAgICBhcmdzOiAoY29udGV4dCkgLT5cbiAgICAgICAgICBjb2RlID0gY29udGV4dC5nZXRDb2RlKHRydWUpXG4gICAgICAgICAgdG1wRmlsZSA9IEdyYW1tYXJVdGlscy5jcmVhdGVUZW1wRmlsZVdpdGhDb2RlKGNvZGUsIFwiLmNwcFwiKVxuICAgICAgICAgIFtcIi1jXCIsIFwieGNydW4gY2xhbmcrKyAtZmNvbG9yLWRpYWdub3N0aWNzIC1zdGQ9YysrMTQgLVdhbGwgLWluY2x1ZGUgc3RkaW8uaCAtaW5jbHVkZSBpb3N0cmVhbSAnXCIgKyB0bXBGaWxlICsgXCInIC1vIC90bXAvY3BwLm91dCAmJiAvdG1wL2NwcC5vdXRcIl1cbiAgICAgIFwiRmlsZSBCYXNlZFwiOlxuICAgICAgICBjb21tYW5kOiBcImJhc2hcIlxuICAgICAgICBhcmdzOiAoY29udGV4dCkgLT4gWyctYycsIFwieGNydW4gY2xhbmcrKyAtZmNvbG9yLWRpYWdub3N0aWNzIC1zdGQ9YysrMTQgLVdhbGwgLWluY2x1ZGUgc3RkaW8uaCAtaW5jbHVkZSBpb3N0cmVhbSAnXCIgKyBjb250ZXh0LmZpbGVwYXRoICsgXCInIC1vIC90bXAvY3BwLm91dCAmJiAvdG1wL2NwcC5vdXRcIl1cbiAgICBlbHNlIGlmIEdyYW1tYXJVdGlscy5PcGVyYXRpbmdTeXN0ZW0uaXNMaW51eCgpXG4gICAgICBcIlNlbGVjdGlvbiBCYXNlZFwiOlxuICAgICAgICBjb21tYW5kOiBcImJhc2hcIlxuICAgICAgICBhcmdzOiAoY29udGV4dCkgLT5cbiAgICAgICAgICBjb2RlID0gY29udGV4dC5nZXRDb2RlKHRydWUpXG4gICAgICAgICAgdG1wRmlsZSA9IEdyYW1tYXJVdGlscy5jcmVhdGVUZW1wRmlsZVdpdGhDb2RlKGNvZGUsIFwiLmNwcFwiKVxuICAgICAgICAgIFtcIi1jXCIsIFwiZysrIC1zdGQ9YysrMTQgLVdhbGwgLWluY2x1ZGUgc3RkaW8uaCAtaW5jbHVkZSBpb3N0cmVhbSAnXCIgKyB0bXBGaWxlICsgXCInIC1vIC90bXAvY3BwLm91dCAmJiAvdG1wL2NwcC5vdXRcIl1cbiAgICAgIFwiRmlsZSBCYXNlZFwiOlxuICAgICAgICBjb21tYW5kOiBcImJhc2hcIlxuICAgICAgICBhcmdzOiAoY29udGV4dCkgLT4gW1wiLWNcIiwgXCJnKysgLXN0ZD1jKysxNCAtV2FsbCAtaW5jbHVkZSBzdGRpby5oIC1pbmNsdWRlIGlvc3RyZWFtICdcIiArIGNvbnRleHQuZmlsZXBhdGggKyBcIicgLW8gL3RtcC9jcHAub3V0ICYmIC90bXAvY3BwLm91dFwiXVxuICAgIGVsc2UgaWYgR3JhbW1hclV0aWxzLk9wZXJhdGluZ1N5c3RlbS5pc1dpbmRvd3MoKSBhbmQgR3JhbW1hclV0aWxzLk9wZXJhdGluZ1N5c3RlbS5yZWxlYXNlKCkuc3BsaXQoXCIuXCIpLnNsaWNlIC0xID49ICcxNDM5OSdcbiAgICAgIFwiRmlsZSBCYXNlZFwiOlxuICAgICAgICBjb21tYW5kOiBcImJhc2hcIlxuICAgICAgICBhcmdzOiAoY29udGV4dCkgLT4gW1wiLWNcIiwgXCJnKysgLXN0ZD1jKysxNCAtV2FsbCAtaW5jbHVkZSBzdGRpby5oIC1pbmNsdWRlIGlvc3RyZWFtICcvbW50L1wiICsgcGF0aC5wb3NpeC5qb2luLmFwcGx5KHBhdGgucG9zaXgsIFtdLmNvbmNhdChbY29udGV4dC5maWxlcGF0aC5zcGxpdChwYXRoLndpbjMyLnNlcClbMF0udG9Mb3dlckNhc2UoKV0sIGNvbnRleHQuZmlsZXBhdGguc3BsaXQocGF0aC53aW4zMi5zZXApLnNsaWNlKDEpKSkucmVwbGFjZShcIjpcIiwgXCJcIikgKyBcIicgLW8gL3RtcC9jcHAub3V0ICYmIC90bXAvY3BwLm91dFwiXVxuXG4gIENsb2p1cmU6XG4gICAgXCJTZWxlY3Rpb24gQmFzZWRcIjpcbiAgICAgIGNvbW1hbmQ6IFwibGVpblwiXG4gICAgICBhcmdzOiAoY29udGV4dCkgIC0+IFsnZXhlYycsICctZScsIGNvbnRleHQuZ2V0Q29kZSgpXVxuICAgIFwiRmlsZSBCYXNlZFwiOlxuICAgICAgY29tbWFuZDogXCJsZWluXCJcbiAgICAgIGFyZ3M6IChjb250ZXh0KSAtPiBbJ2V4ZWMnLCBjb250ZXh0LmZpbGVwYXRoXVxuXG4gIENvZmZlZVNjcmlwdDpcbiAgICBcIlNlbGVjdGlvbiBCYXNlZFwiOlxuICAgICAgY29tbWFuZDogXCJjb2ZmZWVcIlxuICAgICAgYXJnczogKGNvbnRleHQpIC0+IEdyYW1tYXJVdGlscy5DU2NvbXBpbGVyLmFyZ3MuY29uY2F0IFtjb250ZXh0LmdldENvZGUoKV1cbiAgICBcIkZpbGUgQmFzZWRcIjpcbiAgICAgIGNvbW1hbmQ6IFwiY29mZmVlXCJcbiAgICAgIGFyZ3M6IChjb250ZXh0KSAtPiBbY29udGV4dC5maWxlcGF0aF1cblxuICBcIkNvZmZlZVNjcmlwdCAoTGl0ZXJhdGUpXCI6XG4gICAgJ1NlbGVjdGlvbiBCYXNlZCc6XG4gICAgICBjb21tYW5kOiAnY29mZmVlJ1xuICAgICAgYXJnczogKGNvbnRleHQpIC0+IEdyYW1tYXJVdGlscy5DU2NvbXBpbGVyLmFyZ3MuY29uY2F0IFtjb250ZXh0LmdldENvZGUoKV1cbiAgICAnRmlsZSBCYXNlZCc6XG4gICAgICBjb21tYW5kOiAnY29mZmVlJ1xuICAgICAgYXJnczogKGNvbnRleHQpIC0+IFtjb250ZXh0LmZpbGVwYXRoXVxuXG4gIFwiQ29tbW9uIExpc3BcIjpcbiAgICBcIkZpbGUgQmFzZWRcIjpcbiAgICAgIGNvbW1hbmQ6IFwiY2xpc3BcIlxuICAgICAgYXJnczogKGNvbnRleHQpIC0+IFtjb250ZXh0LmZpbGVwYXRoXVxuXG4gIENyeXN0YWw6XG4gICAgXCJTZWxlY3Rpb24gQmFzZWRcIjpcbiAgICAgIGNvbW1hbmQ6IFwiY3J5c3RhbFwiXG4gICAgICBhcmdzOiAoY29udGV4dCkgIC0+IFsnZXZhbCcsIGNvbnRleHQuZ2V0Q29kZSgpXVxuICAgIFwiRmlsZSBCYXNlZFwiOlxuICAgICAgY29tbWFuZDogXCJjcnlzdGFsXCJcbiAgICAgIGFyZ3M6IChjb250ZXh0KSAtPiBbY29udGV4dC5maWxlcGF0aF1cblxuICBEOlxuICAgIFwiU2VsZWN0aW9uIEJhc2VkXCI6XG4gICAgICBjb21tYW5kOiBcInJkbWRcIlxuICAgICAgYXJnczogKGNvbnRleHQpICAtPlxuICAgICAgICBjb2RlID0gY29udGV4dC5nZXRDb2RlKHRydWUpXG4gICAgICAgIHRtcEZpbGUgPSBHcmFtbWFyVXRpbHMuRC5jcmVhdGVUZW1wRmlsZVdpdGhDb2RlKGNvZGUpXG4gICAgICAgIFt0bXBGaWxlXVxuICAgIFwiRmlsZSBCYXNlZFwiOlxuICAgICAgY29tbWFuZDogXCJyZG1kXCJcbiAgICAgIGFyZ3M6IChjb250ZXh0KSAtPiBbY29udGV4dC5maWxlcGF0aF1cblxuICBEYXJ0OlxuICAgIFwiU2VsZWN0aW9uIEJhc2VkXCI6XG4gICAgICBjb21tYW5kOiBcImRhcnRcIlxuICAgICAgYXJnczogKGNvbnRleHQpIC0+XG4gICAgICAgIGNvZGUgPSBjb250ZXh0LmdldENvZGUodHJ1ZSlcbiAgICAgICAgdG1wRmlsZSA9IEdyYW1tYXJVdGlscy5jcmVhdGVUZW1wRmlsZVdpdGhDb2RlKGNvZGUsIFwiLmRhcnRcIilcbiAgICAgICAgW3RtcEZpbGVdXG4gICAgXCJGaWxlIEJhc2VkXCI6XG4gICAgICBjb21tYW5kOiBcImRhcnRcIlxuICAgICAgYXJnczogKGNvbnRleHQpIC0+IFtjb250ZXh0LmZpbGVwYXRoXVxuXG4gIFwiR3JhcGh2aXogKERPVClcIjpcbiAgICBcIlNlbGVjdGlvbiBCYXNlZFwiOlxuICAgICAgY29tbWFuZDogXCJkb3RcIlxuICAgICAgYXJnczogKGNvbnRleHQpIC0+XG4gICAgICAgIGNvZGUgPSBjb250ZXh0LmdldENvZGUodHJ1ZSlcbiAgICAgICAgdG1wRmlsZSA9IEdyYW1tYXJVdGlscy5jcmVhdGVUZW1wRmlsZVdpdGhDb2RlKGNvZGUsIFwiLmRvdFwiKVxuICAgICAgICBbJy1UcG5nJywgdG1wRmlsZSwgJy1vJywgdG1wRmlsZSArICcucG5nJ11cbiAgICBcIkZpbGUgQmFzZWRcIjpcbiAgICAgIGNvbW1hbmQ6IFwiZG90XCJcbiAgICAgIGFyZ3M6IChjb250ZXh0KSAtPiBbJy1UcG5nJywgY29udGV4dC5maWxlcGF0aCwgJy1vJywgY29udGV4dC5maWxlcGF0aCArICcucG5nJ11cbiAgRE9UOlxuICAgIFwiU2VsZWN0aW9uIEJhc2VkXCI6XG4gICAgICBjb21tYW5kOiBcImRvdFwiXG4gICAgICBhcmdzOiAoY29udGV4dCkgLT5cbiAgICAgICAgY29kZSA9IGNvbnRleHQuZ2V0Q29kZSh0cnVlKVxuICAgICAgICB0bXBGaWxlID0gR3JhbW1hclV0aWxzLmNyZWF0ZVRlbXBGaWxlV2l0aENvZGUoY29kZSwgXCIuZG90XCIpXG4gICAgICAgIFsnLVRwbmcnLCB0bXBGaWxlLCAnLW8nLCB0bXBGaWxlICsgJy5wbmcnXVxuICAgIFwiRmlsZSBCYXNlZFwiOlxuICAgICAgY29tbWFuZDogXCJkb3RcIlxuICAgICAgYXJnczogKGNvbnRleHQpIC0+IFsnLVRwbmcnLCBjb250ZXh0LmZpbGVwYXRoLCAnLW8nLCBjb250ZXh0LmZpbGVwYXRoICsgJy5wbmcnXVxuXG4gIEVsaXhpcjpcbiAgICBcIlNlbGVjdGlvbiBCYXNlZFwiOlxuICAgICAgY29tbWFuZDogXCJlbGl4aXJcIlxuICAgICAgYXJnczogKGNvbnRleHQpICAtPiBbJy1lJywgY29udGV4dC5nZXRDb2RlKCldXG4gICAgXCJGaWxlIEJhc2VkXCI6XG4gICAgICBjb21tYW5kOiBcImVsaXhpclwiXG4gICAgICBhcmdzOiAoY29udGV4dCkgLT4gWyctcicsIGNvbnRleHQuZmlsZXBhdGhdXG5cbiAgRXJsYW5nOlxuICAgIFwiU2VsZWN0aW9uIEJhc2VkXCI6XG4gICAgICBjb21tYW5kOiBcImVybFwiXG4gICAgICBhcmdzOiAoY29udGV4dCkgIC0+IFsnLW5vc2hlbGwnLCAnLWV2YWwnLCBcIiN7Y29udGV4dC5nZXRDb2RlKCl9LCBpbml0OnN0b3AoKS5cIl1cblxuICAnRiMnOlxuICAgIFwiRmlsZSBCYXNlZFwiOlxuICAgICAgY29tbWFuZDogaWYgR3JhbW1hclV0aWxzLk9wZXJhdGluZ1N5c3RlbS5pc1dpbmRvd3MoKSB0aGVuIFwiZnNpXCIgZWxzZSBcImZzaGFycGlcIlxuICAgICAgYXJnczogKGNvbnRleHQpIC0+IFsnLS1leGVjJywgY29udGV4dC5maWxlcGF0aF1cblxuICAnRionOlxuICAgIFwiRmlsZSBCYXNlZFwiOlxuICAgICAgY29tbWFuZDogXCJmc3RhclwiXG4gICAgICBhcmdzOiAoY29udGV4dCkgLT4gW2NvbnRleHQuZmlsZXBhdGhdXG5cbiAgRmFibGU6XG4gICAgXCJTZWxlY3Rpb24gQmFzZWRcIjpcbiAgICAgIGNvbW1hbmQ6IFwiZmFibGVcIlxuICAgICAgYXJnczogKGNvbnRleHQpIC0+XG4gICAgICAgIGNvZGUgPSBjb250ZXh0LmdldENvZGUoKVxuICAgICAgICB0bXBGaWxlID0gR3JhbW1hclV0aWxzLmNyZWF0ZVRlbXBGaWxlV2l0aENvZGUoY29kZSlcbiAgICAgICAgW3RtcEZpbGVdXG4gICAgXCJGaWxlIEJhc2VkXCI6XG4gICAgICBjb21tYW5kOiBcImZhYmxlXCJcbiAgICAgIGFyZ3M6IChjb250ZXh0KSAtPiBbY29udGV4dC5maWxlcGF0aF1cblxuICBGb3J0aDpcbiAgICBcIkZpbGUgQmFzZWRcIjpcbiAgICAgIGNvbW1hbmQ6IFwiZ2ZvcnRoXCJcbiAgICAgIGFyZ3M6IChjb250ZXh0KSAtPiBbY29udGV4dC5maWxlcGF0aF1cblxuICBcIkZvcnRyYW4gLSBGaXhlZCBGb3JtXCI6XG4gICAgXCJGaWxlIEJhc2VkXCI6XG4gICAgICBjb21tYW5kOiBcImJhc2hcIlxuICAgICAgYXJnczogKGNvbnRleHQpIC0+IFsnLWMnLCBcImdmb3J0cmFuICdcIiArIGNvbnRleHQuZmlsZXBhdGggKyBcIicgLWZmaXhlZC1mb3JtIC1vIC90bXAvZi5vdXQgJiYgL3RtcC9mLm91dFwiXVxuXG4gIFwiRm9ydHJhbiAtIEZyZWUgRm9ybVwiOlxuICAgIFwiRmlsZSBCYXNlZFwiOlxuICAgICAgY29tbWFuZDogXCJiYXNoXCJcbiAgICAgIGFyZ3M6IChjb250ZXh0KSAtPiBbJy1jJywgXCJnZm9ydHJhbiAnXCIgKyBjb250ZXh0LmZpbGVwYXRoICsgXCInIC1mZnJlZS1mb3JtIC1vIC90bXAvZjkwLm91dCAmJiAvdG1wL2Y5MC5vdXRcIl1cblxuICBcIkZvcnRyYW4gLSBNb2Rlcm5cIjpcbiAgICBcIkZpbGUgQmFzZWRcIjpcbiAgICAgIGNvbW1hbmQ6IFwiYmFzaFwiXG4gICAgICBhcmdzOiAoY29udGV4dCkgLT4gWyctYycsIFwiZ2ZvcnRyYW4gJ1wiICsgY29udGV4dC5maWxlcGF0aCArIFwiJyAtZmZyZWUtZm9ybSAtbyAvdG1wL2Y5MC5vdXQgJiYgL3RtcC9mOTAub3V0XCJdXG5cbiAgXCJGb3J0cmFuIC0gUHVuY2hjYXJkXCI6XG4gICAgXCJGaWxlIEJhc2VkXCI6XG4gICAgICBjb21tYW5kOiBcImJhc2hcIlxuICAgICAgYXJnczogKGNvbnRleHQpIC0+IFsnLWMnLCBcImdmb3J0cmFuICdcIiArIGNvbnRleHQuZmlsZXBhdGggKyBcIicgLWZmaXhlZC1mb3JtIC1vIC90bXAvZi5vdXQgJiYgL3RtcC9mLm91dFwiXVxuXG4gIEdoZXJraW46XG4gICAgXCJGaWxlIEJhc2VkXCI6XG4gICAgICBjb21tYW5kOiBcImN1Y3VtYmVyXCJcbiAgICAgIGFyZ3M6IChjb250ZXh0KSAtPiBbJy0tY29sb3InLCBjb250ZXh0LmZpbGVwYXRoXVxuICAgIFwiTGluZSBOdW1iZXIgQmFzZWRcIjpcbiAgICAgIGNvbW1hbmQ6IFwiY3VjdW1iZXJcIlxuICAgICAgYXJnczogKGNvbnRleHQpIC0+IFsnLS1jb2xvcicsIGNvbnRleHQuZmlsZUNvbG9uTGluZSgpXVxuXG4gIGdudXBsb3Q6XG4gICAgXCJGaWxlIEJhc2VkXCI6XG4gICAgICBjb21tYW5kOiBcImdudXBsb3RcIlxuICAgICAgYXJnczogKGNvbnRleHQpIC0+IFsnLXAnLCBjb250ZXh0LmZpbGVwYXRoXVxuICAgICAgd29ya2luZ0RpcmVjdG9yeTogYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlUGFuZUl0ZW0oKT8uYnVmZmVyPy5maWxlPy5nZXRQYXJlbnQ/KCkuZ2V0UGF0aD8oKVxuXG4gIEdvOlxuICAgIFwiRmlsZSBCYXNlZFwiOlxuICAgICAgY29tbWFuZDogXCJnb1wiXG4gICAgICBhcmdzOiAoY29udGV4dCkgLT5cbiAgICAgICAgaWYgY29udGV4dC5maWxlcGF0aC5tYXRjaCgvX3Rlc3QuZ28vKSB0aGVuIFsndGVzdCcsICcnIF1cbiAgICAgICAgZWxzZSBbJ3J1bicsIGNvbnRleHQuZmlsZXBhdGhdXG4gICAgICB3b3JraW5nRGlyZWN0b3J5OiBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lSXRlbSgpPy5idWZmZXI/LmZpbGU/LmdldFBhcmVudD8oKS5nZXRQYXRoPygpXG5cbiAgR3Jvb3Z5OlxuICAgIFwiU2VsZWN0aW9uIEJhc2VkXCI6XG4gICAgICBjb21tYW5kOiBcImdyb292eVwiXG4gICAgICBhcmdzOiAoY29udGV4dCkgIC0+IFsnLWUnLCBjb250ZXh0LmdldENvZGUoKV1cbiAgICBcIkZpbGUgQmFzZWRcIjpcbiAgICAgIGNvbW1hbmQ6IFwiZ3Jvb3Z5XCJcbiAgICAgIGFyZ3M6IChjb250ZXh0KSAtPiBbY29udGV4dC5maWxlcGF0aF1cblxuICBIYXNrZWxsOlxuICAgIFwiRmlsZSBCYXNlZFwiOlxuICAgICAgY29tbWFuZDogXCJydW5oYXNrZWxsXCJcbiAgICAgIGFyZ3M6IChjb250ZXh0KSAtPiBbY29udGV4dC5maWxlcGF0aF1cbiAgICBcIlNlbGVjdGlvbiBCYXNlZFwiOlxuICAgICAgY29tbWFuZDogXCJnaGNcIlxuICAgICAgYXJnczogKGNvbnRleHQpICAtPiBbJy1lJywgY29udGV4dC5nZXRDb2RlKCldXG5cbiAgSHk6XG4gICAgXCJGaWxlIEJhc2VkXCI6XG4gICAgICBjb21tYW5kOiBcImh5XCJcbiAgICAgIGFyZ3M6IChjb250ZXh0KSAtPiBbY29udGV4dC5maWxlcGF0aF1cbiAgICBcIlNlbGVjdGlvbiBCYXNlZFwiOlxuICAgICAgY29tbWFuZDogXCJoeVwiXG4gICAgICBhcmdzOiAoY29udGV4dCkgLT5cbiAgICAgICAgY29kZSA9IGNvbnRleHQuZ2V0Q29kZSh0cnVlKVxuICAgICAgICB0bXBGaWxlID0gR3JhbW1hclV0aWxzLmNyZWF0ZVRlbXBGaWxlV2l0aENvZGUoY29kZSwgXCIuaHlcIilcbiAgICAgICAgW3RtcEZpbGVdXG5cbiAgSWNlZENvZmZlZVNjcmlwdDpcbiAgICBcIlNlbGVjdGlvbiBCYXNlZFwiOlxuICAgICAgY29tbWFuZDogXCJpY2VkXCJcbiAgICAgIGFyZ3M6IChjb250ZXh0KSAgLT4gWyctZScsIGNvbnRleHQuZ2V0Q29kZSgpXVxuICAgIFwiRmlsZSBCYXNlZFwiOlxuICAgICAgY29tbWFuZDogXCJpY2VkXCJcbiAgICAgIGFyZ3M6IChjb250ZXh0KSAtPiBbY29udGV4dC5maWxlcGF0aF1cblxuICBJZHJpczpcbiAgICBcIkZpbGUgQmFzZWRcIjpcbiAgICAgIGNvbW1hbmQ6IFwiaWRyaXNcIlxuICAgICAgYXJnczogKGNvbnRleHQpIC0+IFtjb250ZXh0LmZpbGVwYXRoLCAnLW8nLCBwYXRoLmJhc2VuYW1lKGNvbnRleHQuZmlsZXBhdGgsIHBhdGguZXh0bmFtZShjb250ZXh0LmZpbGVwYXRoKSldXG5cbiAgSW5ub1NldHVwOlxuICAgIFwiRmlsZSBCYXNlZFwiOlxuICAgICAgY29tbWFuZDogXCJJU0NDLmV4ZVwiXG4gICAgICBhcmdzOiAoY29udGV4dCkgLT4gWycvUScsIGNvbnRleHQuZmlsZXBhdGhdXG5cbiAgaW9MYW5ndWFnZTpcbiAgICBcIlNlbGVjdGlvbiBCYXNlZFwiOlxuICAgICAgY29tbWFuZDogXCJpb1wiXG4gICAgICBhcmdzOiAoY29udGV4dCkgLT4gW2NvbnRleHQuZ2V0Q29kZSgpXVxuICAgIFwiRmlsZSBCYXNlZFwiOlxuICAgICAgY29tbWFuZDogXCJpb1wiXG4gICAgICBhcmdzOiAoY29udGV4dCkgLT4gWyctZScsIGNvbnRleHQuZmlsZXBhdGhdXG5cbiAgSmF2YTpcbiAgICBcIkZpbGUgQmFzZWRcIjpcbiAgICAgIGNvbW1hbmQ6IGlmIEdyYW1tYXJVdGlscy5PcGVyYXRpbmdTeXN0ZW0uaXNXaW5kb3dzKCkgdGhlbiBcImNtZFwiIGVsc2UgXCJiYXNoXCJcbiAgICAgIGFyZ3M6IChjb250ZXh0KSAtPlxuICAgICAgICBjbGFzc05hbWUgPSBHcmFtbWFyVXRpbHMuSmF2YS5nZXRDbGFzc05hbWUgY29udGV4dFxuICAgICAgICBjbGFzc1BhY2thZ2VzID0gR3JhbW1hclV0aWxzLkphdmEuZ2V0Q2xhc3NQYWNrYWdlIGNvbnRleHRcbiAgICAgICAgc291cmNlUGF0aCA9IEdyYW1tYXJVdGlscy5KYXZhLmdldFByb2plY3RQYXRoIGNvbnRleHRcblxuICAgICAgICBhcmdzID0gW11cbiAgICAgICAgaWYgR3JhbW1hclV0aWxzLk9wZXJhdGluZ1N5c3RlbS5pc1dpbmRvd3MoKVxuICAgICAgICAgIGFyZ3MgPSBbXCIvYyBqYXZhYyAtWGxpbnQgI3tjb250ZXh0LmZpbGVuYW1lfSAmJiBqYXZhICN7Y2xhc3NOYW1lfVwiXVxuICAgICAgICBlbHNlXG4gICAgICAgICAgYXJncyA9IFsnLWMnLCBcImphdmFjIC1zb3VyY2VwYXRoICN7c291cmNlUGF0aH0gLWQgL3RtcCAnI3tjb250ZXh0LmZpbGVwYXRofScgJiYgamF2YSAtY3AgL3RtcCAje2NsYXNzUGFja2FnZXN9I3tjbGFzc05hbWV9XCJdXG5cbiAgICAgICAgcmV0dXJuIGFyZ3NcblxuICBKYXZhU2NyaXB0OlxuICAgIFwiU2VsZWN0aW9uIEJhc2VkXCI6XG4gICAgICBjb21tYW5kOiBcIm5vZGVcIlxuICAgICAgYXJnczogKGNvbnRleHQpICAtPiBbJy1lJywgY29udGV4dC5nZXRDb2RlKCldXG4gICAgXCJGaWxlIEJhc2VkXCI6XG4gICAgICBjb21tYW5kOiBcIm5vZGVcIlxuICAgICAgYXJnczogKGNvbnRleHQpIC0+IFtjb250ZXh0LmZpbGVwYXRoXVxuXG4gICdKYXZhU2NyaXB0IHdpdGggSlNYJzpcbiAgICBcIlNlbGVjdGlvbiBCYXNlZFwiOlxuICAgICAgY29tbWFuZDogXCJub2RlXCJcbiAgICAgIGFyZ3M6IChjb250ZXh0KSAgLT4gWyctZScsIGNvbnRleHQuZ2V0Q29kZSgpXVxuICAgIFwiRmlsZSBCYXNlZFwiOlxuICAgICAgY29tbWFuZDogXCJub2RlXCJcbiAgICAgIGFyZ3M6IChjb250ZXh0KSAtPiBbY29udGV4dC5maWxlcGF0aF1cblxuICBcIkphdmFTY3JpcHQgZm9yIEF1dG9tYXRpb24gKEpYQSlcIjpcbiAgICBcIlNlbGVjdGlvbiBCYXNlZFwiOlxuICAgICAgY29tbWFuZDogXCJvc2FzY3JpcHRcIlxuICAgICAgYXJnczogKGNvbnRleHQpICAtPiBbJy1sJywgJ0phdmFTY3JpcHQnLCAnLWUnLCBjb250ZXh0LmdldENvZGUoKV1cbiAgICBcIkZpbGUgQmFzZWRcIjpcbiAgICAgIGNvbW1hbmQ6IFwib3Nhc2NyaXB0XCJcbiAgICAgIGFyZ3M6IChjb250ZXh0KSAtPiBbJy1sJywgJ0phdmFTY3JpcHQnLCBjb250ZXh0LmZpbGVwYXRoXVxuXG4gIEpvbGllOlxuICAgIFwiRmlsZSBCYXNlZFwiOlxuICAgICAgY29tbWFuZDogXCJqb2xpZVwiXG4gICAgICBhcmdzOiAoY29udGV4dCkgLT4gW2NvbnRleHQuZmlsZXBhdGhdXG5cbiAgSnVsaWE6XG4gICAgXCJTZWxlY3Rpb24gQmFzZWRcIjpcbiAgICAgIGNvbW1hbmQ6IFwianVsaWFcIlxuICAgICAgYXJnczogKGNvbnRleHQpICAtPiBbJy1lJywgY29udGV4dC5nZXRDb2RlKCldXG4gICAgXCJGaWxlIEJhc2VkXCI6XG4gICAgICBjb21tYW5kOiBcImp1bGlhXCJcbiAgICAgIGFyZ3M6IChjb250ZXh0KSAtPiBbY29udGV4dC5maWxlcGF0aF1cblxuICBLb3RsaW46XG4gICAgXCJTZWxlY3Rpb24gQmFzZWRcIjpcbiAgICAgIGNvbW1hbmQ6IFwiYmFzaFwiXG4gICAgICBhcmdzOiAoY29udGV4dCkgLT5cbiAgICAgICAgY29kZSA9IGNvbnRleHQuZ2V0Q29kZSh0cnVlKVxuICAgICAgICB0bXBGaWxlID0gR3JhbW1hclV0aWxzLmNyZWF0ZVRlbXBGaWxlV2l0aENvZGUoY29kZSwgXCIua3RcIilcbiAgICAgICAgamFyTmFtZSA9IHRtcEZpbGUucmVwbGFjZSAvXFwua3QkLywgXCIuamFyXCJcbiAgICAgICAgYXJncyA9IFsnLWMnLCBcImtvdGxpbmMgI3t0bXBGaWxlfSAtaW5jbHVkZS1ydW50aW1lIC1kICN7amFyTmFtZX0gJiYgamF2YSAtamFyICN7amFyTmFtZX1cIl1cbiAgICAgICAgcmV0dXJuIGFyZ3NcbiAgICBcIkZpbGUgQmFzZWRcIjpcbiAgICAgIGNvbW1hbmQ6IFwiYmFzaFwiXG4gICAgICBhcmdzOiAoY29udGV4dCkgLT5cbiAgICAgICAgamFyTmFtZSA9IGNvbnRleHQuZmlsZW5hbWUucmVwbGFjZSAvXFwua3QkLywgXCIuamFyXCJcbiAgICAgICAgYXJncyA9IFsnLWMnLCBcImtvdGxpbmMgI3tjb250ZXh0LmZpbGVwYXRofSAtaW5jbHVkZS1ydW50aW1lIC1kIC90bXAvI3tqYXJOYW1lfSAmJiBqYXZhIC1qYXIgL3RtcC8je2phck5hbWV9XCJdXG4gICAgICAgIHJldHVybiBhcmdzXG5cbiAgTEFNTVBTOlxuICAgIGlmIEdyYW1tYXJVdGlscy5PcGVyYXRpbmdTeXN0ZW0uaXNEYXJ3aW4oKSB8fCBHcmFtbWFyVXRpbHMuT3BlcmF0aW5nU3lzdGVtLmlzTGludXgoKVxuICAgICAgXCJGaWxlIEJhc2VkXCI6XG4gICAgICAgIGNvbW1hbmQ6IFwibGFtbXBzXCJcbiAgICAgICAgYXJnczogKGNvbnRleHQpIC0+IFsnLWxvZycsICdub25lJywgJy1pbicsIGNvbnRleHQuZmlsZXBhdGhdXG5cbiAgTGFUZVg6XG4gICAgXCJGaWxlIEJhc2VkXCI6XG4gICAgICBjb21tYW5kOiBcImxhdGV4bWtcIlxuICAgICAgYXJnczogKGNvbnRleHQpIC0+IFsnLWNkJywgJy1xdWlldCcsICctcGRmJywgJy1wdicsICctc2hlbGwtZXNjYXBlJywgY29udGV4dC5maWxlcGF0aF1cblxuICAnTGFUZVggQmVhbWVyJzpcbiAgICBcIkZpbGUgQmFzZWRcIjpcbiAgICAgIGNvbW1hbmQ6IFwibGF0ZXhta1wiXG4gICAgICBhcmdzOiAoY29udGV4dCkgLT4gWyctY2QnLCAnLXF1aWV0JywgJy1wZGYnLCAnLXB2JywgJy1zaGVsbC1lc2NhcGUnLCBjb250ZXh0LmZpbGVwYXRoXVxuXG4gIExpbHlQb25kOlxuICAgIFwiRmlsZSBCYXNlZFwiOlxuICAgICAgY29tbWFuZDogXCJsaWx5cG9uZFwiXG4gICAgICBhcmdzOiAoY29udGV4dCkgLT4gW2NvbnRleHQuZmlsZXBhdGhdXG5cbiAgTGlzcDpcbiAgICBcIlNlbGVjdGlvbiBCYXNlZFwiOlxuICAgICAgY29tbWFuZDogXCJzYmNsXCJcbiAgICAgIGFyZ3M6IChjb250ZXh0KSAtPlxuICAgICAgICBzdGF0ZW1lbnRzID0gXy5mbGF0dGVuKF8ubWFwKEdyYW1tYXJVdGlscy5MaXNwLnNwbGl0U3RhdGVtZW50cyhjb250ZXh0LmdldENvZGUoKSksIChzdGF0ZW1lbnQpIC0+IFsnLS1ldmFsJywgc3RhdGVtZW50XSkpXG4gICAgICAgIGFyZ3MgPSBfLnVuaW9uIFsnLS1ub2luZm9ybScsICctLWRpc2FibGUtZGVidWdnZXInLCAnLS1ub24taW50ZXJhY3RpdmUnLCAnLS1xdWl0J10sIHN0YXRlbWVudHNcbiAgICAgICAgcmV0dXJuIGFyZ3NcbiAgICBcIkZpbGUgQmFzZWRcIjpcbiAgICAgIGNvbW1hbmQ6IFwic2JjbFwiXG4gICAgICBhcmdzOiAoY29udGV4dCkgLT4gWyctLW5vaW5mb3JtJywgJy0tc2NyaXB0JywgY29udGV4dC5maWxlcGF0aF1cblxuICAnTGl0ZXJhdGUgSGFza2VsbCc6XG4gICAgXCJGaWxlIEJhc2VkXCI6XG4gICAgICBjb21tYW5kOiBcInJ1bmhhc2tlbGxcIlxuICAgICAgYXJnczogKGNvbnRleHQpIC0+IFtjb250ZXh0LmZpbGVwYXRoXVxuXG4gIExpdmVTY3JpcHQ6XG4gICAgXCJTZWxlY3Rpb24gQmFzZWRcIjpcbiAgICAgIGNvbW1hbmQ6IFwibHNjXCJcbiAgICAgIGFyZ3M6IChjb250ZXh0KSAgLT4gWyctZScsIGNvbnRleHQuZ2V0Q29kZSgpXVxuICAgIFwiRmlsZSBCYXNlZFwiOlxuICAgICAgY29tbWFuZDogXCJsc2NcIlxuICAgICAgYXJnczogKGNvbnRleHQpIC0+IFtjb250ZXh0LmZpbGVwYXRoXVxuXG4gIEx1YTpcbiAgICBcIlNlbGVjdGlvbiBCYXNlZFwiOlxuICAgICAgY29tbWFuZDogXCJsdWFcIlxuICAgICAgYXJnczogKGNvbnRleHQpIC0+XG4gICAgICAgIGNvZGUgPSBjb250ZXh0LmdldENvZGUodHJ1ZSlcbiAgICAgICAgdG1wRmlsZSA9IEdyYW1tYXJVdGlscy5jcmVhdGVUZW1wRmlsZVdpdGhDb2RlKGNvZGUpXG4gICAgICAgIFt0bXBGaWxlXVxuICAgIFwiRmlsZSBCYXNlZFwiOlxuICAgICAgY29tbWFuZDogXCJsdWFcIlxuICAgICAgYXJnczogKGNvbnRleHQpIC0+IFtjb250ZXh0LmZpbGVwYXRoXVxuXG4gICdMdWEgKFdvVyknOlxuICAgIFwiU2VsZWN0aW9uIEJhc2VkXCI6XG4gICAgICBjb21tYW5kOiBcImx1YVwiXG4gICAgICBhcmdzOiAoY29udGV4dCkgLT5cbiAgICAgICAgY29kZSA9IGNvbnRleHQuZ2V0Q29kZSh0cnVlKVxuICAgICAgICB0bXBGaWxlID0gR3JhbW1hclV0aWxzLmNyZWF0ZVRlbXBGaWxlV2l0aENvZGUoY29kZSlcbiAgICAgICAgW3RtcEZpbGVdXG4gICAgXCJGaWxlIEJhc2VkXCI6XG4gICAgICBjb21tYW5kOiBcImx1YVwiXG4gICAgICBhcmdzOiAoY29udGV4dCkgLT4gW2NvbnRleHQuZmlsZXBhdGhdXG5cbiAgTWFrZWZpbGU6XG4gICAgXCJTZWxlY3Rpb24gQmFzZWRcIjpcbiAgICAgIGNvbW1hbmQ6IFwiYmFzaFwiXG4gICAgICBhcmdzOiAoY29udGV4dCkgLT4gWyctYycsIGNvbnRleHQuZ2V0Q29kZSgpXVxuICAgIFwiRmlsZSBCYXNlZFwiOlxuICAgICAgY29tbWFuZDogXCJtYWtlXCJcbiAgICAgIGFyZ3M6IChjb250ZXh0KSAtPiBbJy1mJywgY29udGV4dC5maWxlcGF0aF1cblxuICBNYWdpY1B5dGhvbjpcbiAgICBcIlNlbGVjdGlvbiBCYXNlZFwiOlxuICAgICAgY29tbWFuZDogXCJweXRob25cIlxuICAgICAgYXJnczogKGNvbnRleHQpICAtPiBbJy11JywgJy1jJywgY29udGV4dC5nZXRDb2RlKCldXG4gICAgXCJGaWxlIEJhc2VkXCI6XG4gICAgICBjb21tYW5kOiBcInB5dGhvblwiXG4gICAgICBhcmdzOiAoY29udGV4dCkgLT4gWyctdScsIGNvbnRleHQuZmlsZXBhdGhdXG5cbiAgTUFUTEFCOlxuICAgIFwiU2VsZWN0aW9uIEJhc2VkXCI6XG4gICAgICBjb21tYW5kOiBcIm1hdGxhYlwiXG4gICAgICBhcmdzOiAoY29udGV4dCkgLT5cbiAgICAgICAgY29kZSA9IGNvbnRleHQuZ2V0Q29kZSgpXG4gICAgICAgIHRtcEZpbGUgPSBHcmFtbWFyVXRpbHMuTUFUTEFCLmNyZWF0ZVRlbXBGaWxlV2l0aENvZGUoY29kZSlcbiAgICAgICAgWyctbm9kZXNrdG9wJywnLW5vc3BsYXNoJywnLXInLFwidHJ5LCBydW4oJ1wiICsgdG1wRmlsZSArIFwiJyk7d2hpbGUgfmlzZW1wdHkoZ2V0KDAsJ0NoaWxkcmVuJykpOyBwYXVzZSgwLjUpOyBlbmQ7IGNhdGNoIE1FOyBkaXNwKE1FLm1lc3NhZ2UpOyBleGl0KDEpOyBlbmQ7IGV4aXQoMCk7XCJdXG4gICAgXCJGaWxlIEJhc2VkXCI6XG4gICAgICBjb21tYW5kOiBcIm1hdGxhYlwiXG4gICAgICBhcmdzOiAoY29udGV4dCkgLT4gWyctbm9kZXNrdG9wJywnLW5vc3BsYXNoJywnLXInLFwidHJ5IHJ1bignXCIgKyBjb250ZXh0LmZpbGVwYXRoICsgXCInKTt3aGlsZSB+aXNlbXB0eShnZXQoMCwnQ2hpbGRyZW4nKSk7IHBhdXNlKDAuNSk7IGVuZDsgY2F0Y2ggTUU7IGRpc3AoTUUubWVzc2FnZSk7IGV4aXQoMSk7IGVuZDsgZXhpdCgwKTtcIl1cblxuICAnTUlQUyBBc3NlbWJsZXInOlxuICAgIFwiRmlsZSBCYXNlZFwiOlxuICAgICAgY29tbWFuZDogXCJzcGltXCJcbiAgICAgIGFyZ3M6IChjb250ZXh0KSAtPiBbJy1mJywgY29udGV4dC5maWxlcGF0aF1cblxuICBNb29uU2NyaXB0OlxuICAgIFwiU2VsZWN0aW9uIEJhc2VkXCI6XG4gICAgICBjb21tYW5kOiBcIm1vb25cIlxuICAgICAgYXJnczogKGNvbnRleHQpIC0+IFsnLWUnLCBjb250ZXh0LmdldENvZGUoKV1cbiAgICBcIkZpbGUgQmFzZWRcIjpcbiAgICAgIGNvbW1hbmQ6IFwibW9vblwiXG4gICAgICBhcmdzOiAoY29udGV4dCkgLT4gW2NvbnRleHQuZmlsZXBhdGhdXG5cbiAgJ21vbmdvREIgKEphdmFTY3JpcHQpJzpcbiAgICBcIlNlbGVjdGlvbiBCYXNlZFwiOlxuICAgICAgY29tbWFuZDogXCJtb25nb1wiXG4gICAgICBhcmdzOiAoY29udGV4dCkgLT4gWyctLWV2YWwnLCBjb250ZXh0LmdldENvZGUoKV1cbiAgICBcIkZpbGUgQmFzZWRcIjpcbiAgICAgIGNvbW1hbmQ6ICBcIm1vbmdvXCJcbiAgICAgIGFyZ3M6IChjb250ZXh0KSAtPiBbY29udGV4dC5maWxlcGF0aF1cblxuICBOQ0w6XG4gICAgXCJTZWxlY3Rpb24gQmFzZWRcIjpcbiAgICAgIGNvbW1hbmQ6IFwibmNsXCJcbiAgICAgIGFyZ3M6IChjb250ZXh0KSAtPlxuICAgICAgICBjb2RlID0gY29udGV4dC5nZXRDb2RlKHRydWUpXG4gICAgICAgIGNvZGUgPSBjb2RlICsgXCJcIlwiXG5cbiAgICAgICAgZXhpdFwiXCJcIlxuICAgICAgICB0bXBGaWxlID0gR3JhbW1hclV0aWxzLmNyZWF0ZVRlbXBGaWxlV2l0aENvZGUoY29kZSlcbiAgICAgICAgW3RtcEZpbGVdXG4gICAgXCJGaWxlIEJhc2VkXCI6XG4gICAgICBjb21tYW5kOiBcIm5jbFwiXG4gICAgICBhcmdzOiAoY29udGV4dCkgLT4gW2NvbnRleHQuZmlsZXBhdGhdXG5cbiAgbmV3TElTUDpcbiAgICBcIlNlbGVjdGlvbiBCYXNlZFwiOlxuICAgICAgY29tbWFuZDogXCJuZXdsaXNwXCJcbiAgICAgIGFyZ3M6IChjb250ZXh0KSAtPiBbJy1lJywgY29udGV4dC5nZXRDb2RlKCldXG4gICAgXCJGaWxlIEJhc2VkXCI6XG4gICAgICBjb21tYW5kOiBcIm5ld2xpc3BcIlxuICAgICAgYXJnczogKGNvbnRleHQpIC0+IFtjb250ZXh0LmZpbGVwYXRoXVxuXG4gIE5pbTpcbiAgICBcIkZpbGUgQmFzZWRcIjpcbiAgICAgIGNvbW1hbmQ6IFwiYmFzaFwiXG4gICAgICBhcmdzOiAoY29udGV4dCkgLT5cbiAgICAgICAgZmlsZSA9IEdyYW1tYXJVdGlscy5OaW0uZmluZE5pbVByb2plY3RGaWxlKGNvbnRleHQuZmlsZXBhdGgpXG4gICAgICAgIHBhdGggPSBHcmFtbWFyVXRpbHMuTmltLnByb2plY3REaXIoY29udGV4dC5maWxlcGF0aClcbiAgICAgICAgWyctYycsICdjZCBcIicgKyBwYXRoICsgJ1wiICYmIG5pbSBjIC0taGludHM6b2ZmIC0tcGFyYWxsZWxCdWlsZDoxIC1yIFwiJyArIGZpbGUgKyAnXCIgMj4mMSddXG5cbiAgTlNJUzpcbiAgICBcIlNlbGVjdGlvbiBCYXNlZFwiOlxuICAgICAgY29tbWFuZDogXCJtYWtlbnNpc1wiXG4gICAgICBhcmdzOiAoY29udGV4dCkgLT5cbiAgICAgICAgY29kZSA9IGNvbnRleHQuZ2V0Q29kZSgpXG4gICAgICAgIHRtcEZpbGUgPSBHcmFtbWFyVXRpbHMuY3JlYXRlVGVtcEZpbGVXaXRoQ29kZShjb2RlKVxuICAgICAgICBbdG1wRmlsZV1cbiAgICBcIkZpbGUgQmFzZWRcIjpcbiAgICAgIGNvbW1hbmQ6IFwibWFrZW5zaXNcIlxuICAgICAgYXJnczogKGNvbnRleHQpIC0+IFtjb250ZXh0LmZpbGVwYXRoXVxuXG4gICdPYmplY3RpdmUtQyc6XG4gICAgaWYgR3JhbW1hclV0aWxzLk9wZXJhdGluZ1N5c3RlbS5pc0RhcndpbigpXG4gICAgICBcIkZpbGUgQmFzZWRcIjpcbiAgICAgICAgY29tbWFuZDogXCJiYXNoXCJcbiAgICAgICAgYXJnczogKGNvbnRleHQpIC0+IFsnLWMnLCBcInhjcnVuIGNsYW5nIC1mY29sb3ItZGlhZ25vc3RpY3MgLVdhbGwgLWluY2x1ZGUgc3RkaW8uaCAtZnJhbWV3b3JrIENvY29hIFwiICsgY29udGV4dC5maWxlcGF0aCArIFwiIC1vIC90bXAvb2JqYy1jLm91dCAmJiAvdG1wL29iamMtYy5vdXRcIl1cblxuICAnT2JqZWN0aXZlLUMrKyc6XG4gICAgaWYgR3JhbW1hclV0aWxzLk9wZXJhdGluZ1N5c3RlbS5pc0RhcndpbigpXG4gICAgICBcIkZpbGUgQmFzZWRcIjpcbiAgICAgICAgY29tbWFuZDogXCJiYXNoXCJcbiAgICAgICAgYXJnczogKGNvbnRleHQpIC0+IFsnLWMnLCBcInhjcnVuIGNsYW5nKysgLWZjb2xvci1kaWFnbm9zdGljcyAtV2MrKzExLWV4dGVuc2lvbnMgLVdhbGwgLWluY2x1ZGUgc3RkaW8uaCAtaW5jbHVkZSBpb3N0cmVhbSAtZnJhbWV3b3JrIENvY29hIFwiICsgY29udGV4dC5maWxlcGF0aCArIFwiIC1vIC90bXAvb2JqYy1jcHAub3V0ICYmIC90bXAvb2JqYy1jcHAub3V0XCJdXG5cbiAgT0NhbWw6XG4gICAgXCJGaWxlIEJhc2VkXCI6XG4gICAgICBjb21tYW5kOiBcIm9jYW1sXCJcbiAgICAgIGFyZ3M6IChjb250ZXh0KSAtPiBbY29udGV4dC5maWxlcGF0aF1cblxuICBPY3RhdmU6XG4gICAgXCJTZWxlY3Rpb24gQmFzZWRcIjpcbiAgICAgIGNvbW1hbmQ6IFwib2N0YXZlXCJcbiAgICAgIGFyZ3M6IChjb250ZXh0KSAtPiBbJy1wJywgY29udGV4dC5maWxlcGF0aC5yZXBsYWNlKC9bXlxcL10qJC8sICcnKSwgJy0tZXZhbCcsIGNvbnRleHQuZ2V0Q29kZSgpXVxuICAgIFwiRmlsZSBCYXNlZFwiOlxuICAgICAgY29tbWFuZDogXCJvY3RhdmVcIlxuICAgICAgYXJnczogKGNvbnRleHQpIC0+IFsnLXAnLCBjb250ZXh0LmZpbGVwYXRoLnJlcGxhY2UoL1teXFwvXSokLywgJycpLCBjb250ZXh0LmZpbGVwYXRoXVxuXG4gIE96OlxuICAgIFwiU2VsZWN0aW9uIEJhc2VkXCI6XG4gICAgICBjb21tYW5kOiBcIm96Y1wiXG4gICAgICBhcmdzOiAoY29udGV4dCkgLT5cbiAgICAgICAgY29kZSA9IGNvbnRleHQuZ2V0Q29kZSgpXG4gICAgICAgIHRtcEZpbGUgPSBHcmFtbWFyVXRpbHMuY3JlYXRlVGVtcEZpbGVXaXRoQ29kZShjb2RlKVxuICAgICAgICBbJy1jJywgdG1wRmlsZV1cbiAgICBcIkZpbGUgQmFzZWRcIjpcbiAgICAgIGNvbW1hbmQ6IFwib3pjXCJcbiAgICAgIGFyZ3M6IChjb250ZXh0KSAtPiBbJy1jJywgY29udGV4dC5maWxlcGF0aF1cblxuICAnUGFuZG9jIE1hcmtkb3duJzpcbiAgICBcIkZpbGUgQmFzZWRcIjpcbiAgICAgIGNvbW1hbmQ6IFwicGFuemVyXCJcbiAgICAgIGFyZ3M6IChjb250ZXh0KSAtPiBbY29udGV4dC5maWxlcGF0aCwgXCItLW91dHB1dD1cIiArIGNvbnRleHQuZmlsZXBhdGggKyBcIi5wZGZcIl1cblxuICBQZXJsOlxuICAgIFwiU2VsZWN0aW9uIEJhc2VkXCI6XG4gICAgICBjb21tYW5kOiBcInBlcmxcIlxuICAgICAgYXJnczogKGNvbnRleHQpIC0+XG4gICAgICAgIGNvZGUgPSBjb250ZXh0LmdldENvZGUoKVxuICAgICAgICBmaWxlID0gR3JhbW1hclV0aWxzLlBlcmwuY3JlYXRlVGVtcEZpbGVXaXRoQ29kZShjb2RlKVxuICAgICAgICBbZmlsZV1cbiAgICBcIkZpbGUgQmFzZWRcIjpcbiAgICAgIGNvbW1hbmQ6IFwicGVybFwiXG4gICAgICBhcmdzOiAoY29udGV4dCkgLT4gW2NvbnRleHQuZmlsZXBhdGhdXG5cbiAgXCJQZXJsIDZcIjpcbiAgICBcIlNlbGVjdGlvbiBCYXNlZFwiOlxuICAgICAgY29tbWFuZDogXCJwZXJsNlwiXG4gICAgICBhcmdzOiAoY29udGV4dCkgIC0+IFsnLWUnLCBjb250ZXh0LmdldENvZGUoKV1cbiAgICBcIkZpbGUgQmFzZWRcIjpcbiAgICAgIGNvbW1hbmQ6IFwicGVybDZcIlxuICAgICAgYXJnczogKGNvbnRleHQpIC0+IFtjb250ZXh0LmZpbGVwYXRoXVxuXG4gIFwiUGVybCA2IEZFXCI6XG4gICAgXCJTZWxlY3Rpb24gQmFzZWRcIjpcbiAgICAgIGNvbW1hbmQ6IFwicGVybDZcIlxuICAgICAgYXJnczogKGNvbnRleHQpICAtPiBbJy1lJywgY29udGV4dC5nZXRDb2RlKCldXG4gICAgXCJGaWxlIEJhc2VkXCI6XG4gICAgICBjb21tYW5kOiBcInBlcmw2XCJcbiAgICAgIGFyZ3M6IChjb250ZXh0KSAtPiBbY29udGV4dC5maWxlcGF0aF1cblxuICBQSFA6XG4gICAgXCJTZWxlY3Rpb24gQmFzZWRcIjpcbiAgICAgIGNvbW1hbmQ6IFwicGhwXCJcbiAgICAgIGFyZ3M6IChjb250ZXh0KSAtPlxuICAgICAgICBjb2RlID0gY29udGV4dC5nZXRDb2RlKClcbiAgICAgICAgZmlsZSA9IEdyYW1tYXJVdGlscy5QSFAuY3JlYXRlVGVtcEZpbGVXaXRoQ29kZShjb2RlKVxuICAgICAgICBbZmlsZV1cbiAgICBcIkZpbGUgQmFzZWRcIjpcbiAgICAgIGNvbW1hbmQ6IFwicGhwXCJcbiAgICAgIGFyZ3M6IChjb250ZXh0KSAtPiBbY29udGV4dC5maWxlcGF0aF1cblxuICBQb3dlclNoZWxsOlxuICAgIFwiU2VsZWN0aW9uIEJhc2VkXCI6XG4gICAgICBjb21tYW5kOiBcInBvd2Vyc2hlbGxcIlxuICAgICAgYXJnczogKGNvbnRleHQpIC0+IFtjb250ZXh0LmdldENvZGUoKV1cbiAgICBcIkZpbGUgQmFzZWRcIjpcbiAgICAgIGNvbW1hbmQ6IFwicG93ZXJzaGVsbFwiXG4gICAgICBhcmdzOiAoY29udGV4dCkgLT4gW2NvbnRleHQuZmlsZXBhdGgucmVwbGFjZSAvXFwgL2csIFwiYCBcIl1cblxuICBQcm9jZXNzaW5nOlxuICAgIFwiRmlsZSBCYXNlZFwiOlxuICAgICAgY29tbWFuZDogaWYgR3JhbW1hclV0aWxzLk9wZXJhdGluZ1N5c3RlbS5pc1dpbmRvd3MoKSB0aGVuIFwiY21kXCIgZWxzZSBcImJhc2hcIlxuICAgICAgYXJnczogKGNvbnRleHQpIC0+XG4gICAgICAgIGlmIEdyYW1tYXJVdGlscy5PcGVyYXRpbmdTeXN0ZW0uaXNXaW5kb3dzKClcbiAgICAgICAgICByZXR1cm4gWycvYyBwcm9jZXNzaW5nLWphdmEgLS1za2V0Y2g9Jytjb250ZXh0LmZpbGVwYXRoLnJlcGxhY2UoXCJcXFxcXCIrY29udGV4dC5maWxlbmFtZSxcIlwiKSsnIC0tcnVuJ11cbiAgICAgICAgZWxzZVxuICAgICAgICAgIHJldHVybiBbJy1jJywgJ3Byb2Nlc3NpbmctamF2YSAtLXNrZXRjaD0nK2NvbnRleHQuZmlsZXBhdGgucmVwbGFjZShcIi9cIitjb250ZXh0LmZpbGVuYW1lLFwiXCIpKycgLS1ydW4nXVxuXG5cbiAgUHJvbG9nOlxuICAgIFwiRmlsZSBCYXNlZFwiOlxuICAgICAgY29tbWFuZDogXCJiYXNoXCJcbiAgICAgIGFyZ3M6IChjb250ZXh0KSAtPiBbJy1jJywgJ2NkIFxcXCInICsgY29udGV4dC5maWxlcGF0aC5yZXBsYWNlKC9bXlxcL10qJC8sICcnKSArICdcXFwiOyBzd2lwbCAtZiBcXFwiJyArIGNvbnRleHQuZmlsZXBhdGggKyAnXFxcIiAtdCBtYWluIC0tcXVpZXQnXVxuXG4gIFB1cmVTY3JpcHQ6XG4gICAgXCJGaWxlIEJhc2VkXCI6XG4gICAgICBjb21tYW5kOiBpZiBHcmFtbWFyVXRpbHMuT3BlcmF0aW5nU3lzdGVtLmlzV2luZG93cygpIHRoZW4gXCJjbWRcIiBlbHNlIFwiYmFzaFwiXG4gICAgICBhcmdzOiAoY29udGV4dCkgLT5cbiAgICAgICAgaWYgR3JhbW1hclV0aWxzLk9wZXJhdGluZ1N5c3RlbS5pc1dpbmRvd3MoKVxuICAgICAgICAgIFsnL2MgY2QgXCInICsgY29udGV4dC5maWxlcGF0aC5yZXBsYWNlKC9bXlxcL10qJC8sICcnKSArICdcIiAmJiBwdWxwIHJ1biddXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBbJy1jJywgJ2NkIFwiJyArIGNvbnRleHQuZmlsZXBhdGgucmVwbGFjZSgvW15cXC9dKiQvLCAnJykgKyAnXCIgJiYgcHVscCBydW4nXVxuXG4gIFB5dGhvbjpcbiAgICBcIlNlbGVjdGlvbiBCYXNlZFwiOlxuICAgICAgY29tbWFuZDogXCJweXRob25cIlxuICAgICAgYXJnczogKGNvbnRleHQpICAtPiBbJy11JywgJy1jJywgY29udGV4dC5nZXRDb2RlKCldXG4gICAgXCJGaWxlIEJhc2VkXCI6XG4gICAgICBjb21tYW5kOiBcInB5dGhvblwiXG4gICAgICBhcmdzOiAoY29udGV4dCkgLT4gWyctdScsIGNvbnRleHQuZmlsZXBhdGhdXG5cbiAgUjpcbiAgICBcIlNlbGVjdGlvbiBCYXNlZFwiOlxuICAgICAgY29tbWFuZDogXCJSc2NyaXB0XCJcbiAgICAgIGFyZ3M6IChjb250ZXh0KSAtPlxuICAgICAgICBjb2RlID0gY29udGV4dC5nZXRDb2RlKClcbiAgICAgICAgZmlsZSA9IEdyYW1tYXJVdGlscy5SLmNyZWF0ZVRlbXBGaWxlV2l0aENvZGUoY29kZSlcbiAgICAgICAgW2ZpbGVdXG4gICAgXCJGaWxlIEJhc2VkXCI6XG4gICAgICBjb21tYW5kOiBcIlJzY3JpcHRcIlxuICAgICAgYXJnczogKGNvbnRleHQpIC0+IFtjb250ZXh0LmZpbGVwYXRoXVxuXG4gIFJhY2tldDpcbiAgICBcIlNlbGVjdGlvbiBCYXNlZFwiOlxuICAgICAgY29tbWFuZDogXCJyYWNrZXRcIlxuICAgICAgYXJnczogKGNvbnRleHQpIC0+IFsnLWUnLCBjb250ZXh0LmdldENvZGUoKV1cbiAgICBcIkZpbGUgQmFzZWRcIjpcbiAgICAgIGNvbW1hbmQ6IFwicmFja2V0XCJcbiAgICAgIGFyZ3M6IChjb250ZXh0KSAtPiBbY29udGV4dC5maWxlcGF0aF1cblxuICBSQU5UOlxuICAgIFwiU2VsZWN0aW9uIEJhc2VkXCI6XG4gICAgICBjb21tYW5kOiBcIlJhbnRDb25zb2xlLmV4ZVwiXG4gICAgICBhcmdzOiAoY29udGV4dCkgLT5cbiAgICAgICAgY29kZSA9IGNvbnRleHQuZ2V0Q29kZSh0cnVlKVxuICAgICAgICB0bXBGaWxlID0gR3JhbW1hclV0aWxzLmNyZWF0ZVRlbXBGaWxlV2l0aENvZGUoY29kZSlcbiAgICAgICAgWyctZmlsZScsIHRtcEZpbGVdXG4gICAgXCJGaWxlIEJhc2VkXCI6XG4gICAgICBjb21tYW5kOiBcIlJhbnRDb25zb2xlLmV4ZVwiXG4gICAgICBhcmdzOiAoY29udGV4dCkgLT4gWyctZmlsZScsIGNvbnRleHQuZmlsZXBhdGhdXG5cbiAgUmVhc29uOlxuICAgIFwiRmlsZSBCYXNlZFwiOlxuICAgICAgY29tbWFuZDogaWYgR3JhbW1hclV0aWxzLk9wZXJhdGluZ1N5c3RlbS5pc1dpbmRvd3MoKSB0aGVuIFwiY21kXCIgZWxzZSBcImJhc2hcIlxuICAgICAgYXJnczogKGNvbnRleHQpIC0+XG4gICAgICAgIHByb2duYW1lID0gY29udGV4dC5maWxlbmFtZS5yZXBsYWNlIC9cXC5yZSQvLCBcIlwiXG4gICAgICAgIGFyZ3MgPSBbXVxuICAgICAgICBpZiBHcmFtbWFyVXRpbHMuT3BlcmF0aW5nU3lzdGVtLmlzV2luZG93cygpXG4gICAgICAgICAgYXJncyA9IFtcIi9jIHJlYnVpbGQgI3twcm9nbmFtZX0ubmF0aXZlICYmICN7cHJvZ25hbWV9Lm5hdGl2ZVwiXVxuICAgICAgICBlbHNlXG4gICAgICAgICAgYXJncyA9IFsnLWMnLCBcInJlYnVpbGQgJyN7cHJvZ25hbWV9Lm5hdGl2ZScgJiYgJyN7cHJvZ25hbWV9Lm5hdGl2ZSdcIl1cbiAgICAgICAgcmV0dXJuIGFyZ3NcblxuICBcIlJlbidQeVwiOlxuICAgIFwiRmlsZSBCYXNlZFwiOlxuICAgICAgY29tbWFuZDogXCJyZW5weVwiXG4gICAgICBhcmdzOiAoY29udGV4dCkgLT4gW2NvbnRleHQuZmlsZXBhdGguc3Vic3RyKDAsIGNvbnRleHQuZmlsZXBhdGgubGFzdEluZGV4T2YoXCIvZ2FtZVwiKSldXG5cbiAgJ1JvYm90IEZyYW1ld29yayc6XG4gICAgXCJGaWxlIEJhc2VkXCI6XG4gICAgICBjb21tYW5kOiAncm9ib3QnXG4gICAgICBhcmdzOiAoY29udGV4dCkgLT4gW2NvbnRleHQuZmlsZXBhdGhdXG5cbiAgUlNwZWM6XG4gICAgXCJTZWxlY3Rpb24gQmFzZWRcIjpcbiAgICAgIGNvbW1hbmQ6IFwicnVieVwiXG4gICAgICBhcmdzOiAoY29udGV4dCkgIC0+IFsnLWUnLCBjb250ZXh0LmdldENvZGUoKV1cbiAgICBcIkZpbGUgQmFzZWRcIjpcbiAgICAgIGNvbW1hbmQ6IFwicnNwZWNcIlxuICAgICAgYXJnczogKGNvbnRleHQpIC0+IFsnLS10dHknLCAnLS1jb2xvcicsIGNvbnRleHQuZmlsZXBhdGhdXG4gICAgXCJMaW5lIE51bWJlciBCYXNlZFwiOlxuICAgICAgY29tbWFuZDogXCJyc3BlY1wiXG4gICAgICBhcmdzOiAoY29udGV4dCkgLT4gWyctLXR0eScsICctLWNvbG9yJywgY29udGV4dC5maWxlQ29sb25MaW5lKCldXG5cbiAgUnVieTpcbiAgICBcIlNlbGVjdGlvbiBCYXNlZFwiOlxuICAgICAgY29tbWFuZDogXCJydWJ5XCJcbiAgICAgIGFyZ3M6IChjb250ZXh0KSAgLT4gWyctZScsIGNvbnRleHQuZ2V0Q29kZSgpXVxuICAgIFwiRmlsZSBCYXNlZFwiOlxuICAgICAgY29tbWFuZDogXCJydWJ5XCJcbiAgICAgIGFyZ3M6IChjb250ZXh0KSAtPiBbY29udGV4dC5maWxlcGF0aF1cblxuICAnUnVieSBvbiBSYWlscyc6XG4gICAgXCJTZWxlY3Rpb24gQmFzZWRcIjpcbiAgICAgIGNvbW1hbmQ6IFwicmFpbHNcIlxuICAgICAgYXJnczogKGNvbnRleHQpICAtPiBbJ3J1bm5lcicsIGNvbnRleHQuZ2V0Q29kZSgpXVxuICAgIFwiRmlsZSBCYXNlZFwiOlxuICAgICAgY29tbWFuZDogXCJyYWlsc1wiXG4gICAgICBhcmdzOiAoY29udGV4dCkgLT4gWydydW5uZXInLCBjb250ZXh0LmZpbGVwYXRoXVxuXG4gIFJ1c3Q6XG4gICAgXCJGaWxlIEJhc2VkXCI6XG4gICAgICBjb21tYW5kOiBpZiBHcmFtbWFyVXRpbHMuT3BlcmF0aW5nU3lzdGVtLmlzV2luZG93cygpIHRoZW4gXCJjbWRcIiBlbHNlIFwiYmFzaFwiXG4gICAgICBhcmdzOiAoY29udGV4dCkgLT5cbiAgICAgICAgcHJvZ25hbWUgPSBjb250ZXh0LmZpbGVuYW1lLnJlcGxhY2UgL1xcLnJzJC8sIFwiXCJcbiAgICAgICAgYXJncyA9IFtdXG4gICAgICAgIGlmIEdyYW1tYXJVdGlscy5PcGVyYXRpbmdTeXN0ZW0uaXNXaW5kb3dzKClcbiAgICAgICAgICBhcmdzID0gW1wiL2MgcnVzdGMgI3tjb250ZXh0LmZpbGVwYXRofSAmJiAje3Byb2duYW1lfS5leGVcIl1cbiAgICAgICAgZWxzZVxuICAgICAgICAgIGFyZ3MgPSBbJy1jJywgXCJydXN0YyAnI3tjb250ZXh0LmZpbGVwYXRofScgLW8gL3RtcC9ycy5vdXQgJiYgL3RtcC9ycy5vdXRcIl1cbiAgICAgICAgcmV0dXJuIGFyZ3NcblxuICBTYWdlOlxuICAgIFwiU2VsZWN0aW9uIEJhc2VkXCI6XG4gICAgICBjb21tYW5kOiBcInNhZ2VcIlxuICAgICAgYXJnczogKGNvbnRleHQpIC0+IFsnLWMnLCBjb250ZXh0LmdldENvZGUoKV1cbiAgICBcIkZpbGUgQmFzZWRcIjpcbiAgICAgIGNvbW1hbmQ6IFwic2FnZVwiXG4gICAgICBhcmdzOiAoY29udGV4dCkgLT4gW2NvbnRleHQuZmlsZXBhdGhdXG5cbiAgU2FzczpcbiAgICBcIkZpbGUgQmFzZWRcIjpcbiAgICAgIGNvbW1hbmQ6IFwic2Fzc1wiXG4gICAgICBhcmdzOiAoY29udGV4dCkgLT4gW2NvbnRleHQuZmlsZXBhdGhdXG5cbiAgU2NhbGE6XG4gICAgXCJTZWxlY3Rpb24gQmFzZWRcIjpcbiAgICAgIGNvbW1hbmQ6IFwic2NhbGFcIlxuICAgICAgYXJnczogKGNvbnRleHQpICAtPiBbJy1lJywgY29udGV4dC5nZXRDb2RlKCldXG4gICAgXCJGaWxlIEJhc2VkXCI6XG4gICAgICBjb21tYW5kOiBcInNjYWxhXCJcbiAgICAgIGFyZ3M6IChjb250ZXh0KSAtPiBbY29udGV4dC5maWxlcGF0aF1cblxuICBTY2hlbWU6XG4gICAgXCJTZWxlY3Rpb24gQmFzZWRcIjpcbiAgICAgIGNvbW1hbmQ6IFwiZ3VpbGVcIlxuICAgICAgYXJnczogKGNvbnRleHQpICAtPiBbJy1jJywgY29udGV4dC5nZXRDb2RlKCldXG4gICAgXCJGaWxlIEJhc2VkXCI6XG4gICAgICBjb21tYW5kOiBcImd1aWxlXCJcbiAgICAgIGFyZ3M6IChjb250ZXh0KSAtPiBbY29udGV4dC5maWxlcGF0aF1cblxuICBTQ1NTOlxuICAgIFwiRmlsZSBCYXNlZFwiOlxuICAgICAgY29tbWFuZDogXCJzYXNzXCJcbiAgICAgIGFyZ3M6IChjb250ZXh0KSAtPiBbY29udGV4dC5maWxlcGF0aF1cblxuICBcIlNoZWxsIFNjcmlwdFwiOlxuICAgIFwiU2VsZWN0aW9uIEJhc2VkXCI6XG4gICAgICBjb21tYW5kOiBwcm9jZXNzLmVudi5TSEVMTFxuICAgICAgYXJnczogKGNvbnRleHQpICAtPiBbJy1jJywgY29udGV4dC5nZXRDb2RlKCldXG4gICAgXCJGaWxlIEJhc2VkXCI6XG4gICAgICBjb21tYW5kOiBwcm9jZXNzLmVudi5TSEVMTFxuICAgICAgYXJnczogKGNvbnRleHQpIC0+IFtjb250ZXh0LmZpbGVwYXRoXVxuXG4gIFwiU2hlbGwgU2NyaXB0IChGaXNoKVwiOlxuICAgIFwiU2VsZWN0aW9uIEJhc2VkXCI6XG4gICAgICBjb21tYW5kOiBcImZpc2hcIlxuICAgICAgYXJnczogKGNvbnRleHQpICAtPiBbJy1jJywgY29udGV4dC5nZXRDb2RlKCldXG4gICAgXCJGaWxlIEJhc2VkXCI6XG4gICAgICBjb21tYW5kOiBcImZpc2hcIlxuICAgICAgYXJnczogKGNvbnRleHQpIC0+IFtjb250ZXh0LmZpbGVwYXRoXVxuXG4gIFwiU1FMXCI6XG4gICAgXCJTZWxlY3Rpb24gQmFzZWRcIjpcbiAgICAgIGNvbW1hbmQ6IFwiZWNob1wiXG4gICAgICBhcmdzOiAoY29udGV4dCkgLT4gWydTUUwgcmVxdWlyZXMgc2V0dGluZyBcXCdTY3JpcHQ6IFJ1biBPcHRpb25zXFwnIGRpcmVjdGx5LiBTZWUgaHR0cHM6Ly9naXRodWIuY29tL3JnYmtyay9hdG9tLXNjcmlwdC90cmVlL21hc3Rlci9leGFtcGxlcy9oZWxsby5zcWwgZm9yIGZ1cnRoZXIgaW5mb3JtYXRpb24uJ11cbiAgICBcIkZpbGUgQmFzZWRcIjpcbiAgICAgIGNvbW1hbmQ6IFwiZWNob1wiXG4gICAgICBhcmdzOiAoY29udGV4dCkgLT4gWydTUUwgcmVxdWlyZXMgc2V0dGluZyBcXCdTY3JpcHQ6IFJ1biBPcHRpb25zXFwnIGRpcmVjdGx5LiBTZWUgaHR0cHM6Ly9naXRodWIuY29tL3JnYmtyay9hdG9tLXNjcmlwdC90cmVlL21hc3Rlci9leGFtcGxlcy9oZWxsby5zcWwgZm9yIGZ1cnRoZXIgaW5mb3JtYXRpb24uJ11cblxuICBcIlNRTCAoUG9zdGdyZVNRTClcIjpcbiAgICBcIlNlbGVjdGlvbiBCYXNlZFwiOlxuICAgICAgY29tbWFuZDogXCJwc3FsXCJcbiAgICAgIGFyZ3M6IChjb250ZXh0KSAtPiBbJy1jJywgY29udGV4dC5nZXRDb2RlKCldXG4gICAgXCJGaWxlIEJhc2VkXCI6XG4gICAgICBjb21tYW5kOiBcInBzcWxcIlxuICAgICAgYXJnczogKGNvbnRleHQpIC0+IFsnLWYnLCBjb250ZXh0LmZpbGVwYXRoXVxuXG4gIFwiU3RhbmRhcmQgTUxcIjpcbiAgICBcIkZpbGUgQmFzZWRcIjpcbiAgICAgIGNvbW1hbmQ6IFwic21sXCJcbiAgICAgIGFyZ3M6IChjb250ZXh0KSAtPiBbY29udGV4dC5maWxlcGF0aF1cblxuICBTdGF0YTpcbiAgICBcIlNlbGVjdGlvbiBCYXNlZFwiOlxuICAgICAgY29tbWFuZDogXCJzdGF0YVwiXG4gICAgICBhcmdzOiAoY29udGV4dCkgIC0+IFsnZG8nLCBjb250ZXh0LmdldENvZGUoKV1cbiAgICBcIkZpbGUgQmFzZWRcIjpcbiAgICAgIGNvbW1hbmQ6IFwic3RhdGFcIlxuICAgICAgYXJnczogKGNvbnRleHQpIC0+IFsnZG8nLCBjb250ZXh0LmZpbGVwYXRoXVxuXG4gIFN3aWZ0OlxuICAgIFwiRmlsZSBCYXNlZFwiOlxuICAgICAgY29tbWFuZDogXCJzd2lmdFwiXG4gICAgICBhcmdzOiAoY29udGV4dCkgLT4gW2NvbnRleHQuZmlsZXBhdGhdXG5cbiAgVGNsOlxuICAgIFwiU2VsZWN0aW9uIEJhc2VkXCI6XG4gICAgICBjb21tYW5kOiBcInRjbHNoXCJcbiAgICAgIGFyZ3M6IChjb250ZXh0KSAtPlxuICAgICAgICBjb2RlID0gY29udGV4dC5nZXRDb2RlKClcbiAgICAgICAgdG1wRmlsZSA9IEdyYW1tYXJVdGlscy5jcmVhdGVUZW1wRmlsZVdpdGhDb2RlKGNvZGUpXG4gICAgICAgIFt0bXBGaWxlXVxuICAgIFwiRmlsZSBCYXNlZFwiOlxuICAgICAgY29tbWFuZDogXCJ0Y2xzaFwiXG4gICAgICBhcmdzOiAoY29udGV4dCkgLT4gW2NvbnRleHQuZmlsZXBhdGhdXG5cbiAgVHVyaW5nOlxuICAgIFwiRmlsZSBCYXNlZFwiOlxuICAgICAgY29tbWFuZDogXCJ0dXJpbmdcIlxuICAgICAgYXJnczogKGNvbnRleHQpIC0+IFsnLXJ1bicsIGNvbnRleHQuZmlsZXBhdGhdXG5cbiAgVHlwZVNjcmlwdDpcbiAgICBcIlNlbGVjdGlvbiBCYXNlZFwiOlxuICAgICAgY29tbWFuZDogXCJ0cy1ub2RlXCJcbiAgICAgIGFyZ3M6IChjb250ZXh0KSAtPiBbJy1lJywgY29udGV4dC5nZXRDb2RlKCldXG4gICAgXCJGaWxlIEJhc2VkXCI6XG4gICAgICBjb21tYW5kOiBcInRzLW5vZGVcIlxuICAgICAgYXJnczogKGNvbnRleHQpIC0+IFtjb250ZXh0LmZpbGVwYXRoXVxuXG4gIFZCU2NyaXB0OlxuICAgICdTZWxlY3Rpb24gQmFzZWQnOlxuICAgICAgY29tbWFuZDogJ2NzY3JpcHQnXG4gICAgICBhcmdzOiAoY29udGV4dCkgLT5cbiAgICAgICAgY29kZSA9IGNvbnRleHQuZ2V0Q29kZSgpXG4gICAgICAgIHRtcEZpbGUgPSBHcmFtbWFyVXRpbHMuY3JlYXRlVGVtcEZpbGVXaXRoQ29kZShjb2RlLCBcIi52YnNcIilcbiAgICAgICAgWycvL05PTE9HTycsdG1wRmlsZV1cbiAgICAnRmlsZSBCYXNlZCc6XG4gICAgICBjb21tYW5kOiAnY3NjcmlwdCdcbiAgICAgIGFyZ3M6IChjb250ZXh0KSAtPiBbJy8vTk9MT0dPJywgY29udGV4dC5maWxlcGF0aF1cblxuICBIVE1MOlxuICAgIFwiRmlsZSBCYXNlZFwiOlxuICAgICAgY29tbWFuZDogJ2VjaG8nXG4gICAgICBhcmdzOiAoY29udGV4dCkgLT5cbiAgICAgICAgdXJpID0gJ2ZpbGU6Ly8nICsgY29udGV4dC5maWxlcGF0aFxuICAgICAgICBzaGVsbC5vcGVuRXh0ZXJuYWwodXJpKVxuICAgICAgICBbJ0hUTUwgZmlsZSBvcGVuZWQgYXQ6JywgdXJpXVxuIl19
