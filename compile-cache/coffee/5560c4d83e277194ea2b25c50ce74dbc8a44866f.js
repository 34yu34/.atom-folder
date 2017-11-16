(function() {
  var message;

  message = "SQL requires setting 'Script: Run Options' directly. See https://github.com/rgbkrk/atom-script/tree/master/examples/hello.sql for further information.";

  module.exports = {
    'mongoDB (JavaScript)': {
      'Selection Based': {
        command: 'mongo',
        args: function(context) {
          return ['--eval', context.getCode()];
        }
      },
      'File Based': {
        command: 'mongo',
        args: function(arg) {
          var filepath;
          filepath = arg.filepath;
          return [filepath];
        }
      }
    },
    SQL: {
      'Selection Based': {
        command: 'echo',
        args: function() {
          return [message];
        }
      },
      'File Based': {
        command: 'echo',
        args: function() {
          return [message];
        }
      }
    },
    'SQL (PostgreSQL)': {
      'Selection Based': {
        command: 'psql',
        args: function(context) {
          return ['-c', context.getCode()];
        }
      },
      'File Based': {
        command: 'psql',
        args: function(arg) {
          var filepath;
          filepath = arg.filepath;
          return ['-f', filepath];
        }
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYmlsbHkvLmF0b20vcGFja2FnZXMvc2NyaXB0L2xpYi9ncmFtbWFycy9kYXRhYmFzZS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLE9BQUEsR0FBVTs7RUFFVixNQUFNLENBQUMsT0FBUCxHQUVFO0lBQUEsc0JBQUEsRUFFRTtNQUFBLGlCQUFBLEVBQ0U7UUFBQSxPQUFBLEVBQVMsT0FBVDtRQUNBLElBQUEsRUFBTSxTQUFDLE9BQUQ7aUJBQWEsQ0FBQyxRQUFELEVBQVcsT0FBTyxDQUFDLE9BQVIsQ0FBQSxDQUFYO1FBQWIsQ0FETjtPQURGO01BSUEsWUFBQSxFQUNFO1FBQUEsT0FBQSxFQUFVLE9BQVY7UUFDQSxJQUFBLEVBQU0sU0FBQyxHQUFEO0FBQWdCLGNBQUE7VUFBZCxXQUFEO2lCQUFlLENBQUMsUUFBRDtRQUFoQixDQUROO09BTEY7S0FGRjtJQVVBLEdBQUEsRUFDRTtNQUFBLGlCQUFBLEVBQ0U7UUFBQSxPQUFBLEVBQVMsTUFBVDtRQUNBLElBQUEsRUFBTSxTQUFBO2lCQUFHLENBQUMsT0FBRDtRQUFILENBRE47T0FERjtNQUlBLFlBQUEsRUFDRTtRQUFBLE9BQUEsRUFBUyxNQUFUO1FBQ0EsSUFBQSxFQUFNLFNBQUE7aUJBQUcsQ0FBQyxPQUFEO1FBQUgsQ0FETjtPQUxGO0tBWEY7SUFtQkEsa0JBQUEsRUFFRTtNQUFBLGlCQUFBLEVBQ0U7UUFBQSxPQUFBLEVBQVMsTUFBVDtRQUNBLElBQUEsRUFBTSxTQUFDLE9BQUQ7aUJBQWEsQ0FBQyxJQUFELEVBQU8sT0FBTyxDQUFDLE9BQVIsQ0FBQSxDQUFQO1FBQWIsQ0FETjtPQURGO01BSUEsWUFBQSxFQUNFO1FBQUEsT0FBQSxFQUFTLE1BQVQ7UUFDQSxJQUFBLEVBQU0sU0FBQyxHQUFEO0FBQWdCLGNBQUE7VUFBZCxXQUFEO2lCQUFlLENBQUMsSUFBRCxFQUFPLFFBQVA7UUFBaEIsQ0FETjtPQUxGO0tBckJGOztBQUpGIiwic291cmNlc0NvbnRlbnQiOlsibWVzc2FnZSA9IFwiU1FMIHJlcXVpcmVzIHNldHRpbmcgJ1NjcmlwdDogUnVuIE9wdGlvbnMnIGRpcmVjdGx5LiBTZWUgaHR0cHM6Ly9naXRodWIuY29tL3JnYmtyay9hdG9tLXNjcmlwdC90cmVlL21hc3Rlci9leGFtcGxlcy9oZWxsby5zcWwgZm9yIGZ1cnRoZXIgaW5mb3JtYXRpb24uXCJcblxubW9kdWxlLmV4cG9ydHMgPVxuXG4gICdtb25nb0RCIChKYXZhU2NyaXB0KSc6XG5cbiAgICAnU2VsZWN0aW9uIEJhc2VkJzpcbiAgICAgIGNvbW1hbmQ6ICdtb25nbydcbiAgICAgIGFyZ3M6IChjb250ZXh0KSAtPiBbJy0tZXZhbCcsIGNvbnRleHQuZ2V0Q29kZSgpXVxuXG4gICAgJ0ZpbGUgQmFzZWQnOlxuICAgICAgY29tbWFuZDogICdtb25nbydcbiAgICAgIGFyZ3M6ICh7ZmlsZXBhdGh9KSAtPiBbZmlsZXBhdGhdXG5cbiAgU1FMOlxuICAgICdTZWxlY3Rpb24gQmFzZWQnOlxuICAgICAgY29tbWFuZDogJ2VjaG8nXG4gICAgICBhcmdzOiAtPiBbbWVzc2FnZV1cblxuICAgICdGaWxlIEJhc2VkJzpcbiAgICAgIGNvbW1hbmQ6ICdlY2hvJ1xuICAgICAgYXJnczogLT4gW21lc3NhZ2VdXG5cbiAgJ1NRTCAoUG9zdGdyZVNRTCknOlxuXG4gICAgJ1NlbGVjdGlvbiBCYXNlZCc6XG4gICAgICBjb21tYW5kOiAncHNxbCdcbiAgICAgIGFyZ3M6IChjb250ZXh0KSAtPiBbJy1jJywgY29udGV4dC5nZXRDb2RlKCldXG5cbiAgICAnRmlsZSBCYXNlZCc6XG4gICAgICBjb21tYW5kOiAncHNxbCdcbiAgICAgIGFyZ3M6ICh7ZmlsZXBhdGh9KSAtPiBbJy1mJywgZmlsZXBhdGhdXG4iXX0=
