(function() {
  atom.commands.add('atom-workspace', 'first-item:copy', function() {
    var a, editor, initial;
    editor = atom.workspace.getActiveTextEditor();
    initial = atom.clipboard.read();
    editor.moveToBeginningOfLine();
    editor.moveToEndOfWord();
    editor.moveToBeginningOfWord();
    editor.selectToEndOfWord();
    a = editor.getSelectedText();
    if (a === '\\' || a === '.') {
      editor.selectToEndOfWord();
    }
    atom.clipboard.write(editor.getSelectedText());
    editor.moveToEndOfLine();
    editor.insertNewline();
    editor.insertText(atom.clipboard.read());
    editor.insertText(" ");
    return atom.clipboard.write(initial);
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYmlsbHkvLmF0b20vaW5pdC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFBQSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsZ0JBQWxCLEVBQW9DLGlCQUFwQyxFQUF1RCxTQUFBO0FBQ3JELFFBQUE7SUFBQSxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBO0lBQ1QsT0FBQSxHQUFVLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFBO0lBQ1YsTUFBTSxDQUFDLHFCQUFQLENBQUE7SUFDQSxNQUFNLENBQUMsZUFBUCxDQUFBO0lBQ0EsTUFBTSxDQUFDLHFCQUFQLENBQUE7SUFDQSxNQUFNLENBQUMsaUJBQVAsQ0FBQTtJQUNBLENBQUEsR0FBSSxNQUFNLENBQUMsZUFBUCxDQUFBO0lBQ0osSUFBSSxDQUFBLEtBQUssSUFBTCxJQUFhLENBQUEsS0FBSyxHQUF0QjtNQUNFLE1BQU0sQ0FBQyxpQkFBUCxDQUFBLEVBREY7O0lBRUEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFmLENBQXFCLE1BQU0sQ0FBQyxlQUFQLENBQUEsQ0FBckI7SUFFQSxNQUFNLENBQUMsZUFBUCxDQUFBO0lBQ0EsTUFBTSxDQUFDLGFBQVAsQ0FBQTtJQUNBLE1BQU0sQ0FBQyxVQUFQLENBQWtCLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFBLENBQWxCO0lBQ0EsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsR0FBbEI7V0FDQSxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQWYsQ0FBcUIsT0FBckI7RUFoQnFELENBQXZEO0FBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJhdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS13b3Jrc3BhY2UnLCAnZmlyc3QtaXRlbTpjb3B5JywgLT5cbiAgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gIGluaXRpYWwgPSBhdG9tLmNsaXBib2FyZC5yZWFkKClcbiAgZWRpdG9yLm1vdmVUb0JlZ2lubmluZ09mTGluZSgpXG4gIGVkaXRvci5tb3ZlVG9FbmRPZldvcmQoKVxuICBlZGl0b3IubW92ZVRvQmVnaW5uaW5nT2ZXb3JkKClcbiAgZWRpdG9yLnNlbGVjdFRvRW5kT2ZXb3JkKClcbiAgYSA9IGVkaXRvci5nZXRTZWxlY3RlZFRleHQoKVxuICBpZiAoYSA9PSAnXFxcXCcgb3IgYSA9PSAnLicpXG4gICAgZWRpdG9yLnNlbGVjdFRvRW5kT2ZXb3JkKClcbiAgYXRvbS5jbGlwYm9hcmQud3JpdGUoZWRpdG9yLmdldFNlbGVjdGVkVGV4dCgpKVxuICAjY29uc29sZS5sb2coYXRvbS5jbGlwYm9hcmQucmVhZCgpKVxuICBlZGl0b3IubW92ZVRvRW5kT2ZMaW5lKClcbiAgZWRpdG9yLmluc2VydE5ld2xpbmUoKVxuICBlZGl0b3IuaW5zZXJ0VGV4dChhdG9tLmNsaXBib2FyZC5yZWFkKCkpXG4gIGVkaXRvci5pbnNlcnRUZXh0KFwiIFwiKVxuICBhdG9tLmNsaXBib2FyZC53cml0ZShpbml0aWFsKVxuIl19