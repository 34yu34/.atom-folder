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
        if (file.getBaseName() === (work.classname + ".h")) {
          return work.headerPath = file.getRealPathSync();
        } else if (file.getBaseName() === (work.classname + ".cpp")) {
          return work.implementationPath = file.getRealPathSync();
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYmlsbHkvZ2l0aHViL2hlYWRlci1pbXBsZW1lbnRhdGlvbi9saWIvaGVhZGVyLWltcGxlbWVudGF0aW9uLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSOztFQUV4QixNQUFNLENBQUMsT0FBUCxHQUVFO0lBQUEsUUFBQSxFQUFVLFNBQUMsS0FBRDtNQUVSLElBQUMsQ0FBQSxhQUFELEdBQWlCLElBQUk7TUFFckIsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFBb0M7UUFBQSxnQ0FBQSxFQUFrQyxDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFBO21CQUFHLEtBQUMsQ0FBQSxRQUFELENBQUE7VUFBSDtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBbEM7T0FBcEMsQ0FBbkI7TUFFQSxJQUFDLENBQUEsa0JBQUQsR0FBc0I7TUFDdEIsSUFBQyxDQUFBLGNBQUQsR0FBa0I7YUFDbEIsSUFBQyxDQUFBLGlCQUFELEdBQXFCO0lBUmIsQ0FBVjtJQWFBLFFBQUEsRUFBVSxTQUFDLElBQUQ7YUFDUixJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBb0IsSUFBQyxDQUFBLGlCQUFyQixFQUF3QyxTQUFDLElBQUQ7UUFDdEMsSUFBSSxJQUFJLENBQUMsV0FBTCxDQUFBLENBQUEsS0FBc0IsQ0FBQyxJQUFJLENBQUMsU0FBTCxHQUFlLElBQWhCLENBQTFCO2lCQUNFLElBQUksQ0FBQyxVQUFMLEdBQWtCLElBQUksQ0FBQyxlQUFMLENBQUEsRUFEcEI7U0FBQSxNQUVLLElBQUksSUFBSSxDQUFDLFdBQUwsQ0FBQSxDQUFBLEtBQXNCLENBQUMsSUFBSSxDQUFDLFNBQUwsR0FBZSxNQUFoQixDQUExQjtpQkFDSCxJQUFJLENBQUMsa0JBQUwsR0FB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bEI7TUFIcUIsQ0FBdkI7SUFWUSxDQXBJVjs7QUFKRiIsInNvdXJjZXNDb250ZW50IjpbIntDb21wb3NpdGVEaXNwb3NhYmxlfSA9IHJlcXVpcmUgJ2F0b20nXG5cbm1vZHVsZS5leHBvcnRzID1cblxuICBhY3RpdmF0ZTogKHN0YXRlKSAtPlxuICAgICMgRXZlbnRzIHN1YnNjcmliZWQgdG8gaW4gYXRvbSdzIHN5c3RlbSBjYW4gYmUgZWFzaWx5IGNsZWFuZWQgdXAgd2l0aCBhIENvbXBvc2l0ZURpc3Bvc2FibGVcbiAgICBAc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlXG4gICAgIyBSZWdpc3RlciBjb21tYW5kIHRoYXQgdG9nZ2xlcyB0aGlzIHZpZXdcbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20td29ya3NwYWNlJywgJ2hlYWRlci1pbXBsZW1lbnRhdGlvbjpnZW5lcmF0ZSc6ID0+IEBnZW5lcmF0ZSgpXG4gICAgIyBSZWdFeCBQYXR0ZXJuc1xuICAgIEBDTEFTU19OQU1FX1BBVFRFUk4gPSAvKCg/Om5hbWVzcGFjZXxjbGFzcykpK1xccysoW1xcd19dKykrXFxzKnsvZ1xuICAgIEBNRVRIT0RfUEFUVEVSTiA9IC9eXFxzKigoPzpjb25zdHxzdGF0aWN8dmlydHVhbHx2b2xhdGlsZXxmcmllbmQpezAsNX1cXHMqXFx3Kyg/Ojp7Mn1cXHcrKXswLH1cXHMqXFwqKiY/KT9cXHMrKFtcXHd+XSspXFxzKihcXCguKlxcKSlcXHMqPyggY29uc3QpPzsvZ21cbiAgICBARklMRV9OQU1FX1BBVFRFUk4gPSAvKFtcXHddKylcXC4oW2h8Y3BwXSspL1xuXG4gICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgI1xuICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gIGZpbmRQYXRoOiAod29yaykgLT5cbiAgICBhdG9tLndvcmtzcGFjZS5zY2FuIEBGSUxFX05BTUVfUEFUVEVSTiwgKGZpbGUpIC0+XG4gICAgICBpZiAoZmlsZS5nZXRCYXNlTmFtZSgpID09ICh3b3JrLmNsYXNzbmFtZStcIi5oXCIpKVxuICAgICAgICB3b3JrLmhlYWRlclBhdGggPSBmaWxlLmdldFJlYWxQYXRoU3luYygpXG4gICAgICBlbHNlIGlmIChmaWxlLmdldEJhc2VOYW1lKCkgPT0gKHdvcmsuY2xhc3NuYW1lK1wiLmNwcFwiKSlcbiAgICAgICAgd29yay5pbXBsZW1lbnRhdGlvblBhdGggPSBmaWxlLmdldFJlYWxQYXRoU3luYygpXG5cbiAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICAjXHRGaW5kIHdldGhlciBpdCBpcyBhIG5hbWVzcGFjZSBvciBhIGNsYXNzZSBhbmQgYWRkIGl0cyBuYW1lIHRvIHdvcmtcbiAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICBmaW5kTmFtZTogKHdvcmspIC0+XG4gICAgd29yay5idWZmZXIuc2NhbiBAQ0xBU1NfTkFNRV9QQVRURVJOLCAocmVzKSAtPlxuICAgICAgd29yay5uYW1lc3BhY2UgPSByZXMubWF0Y2hbMV0gPT0gXCJuYW1lc3BhY2VcIlxuICAgICAgd29yay5jbGFzc25hbWUgPSByZXMubWF0Y2hbMl1cbiAgICB3b3JrLmVkaXRvci5tb3ZlVG9FbmRPZkxpbmUoKVxuICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gICNcdGZpbmQgYWxsIHRoZSBtZXRob2RzIGluIHRoZSBoZWFkZXJzIGZpbGVcbiAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICBmaW5kTWV0aG9kOiAod29yaykgLT5cbiAgICB3b3JrLmJ1ZmZlci5zY2FuIEBNRVRIT0RfUEFUVEVSTiwgKHJlcykgLT5cbiAgICAgIG1ldGhvZCA9IFtdXG4gICAgICBtZXRob2QucHVzaCgocmVzLm1hdGNoWzFdfHxcIlwiKS5yZXBsYWNlKFwic3RhdGljIFwiLCBcIlwiKS5yZXBsYWNlKC9cXHN7Mix9LywgXCIgXCIpIHx8IFwiXCIpXG4gICAgICBtZXRob2QucHVzaChyZXMubWF0Y2hbMl0gKyByZXMubWF0Y2hbM10gKyAocmVzLm1hdGNoWzRdfHxcIlwiKSlcbiAgICAgIHdvcmsubWV0aG9kcy5wdXNoKG1ldGhvZClcbiAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICAjXHRGaW5kIGJvdGggbmFtZSBhbmQgbWV0aG9kc1xuICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gIHJlYWRGaWxlOiAod29yaykgLT5cbiAgICBAZmluZE5hbWUod29yaylcbiAgICBAZmluZE1ldGhvZCh3b3JrKVxuICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gICNcdFJldHVybiBhIHByb21pc2UgdG93YXJkIGEgbmV3IC5jcHAgZmlsZSBvcGVuXG4gICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgY3JlYXRlRmlsZTogKHdvcmspIC0+XG4gICAgcmV0dXJuIGF0b20ud29ya3NwYWNlLm9wZW4od29yay5pbXBsZW1lbnRhdGlvblBhdGgpXG4gICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgIyBXcml0ZSB0aGUgaGVhZCBvZiBhIC5jcHAgZmlsZSBkZXBlbmRpbmcgb24gaWZcbiAgIyBpdCdzIGEgbmFtZXNwYWNlIG9yIGEgY2xhc3NcbiAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICBjcmVhdGVIZWFkOiAod29yaykgLT5cbiAgICB3b3JrLmVkaXRvci5pbnNlcnRUZXh0KFwiI2luY2x1ZGUgXFxcIiN7d29yay5jbGFzc25hbWV9LmhcXFwiXCIpXG4gICAgd29yay5lZGl0b3IuaW5zZXJ0TmV3bGluZSgpXG4gICAgd29yay5lZGl0b3IuaW5zZXJ0TmV3bGluZSgpXG4gICAgd29yay5lZGl0b3IuaW5zZXJ0TmV3bGluZSgpXG4gICAgaWYgKHdvcmsubmFtZXNwYWNlKVxuICAgICAgd29yay5lZGl0b3IuaW5zZXJ0VGV4dChcIm5hbWVzcGFjZSAje3dvcmsuY2xhc3NuYW1lfVwiKVxuICAgICAgd29yay5lZGl0b3IuaW5zZXJ0TmV3bGluZSgpXG4gICAgICB3b3JrLmVkaXRvci5pbnNlcnRUZXh0KFwie1wiKVxuICAgICAgd29yay5lZGl0b3IuaW5zZXJ0TmV3bGluZSgpXG4gICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgIyBJbnNlcnQgYSBjb21tZW50IGxpbmUgb24gdG9wIG9mIGEgbWV0aG9kXG4gICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgbWV0aG9kQ29tbWVudDogKHdvcmspIC0+XG4gICAgd29yay5lZGl0b3IuaW5zZXJ0VGV4dChcIi8qXCIgKyBcIipcIi5yZXBlYXQoNjgpKVxuICAgIHdvcmsuZWRpdG9yLmluc2VydE5ld2xpbmUoKVxuICAgIHdvcmsuZWRpdG9yLmluc2VydFRleHQoXCIqIENvbW1lbnRcIilcbiAgICB3b3JrLmVkaXRvci5pbnNlcnROZXdsaW5lKClcbiAgICB3b3JrLmVkaXRvci5pbnNlcnRUZXh0KCBcIipcIi5yZXBlYXQoNjgpKyBcIiovXCIpXG4gICAgd29yay5lZGl0b3IuaW5zZXJ0TmV3bGluZSgpXG4gICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgI1x0V3JpdGUgdGhlIG1ldGhvZCBuYW1lXG4gICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgbWV0aG9kTmFtZTogKHdvcmssbWV0aG9kKSAtPlxuICAgIGlmIChtZXRob2RbMF0pXG4gICAgICB3b3JrLmVkaXRvci5pbnNlcnRUZXh0KFwiI3ttZXRob2RbMF19IFwiKVxuICAgIGlmICh3b3JrLm5hbWVzcGFjZSlcbiAgICAgIHdvcmsuZWRpdG9yLmluc2VydFRleHQoXCIje21ldGhvZFsxXX1cIiApXG4gICAgZWxzZVxuICAgICAgd29yay5lZGl0b3IuaW5zZXJ0VGV4dChcIiN7d29yay5jbGFzc25hbWV9Ojoje21ldGhvZFsxXX1cIilcbiAgICB3b3JrLmVkaXRvci5pbnNlcnROZXdsaW5lKClcbiAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICAjXHRXcml0ZSB0aGUgYm9keSBvZiB0aGUgaW1wbGVtZW50YXRpb24gb2YgYSBtZXRob2RcbiAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICBtZXRob2RCb2R5OiAod29yaykgLT5cbiAgICB3b3JrLmVkaXRvci5pbnNlcnRUZXh0KFwie1wiKVxuICAgIHdvcmsuZWRpdG9yLmluc2VydE5ld2xpbmUoKVxuICAgIHdvcmsuZWRpdG9yLm1vdmVEb3duKDEpXG4gICAgd29yay5lZGl0b3IuaW5zZXJ0TmV3bGluZSgpXG4gICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgI1x0QWRkIGEgbWV0aG9kIGF0IHRoZSBjdXJzb3IgcG9zaXRpb25cbiAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICBhZGRNZXRob2Q6ICh3b3JrLG1ldGhvZCkgLT5cbiAgICBAbWV0aG9kQ29tbWVudCh3b3JrKVxuICAgIEBtZXRob2ROYW1lKHdvcmssbWV0aG9kKVxuICAgIEBtZXRob2RCb2R5KHdvcmspXG4gICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgI1x0Q3JlYXRlIGFsbCB0aGUgbWV0aG9kcyBiYWNrIHRvIGJhY2tcbiAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICBjcmVhdGVNZXRob2RzOiAod29yaykgLT5cbiAgICBjdHggPSB0aGlzXG4gICAgd29yay5tZXRob2RzLmZvckVhY2ggKG1ldGhvZCkgLT5cbiAgICAgIGN0eC5hZGRNZXRob2Qod29yayxtZXRob2QsY3R4KVxuICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gICNcdFdyaXRlIHRoZSB3aG9sZSBmaWxlIC5jcHBcbiAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICB3cml0ZUluRWRpdG9yOiAod29yaykgLT5cbiAgICBAY3JlYXRlSGVhZCh3b3JrKVxuICAgIEBjcmVhdGVNZXRob2RzKHdvcmspXG4gICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgI1x0Z2VuZXJhdGUgYSB3b3JrIG9iamVjdFxuICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gIGdlbmVyYXRlV29yazogLT5cbiAgICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICBidWZmZXIgPSBlZGl0b3IuZ2V0QnVmZmVyKClcbiAgICB3b3JrID1cbiAgICAgIHtcbiAgICAgICAgZWRpdG9yLFxuICAgICAgICBidWZmZXIsXG4gICAgICAgIGhlYWRlclBhdGggOiBcIlwiXG4gICAgICAgIGltcGxlbWVudGF0aW9uUGF0aCA6IFwiXCJcbiAgICAgICAgY2xhc3NuYW1lIDogXCJcIlxuICAgICAgICBuYW1lc3BhY2UgOiBmYWxzZVxuICAgICAgICBtZXRob2RzIDogW11cbiAgICAgIH1cbiAgICByZXR1cm4gd29ya1xuICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gICNcdFJlYWQgdGhlIGhlYWRlciBmaWxlcyB5b3UgYXJlIGluIGFuZCBnZW5lcmF0ZSBhIC5jcHBcbiAgIyBpbiB0aGUgc2FtZSBwYXRoXG4gICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgZ2VuZXJhdGU6IC0+XG4gICAgd29yayA9IEBnZW5lcmF0ZVdvcmsoKVxuICAgIHdvcmsuZWRpdG9yLnNhdmUoKVxuICAgIEByZWFkRmlsZSh3b3JrKVxuICAgIEBmaW5kUGF0aCh3b3JrKVxuICAgIGNvbnNvbGUubG9nKHdvcmsuaGVhZGVyUGF0aClcbiAgICBjb25zb2xlLmxvZyh3b3JrLmltcGxlbWVudGF0aW9uUGF0aClcbiAgICBoZWFkZXJQYXRoID0gd29yay5lZGl0b3IuZ2V0UGF0aCgpXG4gICAgaW1wbGVtZW50YXRpb25QYXRoID0gd29yay5oZWFkZXJQYXRoLnJlcGxhY2UoXCIuaFwiLFwiLmNwcFwiKVxuICAgIGN0eCA9IHRoaXNcbiAgICBAY3JlYXRlRmlsZSh3b3JrKS50aGVuIChlZGl0b3IpIC0+XG4gICAgICB3b3JrLmVkaXRvciA9IGVkaXRvclxuICAgICAgd29yay5idWZmZXIgPSB3b3JrLmVkaXRvci5nZXRCdWZmZXIoKVxuICAgICAgY3R4LndyaXRlSW5FZGl0b3Iod29yaylcbiAgICByZXR1cm5cbiJdfQ==
