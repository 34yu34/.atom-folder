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
      atom.workspace.scan(this.FILE_NAME_PATTERN, function(file) {
        if (file.filePath.includes(work.classname + ".h")) {
          work.headerPath = file.filePath;
        }
        if (file.filePath.includes(work.classname + ".cpp")) {
          return work.implementationPath = file.filePath;
        }
      });
      return work;
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
      var work;
      work = this.generateWork();
      work.editor.save;
      this.findName(work);
      work = this.findPath(work);
      setTimeout(afterWait(work), 500);
    },
    afterWait: function(work) {
      var ctx, range;
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
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYmlsbHkvZ2l0aHViL2hlYWRlci1pbXBsZW1lbnRhdGlvbi9saWIvaGVhZGVyLWltcGxlbWVudGF0aW9uLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSOztFQUV4QixNQUFNLENBQUMsT0FBUCxHQUVFO0lBQUEsUUFBQSxFQUFVLFNBQUMsS0FBRDtNQUVSLElBQUMsQ0FBQSxhQUFELEdBQWlCLElBQUk7TUFFckIsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFBb0M7UUFBQSxnQ0FBQSxFQUFrQyxDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFBO21CQUFHLEtBQUMsQ0FBQSxRQUFELENBQUE7VUFBSDtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBbEM7T0FBcEMsQ0FBbkI7TUFDQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGdCQUFsQixFQUFvQztRQUFBLDJCQUFBLEVBQTZCLENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUE7bUJBQUcsS0FBQyxDQUFBLEdBQUQsQ0FBQTtVQUFIO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUE3QjtPQUFwQyxDQUFuQjtNQUVBLElBQUMsQ0FBQSxpQkFBRCxHQUFxQjtNQUNyQixJQUFDLENBQUEsa0JBQUQsR0FBc0I7YUFDdEIsSUFBQyxDQUFBLGNBQUQsR0FBa0I7SUFUVixDQUFWO0lBa0RBLFFBQUEsRUFBVSxTQUFDLElBQUQ7TUFDUixJQUFJLENBQUMsVUFBTCxHQUFrQjtNQUNsQixJQUFJLENBQUMsa0JBQUwsR0FBMEI7TUFDMUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQW9CLElBQUMsQ0FBQSxpQkFBckIsRUFB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SSxDQUFDLE9BQWpCO1FBQ0EsSUFBSSxJQUFJLENBQUMsTUFBTCxLQUFlLEVBQW5CO0FBQUE7O01BSG9ELENBQXREO2FBS0EsSUFBQyxDQUFBLFVBQUQsQ0FBWSxJQUFaLENBQWlCLENBQUMsSUFBbEIsQ0FBdUIsU0FBQyxNQUFEO1FBQ3JCLElBQUksQ0FBQyxNQUFMLEdBQWM7UUFDZCxJQUFJLENBQUMsTUFBTCxHQUFjLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBWixDQUFBO1FBQ2QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFaLENBQUE7ZUFDQSxHQUFHLENBQUMsV0FBSixDQUFnQixJQUFoQixFQUFxQixJQUFJLENBQUMsT0FBUSxDQUFBLENBQUEsQ0FBbEM7TUFKcUIsQ0FBdkI7SUFaUyxDQXRNWDs7QUFKRiIsInNvdXJjZXNDb250ZW50IjpbIntDb21wb3NpdGVEaXNwb3NhYmxlfSA9IHJlcXVpcmUgJ2F0b20nXG5cbm1vZHVsZS5leHBvcnRzID1cblxuICBhY3RpdmF0ZTogKHN0YXRlKSAtPlxuICAgICMgRXZlbnRzIHN1YnNjcmliZWQgdG8gaW4gYXRvbSdzIHN5c3RlbSBjYW4gYmUgZWFzaWx5IGNsZWFuZWQgdXAgd2l0aCBhIENvbXBvc2l0ZURpc3Bvc2FibGVcbiAgICBAc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlXG4gICAgIyBSZWdpc3RlciBjb21tYW5kIHRoYXQgdG9nZ2xlcyB0aGlzIHZpZXdcbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20td29ya3NwYWNlJywgJ2hlYWRlci1pbXBsZW1lbnRhdGlvbjpnZW5lcmF0ZSc6ID0+IEBnZW5lcmF0ZSgpXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29tbWFuZHMuYWRkICdhdG9tLXdvcmtzcGFjZScsICdoZWFkZXItaW1wbGVtZW50YXRpb246YWRkJzogPT4gQGFkZCgpXG4gICAgIyBSZWdFeCBQYXR0ZXJuc1xuICAgIEBGSUxFX05BTUVfUEFUVEVSTiA9IC8oW1xcd10rKVxcLihbaHxjcHBdKykvXG4gICAgQENMQVNTX05BTUVfUEFUVEVSTiA9IC8obmFtZXNwYWNlfGNsYXNzKVxccysoXFx3KylcXHMqey9nXG4gICAgQE1FVEhPRF9QQVRURVJOID0gLy8vXG4gICAgXlxuICAgIFxccypcbiAgICAoXG4gICAgICAoPzpcbiAgICAgICAgKD86XFxzKmNvbnN0XFxzKil8XG4gICAgICAgICg/OlxccypzdGF0aWNcXHMqKXxcbiAgICAgICAgKD86XFxzKnZpcnR1YWxcXHMqKXxcbiAgICAgICAgKD86XFxzKnZvbGF0aWxlXFxzKil8XG4gICAgICAgICg/OlxccypmcmllbmRcXHMqKVxuICAgICAgKXswLDV9XG4gICAgICBcXHMqXG4gICAgICBcXHcrXG4gICAgICAoPzpcbiAgICAgICAgOnsyfVxuICAgICAgICBcXHcrXG4gICAgICApKlxuICAgICAgKD86XG4gICAgICAgIFxccyo/XG4gICAgICAgIFsmKl1cbiAgICAgICAgXFxzKj9cbiAgICAgICkqXG4gICAgKT8/XG4gICAgXFxzKlxuICAgIChbXFx3fl0rKVxuICAgIFxccypcbiAgICAoXG4gICAgICBcXChcbiAgICAgIC4qXG4gICAgICBcXClcbiAgICApXG4gICAgXFxzKj9cbiAgICAoXFxzY29uc3QpP1xuICAgIFxccypcbiAgICA7XG4gICAgLy8vZ21cblxuICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gICMgRmluZCB0aGUgUGFyaCBvZiB0aGUgc291cmNlIGZpbGUgYW5kIHRoZSBoZWFkZXJzIGZpbGVcbiAgIyByZXR1cm4gZW1wdHkgaWYgbm90aGluZyBpcyBmb3VuZFxuICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gIGZpbmRQYXRoOiAod29yaykgLT5cbiAgICB3b3JrLmhlYWRlclBhdGggPSBcIlwiXG4gICAgd29yay5pbXBsZW1lbnRhdGlvblBhdGggPSBcIlwiXG4gICAgYXRvbS53b3Jrc3BhY2Uuc2NhbiBARklMRV9OQU1FX1BBVFRFUk4sIChmaWxlKSAtPlxuICAgICAgaWYgKGZpbGUuZmlsZVBhdGguaW5jbHVkZXMoXCIje3dvcmsuY2xhc3NuYW1lfS5oXCIpKVxuICAgICAgICB3b3JrLmhlYWRlclBhdGggPSBmaWxlLmZpbGVQYXRoXG4gICAgICBpZiAoZmlsZS5maWxlUGF0aC5pbmNsdWRlcyhcIiN7d29yay5jbGFzc25hbWV9LmNwcFwiKSlcbiAgICAgICAgd29yay5pbXBsZW1lbnRhdGlvblBhdGggPSBmaWxlLmZpbGVQYXRoXG4gICAgcmV0dXJuIHdvcmtcbiAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICAjXHRGaW5kIHdldGhlciBpdCBpcyBhIG5hbWVzcGFjZSBvciBhIGNsYXNzZSBhbmQgYWRkIGl0cyBuYW1lIHRvIHdvcmtcbiAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICBmaW5kTmFtZTogKHdvcmspIC0+XG4gICAgd29yay5idWZmZXIuc2NhbiBAQ0xBU1NfTkFNRV9QQVRURVJOLCAocmVzKSAtPlxuICAgICAgd29yay5uYW1lc3BhY2UgPSByZXMubWF0Y2hbMV0gPT0gXCJuYW1lc3BhY2VcIlxuICAgICAgd29yay5jbGFzc25hbWUgPSByZXMubWF0Y2hbMl1cbiAgICB3b3JrLmVkaXRvci5tb3ZlVG9FbmRPZkxpbmUoKVxuICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gICNcdEZpbmQgYWxsIHRoZSBtZXRob2RzIHRoYXQgbWF0Y2ggdGhlIHBhdHRlcm4gYW5kIGFkZCB0aGVtXG4gICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgZmluZEFsbE1ldGhvZHM6ICh3b3JrKSAtPlxuICAgIGN0eCA9IHRoaXNcbiAgICB3b3JrLmJ1ZmZlci5zY2FuIEBNRVRIT0RfUEFUVEVSTiwgKHJlcykgLT5cbiAgICAgIGN0eC5hZGRNZXRob2Qod29yayxyZXMpXG4gICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgI1x0YWRkIGEgbWV0aG9kIHRvIHRoZSB3b3Jrc3BhY2UgZnJvbSBhIHJlZ2V4IG1hdGNoXG4gICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgYWRkTWV0aG9kOiAod29yayxyZXMpIC0+XG4gICAgbWV0aG9kID0gW11cbiAgICBtZXRob2QucHVzaCgocmVzLm1hdGNoWzFdfHxcIlwiKS5yZXBsYWNlKFwic3RhdGljIFwiLCBcIlwiKS5yZXBsYWNlKC9cXHN7Mix9LywgXCIgXCIpIHx8IFwiXCIpXG4gICAgbWV0aG9kLnB1c2gocmVzLm1hdGNoWzJdICsgcmVzLm1hdGNoWzNdICsgKHJlcy5tYXRjaFs0XXx8XCJcIikpXG4gICAgd29yay5tZXRob2RzLnB1c2gobWV0aG9kKVxuICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gICNcdEZpbmQgYm90aCBuYW1lIGFuZCBtZXRob2RzXG4gICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgcmVhZEZpbGU6ICh3b3JrKSAtPlxuICAgIEBmaW5kTmFtZSh3b3JrKVxuICAgIEBmaW5kQWxsTWV0aG9kcyh3b3JrKVxuICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gICNcdFJldHVybiBhIHByb21pc2UgdG93YXJkIGEgbmV3IC5jcHAgZmlsZSBvcGVuXG4gICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgY3JlYXRlRmlsZTogKHdvcmspIC0+XG4gICAgcmV0dXJuIGF0b20ud29ya3NwYWNlLm9wZW4od29yay5pbXBsZW1lbnRhdGlvblBhdGgpXG4gICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgIyBXcml0ZSB0aGUgaGVhZCBvZiBhIC5jcHAgZmlsZSBkZXBlbmRpbmcgb24gaWZcbiAgIyBpdCdzIGEgbmFtZXNwYWNlIG9yIGEgY2xhc3NcbiAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICBjcmVhdGVIZWFkOiAod29yaykgLT5cbiAgICB3b3JrLmVkaXRvci5pbnNlcnRUZXh0KFwiI2luY2x1ZGUgXFxcIiN7d29yay5jbGFzc25hbWV9LmhcXFwiXCIpXG4gICAgd29yay5lZGl0b3IuaW5zZXJ0TmV3bGluZSgpXG4gICAgd29yay5lZGl0b3IuaW5zZXJ0TmV3bGluZSgpXG4gICAgd29yay5lZGl0b3IuaW5zZXJ0TmV3bGluZSgpXG4gICAgaWYgKHdvcmsubmFtZXNwYWNlKVxuICAgICAgd29yay5lZGl0b3IuaW5zZXJ0VGV4dChcIm5hbWVzcGFjZSAje3dvcmsuY2xhc3NuYW1lfVwiKVxuICAgICAgd29yay5lZGl0b3IuaW5zZXJ0TmV3bGluZSgpXG4gICAgICB3b3JrLmVkaXRvci5pbnNlcnRUZXh0KFwie1wiKVxuICAgICAgd29yay5lZGl0b3IuaW5zZXJ0TmV3bGluZSgpXG4gICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgIyBJbnNlcnQgYSBjb21tZW50IGxpbmUgb24gdG9wIG9mIGEgbWV0aG9kXG4gICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgbWV0aG9kQ29tbWVudDogKHdvcmspIC0+XG4gICAgd29yay5lZGl0b3IuaW5zZXJ0VGV4dChcIi8qXCIgKyBcIipcIi5yZXBlYXQoNjgpKVxuICAgIHdvcmsuZWRpdG9yLmluc2VydE5ld2xpbmUoKVxuICAgIHdvcmsuZWRpdG9yLmluc2VydFRleHQoXCIqIENvbW1lbnRcIilcbiAgICB3b3JrLmVkaXRvci5pbnNlcnROZXdsaW5lKClcbiAgICB3b3JrLmVkaXRvci5pbnNlcnRUZXh0KCBcIipcIi5yZXBlYXQoNjgpKyBcIiovXCIpXG4gICAgd29yay5lZGl0b3IuaW5zZXJ0TmV3bGluZSgpXG4gICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgI1x0V3JpdGUgdGhlIG1ldGhvZCBuYW1lXG4gICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgbWV0aG9kTmFtZTogKHdvcmssbWV0aG9kKSAtPlxuICAgIGlmIChtZXRob2RbMF0pXG4gICAgICB3b3JrLmVkaXRvci5pbnNlcnRUZXh0KFwiI3ttZXRob2RbMF19IFwiKVxuICAgIGlmICh3b3JrLm5hbWVzcGFjZSlcbiAgICAgIHdvcmsuZWRpdG9yLmluc2VydFRleHQoXCIje21ldGhvZFsxXX1cIiApXG4gICAgZWxzZVxuICAgICAgd29yay5lZGl0b3IuaW5zZXJ0VGV4dChcIiN7d29yay5jbGFzc25hbWV9Ojoje21ldGhvZFsxXX1cIilcbiAgICB3b3JrLmVkaXRvci5pbnNlcnROZXdsaW5lKClcbiAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICAjXHRXcml0ZSB0aGUgYm9keSBvZiB0aGUgaW1wbGVtZW50YXRpb24gb2YgYSBtZXRob2RcbiAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICBtZXRob2RCb2R5OiAod29yaykgLT5cbiAgICB3b3JrLmVkaXRvci5pbnNlcnRUZXh0KFwie1wiKVxuICAgIHdvcmsuZWRpdG9yLmluc2VydE5ld2xpbmUoKVxuICAgIHdvcmsuZWRpdG9yLm1vdmVEb3duKDEpXG4gICAgd29yay5lZGl0b3IuaW5zZXJ0TmV3bGluZSgpXG4gICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgI1x0QWRkIGEgbWV0aG9kIGF0IHRoZSBjdXJzb3IgcG9zaXRpb25cbiAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICB3cml0ZU1ldGhvZDogKHdvcmssbWV0aG9kKSAtPlxuICAgIEBtZXRob2RDb21tZW50KHdvcmspXG4gICAgQG1ldGhvZE5hbWUod29yayxtZXRob2QpXG4gICAgQG1ldGhvZEJvZHkod29yaylcbiAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICAjXHRDcmVhdGUgYWxsIHRoZSBtZXRob2RzIGJhY2sgdG8gYmFja1xuICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gIHdyaXRlQWxsTWV0aG9kczogKHdvcmspIC0+XG4gICAgY3R4ID0gdGhpc1xuICAgIHdvcmsubWV0aG9kcy5mb3JFYWNoIChtZXRob2QpIC0+XG4gICAgICBjdHgud3JpdGVNZXRob2Qod29yayxtZXRob2QsY3R4KVxuICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gICNcdFdyaXRlIHRoZSB3aG9sZSBmaWxlIC5jcHBcbiAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICB3cml0ZUluRWRpdG9yOiAod29yaykgLT5cbiAgICBAY3JlYXRlSGVhZCh3b3JrKVxuICAgIEB3cml0ZUFsbE1ldGhvZHMod29yaylcbiAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICAjXHRnZW5lcmF0ZSBhIHdvcmsgb2JqZWN0XG4gICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgZ2VuZXJhdGVXb3JrOiAtPlxuICAgIGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgIGJ1ZmZlciA9IGVkaXRvci5nZXRCdWZmZXIoKVxuICAgIHdvcmsgPVxuICAgICAge1xuICAgICAgICBlZGl0b3IsXG4gICAgICAgIGJ1ZmZlcixcbiAgICAgICAgaGVhZGVyUGF0aCA6IFwiXCJcbiAgICAgICAgaW1wbGVtZW50YXRpb25QYXRoIDogXCJcIlxuICAgICAgICBjbGFzc25hbWUgOiBcIlwiXG4gICAgICAgIG5hbWVzcGFjZSA6IGZhbHNlXG4gICAgICAgIG1ldGhvZHMgOiBbXVxuICAgICAgfVxuICAgIHJldHVybiB3b3JrXG4gICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgI1x0UmVhZCB0aGUgaGVhZGVyIGZpbGVzIHlvdSBhcmUgaW4gYW5kIGdlbmVyYXRlIGEgLmNwcFxuICAjIGluIHRoZSBzYW1lIHBhdGhcbiAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICBnZW5lcmF0ZTogLT5cbiAgICB3b3JrID0gQGdlbmVyYXRlV29yaygpXG4gICAgd29yay5lZGl0b3Iuc2F2ZSgpXG4gICAgQHJlYWRGaWxlKHdvcmspXG4gICAgd29yay5oZWFkZXJQYXRoID0gd29yay5lZGl0b3IuZ2V0UGF0aCgpXG4gICAgd29yay5pbXBsZW1lbnRhdGlvblBhdGggPSB3b3JrLmhlYWRlclBhdGgucmVwbGFjZShcIi5oXCIsXCIuY3BwXCIpXG4gICAgY3R4ID0gdGhpc1xuICAgIEBjcmVhdGVGaWxlKHdvcmspLnRoZW4gKGVkaXRvcikgLT5cbiAgICAgIHdvcmsuZWRpdG9yID0gZWRpdG9yXG4gICAgICB3b3JrLmJ1ZmZlciA9IHdvcmsuZWRpdG9yLmdldEJ1ZmZlcigpXG4gICAgICBjdHgud3JpdGVJbkVkaXRvcih3b3JrKVxuICAgIHJldHVyblxuXG4gIGFkZDogLT5cbiAgICB3b3JrID0gQGdlbmVyYXRlV29yaygpXG4gICAgd29yay5lZGl0b3Iuc2F2ZVxuICAgIEBmaW5kTmFtZSh3b3JrKVxuICAgIHdvcmsgPSBAZmluZFBhdGgod29yaylcbiAgICBzZXRUaW1lb3V0KGFmdGVyV2FpdCh3b3JrKSw1MDApXG4gICAgcmV0dXJuXG5cbiAgYWZ0ZXJXYWl0OiAod29yaykgLT5cbiAgICBjb25zb2xlLmxvZyh3b3JrKVxuICAgIGNvbnNvbGUubG9nKHdvcmsuaW1wbGVtZW50YXRpb25QYXRoKVxuICAgIHdvcmsuZWRpdG9yLm1vdmVUb0JlZ2lubmluZ09mTGluZSgpXG4gICAgd29yay5lZGl0b3Iuc2VsZWN0VG9FbmRPZkxpbmUoKVxuICAgIHJhbmdlID0gd29yay5lZGl0b3IuZ2V0U2VsZWN0ZWRCdWZmZXJSYW5nZSgpXG4gICAgY3R4ID0gdGhpc1xuICAgIHdvcmsuZWRpdG9yLnNjYW5JbkJ1ZmZlclJhbmdlIEBNRVRIT0RfUEFUVEVSTiwgcmFuZ2UsIChyZXMpIC0+XG4gICAgICBjdHguYWRkTWV0aG9kKHdvcmsscmVzKVxuICAgICAgY29uc29sZS5sb2cod29yay5tZXRob2RzKVxuICAgICAgaWYgKHdvcmsubWV0aG9kID09IFtdKVxuICAgICAgICByZXR1cm5cbiAgICBAY3JlYXRlRmlsZSh3b3JrKS50aGVuIChlZGl0b3IpIC0+XG4gICAgICB3b3JrLmVkaXRvciA9IGVkaXRvclxuICAgICAgd29yay5idWZmZXIgPSB3b3JrLmVkaXRvci5nZXRCdWZmZXIoKVxuICAgICAgd29yay5lZGl0b3IubW92ZVRvQm90dG9tKClcbiAgICAgIGN0eC53cml0ZU1ldGhvZCh3b3JrLHdvcmsubWV0aG9kc1swXSlcbiJdfQ==
