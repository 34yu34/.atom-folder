(function() {
  atom.commands.add('atom-workspace', 'first-item:copy', function() {
    var editor;
    editor = atom.workspace.getActiveTextEditor();
    editor.moveToBeginningOfLine();
    editor.selectToEndOfWord();
    atom.clipboard.write(editor.getSelectedText());
    return console.log(atom.clipboard.read());
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYmlsbHkvLmF0b20vaW5pdC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFBQSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsZ0JBQWxCLEVBQW9DLGlCQUFwQyxFQUF1RCxTQUFBO0FBQ3JELFFBQUE7SUFBQSxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBO0lBQ1QsTUFBTSxDQUFDLHFCQUFQLENBQUE7SUFDQSxNQUFNLENBQUMsaUJBQVAsQ0FBQTtJQUNBLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBZixDQUFxQixNQUFNLENBQUMsZUFBUCxDQUFBLENBQXJCO1dBQ0EsT0FBTyxDQUFDLEdBQVIsQ0FBWSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBQSxDQUFaO0VBTHFELENBQXZEO0FBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJhdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS13b3Jrc3BhY2UnLCAnZmlyc3QtaXRlbTpjb3B5JywgLT5cbiAgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gIGVkaXRvci5tb3ZlVG9CZWdpbm5pbmdPZkxpbmUoKVxuICBlZGl0b3Iuc2VsZWN0VG9FbmRPZldvcmQoKVxuICBhdG9tLmNsaXBib2FyZC53cml0ZShlZGl0b3IuZ2V0U2VsZWN0ZWRUZXh0KCkpXG4gIGNvbnNvbGUubG9nKGF0b20uY2xpcGJvYXJkLnJlYWQoKSlcbiAgI2VkaXRvci5tb3ZlVG9FbmRPZkxpbmUoKVxuICAjZWRpdG9yLmluc2VydE5ld2xpbmUoKVxuICAjZWRpdG9yLmluc2VydFRleHQoYXRvbS5jbGlwYm9hcmQucmVhZCgpKVxuIl19