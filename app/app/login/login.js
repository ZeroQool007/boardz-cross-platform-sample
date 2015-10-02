!function () {
    'use strict';

    /**
     *
     * @param $scope
     * @param $state
     * @param {Security} security
     * @constructor
     */
    function LoginController($scope, $state, security) {
        $scope.model = {};

        $scope.login = function () {
            security.login($scope.model.username, $scope.model.password, $scope.model.rememberMe)
                .then(function () {
                    $state.go('dashboard');
                });
        };
    }

    app.controller('loginController', LoginController);
}();
