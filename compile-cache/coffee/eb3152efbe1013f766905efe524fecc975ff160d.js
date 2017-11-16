(function() {
  module["export"] = {
    activate: function() {
      return atom.commands.add('atom-workspace', 'header-implementation:generate', (function(_this) {
        return function() {
          return _this.generate;
        };
      })(this));
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYmlsbHkvZ2l0aHViL2hlYWRlci1pbXBsZW1lbnRhdGlvbi9saWIvaGVhZGVyLWltcGxlbWVudGF0aW9uLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQTtFQUFBLE1BQU0sRUFBQyxNQUFELEVBQU4sR0FFRTtJQUFBLFFBQUEsRUFBVSxTQUFBO2FBQ1IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGdCQUFsQixFQUFvQyxnQ0FBcEMsRUFBdUUsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO2lCQUFHLEtBQUMsQ0FBQTtRQUFKO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF2RTtJQURRLENBQVY7SUFHQSxRQUFBLEVBQVUsU0FBQTtBQUNSLFVBQUE7TUFBQSxPQUFPLENBQUMsR0FBUixDQUFZLHlCQUFaO01BQ0EsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQTtNQUNULE1BQUEsR0FBUyxNQUFNLENBQUMsU0FBUCxDQUFBO01BQ1QsTUFBTSxDQUFDLElBQVAsQ0FBQTtNQUNBLElBQUEsR0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBO2FBQ1AsTUFBTSxDQUFDLElBQVAsQ0FBZ0IsSUFBQSxNQUFBLENBQU8sV0FBUCxDQUFoQixFQUFxQyxTQUFDLEdBQUQ7UUFDbkMsTUFBTSxDQUFDLHVCQUFQLENBQStCLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBekM7UUFDQSxNQUFNLENBQUMsUUFBUCxDQUFnQixDQUFDLENBQUQsQ0FBaEI7UUFDQSxNQUFNLENBQUMsZUFBUCxDQUFBO1FBQ0EsTUFBTSxDQUFDLHFCQUFQLENBQUE7UUFDQSxNQUFNLENBQUMsaUJBQVAsQ0FBQTtlQUNBLE9BQU8sQ0FBQyxHQUFSLENBQVksTUFBTSxDQUFDLGVBQVAsQ0FBQSxDQUFaO01BTm1DLENBQXJDO0lBTlEsQ0FIVjs7QUFGRiIsInNvdXJjZXNDb250ZW50IjpbIlxubW9kdWxlLmV4cG9ydCA9XG5cbiAgYWN0aXZhdGU6IC0+XG4gICAgYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20td29ya3NwYWNlJywgJ2hlYWRlci1pbXBsZW1lbnRhdGlvbjpnZW5lcmF0ZScsICA9PiBAZ2VuZXJhdGVcblxuICBnZW5lcmF0ZTogLT5cbiAgICBjb25zb2xlLmxvZygnLmNwcCBmaWxlIHdhcyBnZW5lcmF0ZWQnKTtcbiAgICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICBidWZmZXIgPSBlZGl0b3IuZ2V0QnVmZmVyKClcbiAgICBlZGl0b3Iuc2F2ZSgpXG4gICAgcGF0aCA9IGVkaXRvci5nZXRQYXRoKClcbiAgICBidWZmZXIuc2NhbiBuZXcgUmVnRXhwKFwibmFtZXNwYWNlXCIpLCAocmVzKSAtPlxuICAgICAgZWRpdG9yLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uKHJlcy5yYW5nZS5lbmQpXG4gICAgICBlZGl0b3IubW92ZUxlZnQoWzFdKVxuICAgICAgZWRpdG9yLm1vdmVUb0VuZE9mV29yZCgpXG4gICAgICBlZGl0b3IubW92ZVRvQmVnaW5uaW5nT2ZXb3JkKClcbiAgICAgIGVkaXRvci5zZWxlY3RUb0VuZE9mV29yZCgpXG4gICAgICBjb25zb2xlLmxvZyhlZGl0b3IuZ2V0U2VsZWN0ZWRUZXh0KCkpXG4iXX0=
