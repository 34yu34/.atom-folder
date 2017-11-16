(function() {
  var Point, clangSourceScopeDictionary;

  Point = require('atom').Point;

  clangSourceScopeDictionary = {
    'source.cpp': 'c++',
    'source.c': 'c',
    'source.objc': 'objective-c',
    'source.objcpp': 'objective-c++',
    'source.c++': 'c++',
    'source.objc++': 'objective-c++'
  };

  module.exports = {
    getFirstCursorSourceScopeLang: function(editor) {
      var scopes;
      scopes = this.getFirstCursorScopes(editor);
      return this.getSourceScopeLang(scopes);
    },
    getFirstCursorScopes: function(editor) {
      var firstPosition, scopeDescriptor, scopes;
      if (editor.getCursors) {
        firstPosition = editor.getCursors()[0].getBufferPosition();
        scopeDescriptor = editor.scopeDescriptorForBufferPosition(firstPosition);
        return scopes = scopeDescriptor.getScopesArray();
      } else {
        return scopes = [];
      }
    },
    getSourceScopeLang: function(scopes, scopeDictionary) {
      var i, lang, len, scope;
      if (scopeDictionary == null) {
        scopeDictionary = clangSourceScopeDictionary;
      }
      lang = null;
      for (i = 0, len = scopes.length; i < len; i++) {
        scope = scopes[i];
        if (scope in scopeDictionary) {
          return scopeDictionary[scope];
        }
      }
    },
    prefixAtPosition: function(editor, bufferPosition) {
      var line, ref, regex;
      regex = /\w+$/;
      line = editor.getTextInRange([[bufferPosition.row, 0], bufferPosition]);
      return ((ref = line.match(regex)) != null ? ref[0] : void 0) || '';
    },
    nearestSymbolPosition: function(editor, bufferPosition) {
      var line, matches, regex, symbol, symbolColumn;
      regex = /(\W+)\w*$/;
      line = editor.getTextInRange([[bufferPosition.row, 0], bufferPosition]);
      matches = line.match(regex);
      if (matches) {
        symbol = matches[1];
        symbolColumn = matches[0].indexOf(symbol) + symbol.length + (line.length - matches[0].length);
        return [new Point(bufferPosition.row, symbolColumn), symbol.slice(-1)];
      } else {
        return [bufferPosition, ''];
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYmlsbHkvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLWNsYW5nL2xpYi91dGlsLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUMsUUFBUyxPQUFBLENBQVEsTUFBUjs7RUFFViwwQkFBQSxHQUE2QjtJQUMzQixZQUFBLEVBQWtCLEtBRFM7SUFFM0IsVUFBQSxFQUFrQixHQUZTO0lBRzNCLGFBQUEsRUFBa0IsYUFIUztJQUkzQixlQUFBLEVBQWtCLGVBSlM7SUFPM0IsWUFBQSxFQUFrQixLQVBTO0lBUTNCLGVBQUEsRUFBa0IsZUFSUzs7O0VBVzdCLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7SUFBQSw2QkFBQSxFQUErQixTQUFDLE1BQUQ7QUFDN0IsVUFBQTtNQUFBLE1BQUEsR0FBUyxJQUFDLENBQUEsb0JBQUQsQ0FBc0IsTUFBdEI7QUFDVCxhQUFPLElBQUMsQ0FBQSxrQkFBRCxDQUFvQixNQUFwQjtJQUZzQixDQUEvQjtJQUlBLG9CQUFBLEVBQXNCLFNBQUMsTUFBRDtBQUNwQixVQUFBO01BQUEsSUFBRyxNQUFNLENBQUMsVUFBVjtRQUNFLGFBQUEsR0FBZ0IsTUFBTSxDQUFDLFVBQVAsQ0FBQSxDQUFvQixDQUFBLENBQUEsQ0FBRSxDQUFDLGlCQUF2QixDQUFBO1FBQ2hCLGVBQUEsR0FBa0IsTUFBTSxDQUFDLGdDQUFQLENBQXdDLGFBQXhDO2VBQ2xCLE1BQUEsR0FBUyxlQUFlLENBQUMsY0FBaEIsQ0FBQSxFQUhYO09BQUEsTUFBQTtlQUtFLE1BQUEsR0FBUyxHQUxYOztJQURvQixDQUp0QjtJQVlBLGtCQUFBLEVBQW9CLFNBQUMsTUFBRCxFQUFTLGVBQVQ7QUFDbEIsVUFBQTs7UUFEMkIsa0JBQWdCOztNQUMzQyxJQUFBLEdBQU87QUFDUCxXQUFBLHdDQUFBOztRQUNFLElBQUcsS0FBQSxJQUFTLGVBQVo7QUFDRSxpQkFBTyxlQUFnQixDQUFBLEtBQUEsRUFEekI7O0FBREY7SUFGa0IsQ0FacEI7SUFrQkEsZ0JBQUEsRUFBa0IsU0FBQyxNQUFELEVBQVMsY0FBVDtBQUNoQixVQUFBO01BQUEsS0FBQSxHQUFRO01BQ1IsSUFBQSxHQUFPLE1BQU0sQ0FBQyxjQUFQLENBQXNCLENBQUMsQ0FBQyxjQUFjLENBQUMsR0FBaEIsRUFBcUIsQ0FBckIsQ0FBRCxFQUEwQixjQUExQixDQUF0QjtxREFDWSxDQUFBLENBQUEsV0FBbkIsSUFBeUI7SUFIVCxDQWxCbEI7SUF1QkEscUJBQUEsRUFBdUIsU0FBQyxNQUFELEVBQVMsY0FBVDtBQUNyQixVQUFBO01BQUEsS0FBQSxHQUFRO01BQ1IsSUFBQSxHQUFPLE1BQU0sQ0FBQyxjQUFQLENBQXNCLENBQUMsQ0FBQyxjQUFjLENBQUMsR0FBaEIsRUFBcUIsQ0FBckIsQ0FBRCxFQUEwQixjQUExQixDQUF0QjtNQUNQLE9BQUEsR0FBVSxJQUFJLENBQUMsS0FBTCxDQUFXLEtBQVg7TUFDVixJQUFHLE9BQUg7UUFDRSxNQUFBLEdBQVMsT0FBUSxDQUFBLENBQUE7UUFDakIsWUFBQSxHQUFlLE9BQVEsQ0FBQSxDQUFBLENBQUUsQ0FBQyxPQUFYLENBQW1CLE1BQW5CLENBQUEsR0FBNkIsTUFBTSxDQUFDLE1BQXBDLEdBQTZDLENBQUMsSUFBSSxDQUFDLE1BQUwsR0FBYyxPQUFRLENBQUEsQ0FBQSxDQUFFLENBQUMsTUFBMUI7ZUFDNUQsQ0FBSyxJQUFBLEtBQUEsQ0FBTSxjQUFjLENBQUMsR0FBckIsRUFBMEIsWUFBMUIsQ0FBTCxFQUE2QyxNQUFPLFVBQXBELEVBSEY7T0FBQSxNQUFBO2VBS0UsQ0FBQyxjQUFELEVBQWdCLEVBQWhCLEVBTEY7O0lBSnFCLENBdkJ2Qjs7QUFkRiIsInNvdXJjZXNDb250ZW50IjpbIntQb2ludH0gPSByZXF1aXJlICdhdG9tJ1xuXG5jbGFuZ1NvdXJjZVNjb3BlRGljdGlvbmFyeSA9IHtcbiAgJ3NvdXJjZS5jcHAnICAgIDogJ2MrKycgLFxuICAnc291cmNlLmMnICAgICAgOiAnYycgLFxuICAnc291cmNlLm9iamMnICAgOiAnb2JqZWN0aXZlLWMnICxcbiAgJ3NvdXJjZS5vYmpjcHAnIDogJ29iamVjdGl2ZS1jKysnICxcblxuICAjIEZvciBiYWNrd2FyZC1jb21wYXRpYmlsaXR5IHdpdGggdmVyc2lvbnMgb2YgQXRvbSA8IDAuMTY2XG4gICdzb3VyY2UuYysrJyAgICA6ICdjKysnICxcbiAgJ3NvdXJjZS5vYmpjKysnIDogJ29iamVjdGl2ZS1jKysnICxcbn1cblxubW9kdWxlLmV4cG9ydHMgPVxuICBnZXRGaXJzdEN1cnNvclNvdXJjZVNjb3BlTGFuZzogKGVkaXRvcikgLT5cbiAgICBzY29wZXMgPSBAZ2V0Rmlyc3RDdXJzb3JTY29wZXMgZWRpdG9yXG4gICAgcmV0dXJuIEBnZXRTb3VyY2VTY29wZUxhbmcgc2NvcGVzXG5cbiAgZ2V0Rmlyc3RDdXJzb3JTY29wZXM6IChlZGl0b3IpIC0+XG4gICAgaWYgZWRpdG9yLmdldEN1cnNvcnNcbiAgICAgIGZpcnN0UG9zaXRpb24gPSBlZGl0b3IuZ2V0Q3Vyc29ycygpWzBdLmdldEJ1ZmZlclBvc2l0aW9uKClcbiAgICAgIHNjb3BlRGVzY3JpcHRvciA9IGVkaXRvci5zY29wZURlc2NyaXB0b3JGb3JCdWZmZXJQb3NpdGlvbihmaXJzdFBvc2l0aW9uKVxuICAgICAgc2NvcGVzID0gc2NvcGVEZXNjcmlwdG9yLmdldFNjb3Blc0FycmF5KClcbiAgICBlbHNlXG4gICAgICBzY29wZXMgPSBbXVxuXG4gIGdldFNvdXJjZVNjb3BlTGFuZzogKHNjb3Blcywgc2NvcGVEaWN0aW9uYXJ5PWNsYW5nU291cmNlU2NvcGVEaWN0aW9uYXJ5KSAtPlxuICAgIGxhbmcgPSBudWxsXG4gICAgZm9yIHNjb3BlIGluIHNjb3Blc1xuICAgICAgaWYgc2NvcGUgb2Ygc2NvcGVEaWN0aW9uYXJ5XG4gICAgICAgIHJldHVybiBzY29wZURpY3Rpb25hcnlbc2NvcGVdXG5cbiAgcHJlZml4QXRQb3NpdGlvbjogKGVkaXRvciwgYnVmZmVyUG9zaXRpb24pIC0+XG4gICAgcmVnZXggPSAvXFx3KyQvXG4gICAgbGluZSA9IGVkaXRvci5nZXRUZXh0SW5SYW5nZShbW2J1ZmZlclBvc2l0aW9uLnJvdywgMF0sIGJ1ZmZlclBvc2l0aW9uXSlcbiAgICBsaW5lLm1hdGNoKHJlZ2V4KT9bMF0gb3IgJydcblxuICBuZWFyZXN0U3ltYm9sUG9zaXRpb246IChlZGl0b3IsIGJ1ZmZlclBvc2l0aW9uKSAtPlxuICAgIHJlZ2V4ID0gLyhcXFcrKVxcdyokL1xuICAgIGxpbmUgPSBlZGl0b3IuZ2V0VGV4dEluUmFuZ2UoW1tidWZmZXJQb3NpdGlvbi5yb3csIDBdLCBidWZmZXJQb3NpdGlvbl0pXG4gICAgbWF0Y2hlcyA9IGxpbmUubWF0Y2gocmVnZXgpXG4gICAgaWYgbWF0Y2hlc1xuICAgICAgc3ltYm9sID0gbWF0Y2hlc1sxXVxuICAgICAgc3ltYm9sQ29sdW1uID0gbWF0Y2hlc1swXS5pbmRleE9mKHN5bWJvbCkgKyBzeW1ib2wubGVuZ3RoICsgKGxpbmUubGVuZ3RoIC0gbWF0Y2hlc1swXS5sZW5ndGgpXG4gICAgICBbbmV3IFBvaW50KGJ1ZmZlclBvc2l0aW9uLnJvdywgc3ltYm9sQ29sdW1uKSxzeW1ib2xbLTEuLl1dXG4gICAgZWxzZVxuICAgICAgW2J1ZmZlclBvc2l0aW9uLCcnXVxuIl19
