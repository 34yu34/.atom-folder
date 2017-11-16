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
          return ['--transpile', '-e', context.getCode()];
        }
      },
      "File Based": {
        command: "coffee",
        args: function(context) {
          return ['-t', context.filepath];
        }
      }
    },
    "CoffeeScript (Literate)": {
      'Selection Based': {
        command: 'coffee',
        args: function(context) {
          return ['-t', '-e', context.getCode()];
        }
      },
      'File Based': {
        command: 'coffee',
        args: function(context) {
          return ['-t', context.filepath];
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
    "Free Pascal": {
      "Selection Based": {
        command: "fsc",
        args: function(context) {
          var code, tmpFile;
          code = context.getCode();
          tmpFile = GrammarUtils.createTempFileWithCode(code);
          return [tmpFile];
        }
      },
      "File Based": {
        command: "fsc",
        args: function(context) {
          return [context.filepath];
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
    'JavaScript with JSX': {
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYmlsbHkvLmF0b20vcGFja2FnZXMvc2NyaXB0L2xpYi9ncmFtbWFycy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBR0E7QUFBQSxNQUFBOztFQUFBLENBQUEsR0FBSSxPQUFBLENBQVEsWUFBUjs7RUFDSixJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7O0VBQ1AsWUFBQSxHQUFlLE9BQUEsQ0FBUSxzQkFBUjs7RUFDZixLQUFBLEdBQVEsT0FBQSxDQUFRLFVBQVIsQ0FBbUIsQ0FBQzs7RUFFNUIsTUFBTSxDQUFDLE9BQVAsR0FDRTtJQUFBLFVBQUEsRUFDRTtNQUFBLFlBQUEsRUFDRTtRQUFBLE9BQUEsRUFBUyxTQUFUO1FBQ0EsSUFBQSxFQUFNLFNBQUMsT0FBRDtpQkFBYSxDQUFDLGlCQUFELEVBQW9CLE9BQU8sQ0FBQyxRQUE1QjtRQUFiLENBRE47T0FERjtLQURGO0lBS0EsT0FBQSxFQUNFO01BQUEsWUFBQSxFQUNFO1FBQUEsT0FBQSxFQUFTLGtCQUFUO1FBQ0EsSUFBQSxFQUFNLFNBQUMsT0FBRDtpQkFBYSxDQUFDLE9BQU8sQ0FBQyxRQUFUO1FBQWIsQ0FETjtPQURGO0tBTkY7SUFVQSxXQUFBLEVBQ0U7TUFBQSxpQkFBQSxFQUNFO1FBQUEsT0FBQSxFQUFTLFdBQVQ7UUFDQSxJQUFBLEVBQU0sU0FBQyxPQUFEO2lCQUFjLENBQUMsSUFBRCxFQUFPLE9BQU8sQ0FBQyxPQUFSLENBQUEsQ0FBUDtRQUFkLENBRE47T0FERjtNQUdBLFlBQUEsRUFDRTtRQUFBLE9BQUEsRUFBUyxXQUFUO1FBQ0EsSUFBQSxFQUFNLFNBQUMsT0FBRDtpQkFBYSxDQUFDLE9BQU8sQ0FBQyxRQUFUO1FBQWIsQ0FETjtPQUpGO0tBWEY7SUFrQkEsVUFBQSxFQUNFO01BQUEsWUFBQSxFQUNFO1FBQUEsT0FBQSxFQUFTLFlBQVQ7UUFDQSxJQUFBLEVBQU0sU0FBQyxPQUFEO2lCQUFhLENBQUMsT0FBTyxD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QUEsRUFDRTtNQUFBLGlCQUFBLEVBQ0U7UUFBQSxPQUFBLEVBQVMsU0FBVDtRQUNBLElBQUEsRUFBTSxTQUFDLE9BQUQ7aUJBQWEsQ0FBQyxJQUFELEVBQU8sT0FBTyxDQUFDLE9BQVIsQ0FBQSxDQUFQO1FBQWIsQ0FETjtPQURGO01BR0EsWUFBQSxFQUNFO1FBQUEsT0FBQSxFQUFTLFNBQVQ7UUFDQSxJQUFBLEVBQU0sU0FBQyxPQUFEO2lCQUFhLENBQUMsT0FBTyxDQUFDLFFBQVQ7UUFBYixDQUROO09BSkY7S0E5NkJGO0lBcTdCQSxRQUFBLEVBQ0U7TUFBQSxpQkFBQSxFQUNFO1FBQUEsT0FBQSxFQUFTLFNBQVQ7UUFDQSxJQUFBLEVBQU0sU0FBQyxPQUFEO0FBQ0osY0FBQTtVQUFBLElBQUEsR0FBTyxPQUFPLENBQUMsT0FBUixDQUFBO1VBQ1AsT0FBQSxHQUFVLFlBQVksQ0FBQyxzQkFBYixDQUFvQyxJQUFwQyxFQUEwQyxNQUExQztpQkFDVixDQUFDLFVBQUQsRUFBWSxPQUFaO1FBSEksQ0FETjtPQURGO01BTUEsWUFBQSxFQUNFO1FBQUEsT0FBQSxFQUFTLFNBQVQ7UUFDQSxJQUFBLEVBQU0sU0FBQyxPQUFEO2lCQUFhLENBQUMsVUFBRCxFQUFhLE9BQU8sQ0FBQyxRQUFyQjtRQUFiLENBRE47T0FQRjtLQXQ3QkY7SUFnOEJBLElBQUEsRUFDRTtNQUFBLFlBQUEsRUFDRTtRQUFBLE9BQUEsRUFBUyxNQUFUO1FBQ0EsSUFBQSxFQUFNLFNBQUMsT0FBRDtBQUNKLGNBQUE7VUFBQSxHQUFBLEdBQU0sU0FBQSxHQUFZLE9BQU8sQ0FBQztVQUMxQixLQUFLLENBQUMsWUFBTixDQUFtQixHQUFuQjtpQkFDQSxDQUFDLHNCQUFELEVBQXlCLEdBQXpCO1FBSEksQ0FETjtPQURGO0tBajhCRjs7QUFORiIsInNvdXJjZXNDb250ZW50IjpbIiMgTWFwcyBBdG9tIEdyYW1tYXIgbmFtZXMgdG8gdGhlIGNvbW1hbmQgdXNlZCBieSB0aGF0IGxhbmd1YWdlXG4jIEFzIHdlbGwgYXMgYW55IHNwZWNpYWwgc2V0dXAgZm9yIGFyZ3VtZW50cy5cblxuXyA9IHJlcXVpcmUgJ3VuZGVyc2NvcmUnXG5wYXRoID0gcmVxdWlyZSAncGF0aCdcbkdyYW1tYXJVdGlscyA9IHJlcXVpcmUgJy4uL2xpYi9ncmFtbWFyLXV0aWxzJ1xuc2hlbGwgPSByZXF1aXJlKCdlbGVjdHJvbicpLnNoZWxsXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgJzFDIChCU0wpJzpcbiAgICAnRmlsZSBCYXNlZCc6XG4gICAgICBjb21tYW5kOiBcIm9zY3JpcHRcIlxuICAgICAgYXJnczogKGNvbnRleHQpIC0+IFsnLWVuY29kaW5nPXV0Zi04JywgY29udGV4dC5maWxlcGF0aF1cblxuICBBbnNpYmxlOlxuICAgIFwiRmlsZSBCYXNlZFwiOlxuICAgICAgY29tbWFuZDogXCJhbnNpYmxlLXBsYXlib29rXCJcbiAgICAgIGFyZ3M6IChjb250ZXh0KSAtPiBbY29udGV4dC5maWxlcGF0aF1cblxuICBBcHBsZVNjcmlwdDpcbiAgICAnU2VsZWN0aW9uIEJhc2VkJzpcbiAgICAgIGNvbW1hbmQ6ICdvc2FzY3JpcHQnXG4gICAgICBhcmdzOiAoY29udGV4dCkgIC0+IFsnLWUnLCBjb250ZXh0LmdldENvZGUoKV1cbiAgICAnRmlsZSBCYXNlZCc6XG4gICAgICBjb21tYW5kOiAnb3Nhc2NyaXB0J1xuICAgICAgYXJnczogKGNvbnRleHQpIC0+IFtjb250ZXh0LmZpbGVwYXRoXVxuXG4gIEF1dG9Ib3RLZXk6XG4gICAgXCJGaWxlIEJhc2VkXCI6XG4gICAgICBjb21tYW5kOiBcIkF1dG9Ib3RLZXlcIlxuICAgICAgYXJnczogKGNvbnRleHQpIC0+IFtjb250ZXh0LmZpbGVwYXRoXVxuICAgIFwiU2VsZWN0aW9uIEJhc2VkXCI6XG4gICAgICBjb21tYW5kOiBcIkF1dG9Ib3RLZXlcIlxuICAgICAgYXJnczogKGNvbnRleHQpIC0+XG4gICAgICAgIGNvZGUgPSBjb250ZXh0LmdldENvZGUodHJ1ZSlcbiAgICAgICAgdG1wRmlsZSA9IEdyYW1tYXJVdGlscy5jcmVhdGVUZW1wRmlsZVdpdGhDb2RlKGNvZGUpXG4gICAgICAgIFt0bXBGaWxlXVxuXG4gICdCYWJlbCBFUzYgSmF2YVNjcmlwdCc6XG4gICAgXCJTZWxlY3Rpb24gQmFzZWRcIjpcbiAgICAgIGNvbW1hbmQ6IFwiYmFiZWwtbm9kZVwiXG4gICAgICBhcmdzOiAoY29udGV4dCkgLT4gWyctZScsIGNvbnRleHQuZ2V0Q29kZSgpXVxuICAgIFwiRmlsZSBCYXNlZFwiOlxuICAgICAgY29tbWFuZDogXCJiYWJlbC1ub2RlXCJcbiAgICAgIGFyZ3M6IChjb250ZXh0KSAtPiBbY29udGV4dC5maWxlcGF0aF1cblxuICAnQmFzaCBBdXRvbWF0ZWQgVGVzdCBTeXN0ZW0gKEJhdHMpJzpcbiAgICBcIkZpbGUgQmFzZWRcIjpcbiAgICAgIGNvbW1hbmQ6IFwiYmF0c1wiXG4gICAgICBhcmdzOiAoY29udGV4dCkgLT4gW2NvbnRleHQuZmlsZXBhdGhdXG4gICAgXCJTZWxlY3Rpb24gQmFzZWRcIjpcbiAgICAgIGNvbW1hbmQ6ICdiYXRzJ1xuICAgICAgYXJnczogKGNvbnRleHQpIC0+XG4gICAgICAgIGNvZGUgPSBjb250ZXh0LmdldENvZGUodHJ1ZSlcbiAgICAgICAgdG1wRmlsZSA9IEdyYW1tYXJVdGlscy5jcmVhdGVUZW1wRmlsZVdpdGhDb2RlKGNvZGUpXG4gICAgICAgIFt0bXBGaWxlXVxuXG4gIEJhdGNoOlxuICAgIFwiRmlsZSBCYXNlZFwiOlxuICAgICAgY29tbWFuZDogXCJjbWQuZXhlXCJcbiAgICAgIGFyZ3M6IChjb250ZXh0KSAtPiBbJy9xJywgJy9jJywgY29udGV4dC5maWxlcGF0aF1cblxuICAnQmVoYXQgRmVhdHVyZSc6XG4gICAgXCJGaWxlIEJhc2VkXCI6XG4gICAgICBjb21tYW5kOiBcImJlaGF0XCJcbiAgICAgIGFyZ3M6IChjb250ZXh0KSAtPiBbY29udGV4dC5maWxlcGF0aF1cbiAgICBcIkxpbmUgTnVtYmVyIEJhc2VkXCI6XG4gICAgICBjb21tYW5kOiBcImJlaGF0XCJcbiAgICAgIGFyZ3M6IChjb250ZXh0KSAtPiBbY29udGV4dC5maWxlQ29sb25MaW5lKCldXG5cbiAgQnVja2xlU2NyaXB0OlxuICAgIFwiU2VsZWN0aW9uIEJhc2VkXCI6XG4gICAgICBjb21tYW5kOiBcImJzY1wiXG4gICAgICBhcmdzOiAoY29udGV4dCkgLT5cbiAgICAgICAgY29kZSA9IGNvbnRleHQuZ2V0Q29kZSgpXG4gICAgICAgIHRtcEZpbGUgPSBHcmFtbWFyVXRpbHMuY3JlYXRlVGVtcEZpbGVXaXRoQ29kZShjb2RlKVxuICAgICAgICBbJy1jJywgdG1wRmlsZV1cbiAgICBcIkZpbGUgQmFzZWRcIjpcbiAgICAgIGNvbW1hbmQ6IFwiYnNjXCJcbiAgICAgIGFyZ3M6IChjb250ZXh0KSAtPiBbJy1jJywgY29udGV4dC5maWxlcGF0aF1cblxuICBDOlxuICAgIFwiRmlsZSBCYXNlZFwiOlxuICAgICAgY29tbWFuZDogXCJiYXNoXCJcbiAgICAgIGFyZ3M6IChjb250ZXh0KSAtPlxuICAgICAgICBhcmdzID0gW11cbiAgICAgICAgaWYgR3JhbW1hclV0aWxzLk9wZXJhdGluZ1N5c3RlbS5pc0RhcndpbigpXG4gICAgICAgICAgYXJncyA9IFsnLWMnLCBcInhjcnVuIGNsYW5nIC1mY29sb3ItZGlhZ25vc3RpY3MgLVdhbGwgLWluY2x1ZGUgc3RkaW8uaCAnXCIgKyBjb250ZXh0LmZpbGVwYXRoICsgXCInIC1vIC90bXAvYy5vdXQgJiYgL3RtcC9jLm91dFwiXVxuICAgICAgICBlbHNlIGlmIEdyYW1tYXJVdGlscy5PcGVyYXRpbmdTeXN0ZW0uaXNMaW51eCgpXG4gICAgICAgICAgYXJncyA9IFtcIi1jXCIsIFwiY2MgLVdhbGwgLWluY2x1ZGUgc3RkaW8uaCAnXCIgKyBjb250ZXh0LmZpbGVwYXRoICsgXCInIC1vIC90bXAvYy5vdXQgJiYgL3RtcC9jLm91dFwiXVxuICAgICAgICByZXR1cm4gYXJnc1xuICAgIFwiU2VsZWN0aW9uIEJhc2VkXCI6XG4gICAgICBjb21tYW5kOiBcImJhc2hcIlxuICAgICAgYXJnczogKGNvbnRleHQpIC0+XG4gICAgICAgIGNvZGUgPSBjb250ZXh0LmdldENvZGUodHJ1ZSlcbiAgICAgICAgdG1wRmlsZSA9IEdyYW1tYXJVdGlscy5jcmVhdGVUZW1wRmlsZVdpdGhDb2RlKGNvZGUsIFwiLmNcIilcbiAgICAgICAgYXJncyA9IFtdXG4gICAgICAgIGlmIEdyYW1tYXJVdGlscy5PcGVyYXRpbmdTeXN0ZW0uaXNEYXJ3aW4oKVxuICAgICAgICAgIGFyZ3MgPSBbJy1jJywgXCJ4Y3J1biBjbGFuZyAtZmNvbG9yLWRpYWdub3N0aWNzIC1XYWxsIC1pbmNsdWRlIHN0ZGlvLmggJ1wiICsgdG1wRmlsZSArIFwiJyAtbyAvdG1wL2Mub3V0ICYmIC90bXAvYy5vdXRcIl1cbiAgICAgICAgZWxzZSBpZiBHcmFtbWFyVXRpbHMuT3BlcmF0aW5nU3lzdGVtLmlzTGludXgoKVxuICAgICAgICAgIGFyZ3MgPSBbXCItY1wiLCBcImNjIC1XYWxsIC1pbmNsdWRlIHN0ZGlvLmggJ1wiICsgdG1wRmlsZSArIFwiJyAtbyAvdG1wL2Mub3V0ICYmIC90bXAvYy5vdXRcIl1cbiAgICAgICAgcmV0dXJuIGFyZ3NcblxuICAnQyMnOlxuICAgIFwiRmlsZSBCYXNlZFwiOlxuICAgICAgY29tbWFuZDogaWYgR3JhbW1hclV0aWxzLk9wZXJhdGluZ1N5c3RlbS5pc1dpbmRvd3MoKSB0aGVuIFwiY21kXCIgZWxzZSBcImJhc2hcIlxuICAgICAgYXJnczogKGNvbnRleHQpIC0+XG4gICAgICAgIHByb2duYW1lID0gY29udGV4dC5maWxlbmFtZS5yZXBsYWNlIC9cXC5jcyQvLCBcIlwiXG4gICAgICAgIGFyZ3MgPSBbXVxuICAgICAgICBpZiBHcmFtbWFyVXRpbHMuT3BlcmF0aW5nU3lzdGVtLmlzV2luZG93cygpXG4gICAgICAgICAgYXJncyA9IFtcIi9jIGNzYyAje2NvbnRleHQuZmlsZXBhdGh9ICYmICN7cHJvZ25hbWV9LmV4ZVwiXVxuICAgICAgICBlbHNlXG4gICAgICAgICAgYXJncyA9IFsnLWMnLCBcImNzYyAje2NvbnRleHQuZmlsZXBhdGh9ICYmIG1vbm8gI3twcm9nbmFtZX0uZXhlXCJdXG4gICAgICAgIHJldHVybiBhcmdzXG4gICAgXCJTZWxlY3Rpb24gQmFzZWRcIjpcbiAgICAgIGNvbW1hbmQ6IGlmIEdyYW1tYXJVdGlscy5PcGVyYXRpbmdTeXN0ZW0uaXNXaW5kb3dzKCkgdGhlbiBcImNtZFwiIGVsc2UgXCJiYXNoXCJcbiAgICAgIGFyZ3M6IChjb250ZXh0KSAtPlxuICAgICAgICBjb2RlID0gY29udGV4dC5nZXRDb2RlKHRydWUpXG4gICAgICAgIHRtcEZpbGUgPSBHcmFtbWFyVXRpbHMuY3JlYXRlVGVtcEZpbGVXaXRoQ29kZShjb2RlLCBcIi5jc1wiKVxuICAgICAgICBwcm9nbmFtZSA9IHRtcEZpbGUucmVwbGFjZSAvXFwuY3MkLywgXCJcIlxuICAgICAgICBhcmdzID0gW11cbiAgICAgICAgaWYgR3JhbW1hclV0aWxzLk9wZXJhdGluZ1N5c3RlbS5pc1dpbmRvd3MoKVxuICAgICAgICAgIGFyZ3MgPSBbXCIvYyBjc2MgL291dDoje3Byb2duYW1lfS5leGUgI3t0bXBGaWxlfSAmJiAje3Byb2duYW1lfS5leGVcIl1cbiAgICAgICAgZWxzZVxuICAgICAgICAgIGFyZ3MgPSBbJy1jJywgXCJjc2MgL291dDoje3Byb2duYW1lfS5leGUgI3t0bXBGaWxlfSAmJiBtb25vICN7cHJvZ25hbWV9LmV4ZVwiXVxuICAgICAgICByZXR1cm4gYXJnc1xuXG4gICdDIyBTY3JpcHQgRmlsZSc6XG4gICAgXCJGaWxlIEJhc2VkXCI6XG4gICAgICBjb21tYW5kOiBcInNjcmlwdGNzXCJcbiAgICAgIGFyZ3M6IChjb250ZXh0KSAtPiBbJy1zY3JpcHQnLCBjb250ZXh0LmZpbGVwYXRoXVxuICAgIFwiU2VsZWN0aW9uIEJhc2VkXCI6XG4gICAgICBjb21tYW5kOiBcInNjcmlwdGNzXCJcbiAgICAgIGFyZ3M6IChjb250ZXh0KSAtPlxuICAgICAgICBjb2RlID0gY29udGV4dC5nZXRDb2RlKHRydWUpXG4gICAgICAgIHRtcEZpbGUgPSBHcmFtbWFyVXRpbHMuY3JlYXRlVGVtcEZpbGVXaXRoQ29kZShjb2RlLCBcIi5jc3hcIilcbiAgICAgICAgWyctc2NyaXB0JywgdG1wRmlsZV1cblxuICAnQysrJzpcbiAgICBpZiBHcmFtbWFyVXRpbHMuT3BlcmF0aW5nU3lzdGVtLmlzRGFyd2luKClcbiAgICAgIFwiU2VsZWN0aW9uIEJhc2VkXCI6XG4gICAgICAgIGNvbW1hbmQ6IFwiYmFzaFwiXG4gICAgICAgIGFyZ3M6IChjb250ZXh0KSAtPlxuICAgICAgICAgIGNvZGUgPSBjb250ZXh0LmdldENvZGUodHJ1ZSlcbiAgICAgICAgICB0bXBGaWxlID0gR3JhbW1hclV0aWxzLmNyZWF0ZVRlbXBGaWxlV2l0aENvZGUoY29kZSwgXCIuY3BwXCIpXG4gICAgICAgICAgW1wiLWNcIiwgXCJ4Y3J1biBjbGFuZysrIC1mY29sb3ItZGlhZ25vc3RpY3MgLXN0ZD1jKysxNCAtV2FsbCAtaW5jbHVkZSBzdGRpby5oIC1pbmNsdWRlIGlvc3RyZWFtICdcIiArIHRtcEZpbGUgKyBcIicgLW8gL3RtcC9jcHAub3V0ICYmIC90bXAvY3BwLm91dFwiXVxuICAgICAgXCJGaWxlIEJhc2VkXCI6XG4gICAgICAgIGNvbW1hbmQ6IFwiYmFzaFwiXG4gICAgICAgIGFyZ3M6IChjb250ZXh0KSAtPiBbJy1jJywgXCJ4Y3J1biBjbGFuZysrIC1mY29sb3ItZGlhZ25vc3RpY3MgLXN0ZD1jKysxNCAtV2FsbCAtaW5jbHVkZSBzdGRpby5oIC1pbmNsdWRlIGlvc3RyZWFtICdcIiArIGNvbnRleHQuZmlsZXBhdGggKyBcIicgLW8gL3RtcC9jcHAub3V0ICYmIC90bXAvY3BwLm91dFwiXVxuICAgIGVsc2UgaWYgR3JhbW1hclV0aWxzLk9wZXJhdGluZ1N5c3RlbS5pc0xpbnV4KClcbiAgICAgIFwiU2VsZWN0aW9uIEJhc2VkXCI6XG4gICAgICAgIGNvbW1hbmQ6IFwiYmFzaFwiXG4gICAgICAgIGFyZ3M6IChjb250ZXh0KSAtPlxuICAgICAgICAgIGNvZGUgPSBjb250ZXh0LmdldENvZGUodHJ1ZSlcbiAgICAgICAgICB0bXBGaWxlID0gR3JhbW1hclV0aWxzLmNyZWF0ZVRlbXBGaWxlV2l0aENvZGUoY29kZSwgXCIuY3BwXCIpXG4gICAgICAgICAgW1wiLWNcIiwgXCJnKysgLXN0ZD1jKysxNCAtV2FsbCAtaW5jbHVkZSBzdGRpby5oIC1pbmNsdWRlIGlvc3RyZWFtICdcIiArIHRtcEZpbGUgKyBcIicgLW8gL3RtcC9jcHAub3V0ICYmIC90bXAvY3BwLm91dFwiXVxuICAgICAgXCJGaWxlIEJhc2VkXCI6XG4gICAgICAgIGNvbW1hbmQ6IFwiYmFzaFwiXG4gICAgICAgIGFyZ3M6IChjb250ZXh0KSAtPiBbXCItY1wiLCBcImcrKyAtc3RkPWMrKzE0IC1XYWxsIC1pbmNsdWRlIHN0ZGlvLmggLWluY2x1ZGUgaW9zdHJlYW0gJ1wiICsgY29udGV4dC5maWxlcGF0aCArIFwiJyAtbyAvdG1wL2NwcC5vdXQgJiYgL3RtcC9jcHAub3V0XCJdXG4gICAgZWxzZSBpZiBHcmFtbWFyVXRpbHMuT3BlcmF0aW5nU3lzdGVtLmlzV2luZG93cygpIGFuZCBHcmFtbWFyVXRpbHMuT3BlcmF0aW5nU3lzdGVtLnJlbGVhc2UoKS5zcGxpdChcIi5cIikuc2xpY2UgLTEgPj0gJzE0Mzk5J1xuICAgICAgXCJGaWxlIEJhc2VkXCI6XG4gICAgICAgIGNvbW1hbmQ6IFwiYmFzaFwiXG4gICAgICAgIGFyZ3M6IChjb250ZXh0KSAtPiBbXCItY1wiLCBcImcrKyAtc3RkPWMrKzE0IC1XYWxsIC1pbmNsdWRlIHN0ZGlvLmggLWluY2x1ZGUgaW9zdHJlYW0gJy9tbnQvXCIgKyBwYXRoLnBvc2l4LmpvaW4uYXBwbHkocGF0aC5wb3NpeCwgW10uY29uY2F0KFtjb250ZXh0LmZpbGVwYXRoLnNwbGl0KHBhdGgud2luMzIuc2VwKVswXS50b0xvd2VyQ2FzZSgpXSwgY29udGV4dC5maWxlcGF0aC5zcGxpdChwYXRoLndpbjMyLnNlcCkuc2xpY2UoMSkpKS5yZXBsYWNlKFwiOlwiLCBcIlwiKSArIFwiJyAtbyAvdG1wL2NwcC5vdXQgJiYgL3RtcC9jcHAub3V0XCJdXG5cbiAgJ0MrKzE0JzpcbiAgICBpZiBHcmFtbWFyVXRpbHMuT3BlcmF0aW5nU3lzdGVtLmlzRGFyd2luKClcbiAgICAgIFwiU2VsZWN0aW9uIEJhc2VkXCI6XG4gICAgICAgIGNvbW1hbmQ6IFwiYmFzaFwiXG4gICAgICAgIGFyZ3M6IChjb250ZXh0KSAtPlxuICAgICAgICAgIGNvZGUgPSBjb250ZXh0LmdldENvZGUodHJ1ZSlcbiAgICAgICAgICB0bXBGaWxlID0gR3JhbW1hclV0aWxzLmNyZWF0ZVRlbXBGaWxlV2l0aENvZGUoY29kZSwgXCIuY3BwXCIpXG4gICAgICAgICAgW1wiLWNcIiwgXCJ4Y3J1biBjbGFuZysrIC1mY29sb3ItZGlhZ25vc3RpY3MgLXN0ZD1jKysxNCAtV2FsbCAtaW5jbHVkZSBzdGRpby5oIC1pbmNsdWRlIGlvc3RyZWFtICdcIiArIHRtcEZpbGUgKyBcIicgLW8gL3RtcC9jcHAub3V0ICYmIC90bXAvY3BwLm91dFwiXVxuICAgICAgXCJGaWxlIEJhc2VkXCI6XG4gICAgICAgIGNvbW1hbmQ6IFwiYmFzaFwiXG4gICAgICAgIGFyZ3M6IChjb250ZXh0KSAtPiBbJy1jJywgXCJ4Y3J1biBjbGFuZysrIC1mY29sb3ItZGlhZ25vc3RpY3MgLXN0ZD1jKysxNCAtV2FsbCAtaW5jbHVkZSBzdGRpby5oIC1pbmNsdWRlIGlvc3RyZWFtICdcIiArIGNvbnRleHQuZmlsZXBhdGggKyBcIicgLW8gL3RtcC9jcHAub3V0ICYmIC90bXAvY3BwLm91dFwiXVxuICAgIGVsc2UgaWYgR3JhbW1hclV0aWxzLk9wZXJhdGluZ1N5c3RlbS5pc0xpbnV4KClcbiAgICAgIFwiU2VsZWN0aW9uIEJhc2VkXCI6XG4gICAgICAgIGNvbW1hbmQ6IFwiYmFzaFwiXG4gICAgICAgIGFyZ3M6IChjb250ZXh0KSAtPlxuICAgICAgICAgIGNvZGUgPSBjb250ZXh0LmdldENvZGUodHJ1ZSlcbiAgICAgICAgICB0bXBGaWxlID0gR3JhbW1hclV0aWxzLmNyZWF0ZVRlbXBGaWxlV2l0aENvZGUoY29kZSwgXCIuY3BwXCIpXG4gICAgICAgICAgW1wiLWNcIiwgXCJnKysgLXN0ZD1jKysxNCAtV2FsbCAtaW5jbHVkZSBzdGRpby5oIC1pbmNsdWRlIGlvc3RyZWFtICdcIiArIHRtcEZpbGUgKyBcIicgLW8gL3RtcC9jcHAub3V0ICYmIC90bXAvY3BwLm91dFwiXVxuICAgICAgXCJGaWxlIEJhc2VkXCI6XG4gICAgICAgIGNvbW1hbmQ6IFwiYmFzaFwiXG4gICAgICAgIGFyZ3M6IChjb250ZXh0KSAtPiBbXCItY1wiLCBcImcrKyAtc3RkPWMrKzE0IC1XYWxsIC1pbmNsdWRlIHN0ZGlvLmggLWluY2x1ZGUgaW9zdHJlYW0gJ1wiICsgY29udGV4dC5maWxlcGF0aCArIFwiJyAtbyAvdG1wL2NwcC5vdXQgJiYgL3RtcC9jcHAub3V0XCJdXG4gICAgZWxzZSBpZiBHcmFtbWFyVXRpbHMuT3BlcmF0aW5nU3lzdGVtLmlzV2luZG93cygpIGFuZCBHcmFtbWFyVXRpbHMuT3BlcmF0aW5nU3lzdGVtLnJlbGVhc2UoKS5zcGxpdChcIi5cIikuc2xpY2UgLTEgPj0gJzE0Mzk5J1xuICAgICAgXCJGaWxlIEJhc2VkXCI6XG4gICAgICAgIGNvbW1hbmQ6IFwiYmFzaFwiXG4gICAgICAgIGFyZ3M6IChjb250ZXh0KSAtPiBbXCItY1wiLCBcImcrKyAtc3RkPWMrKzE0IC1XYWxsIC1pbmNsdWRlIHN0ZGlvLmggLWluY2x1ZGUgaW9zdHJlYW0gJy9tbnQvXCIgKyBwYXRoLnBvc2l4LmpvaW4uYXBwbHkocGF0aC5wb3NpeCwgW10uY29uY2F0KFtjb250ZXh0LmZpbGVwYXRoLnNwbGl0KHBhdGgud2luMzIuc2VwKVswXS50b0xvd2VyQ2FzZSgpXSwgY29udGV4dC5maWxlcGF0aC5zcGxpdChwYXRoLndpbjMyLnNlcCkuc2xpY2UoMSkpKS5yZXBsYWNlKFwiOlwiLCBcIlwiKSArIFwiJyAtbyAvdG1wL2NwcC5vdXQgJiYgL3RtcC9jcHAub3V0XCJdXG5cbiAgQ2xvanVyZTpcbiAgICBcIlNlbGVjdGlvbiBCYXNlZFwiOlxuICAgICAgY29tbWFuZDogXCJsZWluXCJcbiAgICAgIGFyZ3M6IChjb250ZXh0KSAgLT4gWydleGVjJywgJy1lJywgY29udGV4dC5nZXRDb2RlKCldXG4gICAgXCJGaWxlIEJhc2VkXCI6XG4gICAgICBjb21tYW5kOiBcImxlaW5cIlxuICAgICAgYXJnczogKGNvbnRleHQpIC0+IFsnZXhlYycsIGNvbnRleHQuZmlsZXBhdGhdXG5cbiAgQ29mZmVlU2NyaXB0OlxuICAgIFwiU2VsZWN0aW9uIEJhc2VkXCI6XG4gICAgICBjb21tYW5kOiBcImNvZmZlZVwiXG4gICAgICBhcmdzOiAoY29udGV4dCkgLT4gWyctLXRyYW5zcGlsZScsICctZScsIGNvbnRleHQuZ2V0Q29kZSgpXVxuICAgIFwiRmlsZSBCYXNlZFwiOlxuICAgICAgY29tbWFuZDogXCJjb2ZmZWVcIlxuICAgICAgYXJnczogKGNvbnRleHQpIC0+IFsnLXQnLCBjb250ZXh0LmZpbGVwYXRoXVxuXG4gIFwiQ29mZmVlU2NyaXB0IChMaXRlcmF0ZSlcIjpcbiAgICAnU2VsZWN0aW9uIEJhc2VkJzpcbiAgICAgIGNvbW1hbmQ6ICdjb2ZmZWUnXG4gICAgICBhcmdzOiAoY29udGV4dCkgLT4gWyctdCcsICctZScsIGNvbnRleHQuZ2V0Q29kZSgpXVxuICAgICdGaWxlIEJhc2VkJzpcbiAgICAgIGNvbW1hbmQ6ICdjb2ZmZWUnXG4gICAgICBhcmdzOiAoY29udGV4dCkgLT4gWyctdCcsIGNvbnRleHQuZmlsZXBhdGhdXG5cbiAgXCJDb21tb24gTGlzcFwiOlxuICAgIFwiRmlsZSBCYXNlZFwiOlxuICAgICAgY29tbWFuZDogXCJjbGlzcFwiXG4gICAgICBhcmdzOiAoY29udGV4dCkgLT4gW2NvbnRleHQuZmlsZXBhdGhdXG5cbiAgQ3J5c3RhbDpcbiAgICBcIlNlbGVjdGlvbiBCYXNlZFwiOlxuICAgICAgY29tbWFuZDogXCJjcnlzdGFsXCJcbiAgICAgIGFyZ3M6IChjb250ZXh0KSAgLT4gWydldmFsJywgY29udGV4dC5nZXRDb2RlKCldXG4gICAgXCJGaWxlIEJhc2VkXCI6XG4gICAgICBjb21tYW5kOiBcImNyeXN0YWxcIlxuICAgICAgYXJnczogKGNvbnRleHQpIC0+IFtjb250ZXh0LmZpbGVwYXRoXVxuXG4gIEQ6XG4gICAgXCJTZWxlY3Rpb24gQmFzZWRcIjpcbiAgICAgIGNvbW1hbmQ6IFwicmRtZFwiXG4gICAgICBhcmdzOiAoY29udGV4dCkgIC0+XG4gICAgICAgIGNvZGUgPSBjb250ZXh0LmdldENvZGUodHJ1ZSlcbiAgICAgICAgdG1wRmlsZSA9IEdyYW1tYXJVdGlscy5ELmNyZWF0ZVRlbXBGaWxlV2l0aENvZGUoY29kZSlcbiAgICAgICAgW3RtcEZpbGVdXG4gICAgXCJGaWxlIEJhc2VkXCI6XG4gICAgICBjb21tYW5kOiBcInJkbWRcIlxuICAgICAgYXJnczogKGNvbnRleHQpIC0+IFtjb250ZXh0LmZpbGVwYXRoXVxuXG4gIERhcnQ6XG4gICAgXCJTZWxlY3Rpb24gQmFzZWRcIjpcbiAgICAgIGNvbW1hbmQ6IFwiZGFydFwiXG4gICAgICBhcmdzOiAoY29udGV4dCkgLT5cbiAgICAgICAgY29kZSA9IGNvbnRleHQuZ2V0Q29kZSh0cnVlKVxuICAgICAgICB0bXBGaWxlID0gR3JhbW1hclV0aWxzLmNyZWF0ZVRlbXBGaWxlV2l0aENvZGUoY29kZSwgXCIuZGFydFwiKVxuICAgICAgICBbdG1wRmlsZV1cbiAgICBcIkZpbGUgQmFzZWRcIjpcbiAgICAgIGNvbW1hbmQ6IFwiZGFydFwiXG4gICAgICBhcmdzOiAoY29udGV4dCkgLT4gW2NvbnRleHQuZmlsZXBhdGhdXG5cbiAgXCJHcmFwaHZpeiAoRE9UKVwiOlxuICAgIFwiU2VsZWN0aW9uIEJhc2VkXCI6XG4gICAgICBjb21tYW5kOiBcImRvdFwiXG4gICAgICBhcmdzOiAoY29udGV4dCkgLT5cbiAgICAgICAgY29kZSA9IGNvbnRleHQuZ2V0Q29kZSh0cnVlKVxuICAgICAgICB0bXBGaWxlID0gR3JhbW1hclV0aWxzLmNyZWF0ZVRlbXBGaWxlV2l0aENvZGUoY29kZSwgXCIuZG90XCIpXG4gICAgICAgIFsnLVRwbmcnLCB0bXBGaWxlLCAnLW8nLCB0bXBGaWxlICsgJy5wbmcnXVxuICAgIFwiRmlsZSBCYXNlZFwiOlxuICAgICAgY29tbWFuZDogXCJkb3RcIlxuICAgICAgYXJnczogKGNvbnRleHQpIC0+IFsnLVRwbmcnLCBjb250ZXh0LmZpbGVwYXRoLCAnLW8nLCBjb250ZXh0LmZpbGVwYXRoICsgJy5wbmcnXVxuICBET1Q6XG4gICAgXCJTZWxlY3Rpb24gQmFzZWRcIjpcbiAgICAgIGNvbW1hbmQ6IFwiZG90XCJcbiAgICAgIGFyZ3M6IChjb250ZXh0KSAtPlxuICAgICAgICBjb2RlID0gY29udGV4dC5nZXRDb2RlKHRydWUpXG4gICAgICAgIHRtcEZpbGUgPSBHcmFtbWFyVXRpbHMuY3JlYXRlVGVtcEZpbGVXaXRoQ29kZShjb2RlLCBcIi5kb3RcIilcbiAgICAgICAgWyctVHBuZycsIHRtcEZpbGUsICctbycsIHRtcEZpbGUgKyAnLnBuZyddXG4gICAgXCJGaWxlIEJhc2VkXCI6XG4gICAgICBjb21tYW5kOiBcImRvdFwiXG4gICAgICBhcmdzOiAoY29udGV4dCkgLT4gWyctVHBuZycsIGNvbnRleHQuZmlsZXBhdGgsICctbycsIGNvbnRleHQuZmlsZXBhdGggKyAnLnBuZyddXG5cbiAgRWxpeGlyOlxuICAgIFwiU2VsZWN0aW9uIEJhc2VkXCI6XG4gICAgICBjb21tYW5kOiBcImVsaXhpclwiXG4gICAgICBhcmdzOiAoY29udGV4dCkgIC0+IFsnLWUnLCBjb250ZXh0LmdldENvZGUoKV1cbiAgICBcIkZpbGUgQmFzZWRcIjpcbiAgICAgIGNvbW1hbmQ6IFwiZWxpeGlyXCJcbiAgICAgIGFyZ3M6IChjb250ZXh0KSAtPiBbJy1yJywgY29udGV4dC5maWxlcGF0aF1cblxuICBFcmxhbmc6XG4gICAgXCJTZWxlY3Rpb24gQmFzZWRcIjpcbiAgICAgIGNvbW1hbmQ6IFwiZXJsXCJcbiAgICAgIGFyZ3M6IChjb250ZXh0KSAgLT4gWyctbm9zaGVsbCcsICctZXZhbCcsIFwiI3tjb250ZXh0LmdldENvZGUoKX0sIGluaXQ6c3RvcCgpLlwiXVxuXG4gICdGIyc6XG4gICAgXCJGaWxlIEJhc2VkXCI6XG4gICAgICBjb21tYW5kOiBpZiBHcmFtbWFyVXRpbHMuT3BlcmF0aW5nU3lzdGVtLmlzV2luZG93cygpIHRoZW4gXCJmc2lcIiBlbHNlIFwiZnNoYXJwaVwiXG4gICAgICBhcmdzOiAoY29udGV4dCkgLT4gWyctLWV4ZWMnLCBjb250ZXh0LmZpbGVwYXRoXVxuXG4gICdGKic6XG4gICAgXCJGaWxlIEJhc2VkXCI6XG4gICAgICBjb21tYW5kOiBcImZzdGFyXCJcbiAgICAgIGFyZ3M6IChjb250ZXh0KSAtPiBbY29udGV4dC5maWxlcGF0aF1cblxuICBGYWJsZTpcbiAgICBcIlNlbGVjdGlvbiBCYXNlZFwiOlxuICAgICAgY29tbWFuZDogXCJmYWJsZVwiXG4gICAgICBhcmdzOiAoY29udGV4dCkgLT5cbiAgICAgICAgY29kZSA9IGNvbnRleHQuZ2V0Q29kZSgpXG4gICAgICAgIHRtcEZpbGUgPSBHcmFtbWFyVXRpbHMuY3JlYXRlVGVtcEZpbGVXaXRoQ29kZShjb2RlKVxuICAgICAgICBbdG1wRmlsZV1cbiAgICBcIkZpbGUgQmFzZWRcIjpcbiAgICAgIGNvbW1hbmQ6IFwiZmFibGVcIlxuICAgICAgYXJnczogKGNvbnRleHQpIC0+IFtjb250ZXh0LmZpbGVwYXRoXVxuXG4gIEZvcnRoOlxuICAgIFwiRmlsZSBCYXNlZFwiOlxuICAgICAgY29tbWFuZDogXCJnZm9ydGhcIlxuICAgICAgYXJnczogKGNvbnRleHQpIC0+IFtjb250ZXh0LmZpbGVwYXRoXVxuXG4gIFwiRm9ydHJhbiAtIEZpeGVkIEZvcm1cIjpcbiAgICBcIkZpbGUgQmFzZWRcIjpcbiAgICAgIGNvbW1hbmQ6IFwiYmFzaFwiXG4gICAgICBhcmdzOiAoY29udGV4dCkgLT4gWyctYycsIFwiZ2ZvcnRyYW4gJ1wiICsgY29udGV4dC5maWxlcGF0aCArIFwiJyAtZmZpeGVkLWZvcm0gLW8gL3RtcC9mLm91dCAmJiAvdG1wL2Yub3V0XCJdXG5cbiAgXCJGb3J0cmFuIC0gRnJlZSBGb3JtXCI6XG4gICAgXCJGaWxlIEJhc2VkXCI6XG4gICAgICBjb21tYW5kOiBcImJhc2hcIlxuICAgICAgYXJnczogKGNvbnRleHQpIC0+IFsnLWMnLCBcImdmb3J0cmFuICdcIiArIGNvbnRleHQuZmlsZXBhdGggKyBcIicgLWZmcmVlLWZvcm0gLW8gL3RtcC9mOTAub3V0ICYmIC90bXAvZjkwLm91dFwiXVxuXG4gIFwiRm9ydHJhbiAtIE1vZGVyblwiOlxuICAgIFwiRmlsZSBCYXNlZFwiOlxuICAgICAgY29tbWFuZDogXCJiYXNoXCJcbiAgICAgIGFyZ3M6IChjb250ZXh0KSAtPiBbJy1jJywgXCJnZm9ydHJhbiAnXCIgKyBjb250ZXh0LmZpbGVwYXRoICsgXCInIC1mZnJlZS1mb3JtIC1vIC90bXAvZjkwLm91dCAmJiAvdG1wL2Y5MC5vdXRcIl1cblxuICBcIkZvcnRyYW4gLSBQdW5jaGNhcmRcIjpcbiAgICBcIkZpbGUgQmFzZWRcIjpcbiAgICAgIGNvbW1hbmQ6IFwiYmFzaFwiXG4gICAgICBhcmdzOiAoY29udGV4dCkgLT4gWyctYycsIFwiZ2ZvcnRyYW4gJ1wiICsgY29udGV4dC5maWxlcGF0aCArIFwiJyAtZmZpeGVkLWZvcm0gLW8gL3RtcC9mLm91dCAmJiAvdG1wL2Yub3V0XCJdXG4gICAgICBcbiAgXCJGcmVlIFBhc2NhbFwiOlxuICAgIFwiU2VsZWN0aW9uIEJhc2VkXCI6XG4gICAgICBjb21tYW5kOiBcImZzY1wiXG4gICAgICBhcmdzOiAoY29udGV4dCkgLT5cbiAgICAgICAgY29kZSA9IGNvbnRleHQuZ2V0Q29kZSgpXG4gICAgICAgIHRtcEZpbGUgPSBHcmFtbWFyVXRpbHMuY3JlYXRlVGVtcEZpbGVXaXRoQ29kZShjb2RlKVxuICAgICAgICBbdG1wRmlsZV1cbiAgICBcIkZpbGUgQmFzZWRcIjpcbiAgICAgIGNvbW1hbmQ6IFwiZnNjXCJcbiAgICAgIGFyZ3M6IChjb250ZXh0KSAtPiBbY29udGV4dC5maWxlcGF0aF1cblxuICBHaGVya2luOlxuICAgIFwiRmlsZSBCYXNlZFwiOlxuICAgICAgY29tbWFuZDogXCJjdWN1bWJlclwiXG4gICAgICBhcmdzOiAoY29udGV4dCkgLT4gWyctLWNvbG9yJywgY29udGV4dC5maWxlcGF0aF1cbiAgICBcIkxpbmUgTnVtYmVyIEJhc2VkXCI6XG4gICAgICBjb21tYW5kOiBcImN1Y3VtYmVyXCJcbiAgICAgIGFyZ3M6IChjb250ZXh0KSAtPiBbJy0tY29sb3InLCBjb250ZXh0LmZpbGVDb2xvbkxpbmUoKV1cblxuICBnbnVwbG90OlxuICAgIFwiRmlsZSBCYXNlZFwiOlxuICAgICAgY29tbWFuZDogXCJnbnVwbG90XCJcbiAgICAgIGFyZ3M6IChjb250ZXh0KSAtPiBbJy1wJywgY29udGV4dC5maWxlcGF0aF1cbiAgICAgIHdvcmtpbmdEaXJlY3Rvcnk6IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVBhbmVJdGVtKCk/LmJ1ZmZlcj8uZmlsZT8uZ2V0UGFyZW50PygpLmdldFBhdGg/KClcblxuICBHbzpcbiAgICBcIkZpbGUgQmFzZWRcIjpcbiAgICAgIGNvbW1hbmQ6IFwiZ29cIlxuICAgICAgYXJnczogKGNvbnRleHQpIC0+XG4gICAgICAgIGlmIGNvbnRleHQuZmlsZXBhdGgubWF0Y2goL190ZXN0LmdvLykgdGhlbiBbJ3Rlc3QnLCAnJyBdXG4gICAgICAgIGVsc2UgWydydW4nLCBjb250ZXh0LmZpbGVwYXRoXVxuICAgICAgd29ya2luZ0RpcmVjdG9yeTogYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlUGFuZUl0ZW0oKT8uYnVmZmVyPy5maWxlPy5nZXRQYXJlbnQ/KCkuZ2V0UGF0aD8oKVxuXG4gIEdyb292eTpcbiAgICBcIlNlbGVjdGlvbiBCYXNlZFwiOlxuICAgICAgY29tbWFuZDogXCJncm9vdnlcIlxuICAgICAgYXJnczogKGNvbnRleHQpICAtPiBbJy1lJywgY29udGV4dC5nZXRDb2RlKCldXG4gICAgXCJGaWxlIEJhc2VkXCI6XG4gICAgICBjb21tYW5kOiBcImdyb292eVwiXG4gICAgICBhcmdzOiAoY29udGV4dCkgLT4gW2NvbnRleHQuZmlsZXBhdGhdXG5cbiAgSGFza2VsbDpcbiAgICBcIkZpbGUgQmFzZWRcIjpcbiAgICAgIGNvbW1hbmQ6IFwicnVuaGFza2VsbFwiXG4gICAgICBhcmdzOiAoY29udGV4dCkgLT4gW2NvbnRleHQuZmlsZXBhdGhdXG4gICAgXCJTZWxlY3Rpb24gQmFzZWRcIjpcbiAgICAgIGNvbW1hbmQ6IFwiZ2hjXCJcbiAgICAgIGFyZ3M6IChjb250ZXh0KSAgLT4gWyctZScsIGNvbnRleHQuZ2V0Q29kZSgpXVxuXG4gIEh5OlxuICAgIFwiRmlsZSBCYXNlZFwiOlxuICAgICAgY29tbWFuZDogXCJoeVwiXG4gICAgICBhcmdzOiAoY29udGV4dCkgLT4gW2NvbnRleHQuZmlsZXBhdGhdXG4gICAgXCJTZWxlY3Rpb24gQmFzZWRcIjpcbiAgICAgIGNvbW1hbmQ6IFwiaHlcIlxuICAgICAgYXJnczogKGNvbnRleHQpIC0+XG4gICAgICAgIGNvZGUgPSBjb250ZXh0LmdldENvZGUodHJ1ZSlcbiAgICAgICAgdG1wRmlsZSA9IEdyYW1tYXJVdGlscy5jcmVhdGVUZW1wRmlsZVdpdGhDb2RlKGNvZGUsIFwiLmh5XCIpXG4gICAgICAgIFt0bXBGaWxlXVxuXG4gIEljZWRDb2ZmZWVTY3JpcHQ6XG4gICAgXCJTZWxlY3Rpb24gQmFzZWRcIjpcbiAgICAgIGNvbW1hbmQ6IFwiaWNlZFwiXG4gICAgICBhcmdzOiAoY29udGV4dCkgIC0+IFsnLWUnLCBjb250ZXh0LmdldENvZGUoKV1cbiAgICBcIkZpbGUgQmFzZWRcIjpcbiAgICAgIGNvbW1hbmQ6IFwiaWNlZFwiXG4gICAgICBhcmdzOiAoY29udGV4dCkgLT4gW2NvbnRleHQuZmlsZXBhdGhdXG5cbiAgSWRyaXM6XG4gICAgXCJGaWxlIEJhc2VkXCI6XG4gICAgICBjb21tYW5kOiBcImlkcmlzXCJcbiAgICAgIGFyZ3M6IChjb250ZXh0KSAtPiBbY29udGV4dC5maWxlcGF0aCwgJy1vJywgcGF0aC5iYXNlbmFtZShjb250ZXh0LmZpbGVwYXRoLCBwYXRoLmV4dG5hbWUoY29udGV4dC5maWxlcGF0aCkpXVxuXG4gIElubm9TZXR1cDpcbiAgICBcIkZpbGUgQmFzZWRcIjpcbiAgICAgIGNvbW1hbmQ6IFwiSVNDQy5leGVcIlxuICAgICAgYXJnczogKGNvbnRleHQpIC0+IFsnL1EnLCBjb250ZXh0LmZpbGVwYXRoXVxuXG4gIGlvTGFuZ3VhZ2U6XG4gICAgXCJTZWxlY3Rpb24gQmFzZWRcIjpcbiAgICAgIGNvbW1hbmQ6IFwiaW9cIlxuICAgICAgYXJnczogKGNvbnRleHQpIC0+IFtjb250ZXh0LmdldENvZGUoKV1cbiAgICBcIkZpbGUgQmFzZWRcIjpcbiAgICAgIGNvbW1hbmQ6IFwiaW9cIlxuICAgICAgYXJnczogKGNvbnRleHQpIC0+IFsnLWUnLCBjb250ZXh0LmZpbGVwYXRoXVxuXG4gIEphdmE6XG4gICAgXCJGaWxlIEJhc2VkXCI6XG4gICAgICBjb21tYW5kOiBpZiBHcmFtbWFyVXRpbHMuT3BlcmF0aW5nU3lzdGVtLmlzV2luZG93cygpIHRoZW4gXCJjbWRcIiBlbHNlIFwiYmFzaFwiXG4gICAgICBhcmdzOiAoY29udGV4dCkgLT5cbiAgICAgICAgY2xhc3NOYW1lID0gR3JhbW1hclV0aWxzLkphdmEuZ2V0Q2xhc3NOYW1lIGNvbnRleHRcbiAgICAgICAgY2xhc3NQYWNrYWdlcyA9IEdyYW1tYXJVdGlscy5KYXZhLmdldENsYXNzUGFja2FnZSBjb250ZXh0XG4gICAgICAgIHNvdXJjZVBhdGggPSBHcmFtbWFyVXRpbHMuSmF2YS5nZXRQcm9qZWN0UGF0aCBjb250ZXh0XG5cbiAgICAgICAgYXJncyA9IFtdXG4gICAgICAgIGlmIEdyYW1tYXJVdGlscy5PcGVyYXRpbmdTeXN0ZW0uaXNXaW5kb3dzKClcbiAgICAgICAgICBhcmdzID0gW1wiL2MgamF2YWMgLVhsaW50ICN7Y29udGV4dC5maWxlbmFtZX0gJiYgamF2YSAje2NsYXNzTmFtZX1cIl1cbiAgICAgICAgZWxzZVxuICAgICAgICAgIGFyZ3MgPSBbJy1jJywgXCJqYXZhYyAtc291cmNlcGF0aCAje3NvdXJjZVBhdGh9IC1kIC90bXAgJyN7Y29udGV4dC5maWxlcGF0aH0nICYmIGphdmEgLWNwIC90bXAgI3tjbGFzc1BhY2thZ2VzfSN7Y2xhc3NOYW1lfVwiXVxuXG4gICAgICAgIHJldHVybiBhcmdzXG5cbiAgSmF2YVNjcmlwdDpcbiAgICBcIlNlbGVjdGlvbiBCYXNlZFwiOlxuICAgICAgY29tbWFuZDogXCJiYWJlbC1ub2RlXCJcbiAgICAgIGFyZ3M6IChjb250ZXh0KSAgLT4gWyctZScsIGNvbnRleHQuZ2V0Q29kZSgpXVxuICAgIFwiRmlsZSBCYXNlZFwiOlxuICAgICAgY29tbWFuZDogXCJiYWJlbC1ub2RlXCJcbiAgICAgIGFyZ3M6IChjb250ZXh0KSAtPiBbY29udGV4dC5maWxlcGF0aF1cblxuICAnSmF2YVNjcmlwdCB3aXRoIEpTWCc6XG4gICAgXCJTZWxlY3Rpb24gQmFzZWRcIjpcbiAgICAgIGNvbW1hbmQ6IFwiYmFiZWwtbm9kZVwiXG4gICAgICBhcmdzOiAoY29udGV4dCkgIC0+IFsnLWUnLCBjb250ZXh0LmdldENvZGUoKV1cbiAgICBcIkZpbGUgQmFzZWRcIjpcbiAgICAgIGNvbW1hbmQ6IFwiYmFiZWwtbm9kZVwiXG4gICAgICBhcmdzOiAoY29udGV4dCkgLT4gW2NvbnRleHQuZmlsZXBhdGhdXG5cbiAgXCJKYXZhU2NyaXB0IGZvciBBdXRvbWF0aW9uIChKWEEpXCI6XG4gICAgXCJTZWxlY3Rpb24gQmFzZWRcIjpcbiAgICAgIGNvbW1hbmQ6IFwib3Nhc2NyaXB0XCJcbiAgICAgIGFyZ3M6IChjb250ZXh0KSAgLT4gWyctbCcsICdKYXZhU2NyaXB0JywgJy1lJywgY29udGV4dC5nZXRDb2RlKCldXG4gICAgXCJGaWxlIEJhc2VkXCI6XG4gICAgICBjb21tYW5kOiBcIm9zYXNjcmlwdFwiXG4gICAgICBhcmdzOiAoY29udGV4dCkgLT4gWyctbCcsICdKYXZhU2NyaXB0JywgY29udGV4dC5maWxlcGF0aF1cblxuICBKb2xpZTpcbiAgICBcIkZpbGUgQmFzZWRcIjpcbiAgICAgIGNvbW1hbmQ6IFwiam9saWVcIlxuICAgICAgYXJnczogKGNvbnRleHQpIC0+IFtjb250ZXh0LmZpbGVwYXRoXVxuXG4gIEp1bGlhOlxuICAgIFwiU2VsZWN0aW9uIEJhc2VkXCI6XG4gICAgICBjb21tYW5kOiBcImp1bGlhXCJcbiAgICAgIGFyZ3M6IChjb250ZXh0KSAgLT4gWyctZScsIGNvbnRleHQuZ2V0Q29kZSgpXVxuICAgIFwiRmlsZSBCYXNlZFwiOlxuICAgICAgY29tbWFuZDogXCJqdWxpYVwiXG4gICAgICBhcmdzOiAoY29udGV4dCkgLT4gW2NvbnRleHQuZmlsZXBhdGhdXG5cbiAgS290bGluOlxuICAgIFwiU2VsZWN0aW9uIEJhc2VkXCI6XG4gICAgICBjb21tYW5kOiBcImJhc2hcIlxuICAgICAgYXJnczogKGNvbnRleHQpIC0+XG4gICAgICAgIGNvZGUgPSBjb250ZXh0LmdldENvZGUodHJ1ZSlcbiAgICAgICAgdG1wRmlsZSA9IEdyYW1tYXJVdGlscy5jcmVhdGVUZW1wRmlsZVdpdGhDb2RlKGNvZGUsIFwiLmt0XCIpXG4gICAgICAgIGphck5hbWUgPSB0bXBGaWxlLnJlcGxhY2UgL1xcLmt0JC8sIFwiLmphclwiXG4gICAgICAgIGFyZ3MgPSBbJy1jJywgXCJrb3RsaW5jICN7dG1wRmlsZX0gLWluY2x1ZGUtcnVudGltZSAtZCAje2phck5hbWV9ICYmIGphdmEgLWphciAje2phck5hbWV9XCJdXG4gICAgICAgIHJldHVybiBhcmdzXG4gICAgXCJGaWxlIEJhc2VkXCI6XG4gICAgICBjb21tYW5kOiBcImJhc2hcIlxuICAgICAgYXJnczogKGNvbnRleHQpIC0+XG4gICAgICAgIGphck5hbWUgPSBjb250ZXh0LmZpbGVuYW1lLnJlcGxhY2UgL1xcLmt0JC8sIFwiLmphclwiXG4gICAgICAgIGFyZ3MgPSBbJy1jJywgXCJrb3RsaW5jICN7Y29udGV4dC5maWxlcGF0aH0gLWluY2x1ZGUtcnVudGltZSAtZCAvdG1wLyN7amFyTmFtZX0gJiYgamF2YSAtamFyIC90bXAvI3tqYXJOYW1lfVwiXVxuICAgICAgICByZXR1cm4gYXJnc1xuXG4gIExBTU1QUzpcbiAgICBpZiBHcmFtbWFyVXRpbHMuT3BlcmF0aW5nU3lzdGVtLmlzRGFyd2luKCkgfHwgR3JhbW1hclV0aWxzLk9wZXJhdGluZ1N5c3RlbS5pc0xpbnV4KClcbiAgICAgIFwiRmlsZSBCYXNlZFwiOlxuICAgICAgICBjb21tYW5kOiBcImxhbW1wc1wiXG4gICAgICAgIGFyZ3M6IChjb250ZXh0KSAtPiBbJy1sb2cnLCAnbm9uZScsICctaW4nLCBjb250ZXh0LmZpbGVwYXRoXVxuXG4gIExhVGVYOlxuICAgIFwiRmlsZSBCYXNlZFwiOlxuICAgICAgY29tbWFuZDogXCJsYXRleG1rXCJcbiAgICAgIGFyZ3M6IChjb250ZXh0KSAtPiBbJy1jZCcsICctcXVpZXQnLCAnLXBkZicsICctcHYnLCAnLXNoZWxsLWVzY2FwZScsIGNvbnRleHQuZmlsZXBhdGhdXG5cbiAgJ0xhVGVYIEJlYW1lcic6XG4gICAgXCJGaWxlIEJhc2VkXCI6XG4gICAgICBjb21tYW5kOiBcImxhdGV4bWtcIlxuICAgICAgYXJnczogKGNvbnRleHQpIC0+IFsnLWNkJywgJy1xdWlldCcsICctcGRmJywgJy1wdicsICctc2hlbGwtZXNjYXBlJywgY29udGV4dC5maWxlcGF0aF1cblxuICBMaWx5UG9uZDpcbiAgICBcIkZpbGUgQmFzZWRcIjpcbiAgICAgIGNvbW1hbmQ6IFwibGlseXBvbmRcIlxuICAgICAgYXJnczogKGNvbnRleHQpIC0+IFtjb250ZXh0LmZpbGVwYXRoXVxuXG4gIExpc3A6XG4gICAgXCJTZWxlY3Rpb24gQmFzZWRcIjpcbiAgICAgIGNvbW1hbmQ6IFwic2JjbFwiXG4gICAgICBhcmdzOiAoY29udGV4dCkgLT5cbiAgICAgICAgc3RhdGVtZW50cyA9IF8uZmxhdHRlbihfLm1hcChHcmFtbWFyVXRpbHMuTGlzcC5zcGxpdFN0YXRlbWVudHMoY29udGV4dC5nZXRDb2RlKCkpLCAoc3RhdGVtZW50KSAtPiBbJy0tZXZhbCcsIHN0YXRlbWVudF0pKVxuICAgICAgICBhcmdzID0gXy51bmlvbiBbJy0tbm9pbmZvcm0nLCAnLS1kaXNhYmxlLWRlYnVnZ2VyJywgJy0tbm9uLWludGVyYWN0aXZlJywgJy0tcXVpdCddLCBzdGF0ZW1lbnRzXG4gICAgICAgIHJldHVybiBhcmdzXG4gICAgXCJGaWxlIEJhc2VkXCI6XG4gICAgICBjb21tYW5kOiBcInNiY2xcIlxuICAgICAgYXJnczogKGNvbnRleHQpIC0+IFsnLS1ub2luZm9ybScsICctLXNjcmlwdCcsIGNvbnRleHQuZmlsZXBhdGhdXG5cbiAgJ0xpdGVyYXRlIEhhc2tlbGwnOlxuICAgIFwiRmlsZSBCYXNlZFwiOlxuICAgICAgY29tbWFuZDogXCJydW5oYXNrZWxsXCJcbiAgICAgIGFyZ3M6IChjb250ZXh0KSAtPiBbY29udGV4dC5maWxlcGF0aF1cblxuICBMaXZlU2NyaXB0OlxuICAgIFwiU2VsZWN0aW9uIEJhc2VkXCI6XG4gICAgICBjb21tYW5kOiBcImxzY1wiXG4gICAgICBhcmdzOiAoY29udGV4dCkgIC0+IFsnLWUnLCBjb250ZXh0LmdldENvZGUoKV1cbiAgICBcIkZpbGUgQmFzZWRcIjpcbiAgICAgIGNvbW1hbmQ6IFwibHNjXCJcbiAgICAgIGFyZ3M6IChjb250ZXh0KSAtPiBbY29udGV4dC5maWxlcGF0aF1cblxuICBMdWE6XG4gICAgXCJTZWxlY3Rpb24gQmFzZWRcIjpcbiAgICAgIGNvbW1hbmQ6IFwibHVhXCJcbiAgICAgIGFyZ3M6IChjb250ZXh0KSAtPlxuICAgICAgICBjb2RlID0gY29udGV4dC5nZXRDb2RlKHRydWUpXG4gICAgICAgIHRtcEZpbGUgPSBHcmFtbWFyVXRpbHMuY3JlYXRlVGVtcEZpbGVXaXRoQ29kZShjb2RlKVxuICAgICAgICBbdG1wRmlsZV1cbiAgICBcIkZpbGUgQmFzZWRcIjpcbiAgICAgIGNvbW1hbmQ6IFwibHVhXCJcbiAgICAgIGFyZ3M6IChjb250ZXh0KSAtPiBbY29udGV4dC5maWxlcGF0aF1cblxuICAnTHVhIChXb1cpJzpcbiAgICBcIlNlbGVjdGlvbiBCYXNlZFwiOlxuICAgICAgY29tbWFuZDogXCJsdWFcIlxuICAgICAgYXJnczogKGNvbnRleHQpIC0+XG4gICAgICAgIGNvZGUgPSBjb250ZXh0LmdldENvZGUodHJ1ZSlcbiAgICAgICAgdG1wRmlsZSA9IEdyYW1tYXJVdGlscy5jcmVhdGVUZW1wRmlsZVdpdGhDb2RlKGNvZGUpXG4gICAgICAgIFt0bXBGaWxlXVxuICAgIFwiRmlsZSBCYXNlZFwiOlxuICAgICAgY29tbWFuZDogXCJsdWFcIlxuICAgICAgYXJnczogKGNvbnRleHQpIC0+IFtjb250ZXh0LmZpbGVwYXRoXVxuXG4gIE1ha2VmaWxlOlxuICAgIFwiU2VsZWN0aW9uIEJhc2VkXCI6XG4gICAgICBjb21tYW5kOiBcImJhc2hcIlxuICAgICAgYXJnczogKGNvbnRleHQpIC0+IFsnLWMnLCBjb250ZXh0LmdldENvZGUoKV1cbiAgICBcIkZpbGUgQmFzZWRcIjpcbiAgICAgIGNvbW1hbmQ6IFwibWFrZVwiXG4gICAgICBhcmdzOiAoY29udGV4dCkgLT4gWyctZicsIGNvbnRleHQuZmlsZXBhdGhdXG5cbiAgTWFnaWNQeXRob246XG4gICAgXCJTZWxlY3Rpb24gQmFzZWRcIjpcbiAgICAgIGNvbW1hbmQ6IFwicHl0aG9uXCJcbiAgICAgIGFyZ3M6IChjb250ZXh0KSAgLT4gWyctdScsICctYycsIGNvbnRleHQuZ2V0Q29kZSgpXVxuICAgIFwiRmlsZSBCYXNlZFwiOlxuICAgICAgY29tbWFuZDogXCJweXRob25cIlxuICAgICAgYXJnczogKGNvbnRleHQpIC0+IFsnLXUnLCBjb250ZXh0LmZpbGVwYXRoXVxuXG4gIE1BVExBQjpcbiAgICBcIlNlbGVjdGlvbiBCYXNlZFwiOlxuICAgICAgY29tbWFuZDogXCJtYXRsYWJcIlxuICAgICAgYXJnczogKGNvbnRleHQpIC0+XG4gICAgICAgIGNvZGUgPSBjb250ZXh0LmdldENvZGUoKVxuICAgICAgICB0bXBGaWxlID0gR3JhbW1hclV0aWxzLk1BVExBQi5jcmVhdGVUZW1wRmlsZVdpdGhDb2RlKGNvZGUpXG4gICAgICAgIFsnLW5vZGVza3RvcCcsJy1ub3NwbGFzaCcsJy1yJyxcInRyeSwgcnVuKCdcIiArIHRtcEZpbGUgKyBcIicpO3doaWxlIH5pc2VtcHR5KGdldCgwLCdDaGlsZHJlbicpKTsgcGF1c2UoMC41KTsgZW5kOyBjYXRjaCBNRTsgZGlzcChNRS5tZXNzYWdlKTsgZXhpdCgxKTsgZW5kOyBleGl0KDApO1wiXVxuICAgIFwiRmlsZSBCYXNlZFwiOlxuICAgICAgY29tbWFuZDogXCJtYXRsYWJcIlxuICAgICAgYXJnczogKGNvbnRleHQpIC0+IFsnLW5vZGVza3RvcCcsJy1ub3NwbGFzaCcsJy1yJyxcInRyeSBydW4oJ1wiICsgY29udGV4dC5maWxlcGF0aCArIFwiJyk7d2hpbGUgfmlzZW1wdHkoZ2V0KDAsJ0NoaWxkcmVuJykpOyBwYXVzZSgwLjUpOyBlbmQ7IGNhdGNoIE1FOyBkaXNwKE1FLm1lc3NhZ2UpOyBleGl0KDEpOyBlbmQ7IGV4aXQoMCk7XCJdXG5cbiAgJ01JUFMgQXNzZW1ibGVyJzpcbiAgICBcIkZpbGUgQmFzZWRcIjpcbiAgICAgIGNvbW1hbmQ6IFwic3BpbVwiXG4gICAgICBhcmdzOiAoY29udGV4dCkgLT4gWyctZicsIGNvbnRleHQuZmlsZXBhdGhdXG5cbiAgTW9vblNjcmlwdDpcbiAgICBcIlNlbGVjdGlvbiBCYXNlZFwiOlxuICAgICAgY29tbWFuZDogXCJtb29uXCJcbiAgICAgIGFyZ3M6IChjb250ZXh0KSAtPiBbJy1lJywgY29udGV4dC5nZXRDb2RlKCldXG4gICAgXCJGaWxlIEJhc2VkXCI6XG4gICAgICBjb21tYW5kOiBcIm1vb25cIlxuICAgICAgYXJnczogKGNvbnRleHQpIC0+IFtjb250ZXh0LmZpbGVwYXRoXVxuXG4gICdtb25nb0RCIChKYXZhU2NyaXB0KSc6XG4gICAgXCJTZWxlY3Rpb24gQmFzZWRcIjpcbiAgICAgIGNvbW1hbmQ6IFwibW9uZ29cIlxuICAgICAgYXJnczogKGNvbnRleHQpIC0+IFsnLS1ldmFsJywgY29udGV4dC5nZXRDb2RlKCldXG4gICAgXCJGaWxlIEJhc2VkXCI6XG4gICAgICBjb21tYW5kOiAgXCJtb25nb1wiXG4gICAgICBhcmdzOiAoY29udGV4dCkgLT4gW2NvbnRleHQuZmlsZXBhdGhdXG5cbiAgTkNMOlxuICAgIFwiU2VsZWN0aW9uIEJhc2VkXCI6XG4gICAgICBjb21tYW5kOiBcIm5jbFwiXG4gICAgICBhcmdzOiAoY29udGV4dCkgLT5cbiAgICAgICAgY29kZSA9IGNvbnRleHQuZ2V0Q29kZSh0cnVlKVxuICAgICAgICBjb2RlID0gY29kZSArIFwiXCJcIlxuXG4gICAgICAgIGV4aXRcIlwiXCJcbiAgICAgICAgdG1wRmlsZSA9IEdyYW1tYXJVdGlscy5jcmVhdGVUZW1wRmlsZVdpdGhDb2RlKGNvZGUpXG4gICAgICAgIFt0bXBGaWxlXVxuICAgIFwiRmlsZSBCYXNlZFwiOlxuICAgICAgY29tbWFuZDogXCJuY2xcIlxuICAgICAgYXJnczogKGNvbnRleHQpIC0+IFtjb250ZXh0LmZpbGVwYXRoXVxuXG4gIG5ld0xJU1A6XG4gICAgXCJTZWxlY3Rpb24gQmFzZWRcIjpcbiAgICAgIGNvbW1hbmQ6IFwibmV3bGlzcFwiXG4gICAgICBhcmdzOiAoY29udGV4dCkgLT4gWyctZScsIGNvbnRleHQuZ2V0Q29kZSgpXVxuICAgIFwiRmlsZSBCYXNlZFwiOlxuICAgICAgY29tbWFuZDogXCJuZXdsaXNwXCJcbiAgICAgIGFyZ3M6IChjb250ZXh0KSAtPiBbY29udGV4dC5maWxlcGF0aF1cblxuICBOaW06XG4gICAgXCJGaWxlIEJhc2VkXCI6XG4gICAgICBjb21tYW5kOiBcImJhc2hcIlxuICAgICAgYXJnczogKGNvbnRleHQpIC0+XG4gICAgICAgIGZpbGUgPSBHcmFtbWFyVXRpbHMuTmltLmZpbmROaW1Qcm9qZWN0RmlsZShjb250ZXh0LmZpbGVwYXRoKVxuICAgICAgICBwYXRoID0gR3JhbW1hclV0aWxzLk5pbS5wcm9qZWN0RGlyKGNvbnRleHQuZmlsZXBhdGgpXG4gICAgICAgIFsnLWMnLCAnY2QgXCInICsgcGF0aCArICdcIiAmJiBuaW0gYyAtLWhpbnRzOm9mZiAtLXBhcmFsbGVsQnVpbGQ6MSAtciBcIicgKyBmaWxlICsgJ1wiIDI+JjEnXVxuXG4gIE5TSVM6XG4gICAgXCJTZWxlY3Rpb24gQmFzZWRcIjpcbiAgICAgIGNvbW1hbmQ6IFwibWFrZW5zaXNcIlxuICAgICAgYXJnczogKGNvbnRleHQpIC0+XG4gICAgICAgIGNvZGUgPSBjb250ZXh0LmdldENvZGUoKVxuICAgICAgICB0bXBGaWxlID0gR3JhbW1hclV0aWxzLmNyZWF0ZVRlbXBGaWxlV2l0aENvZGUoY29kZSlcbiAgICAgICAgW3RtcEZpbGVdXG4gICAgXCJGaWxlIEJhc2VkXCI6XG4gICAgICBjb21tYW5kOiBcIm1ha2Vuc2lzXCJcbiAgICAgIGFyZ3M6IChjb250ZXh0KSAtPiBbY29udGV4dC5maWxlcGF0aF1cblxuICAnT2JqZWN0aXZlLUMnOlxuICAgIGlmIEdyYW1tYXJVdGlscy5PcGVyYXRpbmdTeXN0ZW0uaXNEYXJ3aW4oKVxuICAgICAgXCJGaWxlIEJhc2VkXCI6XG4gICAgICAgIGNvbW1hbmQ6IFwiYmFzaFwiXG4gICAgICAgIGFyZ3M6IChjb250ZXh0KSAtPiBbJy1jJywgXCJ4Y3J1biBjbGFuZyAtZmNvbG9yLWRpYWdub3N0aWNzIC1XYWxsIC1pbmNsdWRlIHN0ZGlvLmggLWZyYW1ld29yayBDb2NvYSBcIiArIGNvbnRleHQuZmlsZXBhdGggKyBcIiAtbyAvdG1wL29iamMtYy5vdXQgJiYgL3RtcC9vYmpjLWMub3V0XCJdXG5cbiAgJ09iamVjdGl2ZS1DKysnOlxuICAgIGlmIEdyYW1tYXJVdGlscy5PcGVyYXRpbmdTeXN0ZW0uaXNEYXJ3aW4oKVxuICAgICAgXCJGaWxlIEJhc2VkXCI6XG4gICAgICAgIGNvbW1hbmQ6IFwiYmFzaFwiXG4gICAgICAgIGFyZ3M6IChjb250ZXh0KSAtPiBbJy1jJywgXCJ4Y3J1biBjbGFuZysrIC1mY29sb3ItZGlhZ25vc3RpY3MgLVdjKysxMS1leHRlbnNpb25zIC1XYWxsIC1pbmNsdWRlIHN0ZGlvLmggLWluY2x1ZGUgaW9zdHJlYW0gLWZyYW1ld29yayBDb2NvYSBcIiArIGNvbnRleHQuZmlsZXBhdGggKyBcIiAtbyAvdG1wL29iamMtY3BwLm91dCAmJiAvdG1wL29iamMtY3BwLm91dFwiXVxuXG4gIE9DYW1sOlxuICAgIFwiRmlsZSBCYXNlZFwiOlxuICAgICAgY29tbWFuZDogXCJvY2FtbFwiXG4gICAgICBhcmdzOiAoY29udGV4dCkgLT4gW2NvbnRleHQuZmlsZXBhdGhdXG5cbiAgT2N0YXZlOlxuICAgIFwiU2VsZWN0aW9uIEJhc2VkXCI6XG4gICAgICBjb21tYW5kOiBcIm9jdGF2ZVwiXG4gICAgICBhcmdzOiAoY29udGV4dCkgLT4gWyctcCcsIGNvbnRleHQuZmlsZXBhdGgucmVwbGFjZSgvW15cXC9dKiQvLCAnJyksICctLWV2YWwnLCBjb250ZXh0LmdldENvZGUoKV1cbiAgICBcIkZpbGUgQmFzZWRcIjpcbiAgICAgIGNvbW1hbmQ6IFwib2N0YXZlXCJcbiAgICAgIGFyZ3M6IChjb250ZXh0KSAtPiBbJy1wJywgY29udGV4dC5maWxlcGF0aC5yZXBsYWNlKC9bXlxcL10qJC8sICcnKSwgY29udGV4dC5maWxlcGF0aF1cblxuICBPejpcbiAgICBcIlNlbGVjdGlvbiBCYXNlZFwiOlxuICAgICAgY29tbWFuZDogXCJvemNcIlxuICAgICAgYXJnczogKGNvbnRleHQpIC0+XG4gICAgICAgIGNvZGUgPSBjb250ZXh0LmdldENvZGUoKVxuICAgICAgICB0bXBGaWxlID0gR3JhbW1hclV0aWxzLmNyZWF0ZVRlbXBGaWxlV2l0aENvZGUoY29kZSlcbiAgICAgICAgWyctYycsIHRtcEZpbGVdXG4gICAgXCJGaWxlIEJhc2VkXCI6XG4gICAgICBjb21tYW5kOiBcIm96Y1wiXG4gICAgICBhcmdzOiAoY29udGV4dCkgLT4gWyctYycsIGNvbnRleHQuZmlsZXBhdGhdXG5cbiAgJ1BhbmRvYyBNYXJrZG93bic6XG4gICAgXCJGaWxlIEJhc2VkXCI6XG4gICAgICBjb21tYW5kOiBcInBhbnplclwiXG4gICAgICBhcmdzOiAoY29udGV4dCkgLT4gW2NvbnRleHQuZmlsZXBhdGgsIFwiLS1vdXRwdXQ9XCIgKyBjb250ZXh0LmZpbGVwYXRoICsgXCIucGRmXCJdXG5cbiAgUGVybDpcbiAgICBcIlNlbGVjdGlvbiBCYXNlZFwiOlxuICAgICAgY29tbWFuZDogXCJwZXJsXCJcbiAgICAgIGFyZ3M6IChjb250ZXh0KSAtPlxuICAgICAgICBjb2RlID0gY29udGV4dC5nZXRDb2RlKClcbiAgICAgICAgZmlsZSA9IEdyYW1tYXJVdGlscy5QZXJsLmNyZWF0ZVRlbXBGaWxlV2l0aENvZGUoY29kZSlcbiAgICAgICAgW2ZpbGVdXG4gICAgXCJGaWxlIEJhc2VkXCI6XG4gICAgICBjb21tYW5kOiBcInBlcmxcIlxuICAgICAgYXJnczogKGNvbnRleHQpIC0+IFtjb250ZXh0LmZpbGVwYXRoXVxuXG4gIFwiUGVybCA2XCI6XG4gICAgXCJTZWxlY3Rpb24gQmFzZWRcIjpcbiAgICAgIGNvbW1hbmQ6IFwicGVybDZcIlxuICAgICAgYXJnczogKGNvbnRleHQpICAtPiBbJy1lJywgY29udGV4dC5nZXRDb2RlKCldXG4gICAgXCJGaWxlIEJhc2VkXCI6XG4gICAgICBjb21tYW5kOiBcInBlcmw2XCJcbiAgICAgIGFyZ3M6IChjb250ZXh0KSAtPiBbY29udGV4dC5maWxlcGF0aF1cblxuICBcIlBlcmwgNiBGRVwiOlxuICAgIFwiU2VsZWN0aW9uIEJhc2VkXCI6XG4gICAgICBjb21tYW5kOiBcInBlcmw2XCJcbiAgICAgIGFyZ3M6IChjb250ZXh0KSAgLT4gWyctZScsIGNvbnRleHQuZ2V0Q29kZSgpXVxuICAgIFwiRmlsZSBCYXNlZFwiOlxuICAgICAgY29tbWFuZDogXCJwZXJsNlwiXG4gICAgICBhcmdzOiAoY29udGV4dCkgLT4gW2NvbnRleHQuZmlsZXBhdGhdXG5cbiAgUEhQOlxuICAgIFwiU2VsZWN0aW9uIEJhc2VkXCI6XG4gICAgICBjb21tYW5kOiBcInBocFwiXG4gICAgICBhcmdzOiAoY29udGV4dCkgLT5cbiAgICAgICAgY29kZSA9IGNvbnRleHQuZ2V0Q29kZSgpXG4gICAgICAgIGZpbGUgPSBHcmFtbWFyVXRpbHMuUEhQLmNyZWF0ZVRlbXBGaWxlV2l0aENvZGUoY29kZSlcbiAgICAgICAgW2ZpbGVdXG4gICAgXCJGaWxlIEJhc2VkXCI6XG4gICAgICBjb21tYW5kOiBcInBocFwiXG4gICAgICBhcmdzOiAoY29udGV4dCkgLT4gW2NvbnRleHQuZmlsZXBhdGhdXG5cbiAgUG93ZXJTaGVsbDpcbiAgICBcIlNlbGVjdGlvbiBCYXNlZFwiOlxuICAgICAgY29tbWFuZDogXCJwb3dlcnNoZWxsXCJcbiAgICAgIGFyZ3M6IChjb250ZXh0KSAtPiBbY29udGV4dC5nZXRDb2RlKCldXG4gICAgXCJGaWxlIEJhc2VkXCI6XG4gICAgICBjb21tYW5kOiBcInBvd2Vyc2hlbGxcIlxuICAgICAgYXJnczogKGNvbnRleHQpIC0+IFtjb250ZXh0LmZpbGVwYXRoLnJlcGxhY2UgL1xcIC9nLCBcImAgXCJdXG5cbiAgUHJvY2Vzc2luZzpcbiAgICBcIkZpbGUgQmFzZWRcIjpcbiAgICAgIGNvbW1hbmQ6IGlmIEdyYW1tYXJVdGlscy5PcGVyYXRpbmdTeXN0ZW0uaXNXaW5kb3dzKCkgdGhlbiBcImNtZFwiIGVsc2UgXCJiYXNoXCJcbiAgICAgIGFyZ3M6IChjb250ZXh0KSAtPlxuICAgICAgICBpZiBHcmFtbWFyVXRpbHMuT3BlcmF0aW5nU3lzdGVtLmlzV2luZG93cygpXG4gICAgICAgICAgcmV0dXJuIFsnL2MgcHJvY2Vzc2luZy1qYXZhIC0tc2tldGNoPScrY29udGV4dC5maWxlcGF0aC5yZXBsYWNlKFwiXFxcXFwiK2NvbnRleHQuZmlsZW5hbWUsXCJcIikrJyAtLXJ1biddXG4gICAgICAgIGVsc2VcbiAgICAgICAgICByZXR1cm4gWyctYycsICdwcm9jZXNzaW5nLWphdmEgLS1za2V0Y2g9Jytjb250ZXh0LmZpbGVwYXRoLnJlcGxhY2UoXCIvXCIrY29udGV4dC5maWxlbmFtZSxcIlwiKSsnIC0tcnVuJ11cblxuXG4gIFByb2xvZzpcbiAgICBcIkZpbGUgQmFzZWRcIjpcbiAgICAgIGNvbW1hbmQ6IFwiYmFzaFwiXG4gICAgICBhcmdzOiAoY29udGV4dCkgLT4gWyctYycsICdjZCBcXFwiJyArIGNvbnRleHQuZmlsZXBhdGgucmVwbGFjZSgvW15cXC9dKiQvLCAnJykgKyAnXFxcIjsgc3dpcGwgLWYgXFxcIicgKyBjb250ZXh0LmZpbGVwYXRoICsgJ1xcXCIgLXQgbWFpbiAtLXF1aWV0J11cblxuICBQdXJlU2NyaXB0OlxuICAgIFwiRmlsZSBCYXNlZFwiOlxuICAgICAgY29tbWFuZDogaWYgR3JhbW1hclV0aWxzLk9wZXJhdGluZ1N5c3RlbS5pc1dpbmRvd3MoKSB0aGVuIFwiY21kXCIgZWxzZSBcImJhc2hcIlxuICAgICAgYXJnczogKGNvbnRleHQpIC0+XG4gICAgICAgIGlmIEdyYW1tYXJVdGlscy5PcGVyYXRpbmdTeXN0ZW0uaXNXaW5kb3dzKClcbiAgICAgICAgICBbJy9jIGNkIFwiJyArIGNvbnRleHQuZmlsZXBhdGgucmVwbGFjZSgvW15cXC9dKiQvLCAnJykgKyAnXCIgJiYgcHVscCBydW4nXVxuICAgICAgICBlbHNlXG4gICAgICAgICAgWyctYycsICdjZCBcIicgKyBjb250ZXh0LmZpbGVwYXRoLnJlcGxhY2UoL1teXFwvXSokLywgJycpICsgJ1wiICYmIHB1bHAgcnVuJ11cblxuICBQeXRob246XG4gICAgXCJTZWxlY3Rpb24gQmFzZWRcIjpcbiAgICAgIGNvbW1hbmQ6IFwicHl0aG9uXCJcbiAgICAgIGFyZ3M6IChjb250ZXh0KSAgLT4gWyctdScsICctYycsIGNvbnRleHQuZ2V0Q29kZSgpXVxuICAgIFwiRmlsZSBCYXNlZFwiOlxuICAgICAgY29tbWFuZDogXCJweXRob25cIlxuICAgICAgYXJnczogKGNvbnRleHQpIC0+IFsnLXUnLCBjb250ZXh0LmZpbGVwYXRoXVxuXG4gIFI6XG4gICAgXCJTZWxlY3Rpb24gQmFzZWRcIjpcbiAgICAgIGNvbW1hbmQ6IFwiUnNjcmlwdFwiXG4gICAgICBhcmdzOiAoY29udGV4dCkgLT5cbiAgICAgICAgY29kZSA9IGNvbnRleHQuZ2V0Q29kZSgpXG4gICAgICAgIGZpbGUgPSBHcmFtbWFyVXRpbHMuUi5jcmVhdGVUZW1wRmlsZVdpdGhDb2RlKGNvZGUpXG4gICAgICAgIFtmaWxlXVxuICAgIFwiRmlsZSBCYXNlZFwiOlxuICAgICAgY29tbWFuZDogXCJSc2NyaXB0XCJcbiAgICAgIGFyZ3M6IChjb250ZXh0KSAtPiBbY29udGV4dC5maWxlcGF0aF1cblxuICBSYWNrZXQ6XG4gICAgXCJTZWxlY3Rpb24gQmFzZWRcIjpcbiAgICAgIGNvbW1hbmQ6IFwicmFja2V0XCJcbiAgICAgIGFyZ3M6IChjb250ZXh0KSAtPiBbJy1lJywgY29udGV4dC5nZXRDb2RlKCldXG4gICAgXCJGaWxlIEJhc2VkXCI6XG4gICAgICBjb21tYW5kOiBcInJhY2tldFwiXG4gICAgICBhcmdzOiAoY29udGV4dCkgLT4gW2NvbnRleHQuZmlsZXBhdGhdXG5cbiAgUkFOVDpcbiAgICBcIlNlbGVjdGlvbiBCYXNlZFwiOlxuICAgICAgY29tbWFuZDogXCJSYW50Q29uc29sZS5leGVcIlxuICAgICAgYXJnczogKGNvbnRleHQpIC0+XG4gICAgICAgIGNvZGUgPSBjb250ZXh0LmdldENvZGUodHJ1ZSlcbiAgICAgICAgdG1wRmlsZSA9IEdyYW1tYXJVdGlscy5jcmVhdGVUZW1wRmlsZVdpdGhDb2RlKGNvZGUpXG4gICAgICAgIFsnLWZpbGUnLCB0bXBGaWxlXVxuICAgIFwiRmlsZSBCYXNlZFwiOlxuICAgICAgY29tbWFuZDogXCJSYW50Q29uc29sZS5leGVcIlxuICAgICAgYXJnczogKGNvbnRleHQpIC0+IFsnLWZpbGUnLCBjb250ZXh0LmZpbGVwYXRoXVxuXG4gIFJlYXNvbjpcbiAgICBcIkZpbGUgQmFzZWRcIjpcbiAgICAgIGNvbW1hbmQ6IGlmIEdyYW1tYXJVdGlscy5PcGVyYXRpbmdTeXN0ZW0uaXNXaW5kb3dzKCkgdGhlbiBcImNtZFwiIGVsc2UgXCJiYXNoXCJcbiAgICAgIGFyZ3M6IChjb250ZXh0KSAtPlxuICAgICAgICBwcm9nbmFtZSA9IGNvbnRleHQuZmlsZW5hbWUucmVwbGFjZSAvXFwucmUkLywgXCJcIlxuICAgICAgICBhcmdzID0gW11cbiAgICAgICAgaWYgR3JhbW1hclV0aWxzLk9wZXJhdGluZ1N5c3RlbS5pc1dpbmRvd3MoKVxuICAgICAgICAgIGFyZ3MgPSBbXCIvYyByZWJ1aWxkICN7cHJvZ25hbWV9Lm5hdGl2ZSAmJiAje3Byb2duYW1lfS5uYXRpdmVcIl1cbiAgICAgICAgZWxzZVxuICAgICAgICAgIGFyZ3MgPSBbJy1jJywgXCJyZWJ1aWxkICcje3Byb2duYW1lfS5uYXRpdmUnICYmICcje3Byb2duYW1lfS5uYXRpdmUnXCJdXG4gICAgICAgIHJldHVybiBhcmdzXG5cbiAgXCJSZW4nUHlcIjpcbiAgICBcIkZpbGUgQmFzZWRcIjpcbiAgICAgIGNvbW1hbmQ6IFwicmVucHlcIlxuICAgICAgYXJnczogKGNvbnRleHQpIC0+IFtjb250ZXh0LmZpbGVwYXRoLnN1YnN0cigwLCBjb250ZXh0LmZpbGVwYXRoLmxhc3RJbmRleE9mKFwiL2dhbWVcIikpXVxuXG4gICdSb2JvdCBGcmFtZXdvcmsnOlxuICAgIFwiRmlsZSBCYXNlZFwiOlxuICAgICAgY29tbWFuZDogJ3JvYm90J1xuICAgICAgYXJnczogKGNvbnRleHQpIC0+IFtjb250ZXh0LmZpbGVwYXRoXVxuXG4gIFJTcGVjOlxuICAgIFwiU2VsZWN0aW9uIEJhc2VkXCI6XG4gICAgICBjb21tYW5kOiBcInJ1YnlcIlxuICAgICAgYXJnczogKGNvbnRleHQpICAtPiBbJy1lJywgY29udGV4dC5nZXRDb2RlKCldXG4gICAgXCJGaWxlIEJhc2VkXCI6XG4gICAgICBjb21tYW5kOiBcInJzcGVjXCJcbiAgICAgIGFyZ3M6IChjb250ZXh0KSAtPiBbJy0tdHR5JywgJy0tY29sb3InLCBjb250ZXh0LmZpbGVwYXRoXVxuICAgIFwiTGluZSBOdW1iZXIgQmFzZWRcIjpcbiAgICAgIGNvbW1hbmQ6IFwicnNwZWNcIlxuICAgICAgYXJnczogKGNvbnRleHQpIC0+IFsnLS10dHknLCAnLS1jb2xvcicsIGNvbnRleHQuZmlsZUNvbG9uTGluZSgpXVxuXG4gIFJ1Ynk6XG4gICAgXCJTZWxlY3Rpb24gQmFzZWRcIjpcbiAgICAgIGNvbW1hbmQ6IFwicnVieVwiXG4gICAgICBhcmdzOiAoY29udGV4dCkgIC0+IFsnLWUnLCBjb250ZXh0LmdldENvZGUoKV1cbiAgICBcIkZpbGUgQmFzZWRcIjpcbiAgICAgIGNvbW1hbmQ6IFwicnVieVwiXG4gICAgICBhcmdzOiAoY29udGV4dCkgLT4gW2NvbnRleHQuZmlsZXBhdGhdXG5cbiAgJ1J1Ynkgb24gUmFpbHMnOlxuICAgIFwiU2VsZWN0aW9uIEJhc2VkXCI6XG4gICAgICBjb21tYW5kOiBcInJhaWxzXCJcbiAgICAgIGFyZ3M6IChjb250ZXh0KSAgLT4gWydydW5uZXInLCBjb250ZXh0LmdldENvZGUoKV1cbiAgICBcIkZpbGUgQmFzZWRcIjpcbiAgICAgIGNvbW1hbmQ6IFwicmFpbHNcIlxuICAgICAgYXJnczogKGNvbnRleHQpIC0+IFsncnVubmVyJywgY29udGV4dC5maWxlcGF0aF1cblxuICBSdXN0OlxuICAgIFwiRmlsZSBCYXNlZFwiOlxuICAgICAgY29tbWFuZDogaWYgR3JhbW1hclV0aWxzLk9wZXJhdGluZ1N5c3RlbS5pc1dpbmRvd3MoKSB0aGVuIFwiY21kXCIgZWxzZSBcImJhc2hcIlxuICAgICAgYXJnczogKGNvbnRleHQpIC0+XG4gICAgICAgIHByb2duYW1lID0gY29udGV4dC5maWxlbmFtZS5yZXBsYWNlIC9cXC5ycyQvLCBcIlwiXG4gICAgICAgIGFyZ3MgPSBbXVxuICAgICAgICBpZiBHcmFtbWFyVXRpbHMuT3BlcmF0aW5nU3lzdGVtLmlzV2luZG93cygpXG4gICAgICAgICAgYXJncyA9IFtcIi9jIHJ1c3RjICN7Y29udGV4dC5maWxlcGF0aH0gJiYgI3twcm9nbmFtZX0uZXhlXCJdXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBhcmdzID0gWyctYycsIFwicnVzdGMgJyN7Y29udGV4dC5maWxlcGF0aH0nIC1vIC90bXAvcnMub3V0ICYmIC90bXAvcnMub3V0XCJdXG4gICAgICAgIHJldHVybiBhcmdzXG5cbiAgU2FnZTpcbiAgICBcIlNlbGVjdGlvbiBCYXNlZFwiOlxuICAgICAgY29tbWFuZDogXCJzYWdlXCJcbiAgICAgIGFyZ3M6IChjb250ZXh0KSAtPiBbJy1jJywgY29udGV4dC5nZXRDb2RlKCldXG4gICAgXCJGaWxlIEJhc2VkXCI6XG4gICAgICBjb21tYW5kOiBcInNhZ2VcIlxuICAgICAgYXJnczogKGNvbnRleHQpIC0+IFtjb250ZXh0LmZpbGVwYXRoXVxuXG4gIFNhc3M6XG4gICAgXCJGaWxlIEJhc2VkXCI6XG4gICAgICBjb21tYW5kOiBcInNhc3NcIlxuICAgICAgYXJnczogKGNvbnRleHQpIC0+IFtjb250ZXh0LmZpbGVwYXRoXVxuXG4gIFNjYWxhOlxuICAgIFwiU2VsZWN0aW9uIEJhc2VkXCI6XG4gICAgICBjb21tYW5kOiBcInNjYWxhXCJcbiAgICAgIGFyZ3M6IChjb250ZXh0KSAgLT4gWyctZScsIGNvbnRleHQuZ2V0Q29kZSgpXVxuICAgIFwiRmlsZSBCYXNlZFwiOlxuICAgICAgY29tbWFuZDogXCJzY2FsYVwiXG4gICAgICBhcmdzOiAoY29udGV4dCkgLT4gW2NvbnRleHQuZmlsZXBhdGhdXG5cbiAgU2NoZW1lOlxuICAgIFwiU2VsZWN0aW9uIEJhc2VkXCI6XG4gICAgICBjb21tYW5kOiBcImd1aWxlXCJcbiAgICAgIGFyZ3M6IChjb250ZXh0KSAgLT4gWyctYycsIGNvbnRleHQuZ2V0Q29kZSgpXVxuICAgIFwiRmlsZSBCYXNlZFwiOlxuICAgICAgY29tbWFuZDogXCJndWlsZVwiXG4gICAgICBhcmdzOiAoY29udGV4dCkgLT4gW2NvbnRleHQuZmlsZXBhdGhdXG5cbiAgU0NTUzpcbiAgICBcIkZpbGUgQmFzZWRcIjpcbiAgICAgIGNvbW1hbmQ6IFwic2Fzc1wiXG4gICAgICBhcmdzOiAoY29udGV4dCkgLT4gW2NvbnRleHQuZmlsZXBhdGhdXG5cbiAgXCJTaGVsbCBTY3JpcHRcIjpcbiAgICBcIlNlbGVjdGlvbiBCYXNlZFwiOlxuICAgICAgY29tbWFuZDogcHJvY2Vzcy5lbnYuU0hFTExcbiAgICAgIGFyZ3M6IChjb250ZXh0KSAgLT4gWyctYycsIGNvbnRleHQuZ2V0Q29kZSgpXVxuICAgIFwiRmlsZSBCYXNlZFwiOlxuICAgICAgY29tbWFuZDogcHJvY2Vzcy5lbnYuU0hFTExcbiAgICAgIGFyZ3M6IChjb250ZXh0KSAtPiBbY29udGV4dC5maWxlcGF0aF1cblxuICBcIlNoZWxsIFNjcmlwdCAoRmlzaClcIjpcbiAgICBcIlNlbGVjdGlvbiBCYXNlZFwiOlxuICAgICAgY29tbWFuZDogXCJmaXNoXCJcbiAgICAgIGFyZ3M6IChjb250ZXh0KSAgLT4gWyctYycsIGNvbnRleHQuZ2V0Q29kZSgpXVxuICAgIFwiRmlsZSBCYXNlZFwiOlxuICAgICAgY29tbWFuZDogXCJmaXNoXCJcbiAgICAgIGFyZ3M6IChjb250ZXh0KSAtPiBbY29udGV4dC5maWxlcGF0aF1cblxuICBcIlNRTFwiOlxuICAgIFwiU2VsZWN0aW9uIEJhc2VkXCI6XG4gICAgICBjb21tYW5kOiBcImVjaG9cIlxuICAgICAgYXJnczogKGNvbnRleHQpIC0+IFsnU1FMIHJlcXVpcmVzIHNldHRpbmcgXFwnU2NyaXB0OiBSdW4gT3B0aW9uc1xcJyBkaXJlY3RseS4gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9yZ2JrcmsvYXRvbS1zY3JpcHQvdHJlZS9tYXN0ZXIvZXhhbXBsZXMvaGVsbG8uc3FsIGZvciBmdXJ0aGVyIGluZm9ybWF0aW9uLiddXG4gICAgXCJGaWxlIEJhc2VkXCI6XG4gICAgICBjb21tYW5kOiBcImVjaG9cIlxuICAgICAgYXJnczogKGNvbnRleHQpIC0+IFsnU1FMIHJlcXVpcmVzIHNldHRpbmcgXFwnU2NyaXB0OiBSdW4gT3B0aW9uc1xcJyBkaXJlY3RseS4gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9yZ2JrcmsvYXRvbS1zY3JpcHQvdHJlZS9tYXN0ZXIvZXhhbXBsZXMvaGVsbG8uc3FsIGZvciBmdXJ0aGVyIGluZm9ybWF0aW9uLiddXG5cbiAgXCJTUUwgKFBvc3RncmVTUUwpXCI6XG4gICAgXCJTZWxlY3Rpb24gQmFzZWRcIjpcbiAgICAgIGNvbW1hbmQ6IFwicHNxbFwiXG4gICAgICBhcmdzOiAoY29udGV4dCkgLT4gWyctYycsIGNvbnRleHQuZ2V0Q29kZSgpXVxuICAgIFwiRmlsZSBCYXNlZFwiOlxuICAgICAgY29tbWFuZDogXCJwc3FsXCJcbiAgICAgIGFyZ3M6IChjb250ZXh0KSAtPiBbJy1mJywgY29udGV4dC5maWxlcGF0aF1cblxuICBcIlN0YW5kYXJkIE1MXCI6XG4gICAgXCJGaWxlIEJhc2VkXCI6XG4gICAgICBjb21tYW5kOiBcInNtbFwiXG4gICAgICBhcmdzOiAoY29udGV4dCkgLT4gW2NvbnRleHQuZmlsZXBhdGhdXG5cbiAgU3RhdGE6XG4gICAgXCJTZWxlY3Rpb24gQmFzZWRcIjpcbiAgICAgIGNvbW1hbmQ6IFwic3RhdGFcIlxuICAgICAgYXJnczogKGNvbnRleHQpICAtPiBbJ2RvJywgY29udGV4dC5nZXRDb2RlKCldXG4gICAgXCJGaWxlIEJhc2VkXCI6XG4gICAgICBjb21tYW5kOiBcInN0YXRhXCJcbiAgICAgIGFyZ3M6IChjb250ZXh0KSAtPiBbJ2RvJywgY29udGV4dC5maWxlcGF0aF1cblxuICBTd2lmdDpcbiAgICBcIkZpbGUgQmFzZWRcIjpcbiAgICAgIGNvbW1hbmQ6IFwic3dpZnRcIlxuICAgICAgYXJnczogKGNvbnRleHQpIC0+IFtjb250ZXh0LmZpbGVwYXRoXVxuXG4gIFRjbDpcbiAgICBcIlNlbGVjdGlvbiBCYXNlZFwiOlxuICAgICAgY29tbWFuZDogXCJ0Y2xzaFwiXG4gICAgICBhcmdzOiAoY29udGV4dCkgLT5cbiAgICAgICAgY29kZSA9IGNvbnRleHQuZ2V0Q29kZSgpXG4gICAgICAgIHRtcEZpbGUgPSBHcmFtbWFyVXRpbHMuY3JlYXRlVGVtcEZpbGVXaXRoQ29kZShjb2RlKVxuICAgICAgICBbdG1wRmlsZV1cbiAgICBcIkZpbGUgQmFzZWRcIjpcbiAgICAgIGNvbW1hbmQ6IFwidGNsc2hcIlxuICAgICAgYXJnczogKGNvbnRleHQpIC0+IFtjb250ZXh0LmZpbGVwYXRoXVxuXG4gIFR1cmluZzpcbiAgICBcIkZpbGUgQmFzZWRcIjpcbiAgICAgIGNvbW1hbmQ6IFwidHVyaW5nXCJcbiAgICAgIGFyZ3M6IChjb250ZXh0KSAtPiBbJy1ydW4nLCBjb250ZXh0LmZpbGVwYXRoXVxuXG4gIFR5cGVTY3JpcHQ6XG4gICAgXCJTZWxlY3Rpb24gQmFzZWRcIjpcbiAgICAgIGNvbW1hbmQ6IFwidHMtbm9kZVwiXG4gICAgICBhcmdzOiAoY29udGV4dCkgLT4gWyctZScsIGNvbnRleHQuZ2V0Q29kZSgpXVxuICAgIFwiRmlsZSBCYXNlZFwiOlxuICAgICAgY29tbWFuZDogXCJ0cy1ub2RlXCJcbiAgICAgIGFyZ3M6IChjb250ZXh0KSAtPiBbY29udGV4dC5maWxlcGF0aF1cblxuICBWQlNjcmlwdDpcbiAgICAnU2VsZWN0aW9uIEJhc2VkJzpcbiAgICAgIGNvbW1hbmQ6ICdjc2NyaXB0J1xuICAgICAgYXJnczogKGNvbnRleHQpIC0+XG4gICAgICAgIGNvZGUgPSBjb250ZXh0LmdldENvZGUoKVxuICAgICAgICB0bXBGaWxlID0gR3JhbW1hclV0aWxzLmNyZWF0ZVRlbXBGaWxlV2l0aENvZGUoY29kZSwgXCIudmJzXCIpXG4gICAgICAgIFsnLy9OT0xPR08nLHRtcEZpbGVdXG4gICAgJ0ZpbGUgQmFzZWQnOlxuICAgICAgY29tbWFuZDogJ2NzY3JpcHQnXG4gICAgICBhcmdzOiAoY29udGV4dCkgLT4gWycvL05PTE9HTycsIGNvbnRleHQuZmlsZXBhdGhdXG5cbiAgSFRNTDpcbiAgICBcIkZpbGUgQmFzZWRcIjpcbiAgICAgIGNvbW1hbmQ6ICdlY2hvJ1xuICAgICAgYXJnczogKGNvbnRleHQpIC0+XG4gICAgICAgIHVyaSA9ICdmaWxlOi8vJyArIGNvbnRleHQuZmlsZXBhdGhcbiAgICAgICAgc2hlbGwub3BlbkV4dGVybmFsKHVyaSlcbiAgICAgICAgWydIVE1MIGZpbGUgb3BlbmVkIGF0OicsIHVyaV1cbiJdfQ==
