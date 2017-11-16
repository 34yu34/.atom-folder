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
      return atom.workspace.scan(this.CLASS_NAME_PATTERN, function(file) {
        console.log(file);
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
      var ctx, range, work;
      work = this.generateWork();
      work.editor.save;
      this.findName(work);
      this.findPath(work);
      console.log(work.implementationPath);
      console.log(work.headerPath);
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYmlsbHkvZ2l0aHViL2hlYWRlci1pbXBsZW1lbnRhdGlvbi9saWIvaGVhZGVyLWltcGxlbWVudGF0aW9uLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSOztFQUV4QixNQUFNLENBQUMsT0FBUCxHQUVFO0lBQUEsUUFBQSxFQUFVLFNBQUMsS0FBRDtNQUVSLElBQUMsQ0FBQSxhQUFELEdBQWlCLElBQUk7TUFFckIsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFBb0M7UUFBQSxnQ0FBQSxFQUFrQyxDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFBO21CQUFHLEtBQUMsQ0FBQSxRQUFELENBQUE7VUFBSDtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBbEM7T0FBcEMsQ0FBbkI7TUFDQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGdCQUFsQixFQUFvQztRQUFBLDJCQUFBLEVBQTZCLENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUE7bUJBQUcsS0FBQyxDQUFBLEdBQUQsQ0FBQTtVQUFIO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUE3QjtPQUFwQyxDQUFuQjtNQUVBLElBQUMsQ0FBQSxrQkFBRCxHQUFzQjtNQUN0QixJQUFDLENBQUEsY0FBRCxHQUFrQjthQUNsQixJQUFDLENBQUEsaUJBQUQsR0FBcUI7SUFUYixDQUFWO0lBZUEsUUFBQSxFQUFVLFNBQUMsSUFBRDtNQUNSLElBQUksQ0FBQyxVQUFMLEdBQWtCO01BQ2xCLElBQUksQ0FBQyxrQkFBTCxHQUEwQjthQUMxQixJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBb0IsSUFBQyxDQUFBLGtCQUFyQixFQUF5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QXVCLFNBQUMsTUFBRDtRQUNyQixJQUFJLENBQUMsTUFBTCxHQUFjO1FBQ2QsSUFBSSxDQUFDLE1BQUwsR0FBYyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVosQ0FBQTtRQUNkLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWixDQUFBO2VBQ0EsR0FBRyxDQUFDLFdBQUosQ0FBZ0IsSUFBaEIsRUFBcUIsSUFBSSxDQUFDLE9BQVEsQ0FBQSxDQUFBLENBQWxDO01BSnFCLENBQXZCO0lBZkcsQ0E1Skw7O0FBSkYiLCJzb3VyY2VzQ29udGVudCI6WyJ7Q29tcG9zaXRlRGlzcG9zYWJsZX0gPSByZXF1aXJlICdhdG9tJ1xuXG5tb2R1bGUuZXhwb3J0cyA9XG5cbiAgYWN0aXZhdGU6IChzdGF0ZSkgLT5cbiAgICAjIEV2ZW50cyBzdWJzY3JpYmVkIHRvIGluIGF0b20ncyBzeXN0ZW0gY2FuIGJlIGVhc2lseSBjbGVhbmVkIHVwIHdpdGggYSBDb21wb3NpdGVEaXNwb3NhYmxlXG4gICAgQHN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZVxuICAgICMgUmVnaXN0ZXIgY29tbWFuZCB0aGF0IHRvZ2dsZXMgdGhpcyB2aWV3XG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29tbWFuZHMuYWRkICdhdG9tLXdvcmtzcGFjZScsICdoZWFkZXItaW1wbGVtZW50YXRpb246Z2VuZXJhdGUnOiA9PiBAZ2VuZXJhdGUoKVxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS13b3Jrc3BhY2UnLCAnaGVhZGVyLWltcGxlbWVudGF0aW9uOmFkZCc6ID0+IEBhZGQoKVxuICAgICMgUmVnRXggUGF0dGVybnNcbiAgICBAQ0xBU1NfTkFNRV9QQVRURVJOID0gLygoPzpuYW1lc3BhY2V8Y2xhc3MpKStcXHMrKFtcXHdfXSspK1xccyp7L2dcbiAgICBATUVUSE9EX1BBVFRFUk4gPSAvXlxccyooKD86Y29uc3R8c3RhdGljfHZpcnR1YWx8dm9sYXRpbGV8ZnJpZW5kKXswLDV9XFxzKlxcdysoPzo6ezJ9XFx3Kyl7MCx9XFxzKlxcKiomPyk/XFxzKyhbXFx3fl0rKVxccyooXFwoLipcXCkpXFxzKj8oIGNvbnN0KT87L2dtXG4gICAgQEZJTEVfTkFNRV9QQVRURVJOID0gLyhbXFx3XSspXFwuKFtofGNwcF0rKS9cblxuICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gICMgRmluZCB0aGUgUGFyaCBvZiB0aGUgc291cmNlIGZpbGUgYW5kIHRoZSBoZWFkZXJzIGZpbGVcbiAgIyByZXR1cm4gZW1wdHkgaWYgbm90aGluZyBpcyBmb3VuZFxuICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gIGZpbmRQYXRoOiAod29yaykgLT5cbiAgICB3b3JrLmhlYWRlclBhdGggPSBcIlwiXG4gICAgd29yay5pbXBsZW1lbnRhdGlvblBhdGggPSBcIlwiXG4gICAgYXRvbS53b3Jrc3BhY2Uuc2NhbiBAQ0xBU1NfTkFNRV9QQVRURVJOLCAoZmlsZSkgLT5cbiAgICAgIGNvbnNvbGUubG9nKGZpbGUpXG4gICAgICBpZiAoZmlsZS5maWxlUGF0aC5pbmNsdWRlcyhcIiN7d29yay5jbGFzc25hbWV9LmhcIikpXG4gICAgICAgIHdvcmsuaGVhZGVyUGF0aCA9IGZpbGUuZmlsZVBhdGhcbiAgICAgIGlmIChmaWxlLmZpbGVQYXRoLmluY2x1ZGVzKFwiI3t3b3JrLmNsYXNzbmFtZX0uY3BwXCIpKVxuICAgICAgICB3b3JrLmltcGxlbWVudGF0aW9uUGF0aCA9IGZpbGUuZmlsZVBhdGhcblxuICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gICNcdEZpbmQgd2V0aGVyIGl0IGlzIGEgbmFtZXNwYWNlIG9yIGEgY2xhc3NlIGFuZCBhZGQgaXRzIG5hbWUgdG8gd29ya1xuICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gIGZpbmROYW1lOiAod29yaykgLT5cbiAgICB3b3JrLmJ1ZmZlci5zY2FuIEBDTEFTU19OQU1FX1BBVFRFUk4sIChyZXMpIC0+XG4gICAgICB3b3JrLm5hbWVzcGFjZSA9IHJlcy5tYXRjaFsxXSA9PSBcIm5hbWVzcGFjZVwiXG4gICAgICB3b3JrLmNsYXNzbmFtZSA9IHJlcy5tYXRjaFsyXVxuICAgIHdvcmsuZWRpdG9yLm1vdmVUb0VuZE9mTGluZSgpXG4gICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgI1x0RmluZCBhbGwgdGhlIG1ldGhvZHMgdGhhdCBtYXRjaCB0aGUgcGF0dGVybiBhbmQgYWRkIHRoZW1cbiAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICBmaW5kQWxsTWV0aG9kczogKHdvcmspIC0+XG4gICAgY3R4ID0gdGhpc1xuICAgIHdvcmsuYnVmZmVyLnNjYW4gQE1FVEhPRF9QQVRURVJOLCAocmVzKSAtPlxuICAgICAgY3R4LmFkZE1ldGhvZCh3b3JrLHJlcylcbiAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICAjXHRhZGQgYSBtZXRob2QgdG8gdGhlIHdvcmtzcGFjZSBmcm9tIGEgcmVnZXggbWF0Y2hcbiAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICBhZGRNZXRob2Q6ICh3b3JrLHJlcykgLT5cbiAgICBtZXRob2QgPSBbXVxuICAgIG1ldGhvZC5wdXNoKChyZXMubWF0Y2hbMV18fFwiXCIpLnJlcGxhY2UoXCJzdGF0aWMgXCIsIFwiXCIpLnJlcGxhY2UoL1xcc3syLH0vLCBcIiBcIikgfHwgXCJcIilcbiAgICBtZXRob2QucHVzaChyZXMubWF0Y2hbMl0gKyByZXMubWF0Y2hbM10gKyAocmVzLm1hdGNoWzRdfHxcIlwiKSlcbiAgICB3b3JrLm1ldGhvZHMucHVzaChtZXRob2QpXG4gICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgI1x0RmluZCBib3RoIG5hbWUgYW5kIG1ldGhvZHNcbiAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICByZWFkRmlsZTogKHdvcmspIC0+XG4gICAgQGZpbmROYW1lKHdvcmspXG4gICAgQGZpbmRBbGxNZXRob2RzKHdvcmspXG4gICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgI1x0UmV0dXJuIGEgcHJvbWlzZSB0b3dhcmQgYSBuZXcgLmNwcCBmaWxlIG9wZW5cbiAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICBjcmVhdGVGaWxlOiAod29yaykgLT5cbiAgICByZXR1cm4gYXRvbS53b3Jrc3BhY2Uub3Blbih3b3JrLmltcGxlbWVudGF0aW9uUGF0aClcbiAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICAjIFdyaXRlIHRoZSBoZWFkIG9mIGEgLmNwcCBmaWxlIGRlcGVuZGluZyBvbiBpZlxuICAjIGl0J3MgYSBuYW1lc3BhY2Ugb3IgYSBjbGFzc1xuICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gIGNyZWF0ZUhlYWQ6ICh3b3JrKSAtPlxuICAgIHdvcmsuZWRpdG9yLmluc2VydFRleHQoXCIjaW5jbHVkZSBcXFwiI3t3b3JrLmNsYXNzbmFtZX0uaFxcXCJcIilcbiAgICB3b3JrLmVkaXRvci5pbnNlcnROZXdsaW5lKClcbiAgICB3b3JrLmVkaXRvci5pbnNlcnROZXdsaW5lKClcbiAgICB3b3JrLmVkaXRvci5pbnNlcnROZXdsaW5lKClcbiAgICBpZiAod29yay5uYW1lc3BhY2UpXG4gICAgICB3b3JrLmVkaXRvci5pbnNlcnRUZXh0KFwibmFtZXNwYWNlICN7d29yay5jbGFzc25hbWV9XCIpXG4gICAgICB3b3JrLmVkaXRvci5pbnNlcnROZXdsaW5lKClcbiAgICAgIHdvcmsuZWRpdG9yLmluc2VydFRleHQoXCJ7XCIpXG4gICAgICB3b3JrLmVkaXRvci5pbnNlcnROZXdsaW5lKClcbiAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICAjIEluc2VydCBhIGNvbW1lbnQgbGluZSBvbiB0b3Agb2YgYSBtZXRob2RcbiAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICBtZXRob2RDb21tZW50OiAod29yaykgLT5cbiAgICB3b3JrLmVkaXRvci5pbnNlcnRUZXh0KFwiLypcIiArIFwiKlwiLnJlcGVhdCg2OCkpXG4gICAgd29yay5lZGl0b3IuaW5zZXJ0TmV3bGluZSgpXG4gICAgd29yay5lZGl0b3IuaW5zZXJ0VGV4dChcIiogQ29tbWVudFwiKVxuICAgIHdvcmsuZWRpdG9yLmluc2VydE5ld2xpbmUoKVxuICAgIHdvcmsuZWRpdG9yLmluc2VydFRleHQoIFwiKlwiLnJlcGVhdCg2OCkrIFwiKi9cIilcbiAgICB3b3JrLmVkaXRvci5pbnNlcnROZXdsaW5lKClcbiAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICAjXHRXcml0ZSB0aGUgbWV0aG9kIG5hbWVcbiAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICBtZXRob2ROYW1lOiAod29yayxtZXRob2QpIC0+XG4gICAgaWYgKG1ldGhvZFswXSlcbiAgICAgIHdvcmsuZWRpdG9yLmluc2VydFRleHQoXCIje21ldGhvZFswXX0gXCIpXG4gICAgaWYgKHdvcmsubmFtZXNwYWNlKVxuICAgICAgd29yay5lZGl0b3IuaW5zZXJ0VGV4dChcIiN7bWV0aG9kWzFdfVwiIClcbiAgICBlbHNlXG4gICAgICB3b3JrLmVkaXRvci5pbnNlcnRUZXh0KFwiI3t3b3JrLmNsYXNzbmFtZX06OiN7bWV0aG9kWzFdfVwiKVxuICAgIHdvcmsuZWRpdG9yLmluc2VydE5ld2xpbmUoKVxuICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gICNcdFdyaXRlIHRoZSBib2R5IG9mIHRoZSBpbXBsZW1lbnRhdGlvbiBvZiBhIG1ldGhvZFxuICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gIG1ldGhvZEJvZHk6ICh3b3JrKSAtPlxuICAgIHdvcmsuZWRpdG9yLmluc2VydFRleHQoXCJ7XCIpXG4gICAgd29yay5lZGl0b3IuaW5zZXJ0TmV3bGluZSgpXG4gICAgd29yay5lZGl0b3IubW92ZURvd24oMSlcbiAgICB3b3JrLmVkaXRvci5pbnNlcnROZXdsaW5lKClcbiAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICAjXHRBZGQgYSBtZXRob2QgYXQgdGhlIGN1cnNvciBwb3NpdGlvblxuICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gIHdyaXRlTWV0aG9kOiAod29yayxtZXRob2QpIC0+XG4gICAgQG1ldGhvZENvbW1lbnQod29yaylcbiAgICBAbWV0aG9kTmFtZSh3b3JrLG1ldGhvZClcbiAgICBAbWV0aG9kQm9keSh3b3JrKVxuICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gICNcdENyZWF0ZSBhbGwgdGhlIG1ldGhvZHMgYmFjayB0byBiYWNrXG4gICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgd3JpdGVBbGxNZXRob2RzOiAod29yaykgLT5cbiAgICBjdHggPSB0aGlzXG4gICAgd29yay5tZXRob2RzLmZvckVhY2ggKG1ldGhvZCkgLT5cbiAgICAgIGN0eC53cml0ZU1ldGhvZCh3b3JrLG1ldGhvZCxjdHgpXG4gICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgI1x0V3JpdGUgdGhlIHdob2xlIGZpbGUgLmNwcFxuICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gIHdyaXRlSW5FZGl0b3I6ICh3b3JrKSAtPlxuICAgIEBjcmVhdGVIZWFkKHdvcmspXG4gICAgQHdyaXRlQWxsTWV0aG9kcyh3b3JrKVxuICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gICNcdGdlbmVyYXRlIGEgd29yayBvYmplY3RcbiAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICBnZW5lcmF0ZVdvcms6IC0+XG4gICAgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgYnVmZmVyID0gZWRpdG9yLmdldEJ1ZmZlcigpXG4gICAgd29yayA9XG4gICAgICB7XG4gICAgICAgIGVkaXRvcixcbiAgICAgICAgYnVmZmVyLFxuICAgICAgICBoZWFkZXJQYXRoIDogXCJcIlxuICAgICAgICBpbXBsZW1lbnRhdGlvblBhdGggOiBcIlwiXG4gICAgICAgIGNsYXNzbmFtZSA6IFwiXCJcbiAgICAgICAgbmFtZXNwYWNlIDogZmFsc2VcbiAgICAgICAgbWV0aG9kcyA6IFtdXG4gICAgICB9XG4gICAgcmV0dXJuIHdvcmtcbiAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICAjXHRSZWFkIHRoZSBoZWFkZXIgZmlsZXMgeW91IGFyZSBpbiBhbmQgZ2VuZXJhdGUgYSAuY3BwXG4gICMgaW4gdGhlIHNhbWUgcGF0aFxuICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gIGdlbmVyYXRlOiAtPlxuICAgIHdvcmsgPSBAZ2VuZXJhdGVXb3JrKClcbiAgICB3b3JrLmVkaXRvci5zYXZlKClcbiAgICBAcmVhZEZpbGUod29yaylcbiAgICB3b3JrLmhlYWRlclBhdGggPSB3b3JrLmVkaXRvci5nZXRQYXRoKClcbiAgICB3b3JrLmltcGxlbWVudGF0aW9uUGF0aCA9IHdvcmsuaGVhZGVyUGF0aC5yZXBsYWNlKFwiLmhcIixcIi5jcHBcIilcbiAgICBjdHggPSB0aGlzXG4gICAgQGNyZWF0ZUZpbGUod29yaykudGhlbiAoZWRpdG9yKSAtPlxuICAgICAgd29yay5lZGl0b3IgPSBlZGl0b3JcbiAgICAgIHdvcmsuYnVmZmVyID0gd29yay5lZGl0b3IuZ2V0QnVmZmVyKClcbiAgICAgIGN0eC53cml0ZUluRWRpdG9yKHdvcmspXG4gICAgcmV0dXJuXG5cbiAgYWRkOiAtPlxuICAgIHdvcmsgPSBAZ2VuZXJhdGVXb3JrKClcbiAgICB3b3JrLmVkaXRvci5zYXZlXG4gICAgQGZpbmROYW1lKHdvcmspXG4gICAgQGZpbmRQYXRoKHdvcmspXG4gICAgY29uc29sZS5sb2cod29yay5pbXBsZW1lbnRhdGlvblBhdGgpXG4gICAgY29uc29sZS5sb2cod29yay5oZWFkZXJQYXRoKVxuICAgIHdvcmsuZWRpdG9yLm1vdmVUb0JlZ2lubmluZ09mTGluZSgpXG4gICAgd29yay5lZGl0b3Iuc2VsZWN0VG9FbmRPZkxpbmUoKVxuICAgIHJhbmdlID0gd29yay5lZGl0b3IuZ2V0U2VsZWN0ZWRCdWZmZXJSYW5nZSgpXG4gICAgY3R4ID0gdGhpc1xuICAgIHdvcmsuZWRpdG9yLnNjYW5JbkJ1ZmZlclJhbmdlIEBNRVRIT0RfUEFUVEVSTiwgcmFuZ2UsIChyZXMpIC0+XG4gICAgICBjdHguYWRkTWV0aG9kKHdvcmsscmVzKVxuICAgICAgaWYgKHdvcmsubWV0aG9kID09IFtdKVxuICAgICAgICByZXR1cm5cbiAgICBAY3JlYXRlRmlsZSh3b3JrKS50aGVuIChlZGl0b3IpIC0+XG4gICAgICB3b3JrLmVkaXRvciA9IGVkaXRvclxuICAgICAgd29yay5idWZmZXIgPSB3b3JrLmVkaXRvci5nZXRCdWZmZXIoKVxuICAgICAgd29yay5lZGl0b3IubW92ZVRvQm90dG9tKClcbiAgICAgIGN0eC53cml0ZU1ldGhvZCh3b3JrLHdvcmsubWV0aG9kc1swXSlcbiAgICByZXR1cm5cbiJdfQ==