Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

/** @babel */
/** @jsx etch.dom */

var _atom = require('atom');

var _etch = require('etch');

var _etch2 = _interopRequireDefault(_etch);

var _changeCase = require('change-case');

var _changeCase2 = _interopRequireDefault(_changeCase);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _viewUri = require('./view-uri');

var _Manager = require('../Manager');

var _Manager2 = _interopRequireDefault(_Manager);

var _modelsProject = require('../models/Project');

var _modelsProject2 = _interopRequireDefault(_modelsProject);

var disposables = new _atom.CompositeDisposable();

_etch2['default'].setScheduler(atom.views);

var EditView = (function () {
  function EditView(props, children) {
    var _this = this;

    _classCallCheck(this, EditView);

    this.props = props;
    this.children = children;
    _etch2['default'].initialize(this);

    this.storeFocusedElement();

    this.setFocus();

    this.element.addEventListener('click', function (event) {
      if (event.target === _this.refs.save) {
        _this.saveProject();
      }
    });

    disposables.add(atom.commands.add(this.element, {
      'core:save': function coreSave() {
        return _this.saveProject();
      },
      'core:confirm': function coreConfirm() {
        return _this.saveProject();
      }
    }));

    disposables.add(atom.commands.add('atom-workspace', {
      'core:cancel': function coreCancel() {
        return _this.close();
      }
    }));
  }

  _createClass(EditView, [{
    key: 'getFocusElement',
    value: function getFocusElement() {
      return this.refs.title;
    }
  }, {
    key: 'setFocus',
    value: function setFocus() {
      var focusElement = this.getFocusElement();

      if (focusElement) {
        setTimeout(function () {
          focusElement.focus();
        }, 0);
      }
    }
  }, {
    key: 'storeFocusedElement',
    value: function storeFocusedElement() {
      this.previouslyFocusedElement = document.activeElement;
    }
  }, {
    key: 'restoreFocus',
    value: function restoreFocus() {
      if (this.previouslyFocusedElement) {
        this.previouslyFocusedElement.focus();
      }
    }
  }, {
    key: 'close',
    value: function close() {
      this.destroy();
    }
  }, {
    key: 'destroy',
    value: _asyncToGenerator(function* () {
      var pane = atom.workspace.paneForURI(_viewUri.EDIT_URI);
      if (pane) {
        var item = pane.itemForURI(_viewUri.EDIT_URI);
        pane.destroyItem(item);
      }

      disposables.dispose();
      yield _etch2['default'].destroy(this);
    })
  }, {
    key: 'saveProject',
    value: function saveProject() {
      var projectProps = {
        title: this.refs.title.value,
        paths: atom.project.getPaths(),
        group: this.refs.group.value,
        icon: this.refs.icon.value,
        devMode: this.refs.devMode.checked
      };
      var message = projectProps.title + ' has been saved.';

      if (this.props.project) {
        // Paths should already be up-to-date, so use
        // the current paths as to not break possible relative paths.
        projectProps.paths = this.props.project.getProps().paths;
      }

      // many stuff will break if there is no root path,
      // so we don't continue without a root path
      if (!projectProps.paths.length) {
        atom.notifications.addError('You must have at least one folder in your project before you can save !');
      } else {
        _Manager2['default'].saveProject(projectProps);

        if (this.props.project) {
          message = this.props.project.title + ' has been updated.';
        }
        atom.notifications.addSuccess(message);

        this.close();
      }
    }
  }, {
    key: 'update',
    value: function update(props, children) {
      this.props = props;
      this.children = children;
    }
  }, {
    key: 'getTitle',
    value: function getTitle() {
      if (this.props.project) {
        return 'Edit ' + this.props.project.title;
      }

      return 'Save Project';
    }
  }, {
    key: 'getIconName',
    value: function getIconName() {
      // eslint-disable-line class-methods-use-this
      return 'gear';
    }
  }, {
    key: 'getURI',
    value: function getURI() {
      // eslint-disable-line class-methods-use-this
      return _viewUri.EDIT_URI;
    }
  }, {
    key: 'render',
    value: function render() {
      var defaultProps = _modelsProject2['default'].defaultProps;
      var rootPath = atom.project.getPaths()[0];
      var props = defaultProps;

      if (atom.config.get('project-manager.prettifyTitle')) {
        props.title = _changeCase2['default'].titleCase(_path2['default'].basename(rootPath));
      }

      if (this.props.project && this.props.project.source === 'file') {
        var projectProps = this.props.project.getProps();
        props = Object.assign({}, props, projectProps);
      }

      var wrapperStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      };

      var style = {
        width: '500px'
      };

      return _etch2['default'].dom(
        'div',
        { style: wrapperStyle, className: 'project-manager-edit padded native-key-bindings' },
        _etch2['default'].dom(
          'div',
          { style: style },
          _etch2['default'].dom(
            'h1',
            { className: 'block section-heading' },
            this.getTitle()
          ),
          _etch2['default'].dom(
            'div',
            { className: 'block' },
            _etch2['default'].dom(
              'label',
              { className: 'input-label' },
              'Title'
            ),
            _etch2['default'].dom('input', { ref: 'title', type: 'text', className: 'input-text', value: props.title, tabIndex: '0' })
          ),
          _etch2['default'].dom(
            'div',
            { className: 'block' },
            _etch2['default'].dom(
              'label',
              { className: 'input-label' },
              'Group'
            ),
            _etch2['default'].dom('input', { ref: 'group', type: 'text', className: 'input-text', value: props.group, tabIndex: '1' })
          ),
          _etch2['default'].dom(
            'div',
            { className: 'block' },
            _etch2['default'].dom(
              'label',
              { className: 'input-label' },
              'Icon'
            ),
            _etch2['default'].dom('input', { ref: 'icon', type: 'text', className: 'input-text', value: props.icon, tabIndex: '2' })
          ),
          _etch2['default'].dom(
            'div',
            { className: 'block' },
            _etch2['default'].dom(
              'label',
              { className: 'input-label', 'for': 'devMode' },
              'Development mode'
            ),
            _etch2['default'].dom('input', {
              ref: 'devMode',
              id: 'devMode',
              name: 'devMode',
              type: 'checkbox',
              className: 'input-toggle',
              checked: props.devMode,
              tabIndex: '3'
            })
          ),
          _etch2['default'].dom(
            'div',
            { className: 'block', style: { textAlign: 'right' } },
            _etch2['default'].dom(
              'button',
              { ref: 'save', className: 'btn btn-primary', tabIndex: '4' },
              'Save'
            )
          )
        )
      );
    }
  }]);

  return EditView;
})();

exports['default'] = EditView;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2JpbGx5Ly5hdG9tL3BhY2thZ2VzL3Byb2plY3QtbWFuYWdlci9saWIvdmlld3MvRWRpdFZpZXcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O29CQUdvQyxNQUFNOztvQkFDekIsTUFBTTs7OzswQkFDQSxhQUFhOzs7O29CQUNuQixNQUFNOzs7O3VCQUNFLFlBQVk7O3VCQUNqQixZQUFZOzs7OzZCQUNaLG1CQUFtQjs7OztBQUV2QyxJQUFNLFdBQVcsR0FBRywrQkFBeUIsQ0FBQzs7QUFFOUMsa0JBQUssWUFBWSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQzs7SUFFVCxRQUFRO0FBQ2hCLFdBRFEsUUFBUSxDQUNmLEtBQUssRUFBRSxRQUFRLEVBQUU7OzswQkFEVixRQUFROztBQUV6QixRQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztBQUNuQixRQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztBQUN6QixzQkFBSyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7O0FBRXRCLFFBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFDOztBQUUzQixRQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7O0FBRWhCLFFBQUksQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLFVBQUMsS0FBSyxFQUFLO0FBQ2hELFVBQUksS0FBSyxDQUFDLE1BQU0sS0FBSyxNQUFLLElBQUksQ0FBQyxJQUFJLEVBQUU7QUFDbkMsY0FBSyxXQUFXLEVBQUUsQ0FBQztPQUNwQjtLQUNGLENBQUMsQ0FBQzs7QUFFSCxlQUFXLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUU7QUFDOUMsaUJBQVcsRUFBRTtlQUFNLE1BQUssV0FBVyxFQUFFO09BQUE7QUFDckMsb0JBQWMsRUFBRTtlQUFNLE1BQUssV0FBVyxFQUFFO09BQUE7S0FDekMsQ0FBQyxDQUFDLENBQUM7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cUJBQU8sRUFBRSxLQUFLLENBQUMsT0FBTyxBQUFDO0FBQ3ZCLHNCQUFRLEVBQUMsR0FBRztjQUNaO1dBQ0E7VUFFTjs7Y0FBSyxTQUFTLEVBQUMsT0FBTyxFQUFDLEtBQUssRUFBRSxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUUsQUFBQztZQUNuRDs7Z0JBQVEsR0FBRyxFQUFDLE1BQU0sRUFBQyxTQUFTLEVBQUMsaUJBQWlCLEVBQUMsUUFBUSxFQUFDLEdBQUc7O2FBQWM7V0FDckU7U0FDRjtPQUNGLENBQ047S0FDSDs7O1NBckxrQixRQUFROzs7cUJBQVIsUUFBUSIsImZpbGUiOiIvaG9tZS9iaWxseS8uYXRvbS9wYWNrYWdlcy9wcm9qZWN0LW1hbmFnZXIvbGliL3ZpZXdzL0VkaXRWaWV3LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBiYWJlbCAqL1xuLyoqIEBqc3ggZXRjaC5kb20gKi9cblxuaW1wb3J0IHsgQ29tcG9zaXRlRGlzcG9zYWJsZSB9IGZyb20gJ2F0b20nO1xuaW1wb3J0IGV0Y2ggZnJvbSAnZXRjaCc7XG5pbXBvcnQgY2hhbmdlQ2FzZSBmcm9tICdjaGFuZ2UtY2FzZSc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7IEVESVRfVVJJIH0gZnJvbSAnLi92aWV3LXVyaSc7XG5pbXBvcnQgbWFuYWdlciBmcm9tICcuLi9NYW5hZ2VyJztcbmltcG9ydCBQcm9qZWN0IGZyb20gJy4uL21vZGVscy9Qcm9qZWN0JztcblxuY29uc3QgZGlzcG9zYWJsZXMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpO1xuXG5ldGNoLnNldFNjaGVkdWxlcihhdG9tLnZpZXdzKTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRWRpdFZpZXcge1xuICBjb25zdHJ1Y3Rvcihwcm9wcywgY2hpbGRyZW4pIHtcbiAgICB0aGlzLnByb3BzID0gcHJvcHM7XG4gICAgdGhpcy5jaGlsZHJlbiA9IGNoaWxkcmVuO1xuICAgIGV0Y2guaW5pdGlhbGl6ZSh0aGlzKTtcblxuICAgIHRoaXMuc3RvcmVGb2N1c2VkRWxlbWVudCgpO1xuXG4gICAgdGhpcy5zZXRGb2N1cygpO1xuXG4gICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2ZW50KSA9PiB7XG4gICAgICBpZiAoZXZlbnQudGFyZ2V0ID09PSB0aGlzLnJlZnMuc2F2ZSkge1xuICAgICAgICB0aGlzLnNhdmVQcm9qZWN0KCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBkaXNwb3NhYmxlcy5hZGQoYXRvbS5jb21tYW5kcy5hZGQodGhpcy5lbGVtZW50LCB7XG4gICAgICAnY29yZTpzYXZlJzogKCkgPT4gdGhpcy5zYXZlUHJvamVjdCgpLFxuICAgICAgJ2NvcmU6Y29uZmlybSc6ICgpID0+IHRoaXMuc2F2ZVByb2plY3QoKSxcbiAgICB9KSk7XG5cbiAgICBkaXNwb3NhYmxlcy5hZGQoYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20td29ya3NwYWNlJywge1xuICAgICAgJ2NvcmU6Y2FuY2VsJzogKCkgPT4gdGhpcy5jbG9zZSgpLFxuICAgIH0pKTtcbiAgfVxuXG4gIGdldEZvY3VzRWxlbWVudCgpIHtcbiAgICByZXR1cm4gdGhpcy5yZWZzLnRpdGxlO1xuICB9XG5cbiAgc2V0Rm9jdXMoKSB7XG4gICAgY29uc3QgZm9jdXNFbGVtZW50ID0gdGhpcy5nZXRGb2N1c0VsZW1lbnQoKTtcblxuICAgIGlmIChmb2N1c0VsZW1lbnQpIHtcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBmb2N1c0VsZW1lbnQuZm9jdXMoKTtcbiAgICAgIH0sIDApO1xuICAgIH1cbiAgfVxuXG4gIHN0b3JlRm9jdXNlZEVsZW1lbnQoKSB7XG4gICAgdGhpcy5wcmV2aW91c2x5Rm9jdXNlZEVsZW1lbnQgPSBkb2N1bWVudC5hY3RpdmVFbGVtZW50O1xuICB9XG5cbiAgcmVzdG9yZUZvY3VzKCkge1xuICAgIGlmICh0aGlzLnByZXZpb3VzbHlGb2N1c2VkRWxlbWVudCkge1xuICAgICAgdGhpcy5wcmV2aW91c2x5Rm9jdXNlZEVsZW1lbnQuZm9jdXMoKTtcbiAgICB9XG4gIH1cblxuICBjbG9zZSgpIHtcbiAgICB0aGlzLmRlc3Ryb3koKTtcbiAgfVxuXG4gIGFzeW5jIGRlc3Ryb3koKSB7XG4gICAgY29uc3QgcGFuZSA9IGF0b20ud29ya3NwYWNlLnBhbmVGb3JVUkkoRURJVF9VUkkpO1xuICAgIGlmIChwYW5lKSB7XG4gICAgICBjb25zdCBpdGVtID0gcGFuZS5pdGVtRm9yVVJJKEVESVRfVVJJKTtcbiAgICAgIHBhbmUuZGVzdHJveUl0ZW0oaXRlbSk7XG4gICAgfVxuXG4gICAgZGlzcG9zYWJsZXMuZGlzcG9zZSgpO1xuICAgIGF3YWl0IGV0Y2guZGVzdHJveSh0aGlzKTtcbiAgfVxuXG4gIHNhdmVQcm9qZWN0KCkge1xuICAgIGNvbnN0IHByb2plY3RQcm9wcyA9IHtcbiAgICAgIHRpdGxlOiB0aGlzLnJlZnMudGl0bGUudmFsdWUsXG4gICAgICBwYXRoczogYXRvbS5wcm9qZWN0LmdldFBhdGhzKCksXG4gICAgICBncm91cDogdGhpcy5yZWZzLmdyb3VwLnZhbHVlLFxuICAgICAgaWNvbjogdGhpcy5yZWZzLmljb24udmFsdWUsXG4gICAgICBkZXZNb2RlOiB0aGlzLnJlZnMuZGV2TW9kZS5jaGVja2VkLFxuICAgIH07XG4gICAgbGV0IG1lc3NhZ2UgPSBgJHtwcm9qZWN0UHJvcHMudGl0bGV9IGhhcyBiZWVuIHNhdmVkLmA7XG5cbiAgICBpZiAodGhpcy5wcm9wcy5wcm9qZWN0KSB7XG4gICAgICAvLyBQYXRocyBzaG91bGQgYWxyZWFkeSBiZSB1cC10by1kYXRlLCBzbyB1c2VcbiAgICAgIC8vIHRoZSBjdXJyZW50IHBhdGhzIGFzIHRvIG5vdCBicmVhayBwb3NzaWJsZSByZWxhdGl2ZSBwYXRocy5cbiAgICAgIHByb2plY3RQcm9wcy5wYXRocyA9IHRoaXMucHJvcHMucHJvamVjdC5nZXRQcm9wcygpLnBhdGhzO1xuICAgIH1cblxuICAgIC8vIG1hbnkgc3R1ZmYgd2lsbCBicmVhayBpZiB0aGVyZSBpcyBubyByb290IHBhdGgsXG4gICAgLy8gc28gd2UgZG9uJ3QgY29udGludWUgd2l0aG91dCBhIHJvb3QgcGF0aFxuICAgIGlmICghcHJvamVjdFByb3BzLnBhdGhzLmxlbmd0aCkge1xuICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKCdZb3UgbXVzdCBoYXZlIGF0IGxlYXN0IG9uZSBmb2xkZXIgaW4geW91ciBwcm9qZWN0IGJlZm9yZSB5b3UgY2FuIHNhdmUgIScpO1xuICAgIH0gZWxzZSB7XG4gICAgICBtYW5hZ2VyLnNhdmVQcm9qZWN0KHByb2plY3RQcm9wcyk7XG5cbiAgICAgIGlmICh0aGlzLnByb3BzLnByb2plY3QpIHtcbiAgICAgICAgbWVzc2FnZSA9IGAke3RoaXMucHJvcHMucHJvamVjdC50aXRsZX0gaGFzIGJlZW4gdXBkYXRlZC5gO1xuICAgICAgfVxuICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZFN1Y2Nlc3MobWVzc2FnZSk7XG5cbiAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICB9XG4gIH1cblxuICB1cGRhdGUocHJvcHMsIGNoaWxkcmVuKSB7XG4gICAgdGhpcy5wcm9wcyA9IHByb3BzO1xuICAgIHRoaXMuY2hpbGRyZW4gPSBjaGlsZHJlbjtcbiAgfVxuXG4gIGdldFRpdGxlKCkge1xuICAgIGlmICh0aGlzLnByb3BzLnByb2plY3QpIHtcbiAgICAgIHJldHVybiBgRWRpdCAke3RoaXMucHJvcHMucHJvamVjdC50aXRsZX1gO1xuICAgIH1cblxuICAgIHJldHVybiAnU2F2ZSBQcm9qZWN0JztcbiAgfVxuXG4gIGdldEljb25OYW1lKCkgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIGNsYXNzLW1ldGhvZHMtdXNlLXRoaXNcbiAgICByZXR1cm4gJ2dlYXInO1xuICB9XG5cbiAgZ2V0VVJJKCkgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIGNsYXNzLW1ldGhvZHMtdXNlLXRoaXNcbiAgICByZXR1cm4gRURJVF9VUkk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgZGVmYXVsdFByb3BzID0gUHJvamVjdC5kZWZhdWx0UHJvcHM7XG4gICAgY29uc3Qgcm9vdFBhdGggPSBhdG9tLnByb2plY3QuZ2V0UGF0aHMoKVswXTtcbiAgICBsZXQgcHJvcHMgPSBkZWZhdWx0UHJvcHM7XG5cbiAgICBpZiAoYXRvbS5jb25maWcuZ2V0KCdwcm9qZWN0LW1hbmFnZXIucHJldHRpZnlUaXRsZScpKSB7XG4gICAgICBwcm9wcy50aXRsZSA9IGNoYW5nZUNhc2UudGl0bGVDYXNlKHBhdGguYmFzZW5hbWUocm9vdFBhdGgpKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5wcm9wcy5wcm9qZWN0ICYmIHRoaXMucHJvcHMucHJvamVjdC5zb3VyY2UgPT09ICdmaWxlJykge1xuICAgICAgY29uc3QgcHJvamVjdFByb3BzID0gdGhpcy5wcm9wcy5wcm9qZWN0LmdldFByb3BzKCk7XG4gICAgICBwcm9wcyA9IE9iamVjdC5hc3NpZ24oe30sIHByb3BzLCBwcm9qZWN0UHJvcHMpO1xuICAgIH1cblxuICAgIGNvbnN0IHdyYXBwZXJTdHlsZSA9IHtcbiAgICAgIGRpc3BsYXk6ICdmbGV4JyxcbiAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxuICAgICAganVzdGlmeUNvbnRlbnQ6ICdjZW50ZXInLFxuICAgIH07XG5cbiAgICBjb25zdCBzdHlsZSA9IHtcbiAgICAgIHdpZHRoOiAnNTAwcHgnLFxuICAgIH07XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBzdHlsZT17d3JhcHBlclN0eWxlfSBjbGFzc05hbWU9XCJwcm9qZWN0LW1hbmFnZXItZWRpdCBwYWRkZWQgbmF0aXZlLWtleS1iaW5kaW5nc1wiPlxuICAgICAgICA8ZGl2IHN0eWxlPXtzdHlsZX0+XG4gICAgICAgICAgPGgxIGNsYXNzTmFtZT1cImJsb2NrIHNlY3Rpb24taGVhZGluZ1wiPnt0aGlzLmdldFRpdGxlKCl9PC9oMT5cblxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYmxvY2tcIj5cbiAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJpbnB1dC1sYWJlbFwiPlRpdGxlPC9sYWJlbD5cbiAgICAgICAgICAgIDxpbnB1dCByZWY9XCJ0aXRsZVwiIHR5cGU9XCJ0ZXh0XCIgY2xhc3NOYW1lPVwiaW5wdXQtdGV4dFwiIHZhbHVlPXtwcm9wcy50aXRsZX0gdGFiSW5kZXg9XCIwXCIgLz5cbiAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYmxvY2tcIj5cbiAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJpbnB1dC1sYWJlbFwiPkdyb3VwPC9sYWJlbD5cbiAgICAgICAgICAgIDxpbnB1dCByZWY9XCJncm91cFwiIHR5cGU9XCJ0ZXh0XCIgY2xhc3NOYW1lPVwiaW5wdXQtdGV4dFwiIHZhbHVlPXtwcm9wcy5ncm91cH0gdGFiSW5kZXg9XCIxXCIgLz5cbiAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYmxvY2tcIj5cbiAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJpbnB1dC1sYWJlbFwiPkljb248L2xhYmVsPlxuICAgICAgICAgICAgPGlucHV0IHJlZj1cImljb25cIiB0eXBlPVwidGV4dFwiIGNsYXNzTmFtZT1cImlucHV0LXRleHRcIiB2YWx1ZT17cHJvcHMuaWNvbn0gdGFiSW5kZXg9XCIyXCIgLz5cbiAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYmxvY2tcIj5cbiAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJpbnB1dC1sYWJlbFwiIGZvcj1cImRldk1vZGVcIj5EZXZlbG9wbWVudCBtb2RlPC9sYWJlbD5cbiAgICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgICAgcmVmPVwiZGV2TW9kZVwiXG4gICAgICAgICAgICAgICAgaWQ9XCJkZXZNb2RlXCJcbiAgICAgICAgICAgICAgICBuYW1lPVwiZGV2TW9kZVwiXG4gICAgICAgICAgICAgICAgdHlwZT1cImNoZWNrYm94XCJcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJpbnB1dC10b2dnbGVcIlxuICAgICAgICAgICAgICAgIGNoZWNrZWQ9e3Byb3BzLmRldk1vZGV9XG4gICAgICAgICAgICAgICAgdGFiSW5kZXg9XCIzXCJcbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYmxvY2tcIiBzdHlsZT17eyB0ZXh0QWxpZ246ICdyaWdodCcgfX0+XG4gICAgICAgICAgICA8YnV0dG9uIHJlZj1cInNhdmVcIiBjbGFzc05hbWU9XCJidG4gYnRuLXByaW1hcnlcIiB0YWJJbmRleD1cIjRcIj5TYXZlPC9idXR0b24+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuIl19