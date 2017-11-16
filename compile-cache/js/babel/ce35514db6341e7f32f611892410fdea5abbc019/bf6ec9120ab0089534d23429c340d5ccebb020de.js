Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _myPackageView = require('./my-package-view');

var _myPackageView2 = _interopRequireDefault(_myPackageView);

var _atom = require('atom');

'use babel';

exports['default'] = {

  myPackageView: null,
  modalPanel: null,
  subscriptions: null,

  activate: function activate(state) {
    var _this = this;

    this.myPackageView = new _myPackageView2['default'](state.myPackageViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.myPackageView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new _atom.CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'my-package:toggle': function myPackageToggle() {
        return _this.toggle();
      }
    }));
  },

  deactivate: function deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.myPackageView.destroy();
  },

  serialize: function serialize() {
    return {
      myPackageViewState: this.myPackageView.serialize()
    };
  },

  toggle: function toggle() {
    console.log('MyPackage was toggled!');
    return this.modalPanel.isVisible() ? this.modalPanel.hide() : this.modalPanel.show();
  }

};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2JpbGx5L2dpdGh1Yi9teS1wYWNrYWdlL2xpYi9teS1wYWNrYWdlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs2QkFFMEIsbUJBQW1COzs7O29CQUNULE1BQU07O0FBSDFDLFdBQVcsQ0FBQzs7cUJBS0c7O0FBRWIsZUFBYSxFQUFFLElBQUk7QUFDbkIsWUFBVSxFQUFFLElBQUk7QUFDaEIsZUFBYSxFQUFFLElBQUk7O0FBRW5CLFVBQVEsRUFBQSxrQkFBQyxLQUFLLEVBQUU7OztBQUNkLFFBQUksQ0FBQyxhQUFhLEdBQUcsK0JBQWtCLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0FBQ2pFLFFBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUM7QUFDN0MsVUFBSSxFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsVUFBVSxFQUFFO0FBQ3JDLGFBQU8sRUFBRSxLQUFLO0tBQ2YsQ0FBQyxDQUFDOzs7QUFHSCxRQUFJLENBQUMsYUFBYSxHQUFHLCtCQUF5QixDQUFDOzs7QUFHL0MsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEVBQUU7QUFDekQseUJBQW1CLEVBQUU7ZUFBTSxNQUFLLE1BQU0sRUFBRTtPQUFBO0tBQ3pDLENBQUMsQ0FBQyxDQUFDO0dBQ0w7O0FBRUQsWUFBVSxFQUFBLHNCQUFHO0FBQ1gsUUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUMxQixRQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQzdCLFFBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLENBQUM7R0FDOUI7O0FBRUQsV0FBUyxFQUFBLHFCQUFHO0FBQ1YsV0FBTztBQUNMLHdCQUFrQixFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsU0FBUyxFQUFFO0tBQ25ELENBQUM7R0FDSDs7QUFFRCxRQUFNLEVBQUEsa0JBQUc7QUFDUCxXQUFPLENBQUMsR0FBRyxDQUFDLHdCQUF3QixDQUFDLENBQUM7QUFDdEMsV0FDRSxJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsRUFBRSxHQUMzQixJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxHQUN0QixJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxDQUN0QjtHQUNIOztDQUVGIiwiZmlsZSI6Ii9ob21lL2JpbGx5L2dpdGh1Yi9teS1wYWNrYWdlL2xpYi9teS1wYWNrYWdlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmltcG9ydCBNeVBhY2thZ2VWaWV3IGZyb20gJy4vbXktcGFja2FnZS12aWV3JztcbmltcG9ydCB7IENvbXBvc2l0ZURpc3Bvc2FibGUgfSBmcm9tICdhdG9tJztcblxuZXhwb3J0IGRlZmF1bHQge1xuXG4gIG15UGFja2FnZVZpZXc6IG51bGwsXG4gIG1vZGFsUGFuZWw6IG51bGwsXG4gIHN1YnNjcmlwdGlvbnM6IG51bGwsXG5cbiAgYWN0aXZhdGUoc3RhdGUpIHtcbiAgICB0aGlzLm15UGFja2FnZVZpZXcgPSBuZXcgTXlQYWNrYWdlVmlldyhzdGF0ZS5teVBhY2thZ2VWaWV3U3RhdGUpO1xuICAgIHRoaXMubW9kYWxQYW5lbCA9IGF0b20ud29ya3NwYWNlLmFkZE1vZGFsUGFuZWwoe1xuICAgICAgaXRlbTogdGhpcy5teVBhY2thZ2VWaWV3LmdldEVsZW1lbnQoKSxcbiAgICAgIHZpc2libGU6IGZhbHNlXG4gICAgfSk7XG5cbiAgICAvLyBFdmVudHMgc3Vic2NyaWJlZCB0byBpbiBhdG9tJ3Mgc3lzdGVtIGNhbiBiZSBlYXNpbHkgY2xlYW5lZCB1cCB3aXRoIGEgQ29tcG9zaXRlRGlzcG9zYWJsZVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKCk7XG5cbiAgICAvLyBSZWdpc3RlciBjb21tYW5kIHRoYXQgdG9nZ2xlcyB0aGlzIHZpZXdcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29tbWFuZHMuYWRkKCdhdG9tLXdvcmtzcGFjZScsIHtcbiAgICAgICdteS1wYWNrYWdlOnRvZ2dsZSc6ICgpID0+IHRoaXMudG9nZ2xlKClcbiAgICB9KSk7XG4gIH0sXG5cbiAgZGVhY3RpdmF0ZSgpIHtcbiAgICB0aGlzLm1vZGFsUGFuZWwuZGVzdHJveSgpO1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKCk7XG4gICAgdGhpcy5teVBhY2thZ2VWaWV3LmRlc3Ryb3koKTtcbiAgfSxcblxuICBzZXJpYWxpemUoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG15UGFja2FnZVZpZXdTdGF0ZTogdGhpcy5teVBhY2thZ2VWaWV3LnNlcmlhbGl6ZSgpXG4gICAgfTtcbiAgfSxcblxuICB0b2dnbGUoKSB7XG4gICAgY29uc29sZS5sb2coJ015UGFja2FnZSB3YXMgdG9nZ2xlZCEnKTtcbiAgICByZXR1cm4gKFxuICAgICAgdGhpcy5tb2RhbFBhbmVsLmlzVmlzaWJsZSgpID9cbiAgICAgIHRoaXMubW9kYWxQYW5lbC5oaWRlKCkgOlxuICAgICAgdGhpcy5tb2RhbFBhbmVsLnNob3coKVxuICAgICk7XG4gIH1cblxufTtcbiJdfQ==