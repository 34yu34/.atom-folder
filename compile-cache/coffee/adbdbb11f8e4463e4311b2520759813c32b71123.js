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
      buffer.scan(new RegExp("namespace"), function(res) {});
      editor.setCursorBufferPosition(res.range.end);
      editor.moveLeft([1]);
      editor.moveToEndOfWord();
      editor.moveToBeginningOfWord();
      editor.selectToEndOfWord();
      return console.log(editor.getSelectedText());
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYmlsbHkvZ2l0aHViL2hlYWRlci1pbXBsZW1lbnRhdGlvbi9saWIvaGVhZGVyLWltcGxlbWVudGF0aW9uLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUFBLE1BQU0sRUFBQyxNQUFELEVBQU4sR0FDRTtJQUFBLFFBQUEsRUFBVSxTQUFBO2FBRVIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGdCQUFsQixFQUFvQyxnQ0FBcEMsRUFBdUUsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO2lCQUFHLEtBQUMsQ0FBQTtRQUFKO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF2RTtJQUZRLENBQVY7SUFJQSxRQUFBLEVBQVUsU0FBQTtBQUFHLFVBQUE7TUFDWCxPQUFPLENBQUMsR0FBUixDQUFZLHlCQUFaO01BQ0EsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQTtNQUNULE1BQUEsR0FBUyxNQUFNLENBQUMsU0FBUCxDQUFBO01BQ1QsTUFBTSxDQUFDLElBQVAsQ0FBQTtNQUNBLElBQUEsR0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBO01BQ1AsTUFBTSxDQUFDLElBQVAsQ0FBZ0IsSUFBQSxNQUFBLENBQU8sV0FBUCxDQUFoQixFQUFxQyxTQUFDLEdBQUQsR0FBQSxDQUFyQztNQUNBLE1BQU0sQ0FBQyx1QkFBUCxDQUErQixHQUFHLENBQUMsS0FBSyxDQUFDLEdBQXpDO01BQ0EsTUFBTSxDQUFDLFFBQVAsQ0FBZ0IsQ0FBQyxDQUFELENBQWhCO01BQ0EsTUFBTSxDQUFDLGVBQVAsQ0FBQTtNQUNBLE1BQU0sQ0FBQyxxQkFBUCxDQUFBO01BQ0EsTUFBTSxDQUFDLGlCQUFQLENBQUE7YUFDQSxPQUFPLENBQUMsR0FBUixDQUFZLE1BQU0sQ0FBQyxlQUFQLENBQUEsQ0FBWjtJQVpRLENBSlY7O0FBREYiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0ID1cbiAgYWN0aXZhdGU6IC0+XG5cbiAgICBhdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS13b3Jrc3BhY2UnLCAnaGVhZGVyLWltcGxlbWVudGF0aW9uOmdlbmVyYXRlJywgID0+IEBnZW5lcmF0ZVxuXG4gIGdlbmVyYXRlOiAtPiAoXG4gICAgY29uc29sZS5sb2coJy5jcHAgZmlsZSB3YXMgZ2VuZXJhdGVkJylcbiAgICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICBidWZmZXIgPSBlZGl0b3IuZ2V0QnVmZmVyKClcbiAgICBlZGl0b3Iuc2F2ZSgpXG4gICAgcGF0aCA9IGVkaXRvci5nZXRQYXRoKClcbiAgICBidWZmZXIuc2NhbiBuZXcgUmVnRXhwKFwibmFtZXNwYWNlXCIpLCAocmVzKSAtPlxuICAgIGVkaXRvci5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbihyZXMucmFuZ2UuZW5kKVxuICAgIGVkaXRvci5tb3ZlTGVmdChbMV0pXG4gICAgZWRpdG9yLm1vdmVUb0VuZE9mV29yZCgpXG4gICAgZWRpdG9yLm1vdmVUb0JlZ2lubmluZ09mV29yZCgpXG4gICAgZWRpdG9yLnNlbGVjdFRvRW5kT2ZXb3JkKClcbiAgICBjb25zb2xlLmxvZyhlZGl0b3IuZ2V0U2VsZWN0ZWRUZXh0KCkpIClcbiJdfQ==
