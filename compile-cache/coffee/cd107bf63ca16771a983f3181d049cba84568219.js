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
    createFile: function(work) {
      return atom.workspace.open(work.implementationPath).resolve();
    },
    createHead: function(work) {
      work.editor.insertText("#include \"" + work.classname + ".h\"");
      return work.editor.insertNewline();
    },
    generate: function() {
      var buffer, editor, headerPath, implementationPath, work;
      editor = atom.workspace.getActiveTextEditor();
      buffer = editor.getBuffer();
      headerPath = editor.getPath();
      implementationPath = headerPath.replace(".h", ".cpp");
      work = {
        editor: editor,
        buffer: buffer,
        headerPath: headerPath,
        implementationPath: implementationPath,
        classname: ""
      };
      work.editor.save();
      this.findName(work);
      return this.createFile(work);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYmlsbHkvZ2l0aHViL2hlYWRlci1pbXBsZW1lbnRhdGlvbi9saWIvaGVhZGVyLWltcGxlbWVudGF0aW9uLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQTtBQUFBLE1BQUE7O0VBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSOztFQUV4QixNQUFNLENBQUMsT0FBUCxHQUVFO0lBQUEsUUFBQSxFQUFVLFNBQUMsS0FBRDtNQUdSLElBQUMsQ0FBQSxhQUFELEdBQWlCLElBQUk7YUFHckIsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFBb0M7UUFBQSxnQ0FBQSxFQUFrQyxDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFBO21CQUFHLEtBQUMsQ0FBQSxRQUFELENBQUE7VUFBSDtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBbEM7T0FBcEMsQ0FBbkI7SUFOUSxDQUFWO0lBUUEsUUFBQSxFQUFVLFNBQUMsSUFBRDtNQUNSLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBWixDQUFxQixJQUFBLE1BQUEsQ0FBTyxXQUFQLENBQXJCLEVBQTBDLFNBQUMsR0FBRDtRQUN4QyxJQUFJLENBQUMsTUFBTSxDQUFDLHVCQUFaLENBQW9DLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBOUM7UUFDQSxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVosQ0FBc0IsQ0FBdEI7UUFDQSxJQUFJLENBQUMsTUFBTSxDQUFDLGVBQVosQ0FBQTtRQUNBLElBQUksQ0FBQyxNQUFNLENBQUMscUJBQVosQ0FBQTtRQUNBLElBQUksQ0FBQyxNQUFNLENBQUMsaUJBQVosQ0FBQTtRQUNBLElBQUksQ0FBQyxTQUFMLEdBQWlCLE1BQU0sQ0FBQyxlQUFQLENBQUE7ZUFDakIsR0FBRyxDQUFDLElBQUosQ0FBQTtNQVB3QyxDQUExQzthQVFBLElBQUksQ0FBQyxNQUFNLENBQUMsZUFBWixDQUFBO0lBVFEsQ0FSVjtJQW9CQSxVQUFBLEVBQVksU0FBQyxJQUFEO0FBQ1YsYUFBTyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBb0IsSUFBSSxDQUFDLGtCQUF6QixDQUE0QyxDQUFDLE9BQTdDLENBQUE7SUFERyxDQXBCWjtJQXlCQSxVQUFBLEVBQVksU0FBQyxJQUFEO01BQ1YsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFaLENBQXVCLGFBQUEsR0FBYyxJQUFJLENBQUMsU0FBbkIsR0FBNkIsTUFBcEQ7YUFDQSxJQUFJLENBQUMsTUFBTSxDQUFDLGFBQVosQ0FBQTtJQUZVLENBekJaO0lBNkJBLFFBQUEsRUFBVSxTQUFBO0FBQ1IsVUFBQTtNQUFBLE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUE7TUFDVCxNQUFBLEdBQVMsTUFBTSxDQUFDLFNBQVAsQ0FBQTtNQUNULFVBQUEsR0FBYSxNQUFNLENBQUMsT0FBUCxDQUFBO01BQ2Isa0JBQUEsR0FBcUIsVUFBVSxDQUFDLE9BQVgsQ0FBbUIsSUFBbkIsRUFBd0IsTUFBeEI7TUFDckIsSUFBQSxHQUNFO1FBQ0EsUUFBQSxNQURBO1FBRUEsUUFBQSxNQUZBO1FBR0EsWUFBQSxVQUhBO1FBSUEsb0JBQUEsa0JBSkE7UUFLQSxTQUFBLEVBQVksRUFMWjs7TUFPRixJQUFJLENBQUMsTUFBTSxDQUFDLElBQVosQ0FBQTtNQUNBLElBQUMsQ0FBQSxRQUFELENBQVUsSUFBVjthQUNBLElBQUMsQ0FBQSxVQUFELENBQVksSUFBWjtJQWZRLENBN0JWOztBQUpGIiwic291cmNlc0NvbnRlbnQiOlsiXG57Q29tcG9zaXRlRGlzcG9zYWJsZX0gPSByZXF1aXJlICdhdG9tJ1xuXG5tb2R1bGUuZXhwb3J0cyA9XG5cbiAgYWN0aXZhdGU6IChzdGF0ZSkgLT5cblxuICAgICMgRXZlbnRzIHN1YnNjcmliZWQgdG8gaW4gYXRvbSdzIHN5c3RlbSBjYW4gYmUgZWFzaWx5IGNsZWFuZWQgdXAgd2l0aCBhIENvbXBvc2l0ZURpc3Bvc2FibGVcbiAgICBAc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlXG5cbiAgICAjIFJlZ2lzdGVyIGNvbW1hbmQgdGhhdCB0b2dnbGVzIHRoaXMgdmlld1xuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS13b3Jrc3BhY2UnLCAnaGVhZGVyLWltcGxlbWVudGF0aW9uOmdlbmVyYXRlJzogPT4gQGdlbmVyYXRlKClcblxuICBmaW5kTmFtZTogKHdvcmspIC0+XG4gICAgd29yay5idWZmZXIuc2NhbiBuZXcgUmVnRXhwKFwibmFtZXNwYWNlXCIpLCAocmVzKSAtPlxuICAgICAgd29yay5lZGl0b3Iuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24ocmVzLnJhbmdlLmVuZClcbiAgICAgIHdvcmsuZWRpdG9yLm1vdmVSaWdodCgxKVxuICAgICAgd29yay5lZGl0b3IubW92ZVRvRW5kT2ZXb3JkKClcbiAgICAgIHdvcmsuZWRpdG9yLm1vdmVUb0JlZ2lubmluZ09mV29yZCgpXG4gICAgICB3b3JrLmVkaXRvci5zZWxlY3RUb0VuZE9mV29yZCgpXG4gICAgICB3b3JrLmNsYXNzbmFtZSA9IGVkaXRvci5nZXRTZWxlY3RlZFRleHQoKVxuICAgICAgcmVzLnN0b3AoKVxuICAgIHdvcmsuZWRpdG9yLm1vdmVUb0VuZE9mTGluZSgpXG5cblxuICBjcmVhdGVGaWxlOiAod29yaykgLT5cbiAgICByZXR1cm4gYXRvbS53b3Jrc3BhY2Uub3Blbih3b3JrLmltcGxlbWVudGF0aW9uUGF0aCkucmVzb2x2ZSgpXG5cblxuXG4gIGNyZWF0ZUhlYWQ6ICh3b3JrKSAtPlxuICAgIHdvcmsuZWRpdG9yLmluc2VydFRleHQoXCIjaW5jbHVkZSBcXFwiI3t3b3JrLmNsYXNzbmFtZX0uaFxcXCJcIilcbiAgICB3b3JrLmVkaXRvci5pbnNlcnROZXdsaW5lKClcblxuICBnZW5lcmF0ZTogLT5cbiAgICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICBidWZmZXIgPSBlZGl0b3IuZ2V0QnVmZmVyKClcbiAgICBoZWFkZXJQYXRoID0gZWRpdG9yLmdldFBhdGgoKVxuICAgIGltcGxlbWVudGF0aW9uUGF0aCA9IGhlYWRlclBhdGgucmVwbGFjZShcIi5oXCIsXCIuY3BwXCIpXG4gICAgd29yayA9XG4gICAgICB7XG4gICAgICBlZGl0b3IsXG4gICAgICBidWZmZXIsXG4gICAgICBoZWFkZXJQYXRoLFxuICAgICAgaW1wbGVtZW50YXRpb25QYXRoLFxuICAgICAgY2xhc3NuYW1lIDogXCJcIlxuICAgICAgfVxuICAgIHdvcmsuZWRpdG9yLnNhdmUoKVxuICAgIEBmaW5kTmFtZSh3b3JrKVxuICAgIEBjcmVhdGVGaWxlKHdvcmspXG4iXX0=
