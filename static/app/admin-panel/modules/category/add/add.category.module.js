angular.module("addCategoryModule", ["ui.select", "ngSanitize", "ui.bootstrap", "toastr",
    "storeFactoryModule", "satellizer", "personFactoryModule", "cgBusy", "naif.base64", "categoryFactoryModule",
    "constantModule"])
    .controller("addCategoryCtrl", function($scope, $timeout, toastr, storeFactory, $state, $stateParams,
                                            $auth, personFactory, categoryFactory, URL) {
        $scope.category = {
            related_coupons: [],
            related_deals: []
        };
        $scope.persons = [];
        $scope.categories = [];
        $scope.breadcrumbs = [];
        $scope.selected_user = {
            user: undefined
        };
        $scope.category_type = [
            {
                name: "Regular"
            },
            {
                name: "Bank"
            },
            {
                name: "Wallet"
            },
            {
                name: "City"
            },
            {
                name: "Brands"
            },
            {
                name: "Festivals"
            }
        ];
        $scope.menuTypes = [
            {
                text: "None",
                code: "none"
            },
            {
                text: "Top Menu",
                code: 'top'
            },
            {
                text: "Bottom Menu",
                code: 'bottom'
            }
        ];
        $scope.category.menu = $scope.menuTypes[0]['code'];

        $scope.category.category_type = $scope.category_type[0]['name'];

        // get all stores into the array
        if($auth.isAuthenticated()) {
            $scope.load = storeFactory.get().then(function (data) {
                console.log(data);
                if(data['_items']) {
                    $scope.stores = data._items;
                }
            }, function (error) {
                console.log(error);
                toastr.error(error.data._error.message, "Error!");
            });

            personFactory.me().then(function (data) {
                if(data['data']) {
                    $scope.persons.push(data.data.data);
                    $scope.selected_user.user = $scope.persons[0];
                    $scope.category.last_modified_by = $scope.persons[0]._id;
                }
            }, function (error) {
                console.log(error);
            });

            // get all categories
            categoryFactory.get().then(function (data) {
                console.log(data);
                if(data['data']) {
                    $scope.categories = data.data._items;

                    angular.forEach($scope.categories, function (item) {
                        $scope.breadcrumbs.push({
                            name: item.name,
                            url: item.url,
                            _id: item._id
                        });
                    });
                }
            }, function (error) {
                console.log(error);
            });
        }

        $scope.$watch('category.name', function(newVal, oldVal) {
            if(newVal && $scope.seoList.length) {
                var data = replaceSeo(newVal, $scope.seoList, 'single_category');
                $scope.category.seo_title = data.title;
                $scope.category.seo_description = data.description;

                $scope.category.h1 = data.h1;
                $scope.category.h2 = data.h2;
            }
            $scope.category.url = (newVal) ? newVal.replace(/\s/g, "-").toLowerCase()+"-offers" : undefined;
        }, true);

        // add category
        $scope.addCategory = function (category) {
            if(typeof category.image === 'object') {
                category.image = "data:image/jpeg;base64,"+category.image.base64;
            } else {
                toastr.error("Please select category Image", "Error!");
                return false;
            }
            if(typeof category.top_banner === 'object') {
                category.top_banner = "data:image/jpeg;base64,"+category.top_banner.base64;
            }
            if(typeof category.side_banner === 'object') {
                category.side_banner = "data:image/jpeg;base64,"+category.side_banner.base64;
            }
            if(typeof category.alt_image === 'object') {
                category.alt_image = "data:image/jpeg;base64,"+category.alt_image.base64;
            }
            console.log(category);
            categoryFactory.post(category).then(function (data) {
                console.log(data);
                toastr.success(category.name+' Created', "Success!");
                $state.go('header.category');
            }, function (error) {
                console.log(error);
                if(error.data) {
                    toastr.error(error.data['_error'], "Error");
                    if(error.data['_issues']) {
                        angular.forEach(error.data['_issues'], function (val, key) {
                            toastr.error(val, key);
                        });
                    }
                }
            });
        };
    });