/* eslint-disable linebreak-style */
/* eslint-disable indent */
/* eslint-disable linebreak-style */
/* global students pets:true*/
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
					controller: "studentController",
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
					controller: "studentController",
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
					controller: "studentController",
				},
			},
			url: "/update?studentid",
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
				if (currentParams.studentid) {
					$("#proxy-change").attr("data-currentItem", currentParams.studentid);
					$("#proxy-change").click();
				}
			}, 300);
		}
	});
}]);

app.controller("studentController", ["$scope", "$rootScope", "$stateParams", "dataFactory", "$state", "$timeout", function($scope, $rootScope, $stateParams, dataFactory, $state, $timeout) {
	$scope.students = students;
	$scope.pets = pets;
	$scope.currentStudent = {isActive: true};
	$scope.currentStudentOrg = {isActive: true};
	$scope.studentsUnderProcessing = {};
	$scope.studentConfig = {
		valueField: "_id",
		labelField: "name",
		searchField: ["name"],
		maxOptions: 25,
		maxItems: 1,
		closeAfterSelect: true,
	};

	$scope.proxyStudentChanged = function() {
		var itemId = $("#proxy-change").attr("data-currentItem");
		if (itemId) {
			$scope.currentStudent._id = itemId;
			$scope.studentChanged();
		}
	};

	$scope.studentChanged = function() {
		var studentId = $scope.currentStudent._id;
		if (studentId) {
			if ($state.current.name == "update") {
				var posInStudents = _.findIndex($scope.students, ["_id", studentId]);
				if (posInStudents > -1) {
					$scope.currentStudent = JSON.parse(JSON.stringify($scope.students[posInStudents]));
					$scope.currentStudentOrg = JSON.parse(JSON.stringify($scope.students[posInStudents]));
					$("#submit_update").removeClass("disabled");
					$("#reset_update").removeClass("disabled");
				}
			}
		}
	};

	$scope.navUpdate = function(student) {
		$state.go("update", {studentid: student._id});
	};

	$scope.submitUpdate = function() {
		var parsleyHandle = $("#model_form").parsley();
		parsleyHandle.validate();
		if (parsleyHandle.isValid()) {
			$("#submit_update").addClass("loading disabled");
			$("#reset_update").addClass("disabled");
			var _tmp = JSON.parse(JSON.stringify($scope.currentStudent));
			delete _tmp.isActive;
			var payload = {
				find: $scope.currentStudent._id,
				update: _tmp,
			};
			dataFactory.post("update-student.json", payload).then(function(data) {
				$("#submit_update").removeClass("loading disabled");
				$("#reset_update").removeClass("disabled");
				if (data.status) {
					dataFactory.toastSuccess("Student updated successfully");
					var pos = _.findIndex(students, ["_id", $scope.currentStudent._id]);
					if (pos >= 0) {
						students[pos] = data.doc;
						$scope.students = students;
						$scope.currentStudentOrg = JSON.parse(JSON.stringify(data.doc));
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
		$scope.currentStudent = JSON.parse(JSON.stringify($scope.currentStudentOrg));
	};

	$scope.setEnableddisabled = function(student) {
		if ($scope.studentsUnderProcessing[student._id]) {
			return;
		}
		$scope.studentsUnderProcessing[student._id] = true;
		$("." + student._id).parent().parent().find(".notched.circle.loading").css("visibility", "visible");
		$("." + student._id).checkbox();
		var payload = {
			find: student._id,
			update: {isActive: (!student.isActive)},
		};
		dataFactory.post("update-student.json", payload).then(function(data) {
			if (data.status) {
				student.isActive = data.doc.isActive;
				$timeout(function() {
					if (student.isActive) {
						$("." + student._id).checkbox("check");
					} else {
						$("." + student._id).checkbox("uncheck");
					}
					$("." + student._id).parent().parent().find(".notched.circle.loading").css("visibility", "hidden");
				}, 200);
			} else {
				$("." + student._id).parent().parent().find(".notched.circle.loading").css("visibility", "hidden");
				dataFactory.toastError(data.msg);
			}
			$scope.studentsUnderProcessing[student._id] = false;
		}, function() {
			$("." + student._id).parent().parent().find(".notched.circle.loading").hide();
			dataFactory.toastError("we have encounterd an unexpected error, plesae try after some time.");
			$scope.studentsUnderProcessing[student._id] = false;
		});
	};

	$scope.submitCreate = function() {
		var parsleyHandle = $("#model_form").parsley();
		parsleyHandle.validate();
		var additionalValidations = true;
		if (parsleyHandle.isValid() && additionalValidations) {
			$("#submit_create").addClass("loading disabled");
			$("#reset_create").addClass("disabled");
			dataFactory.post("create-student.json", $scope.currentStudent).then(function(data) {
				$("#submit_create").removeClass("loading disabled");
				$("#reset_create").addClass("disabled");
				if (data.status) {
					students.push(data.doc);
					$scope.students = students;
					$scope.clearCreate();
					dataFactory.toastSuccess("Student added successfully");
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
		$scope.currentStudent = {isActive: true};
	};

	$scope.deletestudent= function(student) {
		var studentsId = student._id;
		console.log(studentsId);
		dataFactory.post("delete-student.json", {_id: studentsId}).then(function(data) {
			if (data.status) {
				var pos = _.findIndex(students, {_id: studentsId});
				students.splice(pos, 1);
			}
		}, function() {
		});
	};
	$scope.fileUpload = function() {
        const myFile = document.getElementById("myFile").files;
		var formData = new FormData();

		for (var i =0; i<myFile.length; i++) {
			formData.append("myFile", myFile[i]);
		}
		dataFactory.post("/excel.json", formData).then(function(res) {
			console.log(res);
        }, function() {

		});
	};
}]);

