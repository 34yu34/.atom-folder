(function() {
  var GrammarUtils, _;

  _ = require('underscore');

  GrammarUtils = require('../grammar-utils');

  module.exports = {
    'Common Lisp': {
      'File Based': {
        command: 'clisp',
        args: function(arg) {
          var filepath;
          filepath = arg.filepath;
          return [filepath];
        }
      }
    },
    Lisp: {
      'Selection Based': {
        command: 'sbcl',
        args: function(context) {
          var statements;
          statements = _.flatten(_.map(GrammarUtils.Lisp.splitStatements(context.getCode()), function(statement) {
            return ['--eval', statement];
          }));
          return _.union(['--noinform', '--disable-debugger', '--non-interactive', '--quit'], statements);
        }
      },
      'File Based': {
        command: 'sbcl',
        args: function(arg) {
          var filepath;
          filepath = arg.filepath;
          return ['--noinform', '--script', filepath];
        }
      }
    },
    newLISP: {
      'Selection Based': {
        command: 'newlisp',
        args: function(context) {
          return ['-e', context.getCode()];
        }
      },
      'File Based': {
        command: 'newlisp',
        args: function(arg) {
          var filepath;
          filepath = arg.filepath;
          return [filepath];
        }
      }
    },
    Scheme: {
      'Selection Based': {
        command: 'guile',
        args: function(context) {
          return ['-c', context.getCode()];
        }
      },
      'File Based': {
        command: 'guile',
        args: function(arg) {
          var filepath;
          filepath = arg.filepath;
          return [filepath];
        }
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYmlsbHkvLmF0b20vcGFja2FnZXMvc2NyaXB0L2xpYi9ncmFtbWFycy9saXNwLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxZQUFSOztFQUNKLFlBQUEsR0FBZSxPQUFBLENBQVEsa0JBQVI7O0VBRWYsTUFBTSxDQUFDLE9BQVAsR0FFRTtJQUFBLGFBQUEsRUFDRTtNQUFBLFlBQUEsRUFDRTtRQUFBLE9BQUEsRUFBUyxPQUFUO1FBQ0EsSUFBQSxFQUFNLFNBQUMsR0FBRDtBQUFnQixjQUFBO1VBQWQsV0FBRDtpQkFBZSxDQUFDLFFBQUQ7UUFBaEIsQ0FETjtPQURGO0tBREY7SUFLQSxJQUFBLEVBQ0U7TUFBQSxpQkFBQSxFQUNFO1FBQUEsT0FBQSxFQUFTLE1BQVQ7UUFDQSxJQUFBLEVBQU0sU0FBQyxPQUFEO0FBQ0osY0FBQTtVQUFBLFVBQUEsR0FBYSxDQUFDLENBQUMsT0FBRixDQUFVLENBQUMsQ0FBQyxHQUFGLENBQU0sWUFBWSxDQUFDLElBQUksQ0FBQyxlQUFsQixDQUFrQyxPQUFPLENBQUMsT0FBUixDQUFBLENBQWxDLENBQU4sRUFBNEQsU0FBQyxTQUFEO21CQUFlLENBQUMsUUFBRCxFQUFXLFNBQVg7VUFBZixDQUE1RCxDQUFWO0FBQ2IsaUJBQU8sQ0FBQyxDQUFDLEtBQUYsQ0FBUSxDQUFDLFlBQUQsRUFBZSxvQkFBZixFQUFxQyxtQkFBckMsRUFBMEQsUUFBMUQsQ0FBUixFQUE2RSxVQUE3RTtRQUZILENBRE47T0FERjtNQU1BLFlBQUEsRUFDRTtRQUFBLE9BQUEsRUFBUyxNQUFUO1FBQ0EsSUFBQSxFQUFNLFNBQUMsR0FBRDtBQUFnQixjQUFBO1VBQWQsV0FBRDtpQkFBZSxDQUFDLFlBQUQsRUFBZSxVQUFmLEVBQTJCLFFBQTNCO1FBQWhCLENBRE47T0FQRjtLQU5GO0lBZ0JBLE9BQUEsRUFDRTtNQUFBLGlCQUFBLEVBQ0U7UUFBQSxPQUFBLEVBQVMsU0FBVDtRQUNBLElBQUEsRUFBTSxTQUFDLE9BQUQ7aUJBQWEsQ0FBQyxJQUFELEVBQU8sT0FBTyxDQUFDLE9BQVIsQ0FBQSxDQUFQO1FBQWIsQ0FETjtPQURGO01BR0EsWUFBQSxFQUNFO1FBQUEsT0FBQSxFQUFTLFNBQVQ7UUFDQSxJQUFBLEVBQU0sU0FBQyxHQUFEO0FBQWdCLGNBQUE7VUFBZCxXQUFEO2lCQUFlLENBQUMsUUFBRDtRQUFoQixDQUROO09BSkY7S0FqQkY7SUF3QkEsTUFBQSxFQUNFO01BQUEsaUJBQUEsRUFDRTtRQUFBLE9BQUEsRUFBUyxPQUFUO1FBQ0EsSUFBQSxFQUFNLFNBQUMsT0FBRDtpQkFBYSxDQUFDLElBQUQsRUFBTyxPQUFPLENBQUMsT0FBUixDQUFBLENBQVA7UUFBYixDQUROO09BREY7TUFHQSxZQUFBLEVBQ0U7UUFBQSxPQUFBLEVBQVMsT0FBVDtRQUNBLElBQUEsRUFBTSxTQUFDLEdBQUQ7QUFBZ0IsY0FBQTtVQUFkLFdBQUQ7aUJBQWUsQ0FBQyxRQUFEO1FBQWhCLENBRE47T0FKRjtLQXpCRjs7QUFMRiIsInNvdXJjZXNDb250ZW50IjpbIl8gPSByZXF1aXJlICd1bmRlcnNjb3JlJ1xuR3JhbW1hclV0aWxzID0gcmVxdWlyZSAnLi4vZ3JhbW1hci11dGlscydcblxubW9kdWxlLmV4cG9ydHMgPVxuXG4gICdDb21tb24gTGlzcCc6XG4gICAgJ0ZpbGUgQmFzZWQnOlxuICAgICAgY29tbWFuZDogJ2NsaXNwJ1xuICAgICAgYXJnczogKHtmaWxlcGF0aH0pIC0+IFtmaWxlcGF0aF1cblxuICBMaXNwOlxuICAgICdTZWxlY3Rpb24gQmFzZWQnOlxuICAgICAgY29tbWFuZDogJ3NiY2wnXG4gICAgICBhcmdzOiAoY29udGV4dCkgLT5cbiAgICAgICAgc3RhdGVtZW50cyA9IF8uZmxhdHRlbihfLm1hcChHcmFtbWFyVXRpbHMuTGlzcC5zcGxpdFN0YXRlbWVudHMoY29udGV4dC5nZXRDb2RlKCkpLCAoc3RhdGVtZW50KSAtPiBbJy0tZXZhbCcsIHN0YXRlbWVudF0pKVxuICAgICAgICByZXR1cm4gXy51bmlvbiBbJy0tbm9pbmZvcm0nLCAnLS1kaXNhYmxlLWRlYnVnZ2VyJywgJy0tbm9uLWludGVyYWN0aXZlJywgJy0tcXVpdCddLCBzdGF0ZW1lbnRzXG5cbiAgICAnRmlsZSBCYXNlZCc6XG4gICAgICBjb21tYW5kOiAnc2JjbCdcbiAgICAgIGFyZ3M6ICh7ZmlsZXBhdGh9KSAtPiBbJy0tbm9pbmZvcm0nLCAnLS1zY3JpcHQnLCBmaWxlcGF0aF1cblxuICBuZXdMSVNQOlxuICAgICdTZWxlY3Rpb24gQmFzZWQnOlxuICAgICAgY29tbWFuZDogJ25ld2xpc3AnXG4gICAgICBhcmdzOiAoY29udGV4dCkgLT4gWyctZScsIGNvbnRleHQuZ2V0Q29kZSgpXVxuICAgICdGaWxlIEJhc2VkJzpcbiAgICAgIGNvbW1hbmQ6ICduZXdsaXNwJ1xuICAgICAgYXJnczogKHtmaWxlcGF0aH0pIC0+IFtmaWxlcGF0aF1cblxuICBTY2hlbWU6XG4gICAgJ1NlbGVjdGlvbiBCYXNlZCc6XG4gICAgICBjb21tYW5kOiAnZ3VpbGUnXG4gICAgICBhcmdzOiAoY29udGV4dCkgLT4gWyctYycsIGNvbnRleHQuZ2V0Q29kZSgpXVxuICAgICdGaWxlIEJhc2VkJzpcbiAgICAgIGNvbW1hbmQ6ICdndWlsZSdcbiAgICAgIGFyZ3M6ICh7ZmlsZXBhdGh9KSAtPiBbZmlsZXBhdGhdXG4iXX0=
