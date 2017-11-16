(function() {
  var GrammarUtils;

  GrammarUtils = require('../grammar-utils');

  exports.Perl = {
    'Selection Based': {
      command: 'perl',
      args: function(context) {
        var code, tmpFile;
        code = context.getCode();
        tmpFile = GrammarUtils.createTempFileWithCode(code);
        return [tmpFile];
      }
    },
    'File Based': {
      command: 'perl',
      args: function(arg) {
        var filepath;
        filepath = arg.filepath;
        return [filepath];
      }
    }
  };

  exports['Perl 6'] = {
    'Selection Based': {
      command: 'perl6',
      args: function(context) {
        return ['-e', context.getCode()];
      }
    },
    'File Based': {
      command: 'perl6',
      args: function(arg) {
        var filepath;
        filepath = arg.filepath;
        return [filepath];
      }
    }
  };

  exports['Perl 6 FE'] = exports['Perl 6'];

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYmlsbHkvLmF0b20vcGFja2FnZXMvc2NyaXB0L2xpYi9ncmFtbWFycy9wZXJsLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsWUFBQSxHQUFlLE9BQUEsQ0FBUSxrQkFBUjs7RUFFZixPQUFPLENBQUMsSUFBUixHQUNFO0lBQUEsaUJBQUEsRUFDRTtNQUFBLE9BQUEsRUFBUyxNQUFUO01BQ0EsSUFBQSxFQUFNLFNBQUMsT0FBRDtBQUNKLFlBQUE7UUFBQSxJQUFBLEdBQU8sT0FBTyxDQUFDLE9BQVIsQ0FBQTtRQUNQLE9BQUEsR0FBVSxZQUFZLENBQUMsc0JBQWIsQ0FBb0MsSUFBcEM7QUFDVixlQUFPLENBQUMsT0FBRDtNQUhILENBRE47S0FERjtJQU9BLFlBQUEsRUFDRTtNQUFBLE9BQUEsRUFBUyxNQUFUO01BQ0EsSUFBQSxFQUFNLFNBQUMsR0FBRDtBQUFnQixZQUFBO1FBQWQsV0FBRDtlQUFlLENBQUMsUUFBRDtNQUFoQixDQUROO0tBUkY7OztFQVdGLE9BQVEsQ0FBQSxRQUFBLENBQVIsR0FDRTtJQUFBLGlCQUFBLEVBQ0U7TUFBQSxPQUFBLEVBQVMsT0FBVDtNQUNBLElBQUEsRUFBTSxTQUFDLE9BQUQ7ZUFBYSxDQUFDLElBQUQsRUFBTyxPQUFPLENBQUMsT0FBUixDQUFBLENBQVA7TUFBYixDQUROO0tBREY7SUFJQSxZQUFBLEVBQ0U7TUFBQSxPQUFBLEVBQVMsT0FBVDtNQUNBLElBQUEsRUFBTSxTQUFDLEdBQUQ7QUFBZ0IsWUFBQTtRQUFkLFdBQUQ7ZUFBZSxDQUFDLFFBQUQ7TUFBaEIsQ0FETjtLQUxGOzs7RUFRRixPQUFRLENBQUEsV0FBQSxDQUFSLEdBQXVCLE9BQVEsQ0FBQSxRQUFBO0FBdkIvQiIsInNvdXJjZXNDb250ZW50IjpbIkdyYW1tYXJVdGlscyA9IHJlcXVpcmUgJy4uL2dyYW1tYXItdXRpbHMnXG5cbmV4cG9ydHMuUGVybCA9XG4gICdTZWxlY3Rpb24gQmFzZWQnOlxuICAgIGNvbW1hbmQ6ICdwZXJsJ1xuICAgIGFyZ3M6IChjb250ZXh0KSAtPlxuICAgICAgY29kZSA9IGNvbnRleHQuZ2V0Q29kZSgpXG4gICAgICB0bXBGaWxlID0gR3JhbW1hclV0aWxzLmNyZWF0ZVRlbXBGaWxlV2l0aENvZGUoY29kZSlcbiAgICAgIHJldHVybiBbdG1wRmlsZV1cblxuICAnRmlsZSBCYXNlZCc6XG4gICAgY29tbWFuZDogJ3BlcmwnXG4gICAgYXJnczogKHtmaWxlcGF0aH0pIC0+IFtmaWxlcGF0aF1cblxuZXhwb3J0c1snUGVybCA2J10gPVxuICAnU2VsZWN0aW9uIEJhc2VkJzpcbiAgICBjb21tYW5kOiAncGVybDYnXG4gICAgYXJnczogKGNvbnRleHQpIC0+IFsnLWUnLCBjb250ZXh0LmdldENvZGUoKV1cblxuICAnRmlsZSBCYXNlZCc6XG4gICAgY29tbWFuZDogJ3Blcmw2J1xuICAgIGFyZ3M6ICh7ZmlsZXBhdGh9KSAtPiBbZmlsZXBhdGhdXG5cbmV4cG9ydHNbJ1BlcmwgNiBGRSddID0gZXhwb3J0c1snUGVybCA2J11cbiJdfQ==
