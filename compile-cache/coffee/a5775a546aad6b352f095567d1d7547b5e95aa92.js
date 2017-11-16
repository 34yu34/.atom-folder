(function() {
  var GrammarUtils, OperatingSystem, args, command, options, os, path, ref, windows;

  path = require('path');

  ref = GrammarUtils = require('../grammar-utils'), OperatingSystem = ref.OperatingSystem, command = ref.command;

  os = OperatingSystem.platform();

  windows = OperatingSystem.isWindows();

  options = '-Wall -include stdio.h';

  args = function(arg) {
    var filepath;
    filepath = arg.filepath;
    args = (function() {
      switch (os) {
        case 'darwin':
          return "xcrun clang " + options + " -fcolor-diagnostics '" + filepath + "' -o /tmp/c.out && /tmp/c.out";
        case 'linux':
          return "cc " + options + " '" + filepath + "' -o /tmp/c.out && /tmp/c.out";
      }
    })();
    return ['-c', args];
  };

  exports.C = {
    'File Based': {
      command: 'bash',
      args: function(arg) {
        var filepath;
        filepath = arg.filepath;
        args = (function() {
          switch (os) {
            case 'darwin':
              return "xcrun clang " + options + " -fcolor-diagnostics '" + filepath + "' -o /tmp/c.out && /tmp/c.out";
            case 'linux':
              return "cc " + options + " '" + filepath + "' -o /tmp/c.out && /tmp/c.out";
          }
        })();
        return ['-c', args];
      }
    },
    'Selection Based': {
      command: 'bash',
      args: function(context) {
        var code, tmpFile;
        code = context.getCode();
        tmpFile = GrammarUtils.createTempFileWithCode(code, '.c');
        args = (function() {
          switch (os) {
            case 'darwin':
              return "xcrun clang " + options + " -fcolor-diagnostics " + tmpFile + " -o /tmp/c.out && /tmp/c.out";
            case 'linux':
              return "cc " + options + " " + tmpFile + " -o /tmp/c.out && /tmp/c.out";
          }
        })();
        return ['-c', args];
      }
    }
  };

  exports['C#'] = {
    'Selection Based': {
      command: command,
      args: function(context) {
        var code, exe, tmpFile;
        code = context.getCode();
        tmpFile = GrammarUtils.createTempFileWithCode(code, '.cs');
        exe = tmpFile.replace(/\.cs$/, '.exe');
        if (windows) {
          return ["/c csc /out:" + exe + " " + tmpFile + " && " + exe];
        } else {
          return ['-c', "csc /out:" + exe + " " + tmpFile + " && mono " + exe];
        }
      }
    },
    'File Based': {
      command: command,
      args: function(arg) {
        var exe, filename, filepath;
        filepath = arg.filepath, filename = arg.filename;
        exe = filename.replace(/\.cs$/, '.exe');
        if (windows) {
          return ["/c csc " + filepath + " && " + exe];
        } else {
          return ['-c', "csc '" + filepath + "' && mono " + exe];
        }
      }
    }
  };

  exports['C# Script File'] = {
    'Selection Based': {
      command: 'scriptcs',
      args: function(context) {
        var code, tmpFile;
        code = context.getCode();
        tmpFile = GrammarUtils.createTempFileWithCode(code, '.csx');
        return ['-script', tmpFile];
      }
    },
    'File Based': {
      command: 'scriptcs',
      args: function(arg) {
        var filepath;
        filepath = arg.filepath;
        return ['-script', filepath];
      }
    }
  };

  exports['C++'] = {
    'Selection Based': {
      command: 'bash',
      args: function(context) {
        var code, tmpFile;
        code = context.getCode();
        tmpFile = GrammarUtils.createTempFileWithCode(code, '.cpp');
        args = (function() {
          switch (os) {
            case 'darwin':
              return "xcrun clang++ -std=c++14 " + options + " -fcolor-diagnostics -include iostream " + tmpFile + " -o /tmp/cpp.out && /tmp/cpp.out";
            case 'linux':
              return "g++ " + options + " -std=c++14 -include iostream " + tmpFile + " -o /tmp/cpp.out && /tmp/cpp.out";
          }
        })();
        return ['-c', args];
      }
    },
    'File Based': {
      command: command,
      args: function(arg) {
        var filepath;
        filepath = arg.filepath;
        args = (function() {
          switch (os) {
            case 'darwin':
              return "xcrun clang++ -std=c++14 " + options + " -fcolor-diagnostics -include iostream '" + filepath + "' -o /tmp/cpp.out && /tmp/cpp.out";
            case 'linux':
              return "g++ -std=c++14 " + options + " -include iostream '" + filepath + "' -o /tmp/cpp.out && /tmp/cpp.out";
            case 'win32':
              if (GrammarUtils.OperatingSystem.release().split('.').slice(-1 >= '14399')) {
                filepath = path.posix.join.apply(path.posix, [].concat([filepath.split(path.win32.sep)[0].toLowerCase()], filepath.split(path.win32.sep).slice(1))).replace(':', '');
                return "g++ -std=c++14 " + options + " -include iostream /mnt/" + filepath + " -o /tmp/cpp.out && /tmp/cpp.out";
              }
          }
        })();
        return GrammarUtils.formatArgs(args);
      }
    }
  };

  exports['C++14'] = exports['C++'];

  if (os === 'darwin') {
    exports['Objective-C'] = {
      'File Based': {
        command: 'bash',
        args: function(arg) {
          var filepath;
          filepath = arg.filepath;
          return ['-c', "xcrun clang " + options + " -fcolor-diagnostics -framework Cocoa '" + filepath + "' -o /tmp/objc-c.out && /tmp/objc-c.out"];
        }
      }
    };
    exports['Objective-C++'] = {
      'File Based': {
        command: 'bash',
        args: function(arg) {
          var filepath;
          filepath = arg.filepath;
          return ['-c', "xcrun clang++ -Wc++11-extensions " + options + " -fcolor-diagnostics -include iostream -framework Cocoa '" + filepath + "' -o /tmp/objc-cpp.out && /tmp/objc-cpp.out"];
        }
      }
    };
  }

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYmlsbHkvLmF0b20vcGFja2FnZXMvc2NyaXB0L2xpYi9ncmFtbWFycy9jLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztFQUNQLE1BQTZCLFlBQUEsR0FBZSxPQUFBLENBQVEsa0JBQVIsQ0FBNUMsRUFBQyxxQ0FBRCxFQUFrQjs7RUFFbEIsRUFBQSxHQUFLLGVBQWUsQ0FBQyxRQUFoQixDQUFBOztFQUNMLE9BQUEsR0FBVSxlQUFlLENBQUMsU0FBaEIsQ0FBQTs7RUFFVixPQUFBLEdBQVU7O0VBRVYsSUFBQSxHQUFPLFNBQUMsR0FBRDtBQUNMLFFBQUE7SUFETyxXQUFEO0lBQ04sSUFBQTtBQUFPLGNBQU8sRUFBUDtBQUFBLGFBQ0EsUUFEQTtpQkFFSCxjQUFBLEdBQWUsT0FBZixHQUF1Qix3QkFBdkIsR0FBK0MsUUFBL0MsR0FBd0Q7QUFGckQsYUFHQSxPQUhBO2lCQUlILEtBQUEsR0FBTSxPQUFOLEdBQWMsSUFBZCxHQUFrQixRQUFsQixHQUEyQjtBQUp4Qjs7QUFLUCxXQUFPLENBQUMsSUFBRCxFQUFPLElBQVA7RUFORjs7RUFRUCxPQUFPLENBQUMsQ0FBUixHQUNFO0lBQUEsWUFBQSxFQUNFO01BQUEsT0FBQSxFQUFTLE1BQVQ7TUFDQSxJQUFBLEVBQU0sU0FBQyxHQUFEO0FBQ0osWUFBQTtRQURNLFdBQUQ7UUFDTCxJQUFBO0FBQU8sa0JBQU8sRUFBUDtBQUFBLGlCQUNBLFFBREE7cUJBRUgsY0FBQSxHQUFlLE9BQWYsR0FBdUIsd0JBQXZCLEdBQStDLFFBQS9DLEdBQXdEO0FBRnJELGlCQUdBLE9BSEE7cUJBSUgsS0FBQSxHQUFNLE9BQU4sR0FBYyxJQUFkLEdBQWtCLFFBQWxCLEdBQTJCO0FBSnhCOztBQUtQLGVBQU8sQ0FBQyxJQUFELEVBQU8sSUFBUDtNQU5ILENBRE47S0FERjtJQVVBLGlC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YixDQUF3QixJQUF4QjtNQVZILENBRk07S0FaZDs7O0VBMEJGLE9BQVEsQ0FBQSxPQUFBLENBQVIsR0FBbUIsT0FBUSxDQUFBLEtBQUE7O0VBRTNCLElBQUcsRUFBQSxLQUFNLFFBQVQ7SUFDRSxPQUFRLENBQUEsYUFBQSxDQUFSLEdBQ0U7TUFBQSxZQUFBLEVBQ0U7UUFBQSxPQUFBLEVBQVMsTUFBVDtRQUNBLElBQUEsRUFBTSxTQUFDLEdBQUQ7QUFBZ0IsY0FBQTtVQUFkLFdBQUQ7aUJBQWUsQ0FBQyxJQUFELEVBQU8sY0FBQSxHQUFlLE9BQWYsR0FBdUIseUNBQXZCLEdBQWdFLFFBQWhFLEdBQXlFLHlDQUFoRjtRQUFoQixDQUROO09BREY7O0lBSUYsT0FBUSxDQUFBLGVBQUEsQ0FBUixHQUNJO01BQUEsWUFBQSxFQUNFO1FBQUEsT0FBQSxFQUFTLE1BQVQ7UUFDQSxJQUFBLEVBQU0sU0FBQyxHQUFEO0FBQWdCLGNBQUE7VUFBZCxXQUFEO2lCQUFlLENBQUMsSUFBRCxFQUFPLG1DQUFBLEdBQW9DLE9BQXBDLEdBQTRDLDJEQUE1QyxHQUF1RyxRQUF2RyxHQUFnSCw2Q0FBdkg7UUFBaEIsQ0FETjtPQURGO01BUE47O0FBbkdBIiwic291cmNlc0NvbnRlbnQiOlsicGF0aCA9IHJlcXVpcmUgJ3BhdGgnXG57T3BlcmF0aW5nU3lzdGVtLCBjb21tYW5kfSA9IEdyYW1tYXJVdGlscyA9IHJlcXVpcmUgJy4uL2dyYW1tYXItdXRpbHMnXG5cbm9zID0gT3BlcmF0aW5nU3lzdGVtLnBsYXRmb3JtKClcbndpbmRvd3MgPSBPcGVyYXRpbmdTeXN0ZW0uaXNXaW5kb3dzKClcblxub3B0aW9ucyA9ICctV2FsbCAtaW5jbHVkZSBzdGRpby5oJ1xuXG5hcmdzID0gKHtmaWxlcGF0aH0pIC0+XG4gIGFyZ3MgPSBzd2l0Y2ggb3NcbiAgICB3aGVuICdkYXJ3aW4nXG4gICAgICBcInhjcnVuIGNsYW5nICN7b3B0aW9uc30gLWZjb2xvci1kaWFnbm9zdGljcyAnI3tmaWxlcGF0aH0nIC1vIC90bXAvYy5vdXQgJiYgL3RtcC9jLm91dFwiXG4gICAgd2hlbiAnbGludXgnXG4gICAgICBcImNjICN7b3B0aW9uc30gJyN7ZmlsZXBhdGh9JyAtbyAvdG1wL2Mub3V0ICYmIC90bXAvYy5vdXRcIlxuICByZXR1cm4gWyctYycsIGFyZ3NdXG5cbmV4cG9ydHMuQyA9XG4gICdGaWxlIEJhc2VkJzpcbiAgICBjb21tYW5kOiAnYmFzaCdcbiAgICBhcmdzOiAoe2ZpbGVwYXRofSkgLT5cbiAgICAgIGFyZ3MgPSBzd2l0Y2ggb3NcbiAgICAgICAgd2hlbiAnZGFyd2luJ1xuICAgICAgICAgIFwieGNydW4gY2xhbmcgI3tvcHRpb25zfSAtZmNvbG9yLWRpYWdub3N0aWNzICcje2ZpbGVwYXRofScgLW8gL3RtcC9jLm91dCAmJiAvdG1wL2Mub3V0XCJcbiAgICAgICAgd2hlbiAnbGludXgnXG4gICAgICAgICAgXCJjYyAje29wdGlvbnN9ICcje2ZpbGVwYXRofScgLW8gL3RtcC9jLm91dCAmJiAvdG1wL2Mub3V0XCJcbiAgICAgIHJldHVybiBbJy1jJywgYXJnc11cblxuICAnU2VsZWN0aW9uIEJhc2VkJzpcbiAgICBjb21tYW5kOiAnYmFzaCdcbiAgICBhcmdzOiAoY29udGV4dCkgLT5cbiAgICAgIGNvZGUgPSBjb250ZXh0LmdldENvZGUoKVxuICAgICAgdG1wRmlsZSA9IEdyYW1tYXJVdGlscy5jcmVhdGVUZW1wRmlsZVdpdGhDb2RlKGNvZGUsICcuYycpXG4gICAgICBhcmdzID0gc3dpdGNoIG9zXG4gICAgICAgIHdoZW4gJ2RhcndpbidcbiAgICAgICAgICBcInhjcnVuIGNsYW5nICN7b3B0aW9uc30gLWZjb2xvci1kaWFnbm9zdGljcyAje3RtcEZpbGV9IC1vIC90bXAvYy5vdXQgJiYgL3RtcC9jLm91dFwiXG4gICAgICAgIHdoZW4gJ2xpbnV4J1xuICAgICAgICAgIFwiY2MgI3tvcHRpb25zfSAje3RtcEZpbGV9IC1vIC90bXAvYy5vdXQgJiYgL3RtcC9jLm91dFwiXG4gICAgICByZXR1cm4gWyctYycsIGFyZ3NdXG5cbmV4cG9ydHNbJ0MjJ10gPVxuICAnU2VsZWN0aW9uIEJhc2VkJzoge1xuICAgIGNvbW1hbmRcbiAgICBhcmdzOiAoY29udGV4dCkgLT5cbiAgICAgIGNvZGUgPSBjb250ZXh0LmdldENvZGUoKVxuICAgICAgdG1wRmlsZSA9IEdyYW1tYXJVdGlscy5jcmVhdGVUZW1wRmlsZVdpdGhDb2RlKGNvZGUsICcuY3MnKVxuICAgICAgZXhlID0gdG1wRmlsZS5yZXBsYWNlIC9cXC5jcyQvLCAnLmV4ZSdcbiAgICAgIGlmIHdpbmRvd3NcbiAgICAgICAgcmV0dXJuIFtcIi9jIGNzYyAvb3V0OiN7ZXhlfSAje3RtcEZpbGV9ICYmICN7ZXhlfVwiXVxuICAgICAgZWxzZSBbJy1jJywgXCJjc2MgL291dDoje2V4ZX0gI3t0bXBGaWxlfSAmJiBtb25vICN7ZXhlfVwiXVxuICB9XG4gICdGaWxlIEJhc2VkJzoge1xuICAgIGNvbW1hbmRcbiAgICBhcmdzOiAoe2ZpbGVwYXRoLCBmaWxlbmFtZX0pIC0+XG4gICAgICBleGUgPSBmaWxlbmFtZS5yZXBsYWNlIC9cXC5jcyQvLCAnLmV4ZSdcbiAgICAgIGlmIHdpbmRvd3NcbiAgICAgICAgcmV0dXJuIFtcIi9jIGNzYyAje2ZpbGVwYXRofSAmJiAje2V4ZX1cIl1cbiAgICAgIGVsc2UgWyctYycsIFwiY3NjICcje2ZpbGVwYXRofScgJiYgbW9ubyAje2V4ZX1cIl1cbiAgfVxuZXhwb3J0c1snQyMgU2NyaXB0IEZpbGUnXSA9XG5cbiAgJ1NlbGVjdGlvbiBCYXNlZCc6XG4gICAgY29tbWFuZDogJ3NjcmlwdGNzJ1xuICAgIGFyZ3M6IChjb250ZXh0KSAtPlxuICAgICAgY29kZSA9IGNvbnRleHQuZ2V0Q29kZSgpXG4gICAgICB0bXBGaWxlID0gR3JhbW1hclV0aWxzLmNyZWF0ZVRlbXBGaWxlV2l0aENvZGUoY29kZSwgJy5jc3gnKVxuICAgICAgcmV0dXJuIFsnLXNjcmlwdCcsIHRtcEZpbGVdXG4gICdGaWxlIEJhc2VkJzpcbiAgICBjb21tYW5kOiAnc2NyaXB0Y3MnXG4gICAgYXJnczogKHtmaWxlcGF0aH0pIC0+IFsnLXNjcmlwdCcsIGZpbGVwYXRoXVxuXG5leHBvcnRzWydDKysnXSA9XG4gICdTZWxlY3Rpb24gQmFzZWQnOlxuICAgIGNvbW1hbmQ6ICdiYXNoJ1xuICAgIGFyZ3M6IChjb250ZXh0KSAtPlxuICAgICAgY29kZSA9IGNvbnRleHQuZ2V0Q29kZSgpXG4gICAgICB0bXBGaWxlID0gR3JhbW1hclV0aWxzLmNyZWF0ZVRlbXBGaWxlV2l0aENvZGUoY29kZSwgJy5jcHAnKVxuICAgICAgYXJncyA9IHN3aXRjaCBvc1xuICAgICAgICB3aGVuICdkYXJ3aW4nXG4gICAgICAgICAgXCJ4Y3J1biBjbGFuZysrIC1zdGQ9YysrMTQgI3tvcHRpb25zfSAtZmNvbG9yLWRpYWdub3N0aWNzIC1pbmNsdWRlIGlvc3RyZWFtICN7dG1wRmlsZX0gLW8gL3RtcC9jcHAub3V0ICYmIC90bXAvY3BwLm91dFwiXG4gICAgICAgIHdoZW4gJ2xpbnV4J1xuICAgICAgICAgIFwiZysrICN7b3B0aW9uc30gLXN0ZD1jKysxNCAtaW5jbHVkZSBpb3N0cmVhbSAje3RtcEZpbGV9IC1vIC90bXAvY3BwLm91dCAmJiAvdG1wL2NwcC5vdXRcIlxuICAgICAgcmV0dXJuIFsnLWMnLCBhcmdzXVxuXG4gICdGaWxlIEJhc2VkJzoge1xuICAgIGNvbW1hbmRcbiAgICBhcmdzOiAoe2ZpbGVwYXRofSkgLT5cbiAgICAgIGFyZ3MgPSBzd2l0Y2ggb3NcbiAgICAgICAgd2hlbiAnZGFyd2luJ1xuICAgICAgICAgIFwieGNydW4gY2xhbmcrKyAtc3RkPWMrKzE0ICN7b3B0aW9uc30gLWZjb2xvci1kaWFnbm9zdGljcyAtaW5jbHVkZSBpb3N0cmVhbSAnI3tmaWxlcGF0aH0nIC1vIC90bXAvY3BwLm91dCAmJiAvdG1wL2NwcC5vdXRcIlxuICAgICAgICB3aGVuICdsaW51eCdcbiAgICAgICAgICBcImcrKyAtc3RkPWMrKzE0ICN7b3B0aW9uc30gLWluY2x1ZGUgaW9zdHJlYW0gJyN7ZmlsZXBhdGh9JyAtbyAvdG1wL2NwcC5vdXQgJiYgL3RtcC9jcHAub3V0XCJcbiAgICAgICAgd2hlbiAnd2luMzInXG4gICAgICAgICAgaWYgR3JhbW1hclV0aWxzLk9wZXJhdGluZ1N5c3RlbS5yZWxlYXNlKCkuc3BsaXQoJy4nKS5zbGljZSAtMSA+PSAnMTQzOTknXG4gICAgICAgICAgICBmaWxlcGF0aCA9IHBhdGgucG9zaXguam9pbi5hcHBseShwYXRoLnBvc2l4LCBbXS5jb25jYXQoW2ZpbGVwYXRoLnNwbGl0KHBhdGgud2luMzIuc2VwKVswXS50b0xvd2VyQ2FzZSgpXSwgZmlsZXBhdGguc3BsaXQocGF0aC53aW4zMi5zZXApLnNsaWNlKDEpKSkucmVwbGFjZSgnOicsICcnKVxuICAgICAgICAgICAgXCJnKysgLXN0ZD1jKysxNCAje29wdGlvbnN9IC1pbmNsdWRlIGlvc3RyZWFtIC9tbnQvI3tmaWxlcGF0aH0gLW8gL3RtcC9jcHAub3V0ICYmIC90bXAvY3BwLm91dFwiXG4gICAgICByZXR1cm4gR3JhbW1hclV0aWxzLmZvcm1hdEFyZ3MoYXJncylcbiAgfVxuZXhwb3J0c1snQysrMTQnXSA9IGV4cG9ydHNbJ0MrKyddXG5cbmlmIG9zIGlzICdkYXJ3aW4nXG4gIGV4cG9ydHNbJ09iamVjdGl2ZS1DJ10gPVxuICAgICdGaWxlIEJhc2VkJzpcbiAgICAgIGNvbW1hbmQ6ICdiYXNoJ1xuICAgICAgYXJnczogKHtmaWxlcGF0aH0pIC0+IFsnLWMnLCBcInhjcnVuIGNsYW5nICN7b3B0aW9uc30gLWZjb2xvci1kaWFnbm9zdGljcyAtZnJhbWV3b3JrIENvY29hICcje2ZpbGVwYXRofScgLW8gL3RtcC9vYmpjLWMub3V0ICYmIC90bXAvb2JqYy1jLm91dFwiXVxuXG4gIGV4cG9ydHNbJ09iamVjdGl2ZS1DKysnXSA9XG4gICAgICAnRmlsZSBCYXNlZCc6XG4gICAgICAgIGNvbW1hbmQ6ICdiYXNoJ1xuICAgICAgICBhcmdzOiAoe2ZpbGVwYXRofSkgLT4gWyctYycsIFwieGNydW4gY2xhbmcrKyAtV2MrKzExLWV4dGVuc2lvbnMgI3tvcHRpb25zfSAtZmNvbG9yLWRpYWdub3N0aWNzIC1pbmNsdWRlIGlvc3RyZWFtIC1mcmFtZXdvcmsgQ29jb2EgJyN7ZmlsZXBhdGh9JyAtbyAvdG1wL29iamMtY3BwLm91dCAmJiAvdG1wL29iamMtY3BwLm91dFwiXVxuIl19
