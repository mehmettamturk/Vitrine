vitrine.controller("HomepageController", function($scope, $http) {
    console.log('HomepageController...');
    $http.get('/product/all').success(function(data) {
        $scope.products = data;
        console.log(data)
    });
});
