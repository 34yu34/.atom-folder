Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/** @babel */

var _child_process = require('child_process');

var _child_process2 = _interopRequireDefault(_child_process);

var _treeKill = require('tree-kill');

var _treeKill2 = _interopRequireDefault(_treeKill);

var _atom = require('atom');

var ProcessManager = (function (_Disposable) {
  _inherits(ProcessManager, _Disposable);

  function ProcessManager() {
    _classCallCheck(this, ProcessManager);

    _get(Object.getPrototypeOf(ProcessManager.prototype), 'constructor', this).call(this, function () {
      return _this.killChildProcesses();
    });
    this.processes = new Set();

    var _this = this;
  }

  _createClass(ProcessManager, [{
    key: 'executeChildProcess',
    value: function executeChildProcess(command) {
      var _this2 = this;

      var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
      var allowKill = options.allowKill;
      var showError = options.showError;

      var execOptions = _objectWithoutProperties(options, ['allowKill', 'showError']);

      return new Promise(function (resolve) {
        // Windows does not like \$ appearing in command lines so only escape
        // if we need to.
        if (process.platform !== 'win32') command = command.replace('$', '\\$');

        var _childProcess$exec = _child_process2['default'].exec(command, execOptions, function (error, stdout, stderr) {
          if (allowKill) {
            _this2.processes['delete'](pid);
          }
          if (error && showError && latex && latex.log) {
            latex.log.error('An error occurred while trying to run "' + command + '" (' + error.code + ').');
          }
          resolve({
            statusCode: error ? error.code : 0,
            stdout: stdout,
            stderr: stderr
          });
        });

        var pid = _childProcess$exec.pid;

        if (allowKill) {
          _this2.processes.add(pid);
        }
      });
    }
  }, {
    key: 'killChildProcesses',
    value: function killChildProcesses() {
      for (var pid of this.processes.values()) {
        (0, _treeKill2['default'])(pid);
      }
      this.processes.clear();
    }
  }]);

  return ProcessManager;
})(_atom.Disposable);

exports['default'] = ProcessManager;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2JpbGx5Ly5hdG9tL3BhY2thZ2VzL2xhdGV4L2xpYi9wcm9jZXNzLW1hbmFnZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7OzZCQUV5QixlQUFlOzs7O3dCQUN2QixXQUFXOzs7O29CQUNELE1BQU07O0lBRVosY0FBYztZQUFkLGNBQWM7O0FBR3JCLFdBSE8sY0FBYyxHQUdsQjswQkFISSxjQUFjOztBQUkvQiwrQkFKaUIsY0FBYyw2Q0FJekI7YUFBTSxNQUFLLGtCQUFrQixFQUFFO0tBQUEsRUFBQztTQUh4QyxTQUFTLEdBQUcsSUFBSSxHQUFHLEVBQUU7OztHQUlwQjs7ZUFMa0IsY0FBYzs7V0FPYiw2QkFBQyxPQUFPLEVBQWdCOzs7VUFBZCxPQUFPLHlEQUFHLEVBQUU7VUFDaEMsU0FBUyxHQUFnQyxPQUFPLENBQWhELFNBQVM7VUFBRSxTQUFTLEdBQXFCLE9BQU8sQ0FBckMsU0FBUzs7VUFBSyxXQUFXLDRCQUFLLE9BQU87O0FBQ3hELGFBQU8sSUFBSSxPQUFPLENBQUMsVUFBQSxPQUFPLEVBQUk7OztBQUc1QixZQUFJLE9BQU8sQ0FBQyxRQUFRLEtBQUssT0FBTyxFQUFFLE9BQU8sR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQTs7aUNBQ3ZELDJCQUFhLElBQUksQ0FBQyxPQUFPLEVBQUUsV0FBVyxFQUFFLFVBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUs7QUFDakYsY0FBSSxTQUFTLEVBQUU7QUFDYixtQkFBSyxTQUFTLFVBQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQTtXQUMzQjtBQUNELGNBQUksS0FBSyxJQUFJLFNBQVMsSUFBSSxLQUFLLElBQUksS0FBSyxDQUFDLEdBQUcsRUFBRTtBQUM1QyxpQkFBSyxDQUFDLEdBQUcsQ0FBQyxLQUFLLDZDQUEyQyxPQUFPLFdBQU0sS0FBSyxDQUFDLElBQUksUUFBSyxDQUFBO1dBQ3ZGO0FBQ0QsaUJBQU8sQ0FBQztBQUNOLHNCQUFVLEVBQUUsS0FBSyxHQUFHLEtBQUssQ0FBQyxJQUFJLEdBQUcsQ0FBQztBQUNsQyxrQkFBTSxFQUFOLE1BQU07QUFDTixrQkFBTSxFQUFOLE1BQU07V0FDUCxDQUFDLENBQUE7U0FDSCxDQUFDOztZQVpNLEdBQUcsc0JBQUgsR0FBRzs7QUFhWCxZQUFJLFNBQVMsRUFBRTtBQUNiLGlCQUFLLFNBQVMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUE7U0FDeEI7T0FDRixDQUFDLENBQUE7S0FDSDs7O1dBRWtCLDhCQUFHO0FBQ3BCLFdBQUssSUFBTSxHQUFHLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsRUFBRTtBQUN6QyxtQ0FBSyxHQUFHLENBQUMsQ0FBQTtPQUNWO0FBQ0QsVUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsQ0FBQTtLQUN2Qjs7O1NBckNrQixjQUFjOzs7cUJBQWQsY0FBYyIsImZpbGUiOiIvaG9tZS9iaWxseS8uYXRvbS9wYWNrYWdlcy9sYXRleC9saWIvcHJvY2Vzcy1tYW5hZ2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBiYWJlbCAqL1xuXG5pbXBvcnQgY2hpbGRQcm9jZXNzIGZyb20gJ2NoaWxkX3Byb2Nlc3MnXG5pbXBvcnQga2lsbCBmcm9tICd0cmVlLWtpbGwnXG5pbXBvcnQgeyBEaXNwb3NhYmxlIH0gZnJvbSAnYXRvbSdcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUHJvY2Vzc01hbmFnZXIgZXh0ZW5kcyBEaXNwb3NhYmxlIHtcbiAgcHJvY2Vzc2VzID0gbmV3IFNldCgpXG5cbiAgY29uc3RydWN0b3IgKCkge1xuICAgIHN1cGVyKCgpID0+IHRoaXMua2lsbENoaWxkUHJvY2Vzc2VzKCkpXG4gIH1cblxuICBleGVjdXRlQ2hpbGRQcm9jZXNzIChjb21tYW5kLCBvcHRpb25zID0ge30pIHtcbiAgICBjb25zdCB7IGFsbG93S2lsbCwgc2hvd0Vycm9yLCAuLi5leGVjT3B0aW9ucyB9ID0gb3B0aW9uc1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgIC8vIFdpbmRvd3MgZG9lcyBub3QgbGlrZSBcXCQgYXBwZWFyaW5nIGluIGNvbW1hbmQgbGluZXMgc28gb25seSBlc2NhcGVcbiAgICAgIC8vIGlmIHdlIG5lZWQgdG8uXG4gICAgICBpZiAocHJvY2Vzcy5wbGF0Zm9ybSAhPT0gJ3dpbjMyJykgY29tbWFuZCA9IGNvbW1hbmQucmVwbGFjZSgnJCcsICdcXFxcJCcpXG4gICAgICBjb25zdCB7IHBpZCB9ID0gY2hpbGRQcm9jZXNzLmV4ZWMoY29tbWFuZCwgZXhlY09wdGlvbnMsIChlcnJvciwgc3Rkb3V0LCBzdGRlcnIpID0+IHtcbiAgICAgICAgaWYgKGFsbG93S2lsbCkge1xuICAgICAgICAgIHRoaXMucHJvY2Vzc2VzLmRlbGV0ZShwaWQpXG4gICAgICAgIH1cbiAgICAgICAgaWYgKGVycm9yICYmIHNob3dFcnJvciAmJiBsYXRleCAmJiBsYXRleC5sb2cpIHtcbiAgICAgICAgICBsYXRleC5sb2cuZXJyb3IoYEFuIGVycm9yIG9jY3VycmVkIHdoaWxlIHRyeWluZyB0byBydW4gXCIke2NvbW1hbmR9XCIgKCR7ZXJyb3IuY29kZX0pLmApXG4gICAgICAgIH1cbiAgICAgICAgcmVzb2x2ZSh7XG4gICAgICAgICAgc3RhdHVzQ29kZTogZXJyb3IgPyBlcnJvci5jb2RlIDogMCxcbiAgICAgICAgICBzdGRvdXQsXG4gICAgICAgICAgc3RkZXJyXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgICAgaWYgKGFsbG93S2lsbCkge1xuICAgICAgICB0aGlzLnByb2Nlc3Nlcy5hZGQocGlkKVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBraWxsQ2hpbGRQcm9jZXNzZXMgKCkge1xuICAgIGZvciAoY29uc3QgcGlkIG9mIHRoaXMucHJvY2Vzc2VzLnZhbHVlcygpKSB7XG4gICAgICBraWxsKHBpZClcbiAgICB9XG4gICAgdGhpcy5wcm9jZXNzZXMuY2xlYXIoKVxuICB9XG59XG4iXX0=