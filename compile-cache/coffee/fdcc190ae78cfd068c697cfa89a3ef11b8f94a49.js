(function() {
  var GrammarUtils;

  GrammarUtils = require('../grammar-utils');

  exports.AutoHotKey = {
    'Selection Based': {
      command: 'AutoHotKey',
      args: function(context) {
        var code, tmpFile;
        code = context.getCode();
        tmpFile = GrammarUtils.createTempFileWithCode(code);
        return [tmpFile];
      }
    },
    'File Based': {
      command: 'AutoHotKey',
      args: function(arg) {
        var filepath;
        filepath = arg.filepath;
        return [filepath];
      }
    }
  };

  exports.Batch = {
    'File Based': {
      command: 'cmd.exe',
      args: function(arg) {
        var filepath;
        filepath = arg.filepath;
        return ['/q', '/c', filepath];
      }
    }
  };

  exports['Batch File'] = exports.Batch;

  exports.PowerShell = {
    'Selection Based': {
      command: 'powershell',
      args: function(context) {
        return [context.getCode()];
      }
    },
    'File Based': {
      command: 'powershell',
      args: function(arg) {
        var filepath;
        filepath = arg.filepath;
        return [filepath.replace(/\ /g, '` ')];
      }
    }
  };

  exports.VBScript = {
    'Selection Based': {
      command: 'cscript',
      args: function(context) {
        var code, tmpFile;
        code = context.getCode();
        tmpFile = GrammarUtils.createTempFileWithCode(code, '.vbs');
        return ['//NOLOGO', tmpFile];
      }
    },
    'File Based': {
      command: 'cscript',
      args: function(arg) {
        var filepath;
        filepath = arg.filepath;
        return ['//NOLOGO', filepath];
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYmlsbHkvLmF0b20vcGFja2FnZXMvc2NyaXB0L2xpYi9ncmFtbWFycy93aW5kb3dzLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsWUFBQSxHQUFlLE9BQUEsQ0FBUSxrQkFBUjs7RUFJZixPQUFPLENBQUMsVUFBUixHQUNFO0lBQUEsaUJBQUEsRUFDRTtNQUFBLE9BQUEsRUFBUyxZQUFUO01BQ0EsSUFBQSxFQUFNLFNBQUMsT0FBRDtBQUNKLFlBQUE7UUFBQSxJQUFBLEdBQU8sT0FBTyxDQUFDLE9BQVIsQ0FBQTtRQUNQLE9BQUEsR0FBVSxZQUFZLENBQUMsc0JBQWIsQ0FBb0MsSUFBcEM7QUFDVixlQUFPLENBQUMsT0FBRDtNQUhILENBRE47S0FERjtJQU9BLFlBQUEsRUFDRTtNQUFBLE9BQUEsRUFBUyxZQUFUO01BQ0EsSUFBQSxFQUFNLFNBQUMsR0FBRDtBQUFnQixZQUFBO1FBQWQsV0FBRDtlQUFlLENBQUMsUUFBRDtNQUFoQixDQUROO0tBUkY7OztFQVdGLE9BQU8sQ0FBQyxLQUFSLEdBQ0U7SUFBQSxZQUFBLEVBQ0U7TUFBQSxPQUFBLEVBQVMsU0FBVDtNQUNBLElBQUEsRUFBTSxTQUFDLEdBQUQ7QUFBZ0IsWUFBQTtRQUFkLFdBQUQ7ZUFBZSxDQUFDLElBQUQsRUFBTyxJQUFQLEVBQWEsUUFBYjtNQUFoQixDQUROO0tBREY7OztFQUlGLE9BQVEsQ0FBQSxZQUFBLENBQVIsR0FBd0IsT0FBTyxDQUFDOztFQUVoQyxPQUFPLENBQUMsVUFBUixHQUNFO0lBQUEsaUJBQUEsRUFDRTtNQUFBLE9BQUEsRUFBUyxZQUFUO01BQ0EsSUFBQSxFQUFNLFNBQUMsT0FBRDtlQUFhLENBQUMsT0FBTyxDQUFDLE9BQVIsQ0FBQSxDQUFEO01BQWIsQ0FETjtLQURGO0lBSUEsWUFBQSxFQUNFO01BQUEsT0FBQSxFQUFTLFlBQVQ7TUFDQSxJQUFBLEVBQU0sU0FBQyxHQUFEO0FBQWdCLFlBQUE7UUFBZCxXQUFEO2VBQWUsQ0FBQyxRQUFRLENBQUMsT0FBVCxDQUFpQixLQUFqQixFQUF3QixJQUF4QixDQUFEO01BQWhCLENBRE47S0FMRjs7O0VBUUYsT0FBTyxDQUFDLFFBQVIsR0FDRTtJQUFBLGlCQUFBLEVBQ0U7TUFBQSxPQUFBLEVBQVMsU0FBVDtNQUNBLElBQUEsRUFBTSxTQUFDLE9BQUQ7QUFDSixZQUFBO1FBQUEsSUFBQSxHQUFPLE9BQU8sQ0FBQyxPQUFSLENBQUE7UUFDUCxPQUFBLEdBQVUsWUFBWSxDQUFDLHNCQUFiLENBQW9DLElBQXBDLEVBQTBDLE1BQTFDO0FBQ1YsZUFBTyxDQUFDLFVBQUQsRUFBYSxPQUFiO01BSEgsQ0FETjtLQURGO0lBT0EsWUFBQSxFQUNFO01BQUEsT0FBQSxFQUFTLFNBQVQ7TUFDQSxJQUFBLEVBQU0sU0FBQyxHQUFEO0FBQWdCLFlBQUE7UUFBZCxXQUFEO2VBQWUsQ0FBQyxVQUFELEVBQWEsUUFBYjtNQUFoQixDQUROO0tBUkY7O0FBakNGIiwic291cmNlc0NvbnRlbnQiOlsiR3JhbW1hclV0aWxzID0gcmVxdWlyZSAnLi4vZ3JhbW1hci11dGlscydcblxuI2lmIEdyYW1tYXJVdGlscy5PcGVyYXRpbmdTeXN0ZW0uaXNXaW5kb3dzKClcblxuZXhwb3J0cy5BdXRvSG90S2V5ID1cbiAgJ1NlbGVjdGlvbiBCYXNlZCc6XG4gICAgY29tbWFuZDogJ0F1dG9Ib3RLZXknXG4gICAgYXJnczogKGNvbnRleHQpIC0+XG4gICAgICBjb2RlID0gY29udGV4dC5nZXRDb2RlKClcbiAgICAgIHRtcEZpbGUgPSBHcmFtbWFyVXRpbHMuY3JlYXRlVGVtcEZpbGVXaXRoQ29kZShjb2RlKVxuICAgICAgcmV0dXJuIFt0bXBGaWxlXVxuXG4gICdGaWxlIEJhc2VkJzpcbiAgICBjb21tYW5kOiAnQXV0b0hvdEtleSdcbiAgICBhcmdzOiAoe2ZpbGVwYXRofSkgLT4gW2ZpbGVwYXRoXVxuXG5leHBvcnRzLkJhdGNoID1cbiAgJ0ZpbGUgQmFzZWQnOlxuICAgIGNvbW1hbmQ6ICdjbWQuZXhlJ1xuICAgIGFyZ3M6ICh7ZmlsZXBhdGh9KSAtPiBbJy9xJywgJy9jJywgZmlsZXBhdGhdXG5cbmV4cG9ydHNbJ0JhdGNoIEZpbGUnXSA9IGV4cG9ydHMuQmF0Y2hcblxuZXhwb3J0cy5Qb3dlclNoZWxsID1cbiAgJ1NlbGVjdGlvbiBCYXNlZCc6XG4gICAgY29tbWFuZDogJ3Bvd2Vyc2hlbGwnXG4gICAgYXJnczogKGNvbnRleHQpIC0+IFtjb250ZXh0LmdldENvZGUoKV1cblxuICAnRmlsZSBCYXNlZCc6XG4gICAgY29tbWFuZDogJ3Bvd2Vyc2hlbGwnXG4gICAgYXJnczogKHtmaWxlcGF0aH0pIC0+IFtmaWxlcGF0aC5yZXBsYWNlIC9cXCAvZywgJ2AgJ11cblxuZXhwb3J0cy5WQlNjcmlwdCA9XG4gICdTZWxlY3Rpb24gQmFzZWQnOlxuICAgIGNvbW1hbmQ6ICdjc2NyaXB0J1xuICAgIGFyZ3M6IChjb250ZXh0KSAtPlxuICAgICAgY29kZSA9IGNvbnRleHQuZ2V0Q29kZSgpXG4gICAgICB0bXBGaWxlID0gR3JhbW1hclV0aWxzLmNyZWF0ZVRlbXBGaWxlV2l0aENvZGUoY29kZSwgJy52YnMnKVxuICAgICAgcmV0dXJuIFsnLy9OT0xPR08nLCB0bXBGaWxlXVxuXG4gICdGaWxlIEJhc2VkJzpcbiAgICBjb21tYW5kOiAnY3NjcmlwdCdcbiAgICBhcmdzOiAoe2ZpbGVwYXRofSkgLT4gWycvL05PTE9HTycsIGZpbGVwYXRoXVxuIl19
