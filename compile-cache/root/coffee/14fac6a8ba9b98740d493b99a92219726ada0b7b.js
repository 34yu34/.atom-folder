(function() {
  var CompositeDisposable, Point, RubyBlock, RubyBlockView, _, ref;

  ref = require('atom'), CompositeDisposable = ref.CompositeDisposable, Point = ref.Point;

  _ = null;

  RubyBlockView = null;

  module.exports = RubyBlock = {
    config: {
      showBottomPanel: {
        type: 'boolean',
        "default": true
      },
      highlightLine: {
        type: 'boolean',
        "default": true
      },
      highlightLineNumber: {
        type: 'boolean',
        "default": false
      }
    },
    rubyBlockView: null,
    modalPanel: null,
    rubyRootScope: 'source.ruby',
    rubyStartBlockNames: ['for', 'if', 'unless', 'until', 'while', 'class', 'module', 'case', 'def', 'begin', 'describe', 'context'],
    rubyStartBlockScopes: ['keyword.control.ruby', 'keyword.control.start-block.ruby', 'keyword.control.class.ruby', 'keyword.control.module.ruby', 'keyword.control.def.ruby', 'meta.rspec.behaviour'],
    rubyWhileBlockName: 'while',
    rubyDoBlockName: 'do',
    rubyEndBlockName: 'end',
    rubyKeywordControlScope: 'keyword.control.ruby',
    rubyKeywordControlNames: ['end', 'elsif', 'else', 'when', 'rescue', 'ensure'],
    rubyDoScope: 'keyword.control.start-block.ruby',
    endBlockStack: [],
    activate: function() {
      return this.activeItemSubscription = atom.workspace.observeActivePaneItem((function(_this) {
        return function() {
          return _this.subscribeToActiveTextEditor();
        };
      })(this));
    },
    deactivate: function() {
      var ref1, ref2, ref3, ref4, ref5;
      if ((ref1 = this.marker) != null) {
        ref1.destroy();
      }
      this.marker = null;
      if ((ref2 = this.modalPanel) != null) {
        ref2.destroy();
      }
      this.modalPanel = null;
      if ((ref3 = this.activeItemSubscription) != null) {
        ref3.dispose();
      }
      this.activeItemSubscription = null;
      if ((ref4 = this.editorSubscriptions) != null) {
        ref4.dispose();
      }
      this.editorSubscriptions = null;
      if ((ref5 = this.rubyBlockView) != null) {
        ref5.destroy();
      }
      return this.rubyBlockView = null;
    },
    init: function() {
      if (!(RubyBlockView && _)) {
        this.loadClasses();
      }
      this.rubyBlockView = new RubyBlockView;
      return this.modalPanel = atom.workspace.addBottomPanel({
        item: this.rubyBlockView.getElement(),
        visible: false,
        priority: 500
      });
    },
    getActiveTextEditor: function() {
      return atom.workspace.getActiveTextEditor();
    },
    goToMatchingLine: function() {
      var editor, firstCharPoint, row;
      if (this.blockStartedRowNumber == null) {
        return atom.beep();
      }
      editor = this.getActiveTextEditor();
      row = editor.lineTextForBufferRow(this.blockStartedRowNumber);
      firstCharPoint = row.search(/\S/);
      return editor.setCursorBufferPosition([this.blockStartedRowNumber, firstCharPoint]);
    },
    subscribeToActiveTextEditor: function() {
      var editor, editorElement, ref1, ref2, ref3;
      if ((ref1 = this.marker) != null) {
        ref1.destroy();
      }
      if ((ref2 = this.modalPanel) != null ? ref2.isVisible() : void 0) {
        this.modalPanel.hide();
      }
      if ((ref3 = this.editorSubscriptions) != null) {
        ref3.dispose();
      }
      editor = this.getActiveTextEditor();
      if (editor == null) {
        return;
      }
      if (editor.getRootScopeDescriptor().scopes[0].indexOf(this.rubyRootScope) === -1) {
        return;
      }
      if (this.rubyBlockView == null) {
        this.init();
      }
      editorElement = atom.views.getView(editor);
      this.editorSubscriptions = new CompositeDisposable;
      this.editorSubscriptions.add(atom.commands.add(editorElement, {
        'ruby-block:go-to-matching-line': (function(_this) {
          return function() {
            return _this.goToMatchingLine();
          };
        })(this)
      }));
      this.editorSubscriptions.add(editor.onDidChangeCursorPosition(_.debounce((function(_this) {
        return function() {
          var ref4;
          if (_this.getActiveTextEditor() !== editor) {
            return;
          }
          _this.blockStartedRowNumber = null;
          if (_this.modalPanel.isVisible()) {
            _this.modalPanel.hide();
          }
          if ((ref4 = _this.marker) != null) {
            ref4.destroy();
          }
          return _this.searchForBlock();
        };
      })(this), 100)));
      return this.searchForBlock();
    },
    searchForBlock: function() {
      var currentRowNumber, cursor, editor, filteredTokens, firstTokenScope, grammar, i, j, k, l, len, len1, m, prevWordBoundaryPos, ref1, ref2, ref3, row, rowNumber, scope, startBlock, token, tokens;
      editor = this.getActiveTextEditor();
      grammar = editor.getGrammar();
      cursor = editor.getLastCursor();
      currentRowNumber = cursor.getBufferRow();
      if (cursor.getScopeDescriptor().scopes.indexOf(this.rubyKeywordControlScope) === -1 || this.rubyKeywordControlNames.indexOf(editor.getWordUnderCursor()) === -1) {
        return;
      }
      this.endBlockStack.push(editor.getWordUnderCursor);
      for (rowNumber = j = ref1 = cursor.getBufferRow(); ref1 <= 0 ? j <= 0 : j >= 0; rowNumber = ref1 <= 0 ? ++j : --j) {
        if (editor.isBufferRowCommented(rowNumber)) {
          continue;
        }
        if (rowNumber === currentRowNumber) {
          prevWordBoundaryPos = cursor.getPreviousWordBoundaryBufferPosition();
          row = editor.getTextInBufferRange([[rowNumber, 0], prevWordBoundaryPos]);
        } else {
          row = editor.lineTextForBufferRow(rowNumber);
        }
        tokens = grammar.tokenizeLine(row).tokens;
        filteredTokens = (function() {
          var k, len, results;
          results = [];
          for (i = k = 0, len = tokens.length; k < len; i = ++k) {
            token = tokens[i];
            if (!token.value.match(/^\s*$/)) {
              results.push(token);
            }
          }
          return results;
        })();
        startBlock = (function() {
          var k, len, results;
          results = [];
          for (k = 0, len = filteredTokens.length; k < len; k++) {
            token = filteredTokens[k];
            if (token.scopes.indexOf(this.rubyDoScope) >= 0) {
              results.push(token);
            }
          }
          return results;
        }).call(this);
        if (startBlock.length > 0) {
          if (token.value !== this.rubyDoBlockName || filteredTokens[0].value !== this.rubyWhileBlockName) {
            this.endBlockStack.pop();
          }
          if (this.endBlockStack.length === 0) {
            return this.highlightBlock(rowNumber);
          }
        }
        for (k = filteredTokens.length - 1; k >= 0; k += -1) {
          token = filteredTokens[k];
          ref2 = token.scopes;
          for (l = 0, len = ref2.length; l < len; l++) {
            scope = ref2[l];
            if (scope === this.rubyKeywordControlScope && token.value === this.rubyEndBlockName) {
              this.endBlockStack.push(scope.value);
            } else if (this.rubyStartBlockScopes.indexOf(scope) >= 0 && this.rubyStartBlockNames.indexOf(token.value) >= 0) {
              if (token.value === 'case') {
                this.endBlockStack.pop();
              } else {
                ref3 = filteredTokens[0].scopes;
                for (m = 0, len1 = ref3.length; m < len1; m++) {
                  firstTokenScope = ref3[m];
                  if (this.rubyStartBlockScopes.indexOf(firstTokenScope) >= 0 && this.rubyStartBlockNames.indexOf(filteredTokens[0].value) >= 0) {
                    this.endBlockStack.pop();
                    break;
                  }
                }
              }
              if (this.endBlockStack.length === 0) {
                return this.highlightBlock(rowNumber);
              }
            }
          }
        }
      }
    },
    highlightBlock: function(rowNumber) {
      var editor, firstCharPoint, row;
      editor = this.getActiveTextEditor();
      row = editor.lineTextForBufferRow(rowNumber);
      firstCharPoint = row.search(/\S/);
      this.marker = editor.markBufferRange([[rowNumber, firstCharPoint], [rowNumber, row.length]]);
      this.blockStartedRowNumber = rowNumber;
      if (atom.config.get('ruby-block.highlightLine')) {
        editor.decorateMarker(this.marker, {
          type: 'highlight',
          "class": 'ruby-block-highlight'
        });
      }
      if (atom.config.get('ruby-block.highlightLineNumber')) {
        editor.decorateMarker(this.marker, {
          type: 'line-number',
          "class": 'ruby-block-highlight'
        });
      }
      if (atom.config.get('ruby-block.showBottomPanel')) {
        this.rubyBlockView.updateMessage(rowNumber);
        return this.modalPanel.show();
      }
    },
    loadClasses: function() {
      _ = require('underscore-plus');
      return RubyBlockView = require('./ruby-block-view');
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYmlsbHkvLmF0b20vcGFja2FnZXMvcnVieS1ibG9jay9saWIvcnVieS1ibG9jay5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLE1BQStCLE9BQUEsQ0FBUSxNQUFSLENBQS9CLEVBQUMsNkNBQUQsRUFBc0I7O0VBQ3RCLENBQUEsR0FBSTs7RUFDSixhQUFBLEdBQWdCOztFQUVoQixNQUFNLENBQUMsT0FBUCxHQUFpQixTQUFBLEdBQ2Y7SUFBQSxNQUFBLEVBQ0U7TUFBQSxlQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sU0FBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsSUFEVDtPQURGO01BR0EsYUFBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLFNBQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLElBRFQ7T0FKRjtNQU1BLG1CQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sU0FBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsS0FEVDtPQVBGO0tBREY7SUFZQSxhQUFBLEVBQWUsSUFaZjtJQWFBLFVBQUEsRUFBWSxJQWJaO0lBY0EsYUFBQSxFQUFlLGFBZGY7SUFnQkEsbUJBQUEsRUFBcUIsQ0FDbkIsS0FEbUIsRUFFbkIsSUFGbUIsRUFHbkIsUUFIbUIsRUFJbkIsT0FKbUIsRUFLbkIsT0FMbUIsRUFNbkIsT0FObUIsRUFPbkIsUUFQbUIsRUFRbkIsTUFSbUIsRUFTbkIsS0FUbUIsRUFVbkIsT0FWbUIsRUFXbkIsVUFYbUIsRUFZbkIsU0FabUIsQ0FoQnJCO0lBOEJBLG9CQUFBLEVBQXNCLENBQ25CLHNCQURtQixFQUVuQixrQ0FGbUIsRUFHbkIsNEJBSG1CLEVBSW5CLDZCQUptQixFQUtuQiwwQkFMbUIsRUFNbkIsc0JBTm1CLENBOUJ0QjtJQXVDQSxrQkFBQSxFQUFvQixPQXZDcEI7SUF3Q0EsZUFBQSxFQUFpQixJQXhDakI7SUF5Q0EsZ0JBQUEsRUFB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cXVpcmUgJ2F0b20nXG5fID0gbnVsbFxuUnVieUJsb2NrVmlldyA9IG51bGxcblxubW9kdWxlLmV4cG9ydHMgPSBSdWJ5QmxvY2sgPVxuICBjb25maWc6XG4gICAgc2hvd0JvdHRvbVBhbmVsOlxuICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICBkZWZhdWx0OiB0cnVlXG4gICAgaGlnaGxpZ2h0TGluZTpcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgZGVmYXVsdDogdHJ1ZVxuICAgIGhpZ2hsaWdodExpbmVOdW1iZXI6XG4gICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgIGRlZmF1bHQ6IGZhbHNlXG5cblxuICBydWJ5QmxvY2tWaWV3OiBudWxsXG4gIG1vZGFsUGFuZWw6IG51bGxcbiAgcnVieVJvb3RTY29wZTogJ3NvdXJjZS5ydWJ5J1xuXG4gIHJ1YnlTdGFydEJsb2NrTmFtZXM6IFtcbiAgICAnZm9yJ1xuICAgICdpZidcbiAgICAndW5sZXNzJ1xuICAgICd1bnRpbCdcbiAgICAnd2hpbGUnXG4gICAgJ2NsYXNzJ1xuICAgICdtb2R1bGUnXG4gICAgJ2Nhc2UnXG4gICAgJ2RlZidcbiAgICAnYmVnaW4nXG4gICAgJ2Rlc2NyaWJlJ1xuICAgICdjb250ZXh0J1xuICBdXG4gIHJ1YnlTdGFydEJsb2NrU2NvcGVzOiBbXG4gICAgICdrZXl3b3JkLmNvbnRyb2wucnVieSdcbiAgICAgJ2tleXdvcmQuY29udHJvbC5zdGFydC1ibG9jay5ydWJ5J1xuICAgICAna2V5d29yZC5jb250cm9sLmNsYXNzLnJ1YnknXG4gICAgICdrZXl3b3JkLmNvbnRyb2wubW9kdWxlLnJ1YnknXG4gICAgICdrZXl3b3JkLmNvbnRyb2wuZGVmLnJ1YnknXG4gICAgICdtZXRhLnJzcGVjLmJlaGF2aW91cidcbiAgXVxuXG4gIHJ1YnlXaGlsZUJsb2NrTmFtZTogJ3doaWxlJ1xuICBydWJ5RG9CbG9ja05hbWU6ICdkbydcbiAgcnVieUVuZEJsb2NrTmFtZTogJ2VuZCdcblxuICBydWJ5S2V5d29yZENvbnRyb2xTY29wZTogJ2tleXdvcmQuY29udHJvbC5ydWJ5J1xuICBydWJ5S2V5d29yZENvbnRyb2xOYW1lczogW1xuICAgICdlbmQnXG4gICAgJ2Vsc2lmJ1xuICAgICdlbHNlJ1xuICAgICd3aGVuJ1xuICAgICdyZXNjdWUnXG4gICAgJ2Vuc3VyZSdcbiAgXVxuXG4gIHJ1YnlEb1Njb3BlOiAna2V5d29yZC5jb250cm9sLnN0YXJ0LWJsb2NrLnJ1YnknXG5cbiAgZW5kQmxvY2tTdGFjazogW11cblxuICBhY3RpdmF0ZTogLT5cbiAgICAjIEV2ZW50cyBzdWJzY3JpYmVkIHRvIGluIGF0b20ncyBzeXN0ZW0gY2FuIGJlIGVhc2lseSBjbGVhbmVkIHVwIHdpdGggYSBDb21wb3NpdGVEaXNwb3NhYmxlXG4gICAgQGFjdGl2ZUl0ZW1TdWJzY3JpcHRpb24gPSBhdG9tLndvcmtzcGFjZS5vYnNlcnZlQWN0aXZlUGFuZUl0ZW0oID0+IEBzdWJzY3JpYmVUb0FjdGl2ZVRleHRFZGl0b3IoKSlcblxuICBkZWFjdGl2YXRlOiAtPlxuICAgIEBtYXJrZXI/LmRlc3Ryb3koKVxuICAgIEBtYXJrZXIgPSBudWxsXG4gICAgQG1vZGFsUGFuZWw/LmRlc3Ryb3koKVxuICAgIEBtb2RhbFBhbmVsID0gbnVsbFxuICAgIEBhY3RpdmVJdGVtU3Vic2NyaXB0aW9uPy5kaXNwb3NlKClcbiAgICBAYWN0aXZlSXRlbVN1YnNjcmlwdGlvbiA9IG51bGxcbiAgICBAZWRpdG9yU3Vic2NyaXB0aW9ucz8uZGlzcG9zZSgpXG4gICAgQGVkaXRvclN1YnNjcmlwdGlvbnMgPSBudWxsXG4gICAgQHJ1YnlCbG9ja1ZpZXc/LmRlc3Ryb3koKVxuICAgIEBydWJ5QmxvY2tWaWV3ID0gbnVsbFxuXG4gIGluaXQ6IC0+XG4gICAgQGxvYWRDbGFzc2VzKCkgdW5sZXNzIFJ1YnlCbG9ja1ZpZXcgYW5kIF9cbiAgICBAcnVieUJsb2NrVmlldyA9IG5ldyBSdWJ5QmxvY2tWaWV3XG4gICAgQG1vZGFsUGFuZWwgPSBhdG9tLndvcmtzcGFjZS5hZGRCb3R0b21QYW5lbChpdGVtOiBAcnVieUJsb2NrVmlldy5nZXRFbGVtZW50KCksIHZpc2libGU6IGZhbHNlLCBwcmlvcml0eTogNTAwKVxuXG4gIGdldEFjdGl2ZVRleHRFZGl0b3I6IC0+XG4gICAgYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG5cbiAgZ29Ub01hdGNoaW5nTGluZTogLT5cbiAgICByZXR1cm4gYXRvbS5iZWVwKCkgdW5sZXNzIEBibG9ja1N0YXJ0ZWRSb3dOdW1iZXI/XG4gICAgZWRpdG9yID0gQGdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgIHJvdyA9IGVkaXRvci5saW5lVGV4dEZvckJ1ZmZlclJvdyhAYmxvY2tTdGFydGVkUm93TnVtYmVyKVxuICAgIGZpcnN0Q2hhclBvaW50ID0gcm93LnNlYXJjaCgvXFxTLylcbiAgICBlZGl0b3Iuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oW0BibG9ja1N0YXJ0ZWRSb3dOdW1iZXIsIGZpcnN0Q2hhclBvaW50XSlcblxuICBzdWJzY3JpYmVUb0FjdGl2ZVRleHRFZGl0b3I6IC0+XG4gICAgQG1hcmtlcj8uZGVzdHJveSgpXG4gICAgQG1vZGFsUGFuZWwuaGlkZSgpIGlmIEBtb2RhbFBhbmVsPy5pc1Zpc2libGUoKVxuXG4gICAgQGVkaXRvclN1YnNjcmlwdGlvbnM/LmRpc3Bvc2UoKVxuICAgIGVkaXRvciA9IEBnZXRBY3RpdmVUZXh0RWRpdG9yKClcblxuICAgIHJldHVybiB1bmxlc3MgZWRpdG9yP1xuICAgIHJldHVybiBpZiBlZGl0b3IuZ2V0Um9vdFNjb3BlRGVzY3JpcHRvcigpLnNjb3Blc1swXS5pbmRleE9mKEBydWJ5Um9vdFNjb3BlKSBpcyAtMVxuXG4gICAgQGluaXQoKSB1bmxlc3MgQHJ1YnlCbG9ja1ZpZXc/XG5cbiAgICBlZGl0b3JFbGVtZW50ID0gYXRvbS52aWV3cy5nZXRWaWV3KGVkaXRvcilcbiAgICBAZWRpdG9yU3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlXG5cbiAgICBAZWRpdG9yU3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb21tYW5kcy5hZGQoZWRpdG9yRWxlbWVudCxcbiAgICAgICdydWJ5LWJsb2NrOmdvLXRvLW1hdGNoaW5nLWxpbmUnOiA9PlxuICAgICAgICBAZ29Ub01hdGNoaW5nTGluZSgpXG4gICAgKVxuXG4gICAgIyBAZWRpdG9yU3Vic2NyaXB0aW9ucy5hZGQoZWRpdG9yLm9uRGlkQ2hhbmdlQ3Vyc29yUG9zaXRpb24oQGRlYm91bmNlZEN1cnNvckNoYW5nZWRDYWxsYmFjaykpXG4gICAgQGVkaXRvclN1YnNjcmlwdGlvbnMuYWRkKGVkaXRvci5vbkRpZENoYW5nZUN1cnNvclBvc2l0aW9uKF8uZGVib3VuY2UoID0+XG4gICAgICByZXR1cm4gdW5sZXNzIEBnZXRBY3RpdmVUZXh0RWRpdG9yKCkgaXMgZWRpdG9yXG4gICAgICBAYmxvY2tTdGFydGVkUm93TnVtYmVyID0gbnVsbFxuICAgICAgQG1vZGFsUGFuZWwuaGlkZSgpIGlmIEBtb2RhbFBhbmVsLmlzVmlzaWJsZSgpXG4gICAgICBAbWFya2VyPy5kZXN0cm95KClcbiAgICAgIEBzZWFyY2hGb3JCbG9jaygpXG4gICAgLCAxMDApKSlcblxuICAgIEBzZWFyY2hGb3JCbG9jaygpXG5cbiAgc2VhcmNoRm9yQmxvY2s6IC0+XG4gICAgZWRpdG9yID0gQGdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgIGdyYW1tYXIgPSBlZGl0b3IuZ2V0R3JhbW1hcigpXG4gICAgY3Vyc29yID0gZWRpdG9yLmdldExhc3RDdXJzb3IoKVxuICAgIGN1cnJlbnRSb3dOdW1iZXIgPSBjdXJzb3IuZ2V0QnVmZmVyUm93KClcblxuICAgICMgc2NvcGUgYW5kIHdvcmQgbWF0Y2hlcyAnZW5kJ1xuICAgIHJldHVybiBpZiBjdXJzb3IuZ2V0U2NvcGVEZXNjcmlwdG9yKCkuc2NvcGVzLmluZGV4T2YoQHJ1YnlLZXl3b3JkQ29udHJvbFNjb3BlKSBpcyAtMSBvclxuICAgICAgICAgICAgICBAcnVieUtleXdvcmRDb250cm9sTmFtZXMuaW5kZXhPZihlZGl0b3IuZ2V0V29yZFVuZGVyQ3Vyc29yKCkpIGlzIC0xXG5cbiAgICBAZW5kQmxvY2tTdGFjay5wdXNoKGVkaXRvci5nZXRXb3JkVW5kZXJDdXJzb3IpXG5cbiAgICAjIGl0ZXJhdGUgbGluZXMgYWJvdmUgdGhlIGN1cnNvclxuICAgIGZvciByb3dOdW1iZXIgaW4gW2N1cnNvci5nZXRCdWZmZXJSb3coKS4uMF1cbiAgICAgIGNvbnRpbnVlIGlmIGVkaXRvci5pc0J1ZmZlclJvd0NvbW1lbnRlZChyb3dOdW1iZXIpXG5cbiAgICAgIGlmIHJvd051bWJlciBpcyBjdXJyZW50Um93TnVtYmVyXG4gICAgICAgIHByZXZXb3JkQm91bmRhcnlQb3MgPSBjdXJzb3IuZ2V0UHJldmlvdXNXb3JkQm91bmRhcnlCdWZmZXJQb3NpdGlvbigpXG4gICAgICAgIHJvdyA9IGVkaXRvci5nZXRUZXh0SW5CdWZmZXJSYW5nZShbW3Jvd051bWJlciwgMF0sIHByZXZXb3JkQm91bmRhcnlQb3NdKVxuICAgICAgZWxzZVxuICAgICAgICByb3cgPSBlZGl0b3IubGluZVRleHRGb3JCdWZmZXJSb3cocm93TnVtYmVyKVxuXG4gICAgICB0b2tlbnMgPSBncmFtbWFyLnRva2VuaXplTGluZShyb3cpLnRva2Vuc1xuICAgICAgZmlsdGVyZWRUb2tlbnMgPSAodG9rZW4gZm9yIHRva2VuLGkgaW4gdG9rZW5zIHdoZW4gIXRva2VuLnZhbHVlLm1hdGNoIC9eXFxzKiQvKVxuXG4gICAgICBzdGFydEJsb2NrID0gKHRva2VuIGZvciB0b2tlbiBpbiBmaWx0ZXJlZFRva2VucyB3aGVuIHRva2VuLnNjb3Blcy5pbmRleE9mKEBydWJ5RG9TY29wZSkgPj0gMClcbiAgICAgIGlmIHN0YXJ0QmxvY2subGVuZ3RoID4gMFxuICAgICAgICBpZiB0b2tlbi52YWx1ZSBpc250IEBydWJ5RG9CbG9ja05hbWUgb3JcbiAgICAgICAgICAgZmlsdGVyZWRUb2tlbnNbMF0udmFsdWUgaXNudCBAcnVieVdoaWxlQmxvY2tOYW1lXG4gICAgICAgICAgQGVuZEJsb2NrU3RhY2sucG9wKClcbiAgICAgICAgaWYgQGVuZEJsb2NrU3RhY2subGVuZ3RoIGlzIDBcbiAgICAgICAgICByZXR1cm4gQGhpZ2hsaWdodEJsb2NrKHJvd051bWJlcilcblxuICAgICAgZm9yIHRva2VuIGluIGZpbHRlcmVkVG9rZW5zIGJ5IC0xXG4gICAgICAgIGZvciBzY29wZSBpbiB0b2tlbi5zY29wZXNcbiAgICAgICAgICBpZiBzY29wZSBpcyBAcnVieUtleXdvcmRDb250cm9sU2NvcGUgYW5kIHRva2VuLnZhbHVlIGlzIEBydWJ5RW5kQmxvY2tOYW1lXG4gICAgICAgICAgICBAZW5kQmxvY2tTdGFjay5wdXNoKHNjb3BlLnZhbHVlKVxuICAgICAgICAgIGVsc2UgaWYgQHJ1YnlTdGFydEJsb2NrU2NvcGVzLmluZGV4T2Yoc2NvcGUpID49IDAgYW5kXG4gICAgICAgICAgICAgICAgICBAcnVieVN0YXJ0QmxvY2tOYW1lcy5pbmRleE9mKHRva2VuLnZhbHVlKSA+PSAwXG4gICAgICAgICAgICAjIFN1cHBvcnQgYXNzaWduaW5nIHZhcmlhYmxlIHdpdGggYSBjYXNlIHN0YXRlbWVudFxuICAgICAgICAgICAgIyBlLmcuXG4gICAgICAgICAgICAjIHZhciA9IGNhc2UgY29uZFxuICAgICAgICAgICAgIyAgICAgICB3aGVuIDEgdGhlbiAxMFxuICAgICAgICAgICAgIyAgICAgICBlbmRcbiAgICAgICAgICAgIGlmIHRva2VuLnZhbHVlIGlzICdjYXNlJ1xuICAgICAgICAgICAgICBAZW5kQmxvY2tTdGFjay5wb3AoKVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICBmb3IgZmlyc3RUb2tlblNjb3BlIGluIGZpbHRlcmVkVG9rZW5zWzBdLnNjb3Blc1xuICAgICAgICAgICAgICAgIGlmIEBydWJ5U3RhcnRCbG9ja1Njb3Blcy5pbmRleE9mKGZpcnN0VG9rZW5TY29wZSkgPj0gMCBhbmRcbiAgICAgICAgICAgICAgICAgICBAcnVieVN0YXJ0QmxvY2tOYW1lcy5pbmRleE9mKGZpbHRlcmVkVG9rZW5zWzBdLnZhbHVlKSA+PSAwXG4gICAgICAgICAgICAgICAgICBAZW5kQmxvY2tTdGFjay5wb3AoKVxuICAgICAgICAgICAgICAgICAgYnJlYWtcblxuICAgICAgICAgICAgaWYgQGVuZEJsb2NrU3RhY2subGVuZ3RoIGlzIDBcbiAgICAgICAgICAgICAgcmV0dXJuIEBoaWdobGlnaHRCbG9jayhyb3dOdW1iZXIpXG5cbiAgaGlnaGxpZ2h0QmxvY2s6IChyb3dOdW1iZXIpLT5cbiAgICBlZGl0b3IgPSBAZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgcm93ID0gZWRpdG9yLmxpbmVUZXh0Rm9yQnVmZmVyUm93KHJvd051bWJlcilcbiAgICBmaXJzdENoYXJQb2ludCA9IHJvdy5zZWFyY2goL1xcUy8pXG4gICAgQG1hcmtlciA9IGVkaXRvci5tYXJrQnVmZmVyUmFuZ2UoW1tyb3dOdW1iZXIsIGZpcnN0Q2hhclBvaW50XSwgW3Jvd051bWJlciwgcm93Lmxlbmd0aF1dKVxuXG4gICAgQGJsb2NrU3RhcnRlZFJvd051bWJlciA9IHJvd051bWJlclxuICAgIGlmIGF0b20uY29uZmlnLmdldCgncnVieS1ibG9jay5oaWdobGlnaHRMaW5lJylcbiAgICAgIGVkaXRvci5kZWNvcmF0ZU1hcmtlcihAbWFya2VyLCB7dHlwZTogJ2hpZ2hsaWdodCcsIGNsYXNzOiAncnVieS1ibG9jay1oaWdobGlnaHQnfSlcbiAgICBpZiBhdG9tLmNvbmZpZy5nZXQoJ3J1YnktYmxvY2suaGlnaGxpZ2h0TGluZU51bWJlcicpXG4gICAgICBlZGl0b3IuZGVjb3JhdGVNYXJrZXIoQG1hcmtlciwge3R5cGU6ICdsaW5lLW51bWJlcicsIGNsYXNzOiAncnVieS1ibG9jay1oaWdobGlnaHQnfSlcbiAgICBpZiBhdG9tLmNvbmZpZy5nZXQoJ3J1YnktYmxvY2suc2hvd0JvdHRvbVBhbmVsJylcbiAgICAgIEBydWJ5QmxvY2tWaWV3LnVwZGF0ZU1lc3NhZ2Uocm93TnVtYmVyKVxuICAgICAgQG1vZGFsUGFuZWwuc2hvdygpXG5cbiAgbG9hZENsYXNzZXM6IC0+XG4gICAgXyA9IHJlcXVpcmUgJ3VuZGVyc2NvcmUtcGx1cydcbiAgICBSdWJ5QmxvY2tWaWV3ID0gcmVxdWlyZSAnLi9ydWJ5LWJsb2NrLXZpZXcnXG4iXX0=
