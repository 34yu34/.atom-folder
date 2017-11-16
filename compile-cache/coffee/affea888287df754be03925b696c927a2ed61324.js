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
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'header-implementation:add': (function(_this) {
          return function() {
            return _this.add();
          };
        })(this)
      }));
      this.FILE_NAME_PATTERN = /([\w]+)\.([h|cpp]+)/;
      this.CLASS_NAME_PATTERN = /(namespace|class)\s+(\w+)\s*{/g;
      return this.METHOD_PATTERN = /^\s*((?:(?:\s*const\s*)|(?:\s*static\s*)|(?:\s*virtual\s*)|(?:\s*volatile\s*)|(?:\s*friend\s*)){0,5}\s*\w+(?::{2}\w+)*(?:\s*?[&*]\s*?)*)??\s*([\w~]+)\s*(\(.*\))\s*?(\sconst)?\s*;/gm;
    },
    findPath: function(work) {
      work.headerPath = "";
      work.implementationPath = "";
      return atom.workspace.scan(this.FILE_NAME_PATTERN, function(file) {
        if (file.filePath.includes(work.classname + ".h")) {
          work.headerPath = file.filePath;
        }
        if (file.filePath.includes(work.classname + ".cpp")) {
          return work.implementationPath = file.filePath;
        }
      });
    },
    findName: function(work) {
      work.buffer.scan(this.CLASS_NAME_PATTERN, function(res) {
        work.namespace = res.match[1] === "namespace";
        return work.classname = res.match[2];
      });
      return work.editor.moveToEndOfLine();
    },
    findAllMethods: function(work) {
      var ctx;
      ctx = this;
      return work.buffer.scan(this.METHOD_PATTERN, function(res) {
        return ctx.addMethod(work, res);
      });
    },
    addMethod: function(work, res) {
      var method;
      method = [];
      method.push((res.match[1] || "").replace("static ", "").replace(/\s{2,}/, " ") || "");
      method.push(res.match[2] + res.match[3] + (res.match[4] || ""));
      return work.methods.push(method);
    },
    readFile: function(work) {
      this.findName(work);
      return this.findAllMethods(work);
    },
    createFile: function(work) {
      return atom.workspace.open(work.implementationPath);
    },
    createHead: function(work) {
      work.editor.insertText("#include \"" + work.classname + ".h\"");
      work.editor.insertNewline();
      work.editor.insertNewline();
      work.editor.insertNewline();
      if (work.namespace) {
        work.editor.insertText("namespace " + work.classname);
        work.editor.insertNewline();
        work.editor.insertText("{");
        return work.editor.insertNewline();
      }
    },
    methodComment: function(work) {
      work.editor.insertText("/*" + "*".repeat(68));
      work.editor.insertNewline();
      work.editor.insertText("* Comment");
      work.editor.insertNewline();
      work.editor.insertText("*".repeat(68) + "*/");
      return work.editor.insertNewline();
    },
    methodName: function(work, method) {
      if (method[0]) {
        work.editor.insertText(method[0] + " ");
      }
      if (work.namespace) {
        work.editor.insertText("" + method[1]);
      } else {
        work.editor.insertText(work.classname + "::" + method[1]);
      }
      return work.editor.insertNewline();
    },
    methodBody: function(work) {
      work.editor.insertText("{");
      work.editor.insertNewline();
      work.editor.moveDown(1);
      return work.editor.insertNewline();
    },
    writeMethod: function(work, method) {
      this.methodComment(work);
      this.methodName(work, method);
      return this.methodBody(work);
    },
    writeAllMethods: function(work) {
      var ctx;
      ctx = this;
      return work.methods.forEach(function(method) {
        return ctx.writeMethod(work, method, ctx);
      });
    },
    writeInEditor: function(work) {
      this.createHead(work);
      return this.writeAllMethods(work);
    },
    generateWork: function() {
      var buffer, editor, work;
      editor = atom.workspace.getActiveTextEditor();
      buffer = editor.getBuffer();
      work = {
        editor: editor,
        buffer: buffer,
        headerPath: "",
        implementationPath: "",
        classname: "",
        namespace: false,
        methods: []
      };
      return work;
    },
    generate: function() {
      var ctx, work;
      work = this.generateWork();
      work.editor.save();
      this.readFile(work);
      work.headerPath = work.editor.getPath();
      work.implementationPath = work.headerPath.replace(".h", ".cpp");
      ctx = this;
      this.createFile(work).then(function(editor) {
        work.editor = editor;
        work.buffer = work.editor.getBuffer();
        return ctx.writeInEditor(work);
      });
    },
    add: function() {
      var ctx, work;
      work = this.generateWork();
      work.editor.save;
      this.findName(work);
      ctx = this;
      this.findPath(work).then(function() {
        debugger;
        var range;
        console.log(work);
        console.log(work.implementationPath);
        work.editor.moveToBeginningOfLine();
        work.editor.selectToEndOfLine();
        range = work.editor.getSelectedBufferRange();
        ctx = this;
        work.editor.scanInBufferRange(this.METHOD_PATTERN, range, function(res) {
          ctx.addMethod(work, res);
          console.log(work.methods);
          if (work.method === []) {

          }
        });
        return this.createFile(work).then(function(editor) {
          work.editor = editor;
          work.buffer = work.editor.getBuffer();
          work.editor.moveToBottom();
          return ctx.writeMethod(work, work.methods[0]);
        });
      });
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYmlsbHkvZ2l0aHViL2hlYWRlci1pbXBsZW1lbnRhdGlvbi9saWIvaGVhZGVyLWltcGxlbWVudGF0aW9uLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSOztFQUV4QixNQUFNLENBQUMsT0FBUCxHQUVFO0lBQUEsUUFBQSxFQUFVLFNBQUMsS0FBRDtNQUVSLElBQUMsQ0FBQSxhQUFELEdBQWlCLElBQUk7TUFFckIsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFBb0M7UUFBQSxnQ0FBQSxFQUFrQyxDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFBO21CQUFHLEtBQUMsQ0FBQSxRQUFELENBQUE7VUFBSDtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBbEM7T0FBcEMsQ0FBbkI7TUFDQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGdCQUFsQixFQUFvQztRQUFBLDJCQUFBLEVBQTZCLENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUE7bUJBQUcsS0FBQyxDQUFBLEdBQUQsQ0FBQTtVQUFIO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUE3QjtPQUFwQyxDQUFuQjtNQUVBLElBQUMsQ0FBQSxpQkFBRCxHQUFxQjtNQUNyQixJQUFDLENBQUEsa0JBQUQsR0FBc0I7YUFDdEIsSUFBQyxDQUFBLGNBQUQsR0FBa0I7SUFUVixDQUFWO0lBa0RBLFFBQUEsRUFBVSxTQUFDLElBQUQ7TUFDUixJQUFJLENBQUMsVUFBTCxHQUFrQjtNQUNsQixJQUFJLENBQUMsa0JBQUwsR0FBMEI7QUFDMUIsYUFBTyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBb0IsSUFBQyxDQUFBLGlCQUFy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QUE7O1FBSG9ELENBQXREO2VBS0EsSUFBQyxDQUFBLFVBQUQsQ0FBWSxJQUFaLENBQWlCLENBQUMsSUFBbEIsQ0FBdUIsU0FBQyxNQUFEO1VBQ3JCLElBQUksQ0FBQyxNQUFMLEdBQWM7VUFDZCxJQUFJLENBQUMsTUFBTCxHQUFjLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBWixDQUFBO1VBQ2QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFaLENBQUE7aUJBQ0EsR0FBRyxDQUFDLFdBQUosQ0FBZ0IsSUFBaEIsRUFBcUIsSUFBSSxDQUFDLE9BQVEsQ0FBQSxDQUFBLENBQWxDO1FBSnFCLENBQXZCO01BYm1CLENBQXJCO0lBTEcsQ0E3TEw7O0FBSkYiLCJzb3VyY2VzQ29udGVudCI6WyJ7Q29tcG9zaXRlRGlzcG9zYWJsZX0gPSByZXF1aXJlICdhdG9tJ1xuXG5tb2R1bGUuZXhwb3J0cyA9XG5cbiAgYWN0aXZhdGU6IChzdGF0ZSkgLT5cbiAgICAjIEV2ZW50cyBzdWJzY3JpYmVkIHRvIGluIGF0b20ncyBzeXN0ZW0gY2FuIGJlIGVhc2lseSBjbGVhbmVkIHVwIHdpdGggYSBDb21wb3NpdGVEaXNwb3NhYmxlXG4gICAgQHN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZVxuICAgICMgUmVnaXN0ZXIgY29tbWFuZCB0aGF0IHRvZ2dsZXMgdGhpcyB2aWV3XG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29tbWFuZHMuYWRkICdhdG9tLXdvcmtzcGFjZScsICdoZWFkZXItaW1wbGVtZW50YXRpb246Z2VuZXJhdGUnOiA9PiBAZ2VuZXJhdGUoKVxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS13b3Jrc3BhY2UnLCAnaGVhZGVyLWltcGxlbWVudGF0aW9uOmFkZCc6ID0+IEBhZGQoKVxuICAgICMgUmVnRXggUGF0dGVybnNcbiAgICBARklMRV9OQU1FX1BBVFRFUk4gPSAvKFtcXHddKylcXC4oW2h8Y3BwXSspL1xuICAgIEBDTEFTU19OQU1FX1BBVFRFUk4gPSAvKG5hbWVzcGFjZXxjbGFzcylcXHMrKFxcdyspXFxzKnsvZ1xuICAgIEBNRVRIT0RfUEFUVEVSTiA9IC8vL1xuICAgIF5cbiAgICBcXHMqXG4gICAgKFxuICAgICAgKD86XG4gICAgICAgICg/Olxccypjb25zdFxccyopfFxuICAgICAgICAoPzpcXHMqc3RhdGljXFxzKil8XG4gICAgICAgICg/Olxccyp2aXJ0dWFsXFxzKil8XG4gICAgICAgICg/Olxccyp2b2xhdGlsZVxccyopfFxuICAgICAgICAoPzpcXHMqZnJpZW5kXFxzKilcbiAgICAgICl7MCw1fVxuICAgICAgXFxzKlxuICAgICAgXFx3K1xuICAgICAgKD86XG4gICAgICAgIDp7Mn1cbiAgICAgICAgXFx3K1xuICAgICAgKSpcbiAgICAgICg/OlxuICAgICAgICBcXHMqP1xuICAgICAgICBbJipdXG4gICAgICAgIFxccyo/XG4gICAgICApKlxuICAgICk/P1xuICAgIFxccypcbiAgICAoW1xcd35dKylcbiAgICBcXHMqXG4gICAgKFxuICAgICAgXFwoXG4gICAgICAuKlxuICAgICAgXFwpXG4gICAgKVxuICAgIFxccyo/XG4gICAgKFxcc2NvbnN0KT9cbiAgICBcXHMqXG4gICAgO1xuICAgIC8vL2dtXG5cbiAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICAjIEZpbmQgdGhlIFBhcmggb2YgdGhlIHNvdXJjZSBmaWxlIGFuZCB0aGUgaGVhZGVycyBmaWxlXG4gICMgcmV0dXJuIGVtcHR5IGlmIG5vdGhpbmcgaXMgZm91bmRcbiAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICBmaW5kUGF0aDogKHdvcmspIC0+XG4gICAgd29yay5oZWFkZXJQYXRoID0gXCJcIlxuICAgIHdvcmsuaW1wbGVtZW50YXRpb25QYXRoID0gXCJcIlxuICAgIHJldHVybiBhdG9tLndvcmtzcGFjZS5zY2FuIEBGSUxFX05BTUVfUEFUVEVSTiwgKGZpbGUpIC0+XG4gICAgICBpZiAoZmlsZS5maWxlUGF0aC5pbmNsdWRlcyhcIiN7d29yay5jbGFzc25hbWV9LmhcIikpXG4gICAgICAgIHdvcmsuaGVhZGVyUGF0aCA9IGZpbGUuZmlsZVBhdGhcbiAgICAgIGlmIChmaWxlLmZpbGVQYXRoLmluY2x1ZGVzKFwiI3t3b3JrLmNsYXNzbmFtZX0uY3BwXCIpKVxuICAgICAgICB3b3JrLmltcGxlbWVudGF0aW9uUGF0aCA9IGZpbGUuZmlsZVBhdGhcbiAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICAjXHRGaW5kIHdldGhlciBpdCBpcyBhIG5hbWVzcGFjZSBvciBhIGNsYXNzZSBhbmQgYWRkIGl0cyBuYW1lIHRvIHdvcmtcbiAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICBmaW5kTmFtZTogKHdvcmspIC0+XG4gICAgd29yay5idWZmZXIuc2NhbiBAQ0xBU1NfTkFNRV9QQVRURVJOLCAocmVzKSAtPlxuICAgICAgd29yay5uYW1lc3BhY2UgPSByZXMubWF0Y2hbMV0gPT0gXCJuYW1lc3BhY2VcIlxuICAgICAgd29yay5jbGFzc25hbWUgPSByZXMubWF0Y2hbMl1cbiAgICB3b3JrLmVkaXRvci5tb3ZlVG9FbmRPZkxpbmUoKVxuICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gICNcdEZpbmQgYWxsIHRoZSBtZXRob2RzIHRoYXQgbWF0Y2ggdGhlIHBhdHRlcm4gYW5kIGFkZCB0aGVtXG4gICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgZmluZEFsbE1ldGhvZHM6ICh3b3JrKSAtPlxuICAgIGN0eCA9IHRoaXNcbiAgICB3b3JrLmJ1ZmZlci5zY2FuIEBNRVRIT0RfUEFUVEVSTiwgKHJlcykgLT5cbiAgICAgIGN0eC5hZGRNZXRob2Qod29yayxyZXMpXG4gICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgI1x0YWRkIGEgbWV0aG9kIHRvIHRoZSB3b3Jrc3BhY2UgZnJvbSBhIHJlZ2V4IG1hdGNoXG4gICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgYWRkTWV0aG9kOiAod29yayxyZXMpIC0+XG4gICAgbWV0aG9kID0gW11cbiAgICBtZXRob2QucHVzaCgocmVzLm1hdGNoWzFdfHxcIlwiKS5yZXBsYWNlKFwic3RhdGljIFwiLCBcIlwiKS5yZXBsYWNlKC9cXHN7Mix9LywgXCIgXCIpIHx8IFwiXCIpXG4gICAgbWV0aG9kLnB1c2gocmVzLm1hdGNoWzJdICsgcmVzLm1hdGNoWzNdICsgKHJlcy5tYXRjaFs0XXx8XCJcIikpXG4gICAgd29yay5tZXRob2RzLnB1c2gobWV0aG9kKVxuICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gICNcdEZpbmQgYm90aCBuYW1lIGFuZCBtZXRob2RzXG4gICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgcmVhZEZpbGU6ICh3b3JrKSAtPlxuICAgIEBmaW5kTmFtZSh3b3JrKVxuICAgIEBmaW5kQWxsTWV0aG9kcyh3b3JrKVxuICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gICNcdFJldHVybiBhIHByb21pc2UgdG93YXJkIGEgbmV3IC5jcHAgZmlsZSBvcGVuXG4gICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgY3JlYXRlRmlsZTogKHdvcmspIC0+XG4gICAgcmV0dXJuIGF0b20ud29ya3NwYWNlLm9wZW4od29yay5pbXBsZW1lbnRhdGlvblBhdGgpXG4gICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgIyBXcml0ZSB0aGUgaGVhZCBvZiBhIC5jcHAgZmlsZSBkZXBlbmRpbmcgb24gaWZcbiAgIyBpdCdzIGEgbmFtZXNwYWNlIG9yIGEgY2xhc3NcbiAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICBjcmVhdGVIZWFkOiAod29yaykgLT5cbiAgICB3b3JrLmVkaXRvci5pbnNlcnRUZXh0KFwiI2luY2x1ZGUgXFxcIiN7d29yay5jbGFzc25hbWV9LmhcXFwiXCIpXG4gICAgd29yay5lZGl0b3IuaW5zZXJ0TmV3bGluZSgpXG4gICAgd29yay5lZGl0b3IuaW5zZXJ0TmV3bGluZSgpXG4gICAgd29yay5lZGl0b3IuaW5zZXJ0TmV3bGluZSgpXG4gICAgaWYgKHdvcmsubmFtZXNwYWNlKVxuICAgICAgd29yay5lZGl0b3IuaW5zZXJ0VGV4dChcIm5hbWVzcGFjZSAje3dvcmsuY2xhc3NuYW1lfVwiKVxuICAgICAgd29yay5lZGl0b3IuaW5zZXJ0TmV3bGluZSgpXG4gICAgICB3b3JrLmVkaXRvci5pbnNlcnRUZXh0KFwie1wiKVxuICAgICAgd29yay5lZGl0b3IuaW5zZXJ0TmV3bGluZSgpXG4gICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgIyBJbnNlcnQgYSBjb21tZW50IGxpbmUgb24gdG9wIG9mIGEgbWV0aG9kXG4gICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgbWV0aG9kQ29tbWVudDogKHdvcmspIC0+XG4gICAgd29yay5lZGl0b3IuaW5zZXJ0VGV4dChcIi8qXCIgKyBcIipcIi5yZXBlYXQoNjgpKVxuICAgIHdvcmsuZWRpdG9yLmluc2VydE5ld2xpbmUoKVxuICAgIHdvcmsuZWRpdG9yLmluc2VydFRleHQoXCIqIENvbW1lbnRcIilcbiAgICB3b3JrLmVkaXRvci5pbnNlcnROZXdsaW5lKClcbiAgICB3b3JrLmVkaXRvci5pbnNlcnRUZXh0KCBcIipcIi5yZXBlYXQoNjgpKyBcIiovXCIpXG4gICAgd29yay5lZGl0b3IuaW5zZXJ0TmV3bGluZSgpXG4gICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgI1x0V3JpdGUgdGhlIG1ldGhvZCBuYW1lXG4gICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgbWV0aG9kTmFtZTogKHdvcmssbWV0aG9kKSAtPlxuICAgIGlmIChtZXRob2RbMF0pXG4gICAgICB3b3JrLmVkaXRvci5pbnNlcnRUZXh0KFwiI3ttZXRob2RbMF19IFwiKVxuICAgIGlmICh3b3JrLm5hbWVzcGFjZSlcbiAgICAgIHdvcmsuZWRpdG9yLmluc2VydFRleHQoXCIje21ldGhvZFsxXX1cIiApXG4gICAgZWxzZVxuICAgICAgd29yay5lZGl0b3IuaW5zZXJ0VGV4dChcIiN7d29yay5jbGFzc25hbWV9Ojoje21ldGhvZFsxXX1cIilcbiAgICB3b3JrLmVkaXRvci5pbnNlcnROZXdsaW5lKClcbiAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICAjXHRXcml0ZSB0aGUgYm9keSBvZiB0aGUgaW1wbGVtZW50YXRpb24gb2YgYSBtZXRob2RcbiAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICBtZXRob2RCb2R5OiAod29yaykgLT5cbiAgICB3b3JrLmVkaXRvci5pbnNlcnRUZXh0KFwie1wiKVxuICAgIHdvcmsuZWRpdG9yLmluc2VydE5ld2xpbmUoKVxuICAgIHdvcmsuZWRpdG9yLm1vdmVEb3duKDEpXG4gICAgd29yay5lZGl0b3IuaW5zZXJ0TmV3bGluZSgpXG4gICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgI1x0QWRkIGEgbWV0aG9kIGF0IHRoZSBjdXJzb3IgcG9zaXRpb25cbiAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICB3cml0ZU1ldGhvZDogKHdvcmssbWV0aG9kKSAtPlxuICAgIEBtZXRob2RDb21tZW50KHdvcmspXG4gICAgQG1ldGhvZE5hbWUod29yayxtZXRob2QpXG4gICAgQG1ldGhvZEJvZHkod29yaylcbiAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICAjXHRDcmVhdGUgYWxsIHRoZSBtZXRob2RzIGJhY2sgdG8gYmFja1xuICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gIHdyaXRlQWxsTWV0aG9kczogKHdvcmspIC0+XG4gICAgY3R4ID0gdGhpc1xuICAgIHdvcmsubWV0aG9kcy5mb3JFYWNoIChtZXRob2QpIC0+XG4gICAgICBjdHgud3JpdGVNZXRob2Qod29yayxtZXRob2QsY3R4KVxuICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gICNcdFdyaXRlIHRoZSB3aG9sZSBmaWxlIC5jcHBcbiAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICB3cml0ZUluRWRpdG9yOiAod29yaykgLT5cbiAgICBAY3JlYXRlSGVhZCh3b3JrKVxuICAgIEB3cml0ZUFsbE1ldGhvZHMod29yaylcbiAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICAjXHRnZW5lcmF0ZSBhIHdvcmsgb2JqZWN0XG4gICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgZ2VuZXJhdGVXb3JrOiAtPlxuICAgIGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgIGJ1ZmZlciA9IGVkaXRvci5nZXRCdWZmZXIoKVxuICAgIHdvcmsgPVxuICAgICAge1xuICAgICAgICBlZGl0b3IsXG4gICAgICAgIGJ1ZmZlcixcbiAgICAgICAgaGVhZGVyUGF0aCA6IFwiXCJcbiAgICAgICAgaW1wbGVtZW50YXRpb25QYXRoIDogXCJcIlxuICAgICAgICBjbGFzc25hbWUgOiBcIlwiXG4gICAgICAgIG5hbWVzcGFjZSA6IGZhbHNlXG4gICAgICAgIG1ldGhvZHMgOiBbXVxuICAgICAgfVxuICAgIHJldHVybiB3b3JrXG4gICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgI1x0UmVhZCB0aGUgaGVhZGVyIGZpbGVzIHlvdSBhcmUgaW4gYW5kIGdlbmVyYXRlIGEgLmNwcFxuICAjIGluIHRoZSBzYW1lIHBhdGhcbiAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICBnZW5lcmF0ZTogLT5cbiAgICB3b3JrID0gQGdlbmVyYXRlV29yaygpXG4gICAgd29yay5lZGl0b3Iuc2F2ZSgpXG4gICAgQHJlYWRGaWxlKHdvcmspXG4gICAgd29yay5oZWFkZXJQYXRoID0gd29yay5lZGl0b3IuZ2V0UGF0aCgpXG4gICAgd29yay5pbXBsZW1lbnRhdGlvblBhdGggPSB3b3JrLmhlYWRlclBhdGgucmVwbGFjZShcIi5oXCIsXCIuY3BwXCIpXG4gICAgY3R4ID0gdGhpc1xuICAgIEBjcmVhdGVGaWxlKHdvcmspLnRoZW4gKGVkaXRvcikgLT5cbiAgICAgIHdvcmsuZWRpdG9yID0gZWRpdG9yXG4gICAgICB3b3JrLmJ1ZmZlciA9IHdvcmsuZWRpdG9yLmdldEJ1ZmZlcigpXG4gICAgICBjdHgud3JpdGVJbkVkaXRvcih3b3JrKVxuICAgIHJldHVyblxuXG4gIGFkZDogLT5cbiAgICB3b3JrID0gQGdlbmVyYXRlV29yaygpXG4gICAgd29yay5lZGl0b3Iuc2F2ZVxuICAgIEBmaW5kTmFtZSh3b3JrKVxuICAgIGN0eCA9IHRoaXNcbiAgICBAZmluZFBhdGgod29yaykudGhlbiAtPlxuICAgICAgZGVidWdnZXJcbiAgICAgIGNvbnNvbGUubG9nKHdvcmspXG4gICAgICBjb25zb2xlLmxvZyh3b3JrLmltcGxlbWVudGF0aW9uUGF0aClcbiAgICAgIHdvcmsuZWRpdG9yLm1vdmVUb0JlZ2lubmluZ09mTGluZSgpXG4gICAgICB3b3JrLmVkaXRvci5zZWxlY3RUb0VuZE9mTGluZSgpXG4gICAgICByYW5nZSA9IHdvcmsuZWRpdG9yLmdldFNlbGVjdGVkQnVmZmVyUmFuZ2UoKVxuICAgICAgY3R4ID0gdGhpc1xuICAgICAgd29yay5lZGl0b3Iuc2NhbkluQnVmZmVyUmFuZ2UgQE1FVEhPRF9QQVRURVJOLCByYW5nZSwgKHJlcykgLT5cbiAgICAgICAgY3R4LmFkZE1ldGhvZCh3b3JrLHJlcylcbiAgICAgICAgY29uc29sZS5sb2cod29yay5tZXRob2RzKVxuICAgICAgICBpZiAod29yay5tZXRob2QgPT0gW10pXG4gICAgICAgICAgcmV0dXJuXG4gICAgICBAY3JlYXRlRmlsZSh3b3JrKS50aGVuIChlZGl0b3IpIC0+XG4gICAgICAgIHdvcmsuZWRpdG9yID0gZWRpdG9yXG4gICAgICAgIHdvcmsuYnVmZmVyID0gd29yay5lZGl0b3IuZ2V0QnVmZmVyKClcbiAgICAgICAgd29yay5lZGl0b3IubW92ZVRvQm90dG9tKClcbiAgICAgICAgY3R4LndyaXRlTWV0aG9kKHdvcmssd29yay5tZXRob2RzWzBdKVxuICAgIHJldHVyblxuIl19