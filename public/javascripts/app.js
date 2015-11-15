var app = angular.module('demianczuk', [
  'ui.router', 
  'ct.ui.router.extras.dsr', 
  'ct.ui.router.extras.sticky',
  'ngAnimate',
  'ui.bootstrap.showErrors',
  'elif',
  'ngSanitize',
  'ngToast',
  'ui.validate'
]);

app.run(function ($rootScope, $state) {
  $rootScope.$on("$stateChangeError", console.log.bind(console));
});

// sidebar service and controller

function SidebarService() {
  var sidebar = false;
  var isDarkNavbar = true;

  function openSidebar() {
    sidebar = true;
  }

  function closeSidebar() {
    sidebar = false;
  }

  function darkNavbar() {
    isDarkNavbar = true;
  }

  function brightNavbar() {
    isDarkNavbar = false;
  }

  return {
    open: openSidebar,
    close: closeSidebar,
    darkNavbar: darkNavbar,
    brightNavbar: brightNavbar,
    isOpened: function () {
      return sidebar;
    },
    isDarkNavbar: function () {
      return isDarkNavbar;
    }
  };
}

app.factory('sidebarService', function () {
  return new SidebarService();
});

app.controller('SidebarCtrl', function ($scope, $state, $timeout, sidebarService, ngToast) {
  $scope.sidebar = sidebarService;
  $scope.spinner = false;

  $scope.sending = false;
  $scope.subscription = {};

  $scope.validateContact = function (value) {
    var phoneRegexp = /^[\s()+-]*([0-9][\s()+-]*){6,20}$/;
    var emailRegexp = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    if (!phoneRegexp.test(value) && !emailRegexp.test(value)) {
      return false;
    }
    return true;
  };

  $scope.courseOptions = [
    'Egzamin gimnazjalny',
    'Matura podstawowa',
    'Matura rozszerzona',
    'Student',
    'Lekcje indywidualne'
  ];

  $scope.submitForm = function (form) {
    $scope.$broadcast('show-errors-check-validity');

    if (form.$valid) {
      $scope.sending = true;
      
      $timeout(function () {
        $scope.$broadcast('show-errors-reset');
        $timeout(function () {
          $scope.subscription = {};
          $scope.subscriptionForm.$setPristine();
          $scope.subscriptionForm.$setUntouched();
          $scope.sending = false;
          $timeout(function () {
            ngToast.create({
              content: 'Dziękuje za wiadomość, skontaktuję się z Tobą w ciągu jednego dnia.',
              dismissButton: true
            });
          }, 0);
          $state.go('pages');
        });
      }, 1000);
    }
  }

  $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
    //if (toState && (toState.name === 'pages.testimonials' || toState.name === 'pages.contact')) {
    //  $scope.sidebar.brightNavbar();
    //} else  {
    //  $scope.sidebar.darkNavbar();
    //}

    if (fromState.name !== 'subscribe' && toState.name !== 'subscribe' && ((toState.name === 'pages.home' || toState.name === 'pages.offer' || toState.name === 'pages.testimonials' || toState.name === 'pages.contact') || (fromState.name === 'pages.home'))) {
      console.log('---'); 
      console.log(fromState);
      console.log(toState);
      console.log('true');
      $scope.spinner = true;
    }
  });

  $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
    if (toState.name !== 'subscribe' && fromState.name !== 'subscribe') {
      $("html, body").animate({ scrollTop: 0 }, 0);
    }

    $timeout(function () {
      $scope.spinner = false;
    }, 900);
  });
});

// offer controller

app.controller('OfferCtrl', function ($scope) {

});

// configure application

app.config(function($stateProvider, $urlRouterProvider, $locationProvider, $provide, ngToastProvider) {
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

  ngToastProvider.configure({
    animation: 'slide'
  });
});

app.directive('loading-button', function() {
  return {
    replace: true,
    transclude: true,
    restrict: 'E',
    link: function (scope, rocketContext, attrs) {
      scope.size = attrs.size || 40;

      var rocket = rocketContext[0].getElementsByClassName('preloader-rocket-wrapper')[0];

      var flyIn = function() {
        setTimeout(function() {
          rocket.setAttribute('class', 'preloader-rocket-wrapper');
          setTimeout(function() {
            rocket.setAttribute('class', 'preloader-rocket-wrapper animate');
          }, 450);
        }, 50);
      };

      var flyOut = function (callback) {
        rocket.setAttribute('class', 'preloader-rocket-wrapper flyover animate');
        setTimeout(function() {
          rocket.setAttribute('class', 'preloader-rocket-wrapper flyover');
          if (callback) {
            callback();
          }
        }, 1000);
      };

      scope.$watch('loading', function (cur, prev) {
        if(prev == cur) return;
        if(cur === true) {
          flyIn();
        }
      });

      scope.$watch('finish', function (cur, prev) {
        if(prev == cur) return;
        if(cur === true) {
          flyOut(function() {
            scope.afterFinish();
          });
        }
      });
      
      if('started' in attrs)
        flyIn();
    },
    controller: function ($scope, $q, $timeout) {
      var outTimeout;

      $scope.startRun = function() {
        $timeout.cancel(outTimeout);
        $scope.longRunButton.loading = true;
        $scope.longRunButton.loadingVisible = true;
        $scope.longRunButton.loadingFinish = false;

        if(typeof $scope.running !== 'undefined') {
          $scope.running = true;
        }
        if(typeof $scope.runningAnimation !== 'undefined') {
          $scope.runningAnimation = true;
        }

        var promise = $scope.run();

        var estimated = (new Date()).getTime() + 500;

        $scope.longRunButton.afterRocketFlyOut = function() {
          $timeout(function() {
            $scope.longRunButton.loadingVisible = false;
            if($scope.runningAnimation) {
              $scope.runningAnimation = false;
            }
            $scope.onFinishAnimation();
          }, 5);
        };

        var promiseHandler = function(onFinish) {
          var func = function(data) {
            var currentTime = (new Date()).getTime();
            if (currentTime < estimated) {
              $timeout(function() {
                func(data);
              }, estimated - currentTime);
              return;
            }

            $timeout(function() {
              $scope.longRunButton.loadingFinish = true;
            }, 10);

            outTimeout = $timeout(function() {
              $scope.longRunButton.loading = false;
              if ($scope.running) {
                $scope.running = false;
              }
            }, 330);
            onFinish(data);
          };
          return func;
        };

        $q.when(promise).then(promiseHandler(function(data) {
          $scope.onFinish(data);
        })).catch(function(err) {
          
          $scope.longRunButton.loadingFinish = true;
          $scope.longRunButton.loading = false;
          $scope.longRunButton.loadingVisible = false;
          if($scope.runningAnimation) {
            $scope.runningAnimation = false;
          }
          if($scope.running) {
            $scope.running = false;
          }
          if($scope.$parent) {
            $scope.$parent.$error = err;
          }
          $scope.onError(err);
        });
      };
    },
    scope: {
      running: '=',
      runningAnimation: '=',
      onError: '&',
      onFinish: '&',
      onFinishAnimation: '&',
      run: '&'
    },
    template: require('./loadingButton.jade!')()
  }
});
