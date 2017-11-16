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
      console.log(work.implementationPath);
      work.editor.moveToBeginningOfLine();
      work.editor.selectToEndOfLine();
      range = work.editor.getSelectedBufferRange();
      ctx = this;
      work.editor.scanInBufferRange(this.METHOD_PATTERN, range, function(res) {
        ctx.addMethod(work, res);
        if (work.method === []) {

        }
      });
      this.createFile(work).then(function(editor) {
        work.editor = editor;
        work.buffer = work.editor.getBuffer();
        work.editor.moveToBottom();
        return ctx.writeMethod(work, work.methods[0]);
      });
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYmlsbHkvZ2l0aHViL2hlYWRlci1pbXBsZW1lbnRhdGlvbi9saWIvaGVhZGVyLWltcGxlbWVudGF0aW9uLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSOztFQUV4QixNQUFNLENBQUMsT0FBUCxHQUVFO0lBQUEsUUFBQSxFQUFVLFNBQUMsS0FBRDtNQUVSLElBQUMsQ0FBQSxhQUFELEdBQWlCLElBQUk7TUFFckIsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFBb0M7UUFBQSxnQ0FBQSxFQUFrQyxDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFBO21CQUFHLEtBQUMsQ0FBQSxRQUFELENBQUE7VUFBSDtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBbEM7T0FBcEMsQ0FBbkI7TUFDQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGdCQUFsQixFQUFvQztRQUFBLDJCQUFBLEVBQTZCLENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUE7bUJBQUcsS0FBQyxDQUFBLEdBQUQsQ0FBQTtVQUFIO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUE3QjtPQUFwQyxDQUFuQjtNQUVBLElBQUMsQ0FBQSxrQkFBRCxHQUFzQjtNQUN0QixJQUFDLENBQUEsY0FBRCxHQUFrQjthQUNsQixJQUFDLENBQUEsaUJBQUQsR0FBcUI7SUFUYixDQUFWO0lBZUEsUUFBQSxFQUFVLFNBQUMsSUFBRDtNQUNSLElBQUksQ0FBQyxVQUFMLEdBQWtCO01BQ2xCLElBQUksQ0FBQyxrQkFBTCxHQUEwQjthQUMxQixJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBb0IsSUFBQyxDQUFBLGlCQUFyQixFQUF3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QUNkLElBQUksQ0FBQyxNQUFMLEdBQWMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFaLENBQUE7UUFDZCxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVosQ0FBQTtlQUNBLEdBQUcsQ0FBQyxXQUFKLENBQWdCLElBQWhCLEVBQXFCLElBQUksQ0FBQyxPQUFRLENBQUEsQ0FBQSxDQUFsQztNQUpxQixDQUF2QjtJQWRHLENBNUpMOztBQUpGIiwic291cmNlc0NvbnRlbnQiOlsie0NvbXBvc2l0ZURpc3Bvc2FibGV9ID0gcmVxdWlyZSAnYXRvbSdcblxubW9kdWxlLmV4cG9ydHMgPVxuXG4gIGFjdGl2YXRlOiAoc3RhdGUpIC0+XG4gICAgIyBFdmVudHMgc3Vic2NyaWJlZCB0byBpbiBhdG9tJ3Mgc3lzdGVtIGNhbiBiZSBlYXNpbHkgY2xlYW5lZCB1cCB3aXRoIGEgQ29tcG9zaXRlRGlzcG9zYWJsZVxuICAgIEBzdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGVcbiAgICAjIFJlZ2lzdGVyIGNvbW1hbmQgdGhhdCB0b2dnbGVzIHRoaXMgdmlld1xuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS13b3Jrc3BhY2UnLCAnaGVhZGVyLWltcGxlbWVudGF0aW9uOmdlbmVyYXRlJzogPT4gQGdlbmVyYXRlKClcbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20td29ya3NwYWNlJywgJ2hlYWRlci1pbXBsZW1lbnRhdGlvbjphZGQnOiA9PiBAYWRkKClcbiAgICAjIFJlZ0V4IFBhdHRlcm5zXG4gICAgQENMQVNTX05BTUVfUEFUVEVSTiA9IC8oKD86bmFtZXNwYWNlfGNsYXNzKSkrXFxzKyhbXFx3X10rKStcXHMqey9nXG4gICAgQE1FVEhPRF9QQVRURVJOID0gL15cXHMqKCg/OmNvbnN0fHN0YXRpY3x2aXJ0dWFsfHZvbGF0aWxlfGZyaWVuZCl7MCw1fVxccypcXHcrKD86OnsyfVxcdyspezAsfVxccypcXCoqJj8pP1xccysoW1xcd35dKylcXHMqKFxcKC4qXFwpKVxccyo/KCBjb25zdCk/Oy9nbVxuICAgIEBGSUxFX05BTUVfUEFUVEVSTiA9IC8oW1xcd10rKVxcLihbaHxjcHBdKykvXG5cbiAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICAjIEZpbmQgdGhlIFBhcmggb2YgdGhlIHNvdXJjZSBmaWxlIGFuZCB0aGUgaGVhZGVycyBmaWxlXG4gICMgcmV0dXJuIGVtcHR5IGlmIG5vdGhpbmcgaXMgZm91bmRcbiAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICBmaW5kUGF0aDogKHdvcmspIC0+XG4gICAgd29yay5oZWFkZXJQYXRoID0gXCJcIlxuICAgIHdvcmsuaW1wbGVtZW50YXRpb25QYXRoID0gXCJcIlxuICAgIGF0b20ud29ya3NwYWNlLnNjYW4gQEZJTEVfTkFNRV9QQVRURVJOLCAoZmlsZSkgLT5cbiAgICAgIGlmIChmaWxlLmZpbGVQYXRoLmluY2x1ZGVzKFwiI3t3b3JrLmNsYXNzbmFtZX0uaFwiKSlcbiAgICAgICAgd29yay5oZWFkZXJQYXRoID0gZmlsZS5maWxlUGF0aFxuICAgICAgaWYgKGZpbGUuZmlsZVBhdGguaW5jbHVkZXMoXCIje3dvcmsuY2xhc3NuYW1lfS5jcHBcIikpXG4gICAgICAgIHdvcmsuaW1wbGVtZW50YXRpb25QYXRoID0gZmlsZS5maWxlUGF0aFxuXG4gICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgI1x0RmluZCB3ZXRoZXIgaXQgaXMgYSBuYW1lc3BhY2Ugb3IgYSBjbGFzc2UgYW5kIGFkZCBpdHMgbmFtZSB0byB3b3JrXG4gICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgZmluZE5hbWU6ICh3b3JrKSAtPlxuICAgIHdvcmsuYnVmZmVyLnNjYW4gQENMQVNTX05BTUVfUEFUVEVSTiwgKHJlcykgLT5cbiAgICAgIHdvcmsubmFtZXNwYWNlID0gcmVzLm1hdGNoWzFdID09IFwibmFtZXNwYWNlXCJcbiAgICAgIHdvcmsuY2xhc3NuYW1lID0gcmVzLm1hdGNoWzJdXG4gICAgd29yay5lZGl0b3IubW92ZVRvRW5kT2ZMaW5lKClcbiAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICAjXHRGaW5kIGFsbCB0aGUgbWV0aG9kcyB0aGF0IG1hdGNoIHRoZSBwYXR0ZXJuIGFuZCBhZGQgdGhlbVxuICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gIGZpbmRBbGxNZXRob2RzOiAod29yaykgLT5cbiAgICBjdHggPSB0aGlzXG4gICAgd29yay5idWZmZXIuc2NhbiBATUVUSE9EX1BBVFRFUk4sIChyZXMpIC0+XG4gICAgICBjdHguYWRkTWV0aG9kKHdvcmsscmVzKVxuICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gICNcdGFkZCBhIG1ldGhvZCB0byB0aGUgd29ya3NwYWNlIGZyb20gYSByZWdleCBtYXRjaFxuICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gIGFkZE1ldGhvZDogKHdvcmsscmVzKSAtPlxuICAgIG1ldGhvZCA9IFtdXG4gICAgbWV0aG9kLnB1c2goKHJlcy5tYXRjaFsxXXx8XCJcIikucmVwbGFjZShcInN0YXRpYyBcIiwgXCJcIikucmVwbGFjZSgvXFxzezIsfS8sIFwiIFwiKSB8fCBcIlwiKVxuICAgIG1ldGhvZC5wdXNoKHJlcy5tYXRjaFsyXSArIHJlcy5tYXRjaFszXSArIChyZXMubWF0Y2hbNF18fFwiXCIpKVxuICAgIGNvbnNvbGUubG9nKG1ldGhvZClcbiAgICB3b3JrLm1ldGhvZHMucHVzaChtZXRob2QpXG4gICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgI1x0RmluZCBib3RoIG5hbWUgYW5kIG1ldGhvZHNcbiAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICByZWFkRmlsZTogKHdvcmspIC0+XG4gICAgQGZpbmROYW1lKHdvcmspXG4gICAgQGZpbmRBbGxNZXRob2RzKHdvcmspXG4gICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgI1x0UmV0dXJuIGEgcHJvbWlzZSB0b3dhcmQgYSBuZXcgLmNwcCBmaWxlIG9wZW5cbiAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICBjcmVhdGVGaWxlOiAod29yaykgLT5cbiAgICByZXR1cm4gYXRvbS53b3Jrc3BhY2Uub3Blbih3b3JrLmltcGxlbWVudGF0aW9uUGF0aClcbiAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICAjIFdyaXRlIHRoZSBoZWFkIG9mIGEgLmNwcCBmaWxlIGRlcGVuZGluZyBvbiBpZlxuICAjIGl0J3MgYSBuYW1lc3BhY2Ugb3IgYSBjbGFzc1xuICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gIGNyZWF0ZUhlYWQ6ICh3b3JrKSAtPlxuICAgIHdvcmsuZWRpdG9yLmluc2VydFRleHQoXCIjaW5jbHVkZSBcXFwiI3t3b3JrLmNsYXNzbmFtZX0uaFxcXCJcIilcbiAgICB3b3JrLmVkaXRvci5pbnNlcnROZXdsaW5lKClcbiAgICB3b3JrLmVkaXRvci5pbnNlcnROZXdsaW5lKClcbiAgICB3b3JrLmVkaXRvci5pbnNlcnROZXdsaW5lKClcbiAgICBpZiAod29yay5uYW1lc3BhY2UpXG4gICAgICB3b3JrLmVkaXRvci5pbnNlcnRUZXh0KFwibmFtZXNwYWNlICN7d29yay5jbGFzc25hbWV9XCIpXG4gICAgICB3b3JrLmVkaXRvci5pbnNlcnROZXdsaW5lKClcbiAgICAgIHdvcmsuZWRpdG9yLmluc2VydFRleHQoXCJ7XCIpXG4gICAgICB3b3JrLmVkaXRvci5pbnNlcnROZXdsaW5lKClcbiAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICAjIEluc2VydCBhIGNvbW1lbnQgbGluZSBvbiB0b3Agb2YgYSBtZXRob2RcbiAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICBtZXRob2RDb21tZW50OiAod29yaykgLT5cbiAgICB3b3JrLmVkaXRvci5pbnNlcnRUZXh0KFwiLypcIiArIFwiKlwiLnJlcGVhdCg2OCkpXG4gICAgd29yay5lZGl0b3IuaW5zZXJ0TmV3bGluZSgpXG4gICAgd29yay5lZGl0b3IuaW5zZXJ0VGV4dChcIiogQ29tbWVudFwiKVxuICAgIHdvcmsuZWRpdG9yLmluc2VydE5ld2xpbmUoKVxuICAgIHdvcmsuZWRpdG9yLmluc2VydFRleHQoIFwiKlwiLnJlcGVhdCg2OCkrIFwiKi9cIilcbiAgICB3b3JrLmVkaXRvci5pbnNlcnROZXdsaW5lKClcbiAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICAjXHRXcml0ZSB0aGUgbWV0aG9kIG5hbWVcbiAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICBtZXRob2ROYW1lOiAod29yayxtZXRob2QpIC0+XG4gICAgaWYgKG1ldGhvZFswXSlcbiAgICAgIHdvcmsuZWRpdG9yLmluc2VydFRleHQoXCIje21ldGhvZFswXX0gXCIpXG4gICAgaWYgKHdvcmsubmFtZXNwYWNlKVxuICAgICAgd29yay5lZGl0b3IuaW5zZXJ0VGV4dChcIiN7bWV0aG9kWzFdfVwiIClcbiAgICBlbHNlXG4gICAgICB3b3JrLmVkaXRvci5pbnNlcnRUZXh0KFwiI3t3b3JrLmNsYXNzbmFtZX06OiN7bWV0aG9kWzFdfVwiKVxuICAgIHdvcmsuZWRpdG9yLmluc2VydE5ld2xpbmUoKVxuICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gICNcdFdyaXRlIHRoZSBib2R5IG9mIHRoZSBpbXBsZW1lbnRhdGlvbiBvZiBhIG1ldGhvZFxuICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gIG1ldGhvZEJvZHk6ICh3b3JrKSAtPlxuICAgIHdvcmsuZWRpdG9yLmluc2VydFRleHQoXCJ7XCIpXG4gICAgd29yay5lZGl0b3IuaW5zZXJ0TmV3bGluZSgpXG4gICAgd29yay5lZGl0b3IubW92ZURvd24oMSlcbiAgICB3b3JrLmVkaXRvci5pbnNlcnROZXdsaW5lKClcbiAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICAjXHRBZGQgYSBtZXRob2QgYXQgdGhlIGN1cnNvciBwb3NpdGlvblxuICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gIHdyaXRlTWV0aG9kOiAod29yayxtZXRob2QpIC0+XG4gICAgQG1ldGhvZENvbW1lbnQod29yaylcbiAgICBAbWV0aG9kTmFtZSh3b3JrLG1ldGhvZClcbiAgICBAbWV0aG9kQm9keSh3b3JrKVxuICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gICNcdENyZWF0ZSBhbGwgdGhlIG1ldGhvZHMgYmFjayB0byBiYWNrXG4gICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgd3JpdGVBbGxNZXRob2RzOiAod29yaykgLT5cbiAgICBjdHggPSB0aGlzXG4gICAgd29yay5tZXRob2RzLmZvckVhY2ggKG1ldGhvZCkgLT5cbiAgICAgIGN0eC53cml0ZU1ldGhvZCh3b3JrLG1ldGhvZCxjdHgpXG4gICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgI1x0V3JpdGUgdGhlIHdob2xlIGZpbGUgLmNwcFxuICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gIHdyaXRlSW5FZGl0b3I6ICh3b3JrKSAtPlxuICAgIEBjcmVhdGVIZWFkKHdvcmspXG4gICAgQHdyaXRlQWxsTWV0aG9kcyh3b3JrKVxuICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gICNcdGdlbmVyYXRlIGEgd29yayBvYmplY3RcbiAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICBnZW5lcmF0ZVdvcms6IC0+XG4gICAgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgYnVmZmVyID0gZWRpdG9yLmdldEJ1ZmZlcigpXG4gICAgd29yayA9XG4gICAgICB7XG4gICAgICAgIGVkaXRvcixcbiAgICAgICAgYnVmZmVyLFxuICAgICAgICBoZWFkZXJQYXRoIDogXCJcIlxuICAgICAgICBpbXBsZW1lbnRhdGlvblBhdGggOiBcIlwiXG4gICAgICAgIGNsYXNzbmFtZSA6IFwiXCJcbiAgICAgICAgbmFtZXNwYWNlIDogZmFsc2VcbiAgICAgICAgbWV0aG9kcyA6IFtdXG4gICAgICB9XG4gICAgcmV0dXJuIHdvcmtcbiAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICAjXHRSZWFkIHRoZSBoZWFkZXIgZmlsZXMgeW91IGFyZSBpbiBhbmQgZ2VuZXJhdGUgYSAuY3BwXG4gICMgaW4gdGhlIHNhbWUgcGF0aFxuICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gIGdlbmVyYXRlOiAtPlxuICAgIHdvcmsgPSBAZ2VuZXJhdGVXb3JrKClcbiAgICB3b3JrLmVkaXRvci5zYXZlKClcbiAgICBAcmVhZEZpbGUod29yaylcbiAgICB3b3JrLmhlYWRlclBhdGggPSB3b3JrLmVkaXRvci5nZXRQYXRoKClcbiAgICB3b3JrLmltcGxlbWVudGF0aW9uUGF0aCA9IHdvcmsuaGVhZGVyUGF0aC5yZXBsYWNlKFwiLmhcIixcIi5jcHBcIilcbiAgICBjdHggPSB0aGlzXG4gICAgQGNyZWF0ZUZpbGUod29yaykudGhlbiAoZWRpdG9yKSAtPlxuICAgICAgd29yay5lZGl0b3IgPSBlZGl0b3JcbiAgICAgIHdvcmsuYnVmZmVyID0gd29yay5lZGl0b3IuZ2V0QnVmZmVyKClcbiAgICAgIGN0eC53cml0ZUluRWRpdG9yKHdvcmspXG4gICAgcmV0dXJuXG5cbiAgYWRkOiAtPlxuICAgIHdvcmsgPSBAZ2VuZXJhdGVXb3JrKClcbiAgICB3b3JrLmVkaXRvci5zYXZlXG4gICAgQGZpbmROYW1lKHdvcmspXG4gICAgQGZpbmRQYXRoKHdvcmspXG4gICAgY29uc29sZS5sb2cod29yay5pbXBsZW1lbnRhdGlvblBhdGgpXG4gICAgd29yay5lZGl0b3IubW92ZVRvQmVnaW5uaW5nT2ZMaW5lKClcbiAgICB3b3JrLmVkaXRvci5zZWxlY3RUb0VuZE9mTGluZSgpXG4gICAgcmFuZ2UgPSB3b3JrLmVkaXRvci5nZXRTZWxlY3RlZEJ1ZmZlclJhbmdlKClcbiAgICBjdHggPSB0aGlzXG4gICAgd29yay5lZGl0b3Iuc2NhbkluQnVmZmVyUmFuZ2UgQE1FVEhPRF9QQVRURVJOLCByYW5nZSwgKHJlcykgLT5cbiAgICAgIGN0eC5hZGRNZXRob2Qod29yayxyZXMpXG4gICAgICBpZiAod29yay5tZXRob2QgPT0gW10pXG4gICAgICAgIHJldHVyblxuICAgIEBjcmVhdGVGaWxlKHdvcmspLnRoZW4gKGVkaXRvcikgLT5cbiAgICAgIHdvcmsuZWRpdG9yID0gZWRpdG9yXG4gICAgICB3b3JrLmJ1ZmZlciA9IHdvcmsuZWRpdG9yLmdldEJ1ZmZlcigpXG4gICAgICB3b3JrLmVkaXRvci5tb3ZlVG9Cb3R0b20oKVxuICAgICAgY3R4LndyaXRlTWV0aG9kKHdvcmssd29yay5tZXRob2RzWzBdKVxuICAgIHJldHVyblxuIl19
