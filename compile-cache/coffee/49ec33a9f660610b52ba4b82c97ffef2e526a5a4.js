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
      return atom.workspace.scan(this.FILE_NAME_PATTERN(function(file) {
        if (file.getBaseName() === (work.classname + ".h")) {
          return work.headerPath = file.getRealPathSync();
        } else if (file.getBaseName() === (work.classname + ".cpp")) {
          return work.implementationPath = file.getRealPathSync();
        }
      }));
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
      console.log(implementationPath);
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
      var ctx, headerPath, implementationPath, work;
      work = this.generateWork();
      work.editor.save();
      this.readFile(work);
      this.findPath(work);
      console.log(work.headerPath);
      console.log(work.implementationPath);
      headerPath = work.editor.getPath();
      implementationPath = work.headerPath.replace(".h", ".cpp");
      ctx = this;
      this.createFile(work).then(function(editor) {
        work.editor = editor;
        work.buffer = work.editor.getBuffer();
        return ctx.writeInEditor(work);
      });
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYmlsbHkvZ2l0aHViL2hlYWRlci1pbXBsZW1lbnRhdGlvbi9saWIvaGVhZGVyLWltcGxlbWVudGF0aW9uLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSOztFQUV4QixNQUFNLENBQUMsT0FBUCxHQUVFO0lBQUEsUUFBQSxFQUFVLFNBQUMsS0FBRDtNQUVSLElBQUMsQ0FBQSxhQUFELEdBQWlCLElBQUk7TUFFckIsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFBb0M7UUFBQSxnQ0FBQSxFQUFrQyxDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFBO21CQUFHLEtBQUMsQ0FBQSxRQUFELENBQUE7VUFBSDtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBbEM7T0FBcEMsQ0FBbkI7TUFFQSxJQUFDLENBQUEsa0JBQUQsR0FBc0I7TUFDdEIsSUFBQyxDQUFBLGNBQUQsR0FBa0I7YUFDbEIsSUFBQyxDQUFBLGlCQUFELEdBQXFCO0lBUmIsQ0FBVjtJQWFBLFFBQUEsRUFBVSxTQUFDLElBQUQ7YUFDUixJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBb0IsSUFBQyxDQUFBLGlCQUFELENBQW1CLFNBQUMsSUFBRDtRQUNyQyxJQUFJLElBQUksQ0FBQyxXQUFMLENBQUEsQ0FBQSxLQUFzQixDQUFDLElBQUksQ0FBQyxTQUFMLEdBQWUsSUFBaEIsQ0FBMUI7aUJBQ0UsSUFBSSxDQUFDLFVBQUwsR0FBa0IsSUFBSSxDQUFDLGVBQUwsQ0FBQSxFQURwQjtTQUFBLE1BRUssSUFBSSxJQUFJLENBQUMsV0FBTCxDQUFBLENBQUEsS0FBc0IsQ0FBQyxJQUFJLENBQUMsU0FBTCxHQUFlLE1BQWhCLENBQTFCO2lCQUNILElBQUksQ0FBQyxrQkFBTCxHQUEw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WixDQUFBO2VBQ2QsR0FBRyxDQUFDLGFBQUosQ0FBa0IsSUFBbEI7TUFIcUIsQ0FBdkI7SUFWUSxDQXJJVjs7QUFKRiIsInNvdXJjZXNDb250ZW50IjpbIntDb21wb3NpdGVEaXNwb3NhYmxlfSA9IHJlcXVpcmUgJ2F0b20nXG5cbm1vZHVsZS5leHBvcnRzID1cblxuICBhY3RpdmF0ZTogKHN0YXRlKSAtPlxuICAgICMgRXZlbnRzIHN1YnNjcmliZWQgdG8gaW4gYXRvbSdzIHN5c3RlbSBjYW4gYmUgZWFzaWx5IGNsZWFuZWQgdXAgd2l0aCBhIENvbXBvc2l0ZURpc3Bvc2FibGVcbiAgICBAc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlXG4gICAgIyBSZWdpc3RlciBjb21tYW5kIHRoYXQgdG9nZ2xlcyB0aGlzIHZpZXdcbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20td29ya3NwYWNlJywgJ2hlYWRlci1pbXBsZW1lbnRhdGlvbjpnZW5lcmF0ZSc6ID0+IEBnZW5lcmF0ZSgpXG4gICAgIyBSZWdFeCBQYXR0ZXJuc1xuICAgIEBDTEFTU19OQU1FX1BBVFRFUk4gPSAvKCg/Om5hbWVzcGFjZXxjbGFzcykpK1xccysoW1xcd19dKykrXFxzKnsvZ1xuICAgIEBNRVRIT0RfUEFUVEVSTiA9IC9eXFxzKigoPzpjb25zdHxzdGF0aWN8dmlydHVhbHx2b2xhdGlsZXxmcmllbmQpezAsNX1cXHMqXFx3Kyg/Ojp7Mn1cXHcrKXswLH1cXHMqXFwqKiY/KT9cXHMrKFtcXHd+XSspXFxzKihcXCguKlxcKSlcXHMqPyggY29uc3QpPzsvZ21cbiAgICBARklMRV9OQU1FX1BBVFRFUk4gPSAvKFtcXHddKylcXC4oW2h8Y3BwXSspL1xuXG4gICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgI1xuICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gIGZpbmRQYXRoOiAod29yaykgLT5cbiAgICBhdG9tLndvcmtzcGFjZS5zY2FuIEBGSUxFX05BTUVfUEFUVEVSTiAoZmlsZSkgLT5cbiAgICAgIGlmIChmaWxlLmdldEJhc2VOYW1lKCkgPT0gKHdvcmsuY2xhc3NuYW1lK1wiLmhcIikpXG4gICAgICAgIHdvcmsuaGVhZGVyUGF0aCA9IGZpbGUuZ2V0UmVhbFBhdGhTeW5jKClcbiAgICAgIGVsc2UgaWYgKGZpbGUuZ2V0QmFzZU5hbWUoKSA9PSAod29yay5jbGFzc25hbWUrXCIuY3BwXCIpKVxuICAgICAgICB3b3JrLmltcGxlbWVudGF0aW9uUGF0aCA9IGZpbGUuZ2V0UmVhbFBhdGhTeW5jKClcblxuICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gICNcdEZpbmQgd2V0aGVyIGl0IGlzIGEgbmFtZXNwYWNlIG9yIGEgY2xhc3NlIGFuZCBhZGQgaXRzIG5hbWUgdG8gd29ya1xuICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gIGZpbmROYW1lOiAod29yaykgLT5cbiAgICB3b3JrLmJ1ZmZlci5zY2FuIEBDTEFTU19OQU1FX1BBVFRFUk4sIChyZXMpIC0+XG4gICAgICB3b3JrLm5hbWVzcGFjZSA9IHJlcy5tYXRjaFsxXSA9PSBcIm5hbWVzcGFjZVwiXG4gICAgICB3b3JrLmNsYXNzbmFtZSA9IHJlcy5tYXRjaFsyXVxuICAgIHdvcmsuZWRpdG9yLm1vdmVUb0VuZE9mTGluZSgpXG4gICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgI1x0ZmluZCBhbGwgdGhlIG1ldGhvZHMgaW4gdGhlIGhlYWRlcnMgZmlsZVxuICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gIGZpbmRNZXRob2Q6ICh3b3JrKSAtPlxuICAgIHdvcmsuYnVmZmVyLnNjYW4gQE1FVEhPRF9QQVRURVJOLCAocmVzKSAtPlxuICAgICAgbWV0aG9kID0gW11cbiAgICAgIG1ldGhvZC5wdXNoKChyZXMubWF0Y2hbMV18fFwiXCIpLnJlcGxhY2UoXCJzdGF0aWMgXCIsIFwiXCIpLnJlcGxhY2UoL1xcc3syLH0vLCBcIiBcIikgfHwgXCJcIilcbiAgICAgIG1ldGhvZC5wdXNoKHJlcy5tYXRjaFsyXSArIHJlcy5tYXRjaFszXSArIChyZXMubWF0Y2hbNF18fFwiXCIpKVxuICAgICAgd29yay5tZXRob2RzLnB1c2gobWV0aG9kKVxuICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gICNcdEZpbmQgYm90aCBuYW1lIGFuZCBtZXRob2RzXG4gICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgcmVhZEZpbGU6ICh3b3JrKSAtPlxuICAgIEBmaW5kTmFtZSh3b3JrKVxuICAgIEBmaW5kTWV0aG9kKHdvcmspXG4gICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgI1x0UmV0dXJuIGEgcHJvbWlzZSB0b3dhcmQgYSBuZXcgLmNwcCBmaWxlIG9wZW5cbiAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICBjcmVhdGVGaWxlOiAod29yaykgLT5cbiAgICByZXR1cm4gYXRvbS53b3Jrc3BhY2Uub3Blbih3b3JrLmltcGxlbWVudGF0aW9uUGF0aClcbiAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICAjIFdyaXRlIHRoZSBoZWFkIG9mIGEgLmNwcCBmaWxlIGRlcGVuZGluZyBvbiBpZlxuICAjIGl0J3MgYSBuYW1lc3BhY2Ugb3IgYSBjbGFzc1xuICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gIGNyZWF0ZUhlYWQ6ICh3b3JrKSAtPlxuICAgIHdvcmsuZWRpdG9yLmluc2VydFRleHQoXCIjaW5jbHVkZSBcXFwiI3t3b3JrLmNsYXNzbmFtZX0uaFxcXCJcIilcbiAgICB3b3JrLmVkaXRvci5pbnNlcnROZXdsaW5lKClcbiAgICB3b3JrLmVkaXRvci5pbnNlcnROZXdsaW5lKClcbiAgICB3b3JrLmVkaXRvci5pbnNlcnROZXdsaW5lKClcbiAgICBpZiAod29yay5uYW1lc3BhY2UpXG4gICAgICB3b3JrLmVkaXRvci5pbnNlcnRUZXh0KFwibmFtZXNwYWNlICN7d29yay5jbGFzc25hbWV9XCIpXG4gICAgICB3b3JrLmVkaXRvci5pbnNlcnROZXdsaW5lKClcbiAgICAgIHdvcmsuZWRpdG9yLmluc2VydFRleHQoXCJ7XCIpXG4gICAgICB3b3JrLmVkaXRvci5pbnNlcnROZXdsaW5lKClcbiAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICAjIEluc2VydCBhIGNvbW1lbnQgbGluZSBvbiB0b3Agb2YgYSBtZXRob2RcbiAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICBtZXRob2RDb21tZW50OiAod29yaykgLT5cbiAgICB3b3JrLmVkaXRvci5pbnNlcnRUZXh0KFwiLypcIiArIFwiKlwiLnJlcGVhdCg2OCkpXG4gICAgd29yay5lZGl0b3IuaW5zZXJ0TmV3bGluZSgpXG4gICAgd29yay5lZGl0b3IuaW5zZXJ0VGV4dChcIiogQ29tbWVudFwiKVxuICAgIHdvcmsuZWRpdG9yLmluc2VydE5ld2xpbmUoKVxuICAgIHdvcmsuZWRpdG9yLmluc2VydFRleHQoIFwiKlwiLnJlcGVhdCg2OCkrIFwiKi9cIilcbiAgICB3b3JrLmVkaXRvci5pbnNlcnROZXdsaW5lKClcbiAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICAjXHRXcml0ZSB0aGUgbWV0aG9kIG5hbWVcbiAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICBtZXRob2ROYW1lOiAod29yayxtZXRob2QpIC0+XG4gICAgaWYgKG1ldGhvZFswXSlcbiAgICAgIHdvcmsuZWRpdG9yLmluc2VydFRleHQoXCIje21ldGhvZFswXX0gXCIpXG4gICAgaWYgKHdvcmsubmFtZXNwYWNlKVxuICAgICAgd29yay5lZGl0b3IuaW5zZXJ0VGV4dChcIiN7bWV0aG9kWzFdfVwiIClcbiAgICBlbHNlXG4gICAgICB3b3JrLmVkaXRvci5pbnNlcnRUZXh0KFwiI3t3b3JrLmNsYXNzbmFtZX06OiN7bWV0aG9kWzFdfVwiKVxuICAgIHdvcmsuZWRpdG9yLmluc2VydE5ld2xpbmUoKVxuICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gICNcdFdyaXRlIHRoZSBib2R5IG9mIHRoZSBpbXBsZW1lbnRhdGlvbiBvZiBhIG1ldGhvZFxuICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gIG1ldGhvZEJvZHk6ICh3b3JrKSAtPlxuICAgIHdvcmsuZWRpdG9yLmluc2VydFRleHQoXCJ7XCIpXG4gICAgd29yay5lZGl0b3IuaW5zZXJ0TmV3bGluZSgpXG4gICAgd29yay5lZGl0b3IubW92ZURvd24oMSlcbiAgICB3b3JrLmVkaXRvci5pbnNlcnROZXdsaW5lKClcbiAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICAjXHRBZGQgYSBtZXRob2QgYXQgdGhlIGN1cnNvciBwb3NpdGlvblxuICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gIGFkZE1ldGhvZDogKHdvcmssbWV0aG9kKSAtPlxuICAgIEBtZXRob2RDb21tZW50KHdvcmspXG4gICAgQG1ldGhvZE5hbWUod29yayxtZXRob2QpXG4gICAgQG1ldGhvZEJvZHkod29yaylcbiAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICAjXHRDcmVhdGUgYWxsIHRoZSBtZXRob2RzIGJhY2sgdG8gYmFja1xuICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gIGNyZWF0ZU1ldGhvZHM6ICh3b3JrKSAtPlxuICAgIGN0eCA9IHRoaXNcbiAgICB3b3JrLm1ldGhvZHMuZm9yRWFjaCAobWV0aG9kKSAtPlxuICAgICAgY3R4LmFkZE1ldGhvZCh3b3JrLG1ldGhvZCxjdHgpXG4gICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgI1x0V3JpdGUgdGhlIHdob2xlIGZpbGUgLmNwcFxuICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gIHdyaXRlSW5FZGl0b3I6ICh3b3JrKSAtPlxuICAgIEBjcmVhdGVIZWFkKHdvcmspXG4gICAgQGNyZWF0ZU1ldGhvZHMod29yaylcbiAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICAjXHRnZW5lcmF0ZSBhIHdvcmsgb2JqZWN0XG4gICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgZ2VuZXJhdGVXb3JrOiAtPlxuICAgIGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgIGJ1ZmZlciA9IGVkaXRvci5nZXRCdWZmZXIoKVxuICAgIGNvbnNvbGUubG9nKGltcGxlbWVudGF0aW9uUGF0aClcbiAgICB3b3JrID1cbiAgICAgIHtcbiAgICAgICAgZWRpdG9yLFxuICAgICAgICBidWZmZXIsXG4gICAgICAgIGhlYWRlclBhdGggOiBcIlwiXG4gICAgICAgIGltcGxlbWVudGF0aW9uUGF0aCA6IFwiXCJcbiAgICAgICAgY2xhc3NuYW1lIDogXCJcIlxuICAgICAgICBuYW1lc3BhY2UgOiBmYWxzZVxuICAgICAgICBtZXRob2RzIDogW11cbiAgICAgIH1cbiAgICByZXR1cm4gd29ya1xuICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gICNcdFJlYWQgdGhlIGhlYWRlciBmaWxlcyB5b3UgYXJlIGluIGFuZCBnZW5lcmF0ZSBhIC5jcHBcbiAgIyBpbiB0aGUgc2FtZSBwYXRoXG4gICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgZ2VuZXJhdGU6IC0+XG4gICAgd29yayA9IEBnZW5lcmF0ZVdvcmsoKVxuICAgIHdvcmsuZWRpdG9yLnNhdmUoKVxuICAgIEByZWFkRmlsZSh3b3JrKVxuICAgIEBmaW5kUGF0aCh3b3JrKVxuICAgIGNvbnNvbGUubG9nKHdvcmsuaGVhZGVyUGF0aClcbiAgICBjb25zb2xlLmxvZyh3b3JrLmltcGxlbWVudGF0aW9uUGF0aClcbiAgICBoZWFkZXJQYXRoID0gd29yay5lZGl0b3IuZ2V0UGF0aCgpXG4gICAgaW1wbGVtZW50YXRpb25QYXRoID0gd29yay5oZWFkZXJQYXRoLnJlcGxhY2UoXCIuaFwiLFwiLmNwcFwiKVxuICAgIGN0eCA9IHRoaXNcbiAgICBAY3JlYXRlRmlsZSh3b3JrKS50aGVuIChlZGl0b3IpIC0+XG4gICAgICB3b3JrLmVkaXRvciA9IGVkaXRvclxuICAgICAgd29yay5idWZmZXIgPSB3b3JrLmVkaXRvci5nZXRCdWZmZXIoKVxuICAgICAgY3R4LndyaXRlSW5FZGl0b3Iod29yaylcbiAgICByZXR1cm5cbiJdfQ==
