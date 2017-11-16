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
				event.textEditor.displayBuffer.tokenizedBuffer.onDidTokenize(function () {
					CustomFolds.foldAll();
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
		var _CustomFolds$_getOptions = CustomFolds._getOptions();

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2JpbGx5Ly5hdG9tL3BhY2thZ2VzL2N1c3RvbS1mb2xkcy9saWIvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Im9CQUU0RCxNQUFNOztpQ0FDbEQsc0JBQXNCOztBQUh0QyxXQUFXLENBQUM7O0FBS1osSUFBTSxZQUFZLEdBQUcsQ0FBQyxDQUFDOzs7O0FBSXZCLElBQUksV0FBVyxHQUNmLE1BQU0sQ0FBQyxPQUFPLEdBQUc7QUFDaEIsY0FBYSxFQUFFLElBQUk7O0FBRW5CLE9BQU0sRUFBRTtBQUNQLFVBQVEsRUFBRTtBQUNULFFBQUssRUFBRSx5Q0FBeUM7QUFDaEQsY0FBVyxFQUFFLHVKQUF1SjtBQUNwSyxPQUFJLEVBQUUsUUFBUTtBQUNkLGNBQVMsY0FBYztBQUN2QixRQUFLLEVBQUUsQ0FBQztHQUNSO0FBQ0QsV0FBUyxFQUFFO0FBQ1YsUUFBSyxFQUFFLG1DQUFtQztBQUMxQyxjQUFXLEVBQUUscUpBQXFKO0FBQ2xLLE9BQUksRUFBRSxRQUFRO0FBQ2QsY0FBUyxnQkFBZ0I7QUFDekIsUUFBSyxFQUFFLENBQUM7R0FDUjtBQUNELFVBQVEsRUFBRTtBQUNULFFBQUssRUFBRSwwQ0FBMEM7QUFDakQsY0FBVyxFQUFFLHVKQUF1SjtBQUNwSyxPQUFJLEVBQUUsUUFBUTtBQUNkLGNBQVMsU0FBUztBQUNsQixRQUFLLEVBQUUsQ0FBQztHQUNSO0FBQ0QsV0FBUyxFQUFFO0FBQ1YsUUFBSyxFQUFFLG9DQUFvQztBQUMzQyxjQUFXLEVBQUUscUpBQXFKO0FBQ2xLLE9BQUksRUFBRSxRQUFRO0FBQ2QsY0FBUyxZQUFZO0FBQ3JCLFFBQUssRUFBRSxDQUFDO0dBQ1I7QUFDRCxVQUFRLEVBQUU7QUFDVCxRQUFLLEVBQUUseUNBQXlDO0FBQ2hELGNBQVcsRUFBRSx1SkFBdUo7QUFDcEssT0FBSSxFQUFFLFFBQVE7QUFDZCxjQUFTLEVBQUU7QUFDWCxRQUFLLEVBQUUsQ0FBQztHQUNSO0FBQ0QsV0FBUyxFQUFFO0FBQ1YsUUFBSyxFQUFF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Z2VzL2N1c3RvbS1mb2xkcy9saWIvaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuaW1wb3J0IHtDb21wb3NpdGVEaXNwb3NhYmxlLCBQb2ludCwgUmFuZ2UsIFRleHRFZGl0b3J9IGZyb20gJ2F0b20nO1xuaW1wb3J0IHskfSBmcm9tICdhdG9tLXNwYWNlLXBlbi12aWV3cyc7XG5cbmNvbnN0IFBSRUZJWF9DT1VOVCA9IDM7XG5cbi8vIG9wdGlvbiB0byBhdXRvIGZvbGQgb24gZmlsZSBvcGVuXG4vLyBjbGlja2FibGUgcmVnaW9uIGhlYWRlcnMsIHBlcmhhcHMgdXNpbmcgYmxvY2sgY29udGVudD9cbnZhciBDdXN0b21Gb2xkcyA9XG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0c3Vic2NyaXB0aW9uczogbnVsbCxcblxuXHRjb25maWc6IHtcblx0XHRwcmVmaXhfMDoge1xuXHRcdFx0dGl0bGU6ICdCZWdpbm5pbmcgb2YgZmlyc3QgZm9sZGFibGUgcmVnaW9uIHBhaXInLFxuXHRcdFx0ZGVzY3JpcHRpb246ICdUaGUgY29tbWVudCB0aGF0IG1hcmtzIHRoZSBzdGFydCBvZiB0aGUgZm9sZGFibGUgcmVnaW9uIG11c3QgYmVnaW4gd2l0aCB0aGlzIHN0cmluZyBsaXRlcmFsIChub3QgY291bnRpbmcgbGVhZGluZyB3aGl0ZSBzcGFjZSBvciBjb21tZW50IGNoYXJhY3RlcnMpLicsXG5cdFx0XHR0eXBlOiAnc3RyaW5nJyxcblx0XHRcdGRlZmF1bHQ6ICc8ZWRpdG9yLWZvbGQnLFxuXHRcdFx0b3JkZXI6IDFcblx0XHR9LFxuXHRcdHBvc3RmaXhfMDoge1xuXHRcdFx0dGl0bGU6ICdFbmQgb2YgZmlyc3QgZm9sZGFibGUgcmVnaW9uIHBhaXInLFxuXHRcdFx0ZGVzY3JpcHRpb246ICdUaGUgY29tbWVudCB0aGF0IG1hcmtzIHRoZSBlbmQgb2YgdGhlIGZvbGRhYmxlIHJlZ2lvbiBtdXN0IGJlZ2luIHdpdGggdGhpcyBzdHJpbmcgbGl0ZXJhbCAobm90IGNvdW50aW5nIGxlYWRpbmcgd2hpdGUgc3BhY2Ugb3IgY29tbWVudCBjaGFyYWN0ZXJzKS4nLFxuXHRcdFx0dHlwZTogJ3N0cmluZycsXG5cdFx0XHRkZWZhdWx0OiAnPC9lZGl0b3ItZm9sZD4nLFxuXHRcdFx0b3JkZXI6IDJcblx0XHR9LFxuXHRcdHByZWZpeF8xOiB7XG5cdFx0XHR0aXRsZTogJ0JlZ2lubmluZyBvZiBzZWNvbmQgZm9sZGFibGUgcmVnaW9uIHBhaXInLFxuXHRcdFx0ZGVzY3JpcHRpb246ICdUaGUgY29tbWVudCB0aGF0IG1hcmtzIHRoZSBzdGFydCBvZiB0aGUgZm9sZGFibGUgcmVnaW9uIG11c3QgYmVnaW4gd2l0aCB0aGlzIHN0cmluZyBsaXRlcmFsIChub3QgY291bnRpbmcgbGVhZGluZyB3aGl0ZSBzcGFjZSBvciBjb21tZW50IGNoYXJhY3RlcnMpLicsXG5cdFx0XHR0eXBlOiAnc3RyaW5nJyxcblx0XHRcdGRlZmF1bHQ6ICcjcmVnaW9uJyxcblx0XHRcdG9yZGVyOiAzXG5cdFx0fSxcblx0XHRwb3N0Zml4XzE6IHtcblx0XHRcdHRpdGxlOiAnRW5kIG9mIHNlY29uZCBmb2xkYWJsZSByZWdpb24gcGFpcicsXG5cdFx0XHRkZXNjcmlwdGlvbjogJ1RoZSBjb21tZW50IHRoYXQgbWFya3MgdGhlIGVuZCBvZiB0aGUgZm9sZGFibGUgcmVnaW9uIG11c3QgYmVnaW4gd2l0aCB0aGlzIHN0cmluZyBsaXRlcmFsIChub3QgY291bnRpbmcgbGVhZGluZyB3aGl0ZSBzcGFjZSBvciBjb21tZW50IGNoYXJhY3RlcnMpLicsXG5cdFx0XHR0eXBlOiAnc3RyaW5nJyxcblx0XHRcdGRlZmF1bHQ6ICcjZW5kcmVnaW9uJyxcblx0XHRcdG9yZGVyOiA0XG5cdFx0fSxcblx0XHRwcmVmaXhfMjoge1xuXHRcdFx0dGl0bGU6ICdCZWdpbm5pbmcgb2YgdGhpcmQgZm9sZGFibGUgcmVnaW9uIHBhaXInLFxuXHRcdFx0ZGVzY3JpcHRpb246ICdUaGUgY29tbWVudCB0aGF0IG1hcmtzIHRoZSBzdGFydCBvZiB0aGUgZm9sZGFibGUgcmVnaW9uIG11c3QgYmVnaW4gd2l0aCB0aGlzIHN0cmluZyBsaXRlcmFsIChub3QgY291bnRpbmcgbGVhZGluZyB3aGl0ZSBzcGFjZSBvciBjb21tZW50IGNoYXJhY3RlcnMpLicsXG5cdFx0XHR0eXBlOiAnc3RyaW5nJyxcblx0XHRcdGRlZmF1bHQ6ICcnLFxuXHRcdFx0b3JkZXI6IDVcblx0XHR9LFxuXHRcdHBvc3RmaXhfMjoge1xuXHRcdFx0dGl0bGU6ICdFbmQgb2YgdGhpcmQgZm9sZGFibGUgcmVnaW9uIHBhaXInLFxuXHRcdFx0ZGVzY3JpcHRpb246ICdUaGUgY29tbWVudCB0aGF0IG1hcmtzIHRoZSBlbmQgb2YgdGhlIGZvbGRhYmxlIHJlZ2lvbiBtdXN0IGJlZ2luIHdpdGggdGhpcyBzdHJpbmcgbGl0ZXJhbCAobm90IGNvdW50aW5nIGxlYWRpbmcgd2hpdGUgc3BhY2Ugb3IgY29tbWVudCBjaGFyYWN0ZXJzKS4nLFxuXHRcdFx0dHlwZTogJ3N0cmluZycsXG5cdFx0XHRkZWZhdWx0OiAnJyxcblx0XHRcdG9yZGVyOiA2XG5cdFx0fSxcblx0XHRhcmVSZWdpb25zRm9sZGVkT25Mb2FkOiB7XG5cdFx0XHR0aXRsZTogJ0F1dG8gZm9sZCBvbiBmaWxlIG9wZW4/Jyxcblx0XHRcdGRlc2NyaXB0aW9uOiAnSWYgY2hlY2tlZCwgcmVnaW9ucyBzdGFydCBpbiB0aGVpciBmb2xkZWQgc3RhdGUgd2hlbiBhIGZpbGUgaXMgb3BlbmVkLicsXG5cdFx0XHR0eXBlOiAnYm9vbGVhbicsXG5cdFx0XHRkZWZhdWx0OiBmYWxzZSxcblx0XHRcdG9yZGVyOiA3XG5cdFx0fSxcblx0XHRhcmVSZWdpb25zSGlnaGxpZ2h0ZWQ6IHtcblx0XHRcdHRpdGxlOiAnRW5hYmxlIHJlZ2lvbiBoaWdobGlnaHRpbmc/Jyxcblx0XHRcdGRlc2NyaXB0aW9uOiAnSWYgY2hlY2tlZCwgdGhlIGJlZ2lubmluZyBhbmQgZW5kIG9mIGZvbGRhYmxlIHJlZ2lvbnMgYXJlIGhpZ2hsaWdodGVkLicsXG5cdFx0XHR0eXBlOiAnYm9vbGVhbicsXG5cdFx0XHRkZWZhdWx0OiB0cnVlLFxuXHRcdFx0b3JkZXI6IDhcblx0XHR9LFxuXHRcdHRleHRGaWxlUHJlZml4XzA6IHtcblx0XHRcdHRpdGxlOiAnQmVnaW5uaW5nIG9mIGZpcnN0IGZvbGRhYmxlIHJlZ2lvbiBwYWlyIGluIHRleHQgZmlsZScsXG5cdFx0XHRkZXNjcmlwdGlvbjogYFRoZSB0ZXh0IHRoYXQgaWRlbnRpZmllcyB0aGUgc3RhcnQgb2YgYSBmb2xkYWJsZSByZWdpb24gaW4gYSB0ZXh0IGZpbGUgKG9yIGFueSBmaWxlIHR5cGUgdGhhdCBkb2Vzbid0IHN1cHBvcnQgY29tbWVudHMpLmAsXG5cdFx0XHR0eXBlOiAnc3RyaW5nJyxcblx0XHRcdGRlZmF1bHQ6ICc8ZWRpdG9yLWZvbGQnLFxuXHRcdFx0b3JkZXI6IDlcblx0XHR9LFxuXHRcdHRleHRGaWxlUG9zdGZpeF8wOiB7XG5cdFx0XHR0aXRsZTogJ0VuZCBvZiBmaXJzdCBmb2xkYWJsZSByZWdpb24gcGFpciBpbiB0ZXh0IGZpbGUnLFxuXHRcdFx0ZGVzY3JpcHRpb246IGBUaGUgdGV4dCB0aGF0IGlkZW50aWZpZXMgdGhlIGVuZCBvZiBhIGZvbGRhYmxlIHJlZ2lvbiBpbiBhIHRleHQgZmlsZSAob3IgYW55IGZpbGUgdHlwZSB0aGF0IGRvZXNuJ3Qgc3VwcG9ydCBjb21tZW50cykuYCxcblx0XHRcdHR5cGU6ICdzdHJpbmcnLFxuXHRcdFx0ZGVmYXVsdDogJzwvZWRpdG9yLWZvbGQ+Jyxcblx0XHRcdG9yZGVyOiAxMFxuXHRcdH0sXG5cdFx0dGV4dEZpbGVQcmVmaXhfMToge1xuXHRcdFx0dGl0bGU6ICdCZWdpbm5pbmcgb2Ygc2Vjb25kIGZvbGRhYmxlIHJlZ2lvbiBwYWlyIGluIHRleHQgZmlsZScsXG5cdFx0XHRkZXNjcmlwdGlvbjogYFRoZSB0ZXh0IHRoYXQgaWRlbnRpZmllcyB0aGUgc3RhcnQgb2YgYSBmb2xkYWJsZSByZWdpb24gaW4gYSB0ZXh0IGZpbGUgKG9yIGFueSBmaWxlIHR5cGUgdGhhdCBkb2Vzbid0IHN1cHBvcnQgY29tbWVudHMpLmAsXG5cdFx0XHR0eXBlOiAnc3RyaW5nJyxcblx0XHRcdGRlZmF1bHQ6ICcvKicsXG5cdFx0XHRvcmRlcjogMTFcblx0XHR9LFxuXHRcdHRleHRGaWxlUG9zdGZpeF8xOiB7XG5cdFx0XHR0aXRsZTogJ0VuZCBvZiBzZWNvbmQgZm9sZGFibGUgcmVnaW9uIHBhaXIgaW4gdGV4dCBmaWxlJyxcblx0XHRcdGRlc2NyaXB0aW9uOiBgVGhlIHRleHQgdGhhdCBpZGVudGlmaWVzIHRoZSBlbmQgb2YgYSBmb2xkYWJsZSByZWdpb24gaW4gYSB0ZXh0IGZpbGUgKG9yIGFueSBmaWxlIHR5cGUgdGhhdCBkb2Vzbid0IHN1cHBvcnQgY29tbWVudHMpLmAsXG5cdFx0XHR0eXBlOiAnc3RyaW5nJyxcblx0XHRcdGRlZmF1bHQ6ICcqLycsXG5cdFx0XHRvcmRlcjogMTJcblx0XHR9LFxuXHRcdHRleHRGaWxlUHJlZml4XzI6IHtcblx0XHRcdHRpdGxlOiAnQmVnaW5uaW5nIG9mIHRoaXJkIGZvbGRhYmxlIHJlZ2lvbiBwYWlyIGluIHRleHQgZmlsZScsXG5cdFx0XHRkZXNjcmlwdGlvbjogYFRoZSB0ZXh0IHRoYXQgaWRlbnRpZmllcyB0aGUgc3RhcnQgb2YgYSBmb2xkYWJsZSByZWdpb24gaW4gYSB0ZXh0IGZpbGUgKG9yIGFueSBmaWxlIHR5cGUgdGhhdCBkb2Vzbid0IHN1cHBvcnQgY29tbWVudHMpLmAsXG5cdFx0XHR0eXBlOiAnc3RyaW5nJyxcblx0XHRcdGRlZmF1bHQ6ICcnLFxuXHRcdFx0b3JkZXI6IDEzXG5cdFx0fSxcblx0XHR0ZXh0RmlsZVBvc3RmaXhfMjoge1xuXHRcdFx0dGl0bGU6ICdFbmQgb2YgdGhpcmQgZm9sZGFibGUgcmVnaW9uIHBhaXIgaW4gdGV4dCBmaWxlJyxcblx0XHRcdGRlc2NyaXB0aW9uOiBgVGhlIHRleHQgdGhhdCBpZGVudGlmaWVzIHRoZSBlbmQgb2YgYSBmb2xkYWJsZSByZWdpb24gaW4gYSB0ZXh0IGZpbGUgKG9yIGFueSBmaWxlIHR5cGUgdGhhdCBkb2Vzbid0IHN1cHBvcnQgY29tbWVudHMpLmAsXG5cdFx0XHR0eXBlOiAnc3RyaW5nJyxcblx0XHRcdGRlZmF1bHQ6ICcnLFxuXHRcdFx0b3JkZXI6IDE0XG5cdFx0fVxuXHR9LFxuXG5cdHByZWZpeGVzOiBbXSxcblx0cG9zdGZpeGVzOiBbXSxcblx0dGV4dEZpbGVQcmVmaXhlczogW10sXG5cdHRleHRGaWxlUG9zdGZpeGVzOiBbXSxcblx0YXJlUmVnaW9uc0ZvbGRlZE9uTG9hZDogZmFsc2UsXG5cdGFyZVJlZ2lvbnNIaWdobGlnaHRlZDogdHJ1ZSxcblxuXHRlZGl0b3JzOiBbXSxcblx0ZWRpdG9ySWRUb01hcmtlcnM6IHt9LFxuXG5cdC8vIDxlZGl0b3ItZm9sZD4gTElGRSAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcblx0YWN0aXZhdGUoKSB7XG5cdFx0dGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKTtcblx0XHR0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuXHRcdFx0YXRvbS5jb21tYW5kcy5hZGQoJ2F0b20td29ya3NwYWNlJywge1xuXHRcdFx0XHQnY3VzdG9tLWZvbGRzOmZvbGQtdG9wLWxldmVsJzogQ3VzdG9tRm9sZHMuZm9sZFRvcExldmVsLFxuXHRcdFx0XHQnY3VzdG9tLWZvbGRzOmZvbGQtYWxsJzogQ3VzdG9tRm9sZHMuZm9sZEFsbCxcblx0XHRcdFx0J2N1c3RvbS1mb2xkczp1bmZvbGQtYWxsJzogQ3VzdG9tRm9sZHMudW5mb2xkQWxsLFxuXHRcdFx0XHQnY3VzdG9tLWZvbGRzOmZvbGQtaGVyZSc6IEN1c3RvbUZvbGRzLmZvbGRIZXJlLFxuXHRcdFx0XHQnY3VzdG9tLWZvbGRzOnVuZm9sZC1oZXJlJzogQ3VzdG9tRm9sZHMudW5mb2xkSGVyZSxcblx0XHRcdFx0J2N1c3RvbS1mb2xkczp0b2dnbGUtZm9sZCc6IEN1c3RvbUZvbGRzLnRvZ2dsZUZvbGRcblx0XHRcdH0pKTtcblxuXHRcdGZvciAobGV0IGM9MDsgYzxQUkVGSVhfQ09VTlQ7ICsrYykge1xuXHRcdFx0Y29uc3QgcHJlZml4UGF0aCA9IGBjdXN0b20tZm9sZHMucHJlZml4XyR7Y31gO1xuXHRcdFx0Y29uc3QgcG9zdGZpeFBhdGggPSBgY3VzdG9tLWZvbGRzLnBvc3RmaXhfJHtjfWA7XG5cdFx0XHRjb25zdCBwcmVmaXggPSBhdG9tLmNvbmZpZy5nZXQocHJlZml4UGF0aCk7XG5cdFx0XHRjb25zdCBwb3N0Zml4ID0gYXRvbS5jb25maWcuZ2V0KHBvc3RmaXhQYXRoKTtcblxuXHRcdFx0Y29uc3QgaW5kZXggPSBDdXN0b21Gb2xkcy5wcmVmaXhlcy5sZW5ndGg7XG5cdFx0XHRDdXN0b21Gb2xkcy5wcmVmaXhlcy5wdXNoKHByZWZpeCk7XG5cdFx0XHRhdG9tLmNvbmZpZy5vbkRpZENoYW5nZShwcmVmaXhQYXRoLCBjaGFuZ2UgPT4ge1xuXHRcdFx0XHRDdXN0b21Gb2xkcy5wcmVmaXhlc1tpbmRleF0gPSBjaGFuZ2UubmV3VmFsdWU7XG5cdFx0XHRcdEN1c3RvbUZvbGRzLl91cGRhdGVIaWdobGlnaHRzQWNyb3NzRWRpdG9ycygpO1xuXHRcdFx0fSk7XG5cblx0XHRcdEN1c3RvbUZvbGRzLnBvc3RmaXhlcy5wdXNoKHBvc3RmaXgpO1xuXHRcdFx0YXRvbS5jb25maWcub25EaWRDaGFuZ2UocG9zdGZpeFBhdGgsIGNoYW5nZSA9PiB7XG5cdFx0XHRcdEN1c3RvbUZvbGRzLnBvc3RmaXhlc1tpbmRleF0gPSBjaGFuZ2UubmV3VmFsdWU7XG5cdFx0XHRcdEN1c3RvbUZvbGRzLl91cGRhdGVIaWdobGlnaHRzQWNyb3NzRWRpdG9ycygpO1xuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0Zm9yIChsZXQgYz0wOyBjPFBSRUZJWF9DT1VOVDsgKytjKSB7XG5cdFx0XHRjb25zdCBwcmVmaXhQYXRoID0gYGN1c3RvbS1mb2xkcy50ZXh0RmlsZVByZWZpeF8ke2N9YDtcblx0XHRcdGNvbnN0IHBvc3RmaXhQYXRoID0gYGN1c3RvbS1mb2xkcy50ZXh0RmlsZVBvc3RmaXhfJHtjfWA7XG5cdFx0XHRjb25zdCBwcmVmaXggPSBhdG9tLmNvbmZpZy5nZXQocHJlZml4UGF0aCk7XG5cdFx0XHRjb25zdCBwb3N0Zml4ID0gYXRvbS5jb25maWcuZ2V0KHBvc3RmaXhQYXRoKTtcblxuXHRcdFx0Y29uc3QgaW5kZXggPSBDdXN0b21Gb2xkcy50ZXh0RmlsZVByZWZpeGVzLmxlbmd0aDtcblx0XHRcdEN1c3RvbUZvbGRzLnRleHRGaWxlUHJlZml4ZXMucHVzaChwcmVmaXgpO1xuXHRcdFx0YXRvbS5jb25maWcub25EaWRDaGFuZ2UocHJlZml4UGF0aCwgY2hhbmdlID0+IHtcblx0XHRcdFx0Q3VzdG9tRm9sZHMudGV4dEZpbGVQcmVmaXhlc1tpbmRleF0gPSBjaGFuZ2UubmV3VmFsdWU7XG5cdFx0XHRcdEN1c3RvbUZvbGRzLl91cGRhdGVIaWdobGlnaHRzQWNyb3NzRWRpdG9ycygpO1xuXHRcdFx0fSk7XG5cblx0XHRcdEN1c3RvbUZvbGRzLnRleHRGaWxlUG9zdGZpeGVzLnB1c2gocG9zdGZpeCk7XG5cdFx0XHRhdG9tLmNvbmZpZy5vbkRpZENoYW5nZShwb3N0Zml4UGF0aCwgY2hhbmdlID0+IHtcblx0XHRcdFx0Q3VzdG9tRm9sZHMudGV4dEZpbGVQb3N0Zml4ZXNbaW5kZXhdID0gY2hhbmdlLm5ld1ZhbHVlO1xuXHRcdFx0XHRDdXN0b21Gb2xkcy5fdXBkYXRlSGlnaGxpZ2h0c0Fjcm9zc0VkaXRvcnMoKTtcblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdEN1c3RvbUZvbGRzLmFyZVJlZ2lvbnNGb2xkZWRPbkxvYWQgPSBhdG9tLmNvbmZpZy5nZXQoJ2N1c3RvbS1mb2xkcy5hcmVSZWdpb25zRm9sZGVkT25Mb2FkJyk7XG5cdFx0YXRvbS5jb25maWcub25EaWRDaGFuZ2UoJ2N1c3RvbS1mb2xkcy5hcmVSZWdpb25zRm9sZGVkT25Mb2FkJywgY2hhbmdlID0+IHtcblx0XHRcdEN1c3RvbUZvbGRzLmFyZVJlZ2lvbnNGb2xkZWRPbkxvYWQgPSBjaGFuZ2UubmV3VmFsdWU7XG5cdFx0fSk7XG5cblx0XHRDdXN0b21Gb2xkcy5hcmVSZWdpb25zSGlnaGxpZ2h0ZWQgPSBhdG9tLmNvbmZpZy5nZXQoJ2N1c3RvbS1mb2xkcy5hcmVSZWdpb25zSGlnaGxpZ2h0ZWQnKTtcblx0XHRhdG9tLmNvbmZpZy5vbkRpZENoYW5nZSgnY3VzdG9tLWZvbGRzLmFyZVJlZ2lvbnNIaWdobGlnaHRlZCcsIGNoYW5nZSA9PiB7XG5cdFx0XHRDdXN0b21Gb2xkcy5hcmVSZWdpb25zSGlnaGxpZ2h0ZWQgPSBjaGFuZ2UubmV3VmFsdWU7XG5cdFx0XHRDdXN0b21Gb2xkcy5fdXBkYXRlSGlnaGxpZ2h0c0Fjcm9zc0VkaXRvcnMoKTtcblx0XHR9KTtcblxuXHRcdHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS53b3Jrc3BhY2Uub2JzZXJ2ZVRleHRFZGl0b3JzKGVkaXRvciA9PiB7XG5cdFx0XHRDdXN0b21Gb2xkcy5lZGl0b3JzLnB1c2goZWRpdG9yKTtcblx0XHRcdEN1c3RvbUZvbGRzLmVkaXRvcklkVG9NYXJrZXJzW2VkaXRvci5pZF0gPSBbXTtcblxuXHRcdFx0Ly8gRGVsYXlpbmcgdHdvIGFuaW1hdGlvbiBmcmFtZXMgc2VlbXMgdG8gZml4IHRoZSBpc3N1ZSBvZiB0aGUgZW1wdHkgY29tbWVudCBjaGFycy5cblx0XHRcdC8vIFRoaXMgaXMgYSByZWFsbHkgc3R1cGlkIGZpeC4gV291bGQgcHJlZmVyIGFuIGV2ZW50IHRvIHByb3Blcmx5IHNpZ25hbCB0aGlzIGJ1dCBJIGNhbid0IGZpbmQgc3VjaCBhbiBldmVudCBpbiB0aGUgYXRvbSBhcGkuXG5cdFx0XHR3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcblx0XHRcdFx0d2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG5cdFx0XHRcdFx0Q3VzdG9tRm9sZHMuX3VwZGF0ZUhpZ2hsaWdodHMoZWRpdG9yKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9KTtcblx0XHRcdEN1c3RvbUZvbGRzLl9hZGRDbGlja0V2ZW50KGVkaXRvcik7XG5cblx0XHRcdC8vIEl0J3MgZWFzaWVyIGp1c3QgdG8gYWx3YXlzIHN1YnNjcmliZSB0byB0aGlzLlxuXHRcdFx0ZWRpdG9yLm9uRGlkU3RvcENoYW5naW5nKCgpID0+IEN1c3RvbUZvbGRzLl91cGRhdGVIaWdobGlnaHRzKGVkaXRvcikpO1xuXHRcdH0pKTtcblxuXHRcdHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS53b3Jrc3BhY2Uub25EaWRBZGRUZXh0RWRpdG9yKGV2ZW50ID0+IHtcblx0XHRcdFx0aWYgKEN1c3RvbUZvbGRzLmFyZVJlZ2lvbnNGb2xkZWRPbkxvYWQpIHtldmVudC50ZXh0RWRpdG9yLmRpc3BsYXlCdWZmZXIudG9rZW5pemVkQnVmZmVyLm9uRGlkVG9rZW5pemUoICgpID0+IHtDdXN0b21Gb2xkcy5mb2xkQWxsKCk7fSl9XG5cdFx0fSkpO1xuXHR9LFxuXG5cdGRlYWN0aXZhdGUoKSB7XG5cdFx0dGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKTtcblx0fSxcblx0Ly8gPC9lZGl0b3ItZm9sZD4gbGlmZVxuXG5cdC8vIDxlZGl0b3ItZm9sZD4gUkVTUE9OREVSUyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcblx0Zm9sZFRvcExldmVsKCkge1xuXHRcdGNvbnN0IG9wdGlvbnMgPSBDdXN0b21Gb2xkcy5fZ2V0T3B0aW9ucygpO1xuXG5cdFx0Zm9yIChsZXQgYz0wLCBjTGVuPW9wdGlvbnMuZWRpdG9yLmdldExpbmVDb3VudCgpOyBjPGNMZW47ICsrYykge1xuXHRcdFx0Y29uc3QgbGluZSA9IG9wdGlvbnMuZWRpdG9yLmxpbmVUZXh0Rm9yQnVmZmVyUm93KGMpLnRyaW0oKTtcblxuXHRcdFx0aWYgKCFvcHRpb25zLmFyZUNvbW1lbnRzUmVxdWlyZWQgfHwgb3B0aW9ucy5lZGl0b3IuaXNCdWZmZXJSb3dDb21tZW50ZWQoYykpIHtcblx0XHRcdFx0b3B0aW9ucy5wcmVmaXhlcy5mb3JFYWNoKChwcmVmaXgsIGluZGV4KSA9PiB7XG5cdFx0XHRcdFx0Y29uc3QgcG9zdGZpeCA9IG9wdGlvbnMucG9zdGZpeGVzW2luZGV4XTtcblx0XHRcdFx0XHRpZiAoIXByZWZpeCB8fCAhcHJlZml4Lmxlbmd0aCB8fCAhcG9zdGZpeCB8fCAhcG9zdGZpeC5sZW5ndGgpIHsgcmV0dXJuOyB9XG5cblx0XHRcdFx0XHRpZiAobGluZS5yZXBsYWNlKG9wdGlvbnMuY29tbWVudENoYXJzLCcnKS50cmltKCkuc3RhcnRzV2l0aChwcmVmaXgpKSB7XG5cdFx0XHRcdFx0XHRjb25zdCBlbmRSb3cgPSBDdXN0b21Gb2xkcy5fcm93T2ZFbmRUYWcob3B0aW9ucywgaW5kZXgsIGMpO1xuXHRcdFx0XHRcdFx0aWYgKGMgPCBlbmRSb3cpIHtcblx0XHRcdFx0XHRcdFx0Q3VzdG9tRm9sZHMuX2ZvbGQob3B0aW9ucy5lZGl0b3IsIGMsIGVuZFJvdyk7XG5cdFx0XHRcdFx0XHRcdGMgPSBlbmRSb3cgKyAxO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9LFxuXG5cdGZvbGRBbGwoKSB7XG5cdFx0Y29uc3QgeyBlZGl0b3IsIGNvbW1lbnRDaGFycywgYXJlQ29tbWVudHNSZXF1aXJlZCwgcHJlZml4ZXMsIHBvc3RmaXhlcyB9ID0gQ3VzdG9tRm9sZHMuX2dldE9wdGlvbnMoKTtcblxuXHRcdGxldCBzdGFydFByZWZpeFN0YWNrID0gW107XG5cdFx0Zm9yIChsZXQgYz0wLCBjTGVuPWVkaXRvci5nZXRMaW5lQ291bnQoKTsgYzxjTGVuOyArK2MpIHtcblx0XHRcdGNvbnN0IGxpbmUgPSBlZGl0b3IubGluZVRleHRGb3JCdWZmZXJSb3coYykudHJpbSgpO1xuXHRcdFx0aWYgKCFhcmVDb21tZW50c1JlcXVpcmVkIHx8IGVkaXRvci5pc0J1ZmZlclJvd0NvbW1lbnRlZChjKSkge1xuXHRcdFx0XHRwcmVmaXhlcy5mb3JFYWNoKChwcmVmaXgsIGluZGV4KSA9PiB7XG5cdFx0XHRcdFx0Y29uc3QgcG9zdGZpeCA9IHBvc3RmaXhlc1tpbmRleF07XG5cdFx0XHRcdFx0aWYgKCFwcmVmaXggfHwgIXByZWZpeC5sZW5ndGggfHwgIXBvc3RmaXggfHwgIXBvc3RmaXgubGVuZ3RoKSB7IHJldHVybjsgfVxuXG5cdFx0XHRcdFx0Y29uc3QgdHJpbW1lZExpbmUgPSBsaW5lLnJlcGxhY2UoY29tbWVudENoYXJzLCcnKS50cmltKCk7XG5cdFx0XHRcdFx0aWYgKHRyaW1tZWRMaW5lLnN0YXJ0c1dpdGgocHJlZml4KSkge1xuXHRcdFx0XHRcdFx0c3RhcnRQcmVmaXhTdGFjay5wdXNoKGMpO1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAodHJpbW1lZExpbmUuc3RhcnRzV2l0aChwb3N0Zml4KSkge1xuXHRcdFx0XHRcdFx0aWYgKHN0YXJ0UHJlZml4U3RhY2subGVuZ3RoKSB7XG5cdFx0XHRcdFx0XHRcdGNvbnN0IHN0YXJ0Um93ID0gc3RhcnRQcmVmaXhTdGFjay5wb3AoKTtcblx0XHRcdFx0XHRcdFx0Q3VzdG9tRm9sZHMuX2ZvbGQoZWRpdG9yLCBzdGFydFJvdywgYyk7XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRhdG9tLm5vdGlmaWNhdGlvbnMuYWRkV2FybmluZyhgRXh0cmEgY2xvc2luZyBmb2xkIHRhZyBmb3VuZCBhdCBsaW5lICR7YyArIDF9LmApO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKHN0YXJ0UHJlZml4U3RhY2subGVuZ3RoKSB7XG5cdFx0XHRhdG9tLm5vdGlmaWNhdGlvbnMuYWRkV2FybmluZyhgRXh0cmEgb3BlbmluZyBmb2xkIHRhZyBmb3VuZCBhdCBsaW5lICR7c3RhcnRQcmVmaXhTdGFjay5wb3AoKSArIDF9LmApO1xuXHRcdH1cblx0fSxcblxuXHR1bmZvbGRBbGwoKSB7XG5cdFx0Y29uc3QgeyBlZGl0b3IsIGNvbW1lbnRDaGFycywgYXJlQ29tbWVudHNSZXF1aXJlZCwgcHJlZml4ZXMgfSA9IEN1c3RvbUZvbGRzLl9nZXRPcHRpb25zKCk7XG5cblx0XHRmb3IgKGxldCBjPTAsIGNMZW49ZWRpdG9yLmdldExpbmVDb3VudCgpOyBjPGNMZW47ICsrYykge1xuXHRcdFx0Y29uc3QgbGluZSA9IGVkaXRvci5saW5lVGV4dEZvckJ1ZmZlclJvdyhjKS50cmltKCk7XG5cblx0XHRcdGlmICghYXJlQ29tbWVudHNSZXF1aXJlZCB8fCBlZGl0b3IuaXNCdWZmZXJSb3dDb21tZW50ZWQoYykpIHtcblx0XHRcdFx0cHJlZml4ZXMuZm9yRWFjaChwcmVmaXggPT4ge1xuXHRcdFx0XHRcdGlmICghcHJlZml4IHx8ICFwcmVmaXgubGVuZ3RoKSB7IHJldHVybjsgfVxuXG5cdFx0XHRcdFx0aWYgKGxpbmUucmVwbGFjZShjb21tZW50Q2hhcnMsJycpLnRyaW0oKS5zdGFydHNXaXRoKHByZWZpeCkpIHtcblx0XHRcdFx0XHRcdGVkaXRvci51bmZvbGRCdWZmZXJSb3coYyk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9XG5cdH0sXG5cblx0Ly8gVE9ETzogZG8gdGhpcyBmb3IgZWFjaCBjdXJzb3Jcblx0Zm9sZEhlcmUoKSB7XG5cdFx0Y29uc3Qgb3B0aW9ucyA9IEN1c3RvbUZvbGRzLl9nZXRPcHRpb25zKCk7XG5cblx0XHRjb25zdCByb3cgPSBDdXN0b21Gb2xkcy5fcm93T2ZTdGFydFRhZyhvcHRpb25zLCBvcHRpb25zLmVkaXRvci5nZXRDdXJzb3JCdWZmZXJQb3NpdGlvbigpLnJvdyk7XG5cdFx0aWYgKHJvdyA+PSAwKSB7XG5cdFx0XHRDdXN0b21Gb2xkcy5mb2xkUm93KHJvdywgb3B0aW9ucyk7XG5cdFx0fVxuXHR9LFxuXG5cdGZvbGRSb3cocm93LCBvcHRpb25zPXVuZGVmaW5lZCkge1xuXHRcdGxldCByZXN1bHQgPSBmYWxzZTtcblxuXHRcdG9wdGlvbnMgPSBvcHRpb25zIHx8IEN1c3RvbUZvbGRzLl9nZXRPcHRpb25zKCk7XG5cblx0XHRyb3cgPSArcm93OyAgLy8gRW5zdXJlIHJvdyBpcyBhIG51bWJlclxuXHRcdGNvbnN0IGxpbmUgPSBvcHRpb25zLmVkaXRvci5saW5lVGV4dEZvckJ1ZmZlclJvdyhyb3cpLnRyaW0oKTtcblx0XHRpZiAoIW9wdGlvbnMuYXJlQ29tbWVudHNSZXF1aXJlZCB8fCBvcHRpb25zLmVkaXRvci5pc0J1ZmZlclJvd0NvbW1lbnRlZChyb3cpKSB7XG5cdFx0XHRmb3IgKGxldCBjPTAsIGNMZW49b3B0aW9ucy5wcmVmaXhlcy5sZW5ndGg7IGM8Y0xlbjsgKytjKSB7XG5cdFx0XHRcdGNvbnN0IHByZWZpeCA9IG9wdGlvbnMucHJlZml4ZXNbY107XG5cdFx0XHRcdGNvbnN0IHBvc3RmaXggPSBvcHRpb25zLnBvc3RmaXhlc1tjXTtcblx0XHRcdFx0aWYgKCFwcmVmaXggfHwgIXByZWZpeC5sZW5ndGggfHwgIXBvc3RmaXggfHwgIXBvc3RmaXgubGVuZ3RoKSB7IGNvbnRpbnVlOyB9XG5cblx0XHRcdFx0aWYgKGxpbmUucmVwbGFjZShvcHRpb25zLmNvbW1lbnRDaGFycywnJykudHJpbSgpLnN0YXJ0c1dpdGgocHJlZml4KSkge1xuXHRcdFx0XHRcdGNvbnN0IGVuZFJvdyA9IEN1c3RvbUZvbGRzLl9yb3dPZkVuZFRhZyhvcHRpb25zLCBjLCByb3cpO1xuXHRcdFx0XHRcdGlmIChyb3cgPCBlbmRSb3cpIHtcblx0XHRcdFx0XHRcdEN1c3RvbUZvbGRzLl9mb2xkKG9wdGlvbnMuZWRpdG9yLCByb3csIGVuZFJvdyk7XG5cdFx0XHRcdFx0XHRyZXN1bHQgPSB0cnVlO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHJlc3VsdDtcblx0fSxcblxuXHR1bmZvbGRIZXJlKCkge1xuXHRcdGNvbnN0IHsgZWRpdG9yIH0gPSBDdXN0b21Gb2xkcy5fZ2V0T3B0aW9ucygpO1xuXHRcdGVkaXRvci51bmZvbGRCdWZmZXJSb3coZWRpdG9yLmdldEN1cnNvckJ1ZmZlclBvc2l0aW9uKCkucm93KTtcblx0XHQvLyBlZGl0b3IudW5mb2xkQ3VycmVudFJvdygpOyAgLy8gdGhpcyBkb2VzIG5vdCBzZWVtIHRvIHByZXNlcnZlIGludGVybmFsIGZvbGRpbmdcblx0fSxcblxuXHR0b2dnbGVGb2xkKCkge1xuXHRcdGNvbnN0IG9wdGlvbnMgPSBDdXN0b21Gb2xkcy5fZ2V0T3B0aW9ucygpO1xuXHRcdGNvbnN0IHJvdyA9IG9wdGlvbnMuZWRpdG9yLmdldEN1cnNvckJ1ZmZlclBvc2l0aW9uKCkucm93O1xuXG5cdFx0aWYgKG9wdGlvbnMuZWRpdG9yLmlzRm9sZGVkQXRCdWZmZXJSb3cocm93KSkge1xuXHRcdFx0Q3VzdG9tRm9sZHMudW5mb2xkSGVyZSgpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRDdXN0b21Gb2xkcy5mb2xkSGVyZShvcHRpb25zKTtcblx0XHR9XG5cdH0sXG5cdC8vIDwvZWRpdG9yLWZvbGQ+IHJlc3BvbmRlcnNcblxuXHQvLyA8ZWRpdG9yLWZvbGQ+IEhFTFBFUlMgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG5cdF9mb2xkKGVkaXRvciwgc3RhcnRSb3csIGVuZFJvdykge1xuXHRcdGVkaXRvci5zZXRTZWxlY3RlZEJ1ZmZlclJhbmdlKG5ldyBSYW5nZShuZXcgUG9pbnQoc3RhcnRSb3csIDUxMiksIG5ldyBQb2ludChlbmRSb3csIDUxMikpKTtcblx0XHRlZGl0b3IuZm9sZFNlbGVjdGVkTGluZXMoKTtcblx0fSxcblxuXHQvLyBGZXRjaCB0aGUgY3VycmVudCBlZGl0b3IsIGFwcGxpY2FibGUgcHJlZml4IGFuZCBwb3N0Zml4IGFycmF5cywgYXMgd2VsbCBhcyB0aGUgY29tbWVudENoYXJzXG5cdF9nZXRPcHRpb25zKGVkaXRvcj11bmRlZmluZWQpIHtcblx0XHRlZGl0b3IgPSBlZGl0b3IgfHwgYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpO1xuXHRcdGNvbnN0IGNvbW1lbnRDaGFycyA9IGVkaXRvciA/IChhdG9tLmNvbmZpZy5nZXQoJ2VkaXRvci5jb21tZW50U3RhcnQnLCB7c2NvcGU6IGVkaXRvci5nZXRSb290U2NvcGVEZXNjcmlwdG9yKCl9KSB8fCAnJykudHJpbSgpIDogJyc7XG5cdFx0Y29uc3QgYXJlQ29tbWVudHNSZXF1aXJlZCA9IGNvbW1lbnRDaGFycyAhPT0gJyc7XG5cdFx0Y29uc3QgcHJlZml4ZXMgPSBhcmVDb21tZW50c1JlcXVpcmVkID8gQ3VzdG9tRm9sZHMucHJlZml4ZXMgOiBDdXN0b21Gb2xkcy50ZXh0RmlsZVByZWZpeGVzO1xuXHRcdGNvbnN0IHBvc3RmaXhlcyA9IGFyZUNvbW1lbnRzUmVxdWlyZWQgPyBDdXN0b21Gb2xkcy5wb3N0Zml4ZXMgOiBDdXN0b21Gb2xkcy50ZXh0RmlsZVBvc3RmaXhlcztcblxuXHRcdHJldHVybiB7IGVkaXRvciwgY29tbWVudENoYXJzLCBhcmVDb21tZW50c1JlcXVpcmVkLCBwcmVmaXhlcywgcG9zdGZpeGVzIH07XG5cdH0sXG5cblx0Ly8gdGFrZXMgbmVzdGluZyBpbnRvIGFjY291bnRcblx0X3Jvd09mU3RhcnRUYWcob3B0aW9ucywgc3RhcnRSb3cpIHtcblx0XHRsZXQgcmVzdWx0ID0gLTE7XG5cblx0XHRsZXQgZW5kVGFnQ291bnQgPSAxO1xuXHRcdGZvciAobGV0IGM9c3RhcnRSb3c7IGM+PTAgJiYgZW5kVGFnQ291bnQ+MDsgLS1jKSB7XG5cdFx0XHRjb25zdCBsaW5lID0gb3B0aW9ucy5lZGl0b3IubGluZVRleHRGb3JCdWZmZXJSb3coYykudHJpbSgpO1xuXHRcdFx0aWYgKCFvcHRpb25zLmFyZUNvbW1lbnRzUmVxdWlyZWQgfHwgb3B0aW9ucy5lZGl0b3IuaXNCdWZmZXJSb3dDb21tZW50ZWQoYykpIHtcblx0XHRcdFx0Zm9yIChsZXQgZD0wLCBkTGVuPW9wdGlvbnMucHJlZml4ZXMubGVuZ3RoOyBkPGRMZW47ICsrZCkge1xuXHRcdFx0XHRcdGNvbnN0IHByZWZpeCA9IG9wdGlvbnMucHJlZml4ZXNbZF07XG5cdFx0XHRcdFx0Y29uc3QgcG9zdGZpeCA9IG9wdGlvbnMucG9zdGZpeGVzW2RdO1xuXHRcdFx0XHRcdGlmICghcHJlZml4IHx8ICFwcmVmaXgubGVuZ3RoIHx8ICFwb3N0Zml4IHx8ICFwb3N0Zml4Lmxlbmd0aCkgeyBjb250aW51ZTsgfVxuXG5cdFx0XHRcdFx0aWYgKGxpbmUucmVwbGFjZShvcHRpb25zLmNvbW1lbnRDaGFycywnJykudHJpbSgpLnN0YXJ0c1dpdGgocG9zdGZpeCkpIHtcblx0XHRcdFx0XHRcdC8vIERvbid0IGNvdW50IHRoZSBlbmRpbmcgdGFnIGlmIHRoZSB1c2VyIHN0YXJ0ZWQgdGhlIGFjdGlvbiB3aGlsZSBvbiBhbiBlbmRpbmcgdGFnLlxuXHRcdFx0XHRcdFx0aWYgKGMgIT09IHN0YXJ0Um93KSB7XG5cdFx0XHRcdFx0XHRcdCsrZW5kVGFnQ291bnQ7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHR9IGVsc2UgaWYgKGxpbmUucmVwbGFjZShvcHRpb25zLmNvbW1lbnRDaGFycywnJykudHJpbSgpLnN0YXJ0c1dpdGgocHJlZml4KSkge1xuXHRcdFx0XHRcdFx0LS1lbmRUYWdDb3VudDtcblx0XHRcdFx0XHRcdGlmICghZW5kVGFnQ291bnQpIHtcblx0XHRcdFx0XHRcdFx0cmVzdWx0ID0gYztcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiByZXN1bHQ7XG5cdH0sXG5cblx0Ly8gdGFrZXMgbmVzdGluZyBpbnRvIGFjY291bnRcblx0X3Jvd09mRW5kVGFnKG9wdGlvbnMsIHBhaXJJbmRleCwgc3RhcnRSb3cpIHtcblx0XHRsZXQgcmVzdWx0ID0gLTE7XG5cblx0XHRjb25zdCBwcmVmaXggPSBvcHRpb25zLnByZWZpeGVzW3BhaXJJbmRleF07XG5cdFx0Y29uc3QgcG9zdGZpeCA9IG9wdGlvbnMucG9zdGZpeGVzW3BhaXJJbmRleF07XG5cblx0XHRsZXQgc3RhcnRUYWdDb3VudCA9IDE7XG5cdFx0bGV0IGMgPSBzdGFydFJvdyArIDE7XG5cdFx0Y29uc3QgY0xlbiA9IG9wdGlvbnMuZWRpdG9yLmdldExpbmVDb3VudCgpO1xuXHRcdGZvciAoOyBjPGNMZW47ICsrYykge1xuXHRcdFx0Y29uc3QgbGluZSA9IG9wdGlvbnMuZWRpdG9yLmxpbmVUZXh0Rm9yQnVmZmVyUm93KGMpLnRyaW0oKTtcblx0XHRcdGlmICghb3B0aW9ucy5hcmVDb21tZW50c1JlcXVpcmVkIHx8IG9wdGlvbnMuZWRpdG9yLmlzQnVmZmVyUm93Q29tbWVudGVkKGMpKSB7XG5cdFx0XHRcdGlmIChsaW5lLnJlcGxhY2Uob3B0aW9ucy5jb21tZW50Q2hhcnMsJycpLnRyaW0oKS5zdGFydHNXaXRoKHByZWZpeCkpIHtcblx0XHRcdFx0XHQrK3N0YXJ0VGFnQ291bnQ7XG5cdFx0XHRcdH0gZWxzZSBpZiAobGluZS5yZXBsYWNlKG9wdGlvbnMuY29tbWVudENoYXJzLCcnKS50cmltKCkuc3RhcnRzV2l0aChwb3N0Zml4KSkge1xuXHRcdFx0XHRcdGlmICgtLXN0YXJ0VGFnQ291bnQgPT09IDApIHtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmIChjID09PSBjTGVuKSB7XG5cdFx0XHRhdG9tLm5vdGlmaWNhdGlvbnMuYWRkV2FybmluZyhgTm8gZW5kIG1hcmtlciBmb3VuZCBmb3IgZm9sZGluZyB0YWcgdGhhdCBzdGFydHMgb24gbGluZSAke3N0YXJ0Um93ICsgMX0uYCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJlc3VsdCA9IGM7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHJlc3VsdDtcblx0fSxcblxuXHRfdXBkYXRlSGlnaGxpZ2h0cyhlZGl0b3IpIHtcblx0XHRpZiAoIWVkaXRvci5pc0FsaXZlKCkpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRsZXQgbWFya2VycyA9IEN1c3RvbUZvbGRzLmVkaXRvcklkVG9NYXJrZXJzW2VkaXRvci5pZF07XG5cdFx0bWFya2Vycy5mb3JFYWNoKG0gPT4gbS5kZXN0cm95KCkpO1xuXG5cdFx0Y29uc3QgeyBjb21tZW50Q2hhcnMsIGFyZUNvbW1lbnRzUmVxdWlyZWQsIHByZWZpeGVzLCBwb3N0Zml4ZXMgfSA9IEN1c3RvbUZvbGRzLl9nZXRPcHRpb25zKGVkaXRvcik7XG5cdFx0Ly8gYXRvbS5ub3RpZmljYXRpb25zLmFkZFdhcm5pbmcoYENvbW1tZW50Q2hhcnM6IFwiJHtjb21tZW50Q2hhcnN9XCIuYCk7XG5cblx0XHRmb3IgKGxldCBjPTAsIGNMZW49ZWRpdG9yLmdldExpbmVDb3VudCgpOyBjPGNMZW47ICsrYykge1xuXHRcdFx0Y29uc3QgbGluZSA9IGVkaXRvci5saW5lVGV4dEZvckJ1ZmZlclJvdyhjKS50cmltKCk7XG5cblx0XHRcdHByZWZpeGVzLmZvckVhY2goKHByZWZpeCwgaW5kZXgpID0+IHtcblx0XHRcdFx0Y29uc3QgcG9zdGZpeCA9IHBvc3RmaXhlc1tpbmRleF07XG5cdFx0XHRcdGlmICghcHJlZml4IHx8ICFwcmVmaXgubGVuZ3RoIHx8ICFwb3N0Zml4IHx8ICFwb3N0Zml4Lmxlbmd0aCkgeyByZXR1cm47IH1cblxuXHRcdFx0XHRsZXQgY2xzO1xuXHRcdFx0XHRpZiAobGluZS5yZXBsYWNlKGNvbW1lbnRDaGFycywnJykudHJpbSgpLnN0YXJ0c1dpdGgocHJlZml4KSkge1xuXHRcdFx0XHRcdGNscyA9ICdjdXN0b20tZm9sZHMtc3RhcnQnO1xuXHRcdFx0XHR9IGVsc2UgaWYgKGxpbmUucmVwbGFjZShjb21tZW50Q2hhcnMsJycpLnRyaW0oKS5zdGFydHNXaXRoKHBvc3RmaXgpKSB7XG5cdFx0XHRcdFx0Y2xzID0gJ2N1c3RvbS1mb2xkcy1zdG9wJztcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmIChjbHMpIHtcblx0XHRcdFx0XHRsZXQgcmFuZ2UgPSBbW2MsMF0sW2MsMF1dO1xuXHRcdFx0XHRcdGxldCBtYXJrZXIgPSBlZGl0b3IubWFya0J1ZmZlclJhbmdlKHJhbmdlKTtcblx0XHRcdFx0XHRtYXJrZXJzLnB1c2gobWFya2VyKTtcblx0XHRcdFx0XHRlZGl0b3IuZGVjb3JhdGVNYXJrZXIobWFya2VyLCB7dHlwZTogJ2xpbmUnLCBjbGFzczogY2xzfSk7XG5cdFx0XHRcdFx0aWYgKGNscyA9PT0gJ2N1c3RvbS1mb2xkcy1zdGFydCcpIHtcblx0XHRcdFx0XHRcdGVkaXRvci5kZWNvcmF0ZU1hcmtlcihtYXJrZXIsIHt0eXBlOiAnbGluZS1udW1iZXInLCBjbGFzczogY2xzfSk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKCFDdXN0b21Gb2xkcy5hcmVSZWdpb25zSGlnaGxpZ2h0ZWQpIHtcblx0XHRcdFx0XHRcdGVkaXRvci5kZWNvcmF0ZU1hcmtlcihtYXJrZXIsIHt0eXBlOiAnbGluZScsIGNsYXNzOiAnbm8taGlnaGxpZ2h0J30pO1xuXHRcdFx0XHRcdFx0aWYgKGNscyA9PT0gJ2N1c3RvbS1mb2xkcy1zdGFydCcpIHtcblx0XHRcdFx0XHRcdFx0ZWRpdG9yLmRlY29yYXRlTWFya2VyKG1hcmtlciwge3R5cGU6ICdsaW5lLW51bWJlcicsIGNsYXNzOiAnbm8taGlnaGxpZ2h0J30pO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fVxuXHR9LFxuXG5cdF91cGRhdGVIaWdobGlnaHRzQWNyb3NzRWRpdG9ycygpIHtcblx0XHRDdXN0b21Gb2xkcy5lZGl0b3JzLmZvckVhY2goQ3VzdG9tRm9sZHMuX3VwZGF0ZUhpZ2hsaWdodHMpO1xuXHR9LFxuXG5cdF9hZGRDbGlja0V2ZW50KGVkaXRvcikge1xuXHRcdGNvbnN0IGVkaXRvclZpZXcgPSBhdG9tLnZpZXdzLmdldFZpZXcoZWRpdG9yKTtcblx0XHRjb25zdCBndXR0ZXIgPSBlZGl0b3JWaWV3LnF1ZXJ5U2VsZWN0b3IoJy5ndXR0ZXInKTtcblx0XHQkKGd1dHRlcikub24oJ2NsaWNrJywgJy5saW5lLW51bWJlci5jdXN0b20tZm9sZHMtc3RhcnQ6bm90KC5mb2xkZWQpIC5pY29uLXJpZ2h0JywgZnVuY3Rpb24oZXZlbnQpIHtcblx0XHRcdGNvbnN0IHJvdyA9IGV2ZW50LnRhcmdldC5wYXJlbnRFbGVtZW50LmRhdGFzZXQuYnVmZmVyUm93O1xuXHRcdFx0Q3VzdG9tRm9sZHMuZm9sZFJvdyhyb3cpO1xuXHRcdH0pO1xuXHR9XG5cdC8vIDwvZWRpdG9yLWZvbGQ+IGhlbHBlcnNcbn07XG5cblxuXG4vLyBGb3IgdGVzdGluZ+KAplxuXG4vLyA8ZWRpdG9yLWZvbGQgZGVzYz0nMSc+XG4vLyA8ZWRpdG9yLWZvbGQgZGVzYz0nMic+XG4vLyA8ZWRpdG9yLWZvbGQgZGVzYz0nMyc+XG4vLyA8L2VkaXRvci1mb2xkPlxuLy8gPC9lZGl0b3ItZm9sZD5cbi8vIDwvZWRpdG9yLWZvbGQ+XG4iXX0=