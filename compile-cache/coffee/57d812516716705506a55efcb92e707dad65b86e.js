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

  atom.commands.add('atom-workspace', 'find-and-cursor', function() {
    var buffer, editor, path;
    console.log('.cpp file was generated');
    editor = atom.workspace.getActiveTextEditor();
    buffer = editor.getBuffer();
    editor.save();
    path = editor.getPath();
    return buffer.scan(new RegExp("namespace "), function(res) {
      editor.setCursorBufferPosition(res.range.end);
      editor.selectToEndOfWord();
      return console.log(editor.getSelectedText());
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYmlsbHkvLmF0b20vaW5pdC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFBQSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsZ0JBQWxCLEVBQW9DLGlCQUFwQyxFQUF1RCxTQUFBO0FBQ3JELFFBQUE7SUFBQSxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBO0lBQ1QsT0FBQSxHQUFVLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFBO0lBQ1YsTUFBTSxDQUFDLHFCQUFQLENBQUE7SUFDQSxNQUFNLENBQUMsZUFBUCxDQUFBO0lBQ0EsTUFBTSxDQUFDLHFCQUFQLENBQUE7SUFDQSxNQUFNLENBQUMsaUJBQVAsQ0FBQTtJQUNBLENBQUEsR0FBSSxNQUFNLENBQUMsZUFBUCxDQUFBO0lBQ0osSUFBSSxDQUFBLEtBQUssSUFBTCxJQUFhLENBQUEsS0FBSyxHQUF0QjtNQUNFLE1BQU0sQ0FBQyxpQkFBUCxDQUFBLEVBREY7O0lBRUEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFmLENBQXFCLE1BQU0sQ0FBQyxlQUFQLENBQUEsQ0FBckI7SUFFQSxNQUFNLENBQUMsZUFBUCxDQUFBO0lBQ0EsTUFBTSxDQUFDLGFBQVAsQ0FBQTtJQUNBLE1BQU0sQ0FBQyxVQUFQLENBQWtCLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFBLENBQWxCO0lBQ0EsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsR0FBbEI7V0FDQSxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQWYsQ0FBcUIsT0FBckI7RUFoQnFELENBQXZEOztFQWtCQSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsZ0JBQWxCLEVBQW9DLGlCQUFwQyxFQUF1RCxTQUFBO0FBQ3JELFFBQUE7SUFBQSxPQUFPLENBQUMsR0FBUixDQUFZLHlCQUFaO0lBQ0EsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQTtJQUNULE1BQUEsR0FBUyxNQUFNLENBQUMsU0FBUCxDQUFBO0lBQ1QsTUFBTSxDQUFDLElBQVAsQ0FBQTtJQUNBLElBQUEsR0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBO1dBQ1AsTUFBTSxDQUFDLElBQVAsQ0FBZ0IsSUFBQSxNQUFBLENBQU8sWUFBUCxDQUFoQixFQUFzQyxTQUFDLEdBQUQ7TUFDcEMsTUFBTSxDQUFDLHVCQUFQLENBQStCLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBekM7TUFDQSxNQUFNLENBQUMsaUJBQVAsQ0FBQTthQUNBLE9BQU8sQ0FBQyxHQUFSLENBQVksTUFBTSxDQUFDLGVBQVAsQ0FBQSxDQUFaO0lBSG9DLENBQXRDO0VBTnFELENBQXZEO0FBbEJBIiwic291cmNlc0NvbnRlbnQiOlsiYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20td29ya3NwYWNlJywgJ2ZpcnN0LWl0ZW06Y29weScsIC0+XG4gIGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICBpbml0aWFsID0gYXRvbS5jbGlwYm9hcmQucmVhZCgpXG4gIGVkaXRvci5tb3ZlVG9CZWdpbm5pbmdPZkxpbmUoKVxuICBlZGl0b3IubW92ZVRvRW5kT2ZXb3JkKClcbiAgZWRpdG9yLm1vdmVUb0JlZ2lubmluZ09mV29yZCgpXG4gIGVkaXRvci5zZWxlY3RUb0VuZE9mV29yZCgpXG4gIGEgPSBlZGl0b3IuZ2V0U2VsZWN0ZWRUZXh0KClcbiAgaWYgKGEgPT0gJ1xcXFwnIG9yIGEgPT0gJy4nKVxuICAgIGVkaXRvci5zZWxlY3RUb0VuZE9mV29yZCgpXG4gIGF0b20uY2xpcGJvYXJkLndyaXRlKGVkaXRvci5nZXRTZWxlY3RlZFRleHQoKSlcbiAgI2NvbnNvbGUubG9nKGF0b20uY2xpcGJvYXJkLnJlYWQoKSlcbiAgZWRpdG9yLm1vdmVUb0VuZE9mTGluZSgpXG4gIGVkaXRvci5pbnNlcnROZXdsaW5lKClcbiAgZWRpdG9yLmluc2VydFRleHQoYXRvbS5jbGlwYm9hcmQucmVhZCgpKVxuICBlZGl0b3IuaW5zZXJ0VGV4dChcIiBcIilcbiAgYXRvbS5jbGlwYm9hcmQud3JpdGUoaW5pdGlhbClcblxuYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20td29ya3NwYWNlJywgJ2ZpbmQtYW5kLWN1cnNvcicsIC0+XG4gIGNvbnNvbGUubG9nKCcuY3BwIGZpbGUgd2FzIGdlbmVyYXRlZCcpO1xuICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgYnVmZmVyID0gZWRpdG9yLmdldEJ1ZmZlcigpXG4gIGVkaXRvci5zYXZlKClcbiAgcGF0aCA9IGVkaXRvci5nZXRQYXRoKClcbiAgYnVmZmVyLnNjYW4gbmV3IFJlZ0V4cChcIm5hbWVzcGFjZSBcIiksIChyZXMpIC0+XG4gICAgZWRpdG9yLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uKHJlcy5yYW5nZS5lbmQpIFxuICAgIGVkaXRvci5zZWxlY3RUb0VuZE9mV29yZCgpXG4gICAgY29uc29sZS5sb2coZWRpdG9yLmdldFNlbGVjdGVkVGV4dCgpKVxuIl19
