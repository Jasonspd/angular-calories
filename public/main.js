var foodApp = angular.module("foodApp", []).controller('mainController', function ($scope, $http) {

	$scope.formData = {};

	$http.get("/api/foods")
		.success(function(data) {
			$scope.foods = data;
			console.log(data);
		})
		.error(function(data) {
			console.log("Error: " + data);
		});

	$scope.createFood = function() {
		$http.post("/api/foods", $scope.formData)
			.success(function(data) {
				$scope.formData = {};
				$scope.foods = data;
				console.log(data);
			})
			.error(function(data) {
				console.log("Error: " + data);
			});
	};

	$scope.deleteFood = function(id) {
		$http.delete("/api/foods/" + id)
			.success(function(data) {
				$scope.foods = data;
				console.log(data);
			})
			.error(function(data) {
				console.log("Error: " + data);
			});
	};

});