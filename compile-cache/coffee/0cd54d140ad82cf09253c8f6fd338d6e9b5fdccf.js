
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
        var target;
        target = e.target;
        while (target !== this) {
          if (target.classList.contains('editor')) {
            target.focus();
            break;
          }
          target = target.parentNode;
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
        results.push(this[cfg].get(0).getModel().setText(atom.config.get("gcc-make-run." + cfg)));
      }
      return results;
    };

    RunOptionsView.prototype.saveOptions = function() {
      var cfg, cfgs, i, len, results;
      cfgs = ['cflags', 'ldlibs', 'args'];
      results = [];
      for (i = 0, len = cfgs.length; i < len; i++) {
        cfg = cfgs[i];
        results.push(atom.config.set("gcc-make-run." + cfg, this[cfg].get(0).getModel().getText()));
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYmlsbHkvLmF0b20vcGFja2FnZXMvZ2NjLW1ha2UtcnVuL2xpYi9nY2MtbWFrZS1ydW4tdmlldy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7QUFBQTtBQUFBLE1BQUEsaURBQUE7SUFBQTs7O0VBTUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSOztFQUN4QixNQUFZLE9BQUEsQ0FBUSxzQkFBUixDQUFaLEVBQUMsU0FBRCxFQUFJOztFQUVKLE1BQU0sQ0FBQyxPQUFQLEdBQ007Ozs7Ozs7SUFFSixjQUFDLENBQUEsT0FBRCxHQUFVLFNBQUE7YUFDUixJQUFDLENBQUEsR0FBRCxDQUFLO1FBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTyxrQkFBUDtPQUFMLEVBQWdDLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQTtVQUM5QixLQUFDLENBQUEsR0FBRCxDQUFLO1lBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTyxlQUFQO1dBQUwsRUFBNkIsK0JBQTdCO2lCQUNBLEtBQUMsQ0FBQSxHQUFELENBQUs7WUFBQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLFlBQVA7V0FBTCxFQUEwQixTQUFBO1lBQ3hCLEtBQUMsQ0FBQSxLQUFELENBQU8sU0FBQTtjQUNMLEtBQUMsQ0FBQSxFQUFELENBQUksU0FBQTtnQkFDRixLQUFDLENBQUEsRUFBRCxDQUFJLFNBQUE7eUJBQUcsS0FBQyxDQUFBLEtBQUQsQ0FBTyxpQkFBUDtnQkFBSCxDQUFKO3VCQUNBLEtBQUMsQ0FBQSxFQUFELENBQUksU0FBQTt5QkFBRyxLQUFDLENBQUEsR0FBRCxDQUFLLGtCQUFMLEVBQXlCO29CQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8sYUFBUDtvQkFBc0IsSUFBQSxFQUFNLEVBQTVCO29CQUFnQyxPQUFBLEVBQVMsb0JBQXpDO29CQUErRCxNQUFBLEVBQVEsUUFBdkU7bUJBQXpCO2dCQUFILENBQUo7Y0FGRSxDQUFKO2NBR0EsS0FB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QUE0QixDQUFDLEtBQTdCLENBQUEsRUFERjtXQUFBLE1BQUE7WUFJRSxJQUFHLENBQUMsQ0FBQyxRQUFMO2NBQW1CLElBQUMsQ0FBQSxZQUFZLENBQUMsS0FBZCxDQUFBLEVBQW5CO2FBQUEsTUFBQTtjQUE4QyxJQUFDLENBQUEsU0FBUyxDQUFDLEtBQVgsQ0FBQSxFQUE5QzthQUpGOztBQUxHO0FBRlAsYUFhTyxFQWJQO1VBYWUsSUFBQyxDQUFBLFNBQVMsQ0FBQyxLQUFYLENBQUE7QUFiZjtBQWVBLGFBQU87SUFoQlc7OzZCQWtCcEIsbUJBQUEsR0FBcUIsU0FBQyxDQUFEO0FBQ25CLGNBQU8sQ0FBQyxDQUFDLE9BQVQ7QUFBQSxhQUNPLENBRFA7VUFHSSxJQUFHLENBQUMsQ0FBQyxDQUFDLFFBQUgsSUFBZSxDQUFDLENBQUMsTUFBRixLQUFZLElBQUMsQ0FBQSxZQUFZLENBQUMsT0FBNUM7WUFDRSxJQUFDLENBQUEsTUFBTSxDQUFDLEtBQVIsQ0FBQTtBQUNBLG1CQUFPLE1BRlQ7V0FBQSxNQUlLLElBQUcsQ0FBQyxDQUFDLFFBQUYsSUFBYyxDQUFDLENBQUMsTUFBRixLQUFZLElBQUMsQ0FBQSxTQUFTLENBQUMsT0FBeEM7WUFDSCxJQUFDLENBQUEsSUFBSSxDQUFDLEtBQU4sQ0FBQTtBQUNBLG1CQUFPLE1BRko7O0FBTkY7QUFEUCxhQVdPLEVBWFA7VUFXZSxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQVQsQ0FBQTtBQVhmO0FBYUEsYUFBTztJQWRZOzs2QkFnQnJCLGFBQUEsR0FBZSxTQUFBO2FBQ2IsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFYLENBQW1CLElBQUksQ0FBQyxTQUF4QjtJQURhOzs7O0tBM0hZO0FBVjdCIiwic291cmNlc0NvbnRlbnQiOlsiIyMjXG4jIGhlYXZpbHkgbW9kaWZpZWQgZnJvbSByZ2JrcmsvYXRvbS1zY3JpcHQgLSBsaWIvc2NyaXB0LW9wdGlvbnMtdmlldy5jb2ZmZWVcbiMgaHR0cHM6Ly9naXRodWIuY29tL3JnYmtyay9hdG9tLXNjcmlwdFxuIyBodHRwczovL2F0b20uaW8vcGFja2FnZXMvc2NyaXB0XG4jIyNcblxue0NvbXBvc2l0ZURpc3Bvc2FibGV9ID0gcmVxdWlyZSAnYXRvbSdcbnskLCBWaWV3fSA9IHJlcXVpcmUgJ2F0b20tc3BhY2UtcGVuLXZpZXdzJ1xuXG5tb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBSdW5PcHRpb25zVmlldyBleHRlbmRzIFZpZXdcblxuICBAY29udGVudDogLT5cbiAgICBAZGl2IGNsYXNzOiAncnVuLW9wdGlvbnMtdmlldycsID0+XG4gICAgICBAZGl2IGNsYXNzOiAncGFuZWwtaGVhZGluZycsICdDb25maWd1cmUgQ29tcGlsZS1SdW4gT3B0aW9ucydcbiAgICAgIEBkaXYgY2xhc3M6ICdwYW5lbC1ib2R5JywgPT5cbiAgICAgICAgQHRhYmxlID0+XG4gICAgICAgICAgQHRyID0+XG4gICAgICAgICAgICBAdGQgPT4gQGxhYmVsICdDb21waWxlciBGbGFnczonXG4gICAgICAgICAgICBAdGQgPT4gQHRhZyAnYXRvbS10ZXh0LWVkaXRvcicsIGNsYXNzOiAnZWRpdG9yIG1pbmknLCBtaW5pOiAnJywga2V5ZG93bjogJ3RyYXZlcnNlSW5wdXRGb2N1cycsIG91dGxldDogJ2NmbGFncydcbiAgICAgICAgICBAdHIgPT5cbiAgICAgICAgICAgIEB0ZCA9PiBAbGFiZWwgJ0xpbmsgTGlicmFyaWVzOidcbiAgICAgICAgICAgIEB0ZCA9PiBAdGFnICdhdG9tLXRleHQtZWRpdG9yJywgY2xhc3M6ICdlZGl0b3IgbWluaScsIG1pbmk6ICcnLCBrZXlkb3duOiAndHJhdmVyc2VJbnB1dEZvY3VzJywgb3V0bGV0OiAnbGRsaWJzJ1xuICAgICAgICAgIEB0ciA9PlxuICAgICAgICAgICAgQHRkID0+IEBsYWJlbCAnUnVuIEFyZ3VtZW50czonXG4gICAgICAgICAgICBAdGQgPT4gQHRhZyAnYXRvbS10ZXh0LWVkaXRvcicsIGNsYXNzOiAnZWRpdG9yIG1pbmknLCBtaW5pOiAnJywga2V5ZG93bjogJ3RyYXZlcnNlSW5wdXRGb2N1cycsIG91dGxldDogJ2FyZ3MnXG4gICAgICAgIEBkaXYgY2xhc3M6ICdidG4tZ3JvdXAnLCA9PlxuICAgICAgICAgIEBidXR0b24gY2xhc3M6ICdidG4gYnRuLXByaW1hcnknLCBjbGljazogJ3J1bicsIGtleWRvd246ICd0cmF2ZXJzZUJ1dHRvbkZvY3VzJywgb3V0bGV0OiAnYnV0dG9uUnVuJywgPT5cbiAgICAgICAgICAgIEBzcGFuIGNsYXNzOiAnaWNvbiBpY29uLXBsYXliYWNrLXBsYXknLCAnUnVuJ1xuICAgICAgICAgIEBidXR0b24gY2xhc3M6ICdidG4nLCBjbGljazogJ3JlYnVpbGQnLCBrZXlkb3duOiAndHJhdmVyc2VCdXR0b25Gb2N1cycsID0+XG4gICAgICAgICAgICBAc3BhbiBjbGFzczogJ2ljb24gaWNvbi1zeW5jJywgJ1JlYnVpbGQnXG4gICAgICAgICAgQGJ1dHRvbiBjbGFzczogJ2J0bicsIGNsaWNrOiAnc2F2ZScsIGtleWRvd246ICd0cmF2ZXJzZUJ1dHRvbkZvY3VzJywgPT5cbiAgICAgICAgICAgIEBzcGFuIGNsYXNzOiAnaWNvbiBpY29uLWNsaXBweScsICdTYXZlJ1xuICAgICAgICAgIEBidXR0b24gY2xhc3M6ICdidG4nLCBjbGljazogJ2NhbmNlbCcsIGtleWRvd246ICd0cmF2ZXJzZUJ1dHRvbkZvY3VzJywgb3V0bGV0OiAnYnV0dG9uQ2FuY2VsJywgPT5cbiAgICAgICAgICAgIEBzcGFuIGNsYXNzOiAnaWNvbiBpY29uLXgnLCAnQ2FuY2VsJ1xuXG4gIGluaXRpYWxpemU6IChAbWFpbikgLT5cbiAgICAjIG9ic2VydmUgc2hvcnRjdXRcbiAgICBAc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29tbWFuZHMuYWRkICdhdG9tLXdvcmtzcGFjZScsXG4gICAgICAnY29yZTpjYW5jZWwnOiA9PiBAaGlkZVJ1bk9wdGlvbnMoKVxuICAgICAgJ2NvcmU6Y2xvc2UnOiA9PiBAaGlkZVJ1bk9wdGlvbnMoKVxuICAgICAgJ2djYy1tYWtlLXJ1bjpjb21waWxlLXJ1bic6ID0+IEBoaWRlUnVuT3B0aW9ucyh0cnVlKVxuICAgICAgJ2djYy1tYWtlLXJ1bjpydW4tb3B0aW9ucyc6ID0+IEBzaG93UnVuT3B0aW9ucygpXG5cbiAgICAjIGFkZCBtb2RhbCBwYW5lbFxuICAgIEBydW5PcHRpb25zUGFuZWwgPSBhdG9tLndvcmtzcGFjZS5hZGRNb2RhbFBhbmVsKGl0ZW06IEAsIHZpc2libGU6IGZhbHNlKVxuXG4gICAgIyBoaWRlIHBhbmVsIHdoZW4gY2xpY2sgb3V0c2lkZVxuICAgICQoJ2F0b20td29ya3NwYWNlJykuY2xpY2sgPT4gQGhpZGVSdW5PcHRpb25zKClcbiAgICBALm1vdXNlZG93biAoZSkgLT5cbiAgICAgIHRhcmdldCA9IGUudGFyZ2V0XG4gICAgICB3aGlsZSB0YXJnZXQgIT0gQFxuICAgICAgICBpZiB0YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdlZGl0b3InKVxuICAgICAgICAgIHRhcmdldC5mb2N1cygpXG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgdGFyZ2V0ID0gdGFyZ2V0LnBhcmVudE5vZGVcbiAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgIEAuY2xpY2sgKGUpIC0+IGUuc3RvcFByb3BhZ2F0aW9uKClcblxuICBkZXN0cm95OiAtPlxuICAgIEBydW5PcHRpb25zUGFuZWw/LmRlc3Ryb3koKVxuICAgIEBzdWJzY3JpcHRpb25zPy5kaXNwb3NlKClcblxuICBzaG93UnVuT3B0aW9uczogLT5cbiAgICByZXR1cm4gaWYgQHJ1bk9wdGlvbnNQYW5lbC5pc1Zpc2libGUoKVxuICAgIEByZXN0b3JlT3B0aW9ucygpXG4gICAgQHJ1bk9wdGlvbnNQYW5lbC5zaG93KClcbiAgICBAY2ZsYWdzLmZvY3VzKClcblxuICBoaWRlUnVuT3B0aW9uczogKHNob3VsZFNhdmUpIC0+XG4gICAgcmV0dXJuIHVubGVzcyBAcnVuT3B0aW9uc1BhbmVsLmlzVmlzaWJsZSgpXG4gICAgQHJ1bk9wdGlvbnNQYW5lbC5oaWRlKClcbiAgICBAc2F2ZU9wdGlvbnMoKSBpZiBzaG91bGRTYXZlXG5cbiAgcmVzdG9yZU9wdGlvbnM6IC0+XG4gICAgY2ZncyA9IFsnY2ZsYWdzJywgJ2xkbGlicycsICdhcmdzJ11cbiAgICBAW2NmZ10uZ2V0KDApLmdldE1vZGVsKCkuc2V0VGV4dChhdG9tLmNvbmZpZy5nZXQoXCJnY2MtbWFrZS1ydW4uI3tjZmd9XCIpKSBmb3IgY2ZnIGluIGNmZ3NcblxuICBzYXZlT3B0aW9uczogLT5cbiAgICBjZmdzID0gWydjZmxhZ3MnLCAnbGRsaWJzJywgJ2FyZ3MnXVxuICAgIGF0b20uY29uZmlnLnNldChcImdjYy1tYWtlLXJ1bi4je2NmZ31cIiwgQFtjZmddLmdldCgwKS5nZXRNb2RlbCgpLmdldFRleHQoKSkgZm9yIGNmZyBpbiBjZmdzXG5cbiAgcnVuOiAtPlxuICAgIEBoaWRlUnVuT3B0aW9ucyh0cnVlKVxuICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2ggQHdvcmtzcGFjZVZpZXcoKSwgJ2djYy1tYWtlLXJ1bjpjb21waWxlLXJ1bidcblxuICByZWJ1aWxkOiAtPlxuICAgIEBoaWRlUnVuT3B0aW9ucyh0cnVlKVxuICAgIEBtYWluLm9uZVRpbWVCdWlsZCA9IHRydWVcbiAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoIEB3b3Jrc3BhY2VWaWV3KCksICdnY2MtbWFrZS1ydW46Y29tcGlsZS1ydW4nXG5cbiAgc2F2ZTogLT5cbiAgICBAaGlkZVJ1bk9wdGlvbnModHJ1ZSlcbiAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkU3VjY2VzcygnUnVuIE9wdGlvbnMgU2F2ZWQnKVxuXG4gIGNhbmNlbDogLT5cbiAgICBAaGlkZVJ1bk9wdGlvbnMoKVxuXG4gIHRyYXZlcnNlSW5wdXRGb2N1czogKGUpIC0+XG4gICAgc3dpdGNoIGUua2V5Q29kZVxuICAgICAgIyBwcmVzcyB0YWIga2V5IHNob3VsZCBjaGFuZ2UgZm9jdXNcbiAgICAgIHdoZW4gOVxuICAgICAgICAjIHN0b3AgZGVmYXVsdCBwcm9wYWdhdGlvblxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgIyBmaW5kIG5leHQvcHJldiBpbnB1dCBib3ggdG8gZm9jdXNcbiAgICAgICAgcm93ID0gQGZpbmQoZS50YXJnZXQpLnBhcmVudHMoJ3RyOmZpcnN0JylbaWYgZS5zaGlmdEtleSB0aGVuICdwcmV2QWxsJyBlbHNlICduZXh0QWxsJ10oJ3RyOmZpcnN0JylcbiAgICAgICAgaWYgcm93Lmxlbmd0aFxuICAgICAgICAgIHJvdy5maW5kKCdhdG9tLXRleHQtZWRpdG9yJykuZm9jdXMoKVxuICAgICAgICAjIGZvY3VzIHJ1biBvciBjbG9zZSBidXR0b24gaWYgbm8gaW5wdXQgYm94IGNhbiBiZSBmb3VuZFxuICAgICAgICBlbHNlXG4gICAgICAgICAgaWYgZS5zaGlmdEtleSB0aGVuIEBidXR0b25DYW5jZWwuZm9jdXMoKSBlbHNlIEBidXR0b25SdW4uZm9jdXMoKVxuICAgICAgIyBlbnRlciBrZXlcbiAgICAgIHdoZW4gMTMgdGhlbiBAYnV0dG9uUnVuLmNsaWNrKClcbiAgICAjIG90aGVyd2lzZSBpZ25vcmVcbiAgICByZXR1cm4gdHJ1ZVxuXG4gIHRyYXZlcnNlQnV0dG9uRm9jdXM6IChlKSAtPlxuICAgIHN3aXRjaCBlLmtleUNvZGVcbiAgICAgIHdoZW4gOVxuICAgICAgICAjIHByZXNzIHRhYiBvbiBjbG9zZSBidXR0b24gc2hvdWxkIGZvY3VzIHRoZSBmaXJzdCBpbnB1dCBib3hcbiAgICAgICAgaWYgIWUuc2hpZnRLZXkgJiYgZS50YXJnZXQgPT0gQGJ1dHRvbkNhbmNlbC5jb250ZXh0XG4gICAgICAgICAgQGNmbGFncy5mb2N1cygpXG4gICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgICMgcHJlc3Mgc2hpZnQgdGFiIG9uIHJ1biBidXR0b24gc2hvdWxkIGZvY3VzIHRoZSBsYXN0IGlucHV0IGJveFxuICAgICAgICBlbHNlIGlmIGUuc2hpZnRLZXkgJiYgZS50YXJnZXQgPT0gQGJ1dHRvblJ1bi5jb250ZXh0XG4gICAgICAgICAgQGFyZ3MuZm9jdXMoKVxuICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgIyBlbXVsYXRlIGJ1dHRvbiBjbGljayB3aGVuIHByZXNzaW5nIGVudGVyIGtleVxuICAgICAgd2hlbiAxMyB0aGVuIGUudGFyZ2V0LmNsaWNrKClcbiAgICAjIG90aGVyd2lzZSBpZ25vcmVcbiAgICByZXR1cm4gdHJ1ZVxuXG4gIHdvcmtzcGFjZVZpZXc6IC0+XG4gICAgYXRvbS52aWV3cy5nZXRWaWV3KGF0b20ud29ya3NwYWNlKVxuIl19
