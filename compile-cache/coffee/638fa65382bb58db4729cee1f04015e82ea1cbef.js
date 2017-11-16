(function() {
  var SubAtom;

  SubAtom = require('sub-atom');

  module["export"] = {
    activate: function() {
      this.sub = new SubAtom;
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYmlsbHkvZ2l0aHViL2hlYWRlci1pbXBsZW1lbnRhdGlvbi9saWIvaGVhZGVyLWltcGxlbWVudGF0aW9uLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsT0FBQSxHQUFVLE9BQUEsQ0FBUSxVQUFSOztFQUVWLE1BQU0sRUFBQyxNQUFELEVBQU4sR0FFRTtJQUFBLFFBQUEsRUFBVSxTQUFBO01BQ1IsSUFBQyxDQUFBLEdBQUQsR0FBTyxJQUFJO2FBQ1gsSUFBQyxDQUFBLEdBQUcsQ0FBQyxHQUFMLENBQVMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGdCQUFsQixFQUFvQyxnQ0FBcEMsRUFBdUUsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO2lCQUFHLEtBQUMsQ0FBQTtRQUFKO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF2RSxDQUFUO0lBRlEsQ0FBVjtJQUlBLFFBQUEsRUFBVSxTQUFBO0FBQ1IsVUFBQTtNQUFBLE9BQU8sQ0FBQyxHQUFSLENBQVkseUJBQVo7TUFDQSxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBO01BQ1QsTUFBQSxHQUFTLE1BQU0sQ0FBQyxTQUFQLENBQUE7TUFDVCxNQUFNLENBQUMsSUFBUCxDQUFBO01BQ0EsSUFBQSxHQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUE7YUFDUCxNQUFNLENBQUMsSUFBUCxDQUFnQixJQUFBLE1BQUEsQ0FBTyxXQUFQLENBQWhCLEVBQXFDLFNBQUMsR0FBRDtRQUNuQyxNQUFNLENBQUMsdUJBQVAsQ0FBK0IsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUF6QztRQUNBLE1BQU0sQ0FBQyxRQUFQLENBQWdCLENBQUMsQ0FBRCxDQUFoQjtRQUNBLE1BQU0sQ0FBQyxlQUFQLENBQUE7UUFDQSxNQUFNLENBQUMscUJBQVAsQ0FBQTtRQUNBLE1BQU0sQ0FBQyxpQkFBUCxDQUFBO2VBQ0EsT0FBTyxDQUFDLEdBQVIsQ0FBWSxNQUFNLENBQUMsZUFBUCxDQUFBLENBQVo7TUFObUMsQ0FBckM7SUFOUSxDQUpWOztBQUpGIiwic291cmNlc0NvbnRlbnQiOlsiU3ViQXRvbSA9IHJlcXVpcmUgJ3N1Yi1hdG9tJ1xuXG5tb2R1bGUuZXhwb3J0ID1cblxuICBhY3RpdmF0ZTogLT5cbiAgICBAc3ViID0gbmV3IFN1YkF0b21cbiAgICBAc3ViLmFkZCBhdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS13b3Jrc3BhY2UnLCAnaGVhZGVyLWltcGxlbWVudGF0aW9uOmdlbmVyYXRlJywgID0+IEBnZW5lcmF0ZVxuXG4gIGdlbmVyYXRlOiAtPlxuICAgIGNvbnNvbGUubG9nKCcuY3BwIGZpbGUgd2FzIGdlbmVyYXRlZCcpO1xuICAgIGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgIGJ1ZmZlciA9IGVkaXRvci5nZXRCdWZmZXIoKVxuICAgIGVkaXRvci5zYXZlKClcbiAgICBwYXRoID0gZWRpdG9yLmdldFBhdGgoKVxuICAgIGJ1ZmZlci5zY2FuIG5ldyBSZWdFeHAoXCJuYW1lc3BhY2VcIiksIChyZXMpIC0+XG4gICAgICBlZGl0b3Iuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24ocmVzLnJhbmdlLmVuZClcbiAgICAgIGVkaXRvci5tb3ZlTGVmdChbMV0pXG4gICAgICBlZGl0b3IubW92ZVRvRW5kT2ZXb3JkKClcbiAgICAgIGVkaXRvci5tb3ZlVG9CZWdpbm5pbmdPZldvcmQoKVxuICAgICAgZWRpdG9yLnNlbGVjdFRvRW5kT2ZXb3JkKClcbiAgICAgIGNvbnNvbGUubG9nKGVkaXRvci5nZXRTZWxlY3RlZFRleHQoKSlcbiJdfQ==
