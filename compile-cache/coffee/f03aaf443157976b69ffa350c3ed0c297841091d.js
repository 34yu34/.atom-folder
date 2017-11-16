(function() {
  var Dialog, TextEditorView, View, ref,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  ref = require('atom-space-pen-views'), TextEditorView = ref.TextEditorView, View = ref.View;

  module.exports = Dialog = (function(superClass) {
    extend(Dialog, superClass);

    function Dialog() {
      return Dialog.__super__.constructor.apply(this, arguments);
    }

    Dialog.content = function(arg) {
      var prompt;
      prompt = (arg != null ? arg : {}).prompt;
      return this.div({
        "class": 'platformio-ide-terminal-dialog'
      }, (function(_this) {
        return function() {
          _this.label(prompt, {
            "class": 'icon',
            outlet: 'promptText'
          });
          _this.subview('miniEditor', new TextEditorView({
            mini: true
          }));
          _this.label('Escape (Esc) to exit', {
            style: 'width: 50%;'
          });
          return _this.label('Enter (\u21B5) to confirm', {
            style: 'width: 50%; text-align: right;'
          });
        };
      })(this));
    };

    Dialog.prototype.initialize = function(arg) {
      var iconClass, placeholderText, ref1, stayOpen;
      ref1 = arg != null ? arg : {}, iconClass = ref1.iconClass, placeholderText = ref1.placeholderText, stayOpen = ref1.stayOpen;
      if (iconClass) {
        this.promptText.addClass(iconClass);
      }
      atom.commands.add(this.element, {
        'core:confirm': (function(_this) {
          return function() {
            return _this.onConfirm(_this.miniEditor.getText());
          };
        })(this),
        'core:cancel': (function(_this) {
          return function() {
            return _this.cancel();
          };
        })(this)
      });
      if (!stayOpen) {
        this.miniEditor.on('blur', (function(_this) {
          return function() {
            return _this.close();
          };
        })(this));
      }
      if (placeholderText) {
        this.miniEditor.getModel().setText(placeholderText);
        return this.miniEditor.getModel().selectAll();
      }
    };

    Dialog.prototype.attach = function() {
      this.panel = atom.workspace.addModalPanel({
        item: this.element
      });
      this.miniEditor.focus();
      return this.miniEditor.getModel().scrollToCursorPosition();
    };

    Dialog.prototype.close = function() {
      var panelToDestroy;
      panelToDestroy = this.panel;
      this.panel = null;
      if (panelToDestroy != null) {
        panelToDestroy.destroy();
      }
      return atom.workspace.getActivePane().activate();
    };

    Dialog.prototype.cancel = function() {
      return this.close();
    };

    return Dialog;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYmlsbHkvLmF0b20vcGFja2FnZXMvcGxhdGZvcm1pby1pZGUtdGVybWluYWwvbGliL2RpYWxvZy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLGlDQUFBO0lBQUE7OztFQUFBLE1BQXlCLE9BQUEsQ0FBUSxzQkFBUixDQUF6QixFQUFDLG1DQUFELEVBQWlCOztFQUVqQixNQUFNLENBQUMsT0FBUCxHQUNNOzs7Ozs7O0lBQ0osTUFBQyxDQUFBLE9BQUQsR0FBVSxTQUFDLEdBQUQ7QUFDUixVQUFBO01BRFUsd0JBQUQsTUFBVzthQUNwQixJQUFDLENBQUEsR0FBRCxDQUFLO1FBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTyxnQ0FBUDtPQUFMLEVBQThDLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQTtVQUM1QyxLQUFDLENBQUEsS0FBRCxDQUFPLE1BQVAsRUFBZTtZQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8sTUFBUDtZQUFlLE1BQUEsRUFBUSxZQUF2QjtXQUFmO1VBQ0EsS0FBQyxDQUFBLE9BQUQsQ0FBUyxZQUFULEVBQTJCLElBQUEsY0FBQSxDQUFlO1lBQUEsSUFBQSxFQUFNLElBQU47V0FBZixDQUEzQjtVQUNBLEtBQUMsQ0FBQSxLQUFELENBQU8sc0JBQVAsRUFBK0I7WUFBQSxLQUFBLEVBQU8sYUFBUDtXQUEvQjtpQkFDQSxLQUFDLENBQUEsS0FBRCxDQUFPLDJCQUFQLEVBQW9DO1lBQUEsS0FBQSxFQUFPLGdDQUFQO1dBQXBDO1FBSjRDO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUE5QztJQURROztxQkFPVixVQUFBLEdBQVksU0FBQyxHQUFEO0FBQ1YsVUFBQTsyQkFEVyxNQUF5QyxJQUF4Qyw0QkFBVyx3Q0FBaUI7TUFDeEMsSUFBbUMsU0FBbkM7UUFBQSxJQUFDLENBQUEsVUFBVSxDQUFDLFFBQVosQ0FBcUIsU0FBckIsRUFBQTs7TUFDQSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsSUFBQyxDQUFBLE9BQW5CLEVBQ0U7UUFBQSxjQUFBLEVBQWdCLENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUE7bUJBQUcsS0FBQyxDQUFBLFNBQUQsQ0FBVyxLQUFDLENBQUEsVUFBVSxDQUFDLE9BQVosQ0FBQSxDQUFYO1VBQUg7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWhCO1FBQ0EsYUFBQSxFQUFlLENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUE7bUJBQUcsS0FBQyxDQUFBLE1BQUQsQ0FBQTtVQUFIO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQURmO09BREY7TUFJQSxJQUFBLENBQU8sUUFBUDtRQUNFLElBQUMsQ0FBQSxVQUFVLENBQUMsRUFBWixDQUFlLE1BQWYsRUFBdUIsQ0FBQSxTQUFBLEtBQUE7aUJBQUEsU0FBQTttQkFBRyxLQUFDLENBQUEsS0FBRCxDQUFBO1VBQUg7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXZCLEVBREY7O01BR0EsSUFBRyxlQUFIO1FBQ0UsSUFBQyxDQUFBLFVBQVUsQ0FBQyxRQUFaLENBQUEsQ0FBc0IsQ0FBQyxPQUF2QixDQUErQixlQUEvQjtlQUNBLElBQUMsQ0FBQSxVQUFVLENBQUMsUUFBWixDQUFBLENBQXNCLENBQUMsU0FBdkIsQ0FBQSxFQUZGOztJQVRVOztxQkFhWixNQUFBLEdBQVEsU0FBQTtNQUNOLElBQUMsQ0FBQSxLQUFELEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFmLENBQTZCO1FBQUEsSUFBQSxFQUFNLElBQUksQ0FBQyxPQUFYO09BQTdCO01BQ1QsSUFBQyxDQUFBLFVBQVUsQ0FBQyxLQUFaLENBQUE7YUFDQSxJQUFDLENBQUEsVUFBVSxDQUFDLFFBQVosQ0FBQSxDQUFzQixDQUFDLHNCQUF2QixDQUFBO0lBSE07O3FCQUtSLEtBQUEsR0FBTyxTQUFBO0FBQ0wsVUFBQTtNQUFBLGNBQUEsR0FBaUIsSUFBQyxDQUFBO01BQ2xCLElBQUMsQ0FBQSxLQUFELEdBQVM7O1FBQ1QsY0FBYyxDQUFFLE9BQWhCLENBQUE7O2FBQ0EsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFmLENBQUEsQ0FBOEIsQ0FBQyxRQUEvQixDQUFBO0lBSks7O3FCQU1QLE1BQUEsR0FBUSxTQUFBO2FBQ04sSUFBQyxDQUFBLEtBQUQsQ0FBQTtJQURNOzs7O0tBaENXO0FBSHJCIiwic291cmNlc0NvbnRlbnQiOlsie1RleHRFZGl0b3JWaWV3LCBWaWV3fSA9IHJlcXVpcmUgJ2F0b20tc3BhY2UtcGVuLXZpZXdzJ1xuXG5tb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBEaWFsb2cgZXh0ZW5kcyBWaWV3XG4gIEBjb250ZW50OiAoe3Byb21wdH0gPSB7fSkgLT5cbiAgICBAZGl2IGNsYXNzOiAncGxhdGZvcm1pby1pZGUtdGVybWluYWwtZGlhbG9nJywgPT5cbiAgICAgIEBsYWJlbCBwcm9tcHQsIGNsYXNzOiAnaWNvbicsIG91dGxldDogJ3Byb21wdFRleHQnXG4gICAgICBAc3VidmlldyAnbWluaUVkaXRvcicsIG5ldyBUZXh0RWRpdG9yVmlldyhtaW5pOiB0cnVlKVxuICAgICAgQGxhYmVsICdFc2NhcGUgKEVzYykgdG8gZXhpdCcsIHN0eWxlOiAnd2lkdGg6IDUwJTsnXG4gICAgICBAbGFiZWwgJ0VudGVyIChcXHUyMUI1KSB0byBjb25maXJtJywgc3R5bGU6ICd3aWR0aDogNTAlOyB0ZXh0LWFsaWduOiByaWdodDsnXG5cbiAgaW5pdGlhbGl6ZTogKHtpY29uQ2xhc3MsIHBsYWNlaG9sZGVyVGV4dCwgc3RheU9wZW59ID0ge30pIC0+XG4gICAgQHByb21wdFRleHQuYWRkQ2xhc3MoaWNvbkNsYXNzKSBpZiBpY29uQ2xhc3NcbiAgICBhdG9tLmNvbW1hbmRzLmFkZCBAZWxlbWVudCxcbiAgICAgICdjb3JlOmNvbmZpcm0nOiA9PiBAb25Db25maXJtKEBtaW5pRWRpdG9yLmdldFRleHQoKSlcbiAgICAgICdjb3JlOmNhbmNlbCc6ID0+IEBjYW5jZWwoKVxuXG4gICAgdW5sZXNzIHN0YXlPcGVuXG4gICAgICBAbWluaUVkaXRvci5vbiAnYmx1cicsID0+IEBjbG9zZSgpXG5cbiAgICBpZiBwbGFjZWhvbGRlclRleHRcbiAgICAgIEBtaW5pRWRpdG9yLmdldE1vZGVsKCkuc2V0VGV4dCBwbGFjZWhvbGRlclRleHRcbiAgICAgIEBtaW5pRWRpdG9yLmdldE1vZGVsKCkuc2VsZWN0QWxsKClcblxuICBhdHRhY2g6IC0+XG4gICAgQHBhbmVsID0gYXRvbS53b3Jrc3BhY2UuYWRkTW9kYWxQYW5lbChpdGVtOiB0aGlzLmVsZW1lbnQpXG4gICAgQG1pbmlFZGl0b3IuZm9jdXMoKVxuICAgIEBtaW5pRWRpdG9yLmdldE1vZGVsKCkuc2Nyb2xsVG9DdXJzb3JQb3NpdGlvbigpXG5cbiAgY2xvc2U6IC0+XG4gICAgcGFuZWxUb0Rlc3Ryb3kgPSBAcGFuZWxcbiAgICBAcGFuZWwgPSBudWxsXG4gICAgcGFuZWxUb0Rlc3Ryb3k/LmRlc3Ryb3koKVxuICAgIGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVBhbmUoKS5hY3RpdmF0ZSgpXG5cbiAgY2FuY2VsOiAtPlxuICAgIEBjbG9zZSgpXG4iXX0=
