"use babel";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.activate = activate;
exports.deactivate = deactivate;
exports.deserialize = deserialize;
var path = null;
var PdfEditorView = null;

var config = {
  reverseSyncBehaviour: {
    type: "string",
    "enum": ['Disabled', 'Click', 'Double click'],
    'default': 'Click',
    title: "SyncTeX Reverse sync behaviour",
    description: "Specify the action on the PDF generated with the `--synctex=1` option that takes you to the source."
  },
  syncTeXPath: {
    type: "string",
    'default': "",
    title: "Path to synctex binary",
    description: "If not specified, look for `synctex` in `PATH`"
  },
  fitToWidthOnOpen: {
    type: "boolean",
    'default': false,
    title: "Fit to width on open",
    description: "When opening a document, fit it to the pane width"
  },
  paneToUseInSynctex: {
    type: "string",
    'enum': ['default', 'left', 'right', 'up', 'down'],
    'default': 'default',
    title: "Pane to use when opening new tex files",
    description: "When using reverse sync and a new tex source file has to be opened, use the provided pane to open the new file. 'default' will use the pane of the PDF viewer."
  },
  autoReloadOnUpdate: {
    type: "boolean",
    'default': true,
    title: "Auto reload on update",
    description: "Auto reload when the file is updated"
  }
};

exports.config = config;

function activate(state) {
  this.subscription = atom.workspace.addOpener(openUri);
  atom.packages.onDidActivateInitialPackages(createPdfStatusView);
}

function deactivate() {
  this.subscription.dispose();
}

// Files with these extensions will be opened as PDFs
var pdfExtensions = new Set(['.pdf']);

function openUri(uriToOpen) {
  if (path === null) {
    path = require('path');
  }

  var uriExtension = path.extname(uriToOpen).toLowerCase();
  if (pdfExtensions.has(uriExtension)) {
    if (PdfEditorView === null) {
      PdfEditorView = require('./pdf-editor-view');
    }
    return new PdfEditorView(uriToOpen);
  }
}

function createPdfStatusView() {
  var PdfStatusBarView = require('./pdf-status-bar-view');
  new PdfStatusBarView();
  var PdfGoToPageView = require('./pdf-goto-page-view');
  new PdfGoToPageView();
}

function deserialize(_ref) {
  var filePath = _ref.filePath;
  var scale = _ref.scale;
  var scrollTop = _ref.scrollTop;
  var scrollLeft = _ref.scrollLeft;

  if (require('fs-plus').isFileSync(filePath)) {
    if (PdfEditorView === null) {
      PdfEditorView = require('./pdf-editor-view');
    }
    return new PdfEditorView(filePath, scale, scrollTop, scrollLeft);
  } else {
    console.warn("Could not deserialize PDF editor for path '#{filePath}' because that file no longer exists");
  }
}

if (parseFloat(atom.getVersion()) < 1.7) {
  atom.deserializers.add({
    "name": "PdfEditorDeserializer",
    "deserialize": deserialize
  });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2JpbGx5Ly5hdG9tL3BhY2thZ2VzL3BkZi12aWV3L2xpYi9wZGYtZWRpdG9yLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFdBQVcsQ0FBQzs7Ozs7Ozs7QUFFWixJQUFJLElBQUksR0FBRyxJQUFJLENBQUM7QUFDaEIsSUFBSSxhQUFhLEdBQUcsSUFBSSxDQUFDOztBQUVsQixJQUFNLE1BQU0sR0FBRztBQUNwQixzQkFBb0IsRUFBRTtBQUNwQixRQUFJLEVBQUUsUUFBUTtBQUNkLFlBQU0sQ0FBQyxVQUFVLEVBQUUsT0FBTyxFQUFFLGNBQWMsQ0FBQztBQUMzQyxhQUFTLEVBQUUsT0FBTztBQUNsQixTQUFLLEVBQUUsZ0NBQWdDO0FBQ3ZDLGVBQVcsRUFBRSxxR0FBcUc7R0FDbkg7QUFDRCxhQUFXLEVBQUU7QUFDWCxRQUFJLEVBQUUsUUFBUTtBQUNkLGFBQVMsRUFBRSxFQUFFO0FBQ2IsU0FBSyxFQUFFLHdCQUF3QjtBQUMvQixlQUFXLEVBQUUsZ0RBQWdEO0dBQzlEO0FBQ0Qsa0JBQWdCLEVBQUU7QUFDaEIsUUFBSSxFQUFFLFNBQVM7QUFDZixhQUFTLEVBQUUsS0FBSztBQUNoQixTQUFLLEVBQUUsc0JBQXNCO0FBQzdCLGVBQVcsRUFBRSxtREFBbUQ7R0FDakU7QUFDRCxvQkFBa0IsRUFBRTtBQUNsQixRQUFJLEVBQUUsUUFBUTtBQUNkLFVBQU0sRUFBRyxDQUFDLFNBQVMsRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLENBQUM7QUFDbkQsYUFBUyxFQUFFLFNBQVM7QUFDcEIsU0FBSyxFQUFFLHdDQUF3QztBQUMvQyxlQUFXLEVBQUUsZ0tBQWdLO0dBQzlLO0FBQ0Qsb0JBQWtCLEVBQUU7QUFDbEIsUUFBSSxFQUFFLFNBQVM7QUFDZixhQUFTLEVBQUUsSUFBSTtBQUNmLFNBQUssRUFBRSx1QkFBdUI7QUFDOUIsZUFBVyxFQUFFLHNDQUFzQztHQUNwRDtDQUNGLENBQUE7Ozs7QUFFTSxTQUFTLFFBQVEsQ0FBQyxLQUFLLEVBQUU7QUFDOUIsTUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUN0RCxNQUFJLENBQUMsUUFBUSxDQUFDLDRCQUE0QixDQUFDLG1CQUFtQixDQUFDLENBQUM7Q0FDakU7O0FBRU0sU0FBUyxVQUFVLEdBQUc7QUFDM0IsTUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsQ0FBQztDQUM3Qjs7O0FBR0QsSUFBTSxhQUFhLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDOztBQUV4QyxTQUFTLE9BQU8sQ0FBQyxTQUFTLEVBQUU7QUFDMUIsTUFBSSxJQUFJLEtBQUssSUFBSSxFQUFFO0FBQ2pCLFFBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7R0FDeEI7O0FBRUQsTUFBSSxZQUFZLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQTtBQUN4RCxNQUFJLGFBQWEsQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLEVBQUU7QUFDbkMsUUFBSSxhQUFhLEtBQUssSUFBSSxFQUFFO0FBQzFCLG1CQUFhLEdBQUcsT0FBTyxDQUFDLG1CQUFtQixDQUFDLENBQUM7S0FDOUM7QUFDRCxXQUFPLElBQUksYUFBYSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0dBQ3JDO0NBQ0Y7O0FBRUQsU0FBUyxtQkFBbUIsR0FBRztBQUM3QixNQUFJLGdCQUFnQixHQUFHLE9BQU8sQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO0FBQ3hELE1BQUksZ0JBQWdCLEVBQUUsQ0FBQztBQUN2QixNQUFJLGVBQWUsR0FBRyxPQUFPLENBQUMsc0JBQXNCLENBQUMsQ0FBQztBQUN0RCxNQUFJLGVBQWUsRUFBRSxDQUFDO0NBQ3ZCOztBQUVNLFNBQVMsV0FBVyxDQUFDLElBQXdDLEVBQUU7TUFBekMsUUFBUSxHQUFULElBQXdDLENBQXZDLFFBQVE7TUFBRSxLQUFLLEdBQWhCLElBQXdDLENBQTdCLEtBQUs7TUFBRSxTQUFTLEdBQTNCLElBQXdDLENBQXRCLFNBQVM7TUFBRSxVQUFVLEdBQXZDLElBQXdDLENBQVgsVUFBVTs7QUFDakUsTUFBSSxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxFQUFFO0FBQzNDLFFBQUksYUFBYSxLQUFLLElBQUksRUFBRTtBQUMxQixtQkFBYSxHQUFHLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0tBQzlDO0FBQ0QsV0FBTyxJQUFJLGFBQWEsQ0FBQyxRQUFRLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRSxVQUFVLENBQUMsQ0FBQztHQUNsRSxNQUFNO0FBQ0wsV0FBTyxDQUFDLElBQUksQ0FBQyw0RkFBNEYsQ0FBQyxDQUFDO0dBQzVHO0NBQ0Y7O0FBRUQsSUFBSSxVQUFVLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDLEdBQUcsR0FBRyxFQUFFO0FBQ3ZDLE1BQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDO0FBQ3JCLFVBQU0sRUFBRSx1QkFBdUI7QUFDL0IsaUJBQWEsRUFBRSxXQUFXO0dBQzNCLENBQUMsQ0FBQztDQUNKIiwiZmlsZSI6Ii9ob21lL2JpbGx5Ly5hdG9tL3BhY2thZ2VzL3BkZi12aWV3L2xpYi9wZGYtZWRpdG9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2UgYmFiZWxcIjtcblxudmFyIHBhdGggPSBudWxsO1xudmFyIFBkZkVkaXRvclZpZXcgPSBudWxsO1xuXG5leHBvcnQgY29uc3QgY29uZmlnID0ge1xuICByZXZlcnNlU3luY0JlaGF2aW91cjoge1xuICAgIHR5cGU6IFwic3RyaW5nXCIsXG4gICAgZW51bTogWydEaXNhYmxlZCcsICdDbGljaycsICdEb3VibGUgY2xpY2snXSxcbiAgICAnZGVmYXVsdCc6ICdDbGljaycsXG4gICAgdGl0bGU6IFwiU3luY1RlWCBSZXZlcnNlIHN5bmMgYmVoYXZpb3VyXCIsXG4gICAgZGVzY3JpcHRpb246IFwiU3BlY2lmeSB0aGUgYWN0aW9uIG9uIHRoZSBQREYgZ2VuZXJhdGVkIHdpdGggdGhlIGAtLXN5bmN0ZXg9MWAgb3B0aW9uIHRoYXQgdGFrZXMgeW91IHRvIHRoZSBzb3VyY2UuXCJcbiAgfSxcbiAgc3luY1RlWFBhdGg6IHtcbiAgICB0eXBlOiBcInN0cmluZ1wiLFxuICAgICdkZWZhdWx0JzogXCJcIixcbiAgICB0aXRsZTogXCJQYXRoIHRvIHN5bmN0ZXggYmluYXJ5XCIsXG4gICAgZGVzY3JpcHRpb246IFwiSWYgbm90IHNwZWNpZmllZCwgbG9vayBmb3IgYHN5bmN0ZXhgIGluIGBQQVRIYFwiXG4gIH0sXG4gIGZpdFRvV2lkdGhPbk9wZW46IHtcbiAgICB0eXBlOiBcImJvb2xlYW5cIixcbiAgICAnZGVmYXVsdCc6IGZhbHNlLFxuICAgIHRpdGxlOiBcIkZpdCB0byB3aWR0aCBvbiBvcGVuXCIsXG4gICAgZGVzY3JpcHRpb246IFwiV2hlbiBvcGVuaW5nIGEgZG9jdW1lbnQsIGZpdCBpdCB0byB0aGUgcGFuZSB3aWR0aFwiXG4gIH0sXG4gIHBhbmVUb1VzZUluU3luY3RleDoge1xuICAgIHR5cGU6IFwic3RyaW5nXCIsXG4gICAgJ2VudW0nIDogWydkZWZhdWx0JywgJ2xlZnQnLCAncmlnaHQnLCAndXAnLCAnZG93biddLFxuICAgICdkZWZhdWx0JzogJ2RlZmF1bHQnLFxuICAgIHRpdGxlOiBcIlBhbmUgdG8gdXNlIHdoZW4gb3BlbmluZyBuZXcgdGV4IGZpbGVzXCIsXG4gICAgZGVzY3JpcHRpb246IFwiV2hlbiB1c2luZyByZXZlcnNlIHN5bmMgYW5kIGEgbmV3IHRleCBzb3VyY2UgZmlsZSBoYXMgdG8gYmUgb3BlbmVkLCB1c2UgdGhlIHByb3ZpZGVkIHBhbmUgdG8gb3BlbiB0aGUgbmV3IGZpbGUuICdkZWZhdWx0JyB3aWxsIHVzZSB0aGUgcGFuZSBvZiB0aGUgUERGIHZpZXdlci5cIlxuICB9LFxuICBhdXRvUmVsb2FkT25VcGRhdGU6IHtcbiAgICB0eXBlOiBcImJvb2xlYW5cIixcbiAgICAnZGVmYXVsdCc6IHRydWUsXG4gICAgdGl0bGU6IFwiQXV0byByZWxvYWQgb24gdXBkYXRlXCIsXG4gICAgZGVzY3JpcHRpb246IFwiQXV0byByZWxvYWQgd2hlbiB0aGUgZmlsZSBpcyB1cGRhdGVkXCJcbiAgfSxcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFjdGl2YXRlKHN0YXRlKSB7XG4gIHRoaXMuc3Vic2NyaXB0aW9uID0gYXRvbS53b3Jrc3BhY2UuYWRkT3BlbmVyKG9wZW5VcmkpO1xuICBhdG9tLnBhY2thZ2VzLm9uRGlkQWN0aXZhdGVJbml0aWFsUGFja2FnZXMoY3JlYXRlUGRmU3RhdHVzVmlldyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkZWFjdGl2YXRlKCkge1xuICB0aGlzLnN1YnNjcmlwdGlvbi5kaXNwb3NlKCk7XG59XG5cbi8vIEZpbGVzIHdpdGggdGhlc2UgZXh0ZW5zaW9ucyB3aWxsIGJlIG9wZW5lZCBhcyBQREZzXG5jb25zdCBwZGZFeHRlbnNpb25zID0gbmV3IFNldChbJy5wZGYnXSk7XG5cbmZ1bmN0aW9uIG9wZW5VcmkodXJpVG9PcGVuKSB7XG4gIGlmIChwYXRoID09PSBudWxsKSB7XG4gICAgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKTtcbiAgfVxuXG4gIGxldCB1cmlFeHRlbnNpb24gPSBwYXRoLmV4dG5hbWUodXJpVG9PcGVuKS50b0xvd2VyQ2FzZSgpXG4gIGlmIChwZGZFeHRlbnNpb25zLmhhcyh1cmlFeHRlbnNpb24pKSB7XG4gICAgaWYgKFBkZkVkaXRvclZpZXcgPT09IG51bGwpIHtcbiAgICAgIFBkZkVkaXRvclZpZXcgPSByZXF1aXJlKCcuL3BkZi1lZGl0b3ItdmlldycpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IFBkZkVkaXRvclZpZXcodXJpVG9PcGVuKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBjcmVhdGVQZGZTdGF0dXNWaWV3KCkge1xuICBsZXQgUGRmU3RhdHVzQmFyVmlldyA9IHJlcXVpcmUoJy4vcGRmLXN0YXR1cy1iYXItdmlldycpO1xuICBuZXcgUGRmU3RhdHVzQmFyVmlldygpO1xuICBsZXQgUGRmR29Ub1BhZ2VWaWV3ID0gcmVxdWlyZSgnLi9wZGYtZ290by1wYWdlLXZpZXcnKTtcbiAgbmV3IFBkZkdvVG9QYWdlVmlldygpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZGVzZXJpYWxpemUoe2ZpbGVQYXRoLCBzY2FsZSwgc2Nyb2xsVG9wLCBzY3JvbGxMZWZ0fSkge1xuICBpZiAocmVxdWlyZSgnZnMtcGx1cycpLmlzRmlsZVN5bmMoZmlsZVBhdGgpKSB7XG4gICAgaWYgKFBkZkVkaXRvclZpZXcgPT09IG51bGwpIHtcbiAgICAgIFBkZkVkaXRvclZpZXcgPSByZXF1aXJlKCcuL3BkZi1lZGl0b3ItdmlldycpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IFBkZkVkaXRvclZpZXcoZmlsZVBhdGgsIHNjYWxlLCBzY3JvbGxUb3AsIHNjcm9sbExlZnQpO1xuICB9IGVsc2Uge1xuICAgIGNvbnNvbGUud2FybihcIkNvdWxkIG5vdCBkZXNlcmlhbGl6ZSBQREYgZWRpdG9yIGZvciBwYXRoICcje2ZpbGVQYXRofScgYmVjYXVzZSB0aGF0IGZpbGUgbm8gbG9uZ2VyIGV4aXN0c1wiKTtcbiAgfVxufVxuXG5pZiAocGFyc2VGbG9hdChhdG9tLmdldFZlcnNpb24oKSkgPCAxLjcpIHtcbiAgYXRvbS5kZXNlcmlhbGl6ZXJzLmFkZCh7XG4gICAgXCJuYW1lXCI6IFwiUGRmRWRpdG9yRGVzZXJpYWxpemVyXCIsXG4gICAgXCJkZXNlcmlhbGl6ZVwiOiBkZXNlcmlhbGl6ZVxuICB9KTtcbn1cbiJdfQ==