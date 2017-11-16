
/*
 * heavily modified from rgbkrk/atom-script - lib/script-options-view.coffee
 * https://github.com/rgbkrk/atom-script
 * https://atom.io/packages/script
 */

(function() {
  var $, CompositeDisposable, RunOptionsView, View, ref,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  CompositeDisposable = require('atom').CompositeDisposable;

  ref = require('atom-space-pen-views'), $ = ref.$, View = ref.View;

  module.exports = RunOptionsView = (function(superClass) {
    extend(RunOptionsView, superClass);

    function RunOptionsView() {
      return RunOptionsView.__super__.constructor.apply(this, arguments);
    }

    RunOptionsView.content = function() {
      return this.div({
        "class": 'run-options-view'
      }, (function(_this) {
        return function() {
          _this.div({
            "class": 'panel-heading'
          }, 'Configure Compile-Run Options');
          return _this.div({
            "class": 'panel-body'
          }, function() {
            _this.table(function() {
              _this.tr(function() {
                _this.td(function() {
                  return _this.label('Compiler Flags:');
                });
                return _this.td(function() {
                  return _this.tag('atom-text-editor', {
                    "class": 'editor mini',
                    mini: '',
                    keydown: 'traverseInputFocus',
                    outlet: 'cflags'
                  });
                });
              });
              _this.tr(function() {
                _this.td(function() {
                  return _this.label('Link Libraries:');
                });
                return _this.td(function() {
                  return _this.tag('atom-text-editor', {
                    "class": 'editor mini',
                    mini: '',
                    keydown: 'traverseInputFocus',
                    outlet: 'ldlibs'
                  });
                });
              });
              return _this.tr(function() {
                _this.td(function() {
                  return _this.label('Run Arguments:');
                });
                return _this.td(function() {
                  return _this.tag('atom-text-editor', {
                    "class": 'editor mini',
                    mini: '',
                    keydown: 'traverseInputFocus',
                    outlet: 'args'
                  });
                });
              });
            });
            return _this.div({
              "class": 'btn-group'
            }, function() {
              _this.button({
                "class": 'btn btn-primary',
                click: 'run',
                keydown: 'traverseButtonFocus',
                outlet: 'buttonRun'
              }, function() {
                return _this.span({
                  "class": 'icon icon-playback-play'
                }, 'Run');
              });
              _this.button({
                "class": 'btn',
                click: 'rebuild',
                keydown: 'traverseButtonFocus'
              }, function() {
                return _this.span({
                  "class": 'icon icon-sync'
                }, 'Rebuild');
              });
              _this.button({
                "class": 'btn',
                click: 'save',
                keydown: 'traverseButtonFocus'
              }, function() {
                return _this.span({
                  "class": 'icon icon-clippy'
                }, 'Save');
              });
              return _this.button({
                "class": 'btn',
                click: 'cancel',
                keydown: 'traverseButtonFocus',
                outlet: 'buttonCancel'
              }, function() {
                return _this.span({
                  "class": 'icon icon-x'
                }, 'Cancel');
              });
            });
          });
        };
      })(this));
    };

    RunOptionsView.prototype.initialize = function(main) {
      this.main = main;
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'core:cancel': (function(_this) {
          return function() {
            return _this.hideRunOptions();
          };
        })(this),
        'core:close': (function(_this) {
          return function() {
            return _this.hideRunOptions();
          };
        })(this),
        'gcc-make-run:compile-run': (function(_this) {
          return function() {
            return _this.hideRunOptions(true);
          };
        })(this),
        'gcc-make-run:run-options': (function(_this) {
          return function() {
            return _this.showRunOptions();
          };
        })(this)
      }));
      this.runOptionsPanel = atom.workspace.addModalPanel({
        item: this,
        visible: false
      });
      $('atom-workspace').click((function(_this) {
        return function() {
          return _this.hideRunOptions();
        };
      })(this));
      this.mousedown(function(e) {
        if (e.target.classList.contains('editor')) {
          e.target.focus();
        }
        return e.preventDefault();
      });
      return this.click(function(e) {
        return e.stopPropagation();
      });
    };

    RunOptionsView.prototype.destroy = function() {
      var ref1, ref2;
      if ((ref1 = this.runOptionsPanel) != null) {
        ref1.destroy();
      }
      return (ref2 = this.subscriptions) != null ? ref2.dispose() : void 0;
    };

    RunOptionsView.prototype.showRunOptions = function() {
      if (this.runOptionsPanel.isVisible()) {
        return;
      }
      this.restoreOptions();
      this.runOptionsPanel.show();
      return this.cflags.focus();
    };

    RunOptionsView.prototype.hideRunOptions = function(shouldSave) {
      if (!this.runOptionsPanel.isVisible()) {
        return;
      }
      this.runOptionsPanel.hide();
      if (shouldSave) {
        return this.saveOptions();
      }
    };

    RunOptionsView.prototype.restoreOptions = function() {
      var cfg, cfgs, i, len, results;
      cfgs = ['cflags', 'ldlibs', 'args'];
      results = [];
      for (i = 0, len = cfgs.length; i < len; i++) {
        cfg = cfgs[i];
        results.push(this[cfg].get(0).model.setText(atom.config.get("gcc-make-run." + cfg)));
      }
      return results;
    };

    RunOptionsView.prototype.saveOptions = function() {
      var cfg, cfgs, i, len, results;
      cfgs = ['cflags', 'ldlibs', 'args'];
      results = [];
      for (i = 0, len = cfgs.length; i < len; i++) {
        cfg = cfgs[i];
        results.push(atom.config.set("gcc-make-run." + cfg, this[cfg].get(0).model.getText()));
      }
      return results;
    };

    RunOptionsView.prototype.run = function() {
      this.hideRunOptions(true);
      return atom.commands.dispatch(this.workspaceView(), 'gcc-make-run:compile-run');
    };

    RunOptionsView.prototype.rebuild = function() {
      this.hideRunOptions(true);
      this.main.oneTimeBuild = true;
      return atom.commands.dispatch(this.workspaceView(), 'gcc-make-run:compile-run');
    };

    RunOptionsView.prototype.save = function() {
      this.hideRunOptions(true);
      return atom.notifications.addSuccess('Run Options Saved');
    };

    RunOptionsView.prototype.cancel = function() {
      return this.hideRunOptions();
    };

    RunOptionsView.prototype.traverseInputFocus = function(e) {
      var row;
      switch (e.keyCode) {
        case 9:
          e.preventDefault();
          row = this.find(e.target).parents('tr:first')[e.shiftKey ? 'prevAll' : 'nextAll']('tr:first');
          if (row.length) {
            row.find('atom-text-editor').focus();
          } else {
            if (e.shiftKey) {
              this.buttonCancel.focus();
            } else {
              this.buttonRun.focus();
            }
          }
          break;
        case 13:
          this.buttonRun.click();
      }
      return true;
    };

    RunOptionsView.prototype.traverseButtonFocus = function(e) {
      switch (e.keyCode) {
        case 9:
          if (!e.shiftKey && e.target === this.buttonCancel.context) {
            this.cflags.focus();
            return false;
          } else if (e.shiftKey && e.target === this.buttonRun.context) {
            this.args.focus();
            return false;
          }
          break;
        case 13:
          e.target.click();
      }
      return true;
    };

    RunOptionsView.prototype.workspaceView = function() {
      return atom.views.getView(atom.workspace);
    };

    return RunOptionsView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYmlsbHkvLmF0b20vcGFja2FnZXMvZ2NjLW1ha2UtcnVuL2xpYi9nY2MtbWFrZS1ydW4tdmlldy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7QUFBQTtBQUFBLE1BQUEsaURBQUE7SUFBQTs7O0VBTUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSOztFQUN4QixNQUFZLE9BQUEsQ0FBUSxzQkFBUixDQUFaLEVBQUMsU0FBRCxFQUFJOztFQUVKLE1BQU0sQ0FBQyxPQUFQLEdBQ007Ozs7Ozs7SUFFSixjQUFDLENBQUEsT0FBRCxHQUFVLFNBQUE7YUFDUixJQUFDLENBQUEsR0FBRCxDQUFLO1FBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTyxrQkFBUDtPQUFMLEVBQWdDLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQTtVQUM5QixLQUFDLENBQUEsR0FBRCxDQUFLO1lBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTyxlQUFQO1dBQUwsRUFBNkIsK0JBQTdCO2lCQUNBLEtBQUMsQ0FBQSxHQUFELENBQUs7WUFBQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLFlBQVA7V0FBTCxFQUEwQixTQUFBO1lBQ3hCLEtBQUMsQ0FBQSxLQUFELENBQU8sU0FBQTtjQUNMLEtBQUMsQ0FBQSxFQUFELENBQUksU0FBQTtnQkFDRixLQUFDLENBQUEsRUFBRCxDQUFJLFNBQUE7eUJBQUcsS0FBQyxDQUFBLEtBQUQsQ0FBTyxpQkFBUDtnQkFBSCxDQUFKO3VCQUNBLEtBQUMsQ0FBQSxFQUFELENBQUksU0FBQTt5QkFBRyxLQUFDLENBQUEsR0FBRCxDQUFLLGtCQUFMLEVBQXlCO29CQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8sYUFBUDtvQkFBc0IsSUFBQSxFQUFNLEVBQTVCO29CQUFnQyxPQUFBLEVBQVMsb0JBQXpDO29CQUErRCxNQUFBLEVBQVEsUUFBdkU7bUJBQXpCO2dCQUFILENBQUo7Y0FGRSxDQUFKO2NBR0EsS0FB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QUFuQjthQUFBLE1BQUE7Y0FBOEMsSUFBQyxDQUFBLFNBQVMsQ0FBQyxLQUFYLENBQUEsRUFBOUM7YUFKRjs7QUFMRztBQUZQLGFBYU8sRUFiUDtVQWFlLElBQUMsQ0FBQSxTQUFTLENBQUMsS0FBWCxDQUFBO0FBYmY7QUFlQSxhQUFPO0lBaEJXOzs2QkFrQnBCLG1CQUFBLEdBQXFCLFNBQUMsQ0FBRDtBQUNuQixjQUFPLENBQUMsQ0FBQyxPQUFUO0FBQUEsYUFDTyxDQURQO1VBR0ksSUFBRyxDQUFDLENBQUMsQ0FBQyxRQUFILElBQWUsQ0FBQyxDQUFDLE1BQUYsS0FBWSxJQUFDLENBQUEsWUFBWSxDQUFDLE9BQTVDO1lBQ0UsSUFBQyxDQUFBLE1BQU0sQ0FBQyxLQUFSLENBQUE7QUFDQSxtQkFBTyxNQUZUO1dBQUEsTUFJSyxJQUFHLENBQUMsQ0FBQyxRQUFGLElBQWMsQ0FBQyxDQUFDLE1BQUYsS0FBWSxJQUFDLENBQUEsU0FBUyxDQUFDLE9BQXhDO1lBQ0gsSUFBQyxDQUFBLElBQUksQ0FBQyxLQUFOLENBQUE7QUFDQSxtQkFBTyxNQUZKOztBQU5GO0FBRFAsYUFXTyxFQVhQO1VBV2UsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFULENBQUE7QUFYZjtBQWFBLGFBQU87SUFkWTs7NkJBZ0JyQixhQUFBLEdBQWUsU0FBQTthQUNiLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBWCxDQUFtQixJQUFJLENBQUMsU0FBeEI7SUFEYTs7OztLQXRIWTtBQVY3QiIsInNvdXJjZXNDb250ZW50IjpbIiMjI1xuIyBoZWF2aWx5IG1vZGlmaWVkIGZyb20gcmdia3JrL2F0b20tc2NyaXB0IC0gbGliL3NjcmlwdC1vcHRpb25zLXZpZXcuY29mZmVlXG4jIGh0dHBzOi8vZ2l0aHViLmNvbS9yZ2JrcmsvYXRvbS1zY3JpcHRcbiMgaHR0cHM6Ly9hdG9tLmlvL3BhY2thZ2VzL3NjcmlwdFxuIyMjXG5cbntDb21wb3NpdGVEaXNwb3NhYmxlfSA9IHJlcXVpcmUgJ2F0b20nXG57JCwgVmlld30gPSByZXF1aXJlICdhdG9tLXNwYWNlLXBlbi12aWV3cydcblxubW9kdWxlLmV4cG9ydHMgPVxuY2xhc3MgUnVuT3B0aW9uc1ZpZXcgZXh0ZW5kcyBWaWV3XG5cbiAgQGNvbnRlbnQ6IC0+XG4gICAgQGRpdiBjbGFzczogJ3J1bi1vcHRpb25zLXZpZXcnLCA9PlxuICAgICAgQGRpdiBjbGFzczogJ3BhbmVsLWhlYWRpbmcnLCAnQ29uZmlndXJlIENvbXBpbGUtUnVuIE9wdGlvbnMnXG4gICAgICBAZGl2IGNsYXNzOiAncGFuZWwtYm9keScsID0+XG4gICAgICAgIEB0YWJsZSA9PlxuICAgICAgICAgIEB0ciA9PlxuICAgICAgICAgICAgQHRkID0+IEBsYWJlbCAnQ29tcGlsZXIgRmxhZ3M6J1xuICAgICAgICAgICAgQHRkID0+IEB0YWcgJ2F0b20tdGV4dC1lZGl0b3InLCBjbGFzczogJ2VkaXRvciBtaW5pJywgbWluaTogJycsIGtleWRvd246ICd0cmF2ZXJzZUlucHV0Rm9jdXMnLCBvdXRsZXQ6ICdjZmxhZ3MnXG4gICAgICAgICAgQHRyID0+XG4gICAgICAgICAgICBAdGQgPT4gQGxhYmVsICdMaW5rIExpYnJhcmllczonXG4gICAgICAgICAgICBAdGQgPT4gQHRhZyAnYXRvbS10ZXh0LWVkaXRvcicsIGNsYXNzOiAnZWRpdG9yIG1pbmknLCBtaW5pOiAnJywga2V5ZG93bjogJ3RyYXZlcnNlSW5wdXRGb2N1cycsIG91dGxldDogJ2xkbGlicydcbiAgICAgICAgICBAdHIgPT5cbiAgICAgICAgICAgIEB0ZCA9PiBAbGFiZWwgJ1J1biBBcmd1bWVudHM6J1xuICAgICAgICAgICAgQHRkID0+IEB0YWcgJ2F0b20tdGV4dC1lZGl0b3InLCBjbGFzczogJ2VkaXRvciBtaW5pJywgbWluaTogJycsIGtleWRvd246ICd0cmF2ZXJzZUlucHV0Rm9jdXMnLCBvdXRsZXQ6ICdhcmdzJ1xuICAgICAgICBAZGl2IGNsYXNzOiAnYnRuLWdyb3VwJywgPT5cbiAgICAgICAgICBAYnV0dG9uIGNsYXNzOiAnYnRuIGJ0bi1wcmltYXJ5JywgY2xpY2s6ICdydW4nLCBrZXlkb3duOiAndHJhdmVyc2VCdXR0b25Gb2N1cycsIG91dGxldDogJ2J1dHRvblJ1bicsID0+XG4gICAgICAgICAgICBAc3BhbiBjbGFzczogJ2ljb24gaWNvbi1wbGF5YmFjay1wbGF5JywgJ1J1bidcbiAgICAgICAgICBAYnV0dG9uIGNsYXNzOiAnYnRuJywgY2xpY2s6ICdyZWJ1aWxkJywga2V5ZG93bjogJ3RyYXZlcnNlQnV0dG9uRm9jdXMnLCA9PlxuICAgICAgICAgICAgQHNwYW4gY2xhc3M6ICdpY29uIGljb24tc3luYycsICdSZWJ1aWxkJ1xuICAgICAgICAgIEBidXR0b24gY2xhc3M6ICdidG4nLCBjbGljazogJ3NhdmUnLCBrZXlkb3duOiAndHJhdmVyc2VCdXR0b25Gb2N1cycsID0+XG4gICAgICAgICAgICBAc3BhbiBjbGFzczogJ2ljb24gaWNvbi1jbGlwcHknLCAnU2F2ZSdcbiAgICAgICAgICBAYnV0dG9uIGNsYXNzOiAnYnRuJywgY2xpY2s6ICdjYW5jZWwnLCBrZXlkb3duOiAndHJhdmVyc2VCdXR0b25Gb2N1cycsIG91dGxldDogJ2J1dHRvbkNhbmNlbCcsID0+XG4gICAgICAgICAgICBAc3BhbiBjbGFzczogJ2ljb24gaWNvbi14JywgJ0NhbmNlbCdcblxuICBpbml0aWFsaXplOiAoQG1haW4pIC0+XG4gICAgIyBvYnNlcnZlIHNob3J0Y3V0XG4gICAgQHN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZVxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS13b3Jrc3BhY2UnLFxuICAgICAgJ2NvcmU6Y2FuY2VsJzogPT4gQGhpZGVSdW5PcHRpb25zKClcbiAgICAgICdjb3JlOmNsb3NlJzogPT4gQGhpZGVSdW5PcHRpb25zKClcbiAgICAgICdnY2MtbWFrZS1ydW46Y29tcGlsZS1ydW4nOiA9PiBAaGlkZVJ1bk9wdGlvbnModHJ1ZSlcbiAgICAgICdnY2MtbWFrZS1ydW46cnVuLW9wdGlvbnMnOiA9PiBAc2hvd1J1bk9wdGlvbnMoKVxuXG4gICAgIyBhZGQgbW9kYWwgcGFuZWxcbiAgICBAcnVuT3B0aW9uc1BhbmVsID0gYXRvbS53b3Jrc3BhY2UuYWRkTW9kYWxQYW5lbChpdGVtOiBALCB2aXNpYmxlOiBmYWxzZSlcblxuICAgICMgaGlkZSBwYW5lbCB3aGVuIGNsaWNrIG91dHNpZGVcbiAgICAkKCdhdG9tLXdvcmtzcGFjZScpLmNsaWNrID0+IEBoaWRlUnVuT3B0aW9ucygpXG4gICAgQC5tb3VzZWRvd24gKGUpIC0+XG4gICAgICBlLnRhcmdldC5mb2N1cygpIGlmIGUudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnZWRpdG9yJylcbiAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgIEAuY2xpY2sgKGUpIC0+IGUuc3RvcFByb3BhZ2F0aW9uKClcblxuICBkZXN0cm95OiAtPlxuICAgIEBydW5PcHRpb25zUGFuZWw/LmRlc3Ryb3koKVxuICAgIEBzdWJzY3JpcHRpb25zPy5kaXNwb3NlKClcblxuICBzaG93UnVuT3B0aW9uczogLT5cbiAgICByZXR1cm4gaWYgQHJ1bk9wdGlvbnNQYW5lbC5pc1Zpc2libGUoKVxuICAgIEByZXN0b3JlT3B0aW9ucygpXG4gICAgQHJ1bk9wdGlvbnNQYW5lbC5zaG93KClcbiAgICBAY2ZsYWdzLmZvY3VzKClcblxuICBoaWRlUnVuT3B0aW9uczogKHNob3VsZFNhdmUpIC0+XG4gICAgcmV0dXJuIHVubGVzcyBAcnVuT3B0aW9uc1BhbmVsLmlzVmlzaWJsZSgpXG4gICAgQHJ1bk9wdGlvbnNQYW5lbC5oaWRlKClcbiAgICBAc2F2ZU9wdGlvbnMoKSBpZiBzaG91bGRTYXZlXG5cbiAgcmVzdG9yZU9wdGlvbnM6IC0+XG4gICAgY2ZncyA9IFsnY2ZsYWdzJywgJ2xkbGlicycsICdhcmdzJ11cbiAgICBAW2NmZ10uZ2V0KDApLm1vZGVsLnNldFRleHQoYXRvbS5jb25maWcuZ2V0KFwiZ2NjLW1ha2UtcnVuLiN7Y2ZnfVwiKSkgZm9yIGNmZyBpbiBjZmdzXG5cbiAgc2F2ZU9wdGlvbnM6IC0+XG4gICAgY2ZncyA9IFsnY2ZsYWdzJywgJ2xkbGlicycsICdhcmdzJ11cbiAgICBhdG9tLmNvbmZpZy5zZXQoXCJnY2MtbWFrZS1ydW4uI3tjZmd9XCIsIEBbY2ZnXS5nZXQoMCkubW9kZWwuZ2V0VGV4dCgpKSBmb3IgY2ZnIGluIGNmZ3NcblxuICBydW46IC0+XG4gICAgQGhpZGVSdW5PcHRpb25zKHRydWUpXG4gICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaCBAd29ya3NwYWNlVmlldygpLCAnZ2NjLW1ha2UtcnVuOmNvbXBpbGUtcnVuJ1xuXG4gIHJlYnVpbGQ6IC0+XG4gICAgQGhpZGVSdW5PcHRpb25zKHRydWUpXG4gICAgQG1haW4ub25lVGltZUJ1aWxkID0gdHJ1ZVxuICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2ggQHdvcmtzcGFjZVZpZXcoKSwgJ2djYy1tYWtlLXJ1bjpjb21waWxlLXJ1bidcblxuICBzYXZlOiAtPlxuICAgIEBoaWRlUnVuT3B0aW9ucyh0cnVlKVxuICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRTdWNjZXNzKCdSdW4gT3B0aW9ucyBTYXZlZCcpXG5cbiAgY2FuY2VsOiAtPlxuICAgIEBoaWRlUnVuT3B0aW9ucygpXG5cbiAgdHJhdmVyc2VJbnB1dEZvY3VzOiAoZSkgLT5cbiAgICBzd2l0Y2ggZS5rZXlDb2RlXG4gICAgICAjIHByZXNzIHRhYiBrZXkgc2hvdWxkIGNoYW5nZSBmb2N1c1xuICAgICAgd2hlbiA5XG4gICAgICAgICMgc3RvcCBkZWZhdWx0IHByb3BhZ2F0aW9uXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgICAjIGZpbmQgbmV4dC9wcmV2IGlucHV0IGJveCB0byBmb2N1c1xuICAgICAgICByb3cgPSBAZmluZChlLnRhcmdldCkucGFyZW50cygndHI6Zmlyc3QnKVtpZiBlLnNoaWZ0S2V5IHRoZW4gJ3ByZXZBbGwnIGVsc2UgJ25leHRBbGwnXSgndHI6Zmlyc3QnKVxuICAgICAgICBpZiByb3cubGVuZ3RoXG4gICAgICAgICAgcm93LmZpbmQoJ2F0b20tdGV4dC1lZGl0b3InKS5mb2N1cygpXG4gICAgICAgICMgZm9jdXMgcnVuIG9yIGNsb3NlIGJ1dHRvbiBpZiBubyBpbnB1dCBib3ggY2FuIGJlIGZvdW5kXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBpZiBlLnNoaWZ0S2V5IHRoZW4gQGJ1dHRvbkNhbmNlbC5mb2N1cygpIGVsc2UgQGJ1dHRvblJ1bi5mb2N1cygpXG4gICAgICAjIGVudGVyIGtleVxuICAgICAgd2hlbiAxMyB0aGVuIEBidXR0b25SdW4uY2xpY2soKVxuICAgICMgb3RoZXJ3aXNlIGlnbm9yZVxuICAgIHJldHVybiB0cnVlXG5cbiAgdHJhdmVyc2VCdXR0b25Gb2N1czogKGUpIC0+XG4gICAgc3dpdGNoIGUua2V5Q29kZVxuICAgICAgd2hlbiA5XG4gICAgICAgICMgcHJlc3MgdGFiIG9uIGNsb3NlIGJ1dHRvbiBzaG91bGQgZm9jdXMgdGhlIGZpcnN0IGlucHV0IGJveFxuICAgICAgICBpZiAhZS5zaGlmdEtleSAmJiBlLnRhcmdldCA9PSBAYnV0dG9uQ2FuY2VsLmNvbnRleHRcbiAgICAgICAgICBAY2ZsYWdzLmZvY3VzKClcbiAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgIyBwcmVzcyBzaGlmdCB0YWIgb24gcnVuIGJ1dHRvbiBzaG91bGQgZm9jdXMgdGhlIGxhc3QgaW5wdXQgYm94XG4gICAgICAgIGVsc2UgaWYgZS5zaGlmdEtleSAmJiBlLnRhcmdldCA9PSBAYnV0dG9uUnVuLmNvbnRleHRcbiAgICAgICAgICBAYXJncy5mb2N1cygpXG4gICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAjIGVtdWxhdGUgYnV0dG9uIGNsaWNrIHdoZW4gcHJlc3NpbmcgZW50ZXIga2V5XG4gICAgICB3aGVuIDEzIHRoZW4gZS50YXJnZXQuY2xpY2soKVxuICAgICMgb3RoZXJ3aXNlIGlnbm9yZVxuICAgIHJldHVybiB0cnVlXG5cbiAgd29ya3NwYWNlVmlldzogLT5cbiAgICBhdG9tLnZpZXdzLmdldFZpZXcoYXRvbS53b3Jrc3BhY2UpXG4iXX0=
