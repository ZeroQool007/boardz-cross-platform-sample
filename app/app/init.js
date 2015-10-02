!function () {
    'use strict';

    window.app = angular.module('xplatform', ['ui.router']);

    app.constant('apiBaseUrl', 'https://boardgameapi.azurewebsites.net/');
}();

// IIFE