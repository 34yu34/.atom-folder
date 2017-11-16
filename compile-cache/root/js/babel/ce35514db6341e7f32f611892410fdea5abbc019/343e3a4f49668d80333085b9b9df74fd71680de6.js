Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.showError = showError;

function showError(title, description, points) {
  var renderedPoints = points.map(function (item) {
    return '  • ' + item;
  });
  atom.notifications.addWarning('[Linter] ' + title, {
    dismissable: true,
    detail: description + '\n' + renderedPoints.join('\n')
  });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2JpbGx5Ly5hdG9tL3BhY2thZ2VzL2xpbnRlci9saWIvdmFsaWRhdGUvaGVscGVycy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUVPLFNBQVMsU0FBUyxDQUFDLEtBQWEsRUFBRSxXQUFtQixFQUFFLE1BQXFCLEVBQUU7QUFDbkYsTUFBTSxjQUFjLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxVQUFBLElBQUk7b0JBQVcsSUFBSTtHQUFFLENBQUMsQ0FBQTtBQUN4RCxNQUFJLENBQUMsYUFBYSxDQUFDLFVBQVUsZUFBYSxLQUFLLEVBQUk7QUFDakQsZUFBVyxFQUFFLElBQUk7QUFDakIsVUFBTSxFQUFLLFdBQVcsVUFBSyxjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxBQUFFO0dBQ3ZELENBQUMsQ0FBQTtDQUNIIiwiZmlsZSI6Ii9ob21lL2JpbGx5Ly5hdG9tL3BhY2thZ2VzL2xpbnRlci9saWIvdmFsaWRhdGUvaGVscGVycy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5cbmV4cG9ydCBmdW5jdGlvbiBzaG93RXJyb3IodGl0bGU6IHN0cmluZywgZGVzY3JpcHRpb246IHN0cmluZywgcG9pbnRzOiBBcnJheTxzdHJpbmc+KSB7XG4gIGNvbnN0IHJlbmRlcmVkUG9pbnRzID0gcG9pbnRzLm1hcChpdGVtID0+IGAgIOKAoiAke2l0ZW19YClcbiAgYXRvbS5ub3RpZmljYXRpb25zLmFkZFdhcm5pbmcoYFtMaW50ZXJdICR7dGl0bGV9YCwge1xuICAgIGRpc21pc3NhYmxlOiB0cnVlLFxuICAgIGRldGFpbDogYCR7ZGVzY3JpcHRpb259XFxuJHtyZW5kZXJlZFBvaW50cy5qb2luKCdcXG4nKX1gLFxuICB9KVxufVxuIl19