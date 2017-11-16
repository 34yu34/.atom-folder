(function() {
  var RubyBlockView;

  module.exports = RubyBlockView = (function() {
    function RubyBlockView(serializeState) {
      this.element = document.createElement('div');
      this.element.classList.add('ruby-block');
    }

    RubyBlockView.prototype.destroy = function() {
      return this.element.remove();
    };

    RubyBlockView.prototype.getElement = function() {
      return this.element;
    };

    RubyBlockView.prototype.updateMessage = function(rowNumber) {
      var message, row;
      row = atom.workspace.getActiveTextEditor().lineTextForBufferRow(rowNumber);
      if (this.element.hasChildNodes()) {
        this.element.removeChild(this.element.firstChild);
      }
      message = document.createElement('div');
      message.textContent = "Line: " + (rowNumber + 1) + " " + row;
      message.classList.add('message');
      return this.element.appendChild(message);
    };

    return RubyBlockView;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYmlsbHkvLmF0b20vcGFja2FnZXMvcnVieS1ibG9jay9saWIvcnVieS1ibG9jay12aWV3LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtJQUNTLHVCQUFDLGNBQUQ7TUFFWCxJQUFDLENBQUEsT0FBRCxHQUFXLFFBQVEsQ0FBQyxhQUFULENBQXVCLEtBQXZCO01BQ1gsSUFBQyxDQUFBLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBbkIsQ0FBdUIsWUFBdkI7SUFIVzs7NEJBTWIsT0FBQSxHQUFTLFNBQUE7YUFDUCxJQUFDLENBQUEsT0FBTyxDQUFDLE1BQVQsQ0FBQTtJQURPOzs0QkFHVCxVQUFBLEdBQVksU0FBQTthQUNWLElBQUMsQ0FBQTtJQURTOzs0QkFHWixhQUFBLEdBQWUsU0FBQyxTQUFEO0FBQ2IsVUFBQTtNQUFBLEdBQUEsR0FBTSxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUEsQ0FBb0MsQ0FBQyxvQkFBckMsQ0FBMEQsU0FBMUQ7TUFFTixJQUE2QyxJQUFDLENBQUEsT0FBTyxDQUFDLGFBQVQsQ0FBQSxDQUE3QztRQUFBLElBQUMsQ0FBQSxPQUFPLENBQUMsV0FBVCxDQUFxQixJQUFDLENBQUEsT0FBTyxDQUFDLFVBQTlCLEVBQUE7O01BRUEsT0FBQSxHQUFVLFFBQVEsQ0FBQyxhQUFULENBQXVCLEtBQXZCO01BQ1YsT0FBTyxDQUFDLFdBQVIsR0FBc0IsUUFBQSxHQUFRLENBQUMsU0FBQSxHQUFVLENBQVgsQ0FBUixHQUFxQixHQUFyQixHQUF3QjtNQUM5QyxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQWxCLENBQXNCLFNBQXRCO2FBQ0EsSUFBQyxDQUFBLE9BQU8sQ0FBQyxXQUFULENBQXFCLE9BQXJCO0lBUmE7Ozs7O0FBZGpCIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPVxuY2xhc3MgUnVieUJsb2NrVmlld1xuICBjb25zdHJ1Y3RvcjogKHNlcmlhbGl6ZVN0YXRlKSAtPlxuICAgICMgQ3JlYXRlIHJvb3QgZWxlbWVudFxuICAgIEBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICBAZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdydWJ5LWJsb2NrJylcblxuICAjIFRlYXIgZG93biBhbnkgc3RhdGUgYW5kIGRldGFjaFxuICBkZXN0cm95OiAtPlxuICAgIEBlbGVtZW50LnJlbW92ZSgpXG5cbiAgZ2V0RWxlbWVudDogLT5cbiAgICBAZWxlbWVudFxuXG4gIHVwZGF0ZU1lc3NhZ2U6IChyb3dOdW1iZXIpLT5cbiAgICByb3cgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCkubGluZVRleHRGb3JCdWZmZXJSb3cocm93TnVtYmVyKVxuXG4gICAgQGVsZW1lbnQucmVtb3ZlQ2hpbGQoQGVsZW1lbnQuZmlyc3RDaGlsZCkgaWYgQGVsZW1lbnQuaGFzQ2hpbGROb2RlcygpXG4gICAgIyBDcmVhdGUgbWVzc2FnZSBlbGVtZW50XG4gICAgbWVzc2FnZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgbWVzc2FnZS50ZXh0Q29udGVudCA9IFwiTGluZTogI3tyb3dOdW1iZXIrMX0gI3tyb3d9XCJcbiAgICBtZXNzYWdlLmNsYXNzTGlzdC5hZGQoJ21lc3NhZ2UnKVxuICAgIEBlbGVtZW50LmFwcGVuZENoaWxkKG1lc3NhZ2UpXG4iXX0=
