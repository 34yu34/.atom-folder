(function() {
  var GrammarUtils;

  GrammarUtils = require('../grammar-utils');

  exports.Lua = {
    'Selection Based': {
      command: 'lua',
      args: function(context) {
        var code, tmpFile;
        code = context.getCode();
        tmpFile = GrammarUtils.createTempFileWithCode(code);
        return [tmpFile];
      }
    },
    'File Based': {
      command: 'lua',
      args: function(arg) {
        var filepath;
        filepath = arg.filepath;
        return [filepath];
      }
    }
  };

  exports['Lua (WoW)'] = exports.Lua;

  exports.MoonScript = {
    'Selection Based': {
      command: 'moon',
      args: function(context) {
        return ['-e', context.getCode()];
      }
    },
    'File Based': {
      command: 'moon',
      args: function(arg) {
        var filepath;
        filepath = arg.filepath;
        return [filepath];
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYmlsbHkvLmF0b20vcGFja2FnZXMvc2NyaXB0L2xpYi9ncmFtbWFycy9sdWEuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxZQUFBLEdBQWUsT0FBQSxDQUFRLGtCQUFSOztFQUVmLE9BQU8sQ0FBQyxHQUFSLEdBQ0U7SUFBQSxpQkFBQSxFQUNFO01BQUEsT0FBQSxFQUFTLEtBQVQ7TUFDQSxJQUFBLEVBQU0sU0FBQyxPQUFEO0FBQ0osWUFBQTtRQUFBLElBQUEsR0FBTyxPQUFPLENBQUMsT0FBUixDQUFBO1FBQ1AsT0FBQSxHQUFVLFlBQVksQ0FBQyxzQkFBYixDQUFvQyxJQUFwQztBQUNWLGVBQU8sQ0FBQyxPQUFEO01BSEgsQ0FETjtLQURGO0lBT0EsWUFBQSxFQUNFO01BQUEsT0FBQSxFQUFTLEtBQVQ7TUFDQSxJQUFBLEVBQU0sU0FBQyxHQUFEO0FBQWdCLFlBQUE7UUFBZCxXQUFEO2VBQWUsQ0FBQyxRQUFEO01BQWhCLENBRE47S0FSRjs7O0VBV0YsT0FBUSxDQUFBLFdBQUEsQ0FBUixHQUF1QixPQUFPLENBQUM7O0VBRS9CLE9BQU8sQ0FBQyxVQUFSLEdBQ0U7SUFBQSxpQkFBQSxFQUNFO01BQUEsT0FBQSxFQUFTLE1BQVQ7TUFDQSxJQUFBLEVBQU0sU0FBQyxPQUFEO2VBQWEsQ0FBQyxJQUFELEVBQU8sT0FBTyxDQUFDLE9BQVIsQ0FBQSxDQUFQO01BQWIsQ0FETjtLQURGO0lBSUEsWUFBQSxFQUNFO01BQUEsT0FBQSxFQUFTLE1BQVQ7TUFDQSxJQUFBLEVBQU0sU0FBQyxHQUFEO0FBQWdCLFlBQUE7UUFBZCxXQUFEO2VBQWUsQ0FBQyxRQUFEO01BQWhCLENBRE47S0FMRjs7QUFqQkYiLCJzb3VyY2VzQ29udGVudCI6WyJHcmFtbWFyVXRpbHMgPSByZXF1aXJlICcuLi9ncmFtbWFyLXV0aWxzJ1xuXG5leHBvcnRzLkx1YSA9XG4gICdTZWxlY3Rpb24gQmFzZWQnOlxuICAgIGNvbW1hbmQ6ICdsdWEnXG4gICAgYXJnczogKGNvbnRleHQpIC0+XG4gICAgICBjb2RlID0gY29udGV4dC5nZXRDb2RlKClcbiAgICAgIHRtcEZpbGUgPSBHcmFtbWFyVXRpbHMuY3JlYXRlVGVtcEZpbGVXaXRoQ29kZShjb2RlKVxuICAgICAgcmV0dXJuIFt0bXBGaWxlXVxuXG4gICdGaWxlIEJhc2VkJzpcbiAgICBjb21tYW5kOiAnbHVhJ1xuICAgIGFyZ3M6ICh7ZmlsZXBhdGh9KSAtPiBbZmlsZXBhdGhdXG5cbmV4cG9ydHNbJ0x1YSAoV29XKSddID0gZXhwb3J0cy5MdWFcblxuZXhwb3J0cy5Nb29uU2NyaXB0ID1cbiAgJ1NlbGVjdGlvbiBCYXNlZCc6XG4gICAgY29tbWFuZDogJ21vb24nXG4gICAgYXJnczogKGNvbnRleHQpIC0+IFsnLWUnLCBjb250ZXh0LmdldENvZGUoKV1cblxuICAnRmlsZSBCYXNlZCc6XG4gICAgY29tbWFuZDogJ21vb24nXG4gICAgYXJnczogKHtmaWxlcGF0aH0pIC0+IFtmaWxlcGF0aF1cbiJdfQ==
