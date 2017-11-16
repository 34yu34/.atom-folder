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
      this.CLASS_NAME_PATTERN = /((?:namespace|class))+\s+([\w_]+)+\s*{/g;
      this.METHOD_PATTERN = /^\s*((?:const|static|virtual|volatile|friend){0,5}\s*\w+(?::{2}\w+){0,}\s*\**&?)?\s+([\w~]+)\s*(\(.*\))\s*?( const)?;/gm;
      return this.FILE_NAME_PATTERN = /([\w]+)\.([h|cpp]+)/;
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
      console.log(method);
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
      var ctx, range, work;
      work = this.generateWork();
      work.editor.save;
      this.findName(work);
      this.findPath(work);
      work.editor.moveToBeginningOfLine();
      work.editor.selectToEndOfLine();
      range = work.editor.getSelectedBufferRange();
      ctx = this;
      work.editor.scanInBufferRange(this.METHOD_PATTERN, range, function(res) {
        ctx.addMethod(work, res);
        if (work.mehtod === []) {

        }
      });
      this.createFile(work).then(function(editor) {
        work.editor = editor;
        work.buffer = work.editor.getBuffer();
        work.editor.moveToBottom();
        return ctx.writeMethod();
      });
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYmlsbHkvZ2l0aHViL2hlYWRlci1pbXBsZW1lbnRhdGlvbi9saWIvaGVhZGVyLWltcGxlbWVudGF0aW9uLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSOztFQUV4QixNQUFNLENBQUMsT0FBUCxHQUVFO0lBQUEsUUFBQSxFQUFVLFNBQUMsS0FBRDtNQUVSLElBQUMsQ0FBQSxhQUFELEdBQWlCLElBQUk7TUFFckIsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFBb0M7UUFBQSxnQ0FBQSxFQUFrQyxDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFBO21CQUFHLEtBQUMsQ0FBQSxRQUFELENBQUE7VUFBSDtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBbEM7T0FBcEMsQ0FBbkI7TUFDQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGdCQUFsQixFQUFvQztRQUFBLDJCQUFBLEVBQTZCLENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUE7bUJBQUcsS0FBQyxDQUFBLEdBQUQsQ0FBQTtVQUFIO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUE3QjtPQUFwQyxDQUFuQjtNQUVBLElBQUMsQ0FBQSxrQkFBRCxHQUFzQjtNQUN0QixJQUFDLENBQUEsY0FBRCxHQUFrQjthQUNsQixJQUFDLENBQUEsaUJBQUQsR0FBcUI7SUFUYixDQUFWO0lBZUEsUUFBQSxFQUFVLFNBQUMsSUFBRDtNQUNSLElBQUksQ0FBQyxVQUFMLEdBQWtCO01BQ2xCLElBQUksQ0FBQyxrQkFBTCxHQUEwQjthQUMxQixJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBb0IsSUFBQyxDQUFBLGlCQUFyQixFQUF3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QyxTQUFaLENBQUE7UUFDZCxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVosQ0FBQTtlQUNBLEdBQUcsQ0FBQyxXQUFKLENBQUE7TUFKcUIsQ0FBdkI7SUFiRyxDQTVKTDs7QUFKRiIsInNvdXJjZXNDb250ZW50IjpbIntDb21wb3NpdGVEaXNwb3NhYmxlfSA9IHJlcXVpcmUgJ2F0b20nXG5cbm1vZHVsZS5leHBvcnRzID1cblxuICBhY3RpdmF0ZTogKHN0YXRlKSAtPlxuICAgICMgRXZlbnRzIHN1YnNjcmliZWQgdG8gaW4gYXRvbSdzIHN5c3RlbSBjYW4gYmUgZWFzaWx5IGNsZWFuZWQgdXAgd2l0aCBhIENvbXBvc2l0ZURpc3Bvc2FibGVcbiAgICBAc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlXG4gICAgIyBSZWdpc3RlciBjb21tYW5kIHRoYXQgdG9nZ2xlcyB0aGlzIHZpZXdcbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20td29ya3NwYWNlJywgJ2hlYWRlci1pbXBsZW1lbnRhdGlvbjpnZW5lcmF0ZSc6ID0+IEBnZW5lcmF0ZSgpXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29tbWFuZHMuYWRkICdhdG9tLXdvcmtzcGFjZScsICdoZWFkZXItaW1wbGVtZW50YXRpb246YWRkJzogPT4gQGFkZCgpXG4gICAgIyBSZWdFeCBQYXR0ZXJuc1xuICAgIEBDTEFTU19OQU1FX1BBVFRFUk4gPSAvKCg/Om5hbWVzcGFjZXxjbGFzcykpK1xccysoW1xcd19dKykrXFxzKnsvZ1xuICAgIEBNRVRIT0RfUEFUVEVSTiA9IC9eXFxzKigoPzpjb25zdHxzdGF0aWN8dmlydHVhbHx2b2xhdGlsZXxmcmllbmQpezAsNX1cXHMqXFx3Kyg/Ojp7Mn1cXHcrKXswLH1cXHMqXFwqKiY/KT9cXHMrKFtcXHd+XSspXFxzKihcXCguKlxcKSlcXHMqPyggY29uc3QpPzsvZ21cbiAgICBARklMRV9OQU1FX1BBVFRFUk4gPSAvKFtcXHddKylcXC4oW2h8Y3BwXSspL1xuXG4gICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgIyBGaW5kIHRoZSBQYXJoIG9mIHRoZSBzb3VyY2UgZmlsZSBhbmQgdGhlIGhlYWRlcnMgZmlsZVxuICAjIHJldHVybiBlbXB0eSBpZiBub3RoaW5nIGlzIGZvdW5kXG4gICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgZmluZFBhdGg6ICh3b3JrKSAtPlxuICAgIHdvcmsuaGVhZGVyUGF0aCA9IFwiXCJcbiAgICB3b3JrLmltcGxlbWVudGF0aW9uUGF0aCA9IFwiXCJcbiAgICBhdG9tLndvcmtzcGFjZS5zY2FuIEBGSUxFX05BTUVfUEFUVEVSTiwgKGZpbGUpIC0+XG4gICAgICBpZiAoZmlsZS5maWxlUGF0aC5pbmNsdWRlcyhcIiN7d29yay5jbGFzc25hbWV9LmhcIikpXG4gICAgICAgIHdvcmsuaGVhZGVyUGF0aCA9IGZpbGUuZmlsZVBhdGhcbiAgICAgIGlmIChmaWxlLmZpbGVQYXRoLmluY2x1ZGVzKFwiI3t3b3JrLmNsYXNzbmFtZX0uY3BwXCIpKVxuICAgICAgICB3b3JrLmltcGxlbWVudGF0aW9uUGF0aCA9IGZpbGUuZmlsZVBhdGhcblxuICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gICNcdEZpbmQgd2V0aGVyIGl0IGlzIGEgbmFtZXNwYWNlIG9yIGEgY2xhc3NlIGFuZCBhZGQgaXRzIG5hbWUgdG8gd29ya1xuICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gIGZpbmROYW1lOiAod29yaykgLT5cbiAgICB3b3JrLmJ1ZmZlci5zY2FuIEBDTEFTU19OQU1FX1BBVFRFUk4sIChyZXMpIC0+XG4gICAgICB3b3JrLm5hbWVzcGFjZSA9IHJlcy5tYXRjaFsxXSA9PSBcIm5hbWVzcGFjZVwiXG4gICAgICB3b3JrLmNsYXNzbmFtZSA9IHJlcy5tYXRjaFsyXVxuICAgIHdvcmsuZWRpdG9yLm1vdmVUb0VuZE9mTGluZSgpXG4gICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgI1x0RmluZCBhbGwgdGhlIG1ldGhvZHMgdGhhdCBtYXRjaCB0aGUgcGF0dGVybiBhbmQgYWRkIHRoZW1cbiAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICBmaW5kQWxsTWV0aG9kczogKHdvcmspIC0+XG4gICAgY3R4ID0gdGhpc1xuICAgIHdvcmsuYnVmZmVyLnNjYW4gQE1FVEhPRF9QQVRURVJOLCAocmVzKSAtPlxuICAgICAgY3R4LmFkZE1ldGhvZCh3b3JrLHJlcylcbiAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICAjXHRhZGQgYSBtZXRob2QgdG8gdGhlIHdvcmtzcGFjZSBmcm9tIGEgcmVnZXggbWF0Y2hcbiAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICBhZGRNZXRob2Q6ICh3b3JrLHJlcykgLT5cbiAgICBtZXRob2QgPSBbXVxuICAgIG1ldGhvZC5wdXNoKChyZXMubWF0Y2hbMV18fFwiXCIpLnJlcGxhY2UoXCJzdGF0aWMgXCIsIFwiXCIpLnJlcGxhY2UoL1xcc3syLH0vLCBcIiBcIikgfHwgXCJcIilcbiAgICBtZXRob2QucHVzaChyZXMubWF0Y2hbMl0gKyByZXMubWF0Y2hbM10gKyAocmVzLm1hdGNoWzRdfHxcIlwiKSlcbiAgICBjb25zb2xlLmxvZyhtZXRob2QpXG4gICAgd29yay5tZXRob2RzLnB1c2gobWV0aG9kKVxuICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gICNcdEZpbmQgYm90aCBuYW1lIGFuZCBtZXRob2RzXG4gICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgcmVhZEZpbGU6ICh3b3JrKSAtPlxuICAgIEBmaW5kTmFtZSh3b3JrKVxuICAgIEBmaW5kQWxsTWV0aG9kcyh3b3JrKVxuICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gICNcdFJldHVybiBhIHByb21pc2UgdG93YXJkIGEgbmV3IC5jcHAgZmlsZSBvcGVuXG4gICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgY3JlYXRlRmlsZTogKHdvcmspIC0+XG4gICAgcmV0dXJuIGF0b20ud29ya3NwYWNlLm9wZW4od29yay5pbXBsZW1lbnRhdGlvblBhdGgpXG4gICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgIyBXcml0ZSB0aGUgaGVhZCBvZiBhIC5jcHAgZmlsZSBkZXBlbmRpbmcgb24gaWZcbiAgIyBpdCdzIGEgbmFtZXNwYWNlIG9yIGEgY2xhc3NcbiAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICBjcmVhdGVIZWFkOiAod29yaykgLT5cbiAgICB3b3JrLmVkaXRvci5pbnNlcnRUZXh0KFwiI2luY2x1ZGUgXFxcIiN7d29yay5jbGFzc25hbWV9LmhcXFwiXCIpXG4gICAgd29yay5lZGl0b3IuaW5zZXJ0TmV3bGluZSgpXG4gICAgd29yay5lZGl0b3IuaW5zZXJ0TmV3bGluZSgpXG4gICAgd29yay5lZGl0b3IuaW5zZXJ0TmV3bGluZSgpXG4gICAgaWYgKHdvcmsubmFtZXNwYWNlKVxuICAgICAgd29yay5lZGl0b3IuaW5zZXJ0VGV4dChcIm5hbWVzcGFjZSAje3dvcmsuY2xhc3NuYW1lfVwiKVxuICAgICAgd29yay5lZGl0b3IuaW5zZXJ0TmV3bGluZSgpXG4gICAgICB3b3JrLmVkaXRvci5pbnNlcnRUZXh0KFwie1wiKVxuICAgICAgd29yay5lZGl0b3IuaW5zZXJ0TmV3bGluZSgpXG4gICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgIyBJbnNlcnQgYSBjb21tZW50IGxpbmUgb24gdG9wIG9mIGEgbWV0aG9kXG4gICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgbWV0aG9kQ29tbWVudDogKHdvcmspIC0+XG4gICAgd29yay5lZGl0b3IuaW5zZXJ0VGV4dChcIi8qXCIgKyBcIipcIi5yZXBlYXQoNjgpKVxuICAgIHdvcmsuZWRpdG9yLmluc2VydE5ld2xpbmUoKVxuICAgIHdvcmsuZWRpdG9yLmluc2VydFRleHQoXCIqIENvbW1lbnRcIilcbiAgICB3b3JrLmVkaXRvci5pbnNlcnROZXdsaW5lKClcbiAgICB3b3JrLmVkaXRvci5pbnNlcnRUZXh0KCBcIipcIi5yZXBlYXQoNjgpKyBcIiovXCIpXG4gICAgd29yay5lZGl0b3IuaW5zZXJ0TmV3bGluZSgpXG4gICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgI1x0V3JpdGUgdGhlIG1ldGhvZCBuYW1lXG4gICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgbWV0aG9kTmFtZTogKHdvcmssbWV0aG9kKSAtPlxuICAgIGlmIChtZXRob2RbMF0pXG4gICAgICB3b3JrLmVkaXRvci5pbnNlcnRUZXh0KFwiI3ttZXRob2RbMF19IFwiKVxuICAgIGlmICh3b3JrLm5hbWVzcGFjZSlcbiAgICAgIHdvcmsuZWRpdG9yLmluc2VydFRleHQoXCIje21ldGhvZFsxXX1cIiApXG4gICAgZWxzZVxuICAgICAgd29yay5lZGl0b3IuaW5zZXJ0VGV4dChcIiN7d29yay5jbGFzc25hbWV9Ojoje21ldGhvZFsxXX1cIilcbiAgICB3b3JrLmVkaXRvci5pbnNlcnROZXdsaW5lKClcbiAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICAjXHRXcml0ZSB0aGUgYm9keSBvZiB0aGUgaW1wbGVtZW50YXRpb24gb2YgYSBtZXRob2RcbiAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICBtZXRob2RCb2R5OiAod29yaykgLT5cbiAgICB3b3JrLmVkaXRvci5pbnNlcnRUZXh0KFwie1wiKVxuICAgIHdvcmsuZWRpdG9yLmluc2VydE5ld2xpbmUoKVxuICAgIHdvcmsuZWRpdG9yLm1vdmVEb3duKDEpXG4gICAgd29yay5lZGl0b3IuaW5zZXJ0TmV3bGluZSgpXG4gICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgI1x0QWRkIGEgbWV0aG9kIGF0IHRoZSBjdXJzb3IgcG9zaXRpb25cbiAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICB3cml0ZU1ldGhvZDogKHdvcmssbWV0aG9kKSAtPlxuICAgIEBtZXRob2RDb21tZW50KHdvcmspXG4gICAgQG1ldGhvZE5hbWUod29yayxtZXRob2QpXG4gICAgQG1ldGhvZEJvZHkod29yaylcbiAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICAjXHRDcmVhdGUgYWxsIHRoZSBtZXRob2RzIGJhY2sgdG8gYmFja1xuICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gIHdyaXRlQWxsTWV0aG9kczogKHdvcmspIC0+XG4gICAgY3R4ID0gdGhpc1xuICAgIHdvcmsubWV0aG9kcy5mb3JFYWNoIChtZXRob2QpIC0+XG4gICAgICBjdHgud3JpdGVNZXRob2Qod29yayxtZXRob2QsY3R4KVxuICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gICNcdFdyaXRlIHRoZSB3aG9sZSBmaWxlIC5jcHBcbiAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICB3cml0ZUluRWRpdG9yOiAod29yaykgLT5cbiAgICBAY3JlYXRlSGVhZCh3b3JrKVxuICAgIEB3cml0ZUFsbE1ldGhvZHMod29yaylcbiAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICAjXHRnZW5lcmF0ZSBhIHdvcmsgb2JqZWN0XG4gICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgZ2VuZXJhdGVXb3JrOiAtPlxuICAgIGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgIGJ1ZmZlciA9IGVkaXRvci5nZXRCdWZmZXIoKVxuICAgIHdvcmsgPVxuICAgICAge1xuICAgICAgICBlZGl0b3IsXG4gICAgICAgIGJ1ZmZlcixcbiAgICAgICAgaGVhZGVyUGF0aCA6IFwiXCJcbiAgICAgICAgaW1wbGVtZW50YXRpb25QYXRoIDogXCJcIlxuICAgICAgICBjbGFzc25hbWUgOiBcIlwiXG4gICAgICAgIG5hbWVzcGFjZSA6IGZhbHNlXG4gICAgICAgIG1ldGhvZHMgOiBbXVxuICAgICAgfVxuICAgIHJldHVybiB3b3JrXG4gICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgI1x0UmVhZCB0aGUgaGVhZGVyIGZpbGVzIHlvdSBhcmUgaW4gYW5kIGdlbmVyYXRlIGEgLmNwcFxuICAjIGluIHRoZSBzYW1lIHBhdGhcbiAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICBnZW5lcmF0ZTogLT5cbiAgICB3b3JrID0gQGdlbmVyYXRlV29yaygpXG4gICAgd29yay5lZGl0b3Iuc2F2ZSgpXG4gICAgQHJlYWRGaWxlKHdvcmspXG4gICAgd29yay5oZWFkZXJQYXRoID0gd29yay5lZGl0b3IuZ2V0UGF0aCgpXG4gICAgd29yay5pbXBsZW1lbnRhdGlvblBhdGggPSB3b3JrLmhlYWRlclBhdGgucmVwbGFjZShcIi5oXCIsXCIuY3BwXCIpXG4gICAgY3R4ID0gdGhpc1xuICAgIEBjcmVhdGVGaWxlKHdvcmspLnRoZW4gKGVkaXRvcikgLT5cbiAgICAgIHdvcmsuZWRpdG9yID0gZWRpdG9yXG4gICAgICB3b3JrLmJ1ZmZlciA9IHdvcmsuZWRpdG9yLmdldEJ1ZmZlcigpXG4gICAgICBjdHgud3JpdGVJbkVkaXRvcih3b3JrKVxuICAgIHJldHVyblxuXG4gIGFkZDogLT5cbiAgICB3b3JrID0gQGdlbmVyYXRlV29yaygpXG4gICAgd29yay5lZGl0b3Iuc2F2ZVxuICAgIEBmaW5kTmFtZSh3b3JrKVxuICAgIEBmaW5kUGF0aCh3b3JrKVxuICAgIHdvcmsuZWRpdG9yLm1vdmVUb0JlZ2lubmluZ09mTGluZSgpXG4gICAgd29yay5lZGl0b3Iuc2VsZWN0VG9FbmRPZkxpbmUoKVxuICAgIHJhbmdlID0gd29yay5lZGl0b3IuZ2V0U2VsZWN0ZWRCdWZmZXJSYW5nZSgpXG4gICAgY3R4ID0gdGhpc1xuICAgIHdvcmsuZWRpdG9yLnNjYW5JbkJ1ZmZlclJhbmdlIEBNRVRIT0RfUEFUVEVSTiwgcmFuZ2UsIChyZXMpIC0+XG4gICAgICBjdHguYWRkTWV0aG9kKHdvcmsscmVzKVxuICAgICAgaWYgd29yay5tZWh0b2QgPT0gW11cbiAgICAgICAgcmV0dXJuXG4gICAgQGNyZWF0ZUZpbGUod29yaykudGhlbiAoZWRpdG9yKSAtPlxuICAgICAgd29yay5lZGl0b3IgPSBlZGl0b3JcbiAgICAgIHdvcmsuYnVmZmVyID0gd29yay5lZGl0b3IuZ2V0QnVmZmVyKClcbiAgICAgIHdvcmsuZWRpdG9yLm1vdmVUb0JvdHRvbSgpXG4gICAgICBjdHgud3JpdGVNZXRob2QoKVxuICAgIHJldHVyblxuIl19
