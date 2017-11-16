(function() {
  var CompositeDisposable;

  CompositeDisposable = require('atom').CompositeDisposable;

  module.exports = {
    activate: function(state) {
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'header-implementation:generate': (function(_this) {
          return function() {
            return _this.generate();
          };
        })(this)
      }));
      return this.METHOD_PATTERN = /^\s*((?:const|static|virtual|volatile|friend){0,5}\s*[a-zA-Z]+(?::{2}[a-zA-Z_]+)?\s*\**&?)?\s+([~a-zA-Z_]+)\s*(\(.*\))\s*?( const)?/;
    },
    findName: function(work) {
      work.buffer.scan(new RegExp("namespace"), function(res) {
        work.editor.setCursorBufferPosition(res.range.end);
        work.editor.moveRight(1);
        work.editor.moveToEndOfWord();
        work.editor.moveToBeginningOfWord();
        work.editor.selectToEndOfWord();
        work.classname = editor.getSelectedText();
        return res.stop();
      });
      return work.editor.moveToEndOfLine();
    },
    nextMethod: function(work) {
      return work.buffer.scan(this.METHOD_PATTERN, function(res) {
        var method;
        method = [];
        method.push(res.match[1].replace("static ", "").replace(/\s{2,}/, " ") || "");
        method.push(res.match[2] + res.match[3] + (match[4] || ""));
        return console.log(method);
      });
    },
    readFile: function(work) {
      this.findName(work);
      return this.nextMethod(work);
    },
    createFile: function(work) {
      return atom.workspace.open(work.implementationPath);
    },
    writeInEditor: function(work) {
      this.createHead(work);
      return this.createMethods(work);
    },
    createHead: function(work) {
      work.editor.insertText("#include \"" + work.classname + ".h\"");
      return work.editor.insertNewline();
    },
    createMethods: function(editor) {
      return work;
    },
    generate: function() {
      var buffer, ctx, editor, headerPath, implementationPath, work;
      editor = atom.workspace.getActiveTextEditor();
      buffer = editor.getBuffer();
      headerPath = editor.getPath();
      implementationPath = headerPath.replace(".h", ".cpp");
      work = {
        editor: editor,
        buffer: buffer,
        headerPath: headerPath,
        implementationPath: implementationPath,
        classname: "",
        methods: []
      };
      work.editor.save();
      this.readFile(work);
      ctx = this;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYmlsbHkvZ2l0aHViL2hlYWRlci1pbXBsZW1lbnRhdGlvbi9saWIvaGVhZGVyLWltcGxlbWVudGF0aW9uLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQTtBQUFBLE1BQUE7O0VBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSOztFQUV4QixNQUFNLENBQUMsT0FBUCxHQUVFO0lBQUEsUUFBQSxFQUFVLFNBQUMsS0FBRDtNQUdSLElBQUMsQ0FBQSxhQUFELEdBQWlCLElBQUk7TUFHckIsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFBb0M7UUFBQSxnQ0FBQSxFQUFrQyxDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFBO21CQUFHLEtBQUMsQ0FBQSxRQUFELENBQUE7VUFBSDtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBbEM7T0FBcEMsQ0FBbkI7YUFDQSxJQUFDLENBQUEsY0FBRCxHQUFrQjtJQVBWLENBQVY7SUFTQSxRQUFBLEVBQVUsU0FBQyxJQUFEO01BQ1IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFaLENBQXFCLElBQUEsTUFBQSxDQUFPLFdBQVAsQ0FBckIsRUFBMEMsU0FBQyxHQUFEO1FBQ3hDLElBQUksQ0FBQyxNQUFNLENBQUMsdUJBQVosQ0FBb0MsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUE5QztRQUNBLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBWixDQUFzQixDQUF0QjtRQUNBLElBQUksQ0FBQyxNQUFNLENBQUMsZUFBWixDQUFBO1FBQ0EsSUFBSSxDQUFDLE1BQU0sQ0FBQyxxQkFBWixDQUFBO1FBQ0EsSUFBSSxDQUFDLE1BQU0sQ0FBQyxpQkFBWixDQUFBO1FBQ0EsSUFBSSxDQUFDLFNBQUwsR0FBaUIsTUFBTSxDQUFDLGVBQVAsQ0FBQTtlQUNqQixHQUFHLENBQUMsSUFBSixDQUFBO01BUHdDLENBQTFDO2FBUUEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxlQUFaLENBQUE7SUFUUSxDQVRWO0lBb0JBLFVBQUEsRUFBWSxTQUFDLElBQUQ7YUFDVixJQUFJLENBQUMsTUFBTSxDQUFDLElBQVosQ0FBaUIsSUFBQyxDQUFBLGNBQWxCLEVBQWtDLFNBQUMsR0FBRDtBQUNoQyxZQUFBO1FBQUEsTUFBQSxHQUFTO1FBQ1QsTUFBTSxDQUFDLElBQVAsQ0FBWSxHQUFHLENBQUMsS0FBTSxDQUFBLENBQUEsQ0FBRSxDQUFDLE9BQWIsQ0FBcUIsU0FBckIsRUFBZ0MsRUFBaEMsQ0FBbUMsQ0FBQyxPQUFwQyxDQUE0QyxRQUE1QyxFQUFzRCxHQUF0RCxDQUFBLElBQThELEVBQTFFO1FBQ0EsTUFBTSxDQUFDLElBQVAsQ0FBWSxHQUFHLENBQUMsS0FBTSxDQUFBLENBQUEsQ0FBVixHQUFlLEdBQUcsQ0FBQyxLQUFNLENBQUEsQ0FBQSxDQUF6QixHQUE4QixDQUFDLEtBQU0sQ0FBQSxDQUFBLENBQU4sSUFBVSxFQUFYLENBQTFDO2VBQ0EsT0FBTyxDQUFDLEdBQVIsQ0FBWSxNQUFaO01BSmdDLENBQWxDO0lBRFUsQ0FwQlo7SUEyQkEsUUFBQSxFQUFVLFNBQUMsSUFBRDtNQUNSLElBQUMsQ0FBQSxRQUFELENBQVUsSUFBVjthQUNBLElBQUMsQ0FBQSxVQUFELENBQVksSUFBWjtJQUZRLENBM0JWO0lBK0JBLFVBQUEsRUFBWSxTQUFDLElBQUQ7QUFDVixhQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFvQixJQUFJLENBQUMsa0JBQXpCO0lBREcsQ0EvQlo7SUFrQ0EsYUFBQSxFQUFlLFNBQUMsSUFBRDtNQUNiLElBQUMsQ0FBQSxVQUFELENBQVksSUFBWjthQUNBLElBQUMsQ0FBQSxhQUFELENBQWUsSUFBZjtJQUZhLENBbENmO0lBc0NBLFVBQUEsRUFBWSxTQUFDLElBQUQ7TUFDVixJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVosQ0FBdUIsYUFBQSxHQUFjLElBQUksQ0FBQyxTQUFuQixHQUE2QixNQUFwRDthQUNBLElBQUksQ0FBQyxNQUFNLENBQUMsYUFBWixDQUFBO0lBRlUsQ0F0Q1o7SUEwQ0EsYUFBQSxFQUFlLFNBQUMsTUFBRDthQUNiO0lBRGEsQ0ExQ2Y7SUE2Q0EsUUFBQSxFQUFVLFNBQUE7QUFDUixVQUFBO01BQUEsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQTtNQUNULE1BQUEsR0FBUyxNQUFNLENBQUMsU0FBUCxDQUFBO01BQ1QsVUFBQSxHQUFhLE1BQU0sQ0FBQyxPQUFQLENBQUE7TUFDYixrQkFBQSxHQUFxQixVQUFVLENBQUMsT0FBWCxDQUFtQixJQUFuQixFQUF3QixNQUF4QjtNQUNyQixJQUFBLEdBQ0U7UUFDRSxRQUFBLE1BREY7UUFFRSxRQUFBLE1BRkY7UUFHRSxZQUFBLFVBSEY7UUFJRSxvQkFBQSxrQkFKRjtRQUtFLFNBQUEsRUFBWSxFQUxkO1FBTUUsT0FBQSxFQUFVLEVBTlo7O01BUUYsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFaLENBQUE7TUFDQSxJQUFDLENBQUEsUUFBRCxDQUFVLElBQVY7TUFDQSxHQUFBLEdBQU07SUFoQkUsQ0E3Q1Y7O0FBSkYiLCJzb3VyY2VzQ29udGVudCI6WyJcbntDb21wb3NpdGVEaXNwb3NhYmxlfSA9IHJlcXVpcmUgJ2F0b20nXG5cbm1vZHVsZS5leHBvcnRzID1cblxuICBhY3RpdmF0ZTogKHN0YXRlKSAtPlxuXG4gICAgIyBFdmVudHMgc3Vic2NyaWJlZCB0byBpbiBhdG9tJ3Mgc3lzdGVtIGNhbiBiZSBlYXNpbHkgY2xlYW5lZCB1cCB3aXRoIGEgQ29tcG9zaXRlRGlzcG9zYWJsZVxuICAgIEBzdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGVcblxuICAgICMgUmVnaXN0ZXIgY29tbWFuZCB0aGF0IHRvZ2dsZXMgdGhpcyB2aWV3XG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29tbWFuZHMuYWRkICdhdG9tLXdvcmtzcGFjZScsICdoZWFkZXItaW1wbGVtZW50YXRpb246Z2VuZXJhdGUnOiA9PiBAZ2VuZXJhdGUoKVxuICAgIEBNRVRIT0RfUEFUVEVSTiA9IC9eXFxzKigoPzpjb25zdHxzdGF0aWN8dmlydHVhbHx2b2xhdGlsZXxmcmllbmQpezAsNX1cXHMqW2EtekEtWl0rKD86OnsyfVthLXpBLVpfXSspP1xccypcXCoqJj8pP1xccysoW35hLXpBLVpfXSspXFxzKihcXCguKlxcKSlcXHMqPyggY29uc3QpPy9cblxuICBmaW5kTmFtZTogKHdvcmspIC0+XG4gICAgd29yay5idWZmZXIuc2NhbiBuZXcgUmVnRXhwKFwibmFtZXNwYWNlXCIpLCAocmVzKSAtPlxuICAgICAgd29yay5lZGl0b3Iuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24ocmVzLnJhbmdlLmVuZClcbiAgICAgIHdvcmsuZWRpdG9yLm1vdmVSaWdodCgxKVxuICAgICAgd29yay5lZGl0b3IubW92ZVRvRW5kT2ZXb3JkKClcbiAgICAgIHdvcmsuZWRpdG9yLm1vdmVUb0JlZ2lubmluZ09mV29yZCgpXG4gICAgICB3b3JrLmVkaXRvci5zZWxlY3RUb0VuZE9mV29yZCgpXG4gICAgICB3b3JrLmNsYXNzbmFtZSA9IGVkaXRvci5nZXRTZWxlY3RlZFRleHQoKVxuICAgICAgcmVzLnN0b3AoKVxuICAgIHdvcmsuZWRpdG9yLm1vdmVUb0VuZE9mTGluZSgpXG5cbiAgbmV4dE1ldGhvZDogKHdvcmspIC0+XG4gICAgd29yay5idWZmZXIuc2NhbiBATUVUSE9EX1BBVFRFUk4sIChyZXMpIC0+XG4gICAgICBtZXRob2QgPSBbXVxuICAgICAgbWV0aG9kLnB1c2gocmVzLm1hdGNoWzFdLnJlcGxhY2UoXCJzdGF0aWMgXCIsIFwiXCIpLnJlcGxhY2UoL1xcc3syLH0vLCBcIiBcIikgfHwgXCJcIilcbiAgICAgIG1ldGhvZC5wdXNoKHJlcy5tYXRjaFsyXSArIHJlcy5tYXRjaFszXSArIChtYXRjaFs0XXx8XCJcIikpXG4gICAgICBjb25zb2xlLmxvZyhtZXRob2QpXG5cbiAgcmVhZEZpbGU6ICh3b3JrKSAtPlxuICAgIEBmaW5kTmFtZSh3b3JrKVxuICAgIEBuZXh0TWV0aG9kKHdvcmspXG5cbiAgY3JlYXRlRmlsZTogKHdvcmspIC0+XG4gICAgcmV0dXJuIGF0b20ud29ya3NwYWNlLm9wZW4od29yay5pbXBsZW1lbnRhdGlvblBhdGgpXG5cbiAgd3JpdGVJbkVkaXRvcjogKHdvcmspIC0+XG4gICAgQGNyZWF0ZUhlYWQod29yaylcbiAgICBAY3JlYXRlTWV0aG9kcyh3b3JrKVxuXG4gIGNyZWF0ZUhlYWQ6ICh3b3JrKSAtPlxuICAgIHdvcmsuZWRpdG9yLmluc2VydFRleHQoXCIjaW5jbHVkZSBcXFwiI3t3b3JrLmNsYXNzbmFtZX0uaFxcXCJcIilcbiAgICB3b3JrLmVkaXRvci5pbnNlcnROZXdsaW5lKClcblxuICBjcmVhdGVNZXRob2RzOiAoZWRpdG9yKSAtPlxuICAgIHdvcmtcblxuICBnZW5lcmF0ZTogLT5cbiAgICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICBidWZmZXIgPSBlZGl0b3IuZ2V0QnVmZmVyKClcbiAgICBoZWFkZXJQYXRoID0gZWRpdG9yLmdldFBhdGgoKVxuICAgIGltcGxlbWVudGF0aW9uUGF0aCA9IGhlYWRlclBhdGgucmVwbGFjZShcIi5oXCIsXCIuY3BwXCIpXG4gICAgd29yayA9XG4gICAgICB7XG4gICAgICAgIGVkaXRvcixcbiAgICAgICAgYnVmZmVyLFxuICAgICAgICBoZWFkZXJQYXRoLFxuICAgICAgICBpbXBsZW1lbnRhdGlvblBhdGgsXG4gICAgICAgIGNsYXNzbmFtZSA6IFwiXCJcbiAgICAgICAgbWV0aG9kcyA6IFtdXG4gICAgICB9XG4gICAgd29yay5lZGl0b3Iuc2F2ZSgpXG4gICAgQHJlYWRGaWxlKHdvcmspXG4gICAgY3R4ID0gdGhpc1xuICAgICNAY3JlYXRlRmlsZSh3b3JrKS50aGVuIChlZGl0b3IpIC0+XG4gICAgIyAgd29yay5lZGl0b3IgPSBlZGl0b3JcbiAgICAjICB3b3JrLmJ1ZmZlciA9IHdvcmsuZWRpdG9yLmdldEJ1ZmZlcigpXG4gICAgIyAgY3R4LndyaXRlSW5FZGl0b3Iod29yaylcbiAgICByZXR1cm5cbiJdfQ==
