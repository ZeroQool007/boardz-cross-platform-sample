!function ($, jQuery, window, document) {
    'use strict';

    /**
     * @public
     * @constructor
     *
     * @param $scope
     * @param $state
     * @param $stateParams
     * @param $translate
     * @param {BoardGamesApi} boardGamesApi
     * @param {PlayersApi} playersApi
     * @param {Camera} camera
     * @param ngNotify
     * @param {Security} security
     */
    function GameDetailController(camera, $scope, $state, $stateParams, $translate, boardGamesApi, playersApi, ngNotify, security) {
        initialize();

        $scope.game = {};

        $scope.defaults = {
            tileLayer: 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png'
        };

        function initialize() {
            if ($stateParams.gameId) {
                boardGamesApi.single($stateParams.gameId)
                    .then(function (result) {
                        $scope.game = result;
                    }, function (err) {
                        // TODO: Error case
                    });
            }

            $scope.locationError = false;

            /*
            geo...
            */
        }

        $scope.save = function () {
            if (!$scope.game && !$scope.game.name && !$scope.name.description) {
                return;
            }

            var promise;

            if ($stateParams.gameId) {
                promise = boardGamesApi.update($scope.game);
            }
            else {
                promise = boardGamesApi.add($scope.game);
            }

            promise
                .then(function (gameId) {
                    ngNotify.set($translate.instant('gameDetails.success'), 'success');

                    if (!$stateParams.gameId) {
                        $scope.game.id = gameId;
                        $state.go('.', {
                            gameId: gameId
                        }, {
                            reload: false,
                            notify: false
                        });
                    }
                }, showErrorNotification);
        };

        $scope.takePhoto = function () {
            $scope.photoError = false;


            camera.takePhoto().then(function(result) {
                $scope.photoUrl = result;
            });

        };

        $scope.sendIAmGaming = function () {
            if (!$scope.center || !$scope.photoUrl) {
                return;
            }

            playersApi.add({
                name: security.getUser(),
                boardGameId: $stateParams.gameId,
                coordinate: {
                    latitude: $scope.center.lat,
                    longitude: $scope.center.lng
                },
                imageUrl: $scope.photoUrl
            })
                .then(function () {
                    ngNotify.set($translate.instant('gameDetails.iAmGaming.success'), 'success');
                })
        };

        function showErrorNotification() {
            ngNotify.set($translate.instant('gameDetails.error'), 'error');
        }
    }

    app.module.controller('gameDetailController', GameDetailController);
}();