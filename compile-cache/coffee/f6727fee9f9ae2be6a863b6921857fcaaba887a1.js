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
    generate: function() {
      var work;
      work = {
        editor: atom.workspace.getActiveTextEditor(),
        buffer: work.editor.getBuffer(),
        headerPath: work.editor.getPath(),
        headerName: work.editor.getTitle(),
        implementationName: work.headerName.replace(".h", ".cpp"),
        implementationPath: work.headerPath.replace(".h", ".cpp"),
        classname: ""
      };
      work.editor.save();
      CreateFile(work);
      return findName(work);
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
    CreateFile: function(work) {
      atom.workspace.open(work.implementationPath);
      work.editor = atom.workspace.getActiveTextEditor();
      return work.buffer = work.editor.getBuffer();
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYmlsbHkvZ2l0aHViL2hlYWRlci1pbXBsZW1lbnRhdGlvbi9saWIvaGVhZGVyLWltcGxlbWVudGF0aW9uLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQTtBQUFBLE1BQUE7O0VBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSOztFQUV4QixNQUFNLENBQUMsT0FBUCxHQUVFO0lBQUEsUUFBQSxFQUFVLFNBQUMsS0FBRDtNQUdSLElBQUMsQ0FBQSxhQUFELEdBQWlCLElBQUk7YUFHckIsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFBb0M7UUFBQSxnQ0FBQSxFQUFrQyxDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFBO21CQUFHLEtBQUMsQ0FBQSxRQUFELENBQUE7VUFBSDtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBbEM7T0FBcEMsQ0FBbkI7SUFOUSxDQUFWO0lBUUEsUUFBQSxFQUFVLFNBQUE7QUFDUixVQUFBO01BQUEsSUFBQSxHQUNBO1FBQ0UsTUFBQSxFQUFRLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQSxDQURWO1FBRUUsTUFBQSxFQUFRLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBWixDQUFBLENBRlY7UUFHRSxVQUFBLEVBQWEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFaLENBQUEsQ0FIZjtRQUlFLFVBQUEsRUFBYSxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVosQ0FBQSxDQUpmO1FBS0Usa0JBQUEsRUFBcUIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFoQixDQUF3QixJQUF4QixFQUE2QixNQUE3QixDQUx2QjtRQU1FLGtCQUFBLEVBQXFCLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBaEIsQ0FBd0IsSUFBeEIsRUFBNkIsTUFBN0IsQ0FOdkI7UUFPRSxTQUFBLEVBQVksRUFQZDs7TUFTQSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQVosQ0FBQTtNQUNBLFVBQUEsQ0FBVyxJQUFYO2FBQ0EsUUFBQSxDQUFTLElBQVQ7SUFiUSxDQVJWO0lBd0JBLFFBQUEsRUFBVSxTQUFDLElBQUQ7YUFDUixJQUFJLENBQUMsTUFBTSxDQUFDLElBQVosQ0FBcUIsSUFBQSxNQUFBLENBQU8sV0FBUCxDQUFyQixFQUEwQyxTQUFDLEdBQUQ7UUFDeEMsSUFBSSxDQUFDLE1BQU0sQ0FBQyx1QkFBWixDQUFvQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQTlDO1FBQ0EsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFaLENBQXNCLENBQXRCO1FBQ0EsSUFBSSxDQUFDLE1BQU0sQ0FBQyxlQUFaLENBQUE7UUFDQSxJQUFJLENBQUMsTUFBTSxDQUFDLHFCQUFaLENBQUE7UUFDQSxJQUFJLENBQUMsTUFBTSxDQUFDLGlCQUFaLENBQUE7UUFDQSxJQUFJLENBQUMsU0FBTCxHQUFpQixNQUFNLENBQUMsZUFBUCxDQUFBO2VBQ2pCLEdBQUcsQ0FBQyxJQUFKLENBQUE7TUFQd0MsQ0FBMUM7SUFEUSxDQXhCVjtJQWtDQSxVQUFBLEVBQVksU0FBQyxJQUFEO01BQ1YsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQW9CLElBQUksQ0FBQyxrQkFBekI7TUFDQSxJQUFJLENBQUMsTUFBTCxHQUFjLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQTthQUNkLElBQUksQ0FBQyxNQUFMLEdBQWMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFaLENBQUE7SUFISixDQWxDWjs7QUFKRiIsInNvdXJjZXNDb250ZW50IjpbIlxue0NvbXBvc2l0ZURpc3Bvc2FibGV9ID0gcmVxdWlyZSAnYXRvbSdcblxubW9kdWxlLmV4cG9ydHMgPVxuXG4gIGFjdGl2YXRlOiAoc3RhdGUpIC0+XG5cbiAgICAjIEV2ZW50cyBzdWJzY3JpYmVkIHRvIGluIGF0b20ncyBzeXN0ZW0gY2FuIGJlIGVhc2lseSBjbGVhbmVkIHVwIHdpdGggYSBDb21wb3NpdGVEaXNwb3NhYmxlXG4gICAgQHN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZVxuXG4gICAgIyBSZWdpc3RlciBjb21tYW5kIHRoYXQgdG9nZ2xlcyB0aGlzIHZpZXdcbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20td29ya3NwYWNlJywgJ2hlYWRlci1pbXBsZW1lbnRhdGlvbjpnZW5lcmF0ZSc6ID0+IEBnZW5lcmF0ZSgpXG5cbiAgZ2VuZXJhdGU6IC0+XG4gICAgd29yayA9XG4gICAge1xuICAgICAgZWRpdG9yOiBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICAgIGJ1ZmZlcjogd29yay5lZGl0b3IuZ2V0QnVmZmVyKClcbiAgICAgIGhlYWRlclBhdGggOiB3b3JrLmVkaXRvci5nZXRQYXRoKClcbiAgICAgIGhlYWRlck5hbWUgOiB3b3JrLmVkaXRvci5nZXRUaXRsZSgpXG4gICAgICBpbXBsZW1lbnRhdGlvbk5hbWUgOiB3b3JrLmhlYWRlck5hbWUucmVwbGFjZShcIi5oXCIsXCIuY3BwXCIpXG4gICAgICBpbXBsZW1lbnRhdGlvblBhdGggOiB3b3JrLmhlYWRlclBhdGgucmVwbGFjZShcIi5oXCIsXCIuY3BwXCIpXG4gICAgICBjbGFzc25hbWUgOiBcIlwiXG4gICAgfVxuICAgIHdvcmsuZWRpdG9yLnNhdmUoKVxuICAgIENyZWF0ZUZpbGUod29yaylcbiAgICBmaW5kTmFtZSh3b3JrKVxuXG5cbiAgZmluZE5hbWU6ICh3b3JrKSAtPlxuICAgIHdvcmsuYnVmZmVyLnNjYW4gbmV3IFJlZ0V4cChcIm5hbWVzcGFjZVwiKSwgKHJlcykgLT5cbiAgICAgIHdvcmsuZWRpdG9yLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uKHJlcy5yYW5nZS5lbmQpXG4gICAgICB3b3JrLmVkaXRvci5tb3ZlUmlnaHQoMSlcbiAgICAgIHdvcmsuZWRpdG9yLm1vdmVUb0VuZE9mV29yZCgpXG4gICAgICB3b3JrLmVkaXRvci5tb3ZlVG9CZWdpbm5pbmdPZldvcmQoKVxuICAgICAgd29yay5lZGl0b3Iuc2VsZWN0VG9FbmRPZldvcmQoKVxuICAgICAgd29yay5jbGFzc25hbWUgPSBlZGl0b3IuZ2V0U2VsZWN0ZWRUZXh0KClcbiAgICAgIHJlcy5zdG9wKClcblxuICBDcmVhdGVGaWxlOiAod29yaykgLT5cbiAgICBhdG9tLndvcmtzcGFjZS5vcGVuKHdvcmsuaW1wbGVtZW50YXRpb25QYXRoKVxuICAgIHdvcmsuZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgd29yay5idWZmZXIgPSB3b3JrLmVkaXRvci5nZXRCdWZmZXIoKVxuIl19
