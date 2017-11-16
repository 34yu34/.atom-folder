(function() {
  var IS_WIN32, RsenseClient, RsenseProvider;

  RsenseClient = require('./autocomplete-ruby-client.coffee');

  IS_WIN32 = process.platform === 'win32';

  String.prototype.regExpEscape = function() {
    return this.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
  };

  module.exports = RsenseProvider = (function() {
    RsenseProvider.prototype.selector = '.source.ruby';

    RsenseProvider.prototype.disableForSelector = '.source.ruby .comment';

    RsenseProvider.suggestionPriority = atom.config.get('autocomplete-ruby.suggestionPriority');

    RsenseProvider.prototype.inclusionPriority = 1;

    RsenseProvider.prototype.suggestionPriority = RsenseProvider.suggestionPriority === true ? 2 : void 0;

    RsenseProvider.prototype.rsenseClient = null;

    function RsenseProvider() {
      this.rsenseClient = new RsenseClient();
      if (!IS_WIN32) {
        this.rsenseClient.startRsenseUnix();
      }
      this.lastSuggestions = [];
    }

    RsenseProvider.prototype.getSuggestions = function(arg) {
      var bufferPosition, editor, prefix, scopeDescriptor;
      editor = arg.editor, bufferPosition = arg.bufferPosition, scopeDescriptor = arg.scopeDescriptor, prefix = arg.prefix;
      if (IS_WIN32) {
        this.rsenseClient.startRsenseWin32();
      }
      return new Promise((function(_this) {
        return function(resolve) {
          var col, completions, row;
          row = bufferPosition.row + 1;
          col = bufferPosition.column + 1;
          return completions = _this.rsenseClient.checkCompletion(editor, editor.buffer, row, col, function(completions) {
            var suggestions;
            suggestions = _this.findSuggestions(prefix, completions);
            if ((suggestions != null ? suggestions.length : void 0)) {
              _this.lastSuggestions = suggestions;
            }
            if (prefix === '.' || prefix === '::') {
              resolve(_this.lastSuggestions);
            }
            return resolve(_this.filterSuggestions(prefix, _this.lastSuggestions));
          });
        };
      })(this));
    };

    RsenseProvider.prototype.findSuggestions = function(prefix, completions) {
      var completion, i, kind, len, suggestion, suggestions;
      if (completions != null) {
        suggestions = [];
        for (i = 0, len = completions.length; i < len; i++) {
          completion = completions[i];
          kind = completion.kind.toLowerCase();
          if (kind === "module") {
            kind = "import";
          }
          suggestion = {
            text: completion.name,
            type: kind,
            leftLabel: completion.base_name
          };
          suggestions.push(suggestion);
        }
        suggestions.sort(function(x, y) {
          if (x.text > y.text) {
            return 1;
          } else if (x.text < y.text) {
            return -1;
          } else {
            return 0;
          }
        });
        return suggestions;
      }
      return [];
    };

    RsenseProvider.prototype.filterSuggestions = function(prefix, suggestions) {
      var expression, i, len, suggestion, suggestionBuffer;
      suggestionBuffer = [];
      if (!(prefix != null ? prefix.length : void 0) || !(suggestions != null ? suggestions.length : void 0)) {
        return [];
      }
      expression = new RegExp("^" + prefix.regExpEscape(), "i");
      for (i = 0, len = suggestions.length; i < len; i++) {
        suggestion = suggestions[i];
        if (expression.test(suggestion.text)) {
          suggestion.replacementPrefix = prefix;
          suggestionBuffer.push(suggestion);
        }
      }
      return suggestionBuffer;
    };

    RsenseProvider.prototype.dispose = function() {
      if (IS_WIN32) {
        return this.rsenseClient.stopRsense();
      }
      return this.rsenseClient.stopRsenseUnix();
    };

    return RsenseProvider;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYmlsbHkvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLXJ1YnkvbGliL2F1dG9jb21wbGV0ZS1ydWJ5LXByb3ZpZGVyLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsWUFBQSxHQUFlLE9BQUEsQ0FBUSxtQ0FBUjs7RUFDZixRQUFBLEdBQVcsT0FBTyxDQUFDLFFBQVIsS0FBb0I7O0VBRS9CLE1BQU0sQ0FBQyxTQUFTLENBQUMsWUFBakIsR0FBZ0MsU0FBQTtBQUM5QixXQUFPLElBQUMsQ0FBQSxPQUFELENBQVMscUNBQVQsRUFBZ0QsTUFBaEQ7RUFEdUI7O0VBR2hDLE1BQU0sQ0FBQyxPQUFQLEdBQ007NkJBQ0osUUFBQSxHQUFVOzs2QkFDVixrQkFBQSxHQUFvQjs7SUFDcEIsY0FBQyxDQUFBLGtCQUFELEdBQXNCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixzQ0FBaEI7OzZCQUV0QixpQkFBQSxHQUFtQjs7NkJBQ25CLGtCQUFBLEdBQXlCLGNBQUMsQ0FBQSxrQkFBRCxLQUF1QixJQUE1QixHQUFBLENBQUEsR0FBQTs7NkJBRXBCLFlBQUEsR0FBYzs7SUFFRCx3QkFBQTtNQUNYLElBQUMsQ0FBQSxZQUFELEdBQW9CLElBQUEsWUFBQSxDQUFBO01BQ3BCLElBQW1DLENBQUMsUUFBcEM7UUFBQSxJQUFDLENBQUEsWUFBWSxDQUFDLGVBQWQsQ0FBQSxFQUFBOztNQUNBLElBQUMsQ0FBQSxlQUFELEdBQW1CO0lBSFI7OzZCQUtiLGNBQUEsR0FBZ0IsU0FBQyxHQUFEO0FBQ2QsVUFBQTtNQURnQixxQkFBUSxxQ0FBZ0IsdUNBQWlCO01BQ3pELElBQW9DLFFBQXBDO1FBQUEsSUFBQyxDQUFBLFlBQVksQ0FBQyxnQkFBZCxDQUFBLEVBQUE7O2FBQ0ksSUFBQSxPQUFBLENBQVEsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLE9BQUQ7QUFFVixjQUFBO1VBQUEsR0FBQSxHQUFNLGNBQWMsQ0FBQyxHQUFmLEdBQXFCO1VBQzNCLEdBQUEsR0FBTSxjQUFjLENBQUMsTUFBZixHQUF3QjtpQkFDOUIsV0FBQSxHQUFjLEtBQUMsQ0FBQSxZQUFZLENBQUMsZUFBZCxDQUE4QixNQUE5QixFQUNkLE1BQU0sQ0FBQyxNQURPLEVBQ0MsR0FERCxFQUNNLEdBRE4sRUFDVyxTQUFDLFdBQUQ7QUFDdkIsZ0JBQUE7WUFBQSxXQUFBLEdBQWMsS0FBQyxDQUFBLGVBQUQsQ0FBaUIsTUFBakIsRUFBeUIsV0FBekI7WUFDZCxJQUFFLHVCQUFDLFdBQVcsQ0FBRSxlQUFkLENBQUY7Y0FDRSxLQUFDLENBQUEsZUFBRCxHQUFtQixZQURyQjs7WUFJQSxJQUE2QixNQUFBLEtBQVUsR0FBVixJQUFpQixNQUFBLEtBQVUsSUFBeEQ7Y0FBQSxPQUFBLENBQVEsS0FBQyxDQUFBLGVBQVQsRUFBQTs7bUJBRUEsT0FBQSxDQUFRLEtBQUMsQ0FBQSxpQkFBRCxDQUFtQixNQUFuQixFQUEyQixLQUFDLENBQUEsZUFBNUIsQ0FBUjtVQVJ1QixDQURYO1FBSko7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQVI7SUFGVTs7NkJBa0JoQixlQUFBLEdBQWlCLFNBQUMsTUFBRCxFQUFTLFdBQVQ7QUFDZixVQUFBO01BQUEsSUFBRyxtQkFBSDtRQUNFLFdBQUEsR0FBYztBQUNkLGFBQUEsNkNBQUE7O1VBQ0UsSUFBQSxHQUFPLFVBQVUsQ0FBQyxJQUFJLENBQUMsV0FBaEIsQ0FBQTtVQUNQLElBQW1CLElBQUEsS0FBUSxRQUEzQjtZQUFBLElBQUEsR0FBTyxTQUFQOztVQUNBLFVBQUEsR0FDRTtZQUFBLElBQUEsRUFBTSxVQUFVLENBQUMsSUFBakI7WUFDQSxJQUFBLEVBQU0sSUFETjtZQUVBLFNBQUEsRUFBVyxVQUFVLENBQUMsU0FGdEI7O1VBR0YsV0FBVyxDQUFDLElBQVosQ0FBaUIsVUFBakI7QUFQRjtRQVFBLFdBQVcsQ0FBQyxJQUFaLENBQWlCLFNBQUMsQ0FBRCxFQUFJLENBQUo7VUFDZixJQUFHLENBQUMsQ0FBQyxJQUFGLEdBQU8sQ0FBQyxDQUFDLElBQVo7bUJBQ0UsRUFERjtXQUFBLE1BRUssSUFBRyxDQUFDLENBQUMsSUFBRixHQUFPLENBQUMsQ0FBQyxJQUFaO21CQUNILENBQUMsRUFERTtXQUFBLE1BQUE7bUJBR0gsRUFIRzs7UUFIVSxDQUFqQjtBQVFBLGVBQU8sWUFsQlQ7O0FBbUJBLGFBQU87SUFwQlE7OzZCQXVCakIsaUJBQUEsR0FBbUIsU0FBQyxNQUFELEVBQVMsV0FBVDtBQUNqQixVQUFBO01BQUEsZ0JBQUEsR0FBbUI7TUFFbkIsSUFBRyxtQkFBQyxNQUFNLENBQUUsZ0JBQVQsSUFBbUIsd0JBQUMsV0FBVyxDQUFFLGdCQUFwQztBQUNFLGVBQU8sR0FEVDs7TUFHQSxVQUFBLEdBQWlCLElBQUEsTUFBQSxDQUFPLEdBQUEsR0FBSSxNQUFNLENBQUMsWUFBUCxDQUFBLENBQVgsRUFBa0MsR0FBbEM7QUFFakIsV0FBQSw2Q0FBQTs7UUFDRSxJQUFHLFVBQVUsQ0FBQyxJQUFYLENBQWdCLFVBQVUsQ0FBQyxJQUEzQixDQUFIO1VBQ0UsVUFBVSxDQUFDLGlCQUFYLEdBQStCO1VBQy9CLGdCQUFnQixDQUFDLElBQWpCLENBQXNCLFVBQXRCLEVBRkY7O0FBREY7QUFLQSxhQUFPO0lBYlU7OzZCQWVuQixPQUFBLEdBQVMsU0FBQTtNQUNQLElBQXFDLFFBQXJDO0FBQUEsZUFBTyxJQUFDLENBQUEsWUFBWSxDQUFDLFVBQWQsQ0FBQSxFQUFQOzthQUNBLElBQUMsQ0FBQSxZQUFZLENBQUMsY0FBZCxDQUFBO0lBRk87Ozs7O0FBOUVYIiwic291cmNlc0NvbnRlbnQiOlsiUnNlbnNlQ2xpZW50ID0gcmVxdWlyZSAnLi9hdXRvY29tcGxldGUtcnVieS1jbGllbnQuY29mZmVlJ1xuSVNfV0lOMzIgPSBwcm9jZXNzLnBsYXRmb3JtID09ICd3aW4zMidcblxuU3RyaW5nLnByb3RvdHlwZS5yZWdFeHBFc2NhcGUgPSAoKSAtPlxuICByZXR1cm4gQHJlcGxhY2UoL1tcXC1cXFtcXF1cXC9cXHtcXH1cXChcXClcXCpcXCtcXD9cXC5cXFxcXFxeXFwkXFx8XS9nLCBcIlxcXFwkJlwiKVxuXG5tb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBSc2Vuc2VQcm92aWRlclxuICBzZWxlY3RvcjogJy5zb3VyY2UucnVieSdcbiAgZGlzYWJsZUZvclNlbGVjdG9yOiAnLnNvdXJjZS5ydWJ5IC5jb21tZW50J1xuICBAc3VnZ2VzdGlvblByaW9yaXR5ID0gYXRvbS5jb25maWcuZ2V0KCdhdXRvY29tcGxldGUtcnVieS5zdWdnZXN0aW9uUHJpb3JpdHknKVxuXG4gIGluY2x1c2lvblByaW9yaXR5OiAxXG4gIHN1Z2dlc3Rpb25Qcmlvcml0eTogMiBpZiBAc3VnZ2VzdGlvblByaW9yaXR5ID09IHRydWVcblxuICByc2Vuc2VDbGllbnQ6IG51bGxcblxuICBjb25zdHJ1Y3RvcjogLT5cbiAgICBAcnNlbnNlQ2xpZW50ID0gbmV3IFJzZW5zZUNsaWVudCgpXG4gICAgQHJzZW5zZUNsaWVudC5zdGFydFJzZW5zZVVuaXgoKSBpZiAhSVNfV0lOMzJcbiAgICBAbGFzdFN1Z2dlc3Rpb25zID0gW11cblxuICBnZXRTdWdnZXN0aW9uczogKHtlZGl0b3IsIGJ1ZmZlclBvc2l0aW9uLCBzY29wZURlc2NyaXB0b3IsIHByZWZpeH0pIC0+XG4gICAgQHJzZW5zZUNsaWVudC5zdGFydFJzZW5zZVdpbjMyKCkgaWYgSVNfV0lOMzJcbiAgICBuZXcgUHJvbWlzZSAocmVzb2x2ZSkgPT5cbiAgICAgICMgcnNlbnNlIGV4cGVjdHMgMS1iYXNlZCBwb3NpdGlvbnNcbiAgICAgIHJvdyA9IGJ1ZmZlclBvc2l0aW9uLnJvdyArIDFcbiAgICAgIGNvbCA9IGJ1ZmZlclBvc2l0aW9uLmNvbHVtbiArIDFcbiAgICAgIGNvbXBsZXRpb25zID0gQHJzZW5zZUNsaWVudC5jaGVja0NvbXBsZXRpb24oZWRpdG9yLFxuICAgICAgZWRpdG9yLmJ1ZmZlciwgcm93LCBjb2wsIChjb21wbGV0aW9ucykgPT5cbiAgICAgICAgc3VnZ2VzdGlvbnMgPSBAZmluZFN1Z2dlc3Rpb25zKHByZWZpeCwgY29tcGxldGlvbnMpXG4gICAgICAgIGlmKHN1Z2dlc3Rpb25zPy5sZW5ndGgpXG4gICAgICAgICAgQGxhc3RTdWdnZXN0aW9ucyA9IHN1Z2dlc3Rpb25zXG5cbiAgICAgICAgIyByZXF1ZXN0IGNvbXBsZXRpb24gb24gYC5gIGFuZCBgOjpgXG4gICAgICAgIHJlc29sdmUoQGxhc3RTdWdnZXN0aW9ucykgaWYgcHJlZml4ID09ICcuJyB8fCBwcmVmaXggPT0gJzo6J1xuXG4gICAgICAgIHJlc29sdmUoQGZpbHRlclN1Z2dlc3Rpb25zKHByZWZpeCwgQGxhc3RTdWdnZXN0aW9ucykpXG4gICAgICApXG5cbiAgZmluZFN1Z2dlc3Rpb25zOiAocHJlZml4LCBjb21wbGV0aW9ucykgLT5cbiAgICBpZiBjb21wbGV0aW9ucz9cbiAgICAgIHN1Z2dlc3Rpb25zID0gW11cbiAgICAgIGZvciBjb21wbGV0aW9uIGluIGNvbXBsZXRpb25zXG4gICAgICAgIGtpbmQgPSBjb21wbGV0aW9uLmtpbmQudG9Mb3dlckNhc2UoKVxuICAgICAgICBraW5kID0gXCJpbXBvcnRcIiBpZiBraW5kID09IFwibW9kdWxlXCJcbiAgICAgICAgc3VnZ2VzdGlvbiA9XG4gICAgICAgICAgdGV4dDogY29tcGxldGlvbi5uYW1lXG4gICAgICAgICAgdHlwZToga2luZFxuICAgICAgICAgIGxlZnRMYWJlbDogY29tcGxldGlvbi5iYXNlX25hbWVcbiAgICAgICAgc3VnZ2VzdGlvbnMucHVzaChzdWdnZXN0aW9uKVxuICAgICAgc3VnZ2VzdGlvbnMuc29ydCAoeCwgeSkgLT5cbiAgICAgICAgaWYgeC50ZXh0PnkudGV4dFxuICAgICAgICAgIDFcbiAgICAgICAgZWxzZSBpZiB4LnRleHQ8eS50ZXh0XG4gICAgICAgICAgLTFcbiAgICAgICAgZWxzZVxuICAgICAgICAgIDBcblxuICAgICAgcmV0dXJuIHN1Z2dlc3Rpb25zXG4gICAgcmV0dXJuIFtdXG5cblxuICBmaWx0ZXJTdWdnZXN0aW9uczogKHByZWZpeCwgc3VnZ2VzdGlvbnMpIC0+XG4gICAgc3VnZ2VzdGlvbkJ1ZmZlciA9IFtdXG5cbiAgICBpZighcHJlZml4Py5sZW5ndGggfHwgIXN1Z2dlc3Rpb25zPy5sZW5ndGgpXG4gICAgICByZXR1cm4gW11cblxuICAgIGV4cHJlc3Npb24gPSBuZXcgUmVnRXhwKFwiXlwiK3ByZWZpeC5yZWdFeHBFc2NhcGUoKSwgXCJpXCIpXG5cbiAgICBmb3Igc3VnZ2VzdGlvbiBpbiBzdWdnZXN0aW9uc1xuICAgICAgaWYgZXhwcmVzc2lvbi50ZXN0KHN1Z2dlc3Rpb24udGV4dClcbiAgICAgICAgc3VnZ2VzdGlvbi5yZXBsYWNlbWVudFByZWZpeCA9IHByZWZpeFxuICAgICAgICBzdWdnZXN0aW9uQnVmZmVyLnB1c2goc3VnZ2VzdGlvbilcblxuICAgIHJldHVybiBzdWdnZXN0aW9uQnVmZmVyXG5cbiAgZGlzcG9zZTogLT5cbiAgICByZXR1cm4gQHJzZW5zZUNsaWVudC5zdG9wUnNlbnNlKCkgaWYgSVNfV0lOMzJcbiAgICBAcnNlbnNlQ2xpZW50LnN0b3BSc2Vuc2VVbml4KClcbiJdfQ==
