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
        return ctx.writeInEditor(x);
      });
    },
    writeInEditor: function(editor) {
      var obj;
      obj = {
        editor: editor
      };
      return this.createHead(obj);
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYmlsbHkvZ2l0aHViL2hlYWRlci1pbXBsZW1lbnRhdGlvbi9saWIvaGVhZGVyLWltcGxlbWVudGF0aW9uLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQTtBQUFBLE1BQUE7O0VBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSOztFQUV4QixNQUFNLENBQUMsT0FBUCxHQUVFO0lBQUEsUUFBQSxFQUFVLFNBQUMsS0FBRDtNQUdSLElBQUMsQ0FBQSxhQUFELEdBQWlCLElBQUk7YUFHckIsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFBb0M7UUFBQSxnQ0FBQSxFQUFrQyxDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFBO21CQUFHLEtBQUMsQ0FBQSxRQUFELENBQUE7VUFBSDtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBbEM7T0FBcEMsQ0FBbkI7SUFOUSxDQUFWO0lBUUEsUUFBQSxFQUFVLFNBQUMsSUFBRDtNQUNSLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBWixDQUFxQixJQUFBLE1BQUEsQ0FBTyxXQUFQLENBQXJCLEVBQTBDLFNBQUMsR0FBRDtRQUN4QyxJQUFJLENBQUMsTUFBTSxDQUFDLHVCQUFaLENBQW9DLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBOUM7UUFDQSxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVosQ0FBc0IsQ0FBdEI7UUFDQSxJQUFJLENBQUMsTUFBTSxDQUFDLGVBQVosQ0FBQTtRQUNBLElBQUksQ0FBQyxNQUFNLENBQUMscUJBQVosQ0FBQTtRQUNBLElBQUksQ0FBQyxNQUFNLENBQUMsaUJBQVosQ0FBQTtRQUNBLElBQUksQ0FBQyxTQUFMLEdBQWlCLE1BQU0sQ0FBQyxlQUFQLENBQUE7ZUFDakIsR0FBRyxDQUFDLElBQUosQ0FBQTtNQVB3QyxDQUExQzthQVFBLElBQUksQ0FBQyxNQUFNLENBQUMsZUFBWixDQUFBO0lBVFEsQ0FSVjtJQW9CQSxVQUFBLEVBQVksU0FBQyxJQUFEO0FBQ1YsVUFBQTtNQUFBLEdBQUEsR0FBTTthQUNOLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFvQixJQUFJLENBQUMsa0JBQXpCLENBQTRDLENBQUMsSUFBN0MsQ0FBa0QsU0FBQyxDQUFEO2VBQU8sR0FBRyxDQUFDLGFBQUosQ0FBa0IsQ0FBbEI7TUFBUCxDQUFsRDtJQUZVLENBcEJaO0lBd0JBLGFBQUEsRUFBZSxTQUFDLE1BQUQ7QUFDYixVQUFBO01BQUEsR0FBQSxHQUFNO1FBQ0osUUFBQSxNQURJOzthQUdOLElBQUMsQ0FBQSxVQUFELENBQVksR0FBWjtJQUphLENBeEJmO0lBOEJBLFVBQUEsRUFBWSxTQUFDLElBQUQ7TUFDVixJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVosQ0FBdUIsYUFBQSxHQUFjLElBQUksQ0FBQyxTQUFuQixHQUE2QixNQUFwRDthQUNBLElBQUksQ0FBQyxNQUFNLENBQUMsYUFBWixDQUFBO0lBRlUsQ0E5Qlo7SUFrQ0EsUUFBQSxFQUFVLFNBQUE7QUFDUixVQUFBO01BQUEsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQTtNQUNULE1BQUEsR0FBUyxNQUFNLENBQUMsU0FBUCxDQUFBO01BQ1QsVUFBQSxHQUFhLE1BQU0sQ0FBQyxPQUFQLENBQUE7TUFDYixrQkFBQSxHQUFxQixVQUFVLENBQUMsT0FBWCxDQUFtQixJQUFuQixFQUF3QixNQUF4QjtNQUNyQixJQUFBLEdBQ0U7UUFDQSxRQUFBLE1BREE7UUFFQSxRQUFBLE1BRkE7UUFHQSxZQUFBLFVBSEE7UUFJQSxvQkFBQSxrQkFKQTtRQUtBLFNBQUEsRUFBWSxFQUxaOztNQU9GLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBWixDQUFBO01BQ0EsSUFBQyxDQUFBLFFBQUQsQ0FBVSxJQUFWO2FBQ0EsSUFBQyxDQUFBLFVBQUQsQ0FBWSxJQUFaO0lBZlEsQ0FsQ1Y7O0FBSkYiLCJzb3VyY2VzQ29udGVudCI6WyJcbntDb21wb3NpdGVEaXNwb3NhYmxlfSA9IHJlcXVpcmUgJ2F0b20nXG5cbm1vZHVsZS5leHBvcnRzID1cblxuICBhY3RpdmF0ZTogKHN0YXRlKSAtPlxuXG4gICAgIyBFdmVudHMgc3Vic2NyaWJlZCB0byBpbiBhdG9tJ3Mgc3lzdGVtIGNhbiBiZSBlYXNpbHkgY2xlYW5lZCB1cCB3aXRoIGEgQ29tcG9zaXRlRGlzcG9zYWJsZVxuICAgIEBzdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGVcblxuICAgICMgUmVnaXN0ZXIgY29tbWFuZCB0aGF0IHRvZ2dsZXMgdGhpcyB2aWV3XG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29tbWFuZHMuYWRkICdhdG9tLXdvcmtzcGFjZScsICdoZWFkZXItaW1wbGVtZW50YXRpb246Z2VuZXJhdGUnOiA9PiBAZ2VuZXJhdGUoKVxuXG4gIGZpbmROYW1lOiAod29yaykgLT5cbiAgICB3b3JrLmJ1ZmZlci5zY2FuIG5ldyBSZWdFeHAoXCJuYW1lc3BhY2VcIiksIChyZXMpIC0+XG4gICAgICB3b3JrLmVkaXRvci5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbihyZXMucmFuZ2UuZW5kKVxuICAgICAgd29yay5lZGl0b3IubW92ZVJpZ2h0KDEpXG4gICAgICB3b3JrLmVkaXRvci5tb3ZlVG9FbmRPZldvcmQoKVxuICAgICAgd29yay5lZGl0b3IubW92ZVRvQmVnaW5uaW5nT2ZXb3JkKClcbiAgICAgIHdvcmsuZWRpdG9yLnNlbGVjdFRvRW5kT2ZXb3JkKClcbiAgICAgIHdvcmsuY2xhc3NuYW1lID0gZWRpdG9yLmdldFNlbGVjdGVkVGV4dCgpXG4gICAgICByZXMuc3RvcCgpXG4gICAgd29yay5lZGl0b3IubW92ZVRvRW5kT2ZMaW5lKClcblxuXG4gIGNyZWF0ZUZpbGU6ICh3b3JrKSAtPlxuICAgIGN0eCA9IHRoaXNcbiAgICBhdG9tLndvcmtzcGFjZS5vcGVuKHdvcmsuaW1wbGVtZW50YXRpb25QYXRoKS50aGVuKCh4KSAtPiBjdHgud3JpdGVJbkVkaXRvcih4KSlcblxuICB3cml0ZUluRWRpdG9yOiAoZWRpdG9yKSAtPlxuICAgIG9iaiA9IHtcbiAgICAgIGVkaXRvcixcbiAgICB9XG4gICAgQGNyZWF0ZUhlYWQob2JqKVxuXG4gIGNyZWF0ZUhlYWQ6ICh3b3JrKSAtPlxuICAgIHdvcmsuZWRpdG9yLmluc2VydFRleHQoXCIjaW5jbHVkZSBcXFwiI3t3b3JrLmNsYXNzbmFtZX0uaFxcXCJcIilcbiAgICB3b3JrLmVkaXRvci5pbnNlcnROZXdsaW5lKClcblxuICBnZW5lcmF0ZTogLT5cbiAgICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICBidWZmZXIgPSBlZGl0b3IuZ2V0QnVmZmVyKClcbiAgICBoZWFkZXJQYXRoID0gZWRpdG9yLmdldFBhdGgoKVxuICAgIGltcGxlbWVudGF0aW9uUGF0aCA9IGhlYWRlclBhdGgucmVwbGFjZShcIi5oXCIsXCIuY3BwXCIpXG4gICAgd29yayA9XG4gICAgICB7XG4gICAgICBlZGl0b3IsXG4gICAgICBidWZmZXIsXG4gICAgICBoZWFkZXJQYXRoLFxuICAgICAgaW1wbGVtZW50YXRpb25QYXRoLFxuICAgICAgY2xhc3NuYW1lIDogXCJcIlxuICAgICAgfVxuICAgIHdvcmsuZWRpdG9yLnNhdmUoKVxuICAgIEBmaW5kTmFtZSh3b3JrKVxuICAgIEBjcmVhdGVGaWxlKHdvcmspXG4iXX0=
