angular.module("cmsModule", ["headerModule"])
    .controller("cmsCtrl", function ($scope, $http, $state, $stateParams, $sce) {
        console.log("CMS module controller");

        $scope.cms = {};

        if($stateParams['url']) {
            var where = {
                "url": $stateParams.url
            };
            var rand = new Date().getDate();

            var url = "/api/1.0/cms_pages?where="+JSON.stringify(where)+"&rand="+rand;
            // get the cms information
            $http({
                url: url,
                method: "GET"
            }).then(function (data) {
                console.log(data);
                if(data['data']) {
                    if(data.data._items.length == 0) {
                        $state.go('404');
                    }
                    $scope.cms = data.data._items[0];
                }
            }, function (error) {
                console.log(error);
            });
        }

        // trust as html
        $scope.trustAsHtml = function(string) {
            if(string) {
                return $sce.trustAsHtml(string);
            }
        };
    });