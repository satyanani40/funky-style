angular.module("blogDetailsModule", [])
    .controller("blogDetailsCtrl", function ($scope, $state, $stateParams, $http, $filter) {
        console.log("Blog category controller!");

        // get all the list of categories
        console.log("State Params: ", $stateParams);
        $scope.blog = {};

        // get the category
        var where = {};
        where['url'] = $stateParams.url;
        var embedded = JSON.stringify({
            "related_categories": 1
        });
        $http({
            url: '/api/1.0/blog'+'?where='+JSON.stringify(where)+'&number_of_clicks=1&embedded='+embedded+'&r='+Math.random(),
            method: "GET"
        }).then(function (blogs) {
            var items = blogs.data._items;
            if(items.length === 0) {
                $state.go('404');
            }
            console.log("Blog details: ", items[0]);
            $scope.blog = items[0];
            $scope.blog._created = new Date($scope.blog._created);
        });
    });