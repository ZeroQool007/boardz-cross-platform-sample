!function () {
    'use strict';

    /**
     *
     * @param $scope
     * @param $http
     * @param {string} apiBaseUrl
     * @constructor
     */
    function GamesListController($scope, $http, apiBaseUrl) {
        $http.get(apiBaseUrl + 'api/boardGames/list')
            .then(function (result) {
                $scope.gamesList = result.data;
            }, function (err) {
                // Fehler
            });
    }

    app.controller('gamesListController', GamesListController);

}();
