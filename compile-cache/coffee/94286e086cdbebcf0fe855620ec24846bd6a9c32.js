(function() {
  var $, RsenseClient, TableParser, exec, os,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  $ = require('jquery');

  TableParser = require('table-parser');

  exec = require('child_process').exec;

  os = require('os');

  String.prototype.replaceAll = function(s, r) {
    return this.split(s).join(r);
  };

  module.exports = RsenseClient = (function() {
    function RsenseClient() {
      this.checkCompletion = bind(this.checkCompletion, this);
      this.stopRsense = bind(this.stopRsense, this);
      this.stopRsenseUnix = bind(this.stopRsenseUnix, this);
      this.startRsenseCommand = bind(this.startRsenseCommand, this);
      this.startRsenseWin32 = bind(this.startRsenseWin32, this);
      this.startRsenseUnix = bind(this.startRsenseUnix, this);
      this.projectPath = atom.project.getPaths()[0];
      if (!this.projectPath) {
        this.projectPath = '.';
      }
      this.rsensePath = atom.config.get('autocomplete-ruby.rsensePath');
      this.port = atom.config.get('autocomplete-ruby.port');
      this.serverUrl = "http://localhost:" + this.port;
      this.rsenseStarted = false;
      this.rsenseProcess = null;
    }

    RsenseClient.prototype.startRsenseUnix = function() {
      var start;
      start = this.startRsenseCommand;
      return exec("ps -ef | head -1; ps -ef | grep java", function(error, stdout, stderr) {
        if (error !== null) {
          return atom.notifications.addError('Error looking for resense process', {
            detail: "autocomplete-ruby: exec error: " + error,
            dismissable: true
          });
        } else {
          this.rsenseProcess = $.grep(TableParser.parse(stdout), function(process) {
            return process.CMD.join(' ').match(/rsense.*--port.*--path/);
          })[0];
          if (this.rsenseProcess === void 0 || this.rsenseProcess === null) {
            return start();
          } else {
            return this.rsenseStarted = true;
          }
        }
      });
    };

    RsenseClient.prototype.startRsenseWin32 = function() {
      var start;
      if (this.rsenseStarted) {
        return;
      }
      start = this.startRsenseCommand;
      return exec(this.rsensePath + " stop", (function(_this) {
        return function(error, stdout, stderr) {
          if (error === null) {
            return start();
          } else {
            atom.notifications.addError('Error stopping rsense', {
              detail: "autocomplete-ruby: exec error: " + error,
              dismissable: true
            });
            return _this.rsenseStarted = false;
          }
        };
      })(this));
    };

    RsenseClient.prototype.startRsenseCommand = function() {
      if (this.rsenseStarted) {
        return;
      }
      return exec(this.rsensePath + " start --port " + this.port + " --path " + this.projectPath, function(error, stdout, stderr) {
        if (error !== null) {
          return atom.notifications.addError('Error starting rsense', {
            detail: ("autocomplete-ruby: exec error: " + error + os.EOL) + "(You might need to set the rsense path, see the readme)",
            dismissable: true
          });
        } else {
          return this.rsenseStarted = true;
        }
      });
    };

    RsenseClient.prototype.stopRsenseUnix = function() {
      var stopCommand;
      stopCommand = this.stopRsense;
      return exec("ps -ef | head -1; ps -ef | grep atom", function(error, stdout, stderr) {
        if (error !== null) {
          return atom.notifications.addError('Error looking for atom process', {
            detail: "autocomplete-ruby: exec error: " + error,
            dismissable: true
          });
        } else {
          this.atomProcesses = $.grep(TableParser.parse(stdout), function(process) {
            return process.CMD.join(' ').match(/--type=renderer.*--node-integration=true/);
          });
          if (this.atomProcesses.length < 2) {
            if (this.rsenseProcess) {
              process.kill(this.rsenseProcess.PID[0], 'SIGKILL');
            }
            return stopCommand();
          }
        }
      });
    };

    RsenseClient.prototype.stopRsense = function() {
      if (!this.rsenseStarted) {
        return;
      }
      return exec(this.rsensePath + " stop", function(error, stdout, stderr) {
        if (error !== null) {
          return atom.notifications.addError('Error stopping rsense', {
            detail: "autocomplete-ruby: exec error: " + error,
            dismissable: true
          });
        } else {
          return this.rsenseStarted = false;
        }
      });
    };

    RsenseClient.prototype.checkCompletion = function(editor, buffer, row, column, callback) {
      var code, request;
      code = buffer.getText().replaceAll('\n', '\n').replaceAll('%', '%25');
      request = {
        command: 'code_completion',
        project: this.projectPath,
        file: editor.getPath(),
        code: code,
        location: {
          row: row,
          column: column
        }
      };
      $.ajax(this.serverUrl, {
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(request),
        error: function(jqXHR, textStatus, errorThrown) {
          callback([]);
          return console.error(textStatus);
        },
        success: function(data, textStatus, jqXHR) {
          return callback(data.completions);
        }
      });
      return [];
    };

    return RsenseClient;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYmlsbHkvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLXJ1YnkvbGliL2F1dG9jb21wbGV0ZS1ydWJ5LWNsaWVudC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLHNDQUFBO0lBQUE7O0VBQUEsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxRQUFSOztFQUNKLFdBQUEsR0FBYyxPQUFBLENBQVEsY0FBUjs7RUFDZCxJQUFBLEdBQU8sT0FBQSxDQUFRLGVBQVIsQ0FBd0IsQ0FBQzs7RUFDaEMsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSOztFQUNMLE1BQU0sQ0FBQyxTQUFTLENBQUMsVUFBakIsR0FBOEIsU0FBQyxDQUFELEVBQUksQ0FBSjtXQUFVLElBQUMsQ0FBQSxLQUFELENBQU8sQ0FBUCxDQUFTLENBQUMsSUFBVixDQUFlLENBQWY7RUFBVjs7RUFFOUIsTUFBTSxDQUFDLE9BQVAsR0FDTTtJQUNTLHNCQUFBOzs7Ozs7O01BQ1gsSUFBQyxDQUFBLFdBQUQsR0FBZSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQWIsQ0FBQSxDQUF3QixDQUFBLENBQUE7TUFDdkMsSUFBQSxDQUEwQixJQUFDLENBQUEsV0FBM0I7UUFBQSxJQUFDLENBQUEsV0FBRCxHQUFlLElBQWY7O01BQ0EsSUFBQyxDQUFBLFVBQUQsR0FBYyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsOEJBQWhCO01BQ2QsSUFBQyxDQUFBLElBQUQsR0FBUSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isd0JBQWhCO01BQ1IsSUFBQyxDQUFBLFNBQUQsR0FBYSxtQkFBQSxHQUFvQixJQUFDLENBQUE7TUFDbEMsSUFBQyxDQUFBLGFBQUQsR0FBaUI7TUFDakIsSUFBQyxDQUFBLGFBQUQsR0FBaUI7SUFQTjs7MkJBV2IsZUFBQSxHQUFpQixTQUFBO0FBQ2YsVUFBQTtNQUFBLEtBQUEsR0FBUSxJQUFD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LElBQUEsRUFBTSxNQUFNLENBQUMsT0FBUCxDQUFBLENBRk47UUFHQSxJQUFBLEVBQU0sSUFITjtRQUlBLFFBQUEsRUFDRTtVQUFBLEdBQUEsRUFBSyxHQUFMO1VBQ0EsTUFBQSxFQUFRLE1BRFI7U0FMRjs7TUFRRixDQUFDLENBQUMsSUFBRixDQUFPLElBQUMsQ0FBQSxTQUFSLEVBQ0U7UUFBQSxJQUFBLEVBQU0sTUFBTjtRQUNBLFFBQUEsRUFBVSxNQURWO1FBRUEsV0FBQSxFQUFhLGtCQUZiO1FBR0EsSUFBQSxFQUFNLElBQUksQ0FBQyxTQUFMLENBQWUsT0FBZixDQUhOO1FBSUEsS0FBQSxFQUFPLFNBQUMsS0FBRCxFQUFRLFVBQVIsRUFBb0IsV0FBcEI7VUFHTCxRQUFBLENBQVMsRUFBVDtpQkFDQSxPQUFPLENBQUMsS0FBUixDQUFjLFVBQWQ7UUFKSyxDQUpQO1FBU0EsT0FBQSxFQUFTLFNBQUMsSUFBRCxFQUFPLFVBQVAsRUFBbUIsS0FBbkI7aUJBQ1AsUUFBQSxDQUFTLElBQUksQ0FBQyxXQUFkO1FBRE8sQ0FUVDtPQURGO0FBYUEsYUFBTztJQTFCUTs7Ozs7QUF4R25CIiwic291cmNlc0NvbnRlbnQiOlsiJCA9IHJlcXVpcmUoJ2pxdWVyeScpXG5UYWJsZVBhcnNlciA9IHJlcXVpcmUoJ3RhYmxlLXBhcnNlcicpXG5leGVjID0gcmVxdWlyZSgnY2hpbGRfcHJvY2VzcycpLmV4ZWNcbm9zID0gcmVxdWlyZSgnb3MnKVxuU3RyaW5nLnByb3RvdHlwZS5yZXBsYWNlQWxsID0gKHMsIHIpIC0+IEBzcGxpdChzKS5qb2luKHIpXG5cbm1vZHVsZS5leHBvcnRzID1cbmNsYXNzIFJzZW5zZUNsaWVudFxuICBjb25zdHJ1Y3RvcjogLT5cbiAgICBAcHJvamVjdFBhdGggPSBhdG9tLnByb2plY3QuZ2V0UGF0aHMoKVswXVxuICAgIEBwcm9qZWN0UGF0aCA9ICcuJyB1bmxlc3MgQHByb2plY3RQYXRoXG4gICAgQHJzZW5zZVBhdGggPSBhdG9tLmNvbmZpZy5nZXQoJ2F1dG9jb21wbGV0ZS1ydWJ5LnJzZW5zZVBhdGgnKVxuICAgIEBwb3J0ID0gYXRvbS5jb25maWcuZ2V0KCdhdXRvY29tcGxldGUtcnVieS5wb3J0JylcbiAgICBAc2VydmVyVXJsID0gXCJodHRwOi8vbG9jYWxob3N0OiN7QHBvcnR9XCJcbiAgICBAcnNlbnNlU3RhcnRlZCA9IGZhbHNlXG4gICAgQHJzZW5zZVByb2Nlc3MgPSBudWxsXG5cbiAgIyBDaGVjayBpZiBhbiByc2Vuc2Ugc2VydmVyIGlzIGFscmVhZHkgcnVubmluZy5cbiAgIyBUaGlzIGNhbiBkZXRlY3QgYWxsIHJzZW5zZSBwcm9jZXNzZXMgZXZlbiB0aG9zZSB3aXRob3V0IHBpZCBmaWxlcy5cbiAgc3RhcnRSc2Vuc2VVbml4OiA9PlxuICAgIHN0YXJ0ID0gQHN0YXJ0UnNlbnNlQ29tbWFuZFxuXG4gICAgZXhlYyhcInBzIC1lZiB8IGhlYWQgLTE7IHBzIC1lZiB8IGdyZXAgamF2YVwiLFxuICAgICAgKGVycm9yLCBzdGRvdXQsIHN0ZGVycikgLT5cbiAgICAgICAgaWYgZXJyb3IgIT0gbnVsbFxuICAgICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcignRXJyb3IgbG9va2luZyBmb3IgcmVzZW5zZSBwcm9jZXNzJyxcbiAgICAgICAgICAgICAge2RldGFpbDogXCJhdXRvY29tcGxldGUtcnVieTogZXhlYyBlcnJvcjogI3tlcnJvcn1cIiwgZGlzbWlzc2FibGU6IHRydWV9XG4gICAgICAgICAgICApXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBAcnNlbnNlUHJvY2VzcyA9ICQuZ3JlcChUYWJsZVBhcnNlci5wYXJzZShzdGRvdXQpLCAocHJvY2VzcykgLT5cbiAgICAgICAgICAgIHByb2Nlc3MuQ01ELmpvaW4oJyAnKS5tYXRjaCggL3JzZW5zZS4qLS1wb3J0LiotLXBhdGgvIClcbiAgICAgICAgICApWzBdXG4gICAgICAgICAgaWYgQHJzZW5zZVByb2Nlc3MgPT0gdW5kZWZpbmVkIHx8IEByc2Vuc2VQcm9jZXNzID09IG51bGxcbiAgICAgICAgICAgIHN0YXJ0KClcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBAcnNlbnNlU3RhcnRlZCA9IHRydWVcbiAgICApXG5cbiAgIyBCZWZvcmUgdHJ5aW5nIHRvIHN0YXJ0IGluIFdpbmRvd3Mgd2UgbmVlZCB0byBraWxsIGFueSBleGlzdGluZyByc2Vuc2Ugc2VydmVycywgc29cbiAgIyBhcyB0byBub3QgZW5kIHVwIHdpdGggbXVsdGlwbGUgcnNlbnNlIHNlcnZzZXJzIHVua2lsbGFibGUgYnkgJ3JzZW5zZSBzdG9wJ1xuICAjIFRoaXMgbWVhbnMgdGhhdCBydW5uaW5nIHR3byBhdG9tcyBhbmQgY2xvc2luZyBvbmUsIGtpbGxzIHJzZW5zZSBmb3IgdGhlIG90aGVyXG4gIHN0YXJ0UnNlbnNlV2luMzI6ID0+XG4gICAgcmV0dXJuIGlmIEByc2Vuc2VTdGFydGVkXG4gICAgc3RhcnQgPSBAc3RhcnRSc2Vuc2VDb21tYW5kXG5cbiAgICBleGVjKFwiI3tAcnNlbnNlUGF0aH0gc3RvcFwiLFxuICAgICAgKGVycm9yLCBzdGRvdXQsIHN0ZGVycikgPT5cbiAgICAgICAgaWYgZXJyb3IgPT0gbnVsbFxuICAgICAgICAgIHN0YXJ0KClcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcignRXJyb3Igc3RvcHBpbmcgcnNlbnNlJyxcbiAgICAgICAgICAgICAge2RldGFpbDogXCJhdXRvY29tcGxldGUtcnVieTogZXhlYyBlcnJvcjogI3tlcnJvcn1cIiwgZGlzbWlzc2FibGU6IHRydWV9XG4gICAgICAgICAgICApXG4gICAgICAgICAgQHJzZW5zZVN0YXJ0ZWQgPSBmYWxzZVxuICAgIClcblxuICBzdGFydFJzZW5zZUNvbW1hbmQ6ID0+XG4gICAgcmV0dXJuIGlmIEByc2Vuc2VTdGFydGVkXG4gICAgZXhlYyhcIiN7QHJzZW5zZVBhdGh9IHN0YXJ0IC0tcG9ydCAje0Bwb3J0fSAtLXBhdGggI3tAcHJvamVjdFBhdGh9XCIsXG4gICAgICAoZXJyb3IsIHN0ZG91dCwgc3RkZXJyKSAtPlxuICAgICAgICBpZiBlcnJvciAhPSBudWxsXG4gICAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKCdFcnJvciBzdGFydGluZyByc2Vuc2UnLFxuICAgICAgICAgICAgICB7ZGV0YWlsOiBcImF1dG9jb21wbGV0ZS1ydWJ5OiBleGVjIGVycm9yOiAje2Vycm9yfSN7b3MuRU9MfVwiICtcbiAgICAgICAgICAgICAgXCIoWW91IG1pZ2h0IG5lZWQgdG8gc2V0IHRoZSByc2Vuc2UgcGF0aCwgc2VlIHRoZSByZWFkbWUpXCIsXG4gICAgICAgICAgICAgIGRpc21pc3NhYmxlOiB0cnVlfVxuICAgICAgICAgICAgKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgQHJzZW5zZVN0YXJ0ZWQgPSB0cnVlXG4gICAgKVxuXG4gICMgRmlyc3QgY291bnQgaG93IG1hbnkgYXRvbSB3aW5kb3dzIGFyZSBvcGVuLlxuICAjIElmIHRoZXJlIGlzIG9ubHkgb25lIG9wZW4sIHRoZW4ga2lsbCB0aGUgcnNlbnNlIHByb2Nlc3MuXG4gICMgVGhpcyBpcyBhbHNvIGFibGUgdG8ga2lsbCBhbiByc2Vuc2UgcHJvY2VzcyB3aXRob3V0IGEgcGlkIGZpbGUuXG4gICMgT3RoZXJ3aXNlIGRvIG5vdGhpbmcgc28geW91IHdpbGwgc3RpbGwgYmUgYWJsZSB0byB1c2UgcnNlbnNlIGluIG90aGVyIHdpbmRvd3MuXG4gIHN0b3BSc2Vuc2VVbml4OiA9PlxuICAgIHN0b3BDb21tYW5kID0gQHN0b3BSc2Vuc2VcblxuICAgIGV4ZWMoXCJwcyAtZWYgfCBoZWFkIC0xOyBwcyAtZWYgfCBncmVwIGF0b21cIixcbiAgICAgIChlcnJvciwgc3Rkb3V0LCBzdGRlcnIpIC0+XG4gICAgICAgIGlmIGVycm9yICE9IG51bGxcbiAgICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IoJ0Vycm9yIGxvb2tpbmcgZm9yIGF0b20gcHJvY2VzcycsXG4gICAgICAgICAgICAgIHtkZXRhaWw6IFwiYXV0b2NvbXBsZXRlLXJ1Ynk6IGV4ZWMgZXJyb3I6ICN7ZXJyb3J9XCIsIGRpc21pc3NhYmxlOiB0cnVlfVxuICAgICAgICAgICAgKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgQGF0b21Qcm9jZXNzZXMgPSAkLmdyZXAoVGFibGVQYXJzZXIucGFyc2Uoc3Rkb3V0KSwgKHByb2Nlc3MpIC0+XG4gICAgICAgICAgICBwcm9jZXNzLkNNRC5qb2luKCcgJykubWF0Y2goIC8tLXR5cGU9cmVuZGVyZXIuKi0tbm9kZS1pbnRlZ3JhdGlvbj10cnVlLyApXG4gICAgICAgICAgKVxuICAgICAgICAgIGlmIEBhdG9tUHJvY2Vzc2VzLmxlbmd0aCA8IDJcbiAgICAgICAgICAgIHByb2Nlc3Mua2lsbChAcnNlbnNlUHJvY2Vzcy5QSURbMF0sICdTSUdLSUxMJykgaWYgQHJzZW5zZVByb2Nlc3NcbiAgICAgICAgICAgIHN0b3BDb21tYW5kKClcbiAgICApXG5cbiAgc3RvcFJzZW5zZTogPT5cbiAgICByZXR1cm4gaWYgIUByc2Vuc2VTdGFydGVkXG4gICAgZXhlYyhcIiN7QHJzZW5zZVBhdGh9IHN0b3BcIixcbiAgICAgIChlcnJvciwgc3Rkb3V0LCBzdGRlcnIpIC0+XG4gICAgICAgIGlmIGVycm9yICE9IG51bGxcbiAgICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IoJ0Vycm9yIHN0b3BwaW5nIHJzZW5zZScsXG4gICAgICAgICAgICAgIHtkZXRhaWw6IFwiYXV0b2NvbXBsZXRlLXJ1Ynk6IGV4ZWMgZXJyb3I6ICN7ZXJyb3J9XCIsIGRpc21pc3NhYmxlOiB0cnVlfVxuICAgICAgICAgICAgKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgQHJzZW5zZVN0YXJ0ZWQgPSBmYWxzZVxuICAgIClcblxuICBjaGVja0NvbXBsZXRpb246IChlZGl0b3IsIGJ1ZmZlciwgcm93LCBjb2x1bW4sIGNhbGxiYWNrKSA9PlxuICAgIGNvZGUgPSBidWZmZXIuZ2V0VGV4dCgpLnJlcGxhY2VBbGwoJ1xcbicsICdcXG4nKS5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXBsYWNlQWxsKCclJywgJyUyNScpXG5cbiAgICByZXF1ZXN0ID1cbiAgICAgIGNvbW1hbmQ6ICdjb2RlX2NvbXBsZXRpb24nXG4gICAgICBwcm9qZWN0OiBAcHJvamVjdFBhdGhcbiAgICAgIGZpbGU6IGVkaXRvci5nZXRQYXRoKClcbiAgICAgIGNvZGU6IGNvZGVcbiAgICAgIGxvY2F0aW9uOlxuICAgICAgICByb3c6IHJvd1xuICAgICAgICBjb2x1bW46IGNvbHVtblxuXG4gICAgJC5hamF4IEBzZXJ2ZXJVcmwsXG4gICAgICB0eXBlOiAnUE9TVCdcbiAgICAgIGRhdGFUeXBlOiAnanNvbidcbiAgICAgIGNvbnRlbnRUeXBlOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICBkYXRhOiBKU09OLnN0cmluZ2lmeSByZXF1ZXN0XG4gICAgICBlcnJvcjogKGpxWEhSLCB0ZXh0U3RhdHVzLCBlcnJvclRocm93bikgLT5cbiAgICAgICAgIyBzZW5kIGVtcHR5IGFycmF5IHRvIGNhbGxiYWNrXG4gICAgICAgICMgdG8gYXZvaWQgYXV0b2NvbXBsZXRlLXBsdXMgYnJpY2tcbiAgICAgICAgY2FsbGJhY2sgW11cbiAgICAgICAgY29uc29sZS5lcnJvciB0ZXh0U3RhdHVzXG4gICAgICBzdWNjZXNzOiAoZGF0YSwgdGV4dFN0YXR1cywganFYSFIpIC0+XG4gICAgICAgIGNhbGxiYWNrIGRhdGEuY29tcGxldGlvbnNcblxuICAgIHJldHVybiBbXVxuIl19
