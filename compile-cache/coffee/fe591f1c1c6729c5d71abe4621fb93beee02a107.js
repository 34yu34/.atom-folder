(function() {
  var GrammarUtils, command, windows;

  command = (GrammarUtils = require('../grammar-utils')).command;

  windows = GrammarUtils.OperatingSystem.isWindows();

  module.exports = {
    BuckleScript: {
      'Selection Based': {
        command: 'bsc',
        args: function(context) {
          var code, tmpFile;
          code = context.getCode();
          tmpFile = GrammarUtils.createTempFileWithCode(code);
          return ['-c', tmpFile];
        }
      },
      'File Based': {
        command: 'bsc',
        args: function(arg) {
          var filepath;
          filepath = arg.filepath;
          return ['-c', filepath];
        }
      }
    },
    OCaml: {
      'File Based': {
        command: 'ocaml',
        args: function(arg) {
          var filepath;
          filepath = arg.filepath;
          return [filepath];
        }
      }
    },
    Reason: {
      'File Based': {
        command: command,
        args: function(arg) {
          var file, filename;
          filename = arg.filename;
          file = filename.replace(/\.re$/, '.native');
          return GrammarUtils.formatArgs("rebuild '" + file + "' && '" + file + "'");
        }
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYmlsbHkvLmF0b20vcGFja2FnZXMvc2NyaXB0L2xpYi9ncmFtbWFycy9tbC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFDLFVBQVcsQ0FBQSxZQUFBLEdBQWUsT0FBQSxDQUFRLGtCQUFSLENBQWY7O0VBRVosT0FBQSxHQUFVLFlBQVksQ0FBQyxlQUFlLENBQUMsU0FBN0IsQ0FBQTs7RUFFVixNQUFNLENBQUMsT0FBUCxHQUVFO0lBQUEsWUFBQSxFQUNFO01BQUEsaUJBQUEsRUFDRTtRQUFBLE9BQUEsRUFBUyxLQUFUO1FBQ0EsSUFBQSxFQUFNLFNBQUMsT0FBRDtBQUNKLGNBQUE7VUFBQSxJQUFBLEdBQU8sT0FBTyxDQUFDLE9BQVIsQ0FBQTtVQUNQLE9BQUEsR0FBVSxZQUFZLENBQUMsc0JBQWIsQ0FBb0MsSUFBcEM7QUFDVixpQkFBTyxDQUFDLElBQUQsRUFBTyxPQUFQO1FBSEgsQ0FETjtPQURGO01BT0EsWUFBQSxFQUNFO1FBQUEsT0FBQSxFQUFTLEtBQVQ7UUFDQSxJQUFBLEVBQU0sU0FBQyxHQUFEO0FBQWdCLGNBQUE7VUFBZCxXQUFEO2lCQUFlLENBQUMsSUFBRCxFQUFPLFFBQVA7UUFBaEIsQ0FETjtPQVJGO0tBREY7SUFZQSxLQUFBLEVBQ0U7TUFBQSxZQUFBLEVBQ0U7UUFBQSxPQUFBLEVBQVMsT0FBVDtRQUNBLElBQUEsRUFBTSxTQUFDLEdBQUQ7QUFBZ0IsY0FBQTtVQUFkLFdBQUQ7aUJBQWUsQ0FBQyxRQUFEO1FBQWhCLENBRE47T0FERjtLQWJGO0lBaUJBLE1BQUEsRUFDRTtNQUFBLFlBQUEsRUFBYztRQUNaLFNBQUEsT0FEWTtRQUVaLElBQUEsRUFBTSxTQUFDLEdBQUQ7QUFDSixjQUFBO1VBRE0sV0FBRDtVQUNMLElBQUEsR0FBTyxRQUFRLENBQUMsT0FBVCxDQUFpQixPQUFqQixFQUEwQixTQUExQjtpQkFDUCxZQUFZLENBQUMsVUFBYixDQUF3QixXQUFBLEdBQVksSUFBWixHQUFpQixRQUFqQixHQUF5QixJQUF6QixHQUE4QixHQUF0RDtRQUZJLENBRk07T0FBZDtLQWxCRjs7QUFORiIsInNvdXJjZXNDb250ZW50IjpbIntjb21tYW5kfSA9IEdyYW1tYXJVdGlscyA9IHJlcXVpcmUgJy4uL2dyYW1tYXItdXRpbHMnXG5cbndpbmRvd3MgPSBHcmFtbWFyVXRpbHMuT3BlcmF0aW5nU3lzdGVtLmlzV2luZG93cygpXG5cbm1vZHVsZS5leHBvcnRzID1cblxuICBCdWNrbGVTY3JpcHQ6XG4gICAgJ1NlbGVjdGlvbiBCYXNlZCc6XG4gICAgICBjb21tYW5kOiAnYnNjJ1xuICAgICAgYXJnczogKGNvbnRleHQpIC0+XG4gICAgICAgIGNvZGUgPSBjb250ZXh0LmdldENvZGUoKVxuICAgICAgICB0bXBGaWxlID0gR3JhbW1hclV0aWxzLmNyZWF0ZVRlbXBGaWxlV2l0aENvZGUoY29kZSlcbiAgICAgICAgcmV0dXJuIFsnLWMnLCB0bXBGaWxlXVxuXG4gICAgJ0ZpbGUgQmFzZWQnOlxuICAgICAgY29tbWFuZDogJ2JzYydcbiAgICAgIGFyZ3M6ICh7ZmlsZXBhdGh9KSAtPiBbJy1jJywgZmlsZXBhdGhdXG5cbiAgT0NhbWw6XG4gICAgJ0ZpbGUgQmFzZWQnOlxuICAgICAgY29tbWFuZDogJ29jYW1sJ1xuICAgICAgYXJnczogKHtmaWxlcGF0aH0pIC0+IFtmaWxlcGF0aF1cblxuICBSZWFzb246XG4gICAgJ0ZpbGUgQmFzZWQnOiB7XG4gICAgICBjb21tYW5kXG4gICAgICBhcmdzOiAoe2ZpbGVuYW1lfSkgLT5cbiAgICAgICAgZmlsZSA9IGZpbGVuYW1lLnJlcGxhY2UgL1xcLnJlJC8sICcubmF0aXZlJ1xuICAgICAgICBHcmFtbWFyVXRpbHMuZm9ybWF0QXJncyhcInJlYnVpbGQgJyN7ZmlsZX0nICYmICcje2ZpbGV9J1wiKVxuICAgIH1cbiJdfQ==
