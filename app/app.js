(function () {
    'use strict';
    var scripts = document.getElementsByTagName("script");
    var currentScriptPath = scripts[scripts.length - 1].src;
    angular.module('myApp', [
        'ngRoute',
        'acUtils',
        'ac.noticias'
    ]).config(['$routeProvider', function ($routeProvider) {
            $routeProvider.otherwise({redirectTo: '/view1'});
        }])
        .controller('myAppController', myAppController);


    myAppController.$inject = ['$scope', 'NoticiasService', '$http', 'AcUtilsService'];
    function myAppController($scope, NoticiasService, $http, AcUtilsService) {

        var vm = this;
        vm.agregarImagenNoticia = agregarImagenNoticia;
        vm.saveNoticia = saveNoticia;

        vm.modificarNoticia = modificarNoticia;
        vm.removeNoticia = removeNoticia;
        vm.resetNoticia = resetNoticia;

        vm.fuckFacebook = fuckFacebook;
        vm.fuckLogout = fuckLogout;


        vm.noticias = [];
        vm.noticia = {};
        var foto = {};

        vm.fotoNoticia01 = {name: 'file_add.png'};
        vm.fotoNoticia02 = {name: 'file_add.png'};
        vm.fotoNoticia03 = {name: 'file_add.png'};
        vm.fotoNoticia04 = {name: 'file_add.png'};

        vm.accessToken = '';

        vm.noticia = {
            noticia_id: -1,
            titulo: '',
            subtitulo: '',
            link: '',
            detalles: '',
            fecha: new Date(),
            creador_id: 0,
            vistas: 0,
            tipo: '0',
            fotos: [],
            comentarios: []
        };

        window.fbAsyncInit = function () {
            FB.init({
                appId: '1634953146778968',
                appSecret: '9aa610301779bf45c2050d7d6d3ce24a',
                xfbml: true,
                version: 'v2.3'
            });

        };

        (function (d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {
                return;
            }
            js = d.createElement(s);
            js.id = id;
            js.src = "//connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));

        //fuckFacebook();

        function fuckLogout() {
            FB.getLoginStatus(function (response) {
                if (response && response.status === 'connected') {
                    FB.logout(function (response) {
                        console.log(response);
                    });
                }
            });
        }

        function fuckFacebook(callback) {


            var appId = '1634953146778968';
            var secret = '9aa610301779bf45c2050d7d6d3ce24a';
            var returnurl = 'http://192.185.67.199/~arielces/ac-generador-noticias/';
            var permissions = 'manage_pages';
            var page_id = "1568521816767164";
            //var access_token = "CAAXOZBzGJxVgBADgrbyy0SbPB3HzRkOyYkziyfnalLUGjxq72q8KUNcTvEl21c07bPWGd7BxyI7xPiD3unxUUAaTPnYKKZBCr27aC9c8i9FEODDGxYY5ZA69c5tU3P5JVbUgQkb2F1w4K4ZCX5sZBUYO2QyKXpk8bfD8trLl6ZAm8z7Wo4uexYmYRoF8cXw9QIh30JvCImJwZDZD";
            var access_token = "CAAXOZBzGJxVgBAKGJ1CsBopZC1ac7NPxrSwHgrWjEEjxxAEntxL1btUhPZCq5jfKzFYjoOVE6SE1NWvqR70IH5VjVw29UHOSfYdZA6Sc2aASwVwKY4TT42dTlb8VBccPhcOMYNg54AEDYApMQ3sW1qR2ch0URwdn1s03IlZBqbNSYZBUZBKAl82fGDZCAXSZB2ywZD";
            var page_access_token = "1634953146778968|ce5mxHmTk1Jsh1s_2A_YdvLbH1Y";


            FB.getLoginStatus(function (response) {
                console.log(response);
                if (response.authResponse == undefined) {
                    FB.login(function (response) {
                        console.log(response);

                        console.log(response.authResponse.accessToken);
                        vm.accessToken = response.authResponse.accessToken;
                        // Handle the response object, like in statusChangeCallback() in our demo
                        // code.
                    }, {scope: 'manage_pages, publish_pages'});
                } else {



                    //response = FB.get("/acdesarrollos/feed", page_access_token);
                    FB.api(page_id + '/feed', 'post',
                        {
                            message: vm.noticia.subtitulo, // Mensaje Arriba de la noticia
                            access_token: access_token,
                            'name': vm.noticia.titulo, // Titulo Noticia
                            'link': vm.noticia.link,
                            'description': vm.noticia.detalles, // Descripci�n noticia
                            'caption': 'AC Desarrollos',
                            'picture': 'http://192.185.67.199/~arielces/ac-generador-noticias/img/' + vm.fotoNoticia01.name,
                            'published': true


                        },
                        function (response) {
                            callback(response);
                            console.log(response);
                        });

                    console.log(response);
                }
            });
        }


        NoticiasService.getNoticias(function (data) {
            vm.noticias = data;
        });

        function agregarImagenNoticia(filelist, index) {

            for (var i = 0; i < filelist.length; ++i) {
                var file = filelist.item(i);
                switch (index) {
                    case 1:
                        vm.fotoNoticia01 = {};
                        vm.fotoNoticia01 = file;
                        uploadImages(file);
                        break;
                    case 2:
                        vm.fotoNoticia02 = {};
                        vm.fotoNoticia02 = file;
                        uploadImages(file);
                        break;
                    case 3:
                        vm.fotoNoticia03 = {};
                        vm.fotoNoticia03 = file;
                        uploadImages(file);
                        break;
                    case 4:
                        vm.fotoNoticia04 = {};
                        vm.fotoNoticia04 = file;
                        uploadImages(file);
                        break;
                }
                foto = {};
                foto.foto = file.name;
                foto.main = 1;
            }
        }

        function uploadImages(file, tipo) {

            var form_data = new FormData();


            form_data.append('images', file);

            var ajax = new XMLHttpRequest();
            ajax.onprogress = function () {
            };
            ajax.onload = function (data) {
                //console.log(data);
                $scope.$apply();
            };

            ajax.open("POST", "upload.php");
            ajax.send(form_data);


        }


        function saveNoticia() {

            var conErrores = false;

            if (vm.fotoNoticia01.name == 'file_add.png' &&
                vm.fotoNoticia02.name == 'file_add.png' &&
                vm.fotoNoticia03.name == 'file_add.png' &&
                vm.fotoNoticia04.name == 'file_add.png') {
                AcUtilsService.validations('noticia-foto', 'Al menos debe subir una foto');
                conErrores = true;
            }

            if (vm.noticia.titulo.trim().length == 0) {
                AcUtilsService.validations('noticia-titulo', 'El t�tulo es obligatorio');
                conErrores = true;
            }


            if (vm.noticia.detalles.trim().length == 0) {
                AcUtilsService.validations('noticia-detalles', 'La descripci�n es obligatoria');
                conErrores = true;
            }

            if (vm.noticia.fecha == undefined) {
                AcUtilsService.validations('noticia-fecha', 'La fecha no es v�lida');
                conErrores = true;
            }


            if (conErrores) {
                return;
            }
            vm.noticia.fotos = [];

            if (vm.fotoNoticia01.name !== undefined) {
                foto = {};
                foto.foto = vm.fotoNoticia01.name;
                foto.main = 1;
                vm.noticia.fotos.push(foto);
            }
            if (vm.fotoNoticia02.name !== undefined) {
                foto = {};
                foto.foto = vm.fotoNoticia02.name;
                foto.main = 0;
                vm.noticia.fotos.push(foto);
            }
            if (vm.fotoNoticia03.name !== undefined) {
                foto = {};
                foto.foto = vm.fotoNoticia03.name;
                foto.main = 0;
                vm.noticia.fotos.push(foto);
            }
            if (vm.fotoNoticia04.name !== undefined) {
                foto = {};
                foto.foto = vm.fotoNoticia04.name;
                foto.main = 0;
                vm.noticia.fotos.push(foto);
            }

            //fuckFacebook(function (data) {
            //
            //    console.log(data);
            //
            //    if (data.id == undefined) {
            //        var r = confirm('La noticia no se ha podido cargar en facebook. Desea continuar?');
            //        if (!r) {
            //            return;
            //        }
            //    }


            if (vm.noticia.noticia_id == -1) {
                NoticiasService.save(vm.noticia, 'saveNoticia', function (data) {
                    resetNoticia();
                    NoticiasService.getNoticias(function (data) {
                        vm.noticias = data;

                    });
                });
            } else {
                NoticiasService.save(vm.noticia, 'updateNoticia', function (data) {
                    resetNoticia();
                    NoticiasService.getNoticias(function (data) {
                        vm.noticias = data;
                    });
                });
            }

            //});


        }

        function modificarNoticia(noticia) {
            vm.noticia = angular.copy(noticia);
            vm.noticia.tipo = '' + vm.noticia.tipo;
            vm.fotoNoticia01.name = (vm.noticia.fotos[0] !== undefined) ? vm.noticia.fotos[0].foto : undefined;
            vm.fotoNoticia02.name = (vm.noticia.fotos[1] !== undefined) ? vm.noticia.fotos[1].foto : undefined;
            vm.fotoNoticia03.name = (vm.noticia.fotos[2] !== undefined) ? vm.noticia.fotos[2].foto : undefined;
            vm.fotoNoticia04.name = (vm.noticia.fotos[3] !== undefined) ? vm.noticia.fotos[3].foto : undefined;
        }

        function removeNoticia() {
            var r = confirm('Realmente desea eliminar la noticia?');
            if (!r) {
                return;
            }

            NoticiasService.deleteNoticia(vm.noticia.noticia_id, function (data) {
                console.log(data);
                resetNoticia();
                NoticiasService.getNoticias(function (data) {
                    vm.noticias = data;

                });
            })
        }

        function resetNoticia() {
            vm.noticia = {
                noticia_id: -1,
                titulo: '',
                subtitulo: '',
                link: '',
                detalles: '',
                fecha: new Date(),
                creador_id: 0,
                vistas: 0,
                tipo: '0',
                fotos: [],
                comentarios: []
            };

            var foto = {};
            vm.fotoNoticia01 = {};
            vm.fotoNoticia02 = {};
            vm.fotoNoticia03 = {};
            vm.fotoNoticia04 = {};
        }


    }
})();

