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

            //go to the summary page
            $scope.goBack = function() {
                window.location.href = '#/view-summary';
             }  
        }
   ])  
    //display the data on View Summary page
    .controller('ViewSummaryCtrl', ['$scope', 'expService', 'categoryList',
        function ($scope, expService, categoryList, $filter) {  
                        
            $scope.categories = categoryList;    
            //read the expenses from localStorage            
            $scope.expenses = expService.getExpense();  

            
            $scope.update = function(){
                return $http.post('/update', $scope.expenses);
            } 

            $scope.showCategory = function() {
                var selected = $filter('filter')($scope.categories, $scope.expenses.category);
                return ($scope.expenses.category && selected.length);
              };
            
            $scope.summaryData = [];
      //retrieve the sum of each category
        categoryList.forEach(function (item) {
          var catTotal = expService.getCategoryTotal(item);

          $scope.summaryData.push({
              category: item,
              amount: catTotal
          });

         });         
               
        //edit an existing expense
        $scope.edit = function (key) {               
            expService.editEntry(key);              
        };

        
        $scope.remove = function (key) {
            expService.removeEntry(key);
        };

        //this button removes everything!!!!!!!!!!!!!!!!!
        $scope.removeAll = function () {            
            if (confirm("Are you sure you want to delete all expenses?")) {
                localStorage.clear();
                window.location.reload();
            } else {
                //do nothing
            }
           
        };
        
        $scope.goBack = function() {
           window.history.back();
        }     
    }
    ])    
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
            if (direction === -1) {
                direction = lastPageIndex;
            }
            if (direction > lastPageIndex) {
                incrementer = 0;
            }
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

