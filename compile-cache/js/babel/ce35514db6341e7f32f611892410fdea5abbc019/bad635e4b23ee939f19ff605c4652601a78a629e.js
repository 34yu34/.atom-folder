Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _atom = require('atom');

var _codeContextBuilder = require('./code-context-builder');

var _codeContextBuilder2 = _interopRequireDefault(_codeContextBuilder);

var _grammarUtils = require('./grammar-utils');

var _grammarUtils2 = _interopRequireDefault(_grammarUtils);

var _runner = require('./runner');

var _runner2 = _interopRequireDefault(_runner);

var _runtime = require('./runtime');

var _runtime2 = _interopRequireDefault(_runtime);

var _scriptOptions = require('./script-options');

var _scriptOptions2 = _interopRequireDefault(_scriptOptions);

var _scriptOptionsView = require('./script-options-view');

var _scriptOptionsView2 = _interopRequireDefault(_scriptOptionsView);

var _scriptProfileRunView = require('./script-profile-run-view');

var _scriptProfileRunView2 = _interopRequireDefault(_scriptProfileRunView);

var _scriptView = require('./script-view');

var _scriptView2 = _interopRequireDefault(_scriptView);

var _viewRuntimeObserver = require('./view-runtime-observer');

var _viewRuntimeObserver2 = _interopRequireDefault(_viewRuntimeObserver);

'use babel';

exports['default'] = {
  config: {
    enableExecTime: {
      title: 'Output the time it took to execute the script',
      type: 'boolean',
      'default': true
    },
    escapeConsoleOutput: {
      title: 'HTML escape console output',
      type: 'boolean',
      'default': true
    },
    ignoreSelection: {
      title: 'Ignore selection (file-based runs only)',
      type: 'boolean',
      'default': false
    },
    scrollWithOutput: {
      title: 'Scroll with output',
      type: 'boolean',
      'default': true
    },
    stopOnRerun: {
      title: 'Stop running process on rerun',
      type: 'boolean',
      'default': false
    },
    cwdBehavior: {
      title: 'Default Current Working Directory (CWD) Behavior',
      description: 'If no Run Options are set, this setting decides how to determine the CWD',
      type: 'string',
      'default': 'First project directory',
      'enum': ['First project directory', 'Project directory of the script', 'Directory of the script']
    }
  },
  // For some reason, the text of these options does not show in package settings view
  // default: 'firstProj'
  // enum: [
  //   {value: 'firstProj', description: 'First project directory (if there is one)'}
  //   {value: 'scriptProj', description: 'Project directory of the script (if there is one)'}
  //   {value: 'scriptDir', description: 'Directory of the script'}
  // ]
  scriptView: null,
  scriptOptionsView: null,
  scriptProfileRunView: null,
  scriptOptions: null,
  scriptProfiles: [],

  activate: function activate(state) {
    var _this = this;

    this.scriptView = new _scriptView2['default'](state.scriptViewState);
    this.scriptOptions = new _scriptOptions2['default']();
    this.scriptOptionsView = new _scriptOptionsView2['default'](this.scriptOptions);

    // profiles loading
    this.scriptProfiles = [];
    if (state.profiles) {
      for (var profile of state.profiles) {
        var so = _scriptOptions2['default'].createFromOptions(profile.name, profile);
        this.scriptProfiles.push(so);
      }
    }

    this.scriptProfileRunView = new _scriptProfileRunView2['default'](this.scriptProfiles);

    var codeContextBuilder = new _codeContextBuilder2['default']();
    var runner = new _runner2['default'](this.scriptOptions);

    var observer = new _viewRuntimeObserver2['default'](this.scriptView);

    this.runtime = new _runtime2['default'](runner, codeContextBuilder, [observer]);

    this.subscriptions = new _atom.CompositeDisposable();
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'core:cancel': function coreCancel() {
        return _this.closeScriptViewAndStopRunner();
      },
      'core:close': function coreClose() {
        return _this.closeScriptViewAndStopRunner();
      },
      'script:close-view': function scriptCloseView() {
        return _this.closeScriptViewAndStopRunner();
      },
      'script:copy-run-results': function scriptCopyRunResults() {
        return _this.scriptView.copyResults();
      },
      'script:kill-process': function scriptKillProcess() {
        return _this.runtime.stop();
      },
      'script:run-by-line-number': function scriptRunByLineNumber() {
        return _this.runtime.execute('Line Number Based');
      },
      'script:run': function scriptRun() {
        return _this.runtime.execute('Selection Based');
      }
    }));

    // profile created
    this.scriptOptionsView.onProfileSave(function (profileData) {
      // create and fill out profile
      var profile = _scriptOptions2['default'].createFromOptions(profileData.name, profileData.options);

      var codeContext = _this.runtime.codeContextBuilder.buildCodeContext(atom.workspace.getActiveTextEditor(), 'Selection Based');
      profile.lang = codeContext.lang;

      // formatting description
      var opts = profile.toObject();
      var desc = 'Language: ' + codeContext.lang;
      if (opts.cmd) {
        desc += ', Command: ' + opts.cmd;
      }
      if (opts.cmdArgs && opts.cmd) {
        desc += ' ' + opts.cmdArgs.join(' ');
      }

      profile.description = desc;
      _this.scriptProfiles.push(profile);

      _this.scriptOptionsView.hide();
      _this.scriptProfileRunView.show();
      _this.scriptProfileRunView.setProfiles(_this.scriptProfiles);
    });

    // profile deleted
    this.scriptProfileRunView.onProfileDelete(function (profile) {
      var index = _this.scriptProfiles.indexOf(profile);
      if (index === -1) {
        return;
      }

      if (index !== -1) {
        _this.scriptProfiles.splice(index, 1);
      }
      _this.scriptProfileRunView.setProfiles(_this.scriptProfiles);
    });

    // profile renamed
    this.scriptProfileRunView.onProfileChange(function (data) {
      var index = _this.scriptProfiles.indexOf(data.profile);
      if (index === -1 || !_this.scriptProfiles[index][data.key]) {
        return;
      }

      _this.scriptProfiles[index][data.key] = data.value;
      _this.scriptProfileRunView.show();
      _this.scriptProfileRunView.setProfiles(_this.scriptProfiles);
    });

    // profile renamed
    return this.scriptProfileRunView.onProfileRun(function (profile) {
      if (!profile) {
        return;
      }
      _this.runtime.execute('Selection Based', null, profile);
    });
  },

  deactivate: function deactivate() {
    this.runtime.destroy();
    this.scriptView.removePanel();
    this.scriptOptionsView.close();
    this.scriptProfileRunView.close();
    this.subscriptions.dispose();
    _grammarUtils2['default'].deleteTempFiles();
  },

  closeScriptViewAndStopRunner: function closeScriptViewAndStopRunner() {
    this.runtime.stop();
    this.scriptView.removePanel();
  },

  // Public
  //
  // Service method that provides the default runtime that's configurable through Atom editor
  // Use this service if you want to directly show the script's output in the Atom editor
  //
  // **Do not destroy this {Runtime} instance!** By doing so you'll break this plugin!
  //
  // Also note that the Script package isn't activated until you actually try to use it.
  // That's why this service won't be automatically consumed. To be sure you consume it
  // you may need to manually activate the package:
  //
  // atom.packages.loadPackage('script').activateNow() # this code doesn't include error handling!
  //
  // see https://github.com/s1mplex/Atom-Script-Runtime-Consumer-Sample for a full example
  provideDefaultRuntime: function provideDefaultRuntime() {
    return this.runtime;
  },

  // Public
  //
  // Service method that provides a blank runtime. You are free to configure any aspect of it:
  // * Add observer (`runtime.addObserver(observer)`) - see {ViewRuntimeObserver} for an example
  // * configure script options (`runtime.scriptOptions`)
  //
  // In contrast to `provideDefaultRuntime` you should dispose this {Runtime} when
  // you no longer need it.
  //
  // Also note that the Script package isn't activated until you actually try to use it.
  // That's why this service won't be automatically consumed. To be sure you consume it
  // you may need to manually activate the package:
  //
  // atom.packages.loadPackage('script').activateNow() # this code doesn't include error handling!
  //
  // see https://github.com/s1mplex/Atom-Script-Runtime-Consumer-Sample for a full example
  provideBlankRuntime: function provideBlankRuntime() {
    var runner = new _runner2['default'](new _scriptOptions2['default']());
    var codeContextBuilder = new _codeContextBuilder2['default']();

    return new _runtime2['default'](runner, codeContextBuilder, []);
  },

  serialize: function serialize() {
    // TODO: True serialization needs to take the options view into account
    //       and handle deserialization
    var serializedProfiles = [];
    for (var profile of this.scriptProfiles) {
      serializedProfiles.push(profile.toObject());
    }

    return {
      scriptViewState: this.scriptView.serialize(),
      scriptOptionsViewState: this.scriptOptionsView.serialize(),
      profiles: serializedProfiles
    };
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2JpbGx5Ly5hdG9tL3BhY2thZ2VzL3NjcmlwdC9saWIvc2NyaXB0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztvQkFFb0MsTUFBTTs7a0NBRVgsd0JBQXdCOzs7OzRCQUM5QixpQkFBaUI7Ozs7c0JBQ3ZCLFVBQVU7Ozs7dUJBQ1QsV0FBVzs7Ozs2QkFDTCxrQkFBa0I7Ozs7aUNBQ2QsdUJBQXVCOzs7O29DQUNwQiwyQkFBMkI7Ozs7MEJBQ3JDLGVBQWU7Ozs7bUNBQ04seUJBQXlCOzs7O0FBWnpELFdBQVcsQ0FBQzs7cUJBY0c7QUFDYixRQUFNLEVBQUU7QUFDTixrQkFBYyxFQUFFO0FBQ2QsV0FBSyxFQUFFLCtDQUErQztBQUN0RCxVQUFJLEVBQUUsU0FBUztBQUNmLGlCQUFTLElBQUk7S0FDZDtBQUNELHVCQUFtQixFQUFFO0FBQ25CLFdBQUssRUFBRSw0QkFBNEI7QUFDbkMsVUFBSSxFQUFFLFNBQVM7QUFDZixpQkFBUyxJQUFJO0tBQ2Q7QUFDRCxtQkFBZSxFQUFFO0FBQ2YsV0FBSyxFQUFFLHlDQUF5QztBQUNoRCxVQUFJLEVBQUUsU0FBUztBQUNmLGlCQUFTLEtBQUs7S0FDZjtBQUNELG9CQUFnQixFQUFFO0FBQ2hCLFdBQUssRUFBRSxvQkFBb0I7QUFDM0IsVUFBSSxFQUFFLFNBQVM7QUFDZixpQkFBUyxJQUFJO0tBQ2Q7QUFDRCxlQUFXLEVBQUU7QUFDWCxXQUFLLEVBQUUsK0JBQStCO0FBQ3RDLFVBQUksRUFBRSxTQUFTO0FBQ2YsaUJBQVMsS0FBSztLQUNmO0FBQ0QsZUFBVyxFQUFFO0FBQ1gsV0FBSyxFQUFFLGtEQUFrRDtBQUN6RCxpQkFBVyxFQUFFLDBFQUEwRTtBQUN2RixVQUFJLEVBQUUsUUFBUTtBQUNkLGlCQUFTLHlCQUF5QjtBQUNsQyxjQUFNLENBQ0oseUJBQXlCLEVBQ3pCLGlDQUFpQyxFQUNqQyx5QkFBeUIsQ0FDMUI7S0FDRjtHQUNGOzs7Ozs7OztBQVFELFlBQVUsRUFBRSxJQUFJO0FBQ2hCLG1C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Q0FBbUIsQ0FBQyxDQUFDO0FBQy9DLFFBQU0sa0JBQWtCLEdBQUcscUNBQXdCLENBQUM7O0FBRXBELFdBQU8seUJBQVksTUFBTSxFQUFFLGtCQUFrQixFQUFFLEVBQUUsQ0FBQyxDQUFDO0dBQ3BEOztBQUVELFdBQVMsRUFBQSxxQkFBRzs7O0FBR1YsUUFBTSxrQkFBa0IsR0FBRyxFQUFFLENBQUM7QUFDOUIsU0FBSyxJQUFNLE9BQU8sSUFBSSxJQUFJLENBQUMsY0FBYyxFQUFFO0FBQUUsd0JBQWtCLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO0tBQUU7O0FBRTNGLFdBQU87QUFDTCxxQkFBZSxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxFQUFFO0FBQzVDLDRCQUFzQixFQUFFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxTQUFTLEVBQUU7QUFDMUQsY0FBUSxFQUFFLGtCQUFrQjtLQUM3QixDQUFDO0dBQ0g7Q0FDRiIsImZpbGUiOiIvaG9tZS9iaWxseS8uYXRvbS9wYWNrYWdlcy9zY3JpcHQvbGliL3NjcmlwdC5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5pbXBvcnQgeyBDb21wb3NpdGVEaXNwb3NhYmxlIH0gZnJvbSAnYXRvbSc7XG5cbmltcG9ydCBDb2RlQ29udGV4dEJ1aWxkZXIgZnJvbSAnLi9jb2RlLWNvbnRleHQtYnVpbGRlcic7XG5pbXBvcnQgR3JhbW1hclV0aWxzIGZyb20gJy4vZ3JhbW1hci11dGlscyc7XG5pbXBvcnQgUnVubmVyIGZyb20gJy4vcnVubmVyJztcbmltcG9ydCBSdW50aW1lIGZyb20gJy4vcnVudGltZSc7XG5pbXBvcnQgU2NyaXB0T3B0aW9ucyBmcm9tICcuL3NjcmlwdC1vcHRpb25zJztcbmltcG9ydCBTY3JpcHRPcHRpb25zVmlldyBmcm9tICcuL3NjcmlwdC1vcHRpb25zLXZpZXcnO1xuaW1wb3J0IFNjcmlwdFByb2ZpbGVSdW5WaWV3IGZyb20gJy4vc2NyaXB0LXByb2ZpbGUtcnVuLXZpZXcnO1xuaW1wb3J0IFNjcmlwdFZpZXcgZnJvbSAnLi9zY3JpcHQtdmlldyc7XG5pbXBvcnQgVmlld1J1bnRpbWVPYnNlcnZlciBmcm9tICcuL3ZpZXctcnVudGltZS1vYnNlcnZlcic7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgY29uZmlnOiB7XG4gICAgZW5hYmxlRXhlY1RpbWU6IHtcbiAgICAgIHRpdGxlOiAnT3V0cHV0IHRoZSB0aW1lIGl0IHRvb2sgdG8gZXhlY3V0ZSB0aGUgc2NyaXB0JyxcbiAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgIGRlZmF1bHQ6IHRydWUsXG4gICAgfSxcbiAgICBlc2NhcGVDb25zb2xlT3V0cHV0OiB7XG4gICAgICB0aXRsZTogJ0hUTUwgZXNjYXBlIGNvbnNvbGUgb3V0cHV0JyxcbiAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgIGRlZmF1bHQ6IHRydWUsXG4gICAgfSxcbiAgICBpZ25vcmVTZWxlY3Rpb246IHtcbiAgICAgIHRpdGxlOiAnSWdub3JlIHNlbGVjdGlvbiAoZmlsZS1iYXNlZCBydW5zIG9ubHkpJyxcbiAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgIH0sXG4gICAgc2Nyb2xsV2l0aE91dHB1dDoge1xuICAgICAgdGl0bGU6ICdTY3JvbGwgd2l0aCBvdXRwdXQnLFxuICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgZGVmYXVsdDogdHJ1ZSxcbiAgICB9LFxuICAgIHN0b3BPblJlcnVuOiB7XG4gICAgICB0aXRsZTogJ1N0b3AgcnVubmluZyBwcm9jZXNzIG9uIHJlcnVuJyxcbiAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgIH0sXG4gICAgY3dkQmVoYXZpb3I6IHtcbiAgICAgIHRpdGxlOiAnRGVmYXVsdCBDdXJyZW50IFdvcmtpbmcgRGlyZWN0b3J5IChDV0QpIEJlaGF2aW9yJyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnSWYgbm8gUnVuIE9wdGlvbnMgYXJlIHNldCwgdGhpcyBzZXR0aW5nIGRlY2lkZXMgaG93IHRvIGRldGVybWluZSB0aGUgQ1dEJyxcbiAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgZGVmYXVsdDogJ0ZpcnN0IHByb2plY3QgZGlyZWN0b3J5JyxcbiAgICAgIGVudW06IFtcbiAgICAgICAgJ0ZpcnN0IHByb2plY3QgZGlyZWN0b3J5JyxcbiAgICAgICAgJ1Byb2plY3QgZGlyZWN0b3J5IG9mIHRoZSBzY3JpcHQnLFxuICAgICAgICAnRGlyZWN0b3J5IG9mIHRoZSBzY3JpcHQnLFxuICAgICAgXSxcbiAgICB9LFxuICB9LFxuICAvLyBGb3Igc29tZSByZWFzb24sIHRoZSB0ZXh0IG9mIHRoZXNlIG9wdGlvbnMgZG9lcyBub3Qgc2hvdyBpbiBwYWNrYWdlIHNldHRpbmdzIHZpZXdcbiAgLy8gZGVmYXVsdDogJ2ZpcnN0UHJvaidcbiAgLy8gZW51bTogW1xuICAvLyAgIHt2YWx1ZTogJ2ZpcnN0UHJvaicsIGRlc2NyaXB0aW9uOiAnRmlyc3QgcHJvamVjdCBkaXJlY3RvcnkgKGlmIHRoZXJlIGlzIG9uZSknfVxuICAvLyAgIHt2YWx1ZTogJ3NjcmlwdFByb2onLCBkZXNjcmlwdGlvbjogJ1Byb2plY3QgZGlyZWN0b3J5IG9mIHRoZSBzY3JpcHQgKGlmIHRoZXJlIGlzIG9uZSknfVxuICAvLyAgIHt2YWx1ZTogJ3NjcmlwdERpcicsIGRlc2NyaXB0aW9uOiAnRGlyZWN0b3J5IG9mIHRoZSBzY3JpcHQnfVxuICAvLyBdXG4gIHNjcmlwdFZpZXc6IG51bGwsXG4gIHNjcmlwdE9wdGlvbnNWaWV3OiBudWxsLFxuICBzY3JpcHRQcm9maWxlUnVuVmlldzogbnVsbCxcbiAgc2NyaXB0T3B0aW9uczogbnVsbCxcbiAgc2NyaXB0UHJvZmlsZXM6IFtdLFxuXG4gIGFjdGl2YXRlKHN0YXRlKSB7XG4gICAgdGhpcy5zY3JpcHRWaWV3ID0gbmV3IFNjcmlwdFZpZXcoc3RhdGUuc2NyaXB0Vmlld1N0YXRlKTtcbiAgICB0aGlzLnNjcmlwdE9wdGlvbnMgPSBuZXcgU2NyaXB0T3B0aW9ucygpO1xuICAgIHRoaXMuc2NyaXB0T3B0aW9uc1ZpZXcgPSBuZXcgU2NyaXB0T3B0aW9uc1ZpZXcodGhpcy5zY3JpcHRPcHRpb25zKTtcblxuICAgIC8vIHByb2ZpbGVzIGxvYWRpbmdcbiAgICB0aGlzLnNjcmlwdFByb2ZpbGVzID0gW107XG4gICAgaWYgKHN0YXRlLnByb2ZpbGVzKSB7XG4gICAgICBmb3IgKGNvbnN0IHByb2ZpbGUgb2Ygc3RhdGUucHJvZmlsZXMpIHtcbiAgICAgICAgY29uc3Qgc28gPSBTY3JpcHRPcHRpb25zLmNyZWF0ZUZyb21PcHRpb25zKHByb2ZpbGUubmFtZSwgcHJvZmlsZSk7XG4gICAgICAgIHRoaXMuc2NyaXB0UHJvZmlsZXMucHVzaChzbyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5zY3JpcHRQcm9maWxlUnVuVmlldyA9IG5ldyBTY3JpcHRQcm9maWxlUnVuVmlldyh0aGlzLnNjcmlwdFByb2ZpbGVzKTtcblxuICAgIGNvbnN0IGNvZGVDb250ZXh0QnVpbGRlciA9IG5ldyBDb2RlQ29udGV4dEJ1aWxkZXIoKTtcbiAgICBjb25zdCBydW5uZXIgPSBuZXcgUnVubmVyKHRoaXMuc2NyaXB0T3B0aW9ucyk7XG5cbiAgICBjb25zdCBvYnNlcnZlciA9IG5ldyBWaWV3UnVudGltZU9ic2VydmVyKHRoaXMuc2NyaXB0Vmlldyk7XG5cbiAgICB0aGlzLnJ1bnRpbWUgPSBuZXcgUnVudGltZShydW5uZXIsIGNvZGVDb250ZXh0QnVpbGRlciwgW29ic2VydmVyXSk7XG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpO1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20td29ya3NwYWNlJywge1xuICAgICAgJ2NvcmU6Y2FuY2VsJzogKCkgPT4gdGhpcy5jbG9zZVNjcmlwdFZpZXdBbmRTdG9wUnVubmVyKCksXG4gICAgICAnY29yZTpjbG9zZSc6ICgpID0+IHRoaXMuY2xvc2VTY3JpcHRWaWV3QW5kU3RvcFJ1bm5lcigpLFxuICAgICAgJ3NjcmlwdDpjbG9zZS12aWV3JzogKCkgPT4gdGhpcy5jbG9zZVNjcmlwdFZpZXdBbmRTdG9wUnVubmVyKCksXG4gICAgICAnc2NyaXB0OmNvcHktcnVuLXJlc3VsdHMnOiAoKSA9PiB0aGlzLnNjcmlwdFZpZXcuY29weVJlc3VsdHMoKSxcbiAgICAgICdzY3JpcHQ6a2lsbC1wcm9jZXNzJzogKCkgPT4gdGhpcy5ydW50aW1lLnN0b3AoKSxcbiAgICAgICdzY3JpcHQ6cnVuLWJ5LWxpbmUtbnVtYmVyJzogKCkgPT4gdGhpcy5ydW50aW1lLmV4ZWN1dGUoJ0xpbmUgTnVtYmVyIEJhc2VkJyksXG4gICAgICAnc2NyaXB0OnJ1bic6ICgpID0+IHRoaXMucnVudGltZS5leGVjdXRlKCdTZWxlY3Rpb24gQmFzZWQnKSxcbiAgICB9KSk7XG5cbiAgICAvLyBwcm9maWxlIGNyZWF0ZWRcbiAgICB0aGlzLnNjcmlwdE9wdGlvbnNWaWV3Lm9uUHJvZmlsZVNhdmUoKHByb2ZpbGVEYXRhKSA9PiB7XG4gICAgICAvLyBjcmVhdGUgYW5kIGZpbGwgb3V0IHByb2ZpbGVcbiAgICAgIGNvbnN0IHByb2ZpbGUgPSBTY3JpcHRPcHRpb25zLmNyZWF0ZUZyb21PcHRpb25zKHByb2ZpbGVEYXRhLm5hbWUsIHByb2ZpbGVEYXRhLm9wdGlvbnMpO1xuXG4gICAgICBjb25zdCBjb2RlQ29udGV4dCA9IHRoaXMucnVudGltZS5jb2RlQ29udGV4dEJ1aWxkZXIuYnVpbGRDb2RlQ29udGV4dChcbiAgICAgICAgYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpLCAnU2VsZWN0aW9uIEJhc2VkJyk7XG4gICAgICBwcm9maWxlLmxhbmcgPSBjb2RlQ29udGV4dC5sYW5nO1xuXG4gICAgICAvLyBmb3JtYXR0aW5nIGRlc2NyaXB0aW9uXG4gICAgICBjb25zdCBvcHRzID0gcHJvZmlsZS50b09iamVjdCgpO1xuICAgICAgbGV0IGRlc2MgPSBgTGFuZ3VhZ2U6ICR7Y29kZUNvbnRleHQubGFuZ31gO1xuICAgICAgaWYgKG9wdHMuY21kKSB7IGRlc2MgKz0gYCwgQ29tbWFuZDogJHtvcHRzLmNtZH1gOyB9XG4gICAgICBpZiAob3B0cy5jbWRBcmdzICYmIG9wdHMuY21kKSB7IGRlc2MgKz0gYCAke29wdHMuY21kQXJncy5qb2luKCcgJyl9YDsgfVxuXG4gICAgICBwcm9maWxlLmRlc2NyaXB0aW9uID0gZGVzYztcbiAgICAgIHRoaXMuc2NyaXB0UHJvZmlsZXMucHVzaChwcm9maWxlKTtcblxuICAgICAgdGhpcy5zY3JpcHRPcHRpb25zVmlldy5oaWRlKCk7XG4gICAgICB0aGlzLnNjcmlwdFByb2ZpbGVSdW5WaWV3LnNob3coKTtcbiAgICAgIHRoaXMuc2NyaXB0UHJvZmlsZVJ1blZpZXcuc2V0UHJvZmlsZXModGhpcy5zY3JpcHRQcm9maWxlcyk7XG4gICAgfSk7XG5cbiAgICAvLyBwcm9maWxlIGRlbGV0ZWRcbiAgICB0aGlzLnNjcmlwdFByb2ZpbGVSdW5WaWV3Lm9uUHJvZmlsZURlbGV0ZSgocHJvZmlsZSkgPT4ge1xuICAgICAgY29uc3QgaW5kZXggPSB0aGlzLnNjcmlwdFByb2ZpbGVzLmluZGV4T2YocHJvZmlsZSk7XG4gICAgICBpZiAoaW5kZXggPT09IC0xKSB7IHJldHVybjsgfVxuXG4gICAgICBpZiAoaW5kZXggIT09IC0xKSB7IHRoaXMuc2NyaXB0UHJvZmlsZXMuc3BsaWNlKGluZGV4LCAxKTsgfVxuICAgICAgdGhpcy5zY3JpcHRQcm9maWxlUnVuVmlldy5zZXRQcm9maWxlcyh0aGlzLnNjcmlwdFByb2ZpbGVzKTtcbiAgICB9KTtcblxuICAgIC8vIHByb2ZpbGUgcmVuYW1lZFxuICAgIHRoaXMuc2NyaXB0UHJvZmlsZVJ1blZpZXcub25Qcm9maWxlQ2hhbmdlKChkYXRhKSA9PiB7XG4gICAgICBjb25zdCBpbmRleCA9IHRoaXMuc2NyaXB0UHJvZmlsZXMuaW5kZXhPZihkYXRhLnByb2ZpbGUpO1xuICAgICAgaWYgKGluZGV4ID09PSAtMSB8fCAhdGhpcy5zY3JpcHRQcm9maWxlc1tpbmRleF1bZGF0YS5rZXldKSB7IHJldHVybjsgfVxuXG4gICAgICB0aGlzLnNjcmlwdFByb2ZpbGVzW2luZGV4XVtkYXRhLmtleV0gPSBkYXRhLnZhbHVlO1xuICAgICAgdGhpcy5zY3JpcHRQcm9maWxlUnVuVmlldy5zaG93KCk7XG4gICAgICB0aGlzLnNjcmlwdFByb2ZpbGVSdW5WaWV3LnNldFByb2ZpbGVzKHRoaXMuc2NyaXB0UHJvZmlsZXMpO1xuICAgIH0pO1xuXG4gICAgLy8gcHJvZmlsZSByZW5hbWVkXG4gICAgcmV0dXJuIHRoaXMuc2NyaXB0UHJvZmlsZVJ1blZpZXcub25Qcm9maWxlUnVuKChwcm9maWxlKSA9PiB7XG4gICAgICBpZiAoIXByb2ZpbGUpIHsgcmV0dXJuOyB9XG4gICAgICB0aGlzLnJ1bnRpbWUuZXhlY3V0ZSgnU2VsZWN0aW9uIEJhc2VkJywgbnVsbCwgcHJvZmlsZSk7XG4gICAgfSk7XG4gIH0sXG5cbiAgZGVhY3RpdmF0ZSgpIHtcbiAgICB0aGlzLnJ1bnRpbWUuZGVzdHJveSgpO1xuICAgIHRoaXMuc2NyaXB0Vmlldy5yZW1vdmVQYW5lbCgpO1xuICAgIHRoaXMuc2NyaXB0T3B0aW9uc1ZpZXcuY2xvc2UoKTtcbiAgICB0aGlzLnNjcmlwdFByb2ZpbGVSdW5WaWV3LmNsb3NlKCk7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKTtcbiAgICBHcmFtbWFyVXRpbHMuZGVsZXRlVGVtcEZpbGVzKCk7XG4gIH0sXG5cbiAgY2xvc2VTY3JpcHRWaWV3QW5kU3RvcFJ1bm5lcigpIHtcbiAgICB0aGlzLnJ1bnRpbWUuc3RvcCgpO1xuICAgIHRoaXMuc2NyaXB0Vmlldy5yZW1vdmVQYW5lbCgpO1xuICB9LFxuXG4gIC8vIFB1YmxpY1xuICAvL1xuICAvLyBTZXJ2aWNlIG1ldGhvZCB0aGF0IHByb3ZpZGVzIHRoZSBkZWZhdWx0IHJ1bnRpbWUgdGhhdCdzIGNvbmZpZ3VyYWJsZSB0aHJvdWdoIEF0b20gZWRpdG9yXG4gIC8vIFVzZSB0aGlzIHNlcnZpY2UgaWYgeW91IHdhbnQgdG8gZGlyZWN0bHkgc2hvdyB0aGUgc2NyaXB0J3Mgb3V0cHV0IGluIHRoZSBBdG9tIGVkaXRvclxuICAvL1xuICAvLyAqKkRvIG5vdCBkZXN0cm95IHRoaXMge1J1bnRpbWV9IGluc3RhbmNlISoqIEJ5IGRvaW5nIHNvIHlvdSdsbCBicmVhayB0aGlzIHBsdWdpbiFcbiAgLy9cbiAgLy8gQWxzbyBub3RlIHRoYXQgdGhlIFNjcmlwdCBwYWNrYWdlIGlzbid0IGFjdGl2YXRlZCB1bnRpbCB5b3UgYWN0dWFsbHkgdHJ5IHRvIHVzZSBpdC5cbiAgLy8gVGhhdCdzIHdoeSB0aGlzIHNlcnZpY2Ugd29uJ3QgYmUgYXV0b21hdGljYWxseSBjb25zdW1lZC4gVG8gYmUgc3VyZSB5b3UgY29uc3VtZSBpdFxuICAvLyB5b3UgbWF5IG5lZWQgdG8gbWFudWFsbHkgYWN0aXZhdGUgdGhlIHBhY2thZ2U6XG4gIC8vXG4gIC8vIGF0b20ucGFja2FnZXMubG9hZFBhY2thZ2UoJ3NjcmlwdCcpLmFjdGl2YXRlTm93KCkgIyB0aGlzIGNvZGUgZG9lc24ndCBpbmNsdWRlIGVycm9yIGhhbmRsaW5nIVxuICAvL1xuICAvLyBzZWUgaHR0cHM6Ly9naXRodWIuY29tL3MxbXBsZXgvQXRvbS1TY3JpcHQtUnVudGltZS1Db25zdW1lci1TYW1wbGUgZm9yIGEgZnVsbCBleGFtcGxlXG4gIHByb3ZpZGVEZWZhdWx0UnVudGltZSgpIHtcbiAgICByZXR1cm4gdGhpcy5ydW50aW1lO1xuICB9LFxuXG4gIC8vIFB1YmxpY1xuICAvL1xuICAvLyBTZXJ2aWNlIG1ldGhvZCB0aGF0IHByb3ZpZGVzIGEgYmxhbmsgcnVudGltZS4gWW91IGFyZSBmcmVlIHRvIGNvbmZpZ3VyZSBhbnkgYXNwZWN0IG9mIGl0OlxuICAvLyAqIEFkZCBvYnNlcnZlciAoYHJ1bnRpbWUuYWRkT2JzZXJ2ZXIob2JzZXJ2ZXIpYCkgLSBzZWUge1ZpZXdSdW50aW1lT2JzZXJ2ZXJ9IGZvciBhbiBleGFtcGxlXG4gIC8vICogY29uZmlndXJlIHNjcmlwdCBvcHRpb25zIChgcnVudGltZS5zY3JpcHRPcHRpb25zYClcbiAgLy9cbiAgLy8gSW4gY29udHJhc3QgdG8gYHByb3ZpZGVEZWZhdWx0UnVudGltZWAgeW91IHNob3VsZCBkaXNwb3NlIHRoaXMge1J1bnRpbWV9IHdoZW5cbiAgLy8geW91IG5vIGxvbmdlciBuZWVkIGl0LlxuICAvL1xuICAvLyBBbHNvIG5vdGUgdGhhdCB0aGUgU2NyaXB0IHBhY2thZ2UgaXNuJ3QgYWN0aXZhdGVkIHVudGlsIHlvdSBhY3R1YWxseSB0cnkgdG8gdXNlIGl0LlxuICAvLyBUaGF0J3Mgd2h5IHRoaXMgc2VydmljZSB3b24ndCBiZSBhdXRvbWF0aWNhbGx5IGNvbnN1bWVkLiBUbyBiZSBzdXJlIHlvdSBjb25zdW1lIGl0XG4gIC8vIHlvdSBtYXkgbmVlZCB0byBtYW51YWxseSBhY3RpdmF0ZSB0aGUgcGFja2FnZTpcbiAgLy9cbiAgLy8gYXRvbS5wYWNrYWdlcy5sb2FkUGFja2FnZSgnc2NyaXB0JykuYWN0aXZhdGVOb3coKSAjIHRoaXMgY29kZSBkb2Vzbid0IGluY2x1ZGUgZXJyb3IgaGFuZGxpbmchXG4gIC8vXG4gIC8vIHNlZSBodHRwczovL2dpdGh1Yi5jb20vczFtcGxleC9BdG9tLVNjcmlwdC1SdW50aW1lLUNvbnN1bWVyLVNhbXBsZSBmb3IgYSBmdWxsIGV4YW1wbGVcbiAgcHJvdmlkZUJsYW5rUnVudGltZSgpIHtcbiAgICBjb25zdCBydW5uZXIgPSBuZXcgUnVubmVyKG5ldyBTY3JpcHRPcHRpb25zKCkpO1xuICAgIGNvbnN0IGNvZGVDb250ZXh0QnVpbGRlciA9IG5ldyBDb2RlQ29udGV4dEJ1aWxkZXIoKTtcblxuICAgIHJldHVybiBuZXcgUnVudGltZShydW5uZXIsIGNvZGVDb250ZXh0QnVpbGRlciwgW10pO1xuICB9LFxuXG4gIHNlcmlhbGl6ZSgpIHtcbiAgICAvLyBUT0RPOiBUcnVlIHNlcmlhbGl6YXRpb24gbmVlZHMgdG8gdGFrZSB0aGUgb3B0aW9ucyB2aWV3IGludG8gYWNjb3VudFxuICAgIC8vICAgICAgIGFuZCBoYW5kbGUgZGVzZXJpYWxpemF0aW9uXG4gICAgY29uc3Qgc2VyaWFsaXplZFByb2ZpbGVzID0gW107XG4gICAgZm9yIChjb25zdCBwcm9maWxlIG9mIHRoaXMuc2NyaXB0UHJvZmlsZXMpIHsgc2VyaWFsaXplZFByb2ZpbGVzLnB1c2gocHJvZmlsZS50b09iamVjdCgpKTsgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIHNjcmlwdFZpZXdTdGF0ZTogdGhpcy5zY3JpcHRWaWV3LnNlcmlhbGl6ZSgpLFxuICAgICAgc2NyaXB0T3B0aW9uc1ZpZXdTdGF0ZTogdGhpcy5zY3JpcHRPcHRpb25zVmlldy5zZXJpYWxpemUoKSxcbiAgICAgIHByb2ZpbGVzOiBzZXJpYWxpemVkUHJvZmlsZXMsXG4gICAgfTtcbiAgfSxcbn07XG4iXX0=