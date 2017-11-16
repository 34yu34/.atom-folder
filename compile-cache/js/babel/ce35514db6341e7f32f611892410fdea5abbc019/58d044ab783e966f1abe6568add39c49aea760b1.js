Object.defineProperty(exports, '__esModule', {
  value: true
});

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

/** @babel */

var _atom = require('atom');

exports['default'] = {
  activate: function activate(serialized) {
    var _this = this;

    this.bootstrap();

    if (serialized && serialized.messages) {
      latex.log.setMessages(serialized.messages);
    }

    this.disposables.add(atom.commands.add('atom-workspace', {
      'latex:build': function latexBuild() {
        return latex.composer.build(false);
      },
      'latex:check-runtime': function latexCheckRuntime() {
        return _this.checkRuntime();
      },
      'latex:clean': function latexClean() {
        return latex.composer.clean();
      },
      'latex:clear-log': function latexClearLog() {
        return latex.log.clear();
      },
      'latex:hide-log': function latexHideLog() {
        return latex.log.hide();
      },
      'latex:kill': function latexKill() {
        return latex.composer.kill();
      },
      'latex:rebuild': function latexRebuild() {
        return latex.composer.build(true);
      },
      'latex:show-log': function latexShowLog() {
        return latex.log.show();
      },
      'latex:sync-log': function latexSyncLog() {
        return latex.log.sync();
      },
      'latex:sync': function latexSync() {
        return latex.composer.sync();
      },
      'latex:toggle-log': function latexToggleLog() {
        return latex.log.toggle();
      }
    }));

    this.disposables.add(atom.workspace.observeTextEditors(function (editor) {
      _this.disposables.add(editor.onDidSave(function () {
        // Let's play it safe; only trigger builds for the active editor.
        var activeEditor = atom.workspace.getActiveTextEditor();
        if (editor === activeEditor && atom.config.get('latex.buildOnSave')) {
          latex.composer.build(false, false);
        }
      }));
    }));

    var MarkerManager = require('./marker-manager');
    this.disposables.add(atom.workspace.observeTextEditors(function (editor) {
      _this.disposables.add(new MarkerManager(editor));
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

  serialize: function serialize() {
    return { messages: latex.log.getMessages(false) };
  },

  consumeStatusBar: function consumeStatusBar(statusBar) {
    this.bootstrap();
    latex.status.attachStatusBar(statusBar);
    return new _atom.Disposable(function () {
      if (global.latex) {
        global.latex.status.detachStatusBar();
      }
    });
  },

  deserializeLog: function deserializeLog(serialized) {
    this.bootstrap();
    var LogDock = require('./views/log-dock');
    return new LogDock();
  },

  bootstrap: function bootstrap() {
    if (!this.disposables) {
      this.disposables = new _atom.CompositeDisposable();
    }

    if (global.latex) {
      return;
    }

    var Latex = require('./latex');
    global.latex = new Latex();
    this.disposables.add(global.latex);
  },

  checkRuntime: _asyncToGenerator(function* () {
    // latex.log.group('LaTeX Check')
    latex.log.clear();
    yield latex.builderRegistry.checkRuntimeDependencies();
    latex.opener.checkRuntimeDependencies();
    // latex.log.groupEnd()
  })
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2JpbGx5Ly5hdG9tL3BhY2thZ2VzL2xhdGV4L2xpYi9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O29CQUVnRCxNQUFNOztxQkFFdkM7QUFDYixVQUFRLEVBQUMsa0JBQUMsVUFBVSxFQUFFOzs7QUFDcEIsUUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFBOztBQUVoQixRQUFJLFVBQVUsSUFBSSxVQUFVLENBQUMsUUFBUSxFQUFFO0FBQ3JDLFdBQUssQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQTtLQUMzQzs7QUFFRCxRQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRTtBQUN2RCxtQkFBYSxFQUFFO2VBQU0sS0FBSyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDO09BQUE7QUFDaEQsMkJBQXFCLEVBQUU7ZUFBTSxNQUFLLFlBQVksRUFBRTtPQUFBO0FBQ2hELG1CQUFhLEVBQUU7ZUFBTSxLQUFLLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRTtPQUFBO0FBQzNDLHVCQUFpQixFQUFFO2VBQU0sS0FBSyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUU7T0FBQTtBQUMxQyxzQkFBZ0IsRUFBRTtlQUFNLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFO09BQUE7QUFDeEMsa0JBQVksRUFBRTtlQUFNLEtBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFO09BQUE7QUFDekMscUJBQWUsRUFBRTtlQUFNLEtBQUssQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQztPQUFBO0FBQ2pELHNCQUFnQixFQUFFO2VBQU0sS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUU7T0FBQTtBQUN4QyxzQkFBZ0IsRUFBRTtlQUFNLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFO09BQUE7QUFD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TUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFBO0dBQ25DOztBQUVELEFBQU0sY0FBWSxvQkFBQyxhQUFHOztBQUVwQixTQUFLLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFBO0FBQ2pCLFVBQU0sS0FBSyxDQUFDLGVBQWUsQ0FBQyx3QkFBd0IsRUFBRSxDQUFBO0FBQ3RELFNBQUssQ0FBQyxNQUFNLENBQUMsd0JBQXdCLEVBQUUsQ0FBQTs7R0FFeEMsQ0FBQTtDQUNGIiwiZmlsZSI6Ii9ob21lL2JpbGx5Ly5hdG9tL3BhY2thZ2VzL2xhdGV4L2xpYi9tYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBiYWJlbCAqL1xuXG5pbXBvcnQgeyBDb21wb3NpdGVEaXNwb3NhYmxlLCBEaXNwb3NhYmxlIH0gZnJvbSAnYXRvbSdcblxuZXhwb3J0IGRlZmF1bHQge1xuICBhY3RpdmF0ZSAoc2VyaWFsaXplZCkge1xuICAgIHRoaXMuYm9vdHN0cmFwKClcblxuICAgIGlmIChzZXJpYWxpemVkICYmIHNlcmlhbGl6ZWQubWVzc2FnZXMpIHtcbiAgICAgIGxhdGV4LmxvZy5zZXRNZXNzYWdlcyhzZXJpYWxpemVkLm1lc3NhZ2VzKVxuICAgIH1cblxuICAgIHRoaXMuZGlzcG9zYWJsZXMuYWRkKGF0b20uY29tbWFuZHMuYWRkKCdhdG9tLXdvcmtzcGFjZScsIHtcbiAgICAgICdsYXRleDpidWlsZCc6ICgpID0+IGxhdGV4LmNvbXBvc2VyLmJ1aWxkKGZhbHNlKSxcbiAgICAgICdsYXRleDpjaGVjay1ydW50aW1lJzogKCkgPT4gdGhpcy5jaGVja1J1bnRpbWUoKSxcbiAgICAgICdsYXRleDpjbGVhbic6ICgpID0+IGxhdGV4LmNvbXBvc2VyLmNsZWFuKCksXG4gICAgICAnbGF0ZXg6Y2xlYXItbG9nJzogKCkgPT4gbGF0ZXgubG9nLmNsZWFyKCksXG4gICAgICAnbGF0ZXg6aGlkZS1sb2cnOiAoKSA9PiBsYXRleC5sb2cuaGlkZSgpLFxuICAgICAgJ2xhdGV4OmtpbGwnOiAoKSA9PiBsYXRleC5jb21wb3Nlci5raWxsKCksXG4gICAgICAnbGF0ZXg6cmVidWlsZCc6ICgpID0+IGxhdGV4LmNvbXBvc2VyLmJ1aWxkKHRydWUpLFxuICAgICAgJ2xhdGV4OnNob3ctbG9nJzogKCkgPT4gbGF0ZXgubG9nLnNob3coKSxcbiAgICAgICdsYXRleDpzeW5jLWxvZyc6ICgpID0+IGxhdGV4LmxvZy5zeW5jKCksXG4gICAgICAnbGF0ZXg6c3luYyc6ICgpID0+IGxhdGV4LmNvbXBvc2VyLnN5bmMoKSxcbiAgICAgICdsYXRleDp0b2dnbGUtbG9nJzogKCkgPT4gbGF0ZXgubG9nLnRvZ2dsZSgpXG4gICAgfSkpXG5cbiAgICB0aGlzLmRpc3Bvc2FibGVzLmFkZChhdG9tLndvcmtzcGFjZS5vYnNlcnZlVGV4dEVkaXRvcnMoZWRpdG9yID0+IHtcbiAgICAgIHRoaXMuZGlzcG9zYWJsZXMuYWRkKGVkaXRvci5vbkRpZFNhdmUoKCkgPT4ge1xuICAgICAgICAvLyBMZXQncyBwbGF5IGl0IHNhZmU7IG9ubHkgdHJpZ2dlciBidWlsZHMgZm9yIHRoZSBhY3RpdmUgZWRpdG9yLlxuICAgICAgICBjb25zdCBhY3RpdmVFZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICAgICAgaWYgKGVkaXRvciA9PT0gYWN0aXZlRWRpdG9yICYmIGF0b20uY29uZmlnLmdldCgnbGF0ZXguYnVpbGRPblNhdmUnKSkge1xuICAgICAgICAgIGxhdGV4LmNvbXBvc2VyLmJ1aWxkKGZhbHNlLCBmYWxzZSlcbiAgICAgICAgfVxuICAgICAgfSkpXG4gICAgfSkpXG5cbiAgICBjb25zdCBNYXJrZXJNYW5hZ2VyID0gcmVxdWlyZSgnLi9tYXJrZXItbWFuYWdlcicpXG4gICAgdGhpcy5kaXNwb3NhYmxlcy5hZGQoYXRvbS53b3Jrc3BhY2Uub2JzZXJ2ZVRleHRFZGl0b3JzKGVkaXRvciA9PiB7XG4gICAgICB0aGlzLmRpc3Bvc2FibGVzLmFkZChuZXcgTWFya2VyTWFuYWdlcihlZGl0b3IpKVxuICAgIH0pKVxuXG4gICAgaWYgKCFhdG9tLmluU3BlY01vZGUoKSkge1xuICAgICAgY29uc3QgY2hlY2tDb25maWdBbmRNaWdyYXRlID0gcmVxdWlyZSgnLi9jb25maWctbWlncmF0b3InKVxuICAgICAgY2hlY2tDb25maWdBbmRNaWdyYXRlKClcbiAgICB9XG4gIH0sXG5cbiAgZGVhY3RpdmF0ZSAoKSB7XG4gICAgaWYgKHRoaXMuZGlzcG9zYWJsZXMpIHtcbiAgICAgIHRoaXMuZGlzcG9zYWJsZXMuZGlzcG9zZSgpXG4gICAgICBkZWxldGUgdGhpcy5kaXNwb3NhYmxlc1xuICAgIH1cblxuICAgIGRlbGV0ZSBnbG9iYWwubGF0ZXhcbiAgfSxcblxuICBzZXJpYWxpemUgKCkge1xuICAgIHJldHVybiB7IG1lc3NhZ2VzOiBsYXRleC5sb2cuZ2V0TWVzc2FnZXMoZmFsc2UpIH1cbiAgfSxcblxuICBjb25zdW1lU3RhdHVzQmFyIChzdGF0dXNCYXIpIHtcbiAgICB0aGlzLmJvb3RzdHJhcCgpXG4gICAgbGF0ZXguc3RhdHVzLmF0dGFjaFN0YXR1c0JhcihzdGF0dXNCYXIpXG4gICAgcmV0dXJuIG5ldyBEaXNwb3NhYmxlKCgpID0+IHtcbiAgICAgIGlmIChnbG9iYWwubGF0ZXgpIHtcbiAgICAgICAgZ2xvYmFsLmxhdGV4LnN0YXR1cy5kZXRhY2hTdGF0dXNCYXIoKVxuICAgICAgfVxuICAgIH0pXG4gIH0sXG5cbiAgZGVzZXJpYWxpemVMb2cgKHNlcmlhbGl6ZWQpIHtcbiAgICB0aGlzLmJvb3RzdHJhcCgpXG4gICAgY29uc3QgTG9nRG9jayA9IHJlcXVpcmUoJy4vdmlld3MvbG9nLWRvY2snKVxuICAgIHJldHVybiBuZXcgTG9nRG9jaygpXG4gIH0sXG5cbiAgYm9vdHN0cmFwICgpIHtcbiAgICBpZiAoIXRoaXMuZGlzcG9zYWJsZXMpIHtcbiAgICAgIHRoaXMuZGlzcG9zYWJsZXMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG4gICAgfVxuXG4gICAgaWYgKGdsb2JhbC5sYXRleCkgeyByZXR1cm4gfVxuXG4gICAgY29uc3QgTGF0ZXggPSByZXF1aXJlKCcuL2xhdGV4JylcbiAgICBnbG9iYWwubGF0ZXggPSBuZXcgTGF0ZXgoKVxuICAgIHRoaXMuZGlzcG9zYWJsZXMuYWRkKGdsb2JhbC5sYXRleClcbiAgfSxcblxuICBhc3luYyBjaGVja1J1bnRpbWUgKCkge1xuICAgIC8vIGxhdGV4LmxvZy5ncm91cCgnTGFUZVggQ2hlY2snKVxuICAgIGxhdGV4LmxvZy5jbGVhcigpXG4gICAgYXdhaXQgbGF0ZXguYnVpbGRlclJlZ2lzdHJ5LmNoZWNrUnVudGltZURlcGVuZGVuY2llcygpXG4gICAgbGF0ZXgub3BlbmVyLmNoZWNrUnVudGltZURlcGVuZGVuY2llcygpXG4gICAgLy8gbGF0ZXgubG9nLmdyb3VwRW5kKClcbiAgfVxufVxuIl19