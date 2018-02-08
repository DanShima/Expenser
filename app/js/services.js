'use strict';

/* Services */

var app = angular.module('myApp.services', []).
    value('version', '0.1')
    .value('categoryList', ["Housing", "Eating Out", "Grocery", "Entertainment", "Clothes", "Kids", "Transportation", "Medical Care", "Other"])  
   
    .factory('expService', [function () {
        var prefix = 'spending';
        //empty array to store requested items
        var expenses = [];               
        
        return {   
            
            //save the form when the submit button is clicked
            saveExpense: function (data) {
                if (localStorage) {
                    var timeStamp = Math.round(new Date().getTime());
                    //generate key and add the prefix to it                    
                    var key = prefix + timeStamp;
                    //convert JSON data into a string
                    data = JSON.stringify(data);
                    console.log(data);
                    try {
                        localStorage[key] = data;
                       // localStorage.setItem(key, data);
                    } catch (e) {
                        if (e == QUOTA_EXCEEDED_ERR) {
                            alert('Unable to save expense.');
                        }
                    }
                } else {
                    console.log("Error: you don't have localStorage!")
                }
            },

            //this function shows the expenses stored in localStorage
            getExpense: function () {
                expenses =[];
                var prefixLength = prefix.length;
                Object.keys(localStorage)
                    .forEach(function (key) {                        
                        if (key.substring(0, prefixLength) == prefix) {
                            //iterate through each item in localStorage and match it to the prefix key
                            var item = window.localStorage[key];
                            //convert stringified data back into JSON format
                            item = JSON.parse(item);
                            item.key = key;
                            expenses.push(item);
                        }
                    });
                 //   console.log(expenses);
                return expenses;
            },            

            //remove an expense
            removeEntry: function (item) {
                localStorage.removeItem(item.key);
                expenses = expenses.filter((expense) => expense.key !== item.key);
                window.location.reload();
            },
            
            //attempt to edit the form   
            editEntry: function (valueArr) {

                //retrieve key
                var key = valueArr.key;
                //delete unused data
                delete valueArr.key;
                delete valueArr.$$hashKey;                
                console.log(JSON.stringify(valueArr));               
                var value = JSON.stringify(valueArr);  
                //update the data              
                localStorage.setItem(key, value);               
                console.log(value);        
            },
                              

            getCategoryTotal: function (category) {
                var categoryTotal = 0;
                var prefixLength = prefix.length;
                Object.keys(localStorage)
                    .forEach(function (key) {
                        if (key.substring(0, prefixLength) == prefix) {
                            var item = localStorage[key];
                            item = JSON.parse(item);
                            if (item.category == category) {
                                //convert numbers from string to float and then sum them up
                                categoryTotal = categoryTotal + parseFloat(item.amount);
                            }
                        }
                    });
                return categoryTotal;
            }

        };
    }]);

