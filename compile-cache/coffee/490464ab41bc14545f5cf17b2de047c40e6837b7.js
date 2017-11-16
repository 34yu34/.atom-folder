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
      this.CLASS_NAME_PATTERN = /((?:namespace|class))+\s+([\w_]+)+\s*{/g;
      this.METHOD_PATTERN = /^\s*((?:const|static|virtual|volatile|friend){0,5}\s*\w+(?::{2}\w+){0,}\s*\**&?)?\s+([\w~]+)\s*(\(.*\))\s*?( const)?;/gm;
      return this.FILE_NAME_PATTERN = /([\w]+)\.([h|cpp]+)/;
    },
    findPath: function(work) {
      return atom.workspace.scan(this.FILE_NAME_PATTERN, function(file) {
        return console.log(file);
      });
    },
    findName: function(work) {
      work.buffer.scan(this.CLASS_NAME_PATTERN, function(res) {
        work.namespace = res.match[1] === "namespace";
        return work.classname = res.match[2];
      });
      return work.editor.moveToEndOfLine();
    },
    findMethod: function(work) {
      return work.buffer.scan(this.METHOD_PATTERN, function(res) {
        var method;
        method = [];
        method.push((res.match[1] || "").replace("static ", "").replace(/\s{2,}/, " ") || "");
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
    addMethod: function(work, method) {
      this.methodComment(work);
      this.methodName(work, method);
      return this.methodBody(work);
    },
    createMethods: function(work) {
      var ctx;
      ctx = this;
      return work.methods.forEach(function(method) {
        return ctx.addMethod(work, method, ctx);
      });
    },
    writeInEditor: function(work) {
      this.createHead(work);
      return this.createMethods(work);
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
      this.findPath(work);
      console.log(work.headerPath);
      console.log(work.implementationPath);
      work.headerPath = work.editor.getPath();
      work.implementationPath = work.headerPath.replace(".h", ".cpp");
      ctx = this;
      this.createFile(work).then(function(editor) {
        work.editor = editor;
        work.buffer = work.editor.getBuffer();
        return ctx.writeInEditor(work);
      });
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYmlsbHkvZ2l0aHViL2hlYWRlci1pbXBsZW1lbnRhdGlvbi9saWIvaGVhZGVyLWltcGxlbWVudGF0aW9uLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSOztFQUV4QixNQUFNLENBQUMsT0FBUCxHQUVFO0lBQUEsUUFBQSxFQUFVLFNBQUMsS0FBRDtNQUVSLElBQUMsQ0FBQSxhQUFELEdBQWlCLElBQUk7TUFFckIsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFBb0M7UUFBQSxnQ0FBQSxFQUFrQyxDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFBO21CQUFHLEtBQUMsQ0FBQSxRQUFELENBQUE7VUFBSDtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBbEM7T0FBcEMsQ0FBbkI7TUFFQSxJQUFDLENBQUEsa0JBQUQsR0FBc0I7TUFDdEIsSUFBQyxDQUFBLGNBQUQsR0FBa0I7YUFDbEIsSUFBQyxDQUFBLGlCQUFELEdBQXFCO0lBUmIsQ0FBVjtJQWFBLFFBQUEsRUFBVSxTQUFDLElBQUQ7YUFDUixJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBb0IsSUFBQyxDQUFBLGlCQUFyQixFQUF3QyxTQUFDLElBQUQ7ZUFDdEMsT0FBTyxDQUFDLEdBQVIsQ0FBWSxJQUFaO01BRHNDLENBQXhDO0lBRFEsQ0FiVjtJQXdCQSxRQUFBLEVBQVUsU0FBQyxJQUFEO01BQ1IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFaLENBQWlCLElBQUMsQ0FBQSxrQkFBbEIsRUFBc0MsU0FBQyxHQUFEO1FBQ3BDLElBQUksQ0FBQyxTQUFMLEdBQWlCLEdBQUcsQ0FBQyxLQUFNLENBQUEsQ0FBQSxDQUFWLEtBQWdCO2VBQ2pDLElBQUksQ0FBQyxTQUFMLEdBQWlCLEdB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LEVBQWEsRUFIZjtRQUlFLGtCQUFBLEVBQXFCLEVBSnZCO1FBS0UsU0FBQSxFQUFZLEVBTGQ7UUFNRSxTQUFBLEVBQVksS0FOZDtRQU9FLE9BQUEsRUFBVSxFQVBaOztBQVNGLGFBQU87SUFiSyxDQW5IZDtJQXFJQSxRQUFBLEVBQVUsU0FBQTtBQUNSLFVBQUE7TUFBQSxJQUFBLEdBQU8sSUFBQyxDQUFBLFlBQUQsQ0FBQTtNQUNQLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBWixDQUFBO01BQ0EsSUFBQyxDQUFBLFFBQUQsQ0FBVSxJQUFWO01BQ0EsSUFBQyxDQUFBLFFBQUQsQ0FBVSxJQUFWO01BQ0EsT0FBTyxDQUFDLEdBQVIsQ0FBWSxJQUFJLENBQUMsVUFBakI7TUFDQSxPQUFPLENBQUMsR0FBUixDQUFZLElBQUksQ0FBQyxrQkFBakI7TUFDQSxJQUFJLENBQUMsVUFBTCxHQUFrQixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQVosQ0FBQTtNQUNsQixJQUFJLENBQUMsa0JBQUwsR0FBMEIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFoQixDQUF3QixJQUF4QixFQUE2QixNQUE3QjtNQUMxQixHQUFBLEdBQU07TUFDTixJQUFDLENBQUEsVUFBRCxDQUFZLElBQVosQ0FBaUIsQ0FBQyxJQUFsQixDQUF1QixTQUFDLE1BQUQ7UUFDckIsSUFBSSxDQUFDLE1BQUwsR0FBYztRQUNkLElBQUksQ0FBQyxNQUFMLEdBQWMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFaLENBQUE7ZUFDZCxHQUFHLENBQUMsYUFBSixDQUFrQixJQUFsQjtNQUhxQixDQUF2QjtJQVZRLENBcklWOztBQUpGIiwic291cmNlc0NvbnRlbnQiOlsie0NvbXBvc2l0ZURpc3Bvc2FibGV9ID0gcmVxdWlyZSAnYXRvbSdcblxubW9kdWxlLmV4cG9ydHMgPVxuXG4gIGFjdGl2YXRlOiAoc3RhdGUpIC0+XG4gICAgIyBFdmVudHMgc3Vic2NyaWJlZCB0byBpbiBhdG9tJ3Mgc3lzdGVtIGNhbiBiZSBlYXNpbHkgY2xlYW5lZCB1cCB3aXRoIGEgQ29tcG9zaXRlRGlzcG9zYWJsZVxuICAgIEBzdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGVcbiAgICAjIFJlZ2lzdGVyIGNvbW1hbmQgdGhhdCB0b2dnbGVzIHRoaXMgdmlld1xuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS13b3Jrc3BhY2UnLCAnaGVhZGVyLWltcGxlbWVudGF0aW9uOmdlbmVyYXRlJzogPT4gQGdlbmVyYXRlKClcbiAgICAjIFJlZ0V4IFBhdHRlcm5zXG4gICAgQENMQVNTX05BTUVfUEFUVEVSTiA9IC8oKD86bmFtZXNwYWNlfGNsYXNzKSkrXFxzKyhbXFx3X10rKStcXHMqey9nXG4gICAgQE1FVEhPRF9QQVRURVJOID0gL15cXHMqKCg/OmNvbnN0fHN0YXRpY3x2aXJ0dWFsfHZvbGF0aWxlfGZyaWVuZCl7MCw1fVxccypcXHcrKD86OnsyfVxcdyspezAsfVxccypcXCoqJj8pP1xccysoW1xcd35dKylcXHMqKFxcKC4qXFwpKVxccyo/KCBjb25zdCk/Oy9nbVxuICAgIEBGSUxFX05BTUVfUEFUVEVSTiA9IC8oW1xcd10rKVxcLihbaHxjcHBdKykvXG5cbiAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICAjXG4gICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgZmluZFBhdGg6ICh3b3JrKSAtPlxuICAgIGF0b20ud29ya3NwYWNlLnNjYW4gQEZJTEVfTkFNRV9QQVRURVJOLCAoZmlsZSkgLT5cbiAgICAgIGNvbnNvbGUubG9nKGZpbGUpXG4gICAgICAjaWYgKGZpbGUuZmlsZVBhdGguaW5jbHVkZXMoXCIje3dvcmsuY2xhc3NuYW1lfS5oXCIpKVxuICAgICAgIyAgd29yay5oZWFkZXJQYXRoID0gZmlsZVBhdGhcbiAgICAgICNpZiAoZmlsZS5maWxlUGF0aC5pbmNsdWRlcyhcIiN7d29yay5jbGFzc25hbWV9LmNwcFwiKSlcbiAgICAgICMgIHdvcmsuaW1wbGVtZW50YXRpb25QYXRoID0gZmlsZVBhdGhcblxuICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gICNcdEZpbmQgd2V0aGVyIGl0IGlzIGEgbmFtZXNwYWNlIG9yIGEgY2xhc3NlIGFuZCBhZGQgaXRzIG5hbWUgdG8gd29ya1xuICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gIGZpbmROYW1lOiAod29yaykgLT5cbiAgICB3b3JrLmJ1ZmZlci5zY2FuIEBDTEFTU19OQU1FX1BBVFRFUk4sIChyZXMpIC0+XG4gICAgICB3b3JrLm5hbWVzcGFjZSA9IHJlcy5tYXRjaFsxXSA9PSBcIm5hbWVzcGFjZVwiXG4gICAgICB3b3JrLmNsYXNzbmFtZSA9IHJlcy5tYXRjaFsyXVxuICAgIHdvcmsuZWRpdG9yLm1vdmVUb0VuZE9mTGluZSgpXG4gICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgI1x0ZmluZCBhbGwgdGhlIG1ldGhvZHMgaW4gdGhlIGhlYWRlcnMgZmlsZVxuICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gIGZpbmRNZXRob2Q6ICh3b3JrKSAtPlxuICAgIHdvcmsuYnVmZmVyLnNjYW4gQE1FVEhPRF9QQVRURVJOLCAocmVzKSAtPlxuICAgICAgbWV0aG9kID0gW11cbiAgICAgIG1ldGhvZC5wdXNoKChyZXMubWF0Y2hbMV18fFwiXCIpLnJlcGxhY2UoXCJzdGF0aWMgXCIsIFwiXCIpLnJlcGxhY2UoL1xcc3syLH0vLCBcIiBcIikgfHwgXCJcIilcbiAgICAgIG1ldGhvZC5wdXNoKHJlcy5tYXRjaFsyXSArIHJlcy5tYXRjaFszXSArIChyZXMubWF0Y2hbNF18fFwiXCIpKVxuICAgICAgd29yay5tZXRob2RzLnB1c2gobWV0aG9kKVxuICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gICNcdEZpbmQgYm90aCBuYW1lIGFuZCBtZXRob2RzXG4gICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgcmVhZEZpbGU6ICh3b3JrKSAtPlxuICAgIEBmaW5kTmFtZSh3b3JrKVxuICAgIEBmaW5kTWV0aG9kKHdvcmspXG4gICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgI1x0UmV0dXJuIGEgcHJvbWlzZSB0b3dhcmQgYSBuZXcgLmNwcCBmaWxlIG9wZW5cbiAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICBjcmVhdGVGaWxlOiAod29yaykgLT5cbiAgICByZXR1cm4gYXRvbS53b3Jrc3BhY2Uub3Blbih3b3JrLmltcGxlbWVudGF0aW9uUGF0aClcbiAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICAjIFdyaXRlIHRoZSBoZWFkIG9mIGEgLmNwcCBmaWxlIGRlcGVuZGluZyBvbiBpZlxuICAjIGl0J3MgYSBuYW1lc3BhY2Ugb3IgYSBjbGFzc1xuICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gIGNyZWF0ZUhlYWQ6ICh3b3JrKSAtPlxuICAgIHdvcmsuZWRpdG9yLmluc2VydFRleHQoXCIjaW5jbHVkZSBcXFwiI3t3b3JrLmNsYXNzbmFtZX0uaFxcXCJcIilcbiAgICB3b3JrLmVkaXRvci5pbnNlcnROZXdsaW5lKClcbiAgICB3b3JrLmVkaXRvci5pbnNlcnROZXdsaW5lKClcbiAgICB3b3JrLmVkaXRvci5pbnNlcnROZXdsaW5lKClcbiAgICBpZiAod29yay5uYW1lc3BhY2UpXG4gICAgICB3b3JrLmVkaXRvci5pbnNlcnRUZXh0KFwibmFtZXNwYWNlICN7d29yay5jbGFzc25hbWV9XCIpXG4gICAgICB3b3JrLmVkaXRvci5pbnNlcnROZXdsaW5lKClcbiAgICAgIHdvcmsuZWRpdG9yLmluc2VydFRleHQoXCJ7XCIpXG4gICAgICB3b3JrLmVkaXRvci5pbnNlcnROZXdsaW5lKClcbiAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICAjIEluc2VydCBhIGNvbW1lbnQgbGluZSBvbiB0b3Agb2YgYSBtZXRob2RcbiAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICBtZXRob2RDb21tZW50OiAod29yaykgLT5cbiAgICB3b3JrLmVkaXRvci5pbnNlcnRUZXh0KFwiLypcIiArIFwiKlwiLnJlcGVhdCg2OCkpXG4gICAgd29yay5lZGl0b3IuaW5zZXJ0TmV3bGluZSgpXG4gICAgd29yay5lZGl0b3IuaW5zZXJ0VGV4dChcIiogQ29tbWVudFwiKVxuICAgIHdvcmsuZWRpdG9yLmluc2VydE5ld2xpbmUoKVxuICAgIHdvcmsuZWRpdG9yLmluc2VydFRleHQoIFwiKlwiLnJlcGVhdCg2OCkrIFwiKi9cIilcbiAgICB3b3JrLmVkaXRvci5pbnNlcnROZXdsaW5lKClcbiAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICAjXHRXcml0ZSB0aGUgbWV0aG9kIG5hbWVcbiAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICBtZXRob2ROYW1lOiAod29yayxtZXRob2QpIC0+XG4gICAgaWYgKG1ldGhvZFswXSlcbiAgICAgIHdvcmsuZWRpdG9yLmluc2VydFRleHQoXCIje21ldGhvZFswXX0gXCIpXG4gICAgaWYgKHdvcmsubmFtZXNwYWNlKVxuICAgICAgd29yay5lZGl0b3IuaW5zZXJ0VGV4dChcIiN7bWV0aG9kWzFdfVwiIClcbiAgICBlbHNlXG4gICAgICB3b3JrLmVkaXRvci5pbnNlcnRUZXh0KFwiI3t3b3JrLmNsYXNzbmFtZX06OiN7bWV0aG9kWzFdfVwiKVxuICAgIHdvcmsuZWRpdG9yLmluc2VydE5ld2xpbmUoKVxuICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gICNcdFdyaXRlIHRoZSBib2R5IG9mIHRoZSBpbXBsZW1lbnRhdGlvbiBvZiBhIG1ldGhvZFxuICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gIG1ldGhvZEJvZHk6ICh3b3JrKSAtPlxuICAgIHdvcmsuZWRpdG9yLmluc2VydFRleHQoXCJ7XCIpXG4gICAgd29yay5lZGl0b3IuaW5zZXJ0TmV3bGluZSgpXG4gICAgd29yay5lZGl0b3IubW92ZURvd24oMSlcbiAgICB3b3JrLmVkaXRvci5pbnNlcnROZXdsaW5lKClcbiAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICAjXHRBZGQgYSBtZXRob2QgYXQgdGhlIGN1cnNvciBwb3NpdGlvblxuICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gIGFkZE1ldGhvZDogKHdvcmssbWV0aG9kKSAtPlxuICAgIEBtZXRob2RDb21tZW50KHdvcmspXG4gICAgQG1ldGhvZE5hbWUod29yayxtZXRob2QpXG4gICAgQG1ldGhvZEJvZHkod29yaylcbiAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICAjXHRDcmVhdGUgYWxsIHRoZSBtZXRob2RzIGJhY2sgdG8gYmFja1xuICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gIGNyZWF0ZU1ldGhvZHM6ICh3b3JrKSAtPlxuICAgIGN0eCA9IHRoaXNcbiAgICB3b3JrLm1ldGhvZHMuZm9yRWFjaCAobWV0aG9kKSAtPlxuICAgICAgY3R4LmFkZE1ldGhvZCh3b3JrLG1ldGhvZCxjdHgpXG4gICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgI1x0V3JpdGUgdGhlIHdob2xlIGZpbGUgLmNwcFxuICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gIHdyaXRlSW5FZGl0b3I6ICh3b3JrKSAtPlxuICAgIEBjcmVhdGVIZWFkKHdvcmspXG4gICAgQGNyZWF0ZU1ldGhvZHMod29yaylcbiAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICAjXHRnZW5lcmF0ZSBhIHdvcmsgb2JqZWN0XG4gICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgZ2VuZXJhdGVXb3JrOiAtPlxuICAgIGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgIGJ1ZmZlciA9IGVkaXRvci5nZXRCdWZmZXIoKVxuICAgIHdvcmsgPVxuICAgICAge1xuICAgICAgICBlZGl0b3IsXG4gICAgICAgIGJ1ZmZlcixcbiAgICAgICAgaGVhZGVyUGF0aCA6IFwiXCJcbiAgICAgICAgaW1wbGVtZW50YXRpb25QYXRoIDogXCJcIlxuICAgICAgICBjbGFzc25hbWUgOiBcIlwiXG4gICAgICAgIG5hbWVzcGFjZSA6IGZhbHNlXG4gICAgICAgIG1ldGhvZHMgOiBbXVxuICAgICAgfVxuICAgIHJldHVybiB3b3JrXG4gICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgI1x0UmVhZCB0aGUgaGVhZGVyIGZpbGVzIHlvdSBhcmUgaW4gYW5kIGdlbmVyYXRlIGEgLmNwcFxuICAjIGluIHRoZSBzYW1lIHBhdGhcbiAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICBnZW5lcmF0ZTogLT5cbiAgICB3b3JrID0gQGdlbmVyYXRlV29yaygpXG4gICAgd29yay5lZGl0b3Iuc2F2ZSgpXG4gICAgQHJlYWRGaWxlKHdvcmspXG4gICAgQGZpbmRQYXRoKHdvcmspXG4gICAgY29uc29sZS5sb2cod29yay5oZWFkZXJQYXRoKVxuICAgIGNvbnNvbGUubG9nKHdvcmsuaW1wbGVtZW50YXRpb25QYXRoKVxuICAgIHdvcmsuaGVhZGVyUGF0aCA9IHdvcmsuZWRpdG9yLmdldFBhdGgoKVxuICAgIHdvcmsuaW1wbGVtZW50YXRpb25QYXRoID0gd29yay5oZWFkZXJQYXRoLnJlcGxhY2UoXCIuaFwiLFwiLmNwcFwiKVxuICAgIGN0eCA9IHRoaXNcbiAgICBAY3JlYXRlRmlsZSh3b3JrKS50aGVuIChlZGl0b3IpIC0+XG4gICAgICB3b3JrLmVkaXRvciA9IGVkaXRvclxuICAgICAgd29yay5idWZmZXIgPSB3b3JrLmVkaXRvci5nZXRCdWZmZXIoKVxuICAgICAgY3R4LndyaXRlSW5FZGl0b3Iod29yaylcbiAgICByZXR1cm5cbiJdfQ==