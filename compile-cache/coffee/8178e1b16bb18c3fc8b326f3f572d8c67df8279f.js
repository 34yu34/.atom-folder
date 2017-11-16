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
      var ctx;
      ctx = this;
      return atom.workspace.open(work.implementationPath).then(function(x) {
        work.editor = x;
        return ctx.writeInEditor(work);
      });
    },
    writeInEditor: function(work) {
      return this.createHead(work);
    },
    createHead: function(work) {
      work.editor.insertText("#include \"" + work.classname + ".h\"");
      return work.editor.insertNewline();
    },
    createMethods: function(editor) {
      return work;
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYmlsbHkvZ2l0aHViL2hlYWRlci1pbXBsZW1lbnRhdGlvbi9saWIvaGVhZGVyLWltcGxlbWVudGF0aW9uLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQTtBQUFBLE1BQUE7O0VBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSOztFQUV4QixNQUFNLENBQUMsT0FBUCxHQUVFO0lBQUEsUUFBQSxFQUFVLFNBQUMsS0FBRDtNQUdSLElBQUMsQ0FBQSxhQUFELEdBQWlCLElBQUk7YUFHckIsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFBb0M7UUFBQSxnQ0FBQSxFQUFrQyxDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFBO21CQUFHLEtBQUMsQ0FBQSxRQUFELENBQUE7VUFBSDtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBbEM7T0FBcEMsQ0FBbkI7SUFOUSxDQUFWO0lBUUEsUUFBQSxFQUFVLFNBQUMsSUFBRDtNQUNSLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBWixDQUFxQixJQUFBLE1BQUEsQ0FBTyxXQUFQLENBQXJCLEVBQTBDLFNBQUMsR0FBRDtRQUN4QyxJQUFJLENBQUMsTUFBTSxDQUFDLHVCQUFaLENBQW9DLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBOUM7UUFDQSxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVosQ0FBc0IsQ0FBdEI7UUFDQSxJQUFJLENBQUMsTUFBTSxDQUFDLGVBQVosQ0FBQTtRQUNBLElBQUksQ0FBQyxNQUFNLENBQUMscUJBQVosQ0FBQTtRQUNBLElBQUksQ0FBQyxNQUFNLENBQUMsaUJBQVosQ0FBQTtRQUNBLElBQUksQ0FBQyxTQUFMLEdBQWlCLE1BQU0sQ0FBQyxlQUFQLENBQUE7ZUFDakIsR0FBRyxDQUFDLElBQUosQ0FBQTtNQVB3QyxDQUExQzthQVFBLElBQUksQ0FBQyxNQUFNLENBQUMsZUFBWixDQUFBO0lBVFEsQ0FSVjtJQW9CQSxVQUFBLEVBQVksU0FBQyxJQUFEO0FBQ1YsVUFBQTtNQUFBLEdBQUEsR0FBTTthQUNOLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFvQixJQUFJLENBQUMsa0JBQXpCLENBQTRDLENBQUMsSUFBN0MsQ0FBa0QsU0FBQyxDQUFEO1FBQ2hELElBQUksQ0FBQyxNQUFMLEdBQWM7ZUFDZCxHQUFHLENBQUMsYUFBSixDQUFrQixJQUFsQjtNQUZnRCxDQUFsRDtJQUZVLENBcEJaO0lBMkJBLGFBQUEsRUFBZSxTQUFDLElBQUQ7YUFDYixJQUFDLENBQUEsVUFBRCxDQUFZLElBQVo7SUFEYSxDQTNCZjtJQThCQSxVQUFBLEVBQVksU0FBQyxJQUFEO01BQ1YsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFaLENBQXVCLGFBQUEsR0FBYyxJQUFJLENBQUMsU0FBbkIsR0FBNkIsTUFBcEQ7YUFDQSxJQUFJLENBQUMsTUFBTSxDQUFDLGFBQVosQ0FBQTtJQUZVLENBOUJaO0lBa0NBLGFBQUEsRUFBZSxTQUFDLE1BQUQ7YUFDYjtJQURhLENBbENmO0lBcUNBLFFBQUEsRUFBVSxTQUFBO0FBQ1IsVUFBQTtNQUFBLE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUE7TUFDVCxNQUFBLEdBQVMsTUFBTSxDQUFDLFNBQVAsQ0FBQTtNQUNULFVBQUEsR0FBYSxNQUFNLENBQUMsT0FBUCxDQUFBO01BQ2Isa0JBQUEsR0FBcUIsVUFBVSxDQUFDLE9BQVgsQ0FBbUIsSUFBbkIsRUFBd0IsTUFBeEI7TUFDckIsSUFBQSxHQUNFO1FBQ0UsUUFBQSxNQURGO1FBRUUsUUFBQSxNQUZGO1FBR0UsWUFBQSxVQUhGO1FBSUUsb0JBQUEsa0JBSkY7UUFLRSxTQUFBLEVBQVksRUFMZDs7TUFPRixJQUFJLENBQUMsTUFBTSxDQUFDLElBQVosQ0FBQTtNQUNBLElBQUMsQ0FBQSxRQUFELENBQVUsSUFBVjthQUNBLElBQUMsQ0FBQSxVQUFELENBQVksSUFBWjtJQWZRLENBckNWOztBQUpGIiwic291cmNlc0NvbnRlbnQiOlsiXG57Q29tcG9zaXRlRGlzcG9zYWJsZX0gPSByZXF1aXJlICdhdG9tJ1xuXG5tb2R1bGUuZXhwb3J0cyA9XG5cbiAgYWN0aXZhdGU6IChzdGF0ZSkgLT5cblxuICAgICMgRXZlbnRzIHN1YnNjcmliZWQgdG8gaW4gYXRvbSdzIHN5c3RlbSBjYW4gYmUgZWFzaWx5IGNsZWFuZWQgdXAgd2l0aCBhIENvbXBvc2l0ZURpc3Bvc2FibGVcbiAgICBAc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlXG5cbiAgICAjIFJlZ2lzdGVyIGNvbW1hbmQgdGhhdCB0b2dnbGVzIHRoaXMgdmlld1xuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS13b3Jrc3BhY2UnLCAnaGVhZGVyLWltcGxlbWVudGF0aW9uOmdlbmVyYXRlJzogPT4gQGdlbmVyYXRlKClcblxuICBmaW5kTmFtZTogKHdvcmspIC0+XG4gICAgd29yay5idWZmZXIuc2NhbiBuZXcgUmVnRXhwKFwibmFtZXNwYWNlXCIpLCAocmVzKSAtPlxuICAgICAgd29yay5lZGl0b3Iuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24ocmVzLnJhbmdlLmVuZClcbiAgICAgIHdvcmsuZWRpdG9yLm1vdmVSaWdodCgxKVxuICAgICAgd29yay5lZGl0b3IubW92ZVRvRW5kT2ZXb3JkKClcbiAgICAgIHdvcmsuZWRpdG9yLm1vdmVUb0JlZ2lubmluZ09mV29yZCgpXG4gICAgICB3b3JrLmVkaXRvci5zZWxlY3RUb0VuZE9mV29yZCgpXG4gICAgICB3b3JrLmNsYXNzbmFtZSA9IGVkaXRvci5nZXRTZWxlY3RlZFRleHQoKVxuICAgICAgcmVzLnN0b3AoKVxuICAgIHdvcmsuZWRpdG9yLm1vdmVUb0VuZE9mTGluZSgpXG5cblxuICBjcmVhdGVGaWxlOiAod29yaykgLT5cbiAgICBjdHggPSB0aGlzXG4gICAgYXRvbS53b3Jrc3BhY2Uub3Blbih3b3JrLmltcGxlbWVudGF0aW9uUGF0aCkudGhlbigoeCkgLT5cbiAgICAgIHdvcmsuZWRpdG9yID0geFxuICAgICAgY3R4LndyaXRlSW5FZGl0b3Iod29yaylcbiAgICApXG5cbiAgd3JpdGVJbkVkaXRvcjogKHdvcmspIC0+XG4gICAgQGNyZWF0ZUhlYWQod29yaylcblxuICBjcmVhdGVIZWFkOiAod29yaykgLT5cbiAgICB3b3JrLmVkaXRvci5pbnNlcnRUZXh0KFwiI2luY2x1ZGUgXFxcIiN7d29yay5jbGFzc25hbWV9LmhcXFwiXCIpXG4gICAgd29yay5lZGl0b3IuaW5zZXJ0TmV3bGluZSgpXG5cbiAgY3JlYXRlTWV0aG9kczogKGVkaXRvcikgLT5cbiAgICB3b3JrXG5cbiAgZ2VuZXJhdGU6IC0+XG4gICAgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgYnVmZmVyID0gZWRpdG9yLmdldEJ1ZmZlcigpXG4gICAgaGVhZGVyUGF0aCA9IGVkaXRvci5nZXRQYXRoKClcbiAgICBpbXBsZW1lbnRhdGlvblBhdGggPSBoZWFkZXJQYXRoLnJlcGxhY2UoXCIuaFwiLFwiLmNwcFwiKVxuICAgIHdvcmsgPVxuICAgICAge1xuICAgICAgICBlZGl0b3IsXG4gICAgICAgIGJ1ZmZlcixcbiAgICAgICAgaGVhZGVyUGF0aCxcbiAgICAgICAgaW1wbGVtZW50YXRpb25QYXRoLFxuICAgICAgICBjbGFzc25hbWUgOiBcIlwiXG4gICAgICB9XG4gICAgd29yay5lZGl0b3Iuc2F2ZSgpXG4gICAgQGZpbmROYW1lKHdvcmspXG4gICAgQGNyZWF0ZUZpbGUod29yaylcbiJdfQ==
