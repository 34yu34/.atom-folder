Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

/** @babel */

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _werkzeug = require('./werkzeug');

function toArray(value) {
  return typeof value === 'string' ? value.split(',').map(function (item) {
    return item.trim();
  }) : Array.from(value);
}

function toBoolean(value) {
  return typeof value === 'string' ? !!value.match(/^(true|yes)$/i) : !!value;
}

var JobState = (function () {
  function JobState(parent, jobName) {
    _classCallCheck(this, JobState);

    this.parent = parent;
    this.jobName = jobName;
  }

  _createClass(JobState, [{
    key: 'getOutputFilePath',
    value: function getOutputFilePath() {
      return this.outputFilePath;
    }
  }, {
    key: 'setOutputFilePath',
    value: function setOutputFilePath(value) {
      this.outputFilePath = value;
    }
  }, {
    key: 'getFileDatabase',
    value: function getFileDatabase() {
      return this.fileDatabase;
    }
  }, {
    key: 'setFileDatabase',
    value: function setFileDatabase(value) {
      this.fileDatabase = value;
    }
  }, {
    key: 'getLogMessages',
    value: function getLogMessages() {
      return this.logMessages;
    }
  }, {
    key: 'setLogMessages',
    value: function setLogMessages(value) {
      this.logMessages = value;
    }
  }, {
    key: 'getJobName',
    value: function getJobName() {
      return this.jobName;
    }
  }, {
    key: 'getFilePath',
    value: function getFilePath() {
      return this.parent.getFilePath();
    }
  }, {
    key: 'getProjectPath',
    value: function getProjectPath() {
      return this.parent.getProjectPath();
    }
  }, {
    key: 'getTexFilePath',
    value: function getTexFilePath() {
      return this.parent.getTexFilePath();
    }
  }, {
    key: 'setTexFilePath',
    value: function setTexFilePath(value) {
      this.parent.setTexFilePath(value);
    }
  }, {
    key: 'getKnitrFilePath',
    value: function getKnitrFilePath() {
      return this.parent.getKnitrFilePath();
    }
  }, {
    key: 'setKnitrFilePath',
    value: function setKnitrFilePath(value) {
      this.parent.setKnitrFilePath(value);
    }
  }, {
    key: 'getCleanPatterns',
    value: function getCleanPatterns() {
      return this.parent.getCleanPatterns();
    }
  }, {
    key: 'getEnableSynctex',
    value: function getEnableSynctex() {
      return this.parent.getEnableSynctex();
    }
  }, {
    key: 'getEnableShellEscape',
    value: function getEnableShellEscape() {
      return this.parent.getEnableShellEscape();
    }
  }, {
    key: 'getEnableExtendedBuildMode',
    value: function getEnableExtendedBuildMode() {
      return this.parent.getEnableExtendedBuildMode();
    }
  }, {
    key: 'getEngine',
    value: function getEngine() {
      return this.parent.getEngine();
    }
  }, {
    key: 'getMoveResultToSourceDirectory',
    value: function getMoveResultToSourceDirectory() {
      return this.parent.getMoveResultToSourceDirectory();
    }
  }, {
    key: 'getOutputDirectory',
    value: function getOutputDirectory() {
      return this.parent.getOutputDirectory();
    }
  }, {
    key: 'getOutputFormat',
    value: function getOutputFormat() {
      return this.parent.getOutputFormat();
    }
  }, {
    key: 'getProducer',
    value: function getProducer() {
      return this.parent.getProducer();
    }
  }, {
    key: 'getShouldRebuild',
    value: function getShouldRebuild() {
      return this.parent.getShouldRebuild();
    }
  }]);

  return JobState;
})();

var BuildState = (function () {
  function BuildState(filePath) {
    var jobNames = arguments.length <= 1 || arguments[1] === undefined ? [null] : arguments[1];
    var shouldRebuild = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

    _classCallCheck(this, BuildState);

    this.setFilePath(filePath);
    this.setJobNames(jobNames);
    this.setShouldRebuild(shouldRebuild);
    this.setEnableSynctex(false);
    this.setEnableShellEscape(false);
    this.setEnableExtendedBuildMode(false);
    this.subfiles = new Set();
  }

  _createClass(BuildState, [{
    key: 'getKnitrFilePath',
    value: function getKnitrFilePath() {
      return this.knitrFilePath;
    }
  }, {
    key: 'setKnitrFilePath',
    value: function setKnitrFilePath(value) {
      this.knitrFilePath = value;
    }
  }, {
    key: 'getTexFilePath',
    value: function getTexFilePath() {
      return this.texFilePath;
    }
  }, {
    key: 'setTexFilePath',
    value: function setTexFilePath(value) {
      this.texFilePath = value;
    }
  }, {
    key: 'getProjectPath',
    value: function getProjectPath() {
      return this.projectPath;
    }
  }, {
    key: 'setProjectPath',
    value: function setProjectPath(value) {
      this.projectPath = value;
    }
  }, {
    key: 'getCleanPatterns',
    value: function getCleanPatterns() {
      return this.cleanPatterns;
    }
  }, {
    key: 'setCleanPatterns',
    value: function setCleanPatterns(value) {
      this.cleanPatterns = toArray(value);
    }
  }, {
    key: 'getEnableSynctex',
    value: function getEnableSynctex() {
      return this.enableSynctex;
    }
  }, {
    key: 'setEnableSynctex',
    value: function setEnableSynctex(value) {
      this.enableSynctex = toBoolean(value);
    }
  }, {
    key: 'getEnableShellEscape',
    value: function getEnableShellEscape() {
      return this.enableShellEscape;
    }
  }, {
    key: 'setEnableShellEscape',
    value: function setEnableShellEscape(value) {
      this.enableShellEscape = toBoolean(value);
    }
  }, {
    key: 'getEnableExtendedBuildMode',
    value: function getEnableExtendedBuildMode() {
      return this.enableExtendedBuildMode;
    }
  }, {
    key: 'setEnableExtendedBuildMode',
    value: function setEnableExtendedBuildMode(value) {
      this.enableExtendedBuildMode = toBoolean(value);
    }
  }, {
    key: 'getEngine',
    value: function getEngine() {
      return this.engine;
    }
  }, {
    key: 'setEngine',
    value: function setEngine(value) {
      this.engine = value;
    }
  }, {
    key: 'getJobStates',
    value: function getJobStates() {
      return this.jobStates;
    }
  }, {
    key: 'setJobStates',
    value: function setJobStates(value) {
      this.jobStates = value;
    }
  }, {
    key: 'getMoveResultToSourceDirectory',
    value: function getMoveResultToSourceDirectory() {
      return this.moveResultToSourceDirectory;
    }
  }, {
    key: 'setMoveResultToSourceDirectory',
    value: function setMoveResultToSourceDirectory(value) {
      this.moveResultToSourceDirectory = toBoolean(value);
    }
  }, {
    key: 'getOutputFormat',
    value: function getOutputFormat() {
      return this.outputFormat;
    }
  }, {
    key: 'setOutputFormat',
    value: function setOutputFormat(value) {
      this.outputFormat = value;
    }
  }, {
    key: 'getOutputDirectory',
    value: function getOutputDirectory() {
      return this.outputDirectory;
    }
  }, {
    key: 'setOutputDirectory',
    value: function setOutputDirectory(value) {
      this.outputDirectory = value;
    }
  }, {
    key: 'getProducer',
    value: function getProducer() {
      return this.producer;
    }
  }, {
    key: 'setProducer',
    value: function setProducer(value) {
      this.producer = value;
    }
  }, {
    key: 'getSubfiles',
    value: function getSubfiles() {
      return Array.from(this.subfiles.values());
    }
  }, {
    key: 'addSubfile',
    value: function addSubfile(value) {
      this.subfiles.add(value);
    }
  }, {
    key: 'hasSubfile',
    value: function hasSubfile(value) {
      return this.subfiles.has(value);
    }
  }, {
    key: 'getShouldRebuild',
    value: function getShouldRebuild() {
      return this.shouldRebuild;
    }
  }, {
    key: 'setShouldRebuild',
    value: function setShouldRebuild(value) {
      this.shouldRebuild = toBoolean(value);
    }
  }, {
    key: 'getFilePath',
    value: function getFilePath() {
      return this.filePath;
    }
  }, {
    key: 'setFilePath',
    value: function setFilePath(value) {
      this.filePath = value;
      this.texFilePath = (0, _werkzeug.isTexFile)(value) ? value : undefined;
      this.knitrFilePath = (0, _werkzeug.isKnitrFile)(value) ? value : undefined;
      this.projectPath = _path2['default'].dirname(value);
    }
  }, {
    key: 'getJobNames',
    value: function getJobNames() {
      return this.jobStates.map(function (jobState) {
        return jobState.getJobName();
      });
    }
  }, {
    key: 'setJobNames',
    value: function setJobNames(value) {
      var _this = this;

      this.jobStates = toArray(value).map(function (jobName) {
        return new JobState(_this, jobName);
      });
    }
  }]);

  return BuildState;
})();

exports['default'] = BuildState;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2JpbGx5Ly5hdG9tL3BhY2thZ2VzL2xhdGV4L2xpYi9idWlsZC1zdGF0ZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7b0JBRWlCLE1BQU07Ozs7d0JBQ2dCLFlBQVk7O0FBRW5ELFNBQVMsT0FBTyxDQUFFLEtBQUssRUFBRTtBQUN2QixTQUFPLEFBQUMsT0FBTyxLQUFLLEtBQUssUUFBUSxHQUFJLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQUEsSUFBSTtXQUFJLElBQUksQ0FBQyxJQUFJLEVBQUU7R0FBQSxDQUFDLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQTtDQUNuRzs7QUFFRCxTQUFTLFNBQVMsQ0FBRSxLQUFLLEVBQUU7QUFDekIsU0FBTyxBQUFDLE9BQU8sS0FBSyxLQUFLLFFBQVEsR0FBSSxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFBO0NBQzlFOztJQUVLLFFBQVE7QUFDQSxXQURSLFFBQVEsQ0FDQyxNQUFNLEVBQUUsT0FBTyxFQUFFOzBCQUQxQixRQUFROztBQUVWLFFBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFBO0FBQ3BCLFFBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFBO0dBQ3ZCOztlQUpHLFFBQVE7O1dBTU0sNkJBQUc7QUFDbkIsYUFBTyxJQUFJLENBQUMsY0FBYyxDQUFBO0tBQzNCOzs7V0FFaUIsMkJBQUMsS0FBSyxFQUFFO0FBQ3hCLFVBQUksQ0FBQyxjQUFjLEdBQUcsS0FBSyxDQUFBO0tBQzVCOzs7V0FFZSwyQkFBRztBQUNqQixhQUFPLElBQUksQ0FBQyxZQUFZLENBQUE7S0FDekI7OztXQUVlLHlCQUFDLEtBQUssRUFBRTtBQUN0QixVQUFJLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQTtLQUMxQjs7O1dBRWMsMEJBQUc7QUFDaEIsYUFBTyxJ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dkIsVUFBSSxDQUFDLGFBQWEsR0FBRyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUE7S0FDdEM7OztXQUVXLHVCQUFHO0FBQ2IsYUFBTyxJQUFJLENBQUMsUUFBUSxDQUFBO0tBQ3JCOzs7V0FFVyxxQkFBQyxLQUFLLEVBQUU7QUFDbEIsVUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUE7QUFDckIsVUFBSSxDQUFDLFdBQVcsR0FBRyx5QkFBVSxLQUFLLENBQUMsR0FBRyxLQUFLLEdBQUcsU0FBUyxDQUFBO0FBQ3ZELFVBQUksQ0FBQyxhQUFhLEdBQUcsMkJBQVksS0FBSyxDQUFDLEdBQUcsS0FBSyxHQUFHLFNBQVMsQ0FBQTtBQUMzRCxVQUFJLENBQUMsV0FBVyxHQUFHLGtCQUFLLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQTtLQUN2Qzs7O1dBRVcsdUJBQUc7QUFDYixhQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFVBQUEsUUFBUTtlQUFJLFFBQVEsQ0FBQyxVQUFVLEVBQUU7T0FBQSxDQUFDLENBQUE7S0FDN0Q7OztXQUVXLHFCQUFDLEtBQUssRUFBRTs7O0FBQ2xCLFVBQUksQ0FBQyxTQUFTLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFBLE9BQU87ZUFBSSxJQUFJLFFBQVEsUUFBTyxPQUFPLENBQUM7T0FBQSxDQUFDLENBQUE7S0FDNUU7OztTQXhKa0IsVUFBVTs7O3FCQUFWLFVBQVUiLCJmaWxlIjoiL2hvbWUvYmlsbHkvLmF0b20vcGFja2FnZXMvbGF0ZXgvbGliL2J1aWxkLXN0YXRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBiYWJlbCAqL1xuXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xuaW1wb3J0IHsgaXNUZXhGaWxlLCBpc0tuaXRyRmlsZSB9IGZyb20gJy4vd2Vya3pldWcnXG5cbmZ1bmN0aW9uIHRvQXJyYXkgKHZhbHVlKSB7XG4gIHJldHVybiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykgPyB2YWx1ZS5zcGxpdCgnLCcpLm1hcChpdGVtID0+IGl0ZW0udHJpbSgpKSA6IEFycmF5LmZyb20odmFsdWUpXG59XG5cbmZ1bmN0aW9uIHRvQm9vbGVhbiAodmFsdWUpIHtcbiAgcmV0dXJuICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSA/ICEhdmFsdWUubWF0Y2goL14odHJ1ZXx5ZXMpJC9pKSA6ICEhdmFsdWVcbn1cblxuY2xhc3MgSm9iU3RhdGUge1xuICBjb25zdHJ1Y3RvciAocGFyZW50LCBqb2JOYW1lKSB7XG4gICAgdGhpcy5wYXJlbnQgPSBwYXJlbnRcbiAgICB0aGlzLmpvYk5hbWUgPSBqb2JOYW1lXG4gIH1cblxuICBnZXRPdXRwdXRGaWxlUGF0aCAoKSB7XG4gICAgcmV0dXJuIHRoaXMub3V0cHV0RmlsZVBhdGhcbiAgfVxuXG4gIHNldE91dHB1dEZpbGVQYXRoICh2YWx1ZSkge1xuICAgIHRoaXMub3V0cHV0RmlsZVBhdGggPSB2YWx1ZVxuICB9XG5cbiAgZ2V0RmlsZURhdGFiYXNlICgpIHtcbiAgICByZXR1cm4gdGhpcy5maWxlRGF0YWJhc2VcbiAgfVxuXG4gIHNldEZpbGVEYXRhYmFzZSAodmFsdWUpIHtcbiAgICB0aGlzLmZpbGVEYXRhYmFzZSA9IHZhbHVlXG4gIH1cblxuICBnZXRMb2dNZXNzYWdlcyAoKSB7XG4gICAgcmV0dXJuIHRoaXMubG9nTWVzc2FnZXNcbiAgfVxuXG4gIHNldExvZ01lc3NhZ2VzICh2YWx1ZSkge1xuICAgIHRoaXMubG9nTWVzc2FnZXMgPSB2YWx1ZVxuICB9XG5cbiAgZ2V0Sm9iTmFtZSAoKSB7XG4gICAgcmV0dXJuIHRoaXMuam9iTmFtZVxuICB9XG5cbiAgZ2V0RmlsZVBhdGggKCkge1xuICAgIHJldHVybiB0aGlzLnBhcmVudC5nZXRGaWxlUGF0aCgpXG4gIH1cblxuICBnZXRQcm9qZWN0UGF0aCAoKSB7XG4gICAgcmV0dXJuIHRoaXMucGFyZW50LmdldFByb2plY3RQYXRoKClcbiAgfVxuXG4gIGdldFRleEZpbGVQYXRoICgpIHtcbiAgICByZXR1cm4gdGhpcy5wYXJlbnQuZ2V0VGV4RmlsZVBhdGgoKVxuICB9XG5cbiAgc2V0VGV4RmlsZVBhdGggKHZhbHVlKSB7XG4gICAgdGhpcy5wYXJlbnQuc2V0VGV4RmlsZVBhdGgodmFsdWUpXG4gIH1cblxuICBnZXRLbml0ckZpbGVQYXRoICgpIHtcbiAgICByZXR1cm4gdGhpcy5wYXJlbnQuZ2V0S25pdHJGaWxlUGF0aCgpXG4gIH1cblxuICBzZXRLbml0ckZpbGVQYXRoICh2YWx1ZSkge1xuICAgIHRoaXMucGFyZW50LnNldEtuaXRyRmlsZVBhdGgodmFsdWUpXG4gIH1cblxuICBnZXRDbGVhblBhdHRlcm5zICgpIHtcbiAgICByZXR1cm4gdGhpcy5wYXJlbnQuZ2V0Q2xlYW5QYXR0ZXJucygpXG4gIH1cblxuICBnZXRFbmFibGVTeW5jdGV4ICgpIHtcbiAgICByZXR1cm4gdGhpcy5wYXJlbnQuZ2V0RW5hYmxlU3luY3RleCgpXG4gIH1cblxuICBnZXRFbmFibGVTaGVsbEVzY2FwZSAoKSB7XG4gICAgcmV0dXJuIHRoaXMucGFyZW50LmdldEVuYWJsZVNoZWxsRXNjYXBlKClcbiAgfVxuXG4gIGdldEVuYWJsZUV4dGVuZGVkQnVpbGRNb2RlICgpIHtcbiAgICByZXR1cm4gdGhpcy5wYXJlbnQuZ2V0RW5hYmxlRXh0ZW5kZWRCdWlsZE1vZGUoKVxuICB9XG5cbiAgZ2V0RW5naW5lICgpIHtcbiAgICByZXR1cm4gdGhpcy5wYXJlbnQuZ2V0RW5naW5lKClcbiAgfVxuXG4gIGdldE1vdmVSZXN1bHRUb1NvdXJjZURpcmVjdG9yeSAoKSB7XG4gICAgcmV0dXJuIHRoaXMucGFyZW50LmdldE1vdmVSZXN1bHRUb1NvdXJjZURpcmVjdG9yeSgpXG4gIH1cblxuICBnZXRPdXRwdXREaXJlY3RvcnkgKCkge1xuICAgIHJldHVybiB0aGlzLnBhcmVudC5nZXRPdXRwdXREaXJlY3RvcnkoKVxuICB9XG5cbiAgZ2V0T3V0cHV0Rm9ybWF0ICgpIHtcbiAgICByZXR1cm4gdGhpcy5wYXJlbnQuZ2V0T3V0cHV0Rm9ybWF0KClcbiAgfVxuXG4gIGdldFByb2R1Y2VyICgpIHtcbiAgICByZXR1cm4gdGhpcy5wYXJlbnQuZ2V0UHJvZHVjZXIoKVxuICB9XG5cbiAgZ2V0U2hvdWxkUmVidWlsZCAoKSB7XG4gICAgcmV0dXJuIHRoaXMucGFyZW50LmdldFNob3VsZFJlYnVpbGQoKVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJ1aWxkU3RhdGUge1xuICBjb25zdHJ1Y3RvciAoZmlsZVBhdGgsIGpvYk5hbWVzID0gW251bGxdLCBzaG91bGRSZWJ1aWxkID0gZmFsc2UpIHtcbiAgICB0aGlzLnNldEZpbGVQYXRoKGZpbGVQYXRoKVxuICAgIHRoaXMuc2V0Sm9iTmFtZXMoam9iTmFtZXMpXG4gICAgdGhpcy5zZXRTaG91bGRSZWJ1aWxkKHNob3VsZFJlYnVpbGQpXG4gICAgdGhpcy5zZXRFbmFibGVTeW5jdGV4KGZhbHNlKVxuICAgIHRoaXMuc2V0RW5hYmxlU2hlbGxFc2NhcGUoZmFsc2UpXG4gICAgdGhpcy5zZXRFbmFibGVFeHRlbmRlZEJ1aWxkTW9kZShmYWxzZSlcbiAgICB0aGlzLnN1YmZpbGVzID0gbmV3IFNldCgpXG4gIH1cblxuICBnZXRLbml0ckZpbGVQYXRoICgpIHtcbiAgICByZXR1cm4gdGhpcy5rbml0ckZpbGVQYXRoXG4gIH1cblxuICBzZXRLbml0ckZpbGVQYXRoICh2YWx1ZSkge1xuICAgIHRoaXMua25pdHJGaWxlUGF0aCA9IHZhbHVlXG4gIH1cblxuICBnZXRUZXhGaWxlUGF0aCAoKSB7XG4gICAgcmV0dXJuIHRoaXMudGV4RmlsZVBhdGhcbiAgfVxuXG4gIHNldFRleEZpbGVQYXRoICh2YWx1ZSkge1xuICAgIHRoaXMudGV4RmlsZVBhdGggPSB2YWx1ZVxuICB9XG5cbiAgZ2V0UHJvamVjdFBhdGggKCkge1xuICAgIHJldHVybiB0aGlzLnByb2plY3RQYXRoXG4gIH1cblxuICBzZXRQcm9qZWN0UGF0aCAodmFsdWUpIHtcbiAgICB0aGlzLnByb2plY3RQYXRoID0gdmFsdWVcbiAgfVxuXG4gIGdldENsZWFuUGF0dGVybnMgKCkge1xuICAgIHJldHVybiB0aGlzLmNsZWFuUGF0dGVybnNcbiAgfVxuXG4gIHNldENsZWFuUGF0dGVybnMgKHZhbHVlKSB7XG4gICAgdGhpcy5jbGVhblBhdHRlcm5zID0gdG9BcnJheSh2YWx1ZSlcbiAgfVxuXG4gIGdldEVuYWJsZVN5bmN0ZXggKCkge1xuICAgIHJldHVybiB0aGlzLmVuYWJsZVN5bmN0ZXhcbiAgfVxuXG4gIHNldEVuYWJsZVN5bmN0ZXggKHZhbHVlKSB7XG4gICAgdGhpcy5lbmFibGVTeW5jdGV4ID0gdG9Cb29sZWFuKHZhbHVlKVxuICB9XG5cbiAgZ2V0RW5hYmxlU2hlbGxFc2NhcGUgKCkge1xuICAgIHJldHVybiB0aGlzLmVuYWJsZVNoZWxsRXNjYXBlXG4gIH1cblxuICBzZXRFbmFibGVTaGVsbEVzY2FwZSAodmFsdWUpIHtcbiAgICB0aGlzLmVuYWJsZVNoZWxsRXNjYXBlID0gdG9Cb29sZWFuKHZhbHVlKVxuICB9XG5cbiAgZ2V0RW5hYmxlRXh0ZW5kZWRCdWlsZE1vZGUgKCkge1xuICAgIHJldHVybiB0aGlzLmVuYWJsZUV4dGVuZGVkQnVpbGRNb2RlXG4gIH1cblxuICBzZXRFbmFibGVFeHRlbmRlZEJ1aWxkTW9kZSAodmFsdWUpIHtcbiAgICB0aGlzLmVuYWJsZUV4dGVuZGVkQnVpbGRNb2RlID0gdG9Cb29sZWFuKHZhbHVlKVxuICB9XG5cbiAgZ2V0RW5naW5lICgpIHtcbiAgICByZXR1cm4gdGhpcy5lbmdpbmVcbiAgfVxuXG4gIHNldEVuZ2luZSAodmFsdWUpIHtcbiAgICB0aGlzLmVuZ2luZSA9IHZhbHVlXG4gIH1cblxuICBnZXRKb2JTdGF0ZXMgKCkge1xuICAgIHJldHVybiB0aGlzLmpvYlN0YXRlc1xuICB9XG5cbiAgc2V0Sm9iU3RhdGVzICh2YWx1ZSkge1xuICAgIHRoaXMuam9iU3RhdGVzID0gdmFsdWVcbiAgfVxuXG4gIGdldE1vdmVSZXN1bHRUb1NvdXJjZURpcmVjdG9yeSAoKSB7XG4gICAgcmV0dXJuIHRoaXMubW92ZVJlc3VsdFRvU291cmNlRGlyZWN0b3J5XG4gIH1cblxuICBzZXRNb3ZlUmVzdWx0VG9Tb3VyY2VEaXJlY3RvcnkgKHZhbHVlKSB7XG4gICAgdGhpcy5tb3ZlUmVzdWx0VG9Tb3VyY2VEaXJlY3RvcnkgPSB0b0Jvb2xlYW4odmFsdWUpXG4gIH1cblxuICBnZXRPdXRwdXRGb3JtYXQgKCkge1xuICAgIHJldHVybiB0aGlzLm91dHB1dEZvcm1hdFxuICB9XG5cbiAgc2V0T3V0cHV0Rm9ybWF0ICh2YWx1ZSkge1xuICAgIHRoaXMub3V0cHV0Rm9ybWF0ID0gdmFsdWVcbiAgfVxuXG4gIGdldE91dHB1dERpcmVjdG9yeSAoKSB7XG4gICAgcmV0dXJuIHRoaXMub3V0cHV0RGlyZWN0b3J5XG4gIH1cblxuICBzZXRPdXRwdXREaXJlY3RvcnkgKHZhbHVlKSB7XG4gICAgdGhpcy5vdXRwdXREaXJlY3RvcnkgPSB2YWx1ZVxuICB9XG5cbiAgZ2V0UHJvZHVjZXIgKCkge1xuICAgIHJldHVybiB0aGlzLnByb2R1Y2VyXG4gIH1cblxuICBzZXRQcm9kdWNlciAodmFsdWUpIHtcbiAgICB0aGlzLnByb2R1Y2VyID0gdmFsdWVcbiAgfVxuXG4gIGdldFN1YmZpbGVzICgpIHtcbiAgICByZXR1cm4gQXJyYXkuZnJvbSh0aGlzLnN1YmZpbGVzLnZhbHVlcygpKVxuICB9XG5cbiAgYWRkU3ViZmlsZSAodmFsdWUpIHtcbiAgICB0aGlzLnN1YmZpbGVzLmFkZCh2YWx1ZSlcbiAgfVxuXG4gIGhhc1N1YmZpbGUgKHZhbHVlKSB7XG4gICAgcmV0dXJuIHRoaXMuc3ViZmlsZXMuaGFzKHZhbHVlKVxuICB9XG5cbiAgZ2V0U2hvdWxkUmVidWlsZCAoKSB7XG4gICAgcmV0dXJuIHRoaXMuc2hvdWxkUmVidWlsZFxuICB9XG5cbiAgc2V0U2hvdWxkUmVidWlsZCAodmFsdWUpIHtcbiAgICB0aGlzLnNob3VsZFJlYnVpbGQgPSB0b0Jvb2xlYW4odmFsdWUpXG4gIH1cblxuICBnZXRGaWxlUGF0aCAoKSB7XG4gICAgcmV0dXJuIHRoaXMuZmlsZVBhdGhcbiAgfVxuXG4gIHNldEZpbGVQYXRoICh2YWx1ZSkge1xuICAgIHRoaXMuZmlsZVBhdGggPSB2YWx1ZVxuICAgIHRoaXMudGV4RmlsZVBhdGggPSBpc1RleEZpbGUodmFsdWUpID8gdmFsdWUgOiB1bmRlZmluZWRcbiAgICB0aGlzLmtuaXRyRmlsZVBhdGggPSBpc0tuaXRyRmlsZSh2YWx1ZSkgPyB2YWx1ZSA6IHVuZGVmaW5lZFxuICAgIHRoaXMucHJvamVjdFBhdGggPSBwYXRoLmRpcm5hbWUodmFsdWUpXG4gIH1cblxuICBnZXRKb2JOYW1lcyAoKSB7XG4gICAgcmV0dXJuIHRoaXMuam9iU3RhdGVzLm1hcChqb2JTdGF0ZSA9PiBqb2JTdGF0ZS5nZXRKb2JOYW1lKCkpXG4gIH1cblxuICBzZXRKb2JOYW1lcyAodmFsdWUpIHtcbiAgICB0aGlzLmpvYlN0YXRlcyA9IHRvQXJyYXkodmFsdWUpLm1hcChqb2JOYW1lID0+IG5ldyBKb2JTdGF0ZSh0aGlzLCBqb2JOYW1lKSlcbiAgfVxufVxuIl19