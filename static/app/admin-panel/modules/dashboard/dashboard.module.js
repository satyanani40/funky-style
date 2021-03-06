angular.module("DashboardModule", ["constantModule",
    "satellizer", "toastr", "personFactoryModule", "ui.select", 'ui.grid', 'ui.grid.pagination', 'ui.grid.selection', 'ui.grid.exporter'])
    .controller("dashBoardCtrl", function ($scope, mainURL, URL, $state, $auth, $http, $compile, toastr, personFactory) {

        $scope.deals = [];
        $scope.coupons = [];
        $scope.categories = [];
        $scope.persons = [];
        $scope.stores = [];

        $scope.menuTypes = [
            {code: "month", text: "Month"},
            {code: "customdate", text: "By Custom Date"}
        ];
        $scope.types = [
            {code: "coupons", text: "No of Coupons Added", type: "count"},
            {code: "persons", text: "Persons", type: "count"},
            {code: "stores", text: "No of Stores Added", type: "count"},
            {code: "categories", text: "No of Categories Added", type: "count"},
            {code: "coupons", text: "No of Coupon Clicks", type: "number_of_clicks"},
            {code: "stores", text: "No of Stores Clicks", type: "number_of_clicks"},
            {code: "deals", text: "No of Deals Clicks", type: "number_of_clicks"},
            {code: "deals", text: "No of New Deals Added", type: "count"},
            {code: "coupons", text: "High Clicked Coupons", type: "number_of_clicks"}
        ];
        $scope.select = {
            by: $scope.menuTypes[0].code,
            category: $scope.types[0]
        };

        $scope.morris = undefined;

        setTimeout(function () {
            $('#to-date').datepicker({
                maxDate: 0,
                onSelect: function(dateText) {
                    $('#from-date').datepicker('option', 'maxDate', this.value );
                    $scope.changeChart();
                }
            }).datepicker('setDate', new Date());

            var toDate = new Date($('#to-date').datepicker( "getDate" ));
            $('#from-date').datepicker({
                maxDate: toDate,
                onSelect: function(dateText) {
                    $scope.changeChart();
                }
            }).datepicker('setDate', toDate.setDate(toDate.getDate() - 7));
        }, 4000);

        Date.prototype.addDays = function(days) {
            var dat = new Date(this.valueOf());
            dat.setDate(dat.getDate() + days);
            return dat;
        };

        function getDates(startDate, stopDate) {
            var dateArray = [];
            var currentDate = startDate;
            while (currentDate <= stopDate) {
                dateArray.push( new Date (currentDate) );
                currentDate = currentDate.addDays(1);
            }
            return dateArray;
        }

        $scope.objItems = {};
        $scope.keyValues = [];
        $scope.clickObjects = {};
        function generateArrays () {
            angular.forEach($scope.objItems, function (val, key) {
                $scope.keyValues.push({y: key, a: val})
            });

            // console.log("Final Key Values: ", $scope.keyValues);
            setTimeout(function () {
                $scope.morris.setData($scope.keyValues);
                $scope.morris.options.labels = [$scope.select.category.text];
                $scope.morris.options.barSize = 30;
                $scope.morris.redraw();
            }, 1000);
        }
        $scope.changeChart = function () {
            $scope.keyValues = [];
            $scope.objItems = {};
            $scope.clickObjects = {};
            var created = undefined,
                type = undefined,
                fromDate = new Date($("#from-date").val()),
                toDate = new Date($("#to-date").val()),
                dates = [];

            if($scope.select.by == 'customdate') {
                $scope.objItems = {};
                dates = getDates(fromDate, toDate);
                angular.forEach(dates, function (date) {
                    $scope.objItems[moment(date).format("DD/MM/YYYY")] = 0;
                    $scope.clickObjects[moment(date).format("DD/MM/YYYY")] = [];
                })
            } else {
                angular.forEach(monthNames, function (month) {
                    $scope.objItems[month] = 0;
                    $scope.clickObjects[month] = [];
                });
            }
            angular.forEach($scope[$scope.select.category.code], function (item) {
                var date = new Date(item._created);
                console.log($scope.select.category);
                if($scope.select.by == 'month') {
                    if(date.getFullYear() == new Date().getFullYear()) {
                        created = monthNames[date.getMonth()];
                        if($scope.select.category.type == 'count') {
                            $scope.objItems[created] = $scope.objItems[created] + 1;
                        } else if ($scope.select.category.type == 'number_of_clicks') {
                            console.log(item, created, $scope.objItems)
                            $scope.clickObjects[created].push(item);
                        }
                    }
                } else if ($scope.select.by == 'customdate') {
                    angular.forEach($scope.objItems, function (val, key) {
                        if(key == moment(date).format('DD/MM/YYYY')) {
                            if($scope.select.category.type == 'count') {
                                $scope.objItems[key] ++;
                            } else if ($scope.select.category.type == 'number_of_clicks') {
                                console.log(key, $scope.objItems[key], item.number_of_clicks);
                                $scope.clickObjects[key].push(item);
                            }
                        }
                    })
                }
            });

            generateArrays($scope.select.by);
        };

        if($auth.isAuthenticated()) {
            // get the list of coupons
            var projection = {
                "title": 1,
                "number_of_clicks": 1,
                "name": 1
            };
            $http({
                url: "/api/1.0/coupons?projection="+JSON.stringify(projection)+"&rand_number=" + new Date().getTime(),
                mathod: "GET"
            }).then(function (data) {
                console.log(data);
                if(data['data']) {
                    $scope.coupons = data.data._items;
                    $scope.morris = Morris.Bar({
                        element: 'bar-example',
                        data: [],
                        xkey: 'y',
                        ykeys: ['a'],
                        labels: [$scope.select.category.code],
                        xLabelMargin: 1,
                        xLabelAngle: 50
                    });
                    $scope.changeChart();
                }
                console.log($scope.select.category)
            }, function (error) {
                console.log(error);
            });

            $http({
                url: "/api/1.0/persons",
                mathod: "GET",
                headers: {
                    authorization: $auth.getToken()
                }
            }).then(function (data) {
                console.log(data);
                if(data['data']) {
                    $scope.persons = data.data._items;
                }
            }, function (error) {
                console.log(error);
            });

            $http({
                url: "/api/1.0/deals?projection="+JSON.stringify(projection)+"&rand_number=" + new Date().getTime(),
                mathod: "GET"
            }).then(function (data) {
                console.log(data);
                if(data['data']) {
                    $scope.deals = data.data._items;
                }
            }, function (error) {
                console.log(error);
            });


            $http({
                url: "/api/1.0/stores?projection="+JSON.stringify(projection)+"&rand_number=" + new Date().getTime(),
                mathod: "GET"
            }).then(function (data) {
                console.log(data);
                if(data['data']) {
                    $scope.stores = data.data._items;
                }
            }, function (error) {
                console.log(error);
            });


            projection['name'] = 1;
            $http({
                url: "/api/1.0/categories?projection="+JSON.stringify(projection)+"&rand_number=" + new Date().getTime(),
                mathod: "GET"
            }).then(function (data) {
                console.log(data);
                if(data['data']) {
                    $scope.categories = data.data._items;
                }
            }, function (error) {
                console.log(error);
            });
        }

    });