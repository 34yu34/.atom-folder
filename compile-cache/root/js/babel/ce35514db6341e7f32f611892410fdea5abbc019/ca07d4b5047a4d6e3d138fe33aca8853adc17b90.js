"use babel";

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _require = require('atom-space-pen-views');

var View = _require.View;

var _require2 = require('atom');

var Disposable = _require2.Disposable;
var CompositeDisposable = _require2.CompositeDisposable;

var PdfStatusBarView = (function (_View) {
  _inherits(PdfStatusBarView, _View);

  _createClass(PdfStatusBarView, null, [{
    key: 'content',
    value: function content() {
      var _this = this;

      this.div({ 'class': 'status-image inline-block' }, function () {
        _this.a({ href: '#', 'class': 'pdf-status inline-block', outlet: 'pdfStatus' });
      });
    }
  }]);

  function PdfStatusBarView() {
    var _this2 = this;

    _classCallCheck(this, PdfStatusBarView);

    _get(Object.getPrototypeOf(PdfStatusBarView.prototype), 'constructor', this).call(this);

    this.attach();

    var disposables = new CompositeDisposable();

    var updatePageCallback = function updatePageCallback() {
      return _this2.updatePdfStatus();
    };

    disposables.add(atom.workspace.onDidChangeActivePaneItem(updatePageCallback));

    atom.views.getView(atom.workspace).addEventListener('pdf-view:current-page-update', updatePageCallback);

    disposables.add(new Disposable(function () {
      return window.removeEventListener('pdf-view:current-page-update', updatePageCallback);
    }));

    var clickCallback = function clickCallback() {
      atom.commands.dispatch(atom.views.getView(atom.workspace), 'pdf-view:go-to-page');
      return false;
    };

    var elem = this;

    elem.on('click', clickCallback);
    disposables.add(new Disposable(function () {
      return elem.off('click', clickCallback);
    }));
  }

  _createClass(PdfStatusBarView, [{
    key: 'attach',
    value: function attach() {
      var statusBar = document.querySelector("status-bar");

      if (statusBar != null) {
        this.statusBarTile = statusBar.addLeftTile({ item: this, priority: 100 });
      }
    }
  }, {
    key: 'attached',
    value: function attached() {
      this.updatePdfStatus();
    }
  }, {
    key: 'getPdfStatus',
    value: function getPdfStatus(view) {
      this.pdfStatus.text('Page: ' + view.currentPageNumber + '/' + view.totalPageNumber).show();
    }
  }, {
    key: 'updatePdfStatus',
    value: function updatePdfStatus() {
      var pdfView = atom.workspace.getActivePaneItem();

      if (pdfView != null && pdfView.pdfDocument != null) {
        this.getPdfStatus(pdfView);
      } else {
        this.pdfStatus.hide();
      }
    }
  }]);

  return PdfStatusBarView;
})(View);

exports['default'] = PdfStatusBarView;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2JpbGx5Ly5hdG9tL3BhY2thZ2VzL3BkZi12aWV3L2xpYi9wZGYtc3RhdHVzLWJhci12aWV3LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFdBQVcsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7ZUFFQyxPQUFPLENBQUMsc0JBQXNCLENBQUM7O0lBQXZDLElBQUksWUFBSixJQUFJOztnQkFDK0IsT0FBTyxDQUFDLE1BQU0sQ0FBQzs7SUFBbEQsVUFBVSxhQUFWLFVBQVU7SUFBRSxtQkFBbUIsYUFBbkIsbUJBQW1COztJQUVmLGdCQUFnQjtZQUFoQixnQkFBZ0I7O2VBQWhCLGdCQUFnQjs7V0FDckIsbUJBQUc7OztBQUNmLFVBQUksQ0FBQyxHQUFHLENBQUMsRUFBQyxTQUFPLDJCQUEyQixFQUFDLEVBQUUsWUFBTTtBQUNuRCxjQUFLLENBQUMsQ0FBQyxFQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsU0FBTyx5QkFBeUIsRUFBRSxNQUFNLEVBQUUsV0FBVyxFQUFDLENBQUMsQ0FBQztPQUM1RSxDQUFDLENBQUM7S0FDSjs7O0FBRVUsV0FQUSxnQkFBZ0IsR0FPckI7OzswQkFQSyxnQkFBZ0I7O0FBUWpDLCtCQVJpQixnQkFBZ0IsNkNBUXpCOztBQUVSLFFBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQzs7QUFFZCxRQUFJLFdBQVcsR0FBRyxJQUFJLG1CQUFtQixFQUFFLENBQUM7O0FBRTVDLFFBQUksa0JBQWtCLEdBQUcsU0FBckIsa0JBQWtCLEdBQVM7QUFDN0IsYUFBTyxPQUFLLGVBQWUsRUFBRSxDQUFDO0tBQy9CLENBQUM7O0FBRUYsZUFBVyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLHlCQUF5QixDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQzs7QUFFOUUsUUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLDhCQUE4QixFQUFFLGtCQUFrQixDQUFDLENBQUM7O0FBRXhHLGVBQVcsQ0FBQyxHQUFHLENBQUMsSUFBSSxVQUFVLENBQUM7YUFBTSxNQUFNLENBQUMsbUJBQW1CLENBQUMsOEJBQThCLEVBQUUsa0JBQWtCLENBQUM7S0FBQSxDQUFDLENBQUMsQ0FBQzs7QUFFdEgsUUFBSSxhQUFhLEdBQUcsU0FBaEIsYUFBYSxHQUFTO0FBQ3hCLFVBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxxQkFBcUIsQ0FBQyxDQUFDO0FBQ2xGLGFBQU8sS0FBSyxDQUFDO0tBQ2QsQ0FBQzs7QUFFRixRQUFJLElBQUksR0FBRyxJQUFJLENBQUM7O0FBRWhCLFFBQUksQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLGFBQWEsQ0FBQyxDQUFDO0FBQ2hDLGVBQVcsQ0FBQyxHQUFHLENBQUMsSUFBSSxVQUFVLENBQUM7YUFBTSxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxhQUFhLENBQUM7S0FBQSxDQUFDLENBQUMsQ0FBQztHQUN6RTs7ZUFqQ2tCLGdCQUFnQjs7V0FtQzdCLGtCQUFHO0FBQ1AsVUFBSSxTQUFTLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUMsQ0FBQzs7QUFFckQsVUFBSSxTQUFTLElBQUksSUFBSSxFQUFFO0FBQ3JCLFlBQUksQ0FBQyxhQUFhLEdBQUcsU0FBUyxDQUFDLFdBQVcsQ0FBQyxFQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBQyxDQUFDLENBQUM7T0FDekU7S0FDRjs7O1dBRU8sb0JBQUc7QUFDVCxVQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7S0FDeEI7OztXQUVXLHNCQUFDLElBQUksRUFBRTtBQUNqQixVQUFJLENBQUMsU0FBUyxDQUFDLElBQUksWUFBVSxJQUFJLENBQUMsaUJBQWlCLFNBQUksSUFBSSxDQUFDLGVBQWUsQ0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO0tBQ3ZGOzs7V0FFYywyQkFBRztBQUNoQixVQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLGlCQUFpQixFQUFFLENBQUM7O0FBRWpELFVBQUksT0FBTyxJQUFJLElBQUksSUFBSSxPQUFPLENBQUMsV0FBVyxJQUFJLElBQUksRUFBRTtBQUNsRCxZQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDO09BQzVCLE1BQU07QUFDTCxZQUFJLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxDQUFDO09BQ3ZCO0tBQ0Y7OztTQTNEa0IsZ0JBQWdCO0dBQVMsSUFBSTs7cUJBQTdCLGdCQUFnQiIsImZpbGUiOiIvaG9tZS9iaWxseS8uYXRvbS9wYWNrYWdlcy9wZGYtdmlldy9saWIvcGRmLXN0YXR1cy1iYXItdmlldy5qcyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIGJhYmVsXCI7XG5cbmxldCB7Vmlld30gPSByZXF1aXJlKCdhdG9tLXNwYWNlLXBlbi12aWV3cycpO1xubGV0IHtEaXNwb3NhYmxlLCBDb21wb3NpdGVEaXNwb3NhYmxlfSA9IHJlcXVpcmUoJ2F0b20nKTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGRmU3RhdHVzQmFyVmlldyBleHRlbmRzIFZpZXcge1xuICBzdGF0aWMgY29udGVudCgpIHtcbiAgICB0aGlzLmRpdih7Y2xhc3M6ICdzdGF0dXMtaW1hZ2UgaW5saW5lLWJsb2NrJ30sICgpID0+IHtcbiAgICAgIHRoaXMuYSh7aHJlZjogJyMnLCBjbGFzczogJ3BkZi1zdGF0dXMgaW5saW5lLWJsb2NrJywgb3V0bGV0OiAncGRmU3RhdHVzJ30pO1xuICAgIH0pO1xuICB9XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMuYXR0YWNoKCk7XG5cbiAgICBsZXQgZGlzcG9zYWJsZXMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpO1xuXG4gICAgbGV0IHVwZGF0ZVBhZ2VDYWxsYmFjayA9ICgpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLnVwZGF0ZVBkZlN0YXR1cygpO1xuICAgIH07XG5cbiAgICBkaXNwb3NhYmxlcy5hZGQoYXRvbS53b3Jrc3BhY2Uub25EaWRDaGFuZ2VBY3RpdmVQYW5lSXRlbSh1cGRhdGVQYWdlQ2FsbGJhY2spKTtcblxuICAgIGF0b20udmlld3MuZ2V0VmlldyhhdG9tLndvcmtzcGFjZSkuYWRkRXZlbnRMaXN0ZW5lcigncGRmLXZpZXc6Y3VycmVudC1wYWdlLXVwZGF0ZScsIHVwZGF0ZVBhZ2VDYWxsYmFjayk7XG5cbiAgICBkaXNwb3NhYmxlcy5hZGQobmV3IERpc3Bvc2FibGUoKCkgPT4gd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3BkZi12aWV3OmN1cnJlbnQtcGFnZS11cGRhdGUnLCB1cGRhdGVQYWdlQ2FsbGJhY2spKSk7XG5cbiAgICBsZXQgY2xpY2tDYWxsYmFjayA9ICgpID0+IHtcbiAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2goYXRvbS52aWV3cy5nZXRWaWV3KGF0b20ud29ya3NwYWNlKSwgJ3BkZi12aWV3OmdvLXRvLXBhZ2UnKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9O1xuXG4gICAgbGV0IGVsZW0gPSB0aGlzO1xuXG4gICAgZWxlbS5vbignY2xpY2snLCBjbGlja0NhbGxiYWNrKTtcbiAgICBkaXNwb3NhYmxlcy5hZGQobmV3IERpc3Bvc2FibGUoKCkgPT4gZWxlbS5vZmYoJ2NsaWNrJywgY2xpY2tDYWxsYmFjaykpKTtcbiAgfVxuXG4gIGF0dGFjaCgpIHtcbiAgICBsZXQgc3RhdHVzQmFyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcInN0YXR1cy1iYXJcIik7XG5cbiAgICBpZiAoc3RhdHVzQmFyICE9IG51bGwpIHtcbiAgICAgIHRoaXMuc3RhdHVzQmFyVGlsZSA9IHN0YXR1c0Jhci5hZGRMZWZ0VGlsZSh7aXRlbTogdGhpcywgcHJpb3JpdHk6IDEwMH0pO1xuICAgIH1cbiAgfVxuXG4gIGF0dGFjaGVkKCkge1xuICAgIHRoaXMudXBkYXRlUGRmU3RhdHVzKCk7XG4gIH1cblxuICBnZXRQZGZTdGF0dXModmlldykge1xuICAgIHRoaXMucGRmU3RhdHVzLnRleHQoYFBhZ2U6ICR7dmlldy5jdXJyZW50UGFnZU51bWJlcn0vJHt2aWV3LnRvdGFsUGFnZU51bWJlcn1gKS5zaG93KCk7XG4gIH1cblxuICB1cGRhdGVQZGZTdGF0dXMoKSB7XG4gICAgbGV0IHBkZlZpZXcgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lSXRlbSgpO1xuXG4gICAgaWYgKHBkZlZpZXcgIT0gbnVsbCAmJiBwZGZWaWV3LnBkZkRvY3VtZW50ICE9IG51bGwpIHtcbiAgICAgIHRoaXMuZ2V0UGRmU3RhdHVzKHBkZlZpZXcpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnBkZlN0YXR1cy5oaWRlKCk7XG4gICAgfVxuICB9XG59XG4iXX0=