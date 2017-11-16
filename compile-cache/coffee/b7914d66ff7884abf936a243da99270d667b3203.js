(function() {
  exports.Haskell = {
    'Selection Based': {
      command: 'ghc',
      args: function(context) {
        return ['-e', context.getCode()];
      }
    },
    'File Based': {
      command: 'runhaskell',
      args: function(arg) {
        var filepath;
        filepath = arg.filepath;
        return [filepath];
      }
    }
  };

  exports['Literate Haskell'] = {
    'File Based': exports.Haskell['File Based']
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYmlsbHkvLmF0b20vcGFja2FnZXMvc2NyaXB0L2xpYi9ncmFtbWFycy9oYXNrZWxsLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUFBLE9BQU8sQ0FBQyxPQUFSLEdBQ0U7SUFBQSxpQkFBQSxFQUNFO01BQUEsT0FBQSxFQUFTLEtBQVQ7TUFDQSxJQUFBLEVBQU0sU0FBQyxPQUFEO2VBQWEsQ0FBQyxJQUFELEVBQU8sT0FBTyxDQUFDLE9BQVIsQ0FBQSxDQUFQO01BQWIsQ0FETjtLQURGO0lBSUEsWUFBQSxFQUNFO01BQUEsT0FBQSxFQUFTLFlBQVQ7TUFDQSxJQUFBLEVBQU0sU0FBQyxHQUFEO0FBQWdCLFlBQUE7UUFBZCxXQUFEO2VBQWUsQ0FBQyxRQUFEO01BQWhCLENBRE47S0FMRjs7O0VBUUYsT0FBUSxDQUFBLGtCQUFBLENBQVIsR0FDRTtJQUFBLFlBQUEsRUFBYyxPQUFPLENBQUMsT0FBUSxDQUFBLFlBQUEsQ0FBOUI7O0FBVkYiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnRzLkhhc2tlbGwgPVxuICAnU2VsZWN0aW9uIEJhc2VkJzpcbiAgICBjb21tYW5kOiAnZ2hjJ1xuICAgIGFyZ3M6IChjb250ZXh0KSAtPiBbJy1lJywgY29udGV4dC5nZXRDb2RlKCldXG5cbiAgJ0ZpbGUgQmFzZWQnOlxuICAgIGNvbW1hbmQ6ICdydW5oYXNrZWxsJ1xuICAgIGFyZ3M6ICh7ZmlsZXBhdGh9KSAtPiBbZmlsZXBhdGhdXG5cbmV4cG9ydHNbJ0xpdGVyYXRlIEhhc2tlbGwnXSA9XG4gICdGaWxlIEJhc2VkJzogZXhwb3J0cy5IYXNrZWxsWydGaWxlIEJhc2VkJ11cbiJdfQ==
