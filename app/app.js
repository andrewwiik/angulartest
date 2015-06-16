var app = angular.module('myApp', ['ngRoute', 'ui.bootstrap', 'ngAnimate']);

app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
    when('/', {
      title: 'Contacts',
      templateUrl: 'partials/contact.html',
      controller: 'contactsCtrl'
    })
    .otherwise({
      redirectTo: '/'
    });;
}]);
    
