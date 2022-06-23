/* eslint-disable linebreak-style */
/* global pets:true*/
/* eslint no-global-assign:0 */
app.config(["$stateProvider", "$urlRouterProvider", "$locationProvider", function($stateProvider, $urlRouterProvider, $locationProvider) {
	$urlRouterProvider.otherwise("/list");
	$stateProvider
		.state("list", {
			onEnter: function() {
				$(".inner-nav-menu").find("a").removeClass("active");
				$(".inner-nav-menu-list").addClass("active");
			},
			views: {
				"main": {
					templateUrl: "/list.tpl.html",
					controller: "petController",
				},
			},
			url: "/list",
		})
		.state("create", {
			onEnter: function() {
				$(".inner-nav-menu").find("a").removeClass("active");
				$(".inner-nav-menu-create").addClass("active");
			},
			views: {
				"main": {
					templateUrl: "/create.tpl.html",
					controller: "petController",
				},
			},
			url: "/create",
		})
		.state("update", {
			onEnter: function() {
				$(".inner-nav-menu").find("a").removeClass("active");
				$(".inner-nav-menu-update").addClass("active");
			},
			views: {
				"main": {
					templateUrl: "/update.tpl.html",
					controller: "petController",
				},
			},
			url: "/update?petid",
		});
}]);
var currentState = null;
var currentParams = null;
app.run(["$rootScope", "$state", "$location", "$window", function run($rootScope, $state, $location, $window) {
	$rootScope.$on("$stateChangeStart", function(e, toState, toParams, fromState, fromParams) {
	//
	});
	$rootScope.$on("$stateChangeError", function(event, toState, toParams, fromState, fromParams, error) {
	//
	});
	$rootScope.$on("$stateChangeSuccess", function(event, toState, toParams, fromState, fromParams) {
		currentState = toState;
		currentParams = toParams;
	});
	$rootScope.$on("$viewContentLoaded", function(e, toState, toParams, fromState, fromParams) {
		if (currentState && ["update"].indexOf(currentState.name) >= 0) {
			setTimeout(function() {
				if (currentParams.petid) {
					$("#proxy-change").attr("data-currentItem", currentParams.petid);
					$("#proxy-change").click();
				}
			}, 300);
		}
	});
}]);

app.controller("petController", ["$scope", "$rootScope", "$stateParams", "dataFactory", "$state", "$timeout", function($scope, $rootScope, $stateParams, dataFactory, $state, $timeout) {
	$scope.pets = pets;
	$scope.currentPet = {isActive: true};
	$scope.currentPetOrg = {isActive: true};
	$scope.petsUnderProcessing = {};

	$scope.petConfig = {
		valueField: "_id",
		labelField: "name",
		searchField: ["name"],
		maxOptions: 25,
		maxItems: 1,
		closeAfterSelect: true,
	};

	$scope.proxyPetChanged = function() {
		var itemId = $("#proxy-change").attr("data-currentItem");
		if (itemId) {
			$scope.currentPet._id = itemId;
			$scope.petChanged();
		}
	};

	$scope.petChanged = function() {
		var petId = $scope.currentPet._id;
		if (petId) {
			if ($state.current.name == "update") {
				var posInPets = _.findIndex($scope.pets, ["_id", petId]);
				if (posInPets > -1) {
					$scope.currentPet = JSON.parse(JSON.stringify($scope.pets[posInPets]));
					$scope.currentPetOrg = JSON.parse(JSON.stringify($scope.pets[posInPets]));
					$("#submit_update").removeClass("disabled");
					$("#reset_update").removeClass("disabled");
				}
			}
		}
	};

	$scope.navUpdate = function(pet) {
		$state.go("update", {petid: pet._id});
	};

	$scope.submitUpdate = function() {
		var parsleyHandle = $("#model_form").parsley();
		parsleyHandle.validate();
		if (parsleyHandle.isValid()) {
			$("#submit_update").addClass("loading disabled");
			$("#reset_update").addClass("disabled");
			var _tmp = JSON.parse(JSON.stringify($scope.currentPet));
			delete _tmp.isActive;
			var payload = {
				find: $scope.currentPet._id,
				update: _tmp,
			};
			dataFactory.post("update-pet.json", payload).then(function(data) {
				$("#submit_update").removeClass("loading disabled");
				$("#reset_update").removeClass("disabled");
				if (data.status) {
					dataFactory.toastSuccess("Pet updated successfully");
					var pos = _.findIndex(pets, ["_id", $scope.currentPet._id]);
					if (pos >= 0) {
						pets[pos] = data.doc;
						$scope.pets = pets;
						$scope.currentPetOrg = JSON.parse(JSON.stringify(data.doc));
					}
				} else {
					dataFactory.toastError(data.msg);
				}
			}, function() {
				dataFactory.toastError("we have encounterd an unexpected error, plesae try after some time.");
				$("#submit_update").removeClass("loading disabled");
				$("#reset_update").removeClass("disabled");
			});
		}
	};

	$scope.resetUpdate = function() {
		$scope.currentPet = JSON.parse(JSON.stringify($scope.currentPetOrg));
	};

	$scope.setEnableddisabled = function(pet) {
		if ($scope.petsUnderProcessing[pet._id]) {
			return;
		}
		$scope.petsUnderProcessing[pet._id] = true;
		$("." + pet._id).parent().parent().find(".notched.circle.loading").css("visibility", "visible");
		$("." + pet._id).checkbox();
		var payload = {
			find: pet._id,
			update: {isActive: (!pet.isActive)},
		};
		dataFactory.post("update-pet.json", payload).then(function(data) {
			if (data.status) {
				pet.isActive = data.doc.isActive;
				$timeout(function() {
					if (pet.isActive) {
						$("." + pet._id).checkbox("check");
					} else {
						$("." + pet._id).checkbox("uncheck");
					}
					$("." + pet._id).parent().parent().find(".notched.circle.loading").css("visibility", "hidden");
				}, 200);
			} else {
				$("." + pet._id).parent().parent().find(".notched.circle.loading").css("visibility", "hidden");
				dataFactory.toastError(data.msg);
			}
			$scope.petsUnderProcessing[pet._id] = false;
		}, function() {
			$("." + pet._id).parent().parent().find(".notched.circle.loading").hide();
			dataFactory.toastError("we have encounterd an unexpected error, plesae try after some time.");
			$scope.petsUnderProcessing[pet._id] = false;
		});
	};

	$scope.submitCreate = function() {
		var parsleyHandle = $("#model_form").parsley();
		parsleyHandle.validate();
		if (parsleyHandle.isValid()) {
			$("#submit_create").addClass("loading disabled");
			$("#reset_create").addClass("disabled");
			dataFactory.post("create-pet.json", $scope.currentPet).then(function(data) {
				$("#submit_create").removeClass("loading disabled");
				$("#reset_create").removeClass("disabled");
				if (data.status) {
					pets.push(data.doc);
					$scope.pets = pets;
					$scope.clearCreate();
					dataFactory.toastSuccess("Pet added successfully");
				} else {
					dataFactory.toastError(data.msg);
				}
			}, function() {
				dataFactory.toastError("we have encounterd an unexpected error, plesae try after some time.");
				$("#submit_create").removeClass("loading disabled");
			});
		}
	};

	$scope.clearCreate = function() {
		$scope.currentPet = {isActive: true};
	};

	$scope.deletePet = function(pet) {
		var petId = pet._id;
		dataFactory.post("delete-pet.json", {_id: petId}).then(function(data) {
			if (data.status) {
				var pos = _.findIndex(pets, {_id: petId});
				pets.splice(pos, 1);
			}
		}, function() {

		});
	};
}]);

