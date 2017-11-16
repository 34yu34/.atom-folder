var _atom = require('atom');

var _atomSpacePenViews = require('atom-space-pen-views');

'use babel';

var PREFIX_COUNT = 3;

// option to auto fold on file open
// clickable region headers, perhaps using block content?
var CustomFolds = module.exports = {
	subscriptions: null,

	config: {
		prefix_0: {
			title: 'Beginning of first foldable region pair',
			description: 'The comment that marks the start of the foldable region must begin with this string literal (not counting leading white space or comment characters).',
			type: 'string',
			'default': '<editor-fold',
			order: 1
		},
		postfix_0: {
			title: 'End of first foldable region pair',
			description: 'The comment that marks the end of the foldable region must begin with this string literal (not counting leading white space or comment characters).',
			type: 'string',
			'default': '</editor-fold>',
			order: 2
		},
		prefix_1: {
			title: 'Beginning of second foldable region pair',
			description: 'The comment that marks the start of the foldable region must begin with this string literal (not counting leading white space or comment characters).',
			type: 'string',
			'default': '#region',
			order: 3
		},
		postfix_1: {
			title: 'End of second foldable region pair',
			description: 'The comment that marks the end of the foldable region must begin with this string literal (not counting leading white space or comment characters).',
			type: 'string',
			'default': '#endregion',
			order: 4
		},
		prefix_2: {
			title: 'Beginning of third foldable region pair',
			description: 'The comment that marks the start of the foldable region must begin with this string literal (not counting leading white space or comment characters).',
			type: 'string',
			'default': '',
			order: 5
		},
		postfix_2: {
			title: 'End of third foldable region pair',
			description: 'The comment that marks the end of the foldable region must begin with this string literal (not counting leading white space or comment characters).',
			type: 'string',
			'default': '',
			order: 6
		},
		areRegionsFoldedOnLoad: {
			title: 'Auto fold on file open?',
			description: 'If checked, regions start in their folded state when a file is opened.',
			type: 'boolean',
			'default': false,
			order: 7
		},
		areRegionsHighlighted: {
			title: 'Enable region highlighting?',
			description: 'If checked, the beginning and end of foldable regions are highlighted.',
			type: 'boolean',
			'default': true,
			order: 8
		},
		textFilePrefix_0: {
			title: 'Beginning of first foldable region pair in text file',
			description: 'The text that identifies the start of a foldable region in a text file (or any file type that doesn\'t support comments).',
			type: 'string',
			'default': '<editor-fold',
			order: 9
		},
		textFilePostfix_0: {
			title: 'End of first foldable region pair in text file',
			description: 'The text that identifies the end of a foldable region in a text file (or any file type that doesn\'t support comments).',
			type: 'string',
			'default': '</editor-fold>',
			order: 10
		},
		textFilePrefix_1: {
			title: 'Beginning of second foldable region pair in text file',
			description: 'The text that identifies the start of a foldable region in a text file (or any file type that doesn\'t support comments).',
			type: 'string',
			'default': '/*',
			order: 11
		},
		textFilePostfix_1: {
			title: 'End of second foldable region pair in text file',
			description: 'The text that identifies the end of a foldable region in a text file (or any file type that doesn\'t support comments).',
			type: 'string',
			'default': '*/',
			order: 12
		},
		textFilePrefix_2: {
			title: 'Beginning of third foldable region pair in text file',
			description: 'The text that identifies the start of a foldable region in a text file (or any file type that doesn\'t support comments).',
			type: 'string',
			'default': '',
			order: 13
		},
		textFilePostfix_2: {
			title: 'End of third foldable region pair in text file',
			description: 'The text that identifies the end of a foldable region in a text file (or any file type that doesn\'t support comments).',
			type: 'string',
			'default': '',
			order: 14
		}
	},

	prefixes: [],
	postfixes: [],
	textFilePrefixes: [],
	textFilePostfixes: [],
	areRegionsFoldedOnLoad: false,
	areRegionsHighlighted: true,

	editors: [],
	editorIdToMarkers: {},

	// <editor-fold> LIFE ******************************************************
	activate: function activate() {
		this.subscriptions = new _atom.CompositeDisposable();
		this.subscriptions.add(atom.commands.add('atom-workspace', {
			'custom-folds:fold-top-level': CustomFolds.foldTopLevel,
			'custom-folds:fold-all': CustomFolds.foldAll,
			'custom-folds:unfold-all': CustomFolds.unfoldAll,
			'custom-folds:fold-here': CustomFolds.foldHere,
			'custom-folds:unfold-here': CustomFolds.unfoldHere,
			'custom-folds:toggle-fold': CustomFolds.toggleFold
		}));

		var _loop = function (c) {
			var prefixPath = 'custom-folds.prefix_' + c;
			var postfixPath = 'custom-folds.postfix_' + c;
			var prefix = atom.config.get(prefixPath);
			var postfix = atom.config.get(postfixPath);

			var index = CustomFolds.prefixes.length;
			CustomFolds.prefixes.push(prefix);
			atom.config.onDidChange(prefixPath, function (change) {
				CustomFolds.prefixes[index] = change.newValue;
				CustomFolds._updateHighlightsAcrossEditors();
			});

			CustomFolds.postfixes.push(postfix);
			atom.config.onDidChange(postfixPath, function (change) {
				CustomFolds.postfixes[index] = change.newValue;
				CustomFolds._updateHighlightsAcrossEditors();
			});
		};

		for (var c = 0; c < PREFIX_COUNT; ++c) {
			_loop(c);
		}

		var _loop2 = function (c) {
			var prefixPath = 'custom-folds.textFilePrefix_' + c;
			var postfixPath = 'custom-folds.textFilePostfix_' + c;
			var prefix = atom.config.get(prefixPath);
			var postfix = atom.config.get(postfixPath);

			var index = CustomFolds.textFilePrefixes.length;
			CustomFolds.textFilePrefixes.push(prefix);
			atom.config.onDidChange(prefixPath, function (change) {
				CustomFolds.textFilePrefixes[index] = change.newValue;
				CustomFolds._updateHighlightsAcrossEditors();
			});

			CustomFolds.textFilePostfixes.push(postfix);
			atom.config.onDidChange(postfixPath, function (change) {
				CustomFolds.textFilePostfixes[index] = change.newValue;
				CustomFolds._updateHighlightsAcrossEditors();
			});
		};

		for (var c = 0; c < PREFIX_COUNT; ++c) {
			_loop2(c);
		}

		CustomFolds.areRegionsFoldedOnLoad = atom.config.get('custom-folds.areRegionsFoldedOnLoad');
		atom.config.onDidChange('custom-folds.areRegionsFoldedOnLoad', function (change) {
			CustomFolds.areRegionsFoldedOnLoad = change.newValue;
		});

		CustomFolds.areRegionsHighlighted = atom.config.get('custom-folds.areRegionsHighlighted');
		atom.config.onDidChange('custom-folds.areRegionsHighlighted', function (change) {
			CustomFolds.areRegionsHighlighted = change.newValue;
			CustomFolds._updateHighlightsAcrossEditors();
		});

		this.subscriptions.add(atom.workspace.observeTextEditors(function (editor) {
			CustomFolds.editors.push(editor);
			CustomFolds.editorIdToMarkers[editor.id] = [];

			// Delaying two animation frames seems to fix the issue of the empty comment chars.
			// This is a really stupid fix. Would prefer an event to properly signal this but I can't find such an event in the atom api.
			window.requestAnimationFrame(function () {
				window.requestAnimationFrame(function () {
					CustomFolds._updateHighlights(editor);
				});
			});
			CustomFolds._addClickEvent(editor);

			// It's easier just to always subscribe to this.
			editor.onDidStopChanging(function () {
				return CustomFolds._updateHighlights(editor);
			});
		}));

		this.subscriptions.add(atom.workspace.onDidAddTextEditor(function (event) {
			if (CustomFolds.areRegionsFoldedOnLoad) {
				event.textEditor.tokenizedBuffer.onDidTokenize(function () {
					CustomFolds.foldAll(event.textEditor);
				});
			}
		}));
	},

	deactivate: function deactivate() {
		this.subscriptions.dispose();
	},
	// </editor-fold> life

	// <editor-fold> RESPONDERS ************************************************
	foldTopLevel: function foldTopLevel() {
		var options = CustomFolds._getOptions();

		var _loop3 = function (_c, cLen) {
			var line = options.editor.lineTextForBufferRow(_c).trim();

			if (!options.areCommentsRequired || options.editor.isBufferRowCommented(_c)) {
				options.prefixes.forEach(function (prefix, index) {
					var postfix = options.postfixes[index];
					if (!prefix || !prefix.length || !postfix || !postfix.length) {
						return;
					}

					if (line.replace(options.commentChars, '').trim().startsWith(prefix)) {
						var endRow = CustomFolds._rowOfEndTag(options, index, _c);
						if (_c < endRow) {
							CustomFolds._fold(options.editor, _c, endRow);
							_c = endRow + 1;
						}
					}
				});
			}
			c = _c;
		};

		for (var c = 0, cLen = options.editor.getLineCount(); c < cLen; ++c) {
			_loop3(c, cLen);
		}
	},

	foldAll: function foldAll() {
		var currentEditor = arguments.length <= 0 || arguments[0] === undefined ? undefined : arguments[0];

		// When called from keyboard binding, some arguments get sent in. We're only interested if the argument is the editor.
		if (!(currentEditor instanceof _atom.TextEditor)) {
			currentEditor = undefined;
		}

		var _CustomFolds$_getOptions = CustomFolds._getOptions(currentEditor);

		var editor = _CustomFolds$_getOptions.editor;
		var commentChars = _CustomFolds$_getOptions.commentChars;
		var areCommentsRequired = _CustomFolds$_getOptions.areCommentsRequired;
		var prefixes = _CustomFolds$_getOptions.prefixes;
		var postfixes = _CustomFolds$_getOptions.postfixes;

		var startPrefixStack = [];

		var _loop4 = function (cLen, _c2) {
			var line = editor.lineTextForBufferRow(_c2).trim();
			if (!areCommentsRequired || editor.isBufferRowCommented(_c2)) {
				prefixes.forEach(function (prefix, index) {
					var postfix = postfixes[index];
					if (!prefix || !prefix.length || !postfix || !postfix.length) {
						return;
					}

					var trimmedLine = line.replace(commentChars, '').trim();
					if (trimmedLine.startsWith(prefix)) {
						startPrefixStack.push(_c2);
					} else if (trimmedLine.startsWith(postfix)) {
						if (startPrefixStack.length) {
							var startRow = startPrefixStack.pop();
							CustomFolds._fold(editor, startRow, _c2);
						} else {
							atom.notifications.addWarning('Extra closing fold tag found at line ' + (_c2 + 1) + '.');
						}
					}
				});
			}
		};

		for (var _c2 = 0, cLen = editor.getLineCount(); _c2 < cLen; ++_c2) {
			_loop4(cLen, _c2);
		}

		if (startPrefixStack.length) {
			atom.notifications.addWarning('Extra opening fold tag found at line ' + (startPrefixStack.pop() + 1) + '.');
		}
	},

	unfoldAll: function unfoldAll() {
		var _CustomFolds$_getOptions2 = CustomFolds._getOptions();

		var editor = _CustomFolds$_getOptions2.editor;
		var commentChars = _CustomFolds$_getOptions2.commentChars;
		var areCommentsRequired = _CustomFolds$_getOptions2.areCommentsRequired;
		var prefixes = _CustomFolds$_getOptions2.prefixes;

		var _loop5 = function (cLen, _c3) {
			var line = editor.lineTextForBufferRow(_c3).trim();

			if (!areCommentsRequired || editor.isBufferRowCommented(_c3)) {
				prefixes.forEach(function (prefix) {
					if (!prefix || !prefix.length) {
						return;
					}

					if (line.replace(commentChars, '').trim().startsWith(prefix)) {
						editor.unfoldBufferRow(_c3);
					}
				});
			}
		};

		for (var _c3 = 0, cLen = editor.getLineCount(); _c3 < cLen; ++_c3) {
			_loop5(cLen, _c3);
		}
	},

	// TODO: do this for each cursor
	foldHere: function foldHere() {
		var options = CustomFolds._getOptions();

		var row = CustomFolds._rowOfStartTag(options, options.editor.getCursorBufferPosition().row);
		if (row >= 0) {
			CustomFolds.foldRow(row, options);
		}
	},

	foldRow: function foldRow(row) {
		var options = arguments.length <= 1 || arguments[1] === undefined ? undefined : arguments[1];

		var result = false;

		options = options || CustomFolds._getOptions();

		row = +row; // Ensure row is a number
		var line = options.editor.lineTextForBufferRow(row).trim();
		if (!options.areCommentsRequired || options.editor.isBufferRowCommented(row)) {
			for (var _c4 = 0, cLen = options.prefixes.length; _c4 < cLen; ++_c4) {
				var prefix = options.prefixes[_c4];
				var postfix = options.postfixes[_c4];
				if (!prefix || !prefix.length || !postfix || !postfix.length) {
					continue;
				}

				if (line.replace(options.commentChars, '').trim().startsWith(prefix)) {
					var endRow = CustomFolds._rowOfEndTag(options, _c4, row);
					if (row < endRow) {
						CustomFolds._fold(options.editor, row, endRow);
						result = true;
					}

					break;
				}
			}
		}

		return result;
	},

	unfoldHere: function unfoldHere() {
		var _CustomFolds$_getOptions3 = CustomFolds._getOptions();

		var editor = _CustomFolds$_getOptions3.editor;

		editor.unfoldBufferRow(editor.getCursorBufferPosition().row);
		// editor.unfoldCurrentRow();  // this does not seem to preserve internal folding
	},

	toggleFold: function toggleFold() {
		var options = CustomFolds._getOptions();
		var row = options.editor.getCursorBufferPosition().row;

		if (options.editor.isFoldedAtBufferRow(row)) {
			CustomFolds.unfoldHere();
		} else {
			CustomFolds.foldHere(options);
		}
	},
	// </editor-fold> responders

	// <editor-fold> HELPERS ***************************************************
	_fold: function _fold(editor, startRow, endRow) {
		editor.setSelectedBufferRange(new _atom.Range(new _atom.Point(startRow, 512), new _atom.Point(endRow, 512)));
		editor.foldSelectedLines();
	},

	// Fetch the current editor, applicable prefix and postfix arrays, as well as the commentChars
	_getOptions: function _getOptions() {
		var editor = arguments.length <= 0 || arguments[0] === undefined ? undefined : arguments[0];

		editor = editor || atom.workspace.getActiveTextEditor();
		var commentChars = editor ? (atom.config.get('editor.commentStart', { scope: editor.getRootScopeDescriptor() }) || '').trim() : '';
		var areCommentsRequired = commentChars !== '';
		var prefixes = areCommentsRequired ? CustomFolds.prefixes : CustomFolds.textFilePrefixes;
		var postfixes = areCommentsRequired ? CustomFolds.postfixes : CustomFolds.textFilePostfixes;

		return { editor: editor, commentChars: commentChars, areCommentsRequired: areCommentsRequired, prefixes: prefixes, postfixes: postfixes };
	},

	// takes nesting into account
	_rowOfStartTag: function _rowOfStartTag(options, startRow) {
		var result = -1;

		var endTagCount = 1;
		for (var _c5 = startRow; _c5 >= 0 && endTagCount > 0; --_c5) {
			var line = options.editor.lineTextForBufferRow(_c5).trim();
			if (!options.areCommentsRequired || options.editor.isBufferRowCommented(_c5)) {
				for (var d = 0, dLen = options.prefixes.length; d < dLen; ++d) {
					var prefix = options.prefixes[d];
					var postfix = options.postfixes[d];
					if (!prefix || !prefix.length || !postfix || !postfix.length) {
						continue;
					}

					if (line.replace(options.commentChars, '').trim().startsWith(postfix)) {
						// Don't count the ending tag if the user started the action while on an ending tag.
						if (_c5 !== startRow) {
							++endTagCount;
						}
						break;
					} else if (line.replace(options.commentChars, '').trim().startsWith(prefix)) {
						--endTagCount;
						if (!endTagCount) {
							result = _c5;
						}
						break;
					}
				}
			}
		}

		return result;
	},

	// takes nesting into account
	_rowOfEndTag: function _rowOfEndTag(options, pairIndex, startRow) {
		var result = -1;

		var prefix = options.prefixes[pairIndex];
		var postfix = options.postfixes[pairIndex];

		var startTagCount = 1;
		var c = startRow + 1;
		var cLen = options.editor.getLineCount();
		for (; c < cLen; ++c) {
			var line = options.editor.lineTextForBufferRow(c).trim();
			if (!options.areCommentsRequired || options.editor.isBufferRowCommented(c)) {
				if (line.replace(options.commentChars, '').trim().startsWith(prefix)) {
					++startTagCount;
				} else if (line.replace(options.commentChars, '').trim().startsWith(postfix)) {
					if (--startTagCount === 0) {
						break;
					}
				}
			}
		}

		if (c === cLen) {
			atom.notifications.addWarning('No end marker found for folding tag that starts on line ' + (startRow + 1) + '.');
		} else {
			result = c;
		}

		return result;
	},

	_updateHighlights: function _updateHighlights(editor) {
		if (!editor.isAlive()) {
			return;
		}

		var markers = CustomFolds.editorIdToMarkers[editor.id];
		markers.forEach(function (m) {
			return m.destroy();
		});

		var _CustomFolds$_getOptions4 = CustomFolds._getOptions(editor);

		var commentChars = _CustomFolds$_getOptions4.commentChars;
		var areCommentsRequired = _CustomFolds$_getOptions4.areCommentsRequired;
		var prefixes = _CustomFolds$_getOptions4.prefixes;
		var postfixes = _CustomFolds$_getOptions4.postfixes;

		// atom.notifications.addWarning(`CommmentChars: "${commentChars}".`);

		var _loop6 = function (cLen, _c6) {
			var line = editor.lineTextForBufferRow(_c6).trim();

			prefixes.forEach(function (prefix, index) {
				var postfix = postfixes[index];
				if (!prefix || !prefix.length || !postfix || !postfix.length) {
					return;
				}

				var cls = undefined;
				if (line.replace(commentChars, '').trim().startsWith(prefix)) {
					cls = 'custom-folds-start';
				} else if (line.replace(commentChars, '').trim().startsWith(postfix)) {
					cls = 'custom-folds-stop';
				}

				if (cls) {
					var range = [[_c6, 0], [_c6, 0]];
					var marker = editor.markBufferRange(range);
					markers.push(marker);
					editor.decorateMarker(marker, { type: 'line', 'class': cls });
					if (cls === 'custom-folds-start') {
						editor.decorateMarker(marker, { type: 'line-number', 'class': cls });
					}

					if (!CustomFolds.areRegionsHighlighted) {
						editor.decorateMarker(marker, { type: 'line', 'class': 'no-highlight' });
						if (cls === 'custom-folds-start') {
							editor.decorateMarker(marker, { type: 'line-number', 'class': 'no-highlight' });
						}
					}
				}
			});
		};

		for (var _c6 = 0, cLen = editor.getLineCount(); _c6 < cLen; ++_c6) {
			_loop6(cLen, _c6);
		}
	},

	_updateHighlightsAcrossEditors: function _updateHighlightsAcrossEditors() {
		CustomFolds.editors.forEach(CustomFolds._updateHighlights);
	},

	_addClickEvent: function _addClickEvent(editor) {
		var editorView = atom.views.getView(editor);
		var gutter = editorView.querySelector('.gutter');
		(0, _atomSpacePenViews.$)(gutter).on('click', '.line-number.custom-folds-start:not(.folded) .icon-right', function (event) {
			var row = event.target.parentElement.dataset.bufferRow;
			CustomFolds.foldRow(row);
		});
	}
	// </editor-fold> helpers
};

// For testing…

// <editor-fold desc='1'>
// <editor-fold desc='2'>
// <editor-fold desc='3'>
// </editor-fold>
// </editor-fold>
// </editor-fold>
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2JpbGx5Ly5hdG9tL3BhY2thZ2VzL2N1c3RvbS1mb2xkcy9saWIvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Im9CQUU0RCxNQUFNOztpQ0FDbEQsc0JBQXNCOztBQUh0QyxXQUFXLENBQUM7O0FBS1osSUFBTSxZQUFZLEdBQUcsQ0FBQyxDQUFDOzs7O0FBSXZCLElBQUksV0FBVyxHQUNmLE1BQU0sQ0FBQyxPQUFPLEdBQUc7QUFDaEIsY0FBYSxFQUFFLElBQUk7O0FBRW5CLE9BQU0sRUFBRTtBQUNQLFVBQVEsRUFBRTtBQUNULFFBQUssRUFBRSx5Q0FBeUM7QUFDaEQsY0FBVyxFQUFFLHVKQUF1SjtBQUNwSyxPQUFJLEVBQUUsUUFBUTtBQUNkLGNBQVMsY0FBYztBQUN2QixRQUFLLEVBQUUsQ0FBQztHQUNSO0FBQ0QsV0FBUyxFQUFFO0FBQ1YsUUFBSyxFQUFFLG1DQUFtQztBQUMxQyxjQUFXLEVBQUUscUpBQXFKO0FBQ2xLLE9BQUksRUFBRSxRQUFRO0FBQ2QsY0FBUyxnQkFBZ0I7QUFDekIsUUFBSyxFQUFFLENBQUM7R0FDUjtBQUNELFVBQVEsRUFBRTtBQUNULFFBQUssRUFBRSwwQ0FBMEM7QUFDakQsY0FBVyxFQUFFLHVKQUF1SjtBQUNwSyxPQUFJLEVBQUUsUUFBUTtBQUNkLGNBQVMsU0FBUztBQUNsQixRQUFLLEVBQUUsQ0FBQztHQUNSO0FBQ0QsV0FBUyxFQUFFO0FBQ1YsUUFBSyxFQUFFLG9DQUFvQztBQUMzQyxjQUFXLEVBQUUscUpBQXFKO0FBQ2xLLE9BQUksRUFBRSxRQUFRO0FBQ2QsY0FBUyxZQUFZO0FBQ3JCLFFBQUssRUFBRSxDQUFDO0dBQ1I7QUFDRCxVQUFRLEVBQUU7QUFDVCxRQUFLLEVBQUUseUNBQXlDO0FBQ2hELGNBQVcsRUFBRSx1SkFBdUo7QUFDcEssT0FBSSxFQUFFLFFBQVE7QUFDZCxjQUFTLEVBQUU7QUFDWCxRQUFLLEVBQUUsQ0FBQztHQUNSO0FBQ0QsV0FBUyxFQUFFO0FBQ1YsUUFBSyxFQUFF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QUFDLFNBQVMsQ0FBQztBQUN6RCxjQUFXLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0dBQ3pCLENBQUMsQ0FBQztFQUNIOztDQUVELENBQUMiLCJmaWxlIjoiL2hvbWUvYmlsbHkvLmF0b20vcGFja2FnZXMvY3VzdG9tLWZvbGRzL2xpYi9pbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5pbXBvcnQge0NvbXBvc2l0ZURpc3Bvc2FibGUsIFBvaW50LCBSYW5nZSwgVGV4dEVkaXRvcn0gZnJvbSAnYXRvbSc7XG5pbXBvcnQgeyR9IGZyb20gJ2F0b20tc3BhY2UtcGVuLXZpZXdzJztcblxuY29uc3QgUFJFRklYX0NPVU5UID0gMztcblxuLy8gb3B0aW9uIHRvIGF1dG8gZm9sZCBvbiBmaWxlIG9wZW5cbi8vIGNsaWNrYWJsZSByZWdpb24gaGVhZGVycywgcGVyaGFwcyB1c2luZyBibG9jayBjb250ZW50P1xudmFyIEN1c3RvbUZvbGRzID1cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRzdWJzY3JpcHRpb25zOiBudWxsLFxuXG5cdGNvbmZpZzoge1xuXHRcdHByZWZpeF8wOiB7XG5cdFx0XHR0aXRsZTogJ0JlZ2lubmluZyBvZiBmaXJzdCBmb2xkYWJsZSByZWdpb24gcGFpcicsXG5cdFx0XHRkZXNjcmlwdGlvbjogJ1RoZSBjb21tZW50IHRoYXQgbWFya3MgdGhlIHN0YXJ0IG9mIHRoZSBmb2xkYWJsZSByZWdpb24gbXVzdCBiZWdpbiB3aXRoIHRoaXMgc3RyaW5nIGxpdGVyYWwgKG5vdCBjb3VudGluZyBsZWFkaW5nIHdoaXRlIHNwYWNlIG9yIGNvbW1lbnQgY2hhcmFjdGVycykuJyxcblx0XHRcdHR5cGU6ICdzdHJpbmcnLFxuXHRcdFx0ZGVmYXVsdDogJzxlZGl0b3ItZm9sZCcsXG5cdFx0XHRvcmRlcjogMVxuXHRcdH0sXG5cdFx0cG9zdGZpeF8wOiB7XG5cdFx0XHR0aXRsZTogJ0VuZCBvZiBmaXJzdCBmb2xkYWJsZSByZWdpb24gcGFpcicsXG5cdFx0XHRkZXNjcmlwdGlvbjogJ1RoZSBjb21tZW50IHRoYXQgbWFya3MgdGhlIGVuZCBvZiB0aGUgZm9sZGFibGUgcmVnaW9uIG11c3QgYmVnaW4gd2l0aCB0aGlzIHN0cmluZyBsaXRlcmFsIChub3QgY291bnRpbmcgbGVhZGluZyB3aGl0ZSBzcGFjZSBvciBjb21tZW50IGNoYXJhY3RlcnMpLicsXG5cdFx0XHR0eXBlOiAnc3RyaW5nJyxcblx0XHRcdGRlZmF1bHQ6ICc8L2VkaXRvci1mb2xkPicsXG5cdFx0XHRvcmRlcjogMlxuXHRcdH0sXG5cdFx0cHJlZml4XzE6IHtcblx0XHRcdHRpdGxlOiAnQmVnaW5uaW5nIG9mIHNlY29uZCBmb2xkYWJsZSByZWdpb24gcGFpcicsXG5cdFx0XHRkZXNjcmlwdGlvbjogJ1RoZSBjb21tZW50IHRoYXQgbWFya3MgdGhlIHN0YXJ0IG9mIHRoZSBmb2xkYWJsZSByZWdpb24gbXVzdCBiZWdpbiB3aXRoIHRoaXMgc3RyaW5nIGxpdGVyYWwgKG5vdCBjb3VudGluZyBsZWFkaW5nIHdoaXRlIHNwYWNlIG9yIGNvbW1lbnQgY2hhcmFjdGVycykuJyxcblx0XHRcdHR5cGU6ICdzdHJpbmcnLFxuXHRcdFx0ZGVmYXVsdDogJyNyZWdpb24nLFxuXHRcdFx0b3JkZXI6IDNcblx0XHR9LFxuXHRcdHBvc3RmaXhfMToge1xuXHRcdFx0dGl0bGU6ICdFbmQgb2Ygc2Vjb25kIGZvbGRhYmxlIHJlZ2lvbiBwYWlyJyxcblx0XHRcdGRlc2NyaXB0aW9uOiAnVGhlIGNvbW1lbnQgdGhhdCBtYXJrcyB0aGUgZW5kIG9mIHRoZSBmb2xkYWJsZSByZWdpb24gbXVzdCBiZWdpbiB3aXRoIHRoaXMgc3RyaW5nIGxpdGVyYWwgKG5vdCBjb3VudGluZyBsZWFkaW5nIHdoaXRlIHNwYWNlIG9yIGNvbW1lbnQgY2hhcmFjdGVycykuJyxcblx0XHRcdHR5cGU6ICdzdHJpbmcnLFxuXHRcdFx0ZGVmYXVsdDogJyNlbmRyZWdpb24nLFxuXHRcdFx0b3JkZXI6IDRcblx0XHR9LFxuXHRcdHByZWZpeF8yOiB7XG5cdFx0XHR0aXRsZTogJ0JlZ2lubmluZyBvZiB0aGlyZCBmb2xkYWJsZSByZWdpb24gcGFpcicsXG5cdFx0XHRkZXNjcmlwdGlvbjogJ1RoZSBjb21tZW50IHRoYXQgbWFya3MgdGhlIHN0YXJ0IG9mIHRoZSBmb2xkYWJsZSByZWdpb24gbXVzdCBiZWdpbiB3aXRoIHRoaXMgc3RyaW5nIGxpdGVyYWwgKG5vdCBjb3VudGluZyBsZWFkaW5nIHdoaXRlIHNwYWNlIG9yIGNvbW1lbnQgY2hhcmFjdGVycykuJyxcblx0XHRcdHR5cGU6ICdzdHJpbmcnLFxuXHRcdFx0ZGVmYXVsdDogJycsXG5cdFx0XHRvcmRlcjogNVxuXHRcdH0sXG5cdFx0cG9zdGZpeF8yOiB7XG5cdFx0XHR0aXRsZTogJ0VuZCBvZiB0aGlyZCBmb2xkYWJsZSByZWdpb24gcGFpcicsXG5cdFx0XHRkZXNjcmlwdGlvbjogJ1RoZSBjb21tZW50IHRoYXQgbWFya3MgdGhlIGVuZCBvZiB0aGUgZm9sZGFibGUgcmVnaW9uIG11c3QgYmVnaW4gd2l0aCB0aGlzIHN0cmluZyBsaXRlcmFsIChub3QgY291bnRpbmcgbGVhZGluZyB3aGl0ZSBzcGFjZSBvciBjb21tZW50IGNoYXJhY3RlcnMpLicsXG5cdFx0XHR0eXBlOiAnc3RyaW5nJyxcblx0XHRcdGRlZmF1bHQ6ICcnLFxuXHRcdFx0b3JkZXI6IDZcblx0XHR9LFxuXHRcdGFyZVJlZ2lvbnNGb2xkZWRPbkxvYWQ6IHtcblx0XHRcdHRpdGxlOiAnQXV0byBmb2xkIG9uIGZpbGUgb3Blbj8nLFxuXHRcdFx0ZGVzY3JpcHRpb246ICdJZiBjaGVja2VkLCByZWdpb25zIHN0YXJ0IGluIHRoZWlyIGZvbGRlZCBzdGF0ZSB3aGVuIGEgZmlsZSBpcyBvcGVuZWQuJyxcblx0XHRcdHR5cGU6ICdib29sZWFuJyxcblx0XHRcdGRlZmF1bHQ6IGZhbHNlLFxuXHRcdFx0b3JkZXI6IDdcblx0XHR9LFxuXHRcdGFyZVJlZ2lvbnNIaWdobGlnaHRlZDoge1xuXHRcdFx0dGl0bGU6ICdFbmFibGUgcmVnaW9uIGhpZ2hsaWdodGluZz8nLFxuXHRcdFx0ZGVzY3JpcHRpb246ICdJZiBjaGVja2VkLCB0aGUgYmVnaW5uaW5nIGFuZCBlbmQgb2YgZm9sZGFibGUgcmVnaW9ucyBhcmUgaGlnaGxpZ2h0ZWQuJyxcblx0XHRcdHR5cGU6ICdib29sZWFuJyxcblx0XHRcdGRlZmF1bHQ6IHRydWUsXG5cdFx0XHRvcmRlcjogOFxuXHRcdH0sXG5cdFx0dGV4dEZpbGVQcmVmaXhfMDoge1xuXHRcdFx0dGl0bGU6ICdCZWdpbm5pbmcgb2YgZmlyc3QgZm9sZGFibGUgcmVnaW9uIHBhaXIgaW4gdGV4dCBmaWxlJyxcblx0XHRcdGRlc2NyaXB0aW9uOiBgVGhlIHRleHQgdGhhdCBpZGVudGlmaWVzIHRoZSBzdGFydCBvZiBhIGZvbGRhYmxlIHJlZ2lvbiBpbiBhIHRleHQgZmlsZSAob3IgYW55IGZpbGUgdHlwZSB0aGF0IGRvZXNuJ3Qgc3VwcG9ydCBjb21tZW50cykuYCxcblx0XHRcdHR5cGU6ICdzdHJpbmcnLFxuXHRcdFx0ZGVmYXVsdDogJzxlZGl0b3ItZm9sZCcsXG5cdFx0XHRvcmRlcjogOVxuXHRcdH0sXG5cdFx0dGV4dEZpbGVQb3N0Zml4XzA6IHtcblx0XHRcdHRpdGxlOiAnRW5kIG9mIGZpcnN0IGZvbGRhYmxlIHJlZ2lvbiBwYWlyIGluIHRleHQgZmlsZScsXG5cdFx0XHRkZXNjcmlwdGlvbjogYFRoZSB0ZXh0IHRoYXQgaWRlbnRpZmllcyB0aGUgZW5kIG9mIGEgZm9sZGFibGUgcmVnaW9uIGluIGEgdGV4dCBmaWxlIChvciBhbnkgZmlsZSB0eXBlIHRoYXQgZG9lc24ndCBzdXBwb3J0IGNvbW1lbnRzKS5gLFxuXHRcdFx0dHlwZTogJ3N0cmluZycsXG5cdFx0XHRkZWZhdWx0OiAnPC9lZGl0b3ItZm9sZD4nLFxuXHRcdFx0b3JkZXI6IDEwXG5cdFx0fSxcblx0XHR0ZXh0RmlsZVByZWZpeF8xOiB7XG5cdFx0XHR0aXRsZTogJ0JlZ2lubmluZyBvZiBzZWNvbmQgZm9sZGFibGUgcmVnaW9uIHBhaXIgaW4gdGV4dCBmaWxlJyxcblx0XHRcdGRlc2NyaXB0aW9uOiBgVGhlIHRleHQgdGhhdCBpZGVudGlmaWVzIHRoZSBzdGFydCBvZiBhIGZvbGRhYmxlIHJlZ2lvbiBpbiBhIHRleHQgZmlsZSAob3IgYW55IGZpbGUgdHlwZSB0aGF0IGRvZXNuJ3Qgc3VwcG9ydCBjb21tZW50cykuYCxcblx0XHRcdHR5cGU6ICdzdHJpbmcnLFxuXHRcdFx0ZGVmYXVsdDogJy8qJyxcblx0XHRcdG9yZGVyOiAxMVxuXHRcdH0sXG5cdFx0dGV4dEZpbGVQb3N0Zml4XzE6IHtcblx0XHRcdHRpdGxlOiAnRW5kIG9mIHNlY29uZCBmb2xkYWJsZSByZWdpb24gcGFpciBpbiB0ZXh0IGZpbGUnLFxuXHRcdFx0ZGVzY3JpcHRpb246IGBUaGUgdGV4dCB0aGF0IGlkZW50aWZpZXMgdGhlIGVuZCBvZiBhIGZvbGRhYmxlIHJlZ2lvbiBpbiBhIHRleHQgZmlsZSAob3IgYW55IGZpbGUgdHlwZSB0aGF0IGRvZXNuJ3Qgc3VwcG9ydCBjb21tZW50cykuYCxcblx0XHRcdHR5cGU6ICdzdHJpbmcnLFxuXHRcdFx0ZGVmYXVsdDogJyovJyxcblx0XHRcdG9yZGVyOiAxMlxuXHRcdH0sXG5cdFx0dGV4dEZpbGVQcmVmaXhfMjoge1xuXHRcdFx0dGl0bGU6ICdCZWdpbm5pbmcgb2YgdGhpcmQgZm9sZGFibGUgcmVnaW9uIHBhaXIgaW4gdGV4dCBmaWxlJyxcblx0XHRcdGRlc2NyaXB0aW9uOiBgVGhlIHRleHQgdGhhdCBpZGVudGlmaWVzIHRoZSBzdGFydCBvZiBhIGZvbGRhYmxlIHJlZ2lvbiBpbiBhIHRleHQgZmlsZSAob3IgYW55IGZpbGUgdHlwZSB0aGF0IGRvZXNuJ3Qgc3VwcG9ydCBjb21tZW50cykuYCxcblx0XHRcdHR5cGU6ICdzdHJpbmcnLFxuXHRcdFx0ZGVmYXVsdDogJycsXG5cdFx0XHRvcmRlcjogMTNcblx0XHR9LFxuXHRcdHRleHRGaWxlUG9zdGZpeF8yOiB7XG5cdFx0XHR0aXRsZTogJ0VuZCBvZiB0aGlyZCBmb2xkYWJsZSByZWdpb24gcGFpciBpbiB0ZXh0IGZpbGUnLFxuXHRcdFx0ZGVzY3JpcHRpb246IGBUaGUgdGV4dCB0aGF0IGlkZW50aWZpZXMgdGhlIGVuZCBvZiBhIGZvbGRhYmxlIHJlZ2lvbiBpbiBhIHRleHQgZmlsZSAob3IgYW55IGZpbGUgdHlwZSB0aGF0IGRvZXNuJ3Qgc3VwcG9ydCBjb21tZW50cykuYCxcblx0XHRcdHR5cGU6ICdzdHJpbmcnLFxuXHRcdFx0ZGVmYXVsdDogJycsXG5cdFx0XHRvcmRlcjogMTRcblx0XHR9XG5cdH0sXG5cblx0cHJlZml4ZXM6IFtdLFxuXHRwb3N0Zml4ZXM6IFtdLFxuXHR0ZXh0RmlsZVByZWZpeGVzOiBbXSxcblx0dGV4dEZpbGVQb3N0Zml4ZXM6IFtdLFxuXHRhcmVSZWdpb25zRm9sZGVkT25Mb2FkOiBmYWxzZSxcblx0YXJlUmVnaW9uc0hpZ2hsaWdodGVkOiB0cnVlLFxuXG5cdGVkaXRvcnM6IFtdLFxuXHRlZGl0b3JJZFRvTWFya2Vyczoge30sXG5cblx0Ly8gPGVkaXRvci1mb2xkPiBMSUZFICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuXHRhY3RpdmF0ZSgpIHtcblx0XHR0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpO1xuXHRcdHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoXG5cdFx0XHRhdG9tLmNvbW1hbmRzLmFkZCgnYXRvbS13b3Jrc3BhY2UnLCB7XG5cdFx0XHRcdCdjdXN0b20tZm9sZHM6Zm9sZC10b3AtbGV2ZWwnOiBDdXN0b21Gb2xkcy5mb2xkVG9wTGV2ZWwsXG5cdFx0XHRcdCdjdXN0b20tZm9sZHM6Zm9sZC1hbGwnOiBDdXN0b21Gb2xkcy5mb2xkQWxsLFxuXHRcdFx0XHQnY3VzdG9tLWZvbGRzOnVuZm9sZC1hbGwnOiBDdXN0b21Gb2xkcy51bmZvbGRBbGwsXG5cdFx0XHRcdCdjdXN0b20tZm9sZHM6Zm9sZC1oZXJlJzogQ3VzdG9tRm9sZHMuZm9sZEhlcmUsXG5cdFx0XHRcdCdjdXN0b20tZm9sZHM6dW5mb2xkLWhlcmUnOiBDdXN0b21Gb2xkcy51bmZvbGRIZXJlLFxuXHRcdFx0XHQnY3VzdG9tLWZvbGRzOnRvZ2dsZS1mb2xkJzogQ3VzdG9tRm9sZHMudG9nZ2xlRm9sZFxuXHRcdFx0fSkpO1xuXG5cdFx0Zm9yIChsZXQgYz0wOyBjPFBSRUZJWF9DT1VOVDsgKytjKSB7XG5cdFx0XHRjb25zdCBwcmVmaXhQYXRoID0gYGN1c3RvbS1mb2xkcy5wcmVmaXhfJHtjfWA7XG5cdFx0XHRjb25zdCBwb3N0Zml4UGF0aCA9IGBjdXN0b20tZm9sZHMucG9zdGZpeF8ke2N9YDtcblx0XHRcdGNvbnN0IHByZWZpeCA9IGF0b20uY29uZmlnLmdldChwcmVmaXhQYXRoKTtcblx0XHRcdGNvbnN0IHBvc3RmaXggPSBhdG9tLmNvbmZpZy5nZXQocG9zdGZpeFBhdGgpO1xuXG5cdFx0XHRjb25zdCBpbmRleCA9IEN1c3RvbUZvbGRzLnByZWZpeGVzLmxlbmd0aDtcblx0XHRcdEN1c3RvbUZvbGRzLnByZWZpeGVzLnB1c2gocHJlZml4KTtcblx0XHRcdGF0b20uY29uZmlnLm9uRGlkQ2hhbmdlKHByZWZpeFBhdGgsIGNoYW5nZSA9PiB7XG5cdFx0XHRcdEN1c3RvbUZvbGRzLnByZWZpeGVzW2luZGV4XSA9IGNoYW5nZS5uZXdWYWx1ZTtcblx0XHRcdFx0Q3VzdG9tRm9sZHMuX3VwZGF0ZUhpZ2hsaWdodHNBY3Jvc3NFZGl0b3JzKCk7XG5cdFx0XHR9KTtcblxuXHRcdFx0Q3VzdG9tRm9sZHMucG9zdGZpeGVzLnB1c2gocG9zdGZpeCk7XG5cdFx0XHRhdG9tLmNvbmZpZy5vbkRpZENoYW5nZShwb3N0Zml4UGF0aCwgY2hhbmdlID0+IHtcblx0XHRcdFx0Q3VzdG9tRm9sZHMucG9zdGZpeGVzW2luZGV4XSA9IGNoYW5nZS5uZXdWYWx1ZTtcblx0XHRcdFx0Q3VzdG9tRm9sZHMuX3VwZGF0ZUhpZ2hsaWdodHNBY3Jvc3NFZGl0b3JzKCk7XG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHRmb3IgKGxldCBjPTA7IGM8UFJFRklYX0NPVU5UOyArK2MpIHtcblx0XHRcdGNvbnN0IHByZWZpeFBhdGggPSBgY3VzdG9tLWZvbGRzLnRleHRGaWxlUHJlZml4XyR7Y31gO1xuXHRcdFx0Y29uc3QgcG9zdGZpeFBhdGggPSBgY3VzdG9tLWZvbGRzLnRleHRGaWxlUG9zdGZpeF8ke2N9YDtcblx0XHRcdGNvbnN0IHByZWZpeCA9IGF0b20uY29uZmlnLmdldChwcmVmaXhQYXRoKTtcblx0XHRcdGNvbnN0IHBvc3RmaXggPSBhdG9tLmNvbmZpZy5nZXQocG9zdGZpeFBhdGgpO1xuXG5cdFx0XHRjb25zdCBpbmRleCA9IEN1c3RvbUZvbGRzLnRleHRGaWxlUHJlZml4ZXMubGVuZ3RoO1xuXHRcdFx0Q3VzdG9tRm9sZHMudGV4dEZpbGVQcmVmaXhlcy5wdXNoKHByZWZpeCk7XG5cdFx0XHRhdG9tLmNvbmZpZy5vbkRpZENoYW5nZShwcmVmaXhQYXRoLCBjaGFuZ2UgPT4ge1xuXHRcdFx0XHRDdXN0b21Gb2xkcy50ZXh0RmlsZVByZWZpeGVzW2luZGV4XSA9IGNoYW5nZS5uZXdWYWx1ZTtcblx0XHRcdFx0Q3VzdG9tRm9sZHMuX3VwZGF0ZUhpZ2hsaWdodHNBY3Jvc3NFZGl0b3JzKCk7XG5cdFx0XHR9KTtcblxuXHRcdFx0Q3VzdG9tRm9sZHMudGV4dEZpbGVQb3N0Zml4ZXMucHVzaChwb3N0Zml4KTtcblx0XHRcdGF0b20uY29uZmlnLm9uRGlkQ2hhbmdlKHBvc3RmaXhQYXRoLCBjaGFuZ2UgPT4ge1xuXHRcdFx0XHRDdXN0b21Gb2xkcy50ZXh0RmlsZVBvc3RmaXhlc1tpbmRleF0gPSBjaGFuZ2UubmV3VmFsdWU7XG5cdFx0XHRcdEN1c3RvbUZvbGRzLl91cGRhdGVIaWdobGlnaHRzQWNyb3NzRWRpdG9ycygpO1xuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0Q3VzdG9tRm9sZHMuYXJlUmVnaW9uc0ZvbGRlZE9uTG9hZCA9IGF0b20uY29uZmlnLmdldCgnY3VzdG9tLWZvbGRzLmFyZVJlZ2lvbnNGb2xkZWRPbkxvYWQnKTtcblx0XHRhdG9tLmNvbmZpZy5vbkRpZENoYW5nZSgnY3VzdG9tLWZvbGRzLmFyZVJlZ2lvbnNGb2xkZWRPbkxvYWQnLCBjaGFuZ2UgPT4ge1xuXHRcdFx0Q3VzdG9tRm9sZHMuYXJlUmVnaW9uc0ZvbGRlZE9uTG9hZCA9IGNoYW5nZS5uZXdWYWx1ZTtcblx0XHR9KTtcblxuXHRcdEN1c3RvbUZvbGRzLmFyZVJlZ2lvbnNIaWdobGlnaHRlZCA9IGF0b20uY29uZmlnLmdldCgnY3VzdG9tLWZvbGRzLmFyZVJlZ2lvbnNIaWdobGlnaHRlZCcpO1xuXHRcdGF0b20uY29uZmlnLm9uRGlkQ2hhbmdlKCdjdXN0b20tZm9sZHMuYXJlUmVnaW9uc0hpZ2hsaWdodGVkJywgY2hhbmdlID0+IHtcblx0XHRcdEN1c3RvbUZvbGRzLmFyZVJlZ2lvbnNIaWdobGlnaHRlZCA9IGNoYW5nZS5uZXdWYWx1ZTtcblx0XHRcdEN1c3RvbUZvbGRzLl91cGRhdGVIaWdobGlnaHRzQWNyb3NzRWRpdG9ycygpO1xuXHRcdH0pO1xuXG5cdFx0dGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLndvcmtzcGFjZS5vYnNlcnZlVGV4dEVkaXRvcnMoZWRpdG9yID0+IHtcblx0XHRcdEN1c3RvbUZvbGRzLmVkaXRvcnMucHVzaChlZGl0b3IpO1xuXHRcdFx0Q3VzdG9tRm9sZHMuZWRpdG9ySWRUb01hcmtlcnNbZWRpdG9yLmlkXSA9IFtdO1xuXG5cdFx0XHQvLyBEZWxheWluZyB0d28gYW5pbWF0aW9uIGZyYW1lcyBzZWVtcyB0byBmaXggdGhlIGlzc3VlIG9mIHRoZSBlbXB0eSBjb21tZW50IGNoYXJzLlxuXHRcdFx0Ly8gVGhpcyBpcyBhIHJlYWxseSBzdHVwaWQgZml4LiBXb3VsZCBwcmVmZXIgYW4gZXZlbnQgdG8gcHJvcGVybHkgc2lnbmFsIHRoaXMgYnV0IEkgY2FuJ3QgZmluZCBzdWNoIGFuIGV2ZW50IGluIHRoZSBhdG9tIGFwaS5cblx0XHRcdHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuXHRcdFx0XHR3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcblx0XHRcdFx0XHRDdXN0b21Gb2xkcy5fdXBkYXRlSGlnaGxpZ2h0cyhlZGl0b3IpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH0pO1xuXHRcdFx0Q3VzdG9tRm9sZHMuX2FkZENsaWNrRXZlbnQoZWRpdG9yKTtcblxuXHRcdFx0Ly8gSXQncyBlYXNpZXIganVzdCB0byBhbHdheXMgc3Vic2NyaWJlIHRvIHRoaXMuXG5cdFx0XHRlZGl0b3Iub25EaWRTdG9wQ2hhbmdpbmcoKCkgPT4gQ3VzdG9tRm9sZHMuX3VwZGF0ZUhpZ2hsaWdodHMoZWRpdG9yKSk7XG5cdFx0fSkpO1xuXG5cdFx0dGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLndvcmtzcGFjZS5vbkRpZEFkZFRleHRFZGl0b3IoZXZlbnQgPT4ge1xuXHRcdFx0XHRpZiAoQ3VzdG9tRm9sZHMuYXJlUmVnaW9uc0ZvbGRlZE9uTG9hZCkge1xuXHRcdFx0XHRcdGV2ZW50LnRleHRFZGl0b3IudG9rZW5pemVkQnVmZmVyLm9uRGlkVG9rZW5pemUoKCkgPT4ge1xuXHRcdFx0XHRcdFx0Q3VzdG9tRm9sZHMuZm9sZEFsbChldmVudC50ZXh0RWRpdG9yKTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXHRcdH0pKTtcblx0fSxcblxuXHRkZWFjdGl2YXRlKCkge1xuXHRcdHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKCk7XG5cdH0sXG5cdC8vIDwvZWRpdG9yLWZvbGQ+IGxpZmVcblxuXHQvLyA8ZWRpdG9yLWZvbGQ+IFJFU1BPTkRFUlMgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG5cdGZvbGRUb3BMZXZlbCgpIHtcblx0XHRjb25zdCBvcHRpb25zID0gQ3VzdG9tRm9sZHMuX2dldE9wdGlvbnMoKTtcblxuXHRcdGZvciAobGV0IGM9MCwgY0xlbj1vcHRpb25zLmVkaXRvci5nZXRMaW5lQ291bnQoKTsgYzxjTGVuOyArK2MpIHtcblx0XHRcdGNvbnN0IGxpbmUgPSBvcHRpb25zLmVkaXRvci5saW5lVGV4dEZvckJ1ZmZlclJvdyhjKS50cmltKCk7XG5cblx0XHRcdGlmICghb3B0aW9ucy5hcmVDb21tZW50c1JlcXVpcmVkIHx8IG9wdGlvbnMuZWRpdG9yLmlzQnVmZmVyUm93Q29tbWVudGVkKGMpKSB7XG5cdFx0XHRcdG9wdGlvbnMucHJlZml4ZXMuZm9yRWFjaCgocHJlZml4LCBpbmRleCkgPT4ge1xuXHRcdFx0XHRcdGNvbnN0IHBvc3RmaXggPSBvcHRpb25zLnBvc3RmaXhlc1tpbmRleF07XG5cdFx0XHRcdFx0aWYgKCFwcmVmaXggfHwgIXByZWZpeC5sZW5ndGggfHwgIXBvc3RmaXggfHwgIXBvc3RmaXgubGVuZ3RoKSB7IHJldHVybjsgfVxuXG5cdFx0XHRcdFx0aWYgKGxpbmUucmVwbGFjZShvcHRpb25zLmNvbW1lbnRDaGFycywnJykudHJpbSgpLnN0YXJ0c1dpdGgocHJlZml4KSkge1xuXHRcdFx0XHRcdFx0Y29uc3QgZW5kUm93ID0gQ3VzdG9tRm9sZHMuX3Jvd09mRW5kVGFnKG9wdGlvbnMsIGluZGV4LCBjKTtcblx0XHRcdFx0XHRcdGlmIChjIDwgZW5kUm93KSB7XG5cdFx0XHRcdFx0XHRcdEN1c3RvbUZvbGRzLl9mb2xkKG9wdGlvbnMuZWRpdG9yLCBjLCBlbmRSb3cpO1xuXHRcdFx0XHRcdFx0XHRjID0gZW5kUm93ICsgMTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH1cblx0fSxcblxuXHRmb2xkQWxsKGN1cnJlbnRFZGl0b3I9dW5kZWZpbmVkKSB7XG5cdFx0Ly8gV2hlbiBjYWxsZWQgZnJvbSBrZXlib2FyZCBiaW5kaW5nLCBzb21lIGFyZ3VtZW50cyBnZXQgc2VudCBpbi4gV2UncmUgb25seSBpbnRlcmVzdGVkIGlmIHRoZSBhcmd1bWVudCBpcyB0aGUgZWRpdG9yLlxuXHRcdGlmICghKGN1cnJlbnRFZGl0b3IgaW5zdGFuY2VvZiBUZXh0RWRpdG9yKSkge1xuXHRcdFx0Y3VycmVudEVkaXRvciA9IHVuZGVmaW5lZDtcblx0XHR9XG5cdFx0Y29uc3Qge2VkaXRvciwgY29tbWVudENoYXJzLCBhcmVDb21tZW50c1JlcXVpcmVkLCBwcmVmaXhlcywgcG9zdGZpeGVzfSA9IEN1c3RvbUZvbGRzLl9nZXRPcHRpb25zKGN1cnJlbnRFZGl0b3IpO1xuXG5cdFx0bGV0IHN0YXJ0UHJlZml4U3RhY2sgPSBbXTtcblx0XHRmb3IgKGxldCBjPTAsIGNMZW49ZWRpdG9yLmdldExpbmVDb3VudCgpOyBjPGNMZW47ICsrYykge1xuXHRcdFx0Y29uc3QgbGluZSA9IGVkaXRvci5saW5lVGV4dEZvckJ1ZmZlclJvdyhjKS50cmltKCk7XG5cdFx0XHRpZiAoIWFyZUNvbW1lbnRzUmVxdWlyZWQgfHwgZWRpdG9yLmlzQnVmZmVyUm93Q29tbWVudGVkKGMpKSB7XG5cdFx0XHRcdHByZWZpeGVzLmZvckVhY2goKHByZWZpeCwgaW5kZXgpID0+IHtcblx0XHRcdFx0XHRjb25zdCBwb3N0Zml4ID0gcG9zdGZpeGVzW2luZGV4XTtcblx0XHRcdFx0XHRpZiAoIXByZWZpeCB8fCAhcHJlZml4Lmxlbmd0aCB8fCAhcG9zdGZpeCB8fCAhcG9zdGZpeC5sZW5ndGgpIHsgcmV0dXJuOyB9XG5cblx0XHRcdFx0XHRjb25zdCB0cmltbWVkTGluZSA9IGxpbmUucmVwbGFjZShjb21tZW50Q2hhcnMsJycpLnRyaW0oKTtcblx0XHRcdFx0XHRpZiAodHJpbW1lZExpbmUuc3RhcnRzV2l0aChwcmVmaXgpKSB7XG5cdFx0XHRcdFx0XHRzdGFydFByZWZpeFN0YWNrLnB1c2goYyk7XG5cdFx0XHRcdFx0fSBlbHNlIGlmICh0cmltbWVkTGluZS5zdGFydHNXaXRoKHBvc3RmaXgpKSB7XG5cdFx0XHRcdFx0XHRpZiAoc3RhcnRQcmVmaXhTdGFjay5sZW5ndGgpIHtcblx0XHRcdFx0XHRcdFx0Y29uc3Qgc3RhcnRSb3cgPSBzdGFydFByZWZpeFN0YWNrLnBvcCgpO1xuXHRcdFx0XHRcdFx0XHRDdXN0b21Gb2xkcy5fZm9sZChlZGl0b3IsIHN0YXJ0Um93LCBjKTtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdGF0b20ubm90aWZpY2F0aW9ucy5hZGRXYXJuaW5nKGBFeHRyYSBjbG9zaW5nIGZvbGQgdGFnIGZvdW5kIGF0IGxpbmUgJHtjICsgMX0uYCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAoc3RhcnRQcmVmaXhTdGFjay5sZW5ndGgpIHtcblx0XHRcdGF0b20ubm90aWZpY2F0aW9ucy5hZGRXYXJuaW5nKGBFeHRyYSBvcGVuaW5nIGZvbGQgdGFnIGZvdW5kIGF0IGxpbmUgJHtzdGFydFByZWZpeFN0YWNrLnBvcCgpICsgMX0uYCk7XG5cdFx0fVxuXHR9LFxuXG5cdHVuZm9sZEFsbCgpIHtcblx0XHRjb25zdCB7ZWRpdG9yLCBjb21tZW50Q2hhcnMsIGFyZUNvbW1lbnRzUmVxdWlyZWQsIHByZWZpeGVzfSA9IEN1c3RvbUZvbGRzLl9nZXRPcHRpb25zKCk7XG5cblx0XHRmb3IgKGxldCBjPTAsIGNMZW49ZWRpdG9yLmdldExpbmVDb3VudCgpOyBjPGNMZW47ICsrYykge1xuXHRcdFx0Y29uc3QgbGluZSA9IGVkaXRvci5saW5lVGV4dEZvckJ1ZmZlclJvdyhjKS50cmltKCk7XG5cblx0XHRcdGlmICghYXJlQ29tbWVudHNSZXF1aXJlZCB8fCBlZGl0b3IuaXNCdWZmZXJSb3dDb21tZW50ZWQoYykpIHtcblx0XHRcdFx0cHJlZml4ZXMuZm9yRWFjaChwcmVmaXggPT4ge1xuXHRcdFx0XHRcdGlmICghcHJlZml4IHx8ICFwcmVmaXgubGVuZ3RoKSB7IHJldHVybjsgfVxuXG5cdFx0XHRcdFx0aWYgKGxpbmUucmVwbGFjZShjb21tZW50Q2hhcnMsJycpLnRyaW0oKS5zdGFydHNXaXRoKHByZWZpeCkpIHtcblx0XHRcdFx0XHRcdGVkaXRvci51bmZvbGRCdWZmZXJSb3coYyk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9XG5cdH0sXG5cblx0Ly8gVE9ETzogZG8gdGhpcyBmb3IgZWFjaCBjdXJzb3Jcblx0Zm9sZEhlcmUoKSB7XG5cdFx0Y29uc3Qgb3B0aW9ucyA9IEN1c3RvbUZvbGRzLl9nZXRPcHRpb25zKCk7XG5cblx0XHRjb25zdCByb3cgPSBDdXN0b21Gb2xkcy5fcm93T2ZTdGFydFRhZyhvcHRpb25zLCBvcHRpb25zLmVkaXRvci5nZXRDdXJzb3JCdWZmZXJQb3NpdGlvbigpLnJvdyk7XG5cdFx0aWYgKHJvdyA+PSAwKSB7XG5cdFx0XHRDdXN0b21Gb2xkcy5mb2xkUm93KHJvdywgb3B0aW9ucyk7XG5cdFx0fVxuXHR9LFxuXG5cdGZvbGRSb3cocm93LCBvcHRpb25zPXVuZGVmaW5lZCkge1xuXHRcdGxldCByZXN1bHQgPSBmYWxzZTtcblxuXHRcdG9wdGlvbnMgPSBvcHRpb25zIHx8IEN1c3RvbUZvbGRzLl9nZXRPcHRpb25zKCk7XG5cblx0XHRyb3cgPSArcm93OyAgLy8gRW5zdXJlIHJvdyBpcyBhIG51bWJlclxuXHRcdGNvbnN0IGxpbmUgPSBvcHRpb25zLmVkaXRvci5saW5lVGV4dEZvckJ1ZmZlclJvdyhyb3cpLnRyaW0oKTtcblx0XHRpZiAoIW9wdGlvbnMuYXJlQ29tbWVudHNSZXF1aXJlZCB8fCBvcHRpb25zLmVkaXRvci5pc0J1ZmZlclJvd0NvbW1lbnRlZChyb3cpKSB7XG5cdFx0XHRmb3IgKGxldCBjPTAsIGNMZW49b3B0aW9ucy5wcmVmaXhlcy5sZW5ndGg7IGM8Y0xlbjsgKytjKSB7XG5cdFx0XHRcdGNvbnN0IHByZWZpeCA9IG9wdGlvbnMucHJlZml4ZXNbY107XG5cdFx0XHRcdGNvbnN0IHBvc3RmaXggPSBvcHRpb25zLnBvc3RmaXhlc1tjXTtcblx0XHRcdFx0aWYgKCFwcmVmaXggfHwgIXByZWZpeC5sZW5ndGggfHwgIXBvc3RmaXggfHwgIXBvc3RmaXgubGVuZ3RoKSB7IGNvbnRpbnVlOyB9XG5cblx0XHRcdFx0aWYgKGxpbmUucmVwbGFjZShvcHRpb25zLmNvbW1lbnRDaGFycywnJykudHJpbSgpLnN0YXJ0c1dpdGgocHJlZml4KSkge1xuXHRcdFx0XHRcdGNvbnN0IGVuZFJvdyA9IEN1c3RvbUZvbGRzLl9yb3dPZkVuZFRhZyhvcHRpb25zLCBjLCByb3cpO1xuXHRcdFx0XHRcdGlmIChyb3cgPCBlbmRSb3cpIHtcblx0XHRcdFx0XHRcdEN1c3RvbUZvbGRzLl9mb2xkKG9wdGlvbnMuZWRpdG9yLCByb3csIGVuZFJvdyk7XG5cdFx0XHRcdFx0XHRyZXN1bHQgPSB0cnVlO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHJlc3VsdDtcblx0fSxcblxuXHR1bmZvbGRIZXJlKCkge1xuXHRcdGNvbnN0IHtlZGl0b3J9ID0gQ3VzdG9tRm9sZHMuX2dldE9wdGlvbnMoKTtcblx0XHRlZGl0b3IudW5mb2xkQnVmZmVyUm93KGVkaXRvci5nZXRDdXJzb3JCdWZmZXJQb3NpdGlvbigpLnJvdyk7XG5cdFx0Ly8gZWRpdG9yLnVuZm9sZEN1cnJlbnRSb3coKTsgIC8vIHRoaXMgZG9lcyBub3Qgc2VlbSB0byBwcmVzZXJ2ZSBpbnRlcm5hbCBmb2xkaW5nXG5cdH0sXG5cblx0dG9nZ2xlRm9sZCgpIHtcblx0XHRjb25zdCBvcHRpb25zID0gQ3VzdG9tRm9sZHMuX2dldE9wdGlvbnMoKTtcblx0XHRjb25zdCByb3cgPSBvcHRpb25zLmVkaXRvci5nZXRDdXJzb3JCdWZmZXJQb3NpdGlvbigpLnJvdztcblxuXHRcdGlmIChvcHRpb25zLmVkaXRvci5pc0ZvbGRlZEF0QnVmZmVyUm93KHJvdykpIHtcblx0XHRcdEN1c3RvbUZvbGRzLnVuZm9sZEhlcmUoKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Q3VzdG9tRm9sZHMuZm9sZEhlcmUob3B0aW9ucyk7XG5cdFx0fVxuXHR9LFxuXHQvLyA8L2VkaXRvci1mb2xkPiByZXNwb25kZXJzXG5cblx0Ly8gPGVkaXRvci1mb2xkPiBIRUxQRVJTICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuXHRfZm9sZChlZGl0b3IsIHN0YXJ0Um93LCBlbmRSb3cpIHtcblx0XHRlZGl0b3Iuc2V0U2VsZWN0ZWRCdWZmZXJSYW5nZShuZXcgUmFuZ2UobmV3IFBvaW50KHN0YXJ0Um93LCA1MTIpLCBuZXcgUG9pbnQoZW5kUm93LCA1MTIpKSk7XG5cdFx0ZWRpdG9yLmZvbGRTZWxlY3RlZExpbmVzKCk7XG5cdH0sXG5cblx0Ly8gRmV0Y2ggdGhlIGN1cnJlbnQgZWRpdG9yLCBhcHBsaWNhYmxlIHByZWZpeCBhbmQgcG9zdGZpeCBhcnJheXMsIGFzIHdlbGwgYXMgdGhlIGNvbW1lbnRDaGFyc1xuXHRfZ2V0T3B0aW9ucyhlZGl0b3I9dW5kZWZpbmVkKSB7XG5cdFx0ZWRpdG9yID0gZWRpdG9yIHx8IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKTtcblx0XHRjb25zdCBjb21tZW50Q2hhcnMgPSBlZGl0b3IgPyAoYXRvbS5jb25maWcuZ2V0KCdlZGl0b3IuY29tbWVudFN0YXJ0Jywge3Njb3BlOiBlZGl0b3IuZ2V0Um9vdFNjb3BlRGVzY3JpcHRvcigpfSkgfHwgJycpLnRyaW0oKSA6ICcnO1xuXHRcdGNvbnN0IGFyZUNvbW1lbnRzUmVxdWlyZWQgPSBjb21tZW50Q2hhcnMgIT09ICcnO1xuXHRcdGNvbnN0IHByZWZpeGVzID0gYXJlQ29tbWVudHNSZXF1aXJlZCA/IEN1c3RvbUZvbGRzLnByZWZpeGVzIDogQ3VzdG9tRm9sZHMudGV4dEZpbGVQcmVmaXhlcztcblx0XHRjb25zdCBwb3N0Zml4ZXMgPSBhcmVDb21tZW50c1JlcXVpcmVkID8gQ3VzdG9tRm9sZHMucG9zdGZpeGVzIDogQ3VzdG9tRm9sZHMudGV4dEZpbGVQb3N0Zml4ZXM7XG5cblx0XHRyZXR1cm4ge2VkaXRvciwgY29tbWVudENoYXJzLCBhcmVDb21tZW50c1JlcXVpcmVkLCBwcmVmaXhlcywgcG9zdGZpeGVzfTtcblx0fSxcblxuXHQvLyB0YWtlcyBuZXN0aW5nIGludG8gYWNjb3VudFxuXHRfcm93T2ZTdGFydFRhZyhvcHRpb25zLCBzdGFydFJvdykge1xuXHRcdGxldCByZXN1bHQgPSAtMTtcblxuXHRcdGxldCBlbmRUYWdDb3VudCA9IDE7XG5cdFx0Zm9yIChsZXQgYz1zdGFydFJvdzsgYz49MCAmJiBlbmRUYWdDb3VudD4wOyAtLWMpIHtcblx0XHRcdGNvbnN0IGxpbmUgPSBvcHRpb25zLmVkaXRvci5saW5lVGV4dEZvckJ1ZmZlclJvdyhjKS50cmltKCk7XG5cdFx0XHRpZiAoIW9wdGlvbnMuYXJlQ29tbWVudHNSZXF1aXJlZCB8fCBvcHRpb25zLmVkaXRvci5pc0J1ZmZlclJvd0NvbW1lbnRlZChjKSkge1xuXHRcdFx0XHRmb3IgKGxldCBkPTAsIGRMZW49b3B0aW9ucy5wcmVmaXhlcy5sZW5ndGg7IGQ8ZExlbjsgKytkKSB7XG5cdFx0XHRcdFx0Y29uc3QgcHJlZml4ID0gb3B0aW9ucy5wcmVmaXhlc1tkXTtcblx0XHRcdFx0XHRjb25zdCBwb3N0Zml4ID0gb3B0aW9ucy5wb3N0Zml4ZXNbZF07XG5cdFx0XHRcdFx0aWYgKCFwcmVmaXggfHwgIXByZWZpeC5sZW5ndGggfHwgIXBvc3RmaXggfHwgIXBvc3RmaXgubGVuZ3RoKSB7IGNvbnRpbnVlOyB9XG5cblx0XHRcdFx0XHRpZiAobGluZS5yZXBsYWNlKG9wdGlvbnMuY29tbWVudENoYXJzLCcnKS50cmltKCkuc3RhcnRzV2l0aChwb3N0Zml4KSkge1xuXHRcdFx0XHRcdFx0Ly8gRG9uJ3QgY291bnQgdGhlIGVuZGluZyB0YWcgaWYgdGhlIHVzZXIgc3RhcnRlZCB0aGUgYWN0aW9uIHdoaWxlIG9uIGFuIGVuZGluZyB0YWcuXG5cdFx0XHRcdFx0XHRpZiAoYyAhPT0gc3RhcnRSb3cpIHtcblx0XHRcdFx0XHRcdFx0KytlbmRUYWdDb3VudDtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAobGluZS5yZXBsYWNlKG9wdGlvbnMuY29tbWVudENoYXJzLCcnKS50cmltKCkuc3RhcnRzV2l0aChwcmVmaXgpKSB7XG5cdFx0XHRcdFx0XHQtLWVuZFRhZ0NvdW50O1xuXHRcdFx0XHRcdFx0aWYgKCFlbmRUYWdDb3VudCkge1xuXHRcdFx0XHRcdFx0XHRyZXN1bHQgPSBjO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHJlc3VsdDtcblx0fSxcblxuXHQvLyB0YWtlcyBuZXN0aW5nIGludG8gYWNjb3VudFxuXHRfcm93T2ZFbmRUYWcob3B0aW9ucywgcGFpckluZGV4LCBzdGFydFJvdykge1xuXHRcdGxldCByZXN1bHQgPSAtMTtcblxuXHRcdGNvbnN0IHByZWZpeCA9IG9wdGlvbnMucHJlZml4ZXNbcGFpckluZGV4XTtcblx0XHRjb25zdCBwb3N0Zml4ID0gb3B0aW9ucy5wb3N0Zml4ZXNbcGFpckluZGV4XTtcblxuXHRcdGxldCBzdGFydFRhZ0NvdW50ID0gMTtcblx0XHRsZXQgYyA9IHN0YXJ0Um93ICsgMTtcblx0XHRjb25zdCBjTGVuID0gb3B0aW9ucy5lZGl0b3IuZ2V0TGluZUNvdW50KCk7XG5cdFx0Zm9yICg7IGM8Y0xlbjsgKytjKSB7XG5cdFx0XHRjb25zdCBsaW5lID0gb3B0aW9ucy5lZGl0b3IubGluZVRleHRGb3JCdWZmZXJSb3coYykudHJpbSgpO1xuXHRcdFx0aWYgKCFvcHRpb25zLmFyZUNvbW1lbnRzUmVxdWlyZWQgfHwgb3B0aW9ucy5lZGl0b3IuaXNCdWZmZXJSb3dDb21tZW50ZWQoYykpIHtcblx0XHRcdFx0aWYgKGxpbmUucmVwbGFjZShvcHRpb25zLmNvbW1lbnRDaGFycywnJykudHJpbSgpLnN0YXJ0c1dpdGgocHJlZml4KSkge1xuXHRcdFx0XHRcdCsrc3RhcnRUYWdDb3VudDtcblx0XHRcdFx0fSBlbHNlIGlmIChsaW5lLnJlcGxhY2Uob3B0aW9ucy5jb21tZW50Q2hhcnMsJycpLnRyaW0oKS5zdGFydHNXaXRoKHBvc3RmaXgpKSB7XG5cdFx0XHRcdFx0aWYgKC0tc3RhcnRUYWdDb3VudCA9PT0gMCkge1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKGMgPT09IGNMZW4pIHtcblx0XHRcdGF0b20ubm90aWZpY2F0aW9ucy5hZGRXYXJuaW5nKGBObyBlbmQgbWFya2VyIGZvdW5kIGZvciBmb2xkaW5nIHRhZyB0aGF0IHN0YXJ0cyBvbiBsaW5lICR7c3RhcnRSb3cgKyAxfS5gKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmVzdWx0ID0gYztcblx0XHR9XG5cblx0XHRyZXR1cm4gcmVzdWx0O1xuXHR9LFxuXG5cdF91cGRhdGVIaWdobGlnaHRzKGVkaXRvcikge1xuXHRcdGlmICghZWRpdG9yLmlzQWxpdmUoKSkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGxldCBtYXJrZXJzID0gQ3VzdG9tRm9sZHMuZWRpdG9ySWRUb01hcmtlcnNbZWRpdG9yLmlkXTtcblx0XHRtYXJrZXJzLmZvckVhY2gobSA9PiBtLmRlc3Ryb3koKSk7XG5cblx0XHRjb25zdCB7Y29tbWVudENoYXJzLCBhcmVDb21tZW50c1JlcXVpcmVkLCBwcmVmaXhlcywgcG9zdGZpeGVzfSA9IEN1c3RvbUZvbGRzLl9nZXRPcHRpb25zKGVkaXRvcik7XG5cdFx0Ly8gYXRvbS5ub3RpZmljYXRpb25zLmFkZFdhcm5pbmcoYENvbW1tZW50Q2hhcnM6IFwiJHtjb21tZW50Q2hhcnN9XCIuYCk7XG5cblx0XHRmb3IgKGxldCBjPTAsIGNMZW49ZWRpdG9yLmdldExpbmVDb3VudCgpOyBjPGNMZW47ICsrYykge1xuXHRcdFx0Y29uc3QgbGluZSA9IGVkaXRvci5saW5lVGV4dEZvckJ1ZmZlclJvdyhjKS50cmltKCk7XG5cblx0XHRcdHByZWZpeGVzLmZvckVhY2goKHByZWZpeCwgaW5kZXgpID0+IHtcblx0XHRcdFx0Y29uc3QgcG9zdGZpeCA9IHBvc3RmaXhlc1tpbmRleF07XG5cdFx0XHRcdGlmICghcHJlZml4IHx8ICFwcmVmaXgubGVuZ3RoIHx8ICFwb3N0Zml4IHx8ICFwb3N0Zml4Lmxlbmd0aCkgeyByZXR1cm47IH1cblxuXHRcdFx0XHRsZXQgY2xzO1xuXHRcdFx0XHRpZiAobGluZS5yZXBsYWNlKGNvbW1lbnRDaGFycywnJykudHJpbSgpLnN0YXJ0c1dpdGgocHJlZml4KSkge1xuXHRcdFx0XHRcdGNscyA9ICdjdXN0b20tZm9sZHMtc3RhcnQnO1xuXHRcdFx0XHR9IGVsc2UgaWYgKGxpbmUucmVwbGFjZShjb21tZW50Q2hhcnMsJycpLnRyaW0oKS5zdGFydHNXaXRoKHBvc3RmaXgpKSB7XG5cdFx0XHRcdFx0Y2xzID0gJ2N1c3RvbS1mb2xkcy1zdG9wJztcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmIChjbHMpIHtcblx0XHRcdFx0XHRsZXQgcmFuZ2UgPSBbW2MsMF0sW2MsMF1dO1xuXHRcdFx0XHRcdGxldCBtYXJrZXIgPSBlZGl0b3IubWFya0J1ZmZlclJhbmdlKHJhbmdlKTtcblx0XHRcdFx0XHRtYXJrZXJzLnB1c2gobWFya2VyKTtcblx0XHRcdFx0XHRlZGl0b3IuZGVjb3JhdGVNYXJrZXIobWFya2VyLCB7dHlwZTogJ2xpbmUnLCBjbGFzczogY2xzfSk7XG5cdFx0XHRcdFx0aWYgKGNscyA9PT0gJ2N1c3RvbS1mb2xkcy1zdGFydCcpIHtcblx0XHRcdFx0XHRcdGVkaXRvci5kZWNvcmF0ZU1hcmtlcihtYXJrZXIsIHt0eXBlOiAnbGluZS1udW1iZXInLCBjbGFzczogY2xzfSk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKCFDdXN0b21Gb2xkcy5hcmVSZWdpb25zSGlnaGxpZ2h0ZWQpIHtcblx0XHRcdFx0XHRcdGVkaXRvci5kZWNvcmF0ZU1hcmtlcihtYXJrZXIsIHt0eXBlOiAnbGluZScsIGNsYXNzOiAnbm8taGlnaGxpZ2h0J30pO1xuXHRcdFx0XHRcdFx0aWYgKGNscyA9PT0gJ2N1c3RvbS1mb2xkcy1zdGFydCcpIHtcblx0XHRcdFx0XHRcdFx0ZWRpdG9yLmRlY29yYXRlTWFya2VyKG1hcmtlciwge3R5cGU6ICdsaW5lLW51bWJlcicsIGNsYXNzOiAnbm8taGlnaGxpZ2h0J30pO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fVxuXHR9LFxuXG5cdF91cGRhdGVIaWdobGlnaHRzQWNyb3NzRWRpdG9ycygpIHtcblx0XHRDdXN0b21Gb2xkcy5lZGl0b3JzLmZvckVhY2goQ3VzdG9tRm9sZHMuX3VwZGF0ZUhpZ2hsaWdodHMpO1xuXHR9LFxuXG5cdF9hZGRDbGlja0V2ZW50KGVkaXRvcikge1xuXHRcdGNvbnN0IGVkaXRvclZpZXcgPSBhdG9tLnZpZXdzLmdldFZpZXcoZWRpdG9yKTtcblx0XHRjb25zdCBndXR0ZXIgPSBlZGl0b3JWaWV3LnF1ZXJ5U2VsZWN0b3IoJy5ndXR0ZXInKTtcblx0XHQkKGd1dHRlcikub24oJ2NsaWNrJywgJy5saW5lLW51bWJlci5jdXN0b20tZm9sZHMtc3RhcnQ6bm90KC5mb2xkZWQpIC5pY29uLXJpZ2h0JywgZnVuY3Rpb24oZXZlbnQpIHtcblx0XHRcdGNvbnN0IHJvdyA9IGV2ZW50LnRhcmdldC5wYXJlbnRFbGVtZW50LmRhdGFzZXQuYnVmZmVyUm93O1xuXHRcdFx0Q3VzdG9tRm9sZHMuZm9sZFJvdyhyb3cpO1xuXHRcdH0pO1xuXHR9XG5cdC8vIDwvZWRpdG9yLWZvbGQ+IGhlbHBlcnNcbn07XG5cblxuXG4vLyBGb3IgdGVzdGluZ+KAplxuXG4vLyA8ZWRpdG9yLWZvbGQgZGVzYz0nMSc+XG4vLyA8ZWRpdG9yLWZvbGQgZGVzYz0nMic+XG4vLyA8ZWRpdG9yLWZvbGQgZGVzYz0nMyc+XG4vLyA8L2VkaXRvci1mb2xkPlxuLy8gPC9lZGl0b3ItZm9sZD5cbi8vIDwvZWRpdG9yLWZvbGQ+XG4iXX0=