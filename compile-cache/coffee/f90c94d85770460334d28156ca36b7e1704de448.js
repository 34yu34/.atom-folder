(function() {
  var CompositeDisposable, HeaderImplementationView;

  HeaderImplementationView = require('./header-implementation-view');

  CompositeDisposable = require('atom').CompositeDisposable;

  module.exports = {
    activate: function(state) {
      this.subscriptions = new CompositeDisposable;
      return this.subscriptions.add(atom.commands.add('atom-workspace', {
        'header-implementation:generate': (function(_this) {
          return function() {
            return _this.generate();
          };
        })(this)
      }));
    },
    generate: function() {
      var buffer, editor, path;
      console.log('.cpp file was generated');
      editor = atom.workspace.getActiveTextEditor();
      buffer = editor.getBuffer();
      editor.save();
      path = editor.getPath();
      return buffer.scan(new RegExp("namespace"), function(res) {
        editor.setCursorBufferPosition(res.range.end);
        editor.moveLeft([1]);
        editor.moveToEndOfWord();
        editor.moveToBeginningOfWord();
        editor.selectToEndOfWord();
        return console.log(editor.getSelectedText());
      });
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYmlsbHkvZ2l0aHViL2hlYWRlci1pbXBsZW1lbnRhdGlvbi9saWIvaGVhZGVyLWltcGxlbWVudGF0aW9uLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsd0JBQUEsR0FBMkIsT0FBQSxDQUFRLDhCQUFSOztFQUMxQixzQkFBdUIsT0FBQSxDQUFRLE1BQVI7O0VBRXhCLE1BQU0sQ0FBQyxPQUFQLEdBRUU7SUFBQSxRQUFBLEVBQVUsU0FBQyxLQUFEO01BR1IsSUFBQyxDQUFBLGFBQUQsR0FBaUIsSUFBSTthQUdyQixJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGdCQUFsQixFQUFvQztRQUFBLGdDQUFBLEVBQWtDLENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUE7bUJBQUcsS0FBQyxDQUFBLFFBQUQsQ0FBQTtVQUFIO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFsQztPQUFwQyxDQUFuQjtJQU5RLENBQVY7SUFRQSxRQUFBLEVBQVUsU0FBQTtBQUNSLFVBQUE7TUFBQSxPQUFPLENBQUMsR0FBUixDQUFZLHlCQUFaO01BQ0EsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQTtNQUNULE1BQUEsR0FBUyxNQUFNLENBQUMsU0FBUCxDQUFBO01BQ1QsTUFBTSxDQUFDLElBQVAsQ0FBQTtNQUNBLElBQUEsR0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBO2FBQ1AsTUFBTSxDQUFDLElBQVAsQ0FBZ0IsSUFBQSxNQUFBLENBQU8sV0FBUCxDQUFoQixFQUFxQyxTQUFDLEdBQUQ7UUFDbkMsTUFBTSxDQUFDLHVCQUFQLENBQStCLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBekM7UUFDQSxNQUFNLENBQUMsUUFBUCxDQUFnQixDQUFDLENBQUQsQ0FBaEI7UUFDQSxNQUFNLENBQUMsZUFBUCxDQUFBO1FBQ0EsTUFBTSxDQUFDLHFCQUFQLENBQUE7UUFDQSxNQUFNLENBQUMsaUJBQVAsQ0FBQTtlQUNBLE9BQU8sQ0FBQyxHQUFSLENBQVksTUFBTSxDQUFDLGVBQVAsQ0FBQSxDQUFaO01BTm1DLENBQXJDO0lBTlEsQ0FSVjs7QUFMRiIsInNvdXJjZXNDb250ZW50IjpbIkhlYWRlckltcGxlbWVudGF0aW9uVmlldyA9IHJlcXVpcmUgJy4vaGVhZGVyLWltcGxlbWVudGF0aW9uLXZpZXcnXG57Q29tcG9zaXRlRGlzcG9zYWJsZX0gPSByZXF1aXJlICdhdG9tJ1xuXG5tb2R1bGUuZXhwb3J0cyA9XG5cbiAgYWN0aXZhdGU6IChzdGF0ZSkgLT5cblxuICAgICMgRXZlbnRzIHN1YnNjcmliZWQgdG8gaW4gYXRvbSdzIHN5c3RlbSBjYW4gYmUgZWFzaWx5IGNsZWFuZWQgdXAgd2l0aCBhIENvbXBvc2l0ZURpc3Bvc2FibGVcbiAgICBAc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlXG5cbiAgICAjIFJlZ2lzdGVyIGNvbW1hbmQgdGhhdCB0b2dnbGVzIHRoaXMgdmlld1xuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS13b3Jrc3BhY2UnLCAnaGVhZGVyLWltcGxlbWVudGF0aW9uOmdlbmVyYXRlJzogPT4gQGdlbmVyYXRlKClcblxuICBnZW5lcmF0ZTogLT5cbiAgICBjb25zb2xlLmxvZygnLmNwcCBmaWxlIHdhcyBnZW5lcmF0ZWQnKTtcbiAgICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICBidWZmZXIgPSBlZGl0b3IuZ2V0QnVmZmVyKClcbiAgICBlZGl0b3Iuc2F2ZSgpXG4gICAgcGF0aCA9IGVkaXRvci5nZXRQYXRoKClcbiAgICBidWZmZXIuc2NhbiBuZXcgUmVnRXhwKFwibmFtZXNwYWNlXCIpLCAocmVzKSAtPlxuICAgICAgZWRpdG9yLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uKHJlcy5yYW5nZS5lbmQpXG4gICAgICBlZGl0b3IubW92ZUxlZnQoWzFdKVxuICAgICAgZWRpdG9yLm1vdmVUb0VuZE9mV29yZCgpXG4gICAgICBlZGl0b3IubW92ZVRvQmVnaW5uaW5nT2ZXb3JkKClcbiAgICAgIGVkaXRvci5zZWxlY3RUb0VuZE9mV29yZCgpXG4gICAgICBjb25zb2xlLmxvZyhlZGl0b3IuZ2V0U2VsZWN0ZWRUZXh0KCkpXG4iXX0=
