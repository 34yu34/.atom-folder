Object.defineProperty(exports, '__esModule', {
  value: true
});

// Public: GrammarUtils.CScompiler - a module which predetermines the active
// CoffeeScript compiler and sets an [array] of appropriate command line flags

var _child_process = require('child_process');

'use babel';

var args = ['-e'];
try {
  var coffee = (0, _child_process.execSync)('coffee -h'); // which coffee | xargs readlink'
  if (coffee.toString().match(/--cli/)) {
    // -redux
    args.push('--cli');
  }
} catch (error) {/* Don't throw */}

exports['default'] = { args: args };
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2JpbGx5Ly5hdG9tL3BhY2thZ2VzL3NjcmlwdC9saWIvZ3JhbW1hci11dGlscy9jb2ZmZWUtc2NyaXB0LWNvbXBpbGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7NkJBSXlCLGVBQWU7O0FBSnhDLFdBQVcsQ0FBQzs7QUFNWixJQUFNLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3BCLElBQUk7QUFDRixNQUFNLE1BQU0sR0FBRyw2QkFBUyxXQUFXLENBQUMsQ0FBQztBQUNyQyxNQUFJLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEVBQUU7O0FBQ3BDLFFBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7R0FDcEI7Q0FDRixDQUFDLE9BQU8sS0FBSyxFQUFFLG1CQUFxQjs7cUJBRXRCLEVBQUUsSUFBSSxFQUFKLElBQUksRUFBRSIsImZpbGUiOiIvaG9tZS9iaWxseS8uYXRvbS9wYWNrYWdlcy9zY3JpcHQvbGliL2dyYW1tYXItdXRpbHMvY29mZmVlLXNjcmlwdC1jb21waWxlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG4vLyBQdWJsaWM6IEdyYW1tYXJVdGlscy5DU2NvbXBpbGVyIC0gYSBtb2R1bGUgd2hpY2ggcHJlZGV0ZXJtaW5lcyB0aGUgYWN0aXZlXG4vLyBDb2ZmZWVTY3JpcHQgY29tcGlsZXIgYW5kIHNldHMgYW4gW2FycmF5XSBvZiBhcHByb3ByaWF0ZSBjb21tYW5kIGxpbmUgZmxhZ3NcbmltcG9ydCB7IGV4ZWNTeW5jIH0gZnJvbSAnY2hpbGRfcHJvY2Vzcyc7XG5cbmNvbnN0IGFyZ3MgPSBbJy1lJ107XG50cnkge1xuICBjb25zdCBjb2ZmZWUgPSBleGVjU3luYygnY29mZmVlIC1oJyk7IC8vIHdoaWNoIGNvZmZlZSB8IHhhcmdzIHJlYWRsaW5rJ1xuICBpZiAoY29mZmVlLnRvU3RyaW5nKCkubWF0Y2goLy0tY2xpLykpIHsgLy8gLXJlZHV4XG4gICAgYXJncy5wdXNoKCctLWNsaScpO1xuICB9XG59IGNhdGNoIChlcnJvcikgeyAvKiBEb24ndCB0aHJvdyAqLyB9XG5cbmV4cG9ydCBkZWZhdWx0IHsgYXJncyB9O1xuIl19