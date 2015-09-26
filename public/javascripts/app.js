var app = angular.module('demianczuk', ['ui.router']);

app.controller('AppCtrl', function ($scope) {
  $scope.sidebar = false;
  
  $scope.openSidebar = function () {
    $scope.sidebar = true;
  }

  $scope.closeSidebar = function () {
    $scope.sidebar = false;
  }
});

app.run(($rootScope) => {
  $rootScope.$on("$stateChangeError", console.log.bind(console));
});

app.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/');
  $stateProvider
    .state('home', {
      url: "/",
      templateUrl: "o-mnie.html"
    })
    .state('offer', {
      url: "/oferta",
      templateUrl: "oferta.html"
    })
    .state('testimonials', {
      url: "/referencje",
      templateUrl: "referencje.html"
    })
    .state('contact', {
      url: "/kontakt",
      templateUrl: "kontakt.html"
    });
});
