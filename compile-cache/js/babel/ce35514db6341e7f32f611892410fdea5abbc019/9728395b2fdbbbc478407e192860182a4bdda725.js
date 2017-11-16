'use babel';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = [{
  scopes: ['source.js', 'source.js.jsx', 'source.coffee', 'source.coffee.jsx', 'source.ts', 'source.tsx'],
  prefixes: ['import\\s+.*?from\\s+[\'"]', // import foo from './foo'
  'import\\s+[\'"]', // import './foo'
  'require\\([\'"]', // require('./foo')
  'define\\(\\[?[\'"]' // define(['./foo']) or define('./foo')
  ],
  extensions: ['js', 'jsx', 'ts', 'tsx', 'coffee', 'json'],
  relative: true,
  replaceOnInsert: [['([\\/]?index)?\\.jsx?$', ''], ['([\\/]?index)?\\.ts$', ''], ['([\\/]?index)?\\.coffee$', '']]
}, {
  scopes: ['text.html.vue'],
  prefixes: ['import\\s+.*?from\\s+[\'"]', // import foo from './foo'
  'import\\s+[\'"]', // import './foo'
  'require\\([\'"]', // require('./foo')
  'define\\(\\[?[\'"]' // define(['./foo']) or define('./foo')
  ],
  extensions: ['js', 'jsx', 'vue', 'ts', 'tsx', 'coffee'],
  relative: true,
  replaceOnInsert: [['\\.jsx?$', ''], ['\\.ts$', ''], ['\\.coffee$', '']]
}, {
  scopes: ['text.html.vue'],
  prefixes: ['@import[\\(|\\s+]?[\'"]' // @import 'foo' or @import('foo')
  ],
  extensions: ['css', 'sass', 'scss', 'less', 'styl'],
  relative: true,
  replaceOnInsert: [['(/)?_([^/]*?)$', '$1$2'] // dir1/_dir2/_file.sass => dir1/_dir2/file.sass
  ]
}, {
  scopes: ['source.coffee', 'source.coffee.jsx'],
  prefixes: ['require\\s+[\'"]', // require './foo'
  'define\\s+\\[?[\'"]' // define(['./foo']) or define('./foo')
  ],
  extensions: ['js', 'jsx', 'ts', 'tsx', 'coffee'],
  relative: true,
  replaceOnInsert: [['\\.jsx?$', ''], ['\\.ts$', ''], ['\\.coffee$', '']]
}, {
  scopes: ['source.php'],
  prefixes: ['require_once\\([\'"]', // require_once('foo.php')
  'include\\([\'"]' // include('./foo.php')
  ],
  extensions: ['php'],
  relative: true
}, {
  scopes: ['source.sass', 'source.css.scss', 'source.less', 'source.stylus'],
  prefixes: ['@import[\\(|\\s+]?[\'"]' // @import 'foo' or @import('foo')
  ],
  extensions: ['sass', 'scss', 'css'],
  relative: true,
  replaceOnInsert: [['(/)?_([^/]*?)$', '$1$2'] // dir1/_dir2/_file.sass => dir1/_dir2/file.sass
  ]
}, {
  scopes: ['source.css'],
  prefixes: ['@import\\s+[\'"]?', // @import 'foo.css'
  '@import\\s+url\\([\'"]?' // @import url('foo.css')
  ],
  extensions: ['css'],
  relative: true
}, {
  scopes: ['source.css', 'source.sass', 'source.less', 'source.css.scss', 'source.stylus'],
  prefixes: ['url\\([\'"]?'],
  extensions: ['png', 'gif', 'jpeg', 'jpg', 'woff', 'ttf', 'svg', 'otf'],
  relative: true
}, {
  scopes: ['source.c', 'source.cpp'],
  prefixes: ['^\\s*#include\\s+[\'"]'],
  extensions: ['h', 'hpp'],
  relative: true,
  includeCurrentDirectory: false
}, {
  scopes: ['source.lua'],
  prefixes: ['require[\\s+|\\(][\'"]'],
  extensions: ['lua'],
  relative: true,
  includeCurrentDirectory: false,
  replaceOnInsert: [['\\/', '.'], ['\\\\', '.'], ['\\.lua$', '']]
}, {
  scopes: ['source.ruby'],
  prefixes: ['^\\s*require[\\s+|\\(][\'"]'],
  extensions: ['rb'],
  relative: true,
  includeCurrentDirectory: false,
  replaceOnInsert: [['\\.rb$', '']]
}, {
  scopes: ['source.python'],
  prefixes: ['^\\s*from\\s+', '^\\s*import\\s+'],
  extensions: ['py'],
  relative: true,
  includeCurrentDirectory: false,
  replaceOnInsert: [['\\/', '.'], ['\\\\', '.'], ['\\.py$', '']]
}];
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2JpbGx5Ly5hdG9tL3BhY2thZ2VzL2F1dG9jb21wbGV0ZS1wYXRocy9saWIvY29uZmlnL2RlZmF1bHQtc2NvcGVzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFdBQVcsQ0FBQTs7Ozs7cUJBRUksQ0FDYjtBQUNFLFFBQU0sRUFBRSxDQUFDLFdBQVcsRUFBRSxlQUFlLEVBQUUsZUFBZSxFQUFFLG1CQUFtQixFQUFFLFdBQVcsRUFBRSxZQUFZLENBQUM7QUFDdkcsVUFBUSxFQUFFLENBQ1IsNEJBQTRCO0FBQzVCLG1CQUFpQjtBQUNqQixtQkFBaUI7QUFDakIsc0JBQW9CO0dBQ3JCO0FBQ0QsWUFBVSxFQUFFLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxNQUFNLENBQUM7QUFDeEQsVUFBUSxFQUFFLElBQUk7QUFDZCxpQkFBZSxFQUFFLENBQ2YsQ0FBQyx3QkFBd0IsRUFBRSxFQUFFLENBQUMsRUFDOUIsQ0FBQyxzQkFBc0IsRUFBRSxFQUFFLENBQUMsRUFDNUIsQ0FBQywwQkFBMEIsRUFBRSxFQUFFLENBQUMsQ0FDakM7Q0FDRixFQUNEO0FBQ0UsUUFBTSxFQUFFLENBQUMsZUFBZSxDQUFDO0FBQ3pCLFVBQVEsRUFBRSxDQUNSLDRCQUE0QjtBQUM1QixtQkFBaUI7QUFDakIsbUJBQWlCO0FBQ2pCLHNCQUFvQjtHQUNyQjtBQUNELFlBQVUsRUFBRSxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsUUFBUSxDQUFDO0FBQ3ZELFVBQVEsRUFBRSxJQUFJO0FBQ2QsaUJBQWUsRUFBRSxDQUNmLENBQUMsVUFBVSxFQUFFLEVBQUUsQ0FBQyxFQUNoQixDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUMsRUFDZCxDQUFDLFlBQVksRUFBRSxFQUFFLENBQUMsQ0FDbkI7Q0FDRixFQUNEO0FBQ0UsUUFBTSxFQUFFLENBQUMsZUFBZSxDQUFDO0FB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QixpQkFBZSxFQUFFLENBQ2YsQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDLENBQ2Y7Q0FDRixFQUNEO0FBQ0UsUUFBTSxFQUFFLENBQUMsZUFBZSxDQUFDO0FBQ3pCLFVBQVEsRUFBRSxDQUNSLGVBQWUsRUFDZixpQkFBaUIsQ0FDbEI7QUFDRCxZQUFVLEVBQUUsQ0FBQyxJQUFJLENBQUM7QUFDbEIsVUFBUSxFQUFFLElBQUk7QUFDZCx5QkFBdUIsRUFBRSxLQUFLO0FBQzlCLGlCQUFlLEVBQUUsQ0FDZixDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsRUFDWixDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsRUFDYixDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUMsQ0FDZjtDQUNGLENBQ0YiLCJmaWxlIjoiL2hvbWUvYmlsbHkvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLXBhdGhzL2xpYi9jb25maWcvZGVmYXVsdC1zY29wZXMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG5leHBvcnQgZGVmYXVsdCBbXG4gIHtcbiAgICBzY29wZXM6IFsnc291cmNlLmpzJywgJ3NvdXJjZS5qcy5qc3gnLCAnc291cmNlLmNvZmZlZScsICdzb3VyY2UuY29mZmVlLmpzeCcsICdzb3VyY2UudHMnLCAnc291cmNlLnRzeCddLFxuICAgIHByZWZpeGVzOiBbXG4gICAgICAnaW1wb3J0XFxcXHMrLio/ZnJvbVxcXFxzK1tcXCdcIl0nLCAvLyBpbXBvcnQgZm9vIGZyb20gJy4vZm9vJ1xuICAgICAgJ2ltcG9ydFxcXFxzK1tcXCdcIl0nLCAvLyBpbXBvcnQgJy4vZm9vJ1xuICAgICAgJ3JlcXVpcmVcXFxcKFtcXCdcIl0nLCAvLyByZXF1aXJlKCcuL2ZvbycpXG4gICAgICAnZGVmaW5lXFxcXChcXFxcWz9bXFwnXCJdJyAvLyBkZWZpbmUoWycuL2ZvbyddKSBvciBkZWZpbmUoJy4vZm9vJylcbiAgICBdLFxuICAgIGV4dGVuc2lvbnM6IFsnanMnLCAnanN4JywgJ3RzJywgJ3RzeCcsICdjb2ZmZWUnLCAnanNvbiddLFxuICAgIHJlbGF0aXZlOiB0cnVlLFxuICAgIHJlcGxhY2VPbkluc2VydDogW1xuICAgICAgWycoW1xcXFwvXT9pbmRleCk/XFxcXC5qc3g/JCcsICcnXSxcbiAgICAgIFsnKFtcXFxcL10/aW5kZXgpP1xcXFwudHMkJywgJyddLFxuICAgICAgWycoW1xcXFwvXT9pbmRleCk/XFxcXC5jb2ZmZWUkJywgJyddXG4gICAgXVxuICB9LFxuICB7XG4gICAgc2NvcGVzOiBbJ3RleHQuaHRtbC52dWUnXSxcbiAgICBwcmVmaXhlczogW1xuICAgICAgJ2ltcG9ydFxcXFxzKy4qP2Zyb21cXFxccytbXFwnXCJdJywgLy8gaW1wb3J0IGZvbyBmcm9tICcuL2ZvbydcbiAgICAgICdpbXBvcnRcXFxccytbXFwnXCJdJywgLy8gaW1wb3J0ICcuL2ZvbydcbiAgICAgICdyZXF1aXJlXFxcXChbXFwnXCJdJywgLy8gcmVxdWlyZSgnLi9mb28nKVxuICAgICAgJ2RlZmluZVxcXFwoXFxcXFs/W1xcJ1wiXScgLy8gZGVmaW5lKFsnLi9mb28nXSkgb3IgZGVmaW5lKCcuL2ZvbycpXG4gICAgXSxcbiAgICBleHRlbnNpb25zOiBbJ2pzJywgJ2pzeCcsICd2dWUnLCAndHMnLCAndHN4JywgJ2NvZmZlZSddLFxuICAgIHJlbGF0aXZlOiB0cnVlLFxuICAgIHJlcGxhY2VPbkluc2VydDogW1xuICAgICAgWydcXFxcLmpzeD8kJywgJyddLFxuICAgICAgWydcXFxcLnRzJCcsICcnXSxcbiAgICAgIFsnXFxcXC5jb2ZmZWUkJywgJyddXG4gICAgXVxuICB9LFxuICB7XG4gICAgc2NvcGVzOiBbJ3RleHQuaHRtbC52dWUnXSxcbiAgICBwcmVmaXhlczogW1xuICAgICAgJ0BpbXBvcnRbXFxcXCh8XFxcXHMrXT9bXFwnXCJdJyAvLyBAaW1wb3J0ICdmb28nIG9yIEBpbXBvcnQoJ2ZvbycpXG4gICAgXSxcbiAgICBleHRlbnNpb25zOiBbJ2NzcycsICdzYXNzJywgJ3Njc3MnLCAnbGVzcycsICdzdHlsJ10sXG4gICAgcmVsYXRpdmU6IHRydWUsXG4gICAgcmVwbGFjZU9uSW5zZXJ0OiBbXG4gICAgICBbJygvKT9fKFteL10qPykkJywgJyQxJDInXSAvLyBkaXIxL19kaXIyL19maWxlLnNhc3MgPT4gZGlyMS9fZGlyMi9maWxlLnNhc3NcbiAgICBdXG4gIH0sXG4gIHtcbiAgICBzY29wZXM6IFsnc291cmNlLmNvZmZlZScsICdzb3VyY2UuY29mZmVlLmpzeCddLFxuICAgIHByZWZpeGVzOiBbXG4gICAgICAncmVxdWlyZVxcXFxzK1tcXCdcIl0nLCAvLyByZXF1aXJlICcuL2ZvbydcbiAgICAgICdkZWZpbmVcXFxccytcXFxcWz9bXFwnXCJdJyAvLyBkZWZpbmUoWycuL2ZvbyddKSBvciBkZWZpbmUoJy4vZm9vJylcbiAgICBdLFxuICAgIGV4dGVuc2lvbnM6IFsnanMnLCAnanN4JywgJ3RzJywgJ3RzeCcsICdjb2ZmZWUnXSxcbiAgICByZWxhdGl2ZTogdHJ1ZSxcbiAgICByZXBsYWNlT25JbnNlcnQ6IFtcbiAgICAgIFsnXFxcXC5qc3g/JCcsICcnXSxcbiAgICAgIFsnXFxcXC50cyQnLCAnJ10sXG4gICAgICBbJ1xcXFwuY29mZmVlJCcsICcnXVxuICAgIF1cbiAgfSxcbiAge1xuICAgIHNjb3BlczogWydzb3VyY2UucGhwJ10sXG4gICAgcHJlZml4ZXM6IFtcbiAgICAgICdyZXF1aXJlX29uY2VcXFxcKFtcXCdcIl0nLCAvLyByZXF1aXJlX29uY2UoJ2Zvby5waHAnKVxuICAgICAgJ2luY2x1ZGVcXFxcKFtcXCdcIl0nIC8vIGluY2x1ZGUoJy4vZm9vLnBocCcpXG4gICAgXSxcbiAgICBleHRlbnNpb25zOiBbJ3BocCddLFxuICAgIHJlbGF0aXZlOiB0cnVlXG4gIH0sXG4gIHtcbiAgICBzY29wZXM6IFsnc291cmNlLnNhc3MnLCAnc291cmNlLmNzcy5zY3NzJywgJ3NvdXJjZS5sZXNzJywgJ3NvdXJjZS5zdHlsdXMnXSxcbiAgICBwcmVmaXhlczogW1xuICAgICAgJ0BpbXBvcnRbXFxcXCh8XFxcXHMrXT9bXFwnXCJdJyAvLyBAaW1wb3J0ICdmb28nIG9yIEBpbXBvcnQoJ2ZvbycpXG4gICAgXSxcbiAgICBleHRlbnNpb25zOiBbJ3Nhc3MnLCAnc2NzcycsICdjc3MnXSxcbiAgICByZWxhdGl2ZTogdHJ1ZSxcbiAgICByZXBsYWNlT25JbnNlcnQ6IFtcbiAgICAgIFsnKC8pP18oW14vXSo/KSQnLCAnJDEkMiddIC8vIGRpcjEvX2RpcjIvX2ZpbGUuc2FzcyA9PiBkaXIxL19kaXIyL2ZpbGUuc2Fzc1xuICAgIF1cbiAgfSxcbiAge1xuICAgIHNjb3BlczogWydzb3VyY2UuY3NzJ10sXG4gICAgcHJlZml4ZXM6IFtcbiAgICAgICdAaW1wb3J0XFxcXHMrW1xcJ1wiXT8nLCAvLyBAaW1wb3J0ICdmb28uY3NzJ1xuICAgICAgJ0BpbXBvcnRcXFxccyt1cmxcXFxcKFtcXCdcIl0/JyAvLyBAaW1wb3J0IHVybCgnZm9vLmNzcycpXG4gICAgXSxcbiAgICBleHRlbnNpb25zOiBbJ2NzcyddLFxuICAgIHJlbGF0aXZlOiB0cnVlXG4gIH0sXG4gIHtcbiAgICBzY29wZXM6IFsnc291cmNlLmNzcycsICdzb3VyY2Uuc2FzcycsICdzb3VyY2UubGVzcycsICdzb3VyY2UuY3NzLnNjc3MnLCAnc291cmNlLnN0eWx1cyddLFxuICAgIHByZWZpeGVzOiBbXG4gICAgICAndXJsXFxcXChbXFwnXCJdPydcbiAgICBdLFxuICAgIGV4dGVuc2lvbnM6IFsncG5nJywgJ2dpZicsICdqcGVnJywgJ2pwZycsICd3b2ZmJywgJ3R0ZicsICdzdmcnLCAnb3RmJ10sXG4gICAgcmVsYXRpdmU6IHRydWVcbiAgfSxcbiAge1xuICAgIHNjb3BlczogWydzb3VyY2UuYycsICdzb3VyY2UuY3BwJ10sXG4gICAgcHJlZml4ZXM6IFtcbiAgICAgICdeXFxcXHMqI2luY2x1ZGVcXFxccytbXFwnXCJdJ1xuICAgIF0sXG4gICAgZXh0ZW5zaW9uczogWydoJywgJ2hwcCddLFxuICAgIHJlbGF0aXZlOiB0cnVlLFxuICAgIGluY2x1ZGVDdXJyZW50RGlyZWN0b3J5OiBmYWxzZVxuICB9LFxuICB7XG4gICAgc2NvcGVzOiBbJ3NvdXJjZS5sdWEnXSxcbiAgICBwcmVmaXhlczogW1xuICAgICAgJ3JlcXVpcmVbXFxcXHMrfFxcXFwoXVtcXCdcIl0nXG4gICAgXSxcbiAgICBleHRlbnNpb25zOiBbJ2x1YSddLFxuICAgIHJlbGF0aXZlOiB0cnVlLFxuICAgIGluY2x1ZGVDdXJyZW50RGlyZWN0b3J5OiBmYWxzZSxcbiAgICByZXBsYWNlT25JbnNlcnQ6IFtcbiAgICAgIFsnXFxcXC8nLCAnLiddLFxuICAgICAgWydcXFxcXFxcXCcsICcuJ10sXG4gICAgICBbJ1xcXFwubHVhJCcsICcnXVxuICAgIF1cbiAgfSxcbiAge1xuICAgIHNjb3BlczogWydzb3VyY2UucnVieSddLFxuICAgIHByZWZpeGVzOiBbXG4gICAgICAnXlxcXFxzKnJlcXVpcmVbXFxcXHMrfFxcXFwoXVtcXCdcIl0nXG4gICAgXSxcbiAgICBleHRlbnNpb25zOiBbJ3JiJ10sXG4gICAgcmVsYXRpdmU6IHRydWUsXG4gICAgaW5jbHVkZUN1cnJlbnREaXJlY3Rvcnk6IGZhbHNlLFxuICAgIHJlcGxhY2VPbkluc2VydDogW1xuICAgICAgWydcXFxcLnJiJCcsICcnXVxuICAgIF1cbiAgfSxcbiAge1xuICAgIHNjb3BlczogWydzb3VyY2UucHl0aG9uJ10sXG4gICAgcHJlZml4ZXM6IFtcbiAgICAgICdeXFxcXHMqZnJvbVxcXFxzKycsXG4gICAgICAnXlxcXFxzKmltcG9ydFxcXFxzKydcbiAgICBdLFxuICAgIGV4dGVuc2lvbnM6IFsncHknXSxcbiAgICByZWxhdGl2ZTogdHJ1ZSxcbiAgICBpbmNsdWRlQ3VycmVudERpcmVjdG9yeTogZmFsc2UsXG4gICAgcmVwbGFjZU9uSW5zZXJ0OiBbXG4gICAgICBbJ1xcXFwvJywgJy4nXSxcbiAgICAgIFsnXFxcXFxcXFwnLCAnLiddLFxuICAgICAgWydcXFxcLnB5JCcsICcnXVxuICAgIF1cbiAgfVxuXVxuIl19