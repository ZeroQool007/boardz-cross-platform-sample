!function ($, jQuery, window, document) {
    'use strict';

    app.run(
        /**
         * @param $rootScope
         * @param $state
         * @param ngNotify
         * @param {Security} security
         */
        function ($rootScope, $state, security) {
            $rootScope.$on('needsAuthentication', function (event, currentState) {
                $state.go('login', {
                    redirectTo: currentState
                });
            });

            $rootScope.$on('$stateChangeStart', function (event, toState) {
                if (toState.name === 'login') {
                    return;
                }

                if (!security.isLoggedIn()) {
                    event.preventDefault();
                    $rootScope.$emit('needsAuthentication', toState.name);
                }
            });
        });

    app.config(
        /**
         * @param $httpProvider
         * @param cfpLoadingBarProvider
         */
        function ($httpProvider) {
            $httpProvider.interceptors.push('tokenInterceptor');
        });
}();