Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/** @babel */

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _atom = require('atom');

var OpenerRegistry = (function (_Disposable) {
  _inherits(OpenerRegistry, _Disposable);

  function OpenerRegistry() {
    _classCallCheck(this, OpenerRegistry);

    _get(Object.getPrototypeOf(OpenerRegistry.prototype), 'constructor', this).call(this, function () {
      return _this.disposables.dispose();
    });
    this.openers = new Map();
    this.disposables = new _atom.CompositeDisposable();

    var _this = this;

    this.initializeOpeners();
  }

  _createClass(OpenerRegistry, [{
    key: 'initializeOpeners',
    value: function initializeOpeners() {
      var schema = atom.config.getSchema('latex.opener');
      var dir = _path2['default'].join(__dirname, 'openers');
      var ext = '.js';
      for (var openerName of schema['enum']) {
        if (openerName !== 'automatic') {
          var _name = openerName + '-opener';
          var OpenerImpl = require(_path2['default'].format({ dir: dir, name: _name, ext: ext }));
          var _opener = new OpenerImpl();
          this.disposables.add(_opener);
          this.openers.set(openerName, _opener);
        }
      }
    }
  }, {
    key: 'checkRuntimeDependencies',
    value: function checkRuntimeDependencies() {
      var pdfOpeners = Array.from(this.getCandidateOpeners('foo.pdf').keys());
      if (pdfOpeners.length) {
        latex.log.info('The following PDF capable openers were found: ' + pdfOpeners.join(', ') + '.');
      } else {
        latex.log.error('No PDF capable openers were found.');
      }

      var psOpeners = Array.from(this.getCandidateOpeners('foo.ps').keys());
      if (psOpeners.length) {
        latex.log.info('The following PS capable openers were found: ' + psOpeners.join(', ') + '.');
      } else {
        latex.log.warning('No PS capable openers were found.');
      }

      var dviOpeners = Array.from(this.getCandidateOpeners('foo.dvi').keys());
      if (dviOpeners.length) {
        latex.log.info('The following DVI capable openers were found: ' + dviOpeners.join(', ') + '.');
      } else {
        latex.log.warning('No DVI capable openers were found.');
      }
    }
  }, {
    key: 'open',
    value: _asyncToGenerator(function* (filePath, texPath, lineNumber) {
      var name = atom.config.get('latex.opener');
      var opener = this.openers.get(name);

      if (!opener || !opener.canOpen(filePath)) {
        opener = this.findOpener(filePath);
      }

      if (opener) {
        return opener.open(filePath, texPath, lineNumber);
      } else {
        latex.log.warning('No opener found that can open ' + filePath + '.');
      }
    })
  }, {
    key: 'getCandidateOpeners',
    value: function getCandidateOpeners(filePath) {
      var candidates = new Map();
      for (var _ref3 of this.openers.entries()) {
        var _ref2 = _slicedToArray(_ref3, 2);

        var _name2 = _ref2[0];
        var _opener2 = _ref2[1];

        if (_opener2.canOpen(filePath)) candidates.set(_name2, _opener2);
      }
      return candidates;
    }
  }, {
    key: 'findOpener',
    value: function findOpener(filePath) {
      var openResultInBackground = atom.config.get('latex.openResultInBackground');
      var enableSynctex = atom.config.get('latex.enableSynctex');
      var candidates = Array.from(this.getCandidateOpeners(filePath).values());

      if (!candidates.length) return;

      var rankedCandidates = _lodash2['default'].orderBy(candidates, [function (opener) {
        return opener.hasSynctex();
      }, function (opener) {
        return opener.canOpenInBackground();
      }], ['desc', 'desc']);

      if (enableSynctex) {
        // If the user wants openResultInBackground also and there is an opener
        // that supports that and SyncTeX it will be the first one because of
        // the priority sort.
        var _opener3 = rankedCandidates.find(function (opener) {
          return opener.hasSynctex();
        });
        if (_opener3) return _opener3;
      }

      if (openResultInBackground) {
        var _opener4 = rankedCandidates.find(function (opener) {
          return opener.canOpenInBackground();
        });
        if (_opener4) return _opener4;
      }

      return rankedCandidates[0];
    }
  }]);

  return OpenerRegistry;
})(_atom.Disposable);

exports['default'] = OpenerRegistry;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2JpbGx5Ly5hdG9tL3BhY2thZ2VzL2xhdGV4L2xpYi9vcGVuZXItcmVnaXN0cnkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7c0JBRWMsUUFBUTs7OztvQkFDTCxNQUFNOzs7O29CQUN5QixNQUFNOztJQUVqQyxjQUFjO1lBQWQsY0FBYzs7QUFJckIsV0FKTyxjQUFjLEdBSWxCOzBCQUpJLGNBQWM7O0FBSy9CLCtCQUxpQixjQUFjLDZDQUt6QjthQUFNLE1BQUssV0FBVyxDQUFDLE9BQU8sRUFBRTtLQUFBLEVBQUM7U0FKekMsT0FBTyxHQUFHLElBQUksR0FBRyxFQUFFO1NBQ25CLFdBQVcsR0FBRywrQkFBeUI7Ozs7QUFJckMsUUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUE7R0FDekI7O2VBUGtCLGNBQWM7O1dBU2YsNkJBQUc7QUFDbkIsVUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLENBQUE7QUFDcEQsVUFBTSxHQUFHLEdBQUcsa0JBQUssSUFBSSxDQUFDLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQTtBQUMzQyxVQUFNLEdBQUcsR0FBRyxLQUFLLENBQUE7QUFDakIsV0FBSyxJQUFNLFVBQVUsSUFBSSxNQUFNLFFBQUssRUFBRTtBQUNwQyxZQUFJLFVBQVUsS0FBSyxXQUFXLEVBQUU7QUFDOUIsY0FBTSxLQUFJLEdBQU0sVUFBVSxZQUFTLENBQUE7QUFDbkMsY0FBTSxVQUFVLEdBQUcsT0FBTyxDQUFDLGtCQUFLLE1BQU0sQ0FBQyxFQUFFLEdBQUcsRUFBSCxHQUFHLEVBQUUsSUFBSSxFQUFKLEtBQUksRUFBRSxHQUFHLEVBQUgsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFBO0FBQzNELGNBQU0sT0FBTSxHQUFHLElBQUksVUFBVSxFQUFFLENBQUE7QUFDL0IsY0FBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsT0FBTSxDQUFDLENBQUE7QUFDNUIs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QzVELFVBQU0sVUFBVSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLFFBQVEsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUE7O0FBRTFFLFVBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFLE9BQU07O0FBRTlCLFVBQU0sZ0JBQWdCLEdBQUcsb0JBQUUsT0FBTyxDQUFDLFVBQVUsRUFDM0MsQ0FBQyxVQUFBLE1BQU07ZUFBSSxNQUFNLENBQUMsVUFBVSxFQUFFO09BQUEsRUFBRSxVQUFBLE1BQU07ZUFBSSxNQUFNLENBQUMsbUJBQW1CLEVBQUU7T0FBQSxDQUFDLEVBQ3ZFLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUE7O0FBRW5CLFVBQUksYUFBYSxFQUFFOzs7O0FBSWpCLFlBQU0sUUFBTSxHQUFHLGdCQUFnQixDQUFDLElBQUksQ0FBQyxVQUFBLE1BQU07aUJBQUksTUFBTSxDQUFDLFVBQVUsRUFBRTtTQUFBLENBQUMsQ0FBQTtBQUNuRSxZQUFJLFFBQU0sRUFBRSxPQUFPLFFBQU0sQ0FBQTtPQUMxQjs7QUFFRCxVQUFJLHNCQUFzQixFQUFFO0FBQzFCLFlBQU0sUUFBTSxHQUFHLGdCQUFnQixDQUFDLElBQUksQ0FBQyxVQUFBLE1BQU07aUJBQUksTUFBTSxDQUFDLG1CQUFtQixFQUFFO1NBQUEsQ0FBQyxDQUFBO0FBQzVFLFlBQUksUUFBTSxFQUFFLE9BQU8sUUFBTSxDQUFBO09BQzFCOztBQUVELGFBQU8sZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUE7S0FDM0I7OztTQS9Ga0IsY0FBYzs7O3FCQUFkLGNBQWMiLCJmaWxlIjoiL2hvbWUvYmlsbHkvLmF0b20vcGFja2FnZXMvbGF0ZXgvbGliL29wZW5lci1yZWdpc3RyeS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBAYmFiZWwgKi9cblxuaW1wb3J0IF8gZnJvbSAnbG9kYXNoJ1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcbmltcG9ydCB7IENvbXBvc2l0ZURpc3Bvc2FibGUsIERpc3Bvc2FibGUgfSBmcm9tICdhdG9tJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBPcGVuZXJSZWdpc3RyeSBleHRlbmRzIERpc3Bvc2FibGUge1xuICBvcGVuZXJzID0gbmV3IE1hcCgpXG4gIGRpc3Bvc2FibGVzID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuXG4gIGNvbnN0cnVjdG9yICgpIHtcbiAgICBzdXBlcigoKSA9PiB0aGlzLmRpc3Bvc2FibGVzLmRpc3Bvc2UoKSlcbiAgICB0aGlzLmluaXRpYWxpemVPcGVuZXJzKClcbiAgfVxuXG4gIGluaXRpYWxpemVPcGVuZXJzICgpIHtcbiAgICBjb25zdCBzY2hlbWEgPSBhdG9tLmNvbmZpZy5nZXRTY2hlbWEoJ2xhdGV4Lm9wZW5lcicpXG4gICAgY29uc3QgZGlyID0gcGF0aC5qb2luKF9fZGlybmFtZSwgJ29wZW5lcnMnKVxuICAgIGNvbnN0IGV4dCA9ICcuanMnXG4gICAgZm9yIChjb25zdCBvcGVuZXJOYW1lIG9mIHNjaGVtYS5lbnVtKSB7XG4gICAgICBpZiAob3BlbmVyTmFtZSAhPT0gJ2F1dG9tYXRpYycpIHtcbiAgICAgICAgY29uc3QgbmFtZSA9IGAke29wZW5lck5hbWV9LW9wZW5lcmBcbiAgICAgICAgY29uc3QgT3BlbmVySW1wbCA9IHJlcXVpcmUocGF0aC5mb3JtYXQoeyBkaXIsIG5hbWUsIGV4dCB9KSlcbiAgICAgICAgY29uc3Qgb3BlbmVyID0gbmV3IE9wZW5lckltcGwoKVxuICAgICAgICB0aGlzLmRpc3Bvc2FibGVzLmFkZChvcGVuZXIpXG4gICAgICAgIHRoaXMub3BlbmVycy5zZXQob3BlbmVyTmFtZSwgb3BlbmVyKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGNoZWNrUnVudGltZURlcGVuZGVuY2llcyAoKSB7XG4gICAgY29uc3QgcGRmT3BlbmVycyA9IEFycmF5LmZyb20odGhpcy5nZXRDYW5kaWRhdGVPcGVuZXJzKCdmb28ucGRmJykua2V5cygpKVxuICAgIGlmIChwZGZPcGVuZXJzLmxlbmd0aCkge1xuICAgICAgbGF0ZXgubG9nLmluZm8oYFRoZSBmb2xsb3dpbmcgUERGIGNhcGFibGUgb3BlbmVycyB3ZXJlIGZvdW5kOiAke3BkZk9wZW5lcnMuam9pbignLCAnKX0uYClcbiAgICB9IGVsc2Uge1xuICAgICAgbGF0ZXgubG9nLmVycm9yKCdObyBQREYgY2FwYWJsZSBvcGVuZXJzIHdlcmUgZm91bmQuJylcbiAgICB9XG5cbiAgICBjb25zdCBwc09wZW5lcnMgPSBBcnJheS5mcm9tKHRoaXMuZ2V0Q2FuZGlkYXRlT3BlbmVycygnZm9vLnBzJykua2V5cygpKVxuICAgIGlmIChwc09wZW5lcnMubGVuZ3RoKSB7XG4gICAgICBsYXRleC5sb2cuaW5mbyhgVGhlIGZvbGxvd2luZyBQUyBjYXBhYmxlIG9wZW5lcnMgd2VyZSBmb3VuZDogJHtwc09wZW5lcnMuam9pbignLCAnKX0uYClcbiAgICB9IGVsc2Uge1xuICAgICAgbGF0ZXgubG9nLndhcm5pbmcoJ05vIFBTIGNhcGFibGUgb3BlbmVycyB3ZXJlIGZvdW5kLicpXG4gICAgfVxuXG4gICAgY29uc3QgZHZpT3BlbmVycyA9IEFycmF5LmZyb20odGhpcy5nZXRDYW5kaWRhdGVPcGVuZXJzKCdmb28uZHZpJykua2V5cygpKVxuICAgIGlmIChkdmlPcGVuZXJzLmxlbmd0aCkge1xuICAgICAgbGF0ZXgubG9nLmluZm8oYFRoZSBmb2xsb3dpbmcgRFZJIGNhcGFibGUgb3BlbmVycyB3ZXJlIGZvdW5kOiAke2R2aU9wZW5lcnMuam9pbignLCAnKX0uYClcbiAgICB9IGVsc2Uge1xuICAgICAgbGF0ZXgubG9nLndhcm5pbmcoJ05vIERWSSBjYXBhYmxlIG9wZW5lcnMgd2VyZSBmb3VuZC4nKVxuICAgIH1cbiAgfVxuXG4gIGFzeW5jIG9wZW4gKGZpbGVQYXRoLCB0ZXhQYXRoLCBsaW5lTnVtYmVyKSB7XG4gICAgY29uc3QgbmFtZSA9IGF0b20uY29uZmlnLmdldCgnbGF0ZXgub3BlbmVyJylcbiAgICBsZXQgb3BlbmVyID0gdGhpcy5vcGVuZXJzLmdldChuYW1lKVxuXG4gICAgaWYgKCFvcGVuZXIgfHwgIW9wZW5lci5jYW5PcGVuKGZpbGVQYXRoKSkge1xuICAgICAgb3BlbmVyID0gdGhpcy5maW5kT3BlbmVyKGZpbGVQYXRoKVxuICAgIH1cblxuICAgIGlmIChvcGVuZXIpIHtcbiAgICAgIHJldHVybiBvcGVuZXIub3BlbihmaWxlUGF0aCwgdGV4UGF0aCwgbGluZU51bWJlcilcbiAgICB9IGVsc2Uge1xuICAgICAgbGF0ZXgubG9nLndhcm5pbmcoYE5vIG9wZW5lciBmb3VuZCB0aGF0IGNhbiBvcGVuICR7ZmlsZVBhdGh9LmApXG4gICAgfVxuICB9XG5cbiAgZ2V0Q2FuZGlkYXRlT3BlbmVycyAoZmlsZVBhdGgpIHtcbiAgICBjb25zdCBjYW5kaWRhdGVzID0gbmV3IE1hcCgpXG4gICAgZm9yIChjb25zdCBbbmFtZSwgb3BlbmVyXSBvZiB0aGlzLm9wZW5lcnMuZW50cmllcygpKSB7XG4gICAgICBpZiAob3BlbmVyLmNhbk9wZW4oZmlsZVBhdGgpKSBjYW5kaWRhdGVzLnNldChuYW1lLCBvcGVuZXIpXG4gICAgfVxuICAgIHJldHVybiBjYW5kaWRhdGVzXG4gIH1cblxuICBmaW5kT3BlbmVyIChmaWxlUGF0aCkge1xuICAgIGNvbnN0IG9wZW5SZXN1bHRJbkJhY2tncm91bmQgPSBhdG9tLmNvbmZpZy5nZXQoJ2xhdGV4Lm9wZW5SZXN1bHRJbkJhY2tncm91bmQnKVxuICAgIGNvbnN0IGVuYWJsZVN5bmN0ZXggPSBhdG9tLmNvbmZpZy5nZXQoJ2xhdGV4LmVuYWJsZVN5bmN0ZXgnKVxuICAgIGNvbnN0IGNhbmRpZGF0ZXMgPSBBcnJheS5mcm9tKHRoaXMuZ2V0Q2FuZGlkYXRlT3BlbmVycyhmaWxlUGF0aCkudmFsdWVzKCkpXG5cbiAgICBpZiAoIWNhbmRpZGF0ZXMubGVuZ3RoKSByZXR1cm5cblxuICAgIGNvbnN0IHJhbmtlZENhbmRpZGF0ZXMgPSBfLm9yZGVyQnkoY2FuZGlkYXRlcyxcbiAgICAgIFtvcGVuZXIgPT4gb3BlbmVyLmhhc1N5bmN0ZXgoKSwgb3BlbmVyID0+IG9wZW5lci5jYW5PcGVuSW5CYWNrZ3JvdW5kKCldLFxuICAgICAgWydkZXNjJywgJ2Rlc2MnXSlcblxuICAgIGlmIChlbmFibGVTeW5jdGV4KSB7XG4gICAgICAvLyBJZiB0aGUgdXNlciB3YW50cyBvcGVuUmVzdWx0SW5CYWNrZ3JvdW5kIGFsc28gYW5kIHRoZXJlIGlzIGFuIG9wZW5lclxuICAgICAgLy8gdGhhdCBzdXBwb3J0cyB0aGF0IGFuZCBTeW5jVGVYIGl0IHdpbGwgYmUgdGhlIGZpcnN0IG9uZSBiZWNhdXNlIG9mXG4gICAgICAvLyB0aGUgcHJpb3JpdHkgc29ydC5cbiAgICAgIGNvbnN0IG9wZW5lciA9IHJhbmtlZENhbmRpZGF0ZXMuZmluZChvcGVuZXIgPT4gb3BlbmVyLmhhc1N5bmN0ZXgoKSlcbiAgICAgIGlmIChvcGVuZXIpIHJldHVybiBvcGVuZXJcbiAgICB9XG5cbiAgICBpZiAob3BlblJlc3VsdEluQmFja2dyb3VuZCkge1xuICAgICAgY29uc3Qgb3BlbmVyID0gcmFua2VkQ2FuZGlkYXRlcy5maW5kKG9wZW5lciA9PiBvcGVuZXIuY2FuT3BlbkluQmFja2dyb3VuZCgpKVxuICAgICAgaWYgKG9wZW5lcikgcmV0dXJuIG9wZW5lclxuICAgIH1cblxuICAgIHJldHVybiByYW5rZWRDYW5kaWRhdGVzWzBdXG4gIH1cbn1cbiJdfQ==