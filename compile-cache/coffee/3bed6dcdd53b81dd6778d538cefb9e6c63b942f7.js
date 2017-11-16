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
        method.push(res.match[2] + res.match[3] + (res.match[4] || ""));
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYmlsbHkvZ2l0aHViL2hlYWRlci1pbXBsZW1lbnRhdGlvbi9saWIvaGVhZGVyLWltcGxlbWVudGF0aW9uLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQTtBQUFBLE1BQUE7O0VBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSOztFQUV4QixNQUFNLENBQUMsT0FBUCxHQUVFO0lBQUEsUUFBQSxFQUFVLFNBQUMsS0FBRDtNQUdSLElBQUMsQ0FBQSxhQUFELEdBQWlCLElBQUk7TUFHckIsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFBb0M7UUFBQSxnQ0FBQSxFQUFrQyxDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFBO21CQUFHLEtBQUMsQ0FBQSxRQUFELENBQUE7VUFBSDtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBbEM7T0FBcEMsQ0FBbkI7YUFDQSxJQUFDLENBQUEsY0FBRCxHQUFrQjtJQVBWLENBQVY7SUFTQSxRQUFBLEVBQVUsU0FBQyxJQUFEO01BQ1IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFaLENBQXFCLElBQUEsTUFBQSxDQUFPLFdBQVAsQ0FBckIsRUFBMEMsU0FBQyxHQUFEO1FBQ3hDLElBQUksQ0FBQyxNQUFNLENBQUMsdUJBQVosQ0FBb0MsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUE5QztRQUNBLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBWixDQUFzQixDQUF0QjtRQUNBLElBQUksQ0FBQyxNQUFNLENBQUMsZUFBWixDQUFBO1FBQ0EsSUFBSSxDQUFDLE1BQU0sQ0FBQyxxQkFBWixDQUFBO1FBQ0EsSUFBSSxDQUFDLE1BQU0sQ0FBQyxpQkFBWixDQUFBO1FBQ0EsSUFBSSxDQUFDLFNBQUwsR0FBaUIsTUFBTSxDQUFDLGVBQVAsQ0FBQTtlQUNqQixHQUFHLENBQUMsSUFBSixDQUFBO01BUHdDLENBQTFDO2FBUUEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxlQUFaLENBQUE7SUFUUSxDQVRWO0lBb0JBLFVBQUEsRUFBWSxTQUFDLElBQUQ7YUFDVixJQUFJLENBQUMsTUFBTSxDQUFDLElBQVosQ0FBaUIsSUFBQyxDQUFBLGNBQWxCLEVBQWtDLFNBQUMsR0FBRDtBQUNoQyxZQUFBO1FBQUEsTUFBQSxHQUFTO1FBQ1QsTUFBTSxDQUFDLElBQVAsQ0FBWSxHQUFHLENBQUMsS0FBTSxDQUFBLENBQUEsQ0FBRSxDQUFDLE9BQWIsQ0FBcUIsU0FBckIsRUFBZ0MsRUFBaEMsQ0FBbUMsQ0FBQyxPQUFwQyxDQUE0QyxRQUE1QyxFQUFzRCxHQUF0RCxDQUFBLElBQThELEVBQTFFO1FBQ0EsTUFBTSxDQUFDLElBQVAsQ0FBWSxHQUFHLENBQUMsS0FBTSxDQUFBLENBQUEsQ0FBVixHQUFlLEdBQUcsQ0FBQyxLQUFNLENBQUEsQ0FBQSxDQUF6QixHQUE4QixDQUFDLEdBQUcsQ0FBQyxLQUFNLENBQUEsQ0FBQSxDQUFWLElBQWMsRUFBZixDQUExQztlQUNBLE9BQU8sQ0FBQyxHQUFSLENBQVksTUFBWjtNQUpnQyxDQUFsQztJQURVLENBcEJaO0lBMkJBLFFBQUEsRUFBVSxTQUFDLElBQUQ7TUFDUixJQUFDLENBQUEsUUFBRCxDQUFVLElBQVY7YUFDQSxJQUFDLENBQUEsVUFBRCxDQUFZLElBQVo7SUFGUSxDQTNCVjtJQStCQSxVQUFBLEVBQVksU0FBQyxJQUFEO0FBQ1YsYUFBTyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBb0IsSUFBSSxDQUFDLGtCQUF6QjtJQURHLENBL0JaO0lBa0NBLGFBQUEsRUFBZSxTQUFDLElBQUQ7TUFDYixJQUFDLENBQUEsVUFBRCxDQUFZLElBQVo7YUFDQSxJQUFDLENBQUEsYUFBRCxDQUFlLElBQWY7SUFGYSxDQWxDZjtJQXNDQSxVQUFBLEVBQVksU0FBQyxJQUFEO01BQ1YsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFaLENBQXVCLGFBQUEsR0FBYyxJQUFJLENBQUMsU0FBbkIsR0FBNkIsTUFBcEQ7YUFDQSxJQUFJLENBQUMsTUFBTSxDQUFDLGFBQVosQ0FBQTtJQUZVLENBdENaO0lBMENBLGFBQUEsRUFBZSxTQUFDLE1BQUQ7YUFDYjtJQURhLENBMUNmO0lBNkNBLFFBQUEsRUFBVSxTQUFBO0FBQ1IsVUFBQTtNQUFBLE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUE7TUFDVCxNQUFBLEdBQVMsTUFBTSxDQUFDLFNBQVAsQ0FBQTtNQUNULFVBQUEsR0FBYSxNQUFNLENBQUMsT0FBUCxDQUFBO01BQ2Isa0JBQUEsR0FBcUIsVUFBVSxDQUFDLE9BQVgsQ0FBbUIsSUFBbkIsRUFBd0IsTUFBeEI7TUFDckIsSUFBQSxHQUNFO1FBQ0UsUUFBQSxNQURGO1FBRUUsUUFBQSxNQUZGO1FBR0UsWUFBQSxVQUhGO1FBSUUsb0JBQUEsa0JBSkY7UUFLRSxTQUFBLEVBQVksRUFMZDtRQU1FLE9BQUEsRUFBVSxFQU5aOztNQVFGLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBWixDQUFBO01BQ0EsSUFBQyxDQUFBLFFBQUQsQ0FBVSxJQUFWO01BQ0EsR0FBQSxHQUFNO0lBaEJFLENBN0NWOztBQUpGIiwic291cmNlc0NvbnRlbnQiOlsiXG57Q29tcG9zaXRlRGlzcG9zYWJsZX0gPSByZXF1aXJlICdhdG9tJ1xuXG5tb2R1bGUuZXhwb3J0cyA9XG5cbiAgYWN0aXZhdGU6IChzdGF0ZSkgLT5cblxuICAgICMgRXZlbnRzIHN1YnNjcmliZWQgdG8gaW4gYXRvbSdzIHN5c3RlbSBjYW4gYmUgZWFzaWx5IGNsZWFuZWQgdXAgd2l0aCBhIENvbXBvc2l0ZURpc3Bvc2FibGVcbiAgICBAc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlXG5cbiAgICAjIFJlZ2lzdGVyIGNvbW1hbmQgdGhhdCB0b2dnbGVzIHRoaXMgdmlld1xuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS13b3Jrc3BhY2UnLCAnaGVhZGVyLWltcGxlbWVudGF0aW9uOmdlbmVyYXRlJzogPT4gQGdlbmVyYXRlKClcbiAgICBATUVUSE9EX1BBVFRFUk4gPSAvXlxccyooKD86Y29uc3R8c3RhdGljfHZpcnR1YWx8dm9sYXRpbGV8ZnJpZW5kKXswLDV9XFxzKlthLXpBLVpdKyg/Ojp7Mn1bYS16QS1aX10rKT9cXHMqXFwqKiY/KT9cXHMrKFt+YS16QS1aX10rKVxccyooXFwoLipcXCkpXFxzKj8oIGNvbnN0KT8vXG5cbiAgZmluZE5hbWU6ICh3b3JrKSAtPlxuICAgIHdvcmsuYnVmZmVyLnNjYW4gbmV3IFJlZ0V4cChcIm5hbWVzcGFjZVwiKSwgKHJlcykgLT5cbiAgICAgIHdvcmsuZWRpdG9yLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uKHJlcy5yYW5nZS5lbmQpXG4gICAgICB3b3JrLmVkaXRvci5tb3ZlUmlnaHQoMSlcbiAgICAgIHdvcmsuZWRpdG9yLm1vdmVUb0VuZE9mV29yZCgpXG4gICAgICB3b3JrLmVkaXRvci5tb3ZlVG9CZWdpbm5pbmdPZldvcmQoKVxuICAgICAgd29yay5lZGl0b3Iuc2VsZWN0VG9FbmRPZldvcmQoKVxuICAgICAgd29yay5jbGFzc25hbWUgPSBlZGl0b3IuZ2V0U2VsZWN0ZWRUZXh0KClcbiAgICAgIHJlcy5zdG9wKClcbiAgICB3b3JrLmVkaXRvci5tb3ZlVG9FbmRPZkxpbmUoKVxuXG4gIG5leHRNZXRob2Q6ICh3b3JrKSAtPlxuICAgIHdvcmsuYnVmZmVyLnNjYW4gQE1FVEhPRF9QQVRURVJOLCAocmVzKSAtPlxuICAgICAgbWV0aG9kID0gW11cbiAgICAgIG1ldGhvZC5wdXNoKHJlcy5tYXRjaFsxXS5yZXBsYWNlKFwic3RhdGljIFwiLCBcIlwiKS5yZXBsYWNlKC9cXHN7Mix9LywgXCIgXCIpIHx8IFwiXCIpXG4gICAgICBtZXRob2QucHVzaChyZXMubWF0Y2hbMl0gKyByZXMubWF0Y2hbM10gKyAocmVzLm1hdGNoWzRdfHxcIlwiKSlcbiAgICAgIGNvbnNvbGUubG9nKG1ldGhvZClcblxuICByZWFkRmlsZTogKHdvcmspIC0+XG4gICAgQGZpbmROYW1lKHdvcmspXG4gICAgQG5leHRNZXRob2Qod29yaylcblxuICBjcmVhdGVGaWxlOiAod29yaykgLT5cbiAgICByZXR1cm4gYXRvbS53b3Jrc3BhY2Uub3Blbih3b3JrLmltcGxlbWVudGF0aW9uUGF0aClcblxuICB3cml0ZUluRWRpdG9yOiAod29yaykgLT5cbiAgICBAY3JlYXRlSGVhZCh3b3JrKVxuICAgIEBjcmVhdGVNZXRob2RzKHdvcmspXG5cbiAgY3JlYXRlSGVhZDogKHdvcmspIC0+XG4gICAgd29yay5lZGl0b3IuaW5zZXJ0VGV4dChcIiNpbmNsdWRlIFxcXCIje3dvcmsuY2xhc3NuYW1lfS5oXFxcIlwiKVxuICAgIHdvcmsuZWRpdG9yLmluc2VydE5ld2xpbmUoKVxuXG4gIGNyZWF0ZU1ldGhvZHM6IChlZGl0b3IpIC0+XG4gICAgd29ya1xuXG4gIGdlbmVyYXRlOiAtPlxuICAgIGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgIGJ1ZmZlciA9IGVkaXRvci5nZXRCdWZmZXIoKVxuICAgIGhlYWRlclBhdGggPSBlZGl0b3IuZ2V0UGF0aCgpXG4gICAgaW1wbGVtZW50YXRpb25QYXRoID0gaGVhZGVyUGF0aC5yZXBsYWNlKFwiLmhcIixcIi5jcHBcIilcbiAgICB3b3JrID1cbiAgICAgIHtcbiAgICAgICAgZWRpdG9yLFxuICAgICAgICBidWZmZXIsXG4gICAgICAgIGhlYWRlclBhdGgsXG4gICAgICAgIGltcGxlbWVudGF0aW9uUGF0aCxcbiAgICAgICAgY2xhc3NuYW1lIDogXCJcIlxuICAgICAgICBtZXRob2RzIDogW11cbiAgICAgIH1cbiAgICB3b3JrLmVkaXRvci5zYXZlKClcbiAgICBAcmVhZEZpbGUod29yaylcbiAgICBjdHggPSB0aGlzXG4gICAgI0BjcmVhdGVGaWxlKHdvcmspLnRoZW4gKGVkaXRvcikgLT5cbiAgICAjICB3b3JrLmVkaXRvciA9IGVkaXRvclxuICAgICMgIHdvcmsuYnVmZmVyID0gd29yay5lZGl0b3IuZ2V0QnVmZmVyKClcbiAgICAjICBjdHgud3JpdGVJbkVkaXRvcih3b3JrKVxuICAgIHJldHVyblxuIl19
