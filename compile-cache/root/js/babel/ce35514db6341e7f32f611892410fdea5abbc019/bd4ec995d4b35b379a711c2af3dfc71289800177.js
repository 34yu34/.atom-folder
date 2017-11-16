"use babel";

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _require = require('atom-space-pen-views');

var $ = _require.$;
var TextEditorView = _require.TextEditorView;
var View = _require.View;

var _require2 = require('atom');

var Disposable = _require2.Disposable;
var CompositeDisposable = _require2.CompositeDisposable;

var PdfGoToPageView = (function (_View) {
  _inherits(PdfGoToPageView, _View);

  _createClass(PdfGoToPageView, null, [{
    key: 'content',
    value: function content() {
      var _this = this;

      return this.div({ 'class': 'go-to-page' }, function () {
        _this.subview('miniEditor', new TextEditorView({ mini: true }));
        _this.div({ 'class': 'message', outlet: 'message' });
      });
    }
  }]);

  function PdfGoToPageView() {
    var _this2 = this;

    _classCallCheck(this, PdfGoToPageView);

    _get(Object.getPrototypeOf(PdfGoToPageView.prototype), 'constructor', this).call(this);

    this.detaching = false;

    atom.commands.add('atom-workspace', {
      'pdf-view:go-to-page': function pdfViewGoToPage() {
        _this2.toggle();
        return false;
      }
    });

    this.miniEditor.on('blur', function () {
      return _this2.close();
    });

    atom.commands.add(this.element, {
      'core:confirm': function coreConfirm() {
        return _this2.confirm();
      },
      'core:cancel': function coreCancel() {
        return _this2.close();
      }
    });

    this.miniEditor.preempt('textInput', function (e) {
      if (!e.originalEvent.data.match(/[0-9]/)) {
        return false;
      }
    });
  }

  _createClass(PdfGoToPageView, [{
    key: 'toggle',
    value: function toggle() {
      if (this.panel != null && this.panel.isVisible()) {
        return this.close();
      } else {
        return this.attach();
      }
    }
  }, {
    key: 'close',
    value: function close() {
      this.miniEditor.setText('');
      if (this.panel != null) {
        this.panel.hide();
      }
      atom.workspace.getActivePane().activate();
    }
  }, {
    key: 'confirm',
    value: function confirm() {
      var pageNumber = this.miniEditor.getText();
      pageNumber = parseInt(pageNumber, 10);
      var pdfView = atom.workspace.getActivePaneItem();

      this.close();

      if (pdfView != null && pdfView.pdfDocument != null && pdfView.scrollToPage != null) {
        pdfView.scrollToPage(pageNumber);
      }
    }
  }, {
    key: 'attach',
    value: function attach() {
      var pdfView = atom.workspace.getActivePaneItem();

      if (pdfView != null && pdfView.pdfDocument != null && pdfView.scrollToPage != null) {
        this.panel = atom.workspace.addModalPanel({ item: this });
        this.message.text('Enter a page number 1-' + pdfView.getTotalPageNumber());
        this.miniEditor.focus();
      }
    }
  }]);

  return PdfGoToPageView;
})(View);

exports['default'] = PdfGoToPageView;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2JpbGx5Ly5hdG9tL3BhY2thZ2VzL3BkZi12aWV3L2xpYi9wZGYtZ290by1wYWdlLXZpZXcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsV0FBVyxDQUFDOzs7Ozs7Ozs7Ozs7OztlQUVvQixPQUFPLENBQUMsc0JBQXNCLENBQUM7O0lBQTFELENBQUMsWUFBRCxDQUFDO0lBQUUsY0FBYyxZQUFkLGNBQWM7SUFBRSxJQUFJLFlBQUosSUFBSTs7Z0JBQ1ksT0FBTyxDQUFDLE1BQU0sQ0FBQzs7SUFBbEQsVUFBVSxhQUFWLFVBQVU7SUFBRSxtQkFBbUIsYUFBbkIsbUJBQW1COztJQUVmLGVBQWU7WUFBZixlQUFlOztlQUFmLGVBQWU7O1dBQ3BCLG1CQUFHOzs7QUFDZixhQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBQyxTQUFPLFlBQVksRUFBQyxFQUFFLFlBQU07QUFDM0MsY0FBSyxPQUFPLENBQUMsWUFBWSxFQUFFLElBQUksY0FBYyxDQUFDLEVBQUMsSUFBSSxFQUFFLElBQUksRUFBQyxDQUFDLENBQUMsQ0FBQztBQUM3RCxjQUFLLEdBQUcsQ0FBQyxFQUFDLFNBQU8sU0FBUyxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUMsQ0FBQyxDQUFDO09BQ2pELENBQUMsQ0FBQTtLQUNIOzs7QUFFVSxXQVJRLGVBQWUsR0FRcEI7OzswQkFSSyxlQUFlOztBQVNoQywrQkFUaUIsZUFBZSw2Q0FTeEI7O0FBRVIsUUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7O0FBRXZCLFFBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLGdCQUFnQixFQUNoQztBQUNFLDJCQUFxQixFQUFFLDJCQUFNO0FBQzNCLGVBQUssTUFBTSxFQUFFLENBQUM7QUFDZCxlQUFPLEtBQUssQ0FBQztPQUNkO0tBQ0YsQ0FDRixDQUFDOztBQUVGLFFBQUksQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRTthQUFNLE9BQUssS0FBSyxFQUFFO0tBQUEsQ0FBQyxDQUFDOztBQUUvQyxRQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUM1QjtBQUNFLG9CQUFjLEVBQUU7ZUFBTSxPQUFLLE9BQU8sRUFBRTtPQUFBO0FBQ3BDLG1CQUFhLEVBQUU7ZUFBTSxPQUFLLEtBQUssRUFBRTtPQUFBO0tBQ2xDLENBQ0YsQ0FBQzs7QUFFRixRQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsVUFBQyxDQUFDLEVBQUs7QUFDMUMsVUFBSSxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsRUFBRTtBQUN4QyxlQUFPLEtBQUssQ0FBQztPQUNkO0tBQ0YsQ0FBQyxDQUFDO0dBQ0o7O2VBcENrQixlQUFlOztXQXNDNUIsa0JBQUc7QUFDUCxVQUFJLElBQUksQ0FBQyxLQUFLLElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxFQUFFLEVBQUU7QUFDaEQsZUFBTyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7T0FDckIsTUFBTTtBQUNMLGVBQU8sSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO09BQ3RCO0tBQ0Y7OztXQUVJLGlCQUFHO0FBQ04sVUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDNUIsVUFBSSxJQUFJLENBQUMsS0FBSyxJQUFJLElBQUksRUFBRTtBQUN0QixZQUFJLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDO09BQ25CO0FBQ0QsVUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQztLQUMzQzs7O1dBRU0sbUJBQUc7QUFDUixVQUFJLFVBQVUsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQzNDLGdCQUFVLEdBQUcsUUFBUSxDQUFDLFVBQVUsRUFBRSxFQUFFLENBQUMsQ0FBQztBQUN0QyxVQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLGlCQUFpQixFQUFFLENBQUM7O0FBRWpELFVBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQzs7QUFFYixVQUFJLE9BQU8sSUFBSSxJQUFJLElBQUksT0FBTyxDQUFDLFdBQVcsSUFBSSxJQUFJLElBQUksT0FBTyxDQUFDLFlBQVksSUFBSSxJQUFJLEVBQUU7QUFDbEYsZUFBTyxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUMsQ0FBQztPQUNsQztLQUNGOzs7V0FFSyxrQkFBRztBQUNQLFVBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsaUJBQWlCLEVBQUUsQ0FBQzs7QUFFakQsVUFBSSxPQUFPLElBQUksSUFBSSxJQUFJLE9BQU8sQ0FBQyxXQUFXLElBQUksSUFBSSxJQUFJLE9BQU8sQ0FBQyxZQUFZLElBQUksSUFBSSxFQUFFO0FBQ2xGLFlBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsRUFBQyxJQUFJLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQztBQUN4RCxZQUFJLENBQUMsT0FBTyxDQUFDLElBQUksNEJBQTBCLE9BQU8sQ0FBQyxrQkFBa0IsRUFBRSxDQUFHLENBQUM7QUFDM0UsWUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUUsQ0FBQztPQUN6QjtLQUNGOzs7U0ExRWtCLGVBQWU7R0FBUyxJQUFJOztxQkFBNUIsZUFBZSIsImZpbGUiOiIvaG9tZS9iaWxseS8uYXRvbS9wYWNrYWdlcy9wZGYtdmlldy9saWIvcGRmLWdvdG8tcGFnZS12aWV3LmpzIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2UgYmFiZWxcIjtcblxubGV0IHskLCBUZXh0RWRpdG9yVmlldywgVmlld30gPSByZXF1aXJlKCdhdG9tLXNwYWNlLXBlbi12aWV3cycpO1xubGV0IHtEaXNwb3NhYmxlLCBDb21wb3NpdGVEaXNwb3NhYmxlfSA9IHJlcXVpcmUoJ2F0b20nKTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGRmR29Ub1BhZ2VWaWV3IGV4dGVuZHMgVmlldyB7XG4gIHN0YXRpYyBjb250ZW50KCkge1xuICAgIHJldHVybiB0aGlzLmRpdih7Y2xhc3M6ICdnby10by1wYWdlJ30sICgpID0+IHtcbiAgICAgIHRoaXMuc3VidmlldygnbWluaUVkaXRvcicsIG5ldyBUZXh0RWRpdG9yVmlldyh7bWluaTogdHJ1ZX0pKTtcbiAgICAgIHRoaXMuZGl2KHtjbGFzczogJ21lc3NhZ2UnLCBvdXRsZXQ6ICdtZXNzYWdlJ30pO1xuICAgIH0pXG4gIH1cblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgdGhpcy5kZXRhY2hpbmcgPSBmYWxzZTtcblxuICAgIGF0b20uY29tbWFuZHMuYWRkKCdhdG9tLXdvcmtzcGFjZScsXG4gICAgICB7XG4gICAgICAgICdwZGYtdmlldzpnby10by1wYWdlJzogKCkgPT4ge1xuICAgICAgICAgIHRoaXMudG9nZ2xlKCk7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgKTtcblxuICAgIHRoaXMubWluaUVkaXRvci5vbignYmx1cicsICgpID0+IHRoaXMuY2xvc2UoKSk7XG5cbiAgICBhdG9tLmNvbW1hbmRzLmFkZCh0aGlzLmVsZW1lbnQsXG4gICAgICB7XG4gICAgICAgICdjb3JlOmNvbmZpcm0nOiAoKSA9PiB0aGlzLmNvbmZpcm0oKSxcbiAgICAgICAgJ2NvcmU6Y2FuY2VsJzogKCkgPT4gdGhpcy5jbG9zZSgpXG4gICAgICB9XG4gICAgKTtcblxuICAgIHRoaXMubWluaUVkaXRvci5wcmVlbXB0KCd0ZXh0SW5wdXQnLCAoZSkgPT4ge1xuICAgICAgaWYgKCFlLm9yaWdpbmFsRXZlbnQuZGF0YS5tYXRjaCgvWzAtOV0vKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICB0b2dnbGUoKSB7XG4gICAgaWYgKHRoaXMucGFuZWwgIT0gbnVsbCAmJiB0aGlzLnBhbmVsLmlzVmlzaWJsZSgpKSB7XG4gICAgICByZXR1cm4gdGhpcy5jbG9zZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5hdHRhY2goKTtcbiAgICB9XG4gIH1cblxuICBjbG9zZSgpIHtcbiAgICB0aGlzLm1pbmlFZGl0b3Iuc2V0VGV4dCgnJyk7XG4gICAgaWYgKHRoaXMucGFuZWwgIT0gbnVsbCkge1xuICAgICAgdGhpcy5wYW5lbC5oaWRlKCk7XG4gICAgfVxuICAgIGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVBhbmUoKS5hY3RpdmF0ZSgpO1xuICB9XG5cbiAgY29uZmlybSgpIHtcbiAgICBsZXQgcGFnZU51bWJlciA9IHRoaXMubWluaUVkaXRvci5nZXRUZXh0KCk7XG4gICAgcGFnZU51bWJlciA9IHBhcnNlSW50KHBhZ2VOdW1iZXIsIDEwKTtcbiAgICBsZXQgcGRmVmlldyA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVBhbmVJdGVtKCk7XG5cbiAgICB0aGlzLmNsb3NlKCk7XG5cbiAgICBpZiAocGRmVmlldyAhPSBudWxsICYmIHBkZlZpZXcucGRmRG9jdW1lbnQgIT0gbnVsbCAmJiBwZGZWaWV3LnNjcm9sbFRvUGFnZSAhPSBudWxsKSB7XG4gICAgICBwZGZWaWV3LnNjcm9sbFRvUGFnZShwYWdlTnVtYmVyKTtcbiAgICB9XG4gIH1cblxuICBhdHRhY2goKSB7XG4gICAgbGV0IHBkZlZpZXcgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lSXRlbSgpO1xuXG4gICAgaWYgKHBkZlZpZXcgIT0gbnVsbCAmJiBwZGZWaWV3LnBkZkRvY3VtZW50ICE9IG51bGwgJiYgcGRmVmlldy5zY3JvbGxUb1BhZ2UgIT0gbnVsbCkge1xuICAgICAgdGhpcy5wYW5lbCA9IGF0b20ud29ya3NwYWNlLmFkZE1vZGFsUGFuZWwoe2l0ZW06IHRoaXN9KTtcbiAgICAgIHRoaXMubWVzc2FnZS50ZXh0KGBFbnRlciBhIHBhZ2UgbnVtYmVyIDEtJHtwZGZWaWV3LmdldFRvdGFsUGFnZU51bWJlcigpfWApO1xuICAgICAgdGhpcy5taW5pRWRpdG9yLmZvY3VzKCk7XG4gICAgfVxuICB9XG59XG4iXX0=