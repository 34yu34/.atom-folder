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
      return atom.workspace.open(implementationPath);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYmlsbHkvZ2l0aHViL2hlYWRlci1pbXBsZW1lbnRhdGlvbi9saWIvaGVhZGVyLWltcGxlbWVudGF0aW9uLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQTtBQUFBLE1BQUE7O0VBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSOztFQUV4QixNQUFNLENBQUMsT0FBUCxHQUVFO0lBQUEsUUFBQSxFQUFVLFNBQUMsS0FBRDtNQUdSLElBQUMsQ0FBQSxhQUFELEdBQWlCLElBQUk7YUFHckIsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFBb0M7UUFBQSxnQ0FBQSxFQUFrQyxDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFBO21CQUFHLEtBQUMsQ0FBQSxVQUFELENBQUE7VUFBSDtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBbEM7T0FBcEMsQ0FBbkI7SUFOUSxDQUFWO0lBUUEsUUFBQSxFQUFVLFNBQUE7QUFDUixVQUFBO01BQUEsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQTtNQUNULE1BQUEsR0FBUyxNQUFNLENBQUMsU0FBUCxDQUFBO01BQ1QsTUFBTSxDQUFDLElBQVAsQ0FBQTtNQUNBLElBQUEsR0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBO2FBQ1AsTUFBTSxDQUFDLElBQVAsQ0FBZ0IsSUFBQSxNQUFBLENBQU8sV0FBUCxDQUFoQixFQUFxQyxTQUFDLEdBQUQ7QUFDbkMsWUFBQTtRQUFBLE1BQU0sQ0FBQyx1QkFBUCxDQUErQixHQUFHLENBQUMsS0FBSyxDQUFDLEdBQXpDO1FBQ0EsTUFBTSxDQUFDLFNBQVAsQ0FBaUIsQ0FBakI7UUFDQSxNQUFNLENBQUMsZUFBUCxDQUFBO1FBQ0EsTUFBTSxDQUFDLHFCQUFQLENBQUE7UUFDQSxNQUFNLENBQUMsaUJBQVAsQ0FBQTtRQUNBLFNBQUEsR0FBWSxNQUFNLENBQUMsZUFBUCxDQUFBO2VBQ1osR0FBRyxDQUFDLElBQUosQ0FBQTtNQVBtQyxDQUFyQztJQUxRLENBUlY7SUFzQkEsVUFBQSxFQUFZLFNBQUE7QUFDVixVQUFBO01BQUEsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQTtNQUVULE1BQUEsR0FBUyxNQUFNLENBQUMsU0FBUCxDQUFBO01BQ1QsTUFBTSxDQUFDLElBQVAsQ0FBQTtNQUNBLFVBQUEsR0FBYSxNQUFNLENBQUMsUUFBUCxDQUFBO01BQ2IsSUFBQSxHQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUE7TUFDUCxrQkFBQSxHQUFxQixVQUFVLENBQUMsT0FBWCxDQUFtQixJQUFuQixFQUF3QixNQUF4QjtNQUNyQixrQkFBQSxHQUFxQixJQUFJLENBQUMsT0FBTCxDQUFhLElBQWIsRUFBa0IsTUFBbEI7TUFDckIsT0FBTyxDQUFDLEdBQVIsQ0FBWSxrQkFBWjthQUNBLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFvQixrQkFBcEI7SUFWVSxDQXRCWjs7QUFKRiIsInNvdXJjZXNDb250ZW50IjpbIlxue0NvbXBvc2l0ZURpc3Bvc2FibGV9ID0gcmVxdWlyZSAnYXRvbSdcblxubW9kdWxlLmV4cG9ydHMgPVxuXG4gIGFjdGl2YXRlOiAoc3RhdGUpIC0+XG5cbiAgICAjIEV2ZW50cyBzdWJzY3JpYmVkIHRvIGluIGF0b20ncyBzeXN0ZW0gY2FuIGJlIGVhc2lseSBjbGVhbmVkIHVwIHdpdGggYSBDb21wb3NpdGVEaXNwb3NhYmxlXG4gICAgQHN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZVxuXG4gICAgIyBSZWdpc3RlciBjb21tYW5kIHRoYXQgdG9nZ2xlcyB0aGlzIHZpZXdcbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20td29ya3NwYWNlJywgJ2hlYWRlci1pbXBsZW1lbnRhdGlvbjpnZW5lcmF0ZSc6ID0+IEBDcmVhdGVGaWxlKClcblxuICBmaW5kTmFtZTogLT5cbiAgICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICBidWZmZXIgPSBlZGl0b3IuZ2V0QnVmZmVyKClcbiAgICBlZGl0b3Iuc2F2ZSgpXG4gICAgcGF0aCA9IGVkaXRvci5nZXRQYXRoKClcbiAgICBidWZmZXIuc2NhbiBuZXcgUmVnRXhwKFwibmFtZXNwYWNlXCIpLCAocmVzKSAtPlxuICAgICAgZWRpdG9yLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uKHJlcy5yYW5nZS5lbmQpXG4gICAgICBlZGl0b3IubW92ZVJpZ2h0KDEpXG4gICAgICBlZGl0b3IubW92ZVRvRW5kT2ZXb3JkKClcbiAgICAgIGVkaXRvci5tb3ZlVG9CZWdpbm5pbmdPZldvcmQoKVxuICAgICAgZWRpdG9yLnNlbGVjdFRvRW5kT2ZXb3JkKClcbiAgICAgIGNsYXNzbmFtZSA9IGVkaXRvci5nZXRTZWxlY3RlZFRleHQoKVxuICAgICAgcmVzLnN0b3AoKVxuXG4gIENyZWF0ZUZpbGU6IC0+XG4gICAgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG5cbiAgICBidWZmZXIgPSBlZGl0b3IuZ2V0QnVmZmVyKClcbiAgICBlZGl0b3Iuc2F2ZSgpXG4gICAgaGVhZGVyTmFtZSA9IGVkaXRvci5nZXRUaXRsZSgpXG4gICAgcGF0aCA9IGVkaXRvci5nZXRQYXRoKClcbiAgICBpbXBsZW1lbnRhdGlvbk5hbWUgPSBoZWFkZXJOYW1lLnJlcGxhY2UoXCIuaFwiLFwiLmNwcFwiKVxuICAgIGltcGxlbWVudGF0aW9uUGF0aCA9IHBhdGgucmVwbGFjZShcIi5oXCIsXCIuY3BwXCIpXG4gICAgY29uc29sZS5sb2coaW1wbGVtZW50YXRpb25OYW1lKVxuICAgIGF0b20ud29ya3NwYWNlLm9wZW4oaW1wbGVtZW50YXRpb25QYXRoKVxuIl19
