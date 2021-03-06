(function () {
    'use strict';

    angular.module('NarrowItDownApp', [])
        .controller('NarrowItDownController', NarrowItDownController)
        .service('MenuSearchService', MenuSearchService)
        .constant('ApiBasePath', "https://davids-restaurant.herokuapp.com")
        .directive('foundItems', FoundItems);

    function FoundItems() {
        var ddo = {
            templateUrl: 'foundItems.html',
            scope: {
                items: '<',
                onRemove: '&',
                emptyResult: '@'
            }
        };

        return ddo;
    }

    NarrowItDownController.$inject = ['MenuSearchService'];
    function NarrowItDownController(MenuSearchService) {
        var vm = this;

        vm.searchTerm = '';
        vm.found = null;
        vm.emptyResult = 'Nothing found';

        vm.getMatchedMenuItems = function () {
            if (!vm.searchTerm) {
                vm.found = [];
                return;
            }

            var promise = MenuSearchService.getMatchedMenuItems(vm.searchTerm);

            promise.then(function (response) {
                vm.found = response;
            });
        };

        vm.removeItem = function (itemIndex) {
            vm.found.splice(itemIndex,1);
        }

    }

    MenuSearchService.$inject = ['$http', 'ApiBasePath'];
    function MenuSearchService($http, ApiBasePath) {
        var service = this;

        service.getMatchedMenuItems = function (searchTerm) {
            return $http({
                method: 'GET',
                url: (ApiBasePath + '/menu_items.json')
            }).then(function (response) {
                var result = [];
                if (response.data.menu_items && response.data.menu_items.length) {
                    result = response.data.menu_items.filter(function (item) {
                        return item.description.indexOf(searchTerm) !== -1;
                    });
                }
                return result;
            });

        };
    };

})();