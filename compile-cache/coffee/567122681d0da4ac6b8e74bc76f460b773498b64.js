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
      work.headerPath = work.editor.getPath();
      work.implementationPath = work.headerPath.replace(".h", ".cpp");
      ctx = this;
      this.createFile(work).then(function(editor) {
        work.editor = editor;
        work.buffer = work.editor.getBuffer();
        return ctx.writeInEditor(work);
      });
      return;
      return {
        add: function() {
          work = this.generateWork();
          work.editor.save;
          this.findName(work);
          this.findPath(work);
          ctx = this;
          return this.createFile(work).then(function(editor) {
            work.editor = editor;
            work.buffer = work.editor.getBuffer();
            return ctx.addMethod;
          });
        }
      };
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYmlsbHkvZ2l0aHViL2hlYWRlci1pbXBsZW1lbnRhdGlvbi9saWIvaGVhZGVyLWltcGxlbWVudGF0aW9uLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSOztFQUV4QixNQUFNLENBQUMsT0FBUCxHQUVFO0lBQUEsUUFBQSxFQUFVLFNBQUMsS0FBRDtNQUVSLElBQUMsQ0FBQSxhQUFELEdBQWlCLElBQUk7TUFFckIsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFBb0M7UUFBQSxnQ0FBQSxFQUFrQyxDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFBO21CQUFHLEtBQUMsQ0FBQSxRQUFELENBQUE7VUFBSDtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBbEM7T0FBcEMsQ0FBbkI7TUFFQSxJQUFDLENBQUEsa0JBQUQsR0FBc0I7TUFDdEIsSUFBQyxDQUFBLGNBQUQsR0FBa0I7YUFDbEIsSUFBQyxDQUFBLGlCQUFELEdBQXFCO0lBUmIsQ0FBVjtJQWNBLFFBQUEsRUFBVSxTQUFDLElBQUQ7TUFDUixJQUFJLENBQUMsVUFBTCxHQUFrQjtNQUNsQixJQUFJLENBQUMsa0JBQUwsR0FBMEI7YUFDMUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQW9CLElBQUMsQ0FBQSxpQkFBckIsRUFBd0MsU0FBQyxJQUFEO1FBQ3RDLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFkLENBQTBCLElBQUksQ0FBQyxTQUFOLEdBQWdCLElBQXpDLENBQUo7VUFDRSxJQUFJLENBQUMsVUFBTCxHQUFrQixJQUFJLENBQUMsU0FEekI7O1FBRUEsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQWQsQ0FBMEIsSUFBSSxDQUFDLFNBQU4sR0FBZ0IsTUFBekMs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QUksQ0FBQyxNQUFMLEdBQWMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFaLENBQUE7ZUFDZCxHQUFHLENBQUMsYUFBSixDQUFrQixJQUFsQjtNQUhxQixDQUF2QjtBQUlBO2FBRUE7UUFBQSxHQUFBLEVBQUssU0FBQTtVQUNILElBQUEsR0FBTyxJQUFDLENBQUEsWUFBRCxDQUFBO1VBQ1AsSUFBSSxDQUFDLE1BQU0sQ0FBQztVQUNaLElBQUMsQ0FBQSxRQUFELENBQVUsSUFBVjtVQUNBLElBQUMsQ0FBQSxRQUFELENBQVUsSUFBVjtVQUNBLEdBQUEsR0FBTTtpQkFDTixJQUFDLENBQUEsVUFBRCxDQUFZLElBQVosQ0FBaUIsQ0FBQyxJQUFsQixDQUF1QixTQUFDLE1BQUQ7WUFDckIsSUFBSSxDQUFDLE1BQUwsR0FBYztZQUNkLElBQUksQ0FBQyxNQUFMLEdBQWMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFaLENBQUE7bUJBQ2QsR0FBRyxDQUFDO1VBSGlCLENBQXZCO1FBTkcsQ0FBTDs7SUFkUSxDQTVJVjs7QUFKRiIsInNvdXJjZXNDb250ZW50IjpbIntDb21wb3NpdGVEaXNwb3NhYmxlfSA9IHJlcXVpcmUgJ2F0b20nXG5cbm1vZHVsZS5leHBvcnRzID1cblxuICBhY3RpdmF0ZTogKHN0YXRlKSAtPlxuICAgICMgRXZlbnRzIHN1YnNjcmliZWQgdG8gaW4gYXRvbSdzIHN5c3RlbSBjYW4gYmUgZWFzaWx5IGNsZWFuZWQgdXAgd2l0aCBhIENvbXBvc2l0ZURpc3Bvc2FibGVcbiAgICBAc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlXG4gICAgIyBSZWdpc3RlciBjb21tYW5kIHRoYXQgdG9nZ2xlcyB0aGlzIHZpZXdcbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20td29ya3NwYWNlJywgJ2hlYWRlci1pbXBsZW1lbnRhdGlvbjpnZW5lcmF0ZSc6ID0+IEBnZW5lcmF0ZSgpXG4gICAgIyBSZWdFeCBQYXR0ZXJuc1xuICAgIEBDTEFTU19OQU1FX1BBVFRFUk4gPSAvKCg/Om5hbWVzcGFjZXxjbGFzcykpK1xccysoW1xcd19dKykrXFxzKnsvZ1xuICAgIEBNRVRIT0RfUEFUVEVSTiA9IC9eXFxzKigoPzpjb25zdHxzdGF0aWN8dmlydHVhbHx2b2xhdGlsZXxmcmllbmQpezAsNX1cXHMqXFx3Kyg/Ojp7Mn1cXHcrKXswLH1cXHMqXFwqKiY/KT9cXHMrKFtcXHd+XSspXFxzKihcXCguKlxcKSlcXHMqPyggY29uc3QpPzsvZ21cbiAgICBARklMRV9OQU1FX1BBVFRFUk4gPSAvKFtcXHddKylcXC4oW2h8Y3BwXSspL1xuXG4gICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgIyBGaW5kIHRoZSBQYXJoIG9mIHRoZSBzb3VyY2UgZmlsZSBhbmQgdGhlIGhlYWRlcnMgZmlsZVxuICAjIHJldHVybiBlbXB0eSBpZiBub3RoaW5nIGlzIGZvdW5kXG4gICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgZmluZFBhdGg6ICh3b3JrKSAtPlxuICAgIHdvcmsuaGVhZGVyUGF0aCA9IFwiXCJcbiAgICB3b3JrLmltcGxlbWVudGF0aW9uUGF0aCA9IFwiXCJcbiAgICBhdG9tLndvcmtzcGFjZS5zY2FuIEBGSUxFX05BTUVfUEFUVEVSTiwgKGZpbGUpIC0+XG4gICAgICBpZiAoZmlsZS5maWxlUGF0aC5pbmNsdWRlcyhcIiN7d29yay5jbGFzc25hbWV9LmhcIikpXG4gICAgICAgIHdvcmsuaGVhZGVyUGF0aCA9IGZpbGUuZmlsZVBhdGhcbiAgICAgIGlmIChmaWxlLmZpbGVQYXRoLmluY2x1ZGVzKFwiI3t3b3JrLmNsYXNzbmFtZX0uY3BwXCIpKVxuICAgICAgICB3b3JrLmltcGxlbWVudGF0aW9uUGF0aCA9IGZpbGUuZmlsZVBhdGhcblxuICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gICNcdEZpbmQgd2V0aGVyIGl0IGlzIGEgbmFtZXNwYWNlIG9yIGEgY2xhc3NlIGFuZCBhZGQgaXRzIG5hbWUgdG8gd29ya1xuICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gIGZpbmROYW1lOiAod29yaykgLT5cbiAgICB3b3JrLmJ1ZmZlci5zY2FuIEBDTEFTU19OQU1FX1BBVFRFUk4sIChyZXMpIC0+XG4gICAgICB3b3JrLm5hbWVzcGFjZSA9IHJlcy5tYXRjaFsxXSA9PSBcIm5hbWVzcGFjZVwiXG4gICAgICB3b3JrLmNsYXNzbmFtZSA9IHJlcy5tYXRjaFsyXVxuICAgIHdvcmsuZWRpdG9yLm1vdmVUb0VuZE9mTGluZSgpXG5cbiAgXG4gIGZpbmRBbGxNZXRob2RzOiAod29yaykgLT5cbiAgICBjdHggPSB0aGlzXG4gICAgd29yay5idWZmZXIuc2NhbiBATUVUSE9EX1BBVFRFUk4sIChyZXMpIC0+XG4gICAgICBjdHguYWRkTWV0aG9kKHdvcmsscmVzKVxuICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gICNcdGZpbmQgYWxsIHRoZSBtZXRob2RzIGluIHRoZSBoZWFkZXJzIGZpbGVcbiAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICBhZGRNZXRob2Q6ICh3b3JrLHJlcykgLT5cbiAgICBtZXRob2QgPSBbXVxuICAgIG1ldGhvZC5wdXNoKChyZXMubWF0Y2hbMV18fFwiXCIpLnJlcGxhY2UoXCJzdGF0aWMgXCIsIFwiXCIpLnJlcGxhY2UoL1xcc3syLH0vLCBcIiBcIikgfHwgXCJcIilcbiAgICBtZXRob2QucHVzaChyZXMubWF0Y2hbMl0gKyByZXMubWF0Y2hbM10gKyAocmVzLm1hdGNoWzRdfHxcIlwiKSlcbiAgICB3b3JrLm1ldGhvZHMucHVzaChtZXRob2QpXG4gICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgI1x0RmluZCBib3RoIG5hbWUgYW5kIG1ldGhvZHNcbiAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICByZWFkRmlsZTogKHdvcmspIC0+XG4gICAgQGZpbmROYW1lKHdvcmspXG4gICAgQGZpbmRBbGxNZXRob2RzKHdvcmspXG4gICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgI1x0UmV0dXJuIGEgcHJvbWlzZSB0b3dhcmQgYSBuZXcgLmNwcCBmaWxlIG9wZW5cbiAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICBjcmVhdGVGaWxlOiAod29yaykgLT5cbiAgICByZXR1cm4gYXRvbS53b3Jrc3BhY2Uub3Blbih3b3JrLmltcGxlbWVudGF0aW9uUGF0aClcbiAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICAjIFdyaXRlIHRoZSBoZWFkIG9mIGEgLmNwcCBmaWxlIGRlcGVuZGluZyBvbiBpZlxuICAjIGl0J3MgYSBuYW1lc3BhY2Ugb3IgYSBjbGFzc1xuICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gIGNyZWF0ZUhlYWQ6ICh3b3JrKSAtPlxuICAgIHdvcmsuZWRpdG9yLmluc2VydFRleHQoXCIjaW5jbHVkZSBcXFwiI3t3b3JrLmNsYXNzbmFtZX0uaFxcXCJcIilcbiAgICB3b3JrLmVkaXRvci5pbnNlcnROZXdsaW5lKClcbiAgICB3b3JrLmVkaXRvci5pbnNlcnROZXdsaW5lKClcbiAgICB3b3JrLmVkaXRvci5pbnNlcnROZXdsaW5lKClcbiAgICBpZiAod29yay5uYW1lc3BhY2UpXG4gICAgICB3b3JrLmVkaXRvci5pbnNlcnRUZXh0KFwibmFtZXNwYWNlICN7d29yay5jbGFzc25hbWV9XCIpXG4gICAgICB3b3JrLmVkaXRvci5pbnNlcnROZXdsaW5lKClcbiAgICAgIHdvcmsuZWRpdG9yLmluc2VydFRleHQoXCJ7XCIpXG4gICAgICB3b3JrLmVkaXRvci5pbnNlcnROZXdsaW5lKClcbiAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICAjIEluc2VydCBhIGNvbW1lbnQgbGluZSBvbiB0b3Agb2YgYSBtZXRob2RcbiAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICBtZXRob2RDb21tZW50OiAod29yaykgLT5cbiAgICB3b3JrLmVkaXRvci5pbnNlcnRUZXh0KFwiLypcIiArIFwiKlwiLnJlcGVhdCg2OCkpXG4gICAgd29yay5lZGl0b3IuaW5zZXJ0TmV3bGluZSgpXG4gICAgd29yay5lZGl0b3IuaW5zZXJ0VGV4dChcIiogQ29tbWVudFwiKVxuICAgIHdvcmsuZWRpdG9yLmluc2VydE5ld2xpbmUoKVxuICAgIHdvcmsuZWRpdG9yLmluc2VydFRleHQoIFwiKlwiLnJlcGVhdCg2OCkrIFwiKi9cIilcbiAgICB3b3JrLmVkaXRvci5pbnNlcnROZXdsaW5lKClcbiAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICAjXHRXcml0ZSB0aGUgbWV0aG9kIG5hbWVcbiAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICBtZXRob2ROYW1lOiAod29yayxtZXRob2QpIC0+XG4gICAgaWYgKG1ldGhvZFswXSlcbiAgICAgIHdvcmsuZWRpdG9yLmluc2VydFRleHQoXCIje21ldGhvZFswXX0gXCIpXG4gICAgaWYgKHdvcmsubmFtZXNwYWNlKVxuICAgICAgd29yay5lZGl0b3IuaW5zZXJ0VGV4dChcIiN7bWV0aG9kWzFdfVwiIClcbiAgICBlbHNlXG4gICAgICB3b3JrLmVkaXRvci5pbnNlcnRUZXh0KFwiI3t3b3JrLmNsYXNzbmFtZX06OiN7bWV0aG9kWzFdfVwiKVxuICAgIHdvcmsuZWRpdG9yLmluc2VydE5ld2xpbmUoKVxuICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gICNcdFdyaXRlIHRoZSBib2R5IG9mIHRoZSBpbXBsZW1lbnRhdGlvbiBvZiBhIG1ldGhvZFxuICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gIG1ldGhvZEJvZHk6ICh3b3JrKSAtPlxuICAgIHdvcmsuZWRpdG9yLmluc2VydFRleHQoXCJ7XCIpXG4gICAgd29yay5lZGl0b3IuaW5zZXJ0TmV3bGluZSgpXG4gICAgd29yay5lZGl0b3IubW92ZURvd24oMSlcbiAgICB3b3JrLmVkaXRvci5pbnNlcnROZXdsaW5lKClcbiAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICAjXHRBZGQgYSBtZXRob2QgYXQgdGhlIGN1cnNvciBwb3NpdGlvblxuICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gIGFkZE1ldGhvZDogKHdvcmssbWV0aG9kKSAtPlxuICAgIEBtZXRob2RDb21tZW50KHdvcmspXG4gICAgQG1ldGhvZE5hbWUod29yayxtZXRob2QpXG4gICAgQG1ldGhvZEJvZHkod29yaylcbiAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICAjXHRDcmVhdGUgYWxsIHRoZSBtZXRob2RzIGJhY2sgdG8gYmFja1xuICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gIGNyZWF0ZU1ldGhvZHM6ICh3b3JrKSAtPlxuICAgIGN0eCA9IHRoaXNcbiAgICB3b3JrLm1ldGhvZHMuZm9yRWFjaCAobWV0aG9kKSAtPlxuICAgICAgY3R4LmFkZE1ldGhvZCh3b3JrLG1ldGhvZCxjdHgpXG4gICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgI1x0V3JpdGUgdGhlIHdob2xlIGZpbGUgLmNwcFxuICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gIHdyaXRlSW5FZGl0b3I6ICh3b3JrKSAtPlxuICAgIEBjcmVhdGVIZWFkKHdvcmspXG4gICAgQGNyZWF0ZU1ldGhvZHMod29yaylcbiAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICAjXHRnZW5lcmF0ZSBhIHdvcmsgb2JqZWN0XG4gICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgZ2VuZXJhdGVXb3JrOiAtPlxuICAgIGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgIGJ1ZmZlciA9IGVkaXRvci5nZXRCdWZmZXIoKVxuICAgIHdvcmsgPVxuICAgICAge1xuICAgICAgICBlZGl0b3IsXG4gICAgICAgIGJ1ZmZlcixcbiAgICAgICAgaGVhZGVyUGF0aCA6IFwiXCJcbiAgICAgICAgaW1wbGVtZW50YXRpb25QYXRoIDogXCJcIlxuICAgICAgICBjbGFzc25hbWUgOiBcIlwiXG4gICAgICAgIG5hbWVzcGFjZSA6IGZhbHNlXG4gICAgICAgIG1ldGhvZHMgOiBbXVxuICAgICAgfVxuICAgIHJldHVybiB3b3JrXG4gICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgI1x0UmVhZCB0aGUgaGVhZGVyIGZpbGVzIHlvdSBhcmUgaW4gYW5kIGdlbmVyYXRlIGEgLmNwcFxuICAjIGluIHRoZSBzYW1lIHBhdGhcbiAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICBnZW5lcmF0ZTogLT5cbiAgICB3b3JrID0gQGdlbmVyYXRlV29yaygpXG4gICAgd29yay5lZGl0b3Iuc2F2ZSgpXG4gICAgQHJlYWRGaWxlKHdvcmspXG4gICAgQGZpbmRQYXRoKHdvcmspXG4gICAgd29yay5oZWFkZXJQYXRoID0gd29yay5lZGl0b3IuZ2V0UGF0aCgpXG4gICAgd29yay5pbXBsZW1lbnRhdGlvblBhdGggPSB3b3JrLmhlYWRlclBhdGgucmVwbGFjZShcIi5oXCIsXCIuY3BwXCIpXG4gICAgY3R4ID0gdGhpc1xuICAgIEBjcmVhdGVGaWxlKHdvcmspLnRoZW4gKGVkaXRvcikgLT5cbiAgICAgIHdvcmsuZWRpdG9yID0gZWRpdG9yXG4gICAgICB3b3JrLmJ1ZmZlciA9IHdvcmsuZWRpdG9yLmdldEJ1ZmZlcigpXG4gICAgICBjdHgud3JpdGVJbkVkaXRvcih3b3JrKVxuICAgIHJldHVyblxuXG4gICAgYWRkOiAtPlxuICAgICAgd29yayA9IEBnZW5lcmF0ZVdvcmsoKVxuICAgICAgd29yay5lZGl0b3Iuc2F2ZVxuICAgICAgQGZpbmROYW1lKHdvcmspXG4gICAgICBAZmluZFBhdGgod29yaylcbiAgICAgIGN0eCA9IHRoaXNcbiAgICAgIEBjcmVhdGVGaWxlKHdvcmspLnRoZW4gKGVkaXRvcikgLT5cbiAgICAgICAgd29yay5lZGl0b3IgPSBlZGl0b3JcbiAgICAgICAgd29yay5idWZmZXIgPSB3b3JrLmVkaXRvci5nZXRCdWZmZXIoKVxuICAgICAgICBjdHguYWRkTWV0aG9kXG4iXX0=
