var app = angular.module('demianczuk', [
  'ui.router', 
  'ct.ui.router.extras.dsr', 
  'ct.ui.router.extras.sticky',
  'ngAnimate'
]);

app.run(function ($rootScope, $state) {
  $rootScope.$on("$stateChangeError", console.log.bind(console));
});

// sidebar service and controller

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

app.factory('sidebarService', function () {
  return new SidebarService();
});

app.controller('SidebarCtrl', function ($scope, $state, sidebarService) {
  $scope.sidebar = sidebarService;
});

// offer controller

app.controller('OfferCtrl', function ($scope) {

});

// configure application

app.config(function($stateProvider, $urlRouterProvider, $locationProvider, $provide) {
  /*$provide.decorator('$uiViewScroll', function ($delegate) {
    return function (uiViewElement) {
      window.scrollTo(0, 0);
    }; 
  });*/

  $urlRouterProvider.otherwise('/');
  $stateProvider
    .state('pages', {
      url: "",
      sticky: true,
      deepStateRedirect: {
        default: { state: "pages.home" }
      },
      views: {
        'pages': {
            template: '<div ui-view></div>'
        }
      }
    })
    .state('pages.home', {
      url: "/",
      templateUrl: "/o-mnie.html"
    })
    .state('pages.offer', {
      url: "/oferta",
      templateUrl: "/oferta.html",
      deepStateRedirect: {
        default: { state: "pages.offer.highschool" }
      }
    })
    .state('pages.offer.highschool', {
      url: "/egzamin-gimnazjalny",
      templateUrl: "/egzamin-gimnazjalny.html"
    })
    .state('pages.offer.secondarybasic', {
      url: "/matura-podstawowa",
      templateUrl: "/matura-podstawowa.html"
    })
    .state('pages.offer.secondaryextended', {
      url: "/matura-rozszerzona",
      templateUrl: "/matura-rozszerzona.html"
    })
    .state('pages.offer.student', {
      url: "/student",
      templateUrl: "/student.html"
    })
    .state('pages.offer.individual', {
      url: "/lekcje-indywidualne",
      templateUrl: "/lekcje-indywidualne.html"
    })
    .state('pages.testimonials', {
      url: "/referencje",
      templateUrl: "/referencje.html"
    })
    .state('pages.contact', {
      url: "/kontakt",
      templateUrl: "/kontakt.html"
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
