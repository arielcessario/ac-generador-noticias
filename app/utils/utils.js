(function () {
    'use strict';
    var scripts = document.getElementsByTagName("script");
    var currentScriptPath = scripts[scripts.length - 1].src;
    angular.module('acUtils', ['ngRoute'])
        .config(['$routeProvider', function ($routeProvider) {
            $routeProvider.when('/module', {
                templateUrl: currentScriptPath.replace('.js', '.html'),
                controller: 'AcUtils'
            });
        }])
        .controller('AcUtilsController', AcUtilsController)
        .factory('AcUtilsService', AcUtilsService)
        .service('AcUtilsGlobals', AcUtilsGlobals)
    ;


    AcUtilsController.$inject = [];
    function AcUtilsController() {
    }

    AcUtilsGlobals.$inject = [];
    function AcUtilsGlobals() {
        this.isWaiting = false;
        this.sucursal_auxiliar_id = -1;
    }


    AcUtilsService.$inject = [];
    function AcUtilsService() {
        var service = {};
        service.validateEmail = validateEmail;
        service.validations = validations;

        return service;


        function validateEmail(email) {
            var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
            return re.test(email);
        }


        function validations(control, texto) {
            var id = Math.floor((Math.random() * 1000) + 1);
            var elem = angular.element(document.querySelector('#' + control));
            elem.addClass('error-input');
            elem.after('<div class="error-message" id="error-' + id + '">' + texto + '</div>');
            var mensaje = angular.element(document.querySelector('#error-' + id));


            mensaje.css('top', (elem[0].offsetTop + elem[0].offsetHeight) + 'px');
            mensaje.css('left', elem[0].offsetLeft + 'px');

            elem[0].addEventListener('focus', function () {
                elem.removeClass('error-input');
                elem[0].removeEventListener('focus');
                mensaje.remove();
            });
        }
    }
})();