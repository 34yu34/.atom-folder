Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _underscorePlus = require('underscore-plus');

var _underscorePlus2 = _interopRequireDefault(_underscorePlus);

var _side = require('./side');

var _navigator = require('./navigator');

// Public: Model an individual conflict parsed from git's automatic conflict resolution output.
'use babel';

var Conflict = (function () {

  /*
   * Private: Initialize a new Conflict with its constituent Sides, Navigator, and the MergeState
   * it belongs to.
   *
   * ours [Side] the lines of this conflict that the current user contributed (by our best guess).
   * theirs [Side] the lines of this conflict that another contributor created.
   * base [Side] the lines of merge base of this conflict. Optional.
   * navigator [Navigator] maintains references to surrounding Conflicts in the original file.
   * state [MergeState] repository-wide information about the current merge.
   */

  function Conflict(ours, theirs, base, navigator, merge) {
    _classCallCheck(this, Conflict);

    this.ours = ours;
    this.theirs = theirs;
    this.base = base;
    this.navigator = navigator;
    this.merge = merge;

    this.emitter = new _atom.Emitter();

    // Populate back-references
    this.ours.conflict = this;
    this.theirs.conflict = this;
    if (this.base) {
      this.base.conflict = this;
    }
    this.navigator.conflict = this;

    // Begin unresolved
    this.resolution = null;
  }

  // Regular expression that matches the beginning of a potential conflict.

  /*
   * Public: Has this conflict been resolved in any way?
   *
   * Return [Boolean]
   */

  _createClass(Conflict, [{
    key: 'isResolved',
    value: function isResolved() {
      return this.resolution !== null;
    }

    /*
     * Public: Attach an event handler to be notified when this conflict is resolved.
     *
     * callback [Function]
     */
  }, {
    key: 'onDidResolveConflict',
    value: function onDidResolveConflict(callback) {
      return this.emitter.on('resolve-conflict', callback);
    }

    /*
     * Public: Specify which Side is to be kept. Note that either side may have been modified by the
     * user prior to resolution. Notify any subscribers.
     *
     * side [Side] our changes or their changes.
     */
  }, {
    key: 'resolveAs',
    value: function resolveAs(side) {
      this.resolution = side;
      this.emitter.emit('resolve-conflict');
    }

    /*
     * Public: Locate the position that the editor should scroll to in order to make this conflict
     * visible.
     *
     * Return [Point] buffer coordinates
     */
  }, {
    key: 'scrollTarget',
    value: function scrollTarget() {
      return this.ours.marker.getTailBufferPosition();
    }

    /*
     * Public: Audit all Marker instances owned by subobjects within this Conflict.
     *
     * Return [Array<Marker>]
     */
  }, {
    key: 'markers',
    value: function markers() {
      var ms = [this.ours.markers(), this.theirs.markers(), this.navigator.markers()];
      if (this.base) {
        ms.push(this.base.markers());
      }
      return _underscorePlus2['default'].flatten(ms, true);
    }

    /*
     * Public: Console-friendly identification of this conflict.
     *
     * Return [String] that distinguishes this conflict from others.
     */
  }, {
    key: 'toString',
    value: function toString() {
      return '[conflict: ' + this.ours + ' ' + this.theirs + ']';
    }

    /*
     * Public: Parse any conflict markers in a TextEditor's buffer and return a Conflict that contains
     * markers corresponding to each.
     *
     * merge [MergeState] Repository-wide state of the merge.
     * editor [TextEditor] The editor to search.
     * return [Array<Conflict>] A (possibly empty) collection of parsed Conflicts.
     */
  }], [{
    key: 'all',
    value: function all(merge, editor) {
      var conflicts = [];
      var lastRow = -1;

      editor.getBuffer().scan(CONFLICT_START_REGEX, function (m) {
        conflictStartRow = m.range.start.row;
        if (conflictStartRow < lastRow) {
          // Match within an already-parsed conflict.
          return;
        }

        var visitor = new ConflictVisitor(merge, editor);

        try {
          lastRow = parseConflict(merge, editor, conflictStartRow, visitor);
          var conflict = visitor.conflict();

          if (conflicts.length > 0) {
            conflict.navigator.linkToPrevious(conflicts[conflicts.length - 1]);
          }
          conflicts.push(conflict);
        } catch (e) {
          if (!e.parserState) throw e;

          if (!atom.inSpecMode()) {
            console.error('Unable to parse conflict: ' + e.message + '\n' + e.stack);
          }
        }
      });

      return conflicts;
    }
  }]);

  return Conflict;
})();

exports.Conflict = Conflict;
var CONFLICT_START_REGEX = /^<{7} (.+)\r?\n/g;

// Side positions.
var TOP = 'top';
var BASE = 'base';
var BOTTOM = 'bottom';

// Options used to initialize markers.
var options = {
  invalidate: 'never'
};

/*
 * Private: conflict parser visitor that ignores all events.
 */

var NoopVisitor = (function () {
  function NoopVisitor() {
    _classCallCheck(this, NoopVisitor);
  }

  /*
   * Private: conflict parser visitor that marks each buffer range and assembles a Conflict from the
   * pieces.
   */

  _createClass(NoopVisitor, [{
    key: 'visitOurSide',
    value: function visitOurSide(position, bannerRow, textRowStart, textRowEnd) {}
  }, {
    key: 'visitBaseSide',
    value: function visitBaseSide(position, bannerRow, textRowStart, textRowEnd) {}
  }, {
    key: 'visitSeparator',
    value: function visitSeparator(sepRowStart, sepRowEnd) {}
  }, {
    key: 'visitTheirSide',
    value: function visitTheirSide(position, bannerRow, textRowStart, textRowEnd) {}
  }]);

  return NoopVisitor;
})();

var ConflictVisitor = (function () {

  /*
   * merge - [MergeState] passed to each instantiated Side.
   * editor - [TextEditor] displaying the conflicting text.
   */

  function ConflictVisitor(merge, editor) {
    _classCallCheck(this, ConflictVisitor);

    this.merge = merge;
    this.editor = editor;
    this.previousSide = null;

    this.ourSide = null;
    this.baseSide = null;
    this.navigator = null;
  }

  /*
   * Private: parseConflict discovers git conflict markers in a corpus of text and constructs Conflict
   * instances that mark the correct lines.
   *
   * Returns [Integer] the buffer row after the final <<<<<< boundary.
   */

  /*
   * position - [String] one of TOP or BOTTOM.
   * bannerRow - [Integer] of the buffer row that contains our side's banner.
   * textRowStart - [Integer] of the first buffer row that contain this side's text.
   * textRowEnd - [Integer] of the first buffer row beyond the extend of this side's text.
   */

  _createClass(ConflictVisitor, [{
    key: 'visitOurSide',
    value: function visitOurSide(position, bannerRow, textRowStart, textRowEnd) {
      this.ourSide = this.markSide(position, _side.OurSide, bannerRow, textRowStart, textRowEnd);
    }

    /*
     * bannerRow - [Integer] the buffer row that contains our side's banner.
     * textRowStart - [Integer] first buffer row that contain this side's text.
     * textRowEnd - [Integer] first buffer row beyond the extend of this side's text.
     */
  }, {
    key: 'visitBaseSide',
    value: function visitBaseSide(bannerRow, textRowStart, textRowEnd) {
      this.baseSide = this.markSide(BASE, _side.BaseSide, bannerRow, textRowStart, textRowEnd);
    }

    /*
     * sepRowStart - [Integer] buffer row that contains the "=======" separator.
     * sepRowEnd - [Integer] the buffer row after the separator.
     */
  }, {
    key: 'visitSeparator',
    value: function visitSeparator(sepRowStart, sepRowEnd) {
      var marker = this.editor.markBufferRange([[sepRowStart, 0], [sepRowEnd, 0]], options);
      this.previousSide.followingMarker = marker;

      this.navigator = new _navigator.Navigator(marker);
      this.previousSide = this.navigator;
    }

    /*
     * position - [String] Always BASE; accepted for consistency.
     * bannerRow - [Integer] the buffer row that contains our side's banner.
     * textRowStart - [Integer] first buffer row that contain this side's text.
     * textRowEnd - [Integer] first buffer row beyond the extend of this side's text.
     */
  }, {
    key: 'visitTheirSide',
    value: function visitTheirSide(position, bannerRow, textRowStart, textRowEnd) {
      this.theirSide = this.markSide(position, _side.TheirSide, bannerRow, textRowStart, textRowEnd);
    }
  }, {
    key: 'markSide',
    value: function markSide(position, sideKlass, bannerRow, textRowStart, textRowEnd) {
      var description = this.sideDescription(bannerRow);

      var bannerMarker = this.editor.markBufferRange([[bannerRow, 0], [bannerRow + 1, 0]], options);

      if (this.previousSide) {
        this.previousSide.followingMarker = bannerMarker;
      }

      var textRange = [[textRowStart, 0], [textRowEnd, 0]];
      var textMarker = this.editor.markBufferRange(textRange, options);
      var text = this.editor.getTextInBufferRange(textRange);

      var side = new sideKlass(text, description, textMarker, bannerMarker, position);
      this.previousSide = side;
      return side;
    }

    /*
     * Parse the banner description for the current side from a banner row.
     */
  }, {
    key: 'sideDescription',
    value: function sideDescription(bannerRow) {
      return this.editor.lineTextForBufferRow(bannerRow).match(/^[<|>]{7} (.*)$/)[1];
    }
  }, {
    key: 'conflict',
    value: function conflict() {
      this.previousSide.followingMarker = this.previousSide.refBannerMarker;

      return new Conflict(this.ourSide, this.theirSide, this.baseSide, this.navigator, this.merge);
    }
  }]);

  return ConflictVisitor;
})();

var parseConflict = function parseConflict(merge, editor, row, visitor) {
  var lastBoundary = null;

  // Visit a side that begins with a banner and description as its first line.
  var visitHeaderSide = function visitHeaderSide(position, visitMethod) {
    var sideRowStart = row;
    row += 1;
    advanceToBoundary('|=');
    var sideRowEnd = row;

    visitor[visitMethod](position, sideRowStart, sideRowStart + 1, sideRowEnd);
  };

  // Visit the base side from diff3 output, if one is present, then visit the separator.
  var visitBaseAndSeparator = function visitBaseAndSeparator() {
    if (lastBoundary === '|') {
      visitBaseSide();
    }

    visitSeparator();
  };

  // Visit a base side from diff3 output.
  var visitBaseSide = function visitBaseSide() {
    var sideRowStart = row;
    row += 1;

    var b = advanceToBoundary('<=');
    while (b === '<') {
      // Embedded recursive conflict within a base side, caused by a criss-cross merge.
      // Advance beyond it without marking anything.
      row = parseConflict(merge, editor, row, new NoopVisitor());
      b = advanceToBoundary('<=');
    }

    var sideRowEnd = row;

    visitor.visitBaseSide(sideRowStart, sideRowStart + 1, sideRowEnd);
  };

  // Visit a "========" separator.
  var visitSeparator = function visitSeparator() {
    var sepRowStart = row;
    row += 1;
    var sepRowEnd = row;

    visitor.visitSeparator(sepRowStart, sepRowEnd);
  };

  // Vidie a side with a banner and description as its last line.
  var visitFooterSide = function visitFooterSide(position, visitMethod) {
    var sideRowStart = row;
    var b = advanceToBoundary('>');
    row += 1;
    sideRowEnd = row;

    visitor[visitMethod](position, sideRowEnd - 1, sideRowStart, sideRowEnd - 1);
  };

  // Determine if the current row is a side boundary.
  //
  // boundaryKinds - [String] any combination of <, |, =, or > to limit the kinds of boundary
  //   detected.
  //
  // Returns the matching boundaryKinds character, or `null` if none match.
  var isAtBoundary = function isAtBoundary() {
    var boundaryKinds = arguments.length <= 0 || arguments[0] === undefined ? '<|=>' : arguments[0];

    var line = editor.lineTextForBufferRow(row);
    for (b of boundaryKinds) {
      if (line.startsWith(b.repeat(7))) {
        return b;
      }
    }
    return null;
  };

  // Increment the current row until the current line matches one of the provided boundary kinds,
  // or until there are no more lines in the editor.
  //
  // boundaryKinds - [String] any combination of <, |, =, or > to limit the kinds of boundaries
  //   that halt the progression.
  //
  // Returns the matching boundaryKinds character, or 'null' if there are no matches to the end of
  // the editor.
  var advanceToBoundary = function advanceToBoundary() {
    var boundaryKinds = arguments.length <= 0 || arguments[0] === undefined ? '<|=>' : arguments[0];

    var b = isAtBoundary(boundaryKinds);
    while (b === null) {
      row += 1;
      if (row > editor.getLastBufferRow()) {
        var e = new Error('Unterminated conflict side');
        e.parserState = true;
        throw e;
      }
      b = isAtBoundary(boundaryKinds);
    }

    lastBoundary = b;
    return b;
  };

  if (!merge.isRebase) {
    visitHeaderSide(TOP, 'visitOurSide');
    visitBaseAndSeparator();
    visitFooterSide(BOTTOM, 'visitTheirSide');
  } else {
    visitHeaderSide(TOP, 'visitTheirSide');
    visitBaseAndSeparator();
    visitFooterSide(BOTTOM, 'visitOurSide');
  }

  return row;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2JpbGx5Ly5hdG9tL3BhY2thZ2VzL21lcmdlLWNvbmZsaWN0cy9saWIvY29uZmxpY3QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztvQkFFc0IsTUFBTTs7OEJBQ2QsaUJBQWlCOzs7O29CQUVrQixRQUFROzt5QkFDakMsYUFBYTs7O0FBTnJDLFdBQVcsQ0FBQTs7SUFTRSxRQUFROzs7Ozs7Ozs7Ozs7O0FBWVAsV0FaRCxRQUFRLENBWU4sSUFBSSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRTswQkFaeEMsUUFBUTs7QUFhakIsUUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUE7QUFDaEIsUUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUE7QUFDcEIsUUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUE7QUFDaEIsUUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUE7QUFDMUIsUUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUE7O0FBRWxCLFFBQUksQ0FBQyxPQUFPLEdBQUcsbUJBQWEsQ0FBQTs7O0FBRzVCLFFBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQTtBQUN6QixRQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUE7QUFDM0IsUUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFO0FBQ2IsVUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFBO0tBQzFCO0FBQ0QsUUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFBOzs7QUFHOUIsUUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUE7R0FDdkI7Ozs7Ozs7Ozs7ZUEvQlUsUUFBUTs7V0FzQ1Qsc0JBQUc7QUFDWCxhQUFPLElBQUksQ0FBQyxVQUFVLEtBQUssSUFBSSxDQUFBO0tBQ2hDOzs7Ozs7Ozs7V0FPb0IsOEJBQUMsUUFBUSxFQUFFO0FBQzlCLGFBQU8s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QUcsWUFBWSxDQUFDLGFBQWEsQ0FBQyxDQUFBO0tBQ2hDOztBQUVELGdCQUFZLEdBQUcsQ0FBQyxDQUFBO0FBQ2hCLFdBQU8sQ0FBQyxDQUFBO0dBQ1QsQ0FBQTs7QUFFRCxNQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRTtBQUNuQixtQkFBZSxDQUFDLEdBQUcsRUFBRSxjQUFjLENBQUMsQ0FBQTtBQUNwQyx5QkFBcUIsRUFBRSxDQUFBO0FBQ3ZCLG1CQUFlLENBQUMsTUFBTSxFQUFFLGdCQUFnQixDQUFDLENBQUE7R0FDMUMsTUFBTTtBQUNMLG1CQUFlLENBQUMsR0FBRyxFQUFFLGdCQUFnQixDQUFDLENBQUE7QUFDdEMseUJBQXFCLEVBQUUsQ0FBQTtBQUN2QixtQkFBZSxDQUFDLE1BQU0sRUFBRSxjQUFjLENBQUMsQ0FBQTtHQUN4Qzs7QUFFRCxTQUFPLEdBQUcsQ0FBQTtDQUNYLENBQUEiLCJmaWxlIjoiL2hvbWUvYmlsbHkvLmF0b20vcGFja2FnZXMvbWVyZ2UtY29uZmxpY3RzL2xpYi9jb25mbGljdC5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmltcG9ydCB7RW1pdHRlcn0gZnJvbSAnYXRvbSdcbmltcG9ydCBfIGZyb20gJ3VuZGVyc2NvcmUtcGx1cydcblxuaW1wb3J0IHtTaWRlLCBPdXJTaWRlLCBUaGVpclNpZGUsIEJhc2VTaWRlfSBmcm9tICcuL3NpZGUnXG5pbXBvcnQge05hdmlnYXRvcn0gZnJvbSAnLi9uYXZpZ2F0b3InXG5cbi8vIFB1YmxpYzogTW9kZWwgYW4gaW5kaXZpZHVhbCBjb25mbGljdCBwYXJzZWQgZnJvbSBnaXQncyBhdXRvbWF0aWMgY29uZmxpY3QgcmVzb2x1dGlvbiBvdXRwdXQuXG5leHBvcnQgY2xhc3MgQ29uZmxpY3Qge1xuXG4gIC8qXG4gICAqIFByaXZhdGU6IEluaXRpYWxpemUgYSBuZXcgQ29uZmxpY3Qgd2l0aCBpdHMgY29uc3RpdHVlbnQgU2lkZXMsIE5hdmlnYXRvciwgYW5kIHRoZSBNZXJnZVN0YXRlXG4gICAqIGl0IGJlbG9uZ3MgdG8uXG4gICAqXG4gICAqIG91cnMgW1NpZGVdIHRoZSBsaW5lcyBvZiB0aGlzIGNvbmZsaWN0IHRoYXQgdGhlIGN1cnJlbnQgdXNlciBjb250cmlidXRlZCAoYnkgb3VyIGJlc3QgZ3Vlc3MpLlxuICAgKiB0aGVpcnMgW1NpZGVdIHRoZSBsaW5lcyBvZiB0aGlzIGNvbmZsaWN0IHRoYXQgYW5vdGhlciBjb250cmlidXRvciBjcmVhdGVkLlxuICAgKiBiYXNlIFtTaWRlXSB0aGUgbGluZXMgb2YgbWVyZ2UgYmFzZSBvZiB0aGlzIGNvbmZsaWN0LiBPcHRpb25hbC5cbiAgICogbmF2aWdhdG9yIFtOYXZpZ2F0b3JdIG1haW50YWlucyByZWZlcmVuY2VzIHRvIHN1cnJvdW5kaW5nIENvbmZsaWN0cyBpbiB0aGUgb3JpZ2luYWwgZmlsZS5cbiAgICogc3RhdGUgW01lcmdlU3RhdGVdIHJlcG9zaXRvcnktd2lkZSBpbmZvcm1hdGlvbiBhYm91dCB0aGUgY3VycmVudCBtZXJnZS5cbiAgICovXG4gIGNvbnN0cnVjdG9yIChvdXJzLCB0aGVpcnMsIGJhc2UsIG5hdmlnYXRvciwgbWVyZ2UpIHtcbiAgICB0aGlzLm91cnMgPSBvdXJzXG4gICAgdGhpcy50aGVpcnMgPSB0aGVpcnNcbiAgICB0aGlzLmJhc2UgPSBiYXNlXG4gICAgdGhpcy5uYXZpZ2F0b3IgPSBuYXZpZ2F0b3JcbiAgICB0aGlzLm1lcmdlID0gbWVyZ2VcblxuICAgIHRoaXMuZW1pdHRlciA9IG5ldyBFbWl0dGVyKClcblxuICAgIC8vIFBvcHVsYXRlIGJhY2stcmVmZXJlbmNlc1xuICAgIHRoaXMub3Vycy5jb25mbGljdCA9IHRoaXNcbiAgICB0aGlzLnRoZWlycy5jb25mbGljdCA9IHRoaXNcbiAgICBpZiAodGhpcy5iYXNlKSB7XG4gICAgICB0aGlzLmJhc2UuY29uZmxpY3QgPSB0aGlzXG4gICAgfVxuICAgIHRoaXMubmF2aWdhdG9yLmNvbmZsaWN0ID0gdGhpc1xuXG4gICAgLy8gQmVnaW4gdW5yZXNvbHZlZFxuICAgIHRoaXMucmVzb2x1dGlvbiA9IG51bGxcbiAgfVxuXG4gIC8qXG4gICAqIFB1YmxpYzogSGFzIHRoaXMgY29uZmxpY3QgYmVlbiByZXNvbHZlZCBpbiBhbnkgd2F5P1xuICAgKlxuICAgKiBSZXR1cm4gW0Jvb2xlYW5dXG4gICAqL1xuICBpc1Jlc29sdmVkKCkge1xuICAgIHJldHVybiB0aGlzLnJlc29sdXRpb24gIT09IG51bGxcbiAgfVxuXG4gIC8qXG4gICAqIFB1YmxpYzogQXR0YWNoIGFuIGV2ZW50IGhhbmRsZXIgdG8gYmUgbm90aWZpZWQgd2hlbiB0aGlzIGNvbmZsaWN0IGlzIHJlc29sdmVkLlxuICAgKlxuICAgKiBjYWxsYmFjayBbRnVuY3Rpb25dXG4gICAqL1xuICBvbkRpZFJlc29sdmVDb25mbGljdCAoY2FsbGJhY2spIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdyZXNvbHZlLWNvbmZsaWN0JywgY2FsbGJhY2spXG4gIH1cblxuICAvKlxuICAgKiBQdWJsaWM6IFNwZWNpZnkgd2hpY2ggU2lkZSBpcyB0byBiZSBrZXB0LiBOb3RlIHRoYXQgZWl0aGVyIHNpZGUgbWF5IGhhdmUgYmVlbiBtb2RpZmllZCBieSB0aGVcbiAgICogdXNlciBwcmlvciB0byByZXNvbHV0aW9uLiBOb3RpZnkgYW55IHN1YnNjcmliZXJzLlxuICAgKlxuICAgKiBzaWRlIFtTaWRlXSBvdXIgY2hhbmdlcyBvciB0aGVpciBjaGFuZ2VzLlxuICAgKi9cbiAgcmVzb2x2ZUFzIChzaWRlKSB7XG4gICAgdGhpcy5yZXNvbHV0aW9uID0gc2lkZVxuICAgIHRoaXMuZW1pdHRlci5lbWl0KCdyZXNvbHZlLWNvbmZsaWN0JylcbiAgfVxuXG4gIC8qXG4gICAqIFB1YmxpYzogTG9jYXRlIHRoZSBwb3NpdGlvbiB0aGF0IHRoZSBlZGl0b3Igc2hvdWxkIHNjcm9sbCB0byBpbiBvcmRlciB0byBtYWtlIHRoaXMgY29uZmxpY3RcbiAgICogdmlzaWJsZS5cbiAgICpcbiAgICogUmV0dXJuIFtQb2ludF0gYnVmZmVyIGNvb3JkaW5hdGVzXG4gICAqL1xuICBzY3JvbGxUYXJnZXQgKCkge1xuICAgIHJldHVybiB0aGlzLm91cnMubWFya2VyLmdldFRhaWxCdWZmZXJQb3NpdGlvbigpXG4gIH1cblxuICAvKlxuICAgKiBQdWJsaWM6IEF1ZGl0IGFsbCBNYXJrZXIgaW5zdGFuY2VzIG93bmVkIGJ5IHN1Ym9iamVjdHMgd2l0aGluIHRoaXMgQ29uZmxpY3QuXG4gICAqXG4gICAqIFJldHVybiBbQXJyYXk8TWFya2VyPl1cbiAgICovXG4gIG1hcmtlcnMgKCkge1xuICAgIGNvbnN0IG1zID0gW3RoaXMub3Vycy5tYXJrZXJzKCksIHRoaXMudGhlaXJzLm1hcmtlcnMoKSwgdGhpcy5uYXZpZ2F0b3IubWFya2VycygpXVxuICAgIGlmICh0aGlzLmJhc2UpIHtcbiAgICAgIG1zLnB1c2godGhpcy5iYXNlLm1hcmtlcnMoKSlcbiAgICB9XG4gICAgcmV0dXJuIF8uZmxhdHRlbihtcywgdHJ1ZSlcbiAgfVxuXG4gIC8qXG4gICAqIFB1YmxpYzogQ29uc29sZS1mcmllbmRseSBpZGVudGlmaWNhdGlvbiBvZiB0aGlzIGNvbmZsaWN0LlxuICAgKlxuICAgKiBSZXR1cm4gW1N0cmluZ10gdGhhdCBkaXN0aW5ndWlzaGVzIHRoaXMgY29uZmxpY3QgZnJvbSBvdGhlcnMuXG4gICAqL1xuICB0b1N0cmluZyAoKSB7XG4gICAgcmV0dXJuIGBbY29uZmxpY3Q6ICR7dGhpcy5vdXJzfSAke3RoaXMudGhlaXJzfV1gXG4gIH1cblxuICAvKlxuICAgKiBQdWJsaWM6IFBhcnNlIGFueSBjb25mbGljdCBtYXJrZXJzIGluIGEgVGV4dEVkaXRvcidzIGJ1ZmZlciBhbmQgcmV0dXJuIGEgQ29uZmxpY3QgdGhhdCBjb250YWluc1xuICAgKiBtYXJrZXJzIGNvcnJlc3BvbmRpbmcgdG8gZWFjaC5cbiAgICpcbiAgICogbWVyZ2UgW01lcmdlU3RhdGVdIFJlcG9zaXRvcnktd2lkZSBzdGF0ZSBvZiB0aGUgbWVyZ2UuXG4gICAqIGVkaXRvciBbVGV4dEVkaXRvcl0gVGhlIGVkaXRvciB0byBzZWFyY2guXG4gICAqIHJldHVybiBbQXJyYXk8Q29uZmxpY3Q+XSBBIChwb3NzaWJseSBlbXB0eSkgY29sbGVjdGlvbiBvZiBwYXJzZWQgQ29uZmxpY3RzLlxuICAgKi9cbiAgc3RhdGljIGFsbCAobWVyZ2UsIGVkaXRvcikge1xuICAgIGNvbnN0IGNvbmZsaWN0cyA9IFtdXG4gICAgbGV0IGxhc3RSb3cgPSAtMVxuXG4gICAgZWRpdG9yLmdldEJ1ZmZlcigpLnNjYW4oQ09ORkxJQ1RfU1RBUlRfUkVHRVgsIChtKSA9PiB7XG4gICAgICBjb25mbGljdFN0YXJ0Um93ID0gbS5yYW5nZS5zdGFydC5yb3dcbiAgICAgIGlmIChjb25mbGljdFN0YXJ0Um93IDwgbGFzdFJvdykge1xuICAgICAgICAvLyBNYXRjaCB3aXRoaW4gYW4gYWxyZWFkeS1wYXJzZWQgY29uZmxpY3QuXG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICBjb25zdCB2aXNpdG9yID0gbmV3IENvbmZsaWN0VmlzaXRvcihtZXJnZSwgZWRpdG9yKVxuXG4gICAgICB0cnkge1xuICAgICAgICBsYXN0Um93ID0gcGFyc2VDb25mbGljdChtZXJnZSwgZWRpdG9yLCBjb25mbGljdFN0YXJ0Um93LCB2aXNpdG9yKVxuICAgICAgICBjb25zdCBjb25mbGljdCA9IHZpc2l0b3IuY29uZmxpY3QoKVxuXG4gICAgICAgIGlmIChjb25mbGljdHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgIGNvbmZsaWN0Lm5hdmlnYXRvci5saW5rVG9QcmV2aW91cyhjb25mbGljdHNbY29uZmxpY3RzLmxlbmd0aCAtIDFdKVxuICAgICAgICB9XG4gICAgICAgIGNvbmZsaWN0cy5wdXNoKGNvbmZsaWN0KVxuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBpZiAoIWUucGFyc2VyU3RhdGUpIHRocm93IGVcblxuICAgICAgICBpZiAoIWF0b20uaW5TcGVjTW9kZSgpKSB7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihgVW5hYmxlIHRvIHBhcnNlIGNvbmZsaWN0OiAke2UubWVzc2FnZX1cXG4ke2Uuc3RhY2t9YClcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pXG5cbiAgICByZXR1cm4gY29uZmxpY3RzXG4gIH1cbn1cblxuLy8gUmVndWxhciBleHByZXNzaW9uIHRoYXQgbWF0Y2hlcyB0aGUgYmVnaW5uaW5nIG9mIGEgcG90ZW50aWFsIGNvbmZsaWN0LlxuY29uc3QgQ09ORkxJQ1RfU1RBUlRfUkVHRVggPSAvXjx7N30gKC4rKVxccj9cXG4vZ1xuXG4vLyBTaWRlIHBvc2l0aW9ucy5cbmNvbnN0IFRPUCA9ICd0b3AnXG5jb25zdCBCQVNFID0gJ2Jhc2UnXG5jb25zdCBCT1RUT00gPSAnYm90dG9tJ1xuXG4vLyBPcHRpb25zIHVzZWQgdG8gaW5pdGlhbGl6ZSBtYXJrZXJzLlxuY29uc3Qgb3B0aW9ucyA9IHtcbiAgaW52YWxpZGF0ZTogJ25ldmVyJ1xufVxuXG4vKlxuICogUHJpdmF0ZTogY29uZmxpY3QgcGFyc2VyIHZpc2l0b3IgdGhhdCBpZ25vcmVzIGFsbCBldmVudHMuXG4gKi9cbmNsYXNzIE5vb3BWaXNpdG9yIHtcblxuICB2aXNpdE91clNpZGUgKHBvc2l0aW9uLCBiYW5uZXJSb3csIHRleHRSb3dTdGFydCwgdGV4dFJvd0VuZCkgeyB9XG5cbiAgdmlzaXRCYXNlU2lkZSAocG9zaXRpb24sIGJhbm5lclJvdywgdGV4dFJvd1N0YXJ0LCB0ZXh0Um93RW5kKSB7IH1cblxuICB2aXNpdFNlcGFyYXRvciAoc2VwUm93U3RhcnQsIHNlcFJvd0VuZCkgeyB9XG5cbiAgdmlzaXRUaGVpclNpZGUgKHBvc2l0aW9uLCBiYW5uZXJSb3csIHRleHRSb3dTdGFydCwgdGV4dFJvd0VuZCkgeyB9XG5cbn1cblxuLypcbiAqIFByaXZhdGU6IGNvbmZsaWN0IHBhcnNlciB2aXNpdG9yIHRoYXQgbWFya3MgZWFjaCBidWZmZXIgcmFuZ2UgYW5kIGFzc2VtYmxlcyBhIENvbmZsaWN0IGZyb20gdGhlXG4gKiBwaWVjZXMuXG4gKi9cbmNsYXNzIENvbmZsaWN0VmlzaXRvciB7XG5cbiAgLypcbiAgICogbWVyZ2UgLSBbTWVyZ2VTdGF0ZV0gcGFzc2VkIHRvIGVhY2ggaW5zdGFudGlhdGVkIFNpZGUuXG4gICAqIGVkaXRvciAtIFtUZXh0RWRpdG9yXSBkaXNwbGF5aW5nIHRoZSBjb25mbGljdGluZyB0ZXh0LlxuICAgKi9cbiAgY29uc3RydWN0b3IgKG1lcmdlLCBlZGl0b3IpIHtcbiAgICB0aGlzLm1lcmdlID0gbWVyZ2VcbiAgICB0aGlzLmVkaXRvciA9IGVkaXRvclxuICAgIHRoaXMucHJldmlvdXNTaWRlID0gbnVsbFxuXG4gICAgdGhpcy5vdXJTaWRlID0gbnVsbFxuICAgIHRoaXMuYmFzZVNpZGUgPSBudWxsXG4gICAgdGhpcy5uYXZpZ2F0b3IgPSBudWxsXG4gIH1cblxuICAvKlxuICAgKiBwb3NpdGlvbiAtIFtTdHJpbmddIG9uZSBvZiBUT1Agb3IgQk9UVE9NLlxuICAgKiBiYW5uZXJSb3cgLSBbSW50ZWdlcl0gb2YgdGhlIGJ1ZmZlciByb3cgdGhhdCBjb250YWlucyBvdXIgc2lkZSdzIGJhbm5lci5cbiAgICogdGV4dFJvd1N0YXJ0IC0gW0ludGVnZXJdIG9mIHRoZSBmaXJzdCBidWZmZXIgcm93IHRoYXQgY29udGFpbiB0aGlzIHNpZGUncyB0ZXh0LlxuICAgKiB0ZXh0Um93RW5kIC0gW0ludGVnZXJdIG9mIHRoZSBmaXJzdCBidWZmZXIgcm93IGJleW9uZCB0aGUgZXh0ZW5kIG9mIHRoaXMgc2lkZSdzIHRleHQuXG4gICAqL1xuICB2aXNpdE91clNpZGUgKHBvc2l0aW9uLCBiYW5uZXJSb3csIHRleHRSb3dTdGFydCwgdGV4dFJvd0VuZCkge1xuICAgIHRoaXMub3VyU2lkZSA9IHRoaXMubWFya1NpZGUocG9zaXRpb24sIE91clNpZGUsIGJhbm5lclJvdywgdGV4dFJvd1N0YXJ0LCB0ZXh0Um93RW5kKVxuICB9XG5cbiAgLypcbiAgICogYmFubmVyUm93IC0gW0ludGVnZXJdIHRoZSBidWZmZXIgcm93IHRoYXQgY29udGFpbnMgb3VyIHNpZGUncyBiYW5uZXIuXG4gICAqIHRleHRSb3dTdGFydCAtIFtJbnRlZ2VyXSBmaXJzdCBidWZmZXIgcm93IHRoYXQgY29udGFpbiB0aGlzIHNpZGUncyB0ZXh0LlxuICAgKiB0ZXh0Um93RW5kIC0gW0ludGVnZXJdIGZpcnN0IGJ1ZmZlciByb3cgYmV5b25kIHRoZSBleHRlbmQgb2YgdGhpcyBzaWRlJ3MgdGV4dC5cbiAgICovXG4gIHZpc2l0QmFzZVNpZGUgKGJhbm5lclJvdywgdGV4dFJvd1N0YXJ0LCB0ZXh0Um93RW5kKSB7XG4gICAgdGhpcy5iYXNlU2lkZSA9IHRoaXMubWFya1NpZGUoQkFTRSwgQmFzZVNpZGUsIGJhbm5lclJvdywgdGV4dFJvd1N0YXJ0LCB0ZXh0Um93RW5kKVxuICB9XG5cbiAgLypcbiAgICogc2VwUm93U3RhcnQgLSBbSW50ZWdlcl0gYnVmZmVyIHJvdyB0aGF0IGNvbnRhaW5zIHRoZSBcIj09PT09PT1cIiBzZXBhcmF0b3IuXG4gICAqIHNlcFJvd0VuZCAtIFtJbnRlZ2VyXSB0aGUgYnVmZmVyIHJvdyBhZnRlciB0aGUgc2VwYXJhdG9yLlxuICAgKi9cbiAgdmlzaXRTZXBhcmF0b3IgKHNlcFJvd1N0YXJ0LCBzZXBSb3dFbmQpIHtcbiAgICBjb25zdCBtYXJrZXIgPSB0aGlzLmVkaXRvci5tYXJrQnVmZmVyUmFuZ2UoW1tzZXBSb3dTdGFydCwgMF0sIFtzZXBSb3dFbmQsIDBdXSwgb3B0aW9ucylcbiAgICB0aGlzLnByZXZpb3VzU2lkZS5mb2xsb3dpbmdNYXJrZXIgPSBtYXJrZXJcblxuICAgIHRoaXMubmF2aWdhdG9yID0gbmV3IE5hdmlnYXRvcihtYXJrZXIpXG4gICAgdGhpcy5wcmV2aW91c1NpZGUgPSB0aGlzLm5hdmlnYXRvclxuICB9XG5cbiAgLypcbiAgICogcG9zaXRpb24gLSBbU3RyaW5nXSBBbHdheXMgQkFTRTsgYWNjZXB0ZWQgZm9yIGNvbnNpc3RlbmN5LlxuICAgKiBiYW5uZXJSb3cgLSBbSW50ZWdlcl0gdGhlIGJ1ZmZlciByb3cgdGhhdCBjb250YWlucyBvdXIgc2lkZSdzIGJhbm5lci5cbiAgICogdGV4dFJvd1N0YXJ0IC0gW0ludGVnZXJdIGZpcnN0IGJ1ZmZlciByb3cgdGhhdCBjb250YWluIHRoaXMgc2lkZSdzIHRleHQuXG4gICAqIHRleHRSb3dFbmQgLSBbSW50ZWdlcl0gZmlyc3QgYnVmZmVyIHJvdyBiZXlvbmQgdGhlIGV4dGVuZCBvZiB0aGlzIHNpZGUncyB0ZXh0LlxuICAgKi9cbiAgdmlzaXRUaGVpclNpZGUgKHBvc2l0aW9uLCBiYW5uZXJSb3csIHRleHRSb3dTdGFydCwgdGV4dFJvd0VuZCkge1xuICAgIHRoaXMudGhlaXJTaWRlID0gdGhpcy5tYXJrU2lkZShwb3NpdGlvbiwgVGhlaXJTaWRlLCBiYW5uZXJSb3csIHRleHRSb3dTdGFydCwgdGV4dFJvd0VuZClcbiAgfVxuXG4gIG1hcmtTaWRlIChwb3NpdGlvbiwgc2lkZUtsYXNzLCBiYW5uZXJSb3csIHRleHRSb3dTdGFydCwgdGV4dFJvd0VuZCkge1xuICAgIGNvbnN0IGRlc2NyaXB0aW9uID0gdGhpcy5zaWRlRGVzY3JpcHRpb24oYmFubmVyUm93KVxuXG4gICAgY29uc3QgYmFubmVyTWFya2VyID0gdGhpcy5lZGl0b3IubWFya0J1ZmZlclJhbmdlKFtbYmFubmVyUm93LCAwXSwgW2Jhbm5lclJvdyArIDEsIDBdXSwgb3B0aW9ucylcblxuICAgIGlmICh0aGlzLnByZXZpb3VzU2lkZSkge1xuICAgICAgdGhpcy5wcmV2aW91c1NpZGUuZm9sbG93aW5nTWFya2VyID0gYmFubmVyTWFya2VyXG4gICAgfVxuXG4gICAgY29uc3QgdGV4dFJhbmdlID0gW1t0ZXh0Um93U3RhcnQsIDBdLCBbdGV4dFJvd0VuZCwgMF1dXG4gICAgY29uc3QgdGV4dE1hcmtlciA9IHRoaXMuZWRpdG9yLm1hcmtCdWZmZXJSYW5nZSh0ZXh0UmFuZ2UsIG9wdGlvbnMpXG4gICAgY29uc3QgdGV4dCA9IHRoaXMuZWRpdG9yLmdldFRleHRJbkJ1ZmZlclJhbmdlKHRleHRSYW5nZSlcblxuICAgIGNvbnN0IHNpZGUgPSBuZXcgc2lkZUtsYXNzKHRleHQsIGRlc2NyaXB0aW9uLCB0ZXh0TWFya2VyLCBiYW5uZXJNYXJrZXIsIHBvc2l0aW9uKVxuICAgIHRoaXMucHJldmlvdXNTaWRlID0gc2lkZVxuICAgIHJldHVybiBzaWRlXG4gIH1cblxuICAvKlxuICAgKiBQYXJzZSB0aGUgYmFubmVyIGRlc2NyaXB0aW9uIGZvciB0aGUgY3VycmVudCBzaWRlIGZyb20gYSBiYW5uZXIgcm93LlxuICAgKi9cbiAgc2lkZURlc2NyaXB0aW9uIChiYW5uZXJSb3cpIHtcbiAgICByZXR1cm4gdGhpcy5lZGl0b3IubGluZVRleHRGb3JCdWZmZXJSb3coYmFubmVyUm93KS5tYXRjaCgvXls8fD5dezd9ICguKikkLylbMV1cbiAgfVxuXG4gIGNvbmZsaWN0ICgpIHtcbiAgICB0aGlzLnByZXZpb3VzU2lkZS5mb2xsb3dpbmdNYXJrZXIgPSB0aGlzLnByZXZpb3VzU2lkZS5yZWZCYW5uZXJNYXJrZXJcblxuICAgIHJldHVybiBuZXcgQ29uZmxpY3QodGhpcy5vdXJTaWRlLCB0aGlzLnRoZWlyU2lkZSwgdGhpcy5iYXNlU2lkZSwgdGhpcy5uYXZpZ2F0b3IsIHRoaXMubWVyZ2UpXG4gIH1cblxufVxuXG4vKlxuICogUHJpdmF0ZTogcGFyc2VDb25mbGljdCBkaXNjb3ZlcnMgZ2l0IGNvbmZsaWN0IG1hcmtlcnMgaW4gYSBjb3JwdXMgb2YgdGV4dCBhbmQgY29uc3RydWN0cyBDb25mbGljdFxuICogaW5zdGFuY2VzIHRoYXQgbWFyayB0aGUgY29ycmVjdCBsaW5lcy5cbiAqXG4gKiBSZXR1cm5zIFtJbnRlZ2VyXSB0aGUgYnVmZmVyIHJvdyBhZnRlciB0aGUgZmluYWwgPDw8PDw8IGJvdW5kYXJ5LlxuICovXG5jb25zdCBwYXJzZUNvbmZsaWN0ID0gZnVuY3Rpb24gKG1lcmdlLCBlZGl0b3IsIHJvdywgdmlzaXRvcikge1xuICBsZXQgbGFzdEJvdW5kYXJ5ID0gbnVsbFxuXG4gIC8vIFZpc2l0IGEgc2lkZSB0aGF0IGJlZ2lucyB3aXRoIGEgYmFubmVyIGFuZCBkZXNjcmlwdGlvbiBhcyBpdHMgZmlyc3QgbGluZS5cbiAgY29uc3QgdmlzaXRIZWFkZXJTaWRlID0gKHBvc2l0aW9uLCB2aXNpdE1ldGhvZCkgPT4ge1xuICAgIGNvbnN0IHNpZGVSb3dTdGFydCA9IHJvd1xuICAgIHJvdyArPSAxXG4gICAgYWR2YW5jZVRvQm91bmRhcnkoJ3w9JylcbiAgICBjb25zdCBzaWRlUm93RW5kID0gcm93XG5cbiAgICB2aXNpdG9yW3Zpc2l0TWV0aG9kXShwb3NpdGlvbiwgc2lkZVJvd1N0YXJ0LCBzaWRlUm93U3RhcnQgKyAxLCBzaWRlUm93RW5kKVxuICB9XG5cbiAgLy8gVmlzaXQgdGhlIGJhc2Ugc2lkZSBmcm9tIGRpZmYzIG91dHB1dCwgaWYgb25lIGlzIHByZXNlbnQsIHRoZW4gdmlzaXQgdGhlIHNlcGFyYXRvci5cbiAgY29uc3QgdmlzaXRCYXNlQW5kU2VwYXJhdG9yID0gKCkgPT4ge1xuICAgIGlmIChsYXN0Qm91bmRhcnkgPT09ICd8Jykge1xuICAgICAgdmlzaXRCYXNlU2lkZSgpXG4gICAgfVxuXG4gICAgdmlzaXRTZXBhcmF0b3IoKVxuICB9XG5cbiAgLy8gVmlzaXQgYSBiYXNlIHNpZGUgZnJvbSBkaWZmMyBvdXRwdXQuXG4gIGNvbnN0IHZpc2l0QmFzZVNpZGUgPSAoKSA9PiB7XG4gICAgY29uc3Qgc2lkZVJvd1N0YXJ0ID0gcm93XG4gICAgcm93ICs9IDFcblxuICAgIGxldCBiID0gYWR2YW5jZVRvQm91bmRhcnkoJzw9JylcbiAgICB3aGlsZSAoYiA9PT0gJzwnKSB7XG4gICAgICAvLyBFbWJlZGRlZCByZWN1cnNpdmUgY29uZmxpY3Qgd2l0aGluIGEgYmFzZSBzaWRlLCBjYXVzZWQgYnkgYSBjcmlzcy1jcm9zcyBtZXJnZS5cbiAgICAgIC8vIEFkdmFuY2UgYmV5b25kIGl0IHdpdGhvdXQgbWFya2luZyBhbnl0aGluZy5cbiAgICAgIHJvdyA9IHBhcnNlQ29uZmxpY3QobWVyZ2UsIGVkaXRvciwgcm93LCBuZXcgTm9vcFZpc2l0b3IoKSlcbiAgICAgIGIgPSBhZHZhbmNlVG9Cb3VuZGFyeSgnPD0nKVxuICAgIH1cblxuICAgIGNvbnN0IHNpZGVSb3dFbmQgPSByb3dcblxuICAgIHZpc2l0b3IudmlzaXRCYXNlU2lkZShzaWRlUm93U3RhcnQsIHNpZGVSb3dTdGFydCArIDEsIHNpZGVSb3dFbmQpXG4gIH1cblxuICAvLyBWaXNpdCBhIFwiPT09PT09PT1cIiBzZXBhcmF0b3IuXG4gIGNvbnN0IHZpc2l0U2VwYXJhdG9yID0gKCkgPT4ge1xuICAgIGNvbnN0IHNlcFJvd1N0YXJ0ID0gcm93XG4gICAgcm93ICs9IDFcbiAgICBjb25zdCBzZXBSb3dFbmQgPSByb3dcblxuICAgIHZpc2l0b3IudmlzaXRTZXBhcmF0b3Ioc2VwUm93U3RhcnQsIHNlcFJvd0VuZClcbiAgfVxuXG4gIC8vIFZpZGllIGEgc2lkZSB3aXRoIGEgYmFubmVyIGFuZCBkZXNjcmlwdGlvbiBhcyBpdHMgbGFzdCBsaW5lLlxuICBjb25zdCB2aXNpdEZvb3RlclNpZGUgPSAocG9zaXRpb24sIHZpc2l0TWV0aG9kKSA9PiB7XG4gICAgY29uc3Qgc2lkZVJvd1N0YXJ0ID0gcm93XG4gICAgY29uc3QgYiA9IGFkdmFuY2VUb0JvdW5kYXJ5KCc+JylcbiAgICByb3cgKz0gMVxuICAgIHNpZGVSb3dFbmQgPSByb3dcblxuICAgIHZpc2l0b3JbdmlzaXRNZXRob2RdKHBvc2l0aW9uLCBzaWRlUm93RW5kIC0gMSwgc2lkZVJvd1N0YXJ0LCBzaWRlUm93RW5kIC0gMSlcbiAgfVxuXG4gIC8vIERldGVybWluZSBpZiB0aGUgY3VycmVudCByb3cgaXMgYSBzaWRlIGJvdW5kYXJ5LlxuICAvL1xuICAvLyBib3VuZGFyeUtpbmRzIC0gW1N0cmluZ10gYW55IGNvbWJpbmF0aW9uIG9mIDwsIHwsID0sIG9yID4gdG8gbGltaXQgdGhlIGtpbmRzIG9mIGJvdW5kYXJ5XG4gIC8vICAgZGV0ZWN0ZWQuXG4gIC8vXG4gIC8vIFJldHVybnMgdGhlIG1hdGNoaW5nIGJvdW5kYXJ5S2luZHMgY2hhcmFjdGVyLCBvciBgbnVsbGAgaWYgbm9uZSBtYXRjaC5cbiAgY29uc3QgaXNBdEJvdW5kYXJ5ID0gKGJvdW5kYXJ5S2luZHMgPSAnPHw9PicpID0+IHtcbiAgICBjb25zdCBsaW5lID0gZWRpdG9yLmxpbmVUZXh0Rm9yQnVmZmVyUm93KHJvdylcbiAgICBmb3IgKGIgb2YgYm91bmRhcnlLaW5kcykge1xuICAgICAgaWYgKGxpbmUuc3RhcnRzV2l0aChiLnJlcGVhdCg3KSkpIHtcbiAgICAgICAgcmV0dXJuIGJcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG51bGxcbiAgfVxuXG4gIC8vIEluY3JlbWVudCB0aGUgY3VycmVudCByb3cgdW50aWwgdGhlIGN1cnJlbnQgbGluZSBtYXRjaGVzIG9uZSBvZiB0aGUgcHJvdmlkZWQgYm91bmRhcnkga2luZHMsXG4gIC8vIG9yIHVudGlsIHRoZXJlIGFyZSBubyBtb3JlIGxpbmVzIGluIHRoZSBlZGl0b3IuXG4gIC8vXG4gIC8vIGJvdW5kYXJ5S2luZHMgLSBbU3RyaW5nXSBhbnkgY29tYmluYXRpb24gb2YgPCwgfCwgPSwgb3IgPiB0byBsaW1pdCB0aGUga2luZHMgb2YgYm91bmRhcmllc1xuICAvLyAgIHRoYXQgaGFsdCB0aGUgcHJvZ3Jlc3Npb24uXG4gIC8vXG4gIC8vIFJldHVybnMgdGhlIG1hdGNoaW5nIGJvdW5kYXJ5S2luZHMgY2hhcmFjdGVyLCBvciAnbnVsbCcgaWYgdGhlcmUgYXJlIG5vIG1hdGNoZXMgdG8gdGhlIGVuZCBvZlxuICAvLyB0aGUgZWRpdG9yLlxuICBjb25zdCBhZHZhbmNlVG9Cb3VuZGFyeSA9IChib3VuZGFyeUtpbmRzID0gJzx8PT4nKSA9PiB7XG4gICAgbGV0IGIgPSBpc0F0Qm91bmRhcnkoYm91bmRhcnlLaW5kcylcbiAgICB3aGlsZSAoYiA9PT0gbnVsbCkge1xuICAgICAgcm93ICs9IDFcbiAgICAgIGlmIChyb3cgPiBlZGl0b3IuZ2V0TGFzdEJ1ZmZlclJvdygpKSB7XG4gICAgICAgIGNvbnN0IGUgPSBuZXcgRXJyb3IoJ1VudGVybWluYXRlZCBjb25mbGljdCBzaWRlJylcbiAgICAgICAgZS5wYXJzZXJTdGF0ZSA9IHRydWVcbiAgICAgICAgdGhyb3cgZVxuICAgICAgfVxuICAgICAgYiA9IGlzQXRCb3VuZGFyeShib3VuZGFyeUtpbmRzKVxuICAgIH1cblxuICAgIGxhc3RCb3VuZGFyeSA9IGJcbiAgICByZXR1cm4gYlxuICB9XG5cbiAgaWYgKCFtZXJnZS5pc1JlYmFzZSkge1xuICAgIHZpc2l0SGVhZGVyU2lkZShUT1AsICd2aXNpdE91clNpZGUnKVxuICAgIHZpc2l0QmFzZUFuZFNlcGFyYXRvcigpXG4gICAgdmlzaXRGb290ZXJTaWRlKEJPVFRPTSwgJ3Zpc2l0VGhlaXJTaWRlJylcbiAgfSBlbHNlIHtcbiAgICB2aXNpdEhlYWRlclNpZGUoVE9QLCAndmlzaXRUaGVpclNpZGUnKVxuICAgIHZpc2l0QmFzZUFuZFNlcGFyYXRvcigpXG4gICAgdmlzaXRGb290ZXJTaWRlKEJPVFRPTSwgJ3Zpc2l0T3VyU2lkZScpXG4gIH1cblxuICByZXR1cm4gcm93XG59XG4iXX0=