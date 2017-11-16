(function() {
  var CompositeDisposable;

  CompositeDisposable = require('atom').CompositeDisposable;

  module.exports = {
    activate: function(state) {
      this.subscriptions = new CompositeDisposable;
      return this.subscriptions.add(atom.commands.add('atom-workspace', {
        'header-implementation:generate': (function(_this) {
          return function() {
            return _this.generate();
          };
        })(this)
      }));
    },
    generate: function() {
      var buffer, editor, path;
      console.log('.cpp file was generated');
      editor = atom.workspace.getActiveTextEditor();
      buffer = editor.getBuffer();
      editor.save();
      path = editor.getPath();
      return buffer.scan(new RegExp("namespace"), function(res) {
        editor.setCursorBufferPosition(res.range.end);
        editor.moveLeft([1]);
        editor.moveToEndOfWord();
        editor.moveToBeginningOfWord();
        editor.selectToEndOfWord();
        return console.log(editor.getSelectedText());
      });
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYmlsbHkvZ2l0aHViL2hlYWRlci1pbXBsZW1lbnRhdGlvbi9saWIvaGVhZGVyLWltcGxlbWVudGF0aW9uLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQTtBQUFBLE1BQUE7O0VBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSOztFQUV4QixNQUFNLENBQUMsT0FBUCxHQUVFO0lBQUEsUUFBQSxFQUFVLFNBQUMsS0FBRDtNQUdSLElBQUMsQ0FBQSxhQUFELEdBQWlCLElBQUk7YUFHckIsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFBb0M7UUFBQSxnQ0FBQSxFQUFrQyxDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFBO21CQUFHLEtBQUMsQ0FBQSxRQUFELENBQUE7VUFBSDtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBbEM7T0FBcEMsQ0FBbkI7SUFOUSxDQUFWO0lBUUEsUUFBQSxFQUFVLFNBQUE7QUFDUixVQUFBO01BQUEsT0FBTyxDQUFDLEdBQVIsQ0FBWSx5QkFBWjtNQUNBLE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUE7TUFDVCxNQUFBLEdBQVMsTUFBTSxDQUFDLFNBQVAsQ0FBQTtNQUNULE1BQU0sQ0FBQyxJQUFQLENBQUE7TUFDQSxJQUFBLEdBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQTthQUNQLE1BQU0sQ0FBQyxJQUFQLENBQWdCLElBQUEsTUFBQSxDQUFPLFdBQVAsQ0FBaEIsRUFBcUMsU0FBQyxHQUFEO1FBQ25DLE1BQU0sQ0FBQyx1QkFBUCxDQUErQixHQUFHLENBQUMsS0FBSyxDQUFDLEdBQXpDO1FBQ0EsTUFBTSxDQUFDLFFBQVAsQ0FBZ0IsQ0FBQyxDQUFELENBQWhCO1FBQ0EsTUFBTSxDQUFDLGVBQVAsQ0FBQTtRQUNBLE1BQU0sQ0FBQyxxQkFBUCxDQUFBO1FBQ0EsTUFBTSxDQUFDLGlCQUFQLENBQUE7ZUFDQSxPQUFPLENBQUMsR0FBUixDQUFZLE1BQU0sQ0FBQyxlQUFQLENBQUEsQ0FBWjtNQU5tQyxDQUFyQztJQU5RLENBUlY7O0FBSkYiLCJzb3VyY2VzQ29udGVudCI6WyJcbntDb21wb3NpdGVEaXNwb3NhYmxlfSA9IHJlcXVpcmUgJ2F0b20nXG5cbm1vZHVsZS5leHBvcnRzID1cblxuICBhY3RpdmF0ZTogKHN0YXRlKSAtPlxuXG4gICAgIyBFdmVudHMgc3Vic2NyaWJlZCB0byBpbiBhdG9tJ3Mgc3lzdGVtIGNhbiBiZSBlYXNpbHkgY2xlYW5lZCB1cCB3aXRoIGEgQ29tcG9zaXRlRGlzcG9zYWJsZVxuICAgIEBzdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGVcblxuICAgICMgUmVnaXN0ZXIgY29tbWFuZCB0aGF0IHRvZ2dsZXMgdGhpcyB2aWV3XG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29tbWFuZHMuYWRkICdhdG9tLXdvcmtzcGFjZScsICdoZWFkZXItaW1wbGVtZW50YXRpb246Z2VuZXJhdGUnOiA9PiBAZ2VuZXJhdGUoKVxuXG4gIGdlbmVyYXRlOiAtPlxuICAgIGNvbnNvbGUubG9nKCcuY3BwIGZpbGUgd2FzIGdlbmVyYXRlZCcpO1xuICAgIGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgIGJ1ZmZlciA9IGVkaXRvci5nZXRCdWZmZXIoKVxuICAgIGVkaXRvci5zYXZlKClcbiAgICBwYXRoID0gZWRpdG9yLmdldFBhdGgoKVxuICAgIGJ1ZmZlci5zY2FuIG5ldyBSZWdFeHAoXCJuYW1lc3BhY2VcIiksIChyZXMpIC0+XG4gICAgICBlZGl0b3Iuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24ocmVzLnJhbmdlLmVuZClcbiAgICAgIGVkaXRvci5tb3ZlTGVmdChbMV0pXG4gICAgICBlZGl0b3IubW92ZVRvRW5kT2ZXb3JkKClcbiAgICAgIGVkaXRvci5tb3ZlVG9CZWdpbm5pbmdPZldvcmQoKVxuICAgICAgZWRpdG9yLnNlbGVjdFRvRW5kT2ZXb3JkKClcbiAgICAgIGNvbnNvbGUubG9nKGVkaXRvci5nZXRTZWxlY3RlZFRleHQoKSlcbiJdfQ==
