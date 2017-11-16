Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* eslint "class-methods-use-this": ["error", {"exceptMethods": ["viewForItem"]}] */

var _atomSpacePenViews = require('atom-space-pen-views');

var _mobx = require('mobx');

var _underscorePlus = require('underscore-plus');

var _Manager = require('../Manager');

var _Manager2 = _interopRequireDefault(_Manager);

'use babel';
var ProjectsListView = (function (_SelectListView) {
  _inherits(ProjectsListView, _SelectListView);

  function ProjectsListView() {
    var _this = this;

    _classCallCheck(this, ProjectsListView);

    _get(Object.getPrototypeOf(ProjectsListView.prototype), 'constructor', this).call(this);

    (0, _mobx.autorun)('Loading projects for list view', function () {
      if (_this.panel && _this.panel.isVisible()) {
        _this.show(_Manager2['default'].projects);
      }
    });
  }

  _createClass(ProjectsListView, [{
    key: 'initialize',
    value: function initialize() {
      var _this2 = this;

      _get(Object.getPrototypeOf(ProjectsListView.prototype), 'initialize', this).call(this);
      this.addClass('project-manager');

      var infoText = 'shift+enter will open project in the current window';
      if (ProjectsListView.reversedConfirm) {
        infoText = 'shift+enter will open project in a new window';
      }
      var infoElement = document.createElement('div');
      infoElement.className = 'text-smaller';
      infoElement.innerHTML = infoText;
      this.error.after(infoElement);

      atom.commands.add(this.element, {
        'project-manager:alt-confirm': function projectManagerAltConfirm(event) {
          _this2.altConfirmed();
          event.stopPropagation();
        }
      });
    }
  }, {
    key: 'getFilterKey',
    value: function getFilterKey() {
      var input = this.filterEditorView.getText();
      var inputArr = input.split(':');
      var isFilterKey = ProjectsListView.possibleFilterKeys.includes(inputArr[0]);
      var filter = ProjectsListView.defaultFilterKey;

      if (inputArr.length > 1 && isFilterKey) {
        filter = inputArr[0];
      }

      return filter;
    }
  }, {
    key: 'getFilterQuery',
    value: function getFilterQuery() {
      var input = this.filterEditorView.getText();
      var inputArr = input.split(':');
      var filter = input;

      if (inputArr.length > 1) {
        filter = inputArr[1];
      }

      return filter;
    }
  }, {
    key: 'getEmptyMessage',
    value: function getEmptyMessage(itemCount, filteredItemCount) {
      if (itemCount === 0) {
        return 'No projects saved yet';
      }
      return _get(Object.getPrototypeOf(ProjectsListView.prototype), 'getEmptyMessage', this).call(this, itemCount, filteredItemCount);
    }
  }, {
    key: 'toggle',
    value: function toggle() {
      if (this.panel && this.panel.isVisible()) {
        this.cancel();
      } else {
        this.show(_Manager2['default'].projects);
      }
    }
  }, {
    key: 'show',
    value: function show(projects) {
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({ item: this });
      }

      this.storeFocusedElement();

      var sortedProjects = ProjectsListView.sortItems(projects);

      this.setItems(sortedProjects);
      this.focusFilterEditor();
    }
  }, {
    key: 'confirmed',
    value: function confirmed(project) {
      if (project) {
        _Manager.Manager.open(project, ProjectsListView.reversedConfirm);
        this.hide();
      }
    }
  }, {
    key: 'altConfirmed',
    value: function altConfirmed() {
      var project = this.getSelectedItem();
      if (project) {
        _Manager.Manager.open(project, !ProjectsListView.reversedConfirm);
        this.hide();
      }
    }
  }, {
    key: 'hide',
    value: function hide() {
      if (this.panel) {
        this.panel.hide();
      }
    }
  }, {
    key: 'cancel',
    value: function cancel() {
      _get(Object.getPrototypeOf(ProjectsListView.prototype), 'cancel', this).call(this);
    }
  }, {
    key: 'cancelled',
    value: function cancelled() {
      this.hide();
    }
  }, {
    key: 'viewForItem',
    value: function viewForItem(project) {
      var _project$props = project.props;
      var title = _project$props.title;
      var group = _project$props.group;
      var icon = _project$props.icon;
      var devMode = _project$props.devMode;
      var paths = _project$props.paths;

      var showPath = ProjectsListView.showPath;
      var projectMissing = !project.stats;

      return (0, _atomSpacePenViews.$$)(function itemView() {
        var _this3 = this;

        this.li({ 'class': 'two-lines' }, { 'data-path-missing': projectMissing }, function () {
          _this3.div({ 'class': 'primary-line' }, function () {
            if (devMode) {
              _this3.span({ 'class': 'project-manager-devmode' });
            }

            _this3.div({ 'class': 'icon ' + icon }, function () {
              _this3.span(title);
              if (group) {
                _this3.span({ 'class': 'project-manager-list-group' }, group);
              }
            });
          });
          _this3.div({ 'class': 'secondary-line' }, function () {
            if (projectMissing) {
              _this3.div({ 'class': 'icon icon-alert' }, 'Path is not available');
            } else if (showPath) {
              (0, _underscorePlus.each)(paths, function (path) {
                _this3.div({ 'class': 'no-icon' }, path);
              }, _this3);
            }
          });
        });
      });
    }
  }], [{
    key: 'sortItems',
    value: function sortItems(items) {
      var key = ProjectsListView.sortBy;
      var sorted = items;

      if (key === 'default') {
        return items;
      } else if (key === 'last modified') {
        sorted = items.sort(function (a, b) {
          var aModified = a.lastModified.getTime();
          var bModified = b.lastModified.getTime();

          return aModified > bModified ? -1 : 1;
        });
      } else {
        sorted = items.sort(function (a, b) {
          var aValue = (a[key] || '￿').toUpperCase();
          var bValue = (b[key] || '￿').toUpperCase();

          return aValue > bValue ? 1 : -1;
        });
      }

      return sorted;
    }
  }, {
    key: 'possibleFilterKeys',
    get: function get() {
      return ['title', 'group', 'template'];
    }
  }, {
    key: 'defaultFilterKey',
    get: function get() {
      return 'title';
    }
  }, {
    key: 'sortBy',
    get: function get() {
      return atom.config.get('project-manager.sortBy');
    }
  }, {
    key: 'showPath',
    get: function get() {
      return atom.config.get('project-manager.showPath');
    }
  }, {
    key: 'reversedConfirm',
    get: function get() {
      return atom.config.get('project-manager.alwaysOpenInSameWindow');
    }
  }]);

  return ProjectsListView;
})(_atomSpacePenViews.SelectListView);

exports['default'] = ProjectsListView;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2JpbGx5Ly5hdG9tL3BhY2thZ2VzL3Byb2plY3QtbWFuYWdlci9saWIvdmlld3MvcHJvamVjdHMtbGlzdC12aWV3LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7aUNBSW1DLHNCQUFzQjs7b0JBQ2pDLE1BQU07OzhCQUNULGlCQUFpQjs7dUJBQ0wsWUFBWTs7OztBQVA3QyxXQUFXLENBQUM7SUFTUyxnQkFBZ0I7WUFBaEIsZ0JBQWdCOztBQUN4QixXQURRLGdCQUFnQixHQUNyQjs7OzBCQURLLGdCQUFnQjs7QUFFakMsK0JBRmlCLGdCQUFnQiw2Q0FFekI7O0FBRVIsdUJBQVEsZ0NBQWdDLEVBQUUsWUFBTTtBQUM5QyxVQUFJLE1BQUssS0FBSyxJQUFJLE1BQUssS0FBSyxDQUFDLFNBQVMsRUFBRSxFQUFFO0FBQ3hDLGNBQUssSUFBSSxDQUFDLHFCQUFRLFFBQVEsQ0FBQyxDQUFDO09BQzdCO0tBQ0YsQ0FBQyxDQUFDO0dBQ0o7O2VBVGtCLGdCQUFnQjs7V0FVekIsc0JBQUc7OztBQUNYLGlDQVhpQixnQkFBZ0IsNENBV2Q7QUFDbkIsVUFBSSxDQUFDLFFBQVEsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDOztBQUVqQyxVQUFJLFFBQVEsR0FBRyxxREFBcUQsQ0FBQztBQUNyRSxVQUFJLGdCQUFnQixDQUFDLGVBQWUsRUFBRTtBQUNwQyxnQkFBUSxHQUFHLCtDQUErQyxDQUFDO09BQzVEO0FBQ0QsVUFBTSxXQUFXLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNsRCxpQkFBVyxDQUFDLFNBQVMsR0FBRyxjQUFjLENBQUM7QUFDdkMsaUJBQVcsQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDO0FBQ2pDLFVBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDOztBQUU5QixVQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFO0FBQzlC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Q0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEdBQVEsQ0FBQSxDQUFFLFdBQVcsRUFBRSxDQUFDOztBQUVsRCxpQkFBTyxNQUFNLEdBQUcsTUFBTSxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztTQUNqQyxDQUFDLENBQUM7T0FDSjs7QUFFRCxhQUFPLE1BQU0sQ0FBQztLQUNmOzs7U0E5SjRCLGVBQUc7QUFDOUIsYUFBTyxDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsVUFBVSxDQUFDLENBQUM7S0FDdkM7OztTQUUwQixlQUFHO0FBQzVCLGFBQU8sT0FBTyxDQUFDO0tBQ2hCOzs7U0FFZ0IsZUFBRztBQUNsQixhQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLHdCQUF3QixDQUFDLENBQUM7S0FDbEQ7OztTQUVrQixlQUFHO0FBQ3BCLGFBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsMEJBQTBCLENBQUMsQ0FBQztLQUNwRDs7O1NBRXlCLGVBQUc7QUFDM0IsYUFBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyx3Q0FBd0MsQ0FBQyxDQUFDO0tBQ2xFOzs7U0FqRGtCLGdCQUFnQjs7O3FCQUFoQixnQkFBZ0IiLCJmaWxlIjoiL2hvbWUvYmlsbHkvLmF0b20vcGFja2FnZXMvcHJvamVjdC1tYW5hZ2VyL2xpYi92aWV3cy9wcm9qZWN0cy1saXN0LXZpZXcuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuLyogZXNsaW50IFwiY2xhc3MtbWV0aG9kcy11c2UtdGhpc1wiOiBbXCJlcnJvclwiLCB7XCJleGNlcHRNZXRob2RzXCI6IFtcInZpZXdGb3JJdGVtXCJdfV0gKi9cblxuaW1wb3J0IHsgU2VsZWN0TGlzdFZpZXcsICQkIH0gZnJvbSAnYXRvbS1zcGFjZS1wZW4tdmlld3MnO1xuaW1wb3J0IHsgYXV0b3J1biB9IGZyb20gJ21vYngnO1xuaW1wb3J0IHsgZWFjaCB9IGZyb20gJ3VuZGVyc2NvcmUtcGx1cyc7XG5pbXBvcnQgbWFuYWdlciwgeyBNYW5hZ2VyIH0gZnJvbSAnLi4vTWFuYWdlcic7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFByb2plY3RzTGlzdFZpZXcgZXh0ZW5kcyBTZWxlY3RMaXN0VmlldyB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG5cbiAgICBhdXRvcnVuKCdMb2FkaW5nIHByb2plY3RzIGZvciBsaXN0IHZpZXcnLCAoKSA9PiB7XG4gICAgICBpZiAodGhpcy5wYW5lbCAmJiB0aGlzLnBhbmVsLmlzVmlzaWJsZSgpKSB7XG4gICAgICAgIHRoaXMuc2hvdyhtYW5hZ2VyLnByb2plY3RzKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICBpbml0aWFsaXplKCkge1xuICAgIHN1cGVyLmluaXRpYWxpemUoKTtcbiAgICB0aGlzLmFkZENsYXNzKCdwcm9qZWN0LW1hbmFnZXInKTtcblxuICAgIGxldCBpbmZvVGV4dCA9ICdzaGlmdCtlbnRlciB3aWxsIG9wZW4gcHJvamVjdCBpbiB0aGUgY3VycmVudCB3aW5kb3cnO1xuICAgIGlmIChQcm9qZWN0c0xpc3RWaWV3LnJldmVyc2VkQ29uZmlybSkge1xuICAgICAgaW5mb1RleHQgPSAnc2hpZnQrZW50ZXIgd2lsbCBvcGVuIHByb2plY3QgaW4gYSBuZXcgd2luZG93JztcbiAgICB9XG4gICAgY29uc3QgaW5mb0VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBpbmZvRWxlbWVudC5jbGFzc05hbWUgPSAndGV4dC1zbWFsbGVyJztcbiAgICBpbmZvRWxlbWVudC5pbm5lckhUTUwgPSBpbmZvVGV4dDtcbiAgICB0aGlzLmVycm9yLmFmdGVyKGluZm9FbGVtZW50KTtcblxuICAgIGF0b20uY29tbWFuZHMuYWRkKHRoaXMuZWxlbWVudCwge1xuICAgICAgJ3Byb2plY3QtbWFuYWdlcjphbHQtY29uZmlybSc6IChldmVudCkgPT4ge1xuICAgICAgICB0aGlzLmFsdENvbmZpcm1lZCgpO1xuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIH0sXG4gICAgfSk7XG4gIH1cblxuICBzdGF0aWMgZ2V0IHBvc3NpYmxlRmlsdGVyS2V5cygpIHtcbiAgICByZXR1cm4gWyd0aXRsZScsICdncm91cCcsICd0ZW1wbGF0ZSddO1xuICB9XG5cbiAgc3RhdGljIGdldCBkZWZhdWx0RmlsdGVyS2V5KCkge1xuICAgIHJldHVybiAndGl0bGUnO1xuICB9XG5cbiAgc3RhdGljIGdldCBzb3J0QnkoKSB7XG4gICAgcmV0dXJuIGF0b20uY29uZmlnLmdldCgncHJvamVjdC1tYW5hZ2VyLnNvcnRCeScpO1xuICB9XG5cbiAgc3RhdGljIGdldCBzaG93UGF0aCgpIHtcbiAgICByZXR1cm4gYXRvbS5jb25maWcuZ2V0KCdwcm9qZWN0LW1hbmFnZXIuc2hvd1BhdGgnKTtcbiAgfVxuXG4gIHN0YXRpYyBnZXQgcmV2ZXJzZWRDb25maXJtKCkge1xuICAgIHJldHVybiBhdG9tLmNvbmZpZy5nZXQoJ3Byb2plY3QtbWFuYWdlci5hbHdheXNPcGVuSW5TYW1lV2luZG93Jyk7XG4gIH1cblxuICBnZXRGaWx0ZXJLZXkoKSB7XG4gICAgY29uc3QgaW5wdXQgPSB0aGlzLmZpbHRlckVkaXRvclZpZXcuZ2V0VGV4dCgpO1xuICAgIGNvbnN0IGlucHV0QXJyID0gaW5wdXQuc3BsaXQoJzonKTtcbiAgICBjb25zdCBpc0ZpbHRlcktleSA9IFByb2plY3RzTGlzdFZpZXcucG9zc2libGVGaWx0ZXJLZXlzLmluY2x1ZGVzKGlucHV0QXJyWzBdKTtcbiAgICBsZXQgZmlsdGVyID0gUHJvamVjdHNMaXN0Vmlldy5kZWZhdWx0RmlsdGVyS2V5O1xuXG4gICAgaWYgKGlucHV0QXJyLmxlbmd0aCA+IDEgJiYgaXNGaWx0ZXJLZXkpIHtcbiAgICAgIGZpbHRlciA9IGlucHV0QXJyWzBdO1xuICAgIH1cblxuICAgIHJldHVybiBmaWx0ZXI7XG4gIH1cblxuICBnZXRGaWx0ZXJRdWVyeSgpIHtcbiAgICBjb25zdCBpbnB1dCA9IHRoaXMuZmlsdGVyRWRpdG9yVmlldy5nZXRUZXh0KCk7XG4gICAgY29uc3QgaW5wdXRBcnIgPSBpbnB1dC5zcGxpdCgnOicpO1xuICAgIGxldCBmaWx0ZXIgPSBpbnB1dDtcblxuICAgIGlmIChpbnB1dEFyci5sZW5ndGggPiAxKSB7XG4gICAgICBmaWx0ZXIgPSBpbnB1dEFyclsxXTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmlsdGVyO1xuICB9XG5cbiAgZ2V0RW1wdHlNZXNzYWdlKGl0ZW1Db3VudCwgZmlsdGVyZWRJdGVtQ291bnQpIHtcbiAgICBpZiAoaXRlbUNvdW50ID09PSAwKSB7XG4gICAgICByZXR1cm4gJ05vIHByb2plY3RzIHNhdmVkIHlldCc7XG4gICAgfVxuICAgIHJldHVybiBzdXBlci5nZXRFbXB0eU1lc3NhZ2UoaXRlbUNvdW50LCBmaWx0ZXJlZEl0ZW1Db3VudCk7XG4gIH1cblxuICB0b2dnbGUoKSB7XG4gICAgaWYgKHRoaXMucGFuZWwgJiYgdGhpcy5wYW5lbC5pc1Zpc2libGUoKSkge1xuICAgICAgdGhpcy5jYW5jZWwoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zaG93KG1hbmFnZXIucHJvamVjdHMpO1xuICAgIH1cbiAgfVxuXG4gIHNob3cocHJvamVjdHMpIHtcbiAgICBpZiAodGhpcy5wYW5lbCA9PSBudWxsKSB7XG4gICAgICB0aGlzLnBhbmVsID0gYXRvbS53b3Jrc3BhY2UuYWRkTW9kYWxQYW5lbCh7IGl0ZW06IHRoaXMgfSk7XG4gICAgfVxuXG4gICAgdGhpcy5zdG9yZUZvY3VzZWRFbGVtZW50KCk7XG5cbiAgICBjb25zdCBzb3J0ZWRQcm9qZWN0cyA9IFByb2plY3RzTGlzdFZpZXcuc29ydEl0ZW1zKHByb2plY3RzKTtcblxuICAgIHRoaXMuc2V0SXRlbXMoc29ydGVkUHJvamVjdHMpO1xuICAgIHRoaXMuZm9jdXNGaWx0ZXJFZGl0b3IoKTtcbiAgfVxuXG4gIGNvbmZpcm1lZChwcm9qZWN0KSB7XG4gICAgaWYgKHByb2plY3QpIHtcbiAgICAgIE1hbmFnZXIub3Blbihwcm9qZWN0LCBQcm9qZWN0c0xpc3RWaWV3LnJldmVyc2VkQ29uZmlybSk7XG4gICAgICB0aGlzLmhpZGUoKTtcbiAgICB9XG4gIH1cblxuICBhbHRDb25maXJtZWQoKSB7XG4gICAgY29uc3QgcHJvamVjdCA9IHRoaXMuZ2V0U2VsZWN0ZWRJdGVtKCk7XG4gICAgaWYgKHByb2plY3QpIHtcbiAgICAgIE1hbmFnZXIub3Blbihwcm9qZWN0LCAhUHJvamVjdHNMaXN0Vmlldy5yZXZlcnNlZENvbmZpcm0pO1xuICAgICAgdGhpcy5oaWRlKCk7XG4gICAgfVxuICB9XG5cbiAgaGlkZSgpIHtcbiAgICBpZiAodGhpcy5wYW5lbCkge1xuICAgICAgdGhpcy5wYW5lbC5oaWRlKCk7XG4gICAgfVxuICB9XG5cbiAgY2FuY2VsKCkge1xuICAgIHN1cGVyLmNhbmNlbCgpO1xuICB9XG5cbiAgY2FuY2VsbGVkKCkge1xuICAgIHRoaXMuaGlkZSgpO1xuICB9XG5cbiAgdmlld0Zvckl0ZW0ocHJvamVjdCkge1xuICAgIGNvbnN0IHsgdGl0bGUsIGdyb3VwLCBpY29uLCBkZXZNb2RlLCBwYXRocyB9ID0gcHJvamVjdC5wcm9wcztcbiAgICBjb25zdCBzaG93UGF0aCA9IFByb2plY3RzTGlzdFZpZXcuc2hvd1BhdGg7XG4gICAgY29uc3QgcHJvamVjdE1pc3NpbmcgPSAhcHJvamVjdC5zdGF0cztcblxuICAgIHJldHVybiAkJChmdW5jdGlvbiBpdGVtVmlldygpIHtcbiAgICAgIHRoaXMubGkoeyBjbGFzczogJ3R3by1saW5lcycgfSxcbiAgICAgIHsgJ2RhdGEtcGF0aC1taXNzaW5nJzogcHJvamVjdE1pc3NpbmcgfSwgKCkgPT4ge1xuICAgICAgICB0aGlzLmRpdih7IGNsYXNzOiAncHJpbWFyeS1saW5lJyB9LCAoKSA9PiB7XG4gICAgICAgICAgaWYgKGRldk1vZGUpIHtcbiAgICAgICAgICAgIHRoaXMuc3Bhbih7IGNsYXNzOiAncHJvamVjdC1tYW5hZ2VyLWRldm1vZGUnIH0pO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHRoaXMuZGl2KHsgY2xhc3M6IGBpY29uICR7aWNvbn1gIH0sICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuc3Bhbih0aXRsZSk7XG4gICAgICAgICAgICBpZiAoZ3JvdXApIHtcbiAgICAgICAgICAgICAgdGhpcy5zcGFuKHsgY2xhc3M6ICdwcm9qZWN0LW1hbmFnZXItbGlzdC1ncm91cCcgfSwgZ3JvdXApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5kaXYoeyBjbGFzczogJ3NlY29uZGFyeS1saW5lJyB9LCAoKSA9PiB7XG4gICAgICAgICAgaWYgKHByb2plY3RNaXNzaW5nKSB7XG4gICAgICAgICAgICB0aGlzLmRpdih7IGNsYXNzOiAnaWNvbiBpY29uLWFsZXJ0JyB9LCAnUGF0aCBpcyBub3QgYXZhaWxhYmxlJyk7XG4gICAgICAgICAgfSBlbHNlIGlmIChzaG93UGF0aCkge1xuICAgICAgICAgICAgZWFjaChwYXRocywgKHBhdGgpID0+IHtcbiAgICAgICAgICAgICAgdGhpcy5kaXYoeyBjbGFzczogJ25vLWljb24nIH0sIHBhdGgpO1xuICAgICAgICAgICAgfSwgdGhpcyk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgc3RhdGljIHNvcnRJdGVtcyhpdGVtcykge1xuICAgIGNvbnN0IGtleSA9IFByb2plY3RzTGlzdFZpZXcuc29ydEJ5O1xuICAgIGxldCBzb3J0ZWQgPSBpdGVtcztcblxuICAgIGlmIChrZXkgPT09ICdkZWZhdWx0Jykge1xuICAgICAgcmV0dXJuIGl0ZW1zO1xuICAgIH0gZWxzZSBpZiAoa2V5ID09PSAnbGFzdCBtb2RpZmllZCcpIHtcbiAgICAgIHNvcnRlZCA9IGl0ZW1zLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgICAgY29uc3QgYU1vZGlmaWVkID0gYS5sYXN0TW9kaWZpZWQuZ2V0VGltZSgpO1xuICAgICAgICBjb25zdCBiTW9kaWZpZWQgPSBiLmxhc3RNb2RpZmllZC5nZXRUaW1lKCk7XG5cbiAgICAgICAgcmV0dXJuIGFNb2RpZmllZCA+IGJNb2RpZmllZCA/IC0xIDogMTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBzb3J0ZWQgPSBpdGVtcy5zb3J0KChhLCBiKSA9PiB7XG4gICAgICAgIGNvbnN0IGFWYWx1ZSA9IChhW2tleV0gfHwgJ1xcdWZmZmYnKS50b1VwcGVyQ2FzZSgpO1xuICAgICAgICBjb25zdCBiVmFsdWUgPSAoYltrZXldIHx8ICdcXHVmZmZmJykudG9VcHBlckNhc2UoKTtcblxuICAgICAgICByZXR1cm4gYVZhbHVlID4gYlZhbHVlID8gMSA6IC0xO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHNvcnRlZDtcbiAgfVxufVxuIl19