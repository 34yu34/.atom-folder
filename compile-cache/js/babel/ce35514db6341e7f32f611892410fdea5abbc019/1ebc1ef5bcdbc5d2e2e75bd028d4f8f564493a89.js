"use babel";

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x6, _x7, _x8) { var _again = true; _function: while (_again) { var object = _x6, property = _x7, receiver = _x8; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x6 = parent; _x7 = property; _x8 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _require = require('atom-space-pen-views');

var $ = _require.$;
var ScrollView = _require.ScrollView;

var _require2 = require('atom');

var Point = _require2.Point;

var fs = require('fs-plus');
var path = require('path');
var _ = require('underscore-plus');

var _require3 = require('atom');

var File = _require3.File;
var Disposable = _require3.Disposable;
var CompositeDisposable = _require3.CompositeDisposable;

var _require4 = require('loophole');

var Function = _require4.Function;

global.Function = Function;

global.PDFJS = { workerSrc: "temp", cMapUrl: "temp", cMapPacked: true };
require('./../node_modules/pdfjs-dist/build/pdf.js');
PDFJS.workerSrc = "file://" + path.resolve(__dirname, "../node_modules/pdfjs-dist/build/pdf.worker.js");
PDFJS.cMapUrl = "file://" + path.resolve(__dirname, "../node_modules/pdfjs-dist/cmaps") + "/";

var _require5 = require('child_process');

var exec = _require5.exec;
var execFile = _require5.execFile;

var PdfEditorView = (function (_ScrollView) {
  _inherits(PdfEditorView, _ScrollView);

  _createClass(PdfEditorView, null, [{
    key: 'content',
    value: function content() {
      var _this = this;

      this.div({ 'class': 'pdf-view', tabindex: -1 }, function () {
        _this.div({ outlet: 'container', style: 'position: relative' });
      });
    }
  }]);

  function PdfEditorView(filePath) {
    var scale = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

    var _this2 = this;

    var scrollTop = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];
    var scrollLeft = arguments.length <= 3 || arguments[3] === undefined ? 0 : arguments[3];

    _classCallCheck(this, PdfEditorView);

    _get(Object.getPrototypeOf(PdfEditorView.prototype), 'constructor', this).call(this);

    this.currentScale = scale ? scale : 1.5;
    this.defaultScale = 1.5;
    this.scaleFactor = 10.0;
    this.fitToWidthOnOpen = !scale && atom.config.get('pdf-view.fitToWidthOnOpen');

    this.filePath = filePath;
    this.file = new File(this.filePath);
    this.scrollTopBeforeUpdate = scrollTop;
    this.scrollLeftBeforeUpdate = scrollLeft;
    this.canvases = [];
    this.updating = false;

    this.updatePdf(true);

    this.currentPageNumber = 0;
    this.totalPageNumber = 0;
    this.centersBetweenPages = [];
    this.pageHeights = [];
    this.maxPageWidth = 0;
    this.toScaleFactor = 1.0;

    var disposables = new CompositeDisposable();

    var needsUpdateCallback = _.debounce(function () {
      if (_this2.updating) {
        _this2.needsUpdate = true;
      } else {
        _this2.updatePdf();
      }
    }, 100);

    disposables.add(atom.config.onDidChange('pdf-view.reverseSyncBehaviour', needsUpdateCallback));

    var autoReloadDisposable = undefined;
    var setupAutoReload = function setupAutoReload() {
      if (atom.config.get('pdf-view.autoReloadOnUpdate')) {
        autoReloadDisposable = _this2.file.onDidChange(needsUpdateCallback);
        disposables.add(autoReloadDisposable);
      } else if (autoReloadDisposable) {
        disposables.remove(autoReloadDisposable);
        autoReloadDisposable.dispose();
      }
    };
    disposables.add(atom.config.observe('pdf-view.autoReloadOnUpdate', setupAutoReload));

    var moveLeftCallback = function moveLeftCallback() {
      return _this2.scrollLeft(_this2.scrollLeft() - $(window).width() / 20);
    };
    var moveRightCallback = function moveRightCallback() {
      return _this2.scrollRight(_this2.scrollRight() + $(window).width() / 20);
    };
    var scrollCallback = function scrollCallback() {
      return _this2.onScroll();
    };
    var resizeHandler = function resizeHandler() {
      return _this2.setCurrentPageNumber();
    };

    var elem = this;

    atom.commands.add('.pdf-view', {
      'core:move-left': moveLeftCallback,
      'core:move-right': moveRightCallback
    });

    elem.on('scroll', scrollCallback);
    disposables.add(new Disposable(function () {
      return $(window).off('scroll', scrollCallback);
    }));

    $(window).on('resize', resizeHandler);
    disposables.add(new Disposable(function () {
      return $(window).off('resize', resizeHandler);
    }));

    atom.commands.add('atom-workspace', {
      'pdf-view:zoom-in': function pdfViewZoomIn() {
        if (atom.workspace.getActivePaneItem() === _this2) {
          _this2.zoomIn();
        }
      },
      'pdf-view:zoom-out': function pdfViewZoomOut() {
        if (atom.workspace.getActivePaneItem() === _this2) {
          _this2.zoomOut();
        }
      },
      'pdf-view:reset-zoom': function pdfViewResetZoom() {
        if (atom.workspace.getActivePaneItem() === _this2) {
          _this2.resetZoom();
        }
      },
      'pdf-view:go-to-next-page': function pdfViewGoToNextPage() {
        if (atom.workspace.getActivePaneItem() === _this2) {
          _this2.goToNextPage();
        }
      },
      'pdf-view:go-to-previous-page': function pdfViewGoToPreviousPage() {
        if (atom.workspace.getActivePaneItem() === _this2) {
          _this2.goToPreviousPage();
        }
      },
      'pdf-view:reload': function pdfViewReload() {
        _this2.updatePdf(true);
      }
    });

    this.dragging = null;

    this.onMouseMove = function (e) {
      if (_this2.dragging) {
        _this2.simpleClick = false;

        _this2.scrollTop(_this2.dragging.scrollTop - (e.screenY - _this2.dragging.y));
        _this2.scrollLeft(_this2.dragging.scrollLeft - (e.screenX - _this2.dragging.x));
        e.preventDefault();
      }
    };

    this.onMouseUp = function (e) {
      _this2.dragging = null;
      $(document).unbind('mousemove', _this2.onMouseMove);
      $(document).unbind('mouseup', _this2.onMouseUp);
      e.preventDefault();
    };

    this.on('mousedown', function (e) {
      _this2.simpleClick = true;
      atom.workspace.paneForItem(_this2).activate();
      _this2.dragging = { x: e.screenX, y: e.screenY, scrollTop: _this2.scrollTop(), scrollLeft: _this2.scrollLeft() };
      $(document).on('mousemove', _this2.onMouseMove);
      $(document).on('mouseup', _this2.onMouseUp);
      e.preventDefault();
    });

    this.on('mousewheel', function (e) {
      if (e.ctrlKey) {
        e.preventDefault();
        if (e.originalEvent.wheelDelta > 0) {
          _this2.zoomIn();
        } else if (e.originalEvent.wheelDelta < 0) {
          _this2.zoomOut();
        }
      }
    });
  }

  _createClass(PdfEditorView, [{
    key: 'reverseSync',
    value: function reverseSync(page, e) {
      var _this3 = this;

      if (this.simpleClick) {
        e.preventDefault();
        this.pdfDocument.getPage(page).then(function (pdfPage) {
          var viewport = pdfPage.getViewport(_this3.currentScale);
          var x = undefined,
              y = undefined;

          var _viewport$convertToPdfPoint = viewport.convertToPdfPoint(e.offsetX, $(_this3.canvases[page - 1]).height() - e.offsetY);

          var _viewport$convertToPdfPoint2 = _slicedToArray(_viewport$convertToPdfPoint, 2);

          x = _viewport$convertToPdfPoint2[0];
          y = _viewport$convertToPdfPoint2[1];

          var callback = function callback(error, stdout, stderr) {
            if (!error) {
              stdout = stdout.replace(/\r\n/g, '\n');
              var attrs = {};
              for (var _line of stdout.split('\n')) {
                var m = _line.match(/^([a-zA-Z]*):(.*)$/);
                if (m) {
                  attrs[m[1]] = m[2];
                }
              }

              var file = attrs.Input;
              var line = attrs.Line;

              if (file && line) {
                var editor = null;
                var pathToOpen = path.normalize(attrs.Input);
                var lineToOpen = +attrs.Line;
                var done = false;
                for (var _editor of atom.workspace.getTextEditors()) {
                  if (_editor.getPath() === pathToOpen) {
                    var position = new Point(lineToOpen - 1, -1);
                    _editor.scrollToBufferPosition(position, { center: true });
                    _editor.setCursorBufferPosition(position);
                    _editor.moveToFirstCharacterOfLine();
                    var pane = atom.workspace.paneForItem(_editor);
                    pane.activateItem(_editor);
                    pane.activate();
                    done = true;
                    break;
                  }
                }

                if (!done) {
                  var paneopt = atom.config.get('pdf-view.paneToUseInSynctex');
                  atom.workspace.open(pathToOpen, { initialLine: lineToOpen, initialColumn: 0, split: paneopt });
                }
              }
            }
          };

          var synctexPath = atom.config.get('pdf-view.syncTeXPath');
          var clickspec = [page, x, y, _this3.filePath].join(':');

          if (synctexPath) {
            execFile(synctexPath, ["edit", "-o", clickspec], callback);
          } else {
            var cmd = 'synctex edit -o "' + clickspec + '"';
            exec(cmd, callback);
          }
        });
      }
    }
  }, {
    key: 'forwardSync',
    value: function forwardSync(texPath, lineNumber) {
      var _this4 = this;

      if (this.updating) {
        this.forwardSyncAfterUpdate = {
          texPath: texPath,
          lineNumber: lineNumber
        };
        return;
      }

      var callback = function callback(error, stdout, stderr) {
        if (!error) {
          var _ret = (function () {
            stdout = stdout.replace(/\r\n/g, '\n');
            var attrs = {};
            for (var line of stdout.split('\n')) {
              var m = line.match(/^([a-zA-Z]*):(.*)$/);
              if (m) {
                if (m[1] in attrs) {
                  break;
                }

                attrs[m[1]] = m[2];
              }
            }

            var page = parseInt(attrs.Page);

            if (page > _this4.pdfDocument.numPages) {
              return {
                v: undefined
              };
            }

            _this4.pdfDocument.getPage(page).then(function (pdfPage) {
              var viewport = pdfPage.getViewport(_this4.currentScale);
              var canvas = _this4.canvases[page - 1];

              var x = parseFloat(attrs.x);
              var y = parseFloat(attrs.y);

              var _viewport$convertToViewportPoint = viewport.convertToViewportPoint(x, y);

              var _viewport$convertToViewportPoint2 = _slicedToArray(_viewport$convertToViewportPoint, 2);

              x = _viewport$convertToViewportPoint2[0];
              y = _viewport$convertToViewportPoint2[1];

              x = x + canvas.offsetLeft;
              y = viewport.height - y + canvas.offsetTop;

              var visibilityThreshold = 50;

              // Scroll
              if (y < _this4.scrollTop() + visibilityThreshold) {
                _this4.scrollTop(y - visibilityThreshold);
              } else if (y > _this4.scrollBottom() - visibilityThreshold) {
                _this4.scrollBottom(y + visibilityThreshold);
              }

              if (x < _this4.scrollLeft() + visibilityThreshold) {
                _this4.scrollLeft(x - visibilityThreshold);
              } else if (x > _this4.scrollRight() - visibilityThreshold) {
                _this4.scrollBottom(x + visibilityThreshold);
              }

              // Show highlighter
              $('<div/>', {
                'class': "tex-highlight",
                style: 'top: ' + y + 'px; left: ' + x + 'px;'
              }).appendTo(_this4.container).on('animationend', function () {
                $(this).remove();
              });
            });
          })();

          if (typeof _ret === 'object') return _ret.v;
        }
      };

      var synctexPath = atom.config.get('pdf-view.syncTeXPath');
      var inputspec = [lineNumber, 0, texPath].join(':');

      if (synctexPath) {
        execFile(synctexPath, ["view", "-i", inputspec, "-o", this.filePath], callback);
      } else {
        var cmd = 'synctex view -i "' + inputspec + '" -o "' + this.filePath + '"';
        exec(cmd, callback);
      }
    }
  }, {
    key: 'onScroll',
    value: function onScroll() {
      if (!this.updating) {
        this.scrollTopBeforeUpdate = this.scrollTop();
        this.scrollLeftBeforeUpdate = this.scrollLeft();
      }

      this.setCurrentPageNumber();
    }
  }, {
    key: 'setCurrentPageNumber',
    value: function setCurrentPageNumber() {
      if (!this.pdfDocument) {
        return;
      }

      var center = (this.scrollBottom() + this.scrollTop()) / 2.0;
      this.currentPageNumber = 1;

      if (this.centersBetweenPages.length === 0 && this.pageHeights.length === this.pdfDocument.numPages) for (var pdfPageNumber of _.range(1, this.pdfDocument.numPages + 1)) {
        this.centersBetweenPages.push(this.pageHeights.slice(0, pdfPageNumber).reduce(function (x, y) {
          return x + y;
        }, 0) + pdfPageNumber * 20 - 10);
      }

      for (var pdfPageNumber of _.range(2, this.pdfDocument.numPages + 1)) {
        if (center >= this.centersBetweenPages[pdfPageNumber - 2] && center < this.centersBetweenPages[pdfPageNumber - 1]) {
          this.currentPageNumber = pdfPageNumber;
        }
      }

      atom.views.getView(atom.workspace).dispatchEvent(new Event('pdf-view:current-page-update'));
    }
  }, {
    key: 'finishUpdate',
    value: function finishUpdate() {
      this.updating = false;
      if (this.needsUpdate) {
        this.updatePdf();
      }
      if (this.toScaleFactor != 1) {
        this.adjustSize(1);
      }
      if (this.scrollToPageAfterUpdate) {
        this.scrollToPage(this.scrollToPageAfterUpdate);
        delete this.scrollToPageAfterUpdate;
      }
      if (this.forwardSyncAfterUpdate) {
        this.forwardSync(this.forwardSyncAfterUpdate.texPath, this.forwardSyncAfterUpdate.lineNumber);
        delete this.forwardSyncAfterUpdate;
      }
    }
  }, {
    key: 'updatePdf',
    value: function updatePdf() {
      var _this5 = this;

      var closeOnError = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

      this.needsUpdate = false;

      if (!fs.existsSync(this.filePath)) {
        return;
      }

      var pdfData = null;

      try {
        pdfData = new Uint8Array(fs.readFileSync(this.filePath));
      } catch (error) {
        if (error.code === 'ENOENT') {
          return;
        }
      }

      this.updating = true;

      var reverseSyncClicktype = null;
      switch (atom.config.get('pdf-view.reverseSyncBehaviour')) {
        case 'Click':
          reverseSyncClicktype = 'click';
          break;
        case 'Double click':
          reverseSyncClicktype = 'dblclick';
          break;
      }

      PDFJS.getDocument(pdfData).then(function (pdfDocument) {
        _this5.container.find("canvas").remove();
        _this5.canvases = [];
        _this5.pageHeights = [];

        _this5.pdfDocument = pdfDocument;
        _this5.totalPageNumber = _this5.pdfDocument.numPages;

        var _loop = function (pdfPageNumber) {
          var canvas = $("<canvas/>", { 'class': "page-container" }).appendTo(_this5.container)[0];
          _this5.canvases.push(canvas);
          _this5.pageHeights.push(0);
          if (reverseSyncClicktype) {
            $(canvas).on(reverseSyncClicktype, function (e) {
              return _this5.reverseSync(pdfPageNumber, e);
            });
          }
        };

        for (var pdfPageNumber of _.range(1, _this5.pdfDocument.numPages + 1)) {
          _loop(pdfPageNumber);
        }

        if (_this5.fitToWidthOnOpen) {
          Promise.all(_.range(1, _this5.pdfDocument.numPages + 1).map(function (pdfPageNumber) {
            return _this5.pdfDocument.getPage(pdfPageNumber).then(function (pdfPage) {
              return pdfPage.getViewport(1.0).width;
            });
          })).then(function (pdfPageWidths) {
            _this5.maxPageWidth = Math.max.apply(Math, _toConsumableArray(pdfPageWidths));
            _this5.renderPdf();
          });
        } else {
          _this5.renderPdf();
        }
      }, function () {
        if (closeOnError) {
          atom.notifications.addError(_this5.filePath + " is not a PDF file.");
          atom.workspace.paneForItem(_this5).destroyItem(_this5);
        } else {
          _this5.finishUpdate();
        }
      });
    }
  }, {
    key: 'renderPdf',
    value: function renderPdf() {
      var _this6 = this;

      var scrollAfterRender = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];

      this.centersBetweenPages = [];

      if (this.fitToWidthOnOpen) {
        this.currentScale = this[0].clientWidth / this.maxPageWidth;
        this.fitToWidthOnOpen = false;
      }

      Promise.all(_.range(1, this.pdfDocument.numPages + 1).map(function (pdfPageNumber) {
        var canvas = _this6.canvases[pdfPageNumber - 1];

        return _this6.pdfDocument.getPage(pdfPageNumber).then(function (pdfPage) {
          var viewport = pdfPage.getViewport(_this6.currentScale);
          var context = canvas.getContext('2d');

          var outputScale = window.devicePixelRatio;
          canvas.height = Math.floor(viewport.height) * outputScale;
          canvas.width = Math.floor(viewport.width) * outputScale;

          context._scaleX = outputScale;
          context._scaleY = outputScale;
          context.scale(outputScale, outputScale);
          context._transformMatrix = [outputScale, 0, 0, outputScale, 0, 0];
          canvas.style.width = Math.floor(viewport.width) + 'px';
          canvas.style.height = Math.floor(viewport.height) + 'px';

          _this6.pageHeights[pdfPageNumber - 1] = Math.floor(viewport.height);

          return pdfPage.render({ canvasContext: context, viewport: viewport });
        });
      })).then(function (renderTasks) {
        if (scrollAfterRender) {
          _this6.scrollTop(_this6.scrollTopBeforeUpdate);
          _this6.scrollLeft(_this6.scrollLeftBeforeUpdate);
          _this6.setCurrentPageNumber();
        }
        Promise.all(renderTasks).then(function () {
          return _this6.finishUpdate();
        });
      }, function () {
        return _this6.finishUpdate();
      });
    }
  }, {
    key: 'zoomOut',
    value: function zoomOut() {
      return this.adjustSize(100 / (100 + this.scaleFactor));
    }
  }, {
    key: 'zoomIn',
    value: function zoomIn() {
      return this.adjustSize((100 + this.scaleFactor) / 100);
    }
  }, {
    key: 'resetZoom',
    value: function resetZoom() {
      return this.adjustSize(this.defaultScale / this.currentScale);
    }
  }, {
    key: 'goToNextPage',
    value: function goToNextPage() {
      return this.scrollToPage(this.currentPageNumber + 1);
    }
  }, {
    key: 'goToPreviousPage',
    value: function goToPreviousPage() {
      return this.scrollToPage(this.currentPageNumber - 1);
    }
  }, {
    key: 'computeZoomedScrollTop',
    value: function computeZoomedScrollTop(oldScrollTop, oldPageHeights) {
      var pixelsToZoom = 0;
      var spacesToSkip = 0;
      var zoomedPixels = 0;

      for (var pdfPageNumber of _.range(0, this.pdfDocument.numPages)) {
        if (pixelsToZoom + spacesToSkip + oldPageHeights[pdfPageNumber] > oldScrollTop) {
          zoomFactorForPage = this.pageHeights[pdfPageNumber] / oldPageHeights[pdfPageNumber];
          var partOfPageAboveUpperBorder = oldScrollTop - (pixelsToZoom + spacesToSkip);
          zoomedPixels += Math.round(partOfPageAboveUpperBorder * zoomFactorForPage);
          pixelsToZoom += partOfPageAboveUpperBorder;
          break;
        } else {
          pixelsToZoom += oldPageHeights[pdfPageNumber];
          zoomedPixels += this.pageHeights[pdfPageNumber];
        }

        if (pixelsToZoom + spacesToSkip + 20 > oldScrollTop) {
          var partOfPaddingAboveUpperBorder = oldScrollTop - (pixelsToZoom + spacesToSkip);
          spacesToSkip += partOfPaddingAboveUpperBorder;
          break;
        } else {
          spacesToSkip += 20;
        }
      }

      return zoomedPixels + spacesToSkip;
    }
  }, {
    key: 'adjustSize',
    value: function adjustSize(factor) {
      var _this7 = this;

      if (!this.pdfDocument) {
        return;
      }

      factor = this.toScaleFactor * factor;

      if (this.updating) {
        this.toScaleFactor = factor;
        return;
      }

      this.updating = true;
      this.toScaleFactor = 1;

      var oldScrollTop = this.scrollTop();
      var oldPageHeights = this.pageHeights.slice(0);
      this.currentScale = this.currentScale * factor;
      this.renderPdf(false);

      process.nextTick(function () {
        var newScrollTop = _this7.computeZoomedScrollTop(oldScrollTop, oldPageHeights);
        _this7.scrollTop(newScrollTop);
      });

      process.nextTick(function () {
        var newScrollLeft = _this7.scrollLeft() * factor;
        _this7.scrollLeft(newScrollLeft);
      });
    }
  }, {
    key: 'getCurrentPageNumber',
    value: function getCurrentPageNumber() {
      return this.currentPageNumber;
    }
  }, {
    key: 'getTotalPageNumber',
    value: function getTotalPageNumber() {
      return this.totalPageNumber;
    }
  }, {
    key: 'scrollToPage',
    value: function scrollToPage(pdfPageNumber) {
      if (this.updating) {
        this.scrollToPageAfterUpdate = pdfPageNumber;
        return;
      }

      if (!this.pdfDocument || isNaN(pdfPageNumber)) {
        return;
      }

      pdfPageNumber = Math.min(pdfPageNumber, this.pdfDocument.numPages);
      pageScrollPosition = this.pageHeights.slice(0, pdfPageNumber - 1).reduce(function (x, y) {
        return x + y;
      }, 0) + (pdfPageNumber - 1) * 20;

      return this.scrollTop(pageScrollPosition);
    }
  }, {
    key: 'serialize',
    value: function serialize() {
      return {
        filePath: this.filePath,
        scale: this.currentScale,
        scrollTop: this.scrollTopBeforeUpdate,
        scrollLeft: this.scrollLeftBeforeUpdate,
        deserializer: 'PdfEditorDeserializer'
      };
    }
  }, {
    key: 'getTitle',
    value: function getTitle() {
      if (this.filePath) {
        return path.basename(this.filePath);
      } else {
        return 'untitled';
      }
    }
  }, {
    key: 'getURI',
    value: function getURI() {
      return this.filePath;
    }
  }, {
    key: 'getPath',
    value: function getPath() {
      return this.filePath;
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      return this.detach();
    }
  }, {
    key: 'onDidChangeTitle',
    value: function onDidChangeTitle() {
      return new Disposable(function () {
        return null;
      });
    }
  }, {
    key: 'onDidChangeModified',
    value: function onDidChangeModified() {
      return new Disposable(function () {
        return null;
      });
    }
  }]);

  return PdfEditorView;
})(ScrollView);

exports['default'] = PdfEditorView;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2JpbGx5Ly5hdG9tL3BhY2thZ2VzL3BkZi12aWV3L2xpYi9wZGYtZWRpdG9yLXZpZXcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsV0FBVyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7ZUFFVSxPQUFPLENBQUMsc0JBQXNCLENBQUM7O0lBQWhELENBQUMsWUFBRCxDQUFDO0lBQUUsVUFBVSxZQUFWLFVBQVU7O2dCQUNKLE9BQU8sQ0FBQyxNQUFNLENBQUM7O0lBQXhCLEtBQUssYUFBTCxLQUFLOztBQUNWLElBQUksRUFBRSxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUM1QixJQUFJLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDM0IsSUFBSSxDQUFDLEdBQUcsT0FBTyxDQUFDLGlCQUFpQixDQUFDLENBQUM7O2dCQUNXLE9BQU8sQ0FBQyxNQUFNLENBQUM7O0lBQXhELElBQUksYUFBSixJQUFJO0lBQUUsVUFBVSxhQUFWLFVBQVU7SUFBRSxtQkFBbUIsYUFBbkIsbUJBQW1COztnQkFDekIsT0FBTyxDQUFDLFVBQVUsQ0FBQzs7SUFBL0IsUUFBUSxhQUFSLFFBQVE7O0FBQ2IsTUFBTSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7O0FBRTNCLE1BQU0sQ0FBQyxLQUFLLEdBQUcsRUFBQyxTQUFTLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBQyxNQUFNLEVBQUUsVUFBVSxFQUFDLElBQUksRUFBQyxDQUFDO0FBQ3BFLE9BQU8sQ0FBQywyQ0FBMkMsQ0FBQyxDQUFDO0FBQ3JELEtBQUssQ0FBQyxTQUFTLEdBQUcsU0FBUyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLGdEQUFnRCxDQUFDLENBQUM7QUFDeEcsS0FBSyxDQUFDLE9BQU8sR0FBRyxTQUFTLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsa0NBQWtDLENBQUMsR0FBQyxHQUFHLENBQUM7O2dCQUNyRSxPQUFPLENB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Q0FBQyxRQUFRO0FBQ3ZCLGFBQUssRUFBRSxJQUFJLENBQUMsWUFBWTtBQUN4QixpQkFBUyxFQUFFLElBQUksQ0FBQyxxQkFBcUI7QUFDckMsa0JBQVUsRUFBRSxJQUFJLENBQUMsc0JBQXNCO0FBQ3ZDLG9CQUFZLEVBQUUsdUJBQXVCO09BQ3RDLENBQUM7S0FDSDs7O1dBRU8sb0JBQUc7QUFDVCxVQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7QUFDakIsZUFBTyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztPQUNyQyxNQUFNO0FBQ0wsZUFBTyxVQUFVLENBQUM7T0FDbkI7S0FDRjs7O1dBRUssa0JBQUc7QUFDUCxhQUFPLElBQUksQ0FBQyxRQUFRLENBQUM7S0FDdEI7OztXQUVNLG1CQUFHO0FBQ1IsYUFBTyxJQUFJLENBQUMsUUFBUSxDQUFDO0tBQ3RCOzs7V0FFTSxtQkFBRztBQUNSLGFBQU8sSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO0tBQ3RCOzs7V0FFZSw0QkFBRztBQUNqQixhQUFPLElBQUksVUFBVSxDQUFDO2VBQU0sSUFBSTtPQUFBLENBQUMsQ0FBQztLQUNuQzs7O1dBRWtCLCtCQUFHO0FBQ3BCLGFBQU8sSUFBSSxVQUFVLENBQUM7ZUFBTSxJQUFJO09BQUEsQ0FBQyxDQUFDO0tBQ25DOzs7U0E1a0JrQixhQUFhO0dBQVMsVUFBVTs7cUJBQWhDLGFBQWEiLCJmaWxlIjoiL2hvbWUvYmlsbHkvLmF0b20vcGFja2FnZXMvcGRmLXZpZXcvbGliL3BkZi1lZGl0b3Itdmlldy5qcyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIGJhYmVsXCI7XG5cbmxldCB7JCwgU2Nyb2xsVmlld30gPSByZXF1aXJlKCdhdG9tLXNwYWNlLXBlbi12aWV3cycpO1xubGV0IHtQb2ludH0gPSByZXF1aXJlKCdhdG9tJyk7XG5sZXQgZnMgPSByZXF1aXJlKCdmcy1wbHVzJyk7XG5sZXQgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKTtcbmxldCBfID0gcmVxdWlyZSgndW5kZXJzY29yZS1wbHVzJyk7XG5sZXQge0ZpbGUsIERpc3Bvc2FibGUsIENvbXBvc2l0ZURpc3Bvc2FibGV9ID0gcmVxdWlyZSgnYXRvbScpO1xubGV0IHtGdW5jdGlvbn0gPSByZXF1aXJlKCdsb29waG9sZScpO1xuZ2xvYmFsLkZ1bmN0aW9uID0gRnVuY3Rpb247XG5cbmdsb2JhbC5QREZKUyA9IHt3b3JrZXJTcmM6IFwidGVtcFwiLCBjTWFwVXJsOlwidGVtcFwiLCBjTWFwUGFja2VkOnRydWV9O1xucmVxdWlyZSgnLi8uLi9ub2RlX21vZHVsZXMvcGRmanMtZGlzdC9idWlsZC9wZGYuanMnKTtcblBERkpTLndvcmtlclNyYyA9IFwiZmlsZTovL1wiICsgcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCIuLi9ub2RlX21vZHVsZXMvcGRmanMtZGlzdC9idWlsZC9wZGYud29ya2VyLmpzXCIpO1xuUERGSlMuY01hcFVybCA9IFwiZmlsZTovL1wiICsgcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCIuLi9ub2RlX21vZHVsZXMvcGRmanMtZGlzdC9jbWFwc1wiKStcIi9cIjtcbmxldCB7ZXhlYywgZXhlY0ZpbGV9ID0gcmVxdWlyZSgnY2hpbGRfcHJvY2VzcycpO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQZGZFZGl0b3JWaWV3IGV4dGVuZHMgU2Nyb2xsVmlldyB7XG4gIHN0YXRpYyBjb250ZW50KCkge1xuICAgIHRoaXMuZGl2KHtjbGFzczogJ3BkZi12aWV3JywgdGFiaW5kZXg6IC0xfSwgKCkgPT4ge1xuICAgICAgdGhpcy5kaXYoe291dGxldDogJ2NvbnRhaW5lcicsIHN0eWxlOiAncG9zaXRpb246IHJlbGF0aXZlJ30pO1xuICAgIH0pO1xuICB9XG5cbiAgY29uc3RydWN0b3IoZmlsZVBhdGgsIHNjYWxlID0gbnVsbCwgc2Nyb2xsVG9wID0gMCwgc2Nyb2xsTGVmdCA9IDApIHtcbiAgICBzdXBlcigpO1xuXG4gICAgdGhpcy5jdXJyZW50U2NhbGUgPSBzY2FsZSA/IHNjYWxlIDogMS41O1xuICAgIHRoaXMuZGVmYXVsdFNjYWxlID0gMS41O1xuICAgIHRoaXMuc2NhbGVGYWN0b3IgPSAxMC4wO1xuICAgIHRoaXMuZml0VG9XaWR0aE9uT3BlbiA9ICFzY2FsZSAmJiBhdG9tLmNvbmZpZy5nZXQoJ3BkZi12aWV3LmZpdFRvV2lkdGhPbk9wZW4nKVxuXG4gICAgdGhpcy5maWxlUGF0aCA9IGZpbGVQYXRoO1xuICAgIHRoaXMuZmlsZSA9IG5ldyBGaWxlKHRoaXMuZmlsZVBhdGgpO1xuICAgIHRoaXMuc2Nyb2xsVG9wQmVmb3JlVXBkYXRlID0gc2Nyb2xsVG9wO1xuICAgIHRoaXMuc2Nyb2xsTGVmdEJlZm9yZVVwZGF0ZSA9IHNjcm9sbExlZnQ7XG4gICAgdGhpcy5jYW52YXNlcyA9IFtdO1xuICAgIHRoaXMudXBkYXRpbmcgPSBmYWxzZTtcblxuICAgIHRoaXMudXBkYXRlUGRmKHRydWUpO1xuXG4gICAgdGhpcy5jdXJyZW50UGFnZU51bWJlciA9IDA7XG4gICAgdGhpcy50b3RhbFBhZ2VOdW1iZXIgPSAwO1xuICAgIHRoaXMuY2VudGVyc0JldHdlZW5QYWdlcyA9IFtdO1xuICAgIHRoaXMucGFnZUhlaWdodHMgPSBbXTtcbiAgICB0aGlzLm1heFBhZ2VXaWR0aCA9IDA7XG4gICAgdGhpcy50b1NjYWxlRmFjdG9yID0gMS4wO1xuXG4gICAgbGV0IGRpc3Bvc2FibGVzID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKTtcblxuICAgIGxldCBuZWVkc1VwZGF0ZUNhbGxiYWNrID0gXy5kZWJvdW5jZSgoKSA9PiB7XG4gICAgICBpZiAodGhpcy51cGRhdGluZykge1xuICAgICAgICB0aGlzLm5lZWRzVXBkYXRlID0gdHJ1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMudXBkYXRlUGRmKCk7XG4gICAgICB9XG4gICAgfSwgMTAwKTtcblxuICAgIGRpc3Bvc2FibGVzLmFkZChhdG9tLmNvbmZpZy5vbkRpZENoYW5nZSgncGRmLXZpZXcucmV2ZXJzZVN5bmNCZWhhdmlvdXInLCBuZWVkc1VwZGF0ZUNhbGxiYWNrKSk7XG5cbiAgICBsZXQgYXV0b1JlbG9hZERpc3Bvc2FibGU7XG4gICAgbGV0IHNldHVwQXV0b1JlbG9hZCA9ICgpID0+IHtcbiAgICAgIGlmIChhdG9tLmNvbmZpZy5nZXQoJ3BkZi12aWV3LmF1dG9SZWxvYWRPblVwZGF0ZScpKSB7XG4gICAgICAgIGF1dG9SZWxvYWREaXNwb3NhYmxlID0gdGhpcy5maWxlLm9uRGlkQ2hhbmdlKG5lZWRzVXBkYXRlQ2FsbGJhY2spXG4gICAgICAgIGRpc3Bvc2FibGVzLmFkZChhdXRvUmVsb2FkRGlzcG9zYWJsZSk7XG4gICAgICB9IGVsc2UgaWYoYXV0b1JlbG9hZERpc3Bvc2FibGUpIHtcbiAgICAgICAgZGlzcG9zYWJsZXMucmVtb3ZlKGF1dG9SZWxvYWREaXNwb3NhYmxlKTtcbiAgICAgICAgYXV0b1JlbG9hZERpc3Bvc2FibGUuZGlzcG9zZSgpXG4gICAgICB9XG4gICAgfVxuICAgIGRpc3Bvc2FibGVzLmFkZChhdG9tLmNvbmZpZy5vYnNlcnZlKCdwZGYtdmlldy5hdXRvUmVsb2FkT25VcGRhdGUnLCBzZXR1cEF1dG9SZWxvYWQpKTtcblxuICAgIGxldCBtb3ZlTGVmdENhbGxiYWNrID0gKCgpID0+IHRoaXMuc2Nyb2xsTGVmdCh0aGlzLnNjcm9sbExlZnQoKSAtICQod2luZG93KS53aWR0aCgpIC8gMjApKTtcbiAgICBsZXQgbW92ZVJpZ2h0Q2FsbGJhY2sgPSAoKCkgPT4gdGhpcy5zY3JvbGxSaWdodCh0aGlzLnNjcm9sbFJpZ2h0KCkgKyAkKHdpbmRvdykud2lkdGgoKSAvIDIwKSk7XG4gICAgbGV0IHNjcm9sbENhbGxiYWNrID0gKCgpID0+IHRoaXMub25TY3JvbGwoKSk7XG4gICAgbGV0IHJlc2l6ZUhhbmRsZXIgPSAoKCkgPT4gdGhpcy5zZXRDdXJyZW50UGFnZU51bWJlcigpKTtcblxuICAgIGxldCBlbGVtID0gdGhpcztcblxuICAgIGF0b20uY29tbWFuZHMuYWRkKCcucGRmLXZpZXcnLCB7XG4gICAgICAnY29yZTptb3ZlLWxlZnQnOiBtb3ZlTGVmdENhbGxiYWNrLFxuICAgICAgJ2NvcmU6bW92ZS1yaWdodCc6IG1vdmVSaWdodENhbGxiYWNrXG4gICAgfSk7XG5cbiAgICBlbGVtLm9uKCdzY3JvbGwnLCBzY3JvbGxDYWxsYmFjayk7XG4gICAgZGlzcG9zYWJsZXMuYWRkKG5ldyBEaXNwb3NhYmxlKCgpID0+ICQod2luZG93KS5vZmYoJ3Njcm9sbCcsIHNjcm9sbENhbGxiYWNrKSkpO1xuXG4gICAgJCh3aW5kb3cpLm9uKCdyZXNpemUnLCByZXNpemVIYW5kbGVyKTtcbiAgICBkaXNwb3NhYmxlcy5hZGQobmV3IERpc3Bvc2FibGUoKCkgPT4gJCh3aW5kb3cpLm9mZigncmVzaXplJywgcmVzaXplSGFuZGxlcikpKTtcblxuICAgIGF0b20uY29tbWFuZHMuYWRkKCdhdG9tLXdvcmtzcGFjZScsIHtcbiAgICAgICdwZGYtdmlldzp6b29tLWluJzogKCkgPT4ge1xuICAgICAgICBpZiAoYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlUGFuZUl0ZW0oKSA9PT0gdGhpcykge1xuICAgICAgICAgIHRoaXMuem9vbUluKCk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICAncGRmLXZpZXc6em9vbS1vdXQnOiAoKSA9PiB7XG4gICAgICAgIGlmIChhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lSXRlbSgpID09PSB0aGlzKSB7XG4gICAgICAgICAgdGhpcy56b29tT3V0KCk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICAncGRmLXZpZXc6cmVzZXQtem9vbSc6ICgpID0+IHtcbiAgICAgICAgaWYgKGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVBhbmVJdGVtKCkgPT09IHRoaXMpIHtcbiAgICAgICAgICB0aGlzLnJlc2V0Wm9vbSgpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgJ3BkZi12aWV3OmdvLXRvLW5leHQtcGFnZSc6ICgpID0+IHtcbiAgICAgICAgaWYgKGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVBhbmVJdGVtKCkgPT09IHRoaXMpIHtcbiAgICAgICAgICB0aGlzLmdvVG9OZXh0UGFnZSgpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgJ3BkZi12aWV3OmdvLXRvLXByZXZpb3VzLXBhZ2UnOiAoKSA9PiB7XG4gICAgICAgIGlmIChhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lSXRlbSgpID09PSB0aGlzKSB7XG4gICAgICAgICAgdGhpcy5nb1RvUHJldmlvdXNQYWdlKCk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICAncGRmLXZpZXc6cmVsb2FkJzogKCkgPT4ge1xuICAgICAgICB0aGlzLnVwZGF0ZVBkZih0cnVlKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHRoaXMuZHJhZ2dpbmcgPSBudWxsO1xuXG4gICAgdGhpcy5vbk1vdXNlTW92ZSA9IChlKSA9PiB7XG4gICAgICBpZiAodGhpcy5kcmFnZ2luZykge1xuICAgICAgICB0aGlzLnNpbXBsZUNsaWNrID0gZmFsc2U7XG5cbiAgICAgICAgdGhpcy5zY3JvbGxUb3AodGhpcy5kcmFnZ2luZy5zY3JvbGxUb3AgLSAoZS5zY3JlZW5ZIC0gdGhpcy5kcmFnZ2luZy55KSk7XG4gICAgICAgIHRoaXMuc2Nyb2xsTGVmdCh0aGlzLmRyYWdnaW5nLnNjcm9sbExlZnQgLSAoZS5zY3JlZW5YIC0gdGhpcy5kcmFnZ2luZy54KSk7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgdGhpcy5vbk1vdXNlVXAgPSAoZSkgPT4ge1xuICAgICAgdGhpcy5kcmFnZ2luZyA9IG51bGw7XG4gICAgICAkKGRvY3VtZW50KS51bmJpbmQoJ21vdXNlbW92ZScsIHRoaXMub25Nb3VzZU1vdmUpO1xuICAgICAgJChkb2N1bWVudCkudW5iaW5kKCdtb3VzZXVwJywgdGhpcy5vbk1vdXNlVXApO1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH07XG5cbiAgICB0aGlzLm9uKCdtb3VzZWRvd24nLCAoZSkgPT4ge1xuICAgICAgdGhpcy5zaW1wbGVDbGljayA9IHRydWU7XG4gICAgICBhdG9tLndvcmtzcGFjZS5wYW5lRm9ySXRlbSh0aGlzKS5hY3RpdmF0ZSgpO1xuICAgICAgdGhpcy5kcmFnZ2luZyA9IHt4OiBlLnNjcmVlblgsIHk6IGUuc2NyZWVuWSwgc2Nyb2xsVG9wOiB0aGlzLnNjcm9sbFRvcCgpLCBzY3JvbGxMZWZ0OiB0aGlzLnNjcm9sbExlZnQoKX07XG4gICAgICAkKGRvY3VtZW50KS5vbignbW91c2Vtb3ZlJywgdGhpcy5vbk1vdXNlTW92ZSk7XG4gICAgICAkKGRvY3VtZW50KS5vbignbW91c2V1cCcsIHRoaXMub25Nb3VzZVVwKTtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICB9KTtcblxuICAgIHRoaXMub24oJ21vdXNld2hlZWwnLCAoZSkgPT4ge1xuICAgICAgaWYgKGUuY3RybEtleSkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGlmIChlLm9yaWdpbmFsRXZlbnQud2hlZWxEZWx0YSA+IDApIHtcbiAgICAgICAgICB0aGlzLnpvb21JbigpO1xuICAgICAgICB9IGVsc2UgaWYgKGUub3JpZ2luYWxFdmVudC53aGVlbERlbHRhIDwgMCkge1xuICAgICAgICAgIHRoaXMuem9vbU91dCgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICByZXZlcnNlU3luYyhwYWdlLCBlKSB7XG4gICAgaWYgKHRoaXMuc2ltcGxlQ2xpY2spIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIHRoaXMucGRmRG9jdW1lbnQuZ2V0UGFnZShwYWdlKS50aGVuKChwZGZQYWdlKSA9PiB7XG4gICAgICAgIGxldCB2aWV3cG9ydCA9IHBkZlBhZ2UuZ2V0Vmlld3BvcnQodGhpcy5jdXJyZW50U2NhbGUpO1xuICAgICAgICBsZXQgeCx5O1xuICAgICAgICBbeCx5XSA9IHZpZXdwb3J0LmNvbnZlcnRUb1BkZlBvaW50KGUub2Zmc2V0WCwgJCh0aGlzLmNhbnZhc2VzW3BhZ2UgLSAxXSkuaGVpZ2h0KCkgLSBlLm9mZnNldFkpO1xuXG4gICAgICAgIGxldCBjYWxsYmFjayA9ICgoZXJyb3IsIHN0ZG91dCwgc3RkZXJyKSA9PiB7XG4gICAgICAgICAgaWYgKCFlcnJvcikge1xuICAgICAgICAgICAgc3Rkb3V0ID0gc3Rkb3V0LnJlcGxhY2UoL1xcclxcbi9nLCAnXFxuJyk7XG4gICAgICAgICAgICBsZXQgYXR0cnMgPSB7fTtcbiAgICAgICAgICAgIGZvciAobGV0IGxpbmUgb2Ygc3Rkb3V0LnNwbGl0KCdcXG4nKSkge1xuICAgICAgICAgICAgICBsZXQgbSA9IGxpbmUubWF0Y2goL14oW2EtekEtWl0qKTooLiopJC8pXG4gICAgICAgICAgICAgIGlmIChtKSB7XG4gICAgICAgICAgICAgICAgYXR0cnNbbVsxXV0gPSBtWzJdO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCBmaWxlID0gYXR0cnMuSW5wdXQ7XG4gICAgICAgICAgICBsZXQgbGluZSA9IGF0dHJzLkxpbmU7XG5cbiAgICAgICAgICAgIGlmIChmaWxlICYmIGxpbmUpIHtcbiAgICAgICAgICAgICAgbGV0IGVkaXRvciA9IG51bGw7XG4gICAgICAgICAgICAgIGxldCBwYXRoVG9PcGVuID0gcGF0aC5ub3JtYWxpemUoYXR0cnMuSW5wdXQpO1xuICAgICAgICAgICAgICBsZXQgbGluZVRvT3BlbiA9ICthdHRycy5MaW5lO1xuICAgICAgICAgICAgICBsZXQgZG9uZSA9IGZhbHNlO1xuICAgICAgICAgICAgICBmb3IgKGxldCBlZGl0b3Igb2YgYXRvbS53b3Jrc3BhY2UuZ2V0VGV4dEVkaXRvcnMoKSkge1xuICAgICAgICAgICAgICAgIGlmIChlZGl0b3IuZ2V0UGF0aCgpID09PSBwYXRoVG9PcGVuKSB7XG4gICAgICAgICAgICAgICAgICBsZXQgcG9zaXRpb24gPSBuZXcgUG9pbnQobGluZVRvT3Blbi0xLCAtMSk7XG4gICAgICAgICAgICAgICAgICBlZGl0b3Iuc2Nyb2xsVG9CdWZmZXJQb3NpdGlvbihwb3NpdGlvbiwge2NlbnRlcjogdHJ1ZX0pO1xuICAgICAgICAgICAgICAgICAgZWRpdG9yLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uKHBvc2l0aW9uKTtcbiAgICAgICAgICAgICAgICAgIGVkaXRvci5tb3ZlVG9GaXJzdENoYXJhY3Rlck9mTGluZSgpO1xuICAgICAgICAgICAgICAgICAgbGV0IHBhbmUgPSBhdG9tLndvcmtzcGFjZS5wYW5lRm9ySXRlbShlZGl0b3IpO1xuICAgICAgICAgICAgICAgICAgcGFuZS5hY3RpdmF0ZUl0ZW0oZWRpdG9yKTtcbiAgICAgICAgICAgICAgICAgIHBhbmUuYWN0aXZhdGUoKTtcbiAgICAgICAgICAgICAgICAgIGRvbmUgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgaWYgKCFkb25lKSB7XG4gICAgICAgICAgICAgICAgbGV0IHBhbmVvcHQgPSBhdG9tLmNvbmZpZy5nZXQoJ3BkZi12aWV3LnBhbmVUb1VzZUluU3luY3RleCcpXG4gICAgICAgICAgICAgICAgYXRvbS53b3Jrc3BhY2Uub3BlbihwYXRoVG9PcGVuLCB7aW5pdGlhbExpbmU6IGxpbmVUb09wZW4sIGluaXRpYWxDb2x1bW46IDAsIHNwbGl0OiBwYW5lb3B0fSlcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgbGV0IHN5bmN0ZXhQYXRoID0gYXRvbS5jb25maWcuZ2V0KCdwZGYtdmlldy5zeW5jVGVYUGF0aCcpO1xuICAgICAgICBsZXQgY2xpY2tzcGVjID0gW3BhZ2UsIHgsIHksIHRoaXMuZmlsZVBhdGhdLmpvaW4oJzonKTtcblxuICAgICAgICBpZiAoc3luY3RleFBhdGgpIHtcbiAgICAgICAgICBleGVjRmlsZShzeW5jdGV4UGF0aCwgW1wiZWRpdFwiLCBcIi1vXCIsIGNsaWNrc3BlY10sIGNhbGxiYWNrKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBsZXQgY21kID0gYHN5bmN0ZXggZWRpdCAtbyBcIiR7Y2xpY2tzcGVjfVwiYDtcbiAgICAgICAgICBleGVjKGNtZCwgY2FsbGJhY2spO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBmb3J3YXJkU3luYyh0ZXhQYXRoLCBsaW5lTnVtYmVyKSB7XG4gICAgICBpZiAodGhpcy51cGRhdGluZykge1xuICAgICAgICB0aGlzLmZvcndhcmRTeW5jQWZ0ZXJVcGRhdGUgPSB7XG4gICAgICAgICAgdGV4UGF0aCxcbiAgICAgICAgICBsaW5lTnVtYmVyXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIGxldCBjYWxsYmFjayA9ICgoZXJyb3IsIHN0ZG91dCwgc3RkZXJyKSA9PiB7XG4gICAgICAgIGlmICghZXJyb3IpIHtcbiAgICAgICAgICBzdGRvdXQgPSBzdGRvdXQucmVwbGFjZSgvXFxyXFxuL2csICdcXG4nKTtcbiAgICAgICAgICBsZXQgYXR0cnMgPSB7fTtcbiAgICAgICAgICBmb3IgKGxldCBsaW5lIG9mIHN0ZG91dC5zcGxpdCgnXFxuJykpIHtcbiAgICAgICAgICAgIGxldCBtID0gbGluZS5tYXRjaCgvXihbYS16QS1aXSopOiguKikkLylcbiAgICAgICAgICAgIGlmIChtKSB7XG4gICAgICAgICAgICAgIGlmIChtWzFdIGluIGF0dHJzKSB7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBhdHRyc1ttWzFdXSA9IG1bMl07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgbGV0IHBhZ2UgPSBwYXJzZUludChhdHRycy5QYWdlKTtcblxuICAgICAgICAgIGlmIChwYWdlID4gdGhpcy5wZGZEb2N1bWVudC5udW1QYWdlcykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHRoaXMucGRmRG9jdW1lbnQuZ2V0UGFnZShwYWdlKS50aGVuKChwZGZQYWdlKSA9PiB7XG4gICAgICAgICAgICBsZXQgdmlld3BvcnQgPSBwZGZQYWdlLmdldFZpZXdwb3J0KHRoaXMuY3VycmVudFNjYWxlKTtcbiAgICAgICAgICAgIGxldCBjYW52YXMgPSB0aGlzLmNhbnZhc2VzW3BhZ2UgLSAxXTtcblxuICAgICAgICAgICAgbGV0IHggPSBwYXJzZUZsb2F0KGF0dHJzLngpO1xuICAgICAgICAgICAgbGV0IHkgPSBwYXJzZUZsb2F0KGF0dHJzLnkpO1xuICAgICAgICAgICAgW3gsIHldID0gdmlld3BvcnQuY29udmVydFRvVmlld3BvcnRQb2ludCh4LCB5KTtcblxuICAgICAgICAgICAgeCA9IHggKyBjYW52YXMub2Zmc2V0TGVmdDtcbiAgICAgICAgICAgIHkgPSB2aWV3cG9ydC5oZWlnaHQgLSB5ICsgY2FudmFzLm9mZnNldFRvcDtcblxuICAgICAgICAgICAgbGV0IHZpc2liaWxpdHlUaHJlc2hvbGQgPSA1MDtcblxuICAgICAgICAgICAgLy8gU2Nyb2xsXG4gICAgICAgICAgICBpZiAoeSA8IHRoaXMuc2Nyb2xsVG9wKCkgKyB2aXNpYmlsaXR5VGhyZXNob2xkKSB7XG4gICAgICAgICAgICAgIHRoaXMuc2Nyb2xsVG9wKHkgLSB2aXNpYmlsaXR5VGhyZXNob2xkKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoeSA+IHRoaXMuc2Nyb2xsQm90dG9tKCkgLSB2aXNpYmlsaXR5VGhyZXNob2xkKSB7XG4gICAgICAgICAgICAgIHRoaXMuc2Nyb2xsQm90dG9tKHkgKyB2aXNpYmlsaXR5VGhyZXNob2xkKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHggPCB0aGlzLnNjcm9sbExlZnQoKSArIHZpc2liaWxpdHlUaHJlc2hvbGQpIHtcbiAgICAgICAgICAgICAgdGhpcy5zY3JvbGxMZWZ0KHggLSB2aXNpYmlsaXR5VGhyZXNob2xkKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoeCA+IHRoaXMuc2Nyb2xsUmlnaHQoKSAtIHZpc2liaWxpdHlUaHJlc2hvbGQpIHtcbiAgICAgICAgICAgICAgdGhpcy5zY3JvbGxCb3R0b20oeCArIHZpc2liaWxpdHlUaHJlc2hvbGQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBTaG93IGhpZ2hsaWdodGVyXG4gICAgICAgICAgICAkKCc8ZGl2Lz4nLCB7XG4gICAgICAgICAgICAgIGNsYXNzOiBcInRleC1oaWdobGlnaHRcIixcbiAgICAgICAgICAgICAgc3R5bGU6IGB0b3A6ICR7eX1weDsgbGVmdDogJHt4fXB4O2BcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuYXBwZW5kVG8odGhpcy5jb250YWluZXIpXG4gICAgICAgICAgICAub24oJ2FuaW1hdGlvbmVuZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAkKHRoaXMpLnJlbW92ZSgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBsZXQgc3luY3RleFBhdGggPSBhdG9tLmNvbmZpZy5nZXQoJ3BkZi12aWV3LnN5bmNUZVhQYXRoJyk7XG4gICAgICBsZXQgaW5wdXRzcGVjID0gW2xpbmVOdW1iZXIsIDAsIHRleFBhdGhdLmpvaW4oJzonKTtcblxuICAgICAgaWYgKHN5bmN0ZXhQYXRoKSB7XG4gICAgICAgIGV4ZWNGaWxlKHN5bmN0ZXhQYXRoLCBbXCJ2aWV3XCIsIFwiLWlcIiwgaW5wdXRzcGVjLCBcIi1vXCIsIHRoaXMuZmlsZVBhdGhdLCBjYWxsYmFjayk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZXQgY21kID0gYHN5bmN0ZXggdmlldyAtaSBcIiR7aW5wdXRzcGVjfVwiIC1vIFwiJHt0aGlzLmZpbGVQYXRofVwiYDtcbiAgICAgICAgZXhlYyhjbWQsIGNhbGxiYWNrKTtcbiAgICAgIH1cbiAgfVxuXG5cbiAgb25TY3JvbGwoKSB7XG4gICAgaWYgKCF0aGlzLnVwZGF0aW5nKSB7XG4gICAgICB0aGlzLnNjcm9sbFRvcEJlZm9yZVVwZGF0ZSA9IHRoaXMuc2Nyb2xsVG9wKCk7XG4gICAgICB0aGlzLnNjcm9sbExlZnRCZWZvcmVVcGRhdGUgPSB0aGlzLnNjcm9sbExlZnQoKTtcbiAgICB9XG5cbiAgICB0aGlzLnNldEN1cnJlbnRQYWdlTnVtYmVyKCk7XG4gIH1cblxuICBzZXRDdXJyZW50UGFnZU51bWJlcigpIHtcbiAgICBpZiAoIXRoaXMucGRmRG9jdW1lbnQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsZXQgY2VudGVyID0gKHRoaXMuc2Nyb2xsQm90dG9tKCkgKyB0aGlzLnNjcm9sbFRvcCgpKS8yLjBcbiAgICB0aGlzLmN1cnJlbnRQYWdlTnVtYmVyID0gMVxuXG4gICAgaWYgKHRoaXMuY2VudGVyc0JldHdlZW5QYWdlcy5sZW5ndGggPT09IDAgJiYgdGhpcy5wYWdlSGVpZ2h0cy5sZW5ndGggPT09IHRoaXMucGRmRG9jdW1lbnQubnVtUGFnZXMpXG4gICAgICBmb3IgKGxldCBwZGZQYWdlTnVtYmVyIG9mIF8ucmFuZ2UoMSwgdGhpcy5wZGZEb2N1bWVudC5udW1QYWdlcysxKSkge1xuICAgICAgICB0aGlzLmNlbnRlcnNCZXR3ZWVuUGFnZXMucHVzaCh0aGlzLnBhZ2VIZWlnaHRzLnNsaWNlKDAsIHBkZlBhZ2VOdW1iZXIpLnJlZHVjZSgoKHgseSkgPT4geCArIHkpLCAwKSArIHBkZlBhZ2VOdW1iZXIgKiAyMCAtIDEwKTtcbiAgICAgIH1cblxuICAgIGZvciAobGV0IHBkZlBhZ2VOdW1iZXIgb2YgXy5yYW5nZSgyLCB0aGlzLnBkZkRvY3VtZW50Lm51bVBhZ2VzKzEpKSB7XG4gICAgICBpZiAoY2VudGVyID49IHRoaXMuY2VudGVyc0JldHdlZW5QYWdlc1twZGZQYWdlTnVtYmVyLTJdICYmIGNlbnRlciA8IHRoaXMuY2VudGVyc0JldHdlZW5QYWdlc1twZGZQYWdlTnVtYmVyLTFdKSB7XG4gICAgICAgIHRoaXMuY3VycmVudFBhZ2VOdW1iZXIgPSBwZGZQYWdlTnVtYmVyO1xuICAgICAgfVxuICAgIH1cblxuICAgIGF0b20udmlld3MuZ2V0VmlldyhhdG9tLndvcmtzcGFjZSkuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoJ3BkZi12aWV3OmN1cnJlbnQtcGFnZS11cGRhdGUnKSk7XG4gIH1cblxuICBmaW5pc2hVcGRhdGUoKSB7XG4gICAgdGhpcy51cGRhdGluZyA9IGZhbHNlO1xuICAgIGlmICh0aGlzLm5lZWRzVXBkYXRlKSB7XG4gICAgICB0aGlzLnVwZGF0ZVBkZigpO1xuICAgIH1cbiAgICBpZiAodGhpcy50b1NjYWxlRmFjdG9yICE9IDEpIHtcbiAgICAgIHRoaXMuYWRqdXN0U2l6ZSgxKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuc2Nyb2xsVG9QYWdlQWZ0ZXJVcGRhdGUpIHtcbiAgICAgIHRoaXMuc2Nyb2xsVG9QYWdlKHRoaXMuc2Nyb2xsVG9QYWdlQWZ0ZXJVcGRhdGUpXG4gICAgICBkZWxldGUgdGhpcy5zY3JvbGxUb1BhZ2VBZnRlclVwZGF0ZVxuICAgIH1cbiAgICBpZiAodGhpcy5mb3J3YXJkU3luY0FmdGVyVXBkYXRlKSB7XG4gICAgICB0aGlzLmZvcndhcmRTeW5jKHRoaXMuZm9yd2FyZFN5bmNBZnRlclVwZGF0ZS50ZXhQYXRoLCB0aGlzLmZvcndhcmRTeW5jQWZ0ZXJVcGRhdGUubGluZU51bWJlcilcbiAgICAgIGRlbGV0ZSB0aGlzLmZvcndhcmRTeW5jQWZ0ZXJVcGRhdGVcbiAgICB9XG4gIH1cblxuICB1cGRhdGVQZGYoY2xvc2VPbkVycm9yID0gZmFsc2UpIHtcbiAgICB0aGlzLm5lZWRzVXBkYXRlID0gZmFsc2U7XG5cbiAgICBpZiAoIWZzLmV4aXN0c1N5bmModGhpcy5maWxlUGF0aCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsZXQgcGRmRGF0YSA9IG51bGw7XG5cbiAgICB0cnkge1xuICAgICAgcGRmRGF0YSA9IG5ldyBVaW50OEFycmF5KGZzLnJlYWRGaWxlU3luYyh0aGlzLmZpbGVQYXRoKSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGlmIChlcnJvci5jb2RlID09PSAnRU5PRU5UJykge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy51cGRhdGluZyA9IHRydWU7XG5cbiAgICBsZXQgcmV2ZXJzZVN5bmNDbGlja3R5cGUgPSBudWxsXG4gICAgc3dpdGNoKGF0b20uY29uZmlnLmdldCgncGRmLXZpZXcucmV2ZXJzZVN5bmNCZWhhdmlvdXInKSkge1xuICAgICAgY2FzZSAnQ2xpY2snOlxuICAgICAgICByZXZlcnNlU3luY0NsaWNrdHlwZSA9ICdjbGljaydcbiAgICAgICAgYnJlYWtcbiAgICAgIGNhc2UgJ0RvdWJsZSBjbGljayc6XG4gICAgICAgIHJldmVyc2VTeW5jQ2xpY2t0eXBlID0gJ2RibGNsaWNrJ1xuICAgICAgICBicmVha1xuICAgIH1cblxuICAgIFBERkpTLmdldERvY3VtZW50KHBkZkRhdGEpLnRoZW4oKHBkZkRvY3VtZW50KSA9PiB7XG4gICAgICB0aGlzLmNvbnRhaW5lci5maW5kKFwiY2FudmFzXCIpLnJlbW92ZSgpO1xuICAgICAgdGhpcy5jYW52YXNlcyA9IFtdO1xuICAgICAgdGhpcy5wYWdlSGVpZ2h0cyA9IFtdO1xuXG4gICAgICB0aGlzLnBkZkRvY3VtZW50ID0gcGRmRG9jdW1lbnQ7XG4gICAgICB0aGlzLnRvdGFsUGFnZU51bWJlciA9IHRoaXMucGRmRG9jdW1lbnQubnVtUGFnZXM7XG5cbiAgICAgIGZvciAobGV0IHBkZlBhZ2VOdW1iZXIgb2YgXy5yYW5nZSgxLCB0aGlzLnBkZkRvY3VtZW50Lm51bVBhZ2VzKzEpKSB7XG4gICAgICAgIGxldCBjYW52YXMgPSAkKFwiPGNhbnZhcy8+XCIsIHtjbGFzczogXCJwYWdlLWNvbnRhaW5lclwifSkuYXBwZW5kVG8odGhpcy5jb250YWluZXIpWzBdO1xuICAgICAgICB0aGlzLmNhbnZhc2VzLnB1c2goY2FudmFzKTtcbiAgICAgICAgdGhpcy5wYWdlSGVpZ2h0cy5wdXNoKDApO1xuICAgICAgICBpZiAocmV2ZXJzZVN5bmNDbGlja3R5cGUpIHtcbiAgICAgICAgICAkKGNhbnZhcykub24ocmV2ZXJzZVN5bmNDbGlja3R5cGUsIChlKSA9PiB0aGlzLnJldmVyc2VTeW5jKHBkZlBhZ2VOdW1iZXIsIGUpKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5maXRUb1dpZHRoT25PcGVuKSB7XG4gICAgICAgIFByb21pc2UuYWxsKFxuICAgICAgICAgIF8ucmFuZ2UoMSwgdGhpcy5wZGZEb2N1bWVudC5udW1QYWdlcyArIDEpLm1hcCgocGRmUGFnZU51bWJlcikgPT5cbiAgICAgICAgICAgIHRoaXMucGRmRG9jdW1lbnQuZ2V0UGFnZShwZGZQYWdlTnVtYmVyKS50aGVuKChwZGZQYWdlKSA9PlxuICAgICAgICAgICAgICBwZGZQYWdlLmdldFZpZXdwb3J0KDEuMCkud2lkdGhcbiAgICAgICAgICAgIClcbiAgICAgICAgICApXG4gICAgICAgICkudGhlbigocGRmUGFnZVdpZHRocykgPT4ge1xuICAgICAgICAgIHRoaXMubWF4UGFnZVdpZHRoID0gTWF0aC5tYXgoLi4ucGRmUGFnZVdpZHRocyk7XG4gICAgICAgICAgdGhpcy5yZW5kZXJQZGYoKTtcbiAgICAgICAgfSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMucmVuZGVyUGRmKCk7XG4gICAgICB9XG4gICAgfSwgKCkgPT4ge1xuICAgICAgaWYgKGNsb3NlT25FcnJvcikge1xuICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IodGhpcy5maWxlUGF0aCArIFwiIGlzIG5vdCBhIFBERiBmaWxlLlwiKTtcbiAgICAgICAgYXRvbS53b3Jrc3BhY2UucGFuZUZvckl0ZW0odGhpcykuZGVzdHJveUl0ZW0odGhpcyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmZpbmlzaFVwZGF0ZSgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcmVuZGVyUGRmKHNjcm9sbEFmdGVyUmVuZGVyID0gdHJ1ZSkge1xuICAgIHRoaXMuY2VudGVyc0JldHdlZW5QYWdlcyA9IFtdO1xuXG4gICAgaWYgKHRoaXMuZml0VG9XaWR0aE9uT3Blbikge1xuICAgICAgdGhpcy5jdXJyZW50U2NhbGUgPSB0aGlzWzBdLmNsaWVudFdpZHRoIC8gdGhpcy5tYXhQYWdlV2lkdGg7XG4gICAgICB0aGlzLmZpdFRvV2lkdGhPbk9wZW4gPSBmYWxzZTtcbiAgICB9XG5cbiAgICBQcm9taXNlLmFsbChcbiAgICAgIF8ucmFuZ2UoMSwgdGhpcy5wZGZEb2N1bWVudC5udW1QYWdlcyArIDEpLm1hcCgocGRmUGFnZU51bWJlcikgPT4ge1xuICAgICAgICBsZXQgY2FudmFzID0gdGhpcy5jYW52YXNlc1twZGZQYWdlTnVtYmVyIC0gMV07XG5cbiAgICAgICAgcmV0dXJuIHRoaXMucGRmRG9jdW1lbnQuZ2V0UGFnZShwZGZQYWdlTnVtYmVyKS50aGVuKChwZGZQYWdlKSA9PiB7XG4gICAgICAgICAgbGV0IHZpZXdwb3J0ID0gcGRmUGFnZS5nZXRWaWV3cG9ydCh0aGlzLmN1cnJlbnRTY2FsZSk7XG4gICAgICAgICAgbGV0IGNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcblxuICAgICAgICAgIGxldCBvdXRwdXRTY2FsZSA9IHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvO1xuICAgICAgICAgIGNhbnZhcy5oZWlnaHQgPSBNYXRoLmZsb29yKHZpZXdwb3J0LmhlaWdodCkgKiBvdXRwdXRTY2FsZTtcbiAgICAgICAgICBjYW52YXMud2lkdGggPSBNYXRoLmZsb29yKHZpZXdwb3J0LndpZHRoKSAqIG91dHB1dFNjYWxlO1xuXG4gICAgICAgICAgY29udGV4dC5fc2NhbGVYID0gb3V0cHV0U2NhbGU7XG4gICAgICAgICAgY29udGV4dC5fc2NhbGVZID0gb3V0cHV0U2NhbGU7XG4gICAgICAgICAgY29udGV4dC5zY2FsZShvdXRwdXRTY2FsZSwgb3V0cHV0U2NhbGUpO1xuICAgICAgICAgIGNvbnRleHQuX3RyYW5zZm9ybU1hdHJpeCA9IFtvdXRwdXRTY2FsZSwgMCwgMCwgb3V0cHV0U2NhbGUsIDAsIDBdO1xuICAgICAgICAgIGNhbnZhcy5zdHlsZS53aWR0aCA9IE1hdGguZmxvb3Iodmlld3BvcnQud2lkdGgpICsgJ3B4JztcbiAgICAgICAgICBjYW52YXMuc3R5bGUuaGVpZ2h0ID0gTWF0aC5mbG9vcih2aWV3cG9ydC5oZWlnaHQpICsgJ3B4JztcblxuICAgICAgICAgIHRoaXMucGFnZUhlaWdodHNbcGRmUGFnZU51bWJlciAtIDFdID0gTWF0aC5mbG9vcih2aWV3cG9ydC5oZWlnaHQpO1xuXG4gICAgICAgICAgcmV0dXJuIHBkZlBhZ2UucmVuZGVyKHtjYW52YXNDb250ZXh0OiBjb250ZXh0LCB2aWV3cG9ydDogdmlld3BvcnR9KTtcbiAgICAgICAgfSk7XG4gICAgICB9KVxuICAgICkudGhlbigocmVuZGVyVGFza3MpID0+IHtcbiAgICAgIGlmIChzY3JvbGxBZnRlclJlbmRlcikge1xuICAgICAgICB0aGlzLnNjcm9sbFRvcCh0aGlzLnNjcm9sbFRvcEJlZm9yZVVwZGF0ZSk7XG4gICAgICAgIHRoaXMuc2Nyb2xsTGVmdCh0aGlzLnNjcm9sbExlZnRCZWZvcmVVcGRhdGUpO1xuICAgICAgICB0aGlzLnNldEN1cnJlbnRQYWdlTnVtYmVyKCk7XG4gICAgICB9XG4gICAgICBQcm9taXNlLmFsbChyZW5kZXJUYXNrcykudGhlbigoKSA9PiB0aGlzLmZpbmlzaFVwZGF0ZSgpKTtcbiAgICB9LCAoKSA9PiB0aGlzLmZpbmlzaFVwZGF0ZSgpKTtcbiAgfVxuXG4gIHpvb21PdXQoKSB7XG4gICAgcmV0dXJuIHRoaXMuYWRqdXN0U2l6ZSgxMDAgLyAoMTAwICsgdGhpcy5zY2FsZUZhY3RvcikpO1xuICB9XG5cbiAgem9vbUluKCkge1xuICAgIHJldHVybiB0aGlzLmFkanVzdFNpemUoKDEwMCArIHRoaXMuc2NhbGVGYWN0b3IpIC8gMTAwKTtcbiAgfVxuXG4gIHJlc2V0Wm9vbSgpIHtcbiAgICByZXR1cm4gdGhpcy5hZGp1c3RTaXplKHRoaXMuZGVmYXVsdFNjYWxlIC8gdGhpcy5jdXJyZW50U2NhbGUpO1xuICB9XG5cbiAgZ29Ub05leHRQYWdlKCkge1xuICAgIHJldHVybiB0aGlzLnNjcm9sbFRvUGFnZSh0aGlzLmN1cnJlbnRQYWdlTnVtYmVyICsgMSk7XG4gIH1cblxuICBnb1RvUHJldmlvdXNQYWdlKCkge1xuICAgIHJldHVybiB0aGlzLnNjcm9sbFRvUGFnZSh0aGlzLmN1cnJlbnRQYWdlTnVtYmVyIC0gMSk7XG4gIH1cblxuICBjb21wdXRlWm9vbWVkU2Nyb2xsVG9wKG9sZFNjcm9sbFRvcCwgb2xkUGFnZUhlaWdodHMpIHtcbiAgICBsZXQgcGl4ZWxzVG9ab29tID0gMDtcbiAgICBsZXQgc3BhY2VzVG9Ta2lwID0gMDtcbiAgICBsZXQgem9vbWVkUGl4ZWxzID0gMDtcblxuICAgIGZvciAobGV0IHBkZlBhZ2VOdW1iZXIgb2YgXy5yYW5nZSgwLCB0aGlzLnBkZkRvY3VtZW50Lm51bVBhZ2VzKSkge1xuICAgICAgaWYgKHBpeGVsc1RvWm9vbSArIHNwYWNlc1RvU2tpcCArIG9sZFBhZ2VIZWlnaHRzW3BkZlBhZ2VOdW1iZXJdID4gb2xkU2Nyb2xsVG9wKSB7XG4gICAgICAgIHpvb21GYWN0b3JGb3JQYWdlID0gdGhpcy5wYWdlSGVpZ2h0c1twZGZQYWdlTnVtYmVyXSAvIG9sZFBhZ2VIZWlnaHRzW3BkZlBhZ2VOdW1iZXJdO1xuICAgICAgICBsZXQgcGFydE9mUGFnZUFib3ZlVXBwZXJCb3JkZXIgPSBvbGRTY3JvbGxUb3AgLSAocGl4ZWxzVG9ab29tICsgc3BhY2VzVG9Ta2lwKTtcbiAgICAgICAgem9vbWVkUGl4ZWxzICs9IE1hdGgucm91bmQocGFydE9mUGFnZUFib3ZlVXBwZXJCb3JkZXIgKiB6b29tRmFjdG9yRm9yUGFnZSk7XG4gICAgICAgIHBpeGVsc1RvWm9vbSArPSBwYXJ0T2ZQYWdlQWJvdmVVcHBlckJvcmRlcjtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwaXhlbHNUb1pvb20gKz0gb2xkUGFnZUhlaWdodHNbcGRmUGFnZU51bWJlcl07XG4gICAgICAgIHpvb21lZFBpeGVscyArPSB0aGlzLnBhZ2VIZWlnaHRzW3BkZlBhZ2VOdW1iZXJdO1xuICAgICAgfVxuXG4gICAgICBpZiAocGl4ZWxzVG9ab29tICsgc3BhY2VzVG9Ta2lwICsgMjAgPiBvbGRTY3JvbGxUb3ApIHtcbiAgICAgICAgbGV0IHBhcnRPZlBhZGRpbmdBYm92ZVVwcGVyQm9yZGVyID0gb2xkU2Nyb2xsVG9wIC0gKHBpeGVsc1RvWm9vbSArIHNwYWNlc1RvU2tpcCk7XG4gICAgICAgIHNwYWNlc1RvU2tpcCArPSBwYXJ0T2ZQYWRkaW5nQWJvdmVVcHBlckJvcmRlcjtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzcGFjZXNUb1NraXAgKz0gMjA7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHpvb21lZFBpeGVscyArIHNwYWNlc1RvU2tpcDtcbiAgfVxuXG4gIGFkanVzdFNpemUoZmFjdG9yKSB7XG4gICAgaWYgKCF0aGlzLnBkZkRvY3VtZW50KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgZmFjdG9yID0gdGhpcy50b1NjYWxlRmFjdG9yICogZmFjdG9yO1xuXG4gICAgaWYgKHRoaXMudXBkYXRpbmcpIHtcbiAgICAgIHRoaXMudG9TY2FsZUZhY3RvciA9IGZhY3RvcjtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLnVwZGF0aW5nID0gdHJ1ZTtcbiAgICB0aGlzLnRvU2NhbGVGYWN0b3IgPSAxO1xuXG4gICAgbGV0IG9sZFNjcm9sbFRvcCA9IHRoaXMuc2Nyb2xsVG9wKCk7XG4gICAgbGV0IG9sZFBhZ2VIZWlnaHRzID0gdGhpcy5wYWdlSGVpZ2h0cy5zbGljZSgwKTtcbiAgICB0aGlzLmN1cnJlbnRTY2FsZSA9IHRoaXMuY3VycmVudFNjYWxlICogZmFjdG9yO1xuICAgIHRoaXMucmVuZGVyUGRmKGZhbHNlKTtcblxuICAgIHByb2Nlc3MubmV4dFRpY2soKCkgPT4ge1xuICAgICAgbGV0IG5ld1Njcm9sbFRvcCA9IHRoaXMuY29tcHV0ZVpvb21lZFNjcm9sbFRvcChvbGRTY3JvbGxUb3AsIG9sZFBhZ2VIZWlnaHRzKTtcbiAgICAgIHRoaXMuc2Nyb2xsVG9wKG5ld1Njcm9sbFRvcCk7XG4gICAgfSk7XG5cbiAgICBwcm9jZXNzLm5leHRUaWNrKCgpID0+IHtcbiAgICAgIGxldCBuZXdTY3JvbGxMZWZ0ID0gdGhpcy5zY3JvbGxMZWZ0KCkgKiBmYWN0b3I7XG4gICAgICB0aGlzLnNjcm9sbExlZnQobmV3U2Nyb2xsTGVmdCk7XG4gICAgfSk7XG4gIH1cblxuICBnZXRDdXJyZW50UGFnZU51bWJlcigpIHtcbiAgICByZXR1cm4gdGhpcy5jdXJyZW50UGFnZU51bWJlcjtcbiAgfVxuXG4gIGdldFRvdGFsUGFnZU51bWJlcigpIHtcbiAgICByZXR1cm4gdGhpcy50b3RhbFBhZ2VOdW1iZXI7XG4gIH1cblxuICBzY3JvbGxUb1BhZ2UocGRmUGFnZU51bWJlcikge1xuICAgIGlmICh0aGlzLnVwZGF0aW5nKSB7XG4gICAgICB0aGlzLnNjcm9sbFRvUGFnZUFmdGVyVXBkYXRlID0gcGRmUGFnZU51bWJlclxuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLnBkZkRvY3VtZW50IHx8IGlzTmFOKHBkZlBhZ2VOdW1iZXIpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgcGRmUGFnZU51bWJlciA9IE1hdGgubWluKHBkZlBhZ2VOdW1iZXIsIHRoaXMucGRmRG9jdW1lbnQubnVtUGFnZXMpO1xuICAgIHBhZ2VTY3JvbGxQb3NpdGlvbiA9ICh0aGlzLnBhZ2VIZWlnaHRzLnNsaWNlKDAsIChwZGZQYWdlTnVtYmVyLTEpKS5yZWR1Y2UoKCh4LHkpID0+IHgreSksIDApKSArIChwZGZQYWdlTnVtYmVyIC0gMSkgKiAyMFxuXG4gICAgcmV0dXJuIHRoaXMuc2Nyb2xsVG9wKHBhZ2VTY3JvbGxQb3NpdGlvbik7XG4gIH1cblxuICBzZXJpYWxpemUoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGZpbGVQYXRoOiB0aGlzLmZpbGVQYXRoLFxuICAgICAgc2NhbGU6IHRoaXMuY3VycmVudFNjYWxlLFxuICAgICAgc2Nyb2xsVG9wOiB0aGlzLnNjcm9sbFRvcEJlZm9yZVVwZGF0ZSxcbiAgICAgIHNjcm9sbExlZnQ6IHRoaXMuc2Nyb2xsTGVmdEJlZm9yZVVwZGF0ZSxcbiAgICAgIGRlc2VyaWFsaXplcjogJ1BkZkVkaXRvckRlc2VyaWFsaXplcidcbiAgICB9O1xuICB9XG5cbiAgZ2V0VGl0bGUoKSB7XG4gICAgaWYgKHRoaXMuZmlsZVBhdGgpIHtcbiAgICAgIHJldHVybiBwYXRoLmJhc2VuYW1lKHRoaXMuZmlsZVBhdGgpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gJ3VudGl0bGVkJztcbiAgICB9XG4gIH1cblxuICBnZXRVUkkoKSB7XG4gICAgcmV0dXJuIHRoaXMuZmlsZVBhdGg7XG4gIH1cblxuICBnZXRQYXRoKCkge1xuICAgIHJldHVybiB0aGlzLmZpbGVQYXRoO1xuICB9XG5cbiAgZGVzdHJveSgpIHtcbiAgICByZXR1cm4gdGhpcy5kZXRhY2goKTtcbiAgfVxuXG4gIG9uRGlkQ2hhbmdlVGl0bGUoKSB7XG4gICAgcmV0dXJuIG5ldyBEaXNwb3NhYmxlKCgpID0+IG51bGwpO1xuICB9XG5cbiAgb25EaWRDaGFuZ2VNb2RpZmllZCgpIHtcbiAgICByZXR1cm4gbmV3IERpc3Bvc2FibGUoKCkgPT4gbnVsbCk7XG4gIH1cbn1cbiJdfQ==