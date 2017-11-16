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
      var buffer, editor, headerName, implementationName, path;
      editor = atom.workspace.getActiveTextEditor();
      buffer = editor.getBuffer();
      editor.save();
      headerName = editor.getTitle();
      path = editor.getPath();
      implementationName = headerName.replace(".h", ".cpp");
      return console.log(implementationName);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYmlsbHkvZ2l0aHViL2hlYWRlci1pbXBsZW1lbnRhdGlvbi9saWIvaGVhZGVyLWltcGxlbWVudGF0aW9uLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQTtBQUFBLE1BQUE7O0VBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSOztFQUV4QixNQUFNLENBQUMsT0FBUCxHQUVFO0lBQUEsUUFBQSxFQUFVLFNBQUMsS0FBRDtNQUdSLElBQUMsQ0FBQSxhQUFELEdBQWlCLElBQUk7YUFHckIsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFBb0M7UUFBQSxnQ0FBQSxFQUFrQyxDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFBO21CQUFHLEtBQUMsQ0FBQSxVQUFELENBQUE7VUFBSDtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBbEM7T0FBcEMsQ0FBbkI7SUFOUSxDQUFWO0lBUUEsUUFBQSxFQUFVLFNBQUE7QUFDUixVQUFBO01BQUEsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQTtNQUNULE1BQUEsR0FBUyxNQUFNLENBQUMsU0FBUCxDQUFBO01BQ1QsTUFBTSxDQUFDLElBQVAsQ0FBQTtNQUNBLElBQUEsR0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBO2FBQ1AsTUFBTSxDQUFDLElBQVAsQ0FBZ0IsSUFBQSxNQUFBLENBQU8sV0FBUCxDQUFoQixFQUFxQyxTQUFDLEdBQUQ7QUFDbkMsWUFBQTtRQUFBLE1BQU0sQ0FBQyx1QkFBUCxDQUErQixHQUFHLENBQUMsS0FBSyxDQUFDLEdBQXpDO1FBQ0EsTUFBTSxDQUFDLFNBQVAsQ0FBaUIsQ0FBakI7UUFDQSxNQUFNLENBQUMsZUFBUCxDQUFBO1FBQ0EsTUFBTSxDQUFDLHFCQUFQLENBQUE7UUFDQSxNQUFNLENBQUMsaUJBQVAsQ0FBQTtRQUNBLFNBQUEsR0FBWSxNQUFNLENBQUMsZUFBUCxDQUFBO2VBQ1osR0FBRyxDQUFDLElBQUosQ0FBQTtNQVBtQyxDQUFyQztJQUxRLENBUlY7SUFzQkEsVUFBQSxFQUFZLFNBQUE7QUFDVixVQUFBO01BQUEsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQTtNQUNULE1BQUEsR0FBUyxNQUFNLENBQUMsU0FBUCxDQUFBO01BQ1QsTUFBTSxDQUFDLElBQVAsQ0FBQTtNQUNBLFVBQUEsR0FBYSxNQUFNLENBQUMsUUFBUCxDQUFBO01BQ2IsSUFBQSxHQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUE7TUFDUCxrQkFBQSxHQUFxQixVQUFVLENBQUMsT0FBWCxDQUFtQixJQUFuQixFQUF3QixNQUF4QjthQUNyQixPQUFPLENBQUMsR0FBUixDQUFZLGtCQUFaO0lBUFUsQ0F0Qlo7O0FBSkYiLCJzb3VyY2VzQ29udGVudCI6WyJcbntDb21wb3NpdGVEaXNwb3NhYmxlfSA9IHJlcXVpcmUgJ2F0b20nXG5cbm1vZHVsZS5leHBvcnRzID1cblxuICBhY3RpdmF0ZTogKHN0YXRlKSAtPlxuXG4gICAgIyBFdmVudHMgc3Vic2NyaWJlZCB0byBpbiBhdG9tJ3Mgc3lzdGVtIGNhbiBiZSBlYXNpbHkgY2xlYW5lZCB1cCB3aXRoIGEgQ29tcG9zaXRlRGlzcG9zYWJsZVxuICAgIEBzdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGVcblxuICAgICMgUmVnaXN0ZXIgY29tbWFuZCB0aGF0IHRvZ2dsZXMgdGhpcyB2aWV3XG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29tbWFuZHMuYWRkICdhdG9tLXdvcmtzcGFjZScsICdoZWFkZXItaW1wbGVtZW50YXRpb246Z2VuZXJhdGUnOiA9PiBAQ3JlYXRlRmlsZSgpXG5cbiAgZmluZE5hbWU6IC0+XG4gICAgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgYnVmZmVyID0gZWRpdG9yLmdldEJ1ZmZlcigpXG4gICAgZWRpdG9yLnNhdmUoKVxuICAgIHBhdGggPSBlZGl0b3IuZ2V0UGF0aCgpXG4gICAgYnVmZmVyLnNjYW4gbmV3IFJlZ0V4cChcIm5hbWVzcGFjZVwiKSwgKHJlcykgLT5cbiAgICAgIGVkaXRvci5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbihyZXMucmFuZ2UuZW5kKVxuICAgICAgZWRpdG9yLm1vdmVSaWdodCgxKVxuICAgICAgZWRpdG9yLm1vdmVUb0VuZE9mV29yZCgpXG4gICAgICBlZGl0b3IubW92ZVRvQmVnaW5uaW5nT2ZXb3JkKClcbiAgICAgIGVkaXRvci5zZWxlY3RUb0VuZE9mV29yZCgpXG4gICAgICBjbGFzc25hbWUgPSBlZGl0b3IuZ2V0U2VsZWN0ZWRUZXh0KClcbiAgICAgIHJlcy5zdG9wKClcblxuICBDcmVhdGVGaWxlOiAtPlxuICAgIGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgIGJ1ZmZlciA9IGVkaXRvci5nZXRCdWZmZXIoKVxuICAgIGVkaXRvci5zYXZlKClcbiAgICBoZWFkZXJOYW1lID0gZWRpdG9yLmdldFRpdGxlKClcbiAgICBwYXRoID0gZWRpdG9yLmdldFBhdGgoKVxuICAgIGltcGxlbWVudGF0aW9uTmFtZSA9IGhlYWRlck5hbWUucmVwbGFjZShcIi5oXCIsXCIuY3BwXCIpXG4gICAgY29uc29sZS5sb2coaW1wbGVtZW50YXRpb25OYW1lKVxuIl19
