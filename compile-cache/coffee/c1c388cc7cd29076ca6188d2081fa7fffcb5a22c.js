(function() {
  exports.Python = {
    'Selection Based': {
      command: 'python',
      args: function(context) {
        return ['-u', '-c', context.getCode()];
      }
    },
    'File Based': {
      command: 'python',
      args: function(arg) {
        var filepath;
        filepath = arg.filepath;
        return ['-u', filepath];
      }
    }
  };

  exports.MagicPython = exports.Python;

  exports.Sage = {
    'Selection Based': {
      command: 'sage',
      args: function(context) {
        return ['-c', context.getCode()];
      }
    },
    'File Based': {
      command: 'sage',
      args: function(arg) {
        var filepath;
        filepath = arg.filepath;
        return [filepath];
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYmlsbHkvLmF0b20vcGFja2FnZXMvc2NyaXB0L2xpYi9ncmFtbWFycy9weXRob24uY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQUEsT0FBTyxDQUFDLE1BQVIsR0FDRTtJQUFBLGlCQUFBLEVBQ0U7TUFBQSxPQUFBLEVBQVMsUUFBVDtNQUNBLElBQUEsRUFBTSxTQUFDLE9BQUQ7ZUFBYSxDQUFDLElBQUQsRUFBTyxJQUFQLEVBQWEsT0FBTyxDQUFDLE9BQVIsQ0FBQSxDQUFiO01BQWIsQ0FETjtLQURGO0lBSUEsWUFBQSxFQUNFO01BQUEsT0FBQSxFQUFTLFFBQVQ7TUFDQSxJQUFBLEVBQU0sU0FBQyxHQUFEO0FBQWdCLFlBQUE7UUFBZCxXQUFEO2VBQWUsQ0FBQyxJQUFELEVBQU8sUUFBUDtNQUFoQixDQUROO0tBTEY7OztFQVFGLE9BQU8sQ0FBQyxXQUFSLEdBQXNCLE9BQU8sQ0FBQzs7RUFFOUIsT0FBTyxDQUFDLElBQVIsR0FDRTtJQUFBLGlCQUFBLEVBQ0U7TUFBQSxPQUFBLEVBQVMsTUFBVDtNQUNBLElBQUEsRUFBTSxTQUFDLE9BQUQ7ZUFBYSxDQUFDLElBQUQsRUFBTyxPQUFPLENBQUMsT0FBUixDQUFBLENBQVA7TUFBYixDQUROO0tBREY7SUFJQSxZQUFBLEVBQ0U7TUFBQSxPQUFBLEVBQVMsTUFBVDtNQUNBLElBQUEsRUFBTSxTQUFDLEdBQUQ7QUFBZ0IsWUFBQTtRQUFkLFdBQUQ7ZUFBZSxDQUFDLFFBQUQ7TUFBaEIsQ0FETjtLQUxGOztBQVpGIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0cy5QeXRob24gPVxuICAnU2VsZWN0aW9uIEJhc2VkJzpcbiAgICBjb21tYW5kOiAncHl0aG9uJ1xuICAgIGFyZ3M6IChjb250ZXh0KSAtPiBbJy11JywgJy1jJywgY29udGV4dC5nZXRDb2RlKCldXG5cbiAgJ0ZpbGUgQmFzZWQnOlxuICAgIGNvbW1hbmQ6ICdweXRob24nXG4gICAgYXJnczogKHtmaWxlcGF0aH0pIC0+IFsnLXUnLCBmaWxlcGF0aF1cblxuZXhwb3J0cy5NYWdpY1B5dGhvbiA9IGV4cG9ydHMuUHl0aG9uXG5cbmV4cG9ydHMuU2FnZSA9XG4gICdTZWxlY3Rpb24gQmFzZWQnOlxuICAgIGNvbW1hbmQ6ICdzYWdlJ1xuICAgIGFyZ3M6IChjb250ZXh0KSAtPiBbJy1jJywgY29udGV4dC5nZXRDb2RlKCldXG5cbiAgJ0ZpbGUgQmFzZWQnOlxuICAgIGNvbW1hbmQ6ICdzYWdlJ1xuICAgIGFyZ3M6ICh7ZmlsZXBhdGh9KSAtPiBbZmlsZXBhdGhdXG4iXX0=
