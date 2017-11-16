(function() {
  var GEM_HOME, RsenseProvider;

  RsenseProvider = require('./autocomplete-ruby-provider.coffee');

  GEM_HOME = require('./gem-home.coffee');

  module.exports = {
    config: {
      rsensePath: {
        description: 'The location of the rsense executable',
        type: 'string',
        "default": GEM_HOME + "/rsense"
      },
      port: {
        description: 'The port the rsense server is running on',
        type: 'integer',
        "default": 47367,
        minimum: 1024,
        maximum: 65535
      },
      suggestionPriority: {
        description: 'Show autocomplete-ruby content before default autocomplete-plus provider',
        "default": false,
        type: 'boolean'
      }
    },
    rsenseProvider: null,
    activate: function(state) {
      return this.rsenseProvider = new RsenseProvider();
    },
    provideAutocompletion: function() {
      return this.rsenseProvider;
    },
    deactivate: function() {
      var ref;
      if ((ref = this.rsenseProvider) != null) {
        ref.dispose();
      }
      return this.rsenseProvider = null;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYmlsbHkvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLXJ1YnkvbGliL2F1dG9jb21wbGV0ZS1ydWJ5LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsY0FBQSxHQUFpQixPQUFBLENBQVEscUNBQVI7O0VBQ2pCLFFBQUEsR0FBVyxPQUFBLENBQVEsbUJBQVI7O0VBRVgsTUFBTSxDQUFDLE9BQVAsR0FDRTtJQUFBLE1BQUEsRUFDRTtNQUFBLFVBQUEsRUFDRTtRQUFBLFdBQUEsRUFBYSx1Q0FBYjtRQUNBLElBQUEsRUFBTSxRQUROO1FBRUEsQ0FBQSxPQUFBLENBQUEsRUFBWSxRQUFELEdBQVUsU0FGckI7T0FERjtNQUlBLElBQUEsRUFDRTtRQUFBLFdBQUEsRUFBYSwwQ0FBYjtRQUNBLElBQUEsRUFBTSxTQUROO1FBRUEsQ0FBQSxPQUFBLENBQUEsRUFBUyxLQUZUO1FBR0EsT0FBQSxFQUFTLElBSFQ7UUFJQSxPQUFBLEVBQVMsS0FKVDtPQUxGO01BVUEsa0JBQUEsRUFDRTtRQUFBLFdBQUEsRUFBYSwwRUFBYjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsS0FEVDtRQUVBLElBQUEsRUFBTSxTQUZOO09BWEY7S0FERjtJQWdCQSxjQUFBLEVBQWdCLElBaEJoQjtJQWtCQSxRQUFBLEVBQVUsU0FBQyxLQUFEO2FBQ1IsSUFBQyxDQUFBLGNBQUQsR0FBc0IsSUFBQSxjQUFBLENBQUE7SUFEZCxDQWxCVjtJQXFCQSxxQkFBQSxFQUF1QixTQUFBO2FBQ3JCLElBQUMsQ0FBQTtJQURvQixDQXJCdkI7SUF3QkEsVUFBQSxFQUFZLFNBQUE7QUFDVixVQUFBOztXQUFlLENBQUUsT0FBakIsQ0FBQTs7YUFDQSxJQUFDLENBQUEsY0FBRCxHQUFrQjtJQUZSLENBeEJaOztBQUpGIiwic291cmNlc0NvbnRlbnQiOlsiUnNlbnNlUHJvdmlkZXIgPSByZXF1aXJlICcuL2F1dG9jb21wbGV0ZS1ydWJ5LXByb3ZpZGVyLmNvZmZlZSdcbkdFTV9IT01FID0gcmVxdWlyZSgnLi9nZW0taG9tZS5jb2ZmZWUnKVxuXG5tb2R1bGUuZXhwb3J0cyA9XG4gIGNvbmZpZzpcbiAgICByc2Vuc2VQYXRoOlxuICAgICAgZGVzY3JpcHRpb246ICdUaGUgbG9jYXRpb24gb2YgdGhlIHJzZW5zZSBleGVjdXRhYmxlJ1xuICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgIGRlZmF1bHQ6IFwiI3tHRU1fSE9NRX0vcnNlbnNlXCJcbiAgICBwb3J0OlxuICAgICAgZGVzY3JpcHRpb246ICdUaGUgcG9ydCB0aGUgcnNlbnNlIHNlcnZlciBpcyBydW5uaW5nIG9uJ1xuICAgICAgdHlwZTogJ2ludGVnZXInXG4gICAgICBkZWZhdWx0OiA0NzM2N1xuICAgICAgbWluaW11bTogMTAyNFxuICAgICAgbWF4aW11bTogNjU1MzVcbiAgICBzdWdnZXN0aW9uUHJpb3JpdHk6XG4gICAgICBkZXNjcmlwdGlvbjogJ1Nob3cgYXV0b2NvbXBsZXRlLXJ1YnkgY29udGVudCBiZWZvcmUgZGVmYXVsdCBhdXRvY29tcGxldGUtcGx1cyBwcm92aWRlcidcbiAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgICB0eXBlOiAnYm9vbGVhbidcblxuICByc2Vuc2VQcm92aWRlcjogbnVsbFxuXG4gIGFjdGl2YXRlOiAoc3RhdGUpIC0+XG4gICAgQHJzZW5zZVByb3ZpZGVyID0gbmV3IFJzZW5zZVByb3ZpZGVyKClcblxuICBwcm92aWRlQXV0b2NvbXBsZXRpb246IC0+XG4gICAgQHJzZW5zZVByb3ZpZGVyXG5cbiAgZGVhY3RpdmF0ZTogLT5cbiAgICBAcnNlbnNlUHJvdmlkZXI/LmRpc3Bvc2UoKVxuICAgIEByc2Vuc2VQcm92aWRlciA9IG51bGxcbiJdfQ==
