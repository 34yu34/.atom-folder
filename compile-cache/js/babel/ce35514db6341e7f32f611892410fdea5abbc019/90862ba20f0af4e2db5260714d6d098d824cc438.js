function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _grammarUtils = require('../grammar-utils');

var _grammarUtils2 = _interopRequireDefault(_grammarUtils);

'use babel';

var babel = _path2['default'].join(__dirname, '../..', 'node_modules', '.bin', 'babel');

var _args = function _args(_ref) {
  var filepath = _ref.filepath;

  var cmd = '\'' + babel + '\' --filename \'' + babel + '\' < \'' + filepath + '\'| node';
  return _grammarUtils2['default'].formatArgs(cmd);
};
exports.Dart = {
  'Selection Based': {
    command: 'dart',
    args: function args(context) {
      var code = context.getCode();
      var tmpFile = _grammarUtils2['default'].createTempFileWithCode(code, '.dart');
      return [tmpFile];
    }
  },
  'File Based': {
    command: 'dart',
    args: function args(_ref2) {
      var filepath = _ref2.filepath;
      return [filepath];
    }
  }
};
exports.JavaScript = {
  'Selection Based': {
    command: _grammarUtils.command,
    args: function args(context) {
      var code = context.getCode();
      var filepath = _grammarUtils2['default'].createTempFileWithCode(code, '.js');
      return _args({ filepath: filepath });
    }
  },
  'File Based': { command: _grammarUtils.command, args: _args }
};
exports['Babel ES6 JavaScript'] = exports.JavaScript;
exports['JavaScript with JSX'] = exports.JavaScript;

exports['JavaScript for Automation (JXA)'] = {
  'Selection Based': {
    command: 'osascript',
    args: function args(context) {
      return ['-l', 'JavaScript', '-e', context.getCode()];
    }
  },
  'File Based': {
    command: 'osascript',
    args: function args(_ref3) {
      var filepath = _ref3.filepath;
      return ['-l', 'JavaScript', filepath];
    }
  }
};
exports.TypeScript = {
  'Selection Based': {
    command: 'ts-node',
    args: function args(context) {
      return ['-e', context.getCode()];
    }
  },
  'File Based': {
    command: 'ts-node',
    args: function args(_ref4) {
      var filepath = _ref4.filepath;
      return [filepath];
    }
  }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2JpbGx5Ly5hdG9tL3BhY2thZ2VzL3NjcmlwdC9saWIvZ3JhbW1hcnMvamF2YXNjcmlwdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztvQkFFaUIsTUFBTTs7Ozs0QkFDZSxrQkFBa0I7Ozs7QUFIeEQsV0FBVyxDQUFDOztBQUtaLElBQU0sS0FBSyxHQUFHLGtCQUFLLElBQUksQ0FBQyxTQUFTLEVBQUUsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUM7O0FBRTdFLElBQU0sS0FBSSxHQUFHLFNBQVAsS0FBSSxDQUFJLElBQVksRUFBSztNQUFmLFFBQVEsR0FBVixJQUFZLENBQVYsUUFBUTs7QUFDdEIsTUFBTSxHQUFHLFVBQU8sS0FBSyx3QkFBaUIsS0FBSyxlQUFRLFFBQVEsYUFBUyxDQUFDO0FBQ3JFLFNBQU8sMEJBQWEsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0NBQ3JDLENBQUM7QUFDRixPQUFPLENBQUMsSUFBSSxHQUFHO0FBQ2IsbUJBQWlCLEVBQUU7QUFDakIsV0FBTyxFQUFFLE1BQU07QUFDZixRQUFJLEVBQUUsY0FBQyxPQUFPLEVBQUs7QUFDakIsVUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQy9CLFVBQU0sT0FBTyxHQUFHLDBCQUFhLHNCQUFzQixDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztBQUNuRSxhQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7S0FDbEI7R0FDRjtBQUNELGNBQVksRUFBRTtBQUNaLFdBQU8sRUFBRSxNQUFNO0FBQ2YsUUFBSSxFQUFFLGNBQUMsS0FBWTtVQUFWLFFBQVEsR0FBVixLQUFZLENBQVYsUUFBUTthQUFPLENBQUMsUUFBUSxDQUFDO0tBQUE7R0FDbkM7Q0FDRixDQUFDO0FBQ0YsT0FBTyxDQUFDLFVBQVUsR0FBRztBQUNuQixtQkFBaUIsRUFBRTtBQUNqQixXQUFPLHVCQUFBO0FBQ1AsUUFBSSxFQUFFLGNBQUMsT0FBTyxFQUFLO0FBQ2pCLFVBQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUMvQixVQUFNLFFBQVEsR0FBRywwQkFBYSxzQkFBc0IsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDbEUsYUFBTyxLQUFJLENBQUMsRUFBRSxRQUFRLEVBQVIsUUFBUSxFQUFFLENBQUMsQ0FBQztLQUMzQjtHQUNGO0FBQ0QsY0FBWSxFQUFFLEVBQUUsT0FBTyx1QkFBQSxFQUFFLElBQUksRUFBSixLQUFJLEVBQUU7Q0FDaEMsQ0FBQztBQUNGLE9BQU8sQ0FBQyxzQkFBc0IsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUM7QUFDckQsT0FBTyxDQUFDLHFCQUFxQixDQUFDLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQzs7QUFFcEQsT0FBTyxDQUFDLGlDQUFpQyxDQUFDLEdBQUc7QUFDM0MsbUJBQWlCLEVBQUU7QUFDakIsV0FBTyxFQUFFLFdBQVc7QUFDcEIsUUFBSSxFQUFFLGNBQUEsT0FBTzthQUFJLENBQUMsSUFBSSxFQUFFLFlBQVksRUFBRSxJQUFJLEVBQUUsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDO0tBQUE7R0FDL0Q7QUFDRCxjQUFZLEVBQUU7QUFDWixXQUFPLEVBQUUsV0FBVztBQUNwQixRQUFJLEVBQUUsY0FBQyxLQUFZO1VBQVYsUUFBUSxHQUFWLEtBQVksQ0FBVixRQUFRO2FBQU8sQ0FBQyxJQUFJLEVBQUUsWUFBWSxFQUFFLFFBQVEsQ0FBQztLQUFBO0dBQ3ZEO0NBQ0YsQ0FBQztBQUNGLE9BQU8sQ0FBQyxVQUFVLEdBQUc7QUFDbkIsbUJBQWlCLEVBQUU7QUFDakIsV0FBTyxFQUFFLFNBQVM7QUFDbEIsUUFBSSxFQUFFLGNBQUEsT0FBTzthQUFJLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQztLQUFBO0dBQzNDO0FBQ0QsY0FBWSxFQUFFO0FBQ1osV0FBTyxFQUFFLFNBQVM7QUFDbEIsUUFBSSxFQUFFLGNBQUMsS0FBWTtVQUFWLFFBQVEsR0FBVixLQUFZLENBQVYsUUFBUTthQUFPLENBQUMsUUFBUSxDQUFDO0tBQUE7R0FDbkM7Q0FDRixDQUFDIiwiZmlsZSI6Ii9ob21lL2JpbGx5Ly5hdG9tL3BhY2thZ2VzL3NjcmlwdC9saWIvZ3JhbW1hcnMvamF2YXNjcmlwdC5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBHcmFtbWFyVXRpbHMsIHsgY29tbWFuZCB9IGZyb20gJy4uL2dyYW1tYXItdXRpbHMnO1xuXG5jb25zdCBiYWJlbCA9IHBhdGguam9pbihfX2Rpcm5hbWUsICcuLi8uLicsICdub2RlX21vZHVsZXMnLCAnLmJpbicsICdiYWJlbCcpO1xuXG5jb25zdCBhcmdzID0gKHsgZmlsZXBhdGggfSkgPT4ge1xuICBjb25zdCBjbWQgPSBgJyR7YmFiZWx9JyAtLWZpbGVuYW1lICcke2JhYmVsfScgPCAnJHtmaWxlcGF0aH0nfCBub2RlYDtcbiAgcmV0dXJuIEdyYW1tYXJVdGlscy5mb3JtYXRBcmdzKGNtZCk7XG59O1xuZXhwb3J0cy5EYXJ0ID0ge1xuICAnU2VsZWN0aW9uIEJhc2VkJzoge1xuICAgIGNvbW1hbmQ6ICdkYXJ0JyxcbiAgICBhcmdzOiAoY29udGV4dCkgPT4ge1xuICAgICAgY29uc3QgY29kZSA9IGNvbnRleHQuZ2V0Q29kZSgpO1xuICAgICAgY29uc3QgdG1wRmlsZSA9IEdyYW1tYXJVdGlscy5jcmVhdGVUZW1wRmlsZVdpdGhDb2RlKGNvZGUsICcuZGFydCcpO1xuICAgICAgcmV0dXJuIFt0bXBGaWxlXTtcbiAgICB9LFxuICB9LFxuICAnRmlsZSBCYXNlZCc6IHtcbiAgICBjb21tYW5kOiAnZGFydCcsXG4gICAgYXJnczogKHsgZmlsZXBhdGggfSkgPT4gW2ZpbGVwYXRoXSxcbiAgfSxcbn07XG5leHBvcnRzLkphdmFTY3JpcHQgPSB7XG4gICdTZWxlY3Rpb24gQmFzZWQnOiB7XG4gICAgY29tbWFuZCxcbiAgICBhcmdzOiAoY29udGV4dCkgPT4ge1xuICAgICAgY29uc3QgY29kZSA9IGNvbnRleHQuZ2V0Q29kZSgpO1xuICAgICAgY29uc3QgZmlsZXBhdGggPSBHcmFtbWFyVXRpbHMuY3JlYXRlVGVtcEZpbGVXaXRoQ29kZShjb2RlLCAnLmpzJyk7XG4gICAgICByZXR1cm4gYXJncyh7IGZpbGVwYXRoIH0pO1xuICAgIH0sXG4gIH0sXG4gICdGaWxlIEJhc2VkJzogeyBjb21tYW5kLCBhcmdzIH0sXG59O1xuZXhwb3J0c1snQmFiZWwgRVM2IEphdmFTY3JpcHQnXSA9IGV4cG9ydHMuSmF2YVNjcmlwdDtcbmV4cG9ydHNbJ0phdmFTY3JpcHQgd2l0aCBKU1gnXSA9IGV4cG9ydHMuSmF2YVNjcmlwdDtcblxuZXhwb3J0c1snSmF2YVNjcmlwdCBmb3IgQXV0b21hdGlvbiAoSlhBKSddID0ge1xuICAnU2VsZWN0aW9uIEJhc2VkJzoge1xuICAgIGNvbW1hbmQ6ICdvc2FzY3JpcHQnLFxuICAgIGFyZ3M6IGNvbnRleHQgPT4gWyctbCcsICdKYXZhU2NyaXB0JywgJy1lJywgY29udGV4dC5nZXRDb2RlKCldLFxuICB9LFxuICAnRmlsZSBCYXNlZCc6IHtcbiAgICBjb21tYW5kOiAnb3Nhc2NyaXB0JyxcbiAgICBhcmdzOiAoeyBmaWxlcGF0aCB9KSA9PiBbJy1sJywgJ0phdmFTY3JpcHQnLCBmaWxlcGF0aF0sXG4gIH0sXG59O1xuZXhwb3J0cy5UeXBlU2NyaXB0ID0ge1xuICAnU2VsZWN0aW9uIEJhc2VkJzoge1xuICAgIGNvbW1hbmQ6ICd0cy1ub2RlJyxcbiAgICBhcmdzOiBjb250ZXh0ID0+IFsnLWUnLCBjb250ZXh0LmdldENvZGUoKV0sXG4gIH0sXG4gICdGaWxlIEJhc2VkJzoge1xuICAgIGNvbW1hbmQ6ICd0cy1ub2RlJyxcbiAgICBhcmdzOiAoeyBmaWxlcGF0aCB9KSA9PiBbZmlsZXBhdGhdLFxuICB9LFxufTtcbiJdfQ==