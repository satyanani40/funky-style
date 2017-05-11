angular.module('APP', ['ui.router', 'oc.lazyLoad', 'ngSanitize'])
    .run(["$rootScope", function($rootScope) {
        $rootScope.$on('$stateChangeSuccess', function() {
            document.body.scrollTop = document.documentElement.scrollTop = 0;
        });
    }])
    .config(['$stateProvider', '$urlRouterProvider', '$ocLazyLoadProvider', '$locationProvider',
        function($stateProvider, $urlRouterProvider, $ocLazyLoadProvider, $locationProvider) {
            $locationProvider.html5Mode(false).hashPrefix('');

            // configuring the lazyLoad angularjs files
            $ocLazyLoadProvider.config({
                // debug: true,
                modules: [
                    {
                        name: 'headerModule',
                        files: ['static/app/customer-panel/modules/header/header.controller.js']
                    },
                    {
                        name: "ui.bootstrap",
                        files: [
                            'static/bower_components/angular-bootstrap/ui-bootstrap.min.js',
                            'static/bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js'
                        ]
                    },
                    {
                        name: "satellizer",
                        files: [
                            'static/bower_components/satellizer/dist/satellizer.js'
                        ]
                    },
                    {
                        name: "toastr",
                        files: [
                            "static/bower_components/angular-toastr/dist/angular-toastr.tpls.min.js",
                            "static/bower_components/angular-toastr/dist/angular-toastr.min.css"
                        ]
                    },
                    {
                        name: "storeServiceModule",
                        files: ['static/services/store.service.js']
                    },
                    {
                        name: 'constantModule',
                        files: ['static/app/customer-panel/modules/constant.module.js']
                    },
                    {
                        name: "footerModule",
                        files: ['static/app/customer-panel/modules/footer/footer.controller.js']
                    },
                    //    Filters
                    {
                        name: "Filters",
                        files: ['static/app/customer-panel/modules/filters/filter.module.js']
                    },

                    // Services
                    {
                        name: "personFactoryModule",
                        files: ['/static/services/persons.service.js']
                    },
                    {
                        name: "categoryFactoryModule",
                        files: ['/static/services/category.service.js']
                    },
                    {
                        name: "dealFactoryModule",
                        files: ['/static/services/deal.service.js']
                    },
                    {
                        name: "couponFactoryModule",
                        files: ['/static/services/coupon.service.js']
                    }
                ]
            });

            $urlRouterProvider.otherwise('/');
            $stateProvider
                .state('main', {
                    url: '',
                    templateUrl: 'static/app/customer-panel/modules/header/header.template.html',
                    controller: "headerCtrl",
                    resolve: {
                        redirect: function($location) {
                            if ($location.path() == undefined || $location.path() == null || $location.path() == '') {
                                $location.path('/');
                            }
                        },
                        main: function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'headerModule',
                                files: ['static/app/customer-panel/modules/header/header.controller.js']
                            })
                        }
                    }
                })
                .state('main.home', {
                    url: '/',
                    templateUrl: 'static/app/customer-panel/modules/home/home.template.html',
                    controller: "homeCtrl",
                    resolve: {
                        home: function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'homeModule',
                                files: ['static/app/customer-panel/modules/home/home.controller.js']
                            })
                        }
                    }
                })
                .state('main.login', {
                    url: '/login',
                    templateUrl: 'static/app/customer-panel/modules/login/login.template.html',
                    controller: "loginCtrl",
                    resolve: {
                        checkLogin: function (auth, $location) {
                            if(auth.checkLogin()) {
                                $location.path('/');
                            }
                        },
                        authentication: function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'loginModule',
                                files: ['static/app/customer-panel/modules/login/login.module.js']
                            })
                        }
                    }
                })
                .state('main.forgot_password', {
                    url: '/forgot-password',
                    templateUrl: 'static/app/customer-panel/modules/forgot.password/forgot.password.template.html',
                    controller: "forgotPasswordCtrl",
                    resolve: {
                        forgotPassword: function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'forgotPasswordModule',
                                files: ['static/app/customer-panel/modules/forgot.password/forgot.password.module.js']
                            })
                        }
                    }
                })

                // activate email link
                .state('main.activate', {
                    url: '/email/activate/:user_id/confirm/:token',
                    templateUrl: 'static/app/customer-panel/modules/activate.email/activate.email.template.html',
                    controller: "activateEmailCtrl",
                    resolve: {
                        activateEmail: function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'activateEmailModule',
                                files: ['static/app/customer-panel/modules/activate.email/activate.email.module.js']
                            })
                        }
                    }
                })
                //  change password
                .state('main.change_password', {
                    url: '/change-password',
                    templateUrl: 'static/app/customer-panel/modules/change.password/change.password.template.html',
                    controller: "changePasswordCtrl",
                    resolve: {
                        changePassword: function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'changePasswordModule',
                                files: ['static/app/customer-panel/modules/change.password/change.password.module.js']
                            })
                        }
                    }
                })
                // store state
                .state('main.store', {
                    url: '/stores',
                    templateUrl: 'static/app/customer-panel/modules/store/store.template.html',
                    controller: "storeCtrl",
                    resolve: {
                        home: function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'storeModule',
                                files: ['static/app/customer-panel/modules/store/store.controller.js']
                            })
                        }
                    }
                })
                // Store Info
                .state('main.store-info', {
                    url: '/store/:url',
                    templateUrl: 'static/app/customer-panel/modules/store.info/store.info.template.html',
                    controller: "storeinfoController",
                    resolve: {
                        home: function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'storeinfoModule',
                                files: ['static/app/customer-panel/modules/store.info/store.info.controller.js']
                            })
                        }
                    }
                })
                // category info
                .state('main.category', {
                    url: '/category',
                    templateUrl: 'static/app/customer-panel/modules/category/category.template.html',
                    controller: "categoryCtrl",
                    resolve: {
                        home: function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'categoryModule',
                                files: ['static/app/customer-panel/modules/category/category.controller.js']
                            })
                        }
                    }
                })
                // category info
                .state('main.categoryinfo', {
                    url: '/category/:url?cc',
                    templateUrl: 'static/app/customer-panel/modules/category.info/category.info.template.html',
                    controller: "categoryinfoCtrl",
                    resolve: {
                        home: function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'categoryinfoModule',
                                files: ['static/app/customer-panel/modules/category.info/category.info.contoller.js']
                            })
                        }
                    }
                })
                // Dashboard
                .state('main.dashboard', {
                    url: '/dashboard',
                    templateUrl: 'static/app/customer-panel/modules/dashboard/dashboard.template.html',
                    controller: "dashboardCtrl",
                    resolve: {
                        dashboard: function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'dashboardModule',
                                files: ['static/app/customer-panel/modules/dashboard/dashboard.controller.js']
                            })
                        }
                    }
                })
                // 404
                .state('404', {
                    url: '/404',
                    templateUrl: 'static/app/customer-panel/modules/404/404.template.html'
                })
                // blog.category
                .state('blog_category', {
                    url: '/blog/category',
                    templateUrl: 'static/app/customer-panel/modules/blog.category/blog.category.template.html'
                })
        }
    ])
    // it is for authentication
    .factory('auth', function ($http, $q) {
        return {
            getToken: function () {
                return localStorage.getItem('token');
            },
            setToken: function (token) {
                return localStorage.setItem('token', token);
            },
            logout: function () {
                localStorage.removeItem('token');
            },
            checkLogin: function () {
                return (localStorage.getItem('token')) ? true : false;
            },
            me: function () {
                var def = $q.defer();
                $http({
                    url: "/api/1.0/auth/me",
                    method: "GET"
                }).then(function (data) {
                    def.resolve(data.data);
                }, function (error) {
                    def.reject(error.data);
                });

                return def.promise;
            }
        }
    });