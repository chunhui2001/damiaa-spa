function toolTip($scope, $timeout, message, type) {
    $scope.isDanger = type === 'danger';
    $scope.isInfo   = type === 'info';
    $scope.isError  = type === 'error';

    $scope.message = message;

    if ($timeout) {
	    $timeout(function () {
	      $scope.isDanger = false;
	      $scope.isInfo = false;
	      $scope.isError = false;
	    }, 5000);
    }
}