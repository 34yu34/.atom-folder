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
      return this.METHOD_PATTERN = /^\s*((?:const|static|virtual|volatile|friend){0,5}\s*[\w_]+(?::{2}[\w_]+){0,}\s*\**&?)?\s+([\w~_]+)\s*(\(.*\))\s*?( const)?/gm;
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
    findMethod: function(work) {
      return work.buffer.scan(this.METHOD_PATTERN, function(res) {
        var method;
        method = [];
        method.push(res.match[1].replace("static ", "").replace(/\s{2,}/, " ") || "");
        method.push(res.match[2] + res.match[3] + (res.match[4] || ""));
        return work.methods.push(method);
      });
    },
    readFile: function(work) {
      this.findName(work);
      return this.findMethod(work);
    },
    createFile: function(work) {
      return atom.workspace.open(work.implementationPath);
    },
    createHead: function(work) {
      work.editor.insertText("#include \"" + work.classname + ".h\"");
      work.editor.insertNewline();
      work.editor.insertNewline();
      return work.editor.insertNewline();
    },
    createMethods: function(work) {
      return work.methods.forEach(function(method) {
        console.log(method);
        work.editor.insertText("/*" + "*".repeat(68));
        work.editor.insertNewline();
        work.editor.insertText("* Comment");
        work.editor.insertNewline();
        work.editor.insertText("*".repeat(68) + "*/");
        work.editor.insertNewline();
        if (method[0]) {
          work.editor.insertText(method[0] + " ");
        }
        work.editor.insertText(work.classname + "::" + method[1]);
        work.editor.insertNewline();
        work.editor.insertText("{");
        work.editor.insertNewline();
        work.editor.insertNewline();
        work.editor.insertText("}");
        return work.editor.insertNewline();
      });
    },
    writeInEditor: function(work) {
      this.createHead(work);
      return this.createMethods(work);
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
      this.createFile(work).then(function(editor) {
        work.editor = editor;
        work.buffer = work.editor.getBuffer();
        return ctx.writeInEditor(work);
      });
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYmlsbHkvZ2l0aHViL2hlYWRlci1pbXBsZW1lbnRhdGlvbi9saWIvaGVhZGVyLWltcGxlbWVudGF0aW9uLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQTtBQUFBLE1BQUE7O0VBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSOztFQUV4QixNQUFNLENBQUMsT0FBUCxHQUVFO0lBQUEsUUFBQSxFQUFVLFNBQUMsS0FBRDtNQUdSLElBQUMsQ0FBQSxhQUFELEdBQWlCLElBQUk7TUFHckIsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFBb0M7UUFBQSxnQ0FBQSxFQUFrQyxDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFBO21CQUFHLEtBQUMsQ0FBQSxRQUFELENBQUE7VUFBSDtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBbEM7T0FBcEMsQ0FBbkI7YUFDQSxJQUFDLENBQUEsY0FBRCxHQUFrQjtJQVBWLENBQVY7SUFTQSxRQUFBLEVBQVUsU0FBQyxJQUFEO01BQ1IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFaLENBQXFCLElBQUEsTUFBQSxDQUFPLFdBQVAsQ0FBckIsRUFBMEMsU0FBQyxHQUFEO1FBQ3hDLElBQUksQ0FBQyxNQUFNLENBQUMsdUJBQVosQ0FBb0MsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUE5QztRQUNBLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBWixDQUFzQixDQUF0QjtRQUNBLElBQUksQ0FBQyxNQUFNLENBQUMsZUFBWixDQUFBO1FBQ0EsSUFBSSxDQUFDLE1BQU0sQ0FBQyxxQkFBWixDQUFBO1FBQ0EsSUFBSSxDQUFDLE1BQU0sQ0FBQyxpQkFBWixDQUFBO1FBQ0EsSUFBSSxDQUFDLFNBQUwsR0FBaUIsTUFBTSxDQUFDLGVBQVAsQ0FBQTtlQUNqQixHQUFHLENBQUMsSUFBSixDQUFBO01B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RUFBZSxTQUFDLElBQUQ7TUFDYixJQUFDLENBQUEsVUFBRCxDQUFZLElBQVo7YUFDQSxJQUFDLENBQUEsYUFBRCxDQUFlLElBQWY7SUFGYSxDQTVEZjtJQWlFQSxRQUFBLEVBQVUsU0FBQTtBQUNSLFVBQUE7TUFBQSxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBO01BQ1QsTUFBQSxHQUFTLE1BQU0sQ0FBQyxTQUFQLENBQUE7TUFDVCxVQUFBLEdBQWEsTUFBTSxDQUFDLE9BQVAsQ0FBQTtNQUNiLGtCQUFBLEdBQXFCLFVBQVUsQ0FBQyxPQUFYLENBQW1CLElBQW5CLEVBQXdCLE1BQXhCO01BQ3JCLElBQUEsR0FDRTtRQUNFLFFBQUEsTUFERjtRQUVFLFFBQUEsTUFGRjtRQUdFLFlBQUEsVUFIRjtRQUlFLG9CQUFBLGtCQUpGO1FBS0UsU0FBQSxFQUFZLEVBTGQ7UUFNRSxPQUFBLEVBQVUsRUFOWjs7TUFRRixJQUFJLENBQUMsTUFBTSxDQUFDLElBQVosQ0FBQTtNQUNBLElBQUMsQ0FBQSxRQUFELENBQVUsSUFBVjtNQUNBLEdBQUEsR0FBTTtNQUNOLElBQUMsQ0FBQSxVQUFELENBQVksSUFBWixDQUFpQixDQUFDLElBQWxCLENBQXVCLFNBQUMsTUFBRDtRQUNyQixJQUFJLENBQUMsTUFBTCxHQUFjO1FBQ2QsSUFBSSxDQUFDLE1BQUwsR0FBYyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVosQ0FBQTtlQUNkLEdBQUcsQ0FBQyxhQUFKLENBQWtCLElBQWxCO01BSHFCLENBQXZCO0lBakJRLENBakVWOztBQUpGIiwic291cmNlc0NvbnRlbnQiOlsiXG57Q29tcG9zaXRlRGlzcG9zYWJsZX0gPSByZXF1aXJlICdhdG9tJ1xuXG5tb2R1bGUuZXhwb3J0cyA9XG5cbiAgYWN0aXZhdGU6IChzdGF0ZSkgLT5cblxuICAgICMgRXZlbnRzIHN1YnNjcmliZWQgdG8gaW4gYXRvbSdzIHN5c3RlbSBjYW4gYmUgZWFzaWx5IGNsZWFuZWQgdXAgd2l0aCBhIENvbXBvc2l0ZURpc3Bvc2FibGVcbiAgICBAc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlXG5cbiAgICAjIFJlZ2lzdGVyIGNvbW1hbmQgdGhhdCB0b2dnbGVzIHRoaXMgdmlld1xuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS13b3Jrc3BhY2UnLCAnaGVhZGVyLWltcGxlbWVudGF0aW9uOmdlbmVyYXRlJzogPT4gQGdlbmVyYXRlKClcbiAgICBATUVUSE9EX1BBVFRFUk4gPSAvXlxccyooKD86Y29uc3R8c3RhdGljfHZpcnR1YWx8dm9sYXRpbGV8ZnJpZW5kKXswLDV9XFxzKltcXHdfXSsoPzo6ezJ9W1xcd19dKyl7MCx9XFxzKlxcKiomPyk/XFxzKyhbXFx3fl9dKylcXHMqKFxcKC4qXFwpKVxccyo/KCBjb25zdCk/L2dtXG5cbiAgZmluZE5hbWU6ICh3b3JrKSAtPlxuICAgIHdvcmsuYnVmZmVyLnNjYW4gbmV3IFJlZ0V4cChcIm5hbWVzcGFjZVwiKSwgKHJlcykgLT5cbiAgICAgIHdvcmsuZWRpdG9yLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uKHJlcy5yYW5nZS5lbmQpXG4gICAgICB3b3JrLmVkaXRvci5tb3ZlUmlnaHQoMSlcbiAgICAgIHdvcmsuZWRpdG9yLm1vdmVUb0VuZE9mV29yZCgpXG4gICAgICB3b3JrLmVkaXRvci5tb3ZlVG9CZWdpbm5pbmdPZldvcmQoKVxuICAgICAgd29yay5lZGl0b3Iuc2VsZWN0VG9FbmRPZldvcmQoKVxuICAgICAgd29yay5jbGFzc25hbWUgPSBlZGl0b3IuZ2V0U2VsZWN0ZWRUZXh0KClcbiAgICAgIHJlcy5zdG9wKClcbiAgICB3b3JrLmVkaXRvci5tb3ZlVG9FbmRPZkxpbmUoKVxuXG4gIGZpbmRNZXRob2Q6ICh3b3JrKSAtPlxuICAgIHdvcmsuYnVmZmVyLnNjYW4gQE1FVEhPRF9QQVRURVJOLCAocmVzKSAtPlxuICAgICAgbWV0aG9kID0gW11cbiAgICAgIG1ldGhvZC5wdXNoKHJlcy5tYXRjaFsxXS5yZXBsYWNlKFwic3RhdGljIFwiLCBcIlwiKS5yZXBsYWNlKC9cXHN7Mix9LywgXCIgXCIpIHx8IFwiXCIpXG4gICAgICBtZXRob2QucHVzaChyZXMubWF0Y2hbMl0gKyByZXMubWF0Y2hbM10gKyAocmVzLm1hdGNoWzRdfHxcIlwiKSlcbiAgICAgIHdvcmsubWV0aG9kcy5wdXNoKG1ldGhvZClcblxuICByZWFkRmlsZTogKHdvcmspIC0+XG4gICAgQGZpbmROYW1lKHdvcmspXG4gICAgQGZpbmRNZXRob2Qod29yaylcblxuICBjcmVhdGVGaWxlOiAod29yaykgLT5cbiAgICByZXR1cm4gYXRvbS53b3Jrc3BhY2Uub3Blbih3b3JrLmltcGxlbWVudGF0aW9uUGF0aClcblxuICBjcmVhdGVIZWFkOiAod29yaykgLT5cbiAgICB3b3JrLmVkaXRvci5pbnNlcnRUZXh0KFwiI2luY2x1ZGUgXFxcIiN7d29yay5jbGFzc25hbWV9LmhcXFwiXCIpXG4gICAgd29yay5lZGl0b3IuaW5zZXJ0TmV3bGluZSgpXG4gICAgd29yay5lZGl0b3IuaW5zZXJ0TmV3bGluZSgpXG4gICAgd29yay5lZGl0b3IuaW5zZXJ0TmV3bGluZSgpXG5cbiAgY3JlYXRlTWV0aG9kczogKHdvcmspIC0+XG4gICAgd29yay5tZXRob2RzLmZvckVhY2ggKG1ldGhvZCkgLT5cbiAgICAgIGNvbnNvbGUubG9nKG1ldGhvZClcbiAgICAgIHdvcmsuZWRpdG9yLmluc2VydFRleHQoXCIvKlwiICsgXCIqXCIucmVwZWF0KDY4KSlcbiAgICAgIHdvcmsuZWRpdG9yLmluc2VydE5ld2xpbmUoKVxuICAgICAgd29yay5lZGl0b3IuaW5zZXJ0VGV4dChcIiogQ29tbWVudFwiKVxuICAgICAgd29yay5lZGl0b3IuaW5zZXJ0TmV3bGluZSgpXG4gICAgICB3b3JrLmVkaXRvci5pbnNlcnRUZXh0KCBcIipcIi5yZXBlYXQoNjgpKyBcIiovXCIpXG4gICAgICB3b3JrLmVkaXRvci5pbnNlcnROZXdsaW5lKClcbiAgICAgIGlmIChtZXRob2RbMF0pXG4gICAgICAgIHdvcmsuZWRpdG9yLmluc2VydFRleHQoXCIje21ldGhvZFswXX0gXCIpXG4gICAgICB3b3JrLmVkaXRvci5pbnNlcnRUZXh0KFwiI3t3b3JrLmNsYXNzbmFtZX06OiN7bWV0aG9kWzFdfVwiIClcbiAgICAgIHdvcmsuZWRpdG9yLmluc2VydE5ld2xpbmUoKVxuICAgICAgd29yay5lZGl0b3IuaW5zZXJ0VGV4dChcIntcIilcbiAgICAgIHdvcmsuZWRpdG9yLmluc2VydE5ld2xpbmUoKVxuICAgICAgd29yay5lZGl0b3IuaW5zZXJ0TmV3bGluZSgpXG4gICAgICB3b3JrLmVkaXRvci5pbnNlcnRUZXh0KFwifVwiKVxuICAgICAgd29yay5lZGl0b3IuaW5zZXJ0TmV3bGluZSgpXG5cblxuICB3cml0ZUluRWRpdG9yOiAod29yaykgLT5cbiAgICBAY3JlYXRlSGVhZCh3b3JrKVxuICAgIEBjcmVhdGVNZXRob2RzKHdvcmspXG5cblxuICBnZW5lcmF0ZTogLT5cbiAgICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICBidWZmZXIgPSBlZGl0b3IuZ2V0QnVmZmVyKClcbiAgICBoZWFkZXJQYXRoID0gZWRpdG9yLmdldFBhdGgoKVxuICAgIGltcGxlbWVudGF0aW9uUGF0aCA9IGhlYWRlclBhdGgucmVwbGFjZShcIi5oXCIsXCIuY3BwXCIpXG4gICAgd29yayA9XG4gICAgICB7XG4gICAgICAgIGVkaXRvcixcbiAgICAgICAgYnVmZmVyLFxuICAgICAgICBoZWFkZXJQYXRoLFxuICAgICAgICBpbXBsZW1lbnRhdGlvblBhdGgsXG4gICAgICAgIGNsYXNzbmFtZSA6IFwiXCJcbiAgICAgICAgbWV0aG9kcyA6IFtdXG4gICAgICB9XG4gICAgd29yay5lZGl0b3Iuc2F2ZSgpXG4gICAgQHJlYWRGaWxlKHdvcmspXG4gICAgY3R4ID0gdGhpc1xuICAgIEBjcmVhdGVGaWxlKHdvcmspLnRoZW4gKGVkaXRvcikgLT5cbiAgICAgIHdvcmsuZWRpdG9yID0gZWRpdG9yXG4gICAgICB3b3JrLmJ1ZmZlciA9IHdvcmsuZWRpdG9yLmdldEJ1ZmZlcigpXG4gICAgICBjdHgud3JpdGVJbkVkaXRvcih3b3JrKVxuICAgIHJldHVyblxuIl19