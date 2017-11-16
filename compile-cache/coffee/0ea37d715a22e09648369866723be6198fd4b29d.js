(function() {
  var BufferedProcess, ClangFlags, addClangFlags, addCommonArgs, addDocumentationArgs, fs, getCommonArgs, makeFileBasedArgs, path, tmp;

  BufferedProcess = require('atom').BufferedProcess;

  path = require('path');

  fs = require('fs');

  tmp = require('tmp');

  ClangFlags = require('clang-flags');

  module.exports = {
    makeBufferedClangProcess: function(editor, args, callback, input) {
      return new Promise(function(resolve) {
        var argsCountThreshold, bufferedProcess, command, errors, exit, filePath, options, outputs, ref, ref1, stderr, stdout;
        command = atom.config.get("autocomplete-clang.clangCommand");
        options = {
          cwd: path.dirname(editor.getPath())
        };
        ref = [[], []], outputs = ref[0], errors = ref[1];
        stdout = function(data) {
          return outputs.push(data);
        };
        stderr = function(data) {
          return errors.push(data);
        };
        argsCountThreshold = atom.config.get("autocomplete-clang.argsCountThreshold");
        if ((args.join(" ")).length > (argsCountThreshold || 7000)) {
          ref1 = makeFileBasedArgs(args, editor), args = ref1[0], filePath = ref1[1];
          exit = function(code) {
            fs.unlinkSync(filePath);
            return callback(code, outputs.join('\n'), errors.join('\n'), resolve);
          };
        } else {
          exit = function(code) {
            return callback(code, outputs.join('\n'), errors.join('\n'), resolve);
          };
        }
        bufferedProcess = new BufferedProcess({
          command: command,
          args: args,
          options: options,
          stdout: stdout,
          stderr: stderr,
          exit: exit
        });
        bufferedProcess.process.stdin.setEncoding = 'utf-8';
        bufferedProcess.process.stdin.write(input);
        return bufferedProcess.process.stdin.end();
      });
    },
    buildCodeCompletionArgs: function(editor, row, column, language) {
      var args, currentDir, filePath, pchPath, ref, std;
      ref = getCommonArgs(editor, language), std = ref.std, filePath = ref.filePath, currentDir = ref.currentDir, pchPath = ref.pchPath;
      args = [];
      args.push("-fsyntax-only");
      args.push("-x" + language);
      args.push("-Xclang", "-code-completion-macros");
      args.push("-Xclang", "-code-completion-at=-:" + (row + 1) + ":" + (column + 1));
      if (fs.existsSync(pchPath)) {
        args.push("-include-pch", pchPath);
      }
      return addCommonArgs(args, std, currentDir, pchPath, filePath);
    },
    buildGoDeclarationCommandArgs: function(editor, language, term) {
      var args, currentDir, filePath, pchPath, ref, std;
      ref = getCommonArgs(editor, language), std = ref.std, filePath = ref.filePath, currentDir = ref.currentDir, pchPath = ref.pchPath;
      args = [];
      args.push("-fsyntax-only");
      args.push("-x" + language);
      args.push("-Xclang", "-ast-dump");
      args.push("-Xclang", "-ast-dump-filter");
      args.push("-Xclang", "" + term);
      if (fs.existsSync(pchPath)) {
        args.push("-include-pch", pchPath);
      }
      return addCommonArgs(args, std, currentDir, pchPath, filePath);
    },
    buildEmitPchCommandArgs: function(editor, language) {
      var args, currentDir, filePath, pchPath, ref, std;
      ref = getCommonArgs(editor, language), std = ref.std, filePath = ref.filePath, currentDir = ref.currentDir, pchPath = ref.pchPath;
      args = [];
      args.push("-x" + language + "-header");
      args.push("-Xclang", "-emit-pch", "-o", pchPath);
      return addCommonArgs(args, std, currentDir, pchPath, filePath);
    }
  };

  getCommonArgs = function(editor, language) {
    var currentDir, filePath, pchFile, pchFilePrefix;
    pchFilePrefix = atom.config.get("autocomplete-clang.pchFilePrefix");
    pchFile = [pchFilePrefix, language, "pch"].join('.');
    filePath = editor.getPath();
    currentDir = path.dirname(filePath);
    return {
      std: atom.config.get("autocomplete-clang.std " + language),
      filePath: filePath,
      currentDir: currentDir,
      pchPath: path.join(currentDir, pchFile)
    };
  };

  addCommonArgs = function(args, std, currentDir, pchPath, filePath) {
    var i, j, len, ref;
    if (std) {
      args.push("-std=" + std);
    }
    ref = atom.config.get("autocomplete-clang.includePaths");
    for (j = 0, len = ref.length; j < len; j++) {
      i = ref[j];
      args.push("-I" + i);
    }
    args.push("-I" + currentDir);
    args = addDocumentationArgs(args);
    args = addClangFlags(args, filePath);
    args.push("-");
    return args;
  };

  addClangFlags = function(args, filePath) {
    var clangflags, error;
    try {
      clangflags = ClangFlags.getClangFlags(filePath);
      if (clangflags) {
        args = args.concat(clangflags);
      }
    } catch (error1) {
      error = error1;
      console.log("clang-flags error:", error);
    }
    return args;
  };

  addDocumentationArgs = function(args) {
    if (atom.config.get("autocomplete-clang.includeDocumentation")) {
      args.push("-Xclang", "-code-completion-brief-comments");
      if (atom.config.get("autocomplete-clang.includeNonDoxygenCommentsAsDocumentation")) {
        args.push("-fparse-all-comments");
      }
      if (atom.config.get("autocomplete-clang.includeSystemHeadersDocumentation")) {
        args.push("-fretain-comments-from-system-headers");
      }
    }
    return args;
  };

  makeFileBasedArgs = function(args, editor) {
    var filePath;
    args = args.join('\n');
    args = args.replace(/\\/g, "\\\\");
    args = args.replace(/\ /g, "\\\ ");
    filePath = tmp.fileSync().name;
    fs.writeFile(filePath, args, function(error) {
      if (error) {
        return console.error("Error writing file", error);
      }
    });
    args = ['@' + filePath];
    return [args, filePath];
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYmlsbHkvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLWNsYW5nL2xpYi9jbGFuZy1hcmdzLWJ1aWxkZXIuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQyxrQkFBbUIsT0FBQSxDQUFRLE1BQVI7O0VBQ3BCLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUjs7RUFDUCxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVI7O0VBQ0wsR0FBQSxHQUFNLE9BQUEsQ0FBUSxLQUFSOztFQUNOLFVBQUEsR0FBYSxPQUFBLENBQVEsYUFBUjs7RUFFYixNQUFNLENBQUMsT0FBUCxHQUVFO0lBQUEsd0JBQUEsRUFBMEIsU0FBQyxNQUFELEVBQVMsSUFBVCxFQUFlLFFBQWYsRUFBeUIsS0FBekI7YUFDcEIsSUFBQSxPQUFBLENBQVEsU0FBQyxPQUFEO0FBQ1YsWUFBQTtRQUFBLE9BQUEsR0FBVSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsaUNBQWhCO1FBQ1YsT0FBQSxHQUFVO1VBQUEsR0FBQSxFQUFLLElBQUksQ0FBQyxPQUFMLENBQWEsTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFiLENBQUw7O1FBQ1YsTUFBb0IsQ0FBQyxFQUFELEVBQUssRUFBTCxDQUFwQixFQUFDLGdCQUFELEVBQVU7UUFDVixNQUFBLEdBQVMsU0FBQyxJQUFEO2lCQUFTLE9BQU8sQ0FBQyxJQUFSLENBQWEsSUFBYjtRQUFUO1FBQ1QsTUFBQSxHQUFTLFNBQUMsSUFBRDtpQkFBUyxNQUFNLENBQUMsSUFBUCxDQUFZLElBQVo7UUFBVDtRQUNULGtCQUFBLEdBQXFCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQix1Q0FBaEI7UUFDckIsSUFBRyxDQUFDLElBQUksQ0FBQyxJQUFMLENBQVUsR0FBVixDQUFELENBQWdCLENBQUMsTUFBakIsR0FBMEIsQ0FBQyxrQkFBQSxJQUFzQixJQUF2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LENBQVUsSUFBVjtJQUNQLElBQUEsR0FBTyxJQUFJLENBQUMsT0FBTCxDQUFhLEtBQWIsRUFBb0IsTUFBcEI7SUFDUCxJQUFBLEdBQU8sSUFBSSxDQUFDLE9BQUwsQ0FBYSxLQUFiLEVBQW9CLE1BQXBCO0lBQ1AsUUFBQSxHQUFXLEdBQUcsQ0FBQyxRQUFKLENBQUEsQ0FBYyxDQUFDO0lBQzFCLEVBQUUsQ0FBQyxTQUFILENBQWEsUUFBYixFQUF1QixJQUF2QixFQUE2QixTQUFDLEtBQUQ7TUFDM0IsSUFBOEMsS0FBOUM7ZUFBQSxPQUFPLENBQUMsS0FBUixDQUFjLG9CQUFkLEVBQW9DLEtBQXBDLEVBQUE7O0lBRDJCLENBQTdCO0lBRUEsSUFBQSxHQUFPLENBQUMsR0FBQSxHQUFNLFFBQVA7V0FDUCxDQUFDLElBQUQsRUFBTyxRQUFQO0VBUmtCO0FBOUZwQiIsInNvdXJjZXNDb250ZW50IjpbIntCdWZmZXJlZFByb2Nlc3N9ID0gcmVxdWlyZSAnYXRvbSdcbnBhdGggPSByZXF1aXJlICdwYXRoJ1xuZnMgPSByZXF1aXJlICdmcydcbnRtcCA9IHJlcXVpcmUgJ3RtcCdcbkNsYW5nRmxhZ3MgPSByZXF1aXJlICdjbGFuZy1mbGFncydcblxubW9kdWxlLmV4cG9ydHMgPVxuXG4gIG1ha2VCdWZmZXJlZENsYW5nUHJvY2VzczogKGVkaXRvciwgYXJncywgY2FsbGJhY2ssIGlucHV0KS0+XG4gICAgbmV3IFByb21pc2UgKHJlc29sdmUpIC0+XG4gICAgICBjb21tYW5kID0gYXRvbS5jb25maWcuZ2V0IFwiYXV0b2NvbXBsZXRlLWNsYW5nLmNsYW5nQ29tbWFuZFwiXG4gICAgICBvcHRpb25zID0gY3dkOiBwYXRoLmRpcm5hbWUgZWRpdG9yLmdldFBhdGgoKVxuICAgICAgW291dHB1dHMsIGVycm9yc10gPSBbW10sIFtdXVxuICAgICAgc3Rkb3V0ID0gKGRhdGEpLT4gb3V0cHV0cy5wdXNoIGRhdGFcbiAgICAgIHN0ZGVyciA9IChkYXRhKS0+IGVycm9ycy5wdXNoIGRhdGFcbiAgICAgIGFyZ3NDb3VudFRocmVzaG9sZCA9IGF0b20uY29uZmlnLmdldChcImF1dG9jb21wbGV0ZS1jbGFuZy5hcmdzQ291bnRUaHJlc2hvbGRcIilcbiAgICAgIGlmIChhcmdzLmpvaW4oXCIgXCIpKS5sZW5ndGggPiAoYXJnc0NvdW50VGhyZXNob2xkIG9yIDcwMDApXG4gICAgICAgIFthcmdzLCBmaWxlUGF0aF0gPSBtYWtlRmlsZUJhc2VkQXJncyBhcmdzLCBlZGl0b3JcbiAgICAgICAgZXhpdCA9IChjb2RlKS0+XG4gICAgICAgICAgZnMudW5saW5rU3luYyBmaWxlUGF0aFxuICAgICAgICAgIGNhbGxiYWNrIGNvZGUsIChvdXRwdXRzLmpvaW4gJ1xcbicpLCAoZXJyb3JzLmpvaW4gJ1xcbicpLCByZXNvbHZlXG4gICAgICBlbHNlXG4gICAgICAgIGV4aXQgPSAoY29kZSktPiBjYWxsYmFjayBjb2RlLCAob3V0cHV0cy5qb2luICdcXG4nKSwgKGVycm9ycy5qb2luICdcXG4nKSwgcmVzb2x2ZVxuICAgICAgYnVmZmVyZWRQcm9jZXNzID0gbmV3IEJ1ZmZlcmVkUHJvY2Vzcyh7Y29tbWFuZCwgYXJncywgb3B0aW9ucywgc3Rkb3V0LCBzdGRlcnIsIGV4aXR9KVxuICAgICAgYnVmZmVyZWRQcm9jZXNzLnByb2Nlc3Muc3RkaW4uc2V0RW5jb2RpbmcgPSAndXRmLTgnXG4gICAgICBidWZmZXJlZFByb2Nlc3MucHJvY2Vzcy5zdGRpbi53cml0ZSBpbnB1dFxuICAgICAgYnVmZmVyZWRQcm9jZXNzLnByb2Nlc3Muc3RkaW4uZW5kKClcblxuICBidWlsZENvZGVDb21wbGV0aW9uQXJnczogKGVkaXRvciwgcm93LCBjb2x1bW4sIGxhbmd1YWdlKSAtPlxuICAgIHtzdGQsIGZpbGVQYXRoLCBjdXJyZW50RGlyLCBwY2hQYXRofSA9IGdldENvbW1vbkFyZ3MgZWRpdG9yLGxhbmd1YWdlXG4gICAgYXJncyA9IFtdXG4gICAgYXJncy5wdXNoIFwiLWZzeW50YXgtb25seVwiXG4gICAgYXJncy5wdXNoIFwiLXgje2xhbmd1YWdlfVwiXG4gICAgYXJncy5wdXNoIFwiLVhjbGFuZ1wiLCBcIi1jb2RlLWNvbXBsZXRpb24tbWFjcm9zXCJcbiAgICBhcmdzLnB1c2ggXCItWGNsYW5nXCIsIFwiLWNvZGUtY29tcGxldGlvbi1hdD0tOiN7cm93ICsgMX06I3tjb2x1bW4gKyAxfVwiXG4gICAgYXJncy5wdXNoKFwiLWluY2x1ZGUtcGNoXCIsIHBjaFBhdGgpIGlmIGZzLmV4aXN0c1N5bmMocGNoUGF0aClcbiAgICBhZGRDb21tb25BcmdzIGFyZ3MsIHN0ZCwgY3VycmVudERpciwgcGNoUGF0aCwgZmlsZVBhdGhcblxuICBidWlsZEdvRGVjbGFyYXRpb25Db21tYW5kQXJnczogKGVkaXRvciwgbGFuZ3VhZ2UsIHRlcm0pLT5cbiAgICB7c3RkLCBmaWxlUGF0aCwgY3VycmVudERpciwgcGNoUGF0aH0gPSBnZXRDb21tb25BcmdzIGVkaXRvcixsYW5ndWFnZVxuICAgIGFyZ3MgPSBbXVxuICAgIGFyZ3MucHVzaCBcIi1mc3ludGF4LW9ubHlcIlxuICAgIGFyZ3MucHVzaCBcIi14I3tsYW5ndWFnZX1cIlxuICAgIGFyZ3MucHVzaCBcIi1YY2xhbmdcIiwgXCItYXN0LWR1bXBcIlxuICAgIGFyZ3MucHVzaCBcIi1YY2xhbmdcIiwgXCItYXN0LWR1bXAtZmlsdGVyXCJcbiAgICBhcmdzLnB1c2ggXCItWGNsYW5nXCIsIFwiI3t0ZXJtfVwiXG4gICAgYXJncy5wdXNoKFwiLWluY2x1ZGUtcGNoXCIsIHBjaFBhdGgpIGlmIGZzLmV4aXN0c1N5bmMocGNoUGF0aClcbiAgICBhZGRDb21tb25BcmdzIGFyZ3MsIHN0ZCwgY3VycmVudERpciwgcGNoUGF0aCwgZmlsZVBhdGhcblxuICBidWlsZEVtaXRQY2hDb21tYW5kQXJnczogKGVkaXRvciwgbGFuZ3VhZ2UpLT5cbiAgICB7c3RkLCBmaWxlUGF0aCwgY3VycmVudERpciwgcGNoUGF0aH0gPSBnZXRDb21tb25BcmdzIGVkaXRvcixsYW5ndWFnZVxuICAgIGFyZ3MgPSBbXVxuICAgIGFyZ3MucHVzaCBcIi14I3tsYW5ndWFnZX0taGVhZGVyXCJcbiAgICBhcmdzLnB1c2ggXCItWGNsYW5nXCIsIFwiLWVtaXQtcGNoXCIsIFwiLW9cIiwgcGNoUGF0aFxuICAgIGFkZENvbW1vbkFyZ3MgYXJncywgc3RkLCBjdXJyZW50RGlyLCBwY2hQYXRoLCBmaWxlUGF0aFxuXG5nZXRDb21tb25BcmdzID0gKGVkaXRvciwgbGFuZ3VhZ2UpLT5cbiAgcGNoRmlsZVByZWZpeCA9IGF0b20uY29uZmlnLmdldCBcImF1dG9jb21wbGV0ZS1jbGFuZy5wY2hGaWxlUHJlZml4XCJcbiAgcGNoRmlsZSA9IFtwY2hGaWxlUHJlZml4LCBsYW5ndWFnZSwgXCJwY2hcIl0uam9pbiAnLidcbiAgZmlsZVBhdGggPSBlZGl0b3IuZ2V0UGF0aCgpXG4gIGN1cnJlbnREaXIgPSBwYXRoLmRpcm5hbWUgZmlsZVBhdGhcbiAge1xuICAgIHN0ZDogKGF0b20uY29uZmlnLmdldCBcImF1dG9jb21wbGV0ZS1jbGFuZy5zdGQgI3tsYW5ndWFnZX1cIiksXG4gICAgZmlsZVBhdGg6IGZpbGVQYXRoLFxuICAgIGN1cnJlbnREaXI6IGN1cnJlbnREaXIsXG4gICAgcGNoUGF0aDogKHBhdGguam9pbiBjdXJyZW50RGlyLCBwY2hGaWxlKVxuICB9XG5cbmFkZENvbW1vbkFyZ3MgPSAoYXJncywgc3RkLCBjdXJyZW50RGlyLCBwY2hQYXRoLCBmaWxlUGF0aCktPlxuICBhcmdzLnB1c2ggXCItc3RkPSN7c3RkfVwiIGlmIHN0ZFxuICBhcmdzLnB1c2ggXCItSSN7aX1cIiBmb3IgaSBpbiBhdG9tLmNvbmZpZy5nZXQgXCJhdXRvY29tcGxldGUtY2xhbmcuaW5jbHVkZVBhdGhzXCJcbiAgYXJncy5wdXNoIFwiLUkje2N1cnJlbnREaXJ9XCJcbiAgYXJncyA9IGFkZERvY3VtZW50YXRpb25BcmdzIGFyZ3NcbiAgYXJncyA9IGFkZENsYW5nRmxhZ3MgYXJncywgZmlsZVBhdGhcbiAgYXJncy5wdXNoIFwiLVwiXG4gIGFyZ3NcblxuYWRkQ2xhbmdGbGFncyA9IChhcmdzLCBmaWxlUGF0aCktPlxuICB0cnlcbiAgICBjbGFuZ2ZsYWdzID0gQ2xhbmdGbGFncy5nZXRDbGFuZ0ZsYWdzKGZpbGVQYXRoKVxuICAgIGFyZ3MgPSBhcmdzLmNvbmNhdCBjbGFuZ2ZsYWdzIGlmIGNsYW5nZmxhZ3NcbiAgY2F0Y2ggZXJyb3JcbiAgICBjb25zb2xlLmxvZyBcImNsYW5nLWZsYWdzIGVycm9yOlwiLCBlcnJvclxuICBhcmdzXG5cbmFkZERvY3VtZW50YXRpb25BcmdzID0gKGFyZ3MpLT5cbiAgaWYgYXRvbS5jb25maWcuZ2V0IFwiYXV0b2NvbXBsZXRlLWNsYW5nLmluY2x1ZGVEb2N1bWVudGF0aW9uXCJcbiAgICBhcmdzLnB1c2ggXCItWGNsYW5nXCIsIFwiLWNvZGUtY29tcGxldGlvbi1icmllZi1jb21tZW50c1wiXG4gICAgaWYgYXRvbS5jb25maWcuZ2V0IFwiYXV0b2NvbXBsZXRlLWNsYW5nLmluY2x1ZGVOb25Eb3h5Z2VuQ29tbWVudHNBc0RvY3VtZW50YXRpb25cIlxuICAgICAgYXJncy5wdXNoIFwiLWZwYXJzZS1hbGwtY29tbWVudHNcIlxuICAgIGlmIGF0b20uY29uZmlnLmdldCBcImF1dG9jb21wbGV0ZS1jbGFuZy5pbmNsdWRlU3lzdGVtSGVhZGVyc0RvY3VtZW50YXRpb25cIlxuICAgICAgYXJncy5wdXNoIFwiLWZyZXRhaW4tY29tbWVudHMtZnJvbS1zeXN0ZW0taGVhZGVyc1wiXG4gIGFyZ3NcblxubWFrZUZpbGVCYXNlZEFyZ3MgPSAoYXJncywgZWRpdG9yKS0+XG4gIGFyZ3MgPSBhcmdzLmpvaW4oJ1xcbicpXG4gIGFyZ3MgPSBhcmdzLnJlcGxhY2UgL1xcXFwvZywgXCJcXFxcXFxcXFwiXG4gIGFyZ3MgPSBhcmdzLnJlcGxhY2UgL1xcIC9nLCBcIlxcXFxcXCBcIlxuICBmaWxlUGF0aCA9IHRtcC5maWxlU3luYygpLm5hbWVcbiAgZnMud3JpdGVGaWxlIGZpbGVQYXRoLCBhcmdzLCAoZXJyb3IpIC0+XG4gICAgY29uc29sZS5lcnJvcihcIkVycm9yIHdyaXRpbmcgZmlsZVwiLCBlcnJvcikgaWYgZXJyb3JcbiAgYXJncyA9IFsnQCcgKyBmaWxlUGF0aF1cbiAgW2FyZ3MsIGZpbGVQYXRoXVxuIl19
