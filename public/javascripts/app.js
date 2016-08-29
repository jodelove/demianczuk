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

app.controller('SidebarCtrl', function ($scope, $state, $timeout, $http, sidebarService, ngToast) {
  $scope.sidebar = sidebarService;
  $scope.$root.spinner = false;

  $scope.sending = false;
  $scope.unavailable = false;
  $scope.subscription = {};

  $scope.closeNavbar = function () {
    if ($('.navbar-toggle:visible').length > 0) {
      $('.navbar-toggle').click();
    }
  }

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
    'Lekcje indywidualne'
  ];

  $scope.submitForm = function (form) {
    $scope.$broadcast('show-errors-check-validity');

    if (form.$valid) {
      $scope.sending = true;

      $timeout(function () {
        $http({
          method: 'GET',
          url: '/api/wyslij-mail?contact=' + $scope.subscription.contact + '&course=' + $scope.subscription.type
        })
        .then(
          function successCallback(response) {
            $scope.$broadcast('show-errors-reset');
            $state.go('pages');

            $timeout(function () {
              $scope.unavailable = false;
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
            });
          },
          function errorCallback(response) {
            $scope.$broadcast('show-errors-reset');
            $scope.sending = false;
            $scope.unavailable = true;
          }
        );
      }, 500);
    }
  }

  $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
    //if (toState && (toState.name === 'pages.testimonials' || toState.name === 'pages.contact')) {
    //  $scope.sidebar.brightNavbar();
    //} else  {
    //  $scope.sidebar.darkNavbar();
    //}

    if (fromState.name !== 'subscribe' && toState.name !== 'subscribe' &&
       ((toState.name === 'pages.home' || toState.name === 'pages.about'
       || toState.name === 'pages.offer' || toState.name === 'pages.testimonials'
       || toState.name === 'pages.contact') || (fromState.name === 'pages.home'))) {
      $scope.$root.spinner = true;
    }
  });

  $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
    if (toState.name !== 'subscribe' && fromState.name !== 'subscribe') {
      $("html, body").animate({ scrollTop: 0 }, 0);
    }
    if (toState.name !== 'pages.testimonials') {
      $timeout(function () {
        $scope.$root.spinner = false;
      }, 900);
    }
  });
});

// offer controller

app.controller('OfferCtrl', function ($scope) {

});

// testimonial controller

app.controller('TestimonialCtrl', function ($scope, $state, $http, $timeout) {
  var initialStats = {
    count: 0,
    opinionCountString: '0 opinii',
    scoreString: '0.0',
    scoreStars: ['fa-star-o', 'fa-star-o', 'fa-star-o', 'fa-star-o', 'fa-star-o']
  }
  $scope.opinions = [];
  $scope.stats = initialStats;

  $http.get('/api/opinie', {}).then(function (res) {
    $scope.stats = res.data.stats;
    $scope.opinions = res.data.opinions;
    $timeout(function (data) {
      $scope.$root.spinner = false;
    }, 900);
  }, function () {
    $timeout(function () {
      $scope.$root.spinner = false;
    }, 900);
  });

  $scope.testimonials = [
    {
      "name": "Patrycja Olińska",
      "description": "licealistka z Gdyni",
      "photo": "5Z897hO8OFlEFRND.jpg",
      "content": "Pan Bartek sumiennie podchodzi do każdych zajęć matematyki, przygotowuje się na każdą lekcje. Potrafi znaleźć sposób, aby nauczyć, nawet trudnego, ciężkiego do zrozumienia zagadnienia. Chętnie przychodzę na lekcje, które są prowadzone w bezstresowej atmosferze wraz z anielską cierpliwością Pana Bartka."
    },
    {
      "name": "Karolina Szyndlarewicz",
      "description": "licealistka z Gdańska",
      "photo": "IGzl04MCu0sYXqKB.jpg",
      "content": "Pan Bartosz jest nauczycielem z powołania. Potrafił rozbudzić w nas matematyczne zdolności i sprawić, że matematykę naprawdę lubimy. W przystępny sposób przybliża nam zagadnienia matematyczne. Zajęcia prowadzi w bardzo ciekawy sposób. Przygotowuje nas do sprawdzianów i egzaminów. Pragnę nadmienić, że interesuje się też naszymi wynikami i ocenami. Są to moje ulubione zajęcia. Polecam :)"
    },
    {
      "name": "Natalia Machura",
      "description": "licealistka z Gdyni",
      "photo": "O5iSHY5B1zh8kawo.jpg",
      "content": "Pan Bartek ma świetną organizacje i angażuje się w nasze zajęcia. Matematyka z nim jest zrozumiała. Prócz bycia nauczycielem to super człowiek, dlatego lekcje z nim to przyjemność. Nie zamieniłabym go na innego korepetytora."
    },
    {
      "name": "Pamela Łukaszewicz",
      "description": "licealistka z Gdyni",
      "photo": "KcXwRy0pZlBp6xFb.jpg",
      "content": "Gorąco polecam pana Bartka. Jest bardzo wyrozumiały i cierpliwy, a przede wszystkim umie wytłumaczyć jak nikt inny. Matematyka nigdy nie była dla mnie łatwa, do czasu, aż poznałam pana Bartka. Od tamtego momentu już żadne zagadnienie nie stanowi dla mnie problemu. Jest to nauczyciel, któremu mogę zaufać, gdyż jestem pewna, że świetnie przygotuje mnie do matury."
    },
    {
      "name": "Kacper Grad",
      "description": "student z Gdańska",
      "photo": "1D4pVlkKMcga6WdX.jpg",
      "content": "Jeśli potrzebujesz kogoś z indywidualnym podejściem do ucznia, dla kogo nauczanie jest pasją to pan Bartek Cię nie zawiedzie! :) Pomógł mi niezliczoną ilość razy z różnymi zagadnieniami zarówno w liceum jak i na studiach. Wszystko jest wyjaśniane w prosty, przejrzysty sposób, dzięki czemu wiesz, że pracujesz z osobą, która wie o czym mówi. Zajęcia są zawsze prowadzone w miłej atmosferze. Gorąco polecam!"
    },
    {
      "name": "dr inż. Marcin Styborski",
      "description": "Politechnika Gdańska, Wydział Fizyki Technicznej i Matematyki Stosowanej",
      "content": "Miałem przyjemność być opiekunem pana Bartosza podczas przygotowywania pracy magisterskiej. Już wcześniej dał się poznać jako student bardzo dociekliwy. Połączenie jego ciężkiej pracy z  refleksyjnością - cechą konieczną do  poruszania się w świecie matematyki - zaowocowało bardzo dobrą pracą na temat symetrii w geometrii hiperbolicznej. Dużo się wtedy nauczyłem, za co jestem mu bardzo wdzięczny. Gorąco polecam współpracę z panem Bartoszem."
    }
  ];
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
      templateUrl: "/glowna.html"
    })
    .state('pages.about', {
      url: "/o-mnie",
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
