(function() {
  var ClangProvider, CompositeDisposable, Range, buildCodeCompletionArgs, getSourceScopeLang, makeBufferedClangProcess, nearestSymbolPosition, path, prefixAtPosition, ref, ref1, ref2;

  ref = require('atom'), Range = ref.Range, CompositeDisposable = ref.CompositeDisposable;

  path = require('path');

  ref1 = require('./clang-args-builder'), makeBufferedClangProcess = ref1.makeBufferedClangProcess, buildCodeCompletionArgs = ref1.buildCodeCompletionArgs;

  ref2 = require('./util'), getSourceScopeLang = ref2.getSourceScopeLang, prefixAtPosition = ref2.prefixAtPosition, nearestSymbolPosition = ref2.nearestSymbolPosition;

  module.exports = ClangProvider = (function() {
    function ClangProvider() {}

    ClangProvider.prototype.selector = '.source.cpp, .source.c, .source.objc, .source.objcpp';

    ClangProvider.prototype.inclusionPriority = 1;

    ClangProvider.prototype.getSuggestions = function(arg1) {
      var bufferPosition, editor, language, lastSymbol, line, minimumWordLength, prefix, ref3, regex, scopeDescriptor, symbolPosition;
      editor = arg1.editor, scopeDescriptor = arg1.scopeDescriptor, bufferPosition = arg1.bufferPosition;
      language = getSourceScopeLang(scopeDescriptor.getScopesArray());
      prefix = prefixAtPosition(editor, bufferPosition);
      ref3 = nearestSymbolPosition(editor, bufferPosition), symbolPosition = ref3[0], lastSymbol = ref3[1];
      minimumWordLength = atom.config.get('autocomplete-plus.minimumWordLength');
      if ((minimumWordLength != null) && prefix.length < minimumWordLength) {
        regex = /(?:\.|->|::)\s*\w*$/;
        line = editor.getTextInRange([[bufferPosition.row, 0], bufferPosition]);
        if (!regex.test(line)) {
          return;
        }
      }
      if (language != null) {
        return this.codeCompletionAt(editor, symbolPosition.row, symbolPosition.column, language, prefix);
      }
    };

    ClangProvider.prototype.codeCompletionAt = function(editor, row, column, language, prefix) {
      var args, callback;
      args = buildCodeCompletionArgs(editor, row, column, language);
      callback = (function(_this) {
        return function(code, outputs, errors, resolve) {
          console.log(errors);
          return resolve(_this.handleCompletionResult(outputs, code, prefix));
        };
      })(this);
      return makeBufferedClangProcess(editor, args, callback, editor.getText());
    };

    ClangProvider.prototype.convertCompletionLine = function(line, prefix) {
      var argumentsRe, basicInfo, basicInfoRe, comment, commentRe, completion, completionAndComment, constMemFuncRe, content, contentRe, index, infoTagsRe, isConstMemFunc, match, optionalArgumentsStart, ref3, ref4, ref5, returnType, returnTypeRe, suggestion;
      contentRe = /^COMPLETION: (.*)/;
      ref3 = line.match(contentRe), line = ref3[0], content = ref3[1];
      basicInfoRe = /^(.*?) : (.*)/;
      match = content.match(basicInfoRe);
      if (match == null) {
        return {
          text: content
        };
      }
      content = match[0], basicInfo = match[1], completionAndComment = match[2];
      commentRe = /(?: : (.*))?$/;
      ref4 = completionAndComment.split(commentRe), completion = ref4[0], comment = ref4[1];
      returnTypeRe = /^\[#(.*?)#\]/;
      returnType = (ref5 = completion.match(returnTypeRe)) != null ? ref5[1] : void 0;
      constMemFuncRe = /\[# const#\]$/;
      isConstMemFunc = constMemFuncRe.test(completion);
      infoTagsRe = /\[#(.*?)#\]/g;
      completion = completion.replace(infoTagsRe, '');
      argumentsRe = /<#(.*?)#>/g;
      optionalArgumentsStart = completion.indexOf('{#');
      completion = completion.replace(/\{#/g, '');
      completion = completion.replace(/#\}/g, '');
      index = 0;
      completion = completion.replace(argumentsRe, function(match, arg, offset) {
        index++;
        if (optionalArgumentsStart > 0 && offset > optionalArgumentsStart) {
          return "${" + index + ":optional " + arg + "}";
        } else {
          return "${" + index + ":" + arg + "}";
        }
      });
      suggestion = {};
      if (returnType != null) {
        suggestion.leftLabel = returnType;
      }
      if (index > 0) {
        suggestion.snippet = completion;
      } else {
        suggestion.text = completion;
      }
      if (isConstMemFunc) {
        suggestion.displayText = completion + ' const';
      }
      if (comment != null) {
        suggestion.description = comment;
      }
      suggestion.replacementPrefix = prefix;
      return suggestion;
    };

    ClangProvider.prototype.handleCompletionResult = function(result, returnCode, prefix) {
      var completionsRe, line, outputLines;
      if (returnCode === !0) {
        if (!atom.config.get("autocomplete-clang.ignoreClangErrors")) {
          return;
        }
      }
      completionsRe = new RegExp("^COMPLETION: (" + prefix + ".*)$", "mg");
      outputLines = result.match(completionsRe);
      if (outputLines != null) {
        return (function() {
          var i, len, results;
          results = [];
          for (i = 0, len = outputLines.length; i < len; i++) {
            line = outputLines[i];
            results.push(this.convertCompletionLine(line, prefix));
          }
          return results;
        }).call(this);
      } else {
        return [];
      }
    };

    return ClangProvider;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYmlsbHkvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLWNsYW5nL2xpYi9jbGFuZy1wcm92aWRlci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBSUE7QUFBQSxNQUFBOztFQUFBLE1BQStCLE9BQUEsQ0FBUSxNQUFSLENBQS9CLEVBQUMsaUJBQUQsRUFBUTs7RUFDUixJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7O0VBQ1AsT0FBc0QsT0FBQSxDQUFRLHNCQUFSLENBQXRELEVBQUMsd0RBQUQsRUFBMkI7O0VBQzNCLE9BQWdFLE9BQUEsQ0FBUSxRQUFSLENBQWhFLEVBQUMsNENBQUQsRUFBcUIsd0NBQXJCLEVBQXVDOztFQUV2QyxNQUFNLENBQUMsT0FBUCxHQUNNOzs7NEJBQ0osUUFBQSxHQUFVOzs0QkFDVixpQkFBQSxHQUFtQjs7NEJBRW5CLGNBQUEsR0FBZ0IsU0FBQyxJQUFEO0FBQ2QsVUFBQTtNQURnQixzQkFBUSx3Q0FBaUI7TUFDekMsUUFBQSxHQUFXLGtCQUFBLENBQW1CLGVBQWUsQ0FBQyxjQUFoQixDQUFBLENBQW5CO01BQ1gsTUFBQSxHQUFTLGdCQUFBLENBQWlCLE1BQWpCLEVBQXlCLGNBQXpCO01BQ1QsT0FBOEIscUJBQUEsQ0FBc0IsTUFBdEIsRUFBOEIsY0FBOUIsQ0FBOUIsRUFBQyx3QkFBRCxFQUFnQjtNQUNoQixpQkFBQSxHQUFvQixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IscUNBQWhCO01BRXBCLElBQUcsMkJBQUEsSUFBdUIsTUFBTSxDQUFDLE1BQVAsR0FBZ0IsaUJBQTFDO1FBQ0UsS0FBQSxHQUFRO1FBQ1IsSUFBQSxHQUFPLE1BQU0sQ0FBQyxjQUFQLENBQXNCLENBQUMsQ0FBQyxjQUFjLENBQUMsR0FBaEIsRUFBcUIsQ0FBckIsQ0FBRCxFQUEwQixjQUExQixDQUF0QjtRQUNQLElBQUEsQ0FBYyxLQUFLLENBQUMsSUFBTixDQUFXLElB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Qzs7TUFFQSxJQUFvQyxlQUFwQztRQUFBLFVBQVUsQ0FBQyxXQUFYLEdBQXlCLFFBQXpCOztNQUNBLFVBQVUsQ0FBQyxpQkFBWCxHQUErQjthQUMvQjtJQXRDcUI7OzRCQXdDdkIsc0JBQUEsR0FBd0IsU0FBQyxNQUFELEVBQVMsVUFBVCxFQUFxQixNQUFyQjtBQUN0QixVQUFBO01BQUEsSUFBRyxVQUFBLEtBQWMsQ0FBSSxDQUFyQjtRQUNFLElBQUEsQ0FBYyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isc0NBQWhCLENBQWQ7QUFBQSxpQkFBQTtTQURGOztNQUlBLGFBQUEsR0FBb0IsSUFBQSxNQUFBLENBQU8sZ0JBQUEsR0FBbUIsTUFBbkIsR0FBNEIsTUFBbkMsRUFBMkMsSUFBM0M7TUFDcEIsV0FBQSxHQUFjLE1BQU0sQ0FBQyxLQUFQLENBQWEsYUFBYjtNQUVkLElBQUcsbUJBQUg7QUFDRTs7QUFBUTtlQUFBLDZDQUFBOzt5QkFBQSxJQUFDLENBQUEscUJBQUQsQ0FBdUIsSUFBdkIsRUFBNkIsTUFBN0I7QUFBQTs7c0JBRFY7T0FBQSxNQUFBO0FBR0UsZUFBTyxHQUhUOztJQVJzQjs7Ozs7QUF2RTFCIiwic291cmNlc0NvbnRlbnQiOlsiIyBhdXRvY29tcGxldGUtcGx1cyBwcm92aWRlciBjb2RlIGZyb20gaHR0cHM6Ly9naXRodWIuY29tL2Jlbm9nbGUvYXV0b2NvbXBsZXRlLWNsYW5nXG4jIENvcHlyaWdodCAoYykgMjAxNSBCZW4gT2dsZSB1bmRlciBNSVQgbGljZW5zZVxuIyBDbGFuZyByZWxhdGVkIGNvZGUgZnJvbSBodHRwczovL2dpdGh1Yi5jb20veWFzdXl1a3kvYXV0b2NvbXBsZXRlLWNsYW5nXG5cbntSYW5nZSwgQ29tcG9zaXRlRGlzcG9zYWJsZX0gPSByZXF1aXJlICdhdG9tJ1xucGF0aCA9IHJlcXVpcmUgJ3BhdGgnXG57bWFrZUJ1ZmZlcmVkQ2xhbmdQcm9jZXNzLCBidWlsZENvZGVDb21wbGV0aW9uQXJnc30gPSByZXF1aXJlICcuL2NsYW5nLWFyZ3MtYnVpbGRlcidcbntnZXRTb3VyY2VTY29wZUxhbmcsIHByZWZpeEF0UG9zaXRpb24sIG5lYXJlc3RTeW1ib2xQb3NpdGlvbn0gPSByZXF1aXJlICcuL3V0aWwnXG5cbm1vZHVsZS5leHBvcnRzID1cbmNsYXNzIENsYW5nUHJvdmlkZXJcbiAgc2VsZWN0b3I6ICcuc291cmNlLmNwcCwgLnNvdXJjZS5jLCAuc291cmNlLm9iamMsIC5zb3VyY2Uub2JqY3BwJ1xuICBpbmNsdXNpb25Qcmlvcml0eTogMVxuXG4gIGdldFN1Z2dlc3Rpb25zOiAoe2VkaXRvciwgc2NvcGVEZXNjcmlwdG9yLCBidWZmZXJQb3NpdGlvbn0pIC0+XG4gICAgbGFuZ3VhZ2UgPSBnZXRTb3VyY2VTY29wZUxhbmcgc2NvcGVEZXNjcmlwdG9yLmdldFNjb3Blc0FycmF5KClcbiAgICBwcmVmaXggPSBwcmVmaXhBdFBvc2l0aW9uKGVkaXRvciwgYnVmZmVyUG9zaXRpb24pXG4gICAgW3N5bWJvbFBvc2l0aW9uLGxhc3RTeW1ib2xdID0gbmVhcmVzdFN5bWJvbFBvc2l0aW9uKGVkaXRvciwgYnVmZmVyUG9zaXRpb24pXG4gICAgbWluaW11bVdvcmRMZW5ndGggPSBhdG9tLmNvbmZpZy5nZXQoJ2F1dG9jb21wbGV0ZS1wbHVzLm1pbmltdW1Xb3JkTGVuZ3RoJylcblxuICAgIGlmIG1pbmltdW1Xb3JkTGVuZ3RoPyBhbmQgcHJlZml4Lmxlbmd0aCA8IG1pbmltdW1Xb3JkTGVuZ3RoXG4gICAgICByZWdleCA9IC8oPzpcXC58LT58OjopXFxzKlxcdyokL1xuICAgICAgbGluZSA9IGVkaXRvci5nZXRUZXh0SW5SYW5nZShbW2J1ZmZlclBvc2l0aW9uLnJvdywgMF0sIGJ1ZmZlclBvc2l0aW9uXSlcbiAgICAgIHJldHVybiB1bmxlc3MgcmVnZXgudGVzdChsaW5lKVxuXG4gICAgaWYgbGFuZ3VhZ2U/XG4gICAgICBAY29kZUNvbXBsZXRpb25BdChlZGl0b3IsIHN5bWJvbFBvc2l0aW9uLnJvdywgc3ltYm9sUG9zaXRpb24uY29sdW1uLCBsYW5ndWFnZSwgcHJlZml4KVxuXG4gIGNvZGVDb21wbGV0aW9uQXQ6IChlZGl0b3IsIHJvdywgY29sdW1uLCBsYW5ndWFnZSwgcHJlZml4KSAtPlxuICAgIGFyZ3MgPSBidWlsZENvZGVDb21wbGV0aW9uQXJncyBlZGl0b3IsIHJvdywgY29sdW1uLCBsYW5ndWFnZVxuICAgIGNhbGxiYWNrID0gKGNvZGUsIG91dHB1dHMsIGVycm9ycywgcmVzb2x2ZSkgPT5cbiAgICAgIGNvbnNvbGUubG9nIGVycm9yc1xuICAgICAgcmVzb2x2ZShAaGFuZGxlQ29tcGxldGlvblJlc3VsdChvdXRwdXRzLCBjb2RlLCBwcmVmaXgpKVxuICAgIG1ha2VCdWZmZXJlZENsYW5nUHJvY2VzcyBlZGl0b3IsIGFyZ3MsIGNhbGxiYWNrLCBlZGl0b3IuZ2V0VGV4dCgpXG5cbiAgY29udmVydENvbXBsZXRpb25MaW5lOiAobGluZSwgcHJlZml4KSAtPlxuICAgIGNvbnRlbnRSZSA9IC9eQ09NUExFVElPTjogKC4qKS9cbiAgICBbbGluZSwgY29udGVudF0gPSBsaW5lLm1hdGNoIGNvbnRlbnRSZVxuICAgIGJhc2ljSW5mb1JlID0gL14oLio/KSA6ICguKikvXG4gICAgbWF0Y2ggPSBjb250ZW50Lm1hdGNoIGJhc2ljSW5mb1JlXG4gICAgcmV0dXJuIHt0ZXh0OiBjb250ZW50fSB1bmxlc3MgbWF0Y2g/XG5cbiAgICBbY29udGVudCwgYmFzaWNJbmZvLCBjb21wbGV0aW9uQW5kQ29tbWVudF0gPSBtYXRjaFxuICAgIGNvbW1lbnRSZSA9IC8oPzogOiAoLiopKT8kL1xuICAgIFtjb21wbGV0aW9uLCBjb21tZW50XSA9IGNvbXBsZXRpb25BbmRDb21tZW50LnNwbGl0IGNvbW1lbnRSZVxuICAgIHJldHVyblR5cGVSZSA9IC9eXFxbIyguKj8pI1xcXS9cbiAgICByZXR1cm5UeXBlID0gY29tcGxldGlvbi5tYXRjaChyZXR1cm5UeXBlUmUpP1sxXVxuICAgIGNvbnN0TWVtRnVuY1JlID0gL1xcWyMgY29uc3QjXFxdJC9cbiAgICBpc0NvbnN0TWVtRnVuYyA9IGNvbnN0TWVtRnVuY1JlLnRlc3QgY29tcGxldGlvblxuICAgIGluZm9UYWdzUmUgPSAvXFxbIyguKj8pI1xcXS9nXG4gICAgY29tcGxldGlvbiA9IGNvbXBsZXRpb24ucmVwbGFjZSBpbmZvVGFnc1JlLCAnJ1xuICAgIGFyZ3VtZW50c1JlID0gLzwjKC4qPykjPi9nXG4gICAgb3B0aW9uYWxBcmd1bWVudHNTdGFydCA9IGNvbXBsZXRpb24uaW5kZXhPZiAneyMnXG4gICAgY29tcGxldGlvbiA9IGNvbXBsZXRpb24ucmVwbGFjZSAvXFx7Iy9nLCAnJ1xuICAgIGNvbXBsZXRpb24gPSBjb21wbGV0aW9uLnJlcGxhY2UgLyNcXH0vZywgJydcbiAgICBpbmRleCA9IDBcbiAgICBjb21wbGV0aW9uID0gY29tcGxldGlvbi5yZXBsYWNlIGFyZ3VtZW50c1JlLCAobWF0Y2gsIGFyZywgb2Zmc2V0KSAtPlxuICAgICAgaW5kZXgrK1xuICAgICAgaWYgb3B0aW9uYWxBcmd1bWVudHNTdGFydCA+IDAgYW5kIG9mZnNldCA+IG9wdGlvbmFsQXJndW1lbnRzU3RhcnRcbiAgICAgICAgcmV0dXJuIFwiJHsje2luZGV4fTpvcHRpb25hbCAje2FyZ319XCJcbiAgICAgIGVsc2VcbiAgICAgICAgcmV0dXJuIFwiJHsje2luZGV4fToje2FyZ319XCJcblxuICAgIHN1Z2dlc3Rpb24gPSB7fVxuICAgIHN1Z2dlc3Rpb24ubGVmdExhYmVsID0gcmV0dXJuVHlwZSBpZiByZXR1cm5UeXBlP1xuICAgIGlmIGluZGV4ID4gMFxuICAgICAgc3VnZ2VzdGlvbi5zbmlwcGV0ID0gY29tcGxldGlvblxuICAgIGVsc2VcbiAgICAgIHN1Z2dlc3Rpb24udGV4dCA9IGNvbXBsZXRpb25cbiAgICBpZiBpc0NvbnN0TWVtRnVuY1xuICAgICAgc3VnZ2VzdGlvbi5kaXNwbGF5VGV4dCA9IGNvbXBsZXRpb24gKyAnIGNvbnN0J1xuICAgIHN1Z2dlc3Rpb24uZGVzY3JpcHRpb24gPSBjb21tZW50IGlmIGNvbW1lbnQ/XG4gICAgc3VnZ2VzdGlvbi5yZXBsYWNlbWVudFByZWZpeCA9IHByZWZpeFxuICAgIHN1Z2dlc3Rpb25cblxuICBoYW5kbGVDb21wbGV0aW9uUmVzdWx0OiAocmVzdWx0LCByZXR1cm5Db2RlLCBwcmVmaXgpIC0+XG4gICAgaWYgcmV0dXJuQ29kZSBpcyBub3QgMFxuICAgICAgcmV0dXJuIHVubGVzcyBhdG9tLmNvbmZpZy5nZXQgXCJhdXRvY29tcGxldGUtY2xhbmcuaWdub3JlQ2xhbmdFcnJvcnNcIlxuICAgICMgRmluZCBhbGwgY29tcGxldGlvbnMgdGhhdCBtYXRjaCBvdXIgcHJlZml4IGluIE9ORSByZWdleFxuICAgICMgZm9yIHBlcmZvcm1hbmNlIHJlYXNvbnMuXG4gICAgY29tcGxldGlvbnNSZSA9IG5ldyBSZWdFeHAoXCJeQ09NUExFVElPTjogKFwiICsgcHJlZml4ICsgXCIuKikkXCIsIFwibWdcIilcbiAgICBvdXRwdXRMaW5lcyA9IHJlc3VsdC5tYXRjaChjb21wbGV0aW9uc1JlKVxuXG4gICAgaWYgb3V0cHV0TGluZXM/XG4gICAgICByZXR1cm4gKEBjb252ZXJ0Q29tcGxldGlvbkxpbmUobGluZSwgcHJlZml4KSBmb3IgbGluZSBpbiBvdXRwdXRMaW5lcylcbiAgICBlbHNlXG4gICAgICByZXR1cm4gW11cbiJdfQ==
