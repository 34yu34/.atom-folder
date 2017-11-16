Object.defineProperty(exports, '__esModule', {
  value: true
});

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

/** @babel */

var _atom = require('atom');

exports['default'] = {
  activate: function activate() {
    var _this = this;

    this.disposables = new _atom.CompositeDisposable();
    this.bootstrap();

    this.disposables.add(atom.commands.add('atom-workspace', {
      'latex:build': function latexBuild() {
        return latex.composer.build(false);
      },
      'latex:rebuild': function latexRebuild() {
        return latex.composer.build(true);
      },
      'latex:check-runtime': function latexCheckRuntime() {
        return _this.checkRuntime();
      },
      'latex:clean': function latexClean() {
        return latex.composer.clean();
      },
      'latex:sync': function latexSync() {
        return latex.composer.sync();
      },
      'latex:kill': function latexKill() {
        return latex.process.killChildProcesses();
      },
      'latex:sync-log': function latexSyncLog() {
        return latex.log.sync();
      },
      'core:close': function coreClose() {
        return _this.handleHideLogPanel();
      },
      'core:cancel': function coreCancel() {
        return _this.handleHideLogPanel();
      }
    }));

    this.disposables.add(atom.workspace.observeTextEditors(function (editor) {
      _this.disposables.add(editor.onDidSave(function () {
        // Let's play it safe; only trigger builds for the active editor.
        var activeEditor = atom.workspace.getActiveTextEditor();
        if (editor === activeEditor && atom.config.get('latex.buildOnSave')) {
          latex.composer.build();
        }
      }));
    }));

    if (!atom.inSpecMode()) {
      var checkConfigAndMigrate = require('./config-migrator');
      checkConfigAndMigrate();
    }
  },

  deactivate: function deactivate() {
    if (this.disposables) {
      this.disposables.dispose();
      delete this.disposables;
    }

    delete global.latex;
  },

  handleHideLogPanel: function handleHideLogPanel() {
    if (latex && latex.log) {
      latex.log.hide();
    }
  },

  consumeStatusBar: function consumeStatusBar(statusBar) {
    this.bootstrap();
    latex.status.attachStatusBar(statusBar);
    return new _atom.Disposable(function () {
      if (latex) latex.status.detachStatusBar();
    });
  },

  bootstrap: function bootstrap() {
    if (global.latex) {
      return;
    }

    var Latex = require('./latex');
    global.latex = new Latex();
    this.disposables.add(global.latex);
  },

  checkRuntime: _asyncToGenerator(function* () {
    latex.log.group('LaTeX Check');
    yield latex.builderRegistry.checkRuntimeDependencies();
    latex.opener.checkRuntimeDependencies();
    latex.log.groupEnd();
  })
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2JpbGx5Ly5hdG9tL3BhY2thZ2VzL2xhdGV4L2xpYi9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O29CQUVnRCxNQUFNOztxQkFFdkM7QUFDYixVQUFRLEVBQUMsb0JBQUc7OztBQUNWLFFBQUksQ0FBQyxXQUFXLEdBQUcsK0JBQXlCLENBQUE7QUFDNUMsUUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFBOztBQUVoQixRQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRTtBQUN2RCxtQkFBYSxFQUFFO2VBQU0sS0FBSyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDO09BQUE7QUFDaEQscUJBQWUsRUFBRTtlQUFNLEtBQUssQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQztPQUFBO0FBQ2pELDJCQUFxQixFQUFFO2VBQU0sTUFBSyxZQUFZLEVBQUU7T0FBQTtBQUNoRCxtQkFBYSxFQUFFO2VBQU0sS0FBSyxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUU7T0FBQTtBQUMzQyxrQkFBWSxFQUFFO2VBQU0sS0FBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUU7T0FBQTtBQUN6QyxrQkFBWSxFQUFFO2VBQU0sS0FBSyxDQUFDLE9BQU8sQ0FBQyxrQkFBa0IsRUFBRTtPQUFBO0FBQ3RELHNCQUFnQixFQUFFO2VBQU0sS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUU7T0FBQTtBQUN4QyxrQkFBWSxFQUFFO2VBQU0sTUFBSyxrQkFBa0IsRUFBRTtPQUFBO0FBQzdDLG1CQUFhLEVBQUU7ZUFBTSxNQUFLLGtCQUFrQixFQUFFO09BQUE7S0FDL0MsQ0FBQyxDQUFDLENBQUE7O0FBRUgsUUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxVQUFBLE1BQU0sRUFBSTtBQUMvRCxZQUFLLFdBQVcsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxZQUFNOztBQUUxQyxZQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFtQixFQUFFLENBQUE7QUFDekQsWUFBSSxNQUFNLEtBQUssWUFBWSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLG1CQUFtQixDQUFDLEVBQUU7QUFDbkUsZUFBSyxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsQ0FBQTtTQUN2QjtPQUNGLENBQUMsQ0FBQyxDQUFBO0tBQ0osQ0FBQyxDQUFDLENBQUE7O0FBRUgsUUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsRUFBRTtBQUN0QixVQUFNLHFCQUFxQixHQUFHLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFBO0FBQzFELDJCQUFxQixFQUFFLENBQUE7S0FDeEI7R0FDRjs7QUFFRCxZQUFVLEVBQUMsc0JBQUc7QUFDWixRQUFJLElBQUksQ0FBQyxXQUFXLEVBQUU7QUFDcEIsVUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtBQUMxQixhQUFPLElBQUksQ0FBQyxXQUFXLENBQUE7S0FDeEI7O0FBRUQsV0FBTyxNQUFNLENBQUMsS0FBSyxDQUFBO0dBQ3BCOztBQUVELG9CQUFrQixFQUFDLDhCQUFHO0FBQ3BCLFFBQUksS0FBSyxJQUFJLEtBQUssQ0FBQyxHQUFHLEVBQUU7QUFDdEIsV0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQTtLQUNqQjtHQUNGOztBQUVELGtCQUFnQixFQUFDLDBCQUFDLFNBQVMsRUFBRTtBQUMzQixRQUFJLENBQUMsU0FBUyxFQUFFLENBQUE7QUFDaEIsU0FBSyxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUMsU0FBUyxDQUFDLENBQUE7QUFDdkMsV0FBTyxxQkFBZSxZQUFNO0FBQzFCLFVBQUksS0FBSyxFQUFFLEtBQUssQ0FBQyxNQUFNLENBQUMsZUFBZSxFQUFFLENBQUE7S0FDMUMsQ0FBQyxDQUFBO0dBQ0g7O0FBRUQsV0FBUyxFQUFDLHFCQUFHO0FBQ1gsUUFBSSxNQUFNLENBQUMsS0FBSyxFQUFFO0FBQUUsYUFBTTtLQUFFOztBQUU1QixRQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUE7QUFDaEMsVUFBTSxDQUFDLEtBQUssR0FBRyxJQUFJLEtBQUssRUFBRSxDQUFBO0FBQzFCLFFBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQTtHQUNuQzs7QUFFRCxBQUFNLGNBQVksb0JBQUMsYUFBRztBQUNwQixTQUFLLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsQ0FBQTtBQUM5QixVQUFNLEtBQUssQ0FBQyxlQUFlLENBQUMsd0JBQXdCLEVBQUUsQ0FBQTtBQUN0RCxTQUFLLENBQUMsTUFBTSxDQUFDLHdCQUF3QixFQUFFLENBQUE7QUFDdkMsU0FBSyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsQ0FBQTtHQUNyQixDQUFBO0NBQ0YiLCJmaWxlIjoiL2hvbWUvYmlsbHkvLmF0b20vcGFja2FnZXMvbGF0ZXgvbGliL21haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiogQGJhYmVsICovXG5cbmltcG9ydCB7IENvbXBvc2l0ZURpc3Bvc2FibGUsIERpc3Bvc2FibGUgfSBmcm9tICdhdG9tJ1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIGFjdGl2YXRlICgpIHtcbiAgICB0aGlzLmRpc3Bvc2FibGVzID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuICAgIHRoaXMuYm9vdHN0cmFwKClcblxuICAgIHRoaXMuZGlzcG9zYWJsZXMuYWRkKGF0b20uY29tbWFuZHMuYWRkKCdhdG9tLXdvcmtzcGFjZScsIHtcbiAgICAgICdsYXRleDpidWlsZCc6ICgpID0+IGxhdGV4LmNvbXBvc2VyLmJ1aWxkKGZhbHNlKSxcbiAgICAgICdsYXRleDpyZWJ1aWxkJzogKCkgPT4gbGF0ZXguY29tcG9zZXIuYnVpbGQodHJ1ZSksXG4gICAgICAnbGF0ZXg6Y2hlY2stcnVudGltZSc6ICgpID0+IHRoaXMuY2hlY2tSdW50aW1lKCksXG4gICAgICAnbGF0ZXg6Y2xlYW4nOiAoKSA9PiBsYXRleC5jb21wb3Nlci5jbGVhbigpLFxuICAgICAgJ2xhdGV4OnN5bmMnOiAoKSA9PiBsYXRleC5jb21wb3Nlci5zeW5jKCksXG4gICAgICAnbGF0ZXg6a2lsbCc6ICgpID0+IGxhdGV4LnByb2Nlc3Mua2lsbENoaWxkUHJvY2Vzc2VzKCksXG4gICAgICAnbGF0ZXg6c3luYy1sb2cnOiAoKSA9PiBsYXRleC5sb2cuc3luYygpLFxuICAgICAgJ2NvcmU6Y2xvc2UnOiAoKSA9PiB0aGlzLmhhbmRsZUhpZGVMb2dQYW5lbCgpLFxuICAgICAgJ2NvcmU6Y2FuY2VsJzogKCkgPT4gdGhpcy5oYW5kbGVIaWRlTG9nUGFuZWwoKVxuICAgIH0pKVxuXG4gICAgdGhpcy5kaXNwb3NhYmxlcy5hZGQoYXRvbS53b3Jrc3BhY2Uub2JzZXJ2ZVRleHRFZGl0b3JzKGVkaXRvciA9PiB7XG4gICAgICB0aGlzLmRpc3Bvc2FibGVzLmFkZChlZGl0b3Iub25EaWRTYXZlKCgpID0+IHtcbiAgICAgICAgLy8gTGV0J3MgcGxheSBpdCBzYWZlOyBvbmx5IHRyaWdnZXIgYnVpbGRzIGZvciB0aGUgYWN0aXZlIGVkaXRvci5cbiAgICAgICAgY29uc3QgYWN0aXZlRWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgICAgIGlmIChlZGl0b3IgPT09IGFjdGl2ZUVkaXRvciAmJiBhdG9tLmNvbmZpZy5nZXQoJ2xhdGV4LmJ1aWxkT25TYXZlJykpIHtcbiAgICAgICAgICBsYXRleC5jb21wb3Nlci5idWlsZCgpXG4gICAgICAgIH1cbiAgICAgIH0pKVxuICAgIH0pKVxuXG4gICAgaWYgKCFhdG9tLmluU3BlY01vZGUoKSkge1xuICAgICAgY29uc3QgY2hlY2tDb25maWdBbmRNaWdyYXRlID0gcmVxdWlyZSgnLi9jb25maWctbWlncmF0b3InKVxuICAgICAgY2hlY2tDb25maWdBbmRNaWdyYXRlKClcbiAgICB9XG4gIH0sXG5cbiAgZGVhY3RpdmF0ZSAoKSB7XG4gICAgaWYgKHRoaXMuZGlzcG9zYWJsZXMpIHtcbiAgICAgIHRoaXMuZGlzcG9zYWJsZXMuZGlzcG9zZSgpXG4gICAgICBkZWxldGUgdGhpcy5kaXNwb3NhYmxlc1xuICAgIH1cblxuICAgIGRlbGV0ZSBnbG9iYWwubGF0ZXhcbiAgfSxcblxuICBoYW5kbGVIaWRlTG9nUGFuZWwgKCkge1xuICAgIGlmIChsYXRleCAmJiBsYXRleC5sb2cpIHtcbiAgICAgIGxhdGV4LmxvZy5oaWRlKClcbiAgICB9XG4gIH0sXG5cbiAgY29uc3VtZVN0YXR1c0JhciAoc3RhdHVzQmFyKSB7XG4gICAgdGhpcy5ib290c3RyYXAoKVxuICAgIGxhdGV4LnN0YXR1cy5hdHRhY2hTdGF0dXNCYXIoc3RhdHVzQmFyKVxuICAgIHJldHVybiBuZXcgRGlzcG9zYWJsZSgoKSA9PiB7XG4gICAgICBpZiAobGF0ZXgpIGxhdGV4LnN0YXR1cy5kZXRhY2hTdGF0dXNCYXIoKVxuICAgIH0pXG4gIH0sXG5cbiAgYm9vdHN0cmFwICgpIHtcbiAgICBpZiAoZ2xvYmFsLmxhdGV4KSB7IHJldHVybiB9XG5cbiAgICBjb25zdCBMYXRleCA9IHJlcXVpcmUoJy4vbGF0ZXgnKVxuICAgIGdsb2JhbC5sYXRleCA9IG5ldyBMYXRleCgpXG4gICAgdGhpcy5kaXNwb3NhYmxlcy5hZGQoZ2xvYmFsLmxhdGV4KVxuICB9LFxuXG4gIGFzeW5jIGNoZWNrUnVudGltZSAoKSB7XG4gICAgbGF0ZXgubG9nLmdyb3VwKCdMYVRlWCBDaGVjaycpXG4gICAgYXdhaXQgbGF0ZXguYnVpbGRlclJlZ2lzdHJ5LmNoZWNrUnVudGltZURlcGVuZGVuY2llcygpXG4gICAgbGF0ZXgub3BlbmVyLmNoZWNrUnVudGltZURlcGVuZGVuY2llcygpXG4gICAgbGF0ZXgubG9nLmdyb3VwRW5kKClcbiAgfVxufVxuIl19