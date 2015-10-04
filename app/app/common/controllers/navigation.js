!function ($, jQuery, window, document) {
    "use strict";

    /**
     * @constructor
     * @public
     *
     * @param $window
     */
    function NavigationController($window) {
        this.goBack = function () {
            $window.history.back();
        };
    }

    app.module.controller('navigationController', NavigationController);
}();
