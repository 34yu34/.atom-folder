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
        editor.moveRight(1);
        editor.moveToEndOfWord();
        editor.moveToBeginningOfWord();
        editor.selectToEndOfWord();
        return console.log(editor.getSelectedText());
      });
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYmlsbHkvZ2l0aHViL2hlYWRlci1pbXBsZW1lbnRhdGlvbi9saWIvaGVhZGVyLWltcGxlbWVudGF0aW9uLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQTtBQUFBLE1BQUE7O0VBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSOztFQUV4QixNQUFNLENBQUMsT0FBUCxHQUVFO0lBQUEsUUFBQSxFQUFVLFNBQUMsS0FBRDtNQUdSLElBQUMsQ0FBQSxhQUFELEdBQWlCLElBQUk7YUFHckIsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFBb0M7UUFBQSxnQ0FBQSxFQUFrQyxDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFBO21CQUFHLEtBQUMsQ0FBQSxRQUFELENBQUE7VUFBSDtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBbEM7T0FBcEMsQ0FBbkI7SUFOUSxDQUFWO0lBUUEsUUFBQSxFQUFVLFNBQUE7QUFDUixVQUFBO01BQUEsT0FBTyxDQUFDLEdBQVIsQ0FBWSx5QkFBWjtNQUNBLE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUE7TUFDVCxNQUFBLEdBQVMsTUFBTSxDQUFDLFNBQVAsQ0FBQTtNQUNULE1BQU0sQ0FBQyxJQUFQLENBQUE7TUFDQSxJQUFBLEdBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQTthQUNQLE1BQU0sQ0FBQyxJQUFQLENBQWdCLElBQUEsTUFBQSxDQUFPLFdBQVAsQ0FBaEIsRUFBcUMsU0FBQyxHQUFEO1FBQ25DLE1BQU0sQ0FBQyx1QkFBUCxDQUErQixHQUFHLENBQUMsS0FBSyxDQUFDLEdBQXpDO1FBQ0EsTUFBTSxDQUFDLFNBQVAsQ0FBaUIsQ0FBakI7UUFDQSxNQUFNLENBQUMsZUFBUCxDQUFBO1FBQ0EsTUFBTSxDQUFDLHFCQUFQLENBQUE7UUFDQSxNQUFNLENBQUMsaUJBQVAsQ0FBQTtlQUNBLE9BQU8sQ0FBQyxHQUFSLENBQVksTUFBTSxDQUFDLGVBQVAsQ0FBQSxDQUFaO01BTm1DLENBQXJDO0lBTlEsQ0FSVjs7QUFKRiIsInNvdXJjZXNDb250ZW50IjpbIlxue0NvbXBvc2l0ZURpc3Bvc2FibGV9ID0gcmVxdWlyZSAnYXRvbSdcblxubW9kdWxlLmV4cG9ydHMgPVxuXG4gIGFjdGl2YXRlOiAoc3RhdGUpIC0+XG5cbiAgICAjIEV2ZW50cyBzdWJzY3JpYmVkIHRvIGluIGF0b20ncyBzeXN0ZW0gY2FuIGJlIGVhc2lseSBjbGVhbmVkIHVwIHdpdGggYSBDb21wb3NpdGVEaXNwb3NhYmxlXG4gICAgQHN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZVxuXG4gICAgIyBSZWdpc3RlciBjb21tYW5kIHRoYXQgdG9nZ2xlcyB0aGlzIHZpZXdcbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20td29ya3NwYWNlJywgJ2hlYWRlci1pbXBsZW1lbnRhdGlvbjpnZW5lcmF0ZSc6ID0+IEBnZW5lcmF0ZSgpXG5cbiAgZ2VuZXJhdGU6IC0+XG4gICAgY29uc29sZS5sb2coJy5jcHAgZmlsZSB3YXMgZ2VuZXJhdGVkJyk7XG4gICAgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgYnVmZmVyID0gZWRpdG9yLmdldEJ1ZmZlcigpXG4gICAgZWRpdG9yLnNhdmUoKVxuICAgIHBhdGggPSBlZGl0b3IuZ2V0UGF0aCgpXG4gICAgYnVmZmVyLnNjYW4gbmV3IFJlZ0V4cChcIm5hbWVzcGFjZVwiKSwgKHJlcykgLT5cbiAgICAgIGVkaXRvci5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbihyZXMucmFuZ2UuZW5kKVxuICAgICAgZWRpdG9yLm1vdmVSaWdodCgxKVxuICAgICAgZWRpdG9yLm1vdmVUb0VuZE9mV29yZCgpXG4gICAgICBlZGl0b3IubW92ZVRvQmVnaW5uaW5nT2ZXb3JkKClcbiAgICAgIGVkaXRvci5zZWxlY3RUb0VuZE9mV29yZCgpXG4gICAgICBjb25zb2xlLmxvZyhlZGl0b3IuZ2V0U2VsZWN0ZWRUZXh0KCkpXG4iXX0=
