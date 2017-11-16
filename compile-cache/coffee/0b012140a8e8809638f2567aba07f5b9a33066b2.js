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
      this.CLASS_NAME_PATTERN = /(?:namespace|class)\s+([\w_]+)+\s*{/;
      return this.METHOD_PATTERN = /^\s*((?:const|static|virtual|volatile|friend){0,5}\s*\w+(?::{2}\w+){0,}\s*\**&?)?\s+([\w~]+)\s*(\(.*\))\s*?( const)?;/gm;
    },
    findName: function(work) {
      work.buffer.scan(this.CLASS_NAME_PATTERN, function(res) {
        return work.classname = res.match[1];
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
      return work.editor.insertNewline();
    },
    methodComment: function(work) {
      work.editor.insertText("/*" + "*".repeat(68));
      work.editor.insertNewline();
      work.editor.insertText("* Comment");
      work.editor.insertNewline();
      work.editor.insertText("*".repeat(68) + "*/");
      return work.editor.insertNewline();
    },
    methodName: function(work, method, namespace) {
      if (method[0]) {
        work.editor.insertText(method[0] + " ");
      }
      if (namespace) {
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
    createMethods: function(work) {
      var ctx;
      ctx = this;
      return work.methods.forEach(function(method) {
        console.log(method);
        ctx.methodComment(work);
        ctx.methodName(work, method, true);
        return ctx.methodBody(work);
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYmlsbHkvZ2l0aHViL2hlYWRlci1pbXBsZW1lbnRhdGlvbi9saWIvaGVhZGVyLWltcGxlbWVudGF0aW9uLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQTtBQUFBLE1BQUE7O0VBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSOztFQUV4QixNQUFNLENBQUMsT0FBUCxHQUVFO0lBQUEsUUFBQSxFQUFVLFNBQUMsS0FBRDtNQUdSLElBQUMsQ0FBQSxhQUFELEdBQWlCLElBQUk7TUFHckIsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFBb0M7UUFBQSxnQ0FBQSxFQUFrQyxDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFBO21CQUFHLEtBQUMsQ0FBQSxRQUFELENBQUE7VUFBSDtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBbEM7T0FBcEMsQ0FBbkI7TUFHQSxJQUFDLENBQUEsa0JBQUQsR0FBc0I7YUFDdEIsSUFBQyxDQUFBLGNBQUQsR0FBa0I7SUFWVixDQUFWO0lBWUEsUUFBQSxFQUFVLFNBQUMsSUFBRDtNQUNSLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBWixDQUFpQixJQUFDLENBQUEsa0JBQWxCLEVBQXNDLFNBQUMsR0FBRDtlQUNwQyxJQUFJLENBQUMsU0FBTCxHQUFpQixHQUFHLENBQUMsS0FBTSxDQUFBLENBQUE7TUFEUyxDQUF0QzthQUVBLElBQUksQ0FBQyxNQUFNLENBQUMsZUFBWixDQUFBO0lBSFEsQ0FaVjtJQWlCQSxVQUFBLEVBQVksU0FBQyxJQUFEO2FBQ1YsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFaLENBQWlCLElBQUMsQ0FBQSxjQUFsQixFQUFrQyxTQUFDLEdBQUQ7QUFDaEMsWUFBQTtRQUFBLE1BQUEsR0FBUztRQUNULE1BQU0sQ0FBQyxJQUFQLENBQVksQ0FBQyxHQUFHLENBQUMs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XG5cbm1vZHVsZS5leHBvcnRzID1cblxuICBhY3RpdmF0ZTogKHN0YXRlKSAtPlxuXG4gICAgIyBFdmVudHMgc3Vic2NyaWJlZCB0byBpbiBhdG9tJ3Mgc3lzdGVtIGNhbiBiZSBlYXNpbHkgY2xlYW5lZCB1cCB3aXRoIGEgQ29tcG9zaXRlRGlzcG9zYWJsZVxuICAgIEBzdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGVcblxuICAgICMgUmVnaXN0ZXIgY29tbWFuZCB0aGF0IHRvZ2dsZXMgdGhpcyB2aWV3XG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29tbWFuZHMuYWRkICdhdG9tLXdvcmtzcGFjZScsICdoZWFkZXItaW1wbGVtZW50YXRpb246Z2VuZXJhdGUnOiA9PiBAZ2VuZXJhdGUoKVxuXG4gICAgIyBSZWdFeCBQYXR0ZXJuc1xuICAgIEBDTEFTU19OQU1FX1BBVFRFUk4gPSAvKD86bmFtZXNwYWNlfGNsYXNzKVxccysoW1xcd19dKykrXFxzKnsvXG4gICAgQE1FVEhPRF9QQVRURVJOID0gL15cXHMqKCg/OmNvbnN0fHN0YXRpY3x2aXJ0dWFsfHZvbGF0aWxlfGZyaWVuZCl7MCw1fVxccypcXHcrKD86OnsyfVxcdyspezAsfVxccypcXCoqJj8pP1xccysoW1xcd35dKylcXHMqKFxcKC4qXFwpKVxccyo/KCBjb25zdCk/Oy9nbVxuXG4gIGZpbmROYW1lOiAod29yaykgLT5cbiAgICB3b3JrLmJ1ZmZlci5zY2FuIEBDTEFTU19OQU1FX1BBVFRFUk4sIChyZXMpIC0+XG4gICAgICB3b3JrLmNsYXNzbmFtZSA9IHJlcy5tYXRjaFsxXVxuICAgIHdvcmsuZWRpdG9yLm1vdmVUb0VuZE9mTGluZSgpXG5cbiAgZmluZE1ldGhvZDogKHdvcmspIC0+XG4gICAgd29yay5idWZmZXIuc2NhbiBATUVUSE9EX1BBVFRFUk4sIChyZXMpIC0+XG4gICAgICBtZXRob2QgPSBbXVxuICAgICAgbWV0aG9kLnB1c2goKHJlcy5tYXRjaFsxXXx8XCJcIikucmVwbGFjZShcInN0YXRpYyBcIiwgXCJcIikucmVwbGFjZSgvXFxzezIsfS8sIFwiIFwiKSB8fCBcIlwiKVxuICAgICAgbWV0aG9kLnB1c2gocmVzLm1hdGNoWzJdICsgcmVzLm1hdGNoWzNdICsgKHJlcy5tYXRjaFs0XXx8XCJcIikpXG4gICAgICB3b3JrLm1ldGhvZHMucHVzaChtZXRob2QpXG5cbiAgcmVhZEZpbGU6ICh3b3JrKSAtPlxuICAgIEBmaW5kTmFtZSh3b3JrKVxuICAgIEBmaW5kTWV0aG9kKHdvcmspXG5cbiAgY3JlYXRlRmlsZTogKHdvcmspIC0+XG4gICAgcmV0dXJuIGF0b20ud29ya3NwYWNlLm9wZW4od29yay5pbXBsZW1lbnRhdGlvblBhdGgpXG5cbiAgY3JlYXRlSGVhZDogKHdvcmspIC0+XG4gICAgd29yay5lZGl0b3IuaW5zZXJ0VGV4dChcIiNpbmNsdWRlIFxcXCIje3dvcmsuY2xhc3NuYW1lfS5oXFxcIlwiKVxuICAgIHdvcmsuZWRpdG9yLmluc2VydE5ld2xpbmUoKVxuICAgIHdvcmsuZWRpdG9yLmluc2VydE5ld2xpbmUoKVxuICAgIHdvcmsuZWRpdG9yLmluc2VydE5ld2xpbmUoKVxuXG4gIG1ldGhvZENvbW1lbnQ6ICh3b3JrKSAtPlxuICAgIHdvcmsuZWRpdG9yLmluc2VydFRleHQoXCIvKlwiICsgXCIqXCIucmVwZWF0KDY4KSlcbiAgICB3b3JrLmVkaXRvci5pbnNlcnROZXdsaW5lKClcbiAgICB3b3JrLmVkaXRvci5pbnNlcnRUZXh0KFwiKiBDb21tZW50XCIpXG4gICAgd29yay5lZGl0b3IuaW5zZXJ0TmV3bGluZSgpXG4gICAgd29yay5lZGl0b3IuaW5zZXJ0VGV4dCggXCIqXCIucmVwZWF0KDY4KSsgXCIqL1wiKVxuICAgIHdvcmsuZWRpdG9yLmluc2VydE5ld2xpbmUoKVxuXG4gIG1ldGhvZE5hbWU6ICh3b3JrLG1ldGhvZCxuYW1lc3BhY2UpIC0+XG4gICAgaWYgKG1ldGhvZFswXSlcbiAgICAgIHdvcmsuZWRpdG9yLmluc2VydFRleHQoXCIje21ldGhvZFswXX0gXCIpXG4gICAgaWYgKG5hbWVzcGFjZSlcbiAgICAgIHdvcmsuZWRpdG9yLmluc2VydFRleHQoXCIje21ldGhvZFsxXX1cIiApXG4gICAgZWxzZVxuICAgICAgd29yay5lZGl0b3IuaW5zZXJ0VGV4dChcIiN7d29yay5jbGFzc25hbWV9Ojoje21ldGhvZFsxXX1cIilcbiAgICB3b3JrLmVkaXRvci5pbnNlcnROZXdsaW5lKClcblxuICBtZXRob2RCb2R5OiAod29yaykgLT5cbiAgICB3b3JrLmVkaXRvci5pbnNlcnRUZXh0KFwie1wiKVxuICAgIHdvcmsuZWRpdG9yLmluc2VydE5ld2xpbmUoKVxuICAgIHdvcmsuZWRpdG9yLm1vdmVEb3duKDEpXG4gICAgd29yay5lZGl0b3IuaW5zZXJ0TmV3bGluZSgpXG5cbiAgY3JlYXRlTWV0aG9kczogKHdvcmspIC0+XG4gICAgY3R4ID0gdGhpc1xuICAgIHdvcmsubWV0aG9kcy5mb3JFYWNoIChtZXRob2QpIC0+XG4gICAgICBjb25zb2xlLmxvZyhtZXRob2QpXG4gICAgICBjdHgubWV0aG9kQ29tbWVudCh3b3JrKVxuICAgICAgY3R4Lm1ldGhvZE5hbWUod29yayxtZXRob2QsdHJ1ZSlcbiAgICAgIGN0eC5tZXRob2RCb2R5KHdvcmspXG5cbiAgd3JpdGVJbkVkaXRvcjogKHdvcmspIC0+XG4gICAgQGNyZWF0ZUhlYWQod29yaylcbiAgICBAY3JlYXRlTWV0aG9kcyh3b3JrKVxuXG5cbiAgZ2VuZXJhdGU6IC0+XG4gICAgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgYnVmZmVyID0gZWRpdG9yLmdldEJ1ZmZlcigpXG4gICAgaGVhZGVyUGF0aCA9IGVkaXRvci5nZXRQYXRoKClcbiAgICBpbXBsZW1lbnRhdGlvblBhdGggPSBoZWFkZXJQYXRoLnJlcGxhY2UoXCIuaFwiLFwiLmNwcFwiKVxuICAgIHdvcmsgPVxuICAgICAge1xuICAgICAgICBlZGl0b3IsXG4gICAgICAgIGJ1ZmZlcixcbiAgICAgICAgaGVhZGVyUGF0aCxcbiAgICAgICAgaW1wbGVtZW50YXRpb25QYXRoLFxuICAgICAgICBjbGFzc25hbWUgOiBcIlwiXG4gICAgICAgIG1ldGhvZHMgOiBbXVxuICAgICAgfVxuICAgIHdvcmsuZWRpdG9yLnNhdmUoKVxuICAgIEByZWFkRmlsZSh3b3JrKVxuICAgIGN0eCA9IHRoaXNcbiAgICBAY3JlYXRlRmlsZSh3b3JrKS50aGVuIChlZGl0b3IpIC0+XG4gICAgICB3b3JrLmVkaXRvciA9IGVkaXRvclxuICAgICAgd29yay5idWZmZXIgPSB3b3JrLmVkaXRvci5nZXRCdWZmZXIoKVxuICAgICAgY3R4LndyaXRlSW5FZGl0b3Iod29yaylcbiAgICByZXR1cm5cbiJdfQ==
