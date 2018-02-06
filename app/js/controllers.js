'use strict';

/* Controllers */

angular.module('myApp.controllers', [])
  .controller('HomeCtrl', function () {})  
  .controller('AddExpenseCtrl', ['$scope', 'categoryList', 'expService',
        function ($scope, categoryList, expService) {
            $scope.categories = categoryList;               

            //calls the saveExpense method of the factory and pass the form data
            $scope.submit = function () {
                expService.saveExpense($scope.expense);
            };
        }
   ])
   .controller('namesCtrl', function($scope) {
    $scope.names = [
        'Jani',
        'Carl',
        'Margareth',
        'Hege',
        'Joe',
        'Gustav',
        'Birgit',
        'Mary',
        'Kai'
    ];
})
   
    //display the data on View Summary page
    .controller('ViewSummaryCtrl', ['$scope', 'expService', 'categoryList',
        function ($scope, expService, categoryList) {           
            $scope.expenses = expService.getExpense();                                         

            $scope.summaryData = [];
      //retrieve the sum of each category
        categoryList.forEach(function (item) {
          var catTotal = expService.getCategoryTotal(item);

          $scope.summaryData.push({
              category: item,
              amount: catTotal
          });

         });  

        $scope.edit = function (expense) {           
           $scope.expenses = localStorage.getItem(expense.key);
            expService.editEntry();
        };

        //trying to remove an item!!!!!!!!!!!!!!!!!!!
        $scope.remove = function (key) {
            expService.removeEntry(key);
        };

        //this button removes everything!!!!!!!!!!!!!!!!!
        $scope.removeAll = function () {
            localStorage.clear();
        };
        
        $scope.goBack = function() {
           window.history.back();
        }     
    }
    ])
    .filter('Filter', [function($filter) {

        return function(inputArray, searchCriteria, category){         
       
         if(!angular.isDefined(searchCriteria) || searchCriteria == ''){
       
          return inputArray;
       
         }         
       
         var data=[];
       
         angular.forEach(inputArray, function(item){             
       
          if(item.category == category){
       
           if(item.expense.category.toLowerCase().indexOf(searchCriteria.toLowerCase()) != -1){
       
            data.push(item);
       
           }
       
          }
       
         });      
       
         return data;
       
        };
       
       }])
    //for swipe function
    .controller('NavigationCtrl', ['$scope', '$location', function ($scope, $location) {
        //incrementer: move to the next page or the previous one
        var navigator = function (incrementer) {
            var pages = ['/', '/add-expense', '/view-summary'];

            var nextUrl = "";
            var currentPage = $location.path(); //get current path
            var lastPageIndex = pages.length - 1;
            var pageIndex = pages.indexOf(currentPage);


            var direction = pageIndex + incrementer;
            if (direction === -1) direction = lastPageIndex;
            if (direction > lastPageIndex) incrementer = 0;
            nextUrl = pages[direction];
            $location.url(nextUrl);

            $scope.swipeDirection = (incrementer === 1) ? 'slide-right' : 'slide-left';

        };

        $scope.goLeft = function () {
            navigator(-1);
        };


        $scope.goRight = function () {

            navigator(1);


        };

    }]);

