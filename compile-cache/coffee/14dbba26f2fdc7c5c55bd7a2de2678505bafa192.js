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
      editor.setCursorBufferPostion(res.range.end);
      editor.selectToEndOfWord();
      return console.log(editor.selectToEndOfWord());
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYmlsbHkvLmF0b20vaW5pdC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFBQSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsZ0JBQWxCLEVBQW9DLGlCQUFwQyxFQUF1RCxTQUFBO0FBQ3JELFFBQUE7SUFBQSxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBO0lBQ1QsT0FBQSxHQUFVLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFBO0lBQ1YsTUFBTSxDQUFDLHFCQUFQLENBQUE7SUFDQSxNQUFNLENBQUMsZUFBUCxDQUFBO0lBQ0EsTUFBTSxDQUFDLHFCQUFQLENBQUE7SUFDQSxNQUFNLENBQUMsaUJBQVAsQ0FBQTtJQUNBLENBQUEsR0FBSSxNQUFNLENBQUMsZUFBUCxDQUFBO0lBQ0osSUFBSSxDQUFBLEtBQUssSUFBTCxJQUFhLENBQUEsS0FBSyxHQUF0QjtNQUNFLE1BQU0sQ0FBQyxpQkFBUCxDQUFBLEVBREY7O0lBRUEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFmLENBQXFCLE1BQU0sQ0FBQyxlQUFQLENBQUEsQ0FBckI7SUFFQSxNQUFNLENBQUMsZUFBUCxDQUFBO0lBQ0EsTUFBTSxDQUFDLGFBQVAsQ0FBQTtJQUNBLE1BQU0sQ0FBQyxVQUFQLENBQWtCLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFBLENBQWxCO0lBQ0EsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsR0FBbEI7V0FDQSxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQWYsQ0FBcUIsT0FBckI7RUFoQnFELENBQXZEOztFQWtCQSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsZ0JBQWxCLEVBQW9DLGlCQUFwQyxFQUF1RCxTQUFBO0FBQ3JELFFBQUE7SUFBQSxPQUFPLENBQUMsR0FBUixDQUFZLHlCQUFaO0lBQ0EsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQTtJQUNULE1BQUEsR0FBUyxNQUFNLENBQUMsU0FBUCxDQUFBO0lBQ1QsTUFBTSxDQUFDLElBQVAsQ0FBQTtJQUNBLElBQUEsR0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBO1dBQ1AsTUFBTSxDQUFDLElBQVAsQ0FBZ0IsSUFBQSxNQUFBLENBQU8sWUFBUCxDQUFoQixFQUFzQyxTQUFDLEdBQUQ7TUFDcEMsTUFBTSxDQUFDLHNCQUFQLENBQThCLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBeEM7TUFDQSxNQUFNLENBQUMsaUJBQVAsQ0FBQTthQUNBLE9BQU8sQ0FBQyxHQUFSLENBQVksTUFBTSxDQUFDLGlCQUFQLENBQUEsQ0FBWjtJQUhvQyxDQUF0QztFQU5xRCxDQUF2RDtBQWxCQSIsInNvdXJjZXNDb250ZW50IjpbImF0b20uY29tbWFuZHMuYWRkICdhdG9tLXdvcmtzcGFjZScsICdmaXJzdC1pdGVtOmNvcHknLCAtPlxuICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgaW5pdGlhbCA9IGF0b20uY2xpcGJvYXJkLnJlYWQoKVxuICBlZGl0b3IubW92ZVRvQmVnaW5uaW5nT2ZMaW5lKClcbiAgZWRpdG9yLm1vdmVUb0VuZE9mV29yZCgpXG4gIGVkaXRvci5tb3ZlVG9CZWdpbm5pbmdPZldvcmQoKVxuICBlZGl0b3Iuc2VsZWN0VG9FbmRPZldvcmQoKVxuICBhID0gZWRpdG9yLmdldFNlbGVjdGVkVGV4dCgpXG4gIGlmIChhID09ICdcXFxcJyBvciBhID09ICcuJylcbiAgICBlZGl0b3Iuc2VsZWN0VG9FbmRPZldvcmQoKVxuICBhdG9tLmNsaXBib2FyZC53cml0ZShlZGl0b3IuZ2V0U2VsZWN0ZWRUZXh0KCkpXG4gICNjb25zb2xlLmxvZyhhdG9tLmNsaXBib2FyZC5yZWFkKCkpXG4gIGVkaXRvci5tb3ZlVG9FbmRPZkxpbmUoKVxuICBlZGl0b3IuaW5zZXJ0TmV3bGluZSgpXG4gIGVkaXRvci5pbnNlcnRUZXh0KGF0b20uY2xpcGJvYXJkLnJlYWQoKSlcbiAgZWRpdG9yLmluc2VydFRleHQoXCIgXCIpXG4gIGF0b20uY2xpcGJvYXJkLndyaXRlKGluaXRpYWwpXG5cbmF0b20uY29tbWFuZHMuYWRkICdhdG9tLXdvcmtzcGFjZScsICdmaW5kLWFuZC1jdXJzb3InLCAtPlxuICBjb25zb2xlLmxvZygnLmNwcCBmaWxlIHdhcyBnZW5lcmF0ZWQnKTtcbiAgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gIGJ1ZmZlciA9IGVkaXRvci5nZXRCdWZmZXIoKVxuICBlZGl0b3Iuc2F2ZSgpXG4gIHBhdGggPSBlZGl0b3IuZ2V0UGF0aCgpXG4gIGJ1ZmZlci5zY2FuIG5ldyBSZWdFeHAoXCJuYW1lc3BhY2UgXCIpLCAocmVzKSAtPlxuICAgIGVkaXRvci5zZXRDdXJzb3JCdWZmZXJQb3N0aW9uKHJlcy5yYW5nZS5lbmQpXG4gICAgZWRpdG9yLnNlbGVjdFRvRW5kT2ZXb3JkKClcbiAgICBjb25zb2xlLmxvZyhlZGl0b3Iuc2VsZWN0VG9FbmRPZldvcmQoKSlcbiJdfQ==