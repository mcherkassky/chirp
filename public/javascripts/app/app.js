var app = angular.module('app', ['ngRoute','ngResource','ui.bootstrap'], function($interpolateProvider, $locationProvider, $routeProvider){
    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');

    // $routeProvider.when('/admin',{
    //     templateUrl:'static/html/admin/accounts.html',
    //     controller: 'AccountCtrl'
    // });

    // $routeProvider.when('/admin/accounts/:account_id',{
    //     templateUrl:'/static/html/admin/users.html',
    //     controller: 'UserCtrl'
    // });

    // $routeProvider.otherwise({
    //     controller: "404Ctrl",
    //     template: "<div></div>"
    // });

    $locationProvider.html5Mode(true);
});

app.controller('CollapseCtrl', function($scope){
    $scope.show_offer = false
    $scope.click = function(){
        $scope.show_offer = !$scope.show_offer
    }
})