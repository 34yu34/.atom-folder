(function() {
  var GrammarUtils, args, babel, bin, coffee, command, path;

  path = require('path');

  command = (GrammarUtils = require('../grammar-utils')).command;

  bin = path.join(__dirname, '../..', 'node_modules', '.bin');

  coffee = path.join(bin, 'coffee');

  babel = path.join(bin, 'babel');

  args = function(arg) {
    var cmd, filepath;
    filepath = arg.filepath;
    cmd = "'" + coffee + "' -p '" + filepath + "'|'" + babel + "' --filename '" + bin + "'| node";
    return GrammarUtils.formatArgs(cmd);
  };

  exports.CoffeeScript = {
    'Selection Based': {
      command: command,
      args: function(context) {
        var code, filepath, lit, ref, scopeName;
        scopeName = (ref = atom.workspace.getActiveTextEditor()) != null ? ref.getGrammar().scopeName : void 0;
        lit = (scopeName != null ? scopeName.includes('lit') : void 0) ? 'lit' : '';
        code = context.getCode();
        filepath = GrammarUtils.createTempFileWithCode(code, "." + lit + "coffee");
        return args({
          filepath: filepath
        });
      }
    },
    'File Based': {
      command: command,
      args: args
    }
  };

  exports['CoffeeScript (Literate)'] = exports.CoffeeScript;

  exports.IcedCoffeeScript = {
    'Selection Based': {
      command: 'iced',
      args: function(context) {
        return ['-e', context.getCode()];
      }
    },
    'File Based': {
      command: 'iced',
      args: function(arg) {
        var filepath;
        filepath = arg.filepath;
        return [filepath];
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYmlsbHkvLmF0b20vcGFja2FnZXMvc2NyaXB0L2xpYi9ncmFtbWFycy9jb2ZmZWVzY3JpcHQuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7O0VBQ04sVUFBVyxDQUFBLFlBQUEsR0FBZSxPQUFBLENBQVEsa0JBQVIsQ0FBZjs7RUFFWixHQUFBLEdBQU0sSUFBSSxDQUFDLElBQUwsQ0FBVSxTQUFWLEVBQXFCLE9BQXJCLEVBQThCLGNBQTlCLEVBQThDLE1BQTlDOztFQUNOLE1BQUEsR0FBUyxJQUFJLENBQUMsSUFBTCxDQUFVLEdBQVYsRUFBZSxRQUFmOztFQUNULEtBQUEsR0FBUSxJQUFJLENBQUMsSUFBTCxDQUFVLEdBQVYsRUFBZSxPQUFmOztFQUVSLElBQUEsR0FBTyxTQUFDLEdBQUQ7QUFDTCxRQUFBO0lBRE8sV0FBRDtJQUNOLEdBQUEsR0FBTSxHQUFBLEdBQUksTUFBSixHQUFXLFFBQVgsR0FBbUIsUUFBbkIsR0FBNEIsS0FBNUIsR0FBaUMsS0FBakMsR0FBdUMsZ0JBQXZDLEdBQXVELEdBQXZELEdBQTJEO0FBQ2pFLFdBQU8sWUFBWSxDQUFDLFVBQWIsQ0FBd0IsR0FBeEI7RUFGRjs7RUFJUCxPQUFPLENBQUMsWUFBUixHQUNFO0lBQUEsaUJBQUEsRUFBbUI7TUFDakIsU0FBQSxPQURpQjtNQUVqQixJQUFBLEVBQU0sU0FBQyxPQUFEO0FBQ0osWUFBQTtRQUFDLHNFQUFpRCxDQUFFLFVBQXRDLENBQUE7UUFDZCxHQUFBLHdCQUFTLFNBQVMsQ0FBRSxRQUFYLENBQW9CLEtBQXBCLFdBQUgsR0FBa0MsS0FBbEMsR0FBNkM7UUFDbkQsSUFBQSxHQUFPLE9BQU8sQ0FBQyxPQUFSLENBQUE7UUFDUCxRQUFBLEdBQVcsWUFBWSxDQUFDLHNCQUFiLENBQW9DLElBQXBDLEVBQTBDLEdBQUEsR0FBSSxHQUFKLEdBQVEsUUFBbEQ7QUFDWCxlQUFPLElBQUEsQ0FBSztVQUFDLFVBQUEsUUFBRDtTQUFMO01BTEgsQ0FGVztLQUFuQjtJQVNBLFlBQUEsRUFBYztNQUFFLFNBQUEsT0FBRjtNQUFXLE1BQUEsSUFBWDtLQVRkOzs7RUFXRixPQUFRLENBQUEseUJBQUEsQ0FBUixHQUFxQyxPQUFPLENBQUM7O0VBRTdDLE9BQU8sQ0FBQyxnQkFBUixHQUNFO0lBQUEsaUJBQUEsRUFDRTtNQUFBLE9BQUEsRUFBUyxNQUFUO01BQ0EsSUFBQSxFQUFNLFNBQUMsT0FBRDtlQUFhLENBQUMsSUFBRCxFQUFPLE9BQU8sQ0FBQyxPQUFSLENBQUEsQ0FBUDtNQUFiLENBRE47S0FERjtJQUlBLFlBQUEsRUFDRTtNQUFBLE9BQUEsRUFBUyxNQUFUO01BQ0EsSUFBQSxFQUFNLFNBQUMsR0FBRDtBQUFnQixZQUFBO1FBQWQsV0FBRDtlQUFlLENBQUMsUUFBRDtNQUFoQixDQUROO0tBTEY7O0FBMUJGIiwic291cmNlc0NvbnRlbnQiOlsicGF0aCA9IHJlcXVpcmUgJ3BhdGgnXG57Y29tbWFuZH0gPSBHcmFtbWFyVXRpbHMgPSByZXF1aXJlICcuLi9ncmFtbWFyLXV0aWxzJ1xuXG5iaW4gPSBwYXRoLmpvaW4gX19kaXJuYW1lLCAnLi4vLi4nLCAnbm9kZV9tb2R1bGVzJywgJy5iaW4nXG5jb2ZmZWUgPSBwYXRoLmpvaW4gYmluLCAnY29mZmVlJ1xuYmFiZWwgPSBwYXRoLmpvaW4gYmluLCAnYmFiZWwnXG5cbmFyZ3MgPSAoe2ZpbGVwYXRofSkgLT5cbiAgY21kID0gXCInI3tjb2ZmZWV9JyAtcCAnI3tmaWxlcGF0aH0nfCcje2JhYmVsfScgLS1maWxlbmFtZSAnI3tiaW59J3wgbm9kZVwiXG4gIHJldHVybiBHcmFtbWFyVXRpbHMuZm9ybWF0QXJncyhjbWQpXG5cbmV4cG9ydHMuQ29mZmVlU2NyaXB0ID1cbiAgJ1NlbGVjdGlvbiBCYXNlZCc6IHtcbiAgICBjb21tYW5kXG4gICAgYXJnczogKGNvbnRleHQpIC0+XG4gICAgICB7c2NvcGVOYW1lfSA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKT8uZ2V0R3JhbW1hcigpXG4gICAgICBsaXQgPSBpZiBzY29wZU5hbWU/LmluY2x1ZGVzICdsaXQnIHRoZW4gJ2xpdCcgZWxzZSAnJ1xuICAgICAgY29kZSA9IGNvbnRleHQuZ2V0Q29kZSgpXG4gICAgICBmaWxlcGF0aCA9IEdyYW1tYXJVdGlscy5jcmVhdGVUZW1wRmlsZVdpdGhDb2RlKGNvZGUsIFwiLiN7bGl0fWNvZmZlZVwiKVxuICAgICAgcmV0dXJuIGFyZ3Moe2ZpbGVwYXRofSlcbiAgfVxuICAnRmlsZSBCYXNlZCc6IHsgY29tbWFuZCwgYXJncyB9XG5cbmV4cG9ydHNbJ0NvZmZlZVNjcmlwdCAoTGl0ZXJhdGUpJ10gPSBleHBvcnRzLkNvZmZlZVNjcmlwdFxuXG5leHBvcnRzLkljZWRDb2ZmZWVTY3JpcHQgPVxuICAnU2VsZWN0aW9uIEJhc2VkJzpcbiAgICBjb21tYW5kOiAnaWNlZCdcbiAgICBhcmdzOiAoY29udGV4dCkgLT4gWyctZScsIGNvbnRleHQuZ2V0Q29kZSgpXVxuXG4gICdGaWxlIEJhc2VkJzpcbiAgICBjb21tYW5kOiAnaWNlZCdcbiAgICBhcmdzOiAoe2ZpbGVwYXRofSkgLT4gW2ZpbGVwYXRoXVxuIl19
