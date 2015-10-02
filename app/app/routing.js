!function () {
    'use strict';

    app.config(
        function ($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise('/dashboard');

            $stateProvider
                .state('dashboard', {
                    url: '/dashboard',
                    templateUrl: 'app/dashboard/dashboard.html'
                })
                .state('gamesList', {
                    url: '/gamesList',
                    templateUrl: 'app/gamesList/gamesList.html',
                    controller: 'gamesListController'
                })
                .state('login', {
                    url: '/login',
                    templateUrl: 'app/login/login.html',
                    controller: 'loginController'
                });
        }
    )
}();
