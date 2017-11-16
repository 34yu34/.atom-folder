(function() {
  var GrammarUtils, command, path;

  path = require('path');

  command = (GrammarUtils = require('../grammar-utils')).command;

  exports['Fortran - Fixed Form'] = {
    'File Based': {
      command: command,
      args: function(arg) {
        var cmd, filepath;
        filepath = arg.filepath;
        cmd = "gfortran '" + filepath + "' -ffixed-form -o /tmp/f.out && /tmp/f.out";
        return GrammarUtils.formatArgs(cmd);
      }
    }
  };

  exports['Fortran - Free Form'] = {
    'File Based': {
      command: command,
      args: function(arg) {
        var cmd, filepath;
        filepath = arg.filepath;
        cmd = "gfortran '" + filepath + "' -ffree-form -o /tmp/f90.out && /tmp/f90.out";
        return GrammarUtils.formatArgs(cmd);
      }
    }
  };

  exports['Fortran - Modern'] = exports['Fortran - Free Form'];

  exports['Fortran - Punchcard'] = exports['Fortran - Fixed Form'];

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYmlsbHkvLmF0b20vcGFja2FnZXMvc2NyaXB0L2xpYi9ncmFtbWFycy9mb3J0cmFuLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztFQUNOLFVBQVcsQ0FBQSxZQUFBLEdBQWUsT0FBQSxDQUFRLGtCQUFSLENBQWY7O0VBRVosT0FBUSxDQUFBLHNCQUFBLENBQVIsR0FDRTtJQUFBLFlBQUEsRUFBYztNQUNaLFNBQUEsT0FEWTtNQUVaLElBQUEsRUFBTSxTQUFDLEdBQUQ7QUFDSixZQUFBO1FBRE0sV0FBRDtRQUNMLEdBQUEsR0FBTSxZQUFBLEdBQWEsUUFBYixHQUFzQjtBQUM1QixlQUFPLFlBQVksQ0FBQyxVQUFiLENBQXdCLEdBQXhCO01BRkgsQ0FGTTtLQUFkOzs7RUFNRixPQUFRLENBQUEscUJBQUEsQ0FBUixHQUNFO0lBQUEsWUFBQSxFQUFjO01BQ1osU0FBQSxPQURZO01BRVosSUFBQSxFQUFNLFNBQUMsR0FBRDtBQUNKLFlBQUE7UUFETSxXQUFEO1FBQ0wsR0FBQSxHQUFNLFlBQUEsR0FBYSxRQUFiLEdBQXNCO0FBQzVCLGVBQU8sWUFBWSxDQUFDLFVBQWIsQ0FBd0IsR0FBeEI7TUFGSCxDQUZNO0tBQWQ7OztFQU1GLE9BQVEsQ0FBQSxrQkFBQSxDQUFSLEdBQThCLE9BQVEsQ0FBQSxxQkFBQTs7RUFDdEMsT0FBUSxDQUFBLHFCQUFBLENBQVIsR0FBaUMsT0FBUSxDQUFBLHNCQUFBO0FBbEJ6QyIsInNvdXJjZXNDb250ZW50IjpbInBhdGggPSByZXF1aXJlICdwYXRoJ1xue2NvbW1hbmR9ID0gR3JhbW1hclV0aWxzID0gcmVxdWlyZSAnLi4vZ3JhbW1hci11dGlscydcblxuZXhwb3J0c1snRm9ydHJhbiAtIEZpeGVkIEZvcm0nXSA9XG4gICdGaWxlIEJhc2VkJzoge1xuICAgIGNvbW1hbmRcbiAgICBhcmdzOiAoe2ZpbGVwYXRofSkgLT5cbiAgICAgIGNtZCA9IFwiZ2ZvcnRyYW4gJyN7ZmlsZXBhdGh9JyAtZmZpeGVkLWZvcm0gLW8gL3RtcC9mLm91dCAmJiAvdG1wL2Yub3V0XCJcbiAgICAgIHJldHVybiBHcmFtbWFyVXRpbHMuZm9ybWF0QXJncyhjbWQpXG4gIH1cbmV4cG9ydHNbJ0ZvcnRyYW4gLSBGcmVlIEZvcm0nXSA9XG4gICdGaWxlIEJhc2VkJzoge1xuICAgIGNvbW1hbmRcbiAgICBhcmdzOiAoe2ZpbGVwYXRofSkgLT5cbiAgICAgIGNtZCA9IFwiZ2ZvcnRyYW4gJyN7ZmlsZXBhdGh9JyAtZmZyZWUtZm9ybSAtbyAvdG1wL2Y5MC5vdXQgJiYgL3RtcC9mOTAub3V0XCJcbiAgICAgIHJldHVybiBHcmFtbWFyVXRpbHMuZm9ybWF0QXJncyhjbWQpXG4gIH1cbmV4cG9ydHNbJ0ZvcnRyYW4gLSBNb2Rlcm4nXSA9IGV4cG9ydHNbJ0ZvcnRyYW4gLSBGcmVlIEZvcm0nXVxuZXhwb3J0c1snRm9ydHJhbiAtIFB1bmNoY2FyZCddID0gZXhwb3J0c1snRm9ydHJhbiAtIEZpeGVkIEZvcm0nXVxuIl19
