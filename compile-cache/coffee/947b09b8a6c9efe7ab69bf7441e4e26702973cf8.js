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
      atom.workspace.open(work.implementationPath);
      work.editor = atom.workspace.paneForURI(work.implementationPath);
      work.editor.activate();
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
      this.findName(work);
      this.createFile(work);
      return this.createHead(work);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYmlsbHkvZ2l0aHViL2hlYWRlci1pbXBsZW1lbnRhdGlvbi9saWIvaGVhZGVyLWltcGxlbWVudGF0aW9uLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQTtBQUFBLE1BQUE7O0VBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSOztFQUV4QixNQUFNLENBQUMsT0FBUCxHQUVFO0lBQUEsUUFBQSxFQUFVLFNBQUMsS0FBRDtNQUdSLElBQUMsQ0FBQSxhQUFELEdBQWlCLElBQUk7YUFHckIsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFBb0M7UUFBQSxnQ0FBQSxFQUFrQyxDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFBO21CQUFHLEtBQUMsQ0FBQSxRQUFELENBQUE7VUFBSDtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBbEM7T0FBcEMsQ0FBbkI7SUFOUSxDQUFWO0lBUUEsUUFBQSxFQUFVLFNBQUMsSUFBRDtNQUNSLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBWixDQUFxQixJQUFBLE1BQUEsQ0FBTyxXQUFQLENBQXJCLEVBQTBDLFNBQUMsR0FBRDtRQUN4QyxJQUFJLENBQUMsTUFBTSxDQUFDLHVCQUFaLENBQW9DLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBOUM7UUFDQSxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVosQ0FBc0IsQ0FBdEI7UUFDQSxJQUFJLENBQUMsTUFBTSxDQUFDLGVBQVosQ0FBQTtRQUNBLElBQUksQ0FBQyxNQUFNLENBQUMscUJBQVosQ0FBQTtRQUNBLElBQUksQ0FBQyxNQUFNLENBQUMsaUJBQVosQ0FBQTtRQUNBLElBQUksQ0FBQyxTQUFMLEdBQWlCLE1BQU0sQ0FBQyxlQUFQLENBQUE7ZUFDakIsR0FBRyxDQUFDLElBQUosQ0FBQTtNQVB3QyxDQUExQzthQVFBLElBQUksQ0FBQyxNQUFNLENBQUMsZUFBWixDQUFBO0lBVFEsQ0FSVjtJQW9CQSxVQUFBLEVBQVksU0FBQyxJQUFEO01BQ1YsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQW9CLElBQUksQ0FBQyxrQkFBekI7TUFDQSxJQUFJLENBQUMsTUFBTCxHQUFjLElBQUksQ0FBQyxTQUFTLENBQUMsVUFBZixDQUEwQixJQUFJLENBQUMsa0JBQS9CO01BQ2QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFaLENBQUE7TUFDQSxJQUFJLENBQUMsTUFBTCxHQUFjLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQTthQUNkLElBQUksQ0FBQyxNQUFMLEdBQWMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFaLENBQUE7SUFMSixDQXBCWjtJQTJCQSxVQUFBLEVBQVksU0FBQyxJQUFEO01BQ1YsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFaLENBQXVCLGFBQUEsR0FBYyxJQUFJLENBQUMsU0FBbkIsR0FBNkIsTUFBcEQ7YUFDQSxJQUFJLENBQUMsTUFBTSxDQUFDLGFBQVosQ0FBQTtJQUZVLENBM0JaO0lBK0JBLFFBQUEsRUFBVSxTQUFBO0FBQ1IsVUFBQTtNQUFBLE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUE7TUFDVCxNQUFBLEdBQVMsTUFBTSxDQUFDLFNBQVAsQ0FBQTtNQUNULFVBQUEsR0FBYSxNQUFNLENBQUMsT0FBUCxDQUFBO01BQ2Isa0JBQUEsR0FBcUIsVUFBVSxDQUFDLE9BQVgsQ0FBbUIsSUFBbkIsRUFBd0IsTUFBeEI7TUFDckIsSUFBQSxHQUNFO1FBQ0EsUUFBQSxNQURBO1FBRUEsUUFBQSxNQUZBO1FBR0EsWUFBQSxVQUhBO1FBSUEsb0JBQUEsa0JBSkE7UUFLQSxTQUFBLEVBQVksRUFMWjs7TUFPRixJQUFJLENBQUMsTUFBTSxDQUFDLElBQVosQ0FBQTtNQUNBLElBQUMsQ0FBQSxRQUFELENBQVUsSUFBVjtNQUNBLElBQUMsQ0FBQSxVQUFELENBQVksSUFBWjthQUNBLElBQUMsQ0FBQSxVQUFELENBQVksSUFBWjtJQWhCUSxDQS9CVjs7QUFKRiIsInNvdXJjZXNDb250ZW50IjpbIlxue0NvbXBvc2l0ZURpc3Bvc2FibGV9ID0gcmVxdWlyZSAnYXRvbSdcblxubW9kdWxlLmV4cG9ydHMgPVxuXG4gIGFjdGl2YXRlOiAoc3RhdGUpIC0+XG5cbiAgICAjIEV2ZW50cyBzdWJzY3JpYmVkIHRvIGluIGF0b20ncyBzeXN0ZW0gY2FuIGJlIGVhc2lseSBjbGVhbmVkIHVwIHdpdGggYSBDb21wb3NpdGVEaXNwb3NhYmxlXG4gICAgQHN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZVxuXG4gICAgIyBSZWdpc3RlciBjb21tYW5kIHRoYXQgdG9nZ2xlcyB0aGlzIHZpZXdcbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20td29ya3NwYWNlJywgJ2hlYWRlci1pbXBsZW1lbnRhdGlvbjpnZW5lcmF0ZSc6ID0+IEBnZW5lcmF0ZSgpXG5cbiAgZmluZE5hbWU6ICh3b3JrKSAtPlxuICAgIHdvcmsuYnVmZmVyLnNjYW4gbmV3IFJlZ0V4cChcIm5hbWVzcGFjZVwiKSwgKHJlcykgLT5cbiAgICAgIHdvcmsuZWRpdG9yLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uKHJlcy5yYW5nZS5lbmQpXG4gICAgICB3b3JrLmVkaXRvci5tb3ZlUmlnaHQoMSlcbiAgICAgIHdvcmsuZWRpdG9yLm1vdmVUb0VuZE9mV29yZCgpXG4gICAgICB3b3JrLmVkaXRvci5tb3ZlVG9CZWdpbm5pbmdPZldvcmQoKVxuICAgICAgd29yay5lZGl0b3Iuc2VsZWN0VG9FbmRPZldvcmQoKVxuICAgICAgd29yay5jbGFzc25hbWUgPSBlZGl0b3IuZ2V0U2VsZWN0ZWRUZXh0KClcbiAgICAgIHJlcy5zdG9wKClcbiAgICB3b3JrLmVkaXRvci5tb3ZlVG9FbmRPZkxpbmUoKVxuXG5cbiAgY3JlYXRlRmlsZTogKHdvcmspIC0+XG4gICAgYXRvbS53b3Jrc3BhY2Uub3Blbih3b3JrLmltcGxlbWVudGF0aW9uUGF0aClcbiAgICB3b3JrLmVkaXRvciA9IGF0b20ud29ya3NwYWNlLnBhbmVGb3JVUkkod29yay5pbXBsZW1lbnRhdGlvblBhdGgpXG4gICAgd29yay5lZGl0b3IuYWN0aXZhdGUoKVxuICAgIHdvcmsuZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgd29yay5idWZmZXIgPSB3b3JrLmVkaXRvci5nZXRCdWZmZXIoKVxuXG4gIGNyZWF0ZUhlYWQ6ICh3b3JrKSAtPlxuICAgIHdvcmsuZWRpdG9yLmluc2VydFRleHQoXCIjaW5jbHVkZSBcXFwiI3t3b3JrLmNsYXNzbmFtZX0uaFxcXCJcIilcbiAgICB3b3JrLmVkaXRvci5pbnNlcnROZXdsaW5lKClcblxuICBnZW5lcmF0ZTogLT5cbiAgICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICBidWZmZXIgPSBlZGl0b3IuZ2V0QnVmZmVyKClcbiAgICBoZWFkZXJQYXRoID0gZWRpdG9yLmdldFBhdGgoKVxuICAgIGltcGxlbWVudGF0aW9uUGF0aCA9IGhlYWRlclBhdGgucmVwbGFjZShcIi5oXCIsXCIuY3BwXCIpXG4gICAgd29yayA9XG4gICAgICB7XG4gICAgICBlZGl0b3IsXG4gICAgICBidWZmZXIsXG4gICAgICBoZWFkZXJQYXRoLFxuICAgICAgaW1wbGVtZW50YXRpb25QYXRoLFxuICAgICAgY2xhc3NuYW1lIDogXCJcIlxuICAgICAgfVxuICAgIHdvcmsuZWRpdG9yLnNhdmUoKVxuICAgIEBmaW5kTmFtZSh3b3JrKVxuICAgIEBjcmVhdGVGaWxlKHdvcmspXG4gICAgQGNyZWF0ZUhlYWQod29yaylcbiJdfQ==
