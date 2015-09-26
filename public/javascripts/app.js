var app = angular.module('demianczuk', ['ui.router']);

function SidebarService() {
  var sidebar = false;
  var previousUrl = '/';

  function openSidebar() {
    sidebar = true;
  }

  function closeSidebar() {
    sidebar = false;
  }

  function setPreviousUrl(url) {
    previousUrl = url;
  }

  function getPreviousUrl() {
    return previousUrl;
  }

  return {
    open: openSidebar,
    close: closeSidebar,
    setPreviousUrl: setPreviousUrl,
    previousUrl: getPreviousUrl,
    isOpened: function () {
      return sidebar;
    }
  };
}

app.run(function ($rootScope, $state) {
  $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState) {
    toState.previousUrl = fromState.url;
    if (fromState.url === '^') {
      toState.previousUrl = '/';
    }
  });
  $rootScope.$on("$stateChangeError", console.log.bind(console));
});

app.factory('sidebarService', function () {
  return new SidebarService();
});

app.controller('SidebarCtrl', function ($scope, $state, sidebarService) {
  $scope.sidebar = sidebarService;
});

app.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
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
    })
    .state('subscribe', {
      url: "/zapisz-sie",
      onEnter: function (sidebarService, $timeout, $stateParams) {
        var self = this;
        $timeout(function () {
          sidebarService.setPreviousUrl(self.previousUrl);
          sidebarService.open();
        });
      },
      onExit: function (sidebarService) {
        sidebarService.close();
      }
    });
  
  $locationProvider.html5Mode({
    enabled: true,
    requireBase: false
  });
});
