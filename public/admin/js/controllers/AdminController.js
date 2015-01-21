adminPanel.controller("AdminController", function($scope, $rootScope, $http) {
    $scope.products = [];
    $scope.categories = [];
    $scope.currentProduct = {};
    $scope.selection = 'list';
    $scope.showEditBox = false;

    $http.get('/product/all').success(function(data) {
        $scope.products = data;
    });

    $http.get('/product/categories').success(function(data) {
        $scope.categories = data.children;
        console.log('categories: ', $scope.categories);
    });

    $scope.addNewProduct = function() {
        $scope.currentProduct.categoryName = $scope.currentProduct.mainCategory.name;
        if ($scope.currentProduct.subCategory)
            $scope.currentProduct.categoryName = $scope.currentProduct.subCategory.name;

        delete $scope.currentProduct.mainCategory;
        delete $scope.currentProduct.subCategory;
        $http.post('/product', angular.toJson($scope.currentProduct)).success(function(data) {
            if (data.err)
                return alert(data.err);

            $scope.currentProduct.remainingQuantity = $scope.currentProduct.quantity;
            $scope.products.push($scope.currentProduct);
            $scope.currentProduct = {};
            $scope.showEditBox = false;
        });
    };

    $scope.editProduct = function(product) {
        $scope.currentProduct = product;
        $scope.showEditBox = true;
    };

    $scope.uploadIndex = 0;
    $rootScope.$on('productImageUpload', function(e, data) {
        console.log(data.photoPath);
        var path = data.photoPath;
        $scope.products[$scope.uploadIndex].images.push(path);

    });

    $rootScope.$on('imageUploadError', function(e, data) {
        console.log(data);
    });
});
