var foodApp = angular.module("foodApp", []).controller('mainController', function ($scope, $http) {
	console.log($scope);
	$scope.formData = {};
	$scope.fatSecret = {};
	$scope.total = {};

	$http.get("/api/foods")
		.success(function(data) {
			$scope.foods = data.foods;
			$scope.total = data.total;
		})
		.error(function(data) {
			console.log("Error: " + data);
		});

	$scope.createFood = function() {
		$http.post("/api/foods", $scope.formData)
			.success(function(data) {
				$scope.formData = {};
				$scope.foods = data.foods;
				$scope.total = Number($scope.total) + Number(data.newCalories);
			})
			.error(function(data) {
				console.log("Error: " + data);
			});
	};

	$scope.deleteFood = function(id) {
		$http.delete("/api/foods/" + id)
			.success(function(data) {
				$scope.foods = data.foods;
				$scope.total = Number($scope.total) - Number(data.deletedCalories);
			})
			.error(function(data) {
				console.log("Error: " + data);
			});
	};

	$scope.searchFood = function() {
		$http.post("/fatsecret/api", $scope.fatSecret)
			.success(function(data) {
				console.log("data", data);
				$scope.fatSecret = {};
				$scope.search = data;
			})
			.error(function(data) {
				console.log("Error: " + data);
			});
	};

	$scope.totalCalories = function() {

	}

});