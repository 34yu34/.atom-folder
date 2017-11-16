(function() {
  module.exports = {
    RSpec: {
      'Selection Based': {
        command: 'ruby',
        args: function(context) {
          return ['-e', context.getCode()];
        }
      },
      'File Based': {
        command: 'rspec',
        args: function(arg) {
          var filepath;
          filepath = arg.filepath;
          return ['--tty', '--color', filepath];
        }
      },
      'Line Number Based': {
        command: 'rspec',
        args: function(context) {
          return ['--tty', '--color', context.fileColonLine()];
        }
      }
    },
    Ruby: {
      'Selection Based': {
        command: 'ruby',
        args: function(context) {
          return ['-e', context.getCode()];
        }
      },
      'File Based': {
        command: 'ruby',
        args: function(arg) {
          var filepath;
          filepath = arg.filepath;
          return [filepath];
        }
      }
    },
    'Ruby on Rails': {
      'Selection Based': {
        command: 'rails',
        args: function(context) {
          return ['runner', context.getCode()];
        }
      },
      'File Based': {
        command: 'rails',
        args: function(arg) {
          var filepath;
          filepath = arg.filepath;
          return ['runner', filepath];
        }
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYmlsbHkvLmF0b20vcGFja2FnZXMvc2NyaXB0L2xpYi9ncmFtbWFycy9ydWJ5LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBRUU7SUFBQSxLQUFBLEVBQ0U7TUFBQSxpQkFBQSxFQUNFO1FBQUEsT0FBQSxFQUFTLE1BQVQ7UUFDQSxJQUFBLEVBQU0sU0FBQyxPQUFEO2lCQUFhLENBQUMsSUFBRCxFQUFPLE9BQU8sQ0FBQyxPQUFSLENBQUEsQ0FBUDtRQUFiLENBRE47T0FERjtNQUlBLFlBQUEsRUFDRTtRQUFBLE9BQUEsRUFBUyxPQUFUO1FBQ0EsSUFBQSxFQUFNLFNBQUMsR0FBRDtBQUFnQixjQUFBO1VBQWQsV0FBRDtpQkFBZSxDQUFDLE9BQUQsRUFBVSxTQUFWLEVBQXFCLFFBQXJCO1FBQWhCLENBRE47T0FMRjtNQVFBLG1CQUFBLEVBQ0U7UUFBQSxPQUFBLEVBQVMsT0FBVDtRQUNBLElBQUEsRUFBTSxTQUFDLE9BQUQ7aUJBQWEsQ0FBQyxPQUFELEVBQVUsU0FBVixFQUFxQixPQUFPLENBQUMsYUFBUixDQUFBLENBQXJCO1FBQWIsQ0FETjtPQVRGO0tBREY7SUFhQSxJQUFBLEVBQ0U7TUFBQSxpQkFBQSxFQUNFO1FBQUEsT0FBQSxFQUFTLE1BQVQ7UUFDQSxJQUFBLEVBQU0sU0FBQyxPQUFEO2lCQUFhLENBQUMsSUFBRCxFQUFPLE9BQU8sQ0FBQyxPQUFSLENBQUEsQ0FBUDtRQUFiLENBRE47T0FERjtNQUlBLFlBQUEsRUFDRTtRQUFBLE9BQUEsRUFBUyxNQUFUO1FBQ0EsSUFBQSxFQUFNLFNBQUMsR0FBRDtBQUFnQixjQUFBO1VBQWQsV0FBRDtpQkFBZSxDQUFDLFFBQUQ7UUFBaEIsQ0FETjtPQUxGO0tBZEY7SUFzQkEsZUFBQSxFQUVFO01BQUEsaUJBQUEsRUFDRTtRQUFBLE9BQUEsRUFBUyxPQUFUO1FBQ0EsSUFBQSxFQUFNLFNBQUMsT0FBRDtpQkFBYSxDQUFDLFFBQUQsRUFBVyxPQUFPLENBQUMsT0FBUixDQUFBLENBQVg7UUFBYixDQUROO09BREY7TUFJQSxZQUFBLEVBQ0U7UUFBQSxPQUFBLEVBQVMsT0FBVDtRQUNBLElBQUEsRUFBTSxTQUFDLEdBQUQ7QUFBZ0IsY0FBQTtVQUFkLFdBQUQ7aUJBQWUsQ0FBQyxRQUFELEVBQVcsUUFBWDtRQUFoQixDQUROO09BTEY7S0F4QkY7O0FBRkYiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9XG5cbiAgUlNwZWM6XG4gICAgJ1NlbGVjdGlvbiBCYXNlZCc6XG4gICAgICBjb21tYW5kOiAncnVieSdcbiAgICAgIGFyZ3M6IChjb250ZXh0KSAtPiBbJy1lJywgY29udGV4dC5nZXRDb2RlKCldXG5cbiAgICAnRmlsZSBCYXNlZCc6XG4gICAgICBjb21tYW5kOiAncnNwZWMnXG4gICAgICBhcmdzOiAoe2ZpbGVwYXRofSkgLT4gWyctLXR0eScsICctLWNvbG9yJywgZmlsZXBhdGhdXG5cbiAgICAnTGluZSBOdW1iZXIgQmFzZWQnOlxuICAgICAgY29tbWFuZDogJ3JzcGVjJ1xuICAgICAgYXJnczogKGNvbnRleHQpIC0+IFsnLS10dHknLCAnLS1jb2xvcicsIGNvbnRleHQuZmlsZUNvbG9uTGluZSgpXVxuXG4gIFJ1Ynk6XG4gICAgJ1NlbGVjdGlvbiBCYXNlZCc6XG4gICAgICBjb21tYW5kOiAncnVieSdcbiAgICAgIGFyZ3M6IChjb250ZXh0KSAtPiBbJy1lJywgY29udGV4dC5nZXRDb2RlKCldXG5cbiAgICAnRmlsZSBCYXNlZCc6XG4gICAgICBjb21tYW5kOiAncnVieSdcbiAgICAgIGFyZ3M6ICh7ZmlsZXBhdGh9KSAtPiBbZmlsZXBhdGhdXG5cbiAgJ1J1Ynkgb24gUmFpbHMnOlxuXG4gICAgJ1NlbGVjdGlvbiBCYXNlZCc6XG4gICAgICBjb21tYW5kOiAncmFpbHMnXG4gICAgICBhcmdzOiAoY29udGV4dCkgLT4gWydydW5uZXInLCBjb250ZXh0LmdldENvZGUoKV1cblxuICAgICdGaWxlIEJhc2VkJzpcbiAgICAgIGNvbW1hbmQ6ICdyYWlscydcbiAgICAgIGFyZ3M6ICh7ZmlsZXBhdGh9KSAtPiBbJ3J1bm5lcicsIGZpbGVwYXRoXVxuIl19
