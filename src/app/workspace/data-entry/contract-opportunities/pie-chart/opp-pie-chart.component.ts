import { Component, Input } from '@angular/core';
import * as d3 from 'd3';
import * as _ from 'lodash'

@Component({
    selector: 'opp-pie-chart',
    template: '<div id="visualization"></div>',
  })
  export class OppPieChartComponent {
    @Input() deadlineStatusData : any;
    
    initLoad : boolean = true;

    constructor() {
    }
    ngOnInit(){
    }

    updateChart(){
        d3.select("#visualization svg").remove();
        let visualizationData = null;
        
        if(!_.isEmpty(this.deadlineStatusData)){
            visualizationData = this.prepareVisualizationData(this.deadlineStatusData);
        }
        if(visualizationData){
          this.createVisualization(visualizationData);
        }
    }

    sumDataFromLabels(labels, data){
        let total = 0;
        _.forEach(labels, function(label){
            total += data[label];
        });
        return total;
    }

    prepareVisualizationData(data){
        let labels = ['within_week', 'outside_week'];
        let percentages = {};
        if(data){
            let total = this.sumDataFromLabels(labels, data);
            if(total > 0){
                _.forEach(data, function(value, key){
                    percentages[key] = Math.floor(100 * (value / total));
                });
                return labels.map(function(label){
                    let display_label = '';
                    switch(label){
                        case 'within_week':
                            display_label = 'Active < 7,' + percentages[label]+'%';
                            break;
                        case 'outside_week':
                            display_label = 'Active > 7,' + percentages[label]+'%';
                            break;
                    }
                    return { label: display_label, value: percentages[label] }
                });
            }else{
                return null;
            }
        }else{
            console.error('Chart data not provided.');
        }
        
    }

    createVisualization(data){
        var svg = d3.select("#visualization")
            .append("svg")
                .style("width", "100%")
                .style("height", "180px")
            .append("g")

        svg.append("g")
            .attr("class", "slices");
        svg.append("g")
            .attr("class", "labels");
        svg.append("g")
            .attr("class", "lines");

        var width = 350,
            height = 150,
            radius = Math.min(width, height) / 2;

        var pie = d3.pie()
            .sort(null)
            .value(function(d) {
                return d.value;
            });

        var arc = d3.arc()
            .outerRadius(radius * 0.8)
            .innerRadius(radius * 0.4);

        var outerArc = d3.arc()
            .innerRadius(radius * 0.9)
            .outerRadius(radius * 0.9);

        svg.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

        var key = function(d){ return d.data.label; };

        var color = d3.scaleOrdinal()
            .range(["#0071bc", "112e51"]);
        
        if(this.initLoad){
            change(data);
            this.initLoad = false;
        }   
        change(data);

        function change(data) {
            /* ------- PIE SLICES -------*/
            var slice = svg.select(".slices").selectAll("path.slice")
                .data(pie(data), key);

            slice.enter()
                .insert("path")
                .style("fill", function(d) {return color(d.data.label); })
                .style("stroke-width", "1px")
                .style("stroke", "white")
                .attr("class", "slice");

            slice.transition().duration(1000)
                .attrTween("d", function(d) {
                    this._current = this._current || d;
                    var interpolate = d3.interpolate(this._current, d);
                    this._current = interpolate(0);
                    return function(t) {
                        return arc(interpolate(t));
                    };
                })

            slice.exit()
                .remove();

            /* ------- TEXT LABELS -------*/

            var text = svg.select(".labels").selectAll("text")
                .data(pie(data), key);

            text.enter()
                .append("text")
                .style("font-size", "1.2rem")  
                .each(function (d) {
                var arr = d.data.label.split(",");
                if (arr != undefined) {
                    for (var i = 0; i < arr.length; i++) {
                        d3.select(this).append("tspan")
                            .text(arr[i])
                            .attr("dy", i ? "1.1em" : 0)
                            .attr("x", 0);
                    }
                }
            });

            function midAngle(d){
                return d.startAngle + (d.endAngle - d.startAngle)/2;
            }

            text.transition().duration(1000)
                .attrTween("transform", function(d) {
                    this._current = this._current || d;
                    var interpolate = d3.interpolate(this._current, d);
                    this._current = interpolate(0);
                    return function(t) {
                        var d2 = interpolate(t);
                        var pos = outerArc.centroid(d2);
                        pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
                        return "translate("+ pos +")";
                    };
                })
                .styleTween("text-anchor", function(d){
                    this._current = this._current || d;
                    var interpolate = d3.interpolate(this._current, d);
                    this._current = interpolate(0);
                    return function(t) {
                        var d2 = interpolate(t);
                        return midAngle(d2) < Math.PI ? "start":"end";
                    };
                });

            text.exit()
                .remove();

            /* ------- SLICE TO TEXT POLYLINES -------*/

            var polyline = svg.select(".lines").selectAll("polyline")
                .data(pie(data), key);

            polyline.enter()
                .append("polyline")
                .style("fill", "none")
                .style("stroke", "black")
                .style("stroke-width", "2px")
                .style("opacity", "0.3");

            polyline.transition().duration(1000)
                .attrTween("points", function(d){
                    this._current = this._current || d;
                    var interpolate = d3.interpolate(this._current, d);
                    this._current = interpolate(0);
                    return function(t) {
                        var d2 = interpolate(t);
                        var pos = outerArc.centroid(d2);
                        pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
                        return [arc.centroid(d2), outerArc.centroid(d2), pos];
                    };			
                });

            polyline.exit()
                .remove();
        };
  }
}
