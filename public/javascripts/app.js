var app = angular.module('demianczuk', ['ui.router', 'ct.ui.router.extras.dsr']);

function SidebarService() {
  var sidebar = false;

  function openSidebar() {
    sidebar = true;
  }

  function closeSidebar() {
    sidebar = false;
  }

  return {
    open: openSidebar,
    close: closeSidebar,
    isOpened: function () {
      return sidebar;
    }
  };
}

app.run(function ($rootScope, $state) {
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
    .state('pages', {
      url: "",
      template: "<div ui-view></div>",
      deepStateRedirect: {
        default: { state: "pages.home" }
      }
    })
    .state('pages.home', {
      url: "/",
      templateUrl: "o-mnie.html",
    })
    .state('pages.offer', {
      url: "/oferta",
      templateUrl: "oferta.html",
    })
    .state('pages.testimonials', {
      url: "/referencje",
      templateUrl: "referencje.html"
    })
    .state('pages.contact', {
      url: "/kontakt",
      templateUrl: "kontakt.html"
    })
    .state('subscribe', {
      url: "/zapisz-sie",
      onEnter: function (sidebarService) {
        sidebarService.open();
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
