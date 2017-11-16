(function() {
  var CompositeDisposable;

  CompositeDisposable = require('atom').CompositeDisposable;

  module.exports = {
    activate: function(state) {
      this.subscriptions = new CompositeDisposable;
      return this.subscriptions.add(atom.commands.add('atom-workspace', {
        'header-implementation:generate': (function(_this) {
          return function() {
            return _this.CreateFile();
          };
        })(this)
      }));
    },
    findName: function() {
      var buffer, editor, path;
      editor = atom.workspace.getActiveTextEditor();
      buffer = editor.getBuffer();
      editor.save();
      path = editor.getPath();
      return buffer.scan(new RegExp("namespace"), function(res) {
        var classname;
        editor.setCursorBufferPosition(res.range.end);
        editor.moveRight(1);
        editor.moveToEndOfWord();
        editor.moveToBeginningOfWord();
        editor.selectToEndOfWord();
        classname = editor.getSelectedText();
        return res.stop();
      });
    },
    CreateFile: function() {
      var buffer, editor, headerName, implementationName, implementationPath, path;
      editor = atom.workspace.getActiveTextEditor();
      buffer = editor.getBuffer();
      editor.save();
      headerName = editor.getTitle();
      path = editor.getPath();
      implementationName = headerName.replace(".h", ".cpp");
      implementationPath = path.replace(".h", ".cpp");
      console.log(implementationName);
      return File(implementationPath);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYmlsbHkvZ2l0aHViL2hlYWRlci1pbXBsZW1lbnRhdGlvbi9saWIvaGVhZGVyLWltcGxlbWVudGF0aW9uLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQTtBQUFBLE1BQUE7O0VBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSOztFQUV4QixNQUFNLENBQUMsT0FBUCxHQUVFO0lBQUEsUUFBQSxFQUFVLFNBQUMsS0FBRDtNQUdSLElBQUMsQ0FBQSxhQUFELEdBQWlCLElBQUk7YUFHckIsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFBb0M7UUFBQSxnQ0FBQSxFQUFrQyxDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFBO21CQUFHLEtBQUMsQ0FBQSxVQUFELENBQUE7VUFBSDtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBbEM7T0FBcEMsQ0FBbkI7SUFOUSxDQUFWO0lBUUEsUUFBQSxFQUFVLFNBQUE7QUFDUixVQUFBO01BQUEsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQTtNQUNULE1BQUEsR0FBUyxNQUFNLENBQUMsU0FBUCxDQUFBO01BQ1QsTUFBTSxDQUFDLElBQVAsQ0FBQTtNQUNBLElBQUEsR0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBO2FBQ1AsTUFBTSxDQUFDLElBQVAsQ0FBZ0IsSUFBQSxNQUFBLENBQU8sV0FBUCxDQUFoQixFQUFxQyxTQUFDLEdBQUQ7QUFDbkMsWUFBQTtRQUFBLE1BQU0sQ0FBQyx1QkFBUCxDQUErQixHQUFHLENBQUMsS0FBSyxDQUFDLEdBQXpDO1FBQ0EsTUFBTSxDQUFDLFNBQVAsQ0FBaUIsQ0FBakI7UUFDQSxNQUFNLENBQUMsZUFBUCxDQUFBO1FBQ0EsTUFBTSxDQUFDLHFCQUFQLENBQUE7UUFDQSxNQUFNLENBQUMsaUJBQVAsQ0FBQTtRQUNBLFNBQUEsR0FBWSxNQUFNLENBQUMsZUFBUCxDQUFBO2VBQ1osR0FBRyxDQUFDLElBQUosQ0FBQTtNQVBtQyxDQUFyQztJQUxRLENBUlY7SUFzQkEsVUFBQSxFQUFZLFNBQUE7QUFDVixVQUFBO01BQUEsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQTtNQUNULE1BQUEsR0FBUyxNQUFNLENBQUMsU0FBUCxDQUFBO01BQ1QsTUFBTSxDQUFDLElBQVAsQ0FBQTtNQUNBLFVBQUEsR0FBYSxNQUFNLENBQUMsUUFBUCxDQUFBO01BQ2IsSUFBQSxHQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUE7TUFDUCxrQkFBQSxHQUFxQixVQUFVLENBQUMsT0FBWCxDQUFtQixJQUFuQixFQUF3QixNQUF4QjtNQUNyQixrQkFBQSxHQUFxQixJQUFJLENBQUMsT0FBTCxDQUFhLElBQWIsRUFBa0IsTUFBbEI7TUFDckIsT0FBTyxDQUFDLEdBQVIsQ0FBWSxrQkFBWjthQUNBLElBQUEsQ0FBSyxrQkFBTDtJQVRVLENBdEJaOztBQUpGIiwic291cmNlc0NvbnRlbnQiOlsiXG57Q29tcG9zaXRlRGlzcG9zYWJsZX0gPSByZXF1aXJlICdhdG9tJ1xuXG5tb2R1bGUuZXhwb3J0cyA9XG5cbiAgYWN0aXZhdGU6IChzdGF0ZSkgLT5cblxuICAgICMgRXZlbnRzIHN1YnNjcmliZWQgdG8gaW4gYXRvbSdzIHN5c3RlbSBjYW4gYmUgZWFzaWx5IGNsZWFuZWQgdXAgd2l0aCBhIENvbXBvc2l0ZURpc3Bvc2FibGVcbiAgICBAc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlXG5cbiAgICAjIFJlZ2lzdGVyIGNvbW1hbmQgdGhhdCB0b2dnbGVzIHRoaXMgdmlld1xuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS13b3Jrc3BhY2UnLCAnaGVhZGVyLWltcGxlbWVudGF0aW9uOmdlbmVyYXRlJzogPT4gQENyZWF0ZUZpbGUoKVxuXG4gIGZpbmROYW1lOiAtPlxuICAgIGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgIGJ1ZmZlciA9IGVkaXRvci5nZXRCdWZmZXIoKVxuICAgIGVkaXRvci5zYXZlKClcbiAgICBwYXRoID0gZWRpdG9yLmdldFBhdGgoKVxuICAgIGJ1ZmZlci5zY2FuIG5ldyBSZWdFeHAoXCJuYW1lc3BhY2VcIiksIChyZXMpIC0+XG4gICAgICBlZGl0b3Iuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24ocmVzLnJhbmdlLmVuZClcbiAgICAgIGVkaXRvci5tb3ZlUmlnaHQoMSlcbiAgICAgIGVkaXRvci5tb3ZlVG9FbmRPZldvcmQoKVxuICAgICAgZWRpdG9yLm1vdmVUb0JlZ2lubmluZ09mV29yZCgpXG4gICAgICBlZGl0b3Iuc2VsZWN0VG9FbmRPZldvcmQoKVxuICAgICAgY2xhc3NuYW1lID0gZWRpdG9yLmdldFNlbGVjdGVkVGV4dCgpXG4gICAgICByZXMuc3RvcCgpXG5cbiAgQ3JlYXRlRmlsZTogLT5cbiAgICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICBidWZmZXIgPSBlZGl0b3IuZ2V0QnVmZmVyKClcbiAgICBlZGl0b3Iuc2F2ZSgpXG4gICAgaGVhZGVyTmFtZSA9IGVkaXRvci5nZXRUaXRsZSgpXG4gICAgcGF0aCA9IGVkaXRvci5nZXRQYXRoKClcbiAgICBpbXBsZW1lbnRhdGlvbk5hbWUgPSBoZWFkZXJOYW1lLnJlcGxhY2UoXCIuaFwiLFwiLmNwcFwiKVxuICAgIGltcGxlbWVudGF0aW9uUGF0aCA9IHBhdGgucmVwbGFjZShcIi5oXCIsXCIuY3BwXCIpXG4gICAgY29uc29sZS5sb2coaW1wbGVtZW50YXRpb25OYW1lKVxuICAgIEZpbGUoaW1wbGVtZW50YXRpb25QYXRoKVxuIl19
