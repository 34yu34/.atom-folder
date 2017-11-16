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
      return work.buffer.scan(new RegExp("namespace"), function(res) {
        work.editor.setCursorBufferPosition(res.range.end);
        work.editor.moveRight(1);
        work.editor.moveToEndOfWord();
        work.editor.moveToBeginningOfWord();
        work.editor.selectToEndOfWord();
        work.classname = editor.getSelectedText();
        return res.stop();
      });
    },
    createFile: function(work) {
      atom.workspace.open(work.implementationPath);
      work.editor = atom.workspace.getActiveTextEditor();
      return work.buffer = work.editor.getBuffer();
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
      this.createFile(work);
      this.findName(work);
      return this.createHead(work);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYmlsbHkvZ2l0aHViL2hlYWRlci1pbXBsZW1lbnRhdGlvbi9saWIvaGVhZGVyLWltcGxlbWVudGF0aW9uLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQTtBQUFBLE1BQUE7O0VBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSOztFQUV4QixNQUFNLENBQUMsT0FBUCxHQUVFO0lBQUEsUUFBQSxFQUFVLFNBQUMsS0FBRDtNQUdSLElBQUMsQ0FBQSxhQUFELEdBQWlCLElBQUk7YUFHckIsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFBb0M7UUFBQSxnQ0FBQSxFQUFrQyxDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFBO21CQUFHLEtBQUMsQ0FBQSxRQUFELENBQUE7VUFBSDtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBbEM7T0FBcEMsQ0FBbkI7SUFOUSxDQUFWO0lBUUEsUUFBQSxFQUFVLFNBQUMsSUFBRDthQUNSLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBWixDQUFxQixJQUFBLE1BQUEsQ0FBTyxXQUFQLENBQXJCLEVBQTBDLFNBQUMsR0FBRDtRQUN4QyxJQUFJLENBQUMsTUFBTSxDQUFDLHVCQUFaLENBQW9DLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBOUM7UUFDQSxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVosQ0FBc0IsQ0FBdEI7UUFDQSxJQUFJLENBQUMsTUFBTSxDQUFDLGVBQVosQ0FBQTtRQUNBLElBQUksQ0FBQyxNQUFNLENBQUMscUJBQVosQ0FBQTtRQUNBLElBQUksQ0FBQyxNQUFNLENBQUMsaUJBQVosQ0FBQTtRQUNBLElBQUksQ0FBQyxTQUFMLEdBQWlCLE1BQU0sQ0FBQyxlQUFQLENBQUE7ZUFDakIsR0FBRyxDQUFDLElBQUosQ0FBQTtNQVB3QyxDQUExQztJQURRLENBUlY7SUFrQkEsVUFBQSxFQUFZLFNBQUMsSUFBRDtNQUNWLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFvQixJQUFJLENBQUMsa0JBQXpCO01BQ0EsSUFBSSxDQUFDLE1BQUwsR0FBYyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUE7YUFDZCxJQUFJLENBQUMsTUFBTCxHQUFjLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBWixDQUFBO0lBSEosQ0FsQlo7SUF1QkEsVUFBQSxFQUFZLFNBQUMsSUFBRDtNQUNWLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBWixDQUF1QixhQUFBLEdBQWMsSUFBSSxDQUFDLFNBQW5CLEdBQTZCLE1BQXBEO2FBQ0EsSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFaLENBQUE7SUFGVSxDQXZCWjtJQTJCQSxRQUFBLEVBQVUsU0FBQTtBQUNSLFVBQUE7TUFBQSxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBO01BQ1QsTUFBQSxHQUFTLE1BQU0sQ0FBQyxTQUFQLENBQUE7TUFDVCxVQUFBLEdBQWEsTUFBTSxDQUFDLE9BQVAsQ0FBQTtNQUNiLGtCQUFBLEdBQXFCLFVBQVUsQ0FBQyxPQUFYLENBQW1CLElBQW5CLEVBQXdCLE1BQXhCO01BQ3JCLElBQUEsR0FDRTtRQUNBLFFBQUEsTUFEQTtRQUVBLFFBQUEsTUFGQTtRQUdBLFlBQUEsVUFIQTtRQUlBLG9CQUFBLGtCQUpBO1FBS0EsU0FBQSxFQUFZLEVBTFo7O01BT0YsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFaLENBQUE7TUFDQSxJQUFDLENBQUEsVUFBRCxDQUFZLElBQVo7TUFDQSxJQUFDLENBQUEsUUFBRCxDQUFVLElBQVY7YUFDQSxJQUFDLENBQUEsVUFBRCxDQUFZLElBQVo7SUFoQlEsQ0EzQlY7O0FBSkYiLCJzb3VyY2VzQ29udGVudCI6WyJcbntDb21wb3NpdGVEaXNwb3NhYmxlfSA9IHJlcXVpcmUgJ2F0b20nXG5cbm1vZHVsZS5leHBvcnRzID1cblxuICBhY3RpdmF0ZTogKHN0YXRlKSAtPlxuXG4gICAgIyBFdmVudHMgc3Vic2NyaWJlZCB0byBpbiBhdG9tJ3Mgc3lzdGVtIGNhbiBiZSBlYXNpbHkgY2xlYW5lZCB1cCB3aXRoIGEgQ29tcG9zaXRlRGlzcG9zYWJsZVxuICAgIEBzdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGVcblxuICAgICMgUmVnaXN0ZXIgY29tbWFuZCB0aGF0IHRvZ2dsZXMgdGhpcyB2aWV3XG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29tbWFuZHMuYWRkICdhdG9tLXdvcmtzcGFjZScsICdoZWFkZXItaW1wbGVtZW50YXRpb246Z2VuZXJhdGUnOiA9PiBAZ2VuZXJhdGUoKVxuXG4gIGZpbmROYW1lOiAod29yaykgLT5cbiAgICB3b3JrLmJ1ZmZlci5zY2FuIG5ldyBSZWdFeHAoXCJuYW1lc3BhY2VcIiksIChyZXMpIC0+XG4gICAgICB3b3JrLmVkaXRvci5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbihyZXMucmFuZ2UuZW5kKVxuICAgICAgd29yay5lZGl0b3IubW92ZVJpZ2h0KDEpXG4gICAgICB3b3JrLmVkaXRvci5tb3ZlVG9FbmRPZldvcmQoKVxuICAgICAgd29yay5lZGl0b3IubW92ZVRvQmVnaW5uaW5nT2ZXb3JkKClcbiAgICAgIHdvcmsuZWRpdG9yLnNlbGVjdFRvRW5kT2ZXb3JkKClcbiAgICAgIHdvcmsuY2xhc3NuYW1lID0gZWRpdG9yLmdldFNlbGVjdGVkVGV4dCgpXG4gICAgICByZXMuc3RvcCgpXG5cbiAgY3JlYXRlRmlsZTogKHdvcmspIC0+XG4gICAgYXRvbS53b3Jrc3BhY2Uub3Blbih3b3JrLmltcGxlbWVudGF0aW9uUGF0aClcbiAgICB3b3JrLmVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgIHdvcmsuYnVmZmVyID0gd29yay5lZGl0b3IuZ2V0QnVmZmVyKClcblxuICBjcmVhdGVIZWFkOiAod29yaykgLT5cbiAgICB3b3JrLmVkaXRvci5pbnNlcnRUZXh0KFwiI2luY2x1ZGUgXFxcIiN7d29yay5jbGFzc25hbWV9LmhcXFwiXCIpXG4gICAgd29yay5lZGl0b3IuaW5zZXJ0TmV3bGluZSgpXG5cbiAgZ2VuZXJhdGU6IC0+XG4gICAgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgYnVmZmVyID0gZWRpdG9yLmdldEJ1ZmZlcigpXG4gICAgaGVhZGVyUGF0aCA9IGVkaXRvci5nZXRQYXRoKClcbiAgICBpbXBsZW1lbnRhdGlvblBhdGggPSBoZWFkZXJQYXRoLnJlcGxhY2UoXCIuaFwiLFwiLmNwcFwiKVxuICAgIHdvcmsgPVxuICAgICAge1xuICAgICAgZWRpdG9yLFxuICAgICAgYnVmZmVyLFxuICAgICAgaGVhZGVyUGF0aCxcbiAgICAgIGltcGxlbWVudGF0aW9uUGF0aCxcbiAgICAgIGNsYXNzbmFtZSA6IFwiXCJcbiAgICAgIH1cbiAgICB3b3JrLmVkaXRvci5zYXZlKClcbiAgICBAY3JlYXRlRmlsZSh3b3JrKVxuICAgIEBmaW5kTmFtZSh3b3JrKVxuICAgIEBjcmVhdGVIZWFkKHdvcmspXG4iXX0=
