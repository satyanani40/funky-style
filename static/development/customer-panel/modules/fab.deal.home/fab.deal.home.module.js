angular.module("allDealsModule", ["Directives"])
    .controller("allDealsCtrl", function ($scope, $state, $stateParams, $http, SEO, $rootScope) {
        console.log("All Deals Controller!");

        $scope.deals = [];
        $scope.deal_categories = [];
        $scope.deal_brands = [];
        $scope.stores = [];

        var random = new Date().getDate(),
            where = JSON.stringify({
                "status": true
            });
        // get the list of top deal categories
        var featured = JSON.stringify({
            featured: true
        });
        $http({
            url: "/api/1.0/deal_categories?where="+featured+"&max_results=4&rand="+random,
            method: "GET"
        }).then(function (data) {
            console.log("Deal Categories are: ", data.data._items);
            $scope.deal_categories = data.data._items;
        }, function (error) {
            console.log(error);
        });

        $http({
            url: "/api/1.0/deal_brands?where="+featured+"&max_results=8&rand="+random,
            method: "GET"
        }).then(function (data) {
            console.log("Deal Brands are: ", data.data._items);
            $scope.deal_brands = data.data._items;
        }, function (error) {
            console.log(error);
        });
        // get the list of Best selling deals based on number of clicks
        url = '/api/1.0/deals'+'?where='+where+'&sort=-number_of_clicks&rand_number=' + random;
        $http({
            url: url,
            method: "GET"
        }).then(function (data) {
            console.log("All deals are: ", data.data._items);
            if(data['data']) {
                $scope.best_deals = data.data._items;
            }
        }, function (error) {
            console.log(error);
        });

        // get the list of deals based on upcoming field in database
        var url = '/api/1.0/deals?where='+where+'&sort=-upcoming&rand_number=' + random;
        $http({
            url: url,
            method: "GET"
        }).then(function (data) {
            console.log("All deals are: ", data.data._items);
            if(data['data']) {
                $scope.upcoming_deals = data.data._items;
            }
        }, function (error) {
            console.log(error);
        });

        // get the slider banners
        $scope.banners = [];
        where = JSON.stringify({
            "top_banner_string": 'deal',
            "expired_date": {
                "$gte": new Date().toGMTString()
            }
        });
        projection = {
            "top_banner_string": 1,
            "image": 1,
            "title": 1,
            "image_text": 1,
            "destination_url": 1
        };

        url = '/api/1.0/banner'+'?where='+where+'&projection='+JSON.stringify(projection)+'&rand_number' + new Date().getTime();
        $http({
            url: url,
            method: "GET",
            headers: {
                "Content-Encoding": "gzip"
            }
        }).then(function (data) {
            console.log(data);
            if(data['data']) {
                console.log("Banners: ", data.data._items);
                $scope.banners = data.data._items;

                $('#myCarousel').carousel({
                    interval: 4000,
                    pause: "hover",
                    loop: true
                });
            }
        }, function (error) {
            console.log(error);
        });


        // get the list of featured stores
        var store = {};
        store['featured_store'] = true;

        projection = {};
        projection['name'] = 1;
        projection['url'] = 1;
        projection['image'] = 1;
        projection['menu'] = 1;
        $http({
            url: "/api/1.0/stores/?where="+JSON.stringify(store)+"&max_results=8"+"&projection="+JSON.stringify(projection)+"&rand_number" + new Date().getTime(),
            mathod: "GET"
        }).then(function (data) {
            console.log(data);
            if(data['data']) {
                $scope.stores = data.data._items;
            }
        }, function (error) {
            console.log(error);
        });


        // get the list of SEO
        SEO.getSEO().then(function (data) {
            angular.forEach(data, function (item) {
                if(item.selection_type.code === 'deal') {
                    var data = SEO.seo("", item, 'deal');
                    $rootScope.pageTitle = data.title;
                    $rootScope.pageDescription = data.description;
                }
            });
        });
    });