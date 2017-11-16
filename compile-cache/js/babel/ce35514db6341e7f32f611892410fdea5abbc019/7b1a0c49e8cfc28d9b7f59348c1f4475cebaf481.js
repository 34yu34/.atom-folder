Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _atom = require('atom');

var _atomSpacePenViews = require('atom-space-pen-views');

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var _scriptInputView = require('./script-input-view');

var _scriptInputView2 = _interopRequireDefault(_scriptInputView);

'use babel';

var ScriptOptionsView = (function (_View) {
  _inherits(ScriptOptionsView, _View);

  function ScriptOptionsView() {
    _classCallCheck(this, ScriptOptionsView);

    _get(Object.getPrototypeOf(ScriptOptionsView.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(ScriptOptionsView, [{
    key: 'initialize',
    value: function initialize(runOptions) {
      var _this = this;

      this.runOptions = runOptions;
      this.emitter = new _atom.Emitter();

      this.subscriptions = new _atom.CompositeDisposable();
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'core:cancel': function coreCancel() {
          return _this.hide();
        },
        'core:close': function coreClose() {
          return _this.hide();
        },
        'script:close-options': function scriptCloseOptions() {
          return _this.hide();
        },
        'script:run-options': function scriptRunOptions() {
          return _this.panel.isVisible() ? _this.hide() : _this.show();
        },
        'script:save-options': function scriptSaveOptions() {
          return _this.saveOptions();
        }
      }));

      // handling focus traversal and run on enter
      this.find('atom-text-editor').on('keydown', function (e) {
        if (e.keyCode !== 9 && e.keyCode !== 13) return true;

        switch (e.keyCode) {
          case 9:
            {
              e.preventDefault();
              e.stopPropagation();
              var row = _this.find(e.target).parents('tr:first').nextAll('tr:first');
              if (row.length) {
                return row.find('atom-text-editor').focus();
              }
              return _this.buttonCancel.focus();
            }
          case 13:
            return _this.run();
        }
        return null;
      });

      this.panel = atom.workspace.addModalPanel({ item: this });
      this.panel.hide();
    }
  }, {
    key: 'getOptions',
    value: function getOptions() {
      return {
        workingDirectory: this.inputCwd.get(0).getModel().getText(),
        cmd: this.inputCommand.get(0).getModel().getText(),
        cmdArgs: this.constructor.splitArgs(this.inputCommandArgs.get(0).getModel().getText()),
        env: this.inputEnv.get(0).getModel().getText(),
        scriptArgs: this.constructor.splitArgs(this.inputScriptArgs.get(0).getModel().getText())
      };
    }
  }, {
    key: 'saveOptions',
    value: function saveOptions() {
      var options = this.getOptions();
      for (var option in options) {
        var value = options[option];
        this.runOptions[option] = value;
      }
    }
  }, {
    key: 'onProfileSave',
    value: function onProfileSave(callback) {
      return this.emitter.on('on-profile-save', callback);
    }

    // Saves specified options as new profile
  }, {
    key: 'saveProfile',
    value: function saveProfile() {
      var _this2 = this;

      this.hide();

      var options = this.getOptions();

      var inputView = new _scriptInputView2['default']({ caption: 'Enter profile name:' });
      inputView.onCancel(function () {
        return _this2.show();
      });
      inputView.onConfirm(function (profileName) {
        if (!profileName) return;
        _underscore2['default'].forEach(_this2.find('atom-text-editor'), function (editor) {
          editor.getModel().setText('');
        });

        // clean up the options
        _this2.saveOptions();

        // add to global profiles list
        _this2.emitter.emit('on-profile-save', { name: profileName, options: options });
      });

      inputView.show();
    }
  }, {
    key: 'close',
    value: function close() {
      this.hide();
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      if (this.subscriptions) this.subscriptions.dispose();
    }
  }, {
    key: 'show',
    value: function show() {
      this.panel.show();
      this.inputCwd.focus();
    }
  }, {
    key: 'hide',
    value: function hide() {
      this.panel.hide();
      atom.workspace.getActivePane().activate();
    }
  }, {
    key: 'run',
    value: function run() {
      this.saveOptions();
      this.hide();
      atom.commands.dispatch(this.getWorkspaceView(), 'script:run');
    }
  }, {
    key: 'getWorkspaceView',
    value: function getWorkspaceView() {
      return atom.views.getView(atom.workspace);
    }
  }], [{
    key: 'content',
    value: function content() {
      var _this3 = this;

      this.div({ 'class': 'options-view' }, function () {
        _this3.h4({ 'class': 'modal-header' }, 'Configure Run Options');
        _this3.div({ 'class': 'modal-body' }, function () {
          _this3.table(function () {
            _this3.tr(function () {
              _this3.td({ 'class': 'first' }, function () {
                return _this3.label('Current Working Directory:');
              });
              _this3.td({ 'class': 'second' }, function () {
                return _this3.tag('atom-text-editor', { mini: '', 'class': 'editor mini', outlet: 'inputCwd' });
              });
            });
            _this3.tr(function () {
              _this3.td(function () {
                return _this3.label('Command');
              });
              _this3.td(function () {
                return _this3.tag('atom-text-editor', { mini: '', 'class': 'editor mini', outlet: 'inputCommand' });
              });
            });
            _this3.tr(function () {
              _this3.td(function () {
                return _this3.label('Command Arguments:');
              });
              _this3.td(function () {
                return _this3.tag('atom-text-editor', { mini: '', 'class': 'editor mini', outlet: 'inputCommandArgs' });
              });
            });
            _this3.tr(function () {
              _this3.td(function () {
                return _this3.label('Program Arguments:');
              });
              _this3.td(function () {
                return _this3.tag('atom-text-editor', { mini: '', 'class': 'editor mini', outlet: 'inputScriptArgs' });
              });
            });
            _this3.tr(function () {
              _this3.td(function () {
                return _this3.label('Environment Variables:');
              });
              _this3.td(function () {
                return _this3.tag('atom-text-editor', { mini: '', 'class': 'editor mini', outlet: 'inputEnv' });
              });
            });
          });
        });
        _this3.div({ 'class': 'modal-footer' }, function () {
          var css = 'btn inline-block-tight';
          _this3.button({ 'class': 'btn ' + css + ' cancel', outlet: 'buttonCancel', click: 'close' }, function () {
            return _this3.span({ 'class': 'icon icon-x' }, 'Cancel');
          });
          _this3.span({ 'class': 'pull-right' }, function () {
            _this3.button({ 'class': 'btn ' + css + ' save-profile', outlet: 'buttonSaveProfile', click: 'saveProfile' }, function () {
              return _this3.span({ 'class': 'icon icon-file-text' }, 'Save as profile');
            });
            _this3.button({ 'class': 'btn ' + css + ' run', outlet: 'buttonRun', click: 'run' }, function () {
              return _this3.span({ 'class': 'icon icon-playback-play' }, 'Run');
            });
          });
        });
      });
    }
  }, {
    key: 'splitArgs',
    value: function splitArgs(argText) {
      var text = argText.trim();
      var argSubstringRegex = /([^'"\s]+)|((["'])(.*?)\3)/g;
      var args = [];
      var lastMatchEndPosition = -1;
      var match = argSubstringRegex.exec(text);
      while (match !== null) {
        var matchWithoutQuotes = match[1] || match[4];
        // Combine current result with last match, if last match ended where this
        // one begins.
        if (lastMatchEndPosition === match.index) {
          args[args.length - 1] += matchWithoutQuotes;
        } else {
          args.push(matchWithoutQuotes);
        }

        lastMatchEndPosition = argSubstringRegex.lastIndex;
        match = argSubstringRegex.exec(text);
      }
      return args;
    }
  }]);

  return ScriptOptionsView;
})(_atomSpacePenViews.View);

exports['default'] = ScriptOptionsView;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2JpbGx5Ly5hdG9tL3BhY2thZ2VzL3NjcmlwdC9saWIvc2NyaXB0LW9wdGlvbnMtdmlldy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztvQkFFNkMsTUFBTTs7aUNBQzlCLHNCQUFzQjs7MEJBQzdCLFlBQVk7Ozs7K0JBQ0UscUJBQXFCOzs7O0FBTGpELFdBQVcsQ0FBQzs7SUFPUyxpQkFBaUI7WUFBakIsaUJBQWlCOztXQUFqQixpQkFBaUI7MEJBQWpCLGlCQUFpQjs7K0JBQWpCLGlCQUFpQjs7O2VBQWpCLGlCQUFpQjs7V0E4QzFCLG9CQUFDLFVBQVUsRUFBRTs7O0FBQ3JCLFVBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDO0FBQzdCLFVBQUksQ0FBQyxPQUFPLEdBQUcsbUJBQWEsQ0FBQzs7QUFFN0IsVUFBSSxDQUFDLGFBQWEsR0FBRywrQkFBeUIsQ0FBQztBQUMvQyxVQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRTtBQUN6RCxxQkFBYSxFQUFFO2lCQUFNLE1BQUssSUFBSSxFQUFFO1NBQUE7QUFDaEMsb0JBQVksRUFBRTtpQkFBTSxNQUFLLElBQUksRUFBRTtTQUFBO0FBQy9CLDhCQUFzQixFQUFFO2lCQUFNLE1BQUssSUFBSSxFQUFFO1NBQUE7QUFDekMsNEJBQW9CLEVBQUU7aUJBQU8sTUFBSyxLQUFLLENBQUMsU0FBUyxFQUFFLEdBQUcsTUFBSyxJQUFJLEVBQUUsR0FBRyxNQUFLLElBQUksRUFBRTtTQUFDO0FBQ2hGLDZCQUFxQixFQUFFO2lCQUFNLE1BQUssV0FBVyxFQUFFO1NBQUE7T0FDaEQsQ0FBQyxDQUFDLENBQUM7OztBQUdKLFVBQUksQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxFQUFFLENBQUMsU0FBUyxFQUFFLFVBQUMsQ0FBQyxFQUFLO0FBQ2pELFlBQUksQ0FBQyxDQUFDLE9BQU8sS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sS0FBSyxFQUFFLEVBQUUsT0FBTyxJQUFJLENBQUM7O0FBRXJELGdCQUFRLENBQUMsQ0FBQyxPQUFPO0FBQ2YsZUFBSyxDQUFDO0FBQUU7QUFDTixlQUFDLENBQUMsY0FBYyxFQUFFLENBQUM7QUFDbkIsZUFBQyxDQUFDLGVBQWUsRUFBRSxDQUFDO0FBQ3BCLGtCQUFNLEdBQUcsR0FBRyxNQUFLLElBQUksQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUN4RSxrQkFBSSxHQUFHLENBQUMsTUFBTSxFQUFFO0FBQ2QsdUJBQU8sR0FBRyxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO2VBQzdDO0FBQ0QscUJBQU8sTUFBSyxZQUFZLENBQUMsS0FBSyxFQUFFLENBQUM7YUFDbEM7QUFBQSxBQUNELGVBQUssRUFBRTtBQUFFLG1CQUFPLE1BQUssR0FBRyxFQUFFLENBQUM7QUFBQSxTQUM1QjtBQUNELGVBQU8sSUFBSSxDQUFDO09BQ2IsQ0FBQyxDQUFDOztBQUVILFVBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztBQUMxRCxVQUFJLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDO0tBQ25COzs7V0F3QlMsc0JBQUc7QUFDWCxhQUFPO0FBQ0wsd0JBQWdCLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsT0FBTyxFQUFFO0FBQzNELFdBQUcsRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxPQUFPLEVBQUU7QUFDbEQsZUFBTyxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUNqQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUNsRDtBQUNELFdBQUcsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxPQUFPLEVBQUU7QUFDOUMsa0JBQVUsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FDcEMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsT0FBTyxFQUFFLENBQ2pEO09BQ0YsQ0FBQztLQUNIOzs7V0FFVSx1QkFBRztBQUNaLFVBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztBQUNsQyxXQUFLLElBQU0sTUFBTSxJQUFJLE9BQU8sRUFBRTtBQUM1QixZQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDOUIsWUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsR0FBRyxLQUFLLENBQUM7T0FDakM7S0FDRjs7O1dBRVksdUJBQUMsUUFBUSxFQUFFO0FBQ3RCLGFBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsaUJBQWlCLEVBQUUsUUFBUSxDQUFDLENBQUM7S0FDckQ7Ozs7O1dBR1UsdUJBQUc7OztBQUNaLFVBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQzs7QUFFWixVQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7O0FBRWxDLFVBQU0sU0FBUyxHQUFHLGlDQUFvQixFQUFFLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxDQUFDLENBQUM7QUFDMUUsZUFBUyxDQUFDLFFBQVEsQ0FBQztlQUFNLE9BQUssSUFBSSxFQUFFO09BQUEsQ0FBQyxDQUFDO0FBQ3RDLGVBQVMsQ0FBQyxTQUFTLENBQUMsVUFBQyxXQUFXLEVBQUs7QUFDbkMsWUFBSSxDQUFDLFdBQVcsRUFBRSxPQUFPO0FBQ3pCLGdDQUFFLE9BQU8sQ0FBQyxPQUFLLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxFQUFFLFVBQUMsTUFBTSxFQUFLO0FBQ25ELGdCQUFNLENBQUMsUUFBUSxFQUFFLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1NBQy9CLENBQUMsQ0FBQzs7O0FBR0gsZUFBSyxXQUFXLEVBQUUsQ0FBQzs7O0FBR25CLGVBQUssT0FBTyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsT0FBTyxFQUFQLE9BQU8sRUFBRSxDQUFDLENBQUM7T0FDdEUsQ0FBQyxDQUFDOztBQUVILGVBQVMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztLQUNsQjs7O1dBRUksaUJBQUc7QUFDTixVQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7S0FDYjs7O1dBRU0sbUJBQUc7QUFDUixVQUFJLElBQUksQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsQ0FBQztLQUN0RDs7O1dBRUcsZ0JBQUc7QUFDTCxVQUFJLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ2xCLFVBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLENBQUM7S0FDdkI7OztXQUVHLGdCQUFHO0FBQ0wsVUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUNsQixVQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUFDO0tBQzNDOzs7V0FFRSxlQUFHO0FBQ0osVUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO0FBQ25CLFVBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUNaLFVBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxFQUFFLFlBQVksQ0FBQyxDQUFDO0tBQy9EOzs7V0FFZSw0QkFBRztBQUNqQixhQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztLQUMzQzs7O1dBbExhLG1CQUFHOzs7QUFDZixVQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsU0FBTyxjQUFjLEVBQUUsRUFBRSxZQUFNO0FBQ3hDLGVBQUssRUFBRSxDQUFDLEVBQUUsU0FBTyxjQUFjLEVBQUUsRUFBRSx1QkFBdUIsQ0FBQyxDQUFDO0FBQzVELGVBQUssR0FBRyxDQUFDLEVBQUUsU0FBTyxZQUFZLEVBQUUsRUFBRSxZQUFNO0FBQ3RDLGlCQUFLLEtBQUssQ0FBQyxZQUFNO0FBQ2YsbUJBQUssRUFBRSxDQUFDLFlBQU07QUFDWixxQkFBSyxFQUFFLENBQUMsRUFBRSxTQUFPLE9BQU8sRUFBRSxFQUFFO3VCQUFNLE9BQUssS0FBSyxDQUFDLDRCQUE0QixDQUFDO2VBQUEsQ0FBQyxDQUFDO0FBQzVFLHFCQUFLLEVBQUUsQ0FBQyxFQUFFLFNBQU8sUUFBUSxFQUFFLEVBQUU7dUJBQU0sT0FBSyxHQUFHLENBQUMsa0JBQWtCLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLFNBQU8sYUFBYSxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsQ0FBQztlQUFBLENBQUMsQ0FBQzthQUMxSCxDQUFDLENBQUM7QUFDSCxtQkFBSyxFQUFFLENBQUMsWUFBTTtBQUNaLHFCQUFLLEVBQUUsQ0FBQzt1QkFBTSxPQUFLLEtBQUssQ0FBQyxTQUFTLENBQUM7ZUFBQSxDQUFDLENBQUM7QUFDckMscUJBQUssRUFBRSxDQUFDO3VCQUFNLE9BQUssR0FBRyxDQUFDLGtCQUFrQixFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxTQUFPLGFBQWEsRUFBRSxNQUFNLEVBQUUsY0FBYyxFQUFFLENBQUM7ZUFBQSxDQUFDLENBQUM7YUFDekcsQ0FBQyxDQUFDO0FBQ0gsbUJBQUssRUFBRSxDQUFDLFlBQU07QUFDWixxQkFBSyxFQUFFLENBQUM7dUJBQU0sT0FBSyxLQUFLLENBQUMsb0JBQW9CLENBQUM7ZUFBQSxDQUFDLENBQUM7QUFDaEQscUJBQUssRUFBRSxDQUFDO3VCQUFNLE9BQUssR0FBRyxDQUFDLGtCQUFrQixFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxTQUFPLGFBQWEsRUFBRSxNQUFNLEVBQUUsa0JBQWtCLEVBQUUsQ0FBQztlQUFBLENBQUMsQ0FBQzthQUM3RyxDQUFDLENBQUM7QUFDSCxtQkFBSyxFQUFFLENBQUMsWUFBTTtBQUNaLHFCQUFLLEVBQUUsQ0FBQzt1QkFBTSxPQUFLLEtBQUssQ0FBQyxvQkFBb0IsQ0FBQztlQUFBLENBQUMsQ0FBQztBQUNoRCxxQkFBSyxFQUFFLENBQUM7dUJBQU0sT0FBSyxHQUFHLENBQUMsa0JBQWtCLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLFNBQU8sYUFBYSxFQUFFLE1BQU0sRUFBRSxpQkFBaUIsRUFBRSxDQUFDO2VBQUEsQ0FBQyxDQUFDO2FBQzVHLENBQUMsQ0FBQztBQUNILG1CQUFLLEVBQUUsQ0FBQyxZQUFNO0FBQ1oscUJBQUssRUFBRSxDQUFDO3VCQUFNLE9BQUssS0FBSyxDQUFDLHdCQUF3QixDQUFDO2VBQUEsQ0FBQyxDQUFDO0FBQ3BELHFCQUFLLEVBQUUsQ0FBQzt1QkFBTSxPQUFLLEdBQUcsQ0FBQyxrQkFBa0IsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsU0FBTyxhQUFhLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxDQUFDO2VBQUEsQ0FBQyxDQUFDO2FBQ3JHLENBQUMsQ0FBQztXQUNKLENBQUMsQ0FBQztTQUNKLENBQUMsQ0FBQztBQUNILGVBQUssR0FBRyxDQUFDLEVBQUUsU0FBTyxjQUFjLEVBQUUsRUFBRSxZQUFNO0FBQ3hDLGNBQU0sR0FBRyxHQUFHLHdCQUF3QixDQUFDO0FBQ3JDLGlCQUFLLE1BQU0sQ0FBQyxFQUFFLGtCQUFjLEdBQUcsWUFBUyxFQUFFLE1BQU0sRUFBRSxjQUFjLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxFQUFFO21CQUNsRixPQUFLLElBQUksQ0FBQyxFQUFFLFNBQU8sYUFBYSxFQUFFLEVBQUUsUUFBUSxDQUFDO1dBQUEsQ0FDOUMsQ0FBQztBQUNGLGlCQUFLLElBQUksQ0FBQyxFQUFFLFNBQU8sWUFBWSxFQUFFLEVBQUUsWUFBTTtBQUN2QyxtQkFBSyxNQUFNLENBQUMsRUFBRSxrQkFBYyxHQUFHLGtCQUFlLEVBQUUsTUFBTSxFQUFFLG1CQUFtQixFQUFFLEtBQUssRUFBRSxhQUFhLEVBQUUsRUFBRTtxQkFDbkcsT0FBSyxJQUFJLENBQUMsRUFBRSxTQUFPLHFCQUFxQixFQUFFLEVBQUUsaUJBQWlCLENBQUM7YUFBQSxDQUMvRCxDQUFDO0FBQ0YsbUJBQUssTUFBTSxDQUFDLEVBQUUsa0JBQWMsR0FBRyxTQUFNLEVBQUUsTUFBTSxFQUFFLFdBQVcsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEVBQUU7cUJBQzFFLE9BQUssSUFBSSxDQUFDLEVBQUUsU0FBTyx5QkFBeUIsRUFBRSxFQUFFLEtBQUssQ0FBQzthQUFBLENBQ3ZELENBQUM7V0FDSCxDQUFDLENBQUM7U0FDSixDQUFDLENBQUM7T0FDSixDQUFDLENBQUM7S0FDSjs7O1dBc0NlLG1CQUFDLE9BQU8sRUFBRTtBQUN4QixVQUFNLElBQUksR0FBRyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDNUIsVUFBTSxpQkFBaUIsR0FBRyw2QkFBNkIsQ0FBQztBQUN4RCxVQUFNLElBQUksR0FBRyxFQUFFLENBQUM7QUFDaEIsVUFBSSxvQkFBb0IsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUM5QixVQUFJLEtBQUssR0FBRyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDekMsYUFBTyxLQUFLLEtBQUssSUFBSSxFQUFFO0FBQ3JCLFlBQU0sa0JBQWtCLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQzs7O0FBR2hELFlBQUksb0JBQW9CLEtBQUssS0FBSyxDQUFDLEtBQUssRUFBRTtBQUN4QyxjQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsSUFBSSxrQkFBa0IsQ0FBQztTQUM3QyxNQUFNO0FBQ0wsY0FBSSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1NBQy9COztBQUVELDRCQUFvQixHQUFHLGlCQUFpQixDQUFDLFNBQVMsQ0FBQztBQUNuRCxhQUFLLEdBQUcsaUJBQWlCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO09BQ3RDO0FBQ0QsYUFBTyxJQUFJLENBQUM7S0FDYjs7O1NBdEdrQixpQkFBaUI7OztxQkFBakIsaUJBQWlCIiwiZmlsZSI6Ii9ob21lL2JpbGx5Ly5hdG9tL3BhY2thZ2VzL3NjcmlwdC9saWIvc2NyaXB0LW9wdGlvbnMtdmlldy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5pbXBvcnQgeyBDb21wb3NpdGVEaXNwb3NhYmxlLCBFbWl0dGVyIH0gZnJvbSAnYXRvbSc7XG5pbXBvcnQgeyBWaWV3IH0gZnJvbSAnYXRvbS1zcGFjZS1wZW4tdmlld3MnO1xuaW1wb3J0IF8gZnJvbSAndW5kZXJzY29yZSc7XG5pbXBvcnQgU2NyaXB0SW5wdXRWaWV3IGZyb20gJy4vc2NyaXB0LWlucHV0LXZpZXcnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTY3JpcHRPcHRpb25zVmlldyBleHRlbmRzIFZpZXcge1xuXG4gIHN0YXRpYyBjb250ZW50KCkge1xuICAgIHRoaXMuZGl2KHsgY2xhc3M6ICdvcHRpb25zLXZpZXcnIH0sICgpID0+IHtcbiAgICAgIHRoaXMuaDQoeyBjbGFzczogJ21vZGFsLWhlYWRlcicgfSwgJ0NvbmZpZ3VyZSBSdW4gT3B0aW9ucycpO1xuICAgICAgdGhpcy5kaXYoeyBjbGFzczogJ21vZGFsLWJvZHknIH0sICgpID0+IHtcbiAgICAgICAgdGhpcy50YWJsZSgoKSA9PiB7XG4gICAgICAgICAgdGhpcy50cigoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnRkKHsgY2xhc3M6ICdmaXJzdCcgfSwgKCkgPT4gdGhpcy5sYWJlbCgnQ3VycmVudCBXb3JraW5nIERpcmVjdG9yeTonKSk7XG4gICAgICAgICAgICB0aGlzLnRkKHsgY2xhc3M6ICdzZWNvbmQnIH0sICgpID0+IHRoaXMudGFnKCdhdG9tLXRleHQtZWRpdG9yJywgeyBtaW5pOiAnJywgY2xhc3M6ICdlZGl0b3IgbWluaScsIG91dGxldDogJ2lucHV0Q3dkJyB9KSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgdGhpcy50cigoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnRkKCgpID0+IHRoaXMubGFiZWwoJ0NvbW1hbmQnKSk7XG4gICAgICAgICAgICB0aGlzLnRkKCgpID0+IHRoaXMudGFnKCdhdG9tLXRleHQtZWRpdG9yJywgeyBtaW5pOiAnJywgY2xhc3M6ICdlZGl0b3IgbWluaScsIG91dGxldDogJ2lucHV0Q29tbWFuZCcgfSkpO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIHRoaXMudHIoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy50ZCgoKSA9PiB0aGlzLmxhYmVsKCdDb21tYW5kIEFyZ3VtZW50czonKSk7XG4gICAgICAgICAgICB0aGlzLnRkKCgpID0+IHRoaXMudGFnKCdhdG9tLXRleHQtZWRpdG9yJywgeyBtaW5pOiAnJywgY2xhc3M6ICdlZGl0b3IgbWluaScsIG91dGxldDogJ2lucHV0Q29tbWFuZEFyZ3MnIH0pKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICB0aGlzLnRyKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMudGQoKCkgPT4gdGhpcy5sYWJlbCgnUHJvZ3JhbSBBcmd1bWVudHM6JykpO1xuICAgICAgICAgICAgdGhpcy50ZCgoKSA9PiB0aGlzLnRhZygnYXRvbS10ZXh0LWVkaXRvcicsIHsgbWluaTogJycsIGNsYXNzOiAnZWRpdG9yIG1pbmknLCBvdXRsZXQ6ICdpbnB1dFNjcmlwdEFyZ3MnIH0pKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICB0aGlzLnRyKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMudGQoKCkgPT4gdGhpcy5sYWJlbCgnRW52aXJvbm1lbnQgVmFyaWFibGVzOicpKTtcbiAgICAgICAgICAgIHRoaXMudGQoKCkgPT4gdGhpcy50YWcoJ2F0b20tdGV4dC1lZGl0b3InLCB7IG1pbmk6ICcnLCBjbGFzczogJ2VkaXRvciBtaW5pJywgb3V0bGV0OiAnaW5wdXRFbnYnIH0pKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICAgIHRoaXMuZGl2KHsgY2xhc3M6ICdtb2RhbC1mb290ZXInIH0sICgpID0+IHtcbiAgICAgICAgY29uc3QgY3NzID0gJ2J0biBpbmxpbmUtYmxvY2stdGlnaHQnO1xuICAgICAgICB0aGlzLmJ1dHRvbih7IGNsYXNzOiBgYnRuICR7Y3NzfSBjYW5jZWxgLCBvdXRsZXQ6ICdidXR0b25DYW5jZWwnLCBjbGljazogJ2Nsb3NlJyB9LCAoKSA9PlxuICAgICAgICAgIHRoaXMuc3Bhbih7IGNsYXNzOiAnaWNvbiBpY29uLXgnIH0sICdDYW5jZWwnKSxcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5zcGFuKHsgY2xhc3M6ICdwdWxsLXJpZ2h0JyB9LCAoKSA9PiB7XG4gICAgICAgICAgdGhpcy5idXR0b24oeyBjbGFzczogYGJ0biAke2Nzc30gc2F2ZS1wcm9maWxlYCwgb3V0bGV0OiAnYnV0dG9uU2F2ZVByb2ZpbGUnLCBjbGljazogJ3NhdmVQcm9maWxlJyB9LCAoKSA9PlxuICAgICAgICAgICAgdGhpcy5zcGFuKHsgY2xhc3M6ICdpY29uIGljb24tZmlsZS10ZXh0JyB9LCAnU2F2ZSBhcyBwcm9maWxlJyksXG4gICAgICAgICAgKTtcbiAgICAgICAgICB0aGlzLmJ1dHRvbih7IGNsYXNzOiBgYnRuICR7Y3NzfSBydW5gLCBvdXRsZXQ6ICdidXR0b25SdW4nLCBjbGljazogJ3J1bicgfSwgKCkgPT5cbiAgICAgICAgICAgIHRoaXMuc3Bhbih7IGNsYXNzOiAnaWNvbiBpY29uLXBsYXliYWNrLXBsYXknIH0sICdSdW4nKSxcbiAgICAgICAgICApO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgaW5pdGlhbGl6ZShydW5PcHRpb25zKSB7XG4gICAgdGhpcy5ydW5PcHRpb25zID0gcnVuT3B0aW9ucztcbiAgICB0aGlzLmVtaXR0ZXIgPSBuZXcgRW1pdHRlcigpO1xuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKTtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29tbWFuZHMuYWRkKCdhdG9tLXdvcmtzcGFjZScsIHtcbiAgICAgICdjb3JlOmNhbmNlbCc6ICgpID0+IHRoaXMuaGlkZSgpLFxuICAgICAgJ2NvcmU6Y2xvc2UnOiAoKSA9PiB0aGlzLmhpZGUoKSxcbiAgICAgICdzY3JpcHQ6Y2xvc2Utb3B0aW9ucyc6ICgpID0+IHRoaXMuaGlkZSgpLFxuICAgICAgJ3NjcmlwdDpydW4tb3B0aW9ucyc6ICgpID0+ICh0aGlzLnBhbmVsLmlzVmlzaWJsZSgpID8gdGhpcy5oaWRlKCkgOiB0aGlzLnNob3coKSksXG4gICAgICAnc2NyaXB0OnNhdmUtb3B0aW9ucyc6ICgpID0+IHRoaXMuc2F2ZU9wdGlvbnMoKSxcbiAgICB9KSk7XG5cbiAgICAvLyBoYW5kbGluZyBmb2N1cyB0cmF2ZXJzYWwgYW5kIHJ1biBvbiBlbnRlclxuICAgIHRoaXMuZmluZCgnYXRvbS10ZXh0LWVkaXRvcicpLm9uKCdrZXlkb3duJywgKGUpID0+IHtcbiAgICAgIGlmIChlLmtleUNvZGUgIT09IDkgJiYgZS5rZXlDb2RlICE9PSAxMykgcmV0dXJuIHRydWU7XG5cbiAgICAgIHN3aXRjaCAoZS5rZXlDb2RlKSB7XG4gICAgICAgIGNhc2UgOToge1xuICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgIGNvbnN0IHJvdyA9IHRoaXMuZmluZChlLnRhcmdldCkucGFyZW50cygndHI6Zmlyc3QnKS5uZXh0QWxsKCd0cjpmaXJzdCcpO1xuICAgICAgICAgIGlmIChyb3cubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm4gcm93LmZpbmQoJ2F0b20tdGV4dC1lZGl0b3InKS5mb2N1cygpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gdGhpcy5idXR0b25DYW5jZWwuZm9jdXMoKTtcbiAgICAgICAgfVxuICAgICAgICBjYXNlIDEzOiByZXR1cm4gdGhpcy5ydW4oKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH0pO1xuXG4gICAgdGhpcy5wYW5lbCA9IGF0b20ud29ya3NwYWNlLmFkZE1vZGFsUGFuZWwoeyBpdGVtOiB0aGlzIH0pO1xuICAgIHRoaXMucGFuZWwuaGlkZSgpO1xuICB9XG5cbiAgc3RhdGljIHNwbGl0QXJncyhhcmdUZXh0KSB7XG4gICAgY29uc3QgdGV4dCA9IGFyZ1RleHQudHJpbSgpO1xuICAgIGNvbnN0IGFyZ1N1YnN0cmluZ1JlZ2V4ID0gLyhbXidcIlxcc10rKXwoKFtcIiddKSguKj8pXFwzKS9nO1xuICAgIGNvbnN0IGFyZ3MgPSBbXTtcbiAgICBsZXQgbGFzdE1hdGNoRW5kUG9zaXRpb24gPSAtMTtcbiAgICBsZXQgbWF0Y2ggPSBhcmdTdWJzdHJpbmdSZWdleC5leGVjKHRleHQpO1xuICAgIHdoaWxlIChtYXRjaCAhPT0gbnVsbCkge1xuICAgICAgY29uc3QgbWF0Y2hXaXRob3V0UXVvdGVzID0gbWF0Y2hbMV0gfHwgbWF0Y2hbNF07XG4gICAgICAvLyBDb21iaW5lIGN1cnJlbnQgcmVzdWx0IHdpdGggbGFzdCBtYXRjaCwgaWYgbGFzdCBtYXRjaCBlbmRlZCB3aGVyZSB0aGlzXG4gICAgICAvLyBvbmUgYmVnaW5zLlxuICAgICAgaWYgKGxhc3RNYXRjaEVuZFBvc2l0aW9uID09PSBtYXRjaC5pbmRleCkge1xuICAgICAgICBhcmdzW2FyZ3MubGVuZ3RoIC0gMV0gKz0gbWF0Y2hXaXRob3V0UXVvdGVzO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYXJncy5wdXNoKG1hdGNoV2l0aG91dFF1b3Rlcyk7XG4gICAgICB9XG5cbiAgICAgIGxhc3RNYXRjaEVuZFBvc2l0aW9uID0gYXJnU3Vic3RyaW5nUmVnZXgubGFzdEluZGV4O1xuICAgICAgbWF0Y2ggPSBhcmdTdWJzdHJpbmdSZWdleC5leGVjKHRleHQpO1xuICAgIH1cbiAgICByZXR1cm4gYXJncztcbiAgfVxuXG4gIGdldE9wdGlvbnMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHdvcmtpbmdEaXJlY3Rvcnk6IHRoaXMuaW5wdXRDd2QuZ2V0KDApLmdldE1vZGVsKCkuZ2V0VGV4dCgpLFxuICAgICAgY21kOiB0aGlzLmlucHV0Q29tbWFuZC5nZXQoMCkuZ2V0TW9kZWwoKS5nZXRUZXh0KCksXG4gICAgICBjbWRBcmdzOiB0aGlzLmNvbnN0cnVjdG9yLnNwbGl0QXJncyhcbiAgICAgICAgdGhpcy5pbnB1dENvbW1hbmRBcmdzLmdldCgwKS5nZXRNb2RlbCgpLmdldFRleHQoKSxcbiAgICAgICksXG4gICAgICBlbnY6IHRoaXMuaW5wdXRFbnYuZ2V0KDApLmdldE1vZGVsKCkuZ2V0VGV4dCgpLFxuICAgICAgc2NyaXB0QXJnczogdGhpcy5jb25zdHJ1Y3Rvci5zcGxpdEFyZ3MoXG4gICAgICAgIHRoaXMuaW5wdXRTY3JpcHRBcmdzLmdldCgwKS5nZXRNb2RlbCgpLmdldFRleHQoKSxcbiAgICAgICksXG4gICAgfTtcbiAgfVxuXG4gIHNhdmVPcHRpb25zKCkge1xuICAgIGNvbnN0IG9wdGlvbnMgPSB0aGlzLmdldE9wdGlvbnMoKTtcbiAgICBmb3IgKGNvbnN0IG9wdGlvbiBpbiBvcHRpb25zKSB7XG4gICAgICBjb25zdCB2YWx1ZSA9IG9wdGlvbnNbb3B0aW9uXTtcbiAgICAgIHRoaXMucnVuT3B0aW9uc1tvcHRpb25dID0gdmFsdWU7XG4gICAgfVxuICB9XG5cbiAgb25Qcm9maWxlU2F2ZShjYWxsYmFjaykge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ29uLXByb2ZpbGUtc2F2ZScsIGNhbGxiYWNrKTtcbiAgfVxuXG4gIC8vIFNhdmVzIHNwZWNpZmllZCBvcHRpb25zIGFzIG5ldyBwcm9maWxlXG4gIHNhdmVQcm9maWxlKCkge1xuICAgIHRoaXMuaGlkZSgpO1xuXG4gICAgY29uc3Qgb3B0aW9ucyA9IHRoaXMuZ2V0T3B0aW9ucygpO1xuXG4gICAgY29uc3QgaW5wdXRWaWV3ID0gbmV3IFNjcmlwdElucHV0Vmlldyh7IGNhcHRpb246ICdFbnRlciBwcm9maWxlIG5hbWU6JyB9KTtcbiAgICBpbnB1dFZpZXcub25DYW5jZWwoKCkgPT4gdGhpcy5zaG93KCkpO1xuICAgIGlucHV0Vmlldy5vbkNvbmZpcm0oKHByb2ZpbGVOYW1lKSA9PiB7XG4gICAgICBpZiAoIXByb2ZpbGVOYW1lKSByZXR1cm47XG4gICAgICBfLmZvckVhY2godGhpcy5maW5kKCdhdG9tLXRleHQtZWRpdG9yJyksIChlZGl0b3IpID0+IHtcbiAgICAgICAgZWRpdG9yLmdldE1vZGVsKCkuc2V0VGV4dCgnJyk7XG4gICAgICB9KTtcblxuICAgICAgLy8gY2xlYW4gdXAgdGhlIG9wdGlvbnNcbiAgICAgIHRoaXMuc2F2ZU9wdGlvbnMoKTtcblxuICAgICAgLy8gYWRkIHRvIGdsb2JhbCBwcm9maWxlcyBsaXN0XG4gICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnb24tcHJvZmlsZS1zYXZlJywgeyBuYW1lOiBwcm9maWxlTmFtZSwgb3B0aW9ucyB9KTtcbiAgICB9KTtcblxuICAgIGlucHV0Vmlldy5zaG93KCk7XG4gIH1cblxuICBjbG9zZSgpIHtcbiAgICB0aGlzLmhpZGUoKTtcbiAgfVxuXG4gIGRlc3Ryb3koKSB7XG4gICAgaWYgKHRoaXMuc3Vic2NyaXB0aW9ucykgdGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKTtcbiAgfVxuXG4gIHNob3coKSB7XG4gICAgdGhpcy5wYW5lbC5zaG93KCk7XG4gICAgdGhpcy5pbnB1dEN3ZC5mb2N1cygpO1xuICB9XG5cbiAgaGlkZSgpIHtcbiAgICB0aGlzLnBhbmVsLmhpZGUoKTtcbiAgICBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lKCkuYWN0aXZhdGUoKTtcbiAgfVxuXG4gIHJ1bigpIHtcbiAgICB0aGlzLnNhdmVPcHRpb25zKCk7XG4gICAgdGhpcy5oaWRlKCk7XG4gICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaCh0aGlzLmdldFdvcmtzcGFjZVZpZXcoKSwgJ3NjcmlwdDpydW4nKTtcbiAgfVxuXG4gIGdldFdvcmtzcGFjZVZpZXcoKSB7XG4gICAgcmV0dXJuIGF0b20udmlld3MuZ2V0VmlldyhhdG9tLndvcmtzcGFjZSk7XG4gIH1cbn1cbiJdfQ==