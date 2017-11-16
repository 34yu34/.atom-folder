'use babel';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var MyPackageView = (function () {
  function MyPackageView(serializedState) {
    _classCallCheck(this, MyPackageView);

    // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('my-package');

    // Create message element
    var message = document.createElement('div');
    message.textContent = 'The MyPackage package is Alive! It\'s ALIVE!';
    message.classList.add('message');
    this.element.appendChild(message);
  }

  // Returns an object that can be retrieved when package is activated

  _createClass(MyPackageView, [{
    key: 'serialize',
    value: function serialize() {}

    // Tear down any state and detach
  }, {
    key: 'destroy',
    value: function destroy() {
      this.element.remove();
    }
  }, {
    key: 'getElement',
    value: function getElement() {
      return this.element;
    }
  }]);

  return MyPackageView;
})();

exports['default'] = MyPackageView;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2JpbGx5L2dpdGh1Yi9teS1wYWNrYWdlL2xpYi9teS1wYWNrYWdlLXZpZXcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsV0FBVyxDQUFDOzs7Ozs7Ozs7O0lBRVMsYUFBYTtBQUVyQixXQUZRLGFBQWEsQ0FFcEIsZUFBZSxFQUFFOzBCQUZWLGFBQWE7OztBQUk5QixRQUFJLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDN0MsUUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDOzs7QUFHekMsUUFBTSxPQUFPLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUM5QyxXQUFPLENBQUMsV0FBVyxHQUFHLDhDQUE4QyxDQUFDO0FBQ3JFLFdBQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ2pDLFFBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0dBQ25DOzs7O2VBWmtCLGFBQWE7O1dBZXZCLHFCQUFHLEVBQUU7Ozs7O1dBR1AsbUJBQUc7QUFDUixVQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDO0tBQ3ZCOzs7V0FFUyxzQkFBRztBQUNYLGFBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQztLQUNyQjs7O1NBeEJrQixhQUFhOzs7cUJBQWIsYUFBYSIsImZpbGUiOiIvaG9tZS9iaWxseS9naXRodWIvbXktcGFja2FnZS9saWIvbXktcGFja2FnZS12aWV3LmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE15UGFja2FnZVZpZXcge1xuXG4gIGNvbnN0cnVjdG9yKHNlcmlhbGl6ZWRTdGF0ZSkge1xuICAgIC8vIENyZWF0ZSByb290IGVsZW1lbnRcbiAgICB0aGlzLmVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnbXktcGFja2FnZScpO1xuXG4gICAgLy8gQ3JlYXRlIG1lc3NhZ2UgZWxlbWVudFxuICAgIGNvbnN0IG1lc3NhZ2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBtZXNzYWdlLnRleHRDb250ZW50ID0gJ1RoZSBNeVBhY2thZ2UgcGFja2FnZSBpcyBBbGl2ZSEgSXRcXCdzIEFMSVZFISc7XG4gICAgbWVzc2FnZS5jbGFzc0xpc3QuYWRkKCdtZXNzYWdlJyk7XG4gICAgdGhpcy5lbGVtZW50LmFwcGVuZENoaWxkKG1lc3NhZ2UpO1xuICB9XG5cbiAgLy8gUmV0dXJucyBhbiBvYmplY3QgdGhhdCBjYW4gYmUgcmV0cmlldmVkIHdoZW4gcGFja2FnZSBpcyBhY3RpdmF0ZWRcbiAgc2VyaWFsaXplKCkge31cblxuICAvLyBUZWFyIGRvd24gYW55IHN0YXRlIGFuZCBkZXRhY2hcbiAgZGVzdHJveSgpIHtcbiAgICB0aGlzLmVsZW1lbnQucmVtb3ZlKCk7XG4gIH1cblxuICBnZXRFbGVtZW50KCkge1xuICAgIHJldHVybiB0aGlzLmVsZW1lbnQ7XG4gIH1cblxufVxuIl19