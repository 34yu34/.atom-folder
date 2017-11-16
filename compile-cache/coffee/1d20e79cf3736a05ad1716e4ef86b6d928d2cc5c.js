(function() {
  var GrammarUtils;

  GrammarUtils = require('../grammar-utils');

  module.exports = {
    'Behat Feature': {
      'File Based': {
        command: 'behat',
        args: function(arg) {
          var filepath;
          filepath = arg.filepath;
          return [filepath];
        }
      },
      'Line Number Based': {
        command: 'behat',
        args: function(context) {
          return [context.fileColonLine()];
        }
      }
    },
    PHP: {
      'Selection Based': {
        command: 'php',
        args: function(context) {
          var code, tmpFile;
          code = context.getCode();
          tmpFile = GrammarUtils.PHP.createTempFileWithCode(code);
          return [tmpFile];
        }
      },
      'File Based': {
        command: 'php',
        args: function(arg) {
          var filepath;
          filepath = arg.filepath;
          return [filepath];
        }
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYmlsbHkvLmF0b20vcGFja2FnZXMvc2NyaXB0L2xpYi9ncmFtbWFycy9waHAuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxZQUFBLEdBQWUsT0FBQSxDQUFRLGtCQUFSOztFQUVmLE1BQU0sQ0FBQyxPQUFQLEdBRUU7SUFBQSxlQUFBLEVBRUU7TUFBQSxZQUFBLEVBQ0U7UUFBQSxPQUFBLEVBQVMsT0FBVDtRQUNBLElBQUEsRUFBTSxTQUFDLEdBQUQ7QUFBZ0IsY0FBQTtVQUFkLFdBQUQ7aUJBQWUsQ0FBQyxRQUFEO1FBQWhCLENBRE47T0FERjtNQUlBLG1CQUFBLEVBQ0U7UUFBQSxPQUFBLEVBQVMsT0FBVDtRQUNBLElBQUEsRUFBTSxTQUFDLE9BQUQ7aUJBQWEsQ0FBQyxPQUFPLENBQUMsYUFBUixDQUFBLENBQUQ7UUFBYixDQUROO09BTEY7S0FGRjtJQVVBLEdBQUEsRUFDRTtNQUFBLGlCQUFBLEVBQ0U7UUFBQSxPQUFBLEVBQVMsS0FBVDtRQUNBLElBQUEsRUFBTSxTQUFDLE9BQUQ7QUFDSixjQUFBO1VBQUEsSUFBQSxHQUFPLE9BQU8sQ0FBQyxPQUFSLENBQUE7VUFDUCxPQUFBLEdBQVUsWUFBWSxDQUFDLEdBQUcsQ0FBQyxzQkFBakIsQ0FBd0MsSUFBeEM7QUFDVixpQkFBTyxDQUFDLE9BQUQ7UUFISCxDQUROO09BREY7TUFPQSxZQUFBLEVBQ0U7UUFBQSxPQUFBLEVBQVMsS0FBVDtRQUNBLElBQUEsRUFBTSxTQUFDLEdBQUQ7QUFBZ0IsY0FBQTtVQUFkLFdBQUQ7aUJBQWUsQ0FBQyxRQUFEO1FBQWhCLENBRE47T0FSRjtLQVhGOztBQUpGIiwic291cmNlc0NvbnRlbnQiOlsiR3JhbW1hclV0aWxzID0gcmVxdWlyZSAnLi4vZ3JhbW1hci11dGlscydcblxubW9kdWxlLmV4cG9ydHMgPVxuXG4gICdCZWhhdCBGZWF0dXJlJzpcblxuICAgICdGaWxlIEJhc2VkJzpcbiAgICAgIGNvbW1hbmQ6ICdiZWhhdCdcbiAgICAgIGFyZ3M6ICh7ZmlsZXBhdGh9KSAtPiBbZmlsZXBhdGhdXG5cbiAgICAnTGluZSBOdW1iZXIgQmFzZWQnOlxuICAgICAgY29tbWFuZDogJ2JlaGF0J1xuICAgICAgYXJnczogKGNvbnRleHQpIC0+IFtjb250ZXh0LmZpbGVDb2xvbkxpbmUoKV1cblxuICBQSFA6XG4gICAgJ1NlbGVjdGlvbiBCYXNlZCc6XG4gICAgICBjb21tYW5kOiAncGhwJ1xuICAgICAgYXJnczogKGNvbnRleHQpIC0+XG4gICAgICAgIGNvZGUgPSBjb250ZXh0LmdldENvZGUoKVxuICAgICAgICB0bXBGaWxlID0gR3JhbW1hclV0aWxzLlBIUC5jcmVhdGVUZW1wRmlsZVdpdGhDb2RlKGNvZGUpXG4gICAgICAgIHJldHVybiBbdG1wRmlsZV1cblxuICAgICdGaWxlIEJhc2VkJzpcbiAgICAgIGNvbW1hbmQ6ICdwaHAnXG4gICAgICBhcmdzOiAoe2ZpbGVwYXRofSkgLT4gW2ZpbGVwYXRoXVxuIl19
