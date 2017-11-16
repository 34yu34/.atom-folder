(function() {
  var ClangProvider, CompositeDisposable, Disposable, File, LocationSelectList, Selection, buildEmitPchCommandArgs, buildGoDeclarationCommandArgs, defaultPrecompiled, makeBufferedClangProcess, path, ref, ref1, util;

  ref = require('atom'), CompositeDisposable = ref.CompositeDisposable, Disposable = ref.Disposable, Selection = ref.Selection, File = ref.File;

  path = require('path');

  util = require('./util');

  makeBufferedClangProcess = require('./clang-args-builder').makeBufferedClangProcess;

  ref1 = require('./clang-args-builder'), buildGoDeclarationCommandArgs = ref1.buildGoDeclarationCommandArgs, buildEmitPchCommandArgs = ref1.buildEmitPchCommandArgs;

  LocationSelectList = require('./location-select-view.coffee');

  ClangProvider = null;

  defaultPrecompiled = require('./defaultPrecompiled');

  module.exports = {
    config: {
      clangCommand: {
        type: 'string',
        "default": 'clang'
      },
      includePaths: {
        type: 'array',
        "default": ['.'],
        items: {
          type: 'string'
        }
      },
      pchFilePrefix: {
        type: 'string',
        "default": '.stdafx'
      },
      ignoreClangErrors: {
        type: 'boolean',
        "default": true
      },
      includeDocumentation: {
        type: 'boolean',
        "default": true
      },
      includeSystemHeadersDocumentation: {
        type: 'boolean',
        "default": false,
        description: "**WARNING**: if there are any PCHs compiled without this option," + "you will have to delete them and generate them again"
      },
      includeNonDoxygenCommentsAsDocumentation: {
        type: 'boolean',
        "default": false
      },
      "std c++": {
        type: 'string',
        "default": "c++11"
      },
      "std c": {
        type: 'string',
        "default": "c99"
      },
      "preCompiledHeaders c++": {
        type: 'array',
        "default": defaultPrecompiled.cpp,
        item: {
          type: 'string'
        }
      },
      "preCompiledHeaders c": {
        type: 'array',
        "default": defaultPrecompiled.c,
        items: {
          type: 'string'
        }
      },
      "preCompiledHeaders objective-c": {
        type: 'array',
        "default": defaultPrecompiled.objc,
        items: {
          type: 'string'
        }
      },
      "preCompiledHeaders objective-c++": {
        type: 'array',
        "default": defaultPrecompiled.objcpp,
        items: {
          type: 'string'
        }
      }
    },
    deactivationDisposables: null,
    activate: function(state) {
      this.deactivationDisposables = new CompositeDisposable;
      this.deactivationDisposables.add(atom.commands.add('atom-text-editor:not([mini])', {
        'autocomplete-clang:emit-pch': (function(_this) {
          return function() {
            return _this.emitPch(atom.workspace.getActiveTextEditor());
          };
        })(this)
      }));
      return this.deactivationDisposables.add(atom.commands.add('atom-text-editor:not([mini])', {
        'autocomplete-clang:go-declaration': (function(_this) {
          return function(e) {
            return _this.goDeclaration(atom.workspace.getActiveTextEditor(), e);
          };
        })(this)
      }));
    },
    goDeclaration: function(editor, e) {
      var args, callback, lang, term;
      lang = util.getFirstCursorSourceScopeLang(editor);
      if (!lang) {
        e.abortKeyBinding();
        return;
      }
      editor.selectWordsContainingCursors();
      term = editor.getSelectedText();
      args = buildGoDeclarationCommandArgs(editor, lang, term);
      callback = (function(_this) {
        return function(code, outputs, errors, resolve) {
          console.log("GoDecl err\n", errors);
          return resolve(_this.handleGoDeclarationResult(editor, {
            output: outputs,
            term: term
          }, code));
        };
      })(this);
      return makeBufferedClangProcess(editor, args, callback, editor.getText());
    },
    emitPch: function(editor) {
      var args, callback, h, headers, headersInput, lang;
      lang = util.getFirstCursorSourceScopeLang(editor);
      if (!lang) {
        atom.notifications.addError("autocomplete-clang:emit-pch\nError: Incompatible Language");
        return;
      }
      headers = atom.config.get("autocomplete-clang.preCompiledHeaders " + lang);
      headersInput = ((function() {
        var i, len, results;
        results = [];
        for (i = 0, len = headers.length; i < len; i++) {
          h = headers[i];
          results.push("#include <" + h + ">");
        }
        return results;
      })()).join("\n");
      args = buildEmitPchCommandArgs(editor, lang);
      callback = (function(_this) {
        return function(code, outputs, errors, resolve) {
          console.log("-emit-pch out\n", outputs);
          console.log("-emit-pch err\n", errors);
          return resolve(_this.handleEmitPchResult(code));
        };
      })(this);
      return makeBufferedClangProcess(editor, args, callback, headersInput);
    },
    handleGoDeclarationResult: function(editor, result, returnCode) {
      var list, places;
      if (returnCode === !0) {
        if (!atom.config.get("autocomplete-clang.ignoreClangErrors")) {
          return;
        }
      }
      places = this.parseAstDump(result.output, result.term);
      if (places.length === 1) {
        return this.goToLocation(editor, places.pop());
      } else if (places.length > 1) {
        list = new LocationSelectList(editor, this.goToLocation);
        return list.setItems(places);
      }
    },
    goToLocation: function(editor, arg) {
      var col, f, file, line;
      file = arg[0], line = arg[1], col = arg[2];
      if (file === '<stdin>') {
        return editor.setCursorBufferPosition([line - 1, col - 1]);
      }
      if (file.startsWith(".")) {
        file = path.join(editor.getDirectoryPath(), file);
      }
      f = new File(file);
      return f.exists().then(function(result) {
        if (result) {
          return atom.workspace.open(file, {
            initialLine: line - 1,
            initialColumn: col - 1
          });
        }
      });
    },
    parseAstDump: function(aststring, term) {
      var _, candidate, candidates, col, declRangeStr, declTerms, file, i, len, line, lines, match, places, posStr, positions, ref2, ref3;
      candidates = aststring.split('\n\n');
      places = [];
      for (i = 0, len = candidates.length; i < len; i++) {
        candidate = candidates[i];
        match = candidate.match(RegExp("^Dumping\\s(?:[A-Za-z_]*::)*?" + term + ":"));
        if (match !== null) {
          lines = candidate.split('\n');
          if (lines.length < 2) {
            continue;
          }
          declTerms = lines[1].split(' ');
          _ = declTerms[0], _ = declTerms[1], declRangeStr = declTerms[2], _ = declTerms[3], posStr = declTerms[4];
          while (!declRangeStr.match(/<(.*):([0-9]+):([0-9]+),/)) {
            if (declTerms.length < 5) {
              break;
            }
            declTerms = declTerms.slice(2);
            _ = declTerms[0], _ = declTerms[1], declRangeStr = declTerms[2], _ = declTerms[3], posStr = declTerms[4];
          }
          if (declRangeStr.match(/<(.*):([0-9]+):([0-9]+),/)) {
            ref2 = declRangeStr.match(/<(.*):([0-9]+):([0-9]+),/), _ = ref2[0], file = ref2[1], line = ref2[2], col = ref2[3];
            positions = posStr.match(/(line|col):([0-9]+)(?::([0-9]+))?/);
            if (positions) {
              if (positions[1] === 'line') {
                ref3 = [positions[2], positions[3]], line = ref3[0], col = ref3[1];
              } else {
                col = positions[2];
              }
              places.push([file, Number(line), Number(col)]);
            }
          }
        }
      }
      return places;
    },
    handleEmitPchResult: function(code) {
      if (!code) {
        atom.notifications.addSuccess("Emiting precompiled header has successfully finished");
        return;
      }
      return atom.notifications.addError(("Emiting precompiled header exit with " + code + "\n") + "See console for detailed error message");
    },
    deactivate: function() {
      return this.deactivationDisposables.dispose();
    },
    provide: function() {
      if (ClangProvider == null) {
        ClangProvider = require('./clang-provider');
      }
      return new ClangProvider();
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYmlsbHkvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLWNsYW5nL2xpYi9hdXRvY29tcGxldGUtY2xhbmcuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxNQUFrRCxPQUFBLENBQVEsTUFBUixDQUFsRCxFQUFDLDZDQUFELEVBQXFCLDJCQUFyQixFQUFnQyx5QkFBaEMsRUFBMEM7O0VBQzFDLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUjs7RUFDUCxJQUFBLEdBQU8sT0FBQSxDQUFRLFFBQVI7O0VBQ04sMkJBQTZCLE9BQUEsQ0FBUSxzQkFBUjs7RUFDOUIsT0FBMEQsT0FBQSxDQUFRLHNCQUFSLENBQTFELEVBQUMsa0VBQUQsRUFBK0I7O0VBQy9CLGtCQUFBLEdBQXFCLE9BQUEsQ0FBUSwrQkFBUjs7RUFFckIsYUFBQSxHQUFnQjs7RUFDaEIsa0JBQUEsR0FBcUIsT0FBQSxDQUFRLHNCQUFSOztFQUVyQixNQUFNLENBQUMsT0FBUCxHQUNFO0lBQUEsTUFBQSxFQUNFO01BQUEsWUFBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLFFBQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLE9BRFQ7T0FERjtNQUdBLFlBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxPQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxDQUFDLEdBQUQsQ0FEVDtRQUVBLEtBQUEsRUFDRTtVQUFBLElBQUEsRUFBTSxRQUFOO1NBSEY7T0FKRjtNQVFBLGFBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxRQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxTQURUO09BVEY7TUFXQSxpQkFBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLFNBQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLElBRFQ7T0FaRjtNQWNBLG9CQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sU0FBTjtRQUNBLENBQUEsT0FBQSxD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YTtZQUNiLFNBQUEsR0FBWSxNQUFNLENBQUMsS0FBUCxDQUFhLG1DQUFiO1lBQ1osSUFBRyxTQUFIO2NBQ0UsSUFBRyxTQUFVLENBQUEsQ0FBQSxDQUFWLEtBQWdCLE1BQW5CO2dCQUNFLE9BQWEsQ0FBQyxTQUFVLENBQUEsQ0FBQSxDQUFYLEVBQWUsU0FBVSxDQUFBLENBQUEsQ0FBekIsQ0FBYixFQUFDLGNBQUQsRUFBTSxjQURSO2VBQUEsTUFBQTtnQkFHRSxHQUFBLEdBQU0sU0FBVSxDQUFBLENBQUEsRUFIbEI7O2NBSUEsTUFBTSxDQUFDLElBQVAsQ0FBWSxDQUFDLElBQUQsRUFBTyxNQUFBLENBQU8sSUFBUCxDQUFQLEVBQXFCLE1BQUEsQ0FBTyxHQUFQLENBQXJCLENBQVosRUFMRjthQUhGO1dBVEY7O0FBRkY7QUFvQkEsYUFBTztJQXZCSyxDQTlHZDtJQXVJQSxtQkFBQSxFQUFxQixTQUFDLElBQUQ7TUFDbkIsSUFBQSxDQUFPLElBQVA7UUFDRSxJQUFJLENBQUMsYUFBYSxDQUFDLFVBQW5CLENBQThCLHNEQUE5QjtBQUNBLGVBRkY7O2FBR0EsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFuQixDQUE0QixDQUFBLHVDQUFBLEdBQXdDLElBQXhDLEdBQTZDLElBQTdDLENBQUEsR0FDMUIsd0NBREY7SUFKbUIsQ0F2SXJCO0lBOElBLFVBQUEsRUFBWSxTQUFBO2FBQ1YsSUFBQyxDQUFBLHVCQUF1QixDQUFDLE9BQXpCLENBQUE7SUFEVSxDQTlJWjtJQWlKQSxPQUFBLEVBQVMsU0FBQTs7UUFDUCxnQkFBaUIsT0FBQSxDQUFRLGtCQUFSOzthQUNiLElBQUEsYUFBQSxDQUFBO0lBRkcsQ0FqSlQ7O0FBWEYiLCJzb3VyY2VzQ29udGVudCI6WyJ7Q29tcG9zaXRlRGlzcG9zYWJsZSxEaXNwb3NhYmxlLFNlbGVjdGlvbixGaWxlfSA9IHJlcXVpcmUgJ2F0b20nXG5wYXRoID0gcmVxdWlyZSAncGF0aCdcbnV0aWwgPSByZXF1aXJlICcuL3V0aWwnXG57bWFrZUJ1ZmZlcmVkQ2xhbmdQcm9jZXNzfSAgPSByZXF1aXJlICcuL2NsYW5nLWFyZ3MtYnVpbGRlcidcbntidWlsZEdvRGVjbGFyYXRpb25Db21tYW5kQXJncyxidWlsZEVtaXRQY2hDb21tYW5kQXJnc30gPSByZXF1aXJlICcuL2NsYW5nLWFyZ3MtYnVpbGRlcidcbkxvY2F0aW9uU2VsZWN0TGlzdCA9IHJlcXVpcmUgJy4vbG9jYXRpb24tc2VsZWN0LXZpZXcuY29mZmVlJ1xuXG5DbGFuZ1Byb3ZpZGVyID0gbnVsbFxuZGVmYXVsdFByZWNvbXBpbGVkID0gcmVxdWlyZSAnLi9kZWZhdWx0UHJlY29tcGlsZWQnXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgY29uZmlnOlxuICAgIGNsYW5nQ29tbWFuZDpcbiAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICBkZWZhdWx0OiAnY2xhbmcnXG4gICAgaW5jbHVkZVBhdGhzOlxuICAgICAgdHlwZTogJ2FycmF5J1xuICAgICAgZGVmYXVsdDogWycuJ11cbiAgICAgIGl0ZW1zOlxuICAgICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgIHBjaEZpbGVQcmVmaXg6XG4gICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgZGVmYXVsdDogJy5zdGRhZngnXG4gICAgaWdub3JlQ2xhbmdFcnJvcnM6XG4gICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgIGRlZmF1bHQ6IHRydWVcbiAgICBpbmNsdWRlRG9jdW1lbnRhdGlvbjpcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgZGVmYXVsdDogdHJ1ZVxuICAgIGluY2x1ZGVTeXN0ZW1IZWFkZXJzRG9jdW1lbnRhdGlvbjpcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICAgIGRlc2NyaXB0aW9uOlxuICAgICAgICBcIioqV0FSTklORyoqOiBpZiB0aGVyZSBhcmUgYW55IFBDSHMgY29tcGlsZWQgd2l0aG91dCB0aGlzIG9wdGlvbixcIitcbiAgICAgICAgXCJ5b3Ugd2lsbCBoYXZlIHRvIGRlbGV0ZSB0aGVtIGFuZCBnZW5lcmF0ZSB0aGVtIGFnYWluXCJcbiAgICBpbmNsdWRlTm9uRG94eWdlbkNvbW1lbnRzQXNEb2N1bWVudGF0aW9uOlxuICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICBkZWZhdWx0OiBmYWxzZVxuICAgIFwic3RkIGMrK1wiOlxuICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgIGRlZmF1bHQ6IFwiYysrMTFcIlxuICAgIFwic3RkIGNcIjpcbiAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICBkZWZhdWx0OiBcImM5OVwiXG4gICAgXCJwcmVDb21waWxlZEhlYWRlcnMgYysrXCI6XG4gICAgICB0eXBlOiAnYXJyYXknXG4gICAgICBkZWZhdWx0OiBkZWZhdWx0UHJlY29tcGlsZWQuY3BwXG4gICAgICBpdGVtOlxuICAgICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgIFwicHJlQ29tcGlsZWRIZWFkZXJzIGNcIjpcbiAgICAgIHR5cGU6ICdhcnJheSdcbiAgICAgIGRlZmF1bHQ6IGRlZmF1bHRQcmVjb21waWxlZC5jXG4gICAgICBpdGVtczpcbiAgICAgICAgdHlwZTogJ3N0cmluZydcbiAgICBcInByZUNvbXBpbGVkSGVhZGVycyBvYmplY3RpdmUtY1wiOlxuICAgICAgdHlwZTogJ2FycmF5J1xuICAgICAgZGVmYXVsdDogZGVmYXVsdFByZWNvbXBpbGVkLm9iamNcbiAgICAgIGl0ZW1zOlxuICAgICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgIFwicHJlQ29tcGlsZWRIZWFkZXJzIG9iamVjdGl2ZS1jKytcIjpcbiAgICAgIHR5cGU6ICdhcnJheSdcbiAgICAgIGRlZmF1bHQ6IGRlZmF1bHRQcmVjb21waWxlZC5vYmpjcHBcbiAgICAgIGl0ZW1zOlxuICAgICAgICB0eXBlOiAnc3RyaW5nJ1xuXG4gIGRlYWN0aXZhdGlvbkRpc3Bvc2FibGVzOiBudWxsXG5cbiAgYWN0aXZhdGU6IChzdGF0ZSkgLT5cbiAgICBAZGVhY3RpdmF0aW9uRGlzcG9zYWJsZXMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZVxuICAgIEBkZWFjdGl2YXRpb25EaXNwb3NhYmxlcy5hZGQgYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20tdGV4dC1lZGl0b3I6bm90KFttaW5pXSknLFxuICAgICAgJ2F1dG9jb21wbGV0ZS1jbGFuZzplbWl0LXBjaCc6ID0+XG4gICAgICAgIEBlbWl0UGNoIGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgIEBkZWFjdGl2YXRpb25EaXNwb3NhYmxlcy5hZGQgYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20tdGV4dC1lZGl0b3I6bm90KFttaW5pXSknLFxuICAgICAgJ2F1dG9jb21wbGV0ZS1jbGFuZzpnby1kZWNsYXJhdGlvbic6IChlKT0+XG4gICAgICAgIEBnb0RlY2xhcmF0aW9uIGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKSxlXG5cbiAgZ29EZWNsYXJhdGlvbjogKGVkaXRvcixlKS0+XG4gICAgbGFuZyA9IHV0aWwuZ2V0Rmlyc3RDdXJzb3JTb3VyY2VTY29wZUxhbmcgZWRpdG9yXG4gICAgdW5sZXNzIGxhbmdcbiAgICAgIGUuYWJvcnRLZXlCaW5kaW5nKClcbiAgICAgIHJldHVyblxuICAgIGVkaXRvci5zZWxlY3RXb3Jkc0NvbnRhaW5pbmdDdXJzb3JzKClcbiAgICB0ZXJtID0gZWRpdG9yLmdldFNlbGVjdGVkVGV4dCgpXG4gICAgYXJncyA9IGJ1aWxkR29EZWNsYXJhdGlvbkNvbW1hbmRBcmdzIGVkaXRvciwgbGFuZywgdGVybVxuICAgIGNhbGxiYWNrID0gKGNvZGUsIG91dHB1dHMsIGVycm9ycywgcmVzb2x2ZSkgPT5cbiAgICAgIGNvbnNvbGUubG9nIFwiR29EZWNsIGVyclxcblwiLCBlcnJvcnNcbiAgICAgIHJlc29sdmUoQGhhbmRsZUdvRGVjbGFyYXRpb25SZXN1bHQgZWRpdG9yLCB7b3V0cHV0Om91dHB1dHMsIHRlcm06dGVybX0sIGNvZGUpXG4gICAgbWFrZUJ1ZmZlcmVkQ2xhbmdQcm9jZXNzIGVkaXRvciwgYXJncywgY2FsbGJhY2ssIGVkaXRvci5nZXRUZXh0KClcblxuICBlbWl0UGNoOiAoZWRpdG9yKS0+XG4gICAgbGFuZyA9IHV0aWwuZ2V0Rmlyc3RDdXJzb3JTb3VyY2VTY29wZUxhbmcgZWRpdG9yXG4gICAgdW5sZXNzIGxhbmdcbiAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvciBcImF1dG9jb21wbGV0ZS1jbGFuZzplbWl0LXBjaFxcbkVycm9yOiBJbmNvbXBhdGlibGUgTGFuZ3VhZ2VcIlxuICAgICAgcmV0dXJuXG4gICAgaGVhZGVycyA9IGF0b20uY29uZmlnLmdldCBcImF1dG9jb21wbGV0ZS1jbGFuZy5wcmVDb21waWxlZEhlYWRlcnMgI3tsYW5nfVwiXG4gICAgaGVhZGVyc0lucHV0ID0gKFwiI2luY2x1ZGUgPCN7aH0+XCIgZm9yIGggaW4gaGVhZGVycykuam9pbiBcIlxcblwiXG4gICAgYXJncyA9IGJ1aWxkRW1pdFBjaENvbW1hbmRBcmdzIGVkaXRvciwgbGFuZ1xuICAgIGNhbGxiYWNrID0gKGNvZGUsIG91dHB1dHMsIGVycm9ycywgcmVzb2x2ZSkgPT5cbiAgICAgIGNvbnNvbGUubG9nIFwiLWVtaXQtcGNoIG91dFxcblwiLCBvdXRwdXRzXG4gICAgICBjb25zb2xlLmxvZyBcIi1lbWl0LXBjaCBlcnJcXG5cIiwgZXJyb3JzXG4gICAgICByZXNvbHZlKEBoYW5kbGVFbWl0UGNoUmVzdWx0IGNvZGUpXG4gICAgbWFrZUJ1ZmZlcmVkQ2xhbmdQcm9jZXNzIGVkaXRvciwgYXJncywgY2FsbGJhY2ssIGhlYWRlcnNJbnB1dFxuXG4gIGhhbmRsZUdvRGVjbGFyYXRpb25SZXN1bHQ6IChlZGl0b3IsIHJlc3VsdCwgcmV0dXJuQ29kZSktPlxuICAgIGlmIHJldHVybkNvZGUgaXMgbm90IDBcbiAgICAgIHJldHVybiB1bmxlc3MgYXRvbS5jb25maWcuZ2V0IFwiYXV0b2NvbXBsZXRlLWNsYW5nLmlnbm9yZUNsYW5nRXJyb3JzXCJcbiAgICBwbGFjZXMgPSBAcGFyc2VBc3REdW1wIHJlc3VsdC5vdXRwdXQsIHJlc3VsdC50ZXJtXG4gICAgaWYgcGxhY2VzLmxlbmd0aCBpcyAxXG4gICAgICBAZ29Ub0xvY2F0aW9uIGVkaXRvciwgcGxhY2VzLnBvcCgpXG4gICAgZWxzZSBpZiBwbGFjZXMubGVuZ3RoID4gMVxuICAgICAgbGlzdCA9IG5ldyBMb2NhdGlvblNlbGVjdExpc3QoZWRpdG9yLCBAZ29Ub0xvY2F0aW9uKVxuICAgICAgbGlzdC5zZXRJdGVtcyhwbGFjZXMpXG5cbiAgZ29Ub0xvY2F0aW9uOiAoZWRpdG9yLCBbZmlsZSxsaW5lLGNvbF0pIC0+XG4gICAgaWYgZmlsZSBpcyAnPHN0ZGluPidcbiAgICAgIHJldHVybiBlZGl0b3Iuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24gW2xpbmUtMSxjb2wtMV1cbiAgICBmaWxlID0gcGF0aC5qb2luIGVkaXRvci5nZXREaXJlY3RvcnlQYXRoKCksIGZpbGUgaWYgZmlsZS5zdGFydHNXaXRoKFwiLlwiKVxuICAgIGYgPSBuZXcgRmlsZSBmaWxlXG4gICAgZi5leGlzdHMoKS50aGVuIChyZXN1bHQpIC0+XG4gICAgICBhdG9tLndvcmtzcGFjZS5vcGVuIGZpbGUsIHtpbml0aWFsTGluZTpsaW5lLTEsIGluaXRpYWxDb2x1bW46Y29sLTF9IGlmIHJlc3VsdFxuXG4gIHBhcnNlQXN0RHVtcDogKGFzdHN0cmluZywgdGVybSktPlxuICAgIGNhbmRpZGF0ZXMgPSBhc3RzdHJpbmcuc3BsaXQgJ1xcblxcbidcbiAgICBwbGFjZXMgPSBbXVxuICAgIGZvciBjYW5kaWRhdGUgaW4gY2FuZGlkYXRlc1xuICAgICAgbWF0Y2ggPSBjYW5kaWRhdGUubWF0Y2ggLy8vXkR1bXBpbmdcXHMoPzpbQS1aYS16X10qOjopKj8je3Rlcm19Oi8vL1xuICAgICAgaWYgbWF0Y2ggaXNudCBudWxsXG4gICAgICAgIGxpbmVzID0gY2FuZGlkYXRlLnNwbGl0ICdcXG4nXG4gICAgICAgIGNvbnRpbnVlIGlmIGxpbmVzLmxlbmd0aCA8IDJcbiAgICAgICAgZGVjbFRlcm1zID0gbGluZXNbMV0uc3BsaXQgJyAnXG4gICAgICAgIFtfLF8sZGVjbFJhbmdlU3RyLF8scG9zU3RyLC4uLl0gPSBkZWNsVGVybXNcbiAgICAgICAgd2hpbGUgbm90IGRlY2xSYW5nZVN0ci5tYXRjaCAvPCguKik6KFswLTldKyk6KFswLTldKyksL1xuICAgICAgICAgIGJyZWFrIGlmIGRlY2xUZXJtcy5sZW5ndGggPCA1XG4gICAgICAgICAgZGVjbFRlcm1zID0gZGVjbFRlcm1zWzIuLl1cbiAgICAgICAgICBbXyxfLGRlY2xSYW5nZVN0cixfLHBvc1N0ciwuLi5dID0gZGVjbFRlcm1zXG4gICAgICAgIGlmIGRlY2xSYW5nZVN0ci5tYXRjaCAvPCguKik6KFswLTldKyk6KFswLTldKyksL1xuICAgICAgICAgIFtfLGZpbGUsbGluZSxjb2xdID0gZGVjbFJhbmdlU3RyLm1hdGNoIC88KC4qKTooWzAtOV0rKTooWzAtOV0rKSwvXG4gICAgICAgICAgcG9zaXRpb25zID0gcG9zU3RyLm1hdGNoIC8obGluZXxjb2wpOihbMC05XSspKD86OihbMC05XSspKT8vXG4gICAgICAgICAgaWYgcG9zaXRpb25zXG4gICAgICAgICAgICBpZiBwb3NpdGlvbnNbMV0gaXMgJ2xpbmUnXG4gICAgICAgICAgICAgIFtsaW5lLGNvbF0gPSBbcG9zaXRpb25zWzJdLCBwb3NpdGlvbnNbM11dXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgIGNvbCA9IHBvc2l0aW9uc1syXVxuICAgICAgICAgICAgcGxhY2VzLnB1c2ggW2ZpbGUsKE51bWJlciBsaW5lKSwoTnVtYmVyIGNvbCldXG4gICAgcmV0dXJuIHBsYWNlc1xuXG4gIGhhbmRsZUVtaXRQY2hSZXN1bHQ6IChjb2RlKS0+XG4gICAgdW5sZXNzIGNvZGVcbiAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRTdWNjZXNzIFwiRW1pdGluZyBwcmVjb21waWxlZCBoZWFkZXIgaGFzIHN1Y2Nlc3NmdWxseSBmaW5pc2hlZFwiXG4gICAgICByZXR1cm5cbiAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IgXCJFbWl0aW5nIHByZWNvbXBpbGVkIGhlYWRlciBleGl0IHdpdGggI3tjb2RlfVxcblwiK1xuICAgICAgXCJTZWUgY29uc29sZSBmb3IgZGV0YWlsZWQgZXJyb3IgbWVzc2FnZVwiXG5cbiAgZGVhY3RpdmF0ZTogLT5cbiAgICBAZGVhY3RpdmF0aW9uRGlzcG9zYWJsZXMuZGlzcG9zZSgpXG5cbiAgcHJvdmlkZTogLT5cbiAgICBDbGFuZ1Byb3ZpZGVyID89IHJlcXVpcmUoJy4vY2xhbmctcHJvdmlkZXInKVxuICAgIG5ldyBDbGFuZ1Byb3ZpZGVyKClcbiJdfQ==
