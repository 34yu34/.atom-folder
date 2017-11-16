(function() {
  var SubAtom;

  SubAtom = require('sub-atom');

  module["export"] = {
    activate: function() {
      this.subs = new SubAtom;
      return this.sub.add(atom.commands.add('atom-workspace', 'header-implementation:generate', (function(_this) {
        return function() {
          return _this.generate;
        };
      })(this)));
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYmlsbHkvZ2l0aHViL2hlYWRlci1pbXBsZW1lbnRhdGlvbi9saWIvaGVhZGVyLWltcGxlbWVudGF0aW9uLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsT0FBQSxHQUFVLE9BQUEsQ0FBUSxVQUFSOztFQUVWLE1BQU0sRUFBQyxNQUFELEVBQU4sR0FFRTtJQUFBLFFBQUEsRUFBVSxTQUFBO01BQ1IsSUFBQyxDQUFBLElBQUQsR0FBUSxJQUFJO2FBQ1osSUFBQyxDQUFBLEdBQUcsQ0FBQyxHQUFMLENBQVMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGdCQUFsQixFQUFvQyxnQ0FBcEMsRUFBdUUsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO2lCQUFHLEtBQUMsQ0FBQTtRQUFKO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF2RSxDQUFUO0lBRlEsQ0FBVjtJQUlBLFFBQUEsRUFBVSxTQUFBO0FBQ1IsVUFBQTtNQUFBLE9BQU8sQ0FBQyxHQUFSLENBQVkseUJBQVo7TUFDQSxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBO01BQ1QsTUFBQSxHQUFTLE1BQU0sQ0FBQyxTQUFQLENBQUE7TUFDVCxNQUFNLENBQUMsSUFBUCxDQUFBO01BQ0EsSUFBQSxHQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUE7YUFDUCxNQUFNLENBQUMsSUFBUCxDQUFnQixJQUFBLE1BQUEsQ0FBTyxXQUFQLENBQWhCLEVBQXFDLFNBQUMsR0FBRDtRQUNuQyxNQUFNLENBQUMsdUJBQVAsQ0FBK0IsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUF6QztRQUNBLE1BQU0sQ0FBQyxRQUFQLENBQWdCLENBQUMsQ0FBRCxDQUFoQjtRQUNBLE1BQU0sQ0FBQyxlQUFQLENBQUE7UUFDQSxNQUFNLENBQUMscUJBQVAsQ0FBQTtRQUNBLE1BQU0sQ0FBQyxpQkFBUCxDQUFBO2VBQ0EsT0FBTyxDQUFDLEdBQVIsQ0FBWSxNQUFNLENBQUMsZUFBUCxDQUFBLENBQVo7TUFObUMsQ0FBckM7SUFOUSxDQUpWOztBQUpGIiwic291cmNlc0NvbnRlbnQiOlsiU3ViQXRvbSA9IHJlcXVpcmUgJ3N1Yi1hdG9tJ1xuXG5tb2R1bGUuZXhwb3J0ID1cblxuICBhY3RpdmF0ZTogLT5cbiAgICBAc3VicyA9IG5ldyBTdWJBdG9tXG4gICAgQHN1Yi5hZGQgYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20td29ya3NwYWNlJywgJ2hlYWRlci1pbXBsZW1lbnRhdGlvbjpnZW5lcmF0ZScsICA9PiBAZ2VuZXJhdGVcblxuICBnZW5lcmF0ZTogLT5cbiAgICBjb25zb2xlLmxvZygnLmNwcCBmaWxlIHdhcyBnZW5lcmF0ZWQnKTtcbiAgICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICBidWZmZXIgPSBlZGl0b3IuZ2V0QnVmZmVyKClcbiAgICBlZGl0b3Iuc2F2ZSgpXG4gICAgcGF0aCA9IGVkaXRvci5nZXRQYXRoKClcbiAgICBidWZmZXIuc2NhbiBuZXcgUmVnRXhwKFwibmFtZXNwYWNlXCIpLCAocmVzKSAtPlxuICAgICAgZWRpdG9yLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uKHJlcy5yYW5nZS5lbmQpXG4gICAgICBlZGl0b3IubW92ZUxlZnQoWzFdKVxuICAgICAgZWRpdG9yLm1vdmVUb0VuZE9mV29yZCgpXG4gICAgICBlZGl0b3IubW92ZVRvQmVnaW5uaW5nT2ZXb3JkKClcbiAgICAgIGVkaXRvci5zZWxlY3RUb0VuZE9mV29yZCgpXG4gICAgICBjb25zb2xlLmxvZyhlZGl0b3IuZ2V0U2VsZWN0ZWRUZXh0KCkpXG4iXX0=
