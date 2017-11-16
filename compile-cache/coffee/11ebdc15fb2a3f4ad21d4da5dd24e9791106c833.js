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
        buffer: editor.getBuffer(),
        headerPath: editor.getPath(),
        headerName: editor.getTitle(),
        implementationName: headerName.replace(".h", ".cpp"),
        implementationPath: headerPath.replace(".h", ".cpp"),
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYmlsbHkvZ2l0aHViL2hlYWRlci1pbXBsZW1lbnRhdGlvbi9saWIvaGVhZGVyLWltcGxlbWVudGF0aW9uLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQTtBQUFBLE1BQUE7O0VBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSOztFQUV4QixNQUFNLENBQUMsT0FBUCxHQUVFO0lBQUEsUUFBQSxFQUFVLFNBQUMsS0FBRDtNQUdSLElBQUMsQ0FBQSxhQUFELEdBQWlCLElBQUk7YUFHckIsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFBb0M7UUFBQSxnQ0FBQSxFQUFrQyxDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFBO21CQUFHLEtBQUMsQ0FBQSxRQUFELENBQUE7VUFBSDtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBbEM7T0FBcEMsQ0FBbkI7SUFOUSxDQUFWO0lBUUEsUUFBQSxFQUFVLFNBQUE7QUFDUixVQUFBO01BQUEsSUFBQSxHQUNBO1FBQ0UsTUFBQSxFQUFRLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQSxDQURWO1FBRUUsTUFBQSxFQUFRLE1BQU0sQ0FBQyxTQUFQLENBQUEsQ0FGVjtRQUdFLFVBQUEsRUFBYSxNQUFNLENBQUMsT0FBUCxDQUFBLENBSGY7UUFJRSxVQUFBLEVBQWEsTUFBTSxDQUFDLFFBQVAsQ0FBQSxDQUpmO1FBS0Usa0JBQUEsRUFBcUIsVUFBVSxDQUFDLE9BQVgsQ0FBbUIsSUFBbkIsRUFBd0IsTUFBeEIsQ0FMdkI7UUFNRSxrQkFBQSxFQUFxQixVQUFVLENBQUMsT0FBWCxDQUFtQixJQUFuQixFQUF3QixNQUF4QixDQU52QjtRQU9FLFNBQUEsRUFBWSxFQVBkOztNQVNBLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBWixDQUFBO01BQ0EsVUFBQSxDQUFXLElBQVg7YUFDQSxRQUFBLENBQVMsSUFBVDtJQWJRLENBUlY7SUF3QkEsUUFBQSxFQUFVLFNBQUMsSUFBRDthQUNSLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBWixDQUFxQixJQUFBLE1BQUEsQ0FBTyxXQUFQLENBQXJCLEVBQTBDLFNBQUMsR0FBRDtRQUN4QyxJQUFJLENBQUMsTUFBTSxDQUFDLHVCQUFaLENBQW9DLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBOUM7UUFDQSxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVosQ0FBc0IsQ0FBdEI7UUFDQSxJQUFJLENBQUMsTUFBTSxDQUFDLGVBQVosQ0FBQTtRQUNBLElBQUksQ0FBQyxNQUFNLENBQUMscUJBQVosQ0FBQTtRQUNBLElBQUksQ0FBQyxNQUFNLENBQUMsaUJBQVosQ0FBQTtRQUNBLElBQUksQ0FBQyxTQUFMLEdBQWlCLE1BQU0sQ0FBQyxlQUFQLENBQUE7ZUFDakIsR0FBRyxDQUFDLElBQUosQ0FBQTtNQVB3QyxDQUExQztJQURRLENBeEJWO0lBa0NBLFVBQUEsRUFBWSxTQUFDLElBQUQ7TUFDVixJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBb0IsSUFBSSxDQUFDLGtCQUF6QjtNQUNBLElBQUksQ0FBQyxNQUFMLEdBQWMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBO2FBQ2QsSUFBSSxDQUFDLE1BQUwsR0FBYyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVosQ0FBQTtJQUhKLENBbENaOztBQUpGIiwic291cmNlc0NvbnRlbnQiOlsiXG57Q29tcG9zaXRlRGlzcG9zYWJsZX0gPSByZXF1aXJlICdhdG9tJ1xuXG5tb2R1bGUuZXhwb3J0cyA9XG5cbiAgYWN0aXZhdGU6IChzdGF0ZSkgLT5cblxuICAgICMgRXZlbnRzIHN1YnNjcmliZWQgdG8gaW4gYXRvbSdzIHN5c3RlbSBjYW4gYmUgZWFzaWx5IGNsZWFuZWQgdXAgd2l0aCBhIENvbXBvc2l0ZURpc3Bvc2FibGVcbiAgICBAc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlXG5cbiAgICAjIFJlZ2lzdGVyIGNvbW1hbmQgdGhhdCB0b2dnbGVzIHRoaXMgdmlld1xuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS13b3Jrc3BhY2UnLCAnaGVhZGVyLWltcGxlbWVudGF0aW9uOmdlbmVyYXRlJzogPT4gQGdlbmVyYXRlKClcblxuICBnZW5lcmF0ZTogLT5cbiAgICB3b3JrID1cbiAgICB7XG4gICAgICBlZGl0b3I6IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgICAgYnVmZmVyOiBlZGl0b3IuZ2V0QnVmZmVyKClcbiAgICAgIGhlYWRlclBhdGggOiBlZGl0b3IuZ2V0UGF0aCgpXG4gICAgICBoZWFkZXJOYW1lIDogZWRpdG9yLmdldFRpdGxlKClcbiAgICAgIGltcGxlbWVudGF0aW9uTmFtZSA6IGhlYWRlck5hbWUucmVwbGFjZShcIi5oXCIsXCIuY3BwXCIpXG4gICAgICBpbXBsZW1lbnRhdGlvblBhdGggOiBoZWFkZXJQYXRoLnJlcGxhY2UoXCIuaFwiLFwiLmNwcFwiKVxuICAgICAgY2xhc3NuYW1lIDogXCJcIlxuICAgIH1cbiAgICB3b3JrLmVkaXRvci5zYXZlKClcbiAgICBDcmVhdGVGaWxlKHdvcmspXG4gICAgZmluZE5hbWUod29yaylcblxuXG4gIGZpbmROYW1lOiAod29yaykgLT5cbiAgICB3b3JrLmJ1ZmZlci5zY2FuIG5ldyBSZWdFeHAoXCJuYW1lc3BhY2VcIiksIChyZXMpIC0+XG4gICAgICB3b3JrLmVkaXRvci5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbihyZXMucmFuZ2UuZW5kKVxuICAgICAgd29yay5lZGl0b3IubW92ZVJpZ2h0KDEpXG4gICAgICB3b3JrLmVkaXRvci5tb3ZlVG9FbmRPZldvcmQoKVxuICAgICAgd29yay5lZGl0b3IubW92ZVRvQmVnaW5uaW5nT2ZXb3JkKClcbiAgICAgIHdvcmsuZWRpdG9yLnNlbGVjdFRvRW5kT2ZXb3JkKClcbiAgICAgIHdvcmsuY2xhc3NuYW1lID0gZWRpdG9yLmdldFNlbGVjdGVkVGV4dCgpXG4gICAgICByZXMuc3RvcCgpXG5cbiAgQ3JlYXRlRmlsZTogKHdvcmspIC0+XG4gICAgYXRvbS53b3Jrc3BhY2Uub3Blbih3b3JrLmltcGxlbWVudGF0aW9uUGF0aClcbiAgICB3b3JrLmVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgIHdvcmsuYnVmZmVyID0gd29yay5lZGl0b3IuZ2V0QnVmZmVyKClcbiJdfQ==
