(function() {
  var execSync, getExecPathFromGemEnv, platformHome, ref, ref1;

  execSync = require('child_process').execSync;

  platformHome = process.env[process.platform === 'win32' ? 'USERPROFILE' : 'HOME'];

  getExecPathFromGemEnv = function() {
    var line, stdout;
    stdout = execSync('gem environment');
    line = stdout.toString().split(/\r?\n/).find(function(l) {
      return ~l.indexOf('EXECUTABLE DIRECTORY');
    });
    if (line) {
      return line.slice(line.indexOf(': ') + 2);
    } else {
      return void 0;
    }
  };

  module.exports = (ref = (ref1 = process.env.GEM_HOME) != null ? ref1 : getExecPathFromGemEnv()) != null ? ref : platformHome + "/.gem/ruby/2.3.0";

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYmlsbHkvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLXJ1YnkvbGliL2dlbS1ob21lLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsUUFBQSxHQUFXLE9BQUEsQ0FBUSxlQUFSLENBQXdCLENBQUM7O0VBRXBDLFlBQUEsR0FBZSxPQUFPLENBQUMsR0FBSSxDQUFHLE9BQU8sQ0FBQyxRQUFSLEtBQW9CLE9BQXZCLEdBQW9DLGFBQXBDLEdBQXVELE1BQXZEOztFQUUzQixxQkFBQSxHQUF3QixTQUFBO0FBQ3RCLFFBQUE7SUFBQSxNQUFBLEdBQVMsUUFBQSxDQUFTLGlCQUFUO0lBRVQsSUFBQSxHQUFPLE1BQU0sQ0FBQyxRQUFQLENBQUEsQ0FBaUIsQ0FBQyxLQUFsQixDQUF3QixPQUF4QixDQUNFLENBQUMsSUFESCxDQUNRLFNBQUMsQ0FBRDthQUFPLENBQUMsQ0FBQyxDQUFDLE9BQUYsQ0FBVSxzQkFBVjtJQUFSLENBRFI7SUFFUCxJQUFHLElBQUg7YUFDRSxJQUFLLCtCQURQO0tBQUEsTUFBQTthQUdFLE9BSEY7O0VBTHNCOztFQVV4QixNQUFNLENBQUMsT0FBUCxrR0FBcUUsWUFBRCxHQUFjO0FBZGxGIiwic291cmNlc0NvbnRlbnQiOlsiZXhlY1N5bmMgPSByZXF1aXJlKCdjaGlsZF9wcm9jZXNzJykuZXhlY1N5bmNcblxucGxhdGZvcm1Ib21lID0gcHJvY2Vzcy5lbnZbaWYgcHJvY2Vzcy5wbGF0Zm9ybSBpcyAnd2luMzInIHRoZW4gJ1VTRVJQUk9GSUxFJyBlbHNlICdIT01FJ11cblxuZ2V0RXhlY1BhdGhGcm9tR2VtRW52ID0gLT5cbiAgc3Rkb3V0ID0gZXhlY1N5bmMgJ2dlbSBlbnZpcm9ubWVudCdcblxuICBsaW5lID0gc3Rkb3V0LnRvU3RyaW5nKCkuc3BsaXQoL1xccj9cXG4vKVxuICAgICAgICAgICAuZmluZCgobCkgLT4gfmwuaW5kZXhPZignRVhFQ1VUQUJMRSBESVJFQ1RPUlknKSlcbiAgaWYgbGluZVxuICAgIGxpbmVbbGluZS5pbmRleE9mKCc6ICcpICsgMi4uXVxuICBlbHNlXG4gICAgdW5kZWZpbmVkXG5cbm1vZHVsZS5leHBvcnRzID0gcHJvY2Vzcy5lbnYuR0VNX0hPTUUgPyBnZXRFeGVjUGF0aEZyb21HZW1FbnYoKSA/IFwiI3twbGF0Zm9ybUhvbWV9Ly5nZW0vcnVieS8yLjMuMFwiXG4iXX0=
