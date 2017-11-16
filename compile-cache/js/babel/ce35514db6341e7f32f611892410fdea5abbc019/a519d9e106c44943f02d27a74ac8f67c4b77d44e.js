Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x3, _x4, _x5) { var _again = true; _function: while (_again) { var object = _x3, property = _x4, receiver = _x5; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x3 = parent; _x4 = property; _x5 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/** @babel */

var _opener = require('../opener');

var _opener2 = _interopRequireDefault(_opener);

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

var DBUS_NAMES = {
  applicationObject: '/org/gnome/evince/Evince',
  applicationInterface: 'org.gnome.evince.Application',

  daemonService: 'org.gnome.evince.Daemon',
  daemonObject: '/org/gnome/evince/Daemon',
  daemonInterface: 'org.gnome.evince.Daemon',

  windowInterface: 'org.gnome.evince.Window',

  fdApplicationObject: '/org/gtk/Application/anonymous',
  fdApplicationInterface: 'org.freedesktop.Application'
};

function syncSource(uri, point) {
  var filePath = decodeURI(_url2['default'].parse(uri).pathname);
  atom.focus();
  atom.workspace.open(filePath).then(function (editor) {
    return editor.setCursorBufferPosition(point);
  });
}

var EvinceOpener = (function (_Opener) {
  _inherits(EvinceOpener, _Opener);

  function EvinceOpener() {
    var name = arguments.length <= 0 || arguments[0] === undefined ? 'Evince' : arguments[0];
    var dbusNames = arguments.length <= 1 || arguments[1] === undefined ? DBUS_NAMES : arguments[1];

    _classCallCheck(this, EvinceOpener);

    _get(Object.getPrototypeOf(EvinceOpener.prototype), 'constructor', this).call(this, function () {
      for (var filePath of Array.from(_this.windows.keys())) {
        _this.disposeWindow(filePath);
      }
    });
    this.windows = new Map();

    var _this = this;

    this.name = name;
    this.dbusNames = dbusNames;
    this.initialize();
  }

  _createClass(EvinceOpener, [{
    key: 'initialize',
    value: _asyncToGenerator(function* () {
      try {
        if (process.platform === 'linux') {
          var dbus = require('dbus-native');
          this.bus = dbus.sessionBus();
          this.daemon = yield this.getInterface(this.dbusNames.daemonService, this.dbusNames.daemonObject, this.dbusNames.daemonInterface);
        }
      } catch (e) {}
    })
  }, {
    key: 'getWindow',
    value: _asyncToGenerator(function* (filePath, texPath) {
      var _this2 = this;

      if (this.windows.has(filePath)) {
        return this.windows.get(filePath);
      }

      // First find the internal document name
      var documentName = yield this.findDocument(filePath);

      // Get the application interface and get the window list of the application
      var evinceApplication = yield this.getInterface(documentName, this.dbusNames.applicationObject, this.dbusNames.applicationInterface);
      var windowNames = yield this.getWindowList(evinceApplication);

      // Get the window interface of the of the first (only) window
      var onClosed = function onClosed() {
        return _this2.disposeWindow(filePath);
      };
      var windowInstance = {
        evinceWindow: yield this.getInterface(documentName, windowNames[0], this.dbusNames.windowInterface),
        onClosed: onClosed
      };

      if (this.dbusNames.fdApplicationObject) {
        // Get the GTK/FreeDesktop application interface so we can activate the window
        windowInstance.fdApplication = yield this.getInterface(documentName, this.dbusNames.fdApplicationObject, this.dbusNames.fdApplicationInterface);
      }

      windowInstance.evinceWindow.on('SyncSource', syncSource);
      windowInstance.evinceWindow.on('Closed', windowInstance.onClosed);
      this.windows.set(filePath, windowInstance);

      // This seems to help with future syncs
      yield this.syncView(windowInstance.evinceWindow, texPath, [0, 0], 0);

      return windowInstance;
    })
  }, {
    key: 'disposeWindow',
    value: function disposeWindow(filePath) {
      var windowInstance = this.windows.get(filePath);
      if (windowInstance) {
        windowInstance.evinceWindow.removeListener('SyncSource', syncSource);
        windowInstance.evinceWindow.removeListener('Closed', windowInstance.onClosed);
        this.windows['delete'](filePath);
      }
    }
  }, {
    key: 'open',
    value: _asyncToGenerator(function* (filePath, texPath, lineNumber) {
      try {
        var windowInstance = yield this.getWindow(filePath, texPath);
        if (!this.shouldOpenInBackground() && windowInstance.fdApplication) {
          windowInstance.fdApplication.Activate({});
        }

        // SyncView seems to want to activate the window sometimes
        yield this.syncView(windowInstance.evinceWindow, texPath, [lineNumber, 0], 0);

        return true;
      } catch (error) {
        latex.log.error('An error occured while trying to run ' + this.name + ' opener');
        return false;
      }
    })
  }, {
    key: 'canOpen',
    value: function canOpen(filePath) {
      return !!this.daemon;
    }
  }, {
    key: 'hasSynctex',
    value: function hasSynctex() {
      return true;
    }
  }, {
    key: 'canOpenInBackground',
    value: function canOpenInBackground() {
      return true;
    }
  }, {
    key: 'getInterface',
    value: function getInterface(serviceName, objectPath, interfaceName) {
      var _this3 = this;

      return new Promise(function (resolve, reject) {
        _this3.bus.getInterface(serviceName, objectPath, interfaceName, function (error, interfaceInstance) {
          if (error) {
            reject(error);
          } else {
            resolve(interfaceInstance);
          }
        });
      });
    }
  }, {
    key: 'getWindowList',
    value: function getWindowList(evinceApplication) {
      return new Promise(function (resolve, reject) {
        evinceApplication.GetWindowList(function (error, windowNames) {
          if (error) {
            reject(error);
          } else {
            resolve(windowNames);
          }
        });
      });
    }
  }, {
    key: 'syncView',
    value: function syncView(evinceWindow, source, point, timestamp) {
      return new Promise(function (resolve, reject) {
        evinceWindow.SyncView(source, point, timestamp, function (error) {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        });
      });
    }
  }, {
    key: 'findDocument',
    value: function findDocument(filePath) {
      var _this4 = this;

      return new Promise(function (resolve, reject) {
        var uri = _url2['default'].format({
          protocol: 'file:',
          slashes: true,
          pathname: encodeURI(filePath)
        });

        _this4.daemon.FindDocument(uri, true, function (error, documentName) {
          if (error) {
            reject(error);
          } else {
            resolve(documentName);
          }
        });
      });
    }
  }]);

  return EvinceOpener;
})(_opener2['default']);

exports['default'] = EvinceOpener;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2JpbGx5Ly5hdG9tL3BhY2thZ2VzL2xhdGV4L2xpYi9vcGVuZXJzL2V2aW5jZS1vcGVuZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7O3NCQUVtQixXQUFXOzs7O21CQUNkLEtBQUs7Ozs7QUFFckIsSUFBTSxVQUFVLEdBQUc7QUFDakIsbUJBQWlCLEVBQUUsMEJBQTBCO0FBQzdDLHNCQUFvQixFQUFFLDhCQUE4Qjs7QUFFcEQsZUFBYSxFQUFFLHlCQUF5QjtBQUN4QyxjQUFZLEVBQUUsMEJBQTBCO0FBQ3hDLGlCQUFlLEVBQUUseUJBQXlCOztBQUUxQyxpQkFBZSxFQUFFLHlCQUF5Qjs7QUFFMUMscUJBQW1CLEVBQUUsZ0NBQWdDO0FBQ3JELHdCQUFzQixFQUFFLDZCQUE2QjtDQUN0RCxDQUFBOztBQUVELFNBQVMsVUFBVSxDQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUU7QUFDL0IsTUFBTSxRQUFRLEdBQUcsU0FBUyxDQUFDLGlCQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQTtBQUNuRCxNQUFJLENBQUMsS0FBSyxFQUFFLENBQUE7QUFDWixNQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQSxNQUFNO1dBQUksTUFBTSxDQUFDLHVCQUF1QixDQUFDLEtBQUssQ0FBQztHQUFBLENBQUMsQ0FBQTtDQUNwRjs7SUFFb0IsWUFBWTtZQUFaLFlBQVk7O0FBR25CLFdBSE8sWUFBWSxHQUd1QjtRQUF6QyxJQUFJLHlEQUFHLFFBQVE7UUFBRSxTQUFTLHlEQUFHLFVBQVU7OzBCQUhqQyxZQUFZOztBQUk3QiwrQkFKaUIsWUFBWSw2Q0FJdkIsWUFBTTtBQUNWLFdBQUssSUFBTSxRQUFRLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFLLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFO0FBQ3RELGNBQUssYUFBYSxDQUFDLFFB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RyxpQkFBSSxNQUFNLENBQUM7QUFDckIsa0JBQVEsRUFBRSxPQUFPO0FBQ2pCLGlCQUFPLEVBQUUsSUFBSTtBQUNiLGtCQUFRLEVBQUUsU0FBUyxDQUFDLFFBQVEsQ0FBQztTQUM5QixDQUFDLENBQUE7O0FBRUYsZUFBSyxNQUFNLENBQUMsWUFBWSxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsVUFBQyxLQUFLLEVBQUUsWUFBWSxFQUFLO0FBQzNELGNBQUksS0FBSyxFQUFFO0FBQ1Qsa0JBQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQTtXQUNkLE1BQU07QUFDTCxtQkFBTyxDQUFDLFlBQVksQ0FBQyxDQUFBO1dBQ3RCO1NBQ0YsQ0FBQyxDQUFBO09BQ0gsQ0FBQyxDQUFBO0tBQ0g7OztTQXBKa0IsWUFBWTs7O3FCQUFaLFlBQVkiLCJmaWxlIjoiL2hvbWUvYmlsbHkvLmF0b20vcGFja2FnZXMvbGF0ZXgvbGliL29wZW5lcnMvZXZpbmNlLW9wZW5lci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBAYmFiZWwgKi9cblxuaW1wb3J0IE9wZW5lciBmcm9tICcuLi9vcGVuZXInXG5pbXBvcnQgdXJsIGZyb20gJ3VybCdcblxuY29uc3QgREJVU19OQU1FUyA9IHtcbiAgYXBwbGljYXRpb25PYmplY3Q6ICcvb3JnL2dub21lL2V2aW5jZS9FdmluY2UnLFxuICBhcHBsaWNhdGlvbkludGVyZmFjZTogJ29yZy5nbm9tZS5ldmluY2UuQXBwbGljYXRpb24nLFxuXG4gIGRhZW1vblNlcnZpY2U6ICdvcmcuZ25vbWUuZXZpbmNlLkRhZW1vbicsXG4gIGRhZW1vbk9iamVjdDogJy9vcmcvZ25vbWUvZXZpbmNlL0RhZW1vbicsXG4gIGRhZW1vbkludGVyZmFjZTogJ29yZy5nbm9tZS5ldmluY2UuRGFlbW9uJyxcblxuICB3aW5kb3dJbnRlcmZhY2U6ICdvcmcuZ25vbWUuZXZpbmNlLldpbmRvdycsXG5cbiAgZmRBcHBsaWNhdGlvbk9iamVjdDogJy9vcmcvZ3RrL0FwcGxpY2F0aW9uL2Fub255bW91cycsXG4gIGZkQXBwbGljYXRpb25JbnRlcmZhY2U6ICdvcmcuZnJlZWRlc2t0b3AuQXBwbGljYXRpb24nXG59XG5cbmZ1bmN0aW9uIHN5bmNTb3VyY2UgKHVyaSwgcG9pbnQpIHtcbiAgY29uc3QgZmlsZVBhdGggPSBkZWNvZGVVUkkodXJsLnBhcnNlKHVyaSkucGF0aG5hbWUpXG4gIGF0b20uZm9jdXMoKVxuICBhdG9tLndvcmtzcGFjZS5vcGVuKGZpbGVQYXRoKS50aGVuKGVkaXRvciA9PiBlZGl0b3Iuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24ocG9pbnQpKVxufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFdmluY2VPcGVuZXIgZXh0ZW5kcyBPcGVuZXIge1xuICB3aW5kb3dzID0gbmV3IE1hcCgpXG5cbiAgY29uc3RydWN0b3IgKG5hbWUgPSAnRXZpbmNlJywgZGJ1c05hbWVzID0gREJVU19OQU1FUykge1xuICAgIHN1cGVyKCgpID0+IHtcbiAgICAgIGZvciAoY29uc3QgZmlsZVBhdGggb2YgQXJyYXkuZnJvbSh0aGlzLndpbmRvd3Mua2V5cygpKSkge1xuICAgICAgICB0aGlzLmRpc3Bvc2VXaW5kb3coZmlsZVBhdGgpXG4gICAgICB9XG4gICAgfSlcbiAgICB0aGlzLm5hbWUgPSBuYW1lXG4gICAgdGhpcy5kYnVzTmFtZXMgPSBkYnVzTmFtZXNcbiAgICB0aGlzLmluaXRpYWxpemUoKVxuICB9XG5cbiAgYXN5bmMgaW5pdGlhbGl6ZSAoKSB7XG4gICAgdHJ5IHtcbiAgICAgIGlmIChwcm9jZXNzLnBsYXRmb3JtID09PSAnbGludXgnKSB7XG4gICAgICAgIGNvbnN0IGRidXMgPSByZXF1aXJlKCdkYnVzLW5hdGl2ZScpXG4gICAgICAgIHRoaXMuYnVzID0gZGJ1cy5zZXNzaW9uQnVzKClcbiAgICAgICAgdGhpcy5kYWVtb24gPSBhd2FpdCB0aGlzLmdldEludGVyZmFjZSh0aGlzLmRidXNOYW1lcy5kYWVtb25TZXJ2aWNlLCB0aGlzLmRidXNOYW1lcy5kYWVtb25PYmplY3QsIHRoaXMuZGJ1c05hbWVzLmRhZW1vbkludGVyZmFjZSlcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7fVxuICB9XG5cbiAgYXN5bmMgZ2V0V2luZG93IChmaWxlUGF0aCwgdGV4UGF0aCkge1xuICAgIGlmICh0aGlzLndpbmRvd3MuaGFzKGZpbGVQYXRoKSkge1xuICAgICAgcmV0dXJuIHRoaXMud2luZG93cy5nZXQoZmlsZVBhdGgpXG4gICAgfVxuXG4gICAgLy8gRmlyc3QgZmluZCB0aGUgaW50ZXJuYWwgZG9jdW1lbnQgbmFtZVxuICAgIGNvbnN0IGRvY3VtZW50TmFtZSA9IGF3YWl0IHRoaXMuZmluZERvY3VtZW50KGZpbGVQYXRoKVxuXG4gICAgLy8gR2V0IHRoZSBhcHBsaWNhdGlvbiBpbnRlcmZhY2UgYW5kIGdldCB0aGUgd2luZG93IGxpc3Qgb2YgdGhlIGFwcGxpY2F0aW9uXG4gICAgY29uc3QgZXZpbmNlQXBwbGljYXRpb24gPSBhd2FpdCB0aGlzLmdldEludGVyZmFjZShkb2N1bWVudE5hbWUsIHRoaXMuZGJ1c05hbWVzLmFwcGxpY2F0aW9uT2JqZWN0LCB0aGlzLmRidXNOYW1lcy5hcHBsaWNhdGlvbkludGVyZmFjZSlcbiAgICBjb25zdCB3aW5kb3dOYW1lcyA9IGF3YWl0IHRoaXMuZ2V0V2luZG93TGlzdChldmluY2VBcHBsaWNhdGlvbilcblxuICAgIC8vIEdldCB0aGUgd2luZG93IGludGVyZmFjZSBvZiB0aGUgb2YgdGhlIGZpcnN0IChvbmx5KSB3aW5kb3dcbiAgICBjb25zdCBvbkNsb3NlZCA9ICgpID0+IHRoaXMuZGlzcG9zZVdpbmRvdyhmaWxlUGF0aClcbiAgICBjb25zdCB3aW5kb3dJbnN0YW5jZSA9IHtcbiAgICAgIGV2aW5jZVdpbmRvdzogYXdhaXQgdGhpcy5nZXRJbnRlcmZhY2UoZG9jdW1lbnROYW1lLCB3aW5kb3dOYW1lc1swXSwgdGhpcy5kYnVzTmFtZXMud2luZG93SW50ZXJmYWNlKSxcbiAgICAgIG9uQ2xvc2VkXG4gICAgfVxuXG4gICAgaWYgKHRoaXMuZGJ1c05hbWVzLmZkQXBwbGljYXRpb25PYmplY3QpIHtcbiAgICAgIC8vIEdldCB0aGUgR1RLL0ZyZWVEZXNrdG9wIGFwcGxpY2F0aW9uIGludGVyZmFjZSBzbyB3ZSBjYW4gYWN0aXZhdGUgdGhlIHdpbmRvd1xuICAgICAgd2luZG93SW5zdGFuY2UuZmRBcHBsaWNhdGlvbiA9IGF3YWl0IHRoaXMuZ2V0SW50ZXJmYWNlKGRvY3VtZW50TmFtZSwgdGhpcy5kYnVzTmFtZXMuZmRBcHBsaWNhdGlvbk9iamVjdCwgdGhpcy5kYnVzTmFtZXMuZmRBcHBsaWNhdGlvbkludGVyZmFjZSlcbiAgICB9XG5cbiAgICB3aW5kb3dJbnN0YW5jZS5ldmluY2VXaW5kb3cub24oJ1N5bmNTb3VyY2UnLCBzeW5jU291cmNlKVxuICAgIHdpbmRvd0luc3RhbmNlLmV2aW5jZVdpbmRvdy5vbignQ2xvc2VkJywgd2luZG93SW5zdGFuY2Uub25DbG9zZWQpXG4gICAgdGhpcy53aW5kb3dzLnNldChmaWxlUGF0aCwgd2luZG93SW5zdGFuY2UpXG5cbiAgICAvLyBUaGlzIHNlZW1zIHRvIGhlbHAgd2l0aCBmdXR1cmUgc3luY3NcbiAgICBhd2FpdCB0aGlzLnN5bmNWaWV3KHdpbmRvd0luc3RhbmNlLmV2aW5jZVdpbmRvdywgdGV4UGF0aCwgWzAsIDBdLCAwKVxuXG4gICAgcmV0dXJuIHdpbmRvd0luc3RhbmNlXG4gIH1cblxuICBkaXNwb3NlV2luZG93IChmaWxlUGF0aCkge1xuICAgIGNvbnN0IHdpbmRvd0luc3RhbmNlID0gdGhpcy53aW5kb3dzLmdldChmaWxlUGF0aClcbiAgICBpZiAod2luZG93SW5zdGFuY2UpIHtcbiAgICAgIHdpbmRvd0luc3RhbmNlLmV2aW5jZVdpbmRvdy5yZW1vdmVMaXN0ZW5lcignU3luY1NvdXJjZScsIHN5bmNTb3VyY2UpXG4gICAgICB3aW5kb3dJbnN0YW5jZS5ldmluY2VXaW5kb3cucmVtb3ZlTGlzdGVuZXIoJ0Nsb3NlZCcsIHdpbmRvd0luc3RhbmNlLm9uQ2xvc2VkKVxuICAgICAgdGhpcy53aW5kb3dzLmRlbGV0ZShmaWxlUGF0aClcbiAgICB9XG4gIH1cblxuICBhc3luYyBvcGVuIChmaWxlUGF0aCwgdGV4UGF0aCwgbGluZU51bWJlcikge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCB3aW5kb3dJbnN0YW5jZSA9IGF3YWl0IHRoaXMuZ2V0V2luZG93KGZpbGVQYXRoLCB0ZXhQYXRoKVxuICAgICAgaWYgKCF0aGlzLnNob3VsZE9wZW5JbkJhY2tncm91bmQoKSAmJiB3aW5kb3dJbnN0YW5jZS5mZEFwcGxpY2F0aW9uKSB7XG4gICAgICAgIHdpbmRvd0luc3RhbmNlLmZkQXBwbGljYXRpb24uQWN0aXZhdGUoe30pXG4gICAgICB9XG5cbiAgICAgIC8vIFN5bmNWaWV3IHNlZW1zIHRvIHdhbnQgdG8gYWN0aXZhdGUgdGhlIHdpbmRvdyBzb21ldGltZXNcbiAgICAgIGF3YWl0IHRoaXMuc3luY1ZpZXcod2luZG93SW5zdGFuY2UuZXZpbmNlV2luZG93LCB0ZXhQYXRoLCBbbGluZU51bWJlciwgMF0sIDApXG5cbiAgICAgIHJldHVybiB0cnVlXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGxhdGV4LmxvZy5lcnJvcihgQW4gZXJyb3Igb2NjdXJlZCB3aGlsZSB0cnlpbmcgdG8gcnVuICR7dGhpcy5uYW1lfSBvcGVuZXJgKVxuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuICB9XG5cbiAgY2FuT3BlbiAoZmlsZVBhdGgpIHtcbiAgICByZXR1cm4gISF0aGlzLmRhZW1vblxuICB9XG5cbiAgaGFzU3luY3RleCAoKSB7XG4gICAgcmV0dXJuIHRydWVcbiAgfVxuXG4gIGNhbk9wZW5JbkJhY2tncm91bmQgKCkge1xuICAgIHJldHVybiB0cnVlXG4gIH1cblxuICBnZXRJbnRlcmZhY2UgKHNlcnZpY2VOYW1lLCBvYmplY3RQYXRoLCBpbnRlcmZhY2VOYW1lKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIHRoaXMuYnVzLmdldEludGVyZmFjZShzZXJ2aWNlTmFtZSwgb2JqZWN0UGF0aCwgaW50ZXJmYWNlTmFtZSwgKGVycm9yLCBpbnRlcmZhY2VJbnN0YW5jZSkgPT4ge1xuICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICByZWplY3QoZXJyb3IpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVzb2x2ZShpbnRlcmZhY2VJbnN0YW5jZSlcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9KVxuICB9XG5cbiAgZ2V0V2luZG93TGlzdCAoZXZpbmNlQXBwbGljYXRpb24pIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgZXZpbmNlQXBwbGljYXRpb24uR2V0V2luZG93TGlzdCgoZXJyb3IsIHdpbmRvd05hbWVzKSA9PiB7XG4gICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgIHJlamVjdChlcnJvcilcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXNvbHZlKHdpbmRvd05hbWVzKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH0pXG4gIH1cblxuICBzeW5jVmlldyAoZXZpbmNlV2luZG93LCBzb3VyY2UsIHBvaW50LCB0aW1lc3RhbXApIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgZXZpbmNlV2luZG93LlN5bmNWaWV3KHNvdXJjZSwgcG9pbnQsIHRpbWVzdGFtcCwgKGVycm9yKSA9PiB7XG4gICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgIHJlamVjdChlcnJvcilcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXNvbHZlKClcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9KVxuICB9XG5cbiAgZmluZERvY3VtZW50IChmaWxlUGF0aCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBjb25zdCB1cmkgPSB1cmwuZm9ybWF0KHtcbiAgICAgICAgcHJvdG9jb2w6ICdmaWxlOicsXG4gICAgICAgIHNsYXNoZXM6IHRydWUsXG4gICAgICAgIHBhdGhuYW1lOiBlbmNvZGVVUkkoZmlsZVBhdGgpXG4gICAgICB9KVxuXG4gICAgICB0aGlzLmRhZW1vbi5GaW5kRG9jdW1lbnQodXJpLCB0cnVlLCAoZXJyb3IsIGRvY3VtZW50TmFtZSkgPT4ge1xuICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICByZWplY3QoZXJyb3IpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVzb2x2ZShkb2N1bWVudE5hbWUpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfSlcbiAgfVxufVxuIl19