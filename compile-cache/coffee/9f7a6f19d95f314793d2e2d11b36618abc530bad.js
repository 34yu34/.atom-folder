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
      return this.createHead(editor);
    },
    createHead: function(editor) {
      editor.insertText("#include \"" + work.classname + ".h\"");
      return editor.insertNewline();
    },
    createMethods: function(work) {
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYmlsbHkvZ2l0aHViL2hlYWRlci1pbXBsZW1lbnRhdGlvbi9saWIvaGVhZGVyLWltcGxlbWVudGF0aW9uLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQTtBQUFBLE1BQUE7O0VBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSOztFQUV4QixNQUFNLENBQUMsT0FBUCxHQUVFO0lBQUEsUUFBQSxFQUFVLFNBQUMsS0FBRDtNQUdSLElBQUMsQ0FBQSxhQUFELEdBQWlCLElBQUk7YUFHckIsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFBb0M7UUFBQSxnQ0FBQSxFQUFrQyxDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFBO21CQUFHLEtBQUMsQ0FBQSxRQUFELENBQUE7VUFBSDtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBbEM7T0FBcEMsQ0FBbkI7SUFOUSxDQUFWO0lBUUEsUUFBQSxFQUFVLFNBQUMsSUFBRDtNQUNSLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBWixDQUFxQixJQUFBLE1BQUEsQ0FBTyxXQUFQLENBQXJCLEVBQTBDLFNBQUMsR0FBRDtRQUN4QyxJQUFJLENBQUMsTUFBTSxDQUFDLHVCQUFaLENBQW9DLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBOUM7UUFDQSxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVosQ0FBc0IsQ0FBdEI7UUFDQSxJQUFJLENBQUMsTUFBTSxDQUFDLGVBQVosQ0FBQTtRQUNBLElBQUksQ0FBQyxNQUFNLENBQUMscUJBQVosQ0FBQTtRQUNBLElBQUksQ0FBQyxNQUFNLENBQUMsaUJBQVosQ0FBQTtRQUNBLElBQUksQ0FBQyxTQUFMLEdBQWlCLE1BQU0sQ0FBQyxlQUFQLENBQUE7ZUFDakIsR0FBRyxDQUFDLElBQUosQ0FBQTtNQVB3QyxDQUExQzthQVFBLElBQUksQ0FBQyxNQUFNLENBQUMsZUFBWixDQUFBO0lBVFEsQ0FSVjtJQW9CQSxVQUFBLEVBQVksU0FBQyxJQUFEO0FBQ1YsVUFBQTtNQUFBLEdBQUEsR0FBTTthQUNOLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFvQixJQUFJLENBQUMsa0JBQXpCLENBQTRDLENBQUMsSUFBN0MsQ0FBa0QsU0FBQyxDQUFEO2VBQU8sR0FBRyxDQUFDLGFBQUosQ0FBa0IsQ0FBbEI7TUFBUCxDQUFsRDtJQUZVLENBcEJaO0lBd0JBLGFBQUEsRUFBZSxTQUFDLE1BQUQ7YUFDYixJQUFDLENBQUEsVUFBRCxDQUFZLE1BQVo7SUFEYSxDQXhCZjtJQTJCQSxVQUFBLEVBQVksU0FBQyxNQUFEO01BQ1YsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsYUFBQSxHQUFjLElBQUksQ0FBQyxTQUFuQixHQUE2QixNQUEvQzthQUNBLE1BQU0sQ0FBQyxhQUFQLENBQUE7SUFGVSxDQTNCWjtJQStCQSxhQUFBLEVBQWUsU0FBQyxJQUFEO2FBQ2I7SUFEYSxDQS9CZjtJQWtDQSxRQUFBLEVBQVUsU0FBQTtBQUNSLFVBQUE7TUFBQSxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBO01BQ1QsTUFBQSxHQUFTLE1BQU0sQ0FBQyxTQUFQLENBQUE7TUFDVCxVQUFBLEdBQWEsTUFBTSxDQUFDLE9BQVAsQ0FBQTtNQUNiLGtCQUFBLEdBQXFCLFVBQVUsQ0FBQyxPQUFYLENBQW1CLElBQW5CLEVBQXdCLE1BQXhCO01BQ3JCLElBQUEsR0FDRTtRQUNBLFFBQUEsTUFEQTtRQUVBLFFBQUEsTUFGQTtRQUdBLFlBQUEsVUFIQTtRQUlBLG9CQUFBLGtCQUpBO1FBS0EsU0FBQSxFQUFZLEVBTFo7O01BT0YsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFaLENBQUE7TUFDQSxJQUFDLENBQUEsUUFBRCxDQUFVLElBQVY7YUFDQSxJQUFDLENBQUEsVUFBRCxDQUFZLElBQVo7SUFmUSxDQWxDVjs7QUFKRiIsInNvdXJjZXNDb250ZW50IjpbIlxue0NvbXBvc2l0ZURpc3Bvc2FibGV9ID0gcmVxdWlyZSAnYXRvbSdcblxubW9kdWxlLmV4cG9ydHMgPVxuXG4gIGFjdGl2YXRlOiAoc3RhdGUpIC0+XG5cbiAgICAjIEV2ZW50cyBzdWJzY3JpYmVkIHRvIGluIGF0b20ncyBzeXN0ZW0gY2FuIGJlIGVhc2lseSBjbGVhbmVkIHVwIHdpdGggYSBDb21wb3NpdGVEaXNwb3NhYmxlXG4gICAgQHN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZVxuXG4gICAgIyBSZWdpc3RlciBjb21tYW5kIHRoYXQgdG9nZ2xlcyB0aGlzIHZpZXdcbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20td29ya3NwYWNlJywgJ2hlYWRlci1pbXBsZW1lbnRhdGlvbjpnZW5lcmF0ZSc6ID0+IEBnZW5lcmF0ZSgpXG5cbiAgZmluZE5hbWU6ICh3b3JrKSAtPlxuICAgIHdvcmsuYnVmZmVyLnNjYW4gbmV3IFJlZ0V4cChcIm5hbWVzcGFjZVwiKSwgKHJlcykgLT5cbiAgICAgIHdvcmsuZWRpdG9yLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uKHJlcy5yYW5nZS5lbmQpXG4gICAgICB3b3JrLmVkaXRvci5tb3ZlUmlnaHQoMSlcbiAgICAgIHdvcmsuZWRpdG9yLm1vdmVUb0VuZE9mV29yZCgpXG4gICAgICB3b3JrLmVkaXRvci5tb3ZlVG9CZWdpbm5pbmdPZldvcmQoKVxuICAgICAgd29yay5lZGl0b3Iuc2VsZWN0VG9FbmRPZldvcmQoKVxuICAgICAgd29yay5jbGFzc25hbWUgPSBlZGl0b3IuZ2V0U2VsZWN0ZWRUZXh0KClcbiAgICAgIHJlcy5zdG9wKClcbiAgICB3b3JrLmVkaXRvci5tb3ZlVG9FbmRPZkxpbmUoKVxuXG5cbiAgY3JlYXRlRmlsZTogKHdvcmspIC0+XG4gICAgY3R4ID0gdGhpc1xuICAgIGF0b20ud29ya3NwYWNlLm9wZW4od29yay5pbXBsZW1lbnRhdGlvblBhdGgpLnRoZW4oKHgpIC0+IGN0eC53cml0ZUluRWRpdG9yKHgpKVxuXG4gIHdyaXRlSW5FZGl0b3I6IChlZGl0b3IpIC0+XG4gICAgQGNyZWF0ZUhlYWQoZWRpdG9yKVxuXG4gIGNyZWF0ZUhlYWQ6IChlZGl0b3IpIC0+XG4gICAgZWRpdG9yLmluc2VydFRleHQoXCIjaW5jbHVkZSBcXFwiI3t3b3JrLmNsYXNzbmFtZX0uaFxcXCJcIilcbiAgICBlZGl0b3IuaW5zZXJ0TmV3bGluZSgpXG5cbiAgY3JlYXRlTWV0aG9kczogKHdvcmspIC0+XG4gICAgd29ya1xuXG4gIGdlbmVyYXRlOiAtPlxuICAgIGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgIGJ1ZmZlciA9IGVkaXRvci5nZXRCdWZmZXIoKVxuICAgIGhlYWRlclBhdGggPSBlZGl0b3IuZ2V0UGF0aCgpXG4gICAgaW1wbGVtZW50YXRpb25QYXRoID0gaGVhZGVyUGF0aC5yZXBsYWNlKFwiLmhcIixcIi5jcHBcIilcbiAgICB3b3JrID1cbiAgICAgIHtcbiAgICAgIGVkaXRvcixcbiAgICAgIGJ1ZmZlcixcbiAgICAgIGhlYWRlclBhdGgsXG4gICAgICBpbXBsZW1lbnRhdGlvblBhdGgsXG4gICAgICBjbGFzc25hbWUgOiBcIlwiXG4gICAgICB9XG4gICAgd29yay5lZGl0b3Iuc2F2ZSgpXG4gICAgQGZpbmROYW1lKHdvcmspXG4gICAgQGNyZWF0ZUZpbGUod29yaylcbiJdfQ==
