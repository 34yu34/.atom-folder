(function() {
  var GrammarUtils, base, ref, ref1, ref2, shell;

  shell = require('electron').shell;

  GrammarUtils = require('../grammar-utils');

  exports.DOT = {
    'Selection Based': {
      command: 'dot',
      args: function(context) {
        var code, tmpFile;
        code = context.getCode();
        tmpFile = GrammarUtils.createTempFileWithCode(code, '.dot');
        return ['-Tpng', tmpFile, '-o', tmpFile + '.png'];
      }
    },
    'File Based': {
      command: 'dot',
      args: function(arg) {
        var filepath;
        filepath = arg.filepath;
        return ['-Tpng', filepath, '-o', filepath + '.png'];
      }
    }
  };

  exports.gnuplot = {
    'File Based': {
      command: 'gnuplot',
      workingDirectory: (ref = atom.workspace.getActivePaneItem()) != null ? (ref1 = ref.buffer) != null ? (ref2 = ref1.file) != null ? typeof ref2.getParent === "function" ? typeof (base = ref2.getParent()).getPath === "function" ? base.getPath() : void 0 : void 0 : void 0 : void 0 : void 0,
      args: function(arg) {
        var filepath;
        filepath = arg.filepath;
        return ['-p', filepath];
      }
    }
  };

  exports['Graphviz (DOT)'] = {
    'Selection Based': {
      command: 'dot',
      args: function(context) {
        var code, tmpFile;
        code = context.getCode();
        tmpFile = GrammarUtils.createTempFileWithCode(code, '.dot');
        return ['-Tpng', tmpFile, '-o', tmpFile + '.png'];
      }
    },
    'File Based': {
      command: 'dot',
      args: function(arg) {
        var filepath;
        filepath = arg.filepath;
        return ['-Tpng', filepath, '-o', filepath + '.png'];
      }
    }
  };

  exports.HTML = {
    'File Based': {
      command: 'echo',
      args: function(arg) {
        var filepath, uri;
        filepath = arg.filepath;
        uri = 'file://' + filepath;
        shell.openExternal(uri);
        return ['HTML file opened at:', uri];
      }
    }
  };

  exports.LaTeX = {
    'File Based': {
      command: 'latexmk',
      args: function(arg) {
        var filepath;
        filepath = arg.filepath;
        return ['-cd', '-quiet', '-pdf', '-pv', '-shell-escape', filepath];
      }
    }
  };

  exports['LaTeX Beamer'] = exports.LaTeX;

  exports['Pandoc Markdown'] = {
    'File Based': {
      command: 'panzer',
      args: function(arg) {
        var filepath;
        filepath = arg.filepath;
        return [filepath, "--output='" + filepath + ".pdf'"];
      }
    }
  };

  exports.Sass = {
    'File Based': {
      command: 'sass',
      args: function(arg) {
        var filepath;
        filepath = arg.filepath;
        return [filepath];
      }
    }
  };

  exports.SCSS = exports.Sass;

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYmlsbHkvLmF0b20vcGFja2FnZXMvc2NyaXB0L2xpYi9ncmFtbWFycy9kb2MuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQyxRQUFTLE9BQUEsQ0FBUSxVQUFSOztFQUNWLFlBQUEsR0FBZSxPQUFBLENBQVEsa0JBQVI7O0VBRWYsT0FBTyxDQUFDLEdBQVIsR0FDRTtJQUFBLGlCQUFBLEVBQ0U7TUFBQSxPQUFBLEVBQVMsS0FBVDtNQUNBLElBQUEsRUFBTSxTQUFDLE9BQUQ7QUFDSixZQUFBO1FBQUEsSUFBQSxHQUFPLE9BQU8sQ0FBQyxPQUFSLENBQUE7UUFDUCxPQUFBLEdBQVUsWUFBWSxDQUFDLHNCQUFiLENBQW9DLElBQXBDLEVBQTBDLE1BQTFDO2VBQ1YsQ0FBQyxPQUFELEVBQVUsT0FBVixFQUFtQixJQUFuQixFQUF5QixPQUFBLEdBQVUsTUFBbkM7TUFISSxDQUROO0tBREY7SUFPQSxZQUFBLEVBQ0U7TUFBQSxPQUFBLEVBQVMsS0FBVDtNQUNBLElBQUEsRUFBTSxTQUFDLEdBQUQ7QUFBZ0IsWUFBQTtRQUFkLFdBQUQ7ZUFBZSxDQUFDLE9BQUQsRUFBVSxRQUFWLEVBQW9CLElBQXBCLEVBQTBCLFFBQUEsR0FBVyxNQUFyQztNQUFoQixDQUROO0tBUkY7OztFQVdGLE9BQU8sQ0FBQyxPQUFSLEdBQ0U7SUFBQSxZQUFBLEVBQ0U7TUFBQSxPQUFBLEVBQVMsU0FBVDtNQUNBLGdCQUFBLHVOQUFnRixDQUFDLHNEQURqRjtNQUVBLElBQUEsRUFBTSxTQUFDLEdBQUQ7QUFBZ0IsWUFBQTtRQUFkLFdBQUQ7ZUFBZSxDQUFDLElBQUQsRUFBTyxRQUFQO01BQWhCLENBRk47S0FERjs7O0VBS0YsT0FBUSxDQUFBLGdCQUFBLENBQVIsR0FFRTtJQUFBLGlCQUFBLEVBQ0U7TUFBQSxPQUFBLEVBQVMsS0FBVDtNQUNBLElBQUEsRUFBTSxTQUFDLE9BQUQ7QUFDSixZQUFBO1FBQUEsSUFBQSxHQUFPLE9BQU8sQ0FBQyxPQUFSLENBQUE7UUFDUCxPQUFBLEdBQVUsWUFBWSxDQUFDLHNCQUFiLENBQW9DLElBQXBDLEVBQTBDLE1BQTFDO0FBQ1YsZUFBTyxDQUFDLE9BQUQsRUFBVSxPQUFWLEVBQW1CLElBQW5CLEVBQXlCLE9BQUEsR0FBVSxNQUFuQztNQUhILENBRE47S0FERjtJQU9BLFlBQUEsRUFDRTtNQUFBLE9BQUEsRUFBUyxLQUFUO01BQ0EsSUFBQSxFQUFNLFNBQUMsR0FBRDtBQUFnQixZQUFBO1FBQWQsV0FBRDtlQUFlLENBQUMsT0FBRCxFQUFVLFFBQVYsRUFBb0IsSUFBcEIsRUFBMEIsUUFBQSxHQUFXLE1BQXJDO01BQWhCLENBRE47S0FSRjs7O0VBV0YsT0FBTyxDQUFDLElBQVIsR0FDRTtJQUFBLFlBQUEsRUFDRTtNQUFBLE9BQUEsRUFBUyxNQUFUO01BQ0EsSUFBQSxFQUFNLFNBQUMsR0FBRDtBQUNKLFlBQUE7UUFETSxXQUFEO1FBQ0wsR0FBQSxHQUFNLFNBQUEsR0FBWTtRQUNsQixLQUFLLENBQUMsWUFBTixDQUFtQixHQUFuQjtBQUNBLGVBQU8sQ0FBQyxzQkFBRCxFQUF5QixHQUF6QjtNQUhILENBRE47S0FERjs7O0VBT0YsT0FBTyxDQUFDLEtBQVIsR0FDRTtJQUFBLFlBQUEsRUFDRTtNQUFBLE9BQUEsRUFBUyxTQUFUO01BQ0EsSUFBQSxFQUFNLFNBQUMsR0FBRDtBQUFnQixZQUFBO1FBQWQsV0FBRDtlQUFlLENBQUMsS0FBRCxFQUFRLFFBQVIsRUFBa0IsTUFBbEIsRUFBMEIsS0FBMUIsRUFBaUMsZUFBakMsRUFBa0QsUUFBbEQ7TUFBaEIsQ0FETjtLQURGOzs7RUFJRixPQUFRLENBQUEsY0FBQSxDQUFSLEdBQTBCLE9BQU8sQ0FBQzs7RUFFbEMsT0FBUSxDQUFBLGlCQUFBLENBQVIsR0FDRTtJQUFBLFlBQUEsRUFDRTtNQUFBLE9BQUEsRUFBUyxRQUFUO01BQ0EsSUFBQSxFQUFNLFNBQUMsR0FBRDtBQUFnQixZQUFBO1FBQWQsV0FBRDtlQUFlLENBQUMsUUFBRCxFQUFXLFlBQUEsR0FBYSxRQUFiLEdBQXNCLE9BQWpDO01BQWhCLENBRE47S0FERjs7O0VBSUYsT0FBTyxDQUFDLElBQVIsR0FDRTtJQUFBLFlBQUEsRUFDRTtNQUFBLE9BQUEsRUFBUyxNQUFUO01BQ0EsSUFBQSxFQUFNLFNBQUMsR0FBRDtBQUFnQixZQUFBO1FBQWQsV0FBRDtlQUFlLENBQUMsUUFBRDtNQUFoQixDQUROO0tBREY7OztFQUlGLE9BQU8sQ0FBQyxJQUFSLEdBQWUsT0FBTyxDQUFDO0FBM0R2QiIsInNvdXJjZXNDb250ZW50IjpbIntzaGVsbH0gPSByZXF1aXJlICdlbGVjdHJvbidcbkdyYW1tYXJVdGlscyA9IHJlcXVpcmUgJy4uL2dyYW1tYXItdXRpbHMnXG5cbmV4cG9ydHMuRE9UID1cbiAgJ1NlbGVjdGlvbiBCYXNlZCc6XG4gICAgY29tbWFuZDogJ2RvdCdcbiAgICBhcmdzOiAoY29udGV4dCkgLT5cbiAgICAgIGNvZGUgPSBjb250ZXh0LmdldENvZGUoKVxuICAgICAgdG1wRmlsZSA9IEdyYW1tYXJVdGlscy5jcmVhdGVUZW1wRmlsZVdpdGhDb2RlKGNvZGUsICcuZG90JylcbiAgICAgIFsnLVRwbmcnLCB0bXBGaWxlLCAnLW8nLCB0bXBGaWxlICsgJy5wbmcnXVxuXG4gICdGaWxlIEJhc2VkJzpcbiAgICBjb21tYW5kOiAnZG90J1xuICAgIGFyZ3M6ICh7ZmlsZXBhdGh9KSAtPiBbJy1UcG5nJywgZmlsZXBhdGgsICctbycsIGZpbGVwYXRoICsgJy5wbmcnXVxuXG5leHBvcnRzLmdudXBsb3QgPVxuICAnRmlsZSBCYXNlZCc6XG4gICAgY29tbWFuZDogJ2dudXBsb3QnXG4gICAgd29ya2luZ0RpcmVjdG9yeTogYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlUGFuZUl0ZW0oKT8uYnVmZmVyPy5maWxlPy5nZXRQYXJlbnQ/KCkuZ2V0UGF0aD8oKVxuICAgIGFyZ3M6ICh7ZmlsZXBhdGh9KSAtPiBbJy1wJywgZmlsZXBhdGhdXG5cbmV4cG9ydHNbJ0dyYXBodml6IChET1QpJ10gPVxuXG4gICdTZWxlY3Rpb24gQmFzZWQnOlxuICAgIGNvbW1hbmQ6ICdkb3QnXG4gICAgYXJnczogKGNvbnRleHQpIC0+XG4gICAgICBjb2RlID0gY29udGV4dC5nZXRDb2RlKClcbiAgICAgIHRtcEZpbGUgPSBHcmFtbWFyVXRpbHMuY3JlYXRlVGVtcEZpbGVXaXRoQ29kZShjb2RlLCAnLmRvdCcpXG4gICAgICByZXR1cm4gWyctVHBuZycsIHRtcEZpbGUsICctbycsIHRtcEZpbGUgKyAnLnBuZyddXG5cbiAgJ0ZpbGUgQmFzZWQnOlxuICAgIGNvbW1hbmQ6ICdkb3QnXG4gICAgYXJnczogKHtmaWxlcGF0aH0pIC0+IFsnLVRwbmcnLCBmaWxlcGF0aCwgJy1vJywgZmlsZXBhdGggKyAnLnBuZyddXG5cbmV4cG9ydHMuSFRNTCA9XG4gICdGaWxlIEJhc2VkJzpcbiAgICBjb21tYW5kOiAnZWNobydcbiAgICBhcmdzOiAoe2ZpbGVwYXRofSkgLT5cbiAgICAgIHVyaSA9ICdmaWxlOi8vJyArIGZpbGVwYXRoXG4gICAgICBzaGVsbC5vcGVuRXh0ZXJuYWwodXJpKVxuICAgICAgcmV0dXJuIFsnSFRNTCBmaWxlIG9wZW5lZCBhdDonLCB1cmldXG5cbmV4cG9ydHMuTGFUZVggPVxuICAnRmlsZSBCYXNlZCc6XG4gICAgY29tbWFuZDogJ2xhdGV4bWsnXG4gICAgYXJnczogKHtmaWxlcGF0aH0pIC0+IFsnLWNkJywgJy1xdWlldCcsICctcGRmJywgJy1wdicsICctc2hlbGwtZXNjYXBlJywgZmlsZXBhdGhdXG5cbmV4cG9ydHNbJ0xhVGVYIEJlYW1lciddID0gZXhwb3J0cy5MYVRlWFxuXG5leHBvcnRzWydQYW5kb2MgTWFya2Rvd24nXSA9XG4gICdGaWxlIEJhc2VkJzpcbiAgICBjb21tYW5kOiAncGFuemVyJ1xuICAgIGFyZ3M6ICh7ZmlsZXBhdGh9KSAtPiBbZmlsZXBhdGgsIFwiLS1vdXRwdXQ9JyN7ZmlsZXBhdGh9LnBkZidcIl1cblxuZXhwb3J0cy5TYXNzID1cbiAgJ0ZpbGUgQmFzZWQnOlxuICAgIGNvbW1hbmQ6ICdzYXNzJ1xuICAgIGFyZ3M6ICh7ZmlsZXBhdGh9KSAtPiBbZmlsZXBhdGhdXG5cbmV4cG9ydHMuU0NTUyA9IGV4cG9ydHMuU2Fzc1xuIl19
