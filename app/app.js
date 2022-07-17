var app = angular.module('MyApp', ['ui.bootstrap']);

app.controller('Book', function ($scope, $http, $timeout) {
    $scope.modalWindow = false;
    $scope.orderByField = '';
    $scope.reverseSort = false;
    $scope.data = [];
    $scope.filteredList = [];
    $scope.successMessage = "";
    $scope.showMessage = false;
    $scope.requiredField = false;

    $http({ method: 'GET', url: 'http://localhost:3004/data' }).then(function successCallback(response) {
        $scope.data = response.data;
        $scope.showData();
    }, function errorCallback(response) {
          console.log(response.status);
    });
    
    $scope.showData = function(){
        $scope.currentPage = 1
        ,$scope.numPerPage = 10
        ,$scope.maxSize = 5
        $scope.totalRecord = $scope.data.length;
        $scope.numPages = function () {
            $scope.totalPages = Math.ceil($scope.data.length / $scope.numPerPage)
            return $scope.totalPages;
        };
        $scope.$watch("currentPage + numPerPage", function() {
            var begin = (($scope.currentPage - 1) * $scope.numPerPage)
            , end = begin + $scope.numPerPage;

            $scope.filteredList = $scope.data.slice(begin, end);
        });
    };

    $scope.addItem = function (item) {
        $scope.requiredField=false;
        $http({ method: 'POST', url: 'http://localhost:3004/data', data:item }).then(function successCallback(response) {
            $scope.data.unshift(response.data);
            $scope.item = {};
            $scope.showData();
            $scope.successMessage = "Added";
            $scope.showMessage = true;
            $timeout(function () {$scope.showMessage = false;}, 10000);
        }, function errorCallback(response) {
            console.log(response.status);
        });
    };

    $scope.CheckUncheckHeader = function () {
        $scope.IsAllChecked = false;
        for (var i = 0; i < $scope.filteredList.length; i++) {
            if (!$scope.filteredList[i].Selected) {
                $scope.IsAllChecked = false;
                break;
            }
        };
    };
    $scope.CheckUncheckHeader();

    $scope.CheckUncheckAll = function () {
        for (var i = 0; i < $scope.filteredList.length; i++) {
            $scope.filteredList[i].Selected = $scope.IsAllChecked;
        }
    };

    $scope.Delete = function () {
        var selected = new Array();
        for (var i = 0; i < $scope.filteredList.length; i++) {
            if ($scope.filteredList[i].Selected) {
                selected.push($scope.filteredList[i].id);
                $scope.filteredList[i].Selected = false;
            }
        }
        if(selected.length){
            for (var i = selected.length - 1; i >= 0; i--){
                $http({ method: 'DELETE', url: 'http://localhost:3004/data/'+selected[i]}).then(function successCallback(response) {
                    console.log(response);
                    $scope.data.splice(selected[i], 1);
                }, function errorCallback(response){
                    console.log(response.status);
                });
            }
            $timeout(function () {
                $scope.successMessage = "Deleted";
                $scope.showMessage = true;
                $scope.showData();}
            , 500);
            $timeout(function () {$scope.showMessage = false;}, 10000);
        }
    };

    $scope.closePopup = function(){
        $scope.showMessage = false;
    };

});