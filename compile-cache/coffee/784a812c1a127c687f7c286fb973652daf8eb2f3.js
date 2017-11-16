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
          console.log(work.headerPath);
        }
        if (file.filePath.includes(work.classname + ".cpp")) {
          work.implementationPath = file.filePath;
          return console.log(work.implementationPath);
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYmlsbHkvZ2l0aHViL2hlYWRlci1pbXBsZW1lbnRhdGlvbi9saWIvaGVhZGVyLWltcGxlbWVudGF0aW9uLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSOztFQUV4QixNQUFNLENBQUMsT0FBUCxHQUVFO0lBQUEsUUFBQSxFQUFVLFNBQUMsS0FBRDtNQUVSLElBQUMsQ0FBQSxhQUFELEdBQWlCLElBQUk7TUFFckIsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFBb0M7UUFBQSxnQ0FBQSxFQUFrQyxDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFBO21CQUFHLEtBQUMsQ0FBQSxRQUFELENBQUE7VUFBSDtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBbEM7T0FBcEMsQ0FBbkI7TUFDQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGdCQUFsQixFQUFvQztRQUFBLDJCQUFBLEVBQTZCLENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUE7bUJBQUcsS0FBQyxDQUFBLEdBQUQsQ0FBQTtVQUFIO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUE3QjtPQUFwQyxDQUFuQjtNQUVBLElBQUMsQ0FBQSxrQkFBRCxHQUFzQjtNQUN0QixJQUFDLENBQUEsY0FBRCxHQUFrQjthQUNsQixJQUFDLENBQUEsaUJBQUQsR0FBcUI7SUFUYixDQUFWO0lBZUEsUUFBQSxFQUFVLFNBQUMsSUFBRDtNQUNSLElBQUksQ0FBQyxVQUFMLEdBQWtCO01BQ2xCLElBQUksQ0FBQyxrQkFBTCxHQUEwQjthQUMxQixJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBb0IsSUFBQyxDQUFBLGlCQUFyQixFQUF3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QUFDLElBQWxCLENBQXVCLFNBQUMsTUFBRDtRQUNyQixJQUFJLENBQUMsTUFBTCxHQUFjO1FBQ2QsSUFBSSxDQUFDLE1BQUwsR0FBYyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVosQ0FBQTtRQUNkLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWixDQUFBO2VBQ0EsR0FBRyxDQUFDLFdBQUosQ0FBZ0IsSUFBaEIsRUFBcUIsSUFBSSxDQUFDLE9BQVEsQ0FBQSxDQUFBLENBQWxDO01BSnFCLENBQXZCO0lBZEcsQ0E1Skw7O0FBSkYiLCJzb3VyY2VzQ29udGVudCI6WyJ7Q29tcG9zaXRlRGlzcG9zYWJsZX0gPSByZXF1aXJlICdhdG9tJ1xuXG5tb2R1bGUuZXhwb3J0cyA9XG5cbiAgYWN0aXZhdGU6IChzdGF0ZSkgLT5cbiAgICAjIEV2ZW50cyBzdWJzY3JpYmVkIHRvIGluIGF0b20ncyBzeXN0ZW0gY2FuIGJlIGVhc2lseSBjbGVhbmVkIHVwIHdpdGggYSBDb21wb3NpdGVEaXNwb3NhYmxlXG4gICAgQHN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZVxuICAgICMgUmVnaXN0ZXIgY29tbWFuZCB0aGF0IHRvZ2dsZXMgdGhpcyB2aWV3XG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29tbWFuZHMuYWRkICdhdG9tLXdvcmtzcGFjZScsICdoZWFkZXItaW1wbGVtZW50YXRpb246Z2VuZXJhdGUnOiA9PiBAZ2VuZXJhdGUoKVxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS13b3Jrc3BhY2UnLCAnaGVhZGVyLWltcGxlbWVudGF0aW9uOmFkZCc6ID0+IEBhZGQoKVxuICAgICMgUmVnRXggUGF0dGVybnNcbiAgICBAQ0xBU1NfTkFNRV9QQVRURVJOID0gLygoPzpuYW1lc3BhY2V8Y2xhc3MpKStcXHMrKFtcXHdfXSspK1xccyp7L2dcbiAgICBATUVUSE9EX1BBVFRFUk4gPSAvXlxccyooKD86Y29uc3R8c3RhdGljfHZpcnR1YWx8dm9sYXRpbGV8ZnJpZW5kKXswLDV9XFxzKlxcdysoPzo6ezJ9XFx3Kyl7MCx9XFxzKlxcKiomPyk/XFxzKyhbXFx3fl0rKVxccyooXFwoLipcXCkpXFxzKj8oIGNvbnN0KT87L2dtXG4gICAgQEZJTEVfTkFNRV9QQVRURVJOID0gLyhbXFx3XSspXFwuKFtofGNwcF0rKS9cblxuICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gICMgRmluZCB0aGUgUGFyaCBvZiB0aGUgc291cmNlIGZpbGUgYW5kIHRoZSBoZWFkZXJzIGZpbGVcbiAgIyByZXR1cm4gZW1wdHkgaWYgbm90aGluZyBpcyBmb3VuZFxuICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gIGZpbmRQYXRoOiAod29yaykgLT5cbiAgICB3b3JrLmhlYWRlclBhdGggPSBcIlwiXG4gICAgd29yay5pbXBsZW1lbnRhdGlvblBhdGggPSBcIlwiXG4gICAgYXRvbS53b3Jrc3BhY2Uuc2NhbiBARklMRV9OQU1FX1BBVFRFUk4sIChmaWxlKSAtPlxuICAgICAgaWYgKGZpbGUuZmlsZVBhdGguaW5jbHVkZXMoXCIje3dvcmsuY2xhc3NuYW1lfS5oXCIpKVxuICAgICAgICB3b3JrLmhlYWRlclBhdGggPSBmaWxlLmZpbGVQYXRoXG4gICAgICAgIGNvbnNvbGUubG9nKHdvcmsuaGVhZGVyUGF0aClcbiAgICAgIGlmIChmaWxlLmZpbGVQYXRoLmluY2x1ZGVzKFwiI3t3b3JrLmNsYXNzbmFtZX0uY3BwXCIpKVxuICAgICAgICB3b3JrLmltcGxlbWVudGF0aW9uUGF0aCA9IGZpbGUuZmlsZVBhdGhcbiAgICAgICAgY29uc29sZS5sb2cod29yay5pbXBsZW1lbnRhdGlvblBhdGgpXG4gICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgI1x0RmluZCB3ZXRoZXIgaXQgaXMgYSBuYW1lc3BhY2Ugb3IgYSBjbGFzc2UgYW5kIGFkZCBpdHMgbmFtZSB0byB3b3JrXG4gICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgZmluZE5hbWU6ICh3b3JrKSAtPlxuICAgIHdvcmsuYnVmZmVyLnNjYW4gQENMQVNTX05BTUVfUEFUVEVSTiwgKHJlcykgLT5cbiAgICAgIHdvcmsubmFtZXNwYWNlID0gcmVzLm1hdGNoWzFdID09IFwibmFtZXNwYWNlXCJcbiAgICAgIHdvcmsuY2xhc3NuYW1lID0gcmVzLm1hdGNoWzJdXG4gICAgd29yay5lZGl0b3IubW92ZVRvRW5kT2ZMaW5lKClcbiAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICAjXHRGaW5kIGFsbCB0aGUgbWV0aG9kcyB0aGF0IG1hdGNoIHRoZSBwYXR0ZXJuIGFuZCBhZGQgdGhlbVxuICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gIGZpbmRBbGxNZXRob2RzOiAod29yaykgLT5cbiAgICBjdHggPSB0aGlzXG4gICAgd29yay5idWZmZXIuc2NhbiBATUVUSE9EX1BBVFRFUk4sIChyZXMpIC0+XG4gICAgICBjdHguYWRkTWV0aG9kKHdvcmsscmVzKVxuICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gICNcdGFkZCBhIG1ldGhvZCB0byB0aGUgd29ya3NwYWNlIGZyb20gYSByZWdleCBtYXRjaFxuICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gIGFkZE1ldGhvZDogKHdvcmsscmVzKSAtPlxuICAgIG1ldGhvZCA9IFtdXG4gICAgbWV0aG9kLnB1c2goKHJlcy5tYXRjaFsxXXx8XCJcIikucmVwbGFjZShcInN0YXRpYyBcIiwgXCJcIikucmVwbGFjZSgvXFxzezIsfS8sIFwiIFwiKSB8fCBcIlwiKVxuICAgIG1ldGhvZC5wdXNoKHJlcy5tYXRjaFsyXSArIHJlcy5tYXRjaFszXSArIChyZXMubWF0Y2hbNF18fFwiXCIpKVxuICAgIHdvcmsubWV0aG9kcy5wdXNoKG1ldGhvZClcbiAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICAjXHRGaW5kIGJvdGggbmFtZSBhbmQgbWV0aG9kc1xuICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gIHJlYWRGaWxlOiAod29yaykgLT5cbiAgICBAZmluZE5hbWUod29yaylcbiAgICBAZmluZEFsbE1ldGhvZHMod29yaylcbiAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICAjXHRSZXR1cm4gYSBwcm9taXNlIHRvd2FyZCBhIG5ldyAuY3BwIGZpbGUgb3BlblxuICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gIGNyZWF0ZUZpbGU6ICh3b3JrKSAtPlxuICAgIHJldHVybiBhdG9tLndvcmtzcGFjZS5vcGVuKHdvcmsuaW1wbGVtZW50YXRpb25QYXRoKVxuICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gICMgV3JpdGUgdGhlIGhlYWQgb2YgYSAuY3BwIGZpbGUgZGVwZW5kaW5nIG9uIGlmXG4gICMgaXQncyBhIG5hbWVzcGFjZSBvciBhIGNsYXNzXG4gICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgY3JlYXRlSGVhZDogKHdvcmspIC0+XG4gICAgd29yay5lZGl0b3IuaW5zZXJ0VGV4dChcIiNpbmNsdWRlIFxcXCIje3dvcmsuY2xhc3NuYW1lfS5oXFxcIlwiKVxuICAgIHdvcmsuZWRpdG9yLmluc2VydE5ld2xpbmUoKVxuICAgIHdvcmsuZWRpdG9yLmluc2VydE5ld2xpbmUoKVxuICAgIHdvcmsuZWRpdG9yLmluc2VydE5ld2xpbmUoKVxuICAgIGlmICh3b3JrLm5hbWVzcGFjZSlcbiAgICAgIHdvcmsuZWRpdG9yLmluc2VydFRleHQoXCJuYW1lc3BhY2UgI3t3b3JrLmNsYXNzbmFtZX1cIilcbiAgICAgIHdvcmsuZWRpdG9yLmluc2VydE5ld2xpbmUoKVxuICAgICAgd29yay5lZGl0b3IuaW5zZXJ0VGV4dChcIntcIilcbiAgICAgIHdvcmsuZWRpdG9yLmluc2VydE5ld2xpbmUoKVxuICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gICMgSW5zZXJ0IGEgY29tbWVudCBsaW5lIG9uIHRvcCBvZiBhIG1ldGhvZFxuICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gIG1ldGhvZENvbW1lbnQ6ICh3b3JrKSAtPlxuICAgIHdvcmsuZWRpdG9yLmluc2VydFRleHQoXCIvKlwiICsgXCIqXCIucmVwZWF0KDY4KSlcbiAgICB3b3JrLmVkaXRvci5pbnNlcnROZXdsaW5lKClcbiAgICB3b3JrLmVkaXRvci5pbnNlcnRUZXh0KFwiKiBDb21tZW50XCIpXG4gICAgd29yay5lZGl0b3IuaW5zZXJ0TmV3bGluZSgpXG4gICAgd29yay5lZGl0b3IuaW5zZXJ0VGV4dCggXCIqXCIucmVwZWF0KDY4KSsgXCIqL1wiKVxuICAgIHdvcmsuZWRpdG9yLmluc2VydE5ld2xpbmUoKVxuICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gICNcdFdyaXRlIHRoZSBtZXRob2QgbmFtZVxuICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gIG1ldGhvZE5hbWU6ICh3b3JrLG1ldGhvZCkgLT5cbiAgICBpZiAobWV0aG9kWzBdKVxuICAgICAgd29yay5lZGl0b3IuaW5zZXJ0VGV4dChcIiN7bWV0aG9kWzBdfSBcIilcbiAgICBpZiAod29yay5uYW1lc3BhY2UpXG4gICAgICB3b3JrLmVkaXRvci5pbnNlcnRUZXh0KFwiI3ttZXRob2RbMV19XCIgKVxuICAgIGVsc2VcbiAgICAgIHdvcmsuZWRpdG9yLmluc2VydFRleHQoXCIje3dvcmsuY2xhc3NuYW1lfTo6I3ttZXRob2RbMV19XCIpXG4gICAgd29yay5lZGl0b3IuaW5zZXJ0TmV3bGluZSgpXG4gICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgI1x0V3JpdGUgdGhlIGJvZHkgb2YgdGhlIGltcGxlbWVudGF0aW9uIG9mIGEgbWV0aG9kXG4gICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgbWV0aG9kQm9keTogKHdvcmspIC0+XG4gICAgd29yay5lZGl0b3IuaW5zZXJ0VGV4dChcIntcIilcbiAgICB3b3JrLmVkaXRvci5pbnNlcnROZXdsaW5lKClcbiAgICB3b3JrLmVkaXRvci5tb3ZlRG93bigxKVxuICAgIHdvcmsuZWRpdG9yLmluc2VydE5ld2xpbmUoKVxuICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gICNcdEFkZCBhIG1ldGhvZCBhdCB0aGUgY3Vyc29yIHBvc2l0aW9uXG4gICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgd3JpdGVNZXRob2Q6ICh3b3JrLG1ldGhvZCkgLT5cbiAgICBAbWV0aG9kQ29tbWVudCh3b3JrKVxuICAgIEBtZXRob2ROYW1lKHdvcmssbWV0aG9kKVxuICAgIEBtZXRob2RCb2R5KHdvcmspXG4gICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgI1x0Q3JlYXRlIGFsbCB0aGUgbWV0aG9kcyBiYWNrIHRvIGJhY2tcbiAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICB3cml0ZUFsbE1ldGhvZHM6ICh3b3JrKSAtPlxuICAgIGN0eCA9IHRoaXNcbiAgICB3b3JrLm1ldGhvZHMuZm9yRWFjaCAobWV0aG9kKSAtPlxuICAgICAgY3R4LndyaXRlTWV0aG9kKHdvcmssbWV0aG9kLGN0eClcbiAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICAjXHRXcml0ZSB0aGUgd2hvbGUgZmlsZSAuY3BwXG4gICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgd3JpdGVJbkVkaXRvcjogKHdvcmspIC0+XG4gICAgQGNyZWF0ZUhlYWQod29yaylcbiAgICBAd3JpdGVBbGxNZXRob2RzKHdvcmspXG4gICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgI1x0Z2VuZXJhdGUgYSB3b3JrIG9iamVjdFxuICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gIGdlbmVyYXRlV29yazogLT5cbiAgICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICBidWZmZXIgPSBlZGl0b3IuZ2V0QnVmZmVyKClcbiAgICB3b3JrID1cbiAgICAgIHtcbiAgICAgICAgZWRpdG9yLFxuICAgICAgICBidWZmZXIsXG4gICAgICAgIGhlYWRlclBhdGggOiBcIlwiXG4gICAgICAgIGltcGxlbWVudGF0aW9uUGF0aCA6IFwiXCJcbiAgICAgICAgY2xhc3NuYW1lIDogXCJcIlxuICAgICAgICBuYW1lc3BhY2UgOiBmYWxzZVxuICAgICAgICBtZXRob2RzIDogW11cbiAgICAgIH1cbiAgICByZXR1cm4gd29ya1xuICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gICNcdFJlYWQgdGhlIGhlYWRlciBmaWxlcyB5b3UgYXJlIGluIGFuZCBnZW5lcmF0ZSBhIC5jcHBcbiAgIyBpbiB0aGUgc2FtZSBwYXRoXG4gICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgZ2VuZXJhdGU6IC0+XG4gICAgd29yayA9IEBnZW5lcmF0ZVdvcmsoKVxuICAgIHdvcmsuZWRpdG9yLnNhdmUoKVxuICAgIEByZWFkRmlsZSh3b3JrKVxuICAgIHdvcmsuaGVhZGVyUGF0aCA9IHdvcmsuZWRpdG9yLmdldFBhdGgoKVxuICAgIHdvcmsuaW1wbGVtZW50YXRpb25QYXRoID0gd29yay5oZWFkZXJQYXRoLnJlcGxhY2UoXCIuaFwiLFwiLmNwcFwiKVxuICAgIGN0eCA9IHRoaXNcbiAgICBAY3JlYXRlRmlsZSh3b3JrKS50aGVuIChlZGl0b3IpIC0+XG4gICAgICB3b3JrLmVkaXRvciA9IGVkaXRvclxuICAgICAgd29yay5idWZmZXIgPSB3b3JrLmVkaXRvci5nZXRCdWZmZXIoKVxuICAgICAgY3R4LndyaXRlSW5FZGl0b3Iod29yaylcbiAgICByZXR1cm5cblxuICBhZGQ6IC0+XG4gICAgd29yayA9IEBnZW5lcmF0ZVdvcmsoKVxuICAgIHdvcmsuZWRpdG9yLnNhdmVcbiAgICBAZmluZE5hbWUod29yaylcbiAgICBAZmluZFBhdGgod29yaylcbiAgICBjb25zb2xlLmxvZyh3b3JrLmltcGxlbWVudGF0aW9uUGF0aClcbiAgICB3b3JrLmVkaXRvci5tb3ZlVG9CZWdpbm5pbmdPZkxpbmUoKVxuICAgIHdvcmsuZWRpdG9yLnNlbGVjdFRvRW5kT2ZMaW5lKClcbiAgICByYW5nZSA9IHdvcmsuZWRpdG9yLmdldFNlbGVjdGVkQnVmZmVyUmFuZ2UoKVxuICAgIGN0eCA9IHRoaXNcbiAgICB3b3JrLmVkaXRvci5zY2FuSW5CdWZmZXJSYW5nZSBATUVUSE9EX1BBVFRFUk4sIHJhbmdlLCAocmVzKSAtPlxuICAgICAgY3R4LmFkZE1ldGhvZCh3b3JrLHJlcylcbiAgICAgIGlmICh3b3JrLm1ldGhvZCA9PSBbXSlcbiAgICAgICAgcmV0dXJuXG4gICAgQGNyZWF0ZUZpbGUod29yaykudGhlbiAoZWRpdG9yKSAtPlxuICAgICAgd29yay5lZGl0b3IgPSBlZGl0b3JcbiAgICAgIHdvcmsuYnVmZmVyID0gd29yay5lZGl0b3IuZ2V0QnVmZmVyKClcbiAgICAgIHdvcmsuZWRpdG9yLm1vdmVUb0JvdHRvbSgpXG4gICAgICBjdHgud3JpdGVNZXRob2Qod29yayx3b3JrLm1ldGhvZHNbMF0pXG4gICAgcmV0dXJuXG4iXX0=
