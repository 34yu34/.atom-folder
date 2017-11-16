
/*
Requires https://github.com/FriendsOfPHP/phpcbf
 */

(function() {
  "use strict";
  var Beautifier, PHPCBF,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Beautifier = require('./beautifier');

  module.exports = PHPCBF = (function(superClass) {
    extend(PHPCBF, superClass);

    function PHPCBF() {
      return PHPCBF.__super__.constructor.apply(this, arguments);
    }

    PHPCBF.prototype.name = "PHPCBF";

    PHPCBF.prototype.link = "http://php.net/manual/en/install.php";

    PHPCBF.prototype.executables = [
      {
        name: "PHP",
        cmd: "php",
        homepage: "http://php.net/",
        installation: "http://php.net/manual/en/install.php",
        version: {
          parse: function(text) {
            return text.match(/PHP (\d+\.\d+\.\d+)/)[1];
          }
        }
      }, {
        name: "PHPCBF",
        cmd: "phpcbf",
        homepage: "https://github.com/squizlabs/PHP_CodeSniffer",
        installation: "https://github.com/squizlabs/PHP_CodeSniffer#installation",
        version: {
          parse: function(text) {
            return text.match(/version (\d+\.\d+\.\d+)/)[1];
          }
        },
        docker: {
          image: "unibeautify/phpcbf"
        }
      }
    ];

    PHPCBF.prototype.options = {
      PHP: {
        phpcbf_path: true,
        phpcbf_version: true,
        standard: true
      }
    };

    PHPCBF.prototype.beautify = function(text, language, options) {
      var php, phpcbf, standardFile, standardFiles;
      this.debug('phpcbf', options);
      standardFiles = ['phpcs.xml', 'phpcs.xml.dist', 'phpcs.ruleset.xml', 'ruleset.xml'];
      standardFile = this.findFile(atom.project.getPaths()[0], standardFiles);
      if (standardFile) {
        options.standard = standardFile;
      }
      php = this.exe('php');
      phpcbf = this.exe('phpcbf');
      if (options.phpcbf_path) {
        this.deprecateOptionForExecutable("PHPCBF", "PHP - PHPCBF Path (phpcbf_path)", "Path");
      }
      return this.Promise.all([options.phpcbf_path ? this.which(options.phpcbf_path) : void 0, phpcbf.path(), this.tempFile("temp", text, ".php")]).then((function(_this) {
        return function(arg) {
          var customPhpcbfPath, finalPhpcbfPath, isPhpScript, isVersion3, phpcbfPath, tempFile;
          customPhpcbfPath = arg[0], phpcbfPath = arg[1], tempFile = arg[2];
          finalPhpcbfPath = customPhpcbfPath && path.isAbsolute(customPhpcbfPath) ? customPhpcbfPath : phpcbfPath;
          _this.verbose('finalPhpcbfPath', finalPhpcbfPath, phpcbfPath, customPhpcbfPath);
          isVersion3 = (phpcbf.isInstalled && phpcbf.isVersion('3.x')) || (options.phpcbf_version && phpcbf.versionSatisfies(options.phpcbf_version + ".0.0", '3.x'));
          isPhpScript = (finalPhpcbfPath.indexOf(".phar") !== -1) || (finalPhpcbfPath.indexOf(".php") !== -1);
          _this.verbose('isPhpScript', isPhpScript);
          if (isPhpScript) {
            return php.run([phpcbfPath, !isVersion3 ? "--no-patch" : void 0, options.standard ? "--standard=" + options.standard : void 0, tempFile], {
              ignoreReturnCode: true,
              onStdin: function(stdin) {
                return stdin.end();
              }
            }).then(function() {
              return _this.readFile(tempFile);
            });
          } else {
            return phpcbf.run([!isVersion3 ? "--no-patch" : void 0, options.standard ? "--standard=" + options.standard : void 0, tempFile = _this.tempFile("temp", text, ".php")], {
              ignoreReturnCode: true,
              onStdin: function(stdin) {
                return stdin.end();
              }
            }).then(function() {
              return _this.readFile(tempFile);
            });
          }
        };
      })(this));
    };

    return PHPCBF;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYmlsbHkvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvYmVhdXRpZmllcnMvcGhwY2JmLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7QUFBQTtFQUlBO0FBSkEsTUFBQSxrQkFBQTtJQUFBOzs7RUFLQSxVQUFBLEdBQWEsT0FBQSxDQUFRLGNBQVI7O0VBRWIsTUFBTSxDQUFDLE9BQVAsR0FBdUI7Ozs7Ozs7cUJBQ3JCLElBQUEsR0FBTTs7cUJBQ04sSUFBQSxHQUFNOztxQkFDTixXQUFBLEdBQWE7TUFDWDtRQUNFLElBQUEsRUFBTSxLQURSO1FBRUUsR0FBQSxFQUFLLEtBRlA7UUFHRSxRQUFBLEVBQVUsaUJBSFo7UUFJRSxZQUFBLEVBQWMsc0NBSmhCO1FBS0UsT0FBQSxFQUFTO1VBQ1AsS0FBQSxFQUFPLFNBQUMsSUFBRDttQkFBVSxJQUFJLENBQUMsS0FBTCxDQUFXLHFCQUFYLENBQWtDLENBQUEsQ0FBQTtVQUE1QyxDQURBO1NBTFg7T0FEVyxFQVVYO1FBQ0UsSUFBQSxFQUFNLFFBRFI7UUFFRSxHQUFBLEVBQUssUUFGUDtRQUdFLFFBQUEsRUFBVSw4Q0FIWjtRQUlFLFlBQUEsRUFBYywyREFKaEI7UUFLRSxPQUFBLEVBQVM7VUFDUCxLQUFBLEVBQU8sU0FBQyxJQUFEO21CQUFVLElBQUksQ0FBQyxLQUFMLENBQVcseUJBQVgsQ0FBc0MsQ0FBQSxDQUFBO1VBQWhELENBREE7U0FMWDtRQVFFLE1BQUEsRUFBUTtVQUNOLEtBQUEsRUFBTyxvQkFERDtTQVJWO09BVlc7OztxQkF3QmIsT0FBQSxHQUFTO01BQ1AsR0FBQSxFQUNFO1FBQUEsV0FBQSxFQUFhLElBQWI7UUFDQSxjQUFBLEVBQWdCLElBRGhCO1FBRUEsUUFBQSxFQUFVLElBRlY7T0FGSzs7O3FCQU9ULFFBQUEsR0FBVSxTQUFDLElBQUQsRUFBTyxRQUFQLEVBQWlCLE9BQWpCO0FBQ1IsVUFBQTtN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LEtBQUQ7dUJBQ1AsS0FBSyxDQUFDLEdBQU4sQ0FBQTtjQURPLENBRlI7YUFKTCxDQVNFLENBQUMsSUFUSCxDQVNRLFNBQUE7cUJBQ0osS0FBQyxDQUFBLFFBQUQsQ0FBVSxRQUFWO1lBREksQ0FUUixFQWZGOztRQVpNO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUpSO0lBZFE7Ozs7S0FsQzBCO0FBUHRDIiwic291cmNlc0NvbnRlbnQiOlsiIyMjXG5SZXF1aXJlcyBodHRwczovL2dpdGh1Yi5jb20vRnJpZW5kc09mUEhQL3BocGNiZlxuIyMjXG5cblwidXNlIHN0cmljdFwiXG5CZWF1dGlmaWVyID0gcmVxdWlyZSgnLi9iZWF1dGlmaWVyJylcblxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBQSFBDQkYgZXh0ZW5kcyBCZWF1dGlmaWVyXG4gIG5hbWU6IFwiUEhQQ0JGXCJcbiAgbGluazogXCJodHRwOi8vcGhwLm5ldC9tYW51YWwvZW4vaW5zdGFsbC5waHBcIlxuICBleGVjdXRhYmxlczogW1xuICAgIHtcbiAgICAgIG5hbWU6IFwiUEhQXCJcbiAgICAgIGNtZDogXCJwaHBcIlxuICAgICAgaG9tZXBhZ2U6IFwiaHR0cDovL3BocC5uZXQvXCJcbiAgICAgIGluc3RhbGxhdGlvbjogXCJodHRwOi8vcGhwLm5ldC9tYW51YWwvZW4vaW5zdGFsbC5waHBcIlxuICAgICAgdmVyc2lvbjoge1xuICAgICAgICBwYXJzZTogKHRleHQpIC0+IHRleHQubWF0Y2goL1BIUCAoXFxkK1xcLlxcZCtcXC5cXGQrKS8pWzFdXG4gICAgICB9XG4gICAgfVxuICAgIHtcbiAgICAgIG5hbWU6IFwiUEhQQ0JGXCJcbiAgICAgIGNtZDogXCJwaHBjYmZcIlxuICAgICAgaG9tZXBhZ2U6IFwiaHR0cHM6Ly9naXRodWIuY29tL3NxdWl6bGFicy9QSFBfQ29kZVNuaWZmZXJcIlxuICAgICAgaW5zdGFsbGF0aW9uOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9zcXVpemxhYnMvUEhQX0NvZGVTbmlmZmVyI2luc3RhbGxhdGlvblwiXG4gICAgICB2ZXJzaW9uOiB7XG4gICAgICAgIHBhcnNlOiAodGV4dCkgLT4gdGV4dC5tYXRjaCgvdmVyc2lvbiAoXFxkK1xcLlxcZCtcXC5cXGQrKS8pWzFdXG4gICAgICB9XG4gICAgICBkb2NrZXI6IHtcbiAgICAgICAgaW1hZ2U6IFwidW5pYmVhdXRpZnkvcGhwY2JmXCJcbiAgICAgIH1cbiAgICB9XG4gIF1cblxuICBvcHRpb25zOiB7XG4gICAgUEhQOlxuICAgICAgcGhwY2JmX3BhdGg6IHRydWVcbiAgICAgIHBocGNiZl92ZXJzaW9uOiB0cnVlXG4gICAgICBzdGFuZGFyZDogdHJ1ZVxuICB9XG5cbiAgYmVhdXRpZnk6ICh0ZXh0LCBsYW5ndWFnZSwgb3B0aW9ucykgLT5cbiAgICBAZGVidWcoJ3BocGNiZicsIG9wdGlvbnMpXG4gICAgc3RhbmRhcmRGaWxlcyA9IFsncGhwY3MueG1sJywgJ3BocGNzLnhtbC5kaXN0JywgJ3BocGNzLnJ1bGVzZXQueG1sJywgJ3J1bGVzZXQueG1sJ11cbiAgICBzdGFuZGFyZEZpbGUgPSBAZmluZEZpbGUoYXRvbS5wcm9qZWN0LmdldFBhdGhzKClbMF0sIHN0YW5kYXJkRmlsZXMpXG5cbiAgICBvcHRpb25zLnN0YW5kYXJkID0gc3RhbmRhcmRGaWxlIGlmIHN0YW5kYXJkRmlsZVxuXG4gICAgcGhwID0gQGV4ZSgncGhwJylcbiAgICBwaHBjYmYgPSBAZXhlKCdwaHBjYmYnKVxuXG4gICAgaWYgb3B0aW9ucy5waHBjYmZfcGF0aFxuICAgICAgQGRlcHJlY2F0ZU9wdGlvbkZvckV4ZWN1dGFibGUoXCJQSFBDQkZcIiwgXCJQSFAgLSBQSFBDQkYgUGF0aCAocGhwY2JmX3BhdGgpXCIsIFwiUGF0aFwiKVxuXG4gICAgIyBGaW5kIHBocGNiZi5waGFyIHNjcmlwdFxuICAgIEBQcm9taXNlLmFsbChbXG4gICAgICBAd2hpY2gob3B0aW9ucy5waHBjYmZfcGF0aCkgaWYgb3B0aW9ucy5waHBjYmZfcGF0aFxuICAgICAgcGhwY2JmLnBhdGgoKVxuICAgICAgQHRlbXBGaWxlKFwidGVtcFwiLCB0ZXh0LCBcIi5waHBcIilcbiAgICBdKS50aGVuKChbY3VzdG9tUGhwY2JmUGF0aCwgcGhwY2JmUGF0aCwgdGVtcEZpbGVdKSA9PlxuICAgICAgIyBHZXQgZmlyc3QgdmFsaWQsIGFic29sdXRlIHBhdGhcbiAgICAgIGZpbmFsUGhwY2JmUGF0aCA9IGlmIGN1c3RvbVBocGNiZlBhdGggYW5kIHBhdGguaXNBYnNvbHV0ZShjdXN0b21QaHBjYmZQYXRoKSB0aGVuIFxcXG4gICAgICAgIGN1c3RvbVBocGNiZlBhdGggZWxzZSBwaHBjYmZQYXRoXG4gICAgICBAdmVyYm9zZSgnZmluYWxQaHBjYmZQYXRoJywgZmluYWxQaHBjYmZQYXRoLCBwaHBjYmZQYXRoLCBjdXN0b21QaHBjYmZQYXRoKVxuXG4gICAgICBpc1ZlcnNpb24zID0gKChwaHBjYmYuaXNJbnN0YWxsZWQgYW5kIHBocGNiZi5pc1ZlcnNpb24oJzMueCcpKSBvciBcXFxuICAgICAgICAob3B0aW9ucy5waHBjYmZfdmVyc2lvbiBhbmQgcGhwY2JmLnZlcnNpb25TYXRpc2ZpZXMoXCIje29wdGlvbnMucGhwY2JmX3ZlcnNpb259LjAuMFwiLCAnMy54JykpKVxuXG4gICAgICBpc1BocFNjcmlwdCA9IChmaW5hbFBocGNiZlBhdGguaW5kZXhPZihcIi5waGFyXCIpIGlzbnQgLTEpIG9yIChmaW5hbFBocGNiZlBhdGguaW5kZXhPZihcIi5waHBcIikgaXNudCAtMSlcbiAgICAgIEB2ZXJib3NlKCdpc1BocFNjcmlwdCcsIGlzUGhwU2NyaXB0KVxuXG4gICAgICBpZiBpc1BocFNjcmlwdFxuICAgICAgICBwaHAucnVuKFtcbiAgICAgICAgICBwaHBjYmZQYXRoLFxuICAgICAgICAgIFwiLS1uby1wYXRjaFwiIHVubGVzcyBpc1ZlcnNpb24zXG4gICAgICAgICAgXCItLXN0YW5kYXJkPSN7b3B0aW9ucy5zdGFuZGFyZH1cIiBpZiBvcHRpb25zLnN0YW5kYXJkXG4gICAgICAgICAgdGVtcEZpbGVcbiAgICAgICAgICBdLCB7XG4gICAgICAgICAgICBpZ25vcmVSZXR1cm5Db2RlOiB0cnVlXG4gICAgICAgICAgICBvblN0ZGluOiAoc3RkaW4pIC0+XG4gICAgICAgICAgICAgIHN0ZGluLmVuZCgpXG4gICAgICAgICAgfSlcbiAgICAgICAgICAudGhlbig9PlxuICAgICAgICAgICAgQHJlYWRGaWxlKHRlbXBGaWxlKVxuICAgICAgICAgIClcbiAgICAgIGVsc2VcbiAgICAgICAgcGhwY2JmLnJ1bihbXG4gICAgICAgICAgXCItLW5vLXBhdGNoXCIgdW5sZXNzIGlzVmVyc2lvbjNcbiAgICAgICAgICBcIi0tc3RhbmRhcmQ9I3tvcHRpb25zLnN0YW5kYXJkfVwiIGlmIG9wdGlvbnMuc3RhbmRhcmRcbiAgICAgICAgICB0ZW1wRmlsZSA9IEB0ZW1wRmlsZShcInRlbXBcIiwgdGV4dCwgXCIucGhwXCIpXG4gICAgICAgICAgXSwge1xuICAgICAgICAgICAgaWdub3JlUmV0dXJuQ29kZTogdHJ1ZVxuICAgICAgICAgICAgb25TdGRpbjogKHN0ZGluKSAtPlxuICAgICAgICAgICAgICBzdGRpbi5lbmQoKVxuICAgICAgICAgIH0pXG4gICAgICAgICAgLnRoZW4oPT5cbiAgICAgICAgICAgIEByZWFkRmlsZSh0ZW1wRmlsZSlcbiAgICAgICAgICApXG4gICAgICApXG4iXX0=