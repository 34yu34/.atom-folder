(function() {
  var GrammarUtils, args, command, path, windows;

  path = require('path');

  command = (GrammarUtils = require('../grammar-utils')).command;

  windows = GrammarUtils.OperatingSystem.isWindows();

  args = function(filepath, jar) {
    var cmd;
    jar = (jar != null ? jar : path.basename(filepath)).replace(/\.kt$/, '.jar');
    cmd = "kotlinc '" + filepath + "' -include-runtime -d " + jar + " && java -jar " + jar;
    return GrammarUtils.formatArgs(cmd);
  };

  module.exports = {
    Java: {
      'File Based': {
        command: command,
        args: function(context) {
          var className, classPackages, sourcePath;
          className = GrammarUtils.Java.getClassName(context);
          classPackages = GrammarUtils.Java.getClassPackage(context);
          sourcePath = GrammarUtils.Java.getProjectPath(context);
          if (windows) {
            return ["/c javac -Xlint " + context.filename + " && java " + className];
          } else {
            return ['-c', "javac -sourcepath '" + sourcePath + "' -d /tmp '" + context.filepath + "' && java -cp /tmp " + classPackages + className];
          }
        }
      }
    },
    Kotlin: {
      'Selection Based': {
        command: command,
        args: function(context) {
          var code, tmpFile;
          code = context.getCode();
          tmpFile = GrammarUtils.createTempFileWithCode(code, '.kt');
          return args(tmpFile);
        }
      },
      'File Based': {
        command: command,
        args: function(arg) {
          var filename, filepath;
          filepath = arg.filepath, filename = arg.filename;
          return args(filepath, "/tmp/" + filename);
        }
      }
    },
    Processing: {
      'File Based': {
        command: 'processing-java',
        args: function(arg) {
          var filepath;
          filepath = arg.filepath;
          return ["--sketch='" + (path.dirname(filepath)) + "'", '--run'];
        }
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYmlsbHkvLmF0b20vcGFja2FnZXMvc2NyaXB0L2xpYi9ncmFtbWFycy9qYXZhLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztFQUNOLFVBQVcsQ0FBQSxZQUFBLEdBQWUsT0FBQSxDQUFRLGtCQUFSLENBQWY7O0VBRVosT0FBQSxHQUFVLFlBQVksQ0FBQyxlQUFlLENBQUMsU0FBN0IsQ0FBQTs7RUFFVixJQUFBLEdBQU8sU0FBQyxRQUFELEVBQVcsR0FBWDtBQUNMLFFBQUE7SUFBQSxHQUFBLEdBQU0sZUFBQyxNQUFNLElBQUksQ0FBQyxRQUFMLENBQWMsUUFBZCxDQUFQLENBQStCLENBQUMsT0FBaEMsQ0FBd0MsT0FBeEMsRUFBaUQsTUFBakQ7SUFDTixHQUFBLEdBQU0sV0FBQSxHQUFZLFFBQVosR0FBcUIsd0JBQXJCLEdBQTZDLEdBQTdDLEdBQWlELGdCQUFqRCxHQUFpRTtBQUN2RSxXQUFPLFlBQVksQ0FBQyxVQUFiLENBQXdCLEdBQXhCO0VBSEY7O0VBS1AsTUFBTSxDQUFDLE9BQVAsR0FFRTtJQUFBLElBQUEsRUFDRTtNQUFBLFlBQUEsRUFBYztRQUNaLFNBQUEsT0FEWTtRQUVaLElBQUEsRUFBTSxTQUFDLE9BQUQ7QUFDSixjQUFBO1VBQUEsU0FBQSxHQUFZLFlBQVksQ0FBQyxJQUFJLENBQUMsWUFBbEIsQ0FBK0IsT0FBL0I7VUFDWixhQUFBLEdBQWdCLFlBQVksQ0FBQyxJQUFJLENBQUMsZUFBbEIsQ0FBa0MsT0FBbEM7VUFDaEIsVUFBQSxHQUFhLFlBQVksQ0FBQyxJQUFJLENBQUMsY0FBbEIsQ0FBaUMsT0FBakM7VUFDYixJQUFHLE9BQUg7QUFDRSxtQkFBTyxDQUFDLGtCQUFBLEdBQW1CLE9BQU8sQ0FBQyxRQUEzQixHQUFvQyxXQUFwQyxHQUErQyxTQUFoRCxFQURUO1dBQUEsTUFBQTttQkFFSyxDQUFDLElBQUQsRUFBTyxxQkFBQSxHQUFzQixVQUF0QixHQUFpQyxhQUFqQyxHQUE4QyxPQUFPLENBQUMsUUFBdEQsR0FBK0QscUJBQS9ELEdBQW9GLGFBQXBGLEdBQW9HLFNBQTNHLEVBRkw7O1FBSkksQ0FGTTtPQUFkO0tBREY7SUFXQSxNQUFBLEVBQ0U7TUFBQSxpQkFBQSxFQUFtQjtRQUNqQixTQUFBLE9BRGlCO1FBRWpCLElBQUEsRUFBTSxTQUFDLE9BQUQ7QUFDSixjQUFBO1VBQUEsSUFBQSxHQUFPLE9BQU8sQ0FBQyxPQUFSLENBQUE7VUFDUCxPQUFBLEdBQVUsWUFBWSxDQUFDLHNCQUFiLENBQW9DLElBQXBDLEVBQTBDLEtBQTFDO0FBQ1YsaUJBQU8sSUFBQSxDQUFLLE9BQUw7UUFISCxDQUZXO09BQW5CO01BT0EsWUFBQSxFQUFjO1FBQ1osU0FBQSxPQURZO1FBRVosSUFBQSxFQUFNLFNBQUMsR0FBRDtBQUEwQixjQUFBO1VBQXhCLHlCQUFVO2lCQUFjLElBQUEsQ0FBSyxRQUFMLEVBQWUsT0FBQSxHQUFRLFFBQXZCO1FBQTFCLENBRk07T0FQZDtLQVpGO0lBdUJBLFVBQUEsRUFDRTtNQUFBLFlBQUEsRUFDRTtRQUFBLE9BQUEsRUFBUyxpQkFBVDtRQUNBLElBQUEsRUFBTSxTQUFDLEdBQUQ7QUFBZ0IsY0FBQTtVQUFkLFdBQUQ7aUJBQWUsQ0FBQyxZQUFBLEdBQVksQ0FBQyxJQUFJLENBQUMsT0FBTCxDQUFhLFFBQWIsQ0FBRCxDQUFaLEdBQW9DLEdBQXJDLEVBQXlDLE9BQXpDO1FBQWhCLENBRE47T0FERjtLQXhCRjs7QUFaRiIsInNvdXJjZXNDb250ZW50IjpbInBhdGggPSByZXF1aXJlICdwYXRoJ1xue2NvbW1hbmR9ID0gR3JhbW1hclV0aWxzID0gcmVxdWlyZSAnLi4vZ3JhbW1hci11dGlscydcblxud2luZG93cyA9IEdyYW1tYXJVdGlscy5PcGVyYXRpbmdTeXN0ZW0uaXNXaW5kb3dzKClcblxuYXJncyA9IChmaWxlcGF0aCwgamFyKSAtPlxuICBqYXIgPSAoamFyID8gcGF0aC5iYXNlbmFtZShmaWxlcGF0aCkpLnJlcGxhY2UgL1xcLmt0JC8sICcuamFyJ1xuICBjbWQgPSBcImtvdGxpbmMgJyN7ZmlsZXBhdGh9JyAtaW5jbHVkZS1ydW50aW1lIC1kICN7amFyfSAmJiBqYXZhIC1qYXIgI3tqYXJ9XCJcbiAgcmV0dXJuIEdyYW1tYXJVdGlscy5mb3JtYXRBcmdzKGNtZClcblxubW9kdWxlLmV4cG9ydHMgPVxuXG4gIEphdmE6XG4gICAgJ0ZpbGUgQmFzZWQnOiB7XG4gICAgICBjb21tYW5kXG4gICAgICBhcmdzOiAoY29udGV4dCkgLT5cbiAgICAgICAgY2xhc3NOYW1lID0gR3JhbW1hclV0aWxzLkphdmEuZ2V0Q2xhc3NOYW1lIGNvbnRleHRcbiAgICAgICAgY2xhc3NQYWNrYWdlcyA9IEdyYW1tYXJVdGlscy5KYXZhLmdldENsYXNzUGFja2FnZSBjb250ZXh0XG4gICAgICAgIHNvdXJjZVBhdGggPSBHcmFtbWFyVXRpbHMuSmF2YS5nZXRQcm9qZWN0UGF0aCBjb250ZXh0XG4gICAgICAgIGlmIHdpbmRvd3NcbiAgICAgICAgICByZXR1cm4gW1wiL2MgamF2YWMgLVhsaW50ICN7Y29udGV4dC5maWxlbmFtZX0gJiYgamF2YSAje2NsYXNzTmFtZX1cIl1cbiAgICAgICAgZWxzZSBbJy1jJywgXCJqYXZhYyAtc291cmNlcGF0aCAnI3tzb3VyY2VQYXRofScgLWQgL3RtcCAnI3tjb250ZXh0LmZpbGVwYXRofScgJiYgamF2YSAtY3AgL3RtcCAje2NsYXNzUGFja2FnZXN9I3tjbGFzc05hbWV9XCJdXG4gICAgfVxuICBLb3RsaW46XG4gICAgJ1NlbGVjdGlvbiBCYXNlZCc6IHtcbiAgICAgIGNvbW1hbmRcbiAgICAgIGFyZ3M6IChjb250ZXh0KSAtPlxuICAgICAgICBjb2RlID0gY29udGV4dC5nZXRDb2RlKClcbiAgICAgICAgdG1wRmlsZSA9IEdyYW1tYXJVdGlscy5jcmVhdGVUZW1wRmlsZVdpdGhDb2RlKGNvZGUsICcua3QnKVxuICAgICAgICByZXR1cm4gYXJncyh0bXBGaWxlKVxuICAgIH1cbiAgICAnRmlsZSBCYXNlZCc6IHtcbiAgICAgIGNvbW1hbmRcbiAgICAgIGFyZ3M6ICh7ZmlsZXBhdGgsIGZpbGVuYW1lfSkgLT4gYXJncyhmaWxlcGF0aCwgXCIvdG1wLyN7ZmlsZW5hbWV9XCIpXG4gICAgfVxuICBQcm9jZXNzaW5nOlxuICAgICdGaWxlIEJhc2VkJzpcbiAgICAgIGNvbW1hbmQ6ICdwcm9jZXNzaW5nLWphdmEnXG4gICAgICBhcmdzOiAoe2ZpbGVwYXRofSkgLT4gW1wiLS1za2V0Y2g9JyN7cGF0aC5kaXJuYW1lKGZpbGVwYXRoKX0nXCIsICctLXJ1biddXG4iXX0=
