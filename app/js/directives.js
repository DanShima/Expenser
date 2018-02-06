'use strict';

/* Directives */


angular.module('myApp.directives', []).
  directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
    }])
    //inject the document and window services into barChart
    .directive('barChart', ['$document', '$window',
        function ($document, $window) {
            return {
                scope: {
                    data: '=',

                },

                link: function (scope, element, attrs) {

                    var chart = d3.select('#chart')

                        .append('svg')
                        .style('width', '90%');
                    
                    scope.drawGraph = function (data) {
                        chart.selectAll('*').remove(); //remove all elements before a redraw
                        var barHeight = 18, 
                            barGap = 7, //the space between two bars
                            graphOrigin = 150, //left margin for the bars
                            chartWidth = chart.style('width'), //the width of the chart's element
                            chartHeight = scope.data.length * (barHeight + barGap),
                            color = d3.scale.category20(), //colors for the bars
                            xScale = d3.scale.linear() //generate the relevant output that is adaptable in range for given input
                                .domain([0, d3.max(data, function (d) { //takes an array as the input and sets the starting and ending values of the input

                                    return d.amount;

                                })])
                                .range([0, chartWidth]); //takes array as input with starting and ending values of the output to draw
                        chart.attr('height', chartHeight);

                        chart.selectAll('myBars')
                            .data(data)
                            .enter()
                            .append('rect')
                            .attr('height', barHeight)
                            .attr('x', graphOrigin)
                            .attr('y', function (d, i) {
                                return i * (barHeight + barGap);
                            })
                            .attr('fill', function (d) {
                                return color(d.amount);
                            })
                            .attr('width', function (d) {
                                return xScale(d.amount);
                            });

                        chart.selectAll('categoryLabel')
                            .data(data)
                            .enter()
                            .append('text')
                            .attr('fill', '#fff')
                            .attr('y', function (d, i) {
                                return i * (barHeight + barGap) + 15;
                            })
                            .attr('x', (graphOrigin - 5)) //display labels to the left of the graph
                            .attr('text-anchor', 'end') //align text to the right
                            .text(function (d) {
                                return d.category;
                            });

                        chart.selectAll('values')
                            .data(data)
                            .enter()
                            .append('text')
                            .attr('fill', '#fff')
                            .attr('y', function (d, i) {
                                return i * (barHeight + barGap) + 15;
                            })
                            .attr('x', (graphOrigin + 5))
                            .attr('text-anchor', 'start')
                            .text(function (d) {
                                return d.amount;
                            });



                    };
                    scope.drawGraph(scope.data);
                    //if the window has been resized, we will redraw and update the graph
                    $window.onresize = function () {
                        scope.$apply(scope.drawGraph(scope.data));
                    };

                },
                template: '<div id="chart"></div>'
            };
        }
    ]);


